"use client";

import { useState } from "react";
import { formatDate } from "@/shared/lib/date";

export type LineChartPoint = { ts: number; value: number };

/**
 * Hand-drawn SVG line chart for a single series (a routine's volume/reps/
 * duration per session, over time). No charting library, per the app's
 * architecture — but the mark specs (2px line, >=8px ringed end-dots,
 * hairline recessive gridlines, one sparse direct label) and the tap/hover
 * crosshair+tooltip follow the dataviz skill so this and the M4/M5 charts
 * read as one system. Single series, so no legend box.
 */
export function LineChart({
  points,
  formatValue,
  color = "var(--color-blue)",
}: {
  points: LineChartPoint[];
  formatValue: (v: number) => string;
  color?: string;
}) {
  const [active, setActive] = useState<number | null>(null);

  const width = 300;
  const height = 150;
  const padX = 12;
  const padTop = 20;
  const padBottom = 24;
  const plotW = width - padX * 2;
  const plotH = height - padTop - padBottom;

  const values = points.map((p) => p.value);
  const maxV = Math.max(...values);
  const minV = Math.min(0, ...values);
  const range = maxV - minV || 1;

  const xAt = (i: number) =>
    padX + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
  const yAt = (v: number) => padTop + plotH - ((v - minV) / range) * plotH;
  const colWidth = plotW / points.length;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yAt(p.value).toFixed(1)}`)
    .join(" ");

  const gridValues = [minV, minV + range / 2, minV + range];
  const last = points[points.length - 1];
  const activePoint = active !== null ? points[active] : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full touch-none select-none"
        onPointerLeave={() => setActive(null)}
      >
        {gridValues.map((v, i) => (
          <line
            key={i}
            x1={padX}
            x2={width - padX}
            y1={yAt(v)}
            y2={yAt(v)}
            stroke="var(--color-line)"
            strokeWidth={1}
          />
        ))}

        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => (
          <circle
            key={i}
            cx={xAt(i)}
            cy={yAt(p.value)}
            r={4}
            fill={color}
            stroke="var(--color-bg)"
            strokeWidth={2}
          />
        ))}

        <text
          x={xAt(points.length - 1)}
          y={Math.max(10, yAt(last.value) - 10)}
          textAnchor="end"
          className="fill-ink text-[10px] font-bold"
        >
          {formatValue(last.value)}
        </text>

        {activePoint && active !== null && (
          <line
            x1={xAt(active)}
            x2={xAt(active)}
            y1={padTop}
            y2={height - padBottom}
            stroke="var(--color-line)"
            strokeWidth={1}
          />
        )}

        {points.map((p, i) => (
          <rect
            key={`hit-${i}`}
            x={xAt(i) - colWidth / 2}
            y={0}
            width={colWidth}
            height={height}
            fill="transparent"
            onPointerEnter={() => setActive(i)}
            onClick={() => setActive((a) => (a === i ? null : i))}
          />
        ))}
      </svg>

      {activePoint && active !== null && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 -translate-y-[110%] whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] shadow-lg"
          style={{ left: `${(xAt(active) / width) * 100}%` }}
        >
          <div className="font-bold text-ink">{formatValue(activePoint.value)}</div>
          <div className="text-muted-2">{formatDate(activePoint.ts)}</div>
        </div>
      )}
    </div>
  );
}
