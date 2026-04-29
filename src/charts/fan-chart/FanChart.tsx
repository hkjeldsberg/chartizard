"use client";

import { useMemo } from "react";
import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { area as d3Area, curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// GDP growth (%). Historical 2015-2024, central forecast 2025-2028.
const HISTORICAL: ReadonlyArray<{ year: number; value: number }> = [
  { year: 2015, value: 2.9 },
  { year: 2016, value: 1.6 },
  { year: 2017, value: 2.4 },
  { year: 2018, value: 2.9 },
  { year: 2019, value: 2.3 },
  { year: 2020, value: -2.8 },
  { year: 2021, value: 6.1 },
  { year: 2022, value: 2.1 },
  { year: 2023, value: 2.5 },
  { year: 2024, value: 2.8 },
];

const FORECAST: ReadonlyArray<{
  year: number;
  central: number;
  h50: number;
  h80: number;
  h95: number;
}> = [
  // Anchor at 2024 with zero half-width so the fan opens from the last historical point.
  { year: 2024, central: 2.8, h50: 0, h80: 0, h95: 0 },
  { year: 2025, central: 2.2, h50: 0.4, h80: 0.7, h95: 1.1 },
  { year: 2026, central: 2.0, h50: 0.6, h80: 1.0, h95: 1.5 },
  { year: 2027, central: 1.9, h50: 0.8, h80: 1.3, h95: 1.9 },
  { year: 2028, central: 2.1, h50: 1.0, h80: 1.6, h95: 2.3 },
];

// Combined central line (historical + forecast central) for visual continuity.
const CENTRAL_LINE: ReadonlyArray<{ year: number; value: number }> = [
  ...HISTORICAL,
  ...FORECAST.slice(1).map((d) => ({ year: d.year, value: d.central })),
];

interface Props {
  width: number;
  height: number;
}

export function FanChart({ width, height }: Props) {
  const margin = { top: 24, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [2015, 2028], range: [0, iw] });
  const yScale = scaleLinear({ domain: [-4, 7], range: [ih, 0], nice: true });

  const { band50Path, band80Path, band95Path } = useMemo(() => {
    const mkBand = (halfKey: "h50" | "h80" | "h95") => {
      const gen = d3Area<(typeof FORECAST)[number]>()
        .x((d) => xScale(d.year))
        .y0((d) => yScale(d.central - d[halfKey]))
        .y1((d) => yScale(d.central + d[halfKey]))
        .curve(curveMonotoneX);
      return gen([...FORECAST]) ?? "";
    };
    return {
      band50Path: mkBand("h50"),
      band80Path: mkBand("h80"),
      band95Path: mkBand("h95"),
    };
  }, [xScale, yScale]);

  const boundaryX = xScale(2024);
  const zeroY = yScale(0);

  return (
    <svg width={width} height={height} role="img" aria-label="Fan chart (forecast)">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(5).map((t) => (
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

        {/* Zero reference (subtle) */}
        <line
          x1={0}
          x2={iw}
          y1={zeroY}
          y2={zeroY}
          stroke="var(--color-ink-mute)"
          strokeWidth={0.75}
          data-data-layer="true"
        />

        {/* 95% band — outermost, lightest */}
        <ExplainAnchor
          selector="ninety-five-percent-band"
          index={4}
          pin={{ x: xScale(2027.5), y: yScale(FORECAST[4].central + FORECAST[4].h95) - 10 }}
          rect={{
            x: boundaryX,
            y: Math.max(0, yScale(FORECAST[4].central + FORECAST[4].h95) - 4),
            width: Math.max(0, iw - boundaryX),
            height: 10,
          }}
        >
          <path
            d={band95Path}
            fill="var(--color-ink)"
            fillOpacity={0.15}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* 80% band — middle */}
        <ExplainAnchor
          selector="eighty-percent-band"
          index={3}
          pin={{ x: xScale(2026.5), y: yScale(FORECAST[3].central + FORECAST[3].h80) - 6 }}
          rect={{
            x: boundaryX,
            y: Math.max(0, yScale(FORECAST[3].central + FORECAST[3].h80)),
            width: Math.max(0, iw - boundaryX),
            height: Math.max(
              0,
              yScale(FORECAST[3].central - FORECAST[3].h80) -
                yScale(FORECAST[3].central + FORECAST[3].h80),
            ),
          }}
        >
          <path
            d={band80Path}
            fill="var(--color-ink)"
            fillOpacity={0.25}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* 50% band — innermost, darkest */}
        <ExplainAnchor
          selector="fifty-percent-band"
          index={2}
          pin={{ x: xScale(2025.5), y: yScale(FORECAST[2].central + FORECAST[2].h50) - 10 }}
          rect={{
            x: boundaryX,
            y: Math.max(0, yScale(FORECAST[2].central + FORECAST[2].h50)),
            width: Math.max(0, iw - boundaryX),
            height: Math.max(
              0,
              yScale(FORECAST[2].central - FORECAST[2].h50) -
                yScale(FORECAST[2].central + FORECAST[2].h50),
            ),
          }}
        >
          <path
            d={band50Path}
            fill="var(--color-ink)"
            fillOpacity={0.4}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Historical-vs-forecast boundary line */}
        <ExplainAnchor
          selector="historical-vs-forecast-boundary"
          index={5}
          pin={{ x: boundaryX, y: 8 }}
          rect={{
            x: Math.max(0, boundaryX - 4),
            y: 0,
            width: 8,
            height: ih,
          }}
        >
          <g data-data-layer="true">
            <line
              x1={boundaryX}
              x2={boundaryX}
              y1={0}
              y2={ih}
              stroke="var(--color-ink)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <text
              x={boundaryX - 4}
              y={14}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              HIST
            </text>
            <text
              x={boundaryX + 4}
              y={14}
              textAnchor="start"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              FCAST
            </text>
          </g>
        </ExplainAnchor>

        {/* Central line — historical then forecast */}
        <ExplainAnchor
          selector="central-line"
          index={1}
          pin={{ x: xScale(2019), y: yScale(2.3) - 18 }}
          rect={{
            x: 0,
            y: Math.max(0, yScale(6.5)),
            width: iw,
            height: Math.max(0, yScale(-3) - yScale(6.5)),
          }}
        >
          <LinePath
            data={CENTRAL_LINE as { year: number; value: number }[]}
            x={(d) => xScale(d.year)}
            y={(d) => yScale(d.value)}
            stroke="var(--color-ink)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            data-data-layer="true"
          />
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
            tickFormat={(v) => `${v}%`}
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
            y={-10}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            GDP Y/Y
          </text>
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={7}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={7}
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
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
