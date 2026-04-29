"use client";

import { Group } from "@visx/group";
import { scaleLinear, scaleSqrt } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// GDP per capita (USD, x), life expectancy (years, y), population (bubble area).
// Same country set as the scatter plot for a side-by-side comparison.
const DATA: ReadonlyArray<{
  country: string;
  gdp: number;
  life: number;
  pop: number; // millions
}> = [
  { country: "Norway", gdp: 90000, life: 83, pop: 5.5 },
  { country: "Switzerland", gdp: 95000, life: 84, pop: 8.8 },
  { country: "USA", gdp: 75000, life: 79, pop: 335 },
  { country: "Denmark", gdp: 68000, life: 82, pop: 5.9 },
  { country: "Sweden", gdp: 60000, life: 83, pop: 10.5 },
  { country: "Australia", gdp: 64000, life: 83, pop: 26 },
  { country: "Netherlands", gdp: 58000, life: 82, pop: 17.5 },
  { country: "Germany", gdp: 52000, life: 81, pop: 84 },
  { country: "Canada", gdp: 54000, life: 82, pop: 40 },
  { country: "UK", gdp: 48000, life: 81, pop: 68 },
  { country: "France", gdp: 44000, life: 82, pop: 68 },
  { country: "Japan", gdp: 40000, life: 84, pop: 124 },
  { country: "South Korea", gdp: 34000, life: 83, pop: 52 },
  { country: "Italy", gdp: 38000, life: 83, pop: 59 },
  { country: "Spain", gdp: 32000, life: 83, pop: 48 },
  { country: "Israel", gdp: 54000, life: 83, pop: 9.8 },
  { country: "Saudi Arabia", gdp: 32000, life: 77, pop: 36 },
  { country: "Portugal", gdp: 26000, life: 82, pop: 10.3 },
  { country: "Greece", gdp: 22000, life: 81, pop: 10.4 },
  { country: "Poland", gdp: 19000, life: 78, pop: 38 },
  { country: "Chile", gdp: 17000, life: 80, pop: 19.5 },
  { country: "Russia", gdp: 14000, life: 72, pop: 144 },
  { country: "China", gdp: 13000, life: 78, pop: 1410 },
  { country: "Equatorial Guinea", gdp: 15000, life: 60, pop: 1.7 },
  { country: "Turkey", gdp: 12000, life: 77, pop: 85 },
  { country: "Mexico", gdp: 11000, life: 75, pop: 129 },
  { country: "Brazil", gdp: 10000, life: 74, pop: 215 },
  { country: "Thailand", gdp: 7500, life: 77, pop: 71 },
  { country: "South Africa", gdp: 6700, life: 64, pop: 60 },
  { country: "Indonesia", gdp: 4800, life: 72, pop: 275 },
  { country: "Vietnam", gdp: 4200, life: 74, pop: 99 },
  { country: "Egypt", gdp: 3500, life: 72, pop: 110 },
  { country: "Philippines", gdp: 3700, life: 72, pop: 117 },
  { country: "India", gdp: 2500, life: 70, pop: 1425 },
  { country: "Bangladesh", gdp: 2400, life: 73, pop: 171 },
  { country: "Kenya", gdp: 2100, life: 66, pop: 54 },
  { country: "Pakistan", gdp: 1700, life: 66, pop: 240 },
  { country: "Nigeria", gdp: 2000, life: 53, pop: 220 },
  { country: "Ethiopia", gdp: 1000, life: 67, pop: 123 },
  { country: "DRC", gdp: 600, life: 60, pop: 102 },
];

interface Props {
  width: number;
  height: number;
}

export function BubbleChart({ width, height }: Props) {
  const margin = { top: 20, right: 88, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 100000], range: [0, iw], nice: true });
  const yScale = scaleLinear({ domain: [50, 86], range: [ih, 0], nice: true });

  // Area scale — sqrt so radius scales with sqrt(value), area with value.
  const rScale = scaleSqrt({ domain: [0, 1500], range: [0, 22] });

  // Anchor — China is the representative bubble that anchors the new
  // visual centre-of-gravity.
  const rep = DATA.find((d) => d.country === "China")!;
  const repX = xScale(rep.gdp);
  const repY = yScale(rep.life);
  const repR = rScale(rep.pop);

  // Outlier bubble — Nigeria: low life expectancy, high population.
  const outlier = DATA.find((d) => d.country === "Nigeria")!;
  const outX = xScale(outlier.gdp);
  const outY = yScale(outlier.life);
  const outR = rScale(outlier.pop);

  // Legend reference bubbles (population millions)
  const legendValues = [100, 500, 1400];
  const legendX = iw + 28;
  const legendBaseY = 16;
  const legendStep = 36;

  // Sort bubbles largest-first so small bubbles draw on top and stay readable.
  const sorted = [...DATA].sort((a, b) => b.pop - a.pop);

  return (
    <svg width={width} height={height} role="img" aria-label="Bubble chart">
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

        {/* Bubbles */}
        <g data-data-layer="true">
          {sorted.map((d) => {
            const isRep = d.country === rep.country;
            const isOut = d.country === outlier.country;
            return (
              <circle
                key={d.country}
                cx={xScale(d.gdp)}
                cy={yScale(d.life)}
                r={rScale(d.pop)}
                fill="var(--color-ink)"
                fillOpacity={isOut ? 0 : 0.16}
                stroke="var(--color-ink)"
                strokeWidth={isRep || isOut ? 1.4 : 0.8}
              />
            );
          })}
        </g>

        {/* Representative bubble — China */}
        <ExplainAnchor
          selector="bubble"
          index={1}
          pin={{ x: repX + repR + 12, y: repY - repR - 4 }}
          rect={{ x: repX - repR, y: repY - repR, width: repR * 2, height: repR * 2 }}
        >
          <g />
        </ExplainAnchor>

        {/* Bubble size encoding — anchored at representative bubble */}
        <ExplainAnchor
          selector="bubble-size"
          index={2}
          pin={{ x: repX, y: repY }}
          rect={{
            x: repX - repR - 2,
            y: repY - repR - 2,
            width: repR * 2 + 4,
            height: repR * 2 + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Outlier bubble — Nigeria */}
        <ExplainAnchor
          selector="outlier-bubble"
          index={3}
          pin={{ x: outX + outR + 10, y: outY + outR + 8 }}
          rect={{ x: outX - outR, y: outY - outR, width: outR * 2, height: outR * 2 }}
        >
          <g />
        </ExplainAnchor>

        {/* Size legend */}
        <ExplainAnchor
          selector="legend"
          index={4}
          pin={{ x: legendX + 28, y: legendBaseY - 4 }}
          rect={{
            x: legendX - 24,
            y: legendBaseY - 12,
            width: 84,
            height: legendStep * legendValues.length + 8,
          }}
        >
          <g data-data-layer="true">
            <text
              x={legendX}
              y={legendBaseY - 6}
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-mute)"
            >
              POP (M)
            </text>
            {legendValues.map((v, i) => {
              const r = rScale(v);
              const cy = legendBaseY + 8 + i * legendStep + r;
              return (
                <g key={v}>
                  <circle
                    cx={legendX + 12}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke="var(--color-ink)"
                    strokeWidth={0.9}
                  />
                  <text
                    x={legendX + 30}
                    y={cy + 3}
                    fontFamily="var(--font-mono)"
                    fontSize={10}
                    fill="var(--color-ink-soft)"
                  >
                    {v}
                  </text>
                </g>
              );
            })}
          </g>
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
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
          index={6}
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
