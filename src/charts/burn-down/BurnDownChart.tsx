"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { LinePath, Line } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Point {
  day: number; // 1..14
  remaining: number; // story points remaining
}

// Deterministic 14-day Scrum sprint. Team starts at 80 points, onboards slowly
// (days 1-3 are near-flat), accelerates mid-sprint once the unknowns are burned
// down (days 5-10), then plateaus at ~5 points left of work that slipped. The
// exact seed/values mirror the burn-up chart so the pair reads as the same
// sprint told two ways.
function generateData(): Point[] {
  // Velocity per day (points completed). Hand-shaped to tell the story, with a
  // seeded LCG jitter so the run is deterministic but not a straight line.
  const planned = [2, 3, 5, 7, 9, 10, 9, 9, 8, 7, 5, 3, 2, 1]; // sums to 80
  let seed = 41;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const points: Point[] = [];
  let remaining = 80;
  points.push({ day: 1, remaining: 80 });
  for (let day = 2; day <= 14; day++) {
    const jitter = (rand() - 0.5) * 1.4;
    const completed = Math.max(0, planned[day - 2] + jitter);
    remaining = Math.max(0, remaining - completed);
    points.push({ day, remaining });
  }
  // Force the final value to land near 5 — honest under-delivery.
  points[13] = { day: 14, remaining: 5 };
  return points;
}

interface Props {
  width: number;
  height: number;
}

export function BurnDownChart({ width, height }: Props) {
  const margin = { top: 20, right: 24, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => generateData(), []);

  const xScale = scaleLinear({ domain: [1, 14], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 80], range: [ih, 0], nice: true });

  const startPoint = data[0];
  const endPoint = data[data.length - 1];
  const idealStartX = xScale(1);
  const idealStartY = yScale(80);
  const idealEndX = xScale(14);
  const idealEndY = yScale(0);

  const startX = xScale(startPoint.day);
  const startY = yScale(startPoint.remaining);
  const endX = xScale(endPoint.day);
  const endY = yScale(endPoint.remaining);

  // Mid-sprint inflection — day 7, where actual starts tracking the ideal.
  const inflectionPoint = data[6];
  const inflectionX = xScale(inflectionPoint.day);
  const inflectionY = yScale(inflectionPoint.remaining);

  // Clamp helper for anchor rects.
  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width));
    const h = Math.max(0, Math.min(ih - y, r.height));
    return { x, y, width: w, height: h };
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Burn-down chart">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(4).map((t) => (
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

        {/* Ideal line (dashed) */}
        <ExplainAnchor
          selector="ideal-line"
          index={1}
          pin={{ x: xScale(4) - 14, y: yScale(60) - 14 }}
          rect={clampRect({
            x: xScale(2),
            y: yScale(70),
            width: xScale(12) - xScale(2),
            height: yScale(10) - yScale(70),
          })}
        >
          <Line
            from={{ x: idealStartX, y: idealStartY }}
            to={{ x: idealEndX, y: idealEndY }}
            stroke="var(--color-ink-mute)"
            strokeWidth={1.2}
            strokeDasharray="4 3"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Actual line */}
        <ExplainAnchor
          selector="actual-line"
          index={2}
          pin={{ x: xScale(9) + 10, y: yScale(28) - 14 }}
          rect={clampRect({
            x: xScale(5),
            y: yScale(60),
            width: xScale(11) - xScale(5),
            height: yScale(15) - yScale(60),
          })}
        >
          <LinePath
            data={data}
            x={(d) => xScale(d.day)}
            y={(d) => yScale(d.remaining)}
            stroke="var(--color-ink)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Actual-line data points */}
        <g data-data-layer="true">
          {data.map((d) => (
            <circle
              key={d.day}
              cx={xScale(d.day)}
              cy={yScale(d.remaining)}
              r={d.day === 1 || d.day === 14 ? 3.2 : 2}
              fill="var(--color-ink)"
            />
          ))}
        </g>

        {/* Starting point — full scope */}
        <ExplainAnchor
          selector="starting-point"
          index={3}
          pin={{ x: startX + 16, y: startY - 10 }}
          rect={clampRect({
            x: startX - 8,
            y: startY - 8,
            width: 16,
            height: 16,
          })}
        >
          <g data-data-layer="true">
            <circle
              cx={startX}
              cy={startY}
              r={4.5}
              fill="var(--color-page)"
              stroke="var(--color-ink)"
              strokeWidth={1.6}
            />
          </g>
        </ExplainAnchor>

        {/* Mid-sprint inflection — acceleration */}
        <ExplainAnchor
          selector="inflection"
          index={4}
          pin={{ x: inflectionX, y: inflectionY - 18 }}
          rect={clampRect({
            x: inflectionX - 10,
            y: inflectionY - 10,
            width: 20,
            height: 20,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Ending gap — what didn't get done */}
        <ExplainAnchor
          selector="ending-gap"
          index={5}
          pin={{ x: endX - 22, y: (endY + idealEndY) / 2 }}
          rect={clampRect({
            x: endX - 12,
            y: Math.min(endY, idealEndY) - 2,
            width: 14,
            height: Math.abs(idealEndY - endY) + 4,
          })}
        >
          <g data-data-layer="true">
            <Line
              from={{ x: endX, y: endY }}
              to={{ x: endX, y: idealEndY }}
              stroke="var(--color-ink)"
              strokeWidth={1}
              strokeDasharray="1 2"
            />
            <circle
              cx={endX}
              cy={endY}
              r={3.5}
              fill="var(--color-ink)"
            />
            <text
              x={endX - 6}
              y={(endY + idealEndY) / 2 + 3}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              5 LEFT
            </text>
          </g>
        </ExplainAnchor>

        {/* Y-axis */}
        <g data-data-layer="true">
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
            x={-44}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            POINTS LEFT
          </text>
        </g>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={6}
          pin={{ x: iw / 2, y: ih + 28 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={7}
            tickFormat={(v) => `D${v}`}
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
            SPRINT DAY (14-DAY SPRINT)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
