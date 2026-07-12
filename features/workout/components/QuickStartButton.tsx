"use client";

import { StrengthIcon } from "@/shared/ui/icons";

export function QuickStartButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-0.5 flex w-full items-center justify-center gap-3 rounded-card bg-blue px-4 py-[18px] text-white"
    >
      <StrengthIcon />
      <span className="text-[16px] font-bold tracking-tight">Quick start</span>
    </button>
  );
}
