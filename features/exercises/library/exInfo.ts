import { EXDATA } from "./exData";

export type ExerciseInfo = {
  /** Primary muscle ids. */
  p: string[];
  /** Secondary muscle ids. */
  s: string[];
  region: string;
  /** Movement pattern (Push/Pull/Hinge/Squat/Isolation/Core/Olympic/Carry). */
  mv: string;
  /** "compound" | "isolation" | "—" */
  t: string;
};

export type CustomExerciseInfo = {
  primaryMuscle: string;
};

/**
 * Looks up an exercise's muscle/region/movement classification: the static
 * library first, falling back to a user's custom exercise — mirrors the
 * prototype's `exInfo()` falling back to `state.customData`. Callers fetch
 * the caller's `customExercises` (a small, cheap `by_user` Convex query)
 * once and pass it in as a name-keyed map; there's no table join.
 */
export function exInfo(
  name: string,
  customExercisesByName: Record<string, CustomExerciseInfo> = {}
): ExerciseInfo | null {
  const d = EXDATA[name];
  if (d) {
    return {
      p: d[0] ? d[0].split(",") : [],
      s: d[1] ? d[1].split(",") : [],
      region: d[2],
      mv: d[3],
      t: d[4],
    };
  }
  const custom = customExercisesByName[name];
  if (custom) {
    return { p: [custom.primaryMuscle], s: [], region: "Custom", mv: "—", t: "—" };
  }
  return null;
}
