"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Species = "setosa" | "versicolor" | "virginica";

interface IrisRow {
  species: Species;
  // Fisher's Iris features: sepal length, sepal width, petal length, petal width (cm)
  sl: number;
  sw: number;
  pl: number;
  pw: number;
}

// 8 samples per species from Fisher's 1936 Iris dataset (hand-picked rows
// spanning each species' range; values in cm).
const DATA: ReadonlyArray<IrisRow> = [
  // setosa — short, narrow petals
  { species: "setosa", sl: 5.1, sw: 3.5, pl: 1.4, pw: 0.2 },
  { species: "setosa", sl: 4.9, sw: 3.0, pl: 1.4, pw: 0.2 },
  { species: "setosa", sl: 4.7, sw: 3.2, pl: 1.3, pw: 0.2 },
  { species: "setosa", sl: 5.0, sw: 3.6, pl: 1.4, pw: 0.2 },
  { species: "setosa", sl: 5.4, sw: 3.9, pl: 1.7, pw: 0.4 },
  { species: "setosa", sl: 4.6, sw: 3.4, pl: 1.4, pw: 0.3 },
  { species: "setosa", sl: 5.0, sw: 3.4, pl: 1.5, pw: 0.2 },
  { species: "setosa", sl: 5.2, sw: 3.5, pl: 1.5, pw: 0.2 },
  // versicolor — medium everything
  { species: "versicolor", sl: 7.0, sw: 3.2, pl: 4.7, pw: 1.4 },
  { species: "versicolor", sl: 6.4, sw: 3.2, pl: 4.5, pw: 1.5 },
  { species: "versicolor", sl: 6.9, sw: 3.1, pl: 4.9, pw: 1.5 },
  { species: "versicolor", sl: 5.5, sw: 2.3, pl: 4.0, pw: 1.3 },
  { species: "versicolor", sl: 6.5, sw: 2.8, pl: 4.6, pw: 1.5 },
  { species: "versicolor", sl: 5.7, sw: 2.8, pl: 4.5, pw: 1.3 },
  { species: "versicolor", sl: 6.3, sw: 3.3, pl: 4.7, pw: 1.6 },
  { species: "versicolor", sl: 4.9, sw: 2.4, pl: 3.3, pw: 1.0 },
  // virginica — longest petals, widest sepals
  { species: "virginica", sl: 6.3, sw: 3.3, pl: 6.0, pw: 2.5 },
  { species: "virginica", sl: 5.8, sw: 2.7, pl: 5.1, pw: 1.9 },
  { species: "virginica", sl: 7.1, sw: 3.0, pl: 5.9, pw: 2.1 },
  { species: "virginica", sl: 6.3, sw: 2.9, pl: 5.6, pw: 1.8 },
  { species: "virginica", sl: 6.5, sw: 3.0, pl: 5.8, pw: 2.2 },
  { species: "virginica", sl: 7.6, sw: 3.0, pl: 6.6, pw: 2.1 },
  { species: "virginica", sl: 4.9, sw: 2.5, pl: 4.5, pw: 1.7 },
  { species: "virginica", sl: 7.3, sw: 2.9, pl: 6.3, pw: 1.8 },
];

// Andrews curve for a 4-variable observation:
//   f(t) = x1/sqrt(2) + x2 sin(t) + x3 cos(t) + x4 sin(2t)
// Order matters: early variables dominate low-frequency terms.
// Assignment: x1 = sl, x2 = sw, x3 = pl, x4 = pw.
function andrews(t: number, row: IrisRow): number {
  return (
    row.sl / Math.SQRT2 +
    row.sw * Math.sin(t) +
    row.pl * Math.cos(t) +
    row.pw * Math.sin(2 * t)
  );
}

const SPECIES_STYLE: Record<
  Species,
  { label: string; dash: string | undefined; opacity: number; stroke: string }
> = {
  setosa: {
    label: "I. setosa",
    dash: undefined,
    opacity: 0.9,
    stroke: "var(--color-ink)",
  },
  versicolor: {
    label: "I. versicolor",
    dash: "4 2",
    opacity: 0.75,
    stroke: "var(--color-ink)",
  },
  virginica: {
    label: "I. virginica",
    dash: "1 2",
    opacity: 0.65,
    stroke: "var(--color-ink)",
  },
};

const N_SAMPLES = 60;

interface Props {
  width: number;
  height: number;
}

export function AndrewsPlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 54, left: 48 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Sample t over [-π, π]
  const ts = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < N_SAMPLES; i++) {
      arr.push(-Math.PI + (2 * Math.PI * i) / (N_SAMPLES - 1));
    }
    return arr;
  }, []);

  // Compute all curves once
  const curves = useMemo(() => {
    return DATA.map((row) => ({
      row,
      values: ts.map((t) => andrews(t, row)),
    }));
  }, [ts]);

  const yExtent = useMemo(() => {
    let mn = Infinity;
    let mx = -Infinity;
    for (const c of curves) {
      for (const v of c.values) {
        if (v < mn) mn = v;
        if (v > mx) mx = v;
      }
    }
    const pad = (mx - mn) * 0.05;
    return [mn - pad, mx + pad] as [number, number];
  }, [curves]);

  const xScale = scaleLinear({ domain: [-Math.PI, Math.PI], range: [0, iw] });
  const yScale = scaleLinear({ domain: yExtent, range: [ih, 0], nice: true });

  const pathFor = (values: number[]) =>
    values
      .map(
        (v, i) =>
          `${i === 0 ? "M" : "L"} ${xScale(ts[i]).toFixed(1)} ${yScale(v).toFixed(1)}`,
      )
      .join(" ");

  // Representative curve for the "curve" anchor — a setosa sample (lowest bundle)
  const representativeCurve = curves.find((c) => c.row.species === "setosa")!;
  const repValues = representativeCurve.values;
  const repMidIdx = Math.floor(N_SAMPLES / 2);
  const repMidX = xScale(ts[repMidIdx]);
  const repMidY = yScale(repValues[repMidIdx]);

  // Bundle anchor — virginica has the top (highest) bundle because it has
  // the largest sepal length (x1), which dominates the constant term.
  const virginicaCurves = curves.filter((c) => c.row.species === "virginica");
  const virginicaAtT0 = virginicaCurves.map((c) => c.values[Math.floor(N_SAMPLES * 0.75)]);
  const virgYMin = Math.min(...virginicaAtT0);
  const virgYMax = Math.max(...virginicaAtT0);

  // Clamp anchor rects to plot area
  const clamp = (rx: number, ry: number, rw: number, rh: number) => {
    const x0 = Math.max(0, rx);
    const y0 = Math.max(0, ry);
    const x1 = Math.min(iw, rx + rw);
    const y1 = Math.min(ih, ry + rh);
    return {
      x: x0,
      y: y0,
      width: Math.max(0, x1 - x0),
      height: Math.max(0, y1 - y0),
    };
  };

  const bundleRectY = Math.min(yScale(virgYMax), yScale(virgYMin));
  const bundleRectH = Math.abs(yScale(virgYMin) - yScale(virgYMax));

  return (
    <svg width={width} height={height} role="img" aria-label="Andrews plot">
      <Group left={margin.left} top={margin.top}>
        {/* Curves */}
        <g data-data-layer="true">
          {curves.map((c, i) => {
            const style = SPECIES_STYLE[c.row.species];
            return (
              <path
                key={i}
                d={pathFor(c.values)}
                fill="none"
                stroke={style.stroke}
                strokeOpacity={style.opacity}
                strokeWidth={1.1}
                strokeDasharray={style.dash}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </g>

        {/* X-axis */}
        <ExplainAnchor
          selector="t-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => {
              const n = Number(v);
              if (Math.abs(n) < 0.01) return "0";
              if (Math.abs(n - Math.PI) < 0.01) return "π";
              if (Math.abs(n + Math.PI) < 0.01) return "-π";
              if (Math.abs(n - Math.PI / 2) < 0.01) return "π/2";
              if (Math.abs(n + Math.PI / 2) < 0.01) return "-π/2";
              return n.toFixed(1);
            }}
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
            t
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -28, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
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
            x={-40}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            f(t)
          </text>
        </ExplainAnchor>

        {/* 1. Curve — one observation as a 1D function */}
        <ExplainAnchor
          selector="curve"
          index={1}
          pin={{ x: repMidX, y: repMidY + 16 }}
          rect={clamp(repMidX - 24, repMidY - 10, 48, 20)}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Bundle — the virginica ribbon */}
        <ExplainAnchor
          selector="bundle"
          index={2}
          pin={{ x: xScale(ts[Math.floor(N_SAMPLES * 0.75)]), y: bundleRectY - 10 }}
          rect={clamp(
            xScale(ts[Math.floor(N_SAMPLES * 0.6)]),
            bundleRectY - 2,
            xScale(ts[Math.floor(N_SAMPLES * 0.9)]) -
              xScale(ts[Math.floor(N_SAMPLES * 0.6)]),
            bundleRectH + 4,
          )}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Variable order — dominant low-frequency term */}
        <ExplainAnchor
          selector="variable-order"
          index={3}
          pin={{ x: xScale(0) + 14, y: 16 }}
          rect={clamp(xScale(0) - 12, 0, 24, 28)}
        >
          <g />
        </ExplainAnchor>

        {/* Legend — three species by stroke style */}
        <g data-data-layer="true" transform={`translate(0, ${ih + 44})`}>
          {(Object.keys(SPECIES_STYLE) as Species[]).map((sp, i) => {
            const style = SPECIES_STYLE[sp];
            const x = i * (iw / 3);
            return (
              <g key={sp} transform={`translate(${x}, 0)`}>
                <line
                  x1={0}
                  x2={18}
                  y1={4}
                  y2={4}
                  stroke={style.stroke}
                  strokeOpacity={style.opacity}
                  strokeWidth={1.4}
                  strokeDasharray={style.dash}
                  strokeLinecap="round"
                />
                <text
                  x={22}
                  y={4}
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {style.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* 6. Legend anchor */}
        <ExplainAnchor
          selector="legend"
          index={6}
          pin={{ x: iw / 2, y: ih + 44 }}
          rect={{ x: 0, y: ih + 36, width: iw, height: 16 }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
