"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Nolan's 1969 argument was that one-dimensional left/right politics
// hides the authoritarian–libertarian cross-cut. The chart rotates a
// 2D plane 45° so the two freedoms read as vertical columns — a
// political-pamphlet convention inherited by almost every later 2D
// ideology map.

interface Position {
  name: string;
  // 0 = state-controlled, 1 = market-driven.
  econ: number;
  // 0 = authoritarian, 1 = libertarian.
  personal: number;
}

const POSITIONS: ReadonlyArray<Position> = [
  { name: "Libertarian", econ: 0.92, personal: 0.9 },
  { name: "Progressive", econ: 0.1, personal: 0.85 },
  { name: "Conservative", econ: 0.9, personal: 0.1 },
  { name: "Statist", econ: 0.1, personal: 0.1 },
  { name: "Centrist", econ: 0.5, personal: 0.5 },
  { name: "Populist", econ: 0.35, personal: 0.3 },
];

interface Props {
  width: number;
  height: number;
}

export function NolanChart({ width, height }: Props) {
  const margin = { top: 28, right: 36, bottom: 28, left: 36 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // The diamond is a square of side s, rotated 45° around its centre.
  // Work out the largest rotated square that fits inside (iw, ih):
  // a rotated square's bounding box is s*sqrt(2) × s*sqrt(2).
  const side = Math.max(1, Math.min(iw, ih) / Math.SQRT2);
  const cx = iw / 2;
  const cy = ih / 2;

  // Map (econ, personal) ∈ [0,1]² into the rotated plane. The square
  // has its unrotated axes running east (econ) and north (personal);
  // after a 45° rotation, (0,0) lands at the bottom corner, (1,1) at
  // the top, (1,0) at the right, (0,1) at the left. Compute with a
  // single rotation matrix so the quadrant corners line up with the
  // diamond's visual corners.
  const project = useMemo(() => {
    // Unrotated local coords: x = (econ-0.5)*side, y = (0.5-personal)*side
    // Rotate -45° around origin: (x',y') = ((x+y)/√2, (y-x)/√2).
    return (econ: number, personal: number) => {
      const lx = (econ - 0.5) * side;
      const ly = (0.5 - personal) * side;
      const rx = (lx + ly) / Math.SQRT2;
      const ry = (ly - lx) / Math.SQRT2;
      return { x: cx + rx, y: cy + ry };
    };
  }, [cx, cy, side]);

  // Diamond corner coordinates (centre of each edge corresponds to
  // centrism on one axis; actual corners are the four ideological
  // extremes).
  const corners = useMemo(
    () => ({
      top: project(1, 1), // Libertarian
      right: project(1, 0), // Conservative
      bottom: project(0, 0), // Statist
      left: project(0, 1), // Progressive
    }),
    [project],
  );

  const diamondPath = `M${corners.top.x},${corners.top.y} L${corners.right.x},${corners.right.y} L${corners.bottom.x},${corners.bottom.y} L${corners.left.x},${corners.left.y} Z`;

  // Centrist diagonals (the two axes, drawn as cross-lines through
  // the centre so the reader can see the midpoints).
  const axisEcon = {
    a: project(0, 0.5),
    b: project(1, 0.5),
  };
  const axisPersonal = {
    a: project(0.5, 0),
    b: project(0.5, 1),
  };

  // Traditional "left-right" diagonal Nolan was arguing against —
  // runs from top-left corner (high personal, low econ) to bottom-right
  // (low personal, high econ). In the rotated diamond this is
  // Progressive → Conservative.
  const diagonal = {
    a: corners.left,
    b: corners.right,
  };

  const origin = project(0.5, 0.5);
  const centrist = POSITIONS.find((p) => p.name === "Centrist");
  const libertarian = POSITIONS.find((p) => p.name === "Libertarian");

  return (
    <svg width={width} height={height} role="img" aria-label="Nolan chart">
      <Group left={margin.left} top={margin.top}>
        {/* Data layer */}
        <g data-data-layer="true">
          {/* Diamond */}
          <path
            d={diamondPath}
            fill="var(--color-hairline)"
            fillOpacity={0.25}
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />

          {/* Cross-axes through the centre */}
          <line
            x1={axisEcon.a.x}
            y1={axisEcon.a.y}
            x2={axisEcon.b.x}
            y2={axisEcon.b.y}
            stroke="var(--color-ink-mute)"
            strokeDasharray="2 3"
            strokeWidth={0.8}
          />
          <line
            x1={axisPersonal.a.x}
            y1={axisPersonal.a.y}
            x2={axisPersonal.b.x}
            y2={axisPersonal.b.y}
            stroke="var(--color-ink-mute)"
            strokeDasharray="2 3"
            strokeWidth={0.8}
          />

          {/* Traditional 1D left-right diagonal */}
          <line
            x1={diagonal.a.x}
            y1={diagonal.a.y}
            x2={diagonal.b.x}
            y2={diagonal.b.y}
            stroke="var(--color-ink)"
            strokeOpacity={0.25}
            strokeDasharray="1 2"
            strokeWidth={0.8}
          />

          {/* Quadrant corner labels */}
          <text
            x={corners.top.x}
            y={corners.top.y - 10}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            LIBERTARIAN
          </text>
          <text
            x={corners.bottom.x}
            y={corners.bottom.y + 16}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            STATIST
          </text>
          <text
            x={corners.left.x - 8}
            y={corners.left.y}
            textAnchor="end"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            PROGRESSIVE
          </text>
          <text
            x={corners.right.x + 8}
            y={corners.right.y}
            textAnchor="start"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            CONSERVATIVE
          </text>

          {/* Axis captions along the two oriented edges */}
          <text
            x={(corners.bottom.x + corners.right.x) / 2 + 8}
            y={(corners.bottom.y + corners.right.y) / 2 + 4}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            econ →
          </text>
          <text
            x={(corners.bottom.x + corners.left.x) / 2 - 10}
            y={(corners.bottom.y + corners.left.y) / 2 + 4}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            ← personal
          </text>

          {/* Plotted positions */}
          {POSITIONS.map((p) => {
            const { x, y } = project(p.econ, p.personal);
            const isCentre = p.name === "Centrist";
            return (
              <g key={p.name}>
                <circle
                  cx={x}
                  cy={y}
                  r={isCentre ? 3.6 : 3}
                  fill="var(--color-ink)"
                  stroke="var(--color-surface)"
                  strokeWidth={1}
                />
                <text
                  x={x + 6}
                  y={y - 6}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-mute)"
                >
                  {p.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* Anchors */}

        {/* 1. Quadrant — Libertarian top corner */}
        <ExplainAnchor
          selector="quadrant"
          index={1}
          pin={{ x: corners.top.x + 18, y: corners.top.y - 8 }}
          rect={{
            x: Math.max(0, corners.top.x - side / 2),
            y: Math.max(0, corners.top.y),
            width: Math.min(iw, side),
            height: Math.max(8, origin.y - corners.top.y),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Axis-x — economic freedom (bottom-right edge) */}
        <ExplainAnchor
          selector="axis-x"
          index={2}
          pin={{
            x: (corners.bottom.x + corners.right.x) / 2 + 10,
            y: (corners.bottom.y + corners.right.y) / 2 + 18,
          }}
          rect={{
            x: Math.max(0, origin.x),
            y: Math.max(0, origin.y),
            width: Math.min(iw - Math.max(0, origin.x), (corners.right.x - origin.x) + 6),
            height: Math.min(ih - Math.max(0, origin.y), (corners.bottom.y - origin.y) + 6),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Axis-y — personal freedom (top-left edge) */}
        <ExplainAnchor
          selector="axis-y"
          index={3}
          pin={{
            x: (corners.top.x + corners.left.x) / 2 - 14,
            y: (corners.top.y + corners.left.y) / 2 - 18,
          }}
          rect={{
            x: Math.max(0, corners.left.x),
            y: Math.max(0, corners.top.y),
            width: Math.max(8, origin.x - corners.left.x),
            height: Math.max(8, origin.y - corners.top.y),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Origin — the centre, labelled "Centrist" */}
        {centrist && (
          <ExplainAnchor
            selector="origin"
            index={4}
            pin={{ x: origin.x + 22, y: origin.y - 20 }}
            rect={{
              x: Math.max(0, origin.x - 10),
              y: Math.max(0, origin.y - 10),
              width: 20,
              height: 20,
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* 5. Position — one plotted example (Libertarian) */}
        {libertarian && (
          <ExplainAnchor
            selector="position"
            index={5}
            pin={{ x: project(libertarian.econ, libertarian.personal).x - 18, y: project(libertarian.econ, libertarian.personal).y - 16 }}
            rect={{
              x: Math.max(0, project(libertarian.econ, libertarian.personal).x - 6),
              y: Math.max(0, project(libertarian.econ, libertarian.personal).y - 6),
              width: 12,
              height: 12,
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* 6. Diagonal — traditional 1D left-right axis */}
        <ExplainAnchor
          selector="diagonal"
          index={6}
          pin={{ x: origin.x, y: origin.y + 30 }}
          rect={{
            x: Math.max(0, Math.min(corners.left.x, corners.right.x)),
            y: Math.max(0, Math.min(corners.left.y, corners.right.y) - 4),
            width: Math.abs(corners.right.x - corners.left.x),
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
