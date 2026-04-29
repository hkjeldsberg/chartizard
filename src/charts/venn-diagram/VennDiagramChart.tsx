"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

/**
 * Three-set Venn diagram: SaaS feature adoption across subscription tiers.
 *   A = Analytics users   (Basic + Pro + Enterprise)
 *   B = API access users  (Pro + Enterprise)
 *   C = SSO users         (Enterprise only)
 *
 * Every region carries a percentage of the total user base.
 */
export function VennDiagramChart({ width, height }: Props) {
  const margin = { top: 28, right: 20, bottom: 36, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const cx = iw / 2;
  const cy = ih / 2;

  // Radius and offset tuned so all seven regions are visible without labels
  // colliding. Offsets sit between 0.55r and 0.6r of the radius.
  const r = 0.34 * Math.min(iw, ih);
  const ox = 0.58 * r; // horizontal half-offset between A and B
  const oy = 0.55 * r; // vertical offset of A/B above centre

  // Circle centres (classic triangular Venn)
  const ax = cx - ox;
  const ay = cy - oy * 0.35;
  const bx = cx + ox;
  const by = cy - oy * 0.35;
  const ccx = cx;
  const ccy = cy + oy * 0.8;

  // Region label positions — approximated centroids, not exact geometry.
  // Ordered so they never stack on top of each other.
  const regions = [
    { label: "A only", pct: "35%", x: ax - r * 0.55, y: ay - r * 0.1 },
    { label: "B only", pct: "2%", x: bx + r * 0.55, y: by - r * 0.1 },
    { label: "C only", pct: "1%", x: ccx, y: ccy + r * 0.6 },
    { label: "A∩B", pct: "18%", x: cx, y: cy - oy * 0.55 },
    { label: "A∩C", pct: "4%", x: ax + r * 0.05, y: ccy + r * 0.05 },
    { label: "B∩C", pct: "1%", x: bx - r * 0.05, y: ccy + r * 0.05 },
    { label: "A∩B∩C", pct: "7%", x: cx, y: cy + r * 0.18 },
  ];

  // Clamp helper for anchor rects so they never extend past the plot area
  const clamp = (
    rx: number,
    ry: number,
    rw: number,
    rh: number,
  ): { x: number; y: number; width: number; height: number } => {
    const x0 = Math.max(0, rx);
    const y0 = Math.max(0, ry);
    const x1 = Math.min(iw, rx + rw);
    const y1 = Math.min(ih, ry + rh);
    return {
      x: x0,
      y: y0,
      width: Math.max(0, x1 - x0),
      height: Math.max(0, y1 - y0),
    };
  };

  // Outer rect for the "cardinality-rule" concept anchor — hovers the
  // "None: 32%" callout in the corner.
  const noneX = 6;
  const noneY = ih - 14;

  return (
    <svg width={width} height={height} role="img" aria-label="Venn diagram">
      <Group left={margin.left} top={margin.top}>
        {/* The three circles */}
        <g data-data-layer="true">
          <circle
            cx={ax}
            cy={ay}
            r={r}
            fill="var(--color-ink)"
            fillOpacity={0.22}
            stroke="var(--color-ink)"
            strokeWidth={1.1}
          />
          <circle
            cx={bx}
            cy={by}
            r={r}
            fill="var(--color-ink)"
            fillOpacity={0.22}
            stroke="var(--color-ink)"
            strokeWidth={1.1}
          />
          <circle
            cx={ccx}
            cy={ccy}
            r={r}
            fill="var(--color-ink)"
            fillOpacity={0.22}
            stroke="var(--color-ink)"
            strokeWidth={1.1}
          />

          {/* Set labels (A, B, C) pinned outside each circle */}
          <text
            x={ax - r * 0.95}
            y={ay - r * 0.85}
            fontFamily="var(--font-mono)"
            fontSize={11}
            fill="var(--color-ink)"
            fontWeight={600}
          >
            A · Analytics
          </text>
          <text
            x={bx + r * 0.05}
            y={by - r * 0.85}
            fontFamily="var(--font-mono)"
            fontSize={11}
            fill="var(--color-ink)"
            fontWeight={600}
          >
            B · API
          </text>
          <text
            x={ccx + r * 0.65}
            y={ccy + r * 0.95}
            fontFamily="var(--font-mono)"
            fontSize={11}
            fill="var(--color-ink)"
            fontWeight={600}
          >
            C · SSO
          </text>

          {/* Region percentages */}
          {regions.map((reg) => (
            <text
              key={reg.label}
              x={reg.x}
              y={reg.y}
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink)"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {reg.pct}
            </text>
          ))}

          {/* None-of-the-above region — outside the circles */}
          <text
            x={noneX}
            y={noneY}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            NONE · 32%
          </text>
        </g>

        {/* 1. Set circle — anchor on circle A */}
        <ExplainAnchor
          selector="set-circle"
          index={1}
          pin={{ x: ax - r * 0.9, y: ay + r * 0.2 }}
          rect={clamp(ax - r, ay - r, r * 0.9, r * 2)}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Exclusive region — "A only" sliver on the far left of A */}
        <ExplainAnchor
          selector="exclusive-region"
          index={2}
          pin={{ x: ax - r * 0.4, y: ay + r * 0.5 }}
          rect={clamp(ax - r * 0.95, ay - r * 0.25, r * 0.55, r * 1.1)}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Three-way intersection — the centre region */}
        <ExplainAnchor
          selector="intersection"
          index={3}
          pin={{ x: cx + r * 0.75, y: cy + r * 0.05 }}
          rect={clamp(cx - r * 0.28, cy - r * 0.1, r * 0.56, r * 0.52)}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Region label — concept: every region must carry a count */}
        <ExplainAnchor
          selector="region-label"
          index={4}
          pin={{ x: cx - r * 0.2, y: cy - oy * 0.55 - 16 }}
          rect={clamp(cx - r * 0.3, cy - oy * 0.55 - 8, r * 0.6, 16)}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Cardinality rule — hovering the "NONE · 32%" callout */}
        <ExplainAnchor
          selector="cardinality-rule"
          index={5}
          pin={{ x: noneX + 88, y: noneY - 6 }}
          rect={clamp(noneX - 2, noneY - 12, 90, 16)}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Three-set limit — pins on the outer boundary between B and C */}
        <ExplainAnchor
          selector="three-set-limit"
          index={6}
          pin={{ x: bx + r * 0.75, y: by + r * 0.9 }}
          rect={clamp(bx + r * 0.2, by + r * 0.55, r * 0.8, r * 0.8)}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
