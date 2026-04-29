"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// GDP per capita (USD, 2024 approximate) and life expectancy (years)
// across ~40 countries. Plausible World Bank-style values.
const DATA: ReadonlyArray<{ country: string; gdp: number; life: number }> = [
  { country: "Norway", gdp: 90000, life: 83 },
  { country: "Switzerland", gdp: 95000, life: 84 },
  { country: "USA", gdp: 75000, life: 79 },
  { country: "Denmark", gdp: 68000, life: 82 },
  { country: "Sweden", gdp: 60000, life: 83 },
  { country: "Australia", gdp: 64000, life: 83 },
  { country: "Netherlands", gdp: 58000, life: 82 },
  { country: "Germany", gdp: 52000, life: 81 },
  { country: "Canada", gdp: 54000, life: 82 },
  { country: "UK", gdp: 48000, life: 81 },
  { country: "France", gdp: 44000, life: 82 },
  { country: "Japan", gdp: 40000, life: 84 },
  { country: "South Korea", gdp: 34000, life: 83 },
  { country: "Italy", gdp: 38000, life: 83 },
  { country: "Spain", gdp: 32000, life: 83 },
  { country: "Israel", gdp: 54000, life: 83 },
  { country: "Saudi Arabia", gdp: 32000, life: 77 },
  { country: "Portugal", gdp: 26000, life: 82 },
  { country: "Greece", gdp: 22000, life: 81 },
  { country: "Poland", gdp: 19000, life: 78 },
  { country: "Chile", gdp: 17000, life: 80 },
  { country: "Russia", gdp: 14000, life: 72 },
  { country: "China", gdp: 13000, life: 78 },
  { country: "Equatorial Guinea", gdp: 15000, life: 60 },
  { country: "Turkey", gdp: 12000, life: 77 },
  { country: "Mexico", gdp: 11000, life: 75 },
  { country: "Brazil", gdp: 10000, life: 74 },
  { country: "Thailand", gdp: 7500, life: 77 },
  { country: "South Africa", gdp: 6700, life: 64 },
  { country: "Indonesia", gdp: 4800, life: 72 },
  { country: "Vietnam", gdp: 4200, life: 74 },
  { country: "Egypt", gdp: 3500, life: 72 },
  { country: "Philippines", gdp: 3700, life: 72 },
  { country: "India", gdp: 2500, life: 70 },
  { country: "Bangladesh", gdp: 2400, life: 73 },
  { country: "Kenya", gdp: 2100, life: 66 },
  { country: "Pakistan", gdp: 1700, life: 66 },
  { country: "Nigeria", gdp: 2000, life: 53 },
  { country: "Ethiopia", gdp: 1000, life: 67 },
  { country: "DRC", gdp: 600, life: 60 },
];

interface Props {
  width: number;
  height: number;
}

export function ScatterChart({ width, height }: Props) {
  const margin = { top: 20, right: 24, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 100000], range: [0, iw], nice: true });
  const yScale = scaleLinear({ domain: [50, 86], range: [ih, 0], nice: true });

  // Anchor points
  const anchorCountry = DATA.find((d) => d.country === "Germany")!;
  const anchorX = xScale(anchorCountry.gdp);
  const anchorY = yScale(anchorCountry.life);

  const outlier = DATA.find((d) => d.country === "Equatorial Guinea")!;
  const outlierX = xScale(outlier.gdp);
  const outlierY = yScale(outlier.life);

  // Trend impression band — visualises the Preston curve region
  const trendBandXMin = xScale(1000);
  const trendBandXMax = xScale(45000);
  const trendBandYTop = yScale(84);
  const trendBandYBot = yScale(60);

  return (
    <svg width={width} height={height} role="img" aria-label="Scatter plot">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(5).map((t) => (
            <line
              key={`yg-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* All points */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const isOutlier = d.country === outlier.country;
            const isAnchor = d.country === anchorCountry.country;
            return (
              <circle
                key={d.country}
                cx={xScale(d.gdp)}
                cy={yScale(d.life)}
                r={isOutlier || isAnchor ? 3.6 : 2.6}
                fill={isOutlier ? "var(--color-surface)" : "var(--color-ink)"}
                stroke={isOutlier ? "var(--color-ink)" : "none"}
                strokeWidth={isOutlier ? 1.2 : 0}
              />
            );
          })}
        </g>

        {/* Trend impression — a soft arc sketching the Preston curve */}
        <ExplainAnchor
          selector="trend-impression"
          index={3}
          pin={{ x: xScale(30000), y: yScale(82) - 14 }}
          rect={{
            x: trendBandXMin,
            y: trendBandYTop,
            width: trendBandXMax - trendBandXMin,
            height: trendBandYBot - trendBandYTop,
          }}
        >
          <g data-data-layer="true">
            <path
              d={`
                M ${xScale(500)} ${yScale(58)}
                Q ${xScale(6000)} ${yScale(74)},
                  ${xScale(20000)} ${yScale(80)}
                T ${xScale(95000)} ${yScale(83)}
              `}
              fill="none"
              stroke="var(--color-ink-mute)"
              strokeWidth={1.1}
              strokeDasharray="3 3"
              strokeLinecap="round"
            />
          </g>
        </ExplainAnchor>

        {/* Representative data point — Germany */}
        <ExplainAnchor
          selector="data-point"
          index={1}
          pin={{ x: anchorX - 14, y: anchorY - 14 }}
          rect={{ x: anchorX - 8, y: anchorY - 8, width: 16, height: 16 }}
        >
          <g />
        </ExplainAnchor>

        {/* Outlier — Equatorial Guinea */}
        <ExplainAnchor
          selector="outlier-point"
          index={2}
          pin={{ x: outlierX + 16, y: outlierY + 14 }}
          rect={{ x: outlierX - 8, y: outlierY - 8, width: 16, height: 16 }}
        >
          <g />
        </ExplainAnchor>

        {/* Country label at the outlier */}
        <ExplainAnchor
          selector="point-label"
          index={6}
          pin={{ x: outlierX + 58, y: outlierY - 6 }}
          rect={{ x: outlierX + 10, y: outlierY - 16, width: 96, height: 14 }}
        >
          <text
            x={outlierX + 10}
            y={outlierY - 4}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            EQ. GUINEA
          </text>
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => {
              const n = Number(v);
              return n === 0 ? "0" : `$${Math.round(n / 1000)}k`;
            }}
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
            GDP PER CAPITA (USD)
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -32, y: ih / 2 }}
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
          <text
            x={-margin.left + 4}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            LIFE EXPECTANCY (YRS)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
