"use client";

import { useState, type ReactNode } from "react";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { SheetHeader } from "@/shared/ui/SheetHeader";

export function WorkoutSummaryScreen({
  title,
  stats,
  muscleSection,
  notes,
  onNotesChange,
  onBack,
  onSave,
  onDiscard,
}: {
  title: string;
  stats: { label: string; value: string; accent?: boolean }[];
  muscleSection?: ReactNode;
  notes: string;
  onNotesChange: (v: string) => void;
  onBack: () => void;
  onSave: () => void;
  onDiscard: () => void;
}) {
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);

  return (
    <div className="p-4">
      <SheetHeader title="Save workout" onClose={onBack} closeIcon="back" />
      <h2 className="mt-1 mb-3.5 px-0.5 text-[26px] font-extrabold tracking-tight">
        {title}
      </h2>

      <div className="mb-4.5 flex gap-2.5 border-b border-line pb-4.5">
        {stats.map((s) => (
          <div key={s.label} className="flex-1">
            <div className="text-[11.5px] font-semibold uppercase tracking-wide text-muted-2">
              {s.label}
            </div>
            <div
              className={`mt-1 text-2xl font-extrabold tracking-tight ${
                s.accent ? "text-blue" : ""
              }`}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {muscleSection && (
        <>
          <div className="mb-3 text-[12.5px] font-bold uppercase tracking-wide text-muted">
            Muscles worked
          </div>
          {muscleSection}
        </>
      )}

      <div className="mt-4.5 mb-4.5">
        <label className="mb-1.5 block text-[12.5px] font-semibold text-muted">
          Note (optional)
        </label>
        <textarea
          placeholder="How did it go? Add a note…"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="min-h-18.5 w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-base text-ink outline-none focus:border-blue"
        />
      </div>

      <button
        type="button"
        onClick={onSave}
        className="w-full rounded-2xl bg-blue py-4 text-[15.5px] font-bold text-white"
      >
        Save workout
      </button>
      <button
        type="button"
        onClick={() => setConfirmingDiscard(true)}
        className="mx-auto mt-4 block text-[15px] font-semibold text-danger"
      >
        Discard workout
      </button>

      <ConfirmDialog
        open={confirmingDiscard}
        danger
        message="Discard this workout?"
        onCancel={() => setConfirmingDiscard(false)}
        onConfirm={() => {
          setConfirmingDiscard(false);
          onDiscard();
        }}
      />
    </div>
  );
}
