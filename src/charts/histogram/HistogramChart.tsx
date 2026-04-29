"use client";

import { useMemo } from "react";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { bin as d3Bin } from "d3-array";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Synthetic US household income sample: ~2,000 households drawn from a
// log-normal-ish distribution with median ~$70k and a long right tail, capped
// at $300k so a handful of outliers don't flatten the axis. Deterministic via
// a seeded LCG so server and client render identically.
function generateIncomes(n: number): number[] {
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  // Box-Muller using the seeded rand for standard normal samples.
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const out: number[] = [];
  // Log-normal: exp(mu + sigma * z). mu = ln(70000) ~ 11.156, sigma = 0.65
  // gives median ~70k and right skew out to a few hundred thousand.
  const mu = Math.log(70000);
  const sigma = 0.65;
  for (let i = 0; i < n; i++) {
    const income = Math.exp(mu + sigma * gauss());
    if (income < 1000) continue; // drop implausibly tiny values
    if (income > 300000) continue; // cut the extreme tail
    out.push(income);
  }
  return out;
}

interface Props {
  width: number;
  height: number;
}

export function HistogramChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const incomes = useMemo(() => generateIncomes(2200), []);

  // 20 equal-width bins across 0-300k.
  const bins = useMemo(() => {
    const binner = d3Bin<number, number>()
      .domain([0, 300000])
      .thresholds(20)
      .value((d) => d);
    return binner(incomes);
  }, [incomes]);

  const maxCount = bins.reduce((m, b) => Math.max(m, b.length), 0);

  const xScale = scaleLinear({ domain: [0, 300000], range: [0, iw] });
  const yScale = scaleLinear({
    domain: [0, maxCount],
    range: [ih, 0],
    nice: true,
  });

  // Representative bin: the modal bin (tallest bar).
  const modalIdx = bins.reduce(
    (best, b, i, arr) => (b.length > arr[best].length ? i : best),
    0,
  );
  const modalBin = bins[modalIdx];
  const modalX = xScale(modalBin.x0 ?? 0);
  const modalW = xScale(modalBin.x1 ?? 0) - modalX;
  const modalY = yScale(modalBin.length);

  // Long tail: the last ~6 bins, where counts are small but span is wide.
  const tailStartBin = bins[Math.max(0, bins.length - 6)];
  const tailX0 = xScale(tailStartBin.x0 ?? 0);
  const tailW = iw - tailX0;

  // Adjacent-bin pair for the "bin width" anchor — a bracket spanning one
  // bin's width, placed above the modal bar so it reads as "this wide".
  const widthBin = bins[Math.min(bins.length - 1, modalIdx + 1)];
  const widthX0 = xScale(widthBin.x0 ?? 0);
  const widthX1 = xScale(widthBin.x1 ?? 0);
  const widthBracketY = Math.max(8, modalY - 14);

  const currencyK = (v: number) => (v === 0 ? "$0" : `$${Math.round(v / 1000)}k`);

  return (
    <svg width={width} height={height} role="img" aria-label="Histogram">
      <Group left={margin.left} top={margin.top}>
        {/* Bars */}
        <g data-data-layer="true">
          {bins.map((b, i) => {
            const x = xScale(b.x0 ?? 0);
            const w = Math.max(0, xScale(b.x1 ?? 0) - x - 1);
            const y = yScale(b.length);
            const h = Math.max(0, ih - y);
            return (
              <Bar
                key={i}
                x={x}
                y={y}
                width={w}
                height={h}
                fill="var(--color-ink)"
                opacity={0.88}
              />
            );
          })}
        </g>

        {/* Bin anchor — the modal bar */}
        <ExplainAnchor
          selector="bin"
          index={1}
          pin={{ x: modalX + modalW / 2, y: modalY - 16 }}
          rect={{ x: modalX, y: modalY, width: modalW, height: ih - modalY }}
        >
          <g />
        </ExplainAnchor>

        {/* Bin-width anchor — bracket above the neighbouring bin */}
        <g data-data-layer="true">
          <line
            x1={widthX0}
            x2={widthX1}
            y1={widthBracketY}
            y2={widthBracketY}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          <line
            x1={widthX0}
            x2={widthX0}
            y1={widthBracketY - 3}
            y2={widthBracketY + 3}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          <line
            x1={widthX1}
            x2={widthX1}
            y1={widthBracketY - 3}
            y2={widthBracketY + 3}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
        </g>
        <ExplainAnchor
          selector="bin-width"
          index={2}
          pin={{ x: (widthX0 + widthX1) / 2, y: widthBracketY - 14 }}
          rect={{
            x: widthX0 - 2,
            y: widthBracketY - 6,
            width: widthX1 - widthX0 + 4,
            height: 12,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Long-tail anchor — the right tail region */}
        <ExplainAnchor
          selector="long-tail"
          index={3}
          pin={{ x: tailX0 + tailW / 2, y: yScale(maxCount * 0.15) - 10 }}
          rect={{
            x: tailX0,
            y: yScale(maxCount * 0.25),
            width: tailW,
            height: ih - yScale(maxCount * 0.25),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={4}
          pin={{ x: -32, y: ih / 2 }}
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
            x={-44}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            HOUSEHOLDS
          </text>
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 38 }}
          rect={{ x: 0, y: ih + 20, width: iw, height: margin.bottom - 20 }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => currencyK(v as number)}
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
        </ExplainAnchor>

        {/* Baseline anchor — the zero line under the bars */}
        <ExplainAnchor
          selector="baseline"
          index={6}
          pin={{ x: iw - 12, y: ih - 12 }}
          rect={{ x: 0, y: ih - 2, width: iw, height: 4 }}
        >
          <line
            x1={0}
            x2={iw}
            y1={ih}
            y2={ih}
            stroke="var(--color-ink)"
            strokeWidth={1}
            data-data-layer="true"
          />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
