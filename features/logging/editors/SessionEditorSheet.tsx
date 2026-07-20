"use client";

import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { ExerciseDetailTabs } from "@/features/exercises/components/ExerciseDetailTabs";
import { ExercisePickerSheet } from "@/features/exercises/components/ExercisePickerSheet";
import { CARDIO } from "@/features/exercises/library/library";
import { AlertDialog } from "@/shared/ui/AlertDialog";
import { Chip } from "@/shared/ui/Chip";
import { SetBlock, type DraftExercise, type DraftSet } from "@/shared/ui/SetBlock";
import { SheetHeader } from "@/shared/ui/SheetHeader";
import { useSheet } from "@/shared/ui/SheetHost";

const INTENSITIES = ["Easy (conversational)", "Moderate", "Hard"];

function hasValue(s: DraftSet): boolean {
  return Boolean(s.reps || s.weight || s.min);
}

/** Edits an already-saved session in place — reuses the same `SetBlock` and
 * `ExercisePickerSheet` the live logging flow and routine editor use, but
 * saves via `updateStrengthSession`/`updateCardioSession` instead of
 * inserting a new session. */
export function SessionEditorSheet({ session }: { session: Doc<"sessions"> }) {
  const { push, pop } = useSheet();
  const updateStrengthSession = useMutation(api.logging.updateStrengthSession);
  const updateCardioSession = useMutation(api.logging.updateCardioSession);

  const [exercises, setExercises] = useState<DraftExercise[]>(() =>
    (session.exercises ?? []).map((ex) => ({
      ...ex,
      sets: ex.sets.map((s) => ({ ...s })),
    }))
  );
  const [cardioType, setCardioType] = useState(session.cardioType ?? CARDIO[0]);
  const [duration, setDuration] = useState(String(session.duration ?? ""));
  const [intensity, setIntensity] = useState(session.intensity ?? INTENSITIES[0]);
  const [notes, setNotes] = useState(session.notes ?? "");
  const [alert, setAlert] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function updateExercise(i: number, next: DraftExercise) {
    setExercises((exs) => exs.map((ex, idx) => (idx === i ? next : ex)));
  }
  function removeExercise(i: number) {
    setExercises((exs) => exs.filter((_, idx) => idx !== i));
  }
  function openPicker() {
    push(
      "exercise-picker",
      <ExercisePickerSheet
        onPick={({ name, cardio }) => {
          const sets: DraftSet[] = cardio ? [{ min: "" }] : [{ weight: "", reps: "" }];
          setExercises((exs) => [...exs, { name, cardio, sets }]);
        }}
      />
    );
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      if (session.type === "strength") {
        const cleaned = exercises
          .map((ex) => ({ ...ex, sets: ex.sets.filter(hasValue) }))
          .filter((ex) => ex.sets.length > 0);
        if (cleaned.length === 0) {
          setAlert("Add at least one set.");
          return;
        }
        await updateStrengthSession({ id: session._id, exercises: cleaned, notes });
      } else {
        await updateCardioSession({
          id: session._id,
          cardioType,
          duration: Number(duration) || 0,
          intensity,
          notes,
        });
      }
      pop();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4">
      <SheetHeader title="Edit workout" onClose={pop} />

      {session.type === "strength" ? (
        <>
          {exercises.length === 0 && (
            <div className="py-8 text-center text-[14px] text-muted-2">
              <span className="mb-1.5 block text-lg font-bold text-muted">
                No exercises yet.
              </span>
              Add one to get started.
            </div>
          )}

          {exercises.map((ex, i) => (
            <SetBlock
              key={i}
              exercise={ex}
              mode="log"
              onChange={(next) => updateExercise(i, next)}
              onRemove={() => removeExercise(i)}
              onOpenDetail={() =>
                push("exercise-detail", <ExerciseDetailTabs name={ex.name} onBack={pop} />)
              }
            />
          ))}

          <button
            type="button"
            onClick={openPicker}
            className="w-full rounded-2xl bg-surface py-4 text-[15.5px] font-bold text-blue"
          >
            + Add exercise
          </button>
        </>
      ) : (
        <>
          <div className="mb-4">
            <label className="mb-2 block text-[12.5px] font-semibold text-muted">
              What are you doing?
            </label>
            <div className="flex flex-wrap gap-2">
              {CARDIO.map((c) => (
                <Chip key={c} active={c === cardioType} onClick={() => setCardioType(c)}>
                  {c}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-[12.5px] font-semibold text-muted">
              Duration (minutes)
            </label>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-base text-ink outline-none focus:border-blue"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-[12.5px] font-semibold text-muted">
              Intensity
            </label>
            <div className="flex flex-wrap gap-2">
              {INTENSITIES.map((l) => (
                <Chip key={l} small active={l === intensity} onClick={() => setIntensity(l)}>
                  {l}
                </Chip>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mt-2 mb-4">
        <label className="mb-1.5 block text-[12.5px] font-semibold text-muted">
          Note (optional)
        </label>
        <textarea
          placeholder="How did it go? Add a note…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-18.5 w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-base text-ink outline-none focus:border-blue"
        />
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="w-full rounded-2xl bg-blue py-4 text-[15.5px] font-bold text-white disabled:opacity-50"
      >
        Save
      </button>

      <AlertDialog open={alert !== null} message={alert ?? ""} onClose={() => setAlert(null)} />
    </div>
  );
}
