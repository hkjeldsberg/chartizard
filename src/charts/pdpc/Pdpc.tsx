"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ──────────────────────────────────────────────────────────────────────────────
// Static tree data — "Launch new product" PDPC
// Three major tasks, each with 2-3 failure modes + countermeasures
// ──────────────────────────────────────────────────────────────────────────────

type Feasibility = "feasible" | "infeasible";

interface Countermeasure {
  text: string;
  feasibility: Feasibility;
}

interface Problem {
  text: string;
  countermeasure: Countermeasure;
}

interface Task {
  label: string;
  problems: Problem[];
}

const GOAL = "Launch new product";

const TASKS: Task[] = [
  {
    label: "Prototype",
    problems: [
      {
        text: "Supplier lead-time slip",
        countermeasure: { text: "Switch supplier", feasibility: "feasible" },
      },
      {
        text: "Certification fails",
        countermeasure: { text: "Re-spec component", feasibility: "infeasible" },
      },
      {
        text: "Design flaw detected",
        countermeasure: { text: "Rapid iteration sprint", feasibility: "feasible" },
      },
    ],
  },
  {
    label: "Manufacturing ramp",
    problems: [
      {
        text: "Yield below target",
        countermeasure: { text: "Six-sigma DMAIC", feasibility: "feasible" },
      },
      {
        text: "Equipment breakdown",
        countermeasure: { text: "Spare-parts buffer", feasibility: "feasible" },
      },
    ],
  },
  {
    label: "Marketing",
    problems: [
      {
        text: "Campaign budget cut",
        countermeasure: { text: "Organic social push", feasibility: "feasible" },
      },
      {
        text: "Launch date conflict",
        countermeasure: { text: "Delay by 2 weeks", feasibility: "infeasible" },
      },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Layout constants (in relative units — we'll scale to iw/ih)
// ──────────────────────────────────────────────────────────────────────────────

// Row heights (fraction of inner height)
const ROW_Y_GOAL = 0.06;
const ROW_Y_TASK = 0.26;
const ROW_Y_PROBLEM = 0.52;
const ROW_Y_CM = 0.80;

// Node sizes
const GOAL_RX = 8;
const GOAL_H = 26;
const TASK_RX = 6;
const TASK_H = 22;
const PROBLEM_RX = 6;
const PROBLEM_H = 20;
const CM_RX = 4;
const CM_H = 18;

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function nodeWidth(text: string, fontSize: number = 9): number {
  // Rough estimate: ~5.5px per char at font size 9
  return Math.max(60, text.length * fontSize * 0.58 + 16);
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + (current ? " " : "") + word).length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

interface RoundedRectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

function RoundedRect({
  x,
  y,
  width,
  height,
  rx,
  fill = "var(--color-surface)",
  stroke = "var(--color-ink)",
  strokeWidth = 1,
  strokeDasharray,
}: RoundedRectProps) {
  return (
    <rect
      x={x - width / 2}
      y={y - height / 2}
      width={width}
      height={height}
      rx={rx}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
    />
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Feasibility marker: ○ (feasible) or × (infeasible)
// ──────────────────────────────────────────────────────────────────────────────

function FeasibilityMark({
  cx,
  cy,
  feasibility,
}: {
  cx: number;
  cy: number;
  feasibility: Feasibility;
}) {
  const r = 6;
  if (feasibility === "feasible") {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
    );
  }
  // × mark
  const d = r * 0.55;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth={1.2}
      />
      <line
        x1={cx - d}
        y1={cy - d}
        x2={cx + d}
        y2={cy + d}
        stroke="var(--color-ink-mute)"
        strokeWidth={1.2}
      />
      <line
        x1={cx + d}
        y1={cy - d}
        x2={cx - d}
        y2={cy + d}
        stroke="var(--color-ink-mute)"
        strokeWidth={1.2}
      />
    </g>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────

interface Props {
  width: number;
  height: number;
}

export function PdpcChart({ width, height }: Props) {
  const margin = { top: 20, right: 16, bottom: 28, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Compute layout positions in useMemo (deterministic — no random)
  const layout = useMemo(() => {
    // Goal node
    const goalX = iw / 2;
    const goalY = ih * ROW_Y_GOAL + GOAL_H / 2;
    const goalW = Math.min(nodeWidth(GOAL, 10), iw * 0.55);

    // Task nodes — evenly spaced
    const taskCount = TASKS.length;
    const taskXs = TASKS.map((_, i) => {
      const seg = iw / taskCount;
      return seg * i + seg / 2;
    });
    const taskY = ih * ROW_Y_TASK;

    // Problem nodes — layout under each task
    // We need x positions for each problem under each task
    const problemRows: Array<{
      x: number;
      y: number;
      text: string;
      taskIdx: number;
      probIdx: number;
    }> = [];

    const cmRows: Array<{
      x: number;
      y: number;
      text: string;
      feasibility: Feasibility;
      taskIdx: number;
      probIdx: number;
    }> = [];

    for (let ti = 0; ti < TASKS.length; ti++) {
      const task = TASKS[ti];
      const pCount = task.problems.length;
      // Spread problems within the task's column segment
      const segW = iw / taskCount;
      const segStart = segW * ti;

      for (let pi = 0; pi < pCount; pi++) {
        const prob = task.problems[pi];
        const px =
          pCount === 1
            ? segStart + segW / 2
            : segStart + (segW / (pCount + 1)) * (pi + 1);
        const py = ih * ROW_Y_PROBLEM;

        problemRows.push({
          x: px,
          y: py,
          text: prob.text,
          taskIdx: ti,
          probIdx: pi,
        });

        const cmY = ih * ROW_Y_CM;
        cmRows.push({
          x: px,
          y: cmY,
          text: prob.countermeasure.text,
          feasibility: prob.countermeasure.feasibility,
          taskIdx: ti,
          probIdx: pi,
        });
      }
    }

    return {
      goalX,
      goalY,
      goalW,
      taskY,
      taskXs,
      problemRows,
      cmRows,
    };
  }, [iw, ih]);

  const {
    goalX,
    goalY,
    goalW,
    taskY,
    taskXs,
    problemRows,
    cmRows,
  } = layout;

  // Connector lines between levels
  const connectors: Array<{ x1: number; y1: number; x2: number; y2: number }> =
    [];

  // Goal → tasks
  for (const tx of taskXs) {
    connectors.push({
      x1: goalX,
      y1: goalY + GOAL_H / 2,
      x2: tx,
      y2: taskY - TASK_H / 2,
    });
  }

  // Tasks → problems
  for (const pr of problemRows) {
    const tx = taskXs[pr.taskIdx];
    connectors.push({
      x1: tx,
      y1: taskY + TASK_H / 2,
      x2: pr.x,
      y2: pr.y - PROBLEM_H / 2,
    });
  }

  // Problems → countermeasures
  for (const cm of cmRows) {
    const pr = problemRows.find(
      (p) => p.taskIdx === cm.taskIdx && p.probIdx === cm.probIdx,
    );
    if (pr) {
      connectors.push({
        x1: pr.x,
        y1: pr.y + PROBLEM_H / 2,
        x2: cm.x,
        y2: cm.y - CM_H / 2,
      });
    }
  }

  // Pick a representative feasible countermeasure for the anchor
  const firstFeasible = cmRows.find((c) => c.feasibility === "feasible");
  const firstInfeasible = cmRows.find((c) => c.feasibility === "infeasible");
  const repFeasible = firstFeasible ?? cmRows[0];
  const repInfeasible = firstInfeasible ?? cmRows[1];

  // Pick anchor positions for problem and task
  const repProblem = problemRows[0];
  const repTask = { x: taskXs[0], y: taskY };

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Process Decision Program Chart (PDPC) for launching a new product"
    >
      <Group left={margin.left} top={margin.top}>
        {/* ── Connectors (always behind nodes) ── */}
        <g data-data-layer="true">
          {connectors.map((c, i) => (
            <line
              key={`conn-${i}`}
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              stroke="var(--color-ink-mute)"
              strokeWidth={0.8}
            />
          ))}
        </g>

        {/* ── Goal node (Anchor 1) ── */}
        <ExplainAnchor
          selector="goal-node"
          index={1}
          pin={{ x: goalX + goalW / 2 + 12, y: goalY }}
          rect={{
            x: goalX - goalW / 2,
            y: goalY - GOAL_H / 2,
            width: goalW,
            height: GOAL_H,
          }}
        >
          <g data-data-layer="true">
            <RoundedRect
              x={goalX}
              y={goalY}
              width={goalW}
              height={GOAL_H}
              rx={GOAL_RX}
              strokeWidth={1.5}
            />
            <text
              x={goalX}
              y={goalY}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fontWeight="600"
              fill="var(--color-ink)"
            >
              {GOAL}
            </text>
          </g>
        </ExplainAnchor>

        {/* ── Task nodes (Anchor 2) ── */}
        <ExplainAnchor
          selector="task-node"
          index={2}
          pin={{ x: repTask.x + nodeWidth(TASKS[0].label) / 2 + 12, y: repTask.y }}
          rect={{
            x: repTask.x - nodeWidth(TASKS[0].label) / 2,
            y: repTask.y - TASK_H / 2,
            width: nodeWidth(TASKS[0].label),
            height: TASK_H,
          }}
        >
          <g data-data-layer="true">
            {TASKS.map((task, ti) => {
              const tx = taskXs[ti];
              const tw = Math.min(nodeWidth(task.label), iw / TASKS.length - 8);
              return (
                <g key={`task-${ti}`}>
                  <RoundedRect
                    x={tx}
                    y={taskY}
                    width={tw}
                    height={TASK_H}
                    rx={TASK_RX}
                    strokeWidth={1.2}
                  />
                  <text
                    x={tx}
                    y={taskY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize={8.5}
                    fontWeight="500"
                    fill="var(--color-ink)"
                  >
                    {task.label}
                  </text>
                </g>
              );
            })}
          </g>
        </ExplainAnchor>

        {/* ── Problem nodes (Anchor 3) ── */}
        <ExplainAnchor
          selector="problem-node"
          index={3}
          pin={{
            x: repProblem.x + 40,
            y: repProblem.y - PROBLEM_H / 2 - 10,
          }}
          rect={{
            x: repProblem.x - 40,
            y: repProblem.y - PROBLEM_H / 2,
            width: 80,
            height: PROBLEM_H,
          }}
        >
          <g data-data-layer="true">
            {problemRows.map((pr, i) => {
              const lines = wrapText(pr.text, 14);
              const lineH = 8;
              const boxH = Math.max(PROBLEM_H, lines.length * lineH + 8);
              const pw = Math.min(
                nodeWidth(pr.text, 8),
                iw / TASKS.length / TASKS[pr.taskIdx].problems.length + 12,
              );
              return (
                <g key={`prob-${i}`}>
                  <RoundedRect
                    x={pr.x}
                    y={pr.y}
                    width={pw}
                    height={boxH}
                    rx={PROBLEM_RX}
                    strokeDasharray="3 2"
                    strokeWidth={0.9}
                  />
                  {lines.map((line, li) => (
                    <text
                      key={li}
                      x={pr.x}
                      y={pr.y - ((lines.length - 1) * lineH) / 2 + li * lineH}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontFamily="var(--font-mono)"
                      fontSize={7.5}
                      fill="var(--color-ink)"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </g>
        </ExplainAnchor>

        {/* ── Feasible countermeasure (Anchor 4) ── */}
        <ExplainAnchor
          selector="feasible-countermeasure"
          index={4}
          pin={{
            x: repFeasible.x + 46,
            y: repFeasible.y - CM_H / 2 - 8,
          }}
          rect={{
            x: repFeasible.x - 46,
            y: repFeasible.y - CM_H / 2,
            width: 92,
            height: CM_H,
          }}
        >
          <g data-data-layer="true">
            {cmRows
              .filter((c) => c.feasibility === "feasible")
              .map((cm, i) => {
                const cmLines = wrapText(cm.text, 14);
                const lineH = 8;
                const boxH = Math.max(CM_H, cmLines.length * lineH + 8);
                const cmW = Math.min(nodeWidth(cm.text, 8), iw / TASKS.length - 4);
                return (
                  <g key={`cm-f-${i}`}>
                    <RoundedRect
                      x={cm.x}
                      y={cm.y}
                      width={cmW}
                      height={boxH}
                      rx={CM_RX}
                      strokeWidth={0.8}
                    />
                    {cmLines.map((line, li) => (
                      <text
                        key={li}
                        x={cm.x}
                        y={cm.y - ((cmLines.length - 1) * lineH) / 2 + li * lineH - 4}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontFamily="var(--font-mono)"
                        fontSize={7}
                        fill="var(--color-ink)"
                      >
                        {line}
                      </text>
                    ))}
                    {/* ○ mark */}
                    <FeasibilityMark
                      cx={cm.x}
                      cy={cm.y + boxH / 2 - 7}
                      feasibility="feasible"
                    />
                  </g>
                );
              })}
          </g>
        </ExplainAnchor>

        {/* ── Infeasible countermeasure (Anchor 5) ── */}
        <ExplainAnchor
          selector="infeasible-countermeasure"
          index={5}
          pin={{
            x: repInfeasible.x + 46,
            y: repInfeasible.y - CM_H / 2 - 8,
          }}
          rect={{
            x: repInfeasible.x - 46,
            y: repInfeasible.y - CM_H / 2,
            width: 92,
            height: CM_H,
          }}
        >
          <g data-data-layer="true">
            {cmRows
              .filter((c) => c.feasibility === "infeasible")
              .map((cm, i) => {
                const cmLines = wrapText(cm.text, 14);
                const lineH = 8;
                const boxH = Math.max(CM_H, cmLines.length * lineH + 8);
                const cmW = Math.min(nodeWidth(cm.text, 8), iw / TASKS.length - 4);
                return (
                  <g key={`cm-x-${i}`}>
                    <RoundedRect
                      x={cm.x}
                      y={cm.y}
                      width={cmW}
                      height={boxH}
                      rx={CM_RX}
                      strokeWidth={0.8}
                      stroke="var(--color-ink-mute)"
                    />
                    {cmLines.map((line, li) => (
                      <text
                        key={li}
                        x={cm.x}
                        y={cm.y - ((cmLines.length - 1) * lineH) / 2 + li * lineH - 4}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontFamily="var(--font-mono)"
                        fontSize={7}
                        fill="var(--color-ink-mute)"
                      >
                        {line}
                      </text>
                    ))}
                    {/* × mark */}
                    <FeasibilityMark
                      cx={cm.x}
                      cy={cm.y + boxH / 2 - 7}
                      feasibility="infeasible"
                    />
                  </g>
                );
              })}
          </g>
        </ExplainAnchor>

        {/* ── Connector lines anchor (Anchor 6) ── */}
        <ExplainAnchor
          selector="tree-branch"
          index={6}
          pin={{ x: goalX, y: (goalY + GOAL_H / 2 + taskY - TASK_H / 2) / 2 }}
          rect={{
            x: goalX - 20,
            y: goalY + GOAL_H / 2,
            width: 40,
            height: taskY - TASK_H / 2 - (goalY + GOAL_H / 2),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
