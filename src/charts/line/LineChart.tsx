"use client";

import { LinePath, Line } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

const DATA: ReadonlyArray<{ year: number; anomaly: number }> = [
  { year: 1880, anomaly: -0.17 },
  { year: 1890, anomaly: -0.42 },
  { year: 1900, anomaly: -0.10 },
  { year: 1910, anomaly: -0.43 },
  { year: 1920, anomaly: -0.27 },
  { year: 1930, anomaly: -0.14 },
  { year: 1940, anomaly: 0.08 },
  { year: 1950, anomaly: -0.17 },
  { year: 1960, anomaly: -0.03 },
  { year: 1970, anomaly: -0.09 },
  { year: 1980, anomaly: 0.18 },
  { year: 1990, anomaly: 0.35 },
  { year: 2000, anomaly: 0.39 },
  { year: 2010, anomaly: 0.70 },
  { year: 2020, anomaly: 0.98 },
  { year: 2024, anomaly: 1.17 },
];

interface Props {
  width: number;
  height: number;
}

export function LineChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [1880, 2024], range: [0, iw] });
  const yScale = scaleLinear({ domain: [-0.6, 1.3], range: [ih, 0], nice: true });

  const ticksY = yScale.ticks(5);
  const zeroY = yScale(0);
  const highlightPoint = DATA[DATA.length - 1];
  const highlightX = xScale(highlightPoint.year);
  const highlightYPos = yScale(highlightPoint.anomaly);
  const axisTickAnchor = xScale(1960);

  return (
    <svg width={width} height={height} role="img" aria-label="Line chart">
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

        {/* Reference line at zero */}
        <ExplainAnchor
          selector="reference-line"
          index={7}
          pin={{ x: iw - 10, y: zeroY }}
          rect={{ x: 0, y: zeroY - 5, width: iw, height: 10 }}
        >
          <Line
            from={{ x: 0, y: zeroY }}
            to={{ x: iw, y: zeroY }}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="1 3"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Line path */}
        <ExplainAnchor
          selector="line-path"
          index={1}
          pin={{ x: xScale(1985), y: yScale(0.25) - 16 }}
          rect={{
            x: xScale(1970),
            y: yScale(0.8),
            width: xScale(2010) - xScale(1970),
            height: yScale(-0.2) - yScale(0.8),
          }}
        >
          <LinePath
            data={DATA as { year: number; anomaly: number }[]}
            x={(d) => xScale(d.year)}
            y={(d) => yScale(d.anomaly)}
            stroke="var(--color-ink)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Data point highlighted */}
        <ExplainAnchor
          selector="data-point"
          index={2}
          pin={{ x: highlightX + 14, y: highlightYPos - 14 }}
          rect={{ x: highlightX - 8, y: highlightYPos - 8, width: 16, height: 16 }}
        >
          <g data-data-layer="true">
            {DATA.map((d) => (
              <circle
                key={d.year}
                cx={xScale(d.year)}
                cy={yScale(d.anomaly)}
                r={d.year === highlightPoint.year ? 3.5 : 2}
                fill="var(--color-ink)"
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={3}
          pin={{ x: axisTickAnchor, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
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
            YEAR
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={4}
          pin={{ x: -32, y: yScale(0.5) }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
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
        </ExplainAnchor>

        {/* Gridline anchor (pick one representative) */}
        <ExplainAnchor
          selector="gridline"
          index={5}
          pin={{ x: iw + 14, y: yScale(1) }}
          rect={{ x: 0, y: yScale(1) - 4, width: iw, height: 8 }}
        >
          <g />
        </ExplainAnchor>

        {/* Y-label */}
        <ExplainAnchor
          selector="y-label"
          index={6}
          pin={{ x: -44, y: -6 }}
        >
          <text
            x={-44}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            °C ANOMALY
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
