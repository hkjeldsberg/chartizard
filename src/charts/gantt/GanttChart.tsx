"use client";

import { Bar, Line } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Task {
  id: number;
  name: string;
  start: number; // week index (0-based)
  end: number; // exclusive, or equal to start for milestones
  depends: ReadonlyArray<number>;
  critical: boolean;
  milestone?: boolean;
}

// Phased rollout. Weeks 1-8 map to x-domain [0, 8]; task t starts at
// (weekStart - 1) and ends at weekEnd so "weeks 1-2" -> [0, 2].
const TASKS: ReadonlyArray<Task> = [
  { id: 1, name: "Discovery", start: 0, end: 2, depends: [], critical: true },
  { id: 2, name: "Design", start: 1, end: 4, depends: [1], critical: true },
  { id: 3, name: "API build", start: 2, end: 6, depends: [2], critical: true },
  { id: 4, name: "Frontend build", start: 3, end: 7, depends: [2], critical: false },
  { id: 5, name: "QA", start: 5, end: 8, depends: [3, 4], critical: true },
  { id: 6, name: "Launch", start: 8, end: 8, depends: [5], critical: true, milestone: true },
];

interface Props {
  width: number;
  height: number;
}

export function GanttChart({ width, height }: Props) {
  const margin = { top: 24, right: 24, bottom: 44, left: 104 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 8], range: [0, iw] });

  const yScale = scaleBand({
    domain: TASKS.map((t) => t.name),
    range: [0, ih],
    padding: 0.35,
  });

  const rowH = yScale.bandwidth();
  const weekTicks = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const taskById = new Map(TASKS.map((t) => [t.id, t]));

  const barX = (t: Task) => xScale(t.start);
  const barW = (t: Task) => Math.max(0, xScale(t.end) - xScale(t.start));
  const barY = (t: Task) => (yScale(t.name) ?? 0);
  const rowCentreY = (t: Task) => barY(t) + rowH / 2;

  // Anchor targets.
  const designTask = TASKS[1]; // "bar" anchor — regular duration bar
  const launchTask = TASKS[5]; // milestone
  const qaTask = TASKS[4];
  const apiTask = TASKS[2];
  const criticalRowIds = new Set(TASKS.filter((t) => t.critical).map((t) => t.id));

  // Compute y-extent of the critical-path overlay (Discovery through Launch,
  // all critical rows, drawn as a tinted rectangle behind those rows).
  const criticalTasks = TASKS.filter((t) => t.critical);
  const criticalYTop = Math.min(...criticalTasks.map((t) => barY(t) - 4));
  const criticalYBottom = Math.max(...criticalTasks.map((t) => barY(t) + rowH + 4));

  const milestoneSize = Math.max(8, Math.min(14, rowH * 0.55));

  return (
    <svg width={width} height={height} role="img" aria-label="Gantt chart">
      <Group left={margin.left} top={margin.top}>
        {/* Week gridlines */}
        <g data-data-layer="true">
          {weekTicks.map((t) => (
            <line
              key={t}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* Critical-path overlay — subtle tint behind critical rows */}
        <ExplainAnchor
          selector="critical-path"
          index={6}
          pin={{ x: iw - 14, y: criticalYTop + 10 }}
          rect={{
            x: 0,
            y: criticalYTop,
            width: iw,
            height: criticalYBottom - criticalYTop,
          }}
        >
          <g data-data-layer="true">
            <rect
              x={0}
              y={criticalYTop}
              width={iw}
              height={criticalYBottom - criticalYTop}
              fill="var(--color-ink)"
              opacity={0.05}
            />
          </g>
        </ExplainAnchor>

        {/* Dependency connectors — draw first so bars sit on top */}
        <g data-data-layer="true">
          {TASKS.flatMap((t) =>
            t.depends.map((depId) => {
              const parent = taskById.get(depId);
              if (!parent) return null;
              const x1 = xScale(parent.end);
              const y1 = rowCentreY(parent);
              const x2 = xScale(t.start);
              const y2 = rowCentreY(t);
              const midX = x1 + Math.max(4, (x2 - x1) / 2);
              // Right-angle connector: out, down/up, in.
              const d = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
              return (
                <g key={`dep-${depId}-${t.id}`}>
                  <path
                    d={d}
                    fill="none"
                    stroke="var(--color-ink-mute)"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    opacity={0.6}
                  />
                  {/* tiny arrowhead */}
                  <polygon
                    points={`${x2},${y2} ${x2 - 4},${y2 - 3} ${x2 - 4},${y2 + 3}`}
                    fill="var(--color-ink-mute)"
                    opacity={0.6}
                  />
                </g>
              );
            }),
          )}
        </g>

        {/* Bars */}
        <g data-data-layer="true">
          {TASKS.map((t) => {
            if (t.milestone) return null;
            const isCritical = criticalRowIds.has(t.id);
            return (
              <Bar
                key={`bar-${t.id}`}
                x={barX(t)}
                y={barY(t)}
                width={barW(t)}
                height={rowH}
                fill={isCritical ? "var(--color-ink)" : "#4a6a68"}
              />
            );
          })}
        </g>

        {/* Milestones (rotated squares = diamonds) */}
        <g data-data-layer="true">
          {TASKS.filter((t) => t.milestone).map((t) => {
            const cx = xScale(t.start);
            const cy = rowCentreY(t);
            const s = milestoneSize;
            return (
              <polygon
                key={`ms-${t.id}`}
                points={`${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}`}
                fill="var(--color-ink)"
              />
            );
          })}
        </g>

        {/* Anchor 1: bar (Design) */}
        <ExplainAnchor
          selector="bar"
          index={1}
          pin={{ x: barX(designTask) + barW(designTask) / 2, y: barY(designTask) - 10 }}
          rect={{
            x: barX(designTask),
            y: barY(designTask),
            width: barW(designTask),
            height: rowH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: x-axis (weeks) */}
        <ExplainAnchor
          selector="x-axis"
          index={2}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            tickValues={weekTicks}
            tickFormat={(v) => `W${v}`}
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

        {/* Anchor 3: y-axis (task list) */}
        <ExplainAnchor
          selector="y-axis"
          index={3}
          pin={{ x: -60, y: ih / 2 }}
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

        {/* Anchor 4: dependency-arrow — highlight the API -> QA connector */}
        <ExplainAnchor
          selector="dependency-arrow"
          index={4}
          pin={{ x: xScale(apiTask.end) + 12, y: rowCentreY(qaTask) - 14 }}
          rect={{
            x: xScale(apiTask.end) - 4,
            y: Math.min(rowCentreY(apiTask), rowCentreY(qaTask)) - 4,
            width: xScale(qaTask.start) - xScale(apiTask.end) + 8,
            height: Math.abs(rowCentreY(qaTask) - rowCentreY(apiTask)) + 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: milestone (Launch diamond) */}
        <ExplainAnchor
          selector="milestone"
          index={5}
          pin={{
            x: xScale(launchTask.start) + 18,
            y: rowCentreY(launchTask) - 12,
          }}
          rect={{
            x: xScale(launchTask.start) - milestoneSize - 2,
            y: rowCentreY(launchTask) - milestoneSize - 2,
            width: milestoneSize * 2 + 4,
            height: milestoneSize * 2 + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Legend */}
        <g transform={`translate(0, -14)`} data-data-layer="true">
          <rect x={0} y={0} width={10} height={10} fill="var(--color-ink)" />
          <text
            x={14}
            y={9}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            CRITICAL PATH
          </text>
          <rect x={120} y={0} width={10} height={10} fill="#4a6a68" />
          <text
            x={134}
            y={9}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            PARALLEL TASK
          </text>
        </g>
      </Group>
    </svg>
  );
}
