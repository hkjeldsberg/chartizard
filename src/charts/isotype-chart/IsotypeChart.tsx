"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";
import { useMemo } from "react";

// 1930s-style world population comparison (approximate historical values, millions)
// 1 icon = 25 million people
const ICON_UNIT = 25; // million people per icon

const RAW_DATA = [
  { country: "China", pop: 430 },
  { country: "India", pop: 350 },
  { country: "USSR", pop: 170 },
  { country: "USA", pop: 125 },
  { country: "Japan", pop: 65 },
] as const;

// Gerd Arntz-style stick figure path (centred at 0,0, 16px tall)
function stickFigurePath(cx: number, cy: number, h: number): React.ReactNode {
  const headR = h * 0.13;
  const bodyTop = cy - h * 0.5 + headR * 2 + h * 0.02;
  const bodyBot = cy + h * 0.1;
  const shoulderY = bodyTop + h * 0.08;
  const armEndY = shoulderY + h * 0.15;
  const hipY = bodyBot;
  const footY = cy + h * 0.5;
  const legSpread = h * 0.13;

  return (
    <g>
      {/* head */}
      <circle cx={cx} cy={cy - h * 0.5 + headR} r={headR} />
      {/* body */}
      <line x1={cx} y1={bodyTop} x2={cx} y2={bodyBot} strokeWidth={h * 0.07} />
      {/* arms */}
      <line
        x1={cx - h * 0.18}
        y1={armEndY}
        x2={cx + h * 0.18}
        y2={armEndY}
        strokeWidth={h * 0.06}
      />
      {/* left leg */}
      <line
        x1={cx}
        y1={hipY}
        x2={cx - legSpread}
        y2={footY}
        strokeWidth={h * 0.06}
      />
      {/* right leg */}
      <line
        x1={cx}
        y1={hipY}
        x2={cx + legSpread}
        y2={footY}
        strokeWidth={h * 0.06}
      />
    </g>
  );
}

export function IsotypeChart({ width, height }: { width: number; height: number }) {
  const margin = { top: 24, right: 48, bottom: 36, left: 80 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { rows, iconH, iconW, rowH } = useMemo(() => {
    const maxIcons = Math.max(...RAW_DATA.map((d) => Math.ceil(d.pop / ICON_UNIT)));
    const rowCount = RAW_DATA.length;
    const rowH = ih > 0 ? ih / rowCount : 40;
    const iconH = Math.min(rowH * 0.8, iw > 0 ? iw / maxIcons : 20);
    const iconW = iconH * 0.55;

    const rows = RAW_DATA.map((d) => {
      const iconCount = Math.round(d.pop / ICON_UNIT);
      return { ...d, iconCount };
    });

    return { rows, iconH, iconW, rowH };
  }, [iw, ih]);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Isotype Chart: 1930s world population comparison by country, 1 icon = 25 million people"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Data layer: all icons */}
        <g
          data-data-layer="true"
          stroke="var(--color-ink)"
          fill="var(--color-ink)"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {rows.map((row, ri) => {
            const cy = ri * rowH + rowH * 0.5;
            return Array.from({ length: row.iconCount }, (_, i) => {
              const cx = i * iconW + iconW * 0.5;
              return (
                <g key={i} opacity={0.85}>
                  {stickFigurePath(cx, cy, iconH)}
                </g>
              );
            });
          })}
        </g>

        {/* Country labels (left margin) */}
        {rows.map((row, ri) => (
          <text
            key={row.country}
            x={-8}
            y={ri * rowH + rowH * 0.5}
            textAnchor="end"
            dominantBaseline="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            {row.country}
          </text>
        ))}

        {/* Population totals (right of icons) */}
        <g data-data-layer="true">
          {rows.map((row, ri) => {
            const cx = row.iconCount * iconW + 6;
            return (
              <text
                key={`pop-${row.country}`}
                x={Math.min(cx, iw + 2)}
                y={ri * rowH + rowH * 0.5}
                textAnchor="start"
                dominantBaseline="middle"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-mute)"
              >
                {row.pop}M
              </text>
            );
          })}
        </g>

        {/* Anchor 1: icon (the primary mark) */}
        <ExplainAnchor
          selector="icon"
          index={1}
          pin={{ x: iconW * 0.5, y: -14 }}
          rect={{
            x: 0,
            y: 0,
            width: Math.min(iconW * rows[0].iconCount, iw),
            height: rowH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: icon row (one full country row) */}
        <ExplainAnchor
          selector="icon-row"
          index={2}
          pin={{ x: iw * 0.5, y: rowH - rowH * 0.5 - 12 }}
          rect={{
            x: 0,
            y: 0,
            width: iw,
            height: rowH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: row label */}
        <ExplainAnchor
          selector="row-label"
          index={3}
          pin={{ x: -margin.left + 6, y: rowH * 1.5 }}
          rect={{
            x: -margin.left,
            y: 0,
            width: margin.left - 4,
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: unit key caption */}
        <ExplainAnchor
          selector="unit-key"
          index={4}
          pin={{ x: iw * 0.5, y: ih + 22 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <text
            x={iw * 0.5}
            y={ih + 16}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            {`1 ICON = ${ICON_UNIT}M PEOPLE · c. 1930`}
          </text>
        </ExplainAnchor>

        {/* Anchor 5: count annotation */}
        <ExplainAnchor
          selector="count-annotation"
          index={5}
          pin={{ x: Math.min(rows[4].iconCount * iconW + 22, iw + 8), y: rowH * 4.5 }}
          rect={{
            x: Math.min(rows[4].iconCount * iconW, iw - 4),
            y: rowH * 4,
            width: Math.min(40, margin.right),
            height: rowH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6: row-count comparison (China vs Japan) */}
        <ExplainAnchor
          selector="row-comparison"
          index={6}
          pin={{ x: iw * 0.5, y: rowH * 2 - 12 }}
          rect={{
            x: 0,
            y: rowH * 0,
            width: iw,
            height: rowH * 2,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
