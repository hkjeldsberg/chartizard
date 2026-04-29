"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Seeded LCG → Box-Muller → 200 Gaussian draws (mean=50, sd=10), then a
// right-tail skew added so the upper tail bows away from the diagonal.
// Deterministic: the same 200 samples are shared with NormalProbabilityChart.
function generateSamples(n: number): number[] {
  let seed = 23;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    let x = 50 + 10 * gauss();
    const over = x - 50;
    if (over > 0) x = x + 0.2 * Math.pow(over, 1.5);
    out.push(x);
  }
  return out;
}

// Peter Acklam's rational approximation of the inverse standard normal CDF.
// Accurate to ~1.15e-9 — far more than a chart needs.
function normalInverseCDF(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;

  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.38357751867269e2, -3.066479806614716e1, 2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
    3.754408661907416,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  let q: number;
  let r: number;
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) *
        q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  }
  q = Math.sqrt(-2 * Math.log(1 - p));
  return (
    -(
      ((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q +
      c[5]
    ) /
    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  );
}

interface Props {
  width: number;
  height: number;
}

export function QqChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { points, sampleMean, sampleSd, tailIndex } = useMemo(() => {
    const raw = generateSamples(200);
    const sorted = [...raw].sort((a, b) => a - b);
    const n = sorted.length;
    const mean = sorted.reduce((s, v) => s + v, 0) / n;
    const variance =
      sorted.reduce((s, v) => s + (v - mean) * (v - mean), 0) / (n - 1);
    const sd = Math.sqrt(variance);
    const pts = sorted.map((y, i) => {
      const pp = (i + 0.5) / n;
      return { x: normalInverseCDF(pp), y };
    });
    // The tail-deviation anchor targets a deep right-tail quantile so the
    // bow away from the diagonal is always pinned to a visible point.
    const tIdx = Math.round(0.985 * n) - 1;
    return { points: pts, sampleMean: mean, sampleSd: sd, tailIndex: tIdx };
  }, []);

  const xDomain: [number, number] = [-3, 3];
  // Fixed y-domain wide enough for the seed=23 samples (max ~120), so ticks
  // don't drift. Range is chosen once — not derived from the data — so the
  // visual story reads identically across renders.
  const yDomain: [number, number] = [15, 125];

  const xScale = scaleLinear({ domain: xDomain, range: [0, iw] });
  const yScale = scaleLinear({ domain: yDomain, range: [ih, 0] });

  const refLineY = (x: number) => sampleMean + sampleSd * x;
  const diagX0 = xDomain[0];
  const diagX1 = xDomain[1];
  const diagPx0 = { x: xScale(diagX0), y: yScale(refLineY(diagX0)) };
  const diagPx1 = { x: xScale(diagX1), y: yScale(refLineY(diagX1)) };

  // Median-region anchor: the point closest to the median quantile (pp=0.5).
  const centreIdx = Math.round(0.5 * points.length) - 1;
  const centreP = points[centreIdx];

  // Representative point — quarter way along for the generic "one quantile pair"
  const pointIdx = Math.round(0.25 * points.length);
  const repP = points[pointIdx];

  const tailP = points[tailIndex];
  const tailPx = { x: xScale(tailP.x), y: yScale(tailP.y) };
  const tailLinePx = {
    x: xScale(tailP.x),
    y: yScale(refLineY(tailP.x)),
  };

  // Clamp rect helper — the contract §8 demands every rect clamp to the plot.
  const clamp = (r: { x: number; y: number; width: number; height: number }) => {
    const x0 = Math.max(0, r.x);
    const y0 = Math.max(0, r.y);
    const x1 = Math.min(iw, r.x + r.width);
    const y1 = Math.min(ih, r.y + r.height);
    return { x: x0, y: y0, width: Math.max(0, x1 - x0), height: Math.max(0, y1 - y0) };
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Q-Q plot">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(4).map((t) => (
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
          {xScale.ticks(5).map((t) => (
            <line
              key={`xg-${t}`}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* Diagonal reference line: y = mean + sd * x */}
        <ExplainAnchor
          selector="diagonal"
          index={2}
          pin={{ x: xScale(-1.4), y: yScale(refLineY(-1.4)) - 14 }}
          rect={clamp({
            x: xScale(-2.2),
            y: yScale(refLineY(-2.2)) - 8,
            width: xScale(2.2) - xScale(-2.2),
            height: 16,
          })}
        >
          <g data-data-layer="true">
            <line
              x1={diagPx0.x}
              y1={diagPx0.y}
              x2={diagPx1.x}
              y2={diagPx1.y}
              stroke="var(--color-ink-mute)"
              strokeWidth={1.1}
              strokeDasharray="4 3"
            />
          </g>
        </ExplainAnchor>

        {/* All points */}
        <g data-data-layer="true">
          {points.map((p, i) => (
            <circle
              key={i}
              cx={xScale(p.x)}
              cy={yScale(p.y)}
              r={i === tailIndex || i === centreIdx || i === pointIdx ? 3.2 : 2.2}
              fill="var(--color-ink)"
            />
          ))}
        </g>

        {/* Representative point */}
        <ExplainAnchor
          selector="point"
          index={1}
          pin={{ x: xScale(repP.x) - 14, y: yScale(repP.y) - 14 }}
          rect={clamp({
            x: xScale(repP.x) - 8,
            y: yScale(repP.y) - 8,
            width: 16,
            height: 16,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Centre — median-ish point sitting on the diagonal */}
        <ExplainAnchor
          selector="centre"
          index={3}
          pin={{ x: xScale(centreP.x) + 14, y: yScale(centreP.y) - 14 }}
          rect={clamp({
            x: xScale(centreP.x) - 8,
            y: yScale(centreP.y) - 8,
            width: 16,
            height: 16,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Tail deviation — the right-tail bow. A little connector from the
            point to where the diagonal would have predicted it. */}
        <g data-data-layer="true">
          <line
            x1={tailPx.x}
            y1={tailPx.y}
            x2={tailLinePx.x}
            y2={tailLinePx.y}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="1 2"
          />
        </g>
        <ExplainAnchor
          selector="tail-deviation"
          index={4}
          pin={{ x: tailPx.x - 18, y: tailPx.y - 14 }}
          rect={clamp({
            x: Math.min(tailPx.x, tailLinePx.x) - 6,
            y: Math.min(tailPx.y, tailLinePx.y) - 6,
            width: Math.abs(tailPx.x - tailLinePx.x) + 12,
            height: Math.abs(tailPx.y - tailLinePx.y) + 12,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis — theoretical quantiles */}
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
            THEORETICAL QUANTILES (Z)
          </text>
        </ExplainAnchor>

        {/* Y-axis — sample quantiles */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={4}
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
            SAMPLE QUANTILES
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
