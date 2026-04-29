"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Aircraft-performance carpet plot — the aerospace trade-study chart.
// Plane axes: x = cruise range (nm), y = payload (lb).
// Carpet strings (each parameterised by a third variable):
//   - Gross-weight strings (iso-MTOW): heavier aircraft reach further at a
//     given payload; curves bow outward as weight rises.
//   - Wing-loading strings (iso-W/S): higher W/S trades payload for range
//     by flying the same airframe with a smaller wing.
const WEIGHTS = [120_000, 140_000, 160_000, 180_000, 200_000] as const; // lb
const LOADINGS = [100, 115, 130, 145, 160] as const; // lb/ft²

// Parametric generator: for a given gross weight W and wing loading WS,
// return (range, payload). This is a deliberately simplified Breguet-style
// sketch — not a real aero model — tuned to produce legibly intersecting
// curves that cover the plane.
function perfPoint(W: number, WS: number): { range: number; payload: number } {
  // Empty weight climbs with structure (wing area grows as W/WS ↓).
  const wingArea = W / WS;
  const empty = 0.52 * W + 35 * wingArea;
  const fuel = 0.28 * W;
  const payload = Math.max(0, W - empty - fuel);

  // Range rises with W (more fuel) and falls with WS (wing too small
  // → higher induced drag at cruise). Offset + scale picked so curves
  // span the visible plane.
  const range = 1200 + 0.014 * W - 6 * (WS - 100);
  return { range, payload };
}

// One carpet string = a line sampled along the parameter that varies.
// "iso-W" strings sweep WS while holding W fixed.
// "iso-WS" strings sweep W while holding WS fixed.
function isoWeightString(W: number): Array<{ range: number; payload: number }> {
  const N = 20;
  const pts: Array<{ range: number; payload: number }> = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const WS = LOADINGS[0] + t * (LOADINGS[LOADINGS.length - 1] - LOADINGS[0]);
    pts.push(perfPoint(W, WS));
  }
  return pts;
}

function isoLoadingString(
  WS: number,
): Array<{ range: number; payload: number }> {
  const N = 20;
  const pts: Array<{ range: number; payload: number }> = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const W = WEIGHTS[0] + t * (WEIGHTS[WEIGHTS.length - 1] - WEIGHTS[0]);
    pts.push(perfPoint(W, WS));
  }
  return pts;
}

interface Props {
  width: number;
  height: number;
}

export function CarpetPlot({ width, height }: Props) {
  const margin = { top: 22, right: 72, bottom: 48, left: 64 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Pre-sample every curve to discover the data range.
  const isoW = WEIGHTS.map((W) => ({ W, points: isoWeightString(W) }));
  const isoL = LOADINGS.map((WS) => ({ WS, points: isoLoadingString(WS) }));

  const allPts = [
    ...isoW.flatMap((s) => s.points),
    ...isoL.flatMap((s) => s.points),
  ];
  const ranges = allPts.map((p) => p.range);
  const payloads = allPts.map((p) => p.payload);

  const xScale = scaleLinear({
    domain: [Math.min(...ranges) - 50, Math.max(...ranges) + 50],
    range: [0, iw],
    nice: true,
  });
  const yScale = scaleLinear({
    domain: [Math.min(...payloads) - 500, Math.max(...payloads) + 1000],
    range: [ih, 0],
    nice: true,
  });

  const toPathD = (pts: Array<{ range: number; payload: number }>) =>
    pts
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"}${xScale(p.range).toFixed(2)} ${yScale(p.payload).toFixed(2)}`,
      )
      .join(" ");

  // Design point = middle weight, middle loading. Read from the plane.
  const designW = WEIGHTS[2];
  const designWS = LOADINGS[2];
  const design = perfPoint(designW, designWS);
  const designPx = { x: xScale(design.range), y: yScale(design.payload) };

  // One representative iso-weight string (middle) and one iso-loading
  // string (middle) get their own anchors.
  const midW = isoW[2];
  const midWS = isoL[2];
  const midWLabelPt = midW.points[midW.points.length - 1];
  const midWSLabelPt = midWS.points[midWS.points.length - 1];

  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  return (
    <svg width={width} height={height} role="img" aria-label="Carpet plot">
      <Group left={margin.left} top={margin.top}>
        {/* Frame + sparse gridlines to anchor the eye on the plane. */}
        <g data-data-layer="true">
          <rect
            x={0}
            y={0}
            width={iw}
            height={ih}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={0.75}
          />
          {xScale.ticks(4).map((t) => (
            <line
              key={`gx-${t}`}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeWidth={0.5}
              strokeDasharray="2 4"
            />
          ))}
          {yScale.ticks(4).map((t) => (
            <line
              key={`gy-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeWidth={0.5}
              strokeDasharray="2 4"
            />
          ))}
        </g>

        {/* Iso-weight strings — each curve holds gross weight constant. */}
        <ExplainAnchor
          selector="weight-strings"
          index={1}
          pin={{
            x: clamp(xScale(midWLabelPt.range) + 24, 10, iw - 10),
            y: clamp(yScale(midWLabelPt.payload) - 4, 10, ih - 10),
          }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g data-data-layer="true">
            {isoW.map((s) => (
              <path
                key={`W-${s.W}`}
                d={toPathD(s.points)}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={s.W === designW ? 1.6 : 1.0}
                strokeOpacity={s.W === designW ? 0.95 : 0.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Iso-loading strings — each curve holds wing loading constant. */}
        <ExplainAnchor
          selector="loading-strings"
          index={2}
          pin={{
            x: clamp(xScale(midWSLabelPt.range) - 32, 10, iw - 10),
            y: clamp(yScale(midWSLabelPt.payload) + 14, 10, ih - 10),
          }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g data-data-layer="true">
            {isoL.map((s) => (
              <path
                key={`WS-${s.WS}`}
                d={toPathD(s.points)}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={s.WS === designWS ? 1.6 : 1.0}
                strokeOpacity={s.WS === designWS ? 0.95 : 0.55}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 3"
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* String end-labels — weight values at end of iso-W curves;
            loading values at end of iso-WS curves. */}
        <g data-data-layer="true">
          {isoW.map((s) => {
            const last = s.points[s.points.length - 1];
            const x = xScale(last.range);
            const y = yScale(last.payload);
            if (x < 0 || x > iw || y < 0 || y > ih) return null;
            return (
              <text
                key={`Wlbl-${s.W}`}
                x={x + 4}
                y={y}
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-mute)"
                dominantBaseline="central"
              >
                {Math.round(s.W / 1000)}k
              </text>
            );
          })}
          {isoL.map((s) => {
            const first = s.points[0];
            const x = xScale(first.range);
            const y = yScale(first.payload);
            if (x < 0 || x > iw || y < 0 || y > ih) return null;
            return (
              <text
                key={`WSlbl-${s.WS}`}
                x={x - 4}
                y={y + 10}
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-mute)"
                textAnchor="end"
              >
                {s.WS}
              </text>
            );
          })}
        </g>

        {/* Design point — the intersection engineers are selecting. */}
        <ExplainAnchor
          selector="design-point"
          index={3}
          pin={{
            x: clamp(designPx.x + 18, 10, iw - 10),
            y: clamp(designPx.y - 18, 10, ih - 10),
          }}
          rect={{
            x: clamp(designPx.x - 10, 0, iw),
            y: clamp(designPx.y - 10, 0, ih),
            width: 20,
            height: 20,
          }}
        >
          <g data-data-layer="true">
            <circle
              cx={designPx.x}
              cy={designPx.y}
              r={4.5}
              fill="var(--color-surface)"
              stroke="var(--color-ink)"
              strokeWidth={1.6}
            />
            <circle
              cx={designPx.x}
              cy={designPx.y}
              r={1.4}
              fill="var(--color-ink)"
            />
          </g>
        </ExplainAnchor>

        {/* X-axis — cruise range */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 32 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickFormat={(v) => String(Math.round(Number(v)))}
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
            y={ih + 38}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            RANGE (NM)
          </text>
        </ExplainAnchor>

        {/* Y-axis — payload */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -40, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickFormat={(v) => `${(Number(v) / 1000).toFixed(0)}k`}
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
            x={-52}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            PAYLOAD (LB)
          </text>
        </ExplainAnchor>

        {/* Legend — tiny key at the top-right identifying the two carpet
            string families. */}
        <g
          data-data-layer="true"
          transform={`translate(${iw + 8}, 0)`}
        >
          <line
            x1={0}
            x2={18}
            y1={6}
            y2={6}
            stroke="var(--color-ink)"
            strokeWidth={1.4}
          />
          <text
            x={22}
            y={6}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
            dominantBaseline="central"
          >
            MTOW (LB)
          </text>
          <line
            x1={0}
            x2={18}
            y1={20}
            y2={20}
            stroke="var(--color-ink)"
            strokeWidth={1.4}
            strokeDasharray="4 3"
          />
          <text
            x={22}
            y={20}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
            dominantBaseline="central"
          >
            W/S (LB/FT²)
          </text>
        </g>
      </Group>
    </svg>
  );
}
