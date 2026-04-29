"use client";

import { LinePath, Line } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Point = { pct: number; gain: number };

// Cumulative gains for a well-behaved ranking model (baseline response 10%).
// x = fraction of population contacted (sorted best-first), y = fraction of
// positives captured. Starts steep; flattens toward (1, 1). Consistent with
// the sibling lift chart (decile 1 lift ~2.6, monotone decay to ~0.25).
const DATA: ReadonlyArray<Point> = [
  { pct: 0.00, gain: 0.00 },
  { pct: 0.10, gain: 0.26 },
  { pct: 0.20, gain: 0.46 },
  { pct: 0.30, gain: 0.63 },
  { pct: 0.40, gain: 0.76 },
  { pct: 0.50, gain: 0.86 },
  { pct: 0.60, gain: 0.93 },
  { pct: 0.70, gain: 0.97 },
  { pct: 0.80, gain: 0.99 },
  { pct: 0.90, gain: 1.00 },
  { pct: 1.00, gain: 1.00 },
];

interface Props {
  width: number;
  height: number;
}

export function CumulativeGainsChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 1], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 1], range: [ih, 0] });

  // Representative operating point — at 30% contacted.
  const op = DATA[3]; // pct 0.30, gain 0.63
  const opX = xScale(op.pct);
  const opY = yScale(op.gain);

  // Build the gain-area polygon: curve from (0,0) -> ... -> (1,1), then
  // back down the diagonal to (0,0). This shades the region between the
  // model curve and the random-targeting diagonal.
  const gainAreaPoints =
    DATA.map((d) => `${xScale(d.pct)},${yScale(d.gain)}`).join(" ") +
    ` ${xScale(1)},${yScale(1)} ${xScale(0)},${yScale(0)}`;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Cumulative gains chart"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={`gx-${t}`}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={`gy-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* Gain area — region between the curve and the diagonal. */}
        <ExplainAnchor
          selector="gain-area"
          index={3}
          pin={{ x: xScale(0.55), y: yScale(0.72) }}
          rect={{
            x: xScale(0.25),
            y: yScale(0.85),
            width: xScale(0.75) - xScale(0.25),
            height: yScale(0.4) - yScale(0.85),
          }}
        >
          <g data-data-layer="true">
            <polygon
              points={gainAreaPoints}
              fill="var(--color-ink)"
              fillOpacity={0.14}
            />
          </g>
        </ExplainAnchor>

        {/* Random-targeting diagonal */}
        <ExplainAnchor
          selector="diagonal"
          index={2}
          pin={{ x: xScale(0.75), y: yScale(0.75) + 14 }}
          rect={{
            x: xScale(0.62),
            y: yScale(0.88),
            width: xScale(0.88) - xScale(0.62),
            height: yScale(0.62) - yScale(0.88),
          }}
        >
          <Line
            from={{ x: xScale(0), y: yScale(0) }}
            to={{ x: xScale(1), y: yScale(1) }}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="3 3"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Cumulative gains curve */}
        <ExplainAnchor
          selector="curve"
          index={1}
          pin={{ x: xScale(0.18), y: yScale(0.5) - 12 }}
          rect={{
            x: xScale(0.05),
            y: yScale(0.7),
            width: xScale(0.35) - xScale(0.05),
            height: yScale(0.2) - yScale(0.7),
          }}
        >
          <LinePath
            data={DATA as Point[]}
            x={(d) => xScale(d.pct)}
            y={(d) => yScale(d.gain)}
            stroke="var(--color-ink)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            curve={curveMonotoneX}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Operating-point bead at 30% contacted */}
        <g data-data-layer="true">
          <line
            x1={opX}
            x2={opX}
            y1={ih}
            y2={opY}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.8}
            strokeDasharray="1 3"
          />
          <line
            x1={0}
            x2={opX}
            y1={opY}
            y2={opY}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.8}
            strokeDasharray="1 3"
          />
          <circle cx={opX} cy={opY} r={4} fill="var(--color-ink)" />
          <circle
            cx={opX}
            cy={opY}
            r={7}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
        </g>
        <ExplainAnchor
          selector="operating-point"
          index={4}
          pin={{ x: opX + 16, y: opY - 14 }}
          rect={{
            x: Math.max(0, opX - 10),
            y: Math.max(0, opY - 10),
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis (% of population contacted) */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 36 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => `${Math.round((v as number) * 100)}%`}
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
            % CONTACTED
          </text>
        </ExplainAnchor>

        {/* Y-axis (% of positives captured) */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => `${Math.round((v as number) * 100)}%`}
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
            % CAPTURED
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
