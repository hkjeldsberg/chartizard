"use client";

import { useMemo } from "react";
import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Point {
  recall: number;
  precision: number;
}

// Seeded LCG — identical synthetic classifier to RocChart (seed 19, 700 neg /
// 300 pos, skewed score distributions). Imbalanced on purpose so that PR
// exposes model weakness ROC flatters.
function generatePrPoints(): { points: Point[]; prevalence: number } {
  let seed = 19;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const posScore = () => {
    const a = rand();
    const b = rand();
    const c = rand();
    return Math.pow(Math.max(a, b, c), 0.8);
  };
  const negScore = () => {
    const a = rand();
    const b = rand();
    const c = rand();
    return Math.pow(Math.min(a, b, c), 1.2);
  };

  const posScores: number[] = [];
  const negScores: number[] = [];
  for (let i = 0; i < 300; i++) posScores.push(posScore());
  for (let i = 0; i < 700; i++) negScores.push(negScore());

  const P = posScores.length;
  const N = negScores.length;
  const prevalence = P / (P + N); // 0.3

  // Sweep threshold from 1.0 down to 0.0 in 100 steps.
  const raw: Point[] = [];
  for (let i = 0; i <= 100; i++) {
    const threshold = 1 - i / 100;
    let tp = 0;
    let fp = 0;
    for (const s of posScores) if (s >= threshold) tp++;
    for (const s of negScores) if (s >= threshold) fp++;
    const predictedPos = tp + fp;
    if (predictedPos === 0) continue;
    const recall = P > 0 ? tp / P : 0;
    const precision = tp / predictedPos;
    raw.push({ recall, precision });
  }

  // Prepend the first valid (recall, precision); append (1, prevalence).
  if (raw.length === 0) {
    return { points: [{ recall: 0, precision: 1 }, { recall: 1, precision: prevalence }], prevalence };
  }
  const first = raw[0];
  const pts: Point[] = [{ recall: 0, precision: first.precision }, ...raw, { recall: 1, precision: prevalence }];

  // Force monotonic recall so curveMonotoneX renders cleanly.
  const dedup: Point[] = [];
  let lastR = -1;
  for (const p of pts) {
    if (p.recall >= lastR) {
      dedup.push(p);
      lastR = p.recall;
    }
  }
  return { points: dedup, prevalence };
}

interface Props {
  width: number;
  height: number;
}

export function PrecisionRecallChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { points, prevalence, thresholdPoint } = useMemo(() => {
    const { points: pts, prevalence: prev } = generatePrPoints();
    // Representative threshold bead: first point where recall >= 0.7.
    let t: Point = pts[Math.floor(pts.length * 0.6)];
    for (const p of pts) {
      if (p.recall >= 0.7) {
        t = p;
        break;
      }
    }
    return { points: pts, prevalence: prev, thresholdPoint: t };
  }, []);

  const xScale = scaleLinear({ domain: [0, 1], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 1], range: [ih, 0] });

  const tX = xScale(thresholdPoint.recall);
  const tY = yScale(thresholdPoint.precision);
  const noSkillY = yScale(prevalence);

  return (
    <svg width={width} height={height} role="img" aria-label="Precision-recall curve">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={`gx-${t}`}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={`gy-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* No-skill line at precision = prevalence (0.3 here) */}
        <ExplainAnchor
          selector="no-skill-line"
          index={2}
          pin={{ x: xScale(0.85), y: noSkillY - 12 }}
          rect={{ x: 0, y: noSkillY - 6, width: iw, height: 12 }}
        >
          <g data-data-layer="true">
            <line
              x1={0}
              x2={iw}
              y1={noSkillY}
              y2={noSkillY}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <text
              x={iw - 4}
              y={noSkillY - 4}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              NO SKILL = 0.30
            </text>
          </g>
        </ExplainAnchor>

        {/* The PR curve itself */}
        <ExplainAnchor
          selector="curve"
          index={1}
          pin={{ x: xScale(0.45), y: yScale(0.88) - 14 }}
          rect={{
            x: xScale(0.05),
            y: yScale(0.98),
            width: xScale(0.75) - xScale(0.05),
            height: yScale(0.6) - yScale(0.98),
          }}
        >
          <LinePath
            data={points}
            x={(d) => xScale(d.recall)}
            y={(d) => yScale(d.precision)}
            stroke="var(--color-ink)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            curve={curveMonotoneX}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Imbalance-sensitivity anchor: the gap between curve and no-skill */}
        <ExplainAnchor
          selector="imbalance-sensitivity"
          index={3}
          pin={{ x: xScale(0.88), y: (yScale(0.55) + noSkillY) / 2 }}
          rect={{
            x: xScale(0.75),
            y: yScale(0.8),
            width: xScale(0.98) - xScale(0.75),
            height: noSkillY - yScale(0.8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Threshold point bead */}
        <g data-data-layer="true">
          <circle cx={tX} cy={tY} r={4} fill="var(--color-ink)" />
          <circle
            cx={tX}
            cy={tY}
            r={7}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
        </g>
        <ExplainAnchor
          selector="threshold-point"
          index={4}
          pin={{ x: tX - 14, y: tY - 14 }}
          rect={{
            x: Math.max(0, tX - 10),
            y: Math.max(0, tY - 10),
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis (Recall) */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 36 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => (v as number).toFixed(2)}
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
            RECALL
          </text>
        </ExplainAnchor>

        {/* Y-axis (Precision) */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => (v as number).toFixed(2)}
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
            PRECISION
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
