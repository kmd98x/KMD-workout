"use client";

import type { Id } from "@/convex/_generated/dataModel";
import type { DraftExercise } from "@/shared/ui/SetBlock";

const STORAGE_KEY = "activeWorkoutDraft:v1";

export type StrengthWorkoutDraft = {
  kind: "strength";
  routineId?: Id<"routines">;
  routineName?: string;
  startTs: number;
  exercises: DraftExercise[];
  notes: string;
};

/**
 * Backs up the in-progress strength workout to localStorage so it survives
 * a full app reload/relaunch (e.g. the PWA process getting killed
 * mid-workout), not just in-app navigation. `finishStrengthSession` is the
 * source of truth once a workout is actually saved — this is only a
 * recovery net for what hasn't been saved yet.
 */
export function saveWorkoutDraft(draft: StrengthWorkoutDraft) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Private browsing / quota errors: losing the backup is better than
    // crashing the workout screen over it.
  }
}

export function loadWorkoutDraft(): StrengthWorkoutDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StrengthWorkoutDraft;
    return parsed.kind === "strength" ? parsed : null;
  } catch {
    return null;
  }
}

export function clearWorkoutDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
