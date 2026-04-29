"use client";

import { BarStack } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Row = {
  quarter: string;
  legacy: number;
  cloud: number;
  services: number;
};

const DATA: ReadonlyArray<Row> = [
  { quarter: "Q1'22", legacy: 12.6, cloud: 4.2, services: 1.2 },
  { quarter: "Q2'22", legacy: 12.0, cloud: 5.5, services: 1.3 },
  { quarter: "Q3'22", legacy: 11.6, cloud: 6.8, services: 1.4 },
  { quarter: "Q4'22", legacy: 11.2, cloud: 8.1, services: 1.6 },
  { quarter: "Q1'23", legacy: 10.8, cloud: 10.5, services: 1.9 },
  { quarter: "Q2'23", legacy: 10.2, cloud: 12.8, services: 2.1 },
  { quarter: "Q3'23", legacy: 9.5, cloud: 15.6, services: 2.4 },
  { quarter: "Q4'23", legacy: 9.0, cloud: 19.0, services: 3.0 },
];

const KEYS = ["legacy", "cloud", "services"] as const;
type Key = (typeof KEYS)[number];
const KEY_LABELS: Record<Key, string> = {
  legacy: "Legacy",
  cloud: "Cloud",
  services: "Services",
};

interface Props {
  width: number;
  height: number;
}

export function StackedBarChart({ width, height }: Props) {
  const margin = { top: 32, right: 20, bottom: 52, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleBand({
    domain: DATA.map((d) => d.quarter),
    range: [0, iw],
    padding: 0.3,
  });

  const totals = DATA.map((d) => d.legacy + d.cloud + d.services);
  const max = Math.max(...totals);

  const yScale = scaleLinear({
    domain: [0, Math.ceil(max / 5) * 5],
    range: [ih, 0],
    nice: true,
  });

  const colour = scaleOrdinal<Key, string>({
    domain: KEYS as unknown as Key[],
    range: ["var(--color-ink)", "#a88a4a", "#4a6a68"],
  });

  const ticksY = yScale.ticks(5);

  return (
    <svg width={width} height={height} role="img" aria-label="Stacked bar chart">
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
              strokeDasharray="2 3"
            />
          ))}
        </g>

        <ExplainAnchor
          selector="gridline"
          index={6}
          pin={{ x: iw + 12, y: yScale(20) }}
          rect={{ x: 0, y: yScale(20) - 4, width: iw, height: 8 }}
        >
          <g />
        </ExplainAnchor>

        {/* Bars */}
        <g data-data-layer="true">
          <BarStack<Row, Key>
            data={DATA as Row[]}
            keys={KEYS as unknown as Key[]}
            x={(d) => d.quarter}
            xScale={xScale}
            yScale={yScale}
            color={colour}
          >
            {(stacks) =>
              stacks.map((stack) =>
                stack.bars.map((bar) => (
                  <rect
                    key={`${stack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={Math.max(0, bar.height - 0.5)}
                    fill={bar.color}
                  />
                )),
              )
            }
          </BarStack>
        </g>

        {/* Anchor: one segment */}
        {(() => {
          const lastQ = DATA[DATA.length - 1];
          const barX = xScale(lastQ.quarter) ?? 0;
          const bw = xScale.bandwidth();
          const cloudTop = yScale(lastQ.legacy + lastQ.cloud);
          const cloudBottom = yScale(lastQ.legacy);
          return (
            <ExplainAnchor
              selector="bar-segment"
              index={2}
              pin={{ x: barX + bw + 18, y: (cloudTop + cloudBottom) / 2 }}
              rect={{ x: barX, y: cloudTop, width: bw, height: cloudBottom - cloudTop }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor: bar total */}
        {(() => {
          const lastQ = DATA[DATA.length - 1];
          const barX = xScale(lastQ.quarter) ?? 0;
          const bw = xScale.bandwidth();
          const total = lastQ.legacy + lastQ.cloud + lastQ.services;
          const topY = yScale(total);
          return (
            <ExplainAnchor
              selector="bar-total"
              index={1}
              pin={{ x: barX + bw / 2, y: topY - 16 }}
              rect={{ x: barX, y: topY, width: bw, height: 4 }}
            >
              <text
                x={barX + bw / 2}
                y={topY - 6}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink)"
              >
                ${total.toFixed(1)}M
              </text>
            </ExplainAnchor>
          );
        })()}

        {/* Axes */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
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
              fontSize: 10,
              fill: "var(--color-ink-soft)",
              textAnchor: "middle",
              dy: "0.33em",
            })}
          />
        </ExplainAnchor>

        <ExplainAnchor
          selector="y-axis"
          index={4}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => `$${v}M`}
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

        {/* Legend (drawn inside the SVG) */}
        <g transform={`translate(0, -22)`} data-data-layer="true">
          {KEYS.map((k, i) => (
            <g key={k} transform={`translate(${i * 90}, 0)`}>
              <rect width={10} height={10} fill={colour(k)} />
              <text
                x={14}
                y={9}
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink-soft)"
              >
                {KEY_LABELS[k].toUpperCase()}
              </text>
            </g>
          ))}
        </g>
        <ExplainAnchor
          selector="legend-item"
          index={3}
          pin={{ x: 100, y: -26 }}
          rect={{ x: 90, y: -30, width: 80, height: 16 }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
