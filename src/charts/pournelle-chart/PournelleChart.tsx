"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Pournelle Chart — Jerry Pournelle's 1963 PhD dissertation at the
// University of Washington. Two axes: state-planning (x) vs reason (y).
// Distinct from Nolan chart: Nolan uses economic-freedom vs personal-freedom;
// Pournelle uses state-planning vs reason.

interface Ideology {
  name: string;
  // 0 = anarchism (planning-bad), 1 = totalitarianism (planning-good)
  planning: number;
  // 0 = irrationalism, 1 = reason enthroned
  reason: number;
  anchorX?: number; // label nudge
  anchorY?: number;
}

const IDEOLOGIES: ReadonlyArray<Ideology> = [
  { name: "Ayn Rand Libertarianism", planning: 0.07, reason: 0.92, anchorX: 6, anchorY: -8 },
  { name: "American Conservatism",   planning: 0.45, reason: 0.82, anchorX: 6, anchorY: -8 },
  { name: "American Liberalism",     planning: 0.60, reason: 0.78, anchorX: 6, anchorY: -8 },
  { name: "Communism",               planning: 0.92, reason: 0.75, anchorX: -6, anchorY: -8 },
  { name: "Far-left Anarchism",      planning: 0.05, reason: 0.70, anchorX: 6, anchorY: 10 },
  { name: "Fascism",                 planning: 0.72, reason: 0.22, anchorX: 6, anchorY: -8 },
  { name: "Nazism",                  planning: 0.88, reason: 0.10, anchorX: -6, anchorY: 12 },
];

interface Props {
  width: number;
  height: number;
}

export function PournelleChart({ width, height }: Props) {
  const margin = { top: 32, right: 24, bottom: 44, left: 44 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 1], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 1], range: [ih, 0] });

  const cx = iw / 2;
  const cy = ih / 2;

  // Quadrant background tints
  // Upper-left: reason + anarchism (libertarian-rationalist)
  // Upper-right: reason + planning (rationalist-authoritarian)
  // Lower-left: irrationalism + anarchism (chaotic)
  // Lower-right: irrationalism + planning (totalitarian-irrational)
  const quadrants = [
    { x: 0,  y: 0,  fill: "rgba(74, 106, 104, 0.08)" },  // upper-left (reason + anarchism)
    { x: cx, y: 0,  fill: "rgba(100, 100, 160, 0.08)" }, // upper-right (reason + planning)
    { x: 0,  y: cy, fill: "rgba(140, 140, 100, 0.06)" }, // lower-left
    { x: cx, y: cy, fill: "rgba(165, 90, 74, 0.10)" },   // lower-right (irrational + planning)
  ];

  // Crosshair lines
  const crosshairStroke = "var(--color-ink-mute)";

  return (
    <svg width={width} height={height} role="img" aria-label="Pournelle Chart: state-planning vs reason ideology map">
      <Group left={margin.left} top={margin.top}>
        {/* Quadrant fills */}
        <g data-data-layer="true">
          {quadrants.map((q, i) => (
            <rect
              key={i}
              x={q.x}
              y={q.y}
              width={cx}
              height={cy}
              fill={q.fill}
            />
          ))}

          {/* Outer border */}
          <rect
            x={0}
            y={0}
            width={iw}
            height={ih}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />

          {/* Crosshair axes */}
          <line x1={cx} y1={0} x2={cx} y2={ih} stroke={crosshairStroke} strokeWidth={1} strokeDasharray="3 3" />
          <line x1={0} y1={cy} x2={iw} y2={cy} stroke={crosshairStroke} strokeWidth={1} strokeDasharray="3 3" />

          {/* X-axis extreme labels */}
          <text
            x={8}
            y={ih + 16}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            ANARCHISM
          </text>
          <text
            x={iw - 8}
            y={ih + 16}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            TOTALITARIANISM
          </text>
          <text
            x={cx}
            y={ih + 28}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            ← ATTITUDE TOWARDS STATE PLANNING →
          </text>

          {/* Y-axis extreme labels */}
          <text
            x={-8}
            y={8}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            REASON
          </text>
          <text
            x={-8}
            y={ih - 4}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            IRRATIONALISM
          </text>

          {/* Y-axis rotated label */}
          <text
            x={-margin.left + 10}
            y={cy}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
            transform={`rotate(-90, ${-margin.left + 10}, ${cy})`}
          >
            ATTITUDE TOWARDS REASON
          </text>

          {/* Quadrant corner labels */}
          <text x={8}        y={16}     fontFamily="var(--font-mono)" fontSize={9} fontWeight={600} fill="var(--color-ink)" fillOpacity={0.5}>Libertarian-</text>
          <text x={8}        y={26}     fontFamily="var(--font-mono)" fontSize={9} fontWeight={600} fill="var(--color-ink)" fillOpacity={0.5}>Rationalist</text>
          <text x={iw - 8}   y={16}     textAnchor="end" fontFamily="var(--font-mono)" fontSize={9} fontWeight={600} fill="var(--color-ink)" fillOpacity={0.5}>Rationalist-</text>
          <text x={iw - 8}   y={26}     textAnchor="end" fontFamily="var(--font-mono)" fontSize={9} fontWeight={600} fill="var(--color-ink)" fillOpacity={0.5}>Authoritarian</text>
          <text x={iw - 8}   y={ih - 8} textAnchor="end" fontFamily="var(--font-mono)" fontSize={9} fontWeight={600} fill="var(--color-ink)" fillOpacity={0.5}>Irrational-</text>
          <text x={iw - 8}   y={ih - 18} textAnchor="end" fontFamily="var(--font-mono)" fontSize={9} fontWeight={600} fill="var(--color-ink)" fillOpacity={0.5}>Authoritarian</text>

          {/* Ideology dots and labels */}
          {IDEOLOGIES.map((ideo) => {
            const x = xScale(ideo.planning);
            const y = yScale(ideo.reason);
            const ax = ideo.anchorX ?? 6;
            const ay = ideo.anchorY ?? -8;
            const labelX = ax < 0 ? x + ax : x + ax;
            const labelAnchor = ax < 0 ? "end" : "start";
            return (
              <g key={ideo.name}>
                <circle
                  cx={x}
                  cy={y}
                  r={4}
                  fill="var(--color-ink)"
                  stroke="var(--color-surface)"
                  strokeWidth={1.2}
                />
                <text
                  x={labelX}
                  y={y + ay}
                  textAnchor={labelAnchor}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {ideo.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── Anchors ── */}

        {/* 1. X-axis (state-planning axis) */}
        <ExplainAnchor
          selector="axis-planning"
          index={1}
          pin={{ x: cx, y: ih + 20 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Y-axis (reason axis) */}
        <ExplainAnchor
          selector="axis-reason"
          index={2}
          pin={{ x: -28, y: cy }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Quadrants */}
        <ExplainAnchor
          selector="quadrants"
          index={3}
          pin={{ x: cx + 14, y: cy - 14 }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Ideology dots (representative: Communism upper-right) */}
        {(() => {
          const communism = IDEOLOGIES.find((p) => p.name === "Communism")!;
          const x = xScale(communism.planning);
          const y = yScale(communism.reason);
          return (
            <ExplainAnchor
              selector="ideology-dot"
              index={4}
              pin={{ x: x + 16, y: y - 14 }}
              rect={{ x: Math.max(0, x - 6), y: Math.max(0, y - 6), width: 12, height: 12 }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* 5. Upper-right quadrant — the controversial claim */}
        <ExplainAnchor
          selector="rationalist-authoritarian-quadrant"
          index={5}
          pin={{ x: iw - 14, y: 36 }}
          rect={{ x: cx, y: 0, width: iw - cx, height: cy }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Crosshair / centre */}
        <ExplainAnchor
          selector="crosshair"
          index={6}
          pin={{ x: cx + 14, y: cy + 14 }}
          rect={{ x: Math.max(0, cx - 8), y: Math.max(0, cy - 8), width: 16, height: 16 }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
