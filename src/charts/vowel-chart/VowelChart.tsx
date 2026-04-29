"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// IPA cardinal vowels with approximate (F2, F1) formant positions in Hz
// x-axis = F2 (backness): higher F2 = fronter vowel. REVERSED so front is left.
// y-axis = F1 (height): higher F1 = lower/opener vowel. REVERSED so close is top.
// Source: Ladefoged & Johnson "A Course in Phonetics" 6th ed., Table 9.1
const VOWELS: Array<{
  symbol: string;
  f1: number;   // Hz
  f2: number;   // Hz
  rounded: boolean;
  label: string;
  pairSymbol?: string; // rounded/unrounded partner symbol
}> = [
  // Front unrounded
  { symbol: "i",  f1: 240,  f2: 2400, rounded: false, label: "close front unrounded" },
  { symbol: "e",  f1: 390,  f2: 2300, rounded: false, label: "close-mid front unrounded" },
  { symbol: "ɛ",  f1: 610,  f2: 1900, rounded: false, label: "open-mid front unrounded" },
  { symbol: "a",  f1: 850,  f2: 1610, rounded: false, label: "open front unrounded" },
  // Front rounded (paired with above)
  { symbol: "y",  f1: 250,  f2: 1950, rounded: true,  label: "close front rounded",    pairSymbol: "i" },
  { symbol: "ø",  f1: 400,  f2: 1700, rounded: true,  label: "close-mid front rounded", pairSymbol: "e" },
  { symbol: "œ",  f1: 585,  f2: 1490, rounded: true,  label: "open-mid front rounded",  pairSymbol: "ɛ" },
  // Central
  { symbol: "ə",  f1: 500,  f2: 1500, rounded: false, label: "mid central (schwa)" },
  // Back unrounded
  { symbol: "ɯ",  f1: 300,  f2: 900,  rounded: false, label: "close back unrounded" },
  { symbol: "ɤ",  f1: 430,  f2: 820,  rounded: false, label: "close-mid back unrounded" },
  { symbol: "ʌ",  f1: 620,  f2: 1000, rounded: false, label: "open-mid back unrounded" },
  { symbol: "ɑ",  f1: 800,  f2: 1100, rounded: false, label: "open back unrounded" },
  // Back rounded (paired)
  { symbol: "u",  f1: 250,  f2: 595,  rounded: true,  label: "close back rounded",    pairSymbol: "ɯ" },
  { symbol: "o",  f1: 450,  f2: 700,  rounded: true,  label: "close-mid back rounded", pairSymbol: "ɤ" },
  { symbol: "ɔ",  f1: 590,  f2: 870,  rounded: true,  label: "open-mid back rounded",  pairSymbol: "ʌ" },
];

// F1 domain: ~240 (close) → ~850 (open). Plot reversed: close at top.
const F1_DOMAIN: [number, number] = [200, 900];
// F2 domain: ~600 (back) → ~2400 (front). Plot reversed: front at left.
const F2_DOMAIN: [number, number] = [2500, 550];

interface Props {
  width: number;
  height: number;
}

export function VowelChart({ width, height }: Props) {
  const margin = { top: 36, right: 24, bottom: 52, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // x = F2 (front→back reversed: high F2 on left, low F2 on right)
  const xScale = scaleLinear({ domain: F2_DOMAIN, range: [0, iw] });
  // y = F1 (close→open reversed: low F1 on top, high F1 on bottom)
  const yScale = scaleLinear({ domain: F1_DOMAIN, range: [0, ih] });

  const xTicks = [2400, 2000, 1600, 1200, 800];
  const yTicks = [250, 350, 500, 650, 800];

  // Pair connection lines (rounded/unrounded pairs)
  const pairs: Array<{ a: typeof VOWELS[0]; b: typeof VOWELS[0] }> = [];
  for (const v of VOWELS) {
    if (v.pairSymbol) {
      const partner = VOWELS.find((w) => w.symbol === v.pairSymbol);
      if (partner) pairs.push({ a: v, b: partner });
    }
  }

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Vowel Chart: IPA cardinal vowels plotted in F1/F2 formant space"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {xTicks.map((f2) => (
            <line
              key={`vg-${f2}`}
              x1={xScale(f2)}
              x2={xScale(f2)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
          {yTicks.map((f1) => (
            <line
              key={`hg-${f1}`}
              x1={0}
              x2={iw}
              y1={yScale(f1)}
              y2={yScale(f1)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* Trapezoid frame — mirrors IPA vowel quadrilateral */}
        <ExplainAnchor
          selector="quadrilateral"
          index={1}
          pin={{ x: iw / 2, y: -22 }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g data-data-layer="true">
            {/* The IPA quadrilateral: front top-left (/i/), front bottom-left (/a/),
                back bottom-right (/ɑ/), back top-right (/ɯ/) */}
            <polygon
              points={`
                ${xScale(2400)},${yScale(240)}
                ${xScale(1610)},${yScale(850)}
                ${xScale(1100)},${yScale(800)}
                ${xScale(900)},${yScale(300)}
              `}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1}
              strokeOpacity={0.35}
              strokeDasharray="4 3"
            />
          </g>
        </ExplainAnchor>

        {/* Rounded/unrounded pair lines */}
        <ExplainAnchor
          selector="rounded-pairs"
          index={2}
          pin={{ x: xScale(1950) + 16, y: yScale(250) }}
          rect={{ x: xScale(600), y: 0, width: xScale(1950) - xScale(600), height: ih }}
        >
          <g data-data-layer="true">
            {pairs.map(({ a, b }) => (
              <line
                key={`pair-${a.symbol}-${b.symbol}`}
                x1={xScale(a.f2)}
                y1={yScale(a.f1)}
                x2={xScale(b.f2)}
                y2={yScale(b.f1)}
                stroke="var(--color-ink)"
                strokeWidth={0.8}
                strokeOpacity={0.3}
                strokeDasharray="2 2"
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Vowel glyphs */}
        <ExplainAnchor
          selector="vowel-glyphs"
          index={3}
          pin={{ x: xScale(2400) - 16, y: yScale(240) - 16 }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g data-data-layer="true">
            {VOWELS.map((v) => {
              const cx = xScale(v.f2);
              const cy = yScale(v.f1);
              return (
                <g key={v.symbol} transform={`translate(${cx},${cy})`}>
                  <circle
                    r={4.5}
                    fill={v.rounded ? "var(--color-ink)" : "var(--color-page)"}
                    stroke="var(--color-ink)"
                    strokeWidth={1.2}
                  />
                  <text
                    x={v.rounded ? 8 : -8}
                    y={0}
                    dominantBaseline="central"
                    textAnchor={v.rounded ? "start" : "end"}
                    fontFamily="serif"
                    fontSize={Math.max(10, Math.min(14, iw / 28))}
                    fill="var(--color-ink)"
                  >
                    /{v.symbol}/
                  </text>
                </g>
              );
            })}
          </g>
        </ExplainAnchor>

        {/* X-axis — F2 (backness), front at left */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 38 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <g data-data-layer="true">
            <line x1={0} x2={iw} y1={ih} y2={ih} stroke="var(--color-ink-mute)" strokeWidth={0.8} />
            {xTicks.map((f2) => (
              <g key={`xt-${f2}`}>
                <line
                  x1={xScale(f2)}
                  x2={xScale(f2)}
                  y1={ih}
                  y2={ih + 4}
                  stroke="var(--color-ink-mute)"
                  strokeWidth={0.8}
                />
                <text
                  x={xScale(f2)}
                  y={ih + 14}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {f2}
                </text>
              </g>
            ))}
            <text
              x={iw / 2}
              y={ih + 30}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-mute)"
            >
              F2 — BACKNESS (Hz) — FRONT ← BACK
            </text>
          </g>
        </ExplainAnchor>

        {/* Y-axis — F1 (height), close at top */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -42, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <g data-data-layer="true">
            <line x1={0} x2={0} y1={0} y2={ih} stroke="var(--color-ink-mute)" strokeWidth={0.8} />
            {yTicks.map((f1) => (
              <g key={`yt-${f1}`}>
                <line
                  x1={-4}
                  x2={0}
                  y1={yScale(f1)}
                  y2={yScale(f1)}
                  stroke="var(--color-ink-mute)"
                  strokeWidth={0.8}
                />
                <text
                  x={-8}
                  y={yScale(f1)}
                  textAnchor="end"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {f1}
                </text>
              </g>
            ))}
            <text
              x={-margin.left + 4}
              y={ih / 2}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
              transform={`rotate(-90, ${-margin.left + 4}, ${ih / 2})`}
            >
              F1 — HEIGHT (Hz) — CLOSE ↑ OPEN
            </text>
          </g>
        </ExplainAnchor>

        {/* Legend: filled = rounded, open = unrounded */}
        <ExplainAnchor
          selector="legend"
          index={6}
          pin={{ x: iw - 60, y: ih - 20 }}
          rect={{ x: iw - 120, y: ih - 34, width: 120, height: 30 }}
        >
          <g data-data-layer="true">
            <rect
              x={iw - 122}
              y={ih - 36}
              width={124}
              height={32}
              fill="var(--color-page)"
              stroke="var(--color-hairline)"
              strokeWidth={0.8}
              rx={2}
            />
            {/* Unrounded */}
            <circle cx={iw - 110} cy={ih - 26} r={4.5} fill="var(--color-page)" stroke="var(--color-ink)" strokeWidth={1.2} />
            <text
              x={iw - 102}
              y={ih - 26}
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink)"
            >
              unrounded
            </text>
            {/* Rounded */}
            <circle cx={iw - 110} cy={ih - 12} r={4.5} fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth={1.2} />
            <text
              x={iw - 102}
              y={ih - 12}
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink)"
            >
              rounded
            </text>
          </g>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
