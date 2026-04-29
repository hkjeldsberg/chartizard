"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Isochrone Map — contours of equal TRAVEL TIME from a point, not distance.
//
// The five polygons are hand-drawn in normalised [-1, 1] map coordinates so
// they scale cleanly to whatever {width, height} the tile gives us. Each
// polygon is a closed ring; we project to pixel space per-render.
//
// Shape notes:
//   * 10-min contour hugs the origin — small, roughly round.
//   * 20 and 30-min contours begin to show finger-like lobes along three
//     radial "highway" corridors (NE toward a motorway, SW along a rail
//     axis, E along an arterial).
//   * 45 and 60-min contours push those fingers far outward and develop
//     two clear pinches — one at a river crossing in the west, one at a
//     range of hills in the south. Density is higher on the east side
//     (denser road network) so eastern contours are stretched further
//     than western ones.
//
// Numbers are hand-tuned, not routed — the chart is illustrative, not
// operational.

type Pt = readonly [number, number];

// Contour rings in map-space (-1..1 x -1..1). Origin at (0, 0).
const CONTOUR_10: ReadonlyArray<Pt> = [
  [0.00, -0.14], [0.10, -0.12], [0.16, -0.04], [0.18, 0.06], [0.14, 0.14],
  [0.06, 0.16], [-0.04, 0.15], [-0.12, 0.10], [-0.14, 0.02], [-0.12, -0.06],
  [-0.06, -0.14], [0.00, -0.14],
];

const CONTOUR_20: ReadonlyArray<Pt> = [
  [0.04, -0.28], [0.20, -0.24], [0.30, -0.12], [0.34, 0.04], [0.40, 0.10],
  [0.34, 0.22], [0.26, 0.30], [0.12, 0.34], [-0.04, 0.34], [-0.18, 0.28],
  [-0.26, 0.18], [-0.30, 0.06], [-0.28, -0.08], [-0.22, -0.22], [-0.10, -0.28],
  [0.04, -0.28],
];

const CONTOUR_30: ReadonlyArray<Pt> = [
  // NE highway finger
  [0.08, -0.48], [0.26, -0.42], [0.42, -0.32], [0.58, -0.30],
  // E arterial bulge
  [0.60, -0.10], [0.56, 0.06], [0.50, 0.18], [0.44, 0.32],
  // S pinch (hills) — slight indent on bottom
  [0.28, 0.46], [0.12, 0.48], [-0.04, 0.44], [-0.18, 0.46],
  // SW rail finger
  [-0.34, 0.42], [-0.46, 0.30], [-0.48, 0.14], [-0.44, -0.02],
  // W river pinch (indent)
  [-0.40, -0.12], [-0.34, -0.22], [-0.32, -0.34], [-0.22, -0.44],
  [-0.08, -0.48], [0.08, -0.48],
];

const CONTOUR_45: ReadonlyArray<Pt> = [
  // NE highway long finger
  [0.18, -0.70], [0.38, -0.66], [0.60, -0.54], [0.76, -0.44],
  // E arterial lobe
  [0.82, -0.20], [0.80, -0.04], [0.74, 0.12], [0.68, 0.26],
  // S hills pinch — clear indent around 0.50 x / 0.48 y
  [0.56, 0.40], [0.40, 0.46], [0.28, 0.42], [0.14, 0.54],
  // SW rail finger pushing further
  [-0.06, 0.62], [-0.28, 0.60], [-0.48, 0.52], [-0.60, 0.36],
  // W river pinch (indent inward)
  [-0.62, 0.18], [-0.54, 0.06], [-0.58, -0.10], [-0.64, -0.26],
  // NW quiet side
  [-0.56, -0.42], [-0.42, -0.56], [-0.24, -0.64], [-0.06, -0.70],
  [0.18, -0.70],
];

const CONTOUR_60: ReadonlyArray<Pt> = [
  // NE highway extends very far
  [0.28, -0.90], [0.50, -0.86], [0.72, -0.76], [0.90, -0.62],
  // E arterial dominant lobe
  [0.98, -0.34], [0.96, -0.10], [0.88, 0.12], [0.80, 0.30],
  // S hills deep pinch
  [0.68, 0.48], [0.52, 0.56], [0.36, 0.48], [0.20, 0.68],
  // SW rail finger at its longest
  [0.02, 0.78], [-0.22, 0.80], [-0.46, 0.72], [-0.66, 0.58],
  // W river pinch — clearer indent toward origin
  [-0.72, 0.34], [-0.64, 0.20], [-0.68, 0.02], [-0.78, -0.18],
  // NW quiet side
  [-0.72, -0.42], [-0.58, -0.62], [-0.40, -0.78], [-0.18, -0.88],
  [0.28, -0.90],
];

// City outline — a rounded rectangle the contours sit inside for context.
const CITY_OUTLINE: ReadonlyArray<Pt> = [
  [-0.94, -0.94], [0.94, -0.94], [0.94, 0.94], [-0.94, 0.94], [-0.94, -0.94],
];

interface ContourSpec {
  ring: ReadonlyArray<Pt>;
  minutes: number;
  labelAt: Pt; // where to place the "N min" label, in map space
}

const CONTOURS: ReadonlyArray<ContourSpec> = [
  { ring: CONTOUR_60, minutes: 60, labelAt: [0.92, -0.56] },
  { ring: CONTOUR_45, minutes: 45, labelAt: [0.78, -0.10] },
  { ring: CONTOUR_30, minutes: 30, labelAt: [0.56, 0.04] },
  { ring: CONTOUR_20, minutes: 20, labelAt: [0.38, 0.08] },
  { ring: CONTOUR_10, minutes: 10, labelAt: [0.18, 0.02] },
];

interface Props {
  width: number;
  height: number;
}

export function IsochroneMap({ width, height }: Props) {
  const margin = { top: 24, right: 24, bottom: 44, left: 24 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Map-space is [-1, 1] x [-1, 1]. Centre it in the plot and keep aspect.
  const side = Math.min(iw, ih);
  const offsetX = (iw - side) / 2;
  const offsetY = (ih - side) / 2;
  const half = side / 2;

  function mx(x: number): number {
    return offsetX + half + x * half;
  }
  function my(y: number): number {
    return offsetY + half + y * half;
  }

  function ringToPath(ring: ReadonlyArray<Pt>): string {
    return (
      ring
        .map(([x, y], i) => `${i === 0 ? "M" : "L"}${mx(x).toFixed(1)},${my(y).toFixed(1)}`)
        .join(" ") + " Z"
    );
  }

  const cityD = ringToPath(CITY_OUTLINE);
  const contourPaths = CONTOURS.map((c) => ({
    ...c,
    d: ringToPath(c.ring),
    labelX: mx(c.labelAt[0]),
    labelY: my(c.labelAt[1]),
  }));

  const originX = mx(0);
  const originY = my(0);

  // NE corridor anchor position — somewhere along the outer highway finger
  // where the 60-min ring reaches furthest up-right.
  const highwayAnchorX = mx(0.72);
  const highwayAnchorY = my(-0.76);

  // River pinch anchor position — the W indent between 45 and 60 rings.
  const riverAnchorX = mx(-0.68);
  const riverAnchorY = my(0.02);

  // 30-min ring anchor — roughly the NE quadrant of CONTOUR_30.
  const ring30X = mx(0.42);
  const ring30Y = my(-0.32);

  // Star path for the origin marker.
  function starPath(cx: number, cy: number, r: number): string {
    const pts: string[] = [];
    for (let i = 0; i < 10; i += 1) {
      const angle = (-Math.PI / 2) + (i * Math.PI) / 5;
      const radius = i % 2 === 0 ? r : r * 0.45;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ") + " Z";
  }

  return (
    <svg width={width} height={height} role="img" aria-label="Isochrone map">
      <Group left={margin.left} top={margin.top}>
        {/* City outline — rounded rectangle context. */}
        <g data-data-layer="true">
          <path
            d={cityD}
            fill="rgba(26,22,20,0.03)"
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
        </g>

        {/* Contours — painted outer → inner so later rings layer on top. */}
        <g data-data-layer="true">
          {contourPaths.map((c, i) => {
            // Stronger ink for inner (shorter-time) rings.
            const opacity = 0.04 + (i / (contourPaths.length - 1)) * 0.12;
            return (
              <path
                key={c.minutes}
                d={c.d}
                fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
                stroke="var(--color-ink)"
                strokeWidth={1.2}
                strokeLinejoin="round"
              />
            );
          })}
        </g>

        {/* Time labels on each contour. */}
        <g data-data-layer="true">
          {contourPaths.map((c) => (
            <g key={`lbl-${c.minutes}`}>
              <rect
                x={c.labelX - 14}
                y={c.labelY - 7}
                width={28}
                height={14}
                fill="var(--color-page)"
                stroke="var(--color-ink-mute)"
                strokeWidth={0.6}
                rx={2}
              />
              <text
                x={c.labelX}
                y={c.labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink)"
              >
                {c.minutes} MIN
              </text>
            </g>
          ))}
        </g>

        {/* Origin marker — star at the centre. */}
        <g data-data-layer="true">
          <path
            d={starPath(originX, originY, 7)}
            fill="var(--color-ink)"
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeLinejoin="round"
          />
          <text
            x={originX + 12}
            y={originY - 8}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            ORIGIN
          </text>
        </g>

        {/* Caption under the map. */}
        <text
          x={offsetX + half}
          y={ih + 24}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
        >
          DRIVE-TIME FROM CITY CENTRE
        </text>

        {/* Anchor 1 — origin point. */}
        <ExplainAnchor
          selector="origin"
          index={1}
          pin={{ x: originX, y: originY + 18 }}
          rect={{
            x: Math.max(0, originX - 12),
            y: Math.max(0, originY - 12),
            width: 24,
            height: 24,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2 — innermost (10-min) contour. */}
        <ExplainAnchor
          selector="inner-contour"
          index={2}
          pin={{ x: mx(0.14), y: my(-0.18) - 6 }}
          rect={{
            x: Math.max(0, mx(-0.18)),
            y: Math.max(0, my(-0.18)),
            width: Math.min(iw, mx(0.2) - mx(-0.18)),
            height: Math.min(ih, my(0.2) - my(-0.18)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — intermediate (30-min) contour. */}
        <ExplainAnchor
          selector="mid-contour"
          index={3}
          pin={{ x: ring30X + 6, y: ring30Y - 8 }}
          rect={{
            x: Math.max(0, mx(0.28)),
            y: Math.max(0, my(-0.46)),
            width: Math.min(iw, mx(0.62) - mx(0.28)),
            height: Math.min(ih, my(-0.06) - my(-0.46)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4 — NE highway corridor (the finger). */}
        <ExplainAnchor
          selector="highway-corridor"
          index={4}
          pin={{ x: highwayAnchorX + 6, y: highwayAnchorY - 8 }}
          rect={{
            x: Math.max(0, mx(0.50)),
            y: Math.max(0, my(-0.92)),
            width: Math.min(iw, mx(0.92) - mx(0.50)),
            height: Math.min(ih, my(-0.40) - my(-0.92)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — west river pinch. */}
        <ExplainAnchor
          selector="barrier-pinch"
          index={5}
          pin={{ x: Math.max(10, riverAnchorX - 12), y: riverAnchorY }}
          rect={{
            x: Math.max(0, mx(-0.80)),
            y: Math.max(0, my(-0.22)),
            width: Math.min(iw, mx(-0.38) - mx(-0.80)),
            height: Math.min(ih, my(0.30) - my(-0.22)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6 — outermost (60-min) contour. */}
        <ExplainAnchor
          selector="outer-contour"
          index={6}
          pin={{ x: mx(0.0), y: my(-0.92) + 14 }}
          rect={{
            x: Math.max(0, mx(-0.76)),
            y: Math.max(0, my(-0.94)),
            width: Math.min(iw, mx(0.94) - mx(-0.76)),
            height: Math.min(ih, my(-0.68) - my(-0.94)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 7 — city outline (context frame). */}
        <ExplainAnchor
          selector="city-frame"
          index={7}
          pin={{ x: mx(-0.86) + 14, y: my(0.86) - 8 }}
          rect={{
            x: Math.max(0, mx(-0.96)),
            y: Math.max(0, my(0.70)),
            width: Math.min(iw, mx(-0.58) - mx(-0.96)),
            height: Math.min(ih, my(0.94) - my(0.70)),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
