"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// -----------------------------------------------------------------------------
// Star-glyph lattice — 16 car models, each profiled on six variables.
//
// Each glyph has six equally-spaced spokes radiating from a centre; distance
// along each spoke is the model's value on that variable, normalised to the
// column's min/max across the full cohort. The closing polyline is the
// glyph's signature.
//
// Variable order around the glyph (clockwise from 12 o'clock):
//   0  MPG            (higher = further out)
//   1  HP             (horsepower)
//   2  Weight (tons)
//   3  0-60 (seconds) — inverted so "further out" means "quicker"
//   4  Cylinders
//   5  Price ($k)
//
// Values are hand-tuned to be plausible and to produce recognisably
// different glyph silhouettes: a Honda Civic and a Ford F-150 should not
// collapse onto the same shape.
// -----------------------------------------------------------------------------

interface Car {
  name: string;
  mpg: number;
  hp: number;
  weight: number; // tons
  zeroToSixty: number; // seconds
  cylinders: number;
  price: number; // $1000s
}

const CARS: ReadonlyArray<Car> = [
  { name: "Honda Civic",       mpg: 36, hp: 158, weight: 1.38, zeroToSixty: 7.8,  cylinders: 4, price: 24 },
  { name: "Toyota Camry",      mpg: 32, hp: 203, weight: 1.56, zeroToSixty: 7.6,  cylinders: 4, price: 27 },
  { name: "Ford F-150",        mpg: 20, hp: 400, weight: 2.28, zeroToSixty: 6.2,  cylinders: 8, price: 45 },
  { name: "Tesla Model 3",     mpg: 132, hp: 283, weight: 1.80, zeroToSixty: 4.2, cylinders: 0, price: 43 },
  { name: "BMW 3-Series",      mpg: 28, hp: 255, weight: 1.69, zeroToSixty: 5.6,  cylinders: 4, price: 46 },
  { name: "Porsche 911",       mpg: 22, hp: 379, weight: 1.57, zeroToSixty: 3.9,  cylinders: 6, price: 115 },
  { name: "Jeep Wrangler",     mpg: 19, hp: 285, weight: 2.02, zeroToSixty: 7.4,  cylinders: 6, price: 37 },
  { name: "Chevy Silverado",   mpg: 18, hp: 355, weight: 2.42, zeroToSixty: 7.0,  cylinders: 8, price: 42 },
  { name: "Subaru Outback",    mpg: 28, hp: 182, weight: 1.82, zeroToSixty: 8.7,  cylinders: 4, price: 30 },
  { name: "Mazda CX-5",        mpg: 28, hp: 187, weight: 1.73, zeroToSixty: 8.1,  cylinders: 4, price: 29 },
  { name: "Hyundai Elantra",   mpg: 34, hp: 147, weight: 1.39, zeroToSixty: 8.4,  cylinders: 4, price: 22 },
  { name: "Nissan Altima",     mpg: 32, hp: 188, weight: 1.56, zeroToSixty: 7.7,  cylinders: 4, price: 26 },
  { name: "Volvo XC60",        mpg: 27, hp: 247, weight: 1.97, zeroToSixty: 6.4,  cylinders: 4, price: 47 },
  { name: "Audi Q5",           mpg: 25, hp: 261, weight: 2.01, zeroToSixty: 5.7,  cylinders: 4, price: 46 },
  { name: "Mercedes C-Class",  mpg: 27, hp: 255, weight: 1.73, zeroToSixty: 5.9,  cylinders: 4, price: 48 },
  { name: "VW Jetta",          mpg: 34, hp: 158, weight: 1.43, zeroToSixty: 7.5,  cylinders: 4, price: 23 },
];

const AXIS_LABELS: ReadonlyArray<string> = [
  "MPG",
  "HP",
  "WEIGHT",
  "0–60",
  "CYL",
  "PRICE",
];
const N_AXES = AXIS_LABELS.length;

// Extract numeric columns in the same order as the axes. "0-60" is inverted
// (a quicker car means a longer spoke) to keep "further out = better/bigger"
// semantics consistent within each glyph.
function valuesForCar(c: Car): ReadonlyArray<number> {
  return [c.mpg, c.hp, c.weight, -c.zeroToSixty, c.cylinders, c.price];
}

interface Normalised {
  name: string;
  normalised: number[]; // length N_AXES, each in [0, 1]
  values: number[];     // raw values, same order
}

function normaliseCohort(cars: ReadonlyArray<Car>): Normalised[] {
  const columns: number[][] = Array.from({ length: N_AXES }, () => []);
  cars.forEach((c) => {
    valuesForCar(c).forEach((v, i) => {
      columns[i].push(v);
    });
  });
  const mins = columns.map((col) => Math.min(...col));
  const maxs = columns.map((col) => Math.max(...col));
  return cars.map((c) => {
    const raw = valuesForCar(c);
    const normalised = raw.map((v, i) => {
      const span = maxs[i] - mins[i];
      return span === 0 ? 0.5 : (v - mins[i]) / span;
    });
    return { name: c.name, normalised, values: raw.slice() };
  });
}

interface Props {
  width: number;
  height: number;
}

export function StarGlyphPlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const cohort = useMemo(() => normaliseCohort(CARS), []);

  // 4x4 grid geometry.
  const COLS = 4;
  const ROWS = 4;
  const GAP_X = 6;
  const GAP_Y = 20; // extra vertical gap to carry the model-name caption
  const cellW = Math.max(0, (iw - GAP_X * (COLS - 1)) / COLS);
  const cellH = Math.max(0, (ih - GAP_Y * (ROWS - 1)) / ROWS);

  // Reserve a caption strip at the bottom of each cell.
  const captionBand = 12;
  const glyphAreaH = Math.max(0, cellH - captionBand);

  // Glyph radius fits the glyph area minus a small inset.
  const radius = Math.max(0, Math.min(cellW, glyphAreaH) / 2 - 4);

  const cellOrigin = (row: number, col: number) => ({
    x: col * (cellW + GAP_X),
    y: row * (cellH + GAP_Y),
  });

  // Angle for each axis — first axis at 12 o'clock.
  const angleFor = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / N_AXES;

  const polygonPoints = (normalised: ReadonlyArray<number>, cx: number, cy: number) =>
    normalised
      .map((v, i) => {
        const r = radius * v;
        return `${(cx + r * Math.cos(angleFor(i))).toFixed(2)},${(
          cy +
          r * Math.sin(angleFor(i))
        ).toFixed(2)}`;
      })
      .join(" ");

  const spokeEnd = (i: number, cx: number, cy: number) => ({
    x: cx + radius * Math.cos(angleFor(i)),
    y: cy + radius * Math.sin(angleFor(i)),
  });

  // Anchor targets — pick glyphs that carry the narrative.
  //  - Porsche 911: collapsed-along-MPG, long along HP / price → extreme-glyph.
  //  - Honda Civic (top-left): balanced small-economy silhouette → axis + spoke exemplar.
  //  - Tesla Model 3: collapsed cylinders, spike on MPG (electric) → contrast.
  const porscheIdx = CARS.findIndex((c) => c.name === "Porsche 911");
  const civicIdx = CARS.findIndex((c) => c.name === "Honda Civic");
  const teslaIdx = CARS.findIndex((c) => c.name === "Tesla Model 3");

  const idxToRowCol = (i: number) => ({
    row: Math.floor(i / COLS),
    col: i % COLS,
  });

  const porsche = idxToRowCol(porscheIdx);
  const civic = idxToRowCol(civicIdx);
  const tesla = idxToRowCol(teslaIdx);

  const porscheOrigin = cellOrigin(porsche.row, porsche.col);
  const civicOrigin = cellOrigin(civic.row, civic.col);
  const teslaOrigin = cellOrigin(tesla.row, tesla.col);

  const civicCentre = {
    x: civicOrigin.x + cellW / 2,
    y: civicOrigin.y + glyphAreaH / 2,
  };
  const porscheCentre = {
    x: porscheOrigin.x + cellW / 2,
    y: porscheOrigin.y + glyphAreaH / 2,
  };
  const teslaCentre = {
    x: teslaOrigin.x + cellW / 2,
    y: teslaOrigin.y + glyphAreaH / 2,
  };

  // Civic's MPG axis endpoint (for the single-axis anchor).
  const civicMpgEnd = spokeEnd(0, civicCentre.x, civicCentre.y);

  // Clamp helper for anchor rects.
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = clamp(r.x, 0, iw);
    const y = clamp(r.y, 0, ih);
    const w = clamp(r.x + r.width, 0, iw) - x;
    const h = clamp(r.y + r.height, 0, ih) - y;
    return { x, y, width: Math.max(0, w), height: Math.max(0, h) };
  };

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Star / glyph plot lattice"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Grid of glyphs — the data layer */}
        <g data-data-layer="true">
          {cohort.map((c, i) => {
            const { row, col } = idxToRowCol(i);
            const o = cellOrigin(row, col);
            const cx = o.x + cellW / 2;
            const cy = o.y + glyphAreaH / 2;
            return (
              <g key={c.name}>
                {/* Reference circle — the unit rim at v=1 */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="var(--color-hairline)"
                  strokeWidth={0.75}
                />
                {/* Spokes — one per axis */}
                {AXIS_LABELS.map((_, ai) => {
                  const end = spokeEnd(ai, cx, cy);
                  return (
                    <line
                      key={`spoke-${ai}`}
                      x1={cx}
                      y1={cy}
                      x2={end.x}
                      y2={end.y}
                      stroke="var(--color-hairline)"
                      strokeWidth={0.6}
                    />
                  );
                })}
                {/* Glyph polygon */}
                <polygon
                  points={polygonPoints(c.normalised, cx, cy)}
                  fill="rgba(26,22,20,0.18)"
                  stroke="var(--color-ink)"
                  strokeWidth={1.1}
                  strokeLinejoin="round"
                />
                {/* Vertex dots — one per axis value */}
                {c.normalised.map((v, ai) => {
                  const r = radius * v;
                  return (
                    <circle
                      key={`dot-${ai}`}
                      cx={cx + r * Math.cos(angleFor(ai))}
                      cy={cy + r * Math.sin(angleFor(ai))}
                      r={1.3}
                      fill="var(--color-ink)"
                    />
                  );
                })}
                {/* Caption — model name below the glyph */}
                <text
                  x={cx}
                  y={o.y + cellH - 2}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={8.5}
                  fill="var(--color-ink-soft)"
                >
                  {c.name.toUpperCase()}
                </text>
              </g>
            );
          })}
        </g>

        {/* Caption strip below the lattice — names the variable order */}
        <g data-data-layer="true">
          <text
            x={iw / 2}
            y={ih + 30}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            MPG · HP · WEIGHT · 0–60 · CYL · PRICE
          </text>
        </g>

        {/* Anchor 1 — one full glyph (Honda Civic, top-left) */}
        <ExplainAnchor
          selector="glyph"
          index={1}
          pin={{
            x: clamp(civicOrigin.x + cellW - 4, 0, iw),
            y: clamp(civicOrigin.y + 8, 0, ih),
          }}
          rect={clampRect({
            x: civicOrigin.x,
            y: civicOrigin.y,
            width: cellW,
            height: glyphAreaH,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2 — a single axis/spoke (Civic's MPG spoke, 12 o'clock) */}
        <ExplainAnchor
          selector="axis"
          index={2}
          pin={{
            x: clamp(civicMpgEnd.x + 12, 0, iw),
            y: clamp(civicMpgEnd.y - 4, 0, ih),
          }}
          rect={clampRect({
            x: civicCentre.x - 5,
            y: civicCentre.y - radius - 2,
            width: 10,
            height: radius + 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — the glyph polygon (Porsche 911, extreme silhouette) */}
        <ExplainAnchor
          selector="polygon"
          index={3}
          pin={{
            x: clamp(porscheCentre.x + radius + 12, 0, iw),
            y: clamp(porscheCentre.y - radius - 4, 0, ih),
          }}
          rect={clampRect({
            x: porscheCentre.x - radius,
            y: porscheCentre.y - radius,
            width: radius * 2,
            height: radius * 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4 — lattice / small-multiples grid (whole plot area) */}
        <ExplainAnchor
          selector="lattice"
          index={4}
          pin={{
            x: clamp(iw - 8, 0, iw),
            y: clamp(ih - 8, 0, ih),
          }}
          rect={clampRect({
            x: 0,
            y: 0,
            width: iw,
            height: ih,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — model-name caption (Civic's caption) */}
        <ExplainAnchor
          selector="caption"
          index={5}
          pin={{
            x: clamp(civicOrigin.x + cellW / 2, 0, iw),
            y: clamp(civicOrigin.y + cellH + 4, 0, ih),
          }}
          rect={clampRect({
            x: civicOrigin.x,
            y: civicOrigin.y + cellH - captionBand,
            width: cellW,
            height: captionBand,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6 — collapsed axis (Tesla's cylinder spoke — electric = 0) */}
        <ExplainAnchor
          selector="collapsed-axis"
          index={6}
          pin={{
            x: clamp(teslaCentre.x + 14, 0, iw),
            y: clamp(teslaCentre.y + 16, 0, ih),
          }}
          rect={clampRect({
            x: teslaCentre.x - 6,
            y: teslaCentre.y - 6,
            width: 12,
            height: 12,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
