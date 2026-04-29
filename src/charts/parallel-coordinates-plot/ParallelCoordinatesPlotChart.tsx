"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Cluster = "classic" | "modern" | "luxury";

interface Car {
  id: string;
  cluster: Cluster;
  mpg: number; // city MPG
  cyl: number; // cylinders
  disp: number; // displacement in cubic inches
  hp: number; // horsepower
  wt: number; // weight in lb
  year: number; // model year
}

// Synthetic car dataset, ~30 rows, three recognisable clusters.
// Values are deterministic; picked by hand so the clusters form coherent
// ribbons across the 6 axes.
const DATA: ReadonlyArray<Car> = [
  // 10 classic American cars — heavy, big V8s, early '70s, thirsty.
  { id: "c1", cluster: "classic", mpg: 10, cyl: 8, disp: 455, hp: 225, wt: 4350, year: 1970 },
  { id: "c2", cluster: "classic", mpg: 11, cyl: 8, disp: 400, hp: 230, wt: 4280, year: 1971 },
  { id: "c3", cluster: "classic", mpg: 13, cyl: 8, disp: 350, hp: 200, wt: 4050, year: 1972 },
  { id: "c4", cluster: "classic", mpg: 12, cyl: 8, disp: 440, hp: 280, wt: 4400, year: 1970 },
  { id: "c5", cluster: "classic", mpg: 14, cyl: 8, disp: 318, hp: 180, wt: 3850, year: 1974 },
  { id: "c6", cluster: "classic", mpg: 15, cyl: 8, disp: 302, hp: 185, wt: 3800, year: 1975 },
  { id: "c7", cluster: "classic", mpg: 11, cyl: 8, disp: 429, hp: 260, wt: 4300, year: 1971 },
  { id: "c8", cluster: "classic", mpg: 13, cyl: 8, disp: 383, hp: 210, wt: 4100, year: 1973 },
  { id: "c9", cluster: "classic", mpg: 16, cyl: 8, disp: 305, hp: 190, wt: 3900, year: 1975 },
  { id: "c10", cluster: "classic", mpg: 12, cyl: 8, disp: 360, hp: 220, wt: 4200, year: 1972 },

  // 10 modern efficient — 4-cyl, small disp, light, high MPG.
  { id: "m1", cluster: "modern", mpg: 36, cyl: 4, disp: 122, hp: 158, wt: 2850, year: 2022 },
  { id: "m2", cluster: "modern", mpg: 34, cyl: 4, disp: 152, hp: 170, wt: 3050, year: 2021 },
  { id: "m3", cluster: "modern", mpg: 30, cyl: 4, disp: 183, hp: 190, wt: 3300, year: 2019 },
  { id: "m4", cluster: "modern", mpg: 38, cyl: 4, disp: 120, hp: 140, wt: 2820, year: 2024 },
  { id: "m5", cluster: "modern", mpg: 32, cyl: 4, disp: 165, hp: 180, wt: 3150, year: 2020 },
  { id: "m6", cluster: "modern", mpg: 29, cyl: 4, disp: 200, hp: 200, wt: 3400, year: 2018 },
  { id: "m7", cluster: "modern", mpg: 33, cyl: 4, disp: 148, hp: 165, wt: 3000, year: 2023 },
  { id: "m8", cluster: "modern", mpg: 28, cyl: 4, disp: 195, hp: 195, wt: 3380, year: 2018 },
  { id: "m9", cluster: "modern", mpg: 35, cyl: 4, disp: 140, hp: 160, wt: 2950, year: 2022 },
  { id: "m10", cluster: "modern", mpg: 31, cyl: 4, disp: 170, hp: 175, wt: 3200, year: 2020 },

  // 10 luxury performance — 6/8 cyl, very high HP, mid weight, recent.
  { id: "l1", cluster: "luxury", mpg: 18, cyl: 8, disp: 320, hp: 420, wt: 3850, year: 2022 },
  { id: "l2", cluster: "luxury", mpg: 20, cyl: 6, disp: 275, hp: 340, wt: 3500, year: 2021 },
  { id: "l3", cluster: "luxury", mpg: 17, cyl: 8, disp: 340, hp: 450, wt: 3900, year: 2020 },
  { id: "l4", cluster: "luxury", mpg: 22, cyl: 6, disp: 255, hp: 310, wt: 3420, year: 2019 },
  { id: "l5", cluster: "luxury", mpg: 19, cyl: 8, disp: 300, hp: 400, wt: 3780, year: 2023 },
  { id: "l6", cluster: "luxury", mpg: 16, cyl: 8, disp: 350, hp: 440, wt: 3880, year: 2024 },
  { id: "l7", cluster: "luxury", mpg: 21, cyl: 6, disp: 265, hp: 330, wt: 3480, year: 2017 },
  { id: "l8", cluster: "luxury", mpg: 18, cyl: 6, disp: 290, hp: 360, wt: 3600, year: 2022 },
  { id: "l9", cluster: "luxury", mpg: 17, cyl: 8, disp: 330, hp: 430, wt: 3850, year: 2018 },
  { id: "l10", cluster: "luxury", mpg: 20, cyl: 8, disp: 310, hp: 380, wt: 3700, year: 2024 },
];

type AxisKey = "mpg" | "cyl" | "disp" | "hp" | "wt" | "year";

interface AxisSpec {
  key: AxisKey;
  label: string;
  domain: [number, number];
}

// Axis order left → right. Domain is hand-set per axis to cover the data
// comfortably; each axis is independently scaled.
const AXES: ReadonlyArray<AxisSpec> = [
  { key: "mpg", label: "MPG", domain: [8, 40] },
  { key: "cyl", label: "CYL", domain: [3, 9] },
  { key: "disp", label: "DISP", domain: [100, 460] },
  { key: "hp", label: "HP", domain: [120, 460] },
  { key: "wt", label: "WT", domain: [2600, 4500] },
  { key: "year", label: "YEAR", domain: [1970, 2024] },
];

const CLUSTER_META: Record<Cluster, { label: string; stroke: string; opacity: number }> = {
  classic: { label: "Classic American (1970–75)", stroke: "var(--color-ink)", opacity: 0.9 },
  modern: { label: "Modern efficient (2018–24)", stroke: "#4a6a68", opacity: 0.85 },
  luxury: { label: "Luxury performance (2015–24)", stroke: "#8a7a52", opacity: 0.9 },
};

interface Props {
  width: number;
  height: number;
}

export function ParallelCoordinatesPlotChart({ width, height }: Props) {
  const margin = { top: 28, right: 24, bottom: 54, left: 40 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Axis x-positions, evenly spaced across iw.
  const axisX = AXES.map((_, i) => (AXES.length === 1 ? 0 : (i * iw) / (AXES.length - 1)));

  // Per-axis scales — each axis is independently normalised.
  const axisScales = AXES.map((a) =>
    scaleLinear({ domain: a.domain, range: [ih, 0] }),
  );

  const carPath = (car: Car) =>
    AXES.map((a, i) => {
      const v = car[a.key];
      const x = axisX[i];
      const y = axisScales[i](v);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ");

  // Representative polyline = the first classic car. Used for the "polyline"
  // anchor so it always has something concrete to hover.
  const highlightCar = DATA.find((d) => d.id === "c4")!;
  const highlightPoints = AXES.map((a, i) => ({
    x: axisX[i],
    y: axisScales[i](highlightCar[a.key]),
  }));

  // Classic-cluster ribbon bounds along the HP axis — used to anchor the
  // "cluster" rect so it hugs the coherent bundle of classic-car lines.
  const clusterAxisIdx = 3; // HP column
  const clusterYTop = axisScales[clusterAxisIdx](280);
  const clusterYBot = axisScales[clusterAxisIdx](180);
  const clusterXLeft = axisX[clusterAxisIdx - 1];
  const clusterXRight = axisX[clusterAxisIdx + 1];

  // Between-axis crossings zone — between axis 0 (MPG) and axis 1 (CYL),
  // where high-MPG lines slope down and low-MPG lines slope up, crossing.
  const crossingsXLeft = axisX[0];
  const crossingsXRight = axisX[1];

  // Clamp anchor rects to the plot area (contract §8).
  const clamp = (
    rx: number,
    ry: number,
    rw: number,
    rh: number,
  ): { x: number; y: number; width: number; height: number } => {
    const x0 = Math.max(0, rx);
    const y0 = Math.max(0, ry);
    const x1 = Math.min(iw, rx + rw);
    const y1 = Math.min(ih, ry + rh);
    return { x: x0, y: y0, width: Math.max(0, x1 - x0), height: Math.max(0, y1 - y0) };
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Parallel coordinates plot">
      <Group left={margin.left} top={margin.top}>
        {/* Axes — vertical lines with min/max tick labels */}
        <g data-data-layer="true">
          {AXES.map((a, i) => {
            const x = axisX[i];
            const [dmin, dmax] = a.domain;
            return (
              <g key={a.key}>
                <line
                  x1={x}
                  x2={x}
                  y1={0}
                  y2={ih}
                  stroke="var(--color-ink-mute)"
                  strokeWidth={1}
                />
                {/* Axis name above the top */}
                <text
                  x={x}
                  y={-10}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink)"
                  fontWeight={600}
                >
                  {a.label}
                </text>
                {/* Max tick label */}
                <text
                  x={x + 4}
                  y={8}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {dmax}
                </text>
                {/* Min tick label */}
                <text
                  x={x + 4}
                  y={ih - 2}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {dmin}
                </text>
              </g>
            );
          })}
        </g>

        {/* Polylines — one per car */}
        <g data-data-layer="true">
          {DATA.map((car) => {
            const meta = CLUSTER_META[car.cluster];
            return (
              <path
                key={car.id}
                d={carPath(car)}
                fill="none"
                stroke={meta.stroke}
                strokeWidth={car.id === highlightCar.id ? 2 : 1.1}
                strokeOpacity={car.id === highlightCar.id ? 1 : meta.opacity * 0.55}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </g>

        {/* Legend — below the plot, three clusters */}
        <g data-data-layer="true" transform={`translate(0, ${ih + 26})`}>
          {(Object.keys(CLUSTER_META) as Cluster[]).map((c, i) => {
            const meta = CLUSTER_META[c];
            const x = i * (iw / 3);
            return (
              <g key={c} transform={`translate(${x}, 0)`}>
                <line
                  x1={0}
                  x2={18}
                  y1={6}
                  y2={6}
                  stroke={meta.stroke}
                  strokeWidth={2}
                  strokeOpacity={meta.opacity}
                  strokeLinecap="round"
                />
                <text
                  x={24}
                  y={6}
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {meta.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* 1. Axis — one of the 6 vertical axes (anchor the HP axis) */}
        <ExplainAnchor
          selector="axis"
          index={1}
          pin={{ x: axisX[3], y: -20 }}
          rect={clamp(axisX[3] - 10, 0, 20, ih)}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Axis-scale — each axis independently normalised */}
        <ExplainAnchor
          selector="axis-scale"
          index={2}
          pin={{ x: axisX[0] + 14, y: 4 }}
          rect={clamp(axisX[0] - 6, 0, 28, 20)}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Polyline — a single car as one line crossing all 6 axes */}
        <ExplainAnchor
          selector="polyline"
          index={3}
          pin={{ x: highlightPoints[2].x, y: highlightPoints[2].y - 14 }}
          rect={clamp(
            highlightPoints[2].x - 18,
            Math.min(highlightPoints[2].y, highlightPoints[3].y) - 10,
            axisX[3] - axisX[2] + 36,
            Math.abs(highlightPoints[3].y - highlightPoints[2].y) + 20,
          )}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Crossings — between MPG and CYL, high-MPG points are top-of-axis
             while their CYL values are bottom-of-axis, so lines cross */}
        <ExplainAnchor
          selector="crossings"
          index={4}
          pin={{ x: (crossingsXLeft + crossingsXRight) / 2, y: ih / 2 - 12 }}
          rect={clamp(crossingsXLeft, 0, crossingsXRight - crossingsXLeft, ih)}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Cluster — classic-car ribbon along the HP axis */}
        <ExplainAnchor
          selector="cluster"
          index={5}
          pin={{ x: axisX[3] + 14, y: clusterYTop + 4 }}
          rect={clamp(
            clusterXLeft,
            clusterYTop,
            clusterXRight - clusterXLeft,
            clusterYBot - clusterYTop,
          )}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Line density — the whole plot; concept-level anchor */}
        <ExplainAnchor
          selector="line-density"
          index={6}
          pin={{ x: iw - 12, y: ih - 12 }}
          rect={clamp(axisX[4], 0, axisX[5] - axisX[4], ih)}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
