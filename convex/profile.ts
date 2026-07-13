import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./lib/auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return ctx.db
      .query("userProfile")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const setHeight = mutation({
  args: { heightCm: v.number() },
  handler: async (ctx, { heightCm }) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("userProfile")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { heightCm });
    } else {
      await ctx.db.insert("userProfile", { userId, heightCm });
    }
  },
});
