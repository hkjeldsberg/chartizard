"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear, scaleLog } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { LinePath } from "@visx/shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// -----------------------------------------------------------------------
// Second-order open-loop transfer function  G(jω) = ωn² / (s² + 2ζωns + ωn²)
// Parameters: ζ = 0.15 (lightly damped), ωn = 10 rad/s
// This gives a clear resonant peak near ω = ωn and a phase that crosses −180°.
// -----------------------------------------------------------------------

const ZETA = 0.15;
const WN = 10;

// Evaluate G(jω) for a second-order system.
// Returns { mag_db, phase_deg }
function evaluate(omega: number): { mag_db: number; phase_deg: number } {
  const u = omega / WN;
  // Magnitude: |G(jω)| = 1 / sqrt((1-u²)² + (2ζu)²)
  const denom = Math.sqrt((1 - u * u) ** 2 + (2 * ZETA * u) ** 2);
  const mag = 1 / denom;
  const mag_db = 20 * Math.log10(mag);
  // Phase: arg G(jω) = -atan2(2ζu, 1-u²)  (in degrees)
  const phase_rad = -Math.atan2(2 * ZETA * u, 1 - u * u);
  const phase_deg = (phase_rad * 180) / Math.PI;
  return { mag_db, phase_deg };
}

// Generate frequency points on a log scale from 0.1 to 200 rad/s.
const NUM_POINTS = 300;
const W_MIN = 0.1;
const W_MAX = 200;

const CURVE_DATA: ReadonlyArray<{ omega: number; mag_db: number; phase_deg: number }> =
  Array.from({ length: NUM_POINTS }, (_, i) => {
    const t = i / (NUM_POINTS - 1);
    const omega = W_MIN * Math.pow(W_MAX / W_MIN, t);
    return { omega, ...evaluate(omega) };
  });

// Gain crossover: |G(jω_gc)| = 0 dB → find where mag_db crosses 0
// For ζ=0.15, ωn=10: gain crossover is slightly above ωn.
// Phase crossover: phase = -180° → occurs at ω = ωn * sqrt(1 - 2ζ²)… actually
// for this 2nd-order system phase → -180° asymptotically (never exactly crosses).
// We'll use the frequency where phase = -170° as an approximate crossing marker.

// Find gain crossover (mag_db nearest 0)
let gcIdx = 0;
let gcDist = Infinity;
CURVE_DATA.forEach((d, i) => {
  if (Math.abs(d.mag_db) < gcDist) {
    gcDist = Math.abs(d.mag_db);
    gcIdx = i;
  }
});
const OMEGA_GC = CURVE_DATA[gcIdx].omega;
const PHASE_AT_GC = CURVE_DATA[gcIdx].phase_deg;
const PHASE_MARGIN = 180 + PHASE_AT_GC; // degrees above -180°

// Find phase crossover (phase nearest -180°)
let pcIdx = 0;
let pcDist = Infinity;
CURVE_DATA.forEach((d, i) => {
  const dist = Math.abs(d.phase_deg - (-180));
  if (dist < pcDist) {
    pcDist = dist;
    pcIdx = i;
  }
});
const OMEGA_PC = CURVE_DATA[pcIdx].omega;
const MAG_AT_PC = CURVE_DATA[pcIdx].mag_db; // negative = stable gain margin
const GAIN_MARGIN = -MAG_AT_PC; // positive dB above 0

// Resonant peak: maximum magnitude
let peakIdx = 0;
let peakMag = -Infinity;
CURVE_DATA.forEach((d, i) => {
  if (d.mag_db > peakMag) {
    peakMag = d.mag_db;
    peakIdx = i;
  }
});
const OMEGA_PEAK = CURVE_DATA[peakIdx].omega;
const MAG_PEAK = CURVE_DATA[peakIdx].mag_db;

// -----------------------------------------------------------------------
// Asymptote data: below ωn, slope ≈ 0 dB/dec; above ωn, slope ≈ -40 dB/dec
// We'll draw the high-frequency asymptote from ωn to W_MAX.
// -----------------------------------------------------------------------
const ASYMP_DATA = [
  { omega: WN, mag_db: 0 },
  { omega: W_MAX, mag_db: -40 * Math.log10(W_MAX / WN) },
];

interface Props {
  width: number;
  height: number;
}

export function BodePlot({ width, height }: Props) {
  const margin = { top: 16, right: 24, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  // Split height: top panel (magnitude) + gap + bottom panel (phase)
  const panelGap = 16;
  const totalInner = Math.max(0, height - margin.top - margin.bottom);
  const magH = Math.max(0, Math.floor((totalInner - panelGap) * 0.55));
  const phaseH = Math.max(0, totalInner - panelGap - magH);
  const phaseTop = magH + panelGap;

  // Shared x-scale (log, angular frequency ω)
  const xScale = useMemo(
    () =>
      scaleLog<number>({
        domain: [W_MIN, W_MAX],
        range: [0, iw],
        base: 10,
      }),
    [iw],
  );

  // Magnitude y-scale (linear dB)
  const magYScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [-80, 30],
        range: [magH, 0],
        nice: true,
      }),
    [magH],
  );

  // Phase y-scale (linear degrees)
  const phaseYScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [-200, 10],
        range: [phaseH, 0],
        nice: true,
      }),
    [phaseH],
  );

  // Derived pixel coordinates for annotations
  const gcX = iw > 0 ? xScale(OMEGA_GC) : 0;
  const pcX = iw > 0 ? xScale(OMEGA_PC) : 0;
  const peakX = iw > 0 ? xScale(OMEGA_PEAK) : 0;
  const peakY = magH > 0 ? magYScale(MAG_PEAK) : 0;
  const mag0Y = magH > 0 ? magYScale(0) : 0;
  const mag_at_pc_Y = magH > 0 ? magYScale(MAG_AT_PC) : 0;
  const phase180Y = phaseH > 0 ? phaseYScale(-180) : 0;
  const phase_at_gc_Y = phaseH > 0 ? phaseYScale(PHASE_AT_GC) : 0;

  // Asymptote pixel coords
  const asympPx = ASYMP_DATA.map((d) => ({
    x: iw > 0 ? xScale(d.omega) : 0,
    y: magH > 0 ? magYScale(d.mag_db) : 0,
  }));

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Bode plot showing magnitude and phase of a second-order open-loop transfer function"
    >
      <Group left={margin.left} top={margin.top}>
        {/* ================================================================
            MAGNITUDE PANEL (top)
            ================================================================ */}
        <g data-data-layer="true">
          {/* 0 dB reference line */}
          <line
            x1={0}
            x2={iw}
            y1={mag0Y}
            y2={mag0Y}
            stroke="var(--color-hairline)"
            strokeDasharray="4 3"
          />
          {/* Gridlines at -20, -40, -60, -80 dB */}
          {[-20, -40, -60, -80].map((db) => (
            <line
              key={db}
              x1={0}
              x2={iw}
              y1={magYScale(db)}
              y2={magYScale(db)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* 1. Magnitude curve */}
        <ExplainAnchor
          selector="magnitude-panel"
          index={1}
          pin={{ x: Math.min(iw - 10, peakX + 16), y: Math.max(4, peakY - 16) }}
          rect={{ x: 0, y: 0, width: iw, height: magH }}
        >
          <g data-data-layer="true">
            <LinePath
              data={CURVE_DATA as { omega: number; mag_db: number; phase_deg: number }[]}
              x={(d) => (iw > 0 ? xScale(d.omega) : 0)}
              y={(d) => (magH > 0 ? magYScale(d.mag_db) : 0)}
              stroke="var(--color-ink)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </ExplainAnchor>

        {/* Magnitude axis */}
        <AxisLeft
          top={0}
          scale={magYScale}
          numTicks={5}
          stroke="var(--color-ink-mute)"
          tickStroke="var(--color-ink-mute)"
          tickLabelProps={() => ({
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            fill: "var(--color-ink-soft)",
            textAnchor: "end",
            dx: "-0.33em",
            dy: "0.33em",
          })}
        />
        <text
          x={-38}
          y={magH / 2}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-mute)"
          transform={`rotate(-90, -38, ${magH / 2})`}
        >
          dB
        </text>

        {/* 2. Resonant peak annotation */}
        <ExplainAnchor
          selector="resonant-peak"
          index={2}
          pin={{ x: Math.min(iw - 10, peakX + 14), y: Math.max(4, peakY - 14) }}
          rect={{
            x: Math.max(0, peakX - 20),
            y: Math.max(0, peakY - 10),
            width: Math.min(40, iw),
            height: Math.min(30, magH),
          }}
        >
          <g data-data-layer="true">
            <circle cx={peakX} cy={peakY} r={3.5} fill="var(--color-ink)" />
            <text
              x={peakX + 6}
              y={peakY - 2}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              {`+${MAG_PEAK.toFixed(1)} dB`}
            </text>
          </g>
        </ExplainAnchor>

        {/* 3. Gain margin annotation */}
        <ExplainAnchor
          selector="gain-margin"
          index={3}
          pin={{ x: Math.min(iw - 10, pcX + 14), y: Math.max(0, (mag0Y + mag_at_pc_Y) / 2) }}
          rect={{
            x: Math.max(0, pcX - 4),
            y: Math.min(mag0Y, mag_at_pc_Y),
            width: Math.min(iw - Math.max(0, pcX - 4), 8),
            height: Math.abs(mag0Y - mag_at_pc_Y) + 4,
          }}
        >
          <g data-data-layer="true">
            {/* Vertical line at phase-crossover frequency in magnitude panel */}
            <line
              x1={pcX}
              x2={pcX}
              y1={mag_at_pc_Y}
              y2={mag0Y}
              stroke="var(--color-ink)"
              strokeWidth={1.5}
              strokeDasharray="3 2"
            />
            <circle cx={pcX} cy={mag_at_pc_Y} r={3} fill="none" stroke="var(--color-ink)" strokeWidth={1.5} />
            <text
              x={pcX + 5}
              y={(mag0Y + mag_at_pc_Y) / 2}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
              dominantBaseline="central"
            >
              {`GM ${GAIN_MARGIN.toFixed(1)} dB`}
            </text>
          </g>
        </ExplainAnchor>

        {/* 4. Asymptote (−40 dB/decade slope above ωn) */}
        <ExplainAnchor
          selector="asymptote"
          index={4}
          pin={{
            x: Math.min(iw - 10, asympPx[1].x - 20),
            y: Math.max(0, asympPx[1].y - 16),
          }}
          rect={{
            x: Math.max(0, asympPx[0].x),
            y: Math.min(asympPx[0].y, asympPx[1].y),
            width: Math.min(iw - Math.max(0, asympPx[0].x), asympPx[1].x - asympPx[0].x),
            height: Math.abs(asympPx[1].y - asympPx[0].y) + 4,
          }}
        >
          <g data-data-layer="true">
            <line
              x1={asympPx[0].x}
              y1={asympPx[0].y}
              x2={asympPx[1].x}
              y2={asympPx[1].y}
              stroke="var(--color-ink-mute)"
              strokeWidth={1.2}
              strokeDasharray="6 3"
            />
            <text
              x={Math.min(iw - 10, (asympPx[0].x + asympPx[1].x) / 2 + 4)}
              y={(asympPx[0].y + asympPx[1].y) / 2 - 6}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              -40 dB/dec
            </text>
          </g>
        </ExplainAnchor>

        {/* ================================================================
            PHASE PANEL (bottom)
            ================================================================ */}
        <Group top={phaseTop}>
          <g data-data-layer="true">
            {/* -180° reference line */}
            <line
              x1={0}
              x2={iw}
              y1={phase180Y}
              y2={phase180Y}
              stroke="var(--color-hairline)"
              strokeDasharray="4 3"
            />
            {/* Gridlines at -90° */}
            {[-90].map((deg) => (
              <line
                key={deg}
                x1={0}
                x2={iw}
                y1={phaseYScale(deg)}
                y2={phaseYScale(deg)}
                stroke="var(--color-hairline)"
                strokeDasharray="2 3"
              />
            ))}
          </g>

          {/* 5. Phase curve */}
          <ExplainAnchor
            selector="phase-panel"
            index={5}
            pin={{ x: iw > 60 ? iw - 60 : 0, y: Math.max(4, phaseYScale(-150) - 16) }}
            rect={{ x: 0, y: 0, width: iw, height: phaseH }}
          >
            <g data-data-layer="true">
              <LinePath
                data={CURVE_DATA as { omega: number; mag_db: number; phase_deg: number }[]}
                x={(d) => (iw > 0 ? xScale(d.omega) : 0)}
                y={(d) => (phaseH > 0 ? phaseYScale(d.phase_deg) : 0)}
                stroke="var(--color-ink)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* -180° label */}
              <text
                x={4}
                y={phase180Y - 3}
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-mute)"
              >
                -180°
              </text>
            </g>
          </ExplainAnchor>

          {/* 6. Phase margin annotation */}
          <ExplainAnchor
            selector="phase-margin"
            index={6}
            pin={{ x: Math.min(iw - 10, gcX + 14), y: Math.max(0, (phase180Y + phase_at_gc_Y) / 2) }}
            rect={{
              x: Math.max(0, gcX - 4),
              y: Math.min(phase180Y, phase_at_gc_Y),
              width: Math.min(iw - Math.max(0, gcX - 4), 8),
              height: Math.abs(phase180Y - phase_at_gc_Y) + 4,
            }}
          >
            <g data-data-layer="true">
              {/* Vertical bracket at gain-crossover frequency in phase panel */}
              <line
                x1={gcX}
                x2={gcX}
                y1={phase_at_gc_Y}
                y2={phase180Y}
                stroke="var(--color-ink)"
                strokeWidth={1.5}
                strokeDasharray="3 2"
              />
              <circle cx={gcX} cy={phase_at_gc_Y} r={3} fill="none" stroke="var(--color-ink)" strokeWidth={1.5} />
              <text
                x={gcX + 5}
                y={(phase180Y + phase_at_gc_Y) / 2}
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-mute)"
                dominantBaseline="central"
              >
                {`PM ${PHASE_MARGIN.toFixed(1)}°`}
              </text>
            </g>
          </ExplainAnchor>

          {/* Phase axis */}
          <AxisLeft
            top={0}
            scale={phaseYScale}
            numTicks={4}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "end",
              dx: "-0.33em",
              dy: "0.33em",
            })}
          />
          <text
            x={-38}
            y={phaseH / 2}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
            transform={`rotate(-90, -38, ${phaseH / 2})`}
          >
            deg
          </text>

          {/* Shared X-axis at bottom of phase panel */}
          <AxisBottom
            top={phaseH}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => {
              const n = Number(v);
              if (n >= 100) return `${n}`;
              if (n >= 10) return `${n}`;
              return `${n}`;
            }}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "middle",
              dy: "0.33em",
            })}
          />
          <text
            x={iw / 2}
            y={phaseH + 36}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            ω (rad/s)
          </text>
        </Group>
      </Group>
    </svg>
  );
}
