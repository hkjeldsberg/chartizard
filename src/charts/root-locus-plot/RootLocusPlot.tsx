"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { LinePath } from "@visx/shape";
import { curveCatmullRom } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// -----------------------------------------------------------------------
// Open-loop G(s) = 1 / [(s+1)(s+2)(s+3)]
// Characteristic equation 1 + K·G(s) = 0
//   → s³ + 6s² + 11s + (6 + K) = 0
//
// Depressed cubic via substitution s = t − 2:
//   t³ − t + K = 0
//
// Regime 1 (3 real roots):     0 ≤ K ≤ K_b where K_b = 2/(3√3) ≈ 0.3849
// Regime 2 (1 real + conj):    K > K_b
//
// Breakaway point: s = −2 + 1/√3 ≈ −1.4226   (roots of 3s² + 12s + 11 = 0)
// Asymptote angles for 3-pole/0-zero: (2k+1)·180°/3 = 60°, 180°, 300°
// Asymptote centroid: (−1 − 2 − 3)/3 = −2
// Imag-axis crossing (Routh):  K_crit = 60,  ω = ±√11 ≈ ±3.317
// -----------------------------------------------------------------------

const OPEN_LOOP_POLES: ReadonlyArray<{ re: number; im: number; label: string }> = [
  { re: -1, im: 0, label: "−1" },
  { re: -2, im: 0, label: "−2" },
  { re: -3, im: 0, label: "−3" },
];

const BREAK_S = -2 + 1 / Math.sqrt(3); // ≈ −1.4226
const K_BREAK = 2 / (3 * Math.sqrt(3)); // ≈ 0.3849
const K_CRIT = 60;
const OMEGA_CRIT = Math.sqrt(11);

// Closed-form three-real-root regime (Cardano trigonometric, 0 ≤ K ≤ K_b).
// Returns the three real values of t for t³ − t + K = 0 as [tA, tB, tC]
// where:
//   tA starts at +1 (pole −1), moves down toward 1/√3
//   tB starts at −1 (pole −3), moves down toward −2/√3
//   tC starts at  0 (pole −2), moves up toward 1/√3
function threeRealT(K: number): [number, number, number] {
  // cos-form:  t_k = 2/√3 · cos[ φ/3 − 2πk/3 ], φ = arccos(−K · 3√3/2)
  const r = (2 * Math.sqrt(3)) / 3; // 2/√3
  const arg = Math.min(1, Math.max(-1, (-K * 3 * Math.sqrt(3)) / 2));
  const phi = Math.acos(arg);
  const t0 = r * Math.cos(phi / 3); // → 1 at K=0, → 1/√3 at K=K_b  (branch A)
  const t1 = r * Math.cos(phi / 3 - (2 * Math.PI) / 3); // → 0 → 1/√3  (branch C)
  const t2 = r * Math.cos(phi / 3 - (4 * Math.PI) / 3); // → −1 → −2/√3 (branch B)
  return [t0, t1, t2];
}

// Real-root of t³ − t + K = 0 for K > K_b (Cardano, one real root).
function singleRealT(K: number): number {
  // t³ + pt + q = 0, p = −1, q = K.  Disc = q²/4 + p³/27 = K²/4 − 1/27 > 0.
  const disc = (K * K) / 4 - 1 / 27;
  const sqrtD = Math.sqrt(disc);
  const cbrt = (x: number) => Math.sign(x) * Math.pow(Math.abs(x), 1 / 3);
  return cbrt(-K / 2 + sqrtD) + cbrt(-K / 2 - sqrtD);
}

interface Branch {
  readonly name: string;
  readonly pts: ReadonlyArray<{ s_re: number; s_im: number; K: number }>;
}

// Compute the three branches in s-plane as functions of K.
// Branch 1 (upper): pole at −1 slides toward breakaway, then rises up into
//   the complex plane along the +60° asymptote.
// Branch 2 (lower): its conjugate — pole at −2 slides toward breakaway,
//   then drops into the lower half-plane.
// Branch 3 (real): pole at −3 slides along the real axis toward −∞.
function computeBranches(): Branch[] {
  // Real-regime K samples (dense near K=0 and K_BREAK for smoothness).
  const K_real: number[] = [];
  const nReal = 20;
  for (let i = 0; i <= nReal; i++) {
    // Ease-out so we gather more points near breakaway.
    const u = i / nReal;
    K_real.push(K_BREAK * (1 - Math.pow(1 - u, 2)));
  }

  // Complex-regime K samples up to roughly 2·K_CRIT so the branches cross
  // the imaginary axis inside the plot.
  const K_complex: number[] = [];
  const nCpx = 30;
  const K_MAX = 120; // 2× K_CRIT
  for (let i = 1; i <= nCpx; i++) {
    const u = i / nCpx;
    // Slightly non-linear spacing to clarify behaviour near crossing (K≈60).
    const K = K_BREAK + (K_MAX - K_BREAK) * Math.pow(u, 0.85);
    K_complex.push(K);
  }

  const upper: { s_re: number; s_im: number; K: number }[] = [];
  const lower: { s_re: number; s_im: number; K: number }[] = [];
  const realBranch: { s_re: number; s_im: number; K: number }[] = [];

  // --- Real regime: branches A (from −1) and C (from −2) approach breakaway;
  //     branch B (from −3) moves left. --------------------------------------
  for (const K of K_real) {
    const [tA, tC, tB] = threeRealT(K);
    // A starts at 1 (s = −1). Comes down to 1/√3 at K_break. Put on "upper" branch
    // conceptually; im = 0 in this regime.
    upper.push({ s_re: tA - 2, s_im: 0, K });
    // C starts at 0 (s = −2). Also rises to 1/√3. Put on "lower" branch conceptually.
    lower.push({ s_re: tC - 2, s_im: 0, K });
    // B starts at −1 (s = −3). Moves down.
    realBranch.push({ s_re: tB - 2, s_im: 0, K });
  }

  // --- Complex regime: upper/lower carry the conjugate pair; realBranch
  //     continues along the real axis. ---------------------------------------
  for (const K of K_complex) {
    const tr = singleRealT(K);
    // Conjugate pair: t = −tr/2 ± j·√(3tr² − 4)/2
    const disc = 3 * tr * tr - 4;
    // disc ≥ 0 for K ≥ K_b. Clamp to 0 right at the boundary.
    const imT = Math.sqrt(Math.max(0, disc)) / 2;
    const reT = -tr / 2;
    upper.push({ s_re: reT - 2, s_im: imT, K });
    lower.push({ s_re: reT - 2, s_im: -imT, K });
    realBranch.push({ s_re: tr - 2, s_im: 0, K });
  }

  return [
    { name: "upper", pts: upper },
    { name: "lower", pts: lower },
    { name: "real-left", pts: realBranch },
  ];
}

interface Props {
  width: number;
  height: number;
}

export function RootLocusPlot({ width, height }: Props) {
  const margin = { top: 20, right: 24, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const branches = useMemo(() => computeBranches(), []);

  // Plot window: real −7..1, imag −5..5 — puts centroid, poles, breakaway,
  // and jω crossings (±√11 ≈ ±3.32) all comfortably in-frame.
  const xScale = scaleLinear<number>({ domain: [-7, 1], range: [0, iw] });
  const yScale = scaleLinear<number>({ domain: [-5, 5], range: [ih, 0] });

  const px = (re: number) => xScale(re);
  const py = (im: number) => yScale(im);

  const imagAxisX = px(0);
  const realAxisY = py(0);
  const centroidX = px(-2);
  const breakX = px(BREAK_S);
  const breakY = realAxisY;
  const crossUpY = py(OMEGA_CRIT);
  const crossDownY = py(-OMEGA_CRIT);

  const X_HALF = 6; // half-size of the × pole marker

  // Upper branch representative point for the "branch" anchor.
  const upperBranch = branches[0].pts;
  const branchMidIdx = Math.floor(upperBranch.length * 0.72);
  const branchMid = upperBranch[branchMidIdx];

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Root locus plot of G(s) = 1 / [(s+1)(s+2)(s+3)] showing closed-loop pole trajectories as gain K sweeps from 0 to infinity"
    >
      <Group left={margin.left} top={margin.top}>
        {/* ============================================================
            Data layer: gridlines, axes, branches, markers
            ============================================================ */}
        <g data-data-layer="true">
          {/* Faint horizontal gridlines */}
          {[-4, -2, 0, 2, 4].map((v) => (
            <line
              key={`hg-${v}`}
              x1={0}
              x2={iw}
              y1={py(v)}
              y2={py(v)}
              stroke="var(--color-hairline)"
              strokeDasharray={v === 0 ? undefined : "2 3"}
            />
          ))}
          {/* Faint vertical gridlines */}
          {[-6, -4, -2, 0].map((v) => (
            <line
              key={`vg-${v}`}
              x1={px(v)}
              x2={px(v)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray={v === 0 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* Imaginary axis (stability boundary) — drawn inside data layer
            but also anchored separately below via the crossing anchor. */}
        <line
          x1={imagAxisX}
          x2={imagAxisX}
          y1={0}
          y2={ih}
          stroke="var(--color-ink)"
          strokeWidth={1.2}
          data-data-layer="true"
        />

        {/* jω label */}
        <text
          x={imagAxisX + 4}
          y={10}
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-mute)"
        >
          jω
        </text>

        {/* 1. Open-loop poles (×) at s = −1, −2, −3 */}
        <ExplainAnchor
          selector="open-loop-poles"
          index={1}
          pin={{ x: Math.min(iw - 10, px(-1) + 14), y: Math.max(10, realAxisY - 16) }}
          rect={{
            x: Math.max(0, px(-3) - 10),
            y: Math.max(0, realAxisY - 10),
            width: Math.min(iw, px(-1) - px(-3) + 20),
            height: 20,
          }}
        >
          <g data-data-layer="true">
            {OPEN_LOOP_POLES.map((p) => (
              <g key={p.label}>
                <line
                  x1={px(p.re) - X_HALF}
                  y1={py(p.im) - X_HALF}
                  x2={px(p.re) + X_HALF}
                  y2={py(p.im) + X_HALF}
                  stroke="var(--color-ink)"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <line
                  x1={px(p.re) + X_HALF}
                  y1={py(p.im) - X_HALF}
                  x2={px(p.re) - X_HALF}
                  y2={py(p.im) + X_HALF}
                  stroke="var(--color-ink)"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <text
                  x={px(p.re)}
                  y={py(p.im) + 20}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={8}
                  fill="var(--color-ink-mute)"
                >
                  {p.label}
                </text>
              </g>
            ))}
          </g>
        </ExplainAnchor>

        {/* 2. Locus branches — three curves parameterised by K */}
        <ExplainAnchor
          selector="locus-branch"
          index={2}
          pin={{
            x: Math.min(iw - 10, Math.max(10, px(branchMid.s_re) + 16)),
            y: Math.max(10, py(branchMid.s_im) - 10),
          }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g data-data-layer="true">
            {branches.map((b) => (
              <LinePath<{ s_re: number; s_im: number; K: number }>
                key={b.name}
                data={b.pts as { s_re: number; s_im: number; K: number }[]}
                x={(d) => px(d.s_re)}
                y={(d) => py(d.s_im)}
                stroke="var(--color-ink)"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                curve={curveCatmullRom.alpha(0.5)}
              />
            ))}
            {/* Small arrow heads at the end of upper/lower branches to indicate
                direction of increasing K. */}
          </g>
        </ExplainAnchor>

        {/* 3. Breakaway point */}
        <ExplainAnchor
          selector="breakaway"
          index={3}
          pin={{ x: Math.max(10, breakX - 16), y: breakY - 18 }}
          rect={{
            x: Math.max(0, breakX - 10),
            y: Math.max(0, breakY - 10),
            width: 20,
            height: 20,
          }}
        >
          <g data-data-layer="true">
            <circle
              cx={breakX}
              cy={breakY}
              r={3.2}
              fill="var(--color-page)"
              stroke="var(--color-ink)"
              strokeWidth={1.6}
            />
          </g>
        </ExplainAnchor>

        {/* 4. Asymptote centroid and ±60° rays */}
        <ExplainAnchor
          selector="asymptotes"
          index={4}
          pin={{
            x: Math.min(iw - 10, centroidX + 22),
            y: Math.min(ih - 6, realAxisY + 22),
          }}
          rect={{
            x: Math.max(0, centroidX - 4),
            y: 0,
            width: 8,
            height: ih,
          }}
        >
          <g data-data-layer="true">
            {/* 60° and −60° dashed rays from the centroid (-2, 0). Length 6
                real units so they reach well beyond the jω axis. */}
            {(() => {
              const ray = 6;
              const dx = ray * Math.cos(Math.PI / 3);
              const dy = ray * Math.sin(Math.PI / 3);
              return (
                <>
                  <line
                    x1={centroidX}
                    y1={realAxisY}
                    x2={px(-2 + dx)}
                    y2={py(dy)}
                    stroke="var(--color-ink-mute)"
                    strokeWidth={0.8}
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={centroidX}
                    y1={realAxisY}
                    x2={px(-2 + dx)}
                    y2={py(-dy)}
                    stroke="var(--color-ink-mute)"
                    strokeWidth={0.8}
                    strokeDasharray="3 3"
                  />
                </>
              );
            })()}
            {/* Centroid dot */}
            <circle
              cx={centroidX}
              cy={realAxisY}
              r={2}
              fill="var(--color-ink)"
            />
            <text
              x={centroidX - 4}
              y={realAxisY + 14}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              σ_a = −2
            </text>
          </g>
        </ExplainAnchor>

        {/* 5. Imaginary-axis crossing — K_crit = 60 marks instability onset */}
        <ExplainAnchor
          selector="jw-crossing"
          index={5}
          pin={{
            x: Math.min(iw - 10, imagAxisX + 18),
            y: Math.max(10, crossUpY - 2),
          }}
          rect={{
            x: Math.max(0, imagAxisX - 8),
            y: Math.max(0, crossUpY - 8),
            width: 16,
            height: Math.max(0, crossDownY - crossUpY + 16),
          }}
        >
          <g data-data-layer="true">
            <circle
              cx={imagAxisX}
              cy={crossUpY}
              r={3.2}
              fill="var(--color-ink)"
              stroke="var(--color-ink)"
              strokeWidth={1.5}
            />
            <circle
              cx={imagAxisX}
              cy={crossDownY}
              r={3.2}
              fill="var(--color-ink)"
              stroke="var(--color-ink)"
              strokeWidth={1.5}
            />
            <text
              x={imagAxisX + 6}
              y={crossUpY - 6}
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              K = 60
            </text>
            <text
              x={imagAxisX + 6}
              y={crossDownY + 12}
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              goes unstable
            </text>
          </g>
        </ExplainAnchor>

        {/* 6. Real axis */}
        <ExplainAnchor
          selector="real-axis"
          index={6}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
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
            y={ih + 36}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            σ (real part of s)
          </text>
        </ExplainAnchor>

        {/* 7. Imaginary axis */}
        <ExplainAnchor
          selector="imaginary-axis"
          index={7}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
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
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
