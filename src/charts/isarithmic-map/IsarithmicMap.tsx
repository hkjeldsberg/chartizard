"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Simplified US continental outline in a 0–100 × 0–60 coordinate frame.
// Not geographically exact — a schematic silhouette sufficient to anchor
// the isohyet story.
const US_OUTLINE =
  "M 8 28 L 12 22 L 18 18 L 22 16 L 30 15 L 42 14 L 56 14 L 68 16 L 78 18 L 86 20 L 90 22 L 94 26 L 96 30 L 94 34 L 90 38 L 86 42 L 82 44 L 78 46 L 72 48 L 66 50 L 60 50 L 54 48 L 48 46 L 42 44 L 36 42 L 30 40 L 24 38 L 18 34 L 12 32 Z";

// Five isohyet contours, hand-drawn as closed polylines in the same 0–100 × 0–60
// frame, running plausibly with US climatology:
//   - 60 in/yr: tight ring around the Pacific Northwest (upper-left coast)
//   - 40 in/yr: eastern/southeastern wet region
//   - 30 in/yr: eastern transition
//   - 20 in/yr: long N-S line through the Great Plains (100th meridian)
//   - 10 in/yr: island around the desert Southwest
type Contour = {
  value: number;
  label: string;
  path: string;
  labelPos: { x: number; y: number };
};

const CONTOURS: ReadonlyArray<Contour> = [
  {
    value: 60,
    label: "60",
    path: "M 14 22 Q 18 20 20 24 Q 18 28 14 28 Q 11 26 14 22 Z",
    labelPos: { x: 16.5, y: 25 },
  },
  {
    value: 40,
    label: "40",
    path: "M 64 22 Q 78 18 86 24 Q 90 32 86 40 Q 78 44 70 42 Q 62 38 60 32 Q 62 24 64 22 Z",
    labelPos: { x: 76, y: 32 },
  },
  {
    value: 30,
    label: "30",
    path: "M 52 22 Q 66 18 80 22 Q 88 28 86 38 Q 78 46 68 46 Q 56 44 50 38 Q 46 28 52 22 Z",
    labelPos: { x: 56, y: 38 },
  },
  {
    value: 20,
    label: "20",
    path: "M 40 18 L 44 20 L 46 28 L 46 36 L 44 42 L 40 46 L 36 44 L 34 36 L 34 28 L 36 22 Z",
    labelPos: { x: 40, y: 26 },
  },
  {
    value: 10,
    label: "10",
    path: "M 20 30 Q 26 28 30 32 Q 32 38 28 42 Q 22 42 18 38 Q 16 34 20 30 Z",
    labelPos: { x: 24, y: 36 },
  },
];

// A handful of measurement stations scattered across the map.
const STATIONS: ReadonlyArray<{ x: number; y: number }> = [
  { x: 15, y: 24 },
  { x: 22, y: 36 },
  { x: 32, y: 42 },
  { x: 38, y: 28 },
  { x: 44, y: 36 },
  { x: 50, y: 28 },
  { x: 58, y: 40 },
  { x: 66, y: 30 },
  { x: 74, y: 36 },
  { x: 82, y: 26 },
  { x: 86, y: 34 },
  { x: 78, y: 44 },
  { x: 28, y: 20 },
];

interface Props {
  width: number;
  height: number;
}

export function IsarithmicMap({ width, height }: Props) {
  const margin = { top: 24, right: 24, bottom: 36, left: 24 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // The hand-drawn data lives in a 100×60 frame; scale it to fit the plot area
  // while preserving aspect ratio.
  const scale = Math.min(iw / 100, ih / 60);
  const drawW = 100 * scale;
  const drawH = 60 * scale;
  const offX = (iw - drawW) / 2;
  const offY = (ih - drawH) / 2;

  const peakContour = CONTOURS[0]; // 60 in/yr — Pacific Northwest
  const peakLabel = peakContour.labelPos;
  const spacingContour = CONTOURS[1]; // 40 in/yr — for gradient anchor

  return (
    <svg width={width} height={height} role="img" aria-label="Isarithmic / Contour Map">
      <Group left={margin.left} top={margin.top}>
        <g transform={`translate(${offX}, ${offY}) scale(${scale})`}>
          {/* Basemap — US silhouette */}
          <g data-data-layer="true">
            <path
              d={US_OUTLINE}
              fill="var(--color-hairline)"
              fillOpacity={0.35}
              stroke="var(--color-ink-mute)"
              strokeWidth={0.4 / scale}
              strokeLinejoin="round"
            />
          </g>

          {/* Isarithms — nested contour polygons */}
          <g data-data-layer="true">
            {CONTOURS.map((c) => {
              // Darker line for higher-value contours (tighter rings are heavier).
              const opacity = 0.35 + (c.value / 60) * 0.55;
              const strokeW =
                (c.value >= 40 ? 1.4 : c.value >= 20 ? 1.1 : 0.9) / scale;
              return (
                <path
                  key={c.value}
                  d={c.path}
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeOpacity={opacity}
                  strokeWidth={strokeW}
                  strokeLinejoin="round"
                />
              );
            })}
          </g>

          {/* Contour labels — break the line so the label reads cleanly. */}
          <g data-data-layer="true">
            {CONTOURS.map((c) => (
              <g key={c.value}>
                <rect
                  x={c.labelPos.x - 2.4}
                  y={c.labelPos.y - 1.8}
                  width={4.8}
                  height={3.6}
                  fill="var(--color-surface)"
                />
                <text
                  x={c.labelPos.x}
                  y={c.labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={2.6}
                  fill="var(--color-ink)"
                >
                  {c.label}
                </text>
              </g>
            ))}
          </g>

          {/* Station points — the interpolation skeleton */}
          <g data-data-layer="true">
            {STATIONS.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={0.7}
                fill="var(--color-ink)"
                opacity={0.75}
              />
            ))}
          </g>

          {/* Small caption — units */}
          <text
            x={50}
            y={58}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={2.4}
            fill="var(--color-ink-mute)"
          >
            INCHES PER YEAR
          </text>
        </g>

        {/* Anchor 1 — A representative isarithm (the 30-inch line, midsection) */}
        <ExplainAnchor
          selector="contour-line"
          index={1}
          pin={{
            x: offX + CONTOURS[2].labelPos.x * scale + 18,
            y: offY + CONTOURS[2].labelPos.y * scale - 20,
          }}
          rect={{
            x: offX + 46 * scale,
            y: offY + 20 * scale,
            width: 44 * scale,
            height: 28 * scale,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2 — Contour spacing / gradient (the tight bunching on the east) */}
        <ExplainAnchor
          selector="contour-spacing"
          index={2}
          pin={{
            x: offX + 58 * scale,
            y: offY + 18 * scale,
          }}
          rect={{
            x: offX + 50 * scale,
            y: offY + 18 * scale,
            width: 18 * scale,
            height: 22 * scale,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — Local maximum (the 60-inch ring, Pacific Northwest) */}
        <ExplainAnchor
          selector="local-maximum"
          index={3}
          pin={{
            x: offX + peakLabel.x * scale - 14,
            y: offY + peakLabel.y * scale - 14,
          }}
          rect={{
            x: offX + 10 * scale,
            y: offY + 19 * scale,
            width: 14 * scale,
            height: 12 * scale,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4 — Station point (pin next to the midcontinent station cluster) */}
        <ExplainAnchor
          selector="station-point"
          index={4}
          pin={{
            x: offX + 44 * scale + 12,
            y: offY + 36 * scale + 14,
          }}
          rect={{
            x: offX + 40 * scale,
            y: offY + 32 * scale,
            width: 12 * scale,
            height: 10 * scale,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — Basemap (the faint continental outline) */}
        <ExplainAnchor
          selector="basemap"
          index={5}
          pin={{
            x: offX + 90 * scale,
            y: offY + 44 * scale + 14,
          }}
          rect={{
            x: offX + 78 * scale,
            y: offY + 42 * scale,
            width: 16 * scale,
            height: 8 * scale,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6 — Contour label (pin next to one of the labels) */}
        <ExplainAnchor
          selector="contour-label"
          index={6}
          pin={{
            x: offX + spacingContour.labelPos.x * scale + 16,
            y: offY + spacingContour.labelPos.y * scale + 14,
          }}
          rect={{
            x: offX + (spacingContour.labelPos.x - 3) * scale,
            y: offY + (spacingContour.labelPos.y - 2) * scale,
            width: 6 * scale,
            height: 4 * scale,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
