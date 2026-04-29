"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface PrimarySlice {
  label: string;
  share: number; // % of primary total
  breakout?: boolean; // true = this slice is the one exploded into the secondary pie
}

interface SecondarySlice {
  label: string;
  share: number; // % of secondary total (i.e. shares that sum to the primary "Other" slice)
}

// Global smartphone OEM market share, 2024 Q4 (approx., IDC + Counterpoint blend).
// Primary pie holds the named OEMs; the "Other" slice is exploded into the
// secondary pie so the long-tail vendors are legible instead of crammed into
// a 14% wedge on the main pie.
const PRIMARY: ReadonlyArray<PrimarySlice> = [
  { label: "iPhone", share: 48 },
  { label: "Samsung", share: 18 },
  { label: "Xiaomi", share: 12 },
  { label: "Oppo", share: 8 },
  { label: "Other", share: 14, breakout: true },
];

// The "Other" slice resolved: each vendor's % of the OTHER total (not the
// overall total). 4%/14% of the primary, etc.
const SECONDARY: ReadonlyArray<SecondarySlice> = [
  { label: "Vivo", share: 29 }, // 4/14
  { label: "Huawei", share: 21 }, // 3/14
  { label: "Pixel", share: 14 }, // 2/14
  { label: "OnePlus", share: 14 }, // 2/14
  { label: "Realme", share: 7 }, // 1/14
  { label: "Transsion", share: 7 }, // 1/14
  { label: "Rest", share: 7 }, // 1/14
];

// Monochrome-with-accent palette aligned with existing pie/donut charts.
const PRIMARY_COLOURS = [
  "var(--color-ink)",
  "#8a7a52",
  "#4a6a68",
  "#b59b6b",
  "#c9c4b8", // the "Other" slice — intentionally neutral so the secondary pie reads as the detail
];

const SECONDARY_COLOURS = [
  "#8a7a52",
  "#4a6a68",
  "#b59b6b",
  "#6a6a62",
  "#a8a8a0",
  "#c9c4b8",
  "#d8d4c8",
];

interface Props {
  width: number;
  height: number;
}

// Build an SVG arc path for a full-pie slice (no inner radius) given angles
// measured from 12 o'clock, clockwise.
function slicePath(
  cx: number,
  cy: number,
  r: number,
  startA: number,
  endA: number,
): string {
  const x1 = cx + r * Math.sin(startA);
  const y1 = cy - r * Math.cos(startA);
  const x2 = cx + r * Math.sin(endA);
  const y2 = cy - r * Math.cos(endA);
  const large = endA - startA > Math.PI ? 1 : 0;
  return `M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}

export function PieOfPieChart({ width, height }: Props) {
  // Two pies side by side. Give the primary slightly more room since it
  // holds the first-order story; the secondary pie is the zoom.
  const pad = 12;
  const gap = 40; // space for the connecting break-out lines
  const available = Math.max(0, width - gap - pad * 2);
  const primaryRadius = Math.min(height / 2 - 14, (available * 0.52) / 2);
  const secondaryRadius = Math.min(height / 2 - 18, (available * 0.42) / 2);

  const primaryCx = pad + primaryRadius;
  const primaryCy = height / 2;
  const secondaryCx = width - pad - secondaryRadius;
  const secondaryCy = height / 2;

  // Precompute primary angles (from 12 o'clock, clockwise).
  let cumP = 0;
  const primaryArcs = PRIMARY.map((s, i) => {
    const frac = s.share / 100;
    const startA = cumP * 2 * Math.PI;
    const endA = (cumP + frac) * 2 * Math.PI;
    const midA = (startA + endA) / 2;
    cumP += frac;
    return { ...s, index: i, frac, startA, endA, midA };
  });

  // Precompute secondary angles.
  const secondaryTotal = SECONDARY.reduce((sum, s) => sum + s.share, 0);
  let cumS = 0;
  const secondaryArcs = SECONDARY.map((s, i) => {
    const frac = s.share / secondaryTotal;
    const startA = cumS * 2 * Math.PI;
    const endA = (cumS + frac) * 2 * Math.PI;
    const midA = (startA + endA) / 2;
    cumS += frac;
    return { ...s, index: i, frac, startA, endA, midA };
  });

  // The "Other" slice in the primary — we draw two connector lines from its
  // edges to the top and bottom of the secondary pie.
  const otherArc = primaryArcs.find((a) => a.breakout);
  const connector = otherArc
    ? {
        // start-edge point on primary pie
        x1: primaryCx + primaryRadius * Math.sin(otherArc.startA),
        y1: primaryCy - primaryRadius * Math.cos(otherArc.startA),
        // end-edge point on primary pie
        x2: primaryCx + primaryRadius * Math.sin(otherArc.endA),
        y2: primaryCy - primaryRadius * Math.cos(otherArc.endA),
        // secondary pie: top and bottom
        sxTop: secondaryCx,
        syTop: secondaryCy - secondaryRadius,
        sxBot: secondaryCx,
        syBot: secondaryCy + secondaryRadius,
      }
    : null;

  // Anchor helpers — centroids for each pin, relative to absolute SVG coords.
  const otherCentroid = otherArc
    ? {
        x: primaryCx + Math.sin(otherArc.midA) * primaryRadius * 0.55,
        y: primaryCy - Math.cos(otherArc.midA) * primaryRadius * 0.55,
      }
    : { x: primaryCx, y: primaryCy };

  const iphoneArc = primaryArcs[0];
  const iphoneCentroid = {
    x: primaryCx + Math.sin(iphoneArc.midA) * primaryRadius * 0.55,
    y: primaryCy - Math.cos(iphoneArc.midA) * primaryRadius * 0.55,
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Pie-of-pie chart">
      {/* Primary pie */}
      <Group>
        <g data-data-layer="true">
          {primaryArcs.map((a) => (
            <path
              key={a.label}
              d={slicePath(primaryCx, primaryCy, primaryRadius, a.startA, a.endA)}
              fill={PRIMARY_COLOURS[a.index % PRIMARY_COLOURS.length]}
              stroke="var(--color-surface)"
              strokeWidth={1.5}
            />
          ))}
        </g>

        {/* Primary slice labels — only for the larger wedges */}
        <g data-data-layer="true">
          {primaryArcs.map((a) => {
            if (a.frac < 0.1) return null;
            const lx = primaryCx + Math.sin(a.midA) * primaryRadius * 0.58;
            const ly = primaryCy - Math.cos(a.midA) * primaryRadius * 0.58;
            return (
              <text
                key={`plbl-${a.label}`}
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fontWeight={500}
                fill={a.index === 0 ? "var(--color-page)" : "var(--color-ink)"}
              >
                {a.share}%
              </text>
            );
          })}
        </g>
      </Group>

      {/* Connector break-out lines */}
      {connector && (
        <g data-data-layer="true">
          <line
            x1={connector.x1}
            y1={connector.y1}
            x2={connector.sxTop}
            y2={connector.syTop}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
          <line
            x1={connector.x2}
            y1={connector.y2}
            x2={connector.sxBot}
            y2={connector.syBot}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
        </g>
      )}

      {/* Secondary pie */}
      <Group>
        <g data-data-layer="true">
          {secondaryArcs.map((a) => (
            <path
              key={a.label}
              d={slicePath(
                secondaryCx,
                secondaryCy,
                secondaryRadius,
                a.startA,
                a.endA,
              )}
              fill={SECONDARY_COLOURS[a.index % SECONDARY_COLOURS.length]}
              stroke="var(--color-surface)"
              strokeWidth={1.5}
            />
          ))}
        </g>

        {/* Secondary slice labels — only for the larger wedges */}
        <g data-data-layer="true">
          {secondaryArcs.map((a) => {
            if (a.frac < 0.13) return null;
            const lx = secondaryCx + Math.sin(a.midA) * secondaryRadius * 0.6;
            const ly = secondaryCy - Math.cos(a.midA) * secondaryRadius * 0.6;
            return (
              <text
                key={`slbl-${a.label}`}
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fontWeight={500}
                fill="var(--color-ink)"
              >
                {a.label}
              </text>
            );
          })}
        </g>

        {/* Secondary caption under the smaller pie */}
        <text
          x={secondaryCx}
          y={secondaryCy + secondaryRadius + 12}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-mute)"
        >
          OTHER · 14%
        </text>
      </Group>

      {/* Anchors */}
      {/* 1. Primary pie — representative slice (iPhone, the dominant wedge) */}
      <ExplainAnchor
        selector="primary-pie"
        index={1}
        pin={{ x: iphoneCentroid.x - 6, y: iphoneCentroid.y - 6 }}
        rect={{
          x: primaryCx - primaryRadius,
          y: primaryCy - primaryRadius,
          width: primaryRadius * 2,
          height: primaryRadius * 2,
        }}
      >
        <g />
      </ExplainAnchor>

      {/* 2. The "Other" slice — the one being exploded */}
      <ExplainAnchor
        selector="breakout-slice"
        index={2}
        pin={{ x: otherCentroid.x, y: otherCentroid.y }}
        rect={{
          x: otherCentroid.x - 20,
          y: otherCentroid.y - 20,
          width: 40,
          height: 40,
        }}
      >
        <g />
      </ExplainAnchor>

      {/* 3. Connector lines — the visual link between the two pies */}
      <ExplainAnchor
        selector="breakout-connector"
        index={3}
        pin={{
          x: (primaryCx + secondaryCx) / 2,
          y: primaryCy - primaryRadius / 2,
        }}
        rect={{
          x: primaryCx,
          y: primaryCy - primaryRadius,
          width: secondaryCx - primaryCx,
          height: primaryRadius * 2,
        }}
      >
        <g />
      </ExplainAnchor>

      {/* 4. Secondary pie — the zoom */}
      <ExplainAnchor
        selector="secondary-pie"
        index={4}
        pin={{ x: secondaryCx, y: secondaryCy - secondaryRadius - 10 }}
        rect={{
          x: secondaryCx - secondaryRadius,
          y: secondaryCy - secondaryRadius,
          width: secondaryRadius * 2,
          height: secondaryRadius * 2,
        }}
      >
        <g />
      </ExplainAnchor>

      {/* 5. Secondary caption — reminds the viewer the secondary pie's 100%
          equals the primary pie's 14% */}
      <ExplainAnchor
        selector="secondary-scale"
        index={5}
        pin={{ x: secondaryCx + secondaryRadius + 8, y: secondaryCy + secondaryRadius + 12 }}
        rect={{
          x: secondaryCx - secondaryRadius,
          y: secondaryCy + secondaryRadius + 2,
          width: secondaryRadius * 2,
          height: 18,
        }}
      >
        <g />
      </ExplainAnchor>
    </svg>
  );
}
