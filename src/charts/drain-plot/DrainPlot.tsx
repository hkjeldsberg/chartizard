"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { LinePath } from "@visx/shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ---------------------------------------------------------------------------
// Generic n-channel enhancement MOSFET family-of-curves.
// Shockley's long-channel model (ignoring channel-length modulation λ = 0):
//   cutoff      (V_GS ≤ V_th):            I_D = 0
//   triode      (V_DS ≤ V_GS − V_th):     I_D = k · [(V_GS − V_th)·V_DS − V_DS²/2]
//   saturation  (V_DS  > V_GS − V_th):    I_D = k · (V_GS − V_th)² / 2
// with k = μn·Cox·W/L.  Units chosen so currents land in a readable mA range.
// ---------------------------------------------------------------------------

const V_TH = 0.7; // threshold voltage (V)
const K_PARAM = 0.0006; // A/V² — tuned so peak I_D ≈ 2.1 mA for V_GS = 3.0 V
const VDS_MAX = 5.0;
const VGS_VALUES = [1.0, 1.5, 2.0, 2.5, 3.0] as const;
const SAMPLES = 120;

function drainCurrent(vgs: number, vds: number): number {
  const vov = vgs - V_TH; // overdrive voltage
  if (vov <= 0) return 0;
  if (vds <= vov) {
    // Triode
    return K_PARAM * (vov * vds - (vds * vds) / 2);
  }
  // Saturation
  return K_PARAM * (vov * vov) / 2;
}

interface Point {
  vds: number;
  id: number; // amps
}

interface Curve {
  vgs: number;
  points: Point[];
  knee: { vds: number; id: number } | null; // null for V_GS = 1.0 V (below threshold for most of sweep)
}

// Pre-compute all five curves, converting I_D to milliamps for display.
const CURVES: ReadonlyArray<Curve> = VGS_VALUES.map((vgs) => {
  const points: Point[] = Array.from({ length: SAMPLES }, (_, i) => {
    const vds = (i / (SAMPLES - 1)) * VDS_MAX;
    return { vds, id: drainCurrent(vgs, vds) * 1000 };
  });
  const vov = vgs - V_TH;
  const knee = vov > 0 && vov < VDS_MAX
    ? { vds: vov, id: drainCurrent(vgs, vov) * 1000 }
    : null;
  return { vgs, points, knee };
});

interface Props {
  width: number;
  height: number;
}

export function DrainPlot({ width, height }: Props) {
  const margin = { top: 20, right: 56, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = useMemo(
    () => scaleLinear<number>({ domain: [0, VDS_MAX], range: [0, iw] }),
    [iw],
  );
  const yScale = useMemo(
    () => scaleLinear<number>({ domain: [0, 2.6], range: [ih, 0], nice: true }),
    [ih],
  );

  // Reference curve for the knee-annotation anchor — V_GS = 2.5 V (manifest hint).
  const highlightCurve = CURVES.find((c) => c.vgs === 2.5)!;
  const kneeX = highlightCurve.knee ? xScale(highlightCurve.knee.vds) : 0;
  const kneeY = highlightCurve.knee ? yScale(highlightCurve.knee.id) : 0;

  // The V_GS = 3.0 V curve's saturation plateau — target for the saturation anchor.
  const topCurve = CURVES[CURVES.length - 1];
  const topSatPoint = topCurve.points[Math.round(SAMPLES * 0.85)];
  const satX = xScale(topSatPoint.vds);
  const satY = yScale(topSatPoint.id);

  // The V_GS = 1.0 V curve — near-zero current, explained by the cutoff anchor.
  const cutoffCurve = CURVES[0];
  const cutoffPoint = cutoffCurve.points[Math.round(SAMPLES * 0.85)];
  const cutoffX = xScale(cutoffPoint.vds);
  const cutoffY = yScale(cutoffPoint.id);

  // Pinch-off locus — the parabola V_DS = V_GS − V_th, separating triode and saturation.
  const locus = useMemo(() => {
    const pts: Point[] = [];
    for (let i = 0; i <= 60; i++) {
      const vgs = V_TH + (i / 60) * (VGS_VALUES[VGS_VALUES.length - 1] + 0.3 - V_TH);
      const vds = vgs - V_TH;
      if (vds > VDS_MAX) break;
      pts.push({ vds, id: drainCurrent(vgs, vds) * 1000 });
    }
    return pts;
  }, []);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Drain characteristic plot of an n-channel MOSFET, family of I_D vs V_DS curves parameterised by V_GS"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Light gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(5).map((v) => (
            <line
              key={`gy-${v}`}
              x1={0}
              x2={iw}
              y1={yScale(v)}
              y2={yScale(v)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
          {xScale.ticks(5).map((v) => (
            <line
              key={`gx-${v}`}
              x1={xScale(v)}
              x2={xScale(v)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
              opacity={0.6}
            />
          ))}
        </g>

        {/* 1. Triode region — the curves' rising flank */}
        <ExplainAnchor
          selector="triode-region"
          index={1}
          pin={{ x: Math.min(iw - 10, xScale(0.6)), y: Math.max(10, yScale(1.7)) }}
          rect={{
            x: 0,
            y: 0,
            width: Math.min(xScale(1.8), iw),
            height: ih,
          }}
        >
          <g data-data-layer="true">
            {CURVES.map((c) => {
              const triodePts = c.knee
                ? c.points.filter((p) => p.vds <= c.knee!.vds + 1e-9)
                : c.points.slice(0, 2);
              if (triodePts.length < 2) return null;
              return (
                <LinePath
                  key={`triode-${c.vgs}`}
                  data={triodePts}
                  x={(d) => xScale(d.vds)}
                  y={(d) => yScale(d.id)}
                  stroke="var(--color-ink)"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
          </g>
        </ExplainAnchor>

        {/* 2. Saturation region — flat plateaus to the right of the knee */}
        <ExplainAnchor
          selector="saturation-region"
          index={2}
          pin={{ x: Math.min(iw - 10, satX + 14), y: Math.max(10, satY - 12) }}
          rect={{
            x: Math.min(iw, xScale(1.8)),
            y: 0,
            width: Math.max(0, iw - xScale(1.8)),
            height: ih,
          }}
        >
          <g data-data-layer="true">
            {CURVES.map((c) => {
              const satPts = c.knee
                ? c.points.filter((p) => p.vds >= c.knee!.vds - 1e-9)
                : c.points;
              if (satPts.length < 2) return null;
              return (
                <LinePath
                  key={`sat-${c.vgs}`}
                  data={satPts}
                  x={(d) => xScale(d.vds)}
                  y={(d) => yScale(d.id)}
                  stroke="var(--color-ink)"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
          </g>
        </ExplainAnchor>

        {/* 3. Pinch-off locus — the parabola V_DS = V_GS − V_th separating the two regions */}
        <ExplainAnchor
          selector="pinch-off-locus"
          index={3}
          pin={{ x: Math.min(iw - 10, kneeX + 18), y: Math.max(10, kneeY - 18) }}
          rect={{
            x: Math.max(0, kneeX - 8),
            y: Math.max(0, kneeY - 8),
            width: 16,
            height: 16,
          }}
        >
          <g data-data-layer="true">
            <LinePath
              data={locus}
              x={(d) => xScale(d.vds)}
              y={(d) => yScale(d.id)}
              stroke="var(--color-ink-mute)"
              strokeWidth={1.2}
              strokeDasharray="4 3"
            />
            {/* Emphasise the knee on the V_GS = 2.5 V curve */}
            {highlightCurve.knee && (
              <circle cx={kneeX} cy={kneeY} r={3.2} fill="none" stroke="var(--color-ink)" strokeWidth={1.4} />
            )}
          </g>
        </ExplainAnchor>

        {/* 4. Cutoff — V_GS = 1.0 V sits above V_th (0.7 V), so a tiny triode-only current, no saturation knee */}
        <ExplainAnchor
          selector="cutoff-curve"
          index={4}
          pin={{ x: Math.min(iw - 10, cutoffX + 14), y: Math.min(ih - 10, cutoffY + 14) }}
          rect={{
            x: Math.max(0, cutoffX - 40),
            y: Math.max(0, cutoffY - 6),
            width: Math.min(iw - Math.max(0, cutoffX - 40), 48),
            height: 14,
          }}
        >
          <g data-data-layer="true">
            <text
              x={Math.min(iw - 4, cutoffX + 4)}
              y={Math.min(ih - 4, cutoffY + 14)}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              V_GS = 1.0 V
            </text>
          </g>
        </ExplainAnchor>

        {/* 5. V_GS curve labels — explicit legend at the right edge of each plateau */}
        <ExplainAnchor
          selector="vgs-labels"
          index={5}
          pin={{ x: Math.min(iw + 28, iw + 24), y: yScale(topCurve.points[SAMPLES - 1].id) }}
          rect={{
            x: iw,
            y: 0,
            width: margin.right,
            height: ih,
          }}
        >
          <g data-data-layer="true">
            {CURVES.map((c) => {
              const tail = c.points[SAMPLES - 1];
              // Skip the cutoff-curve label here — it's handled by anchor 4.
              if (c.vgs <= 1.0) return null;
              return (
                <text
                  key={`lbl-${c.vgs}`}
                  x={iw + 6}
                  y={yScale(tail.id)}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-mute)"
                  dominantBaseline="central"
                >
                  {`${c.vgs.toFixed(1)} V`}
                </text>
              );
            })}
          </g>
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={6}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v) => String(v)}
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
            y={ih + 34}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            V_DS (V)
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={7}
          pin={{ x: -34, y: ih / 2 }}
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
          <text
            x={-margin.left + 4}
            y={-6}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            I_D (mA)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
