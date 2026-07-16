"use client";

import { useMutation, usePreloadedQuery, useQuery, type Preloaded } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { ExerciseThumb } from "@/features/exercises/components/ExerciseThumb";
import { MusclePanel } from "@/features/exercises/components/MusclePanel";
import { formatDuration, formatFullDate } from "@/shared/lib/date";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { BackIcon, TrashIcon } from "@/shared/ui/icons";
import { SetTable } from "@/shared/ui/SetTable";

export function SessionDetail({
  preloaded,
}: {
  preloaded: Preloaded<typeof api.logging.getSession>;
}) {
  const session = usePreloadedQuery(preloaded);
  const customExercises = useQuery(api.exercises.listCustomExercises) ?? [];
  const deleteSession = useMutation(api.logging.deleteSession);
  const router = useRouter();

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (!session) {
    return (
      <div className="pt-10 text-center text-sm text-muted-2">
        Session not found.
      </div>
    );
  }

  const customByName = Object.fromEntries(
    customExercises.map((c) => [c.name, { primaryMuscle: c.primaryMuscle }])
  );
  const title =
    session.type === "strength"
      ? (session.routineName ?? "Workout")
      : (session.cardioType ?? "Cardio");
  const hasMuscleData =
    session.type === "strength" &&
    (session.exercises ?? []).some((ex) => !ex.cardio);

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-2 -ml-1.5 flex items-center gap-1 rounded-lg px-1.5 py-2 text-[15px] font-semibold text-muted"
      >
        <BackIcon />
        Back
      </button>

      <div className="mb-1 flex items-center justify-between gap-3">
        <h1 className="text-[24px] font-extrabold tracking-tight">{title}</h1>
        <button
          type="button"
          aria-label="Delete session"
          onClick={() => setConfirmingDelete(true)}
          className="shrink-0 rounded-lg p-3 text-danger cursor-pointer"
        >
          <TrashIcon />
        </button>
      </div>
      <div className="mb-5 text-[13px] text-muted-2">
        {formatFullDate(session.ts)}
        {session.durationSec ? ` · ${formatDuration(session.durationSec)}` : ""}
      </div>

      {session.type === "strength" ? (
        (session.exercises ?? []).map((ex, i) => (
          <div key={i} className="mb-6">
            <button
              type="button"
              onClick={() => router.push(`/exercises/${encodeURIComponent(ex.name)}`)}
              className="mb-2 flex items-center gap-3"
            >
              <ExerciseThumb name={ex.name} />
              <span className="text-[15.5px] font-bold tracking-tight">
                {ex.name}
              </span>
            </button>
            <SetTable sets={ex.sets} cardio={ex.cardio} />
          </div>
        ))
      ) : (
        <div className="mb-6 rounded-card bg-surface p-4">
          <button
            type="button"
            onClick={() =>
              router.push(`/exercises/${encodeURIComponent(session.cardioType ?? "")}`)
            }
            className="mb-2 flex items-center gap-3"
          >
            <ExerciseThumb name={session.cardioType ?? ""} />
            <span className="text-[15.5px] font-bold tracking-tight">
              {session.cardioType}
            </span>
          </button>
          <div className="text-[14px] text-ink">
            {session.duration} min ·{" "}
            {(session.intensity ?? "").replace(" (conversational)", "")}
          </div>
        </div>
      )}

      {session.notes && (
        <>
          <div className="mb-2 text-[12.5px] font-bold uppercase tracking-wide text-muted">
            Note
          </div>
          <p className="mb-6 text-[14px] leading-snug text-muted">
            {session.notes}
          </p>
        </>
      )}

      {hasMuscleData && (
        <>
          <div className="mb-3 text-[12.5px] font-bold uppercase tracking-wide text-muted">
            Muscles worked
          </div>
          <MusclePanel
            exercises={session.exercises ?? []}
            customExercisesByName={customByName}
          />
        </>
      )}

      <ConfirmDialog
        open={confirmingDelete}
        danger
        message={`Delete "${title}"?`}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={async () => {
          setConfirmingDelete(false);
          await deleteSession({ id: session._id });
          router.back();
        }}
      />
    </div>
  );
}
