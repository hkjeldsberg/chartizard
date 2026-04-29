"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface SubCategory {
  label: string;
  share: number; // share of the parent category (not the whole)
}

interface Category {
  label: string;
  share: number; // share of the whole (percent)
  colour: string;
  children: ReadonlyArray<SubCategory>;
}

// FY2025 Q1 operating-expense breakdown for a mid-stage SaaS company — the
// prototypical two-level composition that fills a doughnut-multi-level. The
// inner ring is the four top-level cost buckets; the outer ring subdivides
// each. Values are percentages of total opex; the centre carries the dollar
// total so the viewer reads both structure and magnitude in one glance.
const DATA: ReadonlyArray<Category> = [
  {
    label: "Personnel",
    share: 60,
    colour: "var(--color-ink)",
    children: [
      { label: "Salaries", share: 75 },
      { label: "Benefits", share: 17 },
      { label: "Training", share: 8 },
    ],
  },
  {
    label: "Facilities",
    share: 18,
    colour: "#8a7a52",
    children: [
      { label: "Rent", share: 67 },
      { label: "Utilities", share: 22 },
      { label: "Maint.", share: 11 },
    ],
  },
  {
    label: "Operations",
    share: 14,
    colour: "#4a6a68",
    children: [
      { label: "Cloud", share: 50 },
      { label: "Tools", share: 29 },
      { label: "Travel", share: 21 },
    ],
  },
  {
    label: "R&D",
    share: 8,
    colour: "#b59b6b",
    children: [
      { label: "Research", share: 62 },
      { label: "Prototyping", share: 38 },
    ],
  },
];

const TOTAL_DOLLARS = "$24.3M";

interface Props {
  width: number;
  height: number;
}

// Ring-segment path: a filled annular wedge between (innerR, outerR) swept
// between startA and endA. Angles measured from 12 o'clock, clockwise.
function ringPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startA: number,
  endA: number,
): string {
  const x1o = cx + outerR * Math.sin(startA);
  const y1o = cy - outerR * Math.cos(startA);
  const x2o = cx + outerR * Math.sin(endA);
  const y2o = cy - outerR * Math.cos(endA);
  const x1i = cx + innerR * Math.sin(endA);
  const y1i = cy - innerR * Math.cos(endA);
  const x2i = cx + innerR * Math.sin(startA);
  const y2i = cy - innerR * Math.cos(startA);
  const large = endA - startA > Math.PI ? 1 : 0;
  return (
    `M${x1o} ${y1o} ` +
    `A${outerR} ${outerR} 0 ${large} 1 ${x2o} ${y2o} ` +
    `L${x1i} ${y1i} ` +
    `A${innerR} ${innerR} 0 ${large} 0 ${x2i} ${y2i} Z`
  );
}

export function DoughnutMultiLevel({ width, height }: Props) {
  const size = Math.min(width, height);
  const outerR = size / 2 - 14;
  const ringMid = outerR * 0.68; // boundary between inner and outer rings
  const innerR = outerR * 0.34; // hole radius
  const cx = width / 2;
  const cy = height / 2;

  // Precompute inner-ring (top-level) arcs.
  let cumTop = 0;
  const innerArcs = DATA.map((c, i) => {
    const frac = c.share / 100;
    const startA = cumTop * 2 * Math.PI;
    const endA = (cumTop + frac) * 2 * Math.PI;
    const midA = (startA + endA) / 2;
    cumTop += frac;
    return { ...c, index: i, frac, startA, endA, midA };
  });

  // Precompute outer-ring (sub-category) arcs — each parent's children fill
  // that parent's angular sweep, proportional to child.share.
  const outerArcs: Array<{
    parentIndex: number;
    parentLabel: string;
    label: string;
    share: number;
    colour: string;
    startA: number;
    endA: number;
    midA: number;
    sweep: number;
  }> = [];
  for (const parent of innerArcs) {
    const sweep = parent.endA - parent.startA;
    let cumChild = 0;
    const childTotal = parent.children.reduce((s, c) => s + c.share, 0);
    for (const child of parent.children) {
      const frac = child.share / childTotal;
      const startA = parent.startA + cumChild * sweep;
      const endA = parent.startA + (cumChild + frac) * sweep;
      cumChild += frac;
      outerArcs.push({
        parentIndex: parent.index,
        parentLabel: parent.label,
        label: child.label,
        share: child.share,
        colour: parent.colour,
        startA,
        endA,
        midA: (startA + endA) / 2,
        sweep: endA - startA,
      });
    }
  }

  // Anchor centroid helpers.
  const personnelInner = innerArcs[0];
  const personnelInnerCentroid = {
    x: cx + Math.sin(personnelInner.midA) * ((ringMid + innerR) / 2),
    y: cy - Math.cos(personnelInner.midA) * ((ringMid + innerR) / 2),
  };

  const salariesOuter = outerArcs.find((a) => a.label === "Salaries");
  const salariesCentroid = salariesOuter
    ? {
        x: cx + Math.sin(salariesOuter.midA) * ((outerR + ringMid) / 2),
        y: cy - Math.cos(salariesOuter.midA) * ((outerR + ringMid) / 2),
      }
    : { x: cx, y: cy };

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Multi-level doughnut chart"
    >
      <Group>
        {/* Inner ring — top-level categories */}
        <g data-data-layer="true">
          {innerArcs.map((a) => (
            <path
              key={a.label}
              d={ringPath(cx, cy, innerR, ringMid, a.startA, a.endA)}
              fill={a.colour}
              stroke="var(--color-surface)"
              strokeWidth={1.5}
            />
          ))}
        </g>

        {/* Outer ring — sub-categories, tinted from parent at lower opacity
            so the two-level hierarchy reads from centre outward */}
        <g data-data-layer="true">
          {outerArcs.map((a) => (
            <path
              key={`${a.parentLabel}-${a.label}`}
              d={ringPath(cx, cy, ringMid + 1, outerR, a.startA, a.endA)}
              fill={a.colour}
              fillOpacity={0.5}
              stroke="var(--color-surface)"
              strokeWidth={1}
            />
          ))}
        </g>

        {/* Inner-ring labels — only the wider sweeps fit legibly */}
        <g data-data-layer="true">
          {innerArcs.map((a) => {
            if (a.frac < 0.1) return null;
            const lx = cx + Math.sin(a.midA) * ((innerR + ringMid) / 2);
            const ly = cy - Math.cos(a.midA) * ((innerR + ringMid) / 2);
            return (
              <text
                key={`ilbl-${a.label}`}
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fontWeight={500}
                fill={a.index === 0 ? "var(--color-page)" : "var(--color-ink)"}
              >
                {a.share}%
              </text>
            );
          })}
        </g>

        {/* Outer-ring labels — only where the sub-wedge is wide enough */}
        <g data-data-layer="true">
          {outerArcs.map((a) => {
            if (a.sweep < 0.22) return null;
            const lx = cx + Math.sin(a.midA) * ((ringMid + outerR) / 2);
            const ly = cy - Math.cos(a.midA) * ((ringMid + outerR) / 2);
            return (
              <text
                key={`olbl-${a.parentLabel}-${a.label}`}
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={8}
                fill="var(--color-ink)"
              >
                {a.label}
              </text>
            );
          })}
        </g>

        {/* Centre — total KPI. The HOLE is what distinguishes this chart
            from sunburst; the centre is always a display surface. */}
        <g data-data-layer="true">
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={16}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            {TOTAL_DOLLARS}
          </text>
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            OPEX · Q1 FY25
          </text>
        </g>
      </Group>

      {/* Anchors */}
      {/* 1. Inner ring — top-level categories */}
      <ExplainAnchor
        selector="inner-ring"
        index={1}
        pin={{
          x: personnelInnerCentroid.x - 6,
          y: personnelInnerCentroid.y - 6,
        }}
        rect={{
          x: cx - ringMid,
          y: cy - ringMid,
          width: ringMid * 2,
          height: ringMid * 2,
        }}
      >
        <g />
      </ExplainAnchor>

      {/* 2. Outer ring — sub-categories */}
      <ExplainAnchor
        selector="outer-ring"
        index={2}
        pin={{ x: salariesCentroid.x, y: salariesCentroid.y }}
        rect={{
          x: cx - outerR,
          y: cy - outerR,
          width: outerR * 2,
          height: outerR - ringMid,
        }}
      >
        <g />
      </ExplainAnchor>

      {/* 3. Hole / centre KPI — the differentiator from sunburst */}
      <ExplainAnchor
        selector="centre-hole"
        index={3}
        pin={{ x: cx - innerR - 8, y: cy + innerR + 2 }}
        rect={{
          x: cx - innerR,
          y: cy - innerR,
          width: innerR * 2,
          height: innerR * 2,
        }}
      >
        <g />
      </ExplainAnchor>

      {/* 4. Ring alignment — the angular relationship between a parent arc
          and its children; this is the hierarchy's core mechanic */}
      <ExplainAnchor
        selector="ring-alignment"
        index={4}
        pin={{ x: cx + outerR + 8, y: cy - 4 }}
        rect={{
          x: cx + innerR,
          y: cy - 6,
          width: outerR - innerR,
          height: 12,
        }}
      >
        <g />
      </ExplainAnchor>

      {/* 5. Parent-child colour — sub-category colour is the parent's tint at
          reduced opacity; the only encoding channel carrying hierarchy */}
      <ExplainAnchor
        selector="parent-child-colour"
        index={5}
        pin={{
          x: cx + Math.sin(personnelInner.midA) * outerR + 4,
          y: cy - Math.cos(personnelInner.midA) * outerR - 8,
        }}
        rect={{
          x: cx + Math.sin(personnelInner.midA) * ringMid - 18,
          y: cy - Math.cos(personnelInner.midA) * ringMid - 18,
          width: 36,
          height: 36,
        }}
      >
        <g />
      </ExplainAnchor>
    </svg>
  );
}
