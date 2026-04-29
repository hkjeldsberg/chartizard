"use client";

import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Five-level Likert scale. Left-hand (disagree) levels render in warm tones;
// right-hand (agree) levels render in ink tones; Neutral straddles the centre
// and splits half-left, half-right — the classic "split the neutral" variant.
type Row = {
  question: string;
  sd: number; // Strongly Disagree
  d: number; // Disagree
  n: number; // Neutral
  a: number; // Agree
  sa: number; // Strongly Agree
};

// Eight workplace-engagement questions. Each row sums to 100. Hand-picked so
// the set spans strongly positive ("My team is productive"), strongly negative
// ("Pay is fair"), and balanced ("Tools I have work well").
const DATA: ReadonlyArray<Row> = [
  { question: "My team is productive",           sd: 2,  d: 6,  n: 10, a: 44, sa: 38 },
  { question: "I have clear goals this quarter", sd: 4,  d: 10, n: 14, a: 42, sa: 30 },
  { question: "My manager gives useful feedback",sd: 6,  d: 14, n: 18, a: 38, sa: 24 },
  { question: "I can balance work and life",     sd: 10, d: 18, n: 22, a: 30, sa: 20 },
  { question: "Tools I have work well",          sd: 12, d: 22, n: 28, a: 26, sa: 12 },
  { question: "My work is recognized",           sd: 16, d: 26, n: 20, a: 24, sa: 14 },
  { question: "Leadership communicates clearly", sd: 22, d: 30, n: 18, a: 20, sa: 10 },
  { question: "Pay is fair for my role",         sd: 32, d: 30, n: 16, a: 16, sa: 6  },
];

// Left-of-centre amount = Strongly Disagree + Disagree + Neutral/2
function leftOf(row: Row): number {
  return row.sd + row.d + row.n / 2;
}

const LEVELS = ["sd", "d", "n", "a", "sa"] as const;
type Level = (typeof LEVELS)[number];
const LEVEL_LABEL: Record<Level, string> = {
  sd: "Strongly Disagree",
  d: "Disagree",
  n: "Neutral",
  a: "Agree",
  sa: "Strongly Agree",
};
const LEVEL_COLOUR: Record<Level, string> = {
  sd: "#a55a4a",
  d: "#c78b7d",
  n: "var(--color-hairline)",
  a: "#8a8a8a",
  sa: "var(--color-ink)",
};

interface Props {
  width: number;
  height: number;
}

export function LikertChart({ width, height }: Props) {
  const margin = { top: 48, right: 28, bottom: 48, left: 168 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Each row is centred such that the midpoint of its Neutral segment sits at
  // x = 0. The x-axis therefore runs in signed percentage points. Domain is
  // the widest extent any single row needs on either side (plus a small pad).
  const maxExtent = Math.max(
    ...DATA.flatMap((r) => [leftOf(r), r.a + r.sa + r.n / 2]),
  );
  const extent = Math.ceil(maxExtent / 10) * 10; // round up to nearest 10

  const xScale = scaleLinear<number>({
    domain: [-extent, extent],
    range: [0, iw],
    nice: false,
  });

  const yScale = scaleBand<string>({
    domain: DATA.map((d) => d.question),
    range: [0, ih],
    padding: 0.3,
  });

  const bh = yScale.bandwidth();
  const zeroX = xScale(0);
  const ticksX = xScale.ticks(6);

  // Pre-compute segment geometry for every row.
  // For each level, we know where the segment starts (left edge in x-units
  // relative to centre) and how wide it is.
  type Seg = { x: number; width: number; level: Level };
  const segmentsFor = (row: Row): Seg[] => {
    const startLeft = -leftOf(row); // x-position of the bar's left edge
    const widths: Record<Level, number> = {
      sd: row.sd,
      d: row.d,
      n: row.n,
      a: row.a,
      sa: row.sa,
    };
    const segs: Seg[] = [];
    let cursor = startLeft;
    for (const lvl of LEVELS) {
      const w = widths[lvl];
      segs.push({ x: cursor, width: w, level: lvl });
      cursor += w;
    }
    return segs;
  };

  // Pick representative rows for anchors.
  // Row most tilted positive: highest (sa + a) — top row.
  const positiveRow = DATA[0];
  const positiveY = yScale(positiveRow.question) ?? 0;
  const positiveSegs = segmentsFor(positiveRow);
  const saSeg = positiveSegs[4]; // Strongly Agree — rightmost
  const saX1 = xScale(saSeg.x);
  const saX2 = xScale(saSeg.x + saSeg.width);

  // Row most tilted negative — bottom row.
  const negativeRow = DATA[DATA.length - 1];
  const negativeY = yScale(negativeRow.question) ?? 0;
  const negativeSegs = segmentsFor(negativeRow);
  const sdSeg = negativeSegs[0]; // Strongly Disagree — leftmost of the negative row
  const sdX1 = xScale(sdSeg.x);
  const sdX2 = xScale(sdSeg.x + sdSeg.width);

  // Neutral-band anchor — vertical stripe across all rows at x = 0.
  // (Rect clamped to plot area.)
  return (
    <svg width={width} height={height} role="img" aria-label="Likert diverging stacked bar chart">
      <Group left={margin.left} top={margin.top}>
        {/* Vertical gridlines */}
        <g data-data-layer="true">
          {ticksX.map((t) => (
            <line
              key={t}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray={t === 0 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* Stacked segments */}
        <g data-data-layer="true">
          {DATA.map((row) => {
            const y = yScale(row.question) ?? 0;
            const segs = segmentsFor(row);
            return (
              <g key={row.question}>
                {segs.map((s) => {
                  const x = xScale(s.x);
                  const w = Math.max(0, xScale(s.x + s.width) - x);
                  if (w <= 0) return null;
                  return (
                    <rect
                      key={s.level}
                      x={x}
                      y={y}
                      width={w}
                      height={bh}
                      fill={LEVEL_COLOUR[s.level]}
                    />
                  );
                })}
              </g>
            );
          })}
        </g>

        {/* Anchor 1: a single stacked row — highlight the top row's full bar */}
        <ExplainAnchor
          selector="stacked-row"
          index={1}
          pin={{ x: iw + 14, y: positiveY + bh / 2 }}
          rect={{
            x: xScale(-leftOf(positiveRow)),
            y: positiveY,
            width: Math.max(
              0,
              xScale(positiveRow.a + positiveRow.sa + positiveRow.n / 2) -
                xScale(-leftOf(positiveRow)),
            ),
            height: bh,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: Strongly Agree segment (rightmost of positive row) */}
        <ExplainAnchor
          selector="strongly-agree"
          index={2}
          pin={{ x: (saX1 + saX2) / 2, y: positiveY - 12 }}
          rect={{ x: saX1, y: positiveY, width: Math.max(0, saX2 - saX1), height: bh }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: Strongly Disagree segment (leftmost of negative row) */}
        <ExplainAnchor
          selector="strongly-disagree"
          index={3}
          pin={{ x: (sdX1 + sdX2) / 2, y: negativeY + bh + 14 }}
          rect={{ x: sdX1, y: negativeY, width: Math.max(0, sdX2 - sdX1), height: bh }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: Neutral band / centre line */}
        <ExplainAnchor
          selector="neutral-band"
          index={4}
          pin={{ x: zeroX, y: -14 }}
          rect={{ x: Math.max(0, zeroX - 4), y: 0, width: 8, height: ih }}
        >
          <line
            x1={zeroX}
            x2={zeroX}
            y1={0}
            y2={ih}
            stroke="var(--color-ink)"
            strokeWidth={1.2}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Anchor 5: positive-tilt row — the whole top row (not its SA segment) */}
        <ExplainAnchor
          selector="positive-tilt"
          index={5}
          pin={{ x: -margin.left + 8, y: positiveY + bh / 2 }}
          rect={{ x: 0, y: positiveY, width: iw, height: bh }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6: negative-tilt row — the whole bottom row */}
        <ExplainAnchor
          selector="negative-tilt"
          index={6}
          pin={{ x: -margin.left + 8, y: negativeY + bh / 2 }}
          rect={{ x: 0, y: negativeY, width: iw, height: bh }}
        >
          <g />
        </ExplainAnchor>

        {/* Legend (above plot) */}
        <g transform={`translate(0, -34)`} data-data-layer="true">
          {LEVELS.map((lvl, i) => {
            const cellW = Math.max(72, iw / LEVELS.length);
            return (
              <g key={lvl} transform={`translate(${i * cellW}, 0)`}>
                <rect width={10} height={10} fill={LEVEL_COLOUR[lvl]} />
                <text
                  x={14}
                  y={9}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {LEVEL_LABEL[lvl].toUpperCase()}
                </text>
              </g>
            );
          })}
        </g>
        <ExplainAnchor
          selector="legend"
          index={7}
          pin={{ x: 40, y: -38 }}
          rect={{ x: 0, y: 0, width: Math.min(iw, 80), height: 8 }}
        >
          <g />
        </ExplainAnchor>

        {/* Category axis (question labels) */}
        <AxisLeft
          scale={yScale}
          stroke="var(--color-ink-mute)"
          tickStroke="var(--color-ink-mute)"
          tickLabelProps={() => ({
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            fill: "var(--color-ink-soft)",
            textAnchor: "end",
            dx: "-0.33em",
            dy: "0.33em",
          })}
        />

        {/* Value axis (bottom) */}
        <AxisBottom
          top={ih}
          scale={xScale}
          numTicks={6}
          tickFormat={(v) => `${Math.abs(Number(v))}%`}
          stroke="var(--color-ink-mute)"
          tickStroke="var(--color-ink-mute)"
          tickLabelProps={() => ({
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fill: "var(--color-ink-soft)",
            textAnchor: "middle",
            dy: "0.33em",
          })}
        />
        <text
          x={iw / 2}
          y={ih + 36}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
        >
          SHARE OF RESPONSES (%)
        </text>
      </Group>
    </svg>
  );
}
