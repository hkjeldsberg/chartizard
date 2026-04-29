"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { line as d3Line, curveBasis } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Same underlying time-frequency pattern as the sibling Spectrogram — chirp
// ridge + narrowband burst — but projected as stacked 1D spectra with
// vertical offset + hidden-surface removal.

const N_TRACES = 14; // time slices
const N_FREQ_POINTS = 160; // resolution along the frequency axis
const F_MIN = 0;
const F_MAX = 4000; // Hz
const T_MIN = 0;
const T_MAX = 2; // seconds

const CHIRP_F0 = 200;
const CHIRP_SLOPE = 1800; // Hz / s
const BURST_T = 1.0;
const BURST_F = 2500;
const BURST_DT = 0.15;
const BURST_DF = 120;

function spectrumAt(t: number, f: number): number {
  let p = 0.04;
  const chirpCenter = CHIRP_F0 + CHIRP_SLOPE * t;
  const chirpSigma = 160;
  const dChirp = (f - chirpCenter) / chirpSigma;
  p += 0.95 * Math.exp(-0.5 * dChirp * dChirp);

  const dt = (t - BURST_T) / BURST_DT;
  const df = (f - BURST_F) / BURST_DF;
  p += 0.82 * Math.exp(-0.5 * (dt * dt + df * df));

  return p;
}

interface Props {
  width: number;
  height: number;
}

export function WaterfallPlotSignal({ width, height }: Props) {
  const margin = { top: 24, right: 48, bottom: 44, left: 70 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { traces, maxAmp } = useMemo(() => {
    const freqs: number[] = [];
    for (let i = 0; i < N_FREQ_POINTS; i++) {
      freqs.push(F_MIN + ((F_MAX - F_MIN) * i) / (N_FREQ_POINTS - 1));
    }
    // Earliest time at the top (convention #1): traceIdx 0 = earliest, drawn
    // at the back so later (lower on the page) traces occlude it when they
    // overlap.
    let mx = 0;
    const tr = Array.from({ length: N_TRACES }).map((_, k) => {
      const t = T_MIN + ((T_MAX - T_MIN) * k) / (N_TRACES - 1);
      const amps = freqs.map((f) => spectrumAt(t, f));
      for (const a of amps) if (a > mx) mx = a;
      return { idx: k, t, freqs, amps };
    });
    return { traces: tr, maxAmp: mx };
  }, []);

  const xScale = scaleLinear({ domain: [F_MIN, F_MAX], range: [0, iw] });

  // Vertical layout: each trace has a baseline. Earlier time = baseline higher
  // up on the page (smaller y). Traces are drawn back-to-front — that means
  // we iterate from k=N_TRACES-1 (latest, front, lowest on page) DOWN? No:
  // "hidden-surface removal" is back-to-front painter's algorithm. Back =
  // earliest (top). Front = latest (bottom). So we iterate EARLIEST-FIRST and
  // later traces paint on top of earlier ones.
  //
  // Layout: fit N traces + amplitude headroom into ih.
  //   totalRows * rowSpacing + amp_headroom = ih
  //   amp_headroom = amp_height (the tallest trace extends upward by this)
  // Give each trace amp_height = rowSpacing * 1.8 so bumps overlap ~1 row.
  const AMP_OVERLAP = 1.8;
  const rowSpacing = ih / (N_TRACES - 1 + AMP_OVERLAP);
  const ampHeight = rowSpacing * AMP_OVERLAP;

  const baselineFor = (idx: number) =>
    // idx 0 (earliest) sits at the top, at y = ampHeight (leaving headroom
    // above for its own amplitude bump). idx grows downward.
    ampHeight + idx * rowSpacing;

  const yFor = (idx: number, amp: number) => {
    const base = baselineFor(idx);
    return base - (amp / maxAmp) * ampHeight;
  };

  const pathFor = (idx: number) => {
    const tr = traces[idx];
    const base = baselineFor(idx);
    const gen = d3Line<number>()
      .x((_, i) => xScale(tr.freqs[i]))
      .y((_, i) => yFor(idx, tr.amps[i]))
      .curve(curveBasis);
    const top = gen(tr.amps) ?? "";
    const firstX = xScale(tr.freqs[0]);
    const lastX = xScale(tr.freqs[tr.freqs.length - 1]);
    // Close to baseline — this fill occludes earlier traces drawn behind.
    return `${top} L ${lastX} ${base} L ${firstX} ${base} Z`;
  };

  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  // Anchor targets ---------------------------------------------------------
  // A representative single trace — pick k = 3 (a bit past the start).
  const singleIdx = 3;
  const singleTrace = traces[singleIdx];
  // Find its peak (max amplitude) to pin the anchor.
  let singlePeakI = 0;
  for (let i = 1; i < singleTrace.amps.length; i++) {
    if (singleTrace.amps[i] > singleTrace.amps[singlePeakI]) singlePeakI = i;
  }
  const singlePeakF = singleTrace.freqs[singlePeakI];
  const singlePeakX = xScale(singlePeakF);
  const singlePeakY = yFor(singleIdx, singleTrace.amps[singlePeakI]);
  const singleBaseY = baselineFor(singleIdx);

  // Migrating peak — connect the peaks of every trace.
  const peakPoints = traces.map((tr, k) => {
    let pi = 0;
    for (let i = 1; i < tr.amps.length; i++) {
      if (tr.amps[i] > tr.amps[pi]) pi = i;
    }
    return { k, x: xScale(tr.freqs[pi]), y: yFor(k, tr.amps[pi]) };
  });

  // Burst traces — the ones where t is close to BURST_T (±BURST_DT).
  const burstTraceIndices = traces
    .map((tr, k) => ({ k, t: tr.t }))
    .filter(({ t }) => Math.abs(t - BURST_T) <= BURST_DT + 0.05)
    .map(({ k }) => k);
  const burstTop =
    burstTraceIndices.length > 0
      ? baselineFor(burstTraceIndices[0]) - ampHeight
      : 0;
  const burstBottom =
    burstTraceIndices.length > 0
      ? baselineFor(burstTraceIndices[burstTraceIndices.length - 1])
      : ih;
  const burstX = xScale(BURST_F);

  // Hidden-surface-removal rect — pick a mid trace where occlusion is visible.
  const hsrIdx = 7;
  const hsrBase = baselineFor(hsrIdx);
  const hsrTop = hsrBase - ampHeight;

  // Offset indicator — vertical gap between two adjacent baselines (traces 5 and 6).
  const offsetBase1 = baselineFor(5);
  const offsetBase2 = baselineFor(6);

  return (
    <svg width={width} height={height} role="img" aria-label="Waterfall plot (signal)">
      <Group left={margin.left} top={margin.top}>
        {/* Traces — drawn back-to-front so later (front) traces occlude earlier
            ones where they overlap. Each path has a background-colour fill
            that extends down to its own baseline — that fill is the hidden-
            surface-removal primitive. */}
        <g data-data-layer="true">
          {traces.map((tr, k) => (
            <g key={tr.idx}>
              <path
                d={pathFor(k)}
                fill="var(--color-surface)"
                stroke="var(--color-ink)"
                strokeWidth={1}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>

        {/* Time-axis tick labels on the left — one per trace baseline */}
        <g data-data-layer="true">
          {traces.map((tr, k) => {
            // Show every other label to avoid crowding.
            if (k % 2 !== 0) return null;
            return (
              <text
                key={`tlab-${k}`}
                x={-8}
                y={baselineFor(k)}
                textAnchor="end"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink-soft)"
              >
                {tr.t.toFixed(2)}s
              </text>
            );
          })}
        </g>

        {/* 1. Single trace — one time slice */}
        <ExplainAnchor
          selector="trace"
          index={1}
          pin={{
            x: clamp(singlePeakX + 18, 0, iw),
            y: clamp(singlePeakY - 10, 0, ih),
          }}
          rect={{
            x: 0,
            y: clamp(singlePeakY - 4, 0, ih),
            width: iw,
            height: clamp(singleBaseY - singlePeakY + 8, 1, ih),
          }}
        >
          <circle
            cx={singlePeakX}
            cy={singlePeakY}
            r={2.5}
            fill="var(--color-ink)"
          />
        </ExplainAnchor>

        {/* 2. Migrating peak — dashed line tracing peaks across traces */}
        {(() => {
          const path = peakPoints
            .map(
              (p, i) =>
                `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`,
            )
            .join(" ");
          const minX = Math.min(...peakPoints.map((p) => p.x));
          const maxX = Math.max(...peakPoints.map((p) => p.x));
          const minY = Math.min(...peakPoints.map((p) => p.y));
          const maxY = Math.max(...peakPoints.map((p) => p.y));
          return (
            <>
              <path
                d={path}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.6}
              />
              <ExplainAnchor
                selector="migrating-peak"
                index={2}
                pin={{
                  x: clamp((minX + maxX) / 2, 0, iw),
                  y: clamp((minY + maxY) / 2 - 14, 0, ih),
                }}
                rect={{
                  x: clamp(minX - 6, 0, iw),
                  y: clamp(minY - 6, 0, ih),
                  width: clamp(maxX - minX + 12, 1, iw),
                  height: clamp(maxY - minY + 12, 1, ih),
                }}
              >
                <g />
              </ExplainAnchor>
            </>
          );
        })()}

        {/* 3. Vertical offset — show the gap between two adjacent baselines */}
        <ExplainAnchor
          selector="vertical-offset"
          index={3}
          pin={{
            x: clamp(xScale(3800) + 16, 0, iw),
            y: clamp((offsetBase1 + offsetBase2) / 2, 0, ih),
          }}
          rect={{
            x: clamp(xScale(3600), 0, iw),
            y: clamp(offsetBase1 - 4, 0, ih),
            width: clamp(xScale(4000) - xScale(3600), 1, iw),
            height: clamp(offsetBase2 - offsetBase1 + 8, 1, ih),
          }}
        >
          <line
            x1={xScale(3800)}
            y1={offsetBase1}
            x2={xScale(3800)}
            y2={offsetBase2}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          <line
            x1={xScale(3780)}
            y1={offsetBase1}
            x2={xScale(3820)}
            y2={offsetBase1}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          <line
            x1={xScale(3780)}
            y1={offsetBase2}
            x2={xScale(3820)}
            y2={offsetBase2}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
        </ExplainAnchor>

        {/* 4. Hidden-surface-removal fill — highlight one trace's fill region */}
        <ExplainAnchor
          selector="hidden-surface"
          index={4}
          pin={{
            x: clamp(xScale(400), 0, iw),
            y: clamp((hsrTop + hsrBase) / 2, 0, ih),
          }}
          rect={{
            x: clamp(xScale(300), 0, iw),
            y: clamp(hsrTop + 4, 0, ih),
            width: clamp(xScale(900) - xScale(300), 1, iw),
            height: clamp(hsrBase - hsrTop - 8, 1, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Burst — lump visible in 2-3 adjacent traces near t = 1.0 s */}
        <ExplainAnchor
          selector="burst"
          index={5}
          pin={{
            x: clamp(burstX + 18, 0, iw),
            y: clamp((burstTop + burstBottom) / 2, 0, ih),
          }}
          rect={{
            x: clamp(burstX - 28, 0, iw),
            y: clamp(burstTop - 4, 0, ih),
            width: 56,
            height: clamp(burstBottom - burstTop + 8, 1, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. X-axis — frequency */}
        <ExplainAnchor
          selector="x-axis"
          index={6}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => `${(Number(v) / 1000).toFixed(1)}k`}
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
            FREQUENCY (Hz)
          </text>
        </ExplainAnchor>

        {/* 7. Y-axis — time, with each row offset */}
        <ExplainAnchor
          selector="y-axis"
          index={7}
          pin={{ x: -52, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <text
            x={-58}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            TIME
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
