"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// -----------------------------------------------------------------------
// Synthetic monthly signal, N = 240 samples (20 years)
//   x(n) = 1.0·cos(2π·n/12) + 0.5·cos(2π·n/6 + 0.3) + N(0, 0.3)
// Periodogram: I(f_k) = |X(f_k)|² / N,  f_k = k/N cycles/month, k = 0..N/2
// Expected peaks at f ≈ 1/12 ≈ 0.0833 and f ≈ 1/6 ≈ 0.1667.
// -----------------------------------------------------------------------

const N = 240;
const HALF_N = 120;

// Seeded LCG → uniform [0, 1)
function makeRand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Box–Muller transform → N(0, 1)
function gaussian(rand: () => number) {
  const u1 = Math.max(1e-12, rand());
  const u2 = rand();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

interface Spectrum {
  readonly bins: ReadonlyArray<{ f: number; power: number }>;
  readonly peak12: { f: number; power: number };
  readonly peak6: { f: number; power: number };
  readonly maxPower: number;
  readonly noiseFloor: number;
}

function computeSpectrum(): Spectrum {
  const rand = makeRand(20240423);

  // Build the signal
  const x = new Float64Array(N);
  for (let n = 0; n < N; n++) {
    const tone12 = 1.0 * Math.cos((2 * Math.PI * n) / 12);
    const tone6 = 0.5 * Math.cos((2 * Math.PI * n) / 6 + 0.3);
    const noise = 0.3 * gaussian(rand);
    x[n] = tone12 + tone6 + noise;
  }

  // Direct DFT, k = 0..N/2
  const bins: { f: number; power: number }[] = [];
  for (let k = 0; k <= HALF_N; k++) {
    let re = 0;
    let im = 0;
    const w = (2 * Math.PI * k) / N;
    for (let n = 0; n < N; n++) {
      const ang = w * n;
      re += x[n] * Math.cos(ang);
      im -= x[n] * Math.sin(ang);
    }
    // Normalise: I(f_k) = |X|² / N (standard periodogram scaling).
    const power = (re * re + im * im) / N;
    bins.push({ f: k / N, power });
  }

  // Locate the two theoretical peaks (f = 1/12 and 1/6 → k = 20 and 40)
  const peak12 = bins[20];
  const peak6 = bins[40];

  // Estimate noise floor as the median of bins outside both peak regions.
  const floorBins: number[] = [];
  bins.forEach((b, i) => {
    const nearPeak =
      Math.abs(i - 20) <= 2 || Math.abs(i - 40) <= 2 || i === 0;
    if (!nearPeak) floorBins.push(b.power);
  });
  floorBins.sort((a, b) => a - b);
  const noiseFloor = floorBins[Math.floor(floorBins.length / 2)];
  const maxPower = Math.max(peak12.power, peak6.power);

  return { bins, peak12, peak6, maxPower, noiseFloor };
}

interface Props {
  width: number;
  height: number;
}

export function Periodogram({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const spec = useMemo(() => computeSpectrum(), []);

  // Domains: frequency 0..0.5 cycles/month; power 0..ceil(maxPower).
  const xScale = scaleLinear<number>({ domain: [0, 0.5], range: [0, iw] });
  const yMax = Math.ceil(spec.maxPower / 10) * 10;
  const yScale = scaleLinear<number>({ domain: [0, yMax], range: [ih, 0] });

  const zeroY = yScale(0);

  // Representative peak coordinates (the 12-month fundamental)
  const peak12X = xScale(spec.peak12.f);
  const peak12Y = yScale(spec.peak12.power);
  const peak6X = xScale(spec.peak6.f);
  const peak6Y = yScale(spec.peak6.power);

  // Noise-floor y-coordinate for the horizontal reference
  const floorY = yScale(spec.noiseFloor);

  // A representative noise-bin stem somewhere in the "quiet" range,
  // e.g. at k = 80 (f ≈ 0.333).
  const noiseBin = spec.bins[80];
  const noiseBinX = xScale(noiseBin.f);
  const noiseBinY = yScale(noiseBin.power);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Periodogram: squared magnitude of the DFT of a 240-sample monthly signal, with expected peaks at 1/12 and 1/6 cycles/month"
    >
      <Group left={margin.left} top={margin.top}>
        {/* ============================================================
            Data layer
            ============================================================ */}
        <g data-data-layer="true">
          {/* Horizontal gridlines */}
          {yScale.ticks(4).map((t) => (
            <line
              key={`hg-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray={t === 0 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* 1. Noise floor — horizontal reference line */}
        <ExplainAnchor
          selector="noise-floor"
          index={1}
          pin={{ x: Math.min(iw - 10, iw - 14), y: Math.max(12, floorY - 10) }}
          rect={{
            x: 0,
            y: Math.max(0, floorY - 4),
            width: iw,
            height: 8,
          }}
        >
          <line
            x1={0}
            x2={iw}
            y1={floorY}
            y2={floorY}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="4 3"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* 2. Stems + bubbles for every bin */}
        <ExplainAnchor
          selector="stem"
          index={2}
          pin={{
            x: Math.min(iw - 10, noiseBinX + 16),
            y: Math.max(14, noiseBinY - 18),
          }}
          rect={{
            x: Math.max(0, noiseBinX - 8),
            y: Math.min(noiseBinY, zeroY) - 2,
            width: 16,
            height: Math.max(12, Math.abs(zeroY - noiseBinY) + 4),
          }}
        >
          <g data-data-layer="true">
            {spec.bins.map((b, i) => {
              if (i === 0) return null; // skip DC bin (huge and uninteresting)
              const x = xScale(b.f);
              const y = yScale(b.power);
              return (
                <g key={i}>
                  <line
                    x1={x}
                    x2={x}
                    y1={zeroY}
                    y2={y}
                    stroke="var(--color-ink)"
                    strokeWidth={0.8}
                  />
                  <circle cx={x} cy={y} r={1.2} fill="var(--color-ink)" />
                </g>
              );
            })}
          </g>
        </ExplainAnchor>

        {/* 3. Fundamental peak at f = 1/12 */}
        <ExplainAnchor
          selector="fundamental-peak"
          index={3}
          pin={{
            x: Math.min(iw - 10, peak12X + 18),
            y: Math.max(12, peak12Y - 4),
          }}
          rect={{
            x: Math.max(0, peak12X - 8),
            y: Math.max(0, peak12Y - 8),
            width: 16,
            height: 16,
          }}
        >
          <g data-data-layer="true">
            <circle
              cx={peak12X}
              cy={peak12Y}
              r={3.5}
              fill="var(--color-ink)"
              stroke="var(--color-ink)"
              strokeWidth={1.2}
            />
            <text
              x={peak12X + 6}
              y={peak12Y + 10}
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              f = 1/12
            </text>
          </g>
        </ExplainAnchor>

        {/* 4. Harmonic peak at f = 1/6 */}
        <ExplainAnchor
          selector="harmonic-peak"
          index={4}
          pin={{
            x: Math.min(iw - 10, peak6X + 18),
            y: Math.max(12, peak6Y - 12),
          }}
          rect={{
            x: Math.max(0, peak6X - 8),
            y: Math.max(0, peak6Y - 8),
            width: 16,
            height: 16,
          }}
        >
          <g data-data-layer="true">
            <circle
              cx={peak6X}
              cy={peak6Y}
              r={3}
              fill="var(--color-ink)"
              stroke="var(--color-ink)"
              strokeWidth={1.2}
            />
            <text
              x={peak6X + 6}
              y={peak6Y - 4}
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              f = 1/6
            </text>
          </g>
        </ExplainAnchor>

        {/* 5. X-axis (frequency) */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v) => (v as number).toFixed(2)}
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
            FREQUENCY (cycles/month)
          </text>
        </ExplainAnchor>

        {/* 6. Y-axis (power) */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={4}
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
            x={-44}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            |X(f)|²
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
