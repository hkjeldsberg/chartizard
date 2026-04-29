"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Viridis-like 5-stop colour scale. Hand-coded because we deliberately avoid
// adding `d3-scale-chromatic`. Stops at [0, 0.25, 0.5, 0.75, 1.0].
const VIRIDIS_STOPS: ReadonlyArray<{ t: number; rgb: [number, number, number] }> = [
  { t: 0.0, rgb: [0x44, 0x01, 0x54] }, // #440154 — dark purple
  { t: 0.25, rgb: [0x3b, 0x52, 0x8b] }, // #3b528b — indigo
  { t: 0.5, rgb: [0x21, 0x91, 0x8c] }, // #21918c — teal
  { t: 0.75, rgb: [0x5e, 0xc9, 0x62] }, // #5ec962 — green
  { t: 1.0, rgb: [0xfd, 0xe7, 0x25] }, // #fde725 — yellow
];

function viridis(t: number): string {
  const u = Math.max(0, Math.min(1, t));
  for (let i = 0; i < VIRIDIS_STOPS.length - 1; i++) {
    const a = VIRIDIS_STOPS[i];
    const b = VIRIDIS_STOPS[i + 1];
    if (u >= a.t && u <= b.t) {
      const f = (u - a.t) / (b.t - a.t);
      const r = Math.round(a.rgb[0] + (b.rgb[0] - a.rgb[0]) * f);
      const g = Math.round(a.rgb[1] + (b.rgb[1] - a.rgb[1]) * f);
      const bl = Math.round(a.rgb[2] + (b.rgb[2] - a.rgb[2]) * f);
      return `rgb(${r},${g},${bl})`;
    }
  }
  const last = VIRIDIS_STOPS[VIRIDIS_STOPS.length - 1].rgb;
  return `rgb(${last[0]},${last[1]},${last[2]})`;
}

// Grid dimensions for the pseudo-STFT. 60 time bins × 40 frequency bins = 2400
// cells — dense enough to read as a spectrogram, still well within SVG perf.
const N_TIME = 60;
const N_FREQ = 40;
const T_MIN = 0;
const T_MAX = 2; // seconds
const F_MIN = 0;
const F_MAX = 4000; // Hz (4 kHz)

// Chirp line: f(t) = 200 + 1800 * t  →  200 Hz at t=0 sweeping to 3800 Hz at t=2s.
const CHIRP_F0 = 200;
const CHIRP_SLOPE = 1800; // Hz / s

// Narrowband burst: bright lump at (~1.0 s, ~2500 Hz), extent ~200 ms × 200 Hz.
const BURST_T = 1.0;
const BURST_F = 2500;
const BURST_DT = 0.1; // half-extent in time (so full extent ≈ 200 ms)
const BURST_DF = 100; // half-extent in frequency (so full extent ≈ 200 Hz)

function stftPower(t: number, f: number): number {
  // Background — low, constant noise floor.
  let p = 0.02;

  // Chirp ridge — gaussian falloff around the f = 200 + 1800 t line.
  const chirpCenter = CHIRP_F0 + CHIRP_SLOPE * t;
  const chirpSigma = 180; // Hz — ridge width
  const dChirp = (f - chirpCenter) / chirpSigma;
  p += 0.92 * Math.exp(-0.5 * dChirp * dChirp);

  // Burst — 2D gaussian blob.
  const dt = (t - BURST_T) / BURST_DT;
  const df = (f - BURST_F) / BURST_DF;
  p += 0.85 * Math.exp(-0.5 * (dt * dt + df * df));

  return p;
}

interface Props {
  width: number;
  height: number;
}

export function Spectrogram({ width, height }: Props) {
  const margin = { top: 20, right: 72, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { cells, maxLogP } = useMemo(() => {
    const dt = (T_MAX - T_MIN) / N_TIME;
    const df = (F_MAX - F_MIN) / N_FREQ;
    const out: { ti: number; fi: number; t: number; f: number; logP: number }[] = [];
    let lp = -Infinity;
    for (let ti = 0; ti < N_TIME; ti++) {
      const t = T_MIN + (ti + 0.5) * dt;
      for (let fi = 0; fi < N_FREQ; fi++) {
        const f = F_MIN + (fi + 0.5) * df;
        const p = stftPower(t, f);
        // log-power encoding — compresses the dynamic range the way a real
        // spectrogram (dB scale) does.
        const logP = Math.log10(1 + p * 20);
        if (logP > lp) lp = logP;
        out.push({ ti, fi, t, f, logP });
      }
    }
    return { cells: out, maxLogP: lp };
  }, []);

  const xScale = scaleLinear({ domain: [T_MIN, T_MAX], range: [0, iw] });
  const yScale = scaleLinear({ domain: [F_MIN, F_MAX], range: [ih, 0] });

  const cellW = iw / N_TIME;
  const cellH = ih / N_FREQ;

  // Anchor targets — chosen to name specific story features.
  // Signal peak: the chirp-ridge cell at t ≈ 0.5s (f ≈ 1100 Hz).
  const peakT = 0.5;
  const peakF = CHIRP_F0 + CHIRP_SLOPE * peakT; // 1100 Hz
  const peakX = xScale(peakT);
  const peakY = yScale(peakF);

  // Chirp diagonal — rect covers the ridge band from start to end.
  const chirpStartX = xScale(0);
  const chirpStartY = yScale(CHIRP_F0);
  const chirpEndX = xScale(T_MAX);
  const chirpEndY = yScale(CHIRP_F0 + CHIRP_SLOPE * T_MAX);

  // Burst rect — centred on (BURST_T, BURST_F) with half-extent ±BURST_DT/DF.
  const burstX0 = xScale(BURST_T - BURST_DT);
  const burstX1 = xScale(BURST_T + BURST_DT);
  const burstY0 = yScale(BURST_F + BURST_DF);
  const burstY1 = yScale(BURST_F - BURST_DF);

  // Background low-power region — pick a zone far above the chirp where power
  // is near-noise-floor (e.g. f ∈ [3900, 4000], t ∈ [0, 0.6]) so it's visibly
  // dark purple and unambiguously NOT on the ridge.
  const bgX0 = xScale(0);
  const bgX1 = xScale(0.6);
  const bgY0 = yScale(4000);
  const bgY1 = yScale(3900);

  // Legend geometry — vertical viridis ramp on the right margin.
  const legendW = 12;
  const legendH = ih;
  const legendX = iw + 20;
  const legendSteps = 32;

  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  return (
    <svg width={width} height={height} role="img" aria-label="Spectrogram">
      <Group left={margin.left} top={margin.top}>
        {/* Cell grid — ~2400 rects, one per (time, freq) bin */}
        <g data-data-layer="true">
          {cells.map((c) => {
            const x = c.ti * cellW;
            const y = (N_FREQ - 1 - c.fi) * cellH;
            const u = c.logP / maxLogP;
            return (
              <rect
                key={`${c.ti}-${c.fi}`}
                x={x}
                y={y}
                // +0.5 avoids hairline gaps between neighbours on some renderers.
                width={cellW + 0.5}
                height={cellH + 0.5}
                fill={viridis(u)}
              />
            );
          })}
        </g>

        {/* 1. Signal peak — a single bright cell on the chirp ridge */}
        <ExplainAnchor
          selector="signal-peak"
          index={1}
          pin={{
            x: clamp(peakX + 14, 0, iw),
            y: clamp(peakY - 14, 0, ih),
          }}
          rect={{
            x: clamp(peakX - cellW, 0, iw),
            y: clamp(peakY - cellH, 0, ih),
            width: cellW * 2,
            height: cellH * 2,
          }}
        >
          <rect
            x={clamp(peakX - cellW / 2, 0, iw)}
            y={clamp(peakY - cellH / 2, 0, ih)}
            width={cellW}
            height={cellH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
        </ExplainAnchor>

        {/* 2. Chirp diagonal — the linearly-rising ridge */}
        <ExplainAnchor
          selector="chirp"
          index={2}
          pin={{
            x: clamp(xScale(1.4), 0, iw),
            y: clamp(yScale(CHIRP_F0 + CHIRP_SLOPE * 1.4) - 22, 0, ih),
          }}
          rect={{
            x: 0,
            y: 0,
            width: iw,
            height: ih,
          }}
        >
          <line
            x1={chirpStartX}
            y1={chirpStartY}
            x2={chirpEndX}
            y2={chirpEndY}
            stroke="var(--color-page)"
            strokeWidth={1}
            strokeDasharray="3 4"
            opacity={0.55}
          />
        </ExplainAnchor>

        {/* 3. Narrowband burst — the bright blob near (1.0 s, 2.5 kHz) */}
        <ExplainAnchor
          selector="burst"
          index={3}
          pin={{
            x: clamp(burstX1 + 16, 0, iw),
            y: clamp((burstY0 + burstY1) / 2 - 4, 0, ih),
          }}
          rect={{
            x: clamp(burstX0 - 2, 0, iw),
            y: clamp(burstY0 - 2, 0, ih),
            width: clamp(burstX1 - burstX0 + 4, 0, iw),
            height: clamp(burstY1 - burstY0 + 4, 0, ih),
          }}
        >
          <rect
            x={burstX0}
            y={burstY0}
            width={burstX1 - burstX0}
            height={burstY1 - burstY0}
            fill="none"
            stroke="var(--color-page)"
            strokeWidth={1.1}
            strokeDasharray="2 3"
            opacity={0.85}
          />
        </ExplainAnchor>

        {/* 4. Background low-power region — near-zero, dark purple */}
        <ExplainAnchor
          selector="background"
          index={4}
          pin={{
            x: clamp((bgX0 + bgX1) / 2, 0, iw),
            y: clamp(bgY0 - 10, 0, ih),
          }}
          rect={{
            x: bgX0,
            y: bgY0,
            width: bgX1 - bgX0,
            height: bgY1 - bgY0,
          }}
        >
          <rect
            x={bgX0}
            y={bgY0}
            width={bgX1 - bgX0}
            height={bgY1 - bgY0}
            fill="none"
            stroke="var(--color-page)"
            strokeWidth={0.9}
            strokeDasharray="1 3"
            opacity={0.7}
          />
        </ExplainAnchor>

        {/* 5. X-axis — time */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => `${Number(v).toFixed(1)}s`}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 10,
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
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            TIME (s)
          </text>
        </ExplainAnchor>

        {/* 6. Y-axis — frequency */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => `${(Number(v) / 1000).toFixed(1)}k`}
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
            x={-44}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            FREQ (Hz)
          </text>
        </ExplainAnchor>

        {/* 7. Colour-scale legend — viridis ramp */}
        <g data-data-layer="true" transform={`translate(${legendX}, 0)`}>
          {Array.from({ length: legendSteps }).map((_, i) => {
            const u = 1 - i / (legendSteps - 1);
            const segH = legendH / legendSteps;
            return (
              <rect
                key={i}
                x={0}
                y={i * segH}
                width={legendW}
                height={segH + 0.5}
                fill={viridis(u)}
              />
            );
          })}
          <text
            x={legendW + 6}
            y={8}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            HIGH
          </text>
          <text
            x={legendW + 6}
            y={legendH - 2}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            LOW
          </text>
        </g>
        <ExplainAnchor
          selector="colour-scale"
          index={7}
          pin={{ x: legendX + legendW + 26, y: legendH / 2 }}
          rect={{
            x: legendX - 2,
            y: 0,
            width: legendW + 36,
            height: legendH,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
