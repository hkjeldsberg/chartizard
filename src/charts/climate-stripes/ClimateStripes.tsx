"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Ed Hawkins' warming-stripe chart (2018). One vertical stripe per year from
// 1850 to 2024, coloured by annual global mean surface temperature anomaly
// (°C) versus the 1971-2000 reference period. No axes. The only concession
// to our Explain-panel context is the year range printed below.

const START_YEAR = 1850;
const END_YEAR = 2024;
const YEARS = END_YEAR - START_YEAR + 1; // 175

// 9-stop ColorBrewer RdBu_r — deep blue → white → deep red.
const RDBU_R: ReadonlyArray<[number, number, number]> = [
  [8, 48, 107], // deep blue (anomaly ≤ -0.5)
  [33, 102, 172],
  [67, 147, 195],
  [146, 197, 222],
  [247, 247, 247], // near white (anomaly = 0)
  [253, 219, 199],
  [244, 165, 130],
  [214, 96, 77],
  [103, 0, 13], // deepest red (anomaly ≥ +1.2)
];
const COLD_STOP = -0.5;
const HOT_STOP = 1.2;

function makeRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

interface YearAnomaly {
  year: number;
  anomaly: number;
}

function buildAnomalies(): YearAnomaly[] {
  const rand = makeRand(18502024);
  const out: YearAnomaly[] = [];
  for (let y = START_YEAR; y <= END_YEAR; y++) {
    // Trajectory: baseline drift by epoch.
    let base: number;
    if (y < 1910) {
      // Slight cooling / noise: mostly -0.3 to 0.0
      const t = (y - START_YEAR) / (1910 - START_YEAR);
      base = -0.15 - 0.1 * Math.sin(t * Math.PI * 1.4);
    } else if (y < 1980) {
      // Gentle warming: -0.1 to +0.3
      const t = (y - 1910) / (1980 - 1910);
      base = -0.1 + 0.4 * t;
    } else {
      // Accelerating warming: +0.1 to ~+1.2
      const t = (y - 1980) / (END_YEAR - 1980);
      base = 0.1 + 1.1 * t * t;
    }
    // Small year-to-year noise ±0.1.
    const noise = (rand() - 0.5) * 0.2;
    out.push({ year: y, anomaly: base + noise });
  }
  return out;
}

function interpolateRdBuR(anomaly: number): string {
  // Map anomaly ∈ [COLD_STOP, HOT_STOP] → t ∈ [0, 1] → RdBu_r ramp.
  const clamped = Math.max(COLD_STOP, Math.min(HOT_STOP, anomaly));
  const t = (clamped - COLD_STOP) / (HOT_STOP - COLD_STOP);
  const nStops = RDBU_R.length;
  const scaled = t * (nStops - 1);
  const i = Math.floor(scaled);
  const frac = scaled - i;
  if (i >= nStops - 1) {
    const [r, g, b] = RDBU_R[nStops - 1];
    return `rgb(${r}, ${g}, ${b})`;
  }
  const [r0, g0, b0] = RDBU_R[i];
  const [r1, g1, b1] = RDBU_R[i + 1];
  const r = Math.round(r0 + (r1 - r0) * frac);
  const g = Math.round(g0 + (g1 - g0) * frac);
  const b = Math.round(b0 + (b1 - b0) * frac);
  return `rgb(${r}, ${g}, ${b})`;
}

interface Props {
  width: number;
  height: number;
}

export function ClimateStripes({ width, height }: Props) {
  // Tiny margins — the chart is the stripes. Room below for the year range.
  const margin = { top: 8, right: 8, bottom: 22, left: 8 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => buildAnomalies(), []);

  const xScale = scaleLinear({
    domain: [START_YEAR, END_YEAR + 1],
    range: [0, iw],
  });

  const stripeWidth = iw / YEARS;

  // Representative recent year for the single-stripe anchor: 2023 (near peak).
  const recentYear = 2023;
  const recentX = xScale(recentYear);

  // Early-period representative: 1870 (pale blue territory).
  const earlyYear = 1870;
  const earlyX = xScale(earlyYear);

  // Late-period colour anchor: the post-2000 band.
  const bandStart = xScale(2000);
  const bandEnd = xScale(END_YEAR + 1);

  // Palette / legend — a small ramp strip across the bottom-right of the plot.
  const legendW = Math.min(120, iw * 0.4);
  const legendH = 6;
  const legendX = iw - legendW;
  const legendY = ih + 6;
  const legendStops = 40;

  return (
    <svg width={width} height={height} role="img" aria-label="Climate stripes">
      <Group left={margin.left} top={margin.top}>
        {/* Stripes */}
        <g data-data-layer="true">
          {data.map((d) => (
            <rect
              key={d.year}
              x={xScale(d.year)}
              y={0}
              width={stripeWidth + 0.5 /* avoid sub-pixel gaps */}
              height={ih}
              fill={interpolateRdBuR(d.anomaly)}
            />
          ))}
        </g>

        {/* Year-range label below the plot. Hawkins' original carries no
            labels; we allow the range line as a concession to Explain-panel
            context, rendered in ink-mute tone. */}
        <g data-data-layer="true">
          <text
            x={0}
            y={ih + 14}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
            letterSpacing={0.5}
          >
            {START_YEAR}
          </text>
          <text
            x={iw / 2}
            y={ih + 14}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
            letterSpacing={2}
          >
            ———
          </text>
          <text
            x={iw}
            y={ih + 14}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
            letterSpacing={0.5}
          >
            {END_YEAR}
          </text>
        </g>

        {/* Palette legend strip — visible when the chart is wide enough */}
        <g data-data-layer="true">
          {Array.from({ length: legendStops }).map((_, i) => {
            const t = i / (legendStops - 1);
            const anomaly = COLD_STOP + t * (HOT_STOP - COLD_STOP);
            return (
              <rect
                key={i}
                x={legendX + (i / legendStops) * legendW}
                y={legendY}
                width={legendW / legendStops + 0.5}
                height={legendH}
                fill={interpolateRdBuR(anomaly)}
              />
            );
          })}
        </g>

        {/* Anchor 1: single stripe — representative recent year (2023) */}
        <ExplainAnchor
          selector="stripe"
          index={1}
          pin={{ x: recentX + 20, y: ih / 2 }}
          rect={{
            x: Math.max(0, recentX - 2),
            y: 0,
            width: Math.max(4, stripeWidth + 4),
            height: ih,
          }}
        >
          <rect
            x={recentX - 0.5}
            y={-3}
            width={stripeWidth + 1}
            height={ih + 6}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
        </ExplainAnchor>

        {/* Anchor 2: early-period colour (pale, 1850-1910 era) */}
        <ExplainAnchor
          selector="early-period"
          index={2}
          pin={{ x: earlyX, y: -4 }}
          rect={{
            x: 0,
            y: 0,
            width: Math.max(4, xScale(1910) - xScale(START_YEAR)),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: recent-period colour band (post-2000, uniformly red) */}
        <ExplainAnchor
          selector="recent-period"
          index={3}
          pin={{ x: bandStart + (bandEnd - bandStart) / 2, y: -4 }}
          rect={{
            x: bandStart,
            y: 0,
            width: Math.max(4, bandEnd - bandStart),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: palette / legend ramp */}
        <ExplainAnchor
          selector="palette"
          index={4}
          pin={{ x: legendX - 10, y: legendY + legendH / 2 }}
          rect={{
            x: legendX - 2,
            y: legendY - 2,
            width: legendW + 4,
            height: legendH + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: year range label below the plot */}
        <ExplainAnchor
          selector="year-range"
          index={5}
          pin={{ x: iw / 2, y: ih + 20 }}
          rect={{ x: 0, y: ih + 2, width: iw, height: 16 }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
