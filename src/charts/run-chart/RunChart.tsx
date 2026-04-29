"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { LinePath, Line } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Point {
  day: number;
  value: number;
}

// Deterministic 90-day daily hospital-acquired-infection count. Seeded
// LCG with a Box-Muller normal variate. A slump is injected around
// days 38-47 so a clear run of 10+ consecutive points below median exists.
function generateData(): Point[] {
  let seed = 41;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const out: Point[] = [];
  const base = 7.5;
  for (let day = 1; day <= 90; day++) {
    const shift = day >= 38 && day <= 47 ? -2.4 : 0;
    const noise = gauss() * 1.6;
    const v = Math.max(0, Math.round(base + shift + noise));
    out.push({ day, value: v });
  }
  return out;
}

function computeMedian(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 === 0 ? (s[n / 2 - 1] + s[n / 2]) / 2 : s[(n - 1) / 2];
}

// Find the longest run of consecutive points strictly above or below the
// median (per the classical run-chart rule; points equal to the median are
// skipped without breaking the run).
function findLongestRun(
  data: Point[],
  median: number,
): { start: number; end: number; side: "above" | "below" } | null {
  let bestLen = 0;
  let best: { start: number; end: number; side: "above" | "below" } | null =
    null;
  let curSide: "above" | "below" | null = null;
  let curStart = 0;
  let curLen = 0;
  for (let i = 0; i < data.length; i++) {
    const v = data[i].value;
    if (v === median) continue;
    const side: "above" | "below" = v > median ? "above" : "below";
    if (side === curSide) {
      curLen += 1;
    } else {
      curSide = side;
      curStart = i;
      curLen = 1;
    }
    if (curLen > bestLen) {
      bestLen = curLen;
      best = { start: curStart, end: i, side };
    }
  }
  return bestLen >= 6 ? best : null;
}

interface Props {
  width: number;
  height: number;
}

export function RunChart({ width, height }: Props) {
  const margin = { top: 20, right: 24, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { data, median, run } = useMemo(() => {
    const d = generateData();
    const m = computeMedian(d.map((p) => p.value));
    const r = findLongestRun(d, m);
    return { data: d, median: m, run: r };
  }, []);

  const xScale = scaleLinear({ domain: [1, 90], range: [0, iw] });
  const yScale = scaleLinear({
    domain: [0, Math.max(14, ...data.map((d) => d.value)) + 1],
    range: [ih, 0],
    nice: true,
  });

  const medianY = yScale(median);

  const startPoint = data[0];
  const startX = xScale(startPoint.day);
  const startY = yScale(startPoint.value);

  // Representative mid-series point.
  const rep = data[19];
  const repX = xScale(rep.day);
  const repY = yScale(rep.value);

  // Run band geometry (falls back to plot edges if no run found — which
  // shouldn't happen with the seeded data, but keeps the anchor valid).
  const runStart = run ? data[run.start] : data[0];
  const runEnd = run ? data[run.end] : data[data.length - 1];
  const runBandX = xScale(runStart.day) - 6;
  const runBandW = xScale(runEnd.day) - xScale(runStart.day) + 12;
  const runBandTopY = run?.side === "below" ? medianY : 0;
  const runBandH = run?.side === "below" ? ih - medianY : medianY;

  const clampRect = (x: number, y: number, w: number, h: number) => {
    const cx = Math.max(0, Math.min(iw - 1, x));
    const cy = Math.max(0, Math.min(ih - 1, y));
    const cw = Math.max(1, Math.min(iw - cx, w));
    const ch = Math.max(1, Math.min(ih - cy, h));
    return { x: cx, y: cy, width: cw, height: ch };
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Run chart">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(5).map((t) => (
            <line
              key={t}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* Run band — subtle highlight behind the 6+ streak */}
        <g data-data-layer="true">
          <rect
            x={runBandX}
            y={runBandTopY}
            width={runBandW}
            height={runBandH}
            fill="var(--color-ink)"
            opacity={0.06}
          />
        </g>

        {/* Series line */}
        <g data-data-layer="true">
          <LinePath
            data={data}
            x={(d) => xScale(d.day)}
            y={(d) => yScale(d.value)}
            stroke="var(--color-ink-mute)"
            strokeWidth={1.1}
          />
        </g>

        {/* Data points */}
        <g data-data-layer="true">
          {data.map((d) => (
            <circle
              key={d.day}
              cx={xScale(d.day)}
              cy={yScale(d.value)}
              r={2.2}
              fill="var(--color-ink)"
            />
          ))}
        </g>

        {/* Median line */}
        <ExplainAnchor
          selector="median-line"
          index={1}
          pin={{ x: iw - 14, y: medianY - 10 }}
          rect={clampRect(0, medianY - 5, iw, 10)}
        >
          <g data-data-layer="true">
            <Line
              from={{ x: 0, y: medianY }}
              to={{ x: iw, y: medianY }}
              stroke="var(--color-ink)"
              strokeWidth={1.2}
            />
            <text
              x={iw - 2}
              y={medianY - 3}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              MEDIAN {median}
            </text>
          </g>
        </ExplainAnchor>

        {/* The run — band */}
        <ExplainAnchor
          selector="run"
          index={2}
          pin={{
            x: Math.max(0, Math.min(iw - 2, runBandX + runBandW / 2)),
            y: run?.side === "below" ? medianY + 14 : medianY - 14,
          }}
          rect={clampRect(runBandX, runBandTopY, runBandW, runBandH)}
        >
          <g />
        </ExplainAnchor>

        {/* Representative data point */}
        <ExplainAnchor
          selector="data-point"
          index={3}
          pin={{ x: repX, y: repY - 16 }}
          rect={clampRect(repX - 8, repY - 8, 16, 16)}
        >
          <g />
        </ExplainAnchor>

        {/* Starting value */}
        <ExplainAnchor
          selector="starting-value"
          index={4}
          pin={{ x: startX + 16, y: startY - 14 }}
          rect={clampRect(startX - 6, startY - 8, 16, 16)}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v) => `D${v}`}
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
            DAY (90-DAY WINDOW)
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
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
            x={-margin.left + 4}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            HAI COUNT
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
