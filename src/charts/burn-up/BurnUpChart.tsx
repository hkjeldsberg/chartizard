"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { LinePath, Line } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Point {
  day: number; // 1..14
  completed: number;
  scope: number;
}

// Deterministic 14-day Scrum sprint, told as a burn-up. Same sprint the
// burn-down chart tells (seed 41, same hand-shaped velocity profile), but
// here scope is explicit: two stakeholder adds bump the ceiling on day 6
// (+10 points) and day 10 (+5 points). The completed line is cumulative; at
// day 14 the team has closed ~85 of the now-95-point scope.
function generateData(): Point[] {
  const planned = [2, 3, 5, 7, 9, 10, 9, 9, 8, 7, 5, 3, 2, 1];
  let seed = 41;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const points: Point[] = [];
  let completed = 0;
  // Day 1 is sprint planning — scope 80, nothing done.
  points.push({ day: 1, completed: 0, scope: 80 });
  for (let day = 2; day <= 14; day++) {
    const jitter = (rand() - 0.5) * 1.4;
    const c = Math.max(0, planned[day - 2] + jitter);
    completed = completed + c;
    let scope = 80;
    if (day >= 6) scope = 90;
    if (day >= 10) scope = 95;
    points.push({ day, completed, scope });
  }
  // Pin endpoints to the narrative values.
  const last = points[13];
  points[13] = { day: 14, completed: 85, scope: last.scope };
  return points;
}

interface Props {
  width: number;
  height: number;
}

export function BurnUpChart({ width, height }: Props) {
  const margin = { top: 20, right: 24, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => generateData(), []);

  const xScale = scaleLinear({ domain: [1, 14], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 110], range: [ih, 0], nice: true });

  const endPoint = data[data.length - 1];
  const endCompletedY = yScale(endPoint.completed);
  const endScopeY = yScale(endPoint.scope);
  const endX = xScale(endPoint.day);

  // The scope-creep step on day 6 — where scope jumps from 80 to 90.
  const creepDay = 6;
  const creepX = xScale(creepDay);
  const creepBeforeY = yScale(80);
  const creepAfterY = yScale(90);

  // Representative point on the completed line for the anchor.
  const midCompleted = data[8];
  const midX = xScale(midCompleted.day);
  const midY = yScale(midCompleted.completed);

  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width));
    const h = Math.max(0, Math.min(ih - y, r.height));
    return { x, y, width: w, height: h };
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Burn-up chart">
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

        {/* Scope line — the rising ceiling */}
        <ExplainAnchor
          selector="scope-line"
          index={2}
          pin={{ x: xScale(3), y: yScale(80) - 14 }}
          rect={clampRect({
            x: xScale(1),
            y: yScale(100),
            width: xScale(5) - xScale(1),
            height: yScale(70) - yScale(100),
          })}
        >
          <LinePath
            data={data}
            x={(d) => xScale(d.day)}
            y={(d) => yScale(d.scope)}
            stroke="var(--color-ink-mute)"
            strokeWidth={1.6}
            strokeLinejoin="miter"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Completed line */}
        <ExplainAnchor
          selector="completed-line"
          index={1}
          pin={{ x: midX + 12, y: midY + 16 }}
          rect={clampRect({
            x: xScale(4),
            y: yScale(70),
            width: xScale(11) - xScale(4),
            height: yScale(10) - yScale(70),
          })}
        >
          <LinePath
            data={data}
            x={(d) => xScale(d.day)}
            y={(d) => yScale(d.completed)}
            stroke="var(--color-ink)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Completed-line data points */}
        <g data-data-layer="true">
          {data.map((d) => (
            <circle
              key={d.day}
              cx={xScale(d.day)}
              cy={yScale(d.completed)}
              r={d.day === 1 || d.day === 14 ? 3.2 : 2}
              fill="var(--color-ink)"
            />
          ))}
        </g>

        {/* Scope-creep step — day 6 jump */}
        <ExplainAnchor
          selector="scope-creep"
          index={3}
          pin={{ x: creepX + 18, y: (creepBeforeY + creepAfterY) / 2 }}
          rect={clampRect({
            x: creepX - 8,
            y: Math.min(creepBeforeY, creepAfterY) - 4,
            width: 16,
            height: Math.abs(creepBeforeY - creepAfterY) + 8,
          })}
        >
          <g data-data-layer="true">
            <circle
              cx={creepX}
              cy={creepAfterY}
              r={3.5}
              fill="var(--color-page)"
              stroke="var(--color-ink)"
              strokeWidth={1.4}
            />
            <text
              x={creepX + 6}
              y={creepAfterY - 4}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              +10
            </text>
          </g>
        </ExplainAnchor>

        {/* Starting scope */}
        <ExplainAnchor
          selector="starting-scope"
          index={4}
          pin={{ x: xScale(1) + 14, y: yScale(80) - 12 }}
          rect={clampRect({
            x: xScale(1) - 6,
            y: yScale(80) - 8,
            width: 16,
            height: 16,
          })}
        >
          <g data-data-layer="true">
            <circle
              cx={xScale(1)}
              cy={yScale(80)}
              r={4}
              fill="var(--color-page)"
              stroke="var(--color-ink-mute)"
              strokeWidth={1.4}
            />
          </g>
        </ExplainAnchor>

        {/* Remaining gap at end — the space between scope and completed */}
        <ExplainAnchor
          selector="remaining-gap"
          index={5}
          pin={{ x: endX - 22, y: (endCompletedY + endScopeY) / 2 }}
          rect={clampRect({
            x: endX - 12,
            y: Math.min(endCompletedY, endScopeY) - 2,
            width: 14,
            height: Math.abs(endScopeY - endCompletedY) + 4,
          })}
        >
          <g data-data-layer="true">
            <Line
              from={{ x: endX, y: endScopeY }}
              to={{ x: endX, y: endCompletedY }}
              stroke="var(--color-ink)"
              strokeWidth={1}
              strokeDasharray="1 2"
            />
            <text
              x={endX - 6}
              y={(endCompletedY + endScopeY) / 2 + 3}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              10 LEFT
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
            POINTS
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
