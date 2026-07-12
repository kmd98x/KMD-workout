"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/** Bounded scan of this user's sessions for one exercise name — powers both
 * the exercise detail Summary tab (PR computation) and History tab (every
 * past session with this exercise). Fetched once, both tabs consume it. */
export function useExerciseHistory(name: string) {
  return useQuery(api.exercises.getExerciseHistory, { name });
}
