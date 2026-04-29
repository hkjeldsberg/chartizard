"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ---------------------------------------------------------------------------
// World base map — hand-traced continental outlines in a 0..200 × 0..120
// coordinate space. Equirectangular-ish: x maps to longitude, y to latitude
// (y inverted: 0 = top = ~80°N, 120 = bottom = ~60°S).
// These are rough blobs — enough to recognise continents, not topographically
// accurate.
// ---------------------------------------------------------------------------

// Each continent is a single polygon path in data-space coords.
const CONTINENTS = [
  {
    id: "north-america",
    d: "M 10,18 L 18,12 L 38,10 L 46,14 L 52,20 L 52,32 L 46,40 L 40,50 L 36,58 L 30,60 L 24,56 L 18,48 L 12,38 L 8,28 Z",
  },
  {
    id: "south-america",
    d: "M 36,58 L 42,56 L 48,60 L 50,70 L 48,82 L 44,92 L 38,98 L 32,96 L 28,88 L 28,78 L 30,66 Z",
  },
  {
    id: "europe",
    d: "M 84,12 L 92,10 L 104,12 L 108,16 L 106,22 L 100,26 L 94,26 L 88,22 L 84,18 Z",
  },
  {
    id: "africa",
    d: "M 88,30 L 96,26 L 106,26 L 112,30 L 116,40 L 114,52 L 112,64 L 108,76 L 102,84 L 96,82 L 90,74 L 86,62 L 84,50 L 84,40 Z",
  },
  {
    id: "asia",
    d: "M 108,12 L 126,8 L 148,10 L 162,14 L 172,18 L 174,26 L 168,32 L 158,36 L 144,38 L 132,36 L 120,32 L 112,28 L 106,22 Z",
  },
  {
    id: "southeast-asia",
    d: "M 150,38 L 162,36 L 170,40 L 172,50 L 164,54 L 154,52 L 148,46 Z",
  },
  {
    id: "japan-korea",
    d: "M 170,20 L 178,18 L 184,22 L 180,28 L 172,28 Z",
  },
  {
    id: "australia",
    d: "M 152,68 L 168,64 L 180,66 L 186,76 L 180,86 L 164,90 L 152,86 L 146,78 L 146,70 Z",
  },
];

// ---------------------------------------------------------------------------
// City data — 19 major metro areas with approximate lat/lon and 2023
// population estimates in millions.
// Projected into data space: x = (lon + 180) / 360 × 200, y = (90 - lat) / 150 × 120
// (clamped to approx 80°N–60°S range, giving a 140° latitude spread → scale ~0.857 per degree)
// ---------------------------------------------------------------------------

interface City {
  name: string;
  pop: number; // millions
  x: number; // data-space 0..200
  y: number; // data-space 0..120
}

// Projection helper (lat/lon → data coords)
// lon: -180..180 → 0..200  (x = (lon+180)/360*200)
// lat: 80..-60  → 0..120   (y = (80-lat)/140*120)
function proj(lon: number, lat: number): [number, number] {
  const x = ((lon + 180) / 360) * 200;
  const y = ((80 - lat) / 140) * 120;
  return [x, y];
}

const CITIES: ReadonlyArray<City> = [
  { name: "Tokyo", pop: 37.4, ...(() => { const [x,y]=proj(139.7,35.7); return {x,y}; })() },
  { name: "Delhi", pop: 32.9, ...(() => { const [x,y]=proj(77.2,28.6); return {x,y}; })() },
  { name: "Shanghai", pop: 28.5, ...(() => { const [x,y]=proj(121.5,31.2); return {x,y}; })() },
  { name: "Dhaka", pop: 22.5, ...(() => { const [x,y]=proj(90.4,23.7); return {x,y}; })() },
  { name: "São Paulo", pop: 22.4, ...(() => { const [x,y]=proj(-46.6,-23.5); return {x,y}; })() },
  { name: "Mexico City", pop: 22.0, ...(() => { const [x,y]=proj(-99.1,19.4); return {x,y}; })() },
  { name: "Cairo", pop: 21.3, ...(() => { const [x,y]=proj(31.2,30.0); return {x,y}; })() },
  { name: "Mumbai", pop: 20.7, ...(() => { const [x,y]=proj(72.9,19.1); return {x,y}; })() },
  { name: "Beijing", pop: 20.4, ...(() => { const [x,y]=proj(116.4,39.9); return {x,y}; })() },
  { name: "Osaka", pop: 19.1, ...(() => { const [x,y]=proj(135.5,34.7); return {x,y}; })() },
  { name: "New York", pop: 18.8, ...(() => { const [x,y]=proj(-74.0,40.7); return {x,y}; })() },
  { name: "Karachi", pop: 16.1, ...(() => { const [x,y]=proj(67.0,24.9); return {x,y}; })() },
  { name: "Buenos Aires", pop: 15.3, ...(() => { const [x,y]=proj(-58.4,-34.6); return {x,y}; })() },
  { name: "Istanbul", pop: 15.2, ...(() => { const [x,y]=proj(29.0,41.0); return {x,y}; })() },
  { name: "Lagos", pop: 14.8, ...(() => { const [x,y]=proj(3.4,6.5); return {x,y}; })() },
  { name: "Manila", pop: 14.0, ...(() => { const [x,y]=proj(120.9,14.6); return {x,y}; })() },
  { name: "Rio de Janeiro", pop: 13.4, ...(() => { const [x,y]=proj(-43.2,-22.9); return {x,y}; })() },
  { name: "Paris", pop: 11.1, ...(() => { const [x,y]=proj(2.3,48.9); return {x,y}; })() },
  { name: "London", pop: 9.3, ...(() => { const [x,y]=proj(-0.1,51.5); return {x,y}; })() },
];

// Max population for scaling
const MAX_POP = Math.max(...CITIES.map((c) => c.pop));

// Scale legend reference values
const LEGEND_VALUES = [5, 15, 35]; // millions

interface Props {
  width: number;
  height: number;
}

export function ProportionalSymbolMap({ width, height }: Props) {
  const margin = { top: 16, right: 80, bottom: 32, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Scale data-space (0..200 × 0..120) to pixel space
  const scaleX = iw / 200;
  const scaleY = ih / 120;
  const toX = (d: number) => d * scaleX;
  const toY = (d: number) => d * scaleY;

  // Proportional symbol: radius = sqrt(pop / maxPop) × maxR
  // Area ∝ pop (area = π·r², r = sqrt(pop/maxPop)·maxR → area ∝ pop)
  const maxR = Math.max(4, Math.min(28, iw * 0.07));

  const rForPop = (pop: number) => Math.sqrt(pop / MAX_POP) * maxR;

  // Sort cities largest-first so smaller circles render on top
  const sortedCities = useMemo(
    () => [...CITIES].sort((a, b) => b.pop - a.pop),
    [],
  );

  // Labels for the 4 largest cities
  const labelSet = new Set(["Tokyo", "Delhi", "Shanghai", "New York"]);

  // Anchor reference cities
  const tokyo = CITIES.find((c) => c.name === "Tokyo")!;
  const london = CITIES.find((c) => c.name === "London")!;
  const buenos = CITIES.find((c) => c.name === "Buenos Aires")!;

  // Overlap pair: Tokyo + Osaka are close
  const osaka = CITIES.find((c) => c.name === "Osaka")!;

  const tokyoX = toX(tokyo.x);
  const tokyoY = toY(tokyo.y);
  const tokyoR = rForPop(tokyo.pop);
  const londonX = toX(london.x);
  const londonY = toY(london.y);
  const londonR = rForPop(london.pop);
  const buenosX = toX(buenos.x);
  const buenosY = toY(buenos.y);
  const buenosR = rForPop(buenos.pop);
  const osakaX = toX(osaka.x);
  const osakaY = toY(osaka.y);
  const osakaR = rForPop(osaka.pop);

  // Legend geometry — right margin
  const legendX = iw + 10;
  const legendBaseY = 8;

  // Legend circle radii
  const legendRs = LEGEND_VALUES.map(rForPop);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Proportional symbol map of major world city populations — circle area proportional to population"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Continental outlines — base map */}
        <ExplainAnchor
          selector="base-map"
          index={5}
          pin={{ x: toX(30), y: toY(30) - 14 }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g data-data-layer="true">
            {CONTINENTS.map((c) => {
              // Scale path from data-space to pixel-space
              const scaled = c.d.replace(
                /(-?\d+\.?\d*),(-?\d+\.?\d*)/g,
                (_, sx, sy) =>
                  `${(parseFloat(sx) * scaleX).toFixed(1)},${(parseFloat(sy) * scaleY).toFixed(1)}`,
              );
              return (
                <path
                  key={c.id}
                  d={scaled}
                  fill="var(--color-ink)"
                  fillOpacity={0.07}
                  stroke="var(--color-ink)"
                  strokeWidth={0.5}
                  strokeOpacity={0.3}
                />
              );
            })}
          </g>
        </ExplainAnchor>

        {/* Proportional circles — sorted largest-first (smallest on top) */}
        <g data-data-layer="true">
          {sortedCities.map((city) => {
            const cx = toX(city.x);
            const cy = toY(city.y);
            const r = rForPop(city.pop);
            return (
              <circle
                key={city.name}
                cx={cx}
                cy={cy}
                r={r}
                fill="var(--color-ink)"
                fillOpacity={0.28}
                stroke="var(--color-ink)"
                strokeWidth={0.6}
                strokeOpacity={0.5}
              />
            );
          })}
        </g>

        {/* City labels for 4 largest */}
        <g data-data-layer="true">
          {CITIES.filter((c) => labelSet.has(c.name)).map((city) => {
            const cx = toX(city.x);
            const cy = toY(city.y);
            const r = rForPop(city.pop);
            return (
              <text
                key={`label-${city.name}`}
                x={cx}
                y={cy - r - 3}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={Math.max(7, Math.min(9, maxR * 0.3))}
                fill="var(--color-ink)"
                fillOpacity={0.7}
              >
                {city.name}
              </text>
            );
          })}
        </g>

        {/* Anchor 1 — Tokyo: the largest symbol */}
        <ExplainAnchor
          selector="large-symbol"
          index={1}
          pin={{ x: Math.min(iw - 10, tokyoX + tokyoR + 12), y: Math.max(8, tokyoY - tokyoR) }}
          rect={{
            x: Math.max(0, tokyoX - tokyoR),
            y: Math.max(0, tokyoY - tokyoR),
            width: Math.min(iw - Math.max(0, tokyoX - tokyoR), tokyoR * 2),
            height: Math.min(ih - Math.max(0, tokyoY - tokyoR), tokyoR * 2),
          }}
        >
          <circle
            cx={tokyoX}
            cy={tokyoY}
            r={tokyoR}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
        </ExplainAnchor>

        {/* Anchor 2 — London: medium-small symbol */}
        <ExplainAnchor
          selector="small-symbol"
          index={2}
          pin={{ x: Math.max(8, londonX - londonR - 14), y: Math.max(8, londonY - londonR - 6) }}
          rect={{
            x: Math.max(0, londonX - londonR),
            y: Math.max(0, londonY - londonR),
            width: Math.min(iw - Math.max(0, londonX - londonR), londonR * 2),
            height: Math.min(ih - Math.max(0, londonY - londonR), londonR * 2),
          }}
        >
          <circle
            cx={londonX}
            cy={londonY}
            r={londonR}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="3 2"
          />
        </ExplainAnchor>

        {/* Anchor 3 — Area encoding (Tokyo/Osaka overlap demonstrates area-not-radius) */}
        <ExplainAnchor
          selector="area-encoding"
          index={3}
          pin={{
            x: Math.min(iw - 10, (tokyoX + osakaX) / 2 + 20),
            y: Math.max(8, Math.min(tokyoY, osakaY) - 14),
          }}
          rect={{
            x: Math.max(0, Math.min(tokyoX, osakaX) - Math.max(tokyoR, osakaR)),
            y: Math.max(0, Math.min(tokyoY, osakaY) - Math.max(tokyoR, osakaR)),
            width: Math.min(
              iw - Math.max(0, Math.min(tokyoX, osakaX) - Math.max(tokyoR, osakaR)),
              Math.abs(tokyoX - osakaX) + (tokyoR + osakaR) * 2,
            ),
            height: Math.min(
              ih - Math.max(0, Math.min(tokyoY, osakaY) - Math.max(tokyoR, osakaR)),
              Math.abs(tokyoY - osakaY) + (tokyoR + osakaR) * 2,
            ),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4 — Buenos Aires: a southern hemisphere city, demonstrates geographic placement */}
        <ExplainAnchor
          selector="geographic-placement"
          index={4}
          pin={{
            x: Math.max(8, buenosX - buenosR - 14),
            y: Math.min(ih - 8, buenosY + buenosR + 10),
          }}
          rect={{
            x: Math.max(0, buenosX - buenosR),
            y: Math.max(0, buenosY - buenosR),
            width: Math.min(iw - Math.max(0, buenosX - buenosR), buenosR * 2),
            height: Math.min(ih - Math.max(0, buenosY - buenosR), buenosR * 2),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Scale legend */}
        <ExplainAnchor
          selector="scale-legend"
          index={6}
          pin={{ x: Math.min(iw - 6, legendX + 48), y: legendBaseY }}
          rect={{
            x: legendX - 4,
            y: legendBaseY,
            width: 68,
            height: legendRs[legendRs.length - 1] * 2 + 36,
          }}
        >
          <g data-data-layer="true" transform={`translate(${legendX}, ${legendBaseY})`}>
            <text
              x={0}
              y={-2}
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              POP (M)
            </text>
            {LEGEND_VALUES.map((v, i) => {
              const r = legendRs[i];
              // Stack circles top-to-bottom (smallest first for visual clarity)
              const cy =
                legendRs
                  .slice(0, i)
                  .reduce((acc, pr) => acc + pr * 2 + 4, 0) +
                r +
                8;
              return (
                <g key={v}>
                  <circle
                    cx={legendRs[legendRs.length - 1]}
                    cy={cy}
                    r={r}
                    fill="var(--color-ink)"
                    fillOpacity={0.18}
                    stroke="var(--color-ink)"
                    strokeWidth={0.7}
                    strokeOpacity={0.45}
                  />
                  <text
                    x={legendRs[legendRs.length - 1] * 2 + 4}
                    y={cy + 3}
                    fontFamily="var(--font-mono)"
                    fontSize={8}
                    fill="var(--color-ink-soft)"
                  >
                    {v}M
                  </text>
                </g>
              );
            })}
          </g>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
