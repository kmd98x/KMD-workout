import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { query } from "./_generated/server";
import { scanExerciseHistory } from "./exercises";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Progress tab's "rhythm" bar chart: session counts for the 6 weeks
 * ending at (and including) the week containing `currentWeekStartTs`, in
 * one bounded range query over that 42-day window. */
export const weeklyRhythm = query({
  args: { currentWeekStartTs: v.number() },
  returns: v.array(v.object({ weekStartTs: v.number(), count: v.number() })),
  handler: async (ctx, { currentWeekStartTs }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const rangeStart = currentWeekStartTs - 5 * WEEK_MS;
    const rangeEnd = currentWeekStartTs + WEEK_MS;
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user_ts", (q) =>
        q.eq("userId", userId).gte("ts", rangeStart).lt("ts", rangeEnd)
      )
      .collect();

    const weeks = Array.from({ length: 6 }, (_, i) => ({
      weekStartTs: rangeStart + i * WEEK_MS,
      count: 0,
    }));
    for (const s of sessions) {
      const i = Math.floor((s.ts - rangeStart) / WEEK_MS);
      if (i >= 0 && i < weeks.length) weeks[i].count++;
    }
    return weeks;
  },
});

/** Progress tab's "strength per exercise" line chart: best (heaviest)
 * weight logged per session, oldest first. Reuses the same bounded scan as
 * the exercise detail page instead of re-walking session history. */
export const strengthPerExercise = query({
  args: { name: v.string() },
  returns: v.array(v.object({ ts: v.number(), weight: v.number() })),
  handler: async (ctx, { name }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const { matches } = await scanExerciseHistory(ctx, userId, name, 60);

    const bestBySession = new Map<string, { ts: number; weight: number }>();
    for (const m of matches) {
      if (m.cardio) continue;
      let best = 0;
      for (const s of m.sets) {
        const w = Number(s.weight) || 0;
        if (w > best) best = w;
      }
      if (best <= 0) continue;
      const existing = bestBySession.get(m.sessionId);
      if (!existing || best > existing.weight) {
        bestBySession.set(m.sessionId, { ts: m.ts, weight: best });
      }
    }
    return [...bestBySession.values()].sort((a, b) => a.ts - b.ts);
  },
});
