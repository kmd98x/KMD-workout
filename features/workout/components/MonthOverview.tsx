"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { addMonths, startOfMonth, todayKey } from "@/shared/lib/date";
import { MonthGrid } from "./MonthGrid";
import { MonthNav } from "./MonthNav";

/** Self-contained month calendar for the Workout home screen's greeting
 * card: owns its own "which month" state so the rest of the screen doesn't
 * need to know about it, and fetches just that month's session days.
 * Computes both the start and (exclusive) end of the month locally and
 * sends both to the query — see `getMonthSummary` for why the server can't
 * safely derive the end from the start on its own. */
export function MonthOverview() {
  const [offset, setOffset] = useState(0);
  const monthStart = addMonths(startOfMonth(), offset);
  const monthStartTs = monthStart.getTime();
  const monthEndTs = addMonths(monthStart, 1).getTime();
  const summary = useQuery(api.logging.getMonthSummary, { monthStartTs, monthEndTs });
  const doneDays = new Set((summary?.sessionTs ?? []).map((ts) => todayKey(new Date(ts))));

  return (
    <div className="mt-4">
      <MonthNav monthStartTs={monthStartTs} offset={offset} onOffsetChange={setOffset} />
      <MonthGrid monthStartTs={monthStartTs} doneDays={doneDays} />
    </div>
  );
}
