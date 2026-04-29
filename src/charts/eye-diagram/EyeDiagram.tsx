"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Seeded LCG — deterministic across server + client.
function makeRand(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

// Box-Muller Gaussian from two uniform samples.
function gaussian(rand: () => number): number {
  const u = Math.max(1e-9, rand());
  const v = Math.max(1e-9, rand());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Raised-cosine interpolation between v0 and v1, t in [0,1].
// This is the baseband pulse-shaping filter used in ITU-T G.957 NRZ links.
function raisedCos(v0: number, v1: number, t: number): number {
  const alpha = (1 - Math.cos(Math.PI * t)) / 2;
  return v0 + (v1 - v0) * alpha;
}

// Generate one eye-diagram trace: 2 UI (unit intervals) wide,
// transitioning from bit b0 to b1 then b1 to b2.
// Returns an array of {t, v} points, t in [0, 2].
function makeTrace(
  b0: number,
  b1: number,
  b2: number,
  rand: () => number,
  nPoints = 60,
): { t: number; v: number }[] {
  const v0 = b0 ? 1 : -1;
  const v1 = b1 ? 1 : -1;
  const v2 = b2 ? 1 : -1;
  const noise = 0.07;
  const jitter = 0.04; // jitter in fraction of UI
  const j = (rand() - 0.5) * jitter * 2;

  const pts: { t: number; v: number }[] = [];
  for (let i = 0; i <= nPoints; i++) {
    const t = (i / nPoints) * 2; // 0..2 UI
    let v: number;
    if (t <= 1) {
      const tc = Math.max(0, Math.min(1, t + j));
      v = raisedCos(v0, v1, tc);
    } else {
      const tc = Math.max(0, Math.min(1, t - 1 + j));
      v = raisedCos(v1, v2, tc);
    }
    v += gaussian(rand) * noise;
    pts.push({ t, v });
  }
  return pts;
}

interface Props {
  width: number;
  height: number;
}

export function EyeDiagram({ width, height }: Props) {
  const margin = { top: 24, right: 28, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 2], range: [0, iw] });
  const yScale = scaleLinear({ domain: [-1.4, 1.4], range: [ih, 0] });

  // All traces generated deterministically from a seeded LCG.
  const traces = useMemo(() => {
    const rand = makeRand(0xdeadbeef);
    const bits: number[] = [];
    // 400 bits, ~200 transitions to overlay
    for (let i = 0; i < 402; i++) {
      bits.push(rand() < 0.5 ? 0 : 1);
    }
    const out: { t: number; v: number }[][] = [];
    for (let i = 0; i < 200; i++) {
      out.push(makeTrace(bits[i], bits[i + 1], bits[i + 2], rand));
    }
    return out;
  }, []);

  // Build SVG polyline point strings
  const tracePaths = useMemo(
    () =>
      traces.map((trace) =>
        trace.map((p) => `${xScale(p.t).toFixed(1)},${yScale(p.v).toFixed(1)}`).join(" "),
      ),
    [traces, xScale, yScale],
  );

  // Eye geometry — computed from the ideal PAM-2 waveform, not data-dependent.
  // At t=1 (UI centre), ideal separation is 2 V (from -1 to +1).
  // We allow for noise: eye height ~ 1.4 V, eye width ~ 0.62 UI.
  const eyeCentreX = xScale(1);
  const eyeCentreY = yScale(0);

  // Eye mask: compliance rectangle in centre of eye opening.
  // Per ITU-T G.957, the mask defines forbidden territory for any trace.
  const maskHalfW = xScale(0.62 / 2) - xScale(0);
  const maskHalfH = yScale(0) - yScale(0.52);
  const maskX = eyeCentreX - maskHalfW;
  const maskY = eyeCentreY - maskHalfH;
  const maskW = maskHalfW * 2;
  const maskH = maskHalfH * 2;

  // Eye height: vertical opening at t = 1 (UI centre)
  const eyeHeightTop = yScale(0.52);
  const eyeHeightBot = yScale(-0.52);

  // Eye width: horizontal opening at y = 0 (decision threshold)
  const eyeWidthLeft = xScale(1 - 0.31);
  const eyeWidthRight = xScale(1 + 0.31);

  // Decision threshold y = 0 line
  const decisionY = yScale(0);

  // An example single trace to highlight (trace index 7)
  const sampleTracePath = tracePaths[7];

  return (
    <svg width={width} height={height} role="img" aria-label="Eye Diagram — NRZ PAM-2 signal overlay">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(6).map((t) => (
            <line
              key={`yg-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray={t === 0 ? undefined : "2 3"}
            />
          ))}
          {[0, 0.5, 1, 1.5, 2].map((t) => (
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

        {/* All overlaid traces — the eye forms from superposition */}
        <ExplainAnchor
          selector="trace-overlay"
          index={2}
          pin={{ x: xScale(0.25), y: yScale(0.9) - 12 }}
          rect={{ x: 0, y: 0, width: xScale(0.5), height: ih }}
        >
          <g data-data-layer="true">
            {tracePaths.map((pts, i) => (
              <polyline
                key={i}
                points={pts}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={0.8}
                strokeOpacity={0.12}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Highlighted single trace */}
        <g data-data-layer="true">
          <polyline
            points={sampleTracePath}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.4}
            strokeOpacity={0.55}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Eye opening (central clear region) */}
        <ExplainAnchor
          selector="eye-opening"
          index={1}
          pin={{ x: eyeCentreX + 12, y: eyeCentreY - 4 }}
          rect={{
            x: Math.max(0, eyeCentreX - maskHalfW * 1.4),
            y: Math.max(0, eyeCentreY - maskHalfH * 1.4),
            width: Math.min(iw, maskHalfW * 2.8),
            height: Math.min(ih, maskHalfH * 2.8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Eye mask — compliance region (ITU-T G.957 / IEEE 802.3) */}
        <ExplainAnchor
          selector="eye-mask"
          index={3}
          pin={{ x: maskX + maskW + 8, y: maskY - 8 }}
          rect={{ x: Math.max(0, maskX), y: Math.max(0, maskY), width: maskW, height: maskH }}
        >
          <rect
            x={maskX}
            y={maskY}
            width={maskW}
            height={maskH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            data-data-layer="true"
          />
          <text
            x={maskX + maskW / 2}
            y={maskY - 5}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
            data-data-layer="true"
          >
            MASK
          </text>
        </ExplainAnchor>

        {/* Eye height measurement */}
        <ExplainAnchor
          selector="eye-height"
          index={4}
          pin={{ x: eyeCentreX + maskHalfW + 14, y: eyeCentreY }}
          rect={{
            x: Math.min(iw - 20, eyeCentreX + maskHalfW),
            y: Math.max(0, eyeHeightTop),
            width: 20,
            height: Math.min(ih, eyeHeightBot - eyeHeightTop),
          }}
        >
          <g data-data-layer="true">
            {/* Bracket lines for eye height */}
            <line
              x1={eyeCentreX + maskHalfW + 2}
              x2={eyeCentreX + maskHalfW + 10}
              y1={eyeHeightTop}
              y2={eyeHeightTop}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
            />
            <line
              x1={eyeCentreX + maskHalfW + 6}
              x2={eyeCentreX + maskHalfW + 6}
              y1={eyeHeightTop}
              y2={eyeHeightBot}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
            />
            <line
              x1={eyeCentreX + maskHalfW + 2}
              x2={eyeCentreX + maskHalfW + 10}
              y1={eyeHeightBot}
              y2={eyeHeightBot}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
            />
            <text
              x={eyeCentreX + maskHalfW + 14}
              y={eyeCentreY + 4}
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              EH
            </text>
          </g>
        </ExplainAnchor>

        {/* Eye width measurement */}
        <ExplainAnchor
          selector="eye-width"
          index={5}
          pin={{ x: eyeCentreX, y: decisionY + maskHalfH + 14 }}
          rect={{
            x: Math.max(0, eyeWidthLeft),
            y: Math.min(ih - 12, decisionY + maskHalfH),
            width: eyeWidthRight - eyeWidthLeft,
            height: 12,
          }}
        >
          <g data-data-layer="true">
            {/* Bracket lines for eye width */}
            <line
              x1={eyeWidthLeft}
              x2={eyeWidthLeft}
              y1={decisionY + maskHalfH + 2}
              y2={decisionY + maskHalfH + 8}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
            />
            <line
              x1={eyeWidthLeft}
              x2={eyeWidthRight}
              y1={decisionY + maskHalfH + 5}
              y2={decisionY + maskHalfH + 5}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
            />
            <line
              x1={eyeWidthRight}
              x2={eyeWidthRight}
              y1={decisionY + maskHalfH + 2}
              y2={decisionY + maskHalfH + 8}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
            />
            <text
              x={eyeCentreX}
              y={decisionY + maskHalfH + 17}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              EW
            </text>
          </g>
        </ExplainAnchor>

        {/* Decision threshold y = 0 */}
        <ExplainAnchor
          selector="decision-threshold"
          index={6}
          pin={{ x: iw - 4, y: decisionY - 10 }}
          rect={{ x: 0, y: Math.max(0, decisionY - 5), width: iw, height: 10 }}
        >
          <line
            x1={0}
            x2={iw}
            y1={decisionY}
            y2={decisionY}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="1 3"
            data-data-layer="true"
          />
          <text
            x={iw - 6}
            y={decisionY - 3}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
            data-data-layer="true"
          >
            VTH
          </text>
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={7}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => `${Number(v).toFixed(1)} UI`}
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
            TIME (UNIT INTERVALS)
          </text>
        </ExplainAnchor>

        {/* Y-axis (no anchor — voltage axis is self-explanatory at this level of detail) */}
        <AxisLeft
          scale={yScale}
          numTicks={6}
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
          y={-10}
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-mute)"
        >
          VOLTAGE (NORM.)
        </text>
      </Group>
    </svg>
  );
}
