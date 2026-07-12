"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { epley1RM } from "@/shared/lib/epley";
import { formatFullDate } from "@/shared/lib/date";
import { BackIcon } from "@/shared/ui/icons";
import { Chip } from "@/shared/ui/Chip";
import { SetTable } from "@/shared/ui/SetTable";
import { exInfo } from "../library/exInfo";
import { CARDIO, muscleLabel } from "../library/library";
import { useExerciseHistory } from "../hooks/useExerciseHistory";
import { BodyMap } from "./BodyMap";
import { ExerciseThumb } from "./ExerciseThumb";

type Tab = "summary" | "history" | "muscles";
const TABS: { id: Tab; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "history", label: "History" },
  { id: "muscles", label: "Muscles" },
];

function prRow(label: string, value: string) {
  return (
    <div key={label} className="flex items-center justify-between border-b border-line py-3">
      <span className="text-[14px] text-muted">{label}</span>
      <span className="text-[15px] font-bold text-ink">{value}</span>
    </div>
  );
}

/**
 * Exercise detail: Summary (PRs or cardio totals) / History (every past
 * session) / Muscles (region + BodyMap roles). Used both as the real
 * `/exercises/[name]` route (deep-linkable) and pushed as a stacked sheet
 * from inside live logging / the routine editor — in the sheet case
 * `onBack` is the sheet's `pop`, preserving the in-progress draft
 * underneath instead of losing it to a full navigation.
 */
export function ExerciseDetailTabs({
  name,
  onBack,
}: {
  name: string;
  onBack?: () => void;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("summary");
  const history = useExerciseHistory(name);
  const customExercises = useQuery(api.exercises.listCustomExercises) ?? [];

  const isCardio = CARDIO.includes(name);
  const customByName = Object.fromEntries(
    customExercises.map((c) => [c.name, { primaryMuscle: c.primaryMuscle }])
  );

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={() => (onBack ? onBack() : router.back())}
        className="mb-2 -ml-1.5 flex items-center gap-1 rounded-lg px-1.5 py-2 text-[15px] font-semibold text-muted"
      >
        <BackIcon />
        Back
      </button>

      <div className="mb-4 flex items-center gap-3">
        <ExerciseThumb name={name} />
        <h1 className="text-[22px] font-extrabold tracking-tight">{name}</h1>
      </div>

      <div className="mb-4 flex gap-2">
        {TABS.map((t) => (
          <Chip key={t.id} small active={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </Chip>
        ))}
      </div>

      {tab === "summary" && (
        <SummaryTab name={name} isCardio={isCardio} history={history} />
      )}
      {tab === "history" && <HistoryTab history={history} />}
      {tab === "muscles" && (
        <MusclesTab name={name} customByName={customByName} />
      )}
    </div>
  );
}

function SummaryTab({
  name,
  isCardio,
  history,
}: {
  name: string;
  isCardio: boolean;
  history: ReturnType<typeof useExerciseHistory>;
}) {
  if (history === undefined) {
    return <div className="h-32 animate-pulse rounded-card bg-surface" />;
  }

  const { matches, scannedAll } = history;

  if (isCardio) {
    let longest = 0;
    let totalMin = 0;
    for (const m of matches) {
      for (const s of m.sets) {
        const min = Number(s.min) || 0;
        if (min > longest) longest = min;
        totalMin += min;
      }
    }
    return (
      <div>
        {prRow("Sessions logged", `${matches.length}`)}
        {prRow("Longest session", longest ? `${longest} min` : "–")}
        {prRow("Total time", totalMin ? `${totalMin} min` : "–")}
        {!scannedAll && (
          <p className="mt-3 text-[12px] text-muted-2">
            Showing your most recent sessions.
          </p>
        )}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="py-8 text-center text-[14px] text-muted-2">
        <span className="mb-1.5 block text-lg font-bold text-muted">
          No records yet.
        </span>
        Log this exercise a few times and your personal records show up here.
      </div>
    );
  }

  let heaviest = 0;
  let best1rm = 0;
  let bestSetVol = 0;
  const sessionVolumes = new Map<string, number>();
  for (const m of matches) {
    let sessVol = sessionVolumes.get(m.sessionId) ?? 0;
    for (const s of m.sets) {
      const w = Number(s.weight) || 0;
      const reps = Number(s.reps) || 0;
      if (w > heaviest) heaviest = w;
      if (w > 0 && reps > 0) {
        const orm = epley1RM(w, reps);
        if (orm > best1rm) best1rm = orm;
        const sv = w * reps;
        if (sv > bestSetVol) bestSetVol = sv;
        sessVol += sv;
      }
    }
    sessionVolumes.set(m.sessionId, sessVol);
  }
  const bestSessVol = Math.max(0, ...sessionVolumes.values());

  return (
    <div>
      <div className="mb-1 mt-1 text-[12.5px] font-bold uppercase tracking-wide text-muted">
        Personal records
      </div>
      {prRow("Heaviest weight", heaviest ? `${heaviest} kg` : "–")}
      {prRow("Best 1RM (est.)", best1rm ? `${Math.round(best1rm * 10) / 10} kg` : "–")}
      {prRow("Best set volume", bestSetVol ? `${Math.round(bestSetVol * 10) / 10} kg` : "–")}
      {prRow("Best session volume", bestSessVol ? `${Math.round(bestSessVol * 10) / 10} kg` : "–")}
      {prRow("Times logged", `${matches.length}`)}
      {!scannedAll && (
        <p className="mt-3 text-[12px] text-muted-2">
          Showing your most recent sessions.
        </p>
      )}
    </div>
  );
}

function HistoryTab({
  history,
}: {
  history: ReturnType<typeof useExerciseHistory>;
}) {
  if (history === undefined) {
    return <div className="h-32 animate-pulse rounded-card bg-surface" />;
  }

  if (history.matches.length === 0) {
    return (
      <div className="py-8 text-center text-[14px] text-muted-2">
        <span className="mb-1.5 block text-lg font-bold text-muted">
          No history yet.
        </span>
        Once you log this exercise, every session shows up here.
      </div>
    );
  }

  return (
    <div>
      {history.matches.map((m) => (
        <Link
          key={`${m.sessionId}-${m.ts}`}
          href={`/sessions/${m.sessionId}`}
          className="mb-4 block"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[14.5px] font-bold text-ink">
              {m.routineName ?? "Workout"}
            </span>
            <span className="text-[12px] text-muted-2">
              {formatFullDate(m.ts)}
            </span>
          </div>
          <SetTable sets={m.sets} cardio={m.cardio} />
        </Link>
      ))}
    </div>
  );
}

function MusclesTab({
  name,
  customByName,
}: {
  name: string;
  customByName: Record<string, { primaryMuscle: string }>;
}) {
  const info = exInfo(name, customByName);

  return (
    <div>
      {info && (
        <div className="mb-1 text-center text-[13px] text-muted-2">
          {info.region} &middot; {info.mv} &middot;{" "}
          {info.t === "compound" ? "Compound" : info.t === "isolation" ? "Isolation" : "—"}
        </div>
      )}
      <BodyMap mode="roles" primary={info?.p ?? []} secondary={info?.s ?? []} />

      {info && info.p.length > 0 && (
        <>
          <div className="mb-2 mt-4 text-[12.5px] font-bold uppercase tracking-wide text-muted">
            Primary
          </div>
          <div className="mb-2 flex flex-wrap gap-2">
            {info.p.map((id) => (
              <span
                key={id}
                className="rounded-full bg-blue px-3.5 py-1.5 text-[13px] font-semibold text-white"
              >
                {muscleLabel(id)}
              </span>
            ))}
          </div>
        </>
      )}

      {info && info.s.length > 0 && (
        <>
          <div className="mb-2 mt-4 text-[12.5px] font-bold uppercase tracking-wide text-muted">
            Secondary
          </div>
          <div className="flex flex-wrap gap-2">
            {info.s.map((id) => (
              <span
                key={id}
                className="rounded-full border border-orange bg-orange/[0.18] px-3.5 py-1.5 text-[13px] font-semibold text-orange"
              >
                {muscleLabel(id)}
              </span>
            ))}
          </div>
        </>
      )}

      {!info && (
        <div className="mt-4 text-center text-[13px] text-muted-2">
          No muscle data for this exercise.
        </div>
      )}
    </div>
  );
}
