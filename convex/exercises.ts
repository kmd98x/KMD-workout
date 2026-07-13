import { getAuthUserId } from "@convex-dev/auth/server";
import { v, type Infer } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { requireUserId } from "./lib/auth";

export const listCustomExercises = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("customExercises")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const createCustomExercise = mutation({
  args: { name: v.string(), primaryMuscle: v.string() },
  handler: async (ctx, { name, primaryMuscle }) => {
    const userId = await requireUserId(ctx);
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Exercise name is required.");
    const existing = await ctx.db
      .query("customExercises")
      .withIndex("by_user_name", (q) => q.eq("userId", userId).eq("name", trimmed))
      .unique();
    if (existing) return existing._id;
    return ctx.db.insert("customExercises", {
      userId,
      name: trimmed,
      primaryMuscle,
      createdAt: Date.now(),
    });
  },
});

/** Hard cap on how many of the user's most recent sessions a single history
 * scan will read, so a heavy user can't turn this into an unbounded read. */
const HISTORY_SCAN_CAP = 300;

const historySet = v.object({
  weight: v.optional(v.string()),
  reps: v.optional(v.string()),
  min: v.optional(v.string()),
  done: v.optional(v.boolean()),
  warmup: v.optional(v.boolean()),
});

export type ExerciseHistoryMatch = {
  sessionId: Id<"sessions">;
  ts: number;
  routineName?: string;
  cardio: boolean;
  sets: Infer<typeof historySet>[];
};

/** Shared bounded scan for one exercise name, used by `getExerciseHistory`
 * and reused (rather than re-scanned) by progress.ts's `strengthPerExercise`
 * so a user viewing their Progress tab doesn't pay for two separate walks
 * over the same session history. */
export async function scanExerciseHistory(
  ctx: QueryCtx,
  userId: Id<"users">,
  name: string,
  limit = 60
): Promise<{ matches: ExerciseHistoryMatch[]; scannedAll: boolean }> {
  const sessions = await ctx.db
    .query("sessions")
    .withIndex("by_user_ts", (q) => q.eq("userId", userId))
    .order("desc")
    .take(HISTORY_SCAN_CAP + 1);
  const hitScanCap = sessions.length > HISTORY_SCAN_CAP;
  const scanned = hitScanCap ? sessions.slice(0, HISTORY_SCAN_CAP) : sessions;

  const matches: ExerciseHistoryMatch[] = [];
  let stoppedEarly = false;
  for (const s of scanned) {
    if (matches.length >= limit) {
      stoppedEarly = true;
      break;
    }
    if (s.type === "strength" && s.exercises) {
      for (const ex of s.exercises) {
        if (ex.name !== name) continue;
        matches.push({
          sessionId: s._id,
          ts: s.ts,
          routineName: s.routineName,
          cardio: ex.cardio,
          sets: ex.sets,
        });
      }
    } else if (s.type === "cardio" && s.cardioType === name) {
      // Dedicated "Log cardio" sessions store duration/type on the
      // session itself rather than a nested exercises array; fold them
      // into the same shape so this exercise's history is complete.
      matches.push({
        sessionId: s._id,
        ts: s.ts,
        cardio: true,
        sets: [{ min: String(s.duration ?? 0), done: true }],
      });
    }
  }

  return { matches, scannedAll: !hitScanCap && !stoppedEarly };
}

export const getExerciseHistory = query({
  args: { name: v.string(), limit: v.optional(v.number()) },
  returns: v.object({
    matches: v.array(
      v.object({
        sessionId: v.id("sessions"),
        ts: v.number(),
        routineName: v.optional(v.string()),
        cardio: v.boolean(),
        sets: v.array(historySet),
      })
    ),
    scannedAll: v.boolean(),
  }),
  handler: async (ctx, { name, limit }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { matches: [], scannedAll: true };
    return scanExerciseHistory(ctx, userId, name, limit ?? 60);
  },
});

export const listAllLoggedExerciseNames = query({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user_ts", (q) => q.eq("userId", userId))
      .order("desc")
      .take(HISTORY_SCAN_CAP);
    const names = new Set<string>();
    for (const s of sessions) {
      if (s.type === "strength" && s.exercises) {
        for (const ex of s.exercises) names.add(ex.name);
      } else if (s.type === "cardio" && s.cardioType) {
        names.add(s.cardioType);
      }
    }
    return [...names].sort();
  },
});
