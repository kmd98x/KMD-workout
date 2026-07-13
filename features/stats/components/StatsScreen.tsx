"use client";

import { useState } from "react";
import { startOfWeek } from "@/shared/lib/date";
import { Chip } from "@/shared/ui/Chip";
import { BodyTab } from "./BodyTab";
import { MeasurementsTab } from "./MeasurementsTab";
import { SetsTab } from "./SetsTab";
import { TrendsTab } from "./TrendsTab";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

type Tab = "sets" | "body" | "trends" | "measurements";
const TABS: { id: Tab; label: string }[] = [
  { id: "sets", label: "Sets" },
  { id: "body", label: "Body" },
  { id: "trends", label: "Trends" },
  { id: "measurements", label: "Measure" },
];

export function StatsScreen() {
  const [tab, setTab] = useState<Tab>("sets");
  const [weekOffset, setWeekOffset] = useState(0);
  const weekStartTs = startOfWeek().getTime() + weekOffset * WEEK_MS;

  return (
    <div className="pt-2">
      <div className="pt-6.5 pb-4.5 text-[26px] font-extrabold tracking-tight">
        Statistics
      </div>

      <div className="mb-5 flex gap-2">
        {TABS.map((t) => (
          <Chip key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </Chip>
        ))}
      </div>

      {tab === "sets" && (
        <SetsTab weekStartTs={weekStartTs} offset={weekOffset} onOffsetChange={setWeekOffset} />
      )}
      {tab === "body" && (
        <BodyTab weekStartTs={weekStartTs} offset={weekOffset} onOffsetChange={setWeekOffset} />
      )}
      {tab === "trends" && <TrendsTab />}
      {tab === "measurements" && <MeasurementsTab />}
    </div>
  );
}
