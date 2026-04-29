"use client";

import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Scotland's 1780–81 imports from 17 partner countries, in pounds sterling.
// Values are plausible reproductions matching the shape of Playfair's 1786
// plate: Ireland largest, Flanders smallest, America tiny (the colonies were
// in active revolt). Exact figures vary across scholarly reprints; these are
// rounded to the nearest thousand and consistent with the Tufte / Wainer
// reproductions widely circulated in history-of-graphics literature.
type Row = { country: string; value: number };

const DATA: ReadonlyArray<Row> = [
  { country: "America", value: 23 },
  { country: "Denmark", value: 45 },
  { country: "E. Indies", value: 12 },
  { country: "Flanders", value: 3 },
  { country: "Germany", value: 63 },
  { country: "Greenland", value: 7 },
  { country: "Guernsey", value: 4 },
  { country: "Holland", value: 52 },
  { country: "Ireland", value: 117 },
  { country: "Isle of Man", value: 8 },
  { country: "Norway", value: 55 },
  { country: "Poland", value: 10 },
  { country: "Portugal", value: 28 },
  { country: "Prussia", value: 14 },
  { country: "Russia", value: 87 },
  { country: "Spain", value: 18 },
  { country: "Sweden", value: 74 },
];

// Shorten country names so the bottom axis stays legible at small widths.
const SHORT: Record<string, string> = {
  "America": "AM",
  "Denmark": "DK",
  "E. Indies": "EI",
  "Flanders": "FL",
  "Germany": "DE",
  "Greenland": "GR",
  "Guernsey": "GS",
  "Holland": "HL",
  "Ireland": "IE",
  "Isle of Man": "IM",
  "Norway": "NO",
  "Poland": "PL",
  "Portugal": "PT",
  "Prussia": "PR",
  "Russia": "RU",
  "Spain": "ES",
  "Sweden": "SE",
};

interface Props {
  width: number;
  height: number;
}

export function VerticalBarGraph({ width, height }: Props) {
  const margin = { top: 36, right: 16, bottom: 42, left: 18 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleBand<string>({
    domain: DATA.map((d) => d.country),
    range: [0, iw],
    padding: 0.18,
  });

  const yScale = scaleLinear<number>({
    domain: [0, 130],
    range: [ih, 0],
  });

  const bw = xScale.bandwidth();

  // Focal bar = Ireland (tallest — the anchor visitor's eye lands on first).
  const ireland = DATA.find((d) => d.country === "Ireland")!;
  const irelandX = xScale(ireland.country) ?? 0;
  const irelandY = yScale(ireland.value);

  // Representative alternating-shading pair (Germany + Greenland).
  const germanyX = xScale("Germany") ?? 0;
  const shadingRectX = germanyX;
  const shadingRectW = bw * 2 + (xScale("Greenland")! - germanyX - bw);

  return (
    <svg width={width} height={height} role="img" aria-label="Vertical Bar Graph">
      <Group left={margin.left} top={margin.top}>
        {/* Title banner — Playfair's original is hand-engraved; this is a
            minimal typeset stand-in. */}
        <text
          x={iw / 2}
          y={-22}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink)"
          letterSpacing={0.4}
        >
          SCOTLAND&apos;S IMPORTS · 1781
        </text>
        <text
          x={iw / 2}
          y={-10}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={8}
          fill="var(--color-ink-mute)"
        >
          Thousands of pounds sterling
        </text>

        {/* Chart frame — ruled rectangle around the plot. */}
        <ExplainAnchor
          selector="chart-frame"
          index={6}
          pin={{ x: iw + 6, y: -4 }}
          rect={{ x: -4, y: -4, width: iw + 8, height: ih + 8 }}
        >
          <rect
            x={0}
            y={0}
            width={iw}
            height={ih}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={0.8}
          />
        </ExplainAnchor>

        {/* Bars with alternating shading */}
        <g data-data-layer="true">
          {DATA.map((d, i) => {
            const x = xScale(d.country) ?? 0;
            const y = yScale(d.value);
            const isDark = i % 2 === 0;
            return (
              <rect
                key={d.country}
                x={x}
                y={y}
                width={bw}
                height={ih - y}
                fill={isDark ? "var(--color-ink)" : "var(--color-hairline)"}
                stroke="var(--color-ink)"
                strokeWidth={0.6}
              />
            );
          })}
        </g>

        {/* Value labels above each bar */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const x = (xScale(d.country) ?? 0) + bw / 2;
            const y = yScale(d.value);
            return (
              <text
                key={d.country}
                x={x}
                y={y - 3}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={7}
                fill="var(--color-ink-mute)"
              >
                {d.value}
              </text>
            );
          })}
        </g>

        {/* Country labels along the bottom */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const x = (xScale(d.country) ?? 0) + bw / 2;
            return (
              <text
                key={d.country}
                x={x}
                y={ih + 12}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={7}
                fill="var(--color-ink-soft)"
              >
                {SHORT[d.country] ?? d.country}
              </text>
            );
          })}
        </g>

        {/* Baseline — emphasised on top of the frame */}
        <ExplainAnchor
          selector="baseline"
          index={2}
          pin={{ x: iw - 10, y: ih + 22 }}
          rect={{ x: 0, y: ih - 3, width: iw, height: 6 }}
        >
          <line
            x1={0}
            x2={iw}
            y1={ih}
            y2={ih}
            stroke="var(--color-ink)"
            strokeWidth={1.4}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Bar anchor — the Ireland bar (tallest) */}
        <ExplainAnchor
          selector="bar"
          index={1}
          pin={{ x: irelandX + bw / 2, y: irelandY - 18 }}
          rect={{ x: irelandX, y: irelandY, width: bw, height: ih - irelandY }}
        >
          <g />
        </ExplainAnchor>

        {/* Value-label anchor — pinned above Ireland's value "117" */}
        <ExplainAnchor
          selector="value-label"
          index={3}
          pin={{ x: irelandX + bw / 2 + 14, y: irelandY - 14 }}
          rect={{
            x: irelandX - 2,
            y: Math.max(0, irelandY - 12),
            width: bw + 4,
            height: 10,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Alternating-shading anchor — a pair of adjacent bars */}
        <ExplainAnchor
          selector="alternating-shading"
          index={4}
          pin={{ x: shadingRectX + shadingRectW / 2, y: ih / 2 - 24 }}
          rect={{
            x: shadingRectX,
            y: yScale(70),
            width: shadingRectW,
            height: ih - yScale(70),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Country-label anchor — pinned near a representative label */}
        <ExplainAnchor
          selector="country-label"
          index={5}
          pin={{
            x: (xScale("Ireland") ?? 0) + bw / 2,
            y: ih + 26,
          }}
          rect={{ x: 0, y: ih + 4, width: iw, height: 14 }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
