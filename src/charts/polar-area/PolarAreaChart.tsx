"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Hours per week spent on 8 activity categories for a representative
// knowledge-worker week (168h total). Values are hand-picked and illustrative,
// not drawn from a specific survey — the point of the chart is the shape.
const DATA: ReadonlyArray<{ category: string; hours: number }> = [
  { category: "Sleep",       hours: 56 },
  { category: "Work",        hours: 45 },
  { category: "Media",       hours: 18 },
  { category: "Meals",       hours: 12 },
  { category: "Socialising", hours: 10 },
  { category: "Commute",     hours: 7 },
  { category: "Exercise",    hours: 5 },
  { category: "Other",       hours: 15 },
];

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

interface Props {
  width: number;
  height: number;
}

export function PolarAreaChart({ width, height }: Props) {
  const margin = { top: 18, right: 16, bottom: 18, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const cx = iw / 2;
  const cy = ih / 2;
  const maxRadius = Math.max(0, Math.min(iw, ih) / 2 - 26);

  const maxHours = Math.max(...DATA.map((d) => d.hours));
  // Nice upper bound to the nearest 10.
  const rDomainMax = Math.ceil(maxHours / 10) * 10;
  const rScale = scaleLinear({ domain: [0, rDomainMax], range: [0, maxRadius] });

  const n = DATA.length; // 8
  const wedgeAngle = (2 * Math.PI) / n; // 45°
  // Wedge 0 (Sleep) is centred at 12 o'clock; angles increase clockwise.
  const centreAngle = (i: number) => -Math.PI / 2 + i * wedgeAngle;

  // Solid wedge from hub out to r at angle span [a0, a1].
  const wedgePath = (r: number, a0: number, a1: number) => {
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const largeArc = a1 - a0 <= Math.PI ? 0 : 1;
    return [
      `M${cx.toFixed(2)} ${cy.toFixed(2)}`,
      `L${x0.toFixed(2)} ${y0.toFixed(2)}`,
      `A${r.toFixed(2)} ${r.toFixed(2)} 0 ${largeArc} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`,
      "Z",
    ].join(" ");
  };

  const ringLevels = rScale.ticks(3).filter((v) => v > 0 && v <= rDomainMax);

  // Label positions just outside the outer ring, along each wedge's centre.
  const labelR = maxRadius + 12;
  const labelPos = (i: number) => {
    const a = centreAngle(i);
    return { x: cx + labelR * Math.cos(a), y: cy + labelR * Math.sin(a) };
  };

  // Anchors: use the largest wedge (Sleep) + a mid wedge (Media) for contrast.
  const largeIdx = DATA.findIndex((d) => d.hours === maxHours);
  const largeA = centreAngle(largeIdx);
  const largeTipR = rScale(DATA[largeIdx].hours);
  const largeTip = {
    x: cx + largeTipR * Math.cos(largeA),
    y: cy + largeTipR * Math.sin(largeA),
  };

  // "Media" wedge — mid-sized, used to anchor "equal-angle wedges" point.
  const mediaIdx = DATA.findIndex((d) => d.category === "Media");
  const mediaA = centreAngle(mediaIdx);
  const mediaMidR = rScale(DATA[mediaIdx].hours) * 0.55;
  const mediaMid = {
    x: cx + mediaMidR * Math.cos(mediaA),
    y: cy + mediaMidR * Math.sin(mediaA),
  };

  // Outer-ring anchor point (top-right-ish) for the radial-scale explanation.
  const outerRingR = ringLevels[ringLevels.length - 1] ?? rDomainMax;
  const scaleA = centreAngle(1); // 45° clockwise from top
  const scaleRingPoint = {
    x: cx + rScale(outerRingR) * Math.cos(scaleA),
    y: cy + rScale(outerRingR) * Math.sin(scaleA),
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Polar area diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Concentric value rings + radial spokes */}
        <g data-data-layer="true">
          {ringLevels.map((lvl) => (
            <circle
              key={`ring-${lvl}`}
              cx={cx}
              cy={cy}
              r={rScale(lvl)}
              fill="none"
              stroke="var(--color-hairline)"
              strokeWidth={0.75}
            />
          ))}
          <circle
            cx={cx}
            cy={cy}
            r={maxRadius}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
          {DATA.map((_, i) => {
            const a = centreAngle(i) - wedgeAngle / 2;
            return (
              <line
                key={`spoke-${i}`}
                x1={cx}
                y1={cy}
                x2={cx + maxRadius * Math.cos(a)}
                y2={cy + maxRadius * Math.sin(a)}
                stroke="var(--color-hairline)"
                strokeWidth={0.5}
              />
            );
          })}
          {ringLevels.map((lvl) => (
            <text
              key={`ring-label-${lvl}`}
              x={cx + rScale(lvl) + 2}
              y={cy - 2}
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-soft)"
            >
              {lvl}h
            </text>
          ))}
        </g>

        {/* Wedges — one per category, radius encodes hours */}
        <g data-data-layer="true">
          {DATA.map((d, i) => {
            const ac = centreAngle(i);
            const a0 = ac - wedgeAngle / 2;
            const a1 = ac + wedgeAngle / 2;
            const r = rScale(d.hours);
            // Light opacity ramp so the largest wedge reads as heaviest.
            const opacity = 0.35 + (d.hours / rDomainMax) * 0.5;
            return (
              <path
                key={`w-${d.category}`}
                d={wedgePath(r, a0, a1)}
                fill="var(--color-ink)"
                fillOpacity={opacity.toFixed(3)}
                stroke="var(--color-page)"
                strokeWidth={0.6}
              />
            );
          })}
        </g>

        {/* Category labels */}
        <g data-data-layer="true">
          {DATA.map((d, i) => {
            const p = labelPos(i);
            const anchor =
              Math.abs(p.x - cx) < 2
                ? "middle"
                : p.x > cx
                ? "start"
                : "end";
            return (
              <text
                key={`lbl-${d.category}`}
                x={p.x}
                y={p.y}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
              >
                {d.category.toUpperCase()}
              </text>
            );
          })}
        </g>

        {/* Anchor: the largest wedge (Sleep) */}
        <ExplainAnchor
          selector="wedge"
          index={1}
          pin={{
            x: clamp(largeTip.x + 14, 10, iw - 10),
            y: clamp(largeTip.y - 14, 10, ih - 10),
          }}
          rect={{
            x: clamp(cx - 14, 0, iw),
            y: clamp(largeTip.y - 6, 0, ih),
            width: 28,
            height: Math.max(18, cy - largeTip.y + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor: the equal-angle spokes (angular axis) */}
        <ExplainAnchor
          selector="angular-axis"
          index={2}
          pin={{
            x: clamp(mediaMid.x + 18, 10, iw - 10),
            y: clamp(mediaMid.y, 10, ih - 10),
          }}
          rect={{
            x: clamp(cx - maxRadius, 0, iw),
            y: clamp(cy - maxRadius, 0, ih),
            width: maxRadius * 2,
            height: maxRadius * 2,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor: the radial scale (hours) */}
        <ExplainAnchor
          selector="radius-scale"
          index={3}
          pin={{
            x: clamp(scaleRingPoint.x + 14, 10, iw - 10),
            y: clamp(scaleRingPoint.y - 10, 10, ih - 10),
          }}
          rect={{
            x: clamp(cx, 0, iw),
            y: clamp(cy - 10, 0, ih),
            width: Math.max(14, maxRadius + 4),
            height: 14,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor: a category label (one representative — Sleep) */}
        <ExplainAnchor
          selector="category-label"
          index={4}
          pin={{
            x: clamp(labelPos(largeIdx).x, 10, iw - 10),
            y: clamp(labelPos(largeIdx).y - 12, 10, ih - 10),
          }}
          rect={{
            x: clamp(labelPos(largeIdx).x - 28, 0, iw),
            y: clamp(labelPos(largeIdx).y - 8, 0, ih),
            width: 56,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor: the centre / hub — where every wedge starts */}
        <ExplainAnchor
          selector="hub"
          index={5}
          pin={{
            x: clamp(cx - 24, 10, iw - 10),
            y: clamp(cy + 20, 10, ih - 10),
          }}
          rect={{
            x: clamp(cx - 10, 0, iw),
            y: clamp(cy - 10, 0, ih),
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
