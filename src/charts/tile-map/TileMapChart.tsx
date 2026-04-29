"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Every US state + DC as a single equal-size tile, positioned on a
// 12-column × 8-row grid in the NPR / FiveThirtyEight convention.
// Each tile is colour-encoded by 2023-ballpark median household income.
// The grid sacrifices geographic accuracy so every state — Rhode Island
// and Texas alike — reads at the same visual weight.
type State = { code: string; col: number; row: number; income: number };

const STATES: ReadonlyArray<State> = [
  // Row 0
  { code: "AK", col: 0, row: 0, income: 86 },
  { code: "ME", col: 10, row: 0, income: 68 },
  // Row 1
  { code: "VT", col: 9, row: 1, income: 74 },
  { code: "NH", col: 10, row: 1, income: 90 },
  // Row 2
  { code: "WA", col: 1, row: 2, income: 91 },
  { code: "ID", col: 2, row: 2, income: 70 },
  { code: "MT", col: 3, row: 2, income: 66 },
  { code: "ND", col: 4, row: 2, income: 73 },
  { code: "MN", col: 5, row: 2, income: 85 },
  { code: "WI", col: 6, row: 2, income: 72 },
  { code: "MI", col: 7, row: 2, income: 69 },
  { code: "NY", col: 8, row: 2, income: 82 },
  { code: "MA", col: 9, row: 2, income: 96 },
  { code: "CT", col: 10, row: 2, income: 90 },
  { code: "RI", col: 11, row: 2, income: 81 },
  // Row 3
  { code: "OR", col: 1, row: 3, income: 76 },
  { code: "NV", col: 2, row: 3, income: 74 },
  { code: "WY", col: 3, row: 3, income: 72 },
  { code: "SD", col: 4, row: 3, income: 70 },
  { code: "IA", col: 5, row: 3, income: 73 },
  { code: "IL", col: 6, row: 3, income: 79 },
  { code: "IN", col: 7, row: 3, income: 68 },
  { code: "OH", col: 8, row: 3, income: 67 },
  { code: "PA", col: 9, row: 3, income: 75 },
  { code: "NJ", col: 10, row: 3, income: 97 },
  // Row 4
  { code: "CA", col: 1, row: 4, income: 92 },
  { code: "UT", col: 2, row: 4, income: 87 },
  { code: "CO", col: 3, row: 4, income: 87 },
  { code: "NE", col: 4, row: 4, income: 71 },
  { code: "MO", col: 5, row: 4, income: 65 },
  { code: "KY", col: 6, row: 4, income: 60 },
  { code: "WV", col: 7, row: 4, income: 55 },
  { code: "VA", col: 8, row: 4, income: 87 },
  { code: "MD", col: 9, row: 4, income: 98 },
  { code: "DE", col: 10, row: 4, income: 79 },
  // Row 5
  { code: "AZ", col: 2, row: 5, income: 72 },
  { code: "NM", col: 3, row: 5, income: 59 },
  { code: "KS", col: 4, row: 5, income: 69 },
  { code: "AR", col: 5, row: 5, income: 56 },
  { code: "TN", col: 6, row: 5, income: 64 },
  { code: "NC", col: 7, row: 5, income: 66 },
  { code: "SC", col: 8, row: 5, income: 63 },
  { code: "DC", col: 9, row: 5, income: 93 },
  // Row 6
  { code: "OK", col: 4, row: 6, income: 61 },
  { code: "LA", col: 5, row: 6, income: 56 },
  { code: "MS", col: 6, row: 6, income: 52 },
  { code: "AL", col: 7, row: 6, income: 60 },
  { code: "GA", col: 8, row: 6, income: 71 },
  { code: "FL", col: 10, row: 6, income: 67 },
  // Row 7
  { code: "HI", col: 0, row: 7, income: 94 },
  { code: "TX", col: 4, row: 7, income: 73 },
];

const COLS = 12;
const ROWS = 8;

const INCOME_MIN = 50;
const INCOME_MAX = 100;

interface Props {
  width: number;
  height: number;
}

export function TileMapChart({ width, height }: Props) {
  const margin = { top: 24, right: 72, bottom: 36, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Use square tiles — the whole point of the encoding is equal weight per
  // state. Fit the 12×8 grid into the plot area at the largest square size.
  const tile = Math.max(0, Math.min(iw / COLS, ih / ROWS));
  const gap = Math.max(1, tile * 0.06);
  const gridW = COLS * tile;
  const gridH = ROWS * tile;
  const gridX = Math.max(0, (iw - gridW) / 2);
  const gridY = Math.max(0, (ih - gridH) / 2);

  const tilePos = (s: State) => ({
    x: gridX + s.col * tile,
    y: gridY + s.row * tile,
  });

  const incomeT = (income: number) =>
    Math.max(0, Math.min(1, (income - INCOME_MIN) / (INCOME_MAX - INCOME_MIN)));

  const fillFor = (income: number) => {
    const t = incomeT(income);
    const opacity = 0.1 + t * 0.85;
    return `rgba(26,22,20,${opacity.toFixed(3)})`;
  };

  const labelFillFor = (income: number) =>
    incomeT(income) > 0.55 ? "var(--color-page)" : "var(--color-ink)";

  // Focal states for anchors.
  const ca = STATES.find((s) => s.code === "CA")!;
  const ms = STATES.find((s) => s.code === "MS")!;
  const ma = STATES.find((s) => s.code === "MA")!;
  const ri = STATES.find((s) => s.code === "RI")!;

  const caPos = tilePos(ca);
  const msPos = tilePos(ms);
  const maPos = tilePos(ma);
  const riPos = tilePos(ri);

  // Cluster rects (Deep South, Northeast) — in plot-local coords, clamped.
  const southLeft = STATES.find((s) => s.code === "LA")!;
  const southRight = STATES.find((s) => s.code === "AL")!;
  const southLPos = tilePos(southLeft);
  const southRPos = tilePos(southRight);
  const southRect = {
    x: Math.max(0, southLPos.x - gap),
    y: Math.max(0, southLPos.y - gap),
    width: Math.min(
      iw - Math.max(0, southLPos.x - gap),
      southRPos.x - southLPos.x + tile + gap * 2,
    ),
    height: Math.min(
      ih - Math.max(0, southLPos.y - gap),
      tile + gap * 2,
    ),
  };

  const neTopLeft = STATES.find((s) => s.code === "VT")!;
  const neBottomRight = STATES.find((s) => s.code === "RI")!;
  const neTLPos = tilePos(neTopLeft);
  const neBRPos = tilePos(neBottomRight);
  const neRect = {
    x: Math.max(0, neTLPos.x - gap),
    y: Math.max(0, neTLPos.y - gap),
    width: Math.min(
      iw - Math.max(0, neTLPos.x - gap),
      neBRPos.x - neTLPos.x + tile + gap * 2,
    ),
    height: Math.min(
      ih - Math.max(0, neTLPos.y - gap),
      neBRPos.y - neTLPos.y + tile + gap * 2,
    ),
  };

  // Legend — vertical ink ramp along the right margin.
  const legendW = 10;
  const legendH = Math.min(ih, 180);
  const legendX = iw + 24;
  const legendY = Math.max(0, (ih - legendH) / 2);
  const legendSteps = 20;

  return (
    <svg width={width} height={height} role="img" aria-label="Tile map">
      <Group left={margin.left} top={margin.top}>
        {/* State tiles */}
        <g data-data-layer="true">
          {STATES.map((s) => {
            const { x, y } = tilePos(s);
            const w = Math.max(0, tile - gap);
            const h = Math.max(0, tile - gap);
            return (
              <g key={s.code}>
                <rect
                  x={x + gap / 2}
                  y={y + gap / 2}
                  width={w}
                  height={h}
                  fill={fillFor(s.income)}
                />
                {tile >= 18 && (
                  <text
                    x={x + tile / 2}
                    y={y + tile / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize={Math.max(8, Math.min(11, tile * 0.34))}
                    fill={labelFillFor(s.income)}
                  >
                    {s.code}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Anchor 1 — one recognisable state tile (CA) */}
        <ExplainAnchor
          selector="state-tile"
          index={1}
          pin={{ x: caPos.x - 14, y: caPos.y + tile / 2 }}
          rect={{
            x: Math.max(0, caPos.x),
            y: Math.max(0, caPos.y),
            width: Math.min(iw - Math.max(0, caPos.x), tile),
            height: Math.min(ih - Math.max(0, caPos.y), tile),
          }}
        >
          <rect
            x={caPos.x + gap / 2}
            y={caPos.y + gap / 2}
            width={Math.max(0, tile - gap)}
            height={Math.max(0, tile - gap)}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
        </ExplainAnchor>

        {/* Anchor 2 — the Northeast high-income cluster */}
        <ExplainAnchor
          selector="high-income-cluster"
          index={2}
          pin={{ x: maPos.x + tile / 2, y: Math.max(0, maPos.y - 12) }}
          rect={neRect}
        >
          <rect
            x={neRect.x}
            y={neRect.y}
            width={neRect.width}
            height={neRect.height}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="3 2"
          />
        </ExplainAnchor>

        {/* Anchor 3 — the Deep South low-income cluster */}
        <ExplainAnchor
          selector="low-income-cluster"
          index={3}
          pin={{ x: msPos.x + tile / 2, y: Math.min(ih, msPos.y + tile + 14) }}
          rect={southRect}
        >
          <rect
            x={southRect.x}
            y={southRect.y}
            width={southRect.width}
            height={southRect.height}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="3 2"
          />
        </ExplainAnchor>

        {/* Anchor 4 — state-abbreviation convention (RI — tiny state, same tile) */}
        <ExplainAnchor
          selector="state-abbreviation"
          index={4}
          pin={{ x: Math.min(iw - 8, riPos.x + tile + 14), y: riPos.y + tile / 2 }}
          rect={{
            x: Math.max(0, riPos.x),
            y: Math.max(0, riPos.y),
            width: Math.min(iw - Math.max(0, riPos.x), tile),
            height: Math.min(ih - Math.max(0, riPos.y), tile),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — the grid-layout trade-off (covers the whole plot) */}
        <ExplainAnchor
          selector="grid-layout"
          index={5}
          pin={{ x: gridX + gridW / 2, y: Math.max(0, gridY - 12) }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* Colour-ramp legend — vertical ink ramp in the right margin */}
        <g data-data-layer="true" transform={`translate(${legendX}, ${legendY})`}>
          {Array.from({ length: legendSteps }).map((_, i) => {
            const t = i / (legendSteps - 1);
            const opacity = 0.1 + t * 0.85;
            const segH = legendH / legendSteps;
            return (
              <rect
                key={i}
                x={0}
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
            $100k
          </text>
          <text
            x={legendW + 6}
            y={legendH - 2}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            $50k
          </text>
          <text
            x={legendW + 6}
            y={legendH / 2}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            MHI
          </text>
        </g>

        {/* Anchor 6 — the colour-scale legend */}
        <ExplainAnchor
          selector="colour-scale"
          index={6}
          pin={{ x: iw - 6, y: legendY + legendH / 2 }}
          rect={{
            x: legendX - 2,
            y: legendY,
            width: legendW + 30,
            height: legendH,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
