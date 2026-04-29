"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Same seeded generator as QqChart — 200 slightly right-skewed draws.
// The contract forbids a shared-datasets module, so the helper is duplicated.
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

// Acklam's rational approximation of the inverse standard normal CDF.
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

const PROB_TICKS: ReadonlyArray<{ p: number; label: string }> = [
  { p: 0.01, label: "1%" },
  { p: 0.05, label: "5%" },
  { p: 0.25, label: "25%" },
  { p: 0.5, label: "50%" },
  { p: 0.75, label: "75%" },
  { p: 0.95, label: "95%" },
  { p: 0.99, label: "99%" },
];

export function NormalProbabilityChart({ width, height }: Props) {
  // Extra left margin so the probability labels ("25%", "50%", ...) breathe.
  const margin = { top: 20, right: 20, bottom: 44, left: 62 };
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
    const pts = sorted.map((x, i) => {
      const pp = (i + 0.5) / n;
      return { x, z: normalInverseCDF(pp) };
    });
    const tIdx = Math.round(0.985 * n) - 1;
    return { points: pts, sampleMean: mean, sampleSd: sd, tailIndex: tIdx };
  }, []);

  // X: sample value, linear. Y: z-score from inverse-normal of the plotting
  // position. The y-axis *looks* like cumulative probability via custom ticks,
  // but internally it's just a linear z-scale — which is exactly the trick
  // that makes a normal sample plot as a straight line.
  const xDomain: [number, number] = [15, 125];
  // z-domain must contain every plotting-position z for n=200 — smallest is
  // pp=0.0025 (z≈-2.81), largest is pp=0.9975 (z≈+2.81). Pad a touch beyond.
  const zDomain: [number, number] = [
    normalInverseCDF(0.002),
    normalInverseCDF(0.998),
  ];

  const xScale = scaleLinear({ domain: xDomain, range: [0, iw] });
  const zScale = scaleLinear({ domain: zDomain, range: [ih, 0] });

  // The fitted line: a true normal distribution with the sample's mean + sd
  // maps to the straight line  z = (x - mean) / sd. Solve for endpoints in
  // plot space by inverting.
  const lineXAtZ = (z: number) => sampleMean + sampleSd * z;
  const lineP0 = {
    x: xScale(lineXAtZ(zDomain[0])),
    y: zScale(zDomain[0]),
  };
  const lineP1 = {
    x: xScale(lineXAtZ(zDomain[1])),
    y: zScale(zDomain[1]),
  };

  // Representative point — quarter way, for the generic "one sample" anchor
  const pointIdx = Math.round(0.25 * points.length);
  const repP = points[pointIdx];

  const tailP = points[tailIndex];
  const tailPx = { x: xScale(tailP.x), y: zScale(tailP.z) };
  // Where the fitted line would have placed that same z.
  const tailLinePx = {
    x: xScale(lineXAtZ(tailP.z)),
    y: zScale(tailP.z),
  };

  // Anchor for the 50% label on the rescaled y-axis.
  const label50Y = zScale(0);

  const clamp = (r: { x: number; y: number; width: number; height: number }) => {
    const x0 = Math.max(0, r.x);
    const y0 = Math.max(0, r.y);
    const x1 = Math.min(iw, r.x + r.width);
    const y1 = Math.min(ih, r.y + r.height);
    return { x: x0, y: y0, width: Math.max(0, x1 - x0), height: Math.max(0, y1 - y0) };
  };

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Normal probability plot"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines at each probability tick level */}
        <g data-data-layer="true">
          {PROB_TICKS.map(({ p }) => {
            const y = zScale(normalInverseCDF(p));
            return (
              <line
                key={`grid-${p}`}
                x1={0}
                x2={iw}
                y1={y}
                y2={y}
                stroke="var(--color-hairline)"
                strokeDasharray="2 3"
              />
            );
          })}
        </g>

        {/* Fitted line (what a true-normal sample would trace) */}
        <ExplainAnchor
          selector="fitted-line"
          index={2}
          pin={{ x: xScale(lineXAtZ(-1)) - 18, y: zScale(-1) + 12 }}
          rect={clamp({
            x: Math.min(lineP0.x, lineP1.x) - 8,
            y: Math.min(lineP0.y, lineP1.y),
            width: Math.abs(lineP1.x - lineP0.x) + 16,
            height: Math.abs(lineP1.y - lineP0.y),
          })}
        >
          <g data-data-layer="true">
            <line
              x1={lineP0.x}
              y1={lineP0.y}
              x2={lineP1.x}
              y2={lineP1.y}
              stroke="var(--color-ink-mute)"
              strokeWidth={1.1}
              strokeDasharray="4 3"
            />
          </g>
        </ExplainAnchor>

        {/* Custom y-axis — probability labels at non-linear positions */}
        <g data-data-layer="true">
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={ih}
            stroke="var(--color-ink-mute)"
          />
          {PROB_TICKS.map(({ p, label }) => {
            const y = zScale(normalInverseCDF(p));
            return (
              <g key={`ytick-${p}`}>
                <line
                  x1={-4}
                  x2={0}
                  y1={y}
                  y2={y}
                  stroke="var(--color-ink-mute)"
                />
                <text
                  x={-7}
                  y={y}
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink-soft)"
                  textAnchor="end"
                  dy="0.33em"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Sample points */}
        <g data-data-layer="true">
          {points.map((p, i) => (
            <circle
              key={i}
              cx={xScale(p.x)}
              cy={zScale(p.z)}
              r={i === tailIndex || i === pointIdx ? 3.2 : 2.2}
              fill="var(--color-ink)"
            />
          ))}
        </g>

        {/* Representative point */}
        <ExplainAnchor
          selector="point"
          index={1}
          pin={{ x: xScale(repP.x) - 14, y: zScale(repP.z) - 14 }}
          rect={clamp({
            x: xScale(repP.x) - 8,
            y: zScale(repP.z) - 8,
            width: 16,
            height: 16,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Probability axis — covers the upper half of the y-axis labels so
            the 50% anchor can claim the band in the middle without overlap. */}
        <ExplainAnchor
          selector="probability-axis"
          index={3}
          pin={{ x: -36, y: zScale(normalInverseCDF(0.9)) - 14 }}
          rect={{
            x: -margin.left,
            y: 0,
            width: margin.left,
            height: Math.max(0, label50Y - 12),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 50% label — the median level on the rescaled axis */}
        <ExplainAnchor
          selector="label-at-50"
          index={4}
          pin={{ x: -36, y: label50Y - 14 }}
          rect={{
            x: -margin.left,
            y: label50Y - 10,
            width: margin.left,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Tail deviation — stub from the top point back to the fitted line */}
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
          index={5}
          pin={{ x: tailPx.x + 18, y: tailPx.y - 4 }}
          rect={clamp({
            x: Math.min(tailPx.x, tailLinePx.x) - 6,
            y: tailPx.y - 8,
            width: Math.abs(tailPx.x - tailLinePx.x) + 12,
            height: 16,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis — sample value */}
        <ExplainAnchor
          selector="x-axis"
          index={6}
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
            SAMPLE VALUE
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
