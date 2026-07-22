import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const strengthSetTarget = v.object({
  weight: v.optional(v.string()),
  reps: v.optional(v.string()),
  min: v.optional(v.string()),
  warmup: v.optional(v.boolean()),
});

const routineExercise = v.object({
  name: v.string(),
  cardio: v.boolean(),
  sets: v.array(strengthSetTarget),
});

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

export default defineSchema({
  ...authTables,

  // --- workout: folders + routines ---
  folders: defineTable({
    userId: v.id("users"),
    name: v.string(),
    collapsed: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  routines: defineTable({
    userId: v.id("users"),
    name: v.string(),
    folderId: v.optional(v.id("folders")),
    exercises: v.array(routineExercise),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_folder", ["userId", "folderId"]),

  // --- logging: sessions ---
  sessions: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("strength"), v.literal("cardio")),
    ts: v.number(),
    durationSec: v.number(),
    notes: v.optional(v.string()),
    routineName: v.optional(v.string()),
    exercises: v.optional(v.array(loggedExercise)),
    cardioType: v.optional(v.string()),
    duration: v.optional(v.number()),
    intensity: v.optional(v.string()),
  })
    .index("by_user_ts", ["userId", "ts"])
    .index("by_user_routineName", ["userId", "routineName"]),

  // --- logging: denormalized per-user counters (kept in sync on both
  // insert and delete of a session — see logging.ts — since per Convex
  // guidelines, `.collect().length` isn't safe once a table can grow
  // unbounded, so the Progress tab's "total sessions" tile reads this
  // instead of scanning every session) ---
  userStats: defineTable({
    userId: v.id("users"),
    totalSessions: v.number(),
  }).index("by_user", ["userId"]),

  // --- exercises: user-defined custom exercises ---
  customExercises: defineTable({
    userId: v.id("users"),
    name: v.string(),
    primaryMuscle: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_name", ["userId", "name"]),

  // --- stats: body measurements over time (one entry per calendar day) ---
  measurements: defineTable({
    userId: v.id("users"),
    ts: v.number(),
    weight: v.optional(v.number()),
    bust: v.optional(v.number()),
    waist: v.optional(v.number()),
    hips: v.optional(v.number()),
    leftThigh: v.optional(v.number()),
    rightThigh: v.optional(v.number()),
  }).index("by_user_ts", ["userId", "ts"]),

  // --- stats: stable profile fields for derived metrics (e.g. BMI needs
  // height, which doesn't change per-entry the way weight does) ---
  userProfile: defineTable({
    userId: v.id("users"),
    heightCm: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  // --- stats: weekly muscle-group set targets ---
  targets: defineTable({
    userId: v.id("users"),
    group: v.string(),
    min: v.number(),
    max: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_group", ["userId", "group"]),
});
