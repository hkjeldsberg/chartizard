"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Gartner's Magic Quadrant — a 2×2 grid with x = Completeness of Vision
// (low→high) and y = Ability to Execute (low→high). Twelve invented vendors
// distributed so each quadrant carries two to four entries.
//
// Quadrant membership:
//   Top-right    — Leaders:       Northwind Analytics, Arcus DB, Mica Cloud
//   Top-left     — Challengers:   Plumstream, Beam & Co, Juniper Works
//   Bottom-right — Visionaries:   Lyra Intel, Obsidian Metrics, Corvid AI
//   Bottom-left  — Niche Players: Fieldstone, Quaver, Tinderbox
const DATA: ReadonlyArray<{ name: string; x: number; y: number }> = [
  // Leaders (top-right)
  { name: "Northwind Analytics", x: 7.8, y: 8.6 },
  { name: "Arcus DB", x: 8.9, y: 7.6 },
  { name: "Mica Cloud", x: 6.8, y: 8.2 },
  // Challengers (top-left)
  { name: "Plumstream", x: 3.1, y: 8.4 },
  { name: "Beam & Co", x: 2.4, y: 7.2 },
  { name: "Juniper Works", x: 4.1, y: 7.8 },
  // Visionaries (bottom-right)
  { name: "Lyra Intel", x: 8.4, y: 3.6 },
  { name: "Obsidian Metrics", x: 7.2, y: 2.4 },
  { name: "Corvid AI", x: 9.1, y: 4.2 },
  // Niche Players (bottom-left)
  { name: "Fieldstone", x: 2.2, y: 2.6 },
  { name: "Quaver", x: 3.4, y: 3.8 },
  { name: "Tinderbox", x: 1.6, y: 1.9 },
];

interface Props {
  width: number;
  height: number;
}

export function MagicQuadrant({ width, height }: Props) {
  // Extra margin to fit corner quadrant labels and axis captions.
  const margin = { top: 34, right: 28, bottom: 50, left: 64 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 10], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 10], range: [ih, 0] });

  const midX = xScale(5);
  const midY = yScale(5);

  // Canonical Leader anchor: Northwind Analytics.
  const leader = DATA.find((d) => d.name === "Northwind Analytics")!;
  const leaderX = xScale(leader.x);
  const leaderY = yScale(leader.y);

  // Quadrant tints — Leaders slightly heavier, the rest mute.
  const tintL = "rgba(74, 106, 104, 0.14)";
  const tintC = "rgba(74, 106, 104, 0.07)";
  const tintV = "rgba(120, 120, 120, 0.06)";
  const tintNP = "rgba(120, 120, 120, 0.04)";

  return (
    <svg width={width} height={height} role="img" aria-label="Magic Quadrant">
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {/* Quadrant tints. TL = Challengers, TR = Leaders,
              BL = Niche Players, BR = Visionaries. */}
          <rect x={0} y={0} width={midX} height={midY} fill={tintC} />
          <rect x={midX} y={0} width={iw - midX} height={midY} fill={tintL} />
          <rect x={0} y={midY} width={midX} height={ih - midY} fill={tintNP} />
          <rect
            x={midX}
            y={midY}
            width={iw - midX}
            height={ih - midY}
            fill={tintV}
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

          {/* Cross-hair dividers */}
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

          {/* Corner quadrant labels */}
          <text
            x={midX - 8}
            y={14}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink-mute)"
            letterSpacing={0.5}
          >
            CHALLENGERS
          </text>
          <text
            x={iw - 6}
            y={14}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
            letterSpacing={0.5}
          >
            LEADERS
          </text>
          <text
            x={midX - 8}
            y={ih - 6}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink-mute)"
            letterSpacing={0.5}
          >
            NICHE PLAYERS
          </text>
          <text
            x={iw - 6}
            y={ih - 6}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink-mute)"
            letterSpacing={0.5}
          >
            VISIONARIES
          </text>

          {/* Vendor dots */}
          {DATA.map((d) => {
            const isLeader = d.name === leader.name;
            return (
              <circle
                key={d.name}
                cx={xScale(d.x)}
                cy={yScale(d.y)}
                r={isLeader ? 4 : 3}
                fill="var(--color-ink)"
              />
            );
          })}

          {/* Vendor labels — small, offset right of dot */}
          {DATA.map((d) => (
            <text
              key={`${d.name}-label`}
              x={xScale(d.x) + 6}
              y={yScale(d.y) - 5}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              {d.name}
            </text>
          ))}
        </g>

        {/* Axis captions — outside the data layer so they stay crisp */}
        <text
          x={iw / 2}
          y={ih + 34}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
          letterSpacing={0.5}
        >
          COMPLETENESS OF VISION →
        </text>
        <text
          x={-margin.left + 6}
          y={-14}
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
          letterSpacing={0.5}
        >
          ↑ ABILITY TO EXECUTE
        </text>

        {/* Anchors */}

        {/* 1. Y-axis — Ability to Execute */}
        <ExplainAnchor
          selector="execute-axis"
          index={1}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Leaders quadrant label (canonical) */}
        <ExplainAnchor
          selector="leaders-quadrant"
          index={2}
          pin={{ x: midX + (iw - midX) / 2, y: -4 }}
          rect={{
            x: midX,
            y: 0,
            width: Math.max(0, iw - midX),
            height: midY,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Vendor bubble — Northwind Analytics (canonical Leader) */}
        <ExplainAnchor
          selector="vendor-bubble"
          index={3}
          pin={{ x: leaderX - 14, y: leaderY - 18 }}
          rect={{
            x: Math.max(0, leaderX - 8),
            y: Math.max(0, leaderY - 8),
            width: 16,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Cross-hairs at plot centre — the quadrant rule */}
        <ExplainAnchor
          selector="cross-hairs"
          index={4}
          pin={{ x: midX + 16, y: midY + 16 }}
          rect={{
            x: Math.max(0, midX - 6),
            y: Math.max(0, midY - 6),
            width: 12,
            height: 12,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. X-axis — Completeness of Vision */}
        <ExplainAnchor
          selector="vision-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 36 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
