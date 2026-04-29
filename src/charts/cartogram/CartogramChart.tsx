"use client";

import { Group } from "@visx/group";
import { scaleBand } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Same synthetic US-state grid used by the choropleth companion chart.
// The contract (§2) forbids a shared datasets module, so this is duplicated
// deliberately — the two charts tell paired stories from one hand-tuned dataset.
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

export function CartogramChart({ width, height }: Props) {
  const margin = { top: 28, right: 24, bottom: 44, left: 24 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Use scaleBand purely to compute slot centres — we do NOT render cells
  // at bandwidth size; the mark sizes come from data.
  const xScale = scaleBand<string>({
    domain: COL_IDS as unknown as string[],
    range: [0, iw],
    padding: 0,
  });
  const yScale = scaleBand<string>({
    domain: ROW_IDS as unknown as string[],
    range: [0, ih],
    padding: 0,
  });

  const slotW = xScale.bandwidth();
  const slotH = yScale.bandwidth();
  // The largest square should fit inside a slot with a little breathing room.
  const maxSide = Math.max(0, Math.min(slotW, slotH) - 4);

  const maxPop = 39.0;

  // Compute per-state square geometry (centre-anchored to slot centre).
  type Placed = Cell & {
    rIdx: number;
    cIdx: number;
    cx: number;
    cy: number;
    side: number;
    x: number;
    y: number;
  };
  const placed: Placed[] = [];
  ROWS.forEach((row, rIdx) => {
    row.forEach((cell, cIdx) => {
      const slotX = xScale(COL_IDS[cIdx]) ?? 0;
      const slotY = yScale(ROW_IDS[rIdx]) ?? 0;
      const cx = slotX + slotW / 2;
      const cy = slotY + slotH / 2;
      const side = Math.sqrt(cell.pop / maxPop) * maxSide;
      placed.push({
        ...cell,
        rIdx,
        cIdx,
        cx,
        cy,
        side,
        x: cx - side / 2,
        y: cy - side / 2,
      });
    });
  });

  const byCode = (code: string) => placed.find((p) => p.code === code);
  const ca = byCode("CA");
  const vt = byCode("VT");
  const ny = byCode("NY");
  const tx = byCode("TX");

  // Legend — small reference squares in the bottom-right showing the sqrt scale.
  const legendRef: ReadonlyArray<{ pop: number; label: string }> = [
    { pop: 1, label: "1M" },
    { pop: 10, label: "10M" },
    { pop: 39, label: "39M" },
  ];
  const legendAreaX = Math.max(0, iw - 140);
  const legendAreaY = ih + 4;

  return (
    <svg width={width} height={height} role="img" aria-label="Cartogram">
      <Group left={margin.left} top={margin.top}>
        {/* Faint slot grid — abstract "geography" scaffold. */}
        <g data-data-layer="true">
          {ROWS.map((row, rIdx) =>
            row.map((_, cIdx) => {
              const x = xScale(COL_IDS[cIdx]) ?? 0;
              const y = yScale(ROW_IDS[rIdx]) ?? 0;
              return (
                <rect
                  key={`slot-${rIdx}-${cIdx}`}
                  x={x + 1}
                  y={y + 1}
                  width={slotW - 2}
                  height={slotH - 2}
                  fill="none"
                  stroke="var(--color-hairline)"
                  strokeWidth={1}
                />
              );
            }),
          )}
        </g>

        {/* Population-sized squares. */}
        <g data-data-layer="true">
          {placed.map((p) => {
            const labelReadable = p.side >= 22;
            return (
              <g key={p.code}>
                <rect
                  x={p.x}
                  y={p.y}
                  width={p.side}
                  height={p.side}
                  fill="rgba(26,22,20,0.82)"
                />
                {labelReadable && (
                  <text
                    x={p.cx}
                    y={p.cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize={Math.max(9, Math.min(12, p.side * 0.28))}
                    fill="var(--color-page)"
                  >
                    {p.code}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Anchor 1 — size encoding concept (whole-layout). Pinned at CA, the
            chart's most dramatic example of the encoding. */}
        {ca && (
          <ExplainAnchor
            selector="size-encoding"
            index={1}
            pin={{ x: ca.cx, y: Math.max(0, ca.y - 12) }}
            rect={{
              x: 0,
              y: 0,
              width: iw,
              height: ih,
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 2 — one large state cell (CA). */}
        {ca && (
          <ExplainAnchor
            selector="cell-size"
            index={2}
            pin={{ x: ca.cx - ca.side / 2 - 14, y: ca.cy }}
            rect={{
              x: Math.max(0, ca.x - 2),
              y: Math.max(0, ca.y - 2),
              width: Math.min(iw, ca.side + 4),
              height: Math.min(ih, ca.side + 4),
            }}
          >
            <rect
              x={ca.x - 2}
              y={ca.y - 2}
              width={ca.side + 4}
              height={ca.side + 4}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.25}
              strokeDasharray="3 2"
            />
          </ExplainAnchor>
        )}

        {/* Anchor 3 — largest region (TX — second-largest after CA, makes the
            "bigness = population" story vivid with a second example). */}
        {tx && (
          <ExplainAnchor
            selector="largest-region"
            index={3}
            pin={{ x: tx.cx, y: Math.min(ih, tx.y + tx.side + 14) }}
            rect={{
              x: Math.max(0, tx.x),
              y: Math.max(0, tx.y),
              width: Math.min(iw - Math.max(0, tx.x), tx.side),
              height: Math.min(ih - Math.max(0, tx.y), tx.side),
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 4 — smallest region (VT, 0.6M — nearly a dot). */}
        {vt && (
          <ExplainAnchor
            selector="smallest-region"
            index={4}
            pin={{ x: vt.cx, y: Math.max(0, vt.cy - 14) }}
            rect={{
              x: Math.max(0, (xScale(COL_IDS[vt.cIdx]) ?? 0)),
              y: Math.max(0, (yScale(ROW_IDS[vt.rIdx]) ?? 0)),
              width: slotW,
              height: slotH,
            }}
          >
            <circle
              cx={vt.cx}
              cy={vt.cy}
              r={Math.max(6, vt.side / 2 + 4)}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
          </ExplainAnchor>
        )}

        {/* Anchor 5 — cell label (NY — an intermediate, labelled state). */}
        {ny && (
          <ExplainAnchor
            selector="cell-label"
            index={5}
            pin={{ x: ny.cx + ny.side / 2 + 14, y: ny.cy }}
            rect={{
              x: Math.max(0, ny.x),
              y: Math.max(0, ny.y),
              width: Math.min(iw - Math.max(0, ny.x), ny.side),
              height: Math.min(ih - Math.max(0, ny.y), ny.side),
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Legend — reference squares at 1M / 10M / 39M, bottom margin. */}
        <g transform={`translate(${legendAreaX}, ${legendAreaY})`}>
          {legendRef.map((ref, i) => {
            const side = Math.sqrt(ref.pop / maxPop) * maxSide;
            const slot = 44;
            const cx = i * slot + slot / 2;
            const cy = 18;
            return (
              <g key={ref.label}>
                <rect
                  x={cx - side / 2}
                  y={cy - side / 2}
                  width={side}
                  height={side}
                  fill="rgba(26,22,20,0.82)"
                />
                <text
                  x={cx}
                  y={cy + 26}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-mute)"
                >
                  {ref.label}
                </text>
              </g>
            );
          })}
          <text
            x={0}
            y={4}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            SIDE ∝ √POP
          </text>
        </g>

        {/* Anchor 6 — legend / size scale. Rect stays in margin space over the
            legend; pin sits just inside the plot area above the legend. */}
        <ExplainAnchor
          selector="legend"
          index={6}
          pin={{ x: Math.min(iw - 8, legendAreaX + 60), y: ih - 4 }}
          rect={{
            x: legendAreaX - 4,
            y: legendAreaY - 4,
            width: 140,
            height: margin.bottom,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
