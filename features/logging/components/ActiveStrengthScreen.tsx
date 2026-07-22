"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ExerciseDetailTabs } from "@/features/exercises/components/ExerciseDetailTabs";
import { ExercisePickerSheet } from "@/features/exercises/components/ExercisePickerSheet";
import { MusclePanel } from "@/features/exercises/components/MusclePanel";
import { useExerciseHistory } from "@/features/exercises/hooks/useExerciseHistory";
import { formatDuration } from "@/shared/lib/date";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { ChevronDownIcon } from "@/shared/ui/icons";
import { SetBlock, type DraftExercise, type DraftSet } from "@/shared/ui/SetBlock";
import { SheetHeader } from "@/shared/ui/SheetHeader";
import { useSheet } from "@/shared/ui/SheetHost";
import { useActiveWorkout } from "../context/ActiveWorkoutContext";
import { ElapsedTimer } from "./ElapsedTimer";
import { WorkoutSummaryScreen } from "./WorkoutSummaryScreen";

function hasValue(s: DraftSet): boolean {
  return Boolean(s.reps || s.weight || s.min);
}

/** A checked-off set (so it's meant to be done) that's still missing its
 * weight or rep count — a checked box with half-typed data is more likely a
 * stray tap than an intentional bodyweight/no-load set, so this is flagged
 * regardless of how many other sets are checked. Cardio sets have no
 * weight/reps concept, and warm-ups aren't always logged with exact
 * numbers, so neither is held to this. */
function hasIncompleteData(ex: DraftExercise, s: DraftSet): boolean {
  return hasValue(s) && Boolean(s.done) && !ex.cardio && !s.warmup && (!s.reps || !s.weight);
}

export function ActiveStrengthScreen({
  initialExercises,
  routineName,
  startTs,
}: {
  initialExercises: DraftExercise[];
  routineName?: string;
  /** Generated once by the caller when it starts this workout via
   * `useActiveWorkout().start()`, so the mini-bar's timer and this screen's
   * timer read from the same source instead of drifting apart. */
  startTs: number;
}) {
  const { push, pop } = useSheet();
  const { minimize, end } = useActiveWorkout();
  const finishStrengthSession = useMutation(api.logging.finishStrengthSession);
  const updateSessionNotes = useMutation(api.logging.updateSessionNotes);
  const customExercises = useQuery(api.exercises.listCustomExercises) ?? [];

  const [exercises, setExercises] = useState<DraftExercise[]>(initialExercises);
  const [phase, setPhase] = useState<"log" | "summary">("log");
  const [notes, setNotes] = useState("");
  const [sessionId, setSessionId] = useState<Id<"sessions"> | null>(null);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [finishing, setFinishing] = useState(false);
  // Snapshotted once at "Finish" so the summary's displayed duration and the
  // saved duration always match, instead of drifting if the user lingers.
  const [finishedDurationSec, setFinishedDurationSec] = useState(0);

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
          const sets: DraftSet[] = cardio
            ? [{ min: "", done: false }]
            : [{ weight: "", reps: "", done: false }];
          setExercises((exs) => [...exs, { name, cardio, sets }]);
        }}
      />
    );
  }

  async function proceedFinish(current: DraftExercise[]) {
    const cleaned = current
      .map((ex) => ({ ...ex, sets: ex.sets.filter(hasValue) }))
      .filter((ex) => ex.sets.length > 0);
    if (cleaned.length === 0) {
      end();
      return;
    }
    const durationSec = (Date.now() - startTs) / 1000;
    setFinishing(true);
    const id = await finishStrengthSession({
      routineName,
      exercises: cleaned,
      durationSec,
      ts: startTs,
    });
    setExercises(cleaned);
    setFinishedDurationSec(durationSec);
    setSessionId(id);
    setFinishing(false);
    setPhase("summary");
  }

  function handleFinish() {
    if (finishing) return;
    // Only nag when the workout is a *mix* of checked and unchecked sets —
    // finishing with nothing checked at all (e.g. bailing on a routine) or
    // everything checked shouldn't need a confirmation.
    const realSets = exercises.flatMap((ex) => ex.sets.filter(hasValue).map((s) => ({ ex, s })));
    const anyChecked = realSets.some(({ s }) => s.done);
    const anyUnchecked = realSets.some(({ s }) => !s.done);
    const anyIncompleteData = realSets.some(({ ex, s }) => hasIncompleteData(ex, s));
    const incomplete = (anyChecked && anyUnchecked) || anyIncompleteData;
    if (incomplete) {
      setConfirmFinish(true);
      return;
    }
    proceedFinish(exercises);
  }

  function commitNotes() {
    if (sessionId) updateSessionNotes({ id: sessionId, notes });
  }

  if (phase === "summary") {
    let volume = 0;
    let setCount = 0;
    exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.warmup) return;
        if (ex.cardio) {
          if ((Number(s.min) || 0) > 0) setCount++;
        } else {
          const reps = Number(s.reps) || 0;
          const w = Number(s.weight) || 0;
          if (reps > 0) {
            setCount++;
            volume += w * reps;
          }
        }
      });
    });
    const customByName = Object.fromEntries(
      customExercises.map((c) => [c.name, { primaryMuscle: c.primaryMuscle }])
    );
    const hasMuscleData = exercises.some((ex) => !ex.cardio);

    return (
      <WorkoutSummaryScreen
        title={routineName ?? "Workout"}
        stats={[
          { label: "Duration", value: formatDuration(finishedDurationSec), accent: true },
          { label: "Volume", value: `${Math.round(volume * 10) / 10} kg` },
          { label: "Sets", value: `${setCount}` },
        ]}
        muscleSection={
          hasMuscleData ? (
            <MusclePanel exercises={exercises} customExercisesByName={customByName} />
          ) : undefined
        }
        notes={notes}
        onNotesChange={setNotes}
        onNotesBlur={commitNotes}
        onDone={end}
      />
    );
  }

  return (
    <div className="p-4">
      <SheetHeader
        title={routineName ?? "Workout"}
        onClose={end}
        right={
          <>
            <button
              type="button"
              onClick={minimize}
              aria-label="Minimize workout"
              className="flex items-center justify-center p-1.5 text-ink"
            >
              <ChevronDownIcon />
            </button>
            <button
              type="button"
              onClick={handleFinish}
              disabled={finishing}
              className="text-[15px] font-bold text-blue disabled:opacity-50"
            >
              Finish
            </button>
          </>
        }
      />
      <ElapsedTimer startTs={startTs} />

      {exercises.length === 0 && (
        <div className="py-8 text-center text-[14px] text-muted-2">
          <span className="mb-1.5 block text-lg font-bold text-muted">
            No exercises yet.
          </span>
          Add one to get started.
        </div>
      )}

      {exercises.map((ex, i) => (
        <LoggingSetBlock
          key={i}
          exercise={ex}
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

      <ConfirmDialog
        open={confirmFinish}
        message="Some sets aren't checked off, or are missing a weight or rep count. Finish anyway?"
        onCancel={() => setConfirmFinish(false)}
        onConfirm={() => {
          setConfirmFinish(false);
          proceedFinish(exercises);
        }}
      />
    </div>
  );
}

/** Wraps SetBlock with its own bounded exercise-history subscription, so
 * "last time" data loads per exercise without breaking rules-of-hooks when
 * exercises are added/removed from the list above. */
function LoggingSetBlock({
  exercise,
  onChange,
  onRemove,
  onOpenDetail,
}: {
  exercise: DraftExercise;
  onChange: (next: DraftExercise) => void;
  onRemove: () => void;
  onOpenDetail: () => void;
}) {
  const history = useExerciseHistory(exercise.name);
  const previousSets = exercise.cardio
    ? undefined
    : history === undefined
      ? undefined
      : (history.matches[0]?.sets ?? null);

  return (
    <SetBlock
      exercise={exercise}
      mode="log"
      previousSets={previousSets}
      onChange={onChange}
      onRemove={onRemove}
      onOpenDetail={onOpenDetail}
    />
  );
}
