"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Tissot's Indicatrix on a Mercator projection.
//
// On Mercator, a small circle of fixed angular radius r on the sphere renders
// as an ellipse whose horizontal and vertical radii are BOTH multiplied by
// sec(φ), where φ is latitude. Near the equator this factor is ~1 (circles
// stay small and round); at φ = ±60° it is 2 (circles doubled); at φ = ±75°
// it is ~3.86, which is why Greenland on a Mercator-projected school-room
// map reads "larger than Africa" despite being 14× smaller in reality.
//
// We render circles at latitudes ±60°, ±30°, 0° and longitudes -180..180
// every 60°. The drawable Mercator strip is clamped to roughly ±70° of
// latitude because the projection runs to infinity at the poles.

const LATS = [-60, -30, 0, 30, 60] as const;
const LONS = [-180, -120, -60, 0, 60, 120, 180] as const;
const LAT_CLAMP = 70; // clamp the Mercator strip to ±70°

// Mercator y: ln(tan(π/4 + φ/2)). We compute this in radians.
function mercatorY(latDeg: number): number {
  const phi = (latDeg * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + phi / 2));
}

// A crude "continents" outline as closed polyline paths in lon/lat space.
// These are intentionally rough — just enough that the reader anchors which
// projection they're looking at. Numbers are degrees.
const CONTINENT_PATHS: ReadonlyArray<ReadonlyArray<[number, number]>> = [
  // North America — from Alaska down to Panama, across to Labrador.
  [
    [-168, 65], [-160, 70], [-140, 69], [-125, 60], [-123, 49], [-124, 40],
    [-117, 33], [-108, 25], [-98, 19], [-87, 16], [-83, 9], [-78, 9],
    [-82, 22], [-80, 25], [-75, 35], [-70, 42], [-66, 45], [-60, 50],
    [-55, 52], [-60, 58], [-75, 62], [-85, 67], [-100, 70], [-120, 71],
    [-140, 70], [-155, 68], [-168, 65],
  ],
  // South America — Caribbean coast down to Tierra del Fuego.
  [
    [-80, 10], [-72, 12], [-60, 10], [-50, 0], [-40, -5], [-35, -8],
    [-38, -15], [-42, -23], [-50, -32], [-58, -40], [-68, -52], [-72, -55],
    [-75, -45], [-72, -35], [-74, -20], [-80, -10], [-82, 0], [-80, 10],
  ],
  // Africa — Mediterranean coast down and around the Cape.
  [
    [-17, 28], [-5, 35], [10, 37], [20, 32], [32, 31], [43, 12],
    [51, 11], [42, 0], [40, -10], [37, -18], [32, -28], [20, -34],
    [18, -34], [12, -15], [8, -2], [-5, 5], [-17, 15], [-17, 28],
  ],
  // Eurasia — one blob from Portugal to Kamchatka.
  [
    [-10, 36], [5, 43], [12, 45], [30, 45], [40, 45], [55, 40],
    [70, 30], [78, 20], [88, 22], [100, 12], [110, 10], [120, 23],
    [130, 34], [141, 45], [155, 55], [160, 62], [150, 68], [120, 72],
    [90, 72], [60, 72], [30, 70], [12, 67], [5, 60], [-5, 55], [-10, 48],
    [-10, 36],
  ],
  // Australia — cartoonishly simple.
  [
    [113, -22], [130, -12], [145, -15], [153, -28], [146, -39],
    [135, -34], [120, -34], [113, -28], [113, -22],
  ],
  // Greenland — big, because Mercator will magnify it. That's the point.
  [
    [-50, 60], [-30, 60], [-20, 70], [-22, 80], [-40, 83],
    [-55, 80], [-60, 75], [-55, 65], [-50, 60],
  ],
];

interface Props {
  width: number;
  height: number;
}

export function TissotIndicatrix({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Lon linear maps -180..180 to x range.
  const xScale = scaleLinear({ domain: [-180, 180], range: [0, iw] });
  // Mercator y: map mercatorY(-70)..mercatorY(70) to [ih, 0].
  const yMerc = scaleLinear({
    domain: [mercatorY(-LAT_CLAMP), mercatorY(LAT_CLAMP)],
    range: [ih, 0],
  });

  // Base circle radius (in map-x degrees-equivalent) — we pick a pixel-space
  // "equator radius" and scale it by sec(φ) on the fly.
  const baseRadiusPx = Math.max(4, Math.min(iw, ih) * 0.045);

  function latToY(lat: number): number {
    const clamped = Math.max(-LAT_CLAMP, Math.min(LAT_CLAMP, lat));
    return yMerc(mercatorY(clamped));
  }

  // Sec factor, clamped — sec(60°) = 2, sec(75°) ≈ 3.86.
  function secLat(lat: number): number {
    return 1 / Math.cos((lat * Math.PI) / 180);
  }

  // Continent paths projected to svg coords, as SVG "d" strings.
  const continentDs = CONTINENT_PATHS.map((ring) =>
    ring
      .map(([lon, lat], i) => {
        const x = xScale(lon);
        const y = latToY(lat);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ") + " Z",
  );

  // Graticule — meridians every 60°, parallels at each indicatrix lat + the
  // clamp edges. Keeps the projection legible without overcrowding.
  const meridianLons = LONS;
  const parallelLats = [-LAT_CLAMP, -60, -30, 0, 30, 60, LAT_CLAMP];

  // Indicatrix circle positions.
  type Tissot = { lon: number; lat: number; r: number; cx: number; cy: number };
  const tissots: Tissot[] = [];
  for (const lat of LATS) {
    for (const lon of LONS) {
      // Skip the duplicate antimeridian circle (lon=180 === lon=-180).
      if (lon === 180) continue;
      const r = baseRadiusPx * secLat(lat);
      tissots.push({
        lon,
        lat,
        r,
        cx: xScale(lon),
        cy: latToY(lat),
      });
    }
  }

  // Pick focal circles for anchors.
  const equatorCircle = tissots.find((t) => t.lat === 0 && t.lon === 0)!;
  const poleCircle = tissots.find((t) => t.lat === 60 && t.lon === 0)!;
  const midCircle = tissots.find((t) => t.lat === 30 && t.lon === 60)!;

  return (
    <svg width={width} height={height} role="img" aria-label="Tissot's indicatrix on Mercator projection">
      <Group left={margin.left} top={margin.top}>
        {/* Map frame and graticule */}
        <g data-data-layer="true">
          <rect
            x={0}
            y={0}
            width={iw}
            height={ih}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
          {/* Meridians */}
          {meridianLons.map((lon) => (
            <line
              key={`m-${lon}`}
              x1={xScale(lon)}
              x2={xScale(lon)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeWidth={1}
            />
          ))}
          {/* Parallels */}
          {parallelLats.map((lat) => (
            <line
              key={`p-${lat}`}
              x1={0}
              x2={iw}
              y1={latToY(lat)}
              y2={latToY(lat)}
              stroke="var(--color-hairline)"
              strokeWidth={1}
              strokeDasharray={lat === 0 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* Continents — simplified world outline in hairline ink. */}
        <g data-data-layer="true">
          {continentDs.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="rgba(26,22,20,0.05)"
              stroke="var(--color-ink-mute)"
              strokeWidth={0.8}
              strokeLinejoin="round"
            />
          ))}
        </g>

        {/* Tissot circles — each shows how a small circle on the sphere
            distorts under Mercator at that point. */}
        <g data-data-layer="true">
          {tissots.map((t) => (
            <circle
              key={`${t.lat}-${t.lon}`}
              cx={t.cx}
              cy={t.cy}
              r={t.r}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.2}
            />
          ))}
        </g>

        {/* Axis labels — longitude ticks along the bottom, latitude along the left. */}
        <g data-data-layer="true">
          {LONS.map((lon) => (
            <text
              key={`lon-${lon}`}
              x={xScale(lon)}
              y={ih + 14}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              {lon}°
            </text>
          ))}
          {[-60, -30, 0, 30, 60].map((lat) => (
            <text
              key={`lat-${lat}`}
              x={-8}
              y={latToY(lat)}
              textAnchor="end"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              {lat}°
            </text>
          ))}
          <text
            x={iw / 2}
            y={ih + 32}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            LONGITUDE
          </text>
          <text
            x={-44}
            y={-6}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            LATITUDE
          </text>
        </g>

        {/* Anchor 1 — equator circle (undistorted reference). */}
        <ExplainAnchor
          selector="equator-circle"
          index={1}
          pin={{ x: equatorCircle.cx + equatorCircle.r + 10, y: equatorCircle.cy }}
          rect={{
            x: Math.max(0, equatorCircle.cx - equatorCircle.r - 2),
            y: Math.max(0, equatorCircle.cy - equatorCircle.r - 2),
            width: Math.min(iw, equatorCircle.r * 2 + 4),
            height: Math.min(ih, equatorCircle.r * 2 + 4),
          }}
        >
          <circle
            cx={equatorCircle.cx}
            cy={equatorCircle.cy}
            r={equatorCircle.r + 3}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
        </ExplainAnchor>

        {/* Anchor 2 — mid-latitude circle (modest distortion). */}
        <ExplainAnchor
          selector="mid-latitude-circle"
          index={2}
          pin={{ x: midCircle.cx + midCircle.r + 10, y: midCircle.cy }}
          rect={{
            x: Math.max(0, midCircle.cx - midCircle.r - 2),
            y: Math.max(0, midCircle.cy - midCircle.r - 2),
            width: Math.min(iw, midCircle.r * 2 + 4),
            height: Math.min(ih, midCircle.r * 2 + 4),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — 60°N circle (2× equator, the headline distortion). */}
        <ExplainAnchor
          selector="polar-circle"
          index={3}
          pin={{ x: poleCircle.cx, y: Math.max(12, poleCircle.cy - poleCircle.r - 12) }}
          rect={{
            x: Math.max(0, poleCircle.cx - poleCircle.r - 2),
            y: Math.max(0, poleCircle.cy - poleCircle.r - 2),
            width: Math.min(iw, poleCircle.r * 2 + 4),
            height: Math.min(ih, poleCircle.r * 2 + 4),
          }}
        >
          <circle
            cx={poleCircle.cx}
            cy={poleCircle.cy}
            r={poleCircle.r + 3}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="3 2"
          />
        </ExplainAnchor>

        {/* Anchor 4 — graticule / projection grid. */}
        <ExplainAnchor
          selector="graticule"
          index={4}
          pin={{ x: xScale(-120) + 6, y: latToY(-60) + 4 }}
          rect={{
            x: Math.max(0, xScale(-180)),
            y: latToY(LAT_CLAMP),
            width: xScale(-60) - xScale(-180),
            height: latToY(-LAT_CLAMP) - latToY(LAT_CLAMP),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — continent outline (Greenland, the famous size-lie). */}
        <ExplainAnchor
          selector="continent-outline"
          index={5}
          pin={{ x: xScale(-35), y: latToY(72) - 4 }}
          rect={{
            x: Math.max(0, xScale(-60)),
            y: Math.max(0, latToY(LAT_CLAMP)),
            width: xScale(-15) - xScale(-60),
            height: latToY(55) - latToY(LAT_CLAMP),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6 — latitude axis (the distortion axis). */}
        <ExplainAnchor
          selector="latitude-axis"
          index={6}
          pin={{ x: -28, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
