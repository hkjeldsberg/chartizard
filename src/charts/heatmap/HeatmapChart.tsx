"use client";

import { Group } from "@visx/group";
import { scaleBand } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// NYC subway ridership — relative density by hour-of-day (0..23) × day-of-week.
// Scale is 0-100 (weekly max). Hand-tuned: weekday commuter spikes at 8am and
// 6pm, midday 40-55, weekend pattern shifted later, overnight trough 2-4am.
// Row order: Mon..Sun (reading top-to-bottom in the rendered chart).
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

// 7 rows × 24 columns
const MATRIX: ReadonlyArray<ReadonlyArray<number>> = [
  // Mon
  [ 8,  5,  6,  9, 18, 38, 72, 88, 93, 70, 50, 48, 52, 50, 55, 62, 78, 92, 86, 60, 42, 30, 22, 14],
  // Tue — darkest at 8am (peak of the whole grid)
  [ 8,  5,  6, 10, 19, 40, 74, 90, 100, 72, 51, 49, 53, 51, 56, 63, 80, 94, 88, 61, 43, 31, 23, 15],
  // Wed
  [ 9,  6,  6, 10, 19, 39, 73, 89, 96, 71, 50, 48, 52, 50, 55, 62, 79, 93, 87, 60, 42, 30, 22, 14],
  // Thu
  [ 9,  6,  7, 10, 19, 39, 73, 89, 97, 71, 51, 49, 53, 51, 56, 63, 80, 93, 87, 62, 44, 33, 26, 17],
  // Fri
  [10,  7,  7, 10, 20, 40, 74, 89, 95, 72, 52, 50, 54, 53, 58, 66, 82, 91, 84, 66, 55, 48, 40, 30],
  // Sat — shifted later, stronger evening
  [24, 18, 14, 10, 10, 14, 22, 30, 38, 46, 54, 60, 64, 66, 68, 72, 76, 80, 82, 80, 74, 66, 58, 44],
  // Sun — lowest morning, still lively afternoon
  [30, 22, 16, 11,  9, 12, 18, 24, 30, 38, 46, 54, 58, 60, 62, 64, 66, 66, 62, 56, 48, 40, 32, 22],
];

const HOURS: ReadonlyArray<string> = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0"),
);

interface Props {
  width: number;
  height: number;
}

export function HeatmapChart({ width, height }: Props) {
  const margin = { top: 24, right: 68, bottom: 48, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleBand<string>({
    domain: [...HOURS],
    range: [0, iw],
    padding: 0.04,
  });

  const yScale = scaleBand<string>({
    domain: [...DAYS],
    range: [0, ih],
    padding: 0.08,
  });

  const cellW = xScale.bandwidth();
  const cellH = yScale.bandwidth();

  // Tuesday 8am — the darkest cell, anchored as the focal point
  const peakDay = "Tue";
  const peakHour = "08";
  const peakX = xScale(peakHour) ?? 0;
  const peakY = yScale(peakDay) ?? 0;

  // Legend geometry — vertical ramp on the right edge
  const legendW = 12;
  const legendH = ih;
  const legendX = iw + 20;
  const legendSteps = 24; // smooth-ish ramp

  // Show every 4th hour label on the x-axis so ticks don't crowd.
  const hourTickEvery = 4;

  return (
    <svg width={width} height={height} role="img" aria-label="Heatmap">
      <Group left={margin.left} top={margin.top}>
        {/* Cells */}
        <g data-data-layer="true">
          {MATRIX.map((row, dayIdx) => {
            const day = DAYS[dayIdx];
            const y = yScale(day) ?? 0;
            return row.map((value, hourIdx) => {
              const hour = HOURS[hourIdx];
              const x = xScale(hour) ?? 0;
              const opacity = 0.06 + (value / 100) * 0.9;
              return (
                <rect
                  key={`${day}-${hour}`}
                  x={x}
                  y={y}
                  width={cellW}
                  height={cellH}
                  fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
                />
              );
            });
          })}
        </g>

        {/* Peak cell highlight + anchor — Tuesday 8am */}
        <ExplainAnchor
          selector="cell"
          index={1}
          pin={{ x: peakX + cellW + 16, y: peakY - 10 }}
          rect={{ x: peakX, y: peakY, width: cellW, height: cellH }}
        >
          <rect
            x={peakX}
            y={peakY}
            width={cellW}
            height={cellH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
        </ExplainAnchor>

        {/* Row (day) anchor — Tuesday row */}
        <ExplainAnchor
          selector="row"
          index={2}
          pin={{ x: -38, y: (yScale("Tue") ?? 0) + cellH / 2 }}
          rect={{
            x: 0,
            y: yScale("Tue") ?? 0,
            width: iw,
            height: cellH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Column (hour) anchor — 18:00 evening peak column */}
        <ExplainAnchor
          selector="column"
          index={3}
          pin={{ x: (xScale("18") ?? 0) + cellW / 2, y: -10 }}
          rect={{
            x: xScale("18") ?? 0,
            y: 0,
            width: cellW,
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Y-axis — days */}
        <ExplainAnchor
          selector="y-axis"
          index={4}
          pin={{ x: -36, y: ih + 4 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
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

        {/* X-axis — hours */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 32 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            tickFormat={(v) => {
              const n = Number(v);
              return n % hourTickEvery === 0 ? String(n) : "";
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
            y={ih + 40}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            HOUR OF DAY
          </text>
        </ExplainAnchor>

        {/* Colour-scale legend */}
        <g data-data-layer="true" transform={`translate(${legendX}, 0)`}>
          {Array.from({ length: legendSteps }).map((_, i) => {
            const t = i / (legendSteps - 1);
            const opacity = 0.06 + t * 0.9;
            const segH = legendH / legendSteps;
            return (
              <rect
                key={i}
                x={0}
                // Dark at top so higher ridership sits up top visually.
                y={legendH - (i + 1) * segH}
                width={legendW}
                height={segH + 0.5}
                fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
              />
            );
          })}
          <text
            x={legendW + 6}
            y={8}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            100
          </text>
          <text
            x={legendW + 6}
            y={legendH - 2}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            0
          </text>
        </g>
        <ExplainAnchor
          selector="colour-scale"
          index={6}
          pin={{ x: legendX + legendW + 26, y: legendH / 2 }}
          rect={{
            x: legendX - 2,
            y: 0,
            width: legendW + 30,
            height: legendH,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
