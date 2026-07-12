"use client";

import { CardioIcon } from "@/shared/ui/icons";

export function LogCardioButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-card bg-surface px-4 py-[18px] text-ink"
    >
      <CardioIcon />
      <span className="text-[16px] font-bold tracking-tight">Log cardio</span>
    </button>
  );
}
