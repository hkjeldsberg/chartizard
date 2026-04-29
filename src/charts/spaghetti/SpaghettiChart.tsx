"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { line as d3Line, area as d3Area, curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// -----------------------------------------------------------------------------
// ~30 patients, 24 monthly systolic-BP visits. Each patient has:
//   - a baseline around 130 mmHg +/- per-patient intercept
//   - an overall slight downward drift with treatment
//   - visit-to-visit noise that reads as ragged individual trajectories
//   - one deliberate outlier patient (high baseline + climbing)
// No cohort-wide story — the tangle is the finding.
// -----------------------------------------------------------------------------

const N_PATIENTS = 30;
const N_VISITS = 24;
const OUTLIER_ID = 7; // patient index that we'll call out

interface Point {
  visit: number;
  bp: number;
}

interface Patient {
  id: number;
  points: Point[];
}

function makeRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function gauss(rand: () => number) {
  const u = 1 - rand();
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function generatePatients(): Patient[] {
  const rand = makeRand(1729);
  const patients: Patient[] = [];
  for (let i = 0; i < N_PATIENTS; i++) {
    const isOutlier = i === OUTLIER_ID;
    // Per-patient intercept: most sit around 130; outlier starts high (~165).
    const intercept = isOutlier ? 158 : 128 + gauss(rand) * 10;
    // Per-patient slope: cohort drifts slightly down with treatment; outlier
    // drifts UP (medication non-responder).
    const slope = isOutlier ? 0.45 : -0.10 + gauss(rand) * 0.18;
    const noiseSd = 4.5 + Math.abs(gauss(rand)) * 2;
    const patientRand = makeRand(10000 + i * 31);
    const points: Point[] = [];
    for (let v = 0; v < N_VISITS; v++) {
      const bp = intercept + slope * v + gauss(patientRand) * noiseSd;
      points.push({ visit: v, bp });
    }
    patients.push({ id: i, points });
  }
  return patients;
}

interface PatientSummary {
  median: number[];
  q1: number[];
  q3: number[];
}

function summarise(patients: Patient[]): PatientSummary {
  const median: number[] = [];
  const q1: number[] = [];
  const q3: number[] = [];
  for (let v = 0; v < N_VISITS; v++) {
    const values = patients.map((p) => p.points[v].bp).sort((a, b) => a - b);
    const n = values.length;
    const q = (p: number) => {
      const idx = (n - 1) * p;
      const lo = Math.floor(idx);
      const hi = Math.ceil(idx);
      if (lo === hi) return values[lo];
      return values[lo] + (values[hi] - values[lo]) * (idx - lo);
    };
    q1.push(q(0.25));
    median.push(q(0.5));
    q3.push(q(0.75));
  }
  return { median, q1, q3 };
}

interface Props {
  width: number;
  height: number;
}

export function SpaghettiChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const patients = useMemo(() => generatePatients(), []);
  const summary = useMemo(() => summarise(patients), [patients]);

  const xScale = scaleLinear({ domain: [0, N_VISITS - 1], range: [0, iw] });
  const yScale = scaleLinear({ domain: [95, 190], range: [ih, 0], nice: true });

  const lineGen = d3Line<Point>()
    .x((d) => xScale(d.visit))
    .y((d) => yScale(d.bp))
    .curve(curveMonotoneX);

  const medianLineGen = d3Line<{ v: number; y: number }>()
    .x((d) => xScale(d.v))
    .y((d) => yScale(d.y))
    .curve(curveMonotoneX);

  const iqrAreaGen = d3Area<{ v: number; lo: number; hi: number }>()
    .x((d) => xScale(d.v))
    .y0((d) => yScale(d.lo))
    .y1((d) => yScale(d.hi))
    .curve(curveMonotoneX);

  const medianPts = summary.median.map((y, v) => ({ v, y }));
  const iqrPts = summary.median.map((_, v) => ({
    v,
    lo: summary.q1[v],
    hi: summary.q3[v],
  }));

  // Anchor positions
  const repIdx = 14; // a representative patient's trajectory
  const repPatient = patients[repIdx];
  const repMidVisit = 8;
  const repX = xScale(repMidVisit);
  const repY = yScale(repPatient.points[repMidVisit].bp);

  const medMidX = xScale(N_VISITS / 2 - 1);
  const medMidY = yScale(summary.median[Math.floor(N_VISITS / 2 - 1)]);

  const iqrAnchorV = 16;
  const iqrAnchorHi = yScale(summary.q3[iqrAnchorV]);
  const iqrAnchorLo = yScale(summary.q1[iqrAnchorV]);

  // First-visit and last-visit dispersion rails
  const firstVisitBPs = patients.map((p) => p.points[0].bp);
  const firstMin = Math.min(...firstVisitBPs);
  const firstMax = Math.max(...firstVisitBPs);

  const lastVisitBPs = patients.map((p) => p.points[N_VISITS - 1].bp);
  const lastMin = Math.min(...lastVisitBPs);
  const lastMax = Math.max(...lastVisitBPs);

  // Outlier final position
  const outlierPatient = patients[OUTLIER_ID];
  const outlierEndX = xScale(N_VISITS - 1);
  const outlierEndY = yScale(outlierPatient.points[N_VISITS - 1].bp);

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  return (
    <svg width={width} height={height} role="img" aria-label="Spaghetti plot">
      <Group left={margin.left} top={margin.top}>
        {/* Data layer: IQR band, individual trajectories, median, endpoint markers */}
        <g data-data-layer="true">
          {/* Gridlines */}
          {yScale.ticks(5).map((t) => (
            <line
              key={`g-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}

          {/* IQR ribbon */}
          <path
            d={iqrAreaGen(iqrPts) ?? ""}
            fill="var(--color-ink)"
            fillOpacity={0.15}
          />

          {/* Individual patient trajectories — the "spaghetti" */}
          {patients.map((p) => (
            <path
              key={`p-${p.id}`}
              d={lineGen(p.points) ?? ""}
              fill="none"
              stroke="var(--color-ink)"
              strokeOpacity={p.id === OUTLIER_ID ? 0.85 : 0.35}
              strokeWidth={p.id === OUTLIER_ID ? 1.4 : 0.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Median overlay */}
          <path
            d={medianLineGen(medianPts) ?? ""}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Endpoint dots on the outlier (helps the anchor read) */}
          <circle cx={outlierEndX} cy={outlierEndY} r={2.8} fill="var(--color-ink)" />
        </g>

        {/* Anchor 1 — a representative individual trajectory */}
        <ExplainAnchor
          selector="trajectory"
          index={1}
          pin={{
            x: clamp(repX + 14, 0, iw),
            y: clamp(repY - 12, 0, ih),
          }}
          rect={{
            x: clamp(repX - 10, 0, iw),
            y: clamp(repY - 10, 0, ih),
            width: clamp(22, 0, iw),
            height: clamp(22, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2 — median line */}
        <ExplainAnchor
          selector="median-line"
          index={2}
          pin={{
            x: clamp(medMidX + 16, 0, iw),
            y: clamp(medMidY - 12, 0, ih),
          }}
          rect={{
            x: clamp(0, 0, iw),
            y: clamp(medMidY - 6, 0, ih),
            width: clamp(iw, 0, iw),
            height: clamp(12, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — IQR band */}
        <ExplainAnchor
          selector="iqr-band"
          index={3}
          pin={{
            x: clamp(xScale(iqrAnchorV) + 14, 0, iw),
            y: clamp((iqrAnchorHi + iqrAnchorLo) / 2, 0, ih),
          }}
          rect={{
            x: clamp(xScale(iqrAnchorV) - 8, 0, iw),
            y: clamp(iqrAnchorHi, 0, ih),
            width: clamp(16, 0, iw),
            height: clamp(iqrAnchorLo - iqrAnchorHi, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4 — visit-1 dispersion (the starting spread) */}
        <ExplainAnchor
          selector="baseline-dispersion"
          index={4}
          pin={{
            x: clamp(xScale(0) + 14, 0, iw),
            y: clamp(yScale((firstMin + firstMax) / 2) - 14, 0, ih),
          }}
          rect={{
            x: clamp(xScale(0) - 6, 0, iw),
            y: clamp(yScale(firstMax) - 2, 0, ih),
            width: clamp(14, 0, iw),
            height: clamp(yScale(firstMin) - yScale(firstMax) + 4, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — final-visit dispersion (endpoint spread) */}
        <ExplainAnchor
          selector="endpoint-dispersion"
          index={5}
          pin={{
            x: clamp(xScale(N_VISITS - 1) - 18, 0, iw),
            y: clamp(yScale((lastMin + lastMax) / 2) - 14, 0, ih),
          }}
          rect={{
            x: clamp(xScale(N_VISITS - 1) - 10, 0, iw),
            y: clamp(yScale(lastMax) - 2, 0, ih),
            width: clamp(14, 0, iw),
            height: clamp(yScale(lastMin) - yScale(lastMax) + 4, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6 — outlier patient (the climbing non-responder) */}
        <ExplainAnchor
          selector="outlier-patient"
          index={6}
          pin={{
            x: clamp(outlierEndX - 16, 0, iw),
            y: clamp(outlierEndY - 14, 0, ih),
          }}
          rect={{
            x: clamp(outlierEndX - 22, 0, iw),
            y: clamp(outlierEndY - 10, 0, ih),
            width: clamp(22, 0, iw),
            height: clamp(20, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={7}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fill: "var(--color-ink-soft)",
              textAnchor: "end",
              dx: "-0.33em",
              dy: "0.33em",
            })}
          />
          <text
            x={-44}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            mmHg
          </text>
        </ExplainAnchor>

        {/* X-axis — rendered but not anchored. The chart already has seven
            anchors (the 6 data anchors plus the y-axis); a separate x-axis
            anchor would push us past the 7-anchor ceiling. */}
        <AxisBottom
          top={ih}
          scale={xScale}
          numTicks={6}
          tickFormat={(v) => `v${v}`}
          stroke="var(--color-ink-mute)"
          tickStroke="var(--color-ink-mute)"
          tickLabelProps={() => ({
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fill: "var(--color-ink-soft)",
            textAnchor: "middle",
            dy: "0.33em",
          })}
        />
        <text
          x={iw / 2}
          y={ih + 36}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
        >
          VISIT (MONTHLY)
        </text>
      </Group>
    </svg>
  );
}
