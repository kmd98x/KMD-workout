import { daysInMonth, todayKey } from "@/shared/lib/date";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

/** Calendar grid for one month, Monday-first, mirroring `WeekStrip`'s
 * done/today/neither dot styling per day. `doneDays` holds
 * `todayKey()`-formatted dates that have a logged session. */
export function MonthGrid({
  monthStartTs,
  doneDays,
}: {
  monthStartTs: number;
  doneDays: Set<string>;
}) {
  const monthStart = new Date(monthStartTs);
  const total = daysInMonth(monthStart);
  const leadingBlanks = (monthStart.getDay() + 6) % 7; // Mon=0 .. Sun=6
  const today = todayKey();

  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="grid grid-cols-7 pb-1.5 text-center text-[10.5px] font-bold uppercase tracking-wide text-muted-2">
        {DAY_LABELS.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const key = `${monthStart.getFullYear()}-${monthStart.getMonth() + 1}-${day}`;
          const done = doneDays.has(key);
          const isToday = key === today;
          return (
            <div key={i} className="flex items-center justify-center">
              <div
                className={`flex h-7.5 w-7.5 items-center justify-center rounded-full border-[1.5px] text-[11.5px] transition-colors ${
                  done
                    ? "border-blue bg-blue text-white"
                    : isToday
                      ? "border-dashed border-blue text-muted-2"
                      : "border-line bg-surface-2 text-muted-2"
                }`}
              >
                {day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
