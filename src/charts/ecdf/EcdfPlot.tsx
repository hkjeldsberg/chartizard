"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Abramowitz & Stegun 7.1.26 erf approximation — used only for the faint
// reference curve overlay. Population CDF Φ(x).
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y =
    1 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}

function phi(x: number): number {
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

// Seeded LCG + Box-Muller. Generates n ~ N(0, 1) samples deterministically.
function generateSamples(n: number): number[] {
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(gauss());
  return out;
}

interface Props {
  width: number;
  height: number;
}

export function EcdfPlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { sorted, referenceCurve } = useMemo(() => {
    const raw = generateSamples(25);
    const clipped = raw.map((v) => Math.max(-3, Math.min(3, v)));
    const s = [...clipped].sort((a, b) => a - b);
    const refN = 161;
    const refStep = 6 / (refN - 1);
    const ref: { x: number; p: number }[] = [];
    for (let i = 0; i < refN; i++) {
      const x = -3 + i * refStep;
      ref.push({ x, p: phi(x) });
    }
    return { sorted: s, referenceCurve: ref };
  }, []);

  const xScale = scaleLinear({ domain: [-3, 3], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 1], range: [ih, 0] });

  const n = sorted.length;

  // Build the ECDF staircase path: horizontal from (x_prev, k/n) to (x_k, k/n),
  // then vertical jump of 1/n up to (x_k, (k+1)/n). Extend flat to domain edges.
  const stairD = useMemo(() => {
    const segs: string[] = [];
    const xLeft = xScale(-3);
    const xRight = xScale(3);
    // Start at y = 0 on the left edge.
    segs.push(`M ${xLeft} ${yScale(0)}`);
    for (let i = 0; i < n; i++) {
      const xi = xScale(sorted[i]);
      const yBefore = yScale(i / n);
      const yAfter = yScale((i + 1) / n);
      // Horizontal to xi at previous height
      segs.push(`L ${xi} ${yBefore}`);
      // Vertical jump up by 1/n
      segs.push(`L ${xi} ${yAfter}`);
    }
    // Flat line out to right edge at y = 1
    segs.push(`L ${xRight} ${yScale(1)}`);
    return segs.join(" ");
  }, [sorted, n, xScale, yScale]);

  const refD = useMemo(() => {
    return (
      "M " +
      referenceCurve
        .map(
          (d, i) =>
            `${i === 0 ? "" : "L "}${xScale(d.x)} ${yScale(d.p)}`,
        )
        .join(" ")
    );
  }, [referenceCurve, xScale, yScale]);

  // A representative jump to anchor — pick the jump at the median sample.
  const medianIdx = Math.floor(n / 2);
  const jumpX = xScale(sorted[medianIdx]);
  const jumpYTop = yScale((medianIdx + 1) / n);
  const jumpYBot = yScale(medianIdx / n);

  return (
    <svg width={width} height={height} role="img" aria-label="ECDF plot">
      <Group left={margin.left} top={margin.top}>
        {/* Horizontal gridlines */}
        <g data-data-layer="true">
          {[0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray={t === 1 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* Faint theoretical-normal reference curve */}
        <ExplainAnchor
          selector="reference-curve"
          index={1}
          pin={{ x: xScale(-1.8), y: yScale(phi(-1.8)) - 16 }}
          rect={{
            x: xScale(-2.5),
            y: yScale(0.95),
            width: xScale(-1.2) - xScale(-2.5),
            height: yScale(0.05) - yScale(0.95),
          }}
        >
          <path
            d={refD}
            fill="none"
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="3 3"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* ECDF staircase */}
        <ExplainAnchor
          selector="staircase"
          index={2}
          pin={{ x: xScale(0.3), y: yScale(0.55) - 18 }}
          rect={{
            x: xScale(-1),
            y: yScale(0.9),
            width: xScale(1) - xScale(-1),
            height: yScale(0.1) - yScale(0.9),
          }}
        >
          <path
            d={stairD}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.8}
            strokeLinejoin="miter"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Observation dots at the top of each jump */}
        <g data-data-layer="true">
          {sorted.map((x, i) => (
            <circle
              key={i}
              cx={xScale(x)}
              cy={yScale((i + 1) / n)}
              r={2}
              fill="var(--color-ink)"
            />
          ))}
        </g>

        {/* Jump anchor — one representative step of 1/n */}
        <ExplainAnchor
          selector="jump"
          index={3}
          pin={{ x: jumpX + 18, y: (jumpYTop + jumpYBot) / 2 }}
          rect={{
            x: jumpX - 8,
            y: jumpYTop - 4,
            width: 16,
            height: jumpYBot - jumpYTop + 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={7}
            tickFormat={(v) => `${v}σ`}
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
            SAMPLE VALUE
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => `${(v as number).toFixed(2)}`}
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
            F̂(x)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
