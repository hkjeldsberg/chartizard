"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ─── D⁰ → K⁻π⁺π⁰ kinematics ─────────────────────────────────────────────────
// mD = 1.865 GeV,  mK = 0.494 GeV,  mπ = 0.140 GeV
// m12 = inv. mass of (K⁻π⁺),  m23 = inv. mass of (π⁺π⁰)
//
// Kinematic limits (PDG Dalitz boundary, §47):
//   For fixed m12², the allowed range of m23² is determined by 4-momentum
//   conservation. We use the standard parametric form from Byckling & Kajantie.
//
// Axes:
//   x = m12² = m(K⁻π⁺)²  [GeV²]
//   y = m23² = m(π⁺π⁰)²  [GeV²]
//
// Resonances:
//   K*(892): appears as a HORIZONTAL band in the m12² direction
//            because K*(892)→K⁻π⁺, so m12 ≈ 0.892 GeV → m12² ≈ 0.796 GeV²
//   ρ(770): appears as a VERTICAL band in the m23² direction
//           because ρ(770)→π⁺π⁰, so m23 ≈ 0.770 GeV → m23² ≈ 0.593 GeV²

const MD  = 1.865;
const MK  = 0.494;
const MPI = 0.140;

const MD2 = MD * MD;
const MK2 = MK * MK;
const MPI2 = MPI * MPI;

// Global invariants
const SUM_M2 = MD2 + MK2 + MPI2 + MPI2; // m1²+m2²+m3²+M²? Actually use 3-body

// For D→K π π, 3 daughters: m1=MK, m2=MPI, m3=MPI
// x = m12² = m(K π)², y = m23² = m(π π)²
// From Byckling & Kajantie, at given m12², the allowed m23² range is:
//   E2* = (m12² - m1² + m2²) / (2 * m12)
//   E3* = (MD² - m12² - m3²) / (2 * m12)
//   p2* = sqrt(E2*² - m2²)
//   p3* = sqrt(E3*² - m3²)
//   m23²_min = (E2* + E3*)² - (p2* + p3*)²
//   m23²_max = (E2* + E3*)² - (p2* - p3*)²

function dalitzBounds(m12sq: number): { min: number; max: number } | null {
  const m12 = Math.sqrt(m12sq);
  const E2star = (m12sq - MK2 + MPI2) / (2 * m12);
  const E3star = (MD2 - m12sq - MPI2) / (2 * m12);
  const p2star2 = E2star * E2star - MPI2;
  const p3star2 = E3star * E3star - MPI2;
  if (p2star2 < 0 || p3star2 < 0) return null;
  const p2star = Math.sqrt(p2star2);
  const p3star = Math.sqrt(p3star2);
  const esum = E2star + E3star;
  return {
    min: esum * esum - (p2star + p3star) * (p2star + p3star),
    max: esum * esum - (p2star - p3star) * (p2star - p3star),
  };
}

// ─── Kinematic range ─────────────────────────────────────────────────────────
// m12² ∈ [(MK+MPI)², (MD-MPI)²]
const M12SQ_MIN = (MK + MPI) ** 2;   // ≈ 0.400 GeV²
const M12SQ_MAX = (MD - MPI) ** 2;   // ≈ 2.957 GeV²  (but plot useful range)

// m23² (π⁺π⁰) ∈ [(MPI+MPI)², (MD-MK)²]
const M23SQ_MIN = (MPI + MPI) ** 2;  // ≈ 0.078 GeV²
const M23SQ_MAX = (MD - MK) ** 2;    // ≈ 1.879 GeV²

// ─── Dalitz boundary polygon ─────────────────────────────────────────────────
// Sample ~120 points along the boundary curve.
function computeBoundary(): Array<{ x: number; y: number }> {
  const N = 120;
  const upper: Array<{ x: number; y: number }> = [];
  const lower: Array<{ x: number; y: number }> = [];

  for (let i = 0; i <= N; i++) {
    const m12sq = M12SQ_MIN + (i / N) * (M12SQ_MAX - M12SQ_MIN);
    const b = dalitzBounds(m12sq);
    if (!b) continue;
    upper.push({ x: m12sq, y: b.max });
    lower.push({ x: m12sq, y: b.min });
  }
  // Combine: upper forward + lower reversed = closed polygon
  return [...upper, ...lower.reverse()];
}

const BOUNDARY = computeBoundary();

// ─── LCG seeded pseudo-random number generator ───────────────────────────────
function makeLcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ─── Generate scatter points inside the Dalitz boundary ──────────────────────
interface DalitzPoint {
  x: number; // m12²
  y: number; // m23²
  kind: "bg" | "kstar" | "rho";
}

function generatePoints(): DalitzPoint[] {
  const rand = makeLcg(42);
  const points: DalitzPoint[] = [];

  const xRange = M12SQ_MAX - M12SQ_MIN;
  const yRange = M23SQ_MAX - M23SQ_MIN;

  // ── Background phase-space (uniform) ──
  let bgCount = 0;
  let attempts = 0;
  while (bgCount < 380 && attempts < 8000) {
    attempts++;
    const x = M12SQ_MIN + rand() * xRange;
    const y = M23SQ_MIN + rand() * yRange;
    const b = dalitzBounds(x);
    if (!b) continue;
    if (y >= b.min && y <= b.max) {
      points.push({ x, y, kind: "bg" });
      bgCount++;
    }
  }

  // ── K*(892) resonance band: m12² ≈ 0.796 GeV², Γ ≈ 0.050 GeV² ──
  const KSTAR_M2 = 0.796;
  const KSTAR_SIGMA = 0.032; // half-width at half-max in m12² space
  let kCount = 0;
  attempts = 0;
  while (kCount < 45 && attempts < 2000) {
    attempts++;
    const x = KSTAR_M2 + (rand() - 0.5) * KSTAR_SIGMA * 4; // ±2σ
    if (x < M12SQ_MIN || x > M12SQ_MAX) continue;
    const b = dalitzBounds(x);
    if (!b) continue;
    const y = b.min + rand() * (b.max - b.min);
    if (y < M23SQ_MIN || y > M23SQ_MAX) continue;
    // Breit-Wigner-like weight along x direction
    const w = 1 / (1 + ((x - KSTAR_M2) / KSTAR_SIGMA) ** 2);
    if (rand() < w) {
      points.push({ x, y, kind: "kstar" });
      kCount++;
    }
  }

  // ── ρ(770) resonance band: m23² ≈ 0.593 GeV², Γ ≈ 0.045 GeV² ──
  const RHO_M2 = 0.593;
  const RHO_SIGMA = 0.030;
  let rCount = 0;
  attempts = 0;
  while (rCount < 45 && attempts < 2000) {
    attempts++;
    const y = RHO_M2 + (rand() - 0.5) * RHO_SIGMA * 4;
    if (y < M23SQ_MIN || y > M23SQ_MAX) continue;
    // For a given m23², the allowed m12² range:
    // We sample x uniformly across [M12SQ_MIN, M12SQ_MAX] and check
    const x = M12SQ_MIN + rand() * xRange;
    const b = dalitzBounds(x);
    if (!b) continue;
    if (y < b.min || y > b.max) continue;
    const w = 1 / (1 + ((y - RHO_M2) / RHO_SIGMA) ** 2);
    if (rand() < w) {
      points.push({ x, y, kind: "rho" });
      rCount++;
    }
  }

  return points;
}

// ─── Build boundary SVG path string ─────────────────────────────────────────
function boundaryPath(
  pts: Array<{ x: number; y: number }>,
  xs: (v: number) => number,
  ys: (v: number) => number,
): string {
  if (pts.length === 0) return "";
  const [first, ...rest] = pts;
  const parts = [`M ${xs(first.x)} ${ys(first.y)}`];
  for (const p of rest) parts.push(`L ${xs(p.x)} ${ys(p.y)}`);
  parts.push("Z");
  return parts.join(" ");
}

interface Props {
  width: number;
  height: number;
}

export function DalitzPlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 50, left: 62 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Use same axis range for both axes for a square-ish Dalitz plot
  const xScale = useMemo(
    () => scaleLinear({ domain: [0.35, 3.1], range: [0, iw] }),
    [iw],
  );
  const yScale = useMemo(
    () => scaleLinear({ domain: [0.04, 2.0], range: [ih, 0] }),
    [ih],
  );

  const points = useMemo(() => generatePoints(), []);

  const bPath = useMemo(
    () => boundaryPath(BOUNDARY, (v) => xScale(v), (v) => yScale(v)),
    [xScale, yScale],
  );

  // ── Resonance band markers ──
  const KSTAR_M2 = 0.796;
  const RHO_M2 = 0.593;
  const KSTAR_HALF = 0.035; // half-width in GeV² for the band rect
  const RHO_HALF = 0.032;

  const kstarX0 = xScale(KSTAR_M2 - KSTAR_HALF);
  const kstarX1 = xScale(KSTAR_M2 + KSTAR_HALF);
  const rhoY0 = yScale(RHO_M2 + RHO_HALF);
  const rhoY1 = yScale(RHO_M2 - RHO_HALF);

  // Representative background point for anchor
  const bgRep = points.find((p) => p.kind === "bg" && p.x > 1.2 && p.y > 0.8 && p.y < 1.2) ?? points[0];
  const bgRepX = xScale(bgRep.x);
  const bgRepY = yScale(bgRep.y);

  // Representative resonance point for anchor (K*)
  const kstarRep = points.find((p) => p.kind === "kstar") ?? points[0];
  const kstarRepX = xScale(kstarRep.x);
  const kstarRepY = yScale(kstarRep.y);

  const clampRect = (x: number, y: number, w: number, h: number) => ({
    x: Math.max(0, x),
    y: Math.max(0, y),
    width: Math.max(1, Math.min(iw - Math.max(0, x), w)),
    height: Math.max(1, Math.min(ih - Math.max(0, y), h)),
  });

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Dalitz plot for D⁰ → K⁻π⁺π⁰ decay, showing Dalitz boundary and K*(892) and ρ(770) resonance bands"
    >
      <Group left={margin.left} top={margin.top}>

        {/* Gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(5).map((t) => (
            <line
              key={`yg-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
          {xScale.ticks(5).map((t) => (
            <line
              key={`xg-${t}`}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* Dalitz boundary — kinematic envelope */}
        <ExplainAnchor
          selector="dalitz-boundary"
          index={1}
          pin={{ x: xScale(2.8), y: yScale(1.6) }}
          rect={clampRect(0, 0, iw, ih)}
        >
          <g data-data-layer="true">
            {/* Interior fill (phase space) */}
            <path
              d={bPath}
              fill="var(--color-ink)"
              fillOpacity={0.04}
              stroke="none"
            />
            {/* Boundary outline */}
            <path
              d={bPath}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.4}
            />
          </g>
        </ExplainAnchor>

        {/* K*(892) resonance band — vertical stripe at m12² ≈ 0.796 */}
        <ExplainAnchor
          selector="kstar-band"
          index={3}
          pin={{ x: (kstarX0 + kstarX1) / 2, y: 14 }}
          rect={clampRect(kstarX0, 0, kstarX1 - kstarX0, ih)}
        >
          <g data-data-layer="true">
            <rect
              x={kstarX0}
              y={0}
              width={Math.max(0, kstarX1 - kstarX0)}
              height={ih}
              fill="var(--color-ink)"
              fillOpacity={0.10}
            />
            <text
              x={(kstarX0 + kstarX1) / 2}
              y={ih - 6}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              K*(892)
            </text>
          </g>
        </ExplainAnchor>

        {/* ρ(770) resonance band — horizontal stripe at m23² ≈ 0.593 */}
        <ExplainAnchor
          selector="rho-band"
          index={4}
          pin={{ x: iw - 14, y: (rhoY0 + rhoY1) / 2 }}
          rect={clampRect(0, rhoY0, iw, rhoY1 - rhoY0)}
        >
          <g data-data-layer="true">
            <rect
              x={0}
              y={rhoY0}
              width={iw}
              height={Math.max(0, rhoY1 - rhoY0)}
              fill="var(--color-ink)"
              fillOpacity={0.10}
            />
            <text
              x={6}
              y={(rhoY0 + rhoY1) / 2 + 3}
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              ρ(770)
            </text>
          </g>
        </ExplainAnchor>

        {/* All scatter points */}
        <g data-data-layer="true">
          {points.map((p, i) => (
            <circle
              key={`dp-${i}`}
              cx={xScale(p.x)}
              cy={yScale(p.y)}
              r={p.kind === "bg" ? 1.6 : 2.0}
              fill="var(--color-ink)"
              opacity={p.kind === "bg" ? 0.45 : 0.80}
            />
          ))}
        </g>

        {/* Representative background (phase-space) point anchor */}
        <ExplainAnchor
          selector="phase-space"
          index={2}
          pin={{ x: bgRepX + 14, y: bgRepY - 14 }}
          rect={clampRect(bgRepX - 8, bgRepY - 8, 16, 16)}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 32 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => String(Number(v).toFixed(1))}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "middle",
              dy: "0.33em",
            })}
          />
          <text
            x={iw / 2}
            y={ih + 40}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            m(K⁻π⁺)² (GeV²)
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => String(Number(v).toFixed(1))}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "end",
              dx: "-0.33em",
              dy: "0.33em",
            })}
          />
          <text
            x={-margin.left + 4}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            m(π⁺π⁰)² (GeV²)
          </text>
        </ExplainAnchor>

      </Group>
    </svg>
  );
}
