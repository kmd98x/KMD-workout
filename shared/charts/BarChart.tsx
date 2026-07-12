export type BarChartPoint = { label: string; value: number; highlighted?: boolean };

/**
 * Hand-drawn bar chart for small fixed category counts (the Progress tab's
 * 6-week rhythm chart). Mark specs match `LineChart`'s: bars capped at
 * 24px thick with a 4px rounded data-end and a square baseline, one accent
 * hue reserved for the highlighted bar (current week) with the rest in a
 * recessive step, and a sparse direct label only on non-zero bars — never
 * one per bar's axis tick since the category label already sits below it.
 */
export function BarChart({
  points,
  formatValue,
}: {
  points: BarChartPoint[];
  formatValue?: (v: number) => string;
}) {
  const max = Math.max(1, ...points.map((p) => p.value));

  return (
    <div className="flex h-[130px] items-end justify-between gap-2">
      {points.map((p, i) => {
        const barHeight = Math.round((p.value / max) * 84) + 4;
        return (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <span className="text-[11px] font-bold text-ink">
              {p.value > 0 ? (formatValue ? formatValue(p.value) : p.value) : ""}
            </span>
            <div
              className={`w-full max-w-[24px] rounded-t-[4px] ${
                p.highlighted ? "bg-blue" : "bg-surface-2"
              }`}
              style={{ height: barHeight }}
            />
            <span className="text-[10.5px] font-medium text-muted-2">{p.label}</span>
          </div>
        );
      })}
    </div>
  );
}
