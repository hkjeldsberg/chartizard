"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Chrome usage share (percentage, hand-picked illustrative values) across ten
// geographic markets. One browser, ten regions — each rendered as a concentric
// arc with the same angular origin. Arc sweep encodes magnitude.
const DATA: ReadonlyArray<{ region: string; label: string; value: number }> = [
  { region: "IN", label: "India", value: 88 },
  { region: "BR", label: "Brazil", value: 82 },
  { region: "SA", label: "South America", value: 76 },
  { region: "NA", label: "North America", value: 70 },
  { region: "AU", label: "Australia", value: 65 },
  { region: "EU", label: "Europe", value: 60 },
  { region: "UK", label: "United Kingdom", value: 54 },
  { region: "DE", label: "Germany", value: 48 },
  { region: "KR", label: "South Korea", value: 42 },
  { region: "JP", label: "Japan", value: 36 },
];

// Angular span: start at 12 o'clock and sweep clockwise 270°, leaving the
// lower-left 90° quadrant open for the region labels.
const START_ANGLE = -Math.PI / 2; // 12 o'clock
const SWEEP = (3 * Math.PI) / 2; // 270° clockwise

function polar(cx: number, cy: number, r: number, angle: number): [number, number] {
  return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
}

// SVG path for a ring segment (thick arc) between two angles.
function arcPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  a0: number,
  a1: number,
): string {
  const [x0o, y0o] = polar(cx, cy, rOuter, a0);
  const [x1o, y1o] = polar(cx, cy, rOuter, a1);
  const [x1i, y1i] = polar(cx, cy, rInner, a1);
  const [x0i, y0i] = polar(cx, cy, rInner, a0);
  const sweep = a1 - a0;
  const largeArc = Math.abs(sweep) > Math.PI ? 1 : 0;
  const clockwise = sweep > 0 ? 1 : 0;
  return [
    `M ${x0o} ${y0o}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} ${clockwise} ${x1o} ${y1o}`,
    `L ${x1i} ${y1i}`,
    `A ${rInner} ${rInner} 0 ${largeArc} ${1 - clockwise} ${x0i} ${y0i}`,
    "Z",
  ].join(" ");
}

// A thin reference ring (open arc, no inner boundary needed — drawn as a
// stroked path from a0 to a1 at a single radius).
function openArcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const sweep = a1 - a0;
  const largeArc = Math.abs(sweep) > Math.PI ? 1 : 0;
  const clockwise = sweep > 0 ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${largeArc} ${clockwise} ${x1} ${y1}`;
}

interface Props {
  width: number;
  height: number;
}

export function RadialBarChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const cx = iw / 2;
  const cy = ih / 2;

  // Ring geometry — leave an inner hole and an outer margin for labels.
  const maxRadius = Math.max(0, Math.min(iw, ih) / 2 - 4);
  const innerHole = maxRadius * 0.22;
  const bandCount = DATA.length;
  const gap = 2;
  const usableRing = Math.max(0, maxRadius - innerHole);
  const ringThickness = Math.max(2, usableRing / bandCount - gap);

  // Radii ordered from innermost (largest value on outside) — we invert so the
  // longest arc sits on the outermost ring, matching bar-chart convention of
  // top-ranked = most prominent.
  const rings = DATA.map((_, i) => {
    // innermost index 0 → smallest radius
    const ringIndex = bandCount - 1 - i;
    const rInner = innerHole + ringIndex * (ringThickness + gap);
    const rOuter = rInner + ringThickness;
    return { rInner, rOuter };
  });

  const valueToAngle = (v: number) =>
    START_ANGLE + (Math.min(Math.max(v, 0), 100) / 100) * SWEEP;

  // Longest arc (top of rank) and shortest arc (bottom of rank).
  const topIndex = 0;
  const bottomIndex = DATA.length - 1;
  const topRing = rings[topIndex];
  const bottomRing = rings[bottomIndex];
  const topEndAngle = valueToAngle(DATA[topIndex].value);
  const bottomEndAngle = valueToAngle(DATA[bottomIndex].value);
  const [topTipX, topTipY] = polar(cx, cy, (topRing.rInner + topRing.rOuter) / 2, topEndAngle);
  const [bottomTipX, bottomTipY] = polar(
    cx,
    cy,
    (bottomRing.rInner + bottomRing.rOuter) / 2,
    bottomEndAngle,
  );

  // A representative category label — the middle ring's region code, placed
  // just inside the ring's starting edge at 12 o'clock.
  const midIndex = Math.floor(DATA.length / 2);
  const midRing = rings[midIndex];
  const labelRadius = (midRing.rInner + midRing.rOuter) / 2;

  // Reference ring (100% circle) — the outer boundary at the topmost band.
  const refRing = rings[topIndex];
  const refRadius = refRing.rOuter + 1;

  // Clamp helper so anchor rects stay inside the plot area.
  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(r.x, iw));
    const y = Math.max(0, Math.min(r.y, ih));
    const w = Math.max(0, Math.min(r.x + r.width, iw) - x);
    const h = Math.max(0, Math.min(r.y + r.height, ih) - y);
    return { x, y, width: w, height: h };
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Radial bar chart">
      <Group left={margin.left} top={margin.top}>
        {/* Background rings — the tracks each arc sits on */}
        <g data-data-layer="true">
          {rings.map((r, i) => (
            <path
              key={`track-${i}`}
              d={arcPath(cx, cy, r.rOuter, r.rInner, START_ANGLE, START_ANGLE + SWEEP)}
              fill="var(--color-hairline)"
              opacity={0.35}
            />
          ))}
        </g>

        {/* The bars — one arc per region */}
        <g data-data-layer="true">
          {DATA.map((d, i) => {
            const r = rings[i];
            const a1 = valueToAngle(d.value);
            return (
              <path
                key={d.region}
                d={arcPath(cx, cy, r.rOuter, r.rInner, START_ANGLE, a1)}
                fill="var(--color-ink)"
                opacity={i === topIndex ? 1 : 0.82 - i * 0.03}
              />
            );
          })}
        </g>

        {/* 100% reference ring — thin hairline at the outermost band */}
        <g data-data-layer="true">
          <path
            d={openArcPath(cx, cy, refRadius, START_ANGLE, START_ANGLE + SWEEP)}
            fill="none"
            stroke="var(--color-ink-mute)"
            strokeWidth={0.75}
            strokeDasharray="2 3"
          />
        </g>

        {/* Region code labels — placed along the open lower-left quadrant,
            radiating outward from each ring's starting edge at 12 o'clock. */}
        <g data-data-layer="true">
          {DATA.map((d, i) => {
            const r = rings[i];
            const labelR = (r.rInner + r.rOuter) / 2;
            // Labels sit just left of 12 o'clock, tucked against the vertical
            // spine so they don't collide with arcs.
            const [lx, ly] = polar(cx, cy, labelR, START_ANGLE - 0.02);
            return (
              <text
                key={`label-${d.region}`}
                x={lx - 6}
                y={ly}
                textAnchor="end"
                dominantBaseline="middle"
                fontFamily="var(--font-mono)"
                fontSize={8.5}
                fill="var(--color-ink-soft)"
              >
                {d.region}
              </text>
            );
          })}
        </g>

        {/* Anchor 1 — longest arc (top-ranked region) */}
        <ExplainAnchor
          selector="longest-arc"
          index={1}
          pin={{ x: topTipX + 12, y: topTipY + 4 }}
          rect={clampRect({
            x: cx - topRing.rOuter,
            y: cy - topRing.rOuter,
            width: topRing.rOuter * 2,
            height: topRing.rOuter * 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2 — shortest arc (bottom-ranked region) */}
        <ExplainAnchor
          selector="shortest-arc"
          index={2}
          pin={{ x: bottomTipX + 14, y: bottomTipY - 4 }}
          rect={clampRect({
            x: cx - bottomRing.rOuter,
            y: cy - bottomRing.rOuter,
            width: bottomRing.rOuter * 2,
            height: bottomRing.rOuter * 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — angular origin (12 o'clock, 0% mark) */}
        <ExplainAnchor
          selector="angular-origin"
          index={3}
          pin={{ x: cx, y: cy - maxRadius - 6 }}
          rect={clampRect({
            x: cx - 8,
            y: cy - maxRadius - 4,
            width: 16,
            height: maxRadius - innerHole + 8,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4 — category label (middle ring's region code) */}
        <ExplainAnchor
          selector="category-label"
          index={4}
          pin={{ x: cx - labelRadius - 22, y: cy - labelRadius / 2 }}
          rect={clampRect({
            x: cx - labelRadius - 24,
            y: cy - labelRadius - 4,
            width: 28,
            height: labelRadius * 2 + 8,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — arc-length encoding (a mid-rank bar, showing the rule) */}
        <ExplainAnchor
          selector="arc-length"
          index={5}
          pin={{
            x: polar(cx, cy, labelRadius, START_ANGLE + SWEEP * 0.5)[0] + 18,
            y: polar(cx, cy, labelRadius, START_ANGLE + SWEEP * 0.5)[1] - 10,
          }}
          rect={clampRect({
            x: cx + 4,
            y: cy - midRing.rOuter - 4,
            width: midRing.rOuter + 8,
            height: midRing.rOuter * 2 + 8,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6 — 100% reference ring */}
        <ExplainAnchor
          selector="reference-ring"
          index={6}
          pin={{ x: cx + refRadius + 4, y: cy - 16 }}
          rect={clampRect({
            x: cx - refRadius - 4,
            y: cy - refRadius - 4,
            width: (refRadius + 4) * 2,
            height: refRadius + 8,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
