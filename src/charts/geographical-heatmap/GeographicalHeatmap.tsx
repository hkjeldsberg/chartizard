"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Stylised city grid: 10×10 blocks on a coordinate system 0..100.
// One diagonal street cuts from lower-left to upper-right.
// Three KDE hotspots:
//   A — central park (50, 45)
//   B — waterfront (20, 75)
//   C — suburban hill (78, 22)

interface Hotspot {
  cx: number; // data coords 0..100
  cy: number;
  sigma: number; // spread in data units
  label: string;
}

const HOTSPOTS: ReadonlyArray<Hotspot> = [
  { cx: 50, cy: 45, sigma: 14, label: "Central Park" },
  { cx: 20, cy: 75, sigma: 11, label: "Waterfront" },
  { cx: 78, cy: 22, sigma: 9, label: "Suburban Hill" },
];

// Data space is 0..100 in both axes.
const DATA_RANGE = 100;

interface Props {
  width: number;
  height: number;
}

export function GeographicalHeatmap({ width, height }: Props) {
  const margin = { top: 20, right: 100, bottom: 32, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Scale data coords → pixel coords
  const toX = (d: number) => (d / DATA_RANGE) * iw;
  const toY = (d: number) => ih - (d / DATA_RANGE) * ih;

  // Unique gradient IDs per hotspot (memoized to avoid regeneration)
  const gradientIds = useMemo(
    () => HOTSPOTS.map((_, i) => `geo-heatmap-radial-${i}`),
    [],
  );

  // Legend gradient id
  const legendGradId = "geo-heatmap-legend";

  // City grid: 10×10 blocks. Block size in data units = 10.
  // We skip the grid lines that would overlap with the diagonal street for clarity.
  const gridLines = useMemo(() => {
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    for (let i = 0; i <= 10; i++) {
      const v = i * 10;
      lines.push({ x1: v, y1: 0, x2: v, y2: 100 }); // vertical
      lines.push({ x1: 0, y1: v, x2: 100, y2: v }); // horizontal
    }
    return lines;
  }, []);

  // Diagonal street: from (5, 5) to (95, 95) in data coords
  const diagX1 = toX(5);
  const diagY1 = toY(5);
  const diagX2 = toX(95);
  const diagY2 = toY(95);

  // Legend geometry — vertical ramp on the right margin
  const legendW = 12;
  const legendH = Math.min(ih * 0.7, 120);
  const legendX = iw + 20;
  const legendY = (ih - legendH) / 2;
  const legendSteps = 24;

  // Hotspot pixel positions
  const hotspotPx = HOTSPOTS.map((h) => ({
    cx: toX(h.cx),
    cy: toY(h.cy),
    r: (h.sigma / DATA_RANGE) * Math.min(iw, ih) * 2.2, // radius in pixels
  }));

  // Anchor positions
  // Hotspot A (central park) — anchor 1
  const hotspotA = hotspotPx[0];
  // Low-density corner — anchor 2 (upper-left, far from all hotspots)
  const lowDensityPx = { x: toX(8), y: toY(90) };
  // Base map outline — anchor 3 (near the diagonal street)
  const basemapPinX = toX(48);
  const basemapPinY = toY(52);
  // Kernel / radial gradient — anchor 4 (hotspot B waterfront)
  const hotspotB = hotspotPx[1];
  // Colour-scale legend — anchor 5
  // Point-events-density — anchor 6 (hotspot C suburban hill)
  const hotspotC = hotspotPx[2];

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Geographical heatmap showing running-activity density over a stylised city"
    >
      <defs>
        {HOTSPOTS.map((h, i) => {
          const rPx = hotspotPx[i].r;
          // Normalise radius to fraction of SVG dimensions for gradientUnits="userSpaceOnUse"
          return (
            <radialGradient
              key={gradientIds[i]}
              id={gradientIds[i]}
              cx={hotspotPx[i].cx + margin.left}
              cy={hotspotPx[i].cy + margin.top}
              r={rPx}
              fx={hotspotPx[i].cx + margin.left}
              fy={hotspotPx[i].cy + margin.top}
              gradientUnits="userSpaceOnUse"
            >
              {/* warm orange/red centre → transparent edge */}
              <stop offset="0%" stopColor="rgb(220,60,10)" stopOpacity="0.82" />
              <stop offset="30%" stopColor="rgb(240,120,20)" stopOpacity="0.55" />
              <stop offset="65%" stopColor="rgb(255,200,60)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="rgb(255,220,100)" stopOpacity="0" />
            </radialGradient>
          );
        })}
        {/* Legend gradient: transparent → warm red */}
        <linearGradient id={legendGradId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="rgb(255,220,100)" stopOpacity="0.08" />
          <stop offset="40%" stopColor="rgb(240,140,30)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="rgb(210,40,10)" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      <Group left={margin.left} top={margin.top}>
        {/* --- BASE MAP: city grid --- */}
        <ExplainAnchor
          selector="base-map"
          index={3}
          pin={{ x: basemapPinX, y: basemapPinY - 14 }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g data-data-layer="true">
            {/* City block grid */}
            {gridLines.map((l, i) => (
              <line
                key={`grid-${i}`}
                x1={toX(l.x1)}
                y1={toY(l.y1)}
                x2={toX(l.x2)}
                y2={toY(l.y2)}
                stroke="var(--color-hairline)"
                strokeWidth={0.6}
              />
            ))}
            {/* Outer border */}
            <rect
              x={0}
              y={0}
              width={iw}
              height={ih}
              fill="none"
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
            />
            {/* Diagonal street */}
            <line
              x1={diagX1}
              y1={diagY1}
              x2={diagX2}
              y2={diagY2}
              stroke="var(--color-ink-mute)"
              strokeWidth={1.5}
              strokeDasharray="5 3"
            />
          </g>
        </ExplainAnchor>

        {/* --- LOW-DENSITY REGION (transparent corner) --- */}
        <ExplainAnchor
          selector="low-density"
          index={2}
          pin={{ x: lowDensityPx.x + 16, y: lowDensityPx.y + 14 }}
          rect={{
            x: Math.max(0, toX(0)),
            y: Math.max(0, toY(100)),
            width: Math.min(iw, toX(25)),
            height: Math.min(ih, toY(68) - toY(100)),
          }}
        >
          {/* Dashed rectangle indicating the low-density zone */}
          <rect
            x={toX(1)}
            y={toY(97)}
            width={toX(22)}
            height={toY(72) - toY(97)}
            fill="none"
            stroke="var(--color-ink-mute)"
            strokeWidth={0.75}
            strokeDasharray="3 2"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* --- DENSITY HOTSPOTS (radial-gradient kernel overlays) --- */}
        {/* Hotspot A — central park, anchor 1 */}
        <ExplainAnchor
          selector="density-hotspot"
          index={1}
          pin={{
            x: Math.min(iw - 12, hotspotA.cx + hotspotA.r * 0.5),
            y: Math.max(10, hotspotA.cy - hotspotA.r * 0.6),
          }}
          rect={{
            x: Math.max(0, hotspotA.cx - hotspotA.r),
            y: Math.max(0, hotspotA.cy - hotspotA.r),
            width: Math.min(iw - Math.max(0, hotspotA.cx - hotspotA.r), hotspotA.r * 2),
            height: Math.min(ih - Math.max(0, hotspotA.cy - hotspotA.r), hotspotA.r * 2),
          }}
        >
          <ellipse
            cx={hotspotA.cx}
            cy={hotspotA.cy}
            rx={hotspotA.r}
            ry={hotspotA.r}
            fill={`url(#${gradientIds[0]})`}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Hotspot B — waterfront, anchor 4 (kernel concept) */}
        <ExplainAnchor
          selector="kde-kernel"
          index={4}
          pin={{
            x: Math.max(10, hotspotB.cx - hotspotB.r * 0.4),
            y: Math.max(10, hotspotB.cy - hotspotB.r * 0.7),
          }}
          rect={{
            x: Math.max(0, hotspotB.cx - hotspotB.r),
            y: Math.max(0, hotspotB.cy - hotspotB.r),
            width: Math.min(iw - Math.max(0, hotspotB.cx - hotspotB.r), hotspotB.r * 2),
            height: Math.min(ih - Math.max(0, hotspotB.cy - hotspotB.r), hotspotB.r * 2),
          }}
        >
          <ellipse
            cx={hotspotB.cx}
            cy={hotspotB.cy}
            rx={hotspotB.r}
            ry={hotspotB.r}
            fill={`url(#${gradientIds[1]})`}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Hotspot C — suburban hill, anchor 6 (point-event density concept) */}
        <ExplainAnchor
          selector="point-events-density"
          index={6}
          pin={{
            x: Math.min(iw - 10, hotspotC.cx + hotspotC.r * 0.5),
            y: Math.max(10, hotspotC.cy - hotspotC.r * 0.5),
          }}
          rect={{
            x: Math.max(0, hotspotC.cx - hotspotC.r),
            y: Math.max(0, hotspotC.cy - hotspotC.r),
            width: Math.min(iw - Math.max(0, hotspotC.cx - hotspotC.r), hotspotC.r * 2),
            height: Math.min(ih - Math.max(0, hotspotC.cy - hotspotC.r), hotspotC.r * 2),
          }}
        >
          <ellipse
            cx={hotspotC.cx}
            cy={hotspotC.cy}
            rx={hotspotC.r}
            ry={hotspotC.r}
            fill={`url(#${gradientIds[2]})`}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Hotspot labels */}
        <g data-data-layer="true">
          {HOTSPOTS.map((h, i) => (
            <text
              key={`hs-label-${i}`}
              x={hotspotPx[i].cx}
              y={hotspotPx[i].cy + hotspotPx[i].r + 10}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              {h.label}
            </text>
          ))}
        </g>

        {/* --- COLOUR-SCALE LEGEND --- */}
        <g data-data-layer="true" transform={`translate(${legendX}, ${legendY})`}>
          <rect
            x={0}
            y={0}
            width={legendW}
            height={legendH}
            fill={`url(#${legendGradId})`}
          />
          <rect
            x={0}
            y={0}
            width={legendW}
            height={legendH}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={0.5}
          />
          <text
            x={legendW + 5}
            y={6}
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            HIGH
          </text>
          <text
            x={legendW + 5}
            y={legendH}
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            LOW
          </text>
          <text
            x={legendW + 5}
            y={legendH / 2 + 4}
            fontFamily="var(--font-mono)"
            fontSize={7}
            fill="var(--color-ink-mute)"
          >
            DENSITY
          </text>
        </g>

        {/* Anchor 5 — colour-scale legend */}
        <ExplainAnchor
          selector="colour-scale-legend"
          index={5}
          pin={{ x: Math.min(iw - 4, legendX + legendW + 28), y: legendY + legendH / 2 }}
          rect={{
            x: legendX,
            y: legendY,
            width: legendW + 38,
            height: legendH,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
