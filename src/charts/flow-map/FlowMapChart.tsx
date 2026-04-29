"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Annual passenger flow (millions, 2023/24, rough IATA-published figures
// rounded for legibility) on non-stop routes out of London Heathrow. One
// origin, eleven destinations — enough to show the hub pile-up without
// the long-haul curves reading as straight lines.
type Flow = {
  code: string;
  city: string;
  lat: number;
  lng: number;
  paxM: number; // annual passengers, millions
  // Label offset in px from the destination dot — tuned per-point so the
  // hub pile-up doesn't stack labels on top of each other.
  lx: number;
  ly: number;
};

const ORIGIN = { code: "LHR", city: "London", lat: 51.47, lng: -0.45 };

const FLOWS: ReadonlyArray<Flow> = [
  { code: "JFK", city: "New York", lat: 40.64, lng: -73.78, paxM: 3.0, lx: 6, ly: 4 },
  { code: "LAX", city: "Los Angeles", lat: 33.94, lng: -118.41, paxM: 1.5, lx: 6, ly: 4 },
  { code: "GRU", city: "São Paulo", lat: -23.43, lng: -46.47, paxM: 0.9, lx: 6, ly: 4 },
  { code: "MAD", city: "Madrid", lat: 40.47, lng: -3.57, paxM: 2.2, lx: -6, ly: 12 },
  { code: "FRA", city: "Frankfurt", lat: 50.03, lng: 8.56, paxM: 2.1, lx: 6, ly: -4 },
  { code: "DXB", city: "Dubai", lat: 25.25, lng: 55.36, paxM: 2.6, lx: 6, ly: 4 },
  { code: "JNB", city: "Johannesburg", lat: -26.14, lng: 28.24, paxM: 0.7, lx: 6, ly: 4 },
  { code: "BOM", city: "Mumbai", lat: 19.09, lng: 72.87, paxM: 0.9, lx: 6, ly: -4 },
  { code: "SIN", city: "Singapore", lat: 1.36, lng: 103.99, paxM: 1.2, lx: 6, ly: 4 },
  { code: "HND", city: "Tokyo", lat: 35.55, lng: 139.78, paxM: 0.8, lx: 6, ly: 4 },
  { code: "SYD", city: "Sydney", lat: -33.95, lng: 151.18, paxM: 0.5, lx: 6, ly: 4 },
];

// Simplified continent silhouettes as rectangles + polygons in lat/lng space.
// These are intentionally coarse — the chart's point is the flow pattern,
// not cartographic accuracy.
const CONTINENTS: ReadonlyArray<{ name: string; points: Array<[number, number]> }> = [
  // North America — a rough trapezoid
  {
    name: "NA",
    points: [
      [-168, 72], [-52, 72], [-52, 48], [-80, 25], [-97, 15],
      [-106, 30], [-125, 40], [-168, 60],
    ],
  },
  // South America — a narrow wedge
  {
    name: "SA",
    points: [
      [-82, 12], [-60, 12], [-35, -5], [-38, -30], [-55, -55], [-72, -55], [-82, -15],
    ],
  },
  // Europe
  {
    name: "EU",
    points: [
      [-10, 70], [30, 70], [40, 60], [40, 40], [10, 36], [-10, 40],
    ],
  },
  // Africa
  {
    name: "AF",
    points: [
      [-17, 36], [10, 36], [35, 30], [52, 10], [42, -15], [18, -35], [-5, -10], [-17, 15],
    ],
  },
  // Asia
  {
    name: "AS",
    points: [
      [40, 70], [180, 70], [140, 50], [125, 10], [100, 5], [75, 8],
      [60, 25], [40, 40],
    ],
  },
  // Oceania
  {
    name: "OC",
    points: [
      [113, -12], [153, -12], [153, -38], [115, -34],
    ],
  },
];

interface Props {
  width: number;
  height: number;
}

export function FlowMapChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 28, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Linear lat/lng → screen projection over a global extent. Trim
  // Antarctica off the bottom so the usable latitude band sits roughly
  // 75° N to -55° S. Longitude is full -180..180.
  const lngMin = -170;
  const lngMax = 180;
  const latMin = -55;
  const latMax = 75;

  const project = (lat: number, lng: number): { x: number; y: number } => ({
    x: ((lng - lngMin) / (lngMax - lngMin)) * iw,
    y: ih - ((lat - latMin) / (latMax - latMin)) * ih,
  });

  const origin = project(ORIGIN.lat, ORIGIN.lng);

  // Max volume for stroke-width encoding.
  const maxPax = Math.max(...FLOWS.map((f) => f.paxM));
  const strokeW = (paxM: number) => 0.6 + (paxM / maxPax) * 2.6;

  // Bezier arc from origin to destination. The control point is offset
  // perpendicular to the chord, with magnitude proportional to chord
  // length — long-haul curves bulge more than short-haul so the pile-up
  // at the hub spreads out and the long routes don't read as straight
  // lines. Side (up/down) is chosen by destination longitude so arcs
  // fan out symmetrically from London.
  const arcPath = (sx: number, sy: number, tx: number, ty: number, toLng: number): string => {
    const mx = (sx + tx) / 2;
    const my = (sy + ty) / 2;
    const dx = tx - sx;
    const dy = ty - sy;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 0.5) return `M${sx} ${sy} L${tx} ${ty}`;
    // Perpendicular unit vector — rotate (dx,dy) 90° anticlockwise.
    const nx = -dy / len;
    const ny = dx / len;
    // Longer routes bulge harder; sign flips for westbound so arcs
    // fan into the upper hemisphere (European convention for great-
    // circle shortcuts over the pole — not literally correct here, but
    // keeps the chart readable).
    const side = toLng < ORIGIN.lng ? 1 : -1;
    const offset = side * len * 0.28;
    const cx = mx + nx * offset;
    const cy = my + ny * offset;
    return `M${sx} ${sy} Q${cx} ${cy} ${tx} ${ty}`;
  };

  const polyPath = (points: Array<[number, number]>): string => {
    const pts = points.map(([lng, lat]) => project(lat, lng));
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";
  };

  // Representative destination for the "curve" anchor — LHR → SIN is
  // the longest westbound-over-Europe Bezier and shows the curvature
  // encoding clearly. JFK is the busiest transatlantic destination.
  const sin = FLOWS.find((f) => f.code === "SIN");
  const jfk = FLOWS.find((f) => f.code === "JFK");
  const sinProj = sin ? project(sin.lat, sin.lng) : origin;
  const jfkProj = jfk ? project(jfk.lat, jfk.lng) : origin;

  // Volume-encoding anchor — the thickest arc is LHR→JFK.
  const jfkMid = jfk
    ? {
        x: (origin.x + jfkProj.x) / 2,
        y: (origin.y + jfkProj.y) / 2 - 18,
      }
    : { x: iw / 2, y: ih / 2 };

  // Curvature anchor — midpoint of LHR→SIN arc's bulge.
  const sinMid = sin
    ? {
        x: (origin.x + sinProj.x) / 2,
        y: (origin.y + sinProj.y) / 2,
      }
    : { x: iw / 2, y: ih / 2 };

  // Continent anchor — rect around Africa silhouette.
  const afContinent = CONTINENTS.find((c) => c.name === "AF");
  const afRect = afContinent
    ? (() => {
        const pts = afContinent.points.map(([lng, lat]) => project(lat, lng));
        const xs = pts.map((p) => p.x);
        const ys = pts.map((p) => p.y);
        const x0 = Math.min(...xs);
        const y0 = Math.min(...ys);
        const x1 = Math.max(...xs);
        const y1 = Math.max(...ys);
        return {
          x: Math.max(0, x0),
          y: Math.max(0, y0),
          width: Math.max(1, Math.min(iw, x1) - Math.max(0, x0)),
          height: Math.max(1, Math.min(ih, y1) - Math.max(0, y0)),
        };
      })()
    : { x: 0, y: 0, width: iw, height: ih };

  const clampRect = (r: { x: number; y: number; width: number; height: number }) => ({
    x: Math.max(0, r.x),
    y: Math.max(0, r.y),
    width: Math.max(1, Math.min(iw - Math.max(0, r.x), r.width)),
    height: Math.max(1, Math.min(ih - Math.max(0, r.y), r.height)),
  });

  return (
    <svg width={width} height={height} role="img" aria-label="Flow map">
      <Group left={margin.left} top={margin.top}>
        {/* Continent silhouettes — hairline fill, very low contrast so
            the flow arcs read as the subject. */}
        <g data-data-layer="true">
          {CONTINENTS.map((c) => (
            <path
              key={c.name}
              d={polyPath(c.points)}
              fill="var(--color-ink)"
              fillOpacity={0.05}
              stroke="var(--color-hairline)"
              strokeWidth={0.75}
            />
          ))}
        </g>

        {/* Flow arcs — Bezier from LHR to each destination. Drawn before
            markers so dots sit on top. */}
        <g data-data-layer="true" fill="none">
          {FLOWS.map((f) => {
            const p = project(f.lat, f.lng);
            return (
              <path
                key={`arc-${f.code}`}
                d={arcPath(origin.x, origin.y, p.x, p.y, f.lng)}
                stroke="var(--color-ink)"
                strokeOpacity={0.55}
                strokeWidth={strokeW(f.paxM)}
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* Destination markers + labels. Hollow circle = destination;
            filled circle = origin hub (rendered after the loop so it
            sits on top of any overlapping arcs). */}
        <g data-data-layer="true">
          {FLOWS.map((f) => {
            const p = project(f.lat, f.lng);
            return (
              <g key={`mk-${f.code}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={2.6}
                  fill="var(--color-surface)"
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                />
                <text
                  x={p.x + f.lx}
                  y={p.y + f.ly}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink)"
                  textAnchor={f.lx < 0 ? "end" : "start"}
                >
                  {f.code}
                </text>
              </g>
            );
          })}

          {/* Origin hub — LHR. Filled dot, slightly larger. */}
          <circle
            cx={origin.x}
            cy={origin.y}
            r={3.6}
            fill="var(--color-ink)"
          />
          <text
            x={origin.x - 6}
            y={origin.y - 8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
            textAnchor="end"
          >
            LHR
          </text>
        </g>

        {/* Anchor 1 — the origin hub */}
        <ExplainAnchor
          selector="origin-hub"
          index={1}
          pin={{ x: Math.max(14, origin.x - 16), y: Math.max(14, origin.y - 18) }}
          rect={clampRect({ x: origin.x - 10, y: origin.y - 10, width: 20, height: 20 })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2 — a curve (LHR→SIN, a long easterly route that
            shows the distance-proportional curvature clearly). */}
        <ExplainAnchor
          selector="flow-curve"
          index={2}
          pin={{
            x: Math.max(14, Math.min(iw - 14, sinMid.x)),
            y: Math.max(14, Math.min(ih - 14, sinMid.y + 18)),
          }}
          rect={clampRect({
            x: Math.min(origin.x, sinProj.x),
            y: Math.min(origin.y, sinProj.y) - 8,
            width: Math.abs(sinProj.x - origin.x),
            height: Math.abs(sinProj.y - origin.y) + 32,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — a destination marker (JFK). */}
        <ExplainAnchor
          selector="destination-marker"
          index={3}
          pin={{
            x: Math.max(14, Math.min(iw - 14, jfkProj.x - 14)),
            y: Math.max(14, Math.min(ih - 14, jfkProj.y - 14)),
          }}
          rect={clampRect({ x: jfkProj.x - 7, y: jfkProj.y - 7, width: 14, height: 14 })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4 — curvature encoding (the Bezier bulge itself). We
            pin on the mid-segment of the LHR→SIN arc where the control-
            point offset is most visible. */}
        <ExplainAnchor
          selector="curvature-encoding"
          index={4}
          pin={{
            x: Math.max(14, Math.min(iw - 14, (origin.x + sinProj.x) / 2 + 20)),
            y: Math.max(14, Math.min(ih - 14, (origin.y + sinProj.y) / 2 - 30)),
          }}
          rect={clampRect({
            x: Math.min(origin.x, sinProj.x) + 20,
            y: Math.min(origin.y, sinProj.y) - 24,
            width: Math.max(20, Math.abs(sinProj.x - origin.x) - 40),
            height: 26,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — stroke-width encoding (volume). Pinned on the
            thickest arc (LHR→JFK). */}
        <ExplainAnchor
          selector="stroke-width-volume"
          index={5}
          pin={{
            x: Math.max(14, Math.min(iw - 14, jfkMid.x)),
            y: Math.max(14, Math.min(ih - 14, jfkMid.y)),
          }}
          rect={clampRect({
            x: Math.min(origin.x, jfkProj.x),
            y: Math.min(origin.y, jfkProj.y) - 6,
            width: Math.max(20, Math.abs(jfkProj.x - origin.x)),
            height: Math.max(16, Math.abs(jfkProj.y - origin.y) + 12),
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6 — continent silhouette (Africa). */}
        <ExplainAnchor
          selector="continent-silhouette"
          index={6}
          pin={{
            x: Math.max(14, Math.min(iw - 14, afRect.x + afRect.width / 2)),
            y: Math.max(14, Math.min(ih - 14, afRect.y + afRect.height + 10)),
          }}
          rect={afRect}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
