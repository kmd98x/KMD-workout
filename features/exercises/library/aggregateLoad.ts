import { exInfo, type CustomExerciseInfo } from "./exInfo";

type SetLike = { weight?: string; reps?: string; min?: string };
type ExerciseLike = { name: string; cardio: boolean; sets: SetLike[] };

/**
 * The "effective sets" model: each logged/planned set contributes 1.0 to
 * every primary muscle and 0.5 to every secondary muscle. Powers the
 * "muscles worked" panel (routine/session/summary) and the Statistics
 * tab's weekly set totals per muscle group.
 */
export function aggregateLoad(
  exercises: ExerciseLike[],
  customExercisesByName: Record<string, CustomExerciseInfo> = {}
): Record<string, number> {
  const eff: Record<string, number> = {};
  for (const ex of exercises) {
    if (ex.cardio) continue;
    const info = exInfo(ex.name, customExercisesByName);
    if (!info) continue;
    let setCount = ex.sets.filter((x) => x.reps || x.weight).length;
    if (setCount === 0) setCount = ex.sets.length || 1;
    for (const id of info.p) eff[id] = (eff[id] ?? 0) + 1.0 * setCount;
    for (const id of info.s) eff[id] = (eff[id] ?? 0) + 0.5 * setCount;
  }
  return eff;
}
