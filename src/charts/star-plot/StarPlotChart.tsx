"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Single wine's tasting profile — seven axes, each scored 0–10. One entity,
// many dimensions: the Kiviat use case.
const AXES = [
  "Sweetness",
  "Acidity",
  "Tannin",
  "Body",
  "Finish",
  "Fruit",
  "Oak",
] as const;
type Axis = (typeof AXES)[number];

const VALUES: Record<Axis, number> = {
  Sweetness: 3,
  Acidity: 7,
  Tannin: 8,
  Body: 9,
  Finish: 8,
  Fruit: 6,
  Oak: 7,
};

const MAX_VALUE = 10;

interface Props {
  width: number;
  height: number;
}

export function StarPlotChart({ width, height }: Props) {
  // Square-ish layout with room for axis labels around the rim.
  const margin = { top: 20, right: 20, bottom: 24, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const cx = iw / 2;
  const cy = ih / 2;
  // Reserve radial padding for axis labels.
  const maxRadius = Math.max(0, Math.min(iw, ih) / 2 - 22);

  const rScale = scaleLinear({ domain: [0, MAX_VALUE], range: [0, maxRadius] });

  // Angles — seven axes, first axis at 12 o'clock (offset -90°).
  const angle = (i: number) =>
    -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;

  const pointAt = (i: number, value: number) => {
    const r = rScale(value);
    return { x: cx + r * Math.cos(angle(i)), y: cy + r * Math.sin(angle(i)) };
  };

  const axisEndpoint = (i: number) => pointAt(i, MAX_VALUE);

  const ringLevels = [2.5, 5, 7.5, 10];

  const polylinePoints = AXES.map((a, i) => {
    const p = pointAt(i, VALUES[a]);
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  }).join(" ");

  const ringPoints = (level: number) =>
    AXES.map((_, i) => {
      const p = pointAt(i, level);
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    }).join(" ");

  // Label nudged outward so it clears the outer ring.
  const labelFor = (i: number) => {
    const base = pointAt(i, MAX_VALUE);
    const dx = Math.cos(angle(i));
    const dy = Math.sin(angle(i));
    return { x: base.x + dx * 14, y: base.y + dy * 14 };
  };

  // Anchor exemplars:
  // - "axis" — the Sweetness axis (index 0, 12 o'clock)
  const sweetnessLabel = labelFor(0);
  // - "value-mark" — the Body vertex (index 3, largest value)
  const bodyVertex = pointAt(3, VALUES.Body);
  // - "tick-grid" — the 5 ring (the middle ring)
  // - "polyline" — the full shape
  // - "origin" — centre of the plot

  // Clamp helper so anchor rects stay inside the plot area.
  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(r.x, iw));
    const y = Math.max(0, Math.min(r.y, ih));
    const w = Math.max(0, Math.min(r.x + r.width, iw) - x);
    const h = Math.max(0, Math.min(r.y + r.height, ih) - y);
    return { x, y, width: w, height: h };
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Star plot / Kiviat diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Concentric rings — the tick grid */}
        <g data-data-layer="true">
          {ringLevels.map((lvl) => (
            <polygon
              key={lvl}
              points={ringPoints(lvl)}
              fill="none"
              stroke="var(--color-hairline)"
              strokeWidth={lvl === MAX_VALUE ? 1 : 0.75}
            />
          ))}
          {/* Radial spokes — one per axis */}
          {AXES.map((_, i) => {
            const end = axisEndpoint(i);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={end.x}
                y2={end.y}
                stroke="var(--color-hairline)"
                strokeWidth={0.75}
              />
            );
          })}
        </g>

        {/* The profile polyline — one closed shape connecting the seven values */}
        <g data-data-layer="true">
          <polygon
            points={polylinePoints}
            fill="rgba(26,22,20,0.18)"
            stroke="var(--color-ink)"
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          {/* Vertex dots at each axis value */}
          {AXES.map((a, i) => {
            const p = pointAt(i, VALUES[a]);
            return (
              <circle
                key={a}
                cx={p.x}
                cy={p.y}
                r={2.4}
                fill="var(--color-ink)"
              />
            );
          })}
        </g>

        {/* Centre mark (zero origin) */}
        <g data-data-layer="true">
          <circle
            cx={cx}
            cy={cy}
            r={2}
            fill="var(--color-ink-mute)"
          />
        </g>

        {/* Axis labels — uppercase mono tags at each axis endpoint */}
        <g data-data-layer="true">
          {AXES.map((a, i) => {
            const l = labelFor(i);
            const anchor =
              Math.abs(l.x - cx) < 2
                ? "middle"
                : l.x > cx
                ? "start"
                : "end";
            return (
              <text
                key={a}
                x={l.x}
                y={l.y}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontFamily="var(--font-mono)"
                fontSize={9.5}
                fill="var(--color-ink-soft)"
              >
                {a.toUpperCase()}
              </text>
            );
          })}
        </g>

        {/* Anchor 1 — a single axis (Sweetness, 12 o'clock) */}
        <ExplainAnchor
          selector="axis"
          index={1}
          pin={{ x: sweetnessLabel.x + 16, y: sweetnessLabel.y - 10 }}
          rect={clampRect({
            x: cx - 8,
            y: cy - maxRadius - 4,
            width: 16,
            height: maxRadius + 8,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2 — tick grid (the 5 ring) */}
        <ExplainAnchor
          selector="tick-grid"
          index={2}
          pin={{
            x: cx + rScale(5) * Math.cos(angle(1)) + 12,
            y: cy + rScale(5) * Math.sin(angle(1)) - 10,
          }}
          rect={clampRect({
            x: cx - rScale(5),
            y: cy - rScale(5),
            width: rScale(5) * 2,
            height: rScale(5) * 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — the polyline (the whole profile shape) */}
        <ExplainAnchor
          selector="polyline"
          index={3}
          pin={{ x: cx - maxRadius + 6, y: cy + 8 }}
          rect={clampRect({
            x: cx - maxRadius,
            y: cy - maxRadius,
            width: maxRadius * 2,
            height: maxRadius * 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4 — a single value mark (Body vertex, the strongest score) */}
        <ExplainAnchor
          selector="value-mark"
          index={4}
          pin={{ x: bodyVertex.x + 16, y: bodyVertex.y + 4 }}
          rect={clampRect({
            x: bodyVertex.x - 9,
            y: bodyVertex.y - 9,
            width: 18,
            height: 18,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — the centre origin (zero) */}
        <ExplainAnchor
          selector="origin"
          index={5}
          pin={{ x: cx + 18, y: cy + 14 }}
          rect={clampRect({
            x: cx - 10,
            y: cy - 10,
            width: 20,
            height: 20,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
