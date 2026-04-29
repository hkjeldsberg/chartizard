"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Four features (subset of the correlation-matrix's eight). The SPLOM turns
// each pair of Pearson r's into a visible cloud of points — every cell of
// the correlation matrix has a scatter here that shows its work.
const FEATURES = ["rooms", "lstat", "crim", "age"] as const;
type Feature = (typeof FEATURES)[number];

// Target pairwise correlations — pulled from the correlation-matrix's values
// so the two charts tell the same story with the same numbers.
const CORR: Record<Feature, Record<Feature, number>> = {
  rooms: { rooms: 1, lstat: -0.69, crim: -0.22, age: -0.24 },
  lstat: { rooms: -0.69, lstat: 1, crim: 0.46, age: 0.60 },
  crim: { rooms: -0.22, lstat: 0.46, crim: 1, age: 0.35 },
  age: { rooms: -0.24, lstat: 0.60, crim: 0.35, age: 1 },
};

// Per-feature realistic domains so the axes look plausible.
const DOMAINS: Record<Feature, [number, number]> = {
  rooms: [4, 9],
  lstat: [2, 38],
  crim: [0, 40],
  age: [10, 100],
};

interface Observation {
  rooms: number;
  lstat: number;
  crim: number;
  age: number;
}

// Cholesky-free shortcut: draw latent Gaussian z0..z3, then linearly mix them
// into four correlated standard normals u_i using weights chosen so that
// Corr(u_i, u_j) ≈ target. We solve this by trial mixing — the pairs are
// calibrated well enough for a museum chart. All observations derive from a
// single seeded LCG so renders are deterministic.
function generateObservations(n: number): Observation[] {
  let seed = 7919;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  // Latent axes: a shared "socioeconomic" factor that pushes rooms up and
  // lstat, crim, age down (or up) together, plus feature-specific noise.
  const out: Observation[] = [];
  for (let i = 0; i < n; i++) {
    const shared = gauss(); // big -> wealthy neighbourhood
    const noiseRooms = gauss();
    const noiseLstat = gauss();
    const noiseCrim = gauss();
    const noiseAge = gauss();

    // Weights tuned so pairwise correlations roughly match CORR.
    // rooms  ~= +0.75·shared + 0.66·noise  -> rooms × lstat ≈ -0.7 etc.
    const zRooms = 0.75 * shared + 0.66 * noiseRooms;
    const zLstat = -0.85 * shared + 0.53 * noiseLstat;
    const zCrim = -0.45 * shared + 0.89 * noiseCrim;
    const zAge = -0.55 * shared + 0.84 * noiseAge;

    // Map z (standard normal-ish) to a feature domain with mean in the
    // middle and ±2σ covering most of the range.
    const toDomain = (z: number, f: Feature): number => {
      const [lo, hi] = DOMAINS[f];
      const mean = (lo + hi) / 2;
      const sd = (hi - lo) / 4.5;
      return Math.max(lo, Math.min(hi, mean + z * sd));
    };

    out.push({
      rooms: toDomain(zRooms, "rooms"),
      lstat: toDomain(zLstat, "lstat"),
      crim: toDomain(zCrim, "crim"),
      age: toDomain(zAge, "age"),
    });
  }
  return out;
}

interface Props {
  width: number;
  height: number;
}

export function ScatterPlotMatrixChart({ width, height }: Props) {
  // Chunky outer margins so row labels (left) and column labels (top) fit.
  const margin = { top: 40, right: 20, bottom: 32, left: 64 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const observations = useMemo(() => generateObservations(150), []);

  const n = FEATURES.length;
  const gap = 6;
  const panelW = (iw - gap * (n - 1)) / n;
  const panelH = (ih - gap * (n - 1)) / n;

  // Per-feature linear scale confined to a single panel size.
  const xScales = useMemo(
    () =>
      Object.fromEntries(
        FEATURES.map((f) => [
          f,
          scaleLinear({
            domain: DOMAINS[f],
            range: [0, panelW],
          }),
        ]),
      ) as Record<Feature, ReturnType<typeof scaleLinear<number>>>,
    [panelW],
  );

  const yScales = useMemo(
    () =>
      Object.fromEntries(
        FEATURES.map((f) => [
          f,
          scaleLinear({
            domain: DOMAINS[f],
            range: [panelH, 0],
          }),
        ]),
      ) as Record<Feature, ReturnType<typeof scaleLinear<number>>>,
    [panelH],
  );

  // 1-D histogram for a feature — rendered inside the diagonal panel.
  const histogram = (f: Feature, bins = 12) => {
    const [lo, hi] = DOMAINS[f];
    const width = hi - lo;
    const counts = new Array<number>(bins).fill(0);
    for (const obs of observations) {
      const v = obs[f];
      const idx = Math.min(bins - 1, Math.floor(((v - lo) / width) * bins));
      counts[idx] += 1;
    }
    const max = counts.reduce((m, c) => Math.max(m, c), 0) || 1;
    return counts.map((c, i) => ({
      x: (i / bins) * panelW,
      w: panelW / bins - 0.5,
      h: (c / max) * (panelH * 0.65),
    }));
  };

  // Panel origin (top-left corner of row r, column c).
  const panelOrigin = (r: number, c: number) => ({
    x: c * (panelW + gap),
    y: r * (panelH + gap),
  });

  // The narrative-anchor panel: rooms (row) × lstat (col). Strong negative
  // cloud — the SPLOM's "show your work" cell for the correlation matrix.
  const anchorRow = 0; // rooms
  const anchorCol = 1; // lstat
  const anchorOrigin = panelOrigin(anchorRow, anchorCol);

  // The mirror panel: lstat × rooms (same pair transposed).
  const mirrorOrigin = panelOrigin(anchorCol, anchorRow);

  // Diagonal panel representative: rooms/rooms.
  const diagIdx = 0;
  const diagOrigin = panelOrigin(diagIdx, diagIdx);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Scatter plot matrix (SPLOM)"
    >
      <Group left={margin.left} top={margin.top}>
        {/* All 16 panels */}
        <g data-data-layer="true">
          {FEATURES.map((rowF, rIdx) =>
            FEATURES.map((colF, cIdx) => {
              const { x, y } = panelOrigin(rIdx, cIdx);
              const isDiag = rIdx === cIdx;

              if (isDiag) {
                const bars = histogram(rowF);
                return (
                  <g
                    key={`${rowF}-${colF}`}
                    transform={`translate(${x}, ${y})`}
                  >
                    <rect
                      x={0}
                      y={0}
                      width={panelW}
                      height={panelH}
                      fill="none"
                      stroke="var(--color-hairline)"
                    />
                    {/* Feature name centered */}
                    <text
                      x={panelW / 2}
                      y={panelH / 2 - 4}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontSize={11}
                      fontWeight={500}
                      fill="var(--color-ink)"
                    >
                      {rowF.toUpperCase()}
                    </text>
                    {/* Tiny histogram under the name */}
                    {bars.map((b, i) => (
                      <rect
                        key={i}
                        x={b.x}
                        y={panelH - 4 - b.h}
                        width={b.w}
                        height={b.h}
                        fill="rgba(26,22,20,0.55)"
                      />
                    ))}
                  </g>
                );
              }

              // Off-diagonal scatter — row-var on y, col-var on x.
              const xS = xScales[colF];
              const yS = yScales[rowF];
              return (
                <g
                  key={`${rowF}-${colF}`}
                  transform={`translate(${x}, ${y})`}
                >
                  <rect
                    x={0}
                    y={0}
                    width={panelW}
                    height={panelH}
                    fill="none"
                    stroke="var(--color-hairline)"
                  />
                  {observations.map((obs, i) => (
                    <circle
                      key={i}
                      cx={xS(obs[colF])}
                      cy={yS(obs[rowF])}
                      r={1.4}
                      fill="var(--color-ink)"
                      fillOpacity={0.65}
                    />
                  ))}
                </g>
              );
            }),
          )}
        </g>

        {/* Row labels (feature name at the left of each row) */}
        <g data-data-layer="true">
          {FEATURES.map((f, rIdx) => {
            const { y } = panelOrigin(rIdx, 0);
            return (
              <text
                key={`row-${f}`}
                x={-8}
                y={y + panelH / 2}
                textAnchor="end"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink-soft)"
              >
                {f.toUpperCase()}
              </text>
            );
          })}
          {/* Column labels across the top */}
          {FEATURES.map((f, cIdx) => {
            const { x } = panelOrigin(0, cIdx);
            return (
              <text
                key={`col-${f}`}
                x={x + panelW / 2}
                y={-10}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink-soft)"
              >
                {f.toUpperCase()}
              </text>
            );
          })}
        </g>

        {/* 1. Anchor panel — ROOMS (row) × LSTAT (col). The strong-negative
            cloud that *is* the correlation matrix's headline pair. */}
        <ExplainAnchor
          selector="anchor-panel"
          index={1}
          pin={{
            x: anchorOrigin.x + panelW + 10,
            y: anchorOrigin.y + 10,
          }}
          rect={{
            x: anchorOrigin.x,
            y: anchorOrigin.y,
            width: panelW,
            height: panelH,
          }}
        >
          <rect
            x={anchorOrigin.x}
            y={anchorOrigin.y}
            width={panelW}
            height={panelH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
        </ExplainAnchor>

        {/* 2. Diagonal panel — rooms/rooms. Feature name + 1-D density. */}
        <ExplainAnchor
          selector="diagonal"
          index={2}
          pin={{
            x: diagOrigin.x + panelW / 2,
            y: Math.max(0, diagOrigin.y - 14),
          }}
          rect={{
            x: diagOrigin.x,
            y: diagOrigin.y,
            width: panelW,
            height: panelH,
          }}
        >
          <rect
            x={diagOrigin.x}
            y={diagOrigin.y}
            width={panelW}
            height={panelH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
            strokeDasharray="3 3"
          />
        </ExplainAnchor>

        {/* 3. Mirror panel — the transpose of the anchor. Every off-diagonal
            cell appears twice; some SPLOMs replace one half with correlation
            coefficients. */}
        <ExplainAnchor
          selector="mirror"
          index={3}
          pin={{
            x: mirrorOrigin.x + panelW / 2,
            y: mirrorOrigin.y + panelH + 14,
          }}
          rect={{
            x: mirrorOrigin.x,
            y: mirrorOrigin.y,
            width: panelW,
            height: panelH,
          }}
        >
          <rect
            x={mirrorOrigin.x}
            y={mirrorOrigin.y}
            width={panelW}
            height={panelH}
            fill="none"
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
        </ExplainAnchor>

        {/* 4. Row-axis labels — runs up the left edge of the whole grid. */}
        <ExplainAnchor
          selector="row-labels"
          index={4}
          pin={{ x: -44, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Column-axis labels — runs across the top of the grid. */}
        <ExplainAnchor
          selector="column-labels"
          index={5}
          pin={{ x: iw / 2, y: -26 }}
          rect={{ x: 0, y: -margin.top, width: iw, height: margin.top }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
