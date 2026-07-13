"use client";

import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { ExerciseDetailTabs } from "@/features/exercises/components/ExerciseDetailTabs";
import { ExercisePickerSheet } from "@/features/exercises/components/ExercisePickerSheet";
import { AlertDialog } from "@/shared/ui/AlertDialog";
import { SheetHeader } from "@/shared/ui/SheetHeader";
import { useSheet } from "@/shared/ui/SheetHost";
import { SetBlock, type DraftExercise } from "@/shared/ui/SetBlock";

type RoutineDraft = {
  id?: Id<"routines">;
  name: string;
  folderName: string;
  exercises: DraftExercise[];
};

export function RoutineEditorSheet({
  existing,
}: {
  existing?: Doc<"routines"> | null;
}) {
  const { push, pop } = useSheet();
  const data = useQuery(api.workout.listFoldersAndRoutines);
  const createRoutine = useMutation(api.workout.createRoutine);
  const updateRoutine = useMutation(api.workout.updateRoutine);

  const [draft, setDraft] = useState<RoutineDraft>(() => ({
    id: existing?._id,
    name: existing?.name ?? "",
    folderName: "",
    exercises: existing
      ? existing.exercises.map((ex) => ({
          ...ex,
          sets: ex.sets.map((s) => ({ ...s })),
        }))
      : [],
  }));
  const [alert, setAlert] = useState<string | null>(null);
  const [folderMenuOpen, setFolderMenuOpen] = useState(false);
  const folderMatches = (data?.folders ?? []).filter((f) =>
    f.name.toLowerCase().includes(draft.folderName.trim().toLowerCase())
  );

  // The routine's folder is stored as an id; resolve it to a name for the
  // free-text combobox once the folders list has loaded.
  useEffect(() => {
    if (!existing?.folderId || !data) return;
    const folder = data.folders.find((f) => f._id === existing.folderId);
    if (folder) setDraft((d) => ({ ...d, folderName: folder.name }));
  }, [existing?.folderId, data]);

  function updateExercise(index: number, next: DraftExercise) {
    setDraft((d) => ({
      ...d,
      exercises: d.exercises.map((ex, i) => (i === index ? next : ex)),
    }));
  }
  function removeExercise(index: number) {
    setDraft((d) => ({
      ...d,
      exercises: d.exercises.filter((_, i) => i !== index),
    }));
  }
  function openPicker() {
    push(
      "exercise-picker",
      <ExercisePickerSheet
        onPick={({ name, cardio }) => {
          const sets = cardio
            ? [{ min: "" }]
            : [{ weight: "", reps: "" }, { weight: "", reps: "" }, { weight: "", reps: "" }];
          setDraft((d) => ({
            ...d,
            exercises: [...d.exercises, { name, cardio, sets }],
          }));
        }}
      />
    );
  }

  async function save() {
    if (!draft.name.trim()) {
      setAlert("Give your routine a name.");
      return;
    }
    if (draft.exercises.length === 0) {
      setAlert("Add at least one exercise.");
      return;
    }
    if (draft.id) {
      await updateRoutine({
        id: draft.id,
        name: draft.name,
        folderName: draft.folderName,
        exercises: draft.exercises,
      });
    } else {
      await createRoutine({
        name: draft.name,
        folderName: draft.folderName,
        exercises: draft.exercises,
      });
    }
    pop();
  }

  return (
    <div className="p-4">
      <SheetHeader title={draft.id ? "Routine" : "New routine"} onClose={pop} />

      <div className="mb-4">
        <label className="mb-1.5 block text-[12.5px] font-semibold text-muted">
          Routine name
        </label>
        <input
          placeholder="Leg day"
          value={draft.name}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-base text-ink outline-none focus:border-blue"
        />
      </div>

      <div className="relative mb-4">
        <label className="mb-1.5 block text-[12.5px] font-semibold text-muted">
          Folder (optional)
        </label>
        <input
          placeholder="e.g. Push/Pull/Legs — type a new or existing folder"
          value={draft.folderName}
          onChange={(e) => setDraft((d) => ({ ...d, folderName: e.target.value }))}
          onFocus={() => setFolderMenuOpen(true)}
          onBlur={() => setTimeout(() => setFolderMenuOpen(false), 150)}
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-base text-ink outline-none focus:border-blue"
        />
        {folderMenuOpen && folderMatches.length > 0 && (
          <div className="absolute z-10 mt-1.5 max-h-48 w-full overflow-y-auto rounded-xl border border-line bg-surface shadow-lg">
            {folderMatches.map((f) => (
              <button
                key={f._id}
                type="button"
                onClick={() => {
                  setDraft((d) => ({ ...d, folderName: f.name }));
                  setFolderMenuOpen(false);
                }}
                className="block w-full px-3.5 py-2.5 text-left text-[14px] text-ink hover:bg-surface-2"
              >
                {f.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {draft.exercises.length === 0 && (
        <div className="py-8 text-center text-[14px] text-muted-2">
          <span className="mb-1.5 block text-lg font-bold text-muted">
            No exercises yet.
          </span>
          Add exercises and set the target sets and reps for each.
        </div>
      )}

      {draft.exercises.map((ex, i) => (
        <SetBlock
          key={i}
          exercise={ex}
          mode="routine"
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

      <button
        type="button"
        onClick={save}
        className="mt-4 w-full rounded-2xl bg-blue py-4 text-[15.5px] font-bold text-white"
      >
        Save routine
      </button>

      <AlertDialog
        open={alert !== null}
        message={alert ?? ""}
        onClose={() => setAlert(null)}
      />
    </div>
  );
}
