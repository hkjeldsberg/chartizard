"use client";

import { Pie } from "@visx/shape";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Slice {
  segment: string;
  share: number;
}

const DATA: ReadonlyArray<Slice> = [
  { segment: "Enterprise", share: 62 },
  { segment: "Mid-market", share: 27 },
  { segment: "SMB", share: 11 },
];

const COLOURS = ["var(--color-ink)", "#8a7a52", "#a8a8a0"];

interface Props {
  width: number;
  height: number;
}

export function PieChart({ width, height }: Props) {
  const size = Math.min(width, height);
  const radius = size / 2 - 24;
  const innerRadius = 0;
  const cx = width / 2;
  const cy = height / 2;

  return (
    <svg width={width} height={height} role="img" aria-label="Pie chart">
      <Group left={cx} top={cy}>
        <g data-data-layer="true">
          <Pie<Slice>
            data={DATA as Slice[]}
            pieValue={(d) => d.share}
            outerRadius={radius}
            innerRadius={innerRadius}
            cornerRadius={0}
            padAngle={0.004}
            pieSort={null}
          >
            {(pie) =>
              pie.arcs.map((arc, i) => (
                <path
                  key={arc.data.segment}
                  d={pie.path(arc) ?? undefined}
                  fill={COLOURS[i % COLOURS.length]}
                  stroke="var(--color-surface)"
                  strokeWidth={2}
                />
              ))
            }
          </Pie>
        </g>

        {/* Slice labels */}
        <g data-data-layer="true">
          {(() => {
            let cum = 0;
            return DATA.map((d, i) => {
              const frac = d.share / 100;
              const startA = (cum - 0.25) * Math.PI * 2; // -0.25 to start at 12 o'clock
              const endA = (cum + frac - 0.25) * Math.PI * 2;
              const midA = (startA + endA) / 2;
              const lx = Math.cos(midA) * (radius * 0.6);
              const ly = Math.sin(midA) * (radius * 0.6);
              cum += frac;
              return (
                <text
                  key={d.segment}
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={11}
                  fill={i === 0 ? "var(--color-page)" : "var(--color-ink)"}
                  fontWeight={500}
                >
                  {d.share}%
                </text>
              );
            });
          })()}
        </g>

        {/* Anchors */}
        <ExplainAnchor
          selector="slice"
          index={1}
          pin={{ x: -radius * 0.9, y: -radius * 0.9 }}
          rect={{ x: -radius - 6, y: -radius - 6, width: radius * 1.4, height: radius * 1.4 }}
        >
          <g />
        </ExplainAnchor>

        <ExplainAnchor
          selector="slice-label"
          index={2}
          pin={{ x: 0, y: -radius * 0.45 }}
          rect={{ x: -24, y: -radius * 0.65, width: 48, height: 28 }}
        >
          <g />
        </ExplainAnchor>

        <ExplainAnchor
          selector="centre"
          index={4}
          pin={{ x: 0, y: radius + 14 }}
          rect={{ x: -18, y: -18, width: 36, height: 36 }}
        >
          <g />
        </ExplainAnchor>
      </Group>

      {/* Legend */}
      <g transform={`translate(${cx + radius + 24}, ${cy - radius})`} data-data-layer="true">
        {DATA.map((d, i) => (
          <g key={d.segment} transform={`translate(0, ${i * 22})`}>
            <rect width={12} height={12} fill={COLOURS[i % COLOURS.length]} />
            <text
              x={18}
              y={10}
              fontFamily="var(--font-mono)"
              fontSize={11}
              fill="var(--color-ink-soft)"
            >
              {d.segment.toUpperCase()}
            </text>
          </g>
        ))}
      </g>
      <ExplainAnchor
        selector="legend-item"
        index={3}
        pin={{ x: cx + radius + 40, y: cy - radius - 8 }}
        rect={{ x: cx + radius + 20, y: cy - radius - 4, width: 120, height: 22 }}
      >
        <g />
      </ExplainAnchor>
    </svg>
  );
}
