"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// pH / E coordinates for each species region. Hand-approximated iron-water
// Pourbaix geometry — not publication-grade, but topologically correct for
// the five-species simplification used in undergraduate corrosion texts.
interface Region {
  id: string;
  label: string;
  // Points are (pH, E in volts).
  points: ReadonlyArray<[number, number]>;
  tint: number; // 0..1 ink-opacity level
  // Label position in (pH, E) space.
  labelAt: [number, number];
}

const REGIONS: ReadonlyArray<Region> = [
  {
    // Aqueous Fe²⁺ — low pH, moderate oxidizing potential
    id: "fe2",
    label: "Fe²⁺",
    points: [
      [0, -0.45],
      [9, -0.45],
      [9, 0.35],
      [6, 0.6],
      [3, 0.8],
      [0, 0.8],
    ],
    tint: 0.06,
    labelAt: [4, 0.05],
  },
  {
    // Aqueous Fe³⁺ — very low pH, high potential
    id: "fe3",
    label: "Fe³⁺",
    points: [
      [0, 0.8],
      [3, 0.8],
      [2.5, 1.2],
      [0, 1.5],
    ],
    tint: 0.18,
    labelAt: [1.2, 1.05],
  },
  {
    // Fe(OH)₂ — mid pH, low potential
    id: "feoh2",
    label: "Fe(OH)₂",
    points: [
      [9, -1.0],
      [13, -1.0],
      [13, 0],
      [9, 0],
      [9, -0.45],
    ],
    tint: 0.1,
    labelAt: [11, -0.55],
  },
  {
    // Fe(OH)₃ / Fe₂O₃ — mid-to-high pH, high potential
    id: "fe2o3",
    label: "Fe₂O₃ / Fe(OH)₃",
    points: [
      [3, 0.8],
      [6, 0.6],
      [9, 0.35],
      [9, 0],
      [13, 0],
      [14, 0],
      [14, 1.5],
      [2.5, 1.2],
    ],
    tint: 0.14,
    labelAt: [9.5, 0.85],
  },
  {
    // Bare iron — any pH, very low potential
    id: "fe",
    label: "Fe",
    points: [
      [0, -1.0],
      [9, -1.0],
      [9, -0.45],
      [0, -0.45],
    ],
    tint: 0.22,
    labelAt: [4, -0.75],
  },
];

export function PourbaixDiagram({ width, height }: Props) {
  const margin = { top: 18, right: 20, bottom: 40, left: 44 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 14], range: [0, iw] });
  const yScale = scaleLinear({ domain: [-1.0, 1.5], range: [ih, 0] });

  // Map a (pH, E) polygon to a "x,y x,y …" points string.
  function toSvgPoints(pts: ReadonlyArray<[number, number]>): string {
    return pts.map(([ph, E]) => `${xScale(ph)},${yScale(E)}`).join(" ");
  }

  // Water-stability reference lines: E = 1.23 − 0.059·pH (upper), E = −0.059·pH (lower).
  const upperFrom = { x: xScale(0), y: yScale(1.23) };
  const upperTo = { x: xScale(14), y: yScale(1.23 - 0.059 * 14) };
  const lowerFrom = { x: xScale(0), y: yScale(0) };
  const lowerTo = { x: xScale(14), y: yScale(-0.059 * 14) };

  // Pre-compute anchor geometry for the Fe²⁺ region, clamped to plot area.
  const fe2 = REGIONS.find((r) => r.id === "fe2")!;
  const fe2Xs = fe2.points.map(([ph]) => xScale(ph));
  const fe2Ys = fe2.points.map(([, E]) => yScale(E));
  const fe2X = Math.max(0, Math.min(iw, Math.min(...fe2Xs)));
  const fe2Y = Math.max(0, Math.min(ih, Math.min(...fe2Ys)));
  const fe2W = Math.max(0, Math.min(iw, Math.max(...fe2Xs)) - fe2X);
  const fe2H = Math.max(0, Math.min(ih, Math.max(...fe2Ys)) - fe2Y);

  // Species-boundary anchor — the Fe²⁺ / Fe(OH)₂ vertical edge at pH ≈ 9
  // between E = -0.45 and E = 0.
  const boundaryX = xScale(9);
  const boundaryY0 = yScale(0);
  const boundaryY1 = yScale(-0.45);

  // Corrosion/passivation/immunity concept anchor — pin on the Fe metal cell
  // to represent the three-zone reading.
  const fe = REGIONS.find((r) => r.id === "fe")!;
  const feLabelX = xScale(fe.labelAt[0]);
  const feLabelY = yScale(fe.labelAt[1]);

  return (
    <svg width={width} height={height} role="img" aria-label="Pourbaix diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Plot backdrop */}
        <rect x={0} y={0} width={iw} height={ih} fill="var(--color-surface)" />

        {/* Species regions */}
        <g data-data-layer="true">
          {REGIONS.map((r) => (
            <polygon
              key={r.id}
              points={toSvgPoints(r.points)}
              fill="var(--color-ink)"
              fillOpacity={r.tint}
              stroke="var(--color-ink)"
              strokeWidth={1}
              strokeOpacity={0.55}
            />
          ))}

          {/* Region labels */}
          {REGIONS.map((r) => (
            <text
              key={`lbl-${r.id}`}
              x={xScale(r.labelAt[0])}
              y={yScale(r.labelAt[1])}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fontWeight={600}
              fill="var(--color-ink)"
            >
              {r.label}
            </text>
          ))}
        </g>

        {/* Water stability reference lines (dashed) */}
        <g data-data-layer="true">
          <line
            x1={upperFrom.x}
            y1={upperFrom.y}
            x2={upperTo.x}
            y2={upperTo.y}
            stroke="var(--color-ink)"
            strokeWidth={1.1}
            strokeDasharray="4 3"
            opacity={0.8}
          />
          <line
            x1={lowerFrom.x}
            y1={lowerFrom.y}
            x2={lowerTo.x}
            y2={lowerTo.y}
            stroke="var(--color-ink)"
            strokeWidth={1.1}
            strokeDasharray="4 3"
            opacity={0.8}
          />
        </g>

        {/* Plot border */}
        <rect
          x={0}
          y={0}
          width={iw}
          height={ih}
          fill="none"
          stroke="var(--color-ink-mute)"
          strokeWidth={1}
        />

        {/* 1. Stability region — anchor the Fe²⁺ polygon */}
        <ExplainAnchor
          selector="region"
          index={1}
          pin={{ x: xScale(fe2.labelAt[0]), y: yScale(fe2.labelAt[1]) - 16 }}
          rect={{ x: fe2X, y: fe2Y, width: fe2W, height: fe2H }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Species boundary — vertical edge at pH = 9 between Fe²⁺ and Fe(OH)₂ */}
        <ExplainAnchor
          selector="species-boundary"
          index={2}
          pin={{ x: boundaryX + 14, y: (boundaryY0 + boundaryY1) / 2 }}
          rect={{
            x: Math.max(0, Math.min(iw - 1, boundaryX - 4)),
            y: Math.max(0, Math.min(ih, boundaryY0)),
            width: Math.min(8, iw),
            height: Math.max(6, boundaryY1 - boundaryY0),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Upper water-stability line (O₂/H₂O) */}
        <ExplainAnchor
          selector="reference-line-upper"
          index={3}
          pin={{ x: iw - 12, y: Math.max(6, upperTo.y - 10) }}
          rect={{
            x: 0,
            y: Math.max(0, Math.min(ih - 4, Math.min(upperFrom.y, upperTo.y) - 4)),
            width: iw,
            height: Math.max(8, Math.abs(upperTo.y - upperFrom.y) + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Lower water-stability line (H₂/H₂O) */}
        <ExplainAnchor
          selector="reference-line-lower"
          index={4}
          pin={{ x: iw - 12, y: Math.min(ih - 6, lowerTo.y + 12) }}
          rect={{
            x: 0,
            y: Math.max(0, Math.min(ih - 4, Math.min(lowerFrom.y, lowerTo.y) - 4)),
            width: iw,
            height: Math.max(8, Math.abs(lowerTo.y - lowerFrom.y) + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. X-axis (pH) — lives in margin space, so no clamp */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={7}
            tickFormat={(v) => String(v)}
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
            y={ih + 32}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            pH
          </text>
        </ExplainAnchor>

        {/* 6. Y-axis (E vs SHE) — margin-space anchor */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -28, y: ih / 2 }}
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
            x={-margin.left + 2}
            y={-6}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            E (V vs SHE)
          </text>
        </ExplainAnchor>

        {/* 7. Corrosion / passivation / immunity concept — anchored on the Fe region */}
        <ExplainAnchor
          selector="corrosion-passivation-immunity"
          index={7}
          pin={{ x: Math.min(iw - 8, feLabelX + 56), y: Math.min(ih - 8, feLabelY + 8) }}
          rect={{
            x: 0,
            y: Math.max(0, Math.min(ih - 4, yScale(-0.45))),
            width: Math.min(iw, xScale(9)),
            height: Math.max(6, ih - yScale(-0.45)),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
