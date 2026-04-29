"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Opposites Diagram — two labelled boxes on a horizontal axis with a
// "VS" divider in the middle. Each box lists attributes of one pole.
// Defines by contrast: cognitively cheaper than defining by essence.

interface Pole {
  label: string;
  attributes: ReadonlyArray<string>;
}

const LEFT_POLE: Pole = {
  label: "Claude",
  attributes: [
    "Contextual across turns",
    "Tool use & reasoning",
    "Multi-step planning",
    "Calibrated refusals",
    "Cites uncertainty",
  ],
};

const RIGHT_POLE: Pole = {
  label: "Traditional Chatbots",
  attributes: [
    "Stateless / keyword match",
    "Script-bound responses",
    "Single-turn only",
    "No safety reasoning",
    "Confident regardless",
  ],
};

const TITLE = "Claude vs. Traditional Chatbots";

interface Props {
  width: number;
  height: number;
}

export function OppositesDiagram({ width, height }: Props) {
  const margin = { top: 40, right: 20, bottom: 20, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Layout constants
  const dividerW = 36;
  const boxW = Math.max(0, (iw - dividerW) / 2);
  const boxH = ih;
  const headerH = 28;
  const rowH = 18;
  const bulletR = 2;
  const bulletOffsetX = 14;
  const textOffsetX = 24;
  const firstRowY = headerH + 18;

  const leftX = 0;
  const dividerX = boxW;
  const rightX = boxW + dividerW;

  const cx = iw / 2;
  const cy = ih / 2;

  return (
    <svg width={width} height={height} role="img" aria-label="Opposites Diagram: Claude vs. Traditional Chatbots">
      <Group left={margin.left} top={margin.top}>
        {/* Title banner */}
        <text
          x={cx}
          y={-22}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={11}
          fontWeight={600}
          fill="var(--color-ink)"
          letterSpacing={0.4}
        >
          {TITLE}
        </text>

        {/* Data layer: boxes, divider, text */}
        <g data-data-layer="true">
          {/* Horizontal axis rule */}
          <line
            x1={0}
            y1={cy}
            x2={iw}
            y2={cy}
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />

          {/* Left box */}
          <rect
            x={leftX}
            y={0}
            width={boxW}
            height={boxH}
            fill="rgba(74, 106, 104, 0.07)"
            stroke="var(--color-hairline)"
            strokeWidth={1}
            rx={2}
          />

          {/* Right box */}
          <rect
            x={rightX}
            y={0}
            width={boxW}
            height={boxH}
            fill="rgba(165, 90, 74, 0.07)"
            stroke="var(--color-hairline)"
            strokeWidth={1}
            rx={2}
          />

          {/* Left header */}
          <rect
            x={leftX}
            y={0}
            width={boxW}
            height={headerH}
            fill="rgba(74, 106, 104, 0.14)"
            rx={2}
          />
          <text
            x={leftX + boxW / 2}
            y={headerH / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={12}
            fontWeight={700}
            fill="var(--color-ink)"
          >
            {LEFT_POLE.label}
          </text>

          {/* Right header */}
          <rect
            x={rightX}
            y={0}
            width={boxW}
            height={headerH}
            fill="rgba(165, 90, 74, 0.14)"
            rx={2}
          />
          <text
            x={rightX + boxW / 2}
            y={headerH / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={12}
            fontWeight={700}
            fill="var(--color-ink)"
          >
            {RIGHT_POLE.label}
          </text>

          {/* Left attributes */}
          {LEFT_POLE.attributes.map((attr, i) => (
            <g key={attr} transform={`translate(${leftX + bulletOffsetX}, ${firstRowY + i * rowH})`}>
              <circle cx={0} cy={-2} r={bulletR} fill="var(--color-ink-soft)" />
              <text
                x={textOffsetX - bulletOffsetX}
                y={0}
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink)"
                dominantBaseline="central"
              >
                {attr}
              </text>
            </g>
          ))}

          {/* Right attributes */}
          {RIGHT_POLE.attributes.map((attr, i) => (
            <g key={attr} transform={`translate(${rightX + bulletOffsetX}, ${firstRowY + i * rowH})`}>
              <circle cx={0} cy={-2} r={bulletR} fill="var(--color-ink-soft)" />
              <text
                x={textOffsetX - bulletOffsetX}
                y={0}
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink)"
                dominantBaseline="central"
              >
                {attr}
              </text>
            </g>
          ))}

          {/* VS divider */}
          <rect
            x={dividerX}
            y={cy - 18}
            width={dividerW}
            height={36}
            fill="var(--color-surface)"
            stroke="var(--color-hairline)"
            strokeWidth={1}
            rx={4}
          />
          <text
            x={dividerX + dividerW / 2}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={11}
            fontWeight={700}
            fill="var(--color-ink)"
          >
            VS
          </text>
        </g>

        {/* ── Anchors ── */}

        {/* 1. Left pole box (Claude) */}
        <ExplainAnchor
          selector="left-pole"
          index={1}
          pin={{ x: leftX + 12, y: 12 }}
          rect={{ x: leftX, y: 0, width: boxW, height: boxH }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Right pole box (Traditional Chatbots) */}
        <ExplainAnchor
          selector="right-pole"
          index={2}
          pin={{ x: rightX + boxW - 12, y: 12 }}
          rect={{ x: rightX, y: 0, width: boxW, height: boxH }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. VS divider */}
        <ExplainAnchor
          selector="vs-divider"
          index={3}
          pin={{ x: cx, y: cy - 30 }}
          rect={{ x: dividerX, y: Math.max(0, cy - 18), width: dividerW, height: Math.min(36, ih - (cy - 18)) }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Left attribute list */}
        <ExplainAnchor
          selector="attribute-list"
          index={4}
          pin={{ x: leftX + boxW - 12, y: firstRowY }}
          rect={{ x: leftX, y: firstRowY - 6, width: boxW, height: boxH - firstRowY }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Horizontal axis rule (the structural spine) */}
        <ExplainAnchor
          selector="axis-rule"
          index={5}
          pin={{ x: cx, y: cy + 14 }}
          rect={{ x: 0, y: Math.max(0, cy - 5), width: iw, height: 10 }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
