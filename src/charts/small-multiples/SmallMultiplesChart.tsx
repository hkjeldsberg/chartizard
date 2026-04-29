"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { line as d3Line, curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// -----------------------------------------------------------------------------
// Data — 9 US states, monthly unemployment rate Jan-2008 through Dec-2024.
// Seeded synthetic series that reproduce the key recessional structure:
//   - flat pre-2008 baseline
//   - 2008-09 recession spike (peaks ~late 2009)
//   - long slow decline through the 2010s
//   - sharp COVID spike in Apr-2020
//   - fast recovery through 2021-2024
// Michigan's 2008-09 amplitude and Nevada-like COVID amplitudes are made
// visibly larger than the milder states (TX, WA, GA) so the "which series
// diverges" read is the story.
// -----------------------------------------------------------------------------

interface StateSpec {
  code: string;
  name: string;
  baseline: number;     // pre-recession steady rate
  recession: number;    // peak uplift during 2008-09
  covid: number;        // peak uplift during 2020
  drift: number;        // 2015-2019 trend term (negative = improvement)
  seed: number;
}

const STATES: ReadonlyArray<StateSpec> = [
  { code: "CA", name: "California",  baseline: 5.2, recession: 7.0,  covid: 11.5, drift: -1.0, seed: 11 },
  { code: "TX", name: "Texas",       baseline: 4.5, recession: 3.8,  covid: 7.8,  drift: -0.6, seed: 23 },
  { code: "NY", name: "New York",    baseline: 4.8, recession: 4.2,  covid: 11.0, drift: -0.7, seed: 41 },
  { code: "FL", name: "Florida",     baseline: 4.0, recession: 7.2,  covid: 9.5,  drift: -1.2, seed: 59 },
  { code: "IL", name: "Illinois",    baseline: 5.4, recession: 6.0,  covid: 11.2, drift: -0.8, seed: 79 },
  { code: "MI", name: "Michigan",    baseline: 6.6, recession: 8.6,  covid: 16.8, drift: -1.4, seed: 97 },
  { code: "GA", name: "Georgia",     baseline: 4.6, recession: 5.6,  covid: 7.2,  drift: -0.9, seed: 113 },
  { code: "WA", name: "Washington",  baseline: 4.6, recession: 4.4,  covid: 9.0,  drift: -0.9, seed: 131 },
  { code: "OH", name: "Ohio",        baseline: 5.0, recession: 6.0,  covid: 14.5, drift: -0.7, seed: 149 },
];

// Month index: 0 = Jan 2008, 203 = Dec 2024 (17y * 12 = 204 points).
const N_MONTHS = 204;
const RECESSION_PEAK = 22;   // Nov 2009
const RECESSION_WIDTH = 18;  // months
const COVID_PEAK = 148;      // Apr 2020
const COVID_WIDTH = 2.5;     // months — sharp

function makeRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function gaussBump(t: number, peak: number, width: number, amp: number) {
  const u = (t - peak) / width;
  return amp * Math.exp(-0.5 * u * u);
}

interface Point {
  t: number;         // month index
  rate: number;      // unemployment percent
}

function generateSeries(spec: StateSpec): Point[] {
  const rand = makeRand(spec.seed);
  const pts: Point[] = [];
  for (let t = 0; t < N_MONTHS; t++) {
    // pre-recession flat, then slow drift through recovery
    const postRecession = t > 40 ? Math.min((t - 40) / 72, 1) * spec.drift : 0;
    const baseTrend = spec.baseline + postRecession;
    const recessionBump = gaussBump(t, RECESSION_PEAK, RECESSION_WIDTH, spec.recession);
    // COVID is asymmetric — fast up, slower down. Use two half-gaussians.
    let covidBump: number;
    if (t <= COVID_PEAK) {
      covidBump = gaussBump(t, COVID_PEAK, COVID_WIDTH, spec.covid);
    } else {
      covidBump = gaussBump(t, COVID_PEAK, COVID_WIDTH * 5, spec.covid);
    }
    const noise = (rand() - 0.5) * 0.4;
    const rate = Math.max(2.0, baseTrend + recessionBump + covidBump + noise);
    pts.push({ t, rate });
  }
  return pts;
}

interface Props {
  width: number;
  height: number;
}

export function SmallMultiplesChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const seriesByState = useMemo(
    () => STATES.map((s) => ({ spec: s, points: generateSeries(s) })),
    [],
  );

  // Shared global domain — this is the whole point of a small multiples grid.
  const yMax = 18;
  const xScale = scaleLinear({ domain: [0, N_MONTHS - 1], range: [0, 0] }); // range set per-panel
  const yScale = scaleLinear({ domain: [0, yMax], range: [0, 0] }); // range set per-panel

  // 3x3 grid geometry
  const COLS = 3;
  const ROWS = 3;
  const GAP_X = 10;
  const GAP_Y = 14;
  const cellW = Math.max(0, (iw - GAP_X * (COLS - 1)) / COLS);
  const cellH = Math.max(0, (ih - GAP_Y * (ROWS - 1)) / ROWS);

  // Per-panel inner padding — leaves room for axis ticks on outer panels and
  // a panel label at the top of every panel.
  const panelPad = { top: 14, right: 4, bottom: 14, left: 8 };
  const panelIw = Math.max(0, cellW - panelPad.left - panelPad.right);
  const panelIh = Math.max(0, cellH - panelPad.top - panelPad.bottom);

  const px = scaleLinear({ domain: [0, N_MONTHS - 1], range: [0, panelIw] });
  const py = scaleLinear({ domain: [0, yMax], range: [panelIh, 0] });

  // Use xScale/yScale for anchors/labels that reference shared-scale concept.
  // (silence unused-var warnings for the shared scale helpers)
  void xScale;
  void yScale;

  const lineGen = d3Line<Point>()
    .x((d) => px(d.t))
    .y((d) => py(d.rate))
    .curve(curveMonotoneX);

  const cellOrigin = (row: number, col: number) => ({
    x: col * (cellW + GAP_X),
    y: row * (cellH + GAP_Y),
  });

  // COVID spike x-position (shared across all panels)
  const covidX = px(COVID_PEAK);

  // Diverging-series anchor: Michigan is row 1 col 2 (index 5)
  const michIdx = 5;
  const michRow = Math.floor(michIdx / COLS);
  const michCol = michIdx % COLS;
  const michOrigin = cellOrigin(michRow, michCol);
  const michSeries = seriesByState[michIdx];
  const michCovidY = py(michSeries.points[COVID_PEAK].rate);

  // First-column y-axis cells
  const firstColOrigins = Array.from({ length: ROWS }, (_, r) => cellOrigin(r, 0));

  // Clamp helper for anchor rects
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  // Panel-label anchor target (top-left panel, CA)
  const labelPanelOrigin = cellOrigin(0, 0);

  return (
    <svg width={width} height={height} role="img" aria-label="Small multiples chart">
      <Group left={margin.left} top={margin.top}>
        {/* Grid of panels — data layer */}
        <g data-data-layer="true">
          {seriesByState.map((s, i) => {
            const row = Math.floor(i / COLS);
            const col = i % COLS;
            const o = cellOrigin(row, col);
            const isDiverging = i === michIdx;
            return (
              <g
                key={s.spec.code}
                transform={`translate(${o.x + panelPad.left}, ${o.y + panelPad.top})`}
              >
                {/* Panel frame */}
                <rect
                  x={-panelPad.left + 0.5}
                  y={-panelPad.top + 0.5}
                  width={cellW - 1}
                  height={cellH - 1}
                  fill="none"
                  stroke="var(--color-hairline)"
                />
                {/* Panel label (state code) */}
                <text
                  x={0}
                  y={-4}
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fontWeight={500}
                  fill="var(--color-ink)"
                >
                  {s.spec.code}
                </text>
                {/* COVID reference tick — dashed vertical at Apr 2020 */}
                <line
                  x1={px(COVID_PEAK)}
                  y1={0}
                  x2={px(COVID_PEAK)}
                  y2={panelIh}
                  stroke="var(--color-hairline)"
                  strokeDasharray="1 3"
                />
                {/* Series */}
                <path
                  d={lineGen(s.points) ?? ""}
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeWidth={isDiverging ? 1.6 : 1.1}
                  strokeOpacity={isDiverging ? 1 : 0.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Bottom-row mini x-axis */}
                {row === ROWS - 1 && (
                  <AxisBottom
                    top={panelIh}
                    scale={px}
                    numTicks={3}
                    tickFormat={(v) => {
                      const year = 2008 + Math.floor(Number(v) / 12);
                      return String(year);
                    }}
                    stroke="var(--color-ink-mute)"
                    tickStroke="var(--color-ink-mute)"
                    tickLength={3}
                    tickLabelProps={() => ({
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      fill: "var(--color-ink-soft)",
                      textAnchor: "middle",
                      dy: "0.33em",
                    })}
                  />
                )}

                {/* First-column mini y-axis */}
                {col === 0 && (
                  <AxisLeft
                    scale={py}
                    numTicks={3}
                    tickFormat={(v) => `${v}%`}
                    stroke="var(--color-ink-mute)"
                    tickStroke="var(--color-ink-mute)"
                    tickLength={3}
                    tickLabelProps={() => ({
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      fill: "var(--color-ink-soft)",
                      textAnchor: "end",
                      dx: "-0.33em",
                      dy: "0.33em",
                    })}
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Anchor 1 — a single panel (top-left, California) */}
        <ExplainAnchor
          selector="panel"
          index={1}
          pin={{
            x: clamp(labelPanelOrigin.x + panelPad.left + 18, 0, iw),
            y: clamp(labelPanelOrigin.y + panelPad.top + 4, 0, ih),
          }}
          rect={{
            x: clamp(labelPanelOrigin.x, 0, iw),
            y: clamp(labelPanelOrigin.y, 0, ih),
            width: clamp(cellW, 0, iw),
            height: clamp(cellH, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2 — panel label (state code, top-left cell) */}
        <ExplainAnchor
          selector="panel-label"
          index={2}
          pin={{
            x: clamp(labelPanelOrigin.x + panelPad.left + 24, 0, iw),
            y: clamp(labelPanelOrigin.y + panelPad.top - 10, 0, ih),
          }}
          rect={{
            x: clamp(labelPanelOrigin.x + panelPad.left - 2, 0, iw),
            y: clamp(labelPanelOrigin.y + 2, 0, ih),
            width: clamp(42, 0, iw),
            height: clamp(panelPad.top - 2, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — shared y-scale (first column y-axes band) */}
        <ExplainAnchor
          selector="shared-scale"
          index={3}
          pin={{
            x: clamp(firstColOrigins[1].x + panelPad.left - 16, 0, iw),
            y: clamp(firstColOrigins[1].y + cellH / 2, 0, ih),
          }}
          rect={{
            x: clamp(0, 0, iw),
            y: clamp(0, 0, ih),
            width: clamp(panelPad.left + 2, 0, iw),
            height: clamp(ih, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4 — COVID spike (dashed x reference across all panels) */}
        <ExplainAnchor
          selector="covid-spike"
          index={4}
          pin={{
            x: clamp(cellOrigin(0, 1).x + panelPad.left + covidX, 0, iw),
            y: clamp(cellOrigin(0, 1).y + panelPad.top - 10, 0, ih),
          }}
          rect={{
            x: clamp(cellOrigin(0, 0).x + panelPad.left + covidX - 3, 0, iw),
            y: clamp(0, 0, ih),
            width: clamp(6, 0, iw),
            height: clamp(ih, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — diverging series (Michigan panel and its COVID peak) */}
        <ExplainAnchor
          selector="diverging-series"
          index={5}
          pin={{
            x: clamp(michOrigin.x + panelPad.left + covidX + 14, 0, iw),
            y: clamp(michOrigin.y + panelPad.top + michCovidY - 4, 0, ih),
          }}
          rect={{
            x: clamp(michOrigin.x, 0, iw),
            y: clamp(michOrigin.y, 0, ih),
            width: clamp(cellW, 0, iw),
            height: clamp(cellH, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6 — grid layout (the 3x3 structure itself) */}
        <ExplainAnchor
          selector="grid"
          index={6}
          pin={{
            x: clamp(iw / 2, 0, iw),
            y: clamp(ih + 28, 0, ih + margin.bottom),
          }}
          rect={{
            x: clamp(0, 0, iw),
            y: clamp(ih, 0, ih),
            width: clamp(iw, 0, iw),
            height: clamp(margin.bottom - 4, 0, margin.bottom),
          }}
        >
          <text
            x={iw / 2}
            y={ih + 30}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            MONTHLY UNEMPLOYMENT RATE · 2008—2024
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
