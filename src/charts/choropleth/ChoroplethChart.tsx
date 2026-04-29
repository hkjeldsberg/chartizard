"use client";

import { Group } from "@visx/group";
import { scaleBand } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Synthetic US states on a 7-column × 5-row grid. Each cell is one "state".
// Values are rough 2024 populations in millions. The grid is NOT geographically
// accurate — it's a convenient abstraction that lets the choropleth demo
// avoid real GeoJSON while telling the "areas-lie" story honestly.
// Row order reads top-to-bottom (North → West+). Column order reads W→E.
type Cell = { code: string; pop: number };

const ROWS: ReadonlyArray<ReadonlyArray<Cell>> = [
  [
    { code: "ME", pop: 1.4 },
    { code: "NH", pop: 1.4 },
    { code: "VT", pop: 0.6 },
    { code: "MA", pop: 7.0 },
    { code: "RI", pop: 1.1 },
    { code: "CT", pop: 3.6 },
    { code: "NY", pop: 19.6 },
  ],
  [
    { code: "PA", pop: 13.0 },
    { code: "OH", pop: 11.8 },
    { code: "IN", pop: 6.9 },
    { code: "IL", pop: 12.4 },
    { code: "MI", pop: 10.0 },
    { code: "WI", pop: 5.9 },
    { code: "MN", pop: 5.7 },
  ],
  [
    { code: "NJ", pop: 9.3 },
    { code: "DE", pop: 1.0 },
    { code: "MD", pop: 6.2 },
    { code: "DC", pop: 0.7 },
    { code: "VA", pop: 8.7 },
    { code: "KY", pop: 4.5 },
    { code: "MO", pop: 6.2 },
  ],
  [
    { code: "NC", pop: 10.8 },
    { code: "SC", pop: 5.3 },
    { code: "GA", pop: 11.0 },
    { code: "AL", pop: 5.1 },
    { code: "MS", pop: 2.9 },
    { code: "LA", pop: 4.5 },
    { code: "TX", pop: 30.5 },
  ],
  [
    { code: "CA", pop: 39.0 },
    { code: "OR", pop: 4.2 },
    { code: "WA", pop: 7.8 },
    { code: "NV", pop: 3.2 },
    { code: "AZ", pop: 7.4 },
    { code: "CO", pop: 5.8 },
    { code: "FL", pop: 22.2 },
  ],
];

const COL_IDS = ["c0", "c1", "c2", "c3", "c4", "c5", "c6"] as const;
const ROW_IDS = ["r0", "r1", "r2", "r3", "r4"] as const;

interface Props {
  width: number;
  height: number;
}

export function ChoroplethChart({ width, height }: Props) {
  const margin = { top: 20, right: 72, bottom: 32, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleBand<string>({
    domain: COL_IDS as unknown as string[],
    range: [0, iw],
    padding: 0.06,
  });
  const yScale = scaleBand<string>({
    domain: ROW_IDS as unknown as string[],
    range: [0, ih],
    padding: 0.08,
  });

  const cellW = xScale.bandwidth();
  const cellH = yScale.bandwidth();

  // Max population for the ink scale — CA at 39.0M.
  const maxPop = 39.0;

  // Focal cells for anchors.
  const nyCol = 6;
  const nyRow = 0;
  const nyX = xScale(COL_IDS[nyCol]) ?? 0;
  const nyY = yScale(ROW_IDS[nyRow]) ?? 0;

  // Wyoming-analogue: low-pop western cell (use VT r0c2 as our smallest in row 0;
  // but for the area-distortion story we want a LOW-pop cell sitting in a
  // "large" western grid slot — pick NV (r4c3) which is low-pop and geographically
  // western in the layout).
  const nvCol = 3;
  const nvRow = 4;
  const nvX = xScale(COL_IDS[nvCol]) ?? 0;
  const nvY = yScale(ROW_IDS[nvRow]) ?? 0;

  // High-density band — the NY/NJ/MA northeast corner. Cover r0c3..r2c0 roughly.
  const denseX = xScale(COL_IDS[3]) ?? 0;
  const denseY = yScale(ROW_IDS[0]) ?? 0;
  const denseW = (xScale(COL_IDS[6]) ?? 0) + cellW - denseX;
  const denseH = (yScale(ROW_IDS[2]) ?? 0) + cellH - denseY;

  // Legend geometry — vertical ramp on the right, with "0.7M" / "39M" labels.
  const legendW = 10;
  const legendH = Math.min(ih, 180);
  const legendX = iw + 24;
  const legendY = Math.max(0, (ih - legendH) / 2);
  const legendSteps = 20;

  return (
    <svg width={width} height={height} role="img" aria-label="Choropleth">
      <Group left={margin.left} top={margin.top}>
        {/* Cells — every "state" shaded by raw population. */}
        <g data-data-layer="true">
          {ROWS.map((row, rIdx) => {
            const y = yScale(ROW_IDS[rIdx]) ?? 0;
            return row.map((cell, cIdx) => {
              const x = xScale(COL_IDS[cIdx]) ?? 0;
              const opacity = 0.06 + (cell.pop / maxPop) * 0.88;
              // Pick readable label colour: dark ink on light cells, page on dark.
              const labelFill =
                opacity > 0.55 ? "var(--color-page)" : "var(--color-ink)";
              return (
                <g key={`${rIdx}-${cIdx}`}>
                  <rect
                    x={x}
                    y={y}
                    width={cellW}
                    height={cellH}
                    fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
                  />
                  {cellW >= 22 && cellH >= 16 && (
                    <text
                      x={x + cellW / 2}
                      y={y + cellH / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontFamily="var(--font-mono)"
                      fontSize={9}
                      fill={labelFill}
                    >
                      {cell.code}
                    </text>
                  )}
                </g>
              );
            });
          })}
        </g>

        {/* Anchor 1 — the focal cell (NY, densely populated) */}
        <ExplainAnchor
          selector="cell"
          index={1}
          pin={{ x: nyX + cellW / 2, y: nyY - 12 }}
          rect={{ x: nyX, y: nyY, width: cellW, height: cellH }}
        >
          <rect
            x={nyX}
            y={nyY}
            width={cellW}
            height={cellH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
        </ExplainAnchor>

        {/* Anchor 2 — high-density region (northeast corridor) */}
        <ExplainAnchor
          selector="high-density-region"
          index={2}
          pin={{ x: denseX + denseW / 2, y: denseY + denseH + 14 }}
          rect={{
            x: Math.max(0, denseX),
            y: Math.max(0, denseY),
            width: Math.min(iw - Math.max(0, denseX), denseW),
            height: Math.min(ih - Math.max(0, denseY), denseH),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — low-density / area-distortion cell (NV) */}
        <ExplainAnchor
          selector="area-distortion"
          index={3}
          pin={{ x: nvX + cellW / 2, y: nvY + cellH + 14 }}
          rect={{ x: nvX, y: nvY, width: cellW, height: cellH }}
        >
          <rect
            x={nvX}
            y={nvY}
            width={cellW}
            height={cellH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="3 2"
          />
        </ExplainAnchor>

        {/* Anchor 4 — a low-density reference (VT, tiny population) */}
        <ExplainAnchor
          selector="low-density-region"
          index={4}
          pin={{
            x: (xScale(COL_IDS[2]) ?? 0) + cellW / 2,
            y: (yScale(ROW_IDS[0]) ?? 0) + cellH + 14,
          }}
          rect={{
            x: xScale(COL_IDS[2]) ?? 0,
            y: yScale(ROW_IDS[0]) ?? 0,
            width: cellW,
            height: cellH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Legend — vertical colour ramp on the right margin. */}
        <g data-data-layer="true" transform={`translate(${legendX}, ${legendY})`}>
          {Array.from({ length: legendSteps }).map((_, i) => {
            const t = i / (legendSteps - 1);
            const opacity = 0.06 + t * 0.88;
            const segH = legendH / legendSteps;
            return (
              <rect
                key={i}
                x={0}
                // Dark at top — higher population stacks visually up.
                y={legendH - (i + 1) * segH}
                width={legendW}
                height={segH + 0.5}
                fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
              />
            );
          })}
          <text
            x={legendW + 6}
            y={8}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            39M
          </text>
          <text
            x={legendW + 6}
            y={legendH - 2}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            0.7M
          </text>
          <text
            x={legendW + 6}
            y={legendH / 2}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            POP
          </text>
        </g>

        {/* Anchor 5 — legend / colour scale. Pin sits inside plot area so it's
            always visible; rect covers the legend strip in margin space. */}
        <ExplainAnchor
          selector="colour-scale"
          index={5}
          pin={{ x: iw - 8, y: legendY + legendH / 2 }}
          rect={{
            x: legendX - 2,
            y: legendY,
            width: legendW + 28,
            height: legendH,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
