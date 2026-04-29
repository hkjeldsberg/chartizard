"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Mendelow's (1991) Power–Interest Grid. 12 stakeholders plotted by
// project power (x, low→high) and interest (y, low→high). Four named
// management strategies are the point of the chart — the positions are
// editorial, not measured.
//
// Quadrant membership (by power × interest):
//   Low / Low   — Monitor:        Junior Analyst, Competitor Y, Community Manager
//   Low / High  — Keep Informed:  Customer X (enterprise), Customer Y (SMB), PR Firm
//   High / Low  — Keep Satisfied: Board, Regulator, Sales Director
//   High / High — Manage Closely: CEO, CTO, VP Engineering
const DATA: ReadonlyArray<{ name: string; power: number; interest: number }> = [
  // Manage Closely
  { name: "CEO", power: 9.2, interest: 8.6 },
  { name: "CTO", power: 8.1, interest: 9.1 },
  { name: "VP Engineering", power: 7.4, interest: 8.3 },
  // Keep Satisfied
  { name: "Board", power: 9.4, interest: 3.8 },
  { name: "Regulator", power: 8.2, interest: 2.6 },
  { name: "Sales Director", power: 6.8, interest: 3.2 },
  // Keep Informed
  { name: "Customer X", power: 3.6, interest: 8.8 },
  { name: "Customer Y", power: 2.4, interest: 7.2 },
  { name: "PR Firm", power: 3.2, interest: 6.4 },
  // Monitor
  { name: "Junior Analyst", power: 1.4, interest: 2.2 },
  { name: "Competitor Y", power: 2.8, interest: 3.4 },
  { name: "Community Manager", power: 1.8, interest: 3.8 },
];

interface Props {
  width: number;
  height: number;
}

export function StakeholderGridChart({ width, height }: Props) {
  const margin = { top: 28, right: 28, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 10], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 10], range: [ih, 0] });

  const midX = xScale(5);
  const midY = yScale(5);

  // Anchor stakeholders.
  const ceo = DATA.find((d) => d.name === "CEO")!;
  const ceoX = xScale(ceo.power);
  const ceoY = yScale(ceo.interest);

  // Tints — the two high-attention quadrants a little heavier.
  const tintKI = "rgba(74, 106, 104, 0.08)";
  const tintMC = "rgba(74, 106, 104, 0.14)";
  const tintM = "rgba(120, 120, 120, 0.05)";
  const tintKS = "rgba(120, 120, 120, 0.09)";

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Stakeholder Power-Interest Grid"
    >
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {/* Quadrant tints. TL = Keep Informed, TR = Manage Closely,
              BL = Monitor, BR = Keep Satisfied. */}
          <rect x={0} y={0} width={midX} height={midY} fill={tintKI} />
          <rect x={midX} y={0} width={iw - midX} height={midY} fill={tintMC} />
          <rect x={0} y={midY} width={midX} height={ih - midY} fill={tintM} />
          <rect
            x={midX}
            y={midY}
            width={iw - midX}
            height={ih - midY}
            fill={tintKS}
          />

          {/* Outer frame */}
          <rect
            x={0}
            y={0}
            width={iw}
            height={ih}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />

          {/* Dividers — the routing lines */}
          <line
            x1={midX}
            y1={0}
            x2={midX}
            y2={ih}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          <line
            x1={0}
            y1={midY}
            x2={iw}
            y2={midY}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />

          {/* Quadrant strategy labels */}
          <text
            x={midX / 2}
            y={14}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
            letterSpacing={0.5}
          >
            KEEP INFORMED
          </text>
          <text
            x={midX + (iw - midX) / 2}
            y={14}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
            letterSpacing={0.5}
          >
            MANAGE CLOSELY
          </text>
          <text
            x={midX / 2}
            y={ih - 8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink-mute)"
            letterSpacing={0.5}
          >
            MONITOR
          </text>
          <text
            x={midX + (iw - midX) / 2}
            y={ih - 8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink-mute)"
            letterSpacing={0.5}
          >
            KEEP SATISFIED
          </text>

          {/* Stakeholder dots */}
          {DATA.map((d) => {
            const isAnchor = d.name === ceo.name;
            return (
              <circle
                key={d.name}
                cx={xScale(d.power)}
                cy={yScale(d.interest)}
                r={isAnchor ? 3.8 : 2.8}
                fill="var(--color-ink)"
              />
            );
          })}

          {/* CEO label */}
          <text
            x={ceoX + 6}
            y={ceoY - 6}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            CEO
          </text>
        </g>

        {/* Axis captions */}
        <text
          x={iw / 2}
          y={ih + 28}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
          letterSpacing={0.5}
        >
          POWER →
        </text>
        <text
          x={-margin.left + 4}
          y={-10}
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
          letterSpacing={0.5}
        >
          ↑ INTEREST
        </text>

        {/* Anchors */}

        {/* 1. CEO — single stakeholder in Manage Closely */}
        <ExplainAnchor
          selector="stakeholder-point"
          index={1}
          pin={{ x: ceoX + 18, y: ceoY - 16 }}
          rect={{
            x: Math.max(0, ceoX - 8),
            y: Math.max(0, ceoY - 8),
            width: 16,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Manage Closely quadrant label */}
        <ExplainAnchor
          selector="manage-closely-quadrant"
          index={2}
          pin={{ x: midX + (iw - midX) / 2, y: 2 }}
          rect={{
            x: midX,
            y: 0,
            width: Math.max(0, iw - midX),
            height: midY,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Keep Informed quadrant label */}
        <ExplainAnchor
          selector="keep-informed-quadrant"
          index={3}
          pin={{ x: midX / 2, y: 2 }}
          rect={{ x: 0, y: 0, width: midX, height: midY }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Quadrant divider lines — the routing rule */}
        <ExplainAnchor
          selector="quadrant-dividers"
          index={4}
          pin={{ x: midX + 14, y: midY + 14 }}
          rect={{
            x: Math.max(0, midX - 6),
            y: Math.max(0, midY - 6),
            width: 12,
            height: 12,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. X-axis — power */}
        <ExplainAnchor
          selector="power-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Y-axis — interest */}
        <ExplainAnchor
          selector="interest-axis"
          index={6}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
