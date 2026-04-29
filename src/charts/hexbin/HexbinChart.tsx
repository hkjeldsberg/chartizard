"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { hexbin as d3Hexbin } from "d3-hexbin";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Point {
  x: number;
  y: number;
}

// Simulate ~1,200 pickups concentrated in a Midtown-like hotspot, plus lighter
// pickups along two avenues, plus random scatter. Deterministic via a seeded LCG.
function generatePoints(n: number): Point[] {
  let seed = 42;
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
  for (let i = 0; i < n; i++) {
    const r = rand();
    if (r < 0.55) {
      out.push({ x: 60 + gauss() * 8, y: 48 + gauss() * 6 });
    } else if (r < 0.72) {
      out.push({ x: 50 + gauss() * 4, y: 30 + rand() * 40 });
    } else if (r < 0.85) {
      out.push({ x: 70 + gauss() * 4, y: 30 + rand() * 40 });
    } else {
      out.push({ x: rand() * 100, y: rand() * 80 });
    }
  }
  return out.filter((p) => p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 80);
}

interface Props {
  width: number;
  height: number;
}

export function HexbinChart({ width, height }: Props) {
  const margin = { top: 20, right: 52, bottom: 44, left: 52 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const points = useMemo(() => generatePoints(1200), []);

  const xScale = scaleLinear({ domain: [0, 100], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 80], range: [ih, 0] });

  const hexRadius = Math.max(7, Math.min(iw, ih) / 18);

  const bins = useMemo(() => {
    const hb = d3Hexbin<Point>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .radius(hexRadius)
      .extent([
        [0, 0],
        [iw, ih],
      ]);
    return hb(points);
  }, [points, iw, ih, hexRadius, xScale, yScale]);

  const maxCount = bins.reduce((m, b) => Math.max(m, b.length), 0);

  const hexPath = useMemo(() => {
    const hb = d3Hexbin<Point>().radius(hexRadius);
    return hb.hexagon();
  }, [hexRadius]);

  const legendSteps = 5;
  const legendH = ih;
  const legendStepH = legendH / legendSteps;

  // Hotspot anchor (centre of the distribution)
  const anchorX = xScale(60);
  const anchorY = yScale(48);

  return (
    <svg width={width} height={height} role="img" aria-label="Hexagonal binning chart">
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true" clipPath="url(#hexbin-clip)">
          <defs>
            <clipPath id="hexbin-clip">
              <rect x={-hexRadius} y={-hexRadius} width={iw + 2 * hexRadius} height={ih + 2 * hexRadius} />
            </clipPath>
          </defs>
          {bins.map((bin) => {
            const intensity = maxCount > 0 ? bin.length / maxCount : 0;
            const opacity = 0.08 + intensity * 0.85;
            return (
              <path
                key={`${bin.x.toFixed(1)}-${bin.y.toFixed(1)}`}
                d={hexPath}
                transform={`translate(${bin.x}, ${bin.y})`}
                fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
                stroke="var(--color-page)"
                strokeWidth={0.5}
              />
            );
          })}
        </g>

        {/* Hex anchor */}
        <ExplainAnchor
          selector="hex"
          index={1}
          pin={{ x: anchorX + 18, y: anchorY - 18 }}
          rect={{
            x: anchorX - hexRadius,
            y: anchorY - hexRadius,
            width: hexRadius * 2,
            height: hexRadius * 2,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Bin-radius anchor — top-right ghost hex */}
        <ExplainAnchor
          selector="bin-radius"
          index={3}
          pin={{ x: iw - hexRadius, y: hexRadius + 6 }}
          rect={{
            x: iw - hexRadius * 2,
            y: 0,
            width: hexRadius * 2,
            height: hexRadius * 2,
          }}
        >
          <g />
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
            LAT
          </text>
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
            numTicks={6}
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
            LON
          </text>
        </ExplainAnchor>

        {/* Colour scale legend */}
        <g transform={`translate(${iw + 14}, 0)`} data-data-layer="true">
          {Array.from({ length: legendSteps }).map((_, i) => {
            const t = i / (legendSteps - 1);
            const colour = `rgba(26,22,20,${0.1 + t * 0.8})`;
            return (
              <rect
                key={i}
                x={0}
                y={i * legendStepH}
                width={14}
                height={legendStepH}
                fill={colour}
              />
            );
          })}
          <text
            x={18}
            y={8}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            MORE
          </text>
          <text
            x={18}
            y={legendH - 2}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            LESS
          </text>
        </g>
        <ExplainAnchor
          selector="colour-scale"
          index={2}
          pin={{ x: iw + 42, y: ih / 2 }}
          rect={{ x: iw + 12, y: 0, width: 28, height: legendH }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
