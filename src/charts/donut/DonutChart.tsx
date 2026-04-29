"use client";

import { Pie } from "@visx/shape";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Slice {
  source: string;
  twh: number;
}

// Global electricity generation mix, 2024 (approx. TWh). Ordered largest-first
// so the eye can rank slices clockwise from 12 o'clock without re-sorting.
const DATA: ReadonlyArray<Slice> = [
  { source: "Coal", twh: 10200 },
  { source: "Natural Gas", twh: 6400 },
  { source: "Hydro", twh: 4300 },
  { source: "Renewables", twh: 4000 },
  { source: "Nuclear", twh: 2700 },
  { source: "Oil", twh: 800 },
];

const TOTAL = DATA.reduce((s, d) => s + d.twh, 0);

const COLOURS = [
  "var(--color-ink)",
  "#8a7a52",
  "#4a6a68",
  "#b59b6b",
  "#6a6a62",
  "#c9c4b8",
];

interface Props {
  width: number;
  height: number;
}

export function DonutChart({ width, height }: Props) {
  const legendWidth = 128;
  const chartWidth = Math.max(0, width - legendWidth);
  const size = Math.min(chartWidth, height);
  const outerRadius = size / 2 - 16;
  const innerRadius = outerRadius * 0.62;
  const cx = chartWidth / 2;
  const cy = height / 2;

  // Precompute slice angles so labels and anchors can reuse them.
  let cum = 0;
  const arcs = DATA.map((d) => {
    const frac = d.twh / TOTAL;
    const startA = (cum - 0.25) * Math.PI * 2;
    const endA = (cum + frac - 0.25) * Math.PI * 2;
    const midA = (startA + endA) / 2;
    cum += frac;
    return { ...d, frac, startA, endA, midA };
  });

  const coalArc = arcs[0];
  const coalMidX = Math.cos(coalArc.midA) * ((outerRadius + innerRadius) / 2);
  const coalMidY = Math.sin(coalArc.midA) * ((outerRadius + innerRadius) / 2);

  return (
    <svg width={width} height={height} role="img" aria-label="Donut chart">
      <Group left={cx} top={cy}>
        {/* Ring slices */}
        <g data-data-layer="true">
          <Pie<Slice>
            data={DATA as Slice[]}
            pieValue={(d) => d.twh}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            cornerRadius={0}
            padAngle={0.004}
            pieSort={null}
          >
            {(pie) =>
              pie.arcs.map((arc, i) => (
                <path
                  key={arc.data.source}
                  d={pie.path(arc) ?? undefined}
                  fill={COLOURS[i % COLOURS.length]}
                  stroke="var(--color-surface)"
                  strokeWidth={1.5}
                />
              ))
            }
          </Pie>
        </g>

        {/* Slice percentage labels (only for slices >= 8%) */}
        <g data-data-layer="true">
          {arcs.map((a, i) => {
            if (a.frac < 0.08) return null;
            const lx = Math.cos(a.midA) * ((outerRadius + innerRadius) / 2);
            const ly = Math.sin(a.midA) * ((outerRadius + innerRadius) / 2);
            return (
              <text
                key={a.source}
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fontWeight={500}
                fill={i === 0 ? "var(--color-page)" : "var(--color-ink)"}
              >
                {Math.round(a.frac * 100)}%
              </text>
            );
          })}
        </g>

        {/* Centre total */}
        <g data-data-layer="true">
          <text
            x={0}
            y={-6}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={18}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            {TOTAL.toLocaleString()}
          </text>
          <text
            x={0}
            y={14}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            TWh · 2024
          </text>
        </g>

        {/* Slice anchor — a tight box around the Coal arc's centroid */}
        <ExplainAnchor
          selector="slice"
          index={1}
          pin={{
            x: Math.cos(coalArc.midA) * (outerRadius + 14),
            y: Math.sin(coalArc.midA) * (outerRadius + 14),
          }}
          rect={{
            x: coalMidX - 18,
            y: coalMidY - 18,
            width: 36,
            height: 36,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Slice label anchor — on the 36% text inside Coal */}
        <ExplainAnchor
          selector="slice-label"
          index={2}
          pin={{ x: coalMidX + 18, y: coalMidY + 14 }}
          rect={{
            x: coalMidX - 16,
            y: coalMidY - 10,
            width: 32,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Centre anchor */}
        <ExplainAnchor
          selector="centre"
          index={3}
          pin={{ x: innerRadius - 4, y: -innerRadius + 4 }}
          rect={{
            x: -innerRadius + 6,
            y: -innerRadius + 6,
            width: innerRadius * 2 - 12,
            height: innerRadius * 2 - 12,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Ring anchor — thin radial band pointing at the ring thickness */}
        <ExplainAnchor
          selector="ring"
          index={4}
          pin={{ x: outerRadius + 18, y: outerRadius * 0.55 }}
          rect={{
            x: innerRadius,
            y: -4,
            width: outerRadius - innerRadius,
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>

      {/* Legend */}
      <g
        transform={`translate(${chartWidth + 8}, ${cy - (DATA.length * 20) / 2})`}
        data-data-layer="true"
      >
        {DATA.map((d, i) => {
          const pct = Math.round((d.twh / TOTAL) * 100);
          return (
            <g key={d.source} transform={`translate(0, ${i * 20})`}>
              <rect width={10} height={10} fill={COLOURS[i % COLOURS.length]} />
              <text
                x={16}
                y={9}
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink-soft)"
              >
                {d.source.toUpperCase()}
              </text>
              <text
                x={16}
                y={9}
                dx={88}
                textAnchor="end"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink-mute)"
              >
                {pct}%
              </text>
            </g>
          );
        })}
      </g>
      <ExplainAnchor
        selector="legend-item"
        index={5}
        pin={{
          x: chartWidth + 8 + 110,
          y: cy - (DATA.length * 20) / 2 - 6,
        }}
        rect={{
          x: chartWidth + 4,
          y: cy - (DATA.length * 20) / 2 - 4,
          width: 120,
          height: DATA.length * 20 + 4,
        }}
      >
        <g />
      </ExplainAnchor>
    </svg>
  );
}
