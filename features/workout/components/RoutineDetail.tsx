"use client";

import { useMutation, usePreloadedQuery, useQuery, type Preloaded } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { ExerciseThumb } from "@/features/exercises/components/ExerciseThumb";
import { MusclePanel } from "@/features/exercises/components/MusclePanel";
import { ActiveStrengthScreen } from "@/features/logging/components/ActiveStrengthScreen";
import { useActiveWorkout } from "@/features/logging/context/ActiveWorkoutContext";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { BackIcon } from "@/shared/ui/icons";
import { useSheet } from "@/shared/ui/SheetHost";
import { SetTable } from "@/shared/ui/SetTable";
import { RoutineEditorSheet } from "../editors/RoutineEditorSheet";
import { RoutineTrendChart } from "./RoutineTrendChart";

export function RoutineDetail({
  preloaded,
}: {
  preloaded: Preloaded<typeof api.workout.getRoutine>;
}) {
  const routine = usePreloadedQuery(preloaded);
  const customExercises = useQuery(api.exercises.listCustomExercises) ?? [];
  const deleteRoutine = useMutation(api.workout.deleteRoutine);
  const { push } = useSheet();
  const { start } = useActiveWorkout();
  const router = useRouter();

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (!routine) {
    return (
      <div className="pt-10 text-center text-sm text-muted-2">
        Routine not found.
      </div>
    );
  }

  const customByName = Object.fromEntries(
    customExercises.map((c) => [c.name, { primaryMuscle: c.primaryMuscle }])
  );

  return (
    <div className="pt-14 md:pt-2">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="fixed top-[calc(env(safe-area-inset-top)+10px)] left-3 z-20 flex items-center gap-1 rounded-full bg-surface/90 px-3 py-2 text-[14px] font-semibold text-muted shadow-md backdrop-blur-md md:static md:top-auto md:left-auto md:z-auto md:mb-2 md:-ml-1.5 md:rounded-lg md:bg-transparent md:px-1.5 md:py-2 md:text-[15px] md:shadow-none md:backdrop-blur-none"
      >
        <BackIcon />
        Workout
      </button>

      <h1 className="mb-4 text-[24px] font-extrabold tracking-tight">
        {routine.name}
      </h1>

      <button
        type="button"
        onClick={() => {
          const startTs = Date.now();
          start(
            { title: routine.name, startTs },
            <ActiveStrengthScreen
              routineName={routine.name}
              startTs={startTs}
              initialExercises={routine.exercises.map((ex) => ({
                ...ex,
                sets: ex.sets.map((s) => ({ ...s, done: false })),
              }))}
            />
          );
        }}
        className="mb-5 w-full rounded-2xl bg-blue py-4 text-[15.5px] font-bold text-white"
      >
        Start routine
      </button>

      <RoutineTrendChart routine={routine} />

      <div className="mb-3 flex items-center justify-between">
        <span className="text-[15px] font-semibold text-muted">Exercises</span>
        <button
          type="button"
          onClick={() =>
            push("routine-editor", <RoutineEditorSheet existing={routine} />)
          }
          className="text-sm font-bold text-blue"
        >
          Edit routine
        </button>
      </div>

      {routine.exercises.map((ex, i) => (
        <div key={i} className="mb-6">
          <button
            type="button"
            onClick={() => router.push(`/exercises/${encodeURIComponent(ex.name)}`)}
            className="mb-2 flex items-center gap-3"
          >
            <ExerciseThumb name={ex.name} />
            <span className="text-[16.5px] font-bold tracking-tight text-blue">
              {ex.name}
            </span>
          </button>
          <SetTable sets={ex.sets} cardio={ex.cardio} />
        </div>
      ))}

      {routine.exercises.length > 0 && (
        <>
          <div className="mt-6 mb-3 text-[12.5px] font-bold uppercase tracking-wide text-muted">
            Muscles trained
          </div>
          <MusclePanel
            exercises={routine.exercises}
            customExercisesByName={customByName}
          />
        </>
      )}

      <button
        type="button"
        onClick={() => setConfirmingDelete(true)}
        className="mx-auto mt-8 block text-[15px] font-semibold text-danger"
      >
        Delete routine
      </button>

      <ConfirmDialog
        open={confirmingDelete}
        danger
        message={`Delete "${routine.name}"?`}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={async () => {
          setConfirmingDelete(false);
          await deleteRoutine({ id: routine._id });
          router.push("/");
        }}
      />
    </div>
  );
}

