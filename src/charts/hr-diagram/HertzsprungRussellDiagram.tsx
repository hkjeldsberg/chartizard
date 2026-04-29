"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear, scaleLog } from "@visx/scale";
import { AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Star {
  t: number; // surface temperature in K
  logL: number; // log10 luminosity in solar units
  kind: "main" | "giant" | "dwarf";
}

// Spectral-class boundaries (approximate, Harvard system). Tick labels sit at
// a representative temperature for each class rather than at even ticks.
const SPECTRAL_CLASSES: ReadonlyArray<{ label: string; t: number }> = [
  { label: "O", t: 30000 },
  { label: "B", t: 20000 },
  { label: "A", t: 9000 },
  { label: "F", t: 7000 },
  { label: "G", t: 5500 },
  { label: "K", t: 4500 },
  { label: "M", t: 3500 },
];

function generateStars(): Star[] {
  let seed = 23;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const stars: Star[] = [];

  // --- Main sequence (~350 stars) ---
  // Parametrise along the main-sequence "diagonal" from hot-bright to
  // cool-dim. The classical mass-luminosity relation gives roughly
  // logL ≈ 4 * (logT - 3.76) + small noise in this band; we just use a
  // linear relation in (logT, logL) that passes through (logT=4.48, logL=5)
  // and (logT=3.5, logL=-3).
  const MS_N = 350;
  for (let i = 0; i < MS_N; i++) {
    // Bias mass distribution toward cool/dim stars (Salpeter-ish): most stars
    // are M dwarfs in reality.
    const u = rand();
    const logT = 4.48 - Math.pow(u, 0.55) * (4.48 - 3.5);
    const logL =
      ((logT - 3.5) / (4.48 - 3.5)) * (5 - -3) + -3 + gauss() * 0.25;
    const t = Math.pow(10, logT);
    stars.push({ t, logL, kind: "main" });
  }

  // --- Red giant branch (~90 stars) ---
  // Cluster around (T = 4500 K, logL = 2.5), elongated toward cooler, brighter.
  const RG_N = 90;
  for (let i = 0; i < RG_N; i++) {
    const logT = Math.log10(4500) + gauss() * 0.05 - 0.02;
    const logL = 2.5 + gauss() * 0.55;
    const t = Math.pow(10, logT);
    stars.push({ t, logL, kind: "giant" });
  }

  // --- White dwarf region (~60 stars) ---
  // Cluster around (T = 10000 K, logL = -3), below the main sequence.
  const WD_N = 60;
  for (let i = 0; i < WD_N; i++) {
    const logT = Math.log10(10000) + gauss() * 0.1;
    const logL = -3 + gauss() * 0.4;
    const t = Math.pow(10, logT);
    stars.push({ t, logL, kind: "dwarf" });
  }

  // Clip to plot domain so points don't escape.
  return stars.filter(
    (s) => s.t >= 3000 && s.t <= 30000 && s.logL >= -4 && s.logL <= 6,
  );
}

interface Props {
  width: number;
  height: number;
}

export function HertzsprungRussellDiagram({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 56, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const stars = useMemo(() => generateStars(), []);

  // Reversed temperature axis: 30000 K on the left, 3000 K on the right.
  // scaleLinear handles a reversed domain correctly.
  const xScale = scaleLinear({ domain: [30000, 3000], range: [0, iw] });
  const yScale = scaleLog({
    domain: [1e-4, 1e6],
    range: [ih, 0],
    base: 10,
  });

  // Sun's position.
  const SUN_T = 5778;
  const SUN_L = 1; // L/Lsun
  const sunX = xScale(SUN_T);
  const sunY = yScale(SUN_L);

  // Representative coordinates for anchors.
  const msRepT = 8500;
  const msRepL = Math.pow(10, 1.2);
  const msX = xScale(msRepT);
  const msY = yScale(msRepL);

  const rgRepT = 4500;
  const rgRepL = Math.pow(10, 2.5);
  const rgX = xScale(rgRepT);
  const rgY = yScale(rgRepL);

  const wdRepT = 10000;
  const wdRepL = Math.pow(10, -3);
  const wdX = xScale(wdRepT);
  const wdY = yScale(wdRepL);

  const clampRect = (x: number, y: number, w: number, h: number) => ({
    x: Math.max(0, Math.min(iw - 1, x)),
    y: Math.max(0, Math.min(ih - 1, y)),
    width: Math.max(1, Math.min(iw - Math.max(0, x), w)),
    height: Math.max(1, Math.min(ih - Math.max(0, y), h)),
  });

  // Log-axis tick positions for the y-axis (every decade).
  const yTicks = [1e-4, 1e-2, 1, 1e2, 1e4, 1e6];
  const formatLog = (v: number) => {
    if (v === 1) return "1";
    const exp = Math.round(Math.log10(v));
    return `10${exp < 0 ? "⁻" : ""}${String(Math.abs(exp))
      .split("")
      .map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(d)])
      .join("")}`;
  };

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Hertzsprung-Russell diagram"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines at each decade of luminosity */}
        <g data-data-layer="true">
          {yTicks.map((t) => (
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
        </g>

        {/* All stars, styled by kind */}
        <g data-data-layer="true">
          {stars.map((s, i) => {
            const cx = xScale(s.t);
            const cy = yScale(Math.pow(10, s.logL));
            return (
              <circle
                key={`s-${i}`}
                cx={cx}
                cy={cy}
                r={s.kind === "main" ? 1.6 : 2.0}
                fill="var(--color-ink)"
                opacity={s.kind === "main" ? 0.72 : 0.85}
              />
            );
          })}
        </g>

        {/* Region labels, drawn over the clusters in light ink */}
        <g data-data-layer="true">
          <text
            x={xScale(9000)}
            y={yScale(Math.pow(10, 1.7))}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
            textAnchor="middle"
          >
            MAIN SEQUENCE
          </text>
          <text
            x={rgX}
            y={rgY - 28}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
            textAnchor="middle"
          >
            RED GIANTS
          </text>
          <text
            x={wdX}
            y={wdY + 20}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
            textAnchor="middle"
          >
            WHITE DWARFS
          </text>
        </g>

        {/* Sun crosshair */}
        <g data-data-layer="true">
          <line
            x1={sunX - 8}
            x2={sunX + 8}
            y1={sunY}
            y2={sunY}
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          <line
            x1={sunX}
            x2={sunX}
            y1={sunY - 8}
            y2={sunY + 8}
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          <circle
            cx={sunX}
            cy={sunY}
            r={3.4}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.4}
          />
          <text
            x={sunX + 10}
            y={sunY + 3}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            Sun
          </text>
        </g>

        {/* Main-sequence anchor */}
        <ExplainAnchor
          selector="main-sequence"
          index={1}
          pin={{ x: msX, y: msY - 16 }}
          rect={clampRect(msX - 40, msY - 20, 80, 40)}
        >
          <g />
        </ExplainAnchor>

        {/* Red-giant cluster anchor */}
        <ExplainAnchor
          selector="red-giants"
          index={2}
          pin={{ x: rgX + 16, y: rgY - 14 }}
          rect={clampRect(rgX - 24, rgY - 20, 48, 40)}
        >
          <g />
        </ExplainAnchor>

        {/* White-dwarf cluster anchor */}
        <ExplainAnchor
          selector="white-dwarfs"
          index={3}
          pin={{ x: wdX - 20, y: wdY + 14 }}
          rect={clampRect(wdX - 24, wdY - 16, 48, 32)}
        >
          <g />
        </ExplainAnchor>

        {/* Sun anchor */}
        <ExplainAnchor
          selector="sun-marker"
          index={4}
          pin={{ x: sunX + 24, y: sunY - 18 }}
          rect={clampRect(sunX - 10, sunY - 10, 40, 20)}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis — reversed temperature, with spectral-class tick labels */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 40 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <line
            x1={0}
            x2={iw}
            y1={ih}
            y2={ih}
            stroke="var(--color-ink-mute)"
          />
          {SPECTRAL_CLASSES.map((c) => {
            const cx = xScale(c.t);
            return (
              <g key={`xt-${c.label}`}>
                <line
                  x1={cx}
                  x2={cx}
                  y1={ih}
                  y2={ih + 4}
                  stroke="var(--color-ink-mute)"
                />
                <text
                  x={cx}
                  y={ih + 16}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink-soft)"
                >
                  {c.label}
                </text>
                <text
                  x={cx}
                  y={ih + 28}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={8}
                  fill="var(--color-ink-mute)"
                >
                  {c.t >= 10000 ? `${Math.round(c.t / 1000)}k` : `${c.t}`}
                </text>
              </g>
            );
          })}
          <text
            x={iw / 2}
            y={ih + 46}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            SURFACE TEMPERATURE (K) — HOT ← → COOL
          </text>
        </ExplainAnchor>

        {/* Y-axis — log luminosity */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            tickValues={yTicks}
            tickFormat={(v) => formatLog(Number(v))}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 10,
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
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            L / L☉ (LOG)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
