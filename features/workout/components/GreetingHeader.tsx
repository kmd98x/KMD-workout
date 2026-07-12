import { greeting } from "@/shared/lib/date";
import { WeekStrip } from "./WeekStrip";

export function GreetingHeader({
  sessionsThisWeek,
  doneDays,
}: {
  sessionsThisWeek: number;
  doneDays: Set<string>;
}) {
  const sub =
    sessionsThisWeek === 0
      ? "No sessions yet this week — and that's okay."
      : sessionsThisWeek === 1
        ? "1 session this week. Nice start."
        : `${sessionsThisWeek} sessions this week. Good rhythm.`;

  return (
    <div className="rounded-card bg-surface p-5">
      <h2 className="text-[23px] font-bold">{greeting()}.</h2>
      <p className="mt-1 text-sm text-muted">{sub}</p>
      <WeekStrip doneDays={doneDays} />
    </div>
  );
}
