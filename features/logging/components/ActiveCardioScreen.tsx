"use client";

import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { CARDIO } from "@/features/exercises/library/library";
import { Chip } from "@/shared/ui/Chip";
import { ClockIcon } from "@/shared/ui/icons";
import { SheetHeader } from "@/shared/ui/SheetHeader";
import { useSheet } from "@/shared/ui/SheetHost";
import { WorkoutSummaryScreen } from "./WorkoutSummaryScreen";

const INTENSITIES = ["Easy (conversational)", "Moderate", "Hard"];

export function ActiveCardioScreen() {
  const { closeAll } = useSheet();
  const finishCardioSession = useMutation(api.logging.finishCardioSession);
  const updateSessionNotes = useMutation(api.logging.updateSessionNotes);

  const [startTs] = useState(() => Date.now());
  const [cardioType, setCardioType] = useState(CARDIO[0]);
  const [duration, setDuration] = useState("25");
  const [intensity, setIntensity] = useState(INTENSITIES[0]);
  const [phase, setPhase] = useState<"log" | "summary">("log");
  const [notes, setNotes] = useState("");
  const [sessionId, setSessionId] = useState<Id<"sessions"> | null>(null);
  const [finishing, setFinishing] = useState(false);

  async function handleFinish() {
    if (finishing) return;
    setFinishing(true);
    const id = await finishCardioSession({
      cardioType,
      duration: Number(duration) || 0,
      intensity,
      ts: startTs,
    });
    setSessionId(id);
    setFinishing(false);
    setPhase("summary");
  }

  function commitNotes() {
    if (sessionId) updateSessionNotes({ id: sessionId, notes });
  }

  if (phase === "summary") {
    return (
      <WorkoutSummaryScreen
        title={cardioType}
        stats={[
          { label: "Duration", value: `${Number(duration) || 0} min`, accent: true },
          { label: "Type", value: cardioType },
          { label: "Intensity", value: intensity.replace(" (conversational)", "") },
        ]}
        notes={notes}
        onNotesChange={setNotes}
        onNotesBlur={commitNotes}
        onDone={closeAll}
      />
    );
  }

  return (
    <div className="p-4">
      <SheetHeader
        title="Cardio"
        onClose={closeAll}
        right={
          <button
            type="button"
            onClick={handleFinish}
            disabled={finishing}
            className="text-[15px] font-bold text-blue disabled:opacity-50"
          >
            Finish
          </button>
        }
      />

      <div className="mb-4">
        <label className="mb-2 block text-[12.5px] font-semibold text-muted">
          What are you doing?
        </label>
        <div className="flex flex-wrap gap-2">
          {CARDIO.map((c) => (
            <Chip key={c} active={c === cardioType} onClick={() => setCardioType(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-[12.5px] font-semibold text-muted">
          Duration (minutes)
        </label>
        <input
          type="number"
          min={0}
          inputMode="numeric"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-base text-ink outline-none focus:border-blue"
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-[12.5px] font-semibold text-muted">
          Intensity
        </label>
        <div className="flex flex-wrap gap-2">
          {INTENSITIES.map((l) => (
            <Chip key={l} small active={l === intensity} onClick={() => setIntensity(l)}>
              {l}
            </Chip>
          ))}
        </div>
      </div>

      {cardioType === "StairMaster" && (
        <div className="mt-3 flex gap-3 rounded-card border border-line bg-surface p-4 text-[13.5px] leading-snug text-muted">
          <ClockIcon />
          <span>
            Around 20–30 min at a conversational pace keeps stress low.
            Feeling wound up rather than tired? It&rsquo;s fine to stop
            earlier.
          </span>
        </div>
      )}
    </div>
  );
}
