"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// 15 product initiatives. x = effort (0-10, low→high),
// y = impact (0-10, low→high). Distribution:
//   Quick Wins      (low effort, high impact): 5 items
//   Major Projects  (high effort, high impact): 5 items
//   Fill-Ins        (low effort, low impact): 3 items
//   Time Sinks      (high effort, low impact): 2 items
const DATA: ReadonlyArray<{ name: string; effort: number; impact: number }> = [
  // Quick wins (top-left)
  { name: "Add dark mode toggle", effort: 1.6, impact: 6.4 },
  { name: "Empty-state copy pass", effort: 1.2, impact: 7.3 },
  { name: "Keyboard shortcut help", effort: 2.4, impact: 6.8 },
  { name: "Onboarding tooltips", effort: 3.2, impact: 8.1 },
  { name: "CSV export", effort: 2.0, impact: 7.8 },
  // Major projects (top-right)
  { name: "Mobile app", effort: 8.4, impact: 8.9 },
  { name: "SSO / SAML", effort: 7.2, impact: 8.2 },
  { name: "Workspace migration tool", effort: 6.4, impact: 6.7 },
  { name: "Realtime collaboration", effort: 9.1, impact: 9.2 },
  { name: "AI summary feature", effort: 7.8, impact: 7.4 },
  // Fill-ins (bottom-left)
  { name: "Change favicon", effort: 0.9, impact: 1.4 },
  { name: "Update about-page copy", effort: 1.8, impact: 2.6 },
  { name: "Fix pagination spacing", effort: 2.6, impact: 3.1 },
  // Time sinks (bottom-right)
  { name: "Rebuild settings modal", effort: 7.6, impact: 2.8 },
  { name: "Custom themes engine", effort: 8.8, impact: 3.4 },
];

interface Props {
  width: number;
  height: number;
}

export function QuadrantChart({ width, height }: Props) {
  const margin = { top: 28, right: 28, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 10], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 10], range: [ih, 0] });

  const midX = xScale(5);
  const midY = yScale(5);

  // Representative Quick Win (top-left): "CSV export" — the label that
  // anchors the "specific example initiative" anchor.
  const exampleInitiative = DATA.find((d) => d.name === "CSV export")!;
  const exX = xScale(exampleInitiative.effort);
  const exY = yScale(exampleInitiative.impact);

  // A single representative point (Major Project, "SSO / SAML") used as
  // the "single initiative point" anchor.
  const pointInitiative = DATA.find((d) => d.name === "SSO / SAML")!;
  const ptX = xScale(pointInitiative.effort);
  const ptY = yScale(pointInitiative.impact);

  const tintQW = "rgba(74, 106, 104, 0.08)";
  const tintMP = "rgba(74, 106, 104, 0.12)";
  const tintFI = "rgba(120, 120, 120, 0.05)";
  const tintTS = "rgba(165, 90, 74, 0.08)";

  return (
    <svg width={width} height={height} role="img" aria-label="Quadrant chart">
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {/* Quadrant tints. Order: TL = Quick Wins, TR = Major Projects,
              BL = Fill-Ins, BR = Time Sinks. */}
          <rect x={0} y={0} width={midX} height={midY} fill={tintQW} />
          <rect x={midX} y={0} width={iw - midX} height={midY} fill={tintMP} />
          <rect x={0} y={midY} width={midX} height={ih - midY} fill={tintFI} />
          <rect
            x={midX}
            y={midY}
            width={iw - midX}
            height={ih - midY}
            fill={tintTS}
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

          {/* Quadrant dividers */}
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

          {/* Quadrant labels (uppercase, hairline diction) */}
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
            QUICK WINS
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
            MAJOR PROJECTS
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
            FILL-INS
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
            TIME SINKS
          </text>

          {/* Initiative dots */}
          {DATA.map((d) => {
            const isPoint = d.name === pointInitiative.name;
            const isExample = d.name === exampleInitiative.name;
            return (
              <circle
                key={d.name}
                cx={xScale(d.effort)}
                cy={yScale(d.impact)}
                r={isPoint || isExample ? 3.6 : 2.6}
                fill="var(--color-ink)"
              />
            );
          })}

          {/* Example initiative label */}
          <text
            x={exX + 6}
            y={exY - 6}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            CSV export
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
          EFFORT →
        </text>
        <text
          x={-margin.left + 4}
          y={-10}
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
          letterSpacing={0.5}
        >
          ↑ IMPACT
        </text>

        {/* Anchors */}

        {/* 1. Quadrant label — Quick Wins */}
        <ExplainAnchor
          selector="quadrant-label"
          index={1}
          pin={{ x: midX / 2, y: 2 }}
          rect={{ x: 0, y: 0, width: midX, height: midY }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Single initiative — SSO / SAML (Major Projects) */}
        <ExplainAnchor
          selector="initiative-point"
          index={2}
          pin={{ x: ptX + 16, y: ptY - 16 }}
          rect={{
            x: Math.max(0, ptX - 8),
            y: Math.max(0, ptY - 8),
            width: 16,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Example initiative — CSV export (Quick Wins) */}
        <ExplainAnchor
          selector="example-initiative"
          index={3}
          pin={{ x: exX - 14, y: exY - 16 }}
          rect={{
            x: Math.max(0, exX - 8),
            y: Math.max(0, exY - 8),
            width: 16,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Axis-crossing — the implicit zero at the centre */}
        <ExplainAnchor
          selector="axis-crossing"
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

        {/* 5. X-axis — effort (caption sits below the plot) */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Y-axis — impact (caption sits left of the plot) */}
        <ExplainAnchor
          selector="y-axis"
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
