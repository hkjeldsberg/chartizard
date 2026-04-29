"use client";

import { Bar, Line } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type StepKind = "start" | "positive" | "negative" | "end";

interface Step {
  label: string;
  short: string;
  delta: number;
  kind: StepKind;
}

// Quarterly operating-income bridge: $12.0M -> $13.5M.
// The signed deltas belong to the positive/negative steps; start/end pillars
// draw from 0 to their absolute value (runningTotal at that moment).
const STEPS: ReadonlyArray<Step> = [
  { label: "Start", short: "START", delta: 12.0, kind: "start" },
  { label: "Revenue growth", short: "REV+", delta: 3.2, kind: "positive" },
  { label: "COGS increase", short: "COGS−", delta: -1.1, kind: "negative" },
  { label: "OpEx", short: "OPEX−", delta: -0.8, kind: "negative" },
  { label: "Legal settlement", short: "LEGAL+", delta: 0.5, kind: "positive" },
  { label: "FX headwind", short: "FX−", delta: -0.3, kind: "negative" },
  { label: "End", short: "END", delta: 13.5, kind: "end" },
];

const POSITIVE_FILL = "#4a6a68";
const NEGATIVE_FILL = "#a55a4a";

interface Props {
  width: number;
  height: number;
}

export function WaterfallChart({ width, height }: Props) {
  const margin = { top: 32, right: 20, bottom: 48, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Running total tracks the floating baseline between pillars.
  let runningTotal = 0;
  const laidOut = STEPS.map((step) => {
    if (step.kind === "start") {
      // Start pillar sits from 0 up to its absolute value.
      const base = 0;
      const top = step.delta;
      runningTotal = step.delta;
      return { step, base, top };
    }
    if (step.kind === "end") {
      // End pillar sits from 0 up to its absolute value.
      return { step, base: 0, top: step.delta };
    }
    // Contribution: floats at current runningTotal, changes by delta.
    const base = runningTotal;
    const top = runningTotal + step.delta;
    runningTotal = top;
    return { step, base, top };
  });

  const yMax = Math.max(...laidOut.map((d) => Math.max(d.base, d.top))) * 1.08;

  const xScale = scaleBand<string>({
    domain: STEPS.map((s) => s.short),
    range: [0, iw],
    padding: 0.28,
  });

  const yScale = scaleLinear<number>({
    domain: [0, yMax],
    range: [ih, 0],
    nice: true,
  });

  const bw = xScale.bandwidth();
  const ticksY = yScale.ticks(5);

  // Representative positive step = Revenue growth (largest lift).
  const positiveRef = laidOut[1]; // Revenue growth
  // Representative negative step = COGS increase.
  const negativeRef = laidOut[2]; // COGS increase
  // Start / end pillars.
  const startRef = laidOut[0];
  const endRef = laidOut[laidOut.length - 1];

  const fillFor = (kind: StepKind) => {
    if (kind === "positive") return POSITIVE_FILL;
    if (kind === "negative") return NEGATIVE_FILL;
    return "var(--color-ink)";
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Waterfall chart">
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
              strokeDasharray={t === 0 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* Bars */}
        <g data-data-layer="true">
          {laidOut.map(({ step, base, top }) => {
            const x = xScale(step.short) ?? 0;
            const yTop = yScale(Math.max(base, top));
            const yBot = yScale(Math.min(base, top));
            const h = Math.max(1, yBot - yTop);
            return (
              <Bar
                key={step.short}
                x={x}
                y={yTop}
                width={bw}
                height={h}
                fill={fillFor(step.kind)}
              />
            );
          })}
        </g>

        {/* Connector (running-total) dashed lines between adjacent bar tops.
            These are the visual bridge: top of step N -> top of step N+1. */}
        <g data-data-layer="true">
          {laidOut.slice(0, -1).map((cur, i) => {
            const next = laidOut[i + 1];
            const xCur = (xScale(cur.step.short) ?? 0) + bw;
            const xNext = xScale(next.step.short) ?? 0;
            // Use the "final" top of cur (where the bar's top is) as the y.
            const yCur = yScale(cur.step.kind === "end" ? cur.top : cur.top);
            const yNext = yScale(next.step.kind === "end" ? next.top : next.base);
            return (
              <Line
                key={`conn-${i}`}
                from={{ x: xCur, y: yCur }}
                to={{ x: xNext, y: yNext }}
                stroke="var(--color-ink-mute)"
                strokeWidth={1}
                strokeDasharray="2 3"
              />
            );
          })}
        </g>

        {/* Value labels above each bar */}
        <g data-data-layer="true">
          {laidOut.map(({ step, top }) => {
            const x = (xScale(step.short) ?? 0) + bw / 2;
            const y = yScale(top) - 6;
            const prefix =
              step.kind === "positive" ? "+" : step.kind === "negative" ? "" : "";
            const value =
              step.kind === "start" || step.kind === "end"
                ? `$${step.delta.toFixed(1)}M`
                : `${prefix}${step.delta.toFixed(1)}`;
            return (
              <text
                key={`lbl-${step.short}`}
                x={x}
                y={y}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink)"
              >
                {value}
              </text>
            );
          })}
        </g>

        {/* Anchor 1: Start pillar */}
        {(() => {
          const x = xScale(startRef.step.short) ?? 0;
          const yTop = yScale(startRef.top);
          return (
            <ExplainAnchor
              selector="start-pillar"
              index={1}
              pin={{ x: x + bw / 2, y: yTop - 22 }}
              rect={{ x, y: yTop, width: bw, height: ih - yTop }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 2: Floating positive contribution (Revenue growth) */}
        {(() => {
          const x = xScale(positiveRef.step.short) ?? 0;
          const yTop = yScale(positiveRef.top);
          const yBot = yScale(positiveRef.base);
          return (
            <ExplainAnchor
              selector="floating-bar"
              index={2}
              pin={{ x: x + bw + 14, y: (yTop + yBot) / 2 }}
              rect={{ x, y: yTop, width: bw, height: yBot - yTop }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 3: Negative contribution (COGS) */}
        {(() => {
          const x = xScale(negativeRef.step.short) ?? 0;
          const yTop = yScale(negativeRef.base);
          const yBot = yScale(negativeRef.top);
          return (
            <ExplainAnchor
              selector="negative-bar"
              index={3}
              pin={{ x: x + bw + 14, y: (yTop + yBot) / 2 }}
              rect={{ x, y: yTop, width: bw, height: yBot - yTop }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 4: Running total (the invisible connector line) */}
        {(() => {
          // Anchor the connector between step 1 (Rev+) and step 2 (COGS−).
          const cur = laidOut[1];
          const next = laidOut[2];
          const xCur = (xScale(cur.step.short) ?? 0) + bw;
          const xNext = xScale(next.step.short) ?? 0;
          const yCur = yScale(cur.top);
          const midX = (xCur + xNext) / 2;
          return (
            <ExplainAnchor
              selector="running-total"
              index={4}
              pin={{ x: midX, y: yCur - 14 }}
              rect={{
                x: Math.max(0, xCur - 2),
                y: Math.max(0, yCur - 5),
                width: Math.min(iw - xCur + 2, xNext - xCur + 4),
                height: 10,
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 5: End pillar */}
        {(() => {
          const x = xScale(endRef.step.short) ?? 0;
          const yTop = yScale(endRef.top);
          return (
            <ExplainAnchor
              selector="end-pillar"
              index={5}
              pin={{ x: x + bw / 2, y: yTop - 22 }}
              rect={{ x, y: yTop, width: bw, height: ih - yTop }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 6: Colour encoding — legend pinned at the top-left */}
        <g transform="translate(0, -26)" data-data-layer="true">
          <g transform="translate(0, 0)">
            <rect width={10} height={10} fill={POSITIVE_FILL} />
            <text
              x={14}
              y={9}
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-soft)"
            >
              ADD
            </text>
          </g>
          <g transform="translate(56, 0)">
            <rect width={10} height={10} fill={NEGATIVE_FILL} />
            <text
              x={14}
              y={9}
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-soft)"
            >
              SUBTRACT
            </text>
          </g>
          <g transform="translate(130, 0)">
            <rect width={10} height={10} fill="var(--color-ink)" />
            <text
              x={14}
              y={9}
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-soft)"
            >
              TOTAL
            </text>
          </g>
        </g>
        <ExplainAnchor
          selector="colour-encoding"
          index={6}
          pin={{ x: 90, y: -30 }}
          rect={{ x: 0, y: -32, width: 180, height: 16 }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={7}
          pin={{ x: iw / 2, y: ih + 32 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "middle",
              dy: "0.33em",
            })}
          />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
