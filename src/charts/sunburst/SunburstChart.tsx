"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { hierarchy, partition } from "d3-hierarchy";
import { arc as d3Arc } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Node {
  name: string;
  value?: number;
  children?: Node[];
}

// Global CO₂ emissions by region and country, 2024 (approx. Mt CO₂).
// Region totals equal the sum of their children so the partition layout
// produces clean concentric rings.
const DATA: Node = {
  name: "Global",
  children: [
    {
      name: "Asia-Pacific",
      children: [
        { name: "China", value: 11000 },
        { name: "India", value: 2800 },
        { name: "Japan", value: 1000 },
        { name: "South Korea", value: 600 },
        { name: "Indonesia", value: 650 },
        { name: "Others", value: 2950 },
      ],
    },
    {
      name: "North America",
      children: [
        { name: "USA", value: 4900 },
        { name: "Canada", value: 570 },
        { name: "Mexico", value: 530 },
      ],
    },
    {
      name: "Europe",
      children: [
        { name: "Germany", value: 650 },
        { name: "UK", value: 330 },
        { name: "France", value: 290 },
        { name: "Italy", value: 290 },
        { name: "Poland", value: 290 },
        { name: "Others", value: 1650 },
      ],
    },
    {
      name: "Middle East",
      children: [
        { name: "Saudi Arabia", value: 650 },
        { name: "Iran", value: 780 },
        { name: "UAE", value: 260 },
        { name: "Others", value: 1310 },
      ],
    },
    {
      name: "Rest of World",
      children: [
        { name: "Russia", value: 1750 },
        { name: "Africa", value: 1400 },
        { name: "South America", value: 1350 },
      ],
    },
  ],
};

// One base tint per region; outer-ring country slices are drawn in the same
// tint at a lighter opacity so hierarchy reads without a colour library.
const REGION_TINTS: Record<string, string> = {
  "Asia-Pacific": "var(--color-ink)",
  "North America": "#8a7a52",
  Europe: "#4a6a68",
  "Middle East": "#b59b6b",
  "Rest of World": "#6a6a62",
};

interface Props {
  width: number;
  height: number;
}

export function SunburstChart({ width, height }: Props) {
  const size = Math.min(width, height);
  const radius = size / 2 - 20;
  const cx = width / 2;
  const cy = height / 2;

  const root = useMemo(() => {
    const h = hierarchy<Node>(DATA)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    return partition<Node>().size([2 * Math.PI, radius])(h);
  }, [radius]);

  // depth 1 → regions (inner ring); depth 2 → countries (outer ring)
  const regions = root.descendants().filter((d) => d.depth === 1);
  const countries = root.descendants().filter((d) => d.depth === 2);

  const total = (root.value ?? 0);

  // Two concrete ring bands so the two "levels are data" reading holds.
  const ringInner = radius * 0.28;
  const ringMid = radius * 0.62;
  const ringOuter = radius;

  const regionArc = d3Arc<(typeof regions)[number]>()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius(ringInner)
    .outerRadius(ringMid)
    .padAngle(0.004);

  const countryArc = d3Arc<(typeof countries)[number]>()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius(ringMid + 1)
    .outerRadius(ringOuter)
    .padAngle(0.003);

  // Map each country node back to its region's tint.
  function tintFor(node: (typeof countries)[number]): string {
    const regionName = node.parent?.data.name ?? "";
    return REGION_TINTS[regionName] ?? "var(--color-ink)";
  }

  // Anchor geometry: pick Asia-Pacific as the representative region and China
  // as the representative leaf so explanation copy can be specific.
  const apRegion = regions.find((r) => r.data.name === "Asia-Pacific");
  const chinaNode = countries.find((c) => c.data.name === "China");

  // Region mid-angle for the inner-ring anchor pin.
  const apMidA = apRegion ? (apRegion.x0 + apRegion.x1) / 2 : 0;
  // Partition angles are measured from 0 = +x axis CCW, but d3.arc() treats
  // 0 as "12 o'clock" and rotates clockwise. So for screen coords matching
  // the arc path: angle θ → pin = (sin θ · r, -cos θ · r).
  const apPinR = (ringInner + ringMid) / 2;
  const apPin = {
    x: Math.sin(apMidA) * apPinR,
    y: -Math.cos(apMidA) * apPinR,
  };

  const chinaMidA = chinaNode ? (chinaNode.x0 + chinaNode.x1) / 2 : 0;
  const chinaPinR = (ringMid + ringOuter) / 2;
  const chinaPin = {
    x: Math.sin(chinaMidA) * (chinaPinR + 6),
    y: -Math.cos(chinaMidA) * (chinaPinR + 6),
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Sunburst chart">
      <Group left={cx} top={cy}>
        {/* Inner ring — regions */}
        <g data-data-layer="true">
          {regions.map((r) => {
            const d = regionArc(r);
            if (!d) return null;
            return (
              <path
                key={r.data.name}
                d={d}
                fill={REGION_TINTS[r.data.name] ?? "var(--color-ink)"}
                stroke="var(--color-surface)"
                strokeWidth={1.5}
              />
            );
          })}
        </g>

        {/* Outer ring — countries (tinted by parent region, lighter) */}
        <g data-data-layer="true">
          {countries.map((c) => {
            const d = countryArc(c);
            if (!d) return null;
            return (
              <path
                key={`${c.parent?.data.name}-${c.data.name}`}
                d={d}
                fill={tintFor(c)}
                fillOpacity={0.45}
                stroke="var(--color-surface)"
                strokeWidth={1}
              />
            );
          })}
        </g>

        {/* Region labels on the inner ring (only where the sweep is wide enough) */}
        <g data-data-layer="true">
          {regions.map((r) => {
            const sweep = r.x1 - r.x0;
            if (sweep < 0.22) return null;
            const a = (r.x0 + r.x1) / 2;
            const rr = (ringInner + ringMid) / 2;
            const lx = Math.sin(a) * rr;
            const ly = -Math.cos(a) * rr;
            return (
              <text
                key={`lbl-${r.data.name}`}
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fontWeight={500}
                fill={r.data.name === "Asia-Pacific" ? "var(--color-page)" : "var(--color-ink)"}
              >
                {r.data.name.toUpperCase()}
              </text>
            );
          })}
        </g>

        {/* Country labels — only the largest outer slices to avoid clutter */}
        <g data-data-layer="true">
          {countries.map((c) => {
            const sweep = c.x1 - c.x0;
            if (sweep < 0.14) return null;
            const a = (c.x0 + c.x1) / 2;
            const rr = (ringMid + ringOuter) / 2;
            const lx = Math.sin(a) * rr;
            const ly = -Math.cos(a) * rr;
            return (
              <text
                key={`clbl-${c.parent?.data.name}-${c.data.name}`}
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={8}
                fill="var(--color-ink)"
              >
                {c.data.name}
              </text>
            );
          })}
        </g>

        {/* Centre — root total */}
        <g data-data-layer="true">
          <text
            x={0}
            y={-6}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={16}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            {Math.round(total / 100) / 10}k
          </text>
          <text
            x={0}
            y={12}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            Mt CO₂ · 2024
          </text>
        </g>

        {/* Anchors */}
        {apRegion && (
          <ExplainAnchor
            selector="inner-ring"
            index={1}
            pin={apPin}
            rect={{
              x: -ringMid,
              y: -ringMid,
              width: ringMid * 2,
              height: ringMid * 2,
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        <ExplainAnchor
          selector="outer-ring"
          index={2}
          pin={{ x: 0, y: -ringOuter - 4 }}
          rect={{
            x: -ringOuter,
            y: -ringOuter,
            width: ringOuter * 2,
            height: ringOuter * 2 - (ringMid * 2 - 2),
          }}
        >
          <g />
        </ExplainAnchor>

        {chinaNode && (
          <ExplainAnchor
            selector="slice"
            index={3}
            pin={chinaPin}
            rect={{
              x: chinaPin.x - 14,
              y: chinaPin.y - 14,
              width: 28,
              height: 28,
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        <ExplainAnchor
          selector="angle"
          index={4}
          pin={{ x: ringMid + 14, y: 0 }}
          rect={{
            x: ringInner,
            y: -8,
            width: ringMid - ringInner,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        <ExplainAnchor
          selector="centre"
          index={5}
          pin={{ x: -ringInner - 6, y: ringInner + 4 }}
          rect={{
            x: -ringInner,
            y: -ringInner,
            width: ringInner * 2,
            height: ringInner * 2,
          }}
        >
          <g />
        </ExplainAnchor>

        <ExplainAnchor
          selector="radial-level"
          index={6}
          pin={{ x: -ringOuter - 6, y: -ringOuter + 14 }}
          rect={{
            x: -ringOuter - 2,
            y: -2,
            width: ringOuter + 2,
            height: 4,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
