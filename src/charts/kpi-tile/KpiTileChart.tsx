"use client";

import { useMemo } from "react";
import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// 12 months of Monthly Active Users (millions), climbing from ~1.6M to 2.4M.
// Seeded deterministic walk so server + client render identically.
function generateMauSeries(): number[] {
  let seed = 19;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const start = 1.6;
  const end = 2.4;
  const n = 12;
  const out: number[] = [];
  let v = start;
  const drift = (end - start) / (n - 1);
  for (let i = 0; i < n; i++) {
    const noise = (rand() - 0.5) * 0.08;
    v = v + drift + noise;
    out.push(v);
  }
  // Pin the last point to the exact headline number (2.4M).
  out[out.length - 1] = 2.4;
  out[0] = start;
  return out;
}

interface Props {
  width: number;
  height: number;
}

export function KpiTileChart({ width, height }: Props) {
  const series = useMemo(() => generateMauSeries(), []);

  const bigNumber = "2.4M";
  const unitLabel = "MONTHLY ACTIVE USERS";
  const deltaPct = 12.3; // +12.3% vs last month

  // Responsive-ish type sizing: the big number scales with height but clamps
  // so it stays readable on small tiles and doesn't blow out on wide ones.
  const bigSize = Math.max(28, Math.min(64, Math.round(height * 0.34)));
  const unitSize = Math.max(9, Math.min(12, Math.round(height * 0.07)));
  const deltaSize = Math.max(10, Math.min(14, Math.round(height * 0.085)));

  // Centre the number/unit pair in the upper 62% of the tile; sparkline lives
  // in the bottom-right.
  const centreX = width / 2;
  const bigY = height * 0.46;
  const unitY = bigY + bigSize * 0.55;
  const deltaY = unitY + deltaSize + 14;

  // Inset sparkline — pinned bottom-right, small.
  const sparkW = Math.min(140, Math.max(80, width * 0.42));
  const sparkH = Math.min(36, Math.max(22, height * 0.18));
  const sparkPadX = 18;
  const sparkPadY = 16;
  const sparkX = width - sparkW - sparkPadX;
  const sparkY = height - sparkH - sparkPadY;

  const xScale = scaleLinear({ domain: [0, series.length - 1], range: [0, sparkW] });
  const yMin = Math.min(...series);
  const yMax = Math.max(...series);
  const pad = (yMax - yMin) * 0.2 || 0.1;
  const yScale = scaleLinear({
    domain: [yMin - pad, yMax + pad],
    range: [sparkH, 0],
  });

  // Comparison baseline for the sparkline: the value from 1 month ago (the
  // thing the +12.3% is measured against — i.e. the second-to-last point).
  const baselineVal = series[series.length - 2];

  // Delta badge geometry — a right-pointing up-triangle + "+12.3%".
  const deltaText = `+${deltaPct.toFixed(1)}%`;
  const badgeCharWidth = deltaSize * 0.58;
  const badgeTextWidth = deltaText.length * badgeCharWidth;
  const triangleSize = deltaSize * 0.6;
  const badgeInnerGap = 6;
  const badgeInnerWidth = triangleSize + badgeInnerGap + badgeTextWidth;
  const badgePadX = 8;
  const badgePadY = 4;
  const badgeWidth = badgeInnerWidth + badgePadX * 2;
  const badgeHeight = deltaSize + badgePadY * 2;
  const badgeX = centreX - badgeWidth / 2;
  const badgeY = deltaY - badgeHeight / 2;
  const triX = badgeX + badgePadX;
  const triY = badgeY + badgeHeight / 2;

  return (
    <svg width={width} height={height} role="img" aria-label="KPI tile">
      {/* Most of this chart is typography. Each anchor sits directly on top of
          the glyph it explains via a rect hit-area. */}

      {/* Big number */}
      <ExplainAnchor
        selector="big-number"
        index={1}
        pin={{ x: centreX, y: bigY - bigSize * 0.75 - 8 }}
        rect={{
          x: centreX - bigSize * 1.6,
          y: bigY - bigSize * 0.75,
          width: bigSize * 3.2,
          height: bigSize * 1.0,
        }}
      >
        <g data-data-layer="true">
          <text
            x={centreX}
            y={bigY}
            textAnchor="middle"
            dominantBaseline="alphabetic"
            fontFamily="var(--font-display), var(--font-sans)"
            fontSize={bigSize}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            {bigNumber}
          </text>
        </g>
      </ExplainAnchor>

      {/* Unit label */}
      <ExplainAnchor
        selector="unit-label"
        index={2}
        pin={{ x: centreX, y: unitY + unitSize + 4 }}
        rect={{
          x: centreX - 110,
          y: unitY - unitSize * 0.7,
          width: 220,
          height: unitSize * 1.6,
        }}
      >
        <g data-data-layer="true">
          <text
            x={centreX}
            y={unitY}
            textAnchor="middle"
            dominantBaseline="alphabetic"
            fontFamily="var(--font-mono)"
            fontSize={unitSize}
            letterSpacing={1.2}
            fill="var(--color-ink-mute)"
          >
            {unitLabel}
          </text>
        </g>
      </ExplainAnchor>

      {/* Delta badge */}
      <ExplainAnchor
        selector="delta"
        index={3}
        pin={{ x: centreX, y: badgeY + badgeHeight + 10 }}
        rect={{ x: badgeX, y: badgeY, width: badgeWidth, height: badgeHeight }}
      >
        <g data-data-layer="true">
          <rect
            x={badgeX}
            y={badgeY}
            width={badgeWidth}
            height={badgeHeight}
            rx={badgeHeight / 2}
            fill="var(--color-ink)"
            fillOpacity={0.08}
            stroke="var(--color-ink)"
            strokeOpacity={0.25}
            strokeWidth={1}
          />
          {/* Up-arrow triangle */}
          <polygon
            points={`${triX},${triY + triangleSize / 2} ${triX + triangleSize},${triY + triangleSize / 2} ${triX + triangleSize / 2},${triY - triangleSize / 2}`}
            fill="var(--color-ink)"
          />
          <text
            x={triX + triangleSize + badgeInnerGap}
            y={triY}
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={deltaSize}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            {deltaText}
          </text>
        </g>
      </ExplainAnchor>

      {/* Inset sparkline group — includes the comparison baseline */}
      <Group left={sparkX} top={sparkY}>
        {/* Comparison baseline — the value the +12.3% is measured against */}
        <ExplainAnchor
          selector="comparison-baseline"
          index={5}
          pin={{ x: -10, y: yScale(baselineVal) }}
          rect={{
            x: -16,
            y: yScale(baselineVal) - 6,
            width: sparkW + 16,
            height: 12,
          }}
        >
          <line
            x1={0}
            x2={sparkW}
            y1={yScale(baselineVal)}
            y2={yScale(baselineVal)}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="1 3"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Inset sparkline */}
        <ExplainAnchor
          selector="inset-sparkline"
          index={4}
          pin={{ x: sparkW + 12, y: yScale(series[series.length - 1]) }}
          rect={{ x: -4, y: -4, width: sparkW + 8, height: sparkH + 8 }}
        >
          <g data-data-layer="true">
            <LinePath
              data={series.map((v, i) => ({ i, v }))}
              x={(d) => xScale(d.i)}
              y={(d) => yScale(d.v)}
              stroke="var(--color-ink)"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              curve={curveMonotoneX}
            />
            <circle
              cx={xScale(series.length - 1)}
              cy={yScale(series[series.length - 1])}
              r={2}
              fill="var(--color-ink)"
            />
          </g>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
