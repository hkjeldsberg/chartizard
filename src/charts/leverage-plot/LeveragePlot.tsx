"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Line } from "@visx/shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Generate ~40 (fitted value, leverage) pairs using a seeded LCG.
// Model: Y = 2 + 1.5*X1 + 0.8*X2 + eps, n=40, p=2 predictors.
// Leverage h_ii = x_i^T (X^T X)^{-1} x_i. We approximate this analytically:
// for a two-predictor model with predictors drawn from N(0,1), h_ii ≈
// 1/n + (x1_i^2 + x2_i^2) / (n-1) * 0.5  — a simple spherical design.
// Three observations are hand-placed far from the X-centre to guarantee
// high leverage values above the 2(p+1)/n = 0.15 cutoff (p=2, n=40).
function generateLeverageData(n: number): { fitted: number; leverage: number; label?: string }[] {
  let seed = 73891;
  const lcg = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
  const gauss = () => {
    const u = Math.max(1e-9, lcg());
    const v = lcg();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const out: { fitted: number; leverage: number; label?: string }[] = [];

  // Regular points: x1, x2 ~ N(0,1), fitted values in [5, 20]
  for (let i = 0; i < n - 3; i++) {
    const x1 = gauss();
    const x2 = gauss();
    const fitted = 2 + 1.5 * x1 + 0.8 * x2 + gauss() * 0.5;
    // h_ii approximation for spherical design: 1/n + (x1^2 + x2^2)/(n-1)/2
    const leverage = 1 / n + (x1 * x1 + x2 * x2) / ((n - 1) * 2);
    out.push({ fitted, leverage: Math.min(leverage, 0.13) });
  }

  // Three high-leverage observations: far from X-centre
  out.push({ fitted: 8.2, leverage: 0.22, label: "H" });
  out.push({ fitted: 15.8, leverage: 0.27, label: "H" });
  out.push({ fitted: 3.1, leverage: 0.19, label: "H" });

  return out;
}

interface Props {
  width: number;
  height: number;
}

const N = 40;
const P = 2; // number of predictors
const THRESHOLD = (2 * (P + 1)) / N; // 2(p+1)/n = 0.15

export function LeveragePlot({ width, height }: Props) {
  const margin = { top: 24, right: 24, bottom: 44, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => generateLeverageData(N), []);

  // x: fitted values domain
  const fittedMin = Math.min(...data.map((d) => d.fitted));
  const fittedMax = Math.max(...data.map((d) => d.fitted));
  const xScale = scaleLinear<number>({
    domain: [fittedMin - 1, fittedMax + 1],
    range: [0, iw],
    nice: true,
  });

  // y: leverage domain [0, max + headroom]
  const maxLev = Math.max(...data.map((d) => d.leverage));
  const yScale = scaleLinear<number>({
    domain: [0, maxLev * 1.15],
    range: [ih, 0],
    nice: false,
  });

  const threshY = yScale(THRESHOLD);

  // High-leverage labelled points
  const highLev = data.filter((d) => d.label === "H");
  const hl0 = highLev[0];
  const hl1 = highLev[1];

  // Low-leverage representative point (first regular point)
  const lowLevRep = data.find((d) => !d.label && d.leverage < 0.07)!;

  // Centre-of-design-space: point closest to centroid of fitted values
  const meanFitted = data.reduce((s, d) => s + d.fitted, 0) / data.length;
  const centre = data.reduce((best, d) => {
    return Math.abs(d.fitted - meanFitted) < Math.abs(best.fitted - meanFitted) ? d : best;
  }, data[0]);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Leverage Plot — hat-matrix diagonal h_ii vs fitted values; three high-leverage points above the 2(p+1)/n threshold"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(4).map((t) => (
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

        {/* All scatter points */}
        <g data-data-layer="true">
          {data.map((d, i) => {
            const isHigh = d.label === "H";
            return (
              <circle
                key={i}
                cx={xScale(d.fitted)}
                cy={yScale(d.leverage)}
                r={isHigh ? 3.5 : 2.6}
                fill={isHigh ? "var(--color-surface)" : "var(--color-ink)"}
                stroke={isHigh ? "var(--color-ink)" : "none"}
                strokeWidth={isHigh ? 1.5 : 0}
                fillOpacity={isHigh ? 1 : 0.75}
              />
            );
          })}

          {/* Labels for high-leverage points */}
          {highLev.map((d, i) => (
            <text
              key={i}
              x={xScale(d.fitted) + 6}
              y={yScale(d.leverage) - 5}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink)"
            >
              hi-lev
            </text>
          ))}
        </g>

        {/* Anchor 1: y-axis (leverage) */}
        <ExplainAnchor
          selector="y-axis"
          index={1}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={4}
            tickFormat={(v) => String(Number(v).toFixed(2))}
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
            y={-10}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            LEVERAGE h_ii
          </text>
        </ExplainAnchor>

        {/* Anchor 2: x-axis (fitted values) */}
        <ExplainAnchor
          selector="x-axis"
          index={2}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => String(Math.round(Number(v)))}
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
            y={ih + 38}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            FITTED VALUE (&#375;)
          </text>
        </ExplainAnchor>

        {/* Anchor 3: threshold line 2(p+1)/n */}
        <ExplainAnchor
          selector="threshold-line"
          index={3}
          pin={{ x: iw - 8, y: threshY - 10 }}
          rect={{ x: 0, y: Math.max(0, threshY - 4), width: iw, height: 8 }}
        >
          <g data-data-layer="true">
            <Line
              from={{ x: 0, y: threshY }}
              to={{ x: iw, y: threshY }}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <text
              x={iw - 2}
              y={threshY - 4}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              2(p+1)/n
            </text>
          </g>
        </ExplainAnchor>

        {/* Anchor 4: a high-leverage point (hl0) */}
        <ExplainAnchor
          selector="high-leverage-point"
          index={4}
          pin={{ x: xScale(hl0.fitted) - 16, y: yScale(hl0.leverage) - 14 }}
          rect={{
            x: Math.max(0, xScale(hl0.fitted) - 8),
            y: Math.max(0, yScale(hl0.leverage) - 8),
            width: Math.min(16, iw - Math.max(0, xScale(hl0.fitted) - 8)),
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: low-leverage cloud */}
        <ExplainAnchor
          selector="low-leverage-cloud"
          index={5}
          pin={{ x: xScale(lowLevRep.fitted) + 14, y: yScale(lowLevRep.leverage) - 10 }}
          rect={{
            x: Math.max(0, xScale(fittedMin)),
            y: Math.max(0, yScale(0.13)),
            width: Math.min(iw * 0.7, iw - Math.max(0, xScale(fittedMin))),
            height: Math.max(0, ih - yScale(0.13)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6: centre of design space */}
        <ExplainAnchor
          selector="design-centre"
          index={6}
          pin={{ x: xScale(centre.fitted) + 14, y: yScale(centre.leverage) + 14 }}
          rect={{
            x: Math.max(0, xScale(centre.fitted) - 20),
            y: Math.max(0, yScale(centre.leverage) - 10),
            width: Math.min(40, iw - Math.max(0, xScale(centre.fitted) - 20)),
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
