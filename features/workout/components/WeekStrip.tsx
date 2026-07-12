import { startOfWeek, todayKey } from "@/shared/lib/date";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** 7-dot Mon–Sun strip. `doneDays` holds `todayKey()`-formatted dates that
 * have a logged session; wired to real session data starting in M2 — until
 * then callers pass an empty set, which is simply the truthful state of a
 * user who can't log a session yet. */
export function WeekStrip({ doneDays }: { doneDays: Set<string> }) {
  const monday = startOfWeek();
  const today = todayKey();

  return (
    <div className="mt-4 flex justify-between gap-1.5">
      {DAY_LABELS.map((label, i) => {
        const d = new Date(monday.getTime() + i * 86400000);
        const key = todayKey(d);
        const done = doneDays.has(key);
        const isToday = key === today;
        return (
          <div key={label} className="flex-1 text-center">
            <div
              className={`mx-auto mb-1.5 flex h-[34px] w-[34px] items-center justify-center rounded-full border-[1.5px] text-xs transition-colors ${
                done
                  ? "border-blue bg-blue text-white"
                  : isToday
                    ? "border-dashed border-blue text-muted-2"
                    : "border-line bg-surface-2 text-muted-2"
              }`}
            >
              {done ? "✓" : ""}
            </div>
            <div className="text-[11px] font-medium text-muted-2">{label}</div>
          </div>
        );
      })}
    </div>
  );
}
