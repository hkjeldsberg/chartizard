"use client";

import { useMemo } from "react";
import { AreaClosed, LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Point {
  fpr: number;
  tpr: number;
}

// Seeded LCG — deterministic binary classifier with 700 neg / 300 pos.
// Positive scores skew high (Beta(4,2)-ish), negative scores skew low
// (Beta(2,4)-ish). Approximated via sums of uniforms + a power transform,
// which is plausibly bimodal and hits AUC ~0.85.
function generateRocPoints(): Point[] {
  let seed = 19;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Beta(a,b) approximation via X / (X + Y) with X ~ Gamma-ish (sum of k uniforms
  // to the power 1). For the shape we want, simpler mix works:
  //   positive: max of 3 uniforms raised to 0.7  -> skewed toward 1
  //   negative: min of 3 uniforms raised to 1.3  -> skewed toward 0
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

  // Sweep threshold from 1.0 down to 0.0 in 100 steps.
  const pts: Point[] = [{ fpr: 0, tpr: 0 }];
  for (let i = 0; i <= 100; i++) {
    const threshold = 1 - i / 100;
    let tp = 0;
    let fp = 0;
    for (const s of posScores) if (s >= threshold) tp++;
    for (const s of negScores) if (s >= threshold) fp++;
    const tpr = P > 0 ? tp / P : 0;
    const fpr = N > 0 ? fp / N : 0;
    pts.push({ fpr, tpr });
  }
  pts.push({ fpr: 1, tpr: 1 });

  // Force monotonic FPR so curveMonotoneX renders cleanly.
  const dedup: Point[] = [];
  let lastFpr = -1;
  for (const p of pts) {
    if (p.fpr >= lastFpr) {
      dedup.push(p);
      lastFpr = p.fpr;
    }
  }
  return dedup;
}

interface Props {
  width: number;
  height: number;
}

export function RocChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { points, thresholdPoint } = useMemo(() => {
    const pts = generateRocPoints();
    // Pick a representative threshold point: first point where TPR >= 0.9.
    let t: Point = pts[Math.floor(pts.length * 0.6)];
    for (const p of pts) {
      if (p.tpr >= 0.9) {
        t = p;
        break;
      }
    }
    return { points: pts, thresholdPoint: t };
  }, []);

  const xScale = scaleLinear({ domain: [0, 1], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 1], range: [ih, 0] });

  const tX = xScale(thresholdPoint.fpr);
  const tY = yScale(thresholdPoint.tpr);

  // Label a point on the AUC area (interior under the curve)
  const aucLabelX = xScale(0.55);
  const aucLabelY = yScale(0.45);

  return (
    <svg width={width} height={height} role="img" aria-label="ROC curve">
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

        {/* AUC shaded area under the curve */}
        <ExplainAnchor
          selector="auc-area"
          index={3}
          pin={{ x: aucLabelX, y: aucLabelY }}
          rect={{
            x: xScale(0.3),
            y: yScale(0.75),
            width: xScale(0.85) - xScale(0.3),
            height: ih - yScale(0.75),
          }}
        >
          <g data-data-layer="true">
            <AreaClosed
              data={points}
              x={(d) => xScale(d.fpr)}
              y={(d) => yScale(d.tpr)}
              yScale={yScale}
              fill="var(--color-ink)"
              fillOpacity={0.14}
              curve={curveMonotoneX}
            />
            <text
              x={aucLabelX}
              y={aucLabelY}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-mute)"
            >
              AUC ≈ 0.85
            </text>
          </g>
        </ExplainAnchor>

        {/* Diagonal y = x — random-classifier reference */}
        <ExplainAnchor
          selector="diagonal"
          index={2}
          pin={{ x: xScale(0.2), y: yScale(0.2) - 16 }}
          rect={{
            x: xScale(0.08),
            y: yScale(0.22),
            width: xScale(0.3) - xScale(0.08),
            height: yScale(0.08) - yScale(0.22),
          }}
        >
          <line
            x1={xScale(0)}
            y1={yScale(0)}
            x2={xScale(1)}
            y2={yScale(1)}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="3 3"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* The ROC curve itself */}
        <ExplainAnchor
          selector="curve"
          index={1}
          pin={{ x: xScale(0.3), y: yScale(0.85) - 14 }}
          rect={{
            x: xScale(0.1),
            y: yScale(0.95),
            width: xScale(0.55) - xScale(0.1),
            height: yScale(0.6) - yScale(0.95),
          }}
        >
          <LinePath
            data={points}
            x={(d) => xScale(d.fpr)}
            y={(d) => yScale(d.tpr)}
            stroke="var(--color-ink)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            curve={curveMonotoneX}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Threshold point — one bead on the curve */}
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
          pin={{ x: tX + 14, y: tY - 14 }}
          rect={{
            x: Math.max(0, tX - 10),
            y: Math.max(0, tY - 10),
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis (FPR) */}
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
            FPR
          </text>
        </ExplainAnchor>

        {/* Y-axis (TPR) */}
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
            TPR
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
