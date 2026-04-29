"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";
import { line as d3Line } from "d3-shape";

// -----------------------------------------------------------------------------
// Data — 5 years x 12 months of monthly US retail sales (synthetic, seeded).
// Strong December peak, modest spring shoulder, July dip. Overlaid with a
// gentle year-over-year growth drift so each month's 5-year slope is visible
// once the data is pivoted into per-month panels.
// -----------------------------------------------------------------------------

const N_YEARS = 5;
const N_MONTHS = 12;
const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Seasonal multipliers by month (index 0 = Jan). December spikes; July dips.
const SEASONAL = [
  0.92, 0.88, 0.98, 1.00, 1.04, 0.98,
  0.90, 0.96, 0.99, 1.02, 1.08, 1.42,
];

// Per-month annual drift: retail is growing overall, but apparel/dry-goods
// (Jan, Feb) have gone flat and online-heavy months (Nov, Dec) have grown
// fastest. Mix in a couple of flat/down months so the cycle-plot has
// panels that slope differently.
const MONTHLY_DRIFT = [
   0.2, -0.3,  0.8,  1.4,  1.6,  1.1,
  -0.6,  0.4,  1.2,  2.0,  2.4,  3.2,
];

function makeRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

interface MonthPanelPoint {
  year: number;      // 0..N_YEARS-1
  value: number;
}

interface MonthPanel {
  monthIdx: number;        // 0..11
  label: string;           // 'J' .. 'D'
  name: string;            // 'January' ...
  points: MonthPanelPoint[];
  mean: number;
}

function buildPanels(): MonthPanel[] {
  const rand = makeRand(29);
  const BASE = 320;
  const panels: MonthPanel[] = [];
  for (let m = 0; m < N_MONTHS; m++) {
    const points: MonthPanelPoint[] = [];
    for (let y = 0; y < N_YEARS; y++) {
      const noise = (rand() - 0.5) * 3.2;
      const value = BASE * SEASONAL[m] + MONTHLY_DRIFT[m] * y + noise;
      points.push({ year: y, value });
    }
    const mean = points.reduce((s, p) => s + p.value, 0) / points.length;
    panels.push({
      monthIdx: m,
      label: MONTH_LABELS[m],
      name: MONTH_NAMES[m],
      points,
      mean,
    });
  }
  return panels;
}

interface Props {
  width: number;
  height: number;
}

export function CyclePlotChart({ width, height }: Props) {
  const margin = { top: 22, right: 20, bottom: 44, left: 52 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const panels = useMemo(() => buildPanels(), []);

  // Shared y-domain across all 12 panels — the whole point of the encoding.
  const allValues = panels.flatMap((p) => p.points.map((pt) => pt.value));
  const yMin = Math.floor(Math.min(...allValues) - 4);
  const yMax = Math.ceil(Math.max(...allValues) + 4);

  // 12 panels in a single row. Small horizontal gap between panels so the
  // "one panel per month" reading is immediate.
  const GAP_X = 4;
  const panelW = Math.max(0, (iw - GAP_X * (N_MONTHS - 1)) / N_MONTHS);
  const panelH = ih;

  const yScale = scaleLinear({ domain: [yMin, yMax], range: [panelH, 0] });
  const xScale = scaleLinear({ domain: [0, N_YEARS - 1], range: [0, panelW] });

  const lineGen = d3Line<MonthPanelPoint>()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.value));

  const panelOriginX = (m: number) => m * (panelW + GAP_X);

  // Clamp helper for anchor rects.
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  // Representative panels for anchors.
  const decPanel = panels[11]; // holiday peak
  const decX = panelOriginX(decPanel.monthIdx);

  // Slope = last - first point in that month over 5 years.
  const slopes = panels.map((p) => p.points[N_YEARS - 1].value - p.points[0].value);
  // Pick the panel with the steepest positive slope (excluding December so
  // we don't double up on it) for the "growing month" anchor.
  let growIdx = 0;
  let growBest = -Infinity;
  for (let m = 0; m < N_MONTHS; m++) {
    if (m === decPanel.monthIdx) continue;
    if (slopes[m] > growBest) {
      growBest = slopes[m];
      growIdx = m;
    }
  }
  // And the flattest / most negative slope for the "flat-or-down" anchor.
  let flatIdx = 0;
  let flatBest = Infinity;
  for (let m = 0; m < N_MONTHS; m++) {
    if (slopes[m] < flatBest) {
      flatBest = slopes[m];
      flatIdx = m;
    }
  }
  const growPanel = panels[growIdx];
  const flatPanel = panels[flatIdx];
  const growX = panelOriginX(growPanel.monthIdx);
  const flatX = panelOriginX(flatPanel.monthIdx);

  // Mean-line anchor target — use a mid-year panel so the pin sits in open
  // space rather than on top of December.
  const meanAnchorPanel = panels[4]; // May
  const meanX = panelOriginX(meanAnchorPanel.monthIdx);

  return (
    <svg width={width} height={height} role="img" aria-label="Cycle plot">
      <Group left={margin.left} top={margin.top}>
        {/* Panels — data layer */}
        <g data-data-layer="true">
          {panels.map((p) => {
            const ox = panelOriginX(p.monthIdx);
            const my = yScale(p.mean);
            return (
              <g key={p.monthIdx} transform={`translate(${ox}, 0)`}>
                {/* Per-panel vertical baseline to visually separate the panels */}
                <line
                  x1={0}
                  x2={0}
                  y1={0}
                  y2={panelH}
                  stroke="var(--color-hairline)"
                />
                {/* Month mean reference line */}
                <line
                  x1={0}
                  x2={panelW}
                  y1={my}
                  y2={my}
                  stroke="var(--color-ink-mute)"
                  strokeDasharray="2 3"
                  strokeWidth={1}
                />
                {/* 5-year line */}
                <path
                  d={lineGen(p.points) ?? ""}
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Small end-points to anchor the eye */}
                {p.points.map((pt) => (
                  <circle
                    key={pt.year}
                    cx={xScale(pt.year)}
                    cy={yScale(pt.value)}
                    r={1.3}
                    fill="var(--color-ink)"
                  />
                ))}
                {/* Month label below the panel */}
                <text
                  x={panelW / 2}
                  y={panelH + 14}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fontWeight={500}
                  fill="var(--color-ink)"
                >
                  {p.label}
                </text>
              </g>
            );
          })}
          {/* Right-hand panel closer */}
          <line
            x1={iw}
            x2={iw}
            y1={0}
            y2={panelH}
            stroke="var(--color-hairline)"
          />
        </g>

        {/* Shared y-axis (hand-rolled so it hugs the left of the first panel) */}
        {yScale.ticks(4).map((t) => (
          <g key={t}>
            <line
              x1={-4}
              x2={0}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-ink-mute)"
            />
            <text
              x={-8}
              y={yScale(t)}
              textAnchor="end"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-soft)"
            >
              {t}
            </text>
          </g>
        ))}
        {/* Y-axis spine */}
        <line x1={0} x2={0} y1={0} y2={panelH} stroke="var(--color-ink-mute)" />

        {/* Caption */}
        <text
          x={iw / 2}
          y={ih + 34}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
        >
          MONTHLY RETAIL SALES · 5 YEARS PER PANEL
        </text>

        {/* Anchor 1 — one panel (December, the holiday peak) */}
        <ExplainAnchor
          selector="panel"
          index={1}
          pin={{
            x: clamp(decX + panelW / 2, 0, iw),
            y: clamp(yScale(decPanel.points[0].value) - 14, 0, ih),
          }}
          rect={{
            x: clamp(decX, 0, iw),
            y: clamp(0, 0, ih),
            width: clamp(panelW, 0, iw),
            height: clamp(panelH, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2 — the cross-panel mean line (dashed). Anchor on May's
            mean where the dashed line is in a quiet part of the chart. */}
        <ExplainAnchor
          selector="mean-line"
          index={2}
          pin={{
            x: clamp(meanX + panelW + 14, 0, iw),
            y: clamp(yScale(meanAnchorPanel.mean), 0, ih),
          }}
          rect={{
            x: clamp(meanX - 2, 0, iw),
            y: clamp(yScale(meanAnchorPanel.mean) - 4, 0, ih),
            width: clamp(panelW + 4, 0, iw),
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — growing-slope panel */}
        <ExplainAnchor
          selector="positive-slope"
          index={3}
          pin={{
            x: clamp(growX + panelW / 2, 0, iw),
            y: clamp(yScale(growPanel.points[N_YEARS - 1].value) - 14, 0, ih),
          }}
          rect={{
            x: clamp(growX, 0, iw),
            y: clamp(0, 0, ih),
            width: clamp(panelW, 0, iw),
            height: clamp(panelH, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4 — flat/negative-slope panel */}
        <ExplainAnchor
          selector="flat-slope"
          index={4}
          pin={{
            x: clamp(flatX + panelW / 2, 0, iw),
            y: clamp(yScale(flatPanel.points[0].value) + 18, 0, ih),
          }}
          rect={{
            x: clamp(flatX, 0, iw),
            y: clamp(0, 0, ih),
            width: clamp(panelW, 0, iw),
            height: clamp(panelH, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — month labels row (J F M A M J J A S O N D) */}
        <ExplainAnchor
          selector="month-labels"
          index={5}
          pin={{
            x: clamp(iw / 2, 0, iw),
            y: clamp(ih + 18, 0, ih + margin.bottom),
          }}
          rect={{
            x: clamp(0, 0, iw),
            y: clamp(ih + 4, 0, ih + margin.bottom),
            width: clamp(iw, 0, iw),
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6 — shared y-scale */}
        <ExplainAnchor
          selector="shared-y-scale"
          index={6}
          pin={{
            x: -30,
            y: clamp(panelH / 2, 0, ih),
          }}
          rect={{
            x: -margin.left,
            y: 0,
            width: margin.left,
            height: panelH,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
