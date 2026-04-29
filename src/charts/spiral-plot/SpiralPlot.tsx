"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// -----------------------------------------------------------------------------
// Spiral plot — 20 years of daily London high temperature, wound into a disc.
// Radius grows slowly with the year (outer rings = more recent); angle cycles
// once per year (θ = 2π · dayOfYear / 365). Each segment's ink opacity encodes
// the daily high — cool days are faint, warm days are opaque. Summer peaks
// line up as a warm diagonal band that thickens toward the outer rings.
// -----------------------------------------------------------------------------

const N_YEARS = 20;               // 2005 .. 2024
const START_YEAR = 2005;
const DAYS_PER_YEAR = 365;

interface DailyPoint {
  year: number;        // 0..N_YEARS-1
  dayOfYear: number;   // 0..364
  temp: number;        // °C, daily high
}

function makeRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Synthetic London daily high: seasonal cosine (~7 °C winter, ~24 °C summer)
// plus a gentle multi-decadal warming trend (+0.04 °C / year) plus weekly
// synoptic noise. Deterministic via a seeded LCG so renders match server-side.
function buildData(): DailyPoint[] {
  const rand = makeRand(17);
  const out: DailyPoint[] = [];
  for (let y = 0; y < N_YEARS; y++) {
    // carry a slow weekly walk so the synoptic wiggle is autocorrelated
    let walk = 0;
    for (let d = 0; d < DAYS_PER_YEAR; d++) {
      // peak near day 200 (mid-July), trough near day 15 (mid-January)
      const seasonal = 8.5 + 7.5 * (1 - Math.cos((2 * Math.PI * (d - 15)) / DAYS_PER_YEAR));
      const trend = 0.055 * y; // warming drift
      walk = walk * 0.82 + (rand() - 0.5) * 3.6;
      const temp = seasonal + trend + walk;
      out.push({ year: y, dayOfYear: d, temp });
    }
  }
  return out;
}

interface Props {
  width: number;
  height: number;
}

export function SpiralPlot({ width, height }: Props) {
  const margin = { top: 20, right: 92, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => buildData(), []);

  // Fit the spiral into a disc centred in (iw, ih). Leave room for month labels
  // outside the outermost ring.
  const cx = iw / 2;
  const cy = ih / 2;
  const rOuter = Math.max(0, Math.min(iw, ih) / 2 - 14);
  const rInner = Math.max(0, rOuter * 0.18); // hollow centre for the title

  // Archimedean r(θ): radius grows linearly from rInner (year 0, day 0) to
  // rOuter (year N-1, day 364). One full revolution per year.
  const tempMin = 0;
  const tempMax = 30;

  // Pre-compute (x, y) for every day so segments share endpoints.
  const pts = useMemo(() => {
    const arr: Array<{ x: number; y: number; temp: number; year: number; day: number }> = [];
    for (const d of data) {
      const t = (d.year + d.dayOfYear / DAYS_PER_YEAR) / N_YEARS; // 0..1
      const r = rInner + t * (rOuter - rInner);
      // Angle: 0 = mid-January (top of the spiral), increases clockwise so
      // summer sits at the bottom-right in the conventional calendar mental
      // model. θ = -π/2 + 2π · dayOfYear/365.
      const theta = -Math.PI / 2 + (2 * Math.PI * d.dayOfYear) / DAYS_PER_YEAR;
      arr.push({
        x: cx + r * Math.cos(theta),
        y: cy + r * Math.sin(theta),
        temp: d.temp,
        year: d.year,
        day: d.dayOfYear,
      });
    }
    return arr;
  }, [data, cx, cy, rInner, rOuter]);

  // Map temperature to ink opacity (0.08 .. 1.0). Clamp to [tempMin, tempMax].
  const tempOpacity = (t: number) => {
    const clamped = Math.max(tempMin, Math.min(tempMax, t));
    return 0.1 + 0.9 * ((clamped - tempMin) / (tempMax - tempMin));
  };

  // Month-tick angles (Jan 1, Feb 1, ... Dec 1) for the outer label ring.
  const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const MONTH_START_DAYS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

  // Representative sample points for anchors.
  // A summer point in the final (outermost) year — the warmest / most opaque.
  const summerFinal = pts.find((p) => p.year === N_YEARS - 1 && p.day === 200)!;
  // A winter point in the first (innermost) year — the coolest / faintest.
  const winterFirst = pts.find((p) => p.year === 0 && p.day === 15)!;

  // Segment renderer: draw one line per day, from day d to day d+1.
  // This gives per-segment opacity so the warm band is visible.
  const segments = useMemo(() => {
    const segs: Array<{ x1: number; y1: number; x2: number; y2: number; opacity: number }> = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      // Average the two endpoints' temps for the segment's ink.
      const opacity = tempOpacity((a.temp + b.temp) / 2);
      segs.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, opacity });
    }
    return segs;
  }, [pts]);

  // Legend ramp: a small vertical bar on the right showing °C -> opacity.
  const legendX = iw + 18;
  const legendY0 = 10;
  const legendY1 = ih - 10;
  const legendW = 10;
  const legendSteps = 16;

  return (
    <svg width={width} height={height} role="img" aria-label="Spiral plot">
      <Group left={margin.left} top={margin.top}>
        {/* Data layer — the spiral itself */}
        <g data-data-layer="true">
          {/* Subtle backing disc so the faint winter strokes register */}
          <circle
            cx={cx}
            cy={cy}
            r={rOuter + 2}
            fill="none"
            stroke="var(--color-hairline)"
          />
          {/* Year gridlines — one dashed circle every 5 years, for radial scale */}
          {[0.25, 0.5, 0.75].map((t) => (
            <circle
              key={t}
              cx={cx}
              cy={cy}
              r={rInner + t * (rOuter - rInner)}
              fill="none"
              stroke="var(--color-hairline)"
              strokeDasharray="1 3"
            />
          ))}
          {/* The spiral — one line per day-pair */}
          {segments.map((s, i) => (
            <line
              key={i}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke="var(--color-ink)"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeOpacity={s.opacity}
            />
          ))}
          {/* Centre label */}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            LONDON
          </text>
          <text
            x={cx}
            y={cy + 8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            {START_YEAR}–{START_YEAR + N_YEARS - 1}
          </text>

          {/* Month labels around the outside */}
          {MONTHS.map((m, i) => {
            const theta =
              -Math.PI / 2 + (2 * Math.PI * MONTH_START_DAYS[i]) / DAYS_PER_YEAR;
            const lr = rOuter + 10;
            return (
              <text
                key={m + i}
                x={cx + lr * Math.cos(theta)}
                y={cy + lr * Math.sin(theta)}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-mute)"
              >
                {m}
              </text>
            );
          })}

          {/* Legend — opacity ramp */}
          <g transform={`translate(${legendX}, 0)`}>
            {Array.from({ length: legendSteps }).map((_, i) => {
              const frac = i / (legendSteps - 1);
              const y = legendY0 + frac * (legendY1 - legendY0);
              const h = (legendY1 - legendY0) / legendSteps + 0.6;
              const t = tempMin + (1 - frac) * (tempMax - tempMin); // hot at top
              return (
                <rect
                  key={i}
                  x={0}
                  y={y}
                  width={legendW}
                  height={h}
                  fill="var(--color-ink)"
                  fillOpacity={tempOpacity(t)}
                />
              );
            })}
            <text
              x={legendW + 4}
              y={legendY0 + 4}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              {tempMax}°
            </text>
            <text
              x={legendW + 4}
              y={legendY1}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              {tempMin}°
            </text>
            <text
              x={legendW / 2}
              y={legendY1 + 14}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              °C
            </text>
          </g>
        </g>

        {/* Anchor 1 — spiral path (primary encoding) */}
        <ExplainAnchor
          selector="spiral-path"
          index={1}
          pin={{
            x: cx - rOuter * 0.5,
            y: cy - rOuter * 0.5,
          }}
          rect={{
            x: cx - rOuter - 2,
            y: cy - rOuter - 2,
            width: 2 * (rOuter + 2),
            height: 2 * (rOuter + 2),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2 — radial time axis (years grow outward) */}
        <ExplainAnchor
          selector="radial-time"
          index={2}
          pin={{
            x: cx + rOuter + 4,
            y: cy - 4,
          }}
          rect={{
            x: cx,
            y: cy - 6,
            width: rOuter + 8,
            height: 12,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — angular phase axis (months around the disc) */}
        <ExplainAnchor
          selector="phase-axis"
          index={3}
          pin={{
            x: cx + (rOuter + 22) * Math.cos(-Math.PI / 2 + (2 * Math.PI * 181) / DAYS_PER_YEAR),
            y: cy + (rOuter + 22) * Math.sin(-Math.PI / 2 + (2 * Math.PI * 181) / DAYS_PER_YEAR),
          }}
          rect={{
            x: cx - rOuter - 14,
            y: cy - rOuter - 14,
            width: 2 * (rOuter + 14),
            height: 2 * (rOuter + 14),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4 — warm-band alignment (summer peaks line up as a diagonal) */}
        <ExplainAnchor
          selector="summer-band"
          index={4}
          pin={{ x: summerFinal.x + 14, y: summerFinal.y + 8 }}
          rect={{
            x: summerFinal.x - 10,
            y: summerFinal.y - 10,
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — faint winter stretches (cool = low opacity) */}
        <ExplainAnchor
          selector="cool-faint"
          index={5}
          pin={{ x: winterFirst.x - 18, y: winterFirst.y - 6 }}
          rect={{
            x: winterFirst.x - 8,
            y: winterFirst.y - 8,
            width: 16,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6 — temperature legend */}
        <ExplainAnchor
          selector="temp-legend"
          index={6}
          pin={{ x: legendX + legendW + 18, y: legendY0 + (legendY1 - legendY0) / 2 }}
          rect={{
            x: legendX - 2,
            y: legendY0 - 2,
            width: legendW + 20,
            height: legendY1 - legendY0 + 4,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
