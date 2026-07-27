"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { addMonths, startOfMonth } from "@/shared/lib/date";
import { MonthGrid } from "./MonthGrid";
import { MonthNav } from "./MonthNav";

/** Self-contained month calendar for the Workout home screen's greeting
 * card: owns its own "which month" state so the rest of the screen doesn't
 * need to know about it, and fetches just that month's session days. */
export function MonthOverview() {
  const [offset, setOffset] = useState(0);
  const monthStartTs = addMonths(startOfMonth(), offset).getTime();
  const summary = useQuery(api.logging.getMonthSummary, { monthStartTs });
  const doneDays = new Set(summary?.days ?? []);

  return (
    <div className="mt-4">
      <MonthNav monthStartTs={monthStartTs} offset={offset} onOffsetChange={setOffset} />
      <MonthGrid monthStartTs={monthStartTs} doneDays={doneDays} />
    </div>
  );
}
