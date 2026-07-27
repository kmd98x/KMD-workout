"use client";

import { formatMonthTitle } from "@/shared/lib/date";

export function MonthNav({
  monthStartTs,
  offset,
  onOffsetChange,
}: {
  monthStartTs: number;
  offset: number;
  onOffsetChange: (next: number) => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <button
        type="button"
        aria-label="Previous month"
        onClick={() => onOffsetChange(offset - 1)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-base font-bold text-ink active:bg-surface-2"
      >
        &#8592;
      </button>
      <div className="text-[13.5px] font-bold text-ink">{formatMonthTitle(monthStartTs)}</div>
      <button
        type="button"
        aria-label="Next month"
        disabled={offset >= 0}
        onClick={() => onOffsetChange(offset + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-base font-bold text-ink disabled:opacity-30 active:bg-surface-2"
      >
        &#8594;
      </button>
    </div>
  );
}
