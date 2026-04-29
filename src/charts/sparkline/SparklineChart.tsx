"use client";

import { useMemo } from "react";
import { LinePath, Line } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Pt {
  day: number;
  close: number;
}

/**
 * 90-day synthetic closing price for a single equity (AAPL-ish). Seeded LCG
 * so renders are deterministic across server + client. Starts ~170, ends ~195,
 * with realistic daily noise and one small dip around day 55.
 */
function generateSeries(n: number): Pt[] {
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const out: Pt[] = [];
  let price = 170;
  const drift = (195 - 170) / n;
  for (let i = 0; i < n; i++) {
    // Small dip centred around day 55: -0.9 at peak.
    const dip = i >= 48 && i <= 62 ? -0.9 * Math.exp(-Math.pow((i - 55) / 3.5, 2)) : 0;
    const noise = (rand() - 0.5) * 1.4;
    price = price + drift + noise + dip;
    out.push({ day: i, close: price });
  }
  return out;
}

interface Props {
  width: number;
  height: number;
}

export function SparklineChart({ width, height }: Props) {
  const margin = { top: 8, right: 36, bottom: 8, left: 36 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => generateSeries(90), []);
  const first = data[0];
  const last = data[data.length - 1];

  // Find trough (minimum) and crown (maximum in the latter half).
  const trough = useMemo(
    () => data.reduce((m, d) => (d.close < m.close ? d : m), data[0]),
    [data],
  );
  const crown = useMemo(
    () =>
      data
        .slice(Math.floor(data.length * 0.55))
        .reduce((m, d) => (d.close > m.close ? d : m), data[Math.floor(data.length * 0.55)]),
    [data],
  );

  const xScale = scaleLinear({ domain: [0, data.length - 1], range: [0, iw] });
  const yMin = Math.min(...data.map((d) => d.close));
  const yMax = Math.max(...data.map((d) => d.close));
  // Pad the y-domain so the curve doesn't scrape the edges.
  const pad = (yMax - yMin) * 0.18;
  const yScale = scaleLinear({
    domain: [yMin - pad, yMax + pad],
    range: [ih, 0],
  });

  const baselineY = yScale(first.close);
  const firstX = xScale(0);
  const firstY = yScale(first.close);
  const lastX = xScale(data.length - 1);
  const lastY = yScale(last.close);
  const troughX = xScale(trough.day);
  const troughY = yScale(trough.close);
  const crownX = xScale(crown.day);
  const crownY = yScale(crown.close);

  return (
    <svg width={width} height={height} role="img" aria-label="Sparkline">
      <Group left={margin.left} top={margin.top}>
        {/* Baseline — a muted horizontal at the first-value height */}
        <ExplainAnchor
          selector="baseline"
          index={4}
          pin={{ x: iw / 2, y: baselineY - 10 }}
          rect={{ x: 0, y: baselineY - 4, width: iw, height: 8 }}
        >
          <Line
            from={{ x: 0, y: baselineY }}
            to={{ x: iw, y: baselineY }}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="1 3"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Line path — the sparkline itself */}
        <ExplainAnchor
          selector="line-path"
          index={1}
          pin={{ x: xScale(Math.floor(data.length * 0.25)), y: yScale(yMax) - 6 }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <LinePath
            data={data}
            x={(d) => xScale(d.day)}
            y={(d) => yScale(d.close)}
            stroke="var(--color-ink)"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            curve={curveMonotoneX}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Trough — the dip around day 55 */}
        <ExplainAnchor
          selector="trough"
          index={5}
          pin={{ x: troughX, y: troughY + 14 }}
          rect={{ x: troughX - 10, y: troughY - 10, width: 20, height: 20 }}
        >
          <g data-data-layer="true">
            <circle cx={troughX} cy={troughY} r={2.4} fill="var(--color-ink)" />
          </g>
        </ExplainAnchor>

        {/* Crown — the peak near the end */}
        <ExplainAnchor
          selector="crown"
          index={6}
          pin={{ x: crownX, y: crownY - 14 }}
          rect={{ x: crownX - 10, y: crownY - 10, width: 20, height: 20 }}
        >
          <g data-data-layer="true">
            <circle cx={crownX} cy={crownY} r={2.4} fill="var(--color-ink)" />
          </g>
        </ExplainAnchor>

        {/* Start value label */}
        <ExplainAnchor
          selector="start-value"
          index={2}
          pin={{ x: -margin.left / 2, y: firstY - 12 }}
          rect={{ x: -margin.left, y: firstY - 8, width: margin.left, height: 16 }}
        >
          <g data-data-layer="true">
            <circle cx={firstX} cy={firstY} r={2} fill="var(--color-ink)" />
            <text
              x={-6}
              y={firstY}
              textAnchor="end"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={11}
              fill="var(--color-ink-soft)"
            >
              ${first.close.toFixed(0)}
            </text>
          </g>
        </ExplainAnchor>

        {/* End value label */}
        <ExplainAnchor
          selector="end-value"
          index={3}
          pin={{ x: iw + margin.right / 2, y: lastY - 12 }}
          rect={{ x: iw, y: lastY - 8, width: margin.right, height: 16 }}
        >
          <g data-data-layer="true">
            <circle cx={lastX} cy={lastY} r={2.4} fill="var(--color-ink)" />
            <text
              x={iw + 6}
              y={lastY}
              textAnchor="start"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={11}
              fill="var(--color-ink)"
            >
              ${last.close.toFixed(0)}
            </text>
          </g>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
