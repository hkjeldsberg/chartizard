"use client";

import { Bar, LinePath, Line, Circle } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft, AxisRight } from "@visx/axis";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Row {
  source: string;
  short: string;
  count: number;
}

// Customer-support ticket sources, sorted descending by volume.
const DATA: ReadonlyArray<Row> = [
  { source: "Login issues", short: "LOGIN", count: 420 },
  { source: "Payment failures", short: "PAY", count: 310 },
  { source: "Feature confusion", short: "CONFUSE", count: 180 },
  { source: "UI bug", short: "UI", count: 120 },
  { source: "Performance", short: "PERF", count: 90 },
  { source: "Data loss fear", short: "DATA", count: 55 },
  { source: "Account deletion", short: "ACCT", count: 30 },
  { source: "Everything else", short: "OTHER", count: 25 },
];

interface Props {
  width: number;
  height: number;
}

export function ParetoChart({ width, height }: Props) {
  const margin = { top: 28, right: 60, bottom: 48, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const total = DATA.reduce((acc, d) => acc + d.count, 0);

  // Cumulative series: the line starts at the top of the first bar and ends at 100%.
  // Standard Pareto convention: cumulative point i lands at x-centre of bar i,
  // y = cumulative percentage through bar i (inclusive).
  let running = 0;
  const cumulative = DATA.map((d) => {
    running += d.count;
    return {
      short: d.short,
      pct: (running / total) * 100,
    };
  });

  const xScale = scaleBand<string>({
    domain: DATA.map((d) => d.short),
    range: [0, iw],
    padding: 0.28,
  });

  const yLeft = scaleLinear<number>({
    domain: [0, Math.ceil(Math.max(...DATA.map((d) => d.count)) / 50) * 50],
    range: [ih, 0],
    nice: true,
  });

  const yRight = scaleLinear<number>({
    domain: [0, 100],
    range: [ih, 0],
  });

  const bw = xScale.bandwidth();
  const ticksLeft = yLeft.ticks(5);

  const pointsWithX = cumulative.map((p) => ({
    x: (xScale(p.short) ?? 0) + bw / 2,
    y: yRight(p.pct),
    short: p.short,
    pct: p.pct,
  }));

  // Representative bar = top source (login issues).
  const repBar = DATA[0];
  const repBarX = xScale(repBar.short) ?? 0;
  const repBarY = yLeft(repBar.count);

  // 80% crossover: concept-level anchor on the right y-axis at 80%.
  const eightyY = yRight(80);

  return (
    <svg width={width} height={height} role="img" aria-label="Pareto chart">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines (left-axis counts) */}
        <g data-data-layer="true">
          {ticksLeft.map((t) => (
            <line
              key={t}
              x1={0}
              x2={iw}
              y1={yLeft(t)}
              y2={yLeft(t)}
              stroke="var(--color-hairline)"
              strokeDasharray={t === 0 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* 80% dashed reference line (right-axis) */}
        <g data-data-layer="true">
          <Line
            from={{ x: 0, y: eightyY }}
            to={{ x: iw, y: eightyY }}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <text
            x={iw - 4}
            y={eightyY - 4}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            80%
          </text>
        </g>

        {/* Bars */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const x = xScale(d.short) ?? 0;
            const y = yLeft(d.count);
            return (
              <Bar
                key={d.short}
                x={x}
                y={y}
                width={bw}
                height={ih - y}
                fill="var(--color-ink)"
              />
            );
          })}
        </g>

        {/* Cumulative line */}
        <g data-data-layer="true">
          <LinePath
            data={pointsWithX}
            x={(d) => d.x}
            y={(d) => d.y}
            curve={curveMonotoneX}
            stroke="#4a6a68"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {pointsWithX.map((p) => (
            <Circle key={p.short} cx={p.x} cy={p.y} r={2.5} fill="#4a6a68" />
          ))}
        </g>

        {/* Anchor 1: representative bar (LOGIN, the top source) */}
        <ExplainAnchor
          selector="bar"
          index={1}
          pin={{ x: repBarX + bw / 2, y: repBarY - 16 }}
          rect={{ x: repBarX, y: repBarY, width: bw, height: ih - repBarY }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: cumulative line */}
        {(() => {
          // Anchor rect around the steep early climb (bars 1 through 3).
          const p0 = pointsWithX[0];
          const p3 = pointsWithX[Math.min(3, pointsWithX.length - 1)];
          const rectX = Math.max(0, p0.x - bw / 2);
          const rectW = Math.min(iw - rectX, p3.x - p0.x + bw);
          const midPoint = pointsWithX[1];
          return (
            <ExplainAnchor
              selector="cumulative-line"
              index={2}
              pin={{ x: midPoint.x, y: midPoint.y - 16 }}
              rect={{
                x: rectX,
                y: Math.max(0, Math.min(p0.y, p3.y) - 6),
                width: rectW,
                height: Math.min(ih, Math.abs(p3.y - p0.y) + 16),
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 3: 80% crossover concept */}
        <ExplainAnchor
          selector="eighty-percent-crossover"
          index={3}
          pin={{ x: iw / 2, y: eightyY - 14 }}
          rect={{ x: 0, y: Math.max(0, eightyY - 5), width: iw, height: 10 }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: left axis (counts) */}
        <ExplainAnchor
          selector="left-axis"
          index={4}
          pin={{ x: -34, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yLeft}
            numTicks={5}
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
          <text
            x={-margin.left + 4}
            y={-12}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            TICKETS
          </text>
        </ExplainAnchor>

        {/* Anchor 5: right axis (% cumulative) */}
        <ExplainAnchor
          selector="right-axis"
          index={5}
          pin={{ x: iw + 34, y: ih / 2 }}
          rect={{ x: iw, y: 0, width: margin.right, height: ih }}
        >
          <AxisRight
            left={iw}
            scale={yRight}
            numTicks={5}
            tickFormat={(v) => `${v}%`}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fill: "var(--color-ink-soft)",
              textAnchor: "start",
              dx: "0.33em",
              dy: "0.33em",
            })}
          />
          <text
            x={iw + 4}
            y={-12}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            % CUMULATIVE
          </text>
        </ExplainAnchor>

        {/* Anchor 6: gridline */}
        <ExplainAnchor
          selector="gridline"
          index={6}
          pin={{ x: iw + 14, y: yLeft(200) }}
          rect={{ x: 0, y: yLeft(200) - 4, width: iw, height: 8 }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis (categories) */}
        <ExplainAnchor
          selector="x-axis"
          index={7}
          pin={{ x: iw / 2, y: ih + 34 }}
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
