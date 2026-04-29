"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// rs: fall risk in adults 65+: 30 out of 100
const TOTAL = 100;
const EVENT_COUNT = 30;
const COLS = 10;
const ROWS = 10;

const LABEL = "Annual fall risk for adults aged 65+: 30 in 100";
const EVENT_LABEL = "30 out of every 100 adults aged 65 or older experience a fall each year.";

// Stick figure as a minimal SVG path (centred at 0,0, height ~1 unit)
// Body: head circle r=0.18, torso line, arms, legs
function StickFigure({
  cx,
  cy,
  size,
  highlighted,
}: {
  cx: number;
  cy: number;
  size: number;
  highlighted: boolean;
}) {
  const s = size;
  const fill = highlighted ? "var(--color-ink)" : "var(--color-hairline)";
  const stroke = highlighted ? "var(--color-ink)" : "var(--color-hairline)";
  // All coordinates relative to (cx, cy), scaled by s
  // head radius
  const hr = s * 0.18;
  // torso from head-bottom to pelvis
  const headBottom = -s * 0.5 + hr * 2;
  const pelvis = -s * 0.5 + s * 0.6;
  // arms
  const armY = headBottom + (pelvis - headBottom) * 0.25;
  // legs
  return (
    <g transform={`translate(${cx},${cy})`} style={{ pointerEvents: "none" }}>
      {/* head */}
      <circle cx={0} cy={-s * 0.5 + hr} r={hr} fill={fill} />
      {/* torso */}
      <line
        x1={0}
        y1={headBottom}
        x2={0}
        y2={pelvis}
        stroke={stroke}
        strokeWidth={s * 0.08}
        strokeLinecap="round"
      />
      {/* arms */}
      <line
        x1={-s * 0.3}
        y1={armY}
        x2={s * 0.3}
        y2={armY}
        stroke={stroke}
        strokeWidth={s * 0.08}
        strokeLinecap="round"
      />
      {/* left leg */}
      <line
        x1={0}
        y1={pelvis}
        x2={-s * 0.25}
        y2={s * 0.5}
        stroke={stroke}
        strokeWidth={s * 0.08}
        strokeLinecap="round"
      />
      {/* right leg */}
      <line
        x1={0}
        y1={pelvis}
        x2={s * 0.25}
        y2={s * 0.5}
        stroke={stroke}
        strokeWidth={s * 0.08}
        strokeLinecap="round"
      />
    </g>
  );
}

export function IconArrayChart({ width, height }: { width: number; height: number }) {
  const margin = { top: 24, right: 20, bottom: 56, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Grid cell size — fit COLS × ROWS into iw × ih
  const cellSize = Math.min(iw / COLS, ih / ROWS);
  const figureSize = cellSize * 0.72;

  // Grid origin: centre the grid within the inner area
  const gridW = cellSize * COLS;
  const gridH = cellSize * ROWS;
  const gridOffX = (iw - gridW) / 2;
  const gridOffY = 0;

  // Build figure positions
  const figures: { col: number; row: number; highlighted: boolean }[] = [];
  let count = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      figures.push({ col, row, highlighted: count < EVENT_COUNT });
      count++;
    }
  }

  // Caption y — below the grid, within the bottom margin
  const captionY = ih + 14;
  const captionY2 = ih + 28;

  // Anchor positions for pins
  // 1. Highlighted figures (event icons) — top-left quadrant of highlighted block
  const hlCols = Math.ceil(EVENT_COUNT / ROWS);
  const hlPinX = gridOffX + hlCols * cellSize * 0.5;
  const hlPinY = gridOffY + cellSize * 0.5;

  // 2. Non-event icons — right side
  const noEventPinX = gridOffX + (COLS - 2) * cellSize;
  const noEventPinY = gridOffY + 5 * cellSize;

  // 3. Grid structure — right edge pin
  const gridPinX = gridOffX + gridW + 12;
  const gridPinY = gridOffY + gridH / 2;

  // 4. Caption / verbal frame — below grid
  const captionPinX = iw / 2;
  const captionPinYAnchor = ih + 42;

  // 5. Count label (top-left annotation)
  const countLabelPinX = gridOffX - 12;
  const countLabelPinY = gridOffY - 12;

  return (
    <svg width={width} height={height} role="img" aria-label={LABEL}>
      <Group left={margin.left} top={margin.top}>
        {/* Data layer: all figures */}
        <g data-data-layer="true">
          {figures.map(({ col, row, highlighted }) => {
            const cx = gridOffX + col * cellSize + cellSize / 2;
            const cy = gridOffY + row * cellSize + cellSize / 2;
            return (
              <StickFigure
                key={`${row}-${col}`}
                cx={cx}
                cy={cy}
                size={figureSize}
                highlighted={highlighted}
              />
            );
          })}
        </g>

        {/* Anchor 1: Highlighted event icons */}
        <ExplainAnchor
          selector="event-icons"
          index={1}
          pin={{ x: hlPinX, y: hlPinY - 14 }}
          rect={{
            x: gridOffX,
            y: gridOffY,
            width: hlCols * cellSize,
            height: gridH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: Non-event (background) icons */}
        <ExplainAnchor
          selector="non-event-icons"
          index={2}
          pin={{ x: noEventPinX + 14, y: noEventPinY }}
          rect={{
            x: gridOffX + hlCols * cellSize,
            y: gridOffY,
            width: (COLS - hlCols) * cellSize,
            height: gridH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: Grid structure (the 10×10 = 100 convention) */}
        <ExplainAnchor
          selector="grid-structure"
          index={3}
          pin={{ x: gridPinX, y: gridPinY }}
          rect={{
            x: gridOffX,
            y: gridOffY,
            width: gridW,
            height: gridH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Count annotation above grid */}
        <text
          x={gridOffX}
          y={-6}
          fontFamily="var(--font-mono)"
          fontSize={11}
          fill="var(--color-ink)"
          fontWeight="600"
        >
          {EVENT_COUNT} IN {TOTAL}
        </text>

        {/* Anchor 4: count label */}
        <ExplainAnchor
          selector="count-label"
          index={4}
          pin={{ x: countLabelPinX, y: countLabelPinY }}
          rect={{ x: gridOffX, y: -18, width: 80, height: 16 }}
        >
          <g />
        </ExplainAnchor>

        {/* Caption / verbal frame */}
        <text
          x={iw / 2}
          y={captionY}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-soft)"
        >
          {EVENT_LABEL.slice(0, 50)}
        </text>
        <text
          x={iw / 2}
          y={captionY2}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-soft)"
        >
          {EVENT_LABEL.slice(50)}
        </text>

        {/* Anchor 5: Verbal caption / frequency statement */}
        <ExplainAnchor
          selector="verbal-frame"
          index={5}
          pin={{ x: captionPinX, y: captionPinYAnchor }}
          rect={{
            x: 0,
            y: ih + 8,
            width: iw,
            height: margin.bottom - 8,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
