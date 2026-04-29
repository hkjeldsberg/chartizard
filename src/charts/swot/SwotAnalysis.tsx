"use client";

import { Group } from "@visx/group";
import { scaleBand } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

type Valence = "positive" | "negative";
type Origin = "internal" | "external";

interface Cell {
  id: "strengths" | "weaknesses" | "opportunities" | "threats";
  title: string;
  col: "left" | "right"; // positive vs negative
  row: "top" | "bottom"; // internal vs external
  valence: Valence;
  origin: Origin;
  items: ReadonlyArray<string>;
}

const CELLS: ReadonlyArray<Cell> = [
  {
    id: "strengths",
    title: "STRENGTHS",
    col: "left",
    row: "top",
    valence: "positive",
    origin: "internal",
    items: [
      "Strong brand loyalty",
      "Best-in-class customer support",
      "Profitable unit economics",
    ],
  },
  {
    id: "weaknesses",
    title: "WEAKNESSES",
    col: "right",
    row: "top",
    valence: "negative",
    origin: "internal",
    items: [
      "Aging tech stack",
      "Limited mobile presence",
      "Narrow geographic footprint",
    ],
  },
  {
    id: "opportunities",
    title: "OPPORTUNITIES",
    col: "left",
    row: "bottom",
    valence: "positive",
    origin: "external",
    items: [
      "AI feature integration",
      "Expansion to emerging markets",
      "B2B vertical",
    ],
  },
  {
    id: "threats",
    title: "THREATS",
    col: "right",
    row: "bottom",
    valence: "negative",
    origin: "external",
    items: [
      "New well-funded competitor",
      "Regulatory pressure in EU",
      "App-store platform risk",
    ],
  },
];

export function SwotAnalysis({ width, height }: Props) {
  const margin = { top: 28, right: 20, bottom: 24, left: 52 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleBand<"left" | "right">({
    domain: ["left", "right"],
    range: [0, iw],
  });
  const yScale = scaleBand<"top" | "bottom">({
    domain: ["top", "bottom"],
    range: [0, ih],
  });

  const colW = xScale.bandwidth();
  const rowH = yScale.bandwidth();

  const tintPositive = "rgba(74, 106, 104, 0.08)";
  const tintNegative = "rgba(165, 90, 74, 0.08)";

  return (
    <svg width={width} height={height} role="img" aria-label="SWOT Analysis">
      <Group left={margin.left} top={margin.top}>
        {/* Column captions (positive / negative) above the grid */}
        <g>
          <text
            x={xScale("left")! + colW / 2}
            y={-14}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            POSITIVE
          </text>
          <text
            x={xScale("right")! + colW / 2}
            y={-14}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            NEGATIVE
          </text>
        </g>

        {/* Row captions (internal / external) to the left of the grid */}
        <g>
          <text
            x={-12}
            y={yScale("top")! + rowH / 2}
            textAnchor="end"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            INTERNAL
          </text>
          <text
            x={-12}
            y={yScale("bottom")! + rowH / 2}
            textAnchor="end"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            EXTERNAL
          </text>
        </g>

        {/* Cells */}
        <g data-data-layer="true">
          {CELLS.map((c) => {
            const x = xScale(c.col)!;
            const y = yScale(c.row)!;
            const tint = c.valence === "positive" ? tintPositive : tintNegative;
            return (
              <g key={c.id} transform={`translate(${x}, ${y})`}>
                <rect
                  x={0}
                  y={0}
                  width={colW}
                  height={rowH}
                  fill={tint}
                  stroke="var(--color-hairline)"
                  strokeWidth={1}
                />
                <text
                  x={12}
                  y={18}
                  fontFamily="var(--font-mono)"
                  fontSize={11}
                  fontWeight={600}
                  fill="var(--color-ink)"
                  letterSpacing={0.5}
                >
                  {c.title}
                </text>
                {/* Hairline under the cell header */}
                <line
                  x1={12}
                  x2={colW - 12}
                  y1={26}
                  y2={26}
                  stroke="var(--color-hairline)"
                  strokeWidth={1}
                />
                {c.items.map((it, i) => (
                  <g
                    key={i}
                    transform={`translate(12, ${40 + i * 16})`}
                  >
                    <circle cx={3} cy={-3} r={1.5} fill="var(--color-ink-soft)" />
                    <text
                      x={12}
                      y={0}
                      fontFamily="var(--font-mono)"
                      fontSize={10}
                      fill="var(--color-ink)"
                    >
                      {it}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}
        </g>

        {/* Central dividers */}
        <g data-data-layer="true">
          <line
            x1={iw / 2}
            x2={iw / 2}
            y1={0}
            y2={ih}
            stroke="var(--color-hairline)"
            strokeWidth={1.25}
          />
          <line
            x1={0}
            x2={iw}
            y1={ih / 2}
            y2={ih / 2}
            stroke="var(--color-hairline)"
            strokeWidth={1.25}
          />
        </g>

        {/* Anchors — clamp all rects inside the plot area */}

        {/* 1. Strengths (top-left) */}
        <ExplainAnchor
          selector="strengths-cell"
          index={1}
          pin={{ x: xScale("left")! + 14, y: yScale("top")! + 14 }}
          rect={{
            x: xScale("left")!,
            y: yScale("top")!,
            width: colW,
            height: rowH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Weaknesses (top-right) */}
        <ExplainAnchor
          selector="weaknesses-cell"
          index={2}
          pin={{ x: xScale("right")! + colW - 14, y: yScale("top")! + 14 }}
          rect={{
            x: xScale("right")!,
            y: yScale("top")!,
            width: colW,
            height: rowH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Opportunities (bottom-left) */}
        <ExplainAnchor
          selector="opportunities-cell"
          index={3}
          pin={{ x: xScale("left")! + 14, y: yScale("bottom")! + rowH - 14 }}
          rect={{
            x: xScale("left")!,
            y: yScale("bottom")!,
            width: colW,
            height: rowH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Threats (bottom-right) */}
        <ExplainAnchor
          selector="threats-cell"
          index={4}
          pin={{ x: xScale("right")! + colW - 14, y: yScale("bottom")! + rowH - 14 }}
          rect={{
            x: xScale("right")!,
            y: yScale("bottom")!,
            width: colW,
            height: rowH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Internal vs external axis (horizontal mid-divider) */}
        <ExplainAnchor
          selector="internal-external-axis"
          index={5}
          pin={{ x: iw - 16, y: ih / 2 }}
          rect={{
            x: 0,
            y: Math.max(0, ih / 2 - 6),
            width: iw,
            height: Math.min(12, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Positive vs negative axis (vertical mid-divider) */}
        <ExplainAnchor
          selector="positive-negative-axis"
          index={6}
          pin={{ x: iw / 2, y: 16 }}
          rect={{
            x: Math.max(0, iw / 2 - 6),
            y: 0,
            width: Math.min(12, iw),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
