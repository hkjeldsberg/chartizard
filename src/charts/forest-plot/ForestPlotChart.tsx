"use client";

import { Group } from "@visx/group";
import { scaleBand, scaleLog } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Study = {
  name: string;
  hr: number;
  lo: number;
  hi: number;
  weight: number;
};

const STUDIES: ReadonlyArray<Study> = [
  { name: "ALPINE-1", hr: 0.72, lo: 0.55, hi: 0.94, weight: 0.18 },
  { name: "BREEZE-2", hr: 0.81, lo: 0.60, hi: 1.09, weight: 0.14 },
  { name: "CEDAR-3", hr: 0.69, lo: 0.52, hi: 0.91, weight: 0.16 },
  { name: "DELTA-4", hr: 0.95, lo: 0.70, hi: 1.30, weight: 0.09 },
  { name: "ECHO-5", hr: 0.65, lo: 0.45, hi: 0.93, weight: 0.10 },
  { name: "FJORD-6", hr: 0.78, lo: 0.58, hi: 1.05, weight: 0.12 },
  { name: "GARDEN-7", hr: 1.10, lo: 0.78, hi: 1.55, weight: 0.08 },
  { name: "HAVEN-8", hr: 0.76, lo: 0.58, hi: 1.00, weight: 0.13 },
];

const POOLED = { name: "POOLED", hr: 0.78, lo: 0.68, hi: 0.89 } as const;

const ROWS = [...STUDIES.map((s) => s.name), POOLED.name];

interface Props {
  width: number;
  height: number;
}

export function ForestPlotChart({ width, height }: Props) {
  const margin = { top: 20, right: 24, bottom: 44, left: 88 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Log-scale HR axis, domain spans below and above the null line at 1.
  const xScale = scaleLog<number>({
    domain: [0.4, 2.0],
    range: [0, iw],
  });

  // One row per study plus a pooled row at the bottom.
  const yScale = scaleBand<string>({
    domain: ROWS,
    range: [0, ih],
    padding: 0.28,
  });

  const bh = yScale.bandwidth();
  const nullX = xScale(1);

  // Square size scales with study weight. Max weight ≈ 0.18.
  const maxWeight = Math.max(...STUDIES.map((s) => s.weight));
  const maxSquare = Math.min(bh, 14);
  const squareFor = (w: number) =>
    Math.max(4, Math.min(maxSquare, (w / maxWeight) * maxSquare));

  // Representative study (ALPINE-1) for the point-estimate and CI anchors.
  const rep = STUDIES[0];
  const repY = (yScale(rep.name) ?? 0) + bh / 2;
  const repCx = xScale(rep.hr);
  const repSq = squareFor(rep.weight);

  // A heavier study (CEDAR-3) for the weight anchor so the square is visibly
  // larger than the representative.
  const heavy = STUDIES[2];
  const heavyY = (yScale(heavy.name) ?? 0) + bh / 2;
  const heavyCx = xScale(heavy.hr);
  const heavySq = squareFor(heavy.weight);

  // Pooled diamond geometry.
  const pooledY = (yScale(POOLED.name) ?? 0) + bh / 2;
  const pooledHalf = Math.max(4, bh * 0.42);
  const pooledLoX = xScale(POOLED.lo);
  const pooledHiX = xScale(POOLED.hi);
  const pooledCxX = xScale(POOLED.hr);
  const pooledPoints = [
    `${pooledLoX},${pooledY}`,
    `${pooledCxX},${pooledY - pooledHalf}`,
    `${pooledHiX},${pooledY}`,
    `${pooledCxX},${pooledY + pooledHalf}`,
  ].join(" ");

  return (
    <svg width={width} height={height} role="img" aria-label="Forest plot">
      <Group left={margin.left} top={margin.top}>
        {/* Confidence-interval whiskers + point estimates for each study. */}
        <g data-data-layer="true">
          {STUDIES.map((s) => {
            const y = (yScale(s.name) ?? 0) + bh / 2;
            const loX = xScale(s.lo);
            const hiX = xScale(s.hi);
            const cx = xScale(s.hr);
            const sq = squareFor(s.weight);
            return (
              <g key={s.name}>
                {/* CI line */}
                <line
                  x1={loX}
                  x2={hiX}
                  y1={y}
                  y2={y}
                  stroke="var(--color-ink)"
                  strokeWidth={1.1}
                />
                {/* CI end caps */}
                <line
                  x1={loX}
                  x2={loX}
                  y1={y - 3}
                  y2={y + 3}
                  stroke="var(--color-ink)"
                  strokeWidth={1.1}
                />
                <line
                  x1={hiX}
                  x2={hiX}
                  y1={y - 3}
                  y2={y + 3}
                  stroke="var(--color-ink)"
                  strokeWidth={1.1}
                />
                {/* Point estimate — square sized by study weight */}
                <rect
                  x={cx - sq / 2}
                  y={y - sq / 2}
                  width={sq}
                  height={sq}
                  fill="var(--color-ink)"
                />
              </g>
            );
          })}
        </g>

        {/* Study labels in the left gutter. */}
        <g data-data-layer="true">
          {STUDIES.map((s) => {
            const y = (yScale(s.name) ?? 0) + bh / 2;
            return (
              <text
                key={s.name}
                x={-8}
                y={y}
                textAnchor="end"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink-soft)"
              >
                {s.name}
              </text>
            );
          })}
          <text
            x={-8}
            y={pooledY}
            textAnchor="end"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
            fontWeight={600}
          >
            POOLED
          </text>
        </g>

        {/* 1. Point estimate — a single study's square. */}
        <ExplainAnchor
          selector="point-estimate"
          index={1}
          pin={{ x: repCx, y: Math.max(0, repY - 18) }}
          rect={{
            x: Math.max(0, repCx - repSq / 2 - 2),
            y: Math.max(0, repY - repSq / 2 - 2),
            width: repSq + 4,
            height: repSq + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Confidence interval — the horizontal whisker on the same row. */}
        <ExplainAnchor
          selector="confidence-interval"
          index={2}
          pin={{
            x: (xScale(rep.lo) + xScale(rep.hi)) / 2,
            y: Math.min(ih, repY + 16),
          }}
          rect={{
            x: xScale(rep.lo),
            y: Math.max(0, repY - 5),
            width: Math.max(1, xScale(rep.hi) - xScale(rep.lo)),
            height: 10,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Study weight — pinned to a visibly larger square (CEDAR-3). */}
        <ExplainAnchor
          selector="study-weight"
          index={3}
          pin={{ x: heavyCx, y: Math.max(0, heavyY - 18) }}
          rect={{
            x: Math.max(0, heavyCx - heavySq / 2 - 2),
            y: Math.max(0, heavyY - heavySq / 2 - 2),
            width: heavySq + 4,
            height: heavySq + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Null line at HR = 1 — dashed vertical reference. */}
        <ExplainAnchor
          selector="null-line"
          index={4}
          pin={{ x: nullX, y: -10 }}
          rect={{
            x: Math.max(0, nullX - 5),
            y: 0,
            width: 10,
            height: ih,
          }}
        >
          <line
            x1={nullX}
            x2={nullX}
            y1={0}
            y2={ih}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="3 3"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* 5. Pooled diamond — random-effects summary row. */}
        <ExplainAnchor
          selector="pooled-diamond"
          index={5}
          pin={{
            x: Math.min(iw, pooledHiX + 14),
            y: pooledY,
          }}
          rect={{
            x: Math.max(0, pooledLoX - 2),
            y: Math.max(0, pooledY - pooledHalf - 2),
            width: Math.max(1, pooledHiX - pooledLoX + 4),
            height: pooledHalf * 2 + 4,
          }}
        >
          <polygon
            points={pooledPoints}
            fill="var(--color-ink)"
            stroke="var(--color-ink)"
            strokeWidth={1}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* 6. Log x-axis — hazard ratio axis with favours labels. */}
        <ExplainAnchor
          selector="log-x-axis"
          index={6}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            tickValues={[0.5, 0.7, 1, 1.4, 2]}
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
            HAZARD RATIO (LOG SCALE)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
