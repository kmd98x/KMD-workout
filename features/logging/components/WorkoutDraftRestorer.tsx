"use client";

import { useEffect, useRef } from "react";
import { useActiveWorkout } from "../context/ActiveWorkoutContext";
import { loadWorkoutDraft } from "../lib/workoutDraft";
import { ActiveStrengthScreen } from "./ActiveStrengthScreen";

/**
 * Resumes an in-progress strength workout backed up to localStorage, if the
 * app reloaded/relaunched before it was finished (e.g. the PWA process got
 * killed mid-workout, wiping the in-memory ActiveWorkoutProvider state).
 * Mounted once alongside ActiveWorkoutProvider; renders nothing itself.
 */
export function WorkoutDraftRestorer() {
  const { start } = useActiveWorkout();
  const restored = useRef(false);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const draft = loadWorkoutDraft();
    if (!draft) return;
    start(
      { title: draft.routineName ?? "Workout", startTs: draft.startTs },
      <ActiveStrengthScreen
        routineId={draft.routineId}
        routineName={draft.routineName}
        startTs={draft.startTs}
        initialExercises={draft.exercises}
        initialNotes={draft.notes}
      />
    );
    // Runs once on mount to check for a leftover draft; `start` is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
