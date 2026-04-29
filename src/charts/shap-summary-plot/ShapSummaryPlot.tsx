"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear, scaleBand } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// SHAP Summary Plot for a housing-price gradient boosted model.
// Features sorted top-to-bottom by mean absolute SHAP value.
// Each dot: x = SHAP value, colour = feature value (blue=low, red=high).
// Dots jittered in y within each row to form a horizontal beeswarm.

const FEATURES = [
  "LoanAmount",
  "DebtToIncome",
  "CreditScore",
  "Employment",
  "Income",
  "Age",
  "HomeOwner",
  "LoanPurpose",
] as const;
type Feature = (typeof FEATURES)[number];

// SHAP spread per feature (mean abs SHAP, ± std for the beeswarm width).
// Top features have wide spread; bottom cluster near zero.
const SPEC: Record<Feature, { meanAbsShap: number; shapStd: number; colorCorr: number }> = {
  LoanAmount:   { meanAbsShap: 0.42, shapStd: 0.35, colorCorr:  0.85 },
  DebtToIncome: { meanAbsShap: 0.31, shapStd: 0.28, colorCorr:  0.75 },
  CreditScore:  { meanAbsShap: 0.22, shapStd: 0.20, colorCorr: -0.80 },
  Employment:   { meanAbsShap: 0.14, shapStd: 0.13, colorCorr:  0.60 },
  Income:       { meanAbsShap: 0.09, shapStd: 0.09, colorCorr: -0.55 },
  Age:          { meanAbsShap: 0.06, shapStd: 0.06, colorCorr:  0.30 },
  HomeOwner:    { meanAbsShap: 0.04, shapStd: 0.04, colorCorr: -0.40 },
  LoanPurpose:  { meanAbsShap: 0.02, shapStd: 0.02, colorCorr:  0.10 },
};

const DOT_COUNT = 50;
const DOT_R = 2.8;

// Seeded LCG — deterministic across server + client.
function makeRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function gaussian(rand: () => number): number {
  const u = Math.max(1e-9, rand());
  const v = Math.max(1e-9, rand());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Map a normalised feature value [0, 1] to a diverging blue–white–red colour.
// Low feature value = blue (#4a90d9), mid = neutral, high = red (#d94a4a).
function featureColor(normVal: number): string {
  // normVal 0=low(blue), 0.5=mid(neutral), 1=high(red)
  if (normVal < 0.5) {
    const t = normVal * 2; // 0..1 for blue→neutral
    const r = Math.round(74 + t * (160 - 74));
    const g = Math.round(144 + t * (160 - 144));
    const b = Math.round(217 + t * (160 - 217));
    return `rgb(${r},${g},${b})`;
  } else {
    const t = (normVal - 0.5) * 2; // 0..1 for neutral→red
    const r = Math.round(160 + t * (217 - 160));
    const g = Math.round(160 + t * (74 - 160));
    const b = Math.round(160 + t * (74 - 160));
    return `rgb(${r},${g},${b})`;
  }
}

interface Dot {
  shapVal: number;
  featureNorm: number; // 0..1 normalised feature value
  jitterY: number;     // y-jitter in pixels (within row band)
}

// Generate dots for each feature row, with SHAP value correlated to feature value.
function generateDots(feature: Feature, seed: number): Dot[] {
  const { shapStd, colorCorr } = SPEC[feature];
  const rand = makeRand(seed);
  const dots: Dot[] = [];
  for (let i = 0; i < DOT_COUNT; i++) {
    const g1 = gaussian(rand);
    const g2 = gaussian(rand);
    // Feature value drawn from standard normal, normalised to [0,1]
    const featureZ = g2;
    const featureNorm = Math.max(0, Math.min(1, featureZ * 0.3 + 0.5));
    // SHAP value = corr * featureZ + independent noise
    const shapRaw = g1 * shapStd;
    const shapVal = shapRaw + colorCorr * featureZ * shapStd * 0.6;
    const jitterY = (rand() - 0.5) * 2; // uniform in [-1, 1] normalised
    dots.push({ shapVal, featureNorm, jitterY });
  }
  return dots;
}

interface Props {
  width: number;
  height: number;
}

export function ShapSummaryPlot({ width, height }: Props) {
  const margin = { top: 16, right: 28, bottom: 48, left: 82 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = useMemo(
    () => scaleLinear({ domain: [-0.7, 0.7], range: [0, iw], nice: true }),
    [iw],
  );

  const yScale = useMemo(
    () =>
      scaleBand<Feature>({
        domain: [...FEATURES],
        range: [0, ih],
        padding: 0.25,
      }),
    [ih],
  );

  const bandH = yScale.bandwidth();
  const maxJitterPx = Math.max(1, bandH * 0.38); // max y-jitter within band

  const rows = useMemo(
    () =>
      FEATURES.map((feature, fi) => {
        const dots = generateDots(feature, 1000 + fi * 137);
        const cy = (yScale(feature) ?? 0) + bandH / 2;
        return { feature, cy, dots };
      }),
    [yScale, bandH],
  );

  // Zero line x position
  const zeroX = xScale(0);

  // Pick representative dots for anchors
  // Feature row anchor: top feature (LoanAmount), first dot near positive side
  const topRow = rows[0];
  const repDot = useMemo(() => {
    if (!topRow) return null;
    // find dot with highest positive SHAP
    let best = topRow.dots[0];
    for (const d of topRow.dots) {
      if (d.shapVal > (best?.shapVal ?? 0)) best = d;
    }
    return best;
  }, [topRow]);

  const repDotX = repDot ? xScale(repDot.shapVal) : zeroX;
  const repDotY = topRow ? topRow.cy + repDot!.jitterY * maxJitterPx : 0;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="SHAP Summary Plot showing feature importance and direction for a housing-price model"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines (vertical, along SHAP axis) */}
        <g data-data-layer="true">
          {xScale.ticks(5).map((t) => (
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

        {/* Dots — beeswarm per feature row */}
        <ExplainAnchor
          selector="dot"
          index={4}
          pin={{ x: Math.min(iw - 10, repDotX + 14), y: Math.max(10, repDotY - 14) }}
          rect={{
            x: Math.max(0, repDotX - 6),
            y: Math.max(0, repDotY - 6),
            width: 12,
            height: 12,
          }}
        >
          <g data-data-layer="true">
            {rows.map(({ feature, cy, dots }) =>
              dots.map((d, i) => (
                <circle
                  key={`${feature}-${i}`}
                  cx={xScale(d.shapVal)}
                  cy={cy + d.jitterY * maxJitterPx}
                  r={DOT_R}
                  fill={featureColor(d.featureNorm)}
                  fillOpacity={0.82}
                />
              )),
            )}
            {/* Highlight ring on the representative dot */}
            {repDot && topRow && (
              <circle
                cx={repDotX}
                cy={repDotY}
                r={DOT_R + 1.2}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={1.2}
              />
            )}
          </g>
        </ExplainAnchor>

        {/* SHAP=0 vertical reference line */}
        <ExplainAnchor
          selector="zero-axis"
          index={2}
          pin={{ x: zeroX, y: -12 }}
          rect={{ x: Math.max(0, zeroX - 5), y: 0, width: 10, height: ih }}
        >
          <line
            x1={zeroX}
            x2={zeroX}
            y1={0}
            y2={ih}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="1 0"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Feature row labels — Y-axis acts as the feature sort order */}
        <ExplainAnchor
          selector="sort-order"
          index={5}
          pin={{ x: -margin.left + 4, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            tickFormat={(v) => String(v)}
            stroke="none"
            tickStroke="none"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fill: "var(--color-ink-soft)",
              textAnchor: "end",
              dx: "-0.4em",
              dy: "0.33em",
            })}
          />
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={3}
          pin={{ x: iw / 2, y: ih + 36 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => (Number(v) > 0 ? `+${Number(v).toFixed(2)}` : Number(v).toFixed(2))}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
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
            SHAP VALUE
          </text>
        </ExplainAnchor>

        {/* Colour legend — low (blue) to high (red) feature value */}
        <ExplainAnchor
          selector="colour-legend"
          index={6}
          pin={{ x: iw - 4, y: ih + 24 }}
          rect={{ x: iw - 60, y: ih + 12, width: 60, height: 16 }}
        >
          <g transform={`translate(${iw - 58}, ${ih + 13})`} data-data-layer="true">
            <defs>
              <linearGradient id="shap-feat-grad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgb(74,144,217)" />
                <stop offset="50%" stopColor="rgb(160,160,160)" />
                <stop offset="100%" stopColor="rgb(217,74,74)" />
              </linearGradient>
            </defs>
            <rect width={56} height={7} fill="url(#shap-feat-grad)" rx={1} />
            <text
              x={0}
              y={14}
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              LOW
            </text>
            <text
              x={56}
              y={14}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              HIGH
            </text>
            <text
              x={28}
              y={-2}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              FEAT. VALUE
            </text>
          </g>
        </ExplainAnchor>

        {/* Top feature row anchor (LoanAmount) */}
        <ExplainAnchor
          selector="feature-row"
          index={1}
          pin={{ x: iw + 10, y: topRow?.cy ?? ih * 0.1 }}
          rect={{
            x: 0,
            y: Math.max(0, (topRow?.cy ?? 0) - bandH / 2),
            width: iw,
            height: bandH,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
