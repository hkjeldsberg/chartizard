"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Row = {
  country: string;
  short: string;
  y2014: number;
  y2024: number;
};

// Public education spending per capita, USD (OECD-style stylised figures).
// Hand-picked so the slope chart shows a mix of rising, falling, and flat
// trajectories — and one classic leapfrog (Estonia overtaking the UK).
const DATA: ReadonlyArray<Row> = [
  { country: "South Korea", short: "KOR", y2014: 1800, y2024: 2600 },
  { country: "Finland", short: "FIN", y2014: 1500, y2024: 1600 },
  { country: "USA", short: "USA", y2014: 2200, y2024: 2400 },
  { country: "Germany", short: "GER", y2014: 1300, y2024: 1500 },
  { country: "UK", short: "UK", y2014: 1400, y2024: 1200 },
  { country: "France", short: "FRA", y2014: 1500, y2024: 1600 },
  { country: "Japan", short: "JPN", y2014: 1000, y2024: 1100 },
  { country: "Estonia", short: "EST", y2014: 800, y2024: 1400 },
  { country: "Greece", short: "GRE", y2014: 900, y2024: 650 },
  { country: "Poland", short: "POL", y2014: 700, y2024: 1200 },
];

const RISE = "#4a6a68";
const FALL = "#a55a4a";
const FLAT = "var(--color-ink-soft)";

function slopeKind(d: Row): "rise" | "fall" | "flat" {
  const delta = d.y2024 - d.y2014;
  // Treat |delta| < 150 USD as flat (covers Finland/France/Japan +100).
  if (Math.abs(delta) < 150) return "flat";
  return delta > 0 ? "rise" : "fall";
}

function slopeColour(kind: "rise" | "fall" | "flat"): string {
  if (kind === "rise") return RISE;
  if (kind === "fall") return FALL;
  return FLAT;
}

interface Props {
  width: number;
  height: number;
}

export function SlopeChart({ width, height }: Props) {
  const margin = { top: 36, right: 64, bottom: 44, left: 64 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Two columns: x=0 (2014) and x=iw (2024). Labels live in the margins.
  const x0 = 0;
  const x1 = iw;

  // Shared value axis — single scale so rankings are comparable year-to-year.
  const yScale = scaleLinear({
    domain: [500, 2800],
    range: [ih, 0],
    nice: true,
  });

  // Pre-compute rendered geometry so anchors can re-use it.
  const lines = DATA.map((d) => {
    const y0 = yScale(d.y2014);
    const y1 = yScale(d.y2024);
    const kind = slopeKind(d);
    return { ...d, y0, y1, kind, colour: slopeColour(kind) };
  });

  // Representative anchor targets.
  const estonia = lines.find((l) => l.country === "Estonia")!;
  const uk = lines.find((l) => l.country === "UK")!;
  const finland = lines.find((l) => l.country === "Finland")!;

  // Year-column header positions.
  const headerY = -14;

  // Clamp helper — keeps every anchor rect inside the plot area.
  function clampRect(r: { x: number; y: number; width: number; height: number }) {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const width = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const height = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width, height };
  }

  return (
    <svg width={width} height={height} role="img" aria-label="Slope chart">
      <Group left={margin.left} top={margin.top}>
        {/* Year headers */}
        <g data-data-layer="true">
          <text
            x={x0}
            y={headerY}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={11}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            2014
          </text>
          <text
            x={x1}
            y={headerY}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={11}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            2024
          </text>
        </g>

        {/* Two vertical rails — the start- and end-point columns. */}
        <g data-data-layer="true">
          <line
            x1={x0}
            x2={x0}
            y1={0}
            y2={ih}
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
          <line
            x1={x1}
            x2={x1}
            y1={0}
            y2={ih}
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
        </g>

        {/* The slope lines themselves — one per country. */}
        <g data-data-layer="true">
          {lines.map((l) => (
            <line
              key={l.country}
              x1={x0}
              y1={l.y0}
              x2={x1}
              y2={l.y1}
              stroke={l.colour}
              strokeWidth={l.kind === "flat" ? 1 : 1.8}
              strokeOpacity={l.kind === "flat" ? 0.7 : 1}
            />
          ))}
        </g>

        {/* Endpoint dots. */}
        <g data-data-layer="true">
          {lines.map((l) => (
            <g key={l.country}>
              <circle cx={x0} cy={l.y0} r={2.5} fill={l.colour} />
              <circle cx={x1} cy={l.y1} r={2.5} fill={l.colour} />
            </g>
          ))}
        </g>

        {/* Country labels on the right — one per line, nudged off collisions
            by sorting and adjusting y positions (simple de-overlap). */}
        <g data-data-layer="true">
          {(() => {
            const sorted = [...lines].sort((a, b) => a.y1 - b.y1);
            const minGap = 12;
            const placed: { y: number }[] = [];
            for (const l of sorted) {
              let y = l.y1;
              if (placed.length > 0) {
                const prev = placed[placed.length - 1].y;
                if (y - prev < minGap) y = prev + minGap;
              }
              placed.push({ y });
            }
            return sorted.map((l, i) => (
              <text
                key={l.country}
                x={x1 + 8}
                y={placed[i].y}
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill={l.colour}
              >
                {l.short}
              </text>
            ));
          })()}
        </g>

        {/* 1. A single slope line — Estonia, the steep-rise exemplar. */}
        <ExplainAnchor
          selector="line"
          index={1}
          pin={{ x: iw / 2, y: (estonia.y0 + estonia.y1) / 2 - 14 }}
          rect={clampRect({
            x: 0,
            y: Math.min(estonia.y0, estonia.y1) - 6,
            width: iw,
            height: Math.abs(estonia.y1 - estonia.y0) + 12,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Rising-line anchor — Estonia again, colour-coded teal. */}
        <ExplainAnchor
          selector="rising-line"
          index={2}
          pin={{ x: iw * 0.75, y: Math.min(estonia.y0, estonia.y1) - 10 }}
          rect={clampRect({
            x: iw / 2,
            y: Math.min(estonia.y0, estonia.y1) - 6,
            width: iw / 2,
            height: Math.abs(estonia.y1 - estonia.y0) + 12,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Falling-line anchor — the UK, colour-coded warm red. */}
        <ExplainAnchor
          selector="falling-line"
          index={3}
          pin={{ x: iw * 0.25, y: Math.min(uk.y0, uk.y1) - 10 }}
          rect={clampRect({
            x: 0,
            y: Math.min(uk.y0, uk.y1) - 6,
            width: iw / 2,
            height: Math.abs(uk.y1 - uk.y0) + 12,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Start-point anchor — the 2014 column of dots. */}
        <ExplainAnchor
          selector="start-point"
          index={4}
          pin={{ x: x0 - 28, y: ih / 2 }}
          rect={clampRect({
            x: x0 - 10,
            y: 0,
            width: 20,
            height: ih,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. End-point anchor — the 2024 column of dots. */}
        <ExplainAnchor
          selector="end-point"
          index={5}
          pin={{ x: x1 + 36, y: ih / 2 }}
          rect={clampRect({
            x: x1 - 10,
            y: 0,
            width: 20,
            height: ih,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Country label anchor — on Estonia's right-hand endpoint dot. */}
        <ExplainAnchor
          selector="country-label"
          index={6}
          pin={{ x: x1 + 42, y: estonia.y1 }}
          rect={clampRect({
            x: x1 - 8,
            y: estonia.y1 - 8,
            width: 16,
            height: 16,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Flat-line anchor — Finland, the "no real change" case. */}
        <ExplainAnchor
          selector="flat-line"
          index={7}
          pin={{ x: iw / 2, y: (finland.y0 + finland.y1) / 2 + 14 }}
          rect={clampRect({
            x: 0,
            y: Math.min(finland.y0, finland.y1) - 4,
            width: iw,
            height: Math.abs(finland.y1 - finland.y0) + 8,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>

      {/* Y-axis units — in the left margin, outside the plot. */}
      <g
        transform={`translate(${margin.left - 12}, ${margin.top - 14})`}
        data-data-layer="true"
      >
        <text
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-mute)"
        >
          USD / CAPITA
        </text>
      </g>
    </svg>
  );
}
