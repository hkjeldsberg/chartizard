"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ─── Renko types ────────────────────────────────────────────────────────────

interface RenkoBrick {
  index: number;       // brick event-index (x position)
  priceLevel: number;  // bottom price of the brick
  direction: "up" | "down";
}

// ─── Seeded LCG price generator ─────────────────────────────────────────────
// Same seed/parameters as KagiChart for narrative consistency

function generatePrices(): number[] {
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const prices: number[] = [];
  let price = 100;
  for (let i = 0; i < 60; i++) {
    const drift = i < 35 ? 0.3 : -0.45;
    const move = (rand() - 0.48) * 3 + drift;
    price = Math.max(80, price + move);
    prices.push(Math.round(price * 100) / 100);
  }
  return prices;
}

// ─── Renko construction ─────────────────────────────────────────────────────
// brickSize: fixed price height of each brick
// Reversal rule: 2× brickSize in opposite direction required to start reversal

function buildRenko(prices: number[], brickSize: number): RenkoBrick[] {
  if (prices.length === 0) return [];

  const bricks: RenkoBrick[] = [];
  let currentClose = prices[0];
  // Snap to nearest brick boundary
  let refLevel = Math.floor(currentClose / brickSize) * brickSize;

  for (let i = 1; i < prices.length; i++) {
    const p = prices[i];

    // How many up-bricks can we add?
    while (p >= refLevel + brickSize) {
      bricks.push({
        index: bricks.length,
        priceLevel: refLevel,
        direction: "up",
      });
      refLevel += brickSize;
    }

    // How many down-bricks? Reversal requires 2× brick (standard rule)
    while (p <= refLevel - 2 * brickSize) {
      refLevel -= brickSize;
      bricks.push({
        index: bricks.length,
        priceLevel: refLevel,
        direction: "down",
      });
    }

    currentClose = p;
  }

  // Safety: if no bricks were produced, generate a minimal pair for display
  if (bricks.length === 0) {
    bricks.push({ index: 0, priceLevel: refLevel, direction: "up" });
    bricks.push({ index: 1, priceLevel: refLevel + brickSize, direction: "up" });
  }

  return bricks;
}

interface Props {
  width: number;
  height: number;
}

export function RenkoChart({ width, height }: Props) {
  const margin = { top: 20, right: 30, bottom: 44, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const BRICK_SIZE = 2; // $2 per brick

  const bricks = useMemo(() => {
    const prices = generatePrices();
    return buildRenko(prices, BRICK_SIZE);
  }, []);

  const numBricks = bricks.length;

  // Each brick gets equal horizontal space
  const brickWidth = numBricks > 0 ? iw / numBricks : 20;
  const brickHeight = Math.max(2, ih / 20); // visual brick height in px

  // y-scale: price domain
  const allPriceLevels = bricks.map((b) => b.priceLevel);
  const priceMin = Math.min(...allPriceLevels) - BRICK_SIZE;
  const priceMax = Math.max(...allPriceLevels) + BRICK_SIZE * 2;

  const yScale = scaleLinear({
    domain: [priceMin, priceMax],
    range: [ih, 0],
    nice: true,
  });

  const ticksY = yScale.ticks(5);

  // Scaled brick height in pixels from one brick-size increment
  const scaledBrickH = Math.abs(yScale(0) - yScale(BRICK_SIZE));

  // ─── Anchor reference bricks ───────────────────────────────────────────

  // Find first up-brick (should be early)
  const firstUpIdx = bricks.findIndex((b) => b.direction === "up");
  const safeUpIdx = firstUpIdx >= 0 ? firstUpIdx : 0;

  // Find first down-brick (after some up-bricks)
  const firstDownIdx = bricks.findIndex((b) => b.direction === "down");
  const safeDownIdx = firstDownIdx >= 0 ? firstDownIdx : Math.min(bricks.length - 1, safeUpIdx + 1);

  // Find a run of 3+ consecutive up-bricks (trend sequence)
  let trendStartIdx = safeUpIdx;
  for (let i = 0; i < bricks.length - 2; i++) {
    if (
      bricks[i].direction === "up" &&
      bricks[i + 1].direction === "up" &&
      bricks[i + 2].direction === "up"
    ) {
      trendStartIdx = i;
      break;
    }
  }

  const upBrick = bricks[safeUpIdx];
  const downBrick = bricks[safeDownIdx];
  const trendBrick = bricks[trendStartIdx];

  const brickX = (b: RenkoBrick) => b.index * brickWidth;
  const brickY = (b: RenkoBrick) => yScale(b.priceLevel + BRICK_SIZE); // top of brick

  // Reversal annotation position (midpoint)
  const reversalAnnotX = iw * 0.55;
  const reversalAnnotY = ih - 8;

  return (
    <svg width={width} height={height} role="img" aria-label="Renko chart">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {ticksY.map((t) => (
            <line
              key={t}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* All bricks rendered: up = hollow (stroke only), down = filled */}
        {/* Up bricks anchor wraps all up-bricks */}
        <ExplainAnchor
          selector="up-brick"
          index={1}
          pin={{
            x: brickX(upBrick) + brickWidth + 8,
            y: brickY(upBrick) - 8,
          }}
          rect={{
            x: Math.max(0, brickX(upBrick) - 2),
            y: brickY(upBrick) - 2,
            width: Math.min(brickWidth + 4, iw - Math.max(0, brickX(upBrick) - 2)),
            height: scaledBrickH + 4,
          }}
        >
          <g data-data-layer="true">
            {bricks
              .filter((b) => b.direction === "up")
              .map((b) => (
                <rect
                  key={`up-${b.index}`}
                  x={brickX(b)}
                  y={brickY(b)}
                  width={Math.max(1, brickWidth - 1)}
                  height={Math.max(1, scaledBrickH)}
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                />
              ))}
          </g>
        </ExplainAnchor>

        {/* Down bricks anchor wraps all down-bricks */}
        <ExplainAnchor
          selector="down-brick"
          index={2}
          pin={{
            x: brickX(downBrick) + brickWidth + 8,
            y: brickY(downBrick) + scaledBrickH / 2,
          }}
          rect={{
            x: Math.max(0, brickX(downBrick) - 2),
            y: brickY(downBrick) - 2,
            width: Math.min(brickWidth + 4, iw - Math.max(0, brickX(downBrick) - 2)),
            height: scaledBrickH + 4,
          }}
        >
          <g data-data-layer="true">
            {bricks
              .filter((b) => b.direction === "down")
              .map((b) => (
                <rect
                  key={`dn-${b.index}`}
                  x={brickX(b)}
                  y={brickY(b)}
                  width={Math.max(1, brickWidth - 1)}
                  height={Math.max(1, scaledBrickH)}
                  fill="var(--color-ink)"
                  stroke="var(--color-ink)"
                  strokeWidth={1}
                />
              ))}
          </g>
        </ExplainAnchor>

        {/* Brick size annotation anchor */}
        <ExplainAnchor
          selector="brick-size"
          index={3}
          pin={{ x: reversalAnnotX - 4, y: reversalAnnotY - 12 }}
          rect={{
            x: Math.max(0, reversalAnnotX - 55),
            y: reversalAnnotY - 8,
            width: Math.min(120, iw - Math.max(0, reversalAnnotX - 55)),
            height: 16,
          }}
        >
          <text
            x={reversalAnnotX}
            y={reversalAnnotY}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
            textAnchor="middle"
          >
            BRICK = $2
          </text>
        </ExplainAnchor>

        {/* Trend sequence (3+ consecutive up-bricks) anchor */}
        <ExplainAnchor
          selector="trend-sequence"
          index={4}
          pin={{
            x: brickX(trendBrick) + brickWidth * 1.5 + 10,
            y: brickY(trendBrick) - 14,
          }}
          rect={{
            x: Math.max(0, brickX(trendBrick) - 2),
            y: Math.max(0, brickY(trendBrick) - 2),
            width: Math.min(brickWidth * 3 + 4, iw - Math.max(0, brickX(trendBrick) - 2)),
            height: Math.min(scaledBrickH * 3 + 8, ih - Math.max(0, brickY(trendBrick) - 2)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Event axis anchor */}
        <ExplainAnchor
          selector="event-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <g>
            <line
              x1={0}
              x2={iw}
              y1={ih}
              y2={ih}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
            />
            <text
              x={iw / 2}
              y={ih + 14}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-mute)"
            >
              EVENTS (NOT TIME)
            </text>
            {/* Tick marks every 5 bricks */}
            {bricks
              .filter((_, i) => i % 5 === 0)
              .map((b) => (
                <line
                  key={b.index}
                  x1={brickX(b)}
                  x2={brickX(b)}
                  y1={ih}
                  y2={ih + 4}
                  stroke="var(--color-ink-mute)"
                  strokeWidth={0.8}
                />
              ))}
          </g>
        </ExplainAnchor>

        {/* Y-axis */}
        <AxisLeft
          scale={yScale}
          numTicks={5}
          tickFormat={(v) => `$${v}`}
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

        {/* Legend */}
        <g transform="translate(0, -14)" data-data-layer="true">
          <rect
            x={0}
            y={0}
            width={12}
            height={10}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          <text x={18} y={9} fontFamily="var(--font-mono)" fontSize={10} fill="var(--color-ink-soft)">
            UP BRICK
          </text>
          <rect x={90} y={0} width={12} height={10} fill="var(--color-ink)" />
          <text x={108} y={9} fontFamily="var(--font-mono)" fontSize={10} fill="var(--color-ink-soft)">
            DOWN BRICK
          </text>
        </g>
      </Group>
    </svg>
  );
}
