"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Oslo-Gardermoen airport (ENGM), 12-month aggregate — directional frequencies
// (% of hours) by 16 compass sectors, stacked by 4 wind-speed bands (m/s).
// Hand-picked to reflect Gardermoen's documented S–SSW prevailing flow, with
// a secondary N–NNW component from synoptic northerlies.
const SECTORS = [
  "N", "NNE", "NE", "ENE",
  "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW",
  "W", "WNW", "NW", "NNW",
] as const;

type SpeedBand = { label: string; pct: number[] };

// Order matters: bands stack from innermost (calm) to outermost (strongest).
// Each array has length 16, one entry per compass sector in the order above.
const BANDS: ReadonlyArray<SpeedBand> = [
  {
    label: "0-5",
    pct: [
      2.1, 1.6, 1.3, 1.2, // N, NNE, NE, ENE
      1.4, 1.5, 1.6, 2.0, // E, ESE, SE, SSE
      2.4, 2.6, 2.1, 1.6, // S, SSW, SW, WSW
      1.3, 1.4, 1.5, 1.7, // W, WNW, NW, NNW
    ],
  },
  {
    label: "5-10",
    pct: [
      1.6, 1.1, 0.8, 0.6,
      0.7, 0.8, 1.0, 1.8,
      3.2, 3.6, 2.4, 1.2,
      0.8, 0.8, 0.9, 1.2,
    ],
  },
  {
    label: "10-15",
    pct: [
      0.6, 0.3, 0.2, 0.1,
      0.2, 0.2, 0.3, 0.7,
      1.6, 1.9, 1.0, 0.4,
      0.2, 0.2, 0.3, 0.5,
    ],
  },
  {
    label: "15+",
    pct: [
      0.1, 0.05, 0.02, 0.02,
      0.02, 0.02, 0.05, 0.2,
      0.5, 0.6, 0.3, 0.1,
      0.05, 0.05, 0.08, 0.15,
    ],
  },
];

// Opacity per band — darker for stronger winds reads as "heavier", and the
// ramp is visible in monochrome so the legend has a job beyond naming the bands.
const BAND_OPACITIES = [0.25, 0.45, 0.65, 0.9] as const;

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// Cumulative data-space offset for the start of stack band `bandIdx` in sector
// `sectorIdx`. Stacking is done in data space (percent), then converted to px
// via rScale at render time.
function cumulativeBefore(sectorIdx: number, bandIdx: number): number {
  let sum = 0;
  for (let k = 0; k < bandIdx; k++) sum += BANDS[k].pct[sectorIdx];
  return sum;
}

interface Props {
  width: number;
  height: number;
}

export function RoseDiagramChart({ width, height }: Props) {
  // Square-ish layout; reserve bottom margin for legend + cardinal labels.
  const margin = { top: 16, right: 16, bottom: 44, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const cx = iw / 2;
  const cy = ih / 2;
  const maxRadius = Math.max(0, Math.min(iw, ih) / 2 - 16);

  // Per-sector totals (sum across bands) — used for ring scale + prevailing.
  const totals = SECTORS.map((_, i) =>
    BANDS.reduce((acc, b) => acc + b.pct[i], 0),
  );
  const maxTotal = Math.max(...totals);

  const rScale = scaleLinear({
    domain: [0, Math.ceil(maxTotal)],
    range: [0, maxRadius],
  });

  const sectorCount = SECTORS.length;
  const sectorAngle = (2 * Math.PI) / sectorCount; // 22.5° per sector
  const halfWedge = sectorAngle * 0.44; // small gap between adjacent petals

  // North is up. Sector 0 is centred at -π/2; angles increase clockwise.
  const centreAngle = (i: number) => -Math.PI / 2 + i * sectorAngle;

  // Build the SVG path for an annular wedge between two radii and two angles.
  const wedgePath = (r0: number, r1: number, a0: number, a1: number) => {
    const x0Outer = cx + r1 * Math.cos(a0);
    const y0Outer = cy + r1 * Math.sin(a0);
    const x1Outer = cx + r1 * Math.cos(a1);
    const y1Outer = cy + r1 * Math.sin(a1);
    const x0Inner = cx + r0 * Math.cos(a0);
    const y0Inner = cy + r0 * Math.sin(a0);
    const x1Inner = cx + r0 * Math.cos(a1);
    const y1Inner = cy + r0 * Math.sin(a1);
    const largeArc = a1 - a0 <= Math.PI ? 0 : 1;

    if (r0 <= 0) {
      return [
        `M${cx.toFixed(2)} ${cy.toFixed(2)}`,
        `L${x0Outer.toFixed(2)} ${y0Outer.toFixed(2)}`,
        `A${r1.toFixed(2)} ${r1.toFixed(2)} 0 ${largeArc} 1 ${x1Outer.toFixed(2)} ${y1Outer.toFixed(2)}`,
        "Z",
      ].join(" ");
    }
    return [
      `M${x0Inner.toFixed(2)} ${y0Inner.toFixed(2)}`,
      `L${x0Outer.toFixed(2)} ${y0Outer.toFixed(2)}`,
      `A${r1.toFixed(2)} ${r1.toFixed(2)} 0 ${largeArc} 1 ${x1Outer.toFixed(2)} ${y1Outer.toFixed(2)}`,
      `L${x1Inner.toFixed(2)} ${y1Inner.toFixed(2)}`,
      `A${r0.toFixed(2)} ${r0.toFixed(2)} 0 ${largeArc} 0 ${x0Inner.toFixed(2)} ${y0Inner.toFixed(2)}`,
      "Z",
    ].join(" ");
  };

  // Ring levels for the frequency scale — 4 marks up to maxTotal.
  const ringLevels = rScale.ticks(4).filter((v) => v > 0);

  // Prevailing-direction sector = argmax of totals.
  const prevailingIdx = totals.indexOf(maxTotal);
  const prevailingAngle = centreAngle(prevailingIdx);
  const prevailingTipR = rScale(totals[prevailingIdx]);
  const prevailingTip = {
    x: cx + prevailingTipR * Math.cos(prevailingAngle),
    y: cy + prevailingTipR * Math.sin(prevailingAngle),
  };

  // ENE petal — a modest, off-prevailing direction — used as the single-petal anchor.
  const singleIdx = 3;
  const singleAngle = centreAngle(singleIdx);
  const singleTipR = rScale(totals[singleIdx]);
  const singleTip = {
    x: cx + singleTipR * Math.cos(singleAngle),
    y: cy + singleTipR * Math.sin(singleAngle),
  };

  // Cardinal label positions just outside the outer ring.
  const cardinal: Array<{ key: string; idx: number; major: boolean }> = [
    { key: "N", idx: 0, major: true },
    { key: "NE", idx: 2, major: false },
    { key: "E", idx: 4, major: true },
    { key: "SE", idx: 6, major: false },
    { key: "S", idx: 8, major: true },
    { key: "SW", idx: 10, major: false },
    { key: "W", idx: 12, major: true },
    { key: "NW", idx: 14, major: false },
  ];

  const cardinalPos = (idx: number) => {
    const a = centreAngle(idx);
    const r = maxRadius + 10;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a };
  };

  const northPos = cardinalPos(0);

  // Legend laid out along the bottom — 4 swatches.
  const legendY = ih + 10;
  const swatchWidth = 54;
  const legendTotalWidth = BANDS.length * swatchWidth;
  const legendX0 = cx - legendTotalWidth / 2;

  return (
    <svg width={width} height={height} role="img" aria-label="Rose diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Concentric frequency rings + compass spokes */}
        <g data-data-layer="true">
          {ringLevels.map((lvl) => (
            <circle
              key={`ring-${lvl}`}
              cx={cx}
              cy={cy}
              r={rScale(lvl)}
              fill="none"
              stroke="var(--color-hairline)"
              strokeWidth={0.75}
            />
          ))}
          <circle
            cx={cx}
            cy={cy}
            r={maxRadius}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
          {[0, 2, 4, 6, 8, 10, 12, 14].map((i) => {
            const a = centreAngle(i);
            return (
              <line
                key={`spoke-${i}`}
                x1={cx}
                y1={cy}
                x2={cx + maxRadius * Math.cos(a)}
                y2={cy + maxRadius * Math.sin(a)}
                stroke="var(--color-hairline)"
                strokeWidth={0.6}
              />
            );
          })}
          {ringLevels.map((lvl) => (
            <text
              key={`ring-label-${lvl}`}
              x={cx + rScale(lvl) + 2}
              y={cy - 2}
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-soft)"
            >
              {lvl}%
            </text>
          ))}
        </g>

        {/* Stacked petals */}
        <g data-data-layer="true">
          {SECTORS.map((_, i) => {
            const ac = centreAngle(i);
            const a0 = ac - halfWedge;
            const a1 = ac + halfWedge;
            return (
              <g key={`sector-${i}`}>
                {BANDS.map((b, bi) => {
                  const rStart = rScale(cumulativeBefore(i, bi));
                  const rEnd = rScale(cumulativeBefore(i, bi) + b.pct[i]);
                  return (
                    <path
                      key={`seg-${i}-${bi}`}
                      d={wedgePath(rStart, rEnd, a0, a1)}
                      fill="var(--color-ink)"
                      fillOpacity={BAND_OPACITIES[bi]}
                      stroke="var(--color-page)"
                      strokeWidth={0.5}
                    />
                  );
                })}
              </g>
            );
          })}
        </g>

        {/* Cardinal + intercardinal labels */}
        <g data-data-layer="true">
          {cardinal.map(({ key, idx, major }) => {
            const p = cardinalPos(idx);
            const anchor =
              Math.abs(p.x - cx) < 2
                ? "middle"
                : p.x > cx
                ? "start"
                : "end";
            return (
              <text
                key={key}
                x={p.x}
                y={p.y}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontFamily="var(--font-mono)"
                fontSize={major ? 11 : 9}
                fontWeight={major ? 600 : 400}
                fill={major ? "var(--color-ink)" : "var(--color-ink-soft)"}
              >
                {key}
              </text>
            );
          })}
        </g>

        {/* Anchor: a single petal — ENE stack */}
        <ExplainAnchor
          selector="petal"
          index={1}
          pin={{
            x: clamp(singleTip.x + 14, 10, iw - 10),
            y: clamp(singleTip.y - 10, 10, ih - 10),
          }}
          rect={{
            x: clamp(singleTip.x - 14, 0, iw),
            y: clamp(singleTip.y - 10, 0, ih),
            width: 28,
            height: Math.max(14, cy - singleTip.y + 10),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor: the North spoke (cardinal axis) */}
        <ExplainAnchor
          selector="north-axis"
          index={2}
          pin={{
            x: clamp(northPos.x + 14, 10, iw - 10),
            y: clamp(northPos.y - 6, 10, ih - 10),
          }}
          rect={{
            x: clamp(cx - 10, 0, iw),
            y: clamp(cy - maxRadius - 6, 0, ih),
            width: 20,
            height: maxRadius + 6,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor: the radial frequency scale */}
        <ExplainAnchor
          selector="radial-scale"
          index={3}
          pin={{
            x: clamp(cx + rScale(ringLevels[ringLevels.length - 1] ?? 0) + 18, 10, iw - 10),
            y: clamp(cy - 14, 10, ih - 10),
          }}
          rect={{
            x: clamp(cx, 0, iw),
            y: clamp(cy - 14, 0, ih),
            width: Math.max(
              10,
              rScale(ringLevels[ringLevels.length - 1] ?? 0) + 4,
            ),
            height: 18,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor: prevailing-direction petal (S / SSW) */}
        <ExplainAnchor
          selector="prevailing"
          index={4}
          pin={{
            x: clamp(prevailingTip.x - 22, 10, iw - 10),
            y: clamp(prevailingTip.y + 6, 10, ih - 10),
          }}
          rect={{
            x: clamp(prevailingTip.x - 18, 0, iw),
            y: clamp(cy, 0, ih),
            width: 36,
            height: Math.max(14, prevailingTip.y - cy + 10),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Legend — speed bands */}
        <g data-data-layer="true">
          {BANDS.map((b, bi) => {
            const x = legendX0 + bi * swatchWidth;
            const y = legendY;
            return (
              <g key={`legend-${b.label}`} transform={`translate(${x}, ${y})`}>
                <rect
                  x={0}
                  y={0}
                  width={10}
                  height={10}
                  fill="var(--color-ink)"
                  fillOpacity={BAND_OPACITIES[bi]}
                  stroke="var(--color-ink)"
                  strokeWidth={0.6}
                />
                <text
                  x={14}
                  y={8}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {b.label}
                </text>
              </g>
            );
          })}
          <text
            x={legendX0 + legendTotalWidth / 2}
            y={legendY + 24}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            WIND SPEED (M/S)
          </text>
        </g>

        <ExplainAnchor
          selector="legend"
          index={5}
          pin={{
            x: clamp(legendX0 - 8, 4, iw - 4),
            y: clamp(legendY + 4, 4, ih + margin.bottom - 4),
          }}
          rect={{
            x: clamp(legendX0 - 4, 0, iw),
            y: clamp(legendY - 2, 0, ih + margin.bottom),
            width: legendTotalWidth + 8,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
