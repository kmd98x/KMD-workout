import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query, type MutationCtx } from "./_generated/server";
import { requireUserId } from "./lib/auth";

const strengthSetTarget = v.object({
  weight: v.optional(v.string()),
  reps: v.optional(v.string()),
  min: v.optional(v.string()),
});

const routineExercise = v.object({
  name: v.string(),
  cardio: v.boolean(),
  sets: v.array(strengthSetTarget),
});

/** Case-insensitive match-or-create against the user's folders, from a
 * free-text name (or none, for "no folder"). Mirrors the prototype's
 * `resolveFolder`. */
async function resolveFolder(
  ctx: MutationCtx,
  userId: Id<"users">,
  name: string | undefined
): Promise<Id<"folders"> | undefined> {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return undefined;
  const existing = await ctx.db
    .query("folders")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();
  const match = existing.find(
    (f) => f.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (match) return match._id;
  return ctx.db.insert("folders", {
    userId,
    name: trimmed,
    collapsed: false,
    createdAt: Date.now(),
  });
}

export const listFoldersAndRoutines = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { folders: [], routines: [] };
    const [folders, routines] = await Promise.all([
      ctx.db
        .query("folders")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("routines")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
    ]);
    return { folders, routines };
  },
});

export const getRoutine = query({
  args: { id: v.id("routines") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const routine = await ctx.db.get(id);
    if (!routine || routine.userId !== userId) return null;
    return routine;
  },
});

export const createFolder = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const userId = await requireUserId(ctx);
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Give your folder a name.");
    return ctx.db.insert("folders", {
      userId,
      name: trimmed,
      collapsed: false,
      createdAt: Date.now(),
    });
  },
});

export const updateFolder = mutation({
  args: { id: v.id("folders"), name: v.optional(v.string()), collapsed: v.optional(v.boolean()) },
  handler: async (ctx, { id, name, collapsed }) => {
    const userId = await requireUserId(ctx);
    const folder = await ctx.db.get(id);
    if (!folder || folder.userId !== userId) throw new Error("Folder not found");
    const patch: { name?: string; collapsed?: boolean } = {};
    if (name !== undefined) {
      const trimmed = name.trim();
      if (!trimmed) throw new Error("Give your folder a name.");
      patch.name = trimmed;
    }
    if (collapsed !== undefined) patch.collapsed = collapsed;
    await ctx.db.patch(id, patch);
  },
});

export const deleteFolder = mutation({
  args: { id: v.id("folders") },
  handler: async (ctx, { id }) => {
    const userId = await requireUserId(ctx);
    const folder = await ctx.db.get(id);
    if (!folder || folder.userId !== userId) throw new Error("Folder not found");
    const members = await ctx.db
      .query("routines")
      .withIndex("by_user_folder", (q) =>
        q.eq("userId", userId).eq("folderId", id)
      )
      .collect();
    for (const routine of members) {
      await ctx.db.patch(routine._id, { folderId: undefined });
    }
    await ctx.db.delete(id);
  },
});

export const createRoutine = mutation({
  args: {
    name: v.string(),
    folderName: v.optional(v.string()),
    exercises: v.array(routineExercise),
  },
  handler: async (ctx, { name, folderName, exercises }) => {
    const userId = await requireUserId(ctx);
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Give your routine a name.");
    if (exercises.length === 0) throw new Error("Add at least one exercise.");
    const folderId = await resolveFolder(ctx, userId, folderName);
    const now = Date.now();
    return ctx.db.insert("routines", {
      userId,
      name: trimmed,
      folderId,
      exercises,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateRoutine = mutation({
  args: {
    id: v.id("routines"),
    name: v.string(),
    folderName: v.optional(v.string()),
    exercises: v.array(routineExercise),
  },
  handler: async (ctx, { id, name, folderName, exercises }) => {
    const userId = await requireUserId(ctx);
    const routine = await ctx.db.get(id);
    if (!routine || routine.userId !== userId) throw new Error("Routine not found");
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Give your routine a name.");
    if (exercises.length === 0) throw new Error("Add at least one exercise.");
    const folderId = await resolveFolder(ctx, userId, folderName);
    await ctx.db.patch(id, {
      name: trimmed,
      folderId,
      exercises,
      updatedAt: Date.now(),
    });
  },
});

export const deleteRoutine = mutation({
  args: { id: v.id("routines") },
  handler: async (ctx, { id }) => {
    const userId = await requireUserId(ctx);
    const routine = await ctx.db.get(id);
    if (!routine || routine.userId !== userId) throw new Error("Routine not found");
    await ctx.db.delete(id);
  },
});
