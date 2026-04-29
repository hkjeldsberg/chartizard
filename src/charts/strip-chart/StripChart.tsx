"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft } from "@visx/axis";
import { LinePath } from "@visx/shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ---------------------------------------------------------------------------
// Synthetic ECG (lead II) — PQRST complex assembled from Gaussians.
// Each cycle is ~0.8 s (≈75 bpm). We lay out several full cycles across the
// rolling window. No animation: this is a frozen snapshot of a paper-tape
// recorder at the instant the chart mounts.
// ---------------------------------------------------------------------------

const WINDOW_SECONDS = 3.2; // visible horizontal span
const SAMPLE_HZ = 500;
const CYCLE_SECONDS = 0.8;
const PAPER_SPEED_MM_PER_S = 25; // standard clinical ECG paper speed

// Synthesise a single lead-II beat as a sum of Gaussians in mV.
// Offsets are expressed in fractions of a cycle so the waveform tiles cleanly.
function beat(phase: number): number {
  // phase in [0, 1), one full cardiac cycle.
  const g = (mu: number, sigma: number, amp: number) =>
    amp * Math.exp(-((phase - mu) ** 2) / (2 * sigma * sigma));
  // P wave (atrial depolarisation)
  const p = g(0.14, 0.025, 0.12);
  // Q (small negative dip just before R)
  const q = g(0.27, 0.008, -0.08);
  // R (tall positive spike — the beat the eye lands on)
  const r = g(0.30, 0.011, 1.05);
  // S (negative undershoot after R)
  const s = g(0.335, 0.010, -0.22);
  // T wave (ventricular repolarisation)
  const t = g(0.52, 0.04, 0.28);
  return p + q + r + s + t;
}

interface Sample {
  t: number; // seconds since window start
  v: number; // mV
}

interface Props {
  width: number;
  height: number;
}

export function StripChart({ width, height }: Props) {
  const margin = { top: 22, right: 60, bottom: 38, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data: ReadonlyArray<Sample> = useMemo(() => {
    const n = Math.round(WINDOW_SECONDS * SAMPLE_HZ);
    const out: Sample[] = new Array(n);
    for (let i = 0; i < n; i++) {
      const t = (i / SAMPLE_HZ);
      // Phase within the current cardiac cycle, wrapped to [0, 1).
      const phase = (t / CYCLE_SECONDS) % 1;
      // Small baseline wander (0.2 Hz) + very light noise, both seeded.
      const wander = 0.02 * Math.sin(2 * Math.PI * 0.2 * t + 0.7);
      const noise = 0.006 * Math.sin(t * 113.7) * Math.cos(t * 47.3 + 1.1);
      out[i] = { t, v: beat(phase) + wander + noise };
    }
    return out;
  }, []);

  // Paper advances right-to-left; the "now" edge is on the right.
  // x = 0 at the left edge (oldest sample), x = iw on the right (newest).
  const xScale = useMemo(
    () => scaleLinear<number>({ domain: [0, WINDOW_SECONDS], range: [0, iw] }),
    [iw],
  );
  // Lead-II ECG range in millivolts.
  const yScale = useMemo(
    () => scaleLinear<number>({ domain: [-0.5, 1.3], range: [ih, 0] }),
    [ih],
  );

  // Clinical ECG paper grid: small squares at 0.04 s × 0.1 mV; bold every 5.
  const smallDt = 0.04;
  const smallDv = 0.1;
  const vTicks: number[] = [];
  for (let v = -0.5; v <= 1.3 + 1e-9; v += smallDv) vTicks.push(Number(v.toFixed(2)));
  const tTicks: number[] = [];
  for (let t = 0; t <= WINDOW_SECONDS + 1e-9; t += smallDt) tTicks.push(Number(t.toFixed(2)));

  // Locate the right-most R-peak (the "latest" QRS) for anchor placement.
  const lastR = useMemo(() => {
    // The beat peaks at phase ≈ 0.30 within each 0.8s cycle.
    const peakPhase = 0.30;
    let tPeak = peakPhase * CYCLE_SECONDS;
    while (tPeak + CYCLE_SECONDS <= WINDOW_SECONDS) tPeak += CYCLE_SECONDS;
    return { t: tPeak, v: beat(peakPhase) };
  }, []);

  // Zero (isoelectric) reference line.
  const zeroY = yScale(0);
  const rx = xScale(lastR.t);
  const ry = yScale(lastR.v);

  // Right-edge "leading edge" indicator.
  const edgeX = iw;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Strip chart recording of a synthetic lead-II ECG waveform"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Fine clinical-paper grid */}
        <g data-data-layer="true">
          {tTicks.map((t, i) => (
            <line
              key={`vt-${i}`}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeWidth={i % 5 === 0 ? 0.8 : 0.3}
              opacity={i % 5 === 0 ? 0.65 : 0.35}
            />
          ))}
          {vTicks.map((v, i) => (
            <line
              key={`vh-${i}`}
              x1={0}
              x2={iw}
              y1={yScale(v)}
              y2={yScale(v)}
              stroke="var(--color-hairline)"
              strokeWidth={i % 5 === 0 ? 0.8 : 0.3}
              opacity={i % 5 === 0 ? 0.65 : 0.35}
            />
          ))}
        </g>

        {/* 1. Isoelectric (0 mV) baseline — the reference the waveform dances around */}
        <ExplainAnchor
          selector="baseline"
          index={1}
          pin={{ x: 12, y: zeroY }}
          rect={{ x: 0, y: zeroY - 4, width: iw, height: 8 }}
        >
          <line
            x1={0}
            x2={iw}
            y1={zeroY}
            y2={zeroY}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="3 3"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* 2. The rolling trace — the chart itself */}
        <ExplainAnchor
          selector="trace"
          index={2}
          pin={{
            x: Math.max(16, xScale(lastR.t - CYCLE_SECONDS * 1.5)),
            y: Math.max(10, yScale(0.6)),
          }}
          rect={{ x: 0, y: 0, width: Math.max(0, iw - 2), height: ih }}
        >
          <g data-data-layer="true">
            <LinePath
              data={data as Sample[]}
              x={(d) => xScale(d.t)}
              y={(d) => yScale(d.v)}
              stroke="var(--color-ink)"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </ExplainAnchor>

        {/* 3. The QRS complex — the spike every clinician reads first */}
        <ExplainAnchor
          selector="qrs-complex"
          index={3}
          pin={{ x: Math.min(iw - 14, rx + 16), y: Math.max(12, ry - 10) }}
          rect={{
            x: Math.max(0, rx - 14),
            y: Math.max(0, ry - 6),
            width: Math.min(28, iw - Math.max(0, rx - 14)),
            height: Math.min(ih - Math.max(0, ry - 6), yScale(-0.25) - Math.max(0, ry - 6)),
          }}
        >
          <g data-data-layer="true">
            <circle cx={rx} cy={ry} r={4} fill="none" stroke="var(--color-ink)" strokeWidth={1.5} />
          </g>
        </ExplainAnchor>

        {/* 4. Leading edge — where new samples enter the window */}
        <ExplainAnchor
          selector="leading-edge"
          index={4}
          pin={{ x: edgeX + 20, y: ih / 2 }}
          rect={{ x: Math.max(0, iw - 8), y: 0, width: 8, height: ih }}
        >
          <g data-data-layer="true">
            <line
              x1={edgeX}
              x2={edgeX}
              y1={0}
              y2={ih}
              stroke="var(--color-ink)"
              strokeWidth={1.2}
            />
            {/* Small arrowhead pointing left — direction of paper travel */}
            <polygon
              points={`${edgeX - 1},${ih / 2 - 5} ${edgeX - 9},${ih / 2} ${edgeX - 1},${ih / 2 + 5}`}
              fill="var(--color-ink)"
            />
          </g>
        </ExplainAnchor>

        {/* 5. Amplitude axis (mV) — vertical only; time has no labels */}
        <ExplainAnchor
          selector="amplitude-axis"
          index={5}
          pin={{ x: -34, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickFormat={(v) => `${Number(v).toFixed(1)}`}
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
            mV
          </text>
        </ExplainAnchor>

        {/* 6. Paper-speed annotation — the only explicit time cue */}
        <ExplainAnchor
          selector="paper-speed"
          index={6}
          pin={{ x: iw / 2, y: ih + 22 }}
          rect={{ x: 0, y: ih + 2, width: iw, height: margin.bottom - 2 }}
        >
          <g data-data-layer="true">
            <text
              x={0}
              y={ih + 18}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              LEAD II · {PAPER_SPEED_MM_PER_S} mm/s
            </text>
            <text
              x={iw}
              y={ih + 18}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              ← time
            </text>
          </g>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
