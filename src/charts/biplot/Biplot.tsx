"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ---------------------------------------------------------------------------
// Pre-computed PCA biplot — Gabriel (1971), Biometrika 58(3).
//
// 5 variables: Length, Width, Height, Weight, Volume.
// Variable loading matrix (hand-picked to encode correlation structure):
//   Length  → (0.80, 0.20)
//   Width   → (0.70, 0.10)
//   Height  → (0.50, 0.40)
//   Weight  → (0.20, 0.90)
//   Volume  → (0.90, 0.30)
//
// Observation projection:
//   PC1 = (0.5, 0.5, 0.3, 0.1, 0.7) / |norm|   ≈ (0.44, 0.44, 0.26, 0.09, 0.61)
//   PC2 = (0.3, 0.2, 0.4, 0.9, 0.1) / |norm|   ≈ (0.28, 0.18, 0.37, 0.83, 0.09)
// ---------------------------------------------------------------------------

function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

interface Observation {
  pc1: number;
  pc2: number;
}

interface Variable {
  name: string;
  lx: number;
  ly: number;
}

// Projection vectors (normalised)
const RAW_PC1 = [0.5, 0.5, 0.3, 0.1, 0.7];
const RAW_PC2 = [0.3, 0.2, 0.4, 0.9, 0.1];

function normalise(v: number[]): number[] {
  const mag = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return v.map((x) => x / mag);
}

const PC1 = normalise(RAW_PC1); // [0.444, 0.444, 0.266, 0.089, 0.621]
const PC2 = normalise(RAW_PC2); // [0.277, 0.185, 0.370, 0.831, 0.092]

function generateObservations(): Observation[] {
  const rand = lcg(271);
  const obs: Observation[] = [];

  for (let i = 0; i < 40; i++) {
    // Simulate 5 correlated raw variables (Length, Width, Height, Weight, Volume)
    const r = () => rand() * 2 - 1;
    const base = rand() * 2 - 1; // shared factor
    const length = base + r() * 0.3;
    const width = base * 0.85 + r() * 0.35;
    const height = base * 0.7 + r() * 0.4;
    const weight = r() * 0.9 + base * 0.3; // less correlated with size
    const volume = length * 0.5 + width * 0.3 + height * 0.2 + r() * 0.2;

    const raw = [length, width, height, weight, volume];

    // Project onto PC1 and PC2
    const pc1 = raw.reduce((s, v, j) => s + v * (PC1[j] ?? 0), 0);
    const pc2 = raw.reduce((s, v, j) => s + v * (PC2[j] ?? 0), 0);
    obs.push({ pc1, pc2 });
  }
  return obs;
}

// Variable loadings — scale factor for arrow visibility
const ARROW_SCALE = 2.2;

const VARIABLES: Variable[] = [
  { name: "LENGTH", lx: 0.80 * ARROW_SCALE, ly: 0.20 * ARROW_SCALE },
  { name: "WIDTH",  lx: 0.70 * ARROW_SCALE, ly: 0.10 * ARROW_SCALE },
  { name: "HEIGHT", lx: 0.50 * ARROW_SCALE, ly: 0.40 * ARROW_SCALE },
  { name: "WEIGHT", lx: 0.20 * ARROW_SCALE, ly: 0.90 * ARROW_SCALE },
  { name: "VOLUME", lx: 0.90 * ARROW_SCALE, ly: 0.30 * ARROW_SCALE },
];

// ---------------------------------------------------------------------------
// Arrowhead helper
// ---------------------------------------------------------------------------

function arrowHead(tx: number, ty: number, sx: number, sy: number, size = 6): string {
  // direction from origin to tip
  const dx = tx - sx;
  const dy = ty - sy;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1e-6) return "";
  const ux = dx / len;
  const uy = dy / len;
  // perpendicular
  const px = -uy;
  const py = ux;
  const base = size * 0.45;
  // arrowhead triangle: tip + two base points
  const bx = tx - ux * size;
  const by = ty - uy * size;
  return `M ${tx} ${ty} L ${bx + px * base} ${by + py * base} L ${bx - px * base} ${by - py * base} Z`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  width: number;
  height: number;
}

export function Biplot({ width, height }: Props) {
  const margin = { top: 24, right: 24, bottom: 44, left: 52 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const observations = useMemo<Observation[]>(() => generateObservations(), []);

  // Domain: cover both observations and arrow tips
  const allX = [
    ...observations.map((o) => o.pc1),
    ...VARIABLES.map((v) => v.lx),
    ...VARIABLES.map((v) => -v.lx * 0.1), // small negative range for origin
  ];
  const allY = [
    ...observations.map((o) => o.pc2),
    ...VARIABLES.map((v) => v.ly),
    ...VARIABLES.map((v) => -v.ly * 0.1),
  ];

  const xPad = 0.3;
  const yPad = 0.3;
  const xMin = Math.min(...allX) - xPad;
  const xMax = Math.max(...allX) + xPad;
  const yMin = Math.min(...allY) - yPad;
  const yMax = Math.max(...allY) + yPad;

  const xScale = scaleLinear({ domain: [xMin, xMax], range: [0, iw], nice: true });
  const yScale = scaleLinear({ domain: [yMin, yMax], range: [ih, 0], nice: true });

  const xs = (v: number) => xScale(v);
  const ys = (v: number) => yScale(v);

  const originX = xs(0);
  const originY = ys(0);

  // Anchor observations: pick one representative dot (index 10)
  const repObs = observations[10] ?? observations[0]!;
  const repObsSx = xs(repObs.pc1);
  const repObsSy = ys(repObs.pc2);

  // Pick a representative variable arrow: Volume (most prominent)
  const repVar = VARIABLES[4]!; // VOLUME
  const repVarTipSx = xs(repVar.lx);
  const repVarTipSy = ys(repVar.ly);

  // Pick two arrows to illustrate angle-between-arrows: Length and Width
  const lenVar = VARIABLES[0]!;
  const widVar = VARIABLES[1]!;
  const lenTipSx = xs(lenVar.lx);
  const lenTipSy = ys(lenVar.ly);
  const widTipSx = xs(widVar.lx);
  const widTipSy = ys(widVar.ly);
  // Mid-angle pin
  const anglePinX = (lenTipSx + widTipSx) / 2;
  const anglePinY = (lenTipSy + widTipSy) / 2 - 14;

  const ticksY = yScale.ticks(4);

  return (
    <svg width={width} height={height} role="img" aria-label="Biplot — PCA observations and variable loadings">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {ticksY.map((t) => (
            <line
              key={`yg-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* PC1 axis line (horizontal through origin) */}
        <g data-data-layer="true">
          <line
            x1={0}
            x2={iw}
            y1={originY}
            y2={originY}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="1 3"
          />
        </g>

        {/* PC2 axis line (vertical through origin) */}
        <g data-data-layer="true">
          <line
            x1={originX}
            x2={originX}
            y1={0}
            y2={ih}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="1 3"
          />
        </g>

        {/* Observation dots */}
        <g data-data-layer="true">
          {observations.map((o, i) => (
            <circle
              key={i}
              cx={xs(o.pc1)}
              cy={ys(o.pc2)}
              r={2.4}
              fill="var(--color-ink)"
              fillOpacity={0.45}
            />
          ))}
        </g>

        {/* Variable loading arrows */}
        <g data-data-layer="true">
          {VARIABLES.map((v) => {
            const tx = xs(v.lx);
            const ty = ys(v.ly);
            return (
              <g key={v.name}>
                <line
                  x1={originX}
                  y1={originY}
                  x2={tx}
                  y2={ty}
                  stroke="var(--color-ink)"
                  strokeWidth={1.5}
                  strokeOpacity={0.8}
                />
                <path
                  d={arrowHead(tx, ty, originX, originY, 6)}
                  fill="var(--color-ink)"
                  fillOpacity={0.8}
                />
                <text
                  x={tx + (tx >= originX ? 5 : -5)}
                  y={ty + (ty <= originY ? -5 : 5)}
                  fontFamily="var(--font-mono)"
                  fontSize={8}
                  fill="var(--color-ink)"
                  textAnchor={tx >= originX ? "start" : "end"}
                >
                  {v.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* Origin mark */}
        <g data-data-layer="true">
          <circle cx={originX} cy={originY} r={2.5} fill="var(--color-ink)" />
        </g>

        {/* ── ExplainAnchors ── */}

        {/* 1. PC1 axis */}
        <ExplainAnchor
          selector="pc1-axis"
          index={1}
          pin={{ x: iw - 10, y: originY - 14 }}
          rect={{ x: 0, y: Math.max(0, originY - 5), width: iw, height: 10 }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. PC2 axis */}
        <ExplainAnchor
          selector="pc2-axis"
          index={2}
          pin={{ x: originX + 14, y: 10 }}
          rect={{ x: Math.max(0, originX - 5), y: 0, width: 10, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Observation dot */}
        <ExplainAnchor
          selector="observation-dot"
          index={3}
          pin={{ x: repObsSx - 14, y: repObsSy - 14 }}
          rect={{ x: repObsSx - 7, y: repObsSy - 7, width: 14, height: 14 }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Variable loading arrow (Volume) */}
        <ExplainAnchor
          selector="loading-arrow"
          index={4}
          pin={{ x: repVarTipSx + 14, y: repVarTipSy - 14 }}
          rect={{
            x: Math.max(0, Math.min(originX, repVarTipSx) - 4),
            y: Math.max(0, Math.min(originY, repVarTipSy) - 4),
            width: Math.min(iw, Math.abs(repVarTipSx - originX) + 8),
            height: Math.min(ih, Math.abs(repVarTipSy - originY) + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Angle between arrows (Length vs Width = small angle → high correlation) */}
        <ExplainAnchor
          selector="arrow-angle"
          index={5}
          pin={{ x: anglePinX, y: anglePinY }}
          rect={{
            x: Math.max(0, Math.min(lenTipSx, widTipSx, originX) - 4),
            y: Math.max(0, Math.min(lenTipSy, widTipSy, originY) - 4),
            width: Math.min(iw, Math.abs(Math.max(lenTipSx, widTipSx) - Math.min(lenTipSx, widTipSx, originX)) + 8),
            height: Math.min(ih, Math.abs(originY - Math.min(lenTipSy, widTipSy)) + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Origin / centroid */}
        <ExplainAnchor
          selector="origin"
          index={6}
          pin={{ x: originX - 16, y: originY + 16 }}
          rect={{ x: Math.max(0, originX - 8), y: Math.max(0, originY - 8), width: 16, height: 16 }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis — rendered directly; PC1 axis ExplainAnchor (index 1) already explains it */}
        <AxisBottom
          top={ih}
          scale={xScale}
          numTicks={4}
          tickFormat={(v) => String(Number(v).toFixed(1))}
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
          PC1 SCORE
        </text>

        {/* Y-axis — rendered directly; PC2 axis ExplainAnchor (index 2) already explains it */}
        <AxisLeft
          scale={yScale}
          numTicks={4}
          tickFormat={(v) => String(Number(v).toFixed(1))}
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
          x={-margin.left + 4}
          y={-10}
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
        >
          PC2 SCORE
        </text>
      </Group>
    </svg>
  );
}
