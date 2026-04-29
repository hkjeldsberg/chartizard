"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Lewis structure diagram for H₂O and CO₂.
// Rendered as pure SVG — no d3 scales needed (structural diagram, not data plot).

interface Props {
  width: number;
  height: number;
}

// Small dot helper used for lone pairs.
function LonePair({
  cx,
  cy,
  angle,
  spread = 5,
}: {
  cx: number;
  cy: number;
  angle: number; // degrees — direction the pair extends from centre
  spread?: number; // distance between the two dots
}) {
  const rad = (angle * Math.PI) / 180;
  const perp = rad + Math.PI / 2;
  const dx = Math.cos(perp) * (spread / 2);
  const dy = Math.sin(perp) * (spread / 2);
  return (
    <g>
      <circle cx={cx + dx} cy={cy + dy} r={1.8} fill="var(--color-ink)" />
      <circle cx={cx - dx} cy={cy - dy} r={1.8} fill="var(--color-ink)" />
    </g>
  );
}

// Double bond: two parallel lines between (x1,y1) and (x2,y2).
function DoubleBond({
  x1,
  y1,
  x2,
  y2,
  gap = 3.5,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  gap?: number;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return null;
  const nx = (-dy / len) * (gap / 2);
  const ny = (dx / len) * (gap / 2);
  return (
    <g>
      <line
        x1={x1 + nx}
        y1={y1 + ny}
        x2={x2 + nx}
        y2={y2 + ny}
        stroke="var(--color-ink)"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <line
        x1={x1 - nx}
        y1={y1 - ny}
        x2={x2 - nx}
        y2={y2 - ny}
        stroke="var(--color-ink)"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </g>
  );
}

export function LewisStructure({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // ── Water (H₂O) — left panel, occupies the top-left 55% of available width ──
  // Bond angle 104.5°. O is at the top-centre; H atoms spread below-left / below-right.
  const h2oX = iw * 0.28;
  const h2oY = ih * 0.38;

  // H positions — bond length in SVG units ~36px, angle 104.5° from vertical.
  const bondLen = Math.min(36, iw * 0.14);
  const halfAngle = (104.5 / 2) * (Math.PI / 180); // half of bond angle
  const hLX = h2oX - Math.sin(halfAngle) * bondLen;
  const hLY = h2oY + Math.cos(halfAngle) * bondLen;
  const hRX = h2oX + Math.sin(halfAngle) * bondLen;
  const hRY = h2oY + Math.cos(halfAngle) * bondLen;

  // Lone pairs on O: two pairs above (top and sides).
  // Pair A: straight up; Pair B: slightly right of up.
  const lpAngleA = -90; // straight up
  const lpAngleB = 0;   // right side

  // ── CO₂ — right panel, occupies the right 40% ──
  // Central C with double bonds to O on each side.
  const co2X = iw * 0.73;
  const co2Y = ih * 0.38;
  const co2BondLen = Math.min(40, iw * 0.15);
  const oLX = co2X - co2BondLen;
  const oRX = co2X + co2BondLen;
  const co2Y_ = co2Y; // all on same horizontal line

  // Caption y-positions
  const captionY = ih * 0.72;
  // Octet-rule note y
  const noteY = ih * 0.92;

  return (
    <svg width={width} height={height} role="img" aria-label="Lewis structure diagram">
      <Group left={margin.left} top={margin.top}>

        {/* ── DATA LAYER ── */}
        <g data-data-layer="true">

          {/* ── Water H₂O ── */}
          {/* O-H single bonds */}
          <line
            x1={h2oX} y1={h2oY}
            x2={hLX} y2={hLY}
            stroke="var(--color-ink)" strokeWidth={1.8} strokeLinecap="round"
          />
          <line
            x1={h2oX} y1={h2oY}
            x2={hRX} y2={hRY}
            stroke="var(--color-ink)" strokeWidth={1.8} strokeLinecap="round"
          />

          {/* O atom */}
          <text
            x={h2oX} y={h2oY}
            textAnchor="middle" dominantBaseline="central"
            fontFamily="var(--font-mono)" fontSize={16} fontWeight={600}
            fill="var(--color-ink)"
          >
            O
          </text>

          {/* H atoms */}
          <text
            x={hLX} y={hLY}
            textAnchor="middle" dominantBaseline="central"
            fontFamily="var(--font-mono)" fontSize={14} fontWeight={500}
            fill="var(--color-ink)"
          >
            H
          </text>
          <text
            x={hRX} y={hRY}
            textAnchor="middle" dominantBaseline="central"
            fontFamily="var(--font-mono)" fontSize={14} fontWeight={500}
            fill="var(--color-ink)"
          >
            H
          </text>

          {/* Lone pairs on O (2 pairs = 4 dots) */}
          <LonePair cx={h2oX - 10} cy={h2oY - 6} angle={lpAngleA} />
          <LonePair cx={h2oX + 10} cy={h2oY - 6} angle={lpAngleB} />

          {/* H₂O caption */}
          <text
            x={h2oX} y={captionY}
            textAnchor="middle"
            fontFamily="var(--font-mono)" fontSize={11}
            fill="var(--color-ink-mute)"
          >
            H₂O
          </text>

          {/* ── CO₂ ── */}
          {/* C=O double bonds */}
          <DoubleBond x1={co2X} y1={co2Y_} x2={oLX} y2={co2Y_} />
          <DoubleBond x1={co2X} y1={co2Y_} x2={oRX} y2={co2Y_} />

          {/* C atom */}
          <text
            x={co2X} y={co2Y_}
            textAnchor="middle" dominantBaseline="central"
            fontFamily="var(--font-mono)" fontSize={16} fontWeight={600}
            fill="var(--color-ink)"
          >
            C
          </text>

          {/* O atoms */}
          <text
            x={oLX} y={co2Y_}
            textAnchor="middle" dominantBaseline="central"
            fontFamily="var(--font-mono)" fontSize={16} fontWeight={600}
            fill="var(--color-ink)"
          >
            O
          </text>
          <text
            x={oRX} y={co2Y_}
            textAnchor="middle" dominantBaseline="central"
            fontFamily="var(--font-mono)" fontSize={16} fontWeight={600}
            fill="var(--color-ink)"
          >
            O
          </text>

          {/* Lone pairs on each O in CO₂ (2 pairs per O = 4 dots per O) */}
          {/* Left O — pairs above and below */}
          <LonePair cx={oLX} cy={co2Y_ - 12} angle={0} />
          <LonePair cx={oLX} cy={co2Y_ + 12} angle={0} />
          {/* Right O — pairs above and below */}
          <LonePair cx={oRX} cy={co2Y_ - 12} angle={0} />
          <LonePair cx={oRX} cy={co2Y_ + 12} angle={0} />

          {/* CO₂ caption */}
          <text
            x={co2X} y={captionY}
            textAnchor="middle"
            fontFamily="var(--font-mono)" fontSize={11}
            fill="var(--color-ink-mute)"
          >
            CO₂
          </text>

          {/* Divider between H₂O and CO₂ panels */}
          <line
            x1={iw * 0.51} y1={ih * 0.08}
            x2={iw * 0.51} y2={ih * 0.78}
            stroke="var(--color-hairline)" strokeWidth={1} strokeDasharray="3 3"
          />
        </g>

        {/* Octet-rule note — outside data layer so it stays legible in Explain mode */}
        <text
          x={iw / 2} y={noteY}
          textAnchor="middle"
          fontFamily="var(--font-mono)" fontSize={9}
          fill="var(--color-ink-mute)"
        >
          octet rule: non-H atoms each have 8 valence electrons (bonds + lone pairs)
        </text>

        {/* ── Anchors ── */}

        {/* 1. Central atom — O in H₂O */}
        <ExplainAnchor
          selector="central-atom"
          index={1}
          pin={{ x: h2oX - 22, y: h2oY - 18 }}
          rect={{
            x: Math.max(0, h2oX - 12),
            y: Math.max(0, h2oY - 12),
            width: 24,
            height: 24,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Single bond — one O-H bond in H₂O */}
        <ExplainAnchor
          selector="single-bond"
          index={2}
          pin={{ x: hRX + 16, y: (h2oY + hRY) / 2 - 10 }}
          rect={{
            x: Math.max(0, Math.min(h2oX, hRX) - 4),
            y: Math.max(0, Math.min(h2oY, hRY) - 4),
            width: Math.abs(hRX - h2oX) + 8,
            height: Math.abs(hRY - h2oY) + 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Lone pair — dots above O in H₂O */}
        <ExplainAnchor
          selector="lone-pair"
          index={3}
          pin={{ x: h2oX - 28, y: h2oY - 12 }}
          rect={{
            x: Math.max(0, h2oX - 22),
            y: Math.max(0, h2oY - 18),
            width: 44,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Bond angle — H-O-H 104.5° in H₂O */}
        <ExplainAnchor
          selector="bond-angle"
          index={4}
          pin={{ x: h2oX, y: hLY + 14 }}
          rect={{
            x: Math.max(0, hLX - 6),
            y: Math.max(0, h2oY - 4),
            width: Math.min(iw / 2, hRX - hLX + 12),
            height: Math.min(ih, hLY - h2oY + 12),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Double bond — C=O in CO₂ */}
        <ExplainAnchor
          selector="double-bond"
          index={5}
          pin={{ x: (co2X + oRX) / 2, y: co2Y_ - 18 }}
          rect={{
            x: Math.max(0, co2X - 4),
            y: Math.max(0, co2Y_ - 10),
            width: Math.min(iw, oRX - co2X + 8),
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Octet rule — CO₂ oxygen lone pairs illustrate the completed octet */}
        <ExplainAnchor
          selector="octet-rule"
          index={6}
          pin={{ x: oRX + 18, y: co2Y_ }}
          rect={{
            x: Math.max(0, co2X - co2BondLen - 12),
            y: Math.max(0, co2Y_ - 20),
            width: Math.min(iw, co2BondLen * 2 + 24),
            height: 40,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
