"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ---------------------------------------------------------------------------
// US region polygons — hand-traced rough outlines in a 0..100 × 0..70
// coordinate space (width × height). Each polygon is a closed set of [x, y]
// vertices in screen-space (y increases downward). Positions approximate the
// contiguous US geographic layout.
// ---------------------------------------------------------------------------

interface Region {
  id: string;
  label: string;
  /** Polygon vertices [x, y] in 0..100 × 0..70 data space */
  poly: ReadonlyArray<[number, number]>;
  /** Relative population weight — used to allocate dot count */
  weight: number;
}

const REGIONS: ReadonlyArray<Region> = [
  {
    id: "west-coast",
    label: "West Coast",
    // CA, OR, WA — tall strip on the left
    poly: [
      [2, 8], [8, 6], [10, 10], [10, 20], [9, 28], [8, 38],
      [7, 45], [5, 52], [3, 58], [2, 62], [2, 8],
    ],
    weight: 0.22, // ~CA(39M)+OR(4.2M)+WA(7.8M) = 51M
  },
  {
    id: "mountain",
    label: "Mountain",
    // ID, MT, WY, CO, NV, UT, AZ, NM
    poly: [
      [10, 8], [22, 6], [24, 12], [24, 38], [22, 52], [18, 56],
      [10, 54], [8, 46], [8, 38], [9, 28], [10, 20], [10, 8],
    ],
    weight: 0.07, // ~25M sparse
  },
  {
    id: "plains",
    label: "Plains",
    // ND, SD, NE, KS, OK
    poly: [
      [24, 6], [38, 6], [40, 10], [40, 42], [38, 46], [24, 44],
      [24, 38], [24, 20], [24, 12], [24, 6],
    ],
    weight: 0.06, // ~18M
  },
  {
    id: "midwest",
    label: "Midwest",
    // MN, WI, MI, IA, IL, IN, OH, MO
    poly: [
      [38, 6], [56, 6], [58, 10], [58, 30], [56, 36], [50, 40],
      [44, 42], [40, 42], [40, 10], [38, 6],
    ],
    weight: 0.12, // ~36M
  },
  {
    id: "great-lakes",
    label: "Great Lakes",
    // NY, PA, NJ — dense NE industrial
    poly: [
      [58, 6], [70, 4], [74, 8], [74, 22], [70, 28], [62, 30],
      [58, 28], [58, 10], [58, 6],
    ],
    weight: 0.12, // ~40M (NY+PA+NJ)
  },
  {
    id: "new-england",
    label: "New England",
    // CT, MA, RI, VT, NH, ME
    poly: [
      [70, 4], [80, 2], [84, 6], [82, 14], [78, 18], [74, 18],
      [74, 12], [74, 8], [70, 4],
    ],
    weight: 0.05, // ~15M
  },
  {
    id: "mid-atlantic",
    label: "Mid-Atlantic",
    // DC, MD, DE, VA, WV, KY
    poly: [
      [62, 30], [74, 28], [78, 32], [76, 40], [70, 44], [64, 46],
      [58, 44], [56, 36], [58, 30], [62, 30],
    ],
    weight: 0.10, // ~28M
  },
  {
    id: "southeast",
    label: "Southeast",
    // NC, SC, GA, FL, AL, MS, TN
    poly: [
      [58, 44], [64, 46], [70, 44], [76, 48], [78, 56], [74, 64],
      [66, 68], [60, 66], [54, 62], [50, 58], [50, 52], [56, 46],
      [58, 44],
    ],
    weight: 0.15, // ~45M
  },
  {
    id: "south-central",
    label: "South Central",
    // TX, LA, AR
    poly: [
      [24, 44], [38, 46], [44, 48], [50, 52], [50, 58], [42, 64],
      [34, 66], [26, 62], [20, 58], [22, 52], [24, 44],
    ],
    weight: 0.11, // ~38M
  },
];

// Total dot allocation: ~1500 dots, 1 dot = 100,000 people.
// Total US pop ~330M → 3300 dots. We'll use 1650 for legibility.
const TOTAL_DOTS = 1650;
const DOT_VALUE = 100_000; // 1 dot = 100,000 people

// Minimal seeded LCG (Lehmer 48271). Returns value in [0,1).
function lcg(seed: number): [number, () => number] {
  let s = seed >>> 0;
  const next = () => {
    s = Math.imul(s, 48271) >>> 0;
    return s / 0x100000000;
  };
  return [s, next];
}

// Check if point [px, py] is inside a polygon using ray-casting.
function pointInPolygon(
  px: number,
  py: number,
  poly: ReadonlyArray<[number, number]>,
): boolean {
  let inside = false;
  const n = poly.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const intersects =
      yi > py !== yj > py &&
      px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

// Compute bounding box of a polygon.
function polyBbox(poly: ReadonlyArray<[number, number]>) {
  const xs = poly.map(([x]) => x);
  const ys = poly.map(([, y]) => y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

interface Dot {
  x: number; // data space 0..100
  y: number; // data space 0..70
  regionId: string;
}

function generateDots(): ReadonlyArray<Dot> {
  const [, rand] = lcg(0xdeadbeef);
  const dots: Dot[] = [];
  const totalWeight = REGIONS.reduce((s, r) => s + r.weight, 0);

  for (const region of REGIONS) {
    const count = Math.round((region.weight / totalWeight) * TOTAL_DOTS);
    const bbox = polyBbox(region.poly);
    let placed = 0;
    let attempts = 0;
    while (placed < count && attempts < count * 40) {
      attempts++;
      const px = bbox.minX + rand() * (bbox.maxX - bbox.minX);
      const py = bbox.minY + rand() * (bbox.maxY - bbox.minY);
      if (pointInPolygon(px, py, region.poly)) {
        dots.push({ x: px, y: py, regionId: region.id });
        placed++;
      }
    }
  }
  return dots;
}

interface Props {
  width: number;
  height: number;
}

export function DotDensityMap({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 52, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Scale: data coords 0..100 (x) and 0..70 (y) → pixel
  const scaleX = iw / 100;
  const scaleY = ih / 70;

  const toX = (d: number) => d * scaleX;
  const toY = (d: number) => d * scaleY;

  // Dots are deterministic — no Math.random() at render time.
  const dots = useMemo(() => generateDots(), []);

  // Build SVG polygon path strings for region outlines.
  const regionPaths = useMemo(
    () =>
      REGIONS.map((r) => {
        const pts = r.poly
          .map(([x, y]) => `${toX(x).toFixed(1)},${toY(y).toFixed(1)}`)
          .join(" ");
        return { id: r.id, label: r.label, pts };
      }),
    [scaleX, scaleY], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Anchor positions (data-space, converted to pixels)
  // 1 — West Coast region polygon
  const wcRegion = REGIONS.find((r) => r.id === "west-coast")!;
  const wcBbox = polyBbox(wcRegion.poly);
  const wcPinX = toX((wcBbox.minX + wcBbox.maxX) / 2);
  const wcPinY = toY(wcBbox.minY - 2);
  const wcRect = {
    x: Math.max(0, toX(wcBbox.minX)),
    y: Math.max(0, toY(wcBbox.minY)),
    width: Math.min(iw - Math.max(0, toX(wcBbox.minX)), toX(wcBbox.maxX) - toX(wcBbox.minX)),
    height: Math.min(ih - Math.max(0, toY(wcBbox.minY)), toY(wcBbox.maxY) - toY(wcBbox.minY)),
  };

  // 2 — Dense cluster anchor (Great Lakes / Northeast — most dots per area)
  const glRegion = REGIONS.find((r) => r.id === "great-lakes")!;
  const glBbox = polyBbox(glRegion.poly);
  const glCx = toX((glBbox.minX + glBbox.maxX) / 2);
  const glCy = toY((glBbox.minY + glBbox.maxY) / 2);

  // 3 — Sparse region anchor (Mountain West)
  const mtRegion = REGIONS.find((r) => r.id === "mountain")!;
  const mtBbox = polyBbox(mtRegion.poly);
  const mtCx = toX((mtBbox.minX + mtBbox.maxX) / 2);
  const mtCy = toY((mtBbox.minY + mtBbox.maxY) / 2);

  // 4 — Individual dot: pick first dot in plains region
  const sampleDot = dots.find((d) => d.regionId === "plains");
  const dotPx = sampleDot ? toX(sampleDot.x) : iw * 0.4;
  const dotPy = sampleDot ? toY(sampleDot.y) : ih * 0.4;

  // 5 — Administrative boundary outlines (the polygon outlines layer)
  const boundaryPinX = toX(50);
  const boundaryPinY = toY(35);

  // 6 — Legend
  const legendX = 8;
  const legendY = ih + 12;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Dot density map of US population — 1 dot = 100,000 people"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Region boundary outlines */}
        <ExplainAnchor
          selector="boundary-outlines"
          index={5}
          pin={{ x: boundaryPinX, y: boundaryPinY - 14 }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g data-data-layer="true">
            {regionPaths.map((r) => (
              <polygon
                key={r.id}
                points={r.pts}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={0.6}
                strokeOpacity={0.35}
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* All dots — the primary data layer */}
        <g data-data-layer="true">
          {dots.map((d, i) => (
            <circle
              key={i}
              cx={toX(d.x)}
              cy={toY(d.y)}
              r={1.5}
              fill="var(--color-ink)"
              fillOpacity={0.55}
            />
          ))}
        </g>

        {/* Anchor 1 — West Coast region polygon */}
        <ExplainAnchor
          selector="region-polygon"
          index={1}
          pin={{ x: wcPinX - 16, y: Math.max(8, wcPinY) }}
          rect={wcRect}
        >
          <polygon
            points={regionPaths.find((r) => r.id === "west-coast")!.pts}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
        </ExplainAnchor>

        {/* Anchor 2 — Dense cluster (Great Lakes / Northeast) */}
        <ExplainAnchor
          selector="dense-cluster"
          index={2}
          pin={{ x: Math.min(iw - 12, glCx + 20), y: Math.max(8, glCy - 16) }}
          rect={{
            x: Math.max(0, toX(glBbox.minX)),
            y: Math.max(0, toY(glBbox.minY)),
            width: Math.min(iw - Math.max(0, toX(glBbox.minX)), toX(glBbox.maxX) - toX(glBbox.minX)),
            height: Math.min(ih - Math.max(0, toY(glBbox.minY)), toY(glBbox.maxY) - toY(glBbox.minY)),
          }}
        >
          <polygon
            points={regionPaths.find((r) => r.id === "great-lakes")!.pts}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="3 2"
          />
        </ExplainAnchor>

        {/* Anchor 3 — Sparse region (Mountain West) */}
        <ExplainAnchor
          selector="sparse-region"
          index={3}
          pin={{ x: mtCx, y: Math.max(8, toY(mtBbox.minY) - 12) }}
          rect={{
            x: Math.max(0, toX(mtBbox.minX)),
            y: Math.max(0, toY(mtBbox.minY)),
            width: Math.min(iw - Math.max(0, toX(mtBbox.minX)), toX(mtBbox.maxX) - toX(mtBbox.minX)),
            height: Math.min(ih - Math.max(0, toY(mtBbox.minY)), toY(mtBbox.maxY) - toY(mtBbox.minY)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4 — Individual dot (with legend context) */}
        <ExplainAnchor
          selector="individual-dot"
          index={4}
          pin={{ x: Math.min(iw - 12, dotPx + 12), y: Math.max(8, dotPy - 10) }}
          rect={{
            x: Math.max(0, dotPx - 6),
            y: Math.max(0, dotPy - 6),
            width: Math.min(iw - Math.max(0, dotPx - 6), 12),
            height: Math.min(ih - Math.max(0, dotPy - 6), 12),
          }}
        >
          <circle
            cx={dotPx}
            cy={dotPy}
            r={3}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
        </ExplainAnchor>

        {/* Legend */}
        <ExplainAnchor
          selector="legend"
          index={6}
          pin={{ x: legendX + 120, y: legendY + 8 }}
          rect={{ x: legendX, y: legendY, width: 230, height: 36 }}
        >
          <g data-data-layer="true">
            {/* Dot sample */}
            <circle
              cx={legendX + 6}
              cy={legendY + 8}
              r={1.5}
              fill="var(--color-ink)"
              fillOpacity={0.55}
            />
            <text
              x={legendX + 14}
              y={legendY + 11}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              1 dot = {DOT_VALUE.toLocaleString()} people
            </text>
            {/* Total count */}
            <text
              x={legendX + 6}
              y={legendY + 26}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              {(TOTAL_DOTS * DOT_VALUE).toLocaleString()} total (approx US population)
            </text>
          </g>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
