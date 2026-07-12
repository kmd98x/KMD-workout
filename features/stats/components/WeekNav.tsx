"use client";

import { formatWeekRange } from "@/shared/lib/date";

export function WeekNav({
  weekStartTs,
  offset,
  onOffsetChange,
}: {
  weekStartTs: number;
  offset: number;
  onOffsetChange: (next: number) => void;
}) {
  const title =
    offset === 0 ? "This week" : offset === -1 ? "Last week" : `${Math.abs(offset)} weeks ago`;

  return (
    <div className="mb-4 flex items-center justify-between rounded-card bg-surface px-3 py-3">
      <button
        type="button"
        aria-label="Previous week"
        onClick={() => onOffsetChange(offset - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-ink active:bg-surface-2"
      >
        &#8592;
      </button>
      <div className="text-center">
        <div className="text-[14px] font-bold text-ink">{title}</div>
        <div className="text-[12px] text-muted-2">{formatWeekRange(weekStartTs)}</div>
      </div>
      <button
        type="button"
        aria-label="Next week"
        disabled={offset >= 0}
        onClick={() => onOffsetChange(offset + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-ink disabled:opacity-30 active:bg-surface-2"
      >
        &#8594;
      </button>
    </div>
  );
}
