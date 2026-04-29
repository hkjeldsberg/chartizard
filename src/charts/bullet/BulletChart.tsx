"use client";

import { Group } from "@visx/group";
import { AxisBottom } from "@visx/axis";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Annual revenue KPI, in millions of dollars.
// Stephen Few's canonical bullet-chart specification: actual measure, target,
// and three qualitative ranges (poor / fair / good).
const ACTUAL = 1.15; // measure
const TARGET = 1.0; // tick goal
const DOMAIN_MAX = 1.4;
const BANDS: ReadonlyArray<{ key: "poor" | "fair" | "good"; max: number; opacity: number }> = [
  { key: "poor", max: 0.7, opacity: 0.32 },
  { key: "fair", max: 0.9, opacity: 0.2 },
  { key: "good", max: 1.2, opacity: 0.1 },
];

export function BulletChart({ width, height }: Props) {
  const margin = { top: 40, right: 24, bottom: 44, left: 80 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear<number>({
    domain: [0, DOMAIN_MAX],
    range: [0, iw],
  });

  // Strip geometry: the strip sits centred vertically in the plot area.
  const stripHeight = Math.min(30, Math.max(18, ih * 0.5));
  const stripTop = (ih - stripHeight) / 2;
  const stripBottom = stripTop + stripHeight;

  // Inner measure bar — 40% of strip height, vertically centred.
  const measureHeight = stripHeight * 0.4;
  const measureTop = stripTop + (stripHeight - measureHeight) / 2;
  const measureX = xScale(ACTUAL);
  const targetX = xScale(TARGET);

  // Band rects, nested from left (poor) to right (good end of qualitative scale).
  const bandRects = BANDS.map((b, i) => {
    const prev = i === 0 ? 0 : BANDS[i - 1].max;
    return {
      key: b.key,
      x: xScale(prev),
      width: Math.max(0, xScale(b.max) - xScale(prev)),
      opacity: b.opacity,
    };
  });

  // Target anchor for "qualitative-band" — the middle one (fair).
  const fair = bandRects[1];

  const ticksX = xScale.ticks(5);

  return (
    <svg width={width} height={height} role="img" aria-label="Bullet chart">
      <Group left={margin.left} top={margin.top}>
        {/* Label — the KPI name, sitting to the left of the strip in the margin */}
        <text
          x={-8}
          y={stripTop + stripHeight / 2}
          textAnchor="end"
          dominantBaseline="central"
          fontFamily="var(--font-mono)"
          fontSize={11}
          fill="var(--color-ink)"
        >
          REVENUE
        </text>
        <text
          x={-8}
          y={stripTop + stripHeight / 2 + 13}
          textAnchor="end"
          dominantBaseline="central"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-soft)"
        >
          $M / FY24
        </text>

        {/* Qualitative bands — poor / fair / good (lightest at the high end) */}
        <g data-data-layer="true">
          {bandRects.map((b) => (
            <rect
              key={b.key}
              x={b.x}
              y={stripTop}
              width={b.width}
              height={stripHeight}
              fill="var(--color-ink)"
              fillOpacity={b.opacity}
            />
          ))}
        </g>

        {/* Measure — the dark inner bar showing actual value */}
        <g data-data-layer="true">
          <rect
            x={0}
            y={measureTop}
            width={Math.max(0, measureX)}
            height={measureHeight}
            fill="var(--color-ink)"
          />
        </g>

        {/* Target — thick vertical tick at the goal */}
        <g data-data-layer="true">
          <line
            x1={targetX}
            x2={targetX}
            y1={stripTop - 3}
            y2={stripBottom + 3}
            stroke="var(--color-ink)"
            strokeWidth={2.5}
          />
        </g>

        {/* Anchor 1: measure — the dark inner bar */}
        <ExplainAnchor
          selector="measure"
          index={1}
          pin={{ x: Math.min(iw - 10, measureX - 16), y: measureTop - 12 }}
          rect={{
            x: 0,
            y: Math.max(0, measureTop),
            width: Math.max(0, measureX),
            height: measureHeight,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: target — the tick mark at the goal */}
        <ExplainAnchor
          selector="target"
          index={2}
          pin={{ x: targetX, y: Math.max(10, stripTop - 14) }}
          rect={{
            x: Math.max(0, targetX - 5),
            y: Math.max(0, stripTop - 3),
            width: 10,
            height: stripHeight + 6,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: qualitative-band — the middle (fair) range */}
        <ExplainAnchor
          selector="qualitative-band"
          index={3}
          pin={{ x: fair.x + fair.width / 2, y: stripBottom + 14 }}
          rect={{
            x: fair.x,
            y: stripTop,
            width: fair.width,
            height: stripHeight,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: label — the KPI name in the margin */}
        <ExplainAnchor
          selector="label"
          index={4}
          pin={{ x: -margin.left / 2, y: stripTop - 16 }}
          rect={{
            x: -margin.left,
            y: stripTop - 8,
            width: margin.left - 4,
            height: stripHeight + 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: comparison-lens — concept anchor, sits above the strip */}
        <ExplainAnchor
          selector="comparison-lens"
          index={5}
          pin={{ x: iw / 2, y: Math.max(8, stripTop - 22) }}
          rect={{
            x: 0,
            y: 0,
            width: iw,
            height: Math.max(0, stripTop - 6),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6: value-axis — x-axis scale below the strip */}
        <ExplainAnchor
          selector="value-axis"
          index={6}
          pin={{ x: iw / 2, y: ih + 24 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={ticksX.length}
            tickFormat={(v) => `$${Number(v).toFixed(1)}M`}
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
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
