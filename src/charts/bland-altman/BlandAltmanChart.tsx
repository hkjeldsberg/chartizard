"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Pair = { mean: number; diff: number };

// 30 measurement pairs: systolic blood pressure (mmHg) read by a manual
// auscultation cuff (A) and an oscillometric automatic cuff (B), on the same
// patient at the same visit. True BP drawn from N(130, 15). Automatic cuff
// reads systematically high by ~3 mmHg with a ~4 mmHg SD of difference —
// the regime Bland & Altman used to argue correlation is a bad way to compare
// methods. Deterministic via seeded LCG + Box-Muller.
function generatePairs(n: number): Pair[] {
  let seed = 1986; // year of the paper, for the taste of it
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const out: Pair[] = [];
  const bias = 3.1; // mmHg — automatic reads high
  const sdDiff = 4.2;
  for (let i = 0; i < n; i++) {
    const trueBp = 130 + gauss() * 15; // patient-to-patient variation
    const noiseA = gauss() * 1.6;
    const diff = bias + gauss() * sdDiff; // A − B
    const a = trueBp + noiseA;
    const b = a - diff;
    out.push({ mean: (a + b) / 2, diff: a - b });
  }
  return out;
}

const DATA: ReadonlyArray<Pair> = generatePairs(30);

// Summary statistics computed from the data (not hard-coded) so the lines
// actually bracket the points no matter which seed you choose.
const MEAN_DIFF =
  DATA.reduce((acc, p) => acc + p.diff, 0) / DATA.length;
const SD_DIFF = Math.sqrt(
  DATA.reduce((acc, p) => acc + (p.diff - MEAN_DIFF) ** 2, 0) /
    (DATA.length - 1),
);
const LOA_UPPER = MEAN_DIFF + 1.96 * SD_DIFF;
const LOA_LOWER = MEAN_DIFF - 1.96 * SD_DIFF;

interface Props {
  width: number;
  height: number;
}

export function BlandAltmanChart({ width, height }: Props) {
  const margin = { top: 20, right: 44, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [95, 165], range: [0, iw], nice: true });
  const yScale = scaleLinear({ domain: [-12, 16], range: [ih, 0], nice: true });

  const biasY = yScale(MEAN_DIFF);
  const upperY = yScale(LOA_UPPER);
  const lowerY = yScale(LOA_LOWER);
  const zeroY = yScale(0);

  // A representative data point near the cloud centre for the anchor.
  const rep = DATA.reduce((best, p) =>
    Math.abs(p.mean - 130) + Math.abs(p.diff - MEAN_DIFF) <
    Math.abs(best.mean - 130) + Math.abs(best.diff - MEAN_DIFF)
      ? p
      : best,
  );
  const repX = xScale(rep.mean);
  const repY = yScale(rep.diff);

  return (
    <svg width={width} height={height} role="img" aria-label="Bland-Altman plot">
      <Group left={margin.left} top={margin.top}>
        {/* Light y-gridlines for readability. */}
        <g data-data-layer="true">
          {yScale.ticks(5).map((t) => (
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
        </g>

        {/* Points. */}
        <g data-data-layer="true">
          {DATA.map((p, i) => (
            <circle
              key={i}
              cx={xScale(p.mean)}
              cy={yScale(p.diff)}
              r={p === rep ? 3.6 : 2.4}
              fill="var(--color-ink)"
            />
          ))}
        </g>

        {/* Upper limit of agreement (bias + 1.96 SD). */}
        <ExplainAnchor
          selector="loa-line"
          index={3}
          pin={{ x: iw + 16, y: upperY }}
          rect={{ x: 0, y: Math.max(0, upperY - 6), width: iw, height: 12 }}
        >
          <g data-data-layer="true">
            <line
              x1={0}
              x2={iw}
              y1={upperY}
              y2={upperY}
              stroke="var(--color-ink)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <text
              x={iw - 2}
              y={upperY - 4}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-mute)"
            >
              +1.96 SD
            </text>
          </g>
        </ExplainAnchor>

        {/* Lower limit of agreement (bias - 1.96 SD). */}
        <g data-data-layer="true">
          <line
            x1={0}
            x2={iw}
            y1={lowerY}
            y2={lowerY}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
          <text
            x={iw - 2}
            y={lowerY - 4}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            −1.96 SD
          </text>
        </g>

        {/* Zero reference line — perfect agreement. */}
        <ExplainAnchor
          selector="zero-reference"
          index={4}
          pin={{ x: 16, y: zeroY }}
          rect={{
            x: 0,
            y: Math.max(0, Math.min(ih, zeroY) - 5),
            width: iw,
            height: 10,
          }}
        >
          <g data-data-layer="true">
            <line
              x1={0}
              x2={iw}
              y1={zeroY}
              y2={zeroY}
              stroke="var(--color-ink-mute)"
              strokeWidth={0.8}
              strokeDasharray="1 3"
            />
          </g>
        </ExplainAnchor>

        {/* Bias line (mean of differences). */}
        <ExplainAnchor
          selector="bias-line"
          index={2}
          pin={{ x: iw + 16, y: biasY }}
          rect={{ x: 0, y: Math.max(0, biasY - 6), width: iw, height: 12 }}
        >
          <g data-data-layer="true">
            <line
              x1={0}
              x2={iw}
              y1={biasY}
              y2={biasY}
              stroke="var(--color-ink)"
              strokeWidth={1.4}
            />
            <text
              x={2}
              y={biasY - 4}
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink)"
              fontWeight={600}
            >
              BIAS {MEAN_DIFF.toFixed(1)}
            </text>
          </g>
        </ExplainAnchor>

        {/* Representative data point — one measurement pair. */}
        <ExplainAnchor
          selector="data-point"
          index={1}
          pin={{ x: repX - 16, y: Math.max(0, repY - 16) }}
          rect={{
            x: Math.max(0, repX - 8),
            y: Math.max(0, repY - 8),
            width: 16,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis — mean of the two measurements. */}
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
            tickFormat={(v) => String(v)}
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
            MEAN OF A, B (mmHg)
          </text>
        </ExplainAnchor>

        {/* Y-axis — difference between the two measurements. */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
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
            x={-margin.left + 4}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            A − B (mmHg)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
