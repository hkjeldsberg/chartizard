"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear, scaleBand } from "@visx/scale";
import { AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// P&F column: either X (rising) or O (falling), with a list of price levels
interface PFColumn {
  kind: "X" | "O";
  /** Absolute price levels (one per box) this column occupies, ascending */
  levels: number[];
  colIndex: number;
}

/**
 * Seeded LCG price generator for P&F construction.
 * Returns ~8 alternating X/O columns representing a trend-then-reversal
 * price action sequence.
 */
function buildPFData(boxSize: number, reversalBoxes: number) {
  // LCG parameters matching other finance charts in this codebase
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Generate a raw price series: up-trend, mini-pullback, rally, down-trend
  const prices: number[] = [];
  let p = 100;
  prices.push(p);

  // Phase 1: up-trend (~30 steps)
  for (let i = 0; i < 30; i++) {
    p += (rand() - 0.3) * boxSize * 2.4;
    prices.push(p);
  }
  // Phase 2: sharp pullback (~12 steps)
  for (let i = 0; i < 12; i++) {
    p -= (rand() + 0.1) * boxSize * 2.0;
    prices.push(p);
  }
  // Phase 3: recovery rally (~20 steps)
  for (let i = 0; i < 20; i++) {
    p += (rand() - 0.2) * boxSize * 2.2;
    prices.push(p);
  }
  // Phase 4: final decline (~20 steps)
  for (let i = 0; i < 20; i++) {
    p -= (rand() + 0.05) * boxSize * 2.0;
    prices.push(p);
  }
  // Phase 5: bounce (~12 steps)
  for (let i = 0; i < 12; i++) {
    p += (rand() - 0.2) * boxSize * 2.2;
    prices.push(p);
  }

  // Apply P&F construction algorithm
  const columns: PFColumn[] = [];
  const reversalSize = boxSize * reversalBoxes;

  if (prices.length === 0) return columns;

  // Snap a price to its box level (floor to nearest box boundary)
  const snap = (v: number) => Math.floor(v / boxSize) * boxSize;

  const currentPrice = prices[0];
  let columnTop = snap(currentPrice);
  let columnBottom = snap(currentPrice);
  let colKind: "X" | "O" = "X";
  let colStart = columnBottom;

  const pushColumn = (kind: "X" | "O", bottom: number, top: number) => {
    if (top < bottom) return;
    const levels: number[] = [];
    for (let lv = bottom; lv <= top; lv += boxSize) {
      levels.push(Math.round(lv * 100) / 100);
    }
    if (levels.length > 0) {
      columns.push({ kind, levels, colIndex: columns.length });
    }
  };

  for (let i = 1; i < prices.length; i++) {
    const price = prices[i];
    const snapped = snap(price);

    if (colKind === "X") {
      if (snapped >= columnTop + boxSize) {
        // Extend the X column upward
        columnTop = snapped;
      } else if (snapped <= columnTop - reversalSize) {
        // Reversal: save current X column then start O column
        pushColumn("X", colStart, columnTop);
        colKind = "O";
        colStart = columnTop - boxSize; // one below top of X column
        columnBottom = snapped;
        columnTop = colStart;
      }
    } else {
      // In O column
      if (snapped <= columnBottom - boxSize) {
        // Extend the O column downward
        columnBottom = snapped;
      } else if (snapped >= columnBottom + reversalSize) {
        // Reversal: save O column then start X column
        pushColumn("O", columnBottom, colStart);
        colKind = "X";
        colStart = columnBottom + boxSize; // one above bottom of O column
        columnTop = snapped;
        columnBottom = colStart;
      }
    }
  }

  // Push the last in-progress column
  if (colKind === "X") {
    pushColumn("X", colStart, columnTop);
  } else {
    pushColumn("O", columnBottom, colStart);
  }

  return columns;
}

interface Props {
  width: number;
  height: number;
}

const BOX_SIZE = 0.5;
const REVERSAL = 3;

export function PointAndFigureChart({ width, height }: Props) {
  const margin = { top: 20, right: 80, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const columns = useMemo(() => buildPFData(BOX_SIZE, REVERSAL), []);

  // Collect all price levels across all columns
  const allLevels = columns.flatMap((c) => c.levels);
  const priceMin = Math.min(...allLevels);
  const priceMax = Math.max(...allLevels);

  // Y scale maps price to pixel
  const yPad = BOX_SIZE * 2;
  const yScale = scaleLinear({
    domain: [priceMin - yPad, priceMax + yPad],
    range: [ih, 0],
    nice: false,
  });

  // Box height in pixels
  const boxH = Math.abs(yScale(0) - yScale(BOX_SIZE));
  const boxHClamped = Math.max(4, boxH);

  // Distribute columns evenly across iw
  const numCols = columns.length;
  const colW = numCols > 0 ? Math.max(10, iw / numCols) : 20;

  const colX = (colIndex: number) => colIndex * colW + colW / 2;

  // Representative columns for anchors — find first X, first O, and a transition
  const firstX = columns.find((c) => c.kind === "X");
  const firstO = columns.find((c) => c.kind === "O");
  // Transition: first O column (X→O boundary)
  const transitionColO = firstO;
  const transitionColX = firstX;

  // Support/resistance: find a price level that appears in ≥2 columns
  const levelCounts: Map<number, number> = new Map();
  for (const col of columns) {
    for (const lv of col.levels) {
      const rounded = Math.round(lv / BOX_SIZE) * BOX_SIZE;
      levelCounts.set(rounded, (levelCounts.get(rounded) ?? 0) + 1);
    }
  }
  let supportLevel: number | null = null;
  let supportCount = 0;
  levelCounts.forEach((count, lv) => {
    if (count > supportCount && lv > priceMin + BOX_SIZE && lv < priceMax - BOX_SIZE) {
      supportCount = count;
      supportLevel = lv;
    }
  });

  // Pin coords for annotation label (box-size / reversal)
  const labelX = iw + 4;
  const labelY = 10;

  return (
    <svg width={width} height={height} role="img" aria-label="Point-and-Figure Chart">
      <Group left={margin.left} top={margin.top}>
        {/* Grid lines at each box level */}
        <g data-data-layer="true">
          {yScale.ticks(8).map((t) => (
            <line
              key={t}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="1 4"
            />
          ))}
        </g>

        {/* X and O symbols */}
        <g data-data-layer="true">
          {columns.map((col) => {
            const cx = colX(col.colIndex);
            return col.levels.map((lv) => {
              const cy = yScale(lv) + boxHClamped / 2;
              const fontSize = Math.min(boxHClamped * 0.9, 14);
              return (
                <text
                  key={`${col.colIndex}-${lv}`}
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={fontSize}
                  fill={col.kind === "X" ? "var(--color-ink)" : "var(--color-ink-soft)"}
                  fontWeight={col.kind === "X" ? "600" : "400"}
                >
                  {col.kind}
                </text>
              );
            });
          })}
        </g>

        {/* Column dividers (subtle vertical guides) */}
        <g data-data-layer="true">
          {columns.map((col, i) =>
            i > 0 ? (
              <line
                key={`div-${i}`}
                x1={colX(col.colIndex) - colW / 2}
                x2={colX(col.colIndex) - colW / 2}
                y1={0}
                y2={ih}
                stroke="var(--color-hairline)"
                strokeWidth={0.5}
              />
            ) : null
          )}
        </g>

        {/* Anchor 1: X column (rising) */}
        {firstX && (
          <ExplainAnchor
            selector="x-column"
            index={1}
            pin={{ x: colX(firstX.colIndex) + colW * 0.6, y: yScale(firstX.levels[Math.floor(firstX.levels.length / 2)]) - 12 }}
            rect={{
              x: Math.max(0, colX(firstX.colIndex) - colW / 2),
              y: Math.max(0, yScale(firstX.levels[firstX.levels.length - 1]) - 4),
              width: Math.min(colW, iw),
              height: Math.min(
                yScale(firstX.levels[0]) - yScale(firstX.levels[firstX.levels.length - 1]) + boxHClamped + 8,
                ih
              ),
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 2: O column (falling) */}
        {firstO && (
          <ExplainAnchor
            selector="o-column"
            index={2}
            pin={{ x: colX(firstO.colIndex) + colW * 0.6, y: yScale(firstO.levels[Math.floor(firstO.levels.length / 2)]) + 12 }}
            rect={{
              x: Math.max(0, colX(firstO.colIndex) - colW / 2),
              y: Math.max(0, yScale(firstO.levels[firstO.levels.length - 1]) - 4),
              width: Math.min(colW, iw - colX(firstO.colIndex) + colW / 2),
              height: Math.min(
                yScale(firstO.levels[0]) - yScale(firstO.levels[firstO.levels.length - 1]) + boxHClamped + 8,
                ih
              ),
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 3: column transition X→O */}
        {transitionColO && transitionColX && (
          <ExplainAnchor
            selector="column-transition"
            index={3}
            pin={{ x: colX(transitionColO.colIndex) - colW / 2, y: yScale(transitionColO.levels[transitionColO.levels.length - 1]) - 16 }}
            rect={{
              x: Math.max(0, colX(transitionColX.colIndex) - colW / 2),
              y: 0,
              width: Math.min(colW * 2, iw),
              height: ih,
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 4: box size annotation (top right) */}
        <ExplainAnchor
          selector="box-annotation"
          index={4}
          pin={{ x: labelX + 8, y: labelY + 8 }}
          rect={{ x: iw, y: 0, width: margin.right - 4, height: 36 }}
        >
          <g>
            <text
              x={labelX}
              y={labelY}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
              textAnchor="start"
            >
              {BOX_SIZE}% box
            </text>
            <text
              x={labelX}
              y={labelY + 13}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
              textAnchor="start"
            >
              {REVERSAL}-box rev.
            </text>
          </g>
        </ExplainAnchor>

        {/* Anchor 5: 3-box reversal rule */}
        <ExplainAnchor
          selector="reversal-rule"
          index={5}
          pin={{ x: iw / 2, y: ih - 8 }}
          rect={{ x: 0, y: ih - 20, width: iw, height: 20 }}
        >
          <g>
            <text
              x={iw / 2}
              y={ih - 4}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              ← {REVERSAL}-box reversal required to change column →
            </text>
          </g>
        </ExplainAnchor>

        {/* Anchor 6: support/resistance row */}
        {supportLevel !== null && (
          <ExplainAnchor
            selector="support-resistance"
            index={6}
            pin={{ x: -10, y: yScale(supportLevel as number) }}
            rect={{
              x: 0,
              y: Math.max(0, yScale(supportLevel as number) - boxHClamped / 2 - 2),
              width: iw,
              height: boxHClamped + 4,
            }}
          >
            <line
              x1={0}
              x2={iw}
              y1={yScale(supportLevel as number) + boxHClamped / 2}
              y2={yScale(supportLevel as number) + boxHClamped / 2}
              stroke="var(--color-ink-mute)"
              strokeDasharray="3 3"
              strokeWidth={0.8}
            />
          </ExplainAnchor>
        )}

        {/* Y-axis */}
        <AxisLeft
          scale={yScale}
          numTicks={6}
          tickFormat={(v) => `${Number(v).toFixed(0)}`}
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

        {/* X-axis label */}
        <text
          x={iw / 2}
          y={ih + 36}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
        >
          COLUMN (EACH = 1 PRICE MOVE)
        </text>
      </Group>
    </svg>
  );
}
