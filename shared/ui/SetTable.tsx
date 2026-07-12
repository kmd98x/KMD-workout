/** Read-only set table: target sets (routine detail) or logged sets
 * (session detail) — same rendering either way, just weight/reps or
 * minutes per row. */
export function SetTable({
  sets,
  cardio,
}: {
  sets: { weight?: string; reps?: string; min?: string }[];
  cardio: boolean;
}) {
  const cols = cardio ? "grid-cols-[52px_1fr]" : "grid-cols-[52px_1fr_1fr]";

  return (
    <div>
      <div
        className={`mb-1.5 grid ${cols} px-1.5 text-[10.5px] font-bold uppercase tracking-wide text-muted-2`}
      >
        <span>Set</span>
        <span>{cardio ? "Minutes" : "Kg"}</span>
        {!cardio && <span>Reps</span>}
      </div>
      {sets.map((s, i) => (
        <div
          key={i}
          className={`grid ${cols} items-center rounded-lg px-1.5 py-3.5 text-base ${
            i % 2 === 1 ? "bg-surface" : ""
          }`}
        >
          <span className="font-bold text-ink">{i + 1}</span>
          {cardio ? (
            <span className="text-muted">{s.min || "–"}</span>
          ) : (
            <>
              <span className="text-muted">{s.weight || "–"}</span>
              <span className="text-muted">{s.reps || "–"}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
