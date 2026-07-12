"use client";

import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";

export function TargetEditDialog({
  group,
  initialMin,
  initialMax,
  onClose,
}: {
  group: string;
  initialMin: number;
  initialMax: number;
  onClose: () => void;
}) {
  const setTarget = useMutation(api.stats.setTarget);
  const [min, setMin] = useState(String(initialMin));
  const [max, setMax] = useState(String(initialMax));

  const save = async () => {
    const mn = Math.max(0, Number(min) || 0);
    const mx = Math.max(mn, Number(max) || mn);
    await setTarget({ group, min: mn, max: mx });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/62 p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[340px] rounded-2xl border border-line bg-surface p-[22px]">
        <p className="mb-4 text-[15px] font-bold text-ink">
          Weekly set target &mdash; {group}
        </p>
        <div className="mb-5 flex gap-2.5">
          <label className="flex-1">
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-2">
              Min
            </div>
            <input
              type="number"
              min={0}
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="w-full rounded-[10px] border border-line bg-surface-2 px-3 py-2.5 text-[15px] text-ink outline-none focus:border-blue"
            />
          </label>
          <label className="flex-1">
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-2">
              Max
            </div>
            <input
              type="number"
              min={0}
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="w-full rounded-[10px] border border-line bg-surface-2 px-3 py-2.5 text-[15px] text-ink outline-none focus:border-blue"
            />
          </label>
        </div>
        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] bg-surface-2 px-[18px] py-[11px] text-sm font-bold text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-[10px] bg-blue px-[18px] py-[11px] text-sm font-bold text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
