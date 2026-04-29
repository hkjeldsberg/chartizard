"use client";

import { AreaClosed, LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

const DATA: ReadonlyArray<{ hour: number; demand: number }> = [
  { hour: 0, demand: 10000 },
  { hour: 2, demand: 9500 },
  { hour: 4, demand: 9200 },
  { hour: 6, demand: 10800 },
  { hour: 8, demand: 13500 },
  { hour: 10, demand: 14200 },
  { hour: 12, demand: 14000 },
  { hour: 14, demand: 14500 },
  { hour: 16, demand: 16200 },
  { hour: 18, demand: 17000 },
  { hour: 20, demand: 15000 },
  { hour: 22, demand: 12000 },
];

interface Props {
  width: number;
  height: number;
}

export function AreaChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 22], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 18000], range: [ih, 0], nice: true });

  const peak = DATA.reduce((max, d) => (d.demand > max.demand ? d : max), DATA[0]);
  const peakX = xScale(peak.hour);
  const peakY = yScale(peak.demand);

  return (
    <svg width={width} height={height} role="img" aria-label="Area chart">
      <Group left={margin.left} top={margin.top}>
        {/* Area fill */}
        <ExplainAnchor
          selector="area-fill"
          index={1}
          pin={{ x: iw / 2, y: ih / 2 + 18 }}
          rect={{ x: 0, y: ih / 2, width: iw, height: ih / 2 }}
        >
          <AreaClosed
            data={DATA as { hour: number; demand: number }[]}
            x={(d) => xScale(d.hour)}
            y={(d) => yScale(d.demand)}
            yScale={yScale}
            fill="var(--color-ink)"
            fillOpacity={0.2}
            curve={curveMonotoneX}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Upper line */}
        <ExplainAnchor
          selector="upper-edge"
          index={2}
          pin={{ x: peakX - 12, y: peakY - 16 }}
          rect={{ x: xScale(12), y: yScale(17000), width: xScale(20) - xScale(12), height: 30 }}
        >
          <LinePath
            data={DATA as { hour: number; demand: number }[]}
            x={(d) => xScale(d.hour)}
            y={(d) => yScale(d.demand)}
            stroke="var(--color-ink)"
            strokeWidth={2}
            strokeLinecap="round"
            curve={curveMonotoneX}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Baseline */}
        <ExplainAnchor
          selector="baseline"
          index={3}
          pin={{ x: iw - 20, y: ih + 8 }}
          rect={{ x: 0, y: ih - 2, width: iw, height: 6 }}
        >
          <line
            x1={0}
            y1={ih}
            x2={iw}
            y2={ih}
            stroke="var(--color-ink)"
            strokeWidth={1.5}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={4}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => `${(Number(v) / 1000).toFixed(0)}k`}
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
            MW
          </text>
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 28 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v) => `${String(v).padStart(2, "0")}h`}
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
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
