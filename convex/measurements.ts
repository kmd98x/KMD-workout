import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./lib/auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("measurements")
      .withIndex("by_user_ts", (q) => q.eq("userId", userId))
      .order("desc")
      .take(365);
  },
});

export const upsert = mutation({
  args: {
    ts: v.number(),
    weight: v.optional(v.number()),
    bust: v.optional(v.number()),
    waist: v.optional(v.number()),
    hips: v.optional(v.number()),
    leftThigh: v.optional(v.number()),
    rightThigh: v.optional(v.number()),
  },
  handler: async (ctx, { ts, weight, bust, waist, hips, leftThigh, rightThigh }) => {
    const userId = await requireUserId(ctx);

    const patch: Partial<Doc<"measurements">> = {};
    if (weight !== undefined) patch.weight = weight;
    if (bust !== undefined) patch.bust = bust;
    if (waist !== undefined) patch.waist = waist;
    if (hips !== undefined) patch.hips = hips;
    if (leftThigh !== undefined) patch.leftThigh = leftThigh;
    if (rightThigh !== undefined) patch.rightThigh = rightThigh;
    if (Object.keys(patch).length === 0) {
      throw new Error("Fill in at least one measurement.");
    }

    const existing = await ctx.db
      .query("measurements")
      .withIndex("by_user_ts", (q) => q.eq("userId", userId).eq("ts", ts))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return existing._id;
    }
    return ctx.db.insert("measurements", { userId, ts, ...patch });
  },
});

export const remove = mutation({
  args: { id: v.id("measurements") },
  handler: async (ctx, { id }) => {
    const userId = await requireUserId(ctx);
    const row = await ctx.db.get(id);
    if (!row || row.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(id);
  },
});
