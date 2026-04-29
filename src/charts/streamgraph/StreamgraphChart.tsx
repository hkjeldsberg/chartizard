"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import {
  stack as d3Stack,
  stackOffsetWiggle,
  stackOrderInsideOut,
  area as d3Area,
  curveBasis,
  type SeriesPoint,
} from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Row = {
  year: number;
  pop: number;
  hiphop: number;
  rock: number;
  latin: number;
  edm: number;
  country: number;
};

const DATA: ReadonlyArray<Row> = [
  { year: 2015, pop: 32, hiphop: 20, rock: 18, latin: 8, edm: 9, country: 13 },
  { year: 2016, pop: 31, hiphop: 22, rock: 17, latin: 10, edm: 9, country: 11 },
  { year: 2017, pop: 29, hiphop: 25, rock: 16, latin: 12, edm: 10, country: 8 },
  { year: 2018, pop: 27, hiphop: 28, rock: 15, latin: 14, edm: 10, country: 6 },
  { year: 2019, pop: 25, hiphop: 30, rock: 14, latin: 15, edm: 11, country: 5 },
  { year: 2020, pop: 24, hiphop: 31, rock: 13, latin: 16, edm: 10, country: 6 },
  { year: 2021, pop: 23, hiphop: 32, rock: 12, latin: 17, edm: 10, country: 6 },
  { year: 2022, pop: 22, hiphop: 33, rock: 11, latin: 18, edm: 9, country: 7 },
  { year: 2023, pop: 21, hiphop: 33, rock: 10, latin: 19, edm: 9, country: 8 },
  { year: 2024, pop: 20, hiphop: 34, rock: 9, latin: 20, edm: 8, country: 9 },
];

const KEYS = ["pop", "hiphop", "rock", "latin", "edm", "country"] as const;
type Key = (typeof KEYS)[number];

const KEY_LABELS: Record<Key, string> = {
  pop: "Pop",
  hiphop: "Hip-hop",
  rock: "Rock",
  latin: "Latin",
  edm: "EDM",
  country: "Country",
};

// Editorial palette — inked greys + muted accents, no colour-only encoding.
const KEY_FILLS: Record<Key, string> = {
  pop: "var(--color-ink)",
  hiphop: "#4a6a68",
  rock: "#a88a4a",
  latin: "#6a4a6a",
  edm: "#8a6a4a",
  country: "#4a6a8a",
};
const KEY_OPACITY: Record<Key, number> = {
  pop: 0.85,
  hiphop: 0.85,
  rock: 0.85,
  latin: 0.85,
  edm: 0.85,
  country: 0.85,
};

interface Props {
  width: number;
  height: number;
}

export function StreamgraphChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 28 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [2015, 2024], range: [0, iw] });

  const { series, yDomain, yScale, paths } = useMemo(() => {
    const stacker = d3Stack<Row, Key>()
      .keys(KEYS as unknown as Key[])
      .offset(stackOffsetWiggle)
      .order(stackOrderInsideOut);
    const s = stacker(DATA as Row[]);

    let yMin = Infinity;
    let yMax = -Infinity;
    for (const layer of s) {
      for (const pt of layer) {
        if (pt[0] < yMin) yMin = pt[0];
        if (pt[1] > yMax) yMax = pt[1];
      }
    }
    const pad = (yMax - yMin) * 0.06;
    const dom: [number, number] = [yMin - pad, yMax + pad];
    const y = scaleLinear({ domain: dom, range: [ih, 0] });

    const areaGen = d3Area<SeriesPoint<Row>>()
      .x((d) => xScale(d.data.year))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(curveBasis);

    const p: Record<Key, string> = {} as Record<Key, string>;
    s.forEach((layer) => {
      const key = layer.key as Key;
      p[key] = areaGen(layer) ?? "";
    });

    return { series: s, yDomain: dom, yScale: y, paths: p };
  }, [xScale, ih]);

  // Find the hip-hop and pop layers to anchor the "convergence-year" callout.
  const popLayer = series.find((l) => l.key === "pop");
  const hiphopLayer = series.find((l) => l.key === "hiphop");

  // Convergence year: the first year hiphop's thickness exceeds pop's.
  let convergenceIdx = DATA.length - 1;
  if (popLayer && hiphopLayer) {
    for (let i = 0; i < DATA.length; i++) {
      const popThickness = popLayer[i][1] - popLayer[i][0];
      const hipThickness = hiphopLayer[i][1] - hiphopLayer[i][0];
      if (hipThickness > popThickness) {
        convergenceIdx = i;
        break;
      }
    }
  }
  const convergenceYear = DATA[convergenceIdx].year;
  const convergenceX = xScale(convergenceYear);

  // Hip-hop band centroid at the rightmost year for anchoring.
  const hipLast = hiphopLayer ? hiphopLayer[hiphopLayer.length - 1] : [0, 0];
  const hipMidY = yScale((hipLast[0] + hipLast[1]) / 2);

  // Band-thickness anchor: a point mid-chart on the hiphop band to gesture at
  // "thickness = magnitude".
  const hipMidIdx = Math.floor(DATA.length / 2);
  const hipMid = hiphopLayer ? hiphopLayer[hipMidIdx] : [0, 0];
  const hipMidTopY = yScale(hipMid[1]);
  const hipMidBotY = yScale(hipMid[0]);
  const hipMidX = xScale(DATA[hipMidIdx].year);

  // Legend geometry — laid out across the top inside the plot area.
  const legendY = -14;
  const legendGap = Math.max(56, Math.min(88, iw / KEYS.length));

  return (
    <svg width={width} height={height} role="img" aria-label="Streamgraph">
      <Group left={margin.left} top={margin.top}>
        {/* Bands */}
        <g data-data-layer="true">
          {KEYS.map((k) => (
            <path key={k} d={paths[k]} fill={KEY_FILLS[k]} fillOpacity={KEY_OPACITY[k]} />
          ))}
        </g>

        {/* Centre baseline reference (the implicit zero-centred axis) */}
        <ExplainAnchor
          selector="centre-baseline"
          index={2}
          pin={{ x: 14, y: yScale((yDomain[0] + yDomain[1]) / 2) }}
          rect={{
            x: 0,
            y: Math.max(0, yScale((yDomain[0] + yDomain[1]) / 2) - 4),
            width: iw,
            height: 8,
          }}
        >
          <line
            x1={0}
            x2={iw}
            y1={yScale((yDomain[0] + yDomain[1]) / 2)}
            y2={yScale((yDomain[0] + yDomain[1]) / 2)}
            stroke="var(--color-ink)"
            strokeWidth={0.75}
            strokeDasharray="1 3"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Band anchor — the hip-hop layer at its rightmost point */}
        <ExplainAnchor
          selector="band"
          index={1}
          pin={{ x: iw - 14, y: hipMidY }}
          rect={{
            x: Math.max(0, iw - 40),
            y: Math.max(0, yScale(hipLast[1])),
            width: 40,
            height: Math.max(6, yScale(hipLast[0]) - yScale(hipLast[1])),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Band-thickness — vertical tick showing the thickness of one band */}
        <ExplainAnchor
          selector="band-thickness"
          index={3}
          pin={{ x: hipMidX + 18, y: (hipMidTopY + hipMidBotY) / 2 }}
          rect={{
            x: Math.max(0, hipMidX - 6),
            y: hipMidTopY,
            width: 12,
            height: Math.max(6, hipMidBotY - hipMidTopY),
          }}
        >
          <g data-data-layer="true">
            <line
              x1={hipMidX}
              x2={hipMidX}
              y1={hipMidTopY}
              y2={hipMidBotY}
              stroke="var(--color-ink)"
              strokeWidth={1.25}
            />
            <line
              x1={hipMidX - 4}
              x2={hipMidX + 4}
              y1={hipMidTopY}
              y2={hipMidTopY}
              stroke="var(--color-ink)"
              strokeWidth={1.25}
            />
            <line
              x1={hipMidX - 4}
              x2={hipMidX + 4}
              y1={hipMidBotY}
              y2={hipMidBotY}
              stroke="var(--color-ink)"
              strokeWidth={1.25}
            />
          </g>
        </ExplainAnchor>

        {/* Convergence year — vertical guide where hip-hop overtakes pop */}
        <ExplainAnchor
          selector="convergence-year"
          index={4}
          pin={{ x: convergenceX, y: 10 }}
          rect={{
            x: Math.max(0, convergenceX - 6),
            y: 0,
            width: 12,
            height: ih,
          }}
        >
          <g data-data-layer="true">
            <line
              x1={convergenceX}
              x2={convergenceX}
              y1={0}
              y2={ih}
              stroke="var(--color-ink)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          </g>
        </ExplainAnchor>

        {/* Legend — inside the plot area, top */}
        <g data-data-layer="true">
          {KEYS.map((k, i) => (
            <g key={k} transform={`translate(${i * legendGap}, ${legendY})`}>
              <rect width={10} height={10} fill={KEY_FILLS[k]} fillOpacity={KEY_OPACITY[k]} />
              <text
                x={14}
                y={9}
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink-soft)"
              >
                {KEY_LABELS[k].toUpperCase()}
              </text>
            </g>
          ))}
        </g>
        <ExplainAnchor
          selector="legend"
          index={5}
          pin={{ x: Math.min(iw - 8, legendGap * 2 + 8), y: legendY - 6 }}
          rect={{
            x: 0,
            y: legendY - 2,
            width: Math.min(iw, legendGap * KEYS.length),
            height: 14,
          }}
        >
          <g />
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
            numTicks={10}
            tickFormat={(v) => String(v)}
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
      </Group>
    </svg>
  );
}
