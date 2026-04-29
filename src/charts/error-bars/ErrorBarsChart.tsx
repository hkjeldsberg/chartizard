"use client";

import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Variant = {
  name: string;
  mean: number; // conversion rate, percent
  lo: number; // 95% CI lower bound
  hi: number; // 95% CI upper bound
};

// A/B test across five landing-page variants. Conversion rate, in percent,
// with 95% confidence intervals. Variants C and D have overlapping CIs — a
// classic "the difference might not be significant" pair.
const DATA: ReadonlyArray<Variant> = [
  { name: "Control", mean: 3.1, lo: 2.7, hi: 3.5 },
  { name: "Variant A", mean: 3.4, lo: 2.9, hi: 3.9 },
  { name: "Variant B", mean: 4.2, lo: 3.7, hi: 4.7 },
  { name: "Variant C", mean: 4.9, lo: 4.3, hi: 5.5 },
  { name: "Variant D", mean: 5.2, lo: 4.6, hi: 5.8 },
];

const SHORT_LABEL: Record<string, string> = {
  Control: "CTRL",
  "Variant A": "A",
  "Variant B": "B",
  "Variant C": "C",
  "Variant D": "D",
};

interface Props {
  width: number;
  height: number;
}

export function ErrorBarsChart({ width, height }: Props) {
  const margin = { top: 24, right: 20, bottom: 48, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleBand<string>({
    domain: DATA.map((d) => d.name),
    range: [0, iw],
    padding: 0.42,
  });

  const yScale = scaleLinear<number>({
    domain: [0, 7],
    range: [ih, 0],
    nice: true,
  });

  const ticksY = yScale.ticks(5);
  const bw = xScale.bandwidth();
  const capHalf = Math.max(4, bw * 0.32);

  // Representative variant for the single-element anchors (Variant C — tall
  // bar, wide CI that overlaps with Variant D's CI).
  const rep = DATA[3];
  const repX = (xScale(rep.name) ?? 0) + bw / 2;
  const repBarX = xScale(rep.name) ?? 0;
  const repMeanY = yScale(rep.mean);
  const repHiY = yScale(rep.hi);
  const repLoY = yScale(rep.lo);

  // Neighbouring variant (D) — used to visually motivate the overlap story,
  // though we only anchor the one representative CI.
  return (
    <svg width={width} height={height} role="img" aria-label="Error bars chart">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {ticksY.map((t) => (
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

        {/* Bars — point estimates */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const x = xScale(d.name) ?? 0;
            const y = yScale(d.mean);
            return (
              <Bar
                key={d.name}
                x={x}
                y={y}
                width={bw}
                height={ih - y}
                fill="var(--color-ink)"
                opacity={0.22}
              />
            );
          })}
        </g>

        {/* Whiskers — confidence intervals with caps on top of every bar */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const cx = (xScale(d.name) ?? 0) + bw / 2;
            const loY = yScale(d.lo);
            const hiY = yScale(d.hi);
            const meanY = yScale(d.mean);
            return (
              <g key={d.name}>
                {/* Vertical whisker line */}
                <line
                  x1={cx}
                  x2={cx}
                  y1={hiY}
                  y2={loY}
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                />
                {/* Upper cap */}
                <line
                  x1={cx - capHalf}
                  x2={cx + capHalf}
                  y1={hiY}
                  y2={hiY}
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                />
                {/* Lower cap */}
                <line
                  x1={cx - capHalf}
                  x2={cx + capHalf}
                  y1={loY}
                  y2={loY}
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                />
                {/* Mean tick — small horizontal bar on top of the column */}
                <line
                  x1={cx - capHalf * 0.7}
                  x2={cx + capHalf * 0.7}
                  y1={meanY}
                  y2={meanY}
                  stroke="var(--color-ink)"
                  strokeWidth={1.6}
                />
              </g>
            );
          })}
        </g>

        {/* 1. Point estimate — the bar height / mean tick on the representative column */}
        <ExplainAnchor
          selector="point-estimate"
          index={1}
          pin={{ x: repX + capHalf + 14, y: repMeanY }}
          rect={{
            x: repBarX,
            y: repMeanY,
            width: bw,
            height: Math.max(2, ih - repMeanY),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Upper bound — the top cap of the whisker */}
        <ExplainAnchor
          selector="upper-bound"
          index={2}
          pin={{ x: repX + capHalf + 14, y: Math.max(0, repHiY - 4) }}
          rect={{
            x: Math.max(0, repX - capHalf - 2),
            y: Math.max(0, repHiY - 5),
            width: capHalf * 2 + 4,
            height: 10,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Lower bound — the bottom cap of the whisker */}
        <ExplainAnchor
          selector="lower-bound"
          index={3}
          pin={{ x: repX + capHalf + 14, y: Math.min(ih, repLoY + 4) }}
          rect={{
            x: Math.max(0, repX - capHalf - 2),
            y: Math.min(ih - 10, repLoY - 5),
            width: capHalf * 2 + 4,
            height: 10,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Whisker — the full CI span on the representative column */}
        <ExplainAnchor
          selector="whisker"
          index={4}
          pin={{ x: Math.max(0, repX - capHalf - 14), y: (repHiY + repLoY) / 2 }}
          rect={{
            x: Math.max(0, repX - 4),
            y: Math.max(0, repHiY),
            width: 8,
            height: Math.max(1, repLoY - repHiY),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. X-axis — variant labels */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            tickFormat={(v) => SHORT_LABEL[v as string] ?? (v as string)}
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

        {/* 6. Y-axis — conversion rate */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => `${Number(v)}%`}
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
            CONVERSION %
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
