"use client";

import { Bar, LinePath, Line } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Row = { decile: number; lift: number };

// Lift by decile for a well-behaved ranking model on a direct-marketing
// campaign (baseline response rate ~= 10%). Decile 1 = top 10% by model
// score. The curve is monotone-decaying and crosses 1.0 around decile 7.
const DATA: ReadonlyArray<Row> = [
  { decile: 1, lift: 2.60 },
  { decile: 2, lift: 2.05 },
  { decile: 3, lift: 1.65 },
  { decile: 4, lift: 1.35 },
  { decile: 5, lift: 1.15 },
  { decile: 6, lift: 1.00 },
  { decile: 7, lift: 0.85 },
  { decile: 8, lift: 0.65 },
  { decile: 9, lift: 0.45 },
  { decile: 10, lift: 0.25 },
];

interface Props {
  width: number;
  height: number;
}

export function LiftChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleBand<number>({
    domain: DATA.map((d) => d.decile),
    range: [0, iw],
    padding: 0.3,
  });
  const yScale = scaleLinear<number>({
    domain: [0, 3],
    range: [ih, 0],
    nice: true,
  });

  const ticksY = yScale.ticks(4);
  const bw = xScale.bandwidth();
  const baselineY = yScale(1);

  // Representative "top decile" bar — the tallest, decile 1.
  const topBar = DATA[0];
  const topBarX = xScale(topBar.decile) ?? 0;
  const topBarY = yScale(topBar.lift);

  // Anchor for the lift curve — a mid-curve point between deciles 3 and 4.
  const curveAnchorX = (xScale(3) ?? 0) + bw / 2;
  const curveAnchorY = yScale(1.5);

  return (
    <svg width={width} height={height} role="img" aria-label="Lift chart">
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

        {/* Decile bars */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const x = xScale(d.decile) ?? 0;
            const y = yScale(d.lift);
            return (
              <Bar
                key={d.decile}
                x={x}
                y={y}
                width={bw}
                height={ih - y}
                fill="var(--color-ink)"
                fillOpacity={0.22}
              />
            );
          })}
        </g>

        {/* Baseline at lift = 1.0 (random targeting reference) */}
        <ExplainAnchor
          selector="baseline"
          index={3}
          pin={{ x: iw - 10, y: baselineY - 12 }}
          rect={{ x: 0, y: baselineY - 6, width: iw, height: 12 }}
        >
          <g data-data-layer="true">
            <Line
              from={{ x: 0, y: baselineY }}
              to={{ x: iw, y: baselineY }}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <text
              x={iw - 4}
              y={baselineY - 4}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              LIFT = 1.0
            </text>
          </g>
        </ExplainAnchor>

        {/* Top-decile bar — the money decile */}
        <ExplainAnchor
          selector="top-decile"
          index={1}
          pin={{ x: topBarX + bw / 2, y: topBarY - 14 }}
          rect={{ x: topBarX, y: topBarY, width: bw, height: ih - topBarY }}
        >
          <g />
        </ExplainAnchor>

        {/* Lift curve — connects the decile midpoints */}
        <ExplainAnchor
          selector="lift-curve"
          index={2}
          pin={{ x: curveAnchorX, y: curveAnchorY - 16 }}
          rect={{
            x: (xScale(2) ?? 0),
            y: yScale(2.2),
            width: ((xScale(5) ?? 0) + bw) - (xScale(2) ?? 0),
            height: yScale(1.0) - yScale(2.2),
          }}
        >
          <g data-data-layer="true">
            <LinePath
              data={DATA as Row[]}
              x={(d) => (xScale(d.decile) ?? 0) + bw / 2}
              y={(d) => yScale(d.lift)}
              stroke="var(--color-ink)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              curve={curveMonotoneX}
            />
            {DATA.map((d) => (
              <circle
                key={d.decile}
                cx={(xScale(d.decile) ?? 0) + bw / 2}
                cy={yScale(d.lift)}
                r={2.4}
                fill="var(--color-ink)"
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* X-axis (decile) */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 36 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            tickFormat={(v) => String(v)}
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
            DECILE (BEST → WORST)
          </text>
        </ExplainAnchor>

        {/* Y-axis (lift) */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={4}
            tickFormat={(v) => `${(v as number).toFixed(1)}×`}
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
            x={-44}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            LIFT
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
