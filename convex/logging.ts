import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { v, type Infer } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query, type MutationCtx } from "./_generated/server";
import { requireUserId } from "./lib/auth";

const loggedSet = v.object({
  weight: v.optional(v.string()),
  reps: v.optional(v.string()),
  min: v.optional(v.string()),
  done: v.optional(v.boolean()),
  warmup: v.optional(v.boolean()),
});

const loggedExercise = v.object({
  name: v.string(),
  cardio: v.boolean(),
  sets: v.array(loggedSet),
  notes: v.optional(v.string()),
});

function hasValue(s: { weight?: string; reps?: string; min?: string }) {
  return Boolean(s.reps || s.weight || s.min);
}

/** Defense in depth: the client already strips empty sets/exercises before
 * showing the summary screen, but the mutation re-strips too. */
function stripEmpty(exercises: Infer<typeof loggedExercise>[]) {
  return exercises
    .map((ex) => ({
      ...ex,
      sets: ex.sets.filter(hasValue),
      notes: ex.notes?.trim() || undefined,
    }))
    .filter((ex) => ex.sets.length > 0);
}

/** Upserts this user's `userStats` counter row. Called once per saved
 * session so `getTotalSessionsCount` never has to scan the sessions table. */
async function incrementSessionCount(ctx: MutationCtx, userId: Id<"users">) {
  const stats = await ctx.db
    .query("userStats")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();
  if (stats) {
    await ctx.db.patch(stats._id, { totalSessions: stats.totalSessions + 1 });
  } else {
    await ctx.db.insert("userStats", { userId, totalSessions: 1 });
  }
}

export const finishStrengthSession = mutation({
  args: {
    routineName: v.optional(v.string()),
    exercises: v.array(loggedExercise),
    durationSec: v.number(),
    notes: v.optional(v.string()),
    ts: v.number(),
  },
  handler: async (ctx, { routineName, exercises, durationSec, notes, ts }) => {
    const userId = await requireUserId(ctx);
    const cleaned = stripEmpty(exercises);
    if (cleaned.length === 0) throw new Error("Nothing to save.");
    const id = await ctx.db.insert("sessions", {
      userId,
      type: "strength",
      ts,
      durationSec,
      notes: notes?.trim() || undefined,
      routineName,
      exercises: cleaned,
    });
    await incrementSessionCount(ctx, userId);
    return id;
  },
});

export const finishCardioSession = mutation({
  args: {
    cardioType: v.string(),
    duration: v.number(),
    intensity: v.string(),
    notes: v.optional(v.string()),
    ts: v.number(),
  },
  handler: async (ctx, { cardioType, duration, intensity, notes, ts }) => {
    const userId = await requireUserId(ctx);
    const id = await ctx.db.insert("sessions", {
      userId,
      type: "cardio",
      ts,
      durationSec: duration * 60,
      notes: notes?.trim() || undefined,
      cardioType,
      duration,
      intensity,
    });
    await incrementSessionCount(ctx, userId);
    return id;
  },
});

/** Lets the post-finish summary screen persist a note added after the
 * session was already saved (Finish now saves immediately, before notes
 * are typed). */
export const updateSessionNotes = mutation({
  args: { id: v.id("sessions"), notes: v.string() },
  handler: async (ctx, { id, notes }) => {
    const userId = await requireUserId(ctx);
    const session = await ctx.db.get(id);
    if (!session || session.userId !== userId) throw new Error("Session not found");
    await ctx.db.patch(id, { notes: notes.trim() || undefined });
  },
});

/** Lets the session detail screen edit a past strength workout's exercises
 * and note after the fact (e.g. fixing a typo'd weight). */
export const updateStrengthSession = mutation({
  args: {
    id: v.id("sessions"),
    exercises: v.array(loggedExercise),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, exercises, notes }) => {
    const userId = await requireUserId(ctx);
    const session = await ctx.db.get(id);
    if (!session || session.userId !== userId) throw new Error("Session not found");
    if (session.type !== "strength") throw new Error("Not a strength session");
    const cleaned = stripEmpty(exercises);
    if (cleaned.length === 0) throw new Error("Workout needs at least one set.");
    await ctx.db.patch(id, { exercises: cleaned, notes: notes?.trim() || undefined });
  },
});

/** Lets the session detail screen edit a past cardio session's type,
 * duration, intensity, and note after the fact. */
export const updateCardioSession = mutation({
  args: {
    id: v.id("sessions"),
    cardioType: v.string(),
    duration: v.number(),
    intensity: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, cardioType, duration, intensity, notes }) => {
    const userId = await requireUserId(ctx);
    const session = await ctx.db.get(id);
    if (!session || session.userId !== userId) throw new Error("Session not found");
    if (session.type !== "cardio") throw new Error("Not a cardio session");
    await ctx.db.patch(id, {
      cardioType,
      duration,
      durationSec: duration * 60,
      intensity,
      notes: notes?.trim() || undefined,
    });
  },
});

/** Deletes a finished session from history and decrements the denormalized
 * `userStats` counter to match (see schema.ts — sessions are otherwise
 * insert/patch-only, so this is the one path that shrinks the count). */
export const deleteSession = mutation({
  args: { id: v.id("sessions") },
  handler: async (ctx, { id }) => {
    const userId = await requireUserId(ctx);
    const session = await ctx.db.get(id);
    if (!session || session.userId !== userId) throw new Error("Session not found");
    await ctx.db.delete(id);

    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (stats) {
      await ctx.db.patch(stats._id, {
        totalSessions: Math.max(0, stats.totalSessions - 1),
      });
    }
  },
});

export const getSession = query({
  args: { id: v.id("sessions") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const session = await ctx.db.get(id);
    if (!session || session.userId !== userId) return null;
    return session;
  },
});

/** Powers the routine detail trend chart: this routine's most recent
 * sessions, newest first, bounded so a routine logged for years doesn't
 * turn into an unbounded read. */
export const getRoutineSessions = query({
  args: { routineName: v.string() },
  handler: async (ctx, { routineName }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("sessions")
      .withIndex("by_user_routineName", (q) =>
        q.eq("userId", userId).eq("routineName", routineName)
      )
      .order("desc")
      .take(50);
  },
});

/** Progress tab's session history list — newest first, paginated so a
 * long-time user's history doesn't turn into an unbounded read. */
export const listRecentSessions = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { page: [], isDone: true, continueCursor: "" };
    }
    return ctx.db
      .query("sessions")
      .withIndex("by_user_ts", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate(paginationOpts);
  },
});

/** Progress tab's "total sessions" stat tile — reads the denormalized
 * counter instead of scanning the sessions table (see `userStats`). */
export const getTotalSessionsCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    return stats?.totalSessions ?? 0;
  },
});

/** Light, week-bounded query for the Workout home screen's greeting card
 * (sessions-this-week count + which days have a session). */
export const getThisWeekSummary = query({
  args: { weekStartTs: v.number() },
  handler: async (ctx, { weekStartTs }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { count: 0, days: [] as string[] };
    const weekEndTs = weekStartTs + 7 * 24 * 60 * 60 * 1000;
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user_ts", (q) =>
        q.eq("userId", userId).gte("ts", weekStartTs).lt("ts", weekEndTs)
      )
      .collect();
    const days = sessions.map((s) => {
      const d = new Date(s.ts);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    });
    return { count: sessions.length, days };
  },
});
