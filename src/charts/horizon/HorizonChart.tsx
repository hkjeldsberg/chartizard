"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { area as d3Area, curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Eight tickers × ~500 trading days of simulated log-returns. Baseline 0,
// folded + banded into a horizon chart per row. Deterministic LCG.
const TICKERS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "NVDA",
  "META",
  "TSLA",
  "JPM",
] as const;
type Ticker = (typeof TICKERS)[number];

const DAYS = 500;
// Covid-19 drawdown lands around day index 55 (early 2020 in the sim window).
const COVID_DIP_START = 50;
const COVID_DIP_END = 70;

function makeRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function gauss(rand: () => number) {
  const u = 1 - rand();
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Per-ticker daily return series in percent. Slight drift + heteroskedastic
// volatility + a shared Covid-19 dip. TSLA has a fatter tail.
function simulateReturns(ticker: Ticker, seed: number): number[] {
  const rand = makeRand(seed);
  const drift = ticker === "TSLA" ? 0.06 : ticker === "NVDA" ? 0.08 : 0.03;
  const vol = ticker === "TSLA" ? 3.0 : ticker === "NVDA" ? 2.2 : 1.4;
  const out: number[] = [];
  for (let i = 0; i < DAYS; i++) {
    let r = drift + vol * gauss(rand);
    // Covid-19 drawdown: several sharp negative shocks.
    if (i >= COVID_DIP_START && i <= COVID_DIP_END) {
      const t = (i - COVID_DIP_START) / (COVID_DIP_END - COVID_DIP_START);
      // V-shaped impact, deepest mid-window.
      const shock = -6 * Math.sin(Math.PI * t);
      r += shock + vol * gauss(rand) * 0.6;
    }
    out.push(r);
  }
  return out;
}

interface Props {
  width: number;
  height: number;
}

const BAND_COUNT = 3;

export function HorizonChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const series = useMemo(() => {
    return TICKERS.map((t, i) => ({
      ticker: t,
      values: simulateReturns(t, 13 + i * 17),
    }));
  }, []);

  // Per-row max |return| drives band thresholds. We use a global max across
  // all tickers so comparisons between rows remain meaningful.
  const globalMax = useMemo(() => {
    let m = 0;
    for (const s of series) {
      for (const v of s.values) {
        const a = Math.abs(v);
        if (a > m) m = a;
      }
    }
    return m;
  }, [series]);

  const rowCount = series.length;
  const rowGap = 2;
  const rowH = Math.max(8, (ih - rowGap * (rowCount - 1)) / rowCount);

  const xScale = scaleLinear({ domain: [0, DAYS - 1], range: [0, iw] });
  // Per-band y-scale: each band covers rowH vertically, mapped from
  // [0, bandMax] in return space.
  const bandMax = globalMax / BAND_COUNT;
  const yInBand = scaleLinear({ domain: [0, bandMax], range: [rowH, 0] });

  const rowTop = (rowIdx: number) => rowIdx * (rowH + rowGap);

  // For a given row's folded-and-banded values, produce an array of per-band
  // "clipped" series. Each band gets the residual above its lower threshold,
  // clamped to bandMax. Positive and negative are rendered separately with
  // different hue families.
  type BandPoint = { day: number; v: number };
  function bandedSeries(
    rawValues: number[],
    sign: 1 | -1,
  ): BandPoint[][] {
    // Fold to positive only: negatives already handled by caller via
    // `sign * v` check.
    const magnitudes = rawValues.map((v) => (sign === 1 ? Math.max(0, v) : Math.max(0, -v)));
    const bands: BandPoint[][] = [];
    for (let b = 0; b < BAND_COUNT; b++) {
      const lower = b * bandMax;
      const points: BandPoint[] = magnitudes.map((m, day) => {
        const residual = Math.max(0, Math.min(m - lower, bandMax));
        return { day, v: residual };
      });
      bands.push(points);
    }
    return bands;
  }

  const areaGen = d3Area<BandPoint>()
    .x((p) => xScale(p.day))
    .y0(() => rowH)
    .y1((p) => yInBand(p.v))
    .curve(curveMonotoneX);

  // Colour ramp: darker = higher band. Positive = ink (warm), negative =
  // cool blue-grey mix for hue contrast. Opacity stacks up inside each row.
  // We use solid fills (not alpha-stacked) so three bands layered give three
  // discrete tones rather than a continuous ramp.
  const posTones = ["rgba(26,22,20,0.22)", "rgba(26,22,20,0.46)", "rgba(26,22,20,0.82)"];
  const negTones = ["rgba(56,80,120,0.22)", "rgba(56,80,120,0.50)", "rgba(56,80,120,0.85)"];

  // Anchor geometry
  // Pick NVDA row (index 4) for the band-stack anchor — highest vol, clearest
  // band separation.
  const nvdaRow = 4;
  const nvdaTop = rowTop(nvdaRow);
  // Covid dip — AAPL row (index 0) mid-dip
  const aaplRow = 0;
  const aaplTop = rowTop(aaplRow);
  const covidMidDay = Math.round((COVID_DIP_START + COVID_DIP_END) / 2);
  const covidX = xScale(covidMidDay);

  // Baseline anchor — we pin to the last row's baseline (JPM, index 7)
  const jpmRow = 7;
  const jpmBaseY = rowTop(jpmRow) + rowH;

  return (
    <svg width={width} height={height} role="img" aria-label="Horizon chart">
      <Group left={margin.left} top={margin.top}>
        {/* Row labels (tickers) — outside data layer so they stay crisp in Explain mode */}
        <g>
          {series.map((s, i) => (
            <text
              key={s.ticker}
              x={-8}
              y={rowTop(i) + rowH / 2}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-soft)"
              dy="0.33em"
            >
              {s.ticker}
            </text>
          ))}
        </g>

        {/* Horizon rows */}
        <g data-data-layer="true">
          {series.map((s, i) => {
            const top = rowTop(i);
            const posBands = bandedSeries(s.values, 1);
            const negBands = bandedSeries(s.values, -1);
            return (
              <g key={s.ticker} transform={`translate(0, ${top})`}>
                {/* Row clip so bands never bleed into neighbours */}
                <defs>
                  <clipPath id={`horizon-clip-${i}`}>
                    <rect x={0} y={0} width={iw} height={rowH} />
                  </clipPath>
                </defs>
                <g clipPath={`url(#horizon-clip-${i})`}>
                  {/* Row background — very faint, to suggest a tray the bands sit in */}
                  <rect
                    x={0}
                    y={0}
                    width={iw}
                    height={rowH}
                    fill="var(--color-ink)"
                    fillOpacity={0.03}
                  />
                  {/* Negative bands — cool hue, folded up to positive */}
                  {negBands.map((bp, b) => (
                    <path
                      key={`n-${b}`}
                      d={areaGen(bp) ?? ""}
                      fill={negTones[b]}
                    />
                  ))}
                  {/* Positive bands — warm hue */}
                  {posBands.map((bp, b) => (
                    <path
                      key={`p-${b}`}
                      d={areaGen(bp) ?? ""}
                      fill={posTones[b]}
                    />
                  ))}
                  {/* Baseline for the row */}
                  <line
                    x1={0}
                    y1={rowH}
                    x2={iw}
                    y2={rowH}
                    stroke="var(--color-ink-mute)"
                    strokeWidth={0.6}
                  />
                </g>
              </g>
            );
          })}
        </g>

        {/* Anchor 1: band stack (NVDA row) */}
        <ExplainAnchor
          selector="band-stack"
          index={1}
          pin={{ x: xScale(DAYS - 40), y: nvdaTop - 8 }}
          rect={{ x: 0, y: nvdaTop, width: iw, height: rowH }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: negative fold — AAPL row around Covid dip */}
        <ExplainAnchor
          selector="negative-fold"
          index={2}
          pin={{ x: covidX + 18, y: aaplTop + rowH / 2 }}
          rect={{
            x: Math.max(0, xScale(COVID_DIP_START) - 6),
            y: aaplTop,
            width: Math.min(iw, xScale(COVID_DIP_END) - xScale(COVID_DIP_START) + 12),
            height: rowH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: baseline (bottom of JPM row) */}
        <ExplainAnchor
          selector="baseline"
          index={3}
          pin={{ x: iw - 30, y: jpmBaseY + 10 }}
          rect={{ x: 0, y: jpmBaseY - 3, width: iw, height: 6 }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: intensity colour — top band, pin to darkest patch of NVDA */}
        <ExplainAnchor
          selector="intensity"
          index={4}
          pin={{ x: xScale(90) + 14, y: nvdaTop + 4 }}
          rect={{
            x: Math.max(0, xScale(COVID_DIP_START)),
            y: nvdaTop,
            width: Math.min(iw, xScale(COVID_DIP_END) - xScale(COVID_DIP_START)),
            height: Math.max(4, rowH / 3),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: row — highlight TSLA row (index 6), the fattest-tailed ticker */}
        {(() => {
          const tslaRow = 6;
          const tslaTop = rowTop(tslaRow);
          return (
            <ExplainAnchor
              selector="row"
              index={5}
              pin={{ x: -36, y: tslaTop + rowH / 2 }}
              rect={{ x: 0, y: tslaTop, width: iw, height: rowH }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 6: x-axis (trading days) */}
        <ExplainAnchor
          selector="x-axis"
          index={6}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v) => `d${Math.round(Number(v))}`}
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
            TRADING DAY
          </text>
        </ExplainAnchor>

        {/* Anchor 7: y-axis (tickers) */}
        <ExplainAnchor
          selector="y-axis"
          index={7}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
