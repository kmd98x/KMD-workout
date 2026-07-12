"use client";

import { ExerciseThumb } from "@/features/exercises/components/ExerciseThumb";
import { CheckIcon, ClockIcon } from "./icons";

export type DraftSet = {
  weight?: string;
  reps?: string;
  min?: string;
  done?: boolean;
};
export type DraftExercise = { name: string; cardio: boolean; sets: DraftSet[] };

/**
 * Shared set-editing block: per-exercise thumbnail/name/remove header, a
 * grid of set rows (weight+reps, or minutes for cardio), a done-toggle and
 * delete button per row, and "+ Set". Used unmodified by both the routine
 * editor ("routine" mode: target sets, no "last time" reference) and live
 * logging ("log" mode: actual sets, "last time" reference from the most
 * recent past session with this exercise). Pure prop-driven — no data
 * fetching — so it has no feature of its own and lives in shared/ui.
 */
export function SetBlock({
  exercise,
  mode,
  previousSets,
  onChange,
  onRemove,
  onOpenDetail,
}: {
  exercise: DraftExercise;
  mode: "routine" | "log";
  /** Most recent completed sets for this exercise, for the "last time"
   * reference line and input placeholders. `null` = checked, no history
   * yet. `undefined` = not applicable (e.g. routine editor). */
  previousSets?: DraftSet[] | null;
  onChange: (next: DraftExercise) => void;
  onRemove: () => void;
  onOpenDetail?: () => void;
}) {
  function updateSet(i: number, patch: Partial<DraftSet>) {
    const sets = exercise.sets.map((s, idx) =>
      idx === i ? { ...s, ...patch } : s
    );
    onChange({ ...exercise, sets });
  }
  function removeSet(i: number) {
    onChange({ ...exercise, sets: exercise.sets.filter((_, idx) => idx !== i) });
  }
  function addSet() {
    const blank: DraftSet = exercise.cardio
      ? { min: "", done: false }
      : { weight: "", reps: "", done: false };
    onChange({ ...exercise, sets: [...exercise.sets, blank] });
  }
  function toggleDone(i: number) {
    updateSet(i, { done: !exercise.sets[i].done });
  }

  const checkButtonClass = (done?: boolean) =>
    `flex h-8 w-8 items-center justify-center rounded-[9px] border-[1.6px] ${
      done ? "border-green bg-green text-[#04310F]" : "border-line text-muted-2"
    }`;

  return (
    <div className="mb-3 rounded-card bg-surface p-4">
      <div className="mb-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenDetail}
          disabled={!onOpenDetail}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <ExerciseThumb name={exercise.name} />
          <span className="truncate text-[15.5px] font-bold tracking-tight">
            {exercise.name}
          </span>
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="px-1.5 text-[19px] leading-none text-muted-2"
          aria-label={`Remove ${exercise.name}`}
        >
          &times;
        </button>
      </div>

      {mode === "log" && !exercise.cardio && previousSets !== undefined && (
        <div className="-mt-0.5 mb-2.5 ml-12.5 text-[11.5px] text-muted-2">
          {previousSets && previousSets.length > 0
            ? `Last time: ${previousSets
                .map((s) => `${s.weight || 0}kg×${s.reps || 0}`)
                .join("  ")}`
            : "First time with this exercise"}
        </div>
      )}

      {exercise.cardio ? (
        <>
          <div className="mb-1.5 grid grid-cols-[24px_1fr_32px_22px] gap-2 px-0.5 text-[10.5px] font-bold uppercase tracking-wide text-muted-2">
            <span className="text-center">Set</span>
            <span className="text-center">Minutes</span>
            <span />
            <span />
          </div>
          {exercise.sets.map((s, i) => (
            <div
              key={i}
              className="mb-1.5 grid grid-cols-[24px_1fr_32px_22px] items-center gap-2"
            >
              <div className="text-center text-xs font-bold text-muted-2">
                {i + 1}
              </div>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="min"
                value={s.min ?? ""}
                onChange={(e) => updateSet(i, { min: e.target.value })}
                className="rounded-xl border border-surface-2 bg-surface-2 px-2 py-2.5 text-center text-[15px] text-ink outline-none focus:border-blue"
              />
              <button
                type="button"
                onClick={() => toggleDone(i)}
                className={checkButtonClass(s.done)}
              >
                <CheckIcon />
              </button>
              <button
                type="button"
                onClick={() => removeSet(i)}
                className="text-lg text-muted-2"
                aria-label="Remove set"
              >
                &minus;
              </button>
            </div>
          ))}
          {exercise.name === "StairMaster" && (
            <div className="mt-3 flex gap-3 rounded-card border border-line bg-surface p-4 text-[13.5px] leading-snug text-muted">
              <ClockIcon />
              <span>
                Around 20–30 min at a conversational pace keeps stress low.
                Feeling wound up rather than tired? It&rsquo;s fine to stop
                earlier.
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-1.5 grid grid-cols-[24px_1fr_1fr_32px_22px] gap-2 px-0.5 text-[10.5px] font-bold uppercase tracking-wide text-muted-2">
            <span className="text-center">Set</span>
            <span className="text-center">Kg</span>
            <span className="text-center">Reps</span>
            <span />
            <span />
          </div>
          {exercise.sets.map((s, i) => {
            const prevS = previousSets?.[i];
            return (
              <div
                key={i}
                className="mb-1.5 grid grid-cols-[24px_1fr_1fr_32px_22px] items-center gap-2"
              >
                <div className="text-center text-xs font-bold text-muted-2">
                  {i + 1}
                </div>
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  placeholder={prevS?.weight ?? "–"}
                  value={s.weight ?? ""}
                  onChange={(e) => updateSet(i, { weight: e.target.value })}
                  className={`rounded-xl border px-2 py-2.5 text-center text-[15px] text-ink outline-none focus:border-blue ${
                    s.done ? "border-green/30 bg-green/10" : "border-surface-2 bg-surface-2"
                  }`}
                />
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder={prevS?.reps ?? (mode === "routine" ? "10" : "–")}
                  value={s.reps ?? ""}
                  onChange={(e) => updateSet(i, { reps: e.target.value })}
                  className={`rounded-xl border px-2 py-2.5 text-center text-[15px] text-ink outline-none focus:border-blue ${
                    s.done ? "border-green/30 bg-green/10" : "border-surface-2 bg-surface-2"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => toggleDone(i)}
                  className={checkButtonClass(s.done)}
                >
                  <CheckIcon />
                </button>
                <button
                  type="button"
                  onClick={() => removeSet(i)}
                  className="text-lg text-muted-2"
                  aria-label="Remove set"
                >
                  &minus;
                </button>
              </div>
            );
          })}
        </>
      )}

      <button
        type="button"
        onClick={addSet}
        className="mt-1 w-full rounded-[10px] bg-surface-2 py-2.5 text-[13px] font-bold text-blue"
      >
        + Set
      </button>
    </div>
  );
}
