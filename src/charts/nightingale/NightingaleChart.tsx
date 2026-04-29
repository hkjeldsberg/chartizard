"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Florence Nightingale's 1858 "Diagram of the Causes of Mortality in the Army
// in the East" — recreation of the second 12-month cycle (April 1855 - March
// 1856). Each monthly wedge occupies exactly 30° of arc (12 × 30° = 360°);
// radius is driven by the TOTAL deaths, and the three causes stack as
// concentric bands from the hub outward: preventable disease (zymotic) →
// wounds → other. Numbers are representative, not a strict archival copy —
// chosen so the disease band dominates, as it did in the real chart.
const MONTHS = [
  "Apr", "May", "Jun", "Jul",
  "Aug", "Sep", "Oct", "Nov",
  "Dec", "Jan", "Feb", "Mar",
] as const;

type MonthDatum = {
  month: (typeof MONTHS)[number];
  disease: number; // preventable / zymotic
  wounds: number;  // killed + died of wounds
  other: number;   // all other causes
};

// April 1855 → March 1856. The January wedge is the visual peak of the cycle.
const DATA: ReadonlyArray<MonthDatum> = [
  { month: "Apr", disease: 820, wounds: 120, other: 110 },
  { month: "May", disease: 450, wounds: 90,  other: 95 },
  { month: "Jun", disease: 380, wounds: 110, other: 80 },
  { month: "Jul", disease: 520, wounds: 70,  other: 90 },
  { month: "Aug", disease: 610, wounds: 60,  other: 100 },
  { month: "Sep", disease: 540, wounds: 180, other: 95 },
  { month: "Oct", disease: 680, wounds: 140, other: 110 },
  { month: "Nov", disease: 1040, wounds: 100, other: 130 },
  { month: "Dec", disease: 1360, wounds: 80,  other: 160 },
  { month: "Jan", disease: 1650, wounds: 70,  other: 200 }, // January 1856 peak
  { month: "Feb", disease: 1200, wounds: 55,  other: 170 },
  { month: "Mar", disease: 720, wounds: 40,  other: 120 },
];

// Concentric band order: disease sits at the hub, wounds next, other outermost.
// That ordering matters — the eye first sees the innermost circle's reach and
// recognises that nearly every wedge is mostly disease.
const BANDS: ReadonlyArray<{
  key: "disease" | "wounds" | "other";
  label: string;
  opacity: number;
}> = [
  { key: "disease", label: "Preventable disease", opacity: 0.85 },
  { key: "wounds",  label: "Wounds in battle",    opacity: 0.45 },
  { key: "other",   label: "Other causes",        opacity: 0.20 },
];

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

interface Props {
  width: number;
  height: number;
}

export function NightingaleChart({ width, height }: Props) {
  // Square layout; reserve bottom margin for legend.
  const margin = { top: 18, right: 16, bottom: 48, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const cx = iw / 2;
  const cy = ih / 2;
  const maxRadius = Math.max(0, Math.min(iw, ih) / 2 - 22);

  // Radius encodes TOTAL deaths per month. Nightingale's original scaled
  // radius proportionally (not area), which exaggerates the largest wedges —
  // we keep that convention so the chart reads as she drew it.
  const totals = DATA.map((d) => d.disease + d.wounds + d.other);
  const maxTotal = Math.max(...totals);
  const rScale = scaleLinear({
    domain: [0, Math.ceil(maxTotal / 200) * 200],
    range: [0, maxRadius],
  });

  const n = DATA.length; // 12
  const wedgeAngle = (2 * Math.PI) / n; // 30° per wedge
  // Month index 0 (Apr) centred at 12 o'clock; angles increase clockwise.
  const centreAngle = (i: number) => -Math.PI / 2 + i * wedgeAngle;

  // Build an annular / solid wedge between two radii and two angles.
  const wedgePath = (r0: number, r1: number, a0: number, a1: number) => {
    const x0Outer = cx + r1 * Math.cos(a0);
    const y0Outer = cy + r1 * Math.sin(a0);
    const x1Outer = cx + r1 * Math.cos(a1);
    const y1Outer = cy + r1 * Math.sin(a1);
    const largeArc = a1 - a0 <= Math.PI ? 0 : 1;
    if (r0 <= 0) {
      return [
        `M${cx.toFixed(2)} ${cy.toFixed(2)}`,
        `L${x0Outer.toFixed(2)} ${y0Outer.toFixed(2)}`,
        `A${r1.toFixed(2)} ${r1.toFixed(2)} 0 ${largeArc} 1 ${x1Outer.toFixed(2)} ${y1Outer.toFixed(2)}`,
        "Z",
      ].join(" ");
    }
    const x0Inner = cx + r0 * Math.cos(a0);
    const y0Inner = cy + r0 * Math.sin(a0);
    const x1Inner = cx + r0 * Math.cos(a1);
    const y1Inner = cy + r0 * Math.sin(a1);
    return [
      `M${x0Inner.toFixed(2)} ${y0Inner.toFixed(2)}`,
      `L${x0Outer.toFixed(2)} ${y0Outer.toFixed(2)}`,
      `A${r1.toFixed(2)} ${r1.toFixed(2)} 0 ${largeArc} 1 ${x1Outer.toFixed(2)} ${y1Outer.toFixed(2)}`,
      `L${x1Inner.toFixed(2)} ${y1Inner.toFixed(2)}`,
      `A${r0.toFixed(2)} ${r0.toFixed(2)} 0 ${largeArc} 0 ${x0Inner.toFixed(2)} ${y0Inner.toFixed(2)}`,
      "Z",
    ].join(" ");
  };

  // Radial ticks (deaths scale) — 3 labelled rings.
  const ringLevels = rScale.ticks(3).filter((v) => v > 0);

  // January 1856 is index 9 — the visual peak used as the single-wedge anchor.
  const peakIdx = DATA.findIndex((d) => d.month === "Jan");
  const peakCentreA = centreAngle(peakIdx);
  const peakTotal = totals[peakIdx];
  const peakTipR = rScale(peakTotal);
  const peakTip = {
    x: cx + peakTipR * Math.cos(peakCentreA),
    y: cy + peakTipR * Math.sin(peakCentreA),
  };
  // Mid-point of the disease band within the peak wedge — for the disease anchor.
  const peakDiseaseR = rScale(DATA[peakIdx].disease) * 0.55;
  const peakDiseaseMid = {
    x: cx + peakDiseaseR * Math.cos(peakCentreA),
    y: cy + peakDiseaseR * Math.sin(peakCentreA),
  };
  // Mid-point of the wounds band within the peak wedge — for the wounds anchor.
  const peakWoundsR =
    rScale(DATA[peakIdx].disease) +
    (rScale(DATA[peakIdx].disease + DATA[peakIdx].wounds) -
      rScale(DATA[peakIdx].disease)) /
      2;
  const peakWoundsMid = {
    x: cx + peakWoundsR * Math.cos(peakCentreA),
    y: cy + peakWoundsR * Math.sin(peakCentreA),
  };

  // Label ring just outside the outermost wedge radius.
  const labelR = maxRadius + 12;
  const labelPos = (i: number) => {
    const a = centreAngle(i);
    return { x: cx + labelR * Math.cos(a), y: cy + labelR * Math.sin(a) };
  };

  // Legend along the bottom — three bands.
  const legendY = ih + 14;
  const swatchWidth = 120;
  const legendTotalWidth = BANDS.length * swatchWidth;
  const legendX0 = cx - legendTotalWidth / 2;

  return (
    <svg width={width} height={height} role="img" aria-label="Nightingale chart">
      <Group left={margin.left} top={margin.top}>
        {/* Radius rings (deaths scale) + 12 radial spokes */}
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
          {DATA.map((_, i) => {
            const a = centreAngle(i) - wedgeAngle / 2;
            return (
              <line
                key={`spoke-${i}`}
                x1={cx}
                y1={cy}
                x2={cx + maxRadius * Math.cos(a)}
                y2={cy + maxRadius * Math.sin(a)}
                stroke="var(--color-hairline)"
                strokeWidth={0.5}
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
              {lvl}
            </text>
          ))}
        </g>

        {/* Stacked wedges — one per month, three bands each */}
        <g data-data-layer="true">
          {DATA.map((d, i) => {
            const ac = centreAngle(i);
            const a0 = ac - wedgeAngle / 2;
            const a1 = ac + wedgeAngle / 2;
            // Cumulative stack in data space, converted to px via rScale.
            let cum = 0;
            return (
              <g key={`wedge-${d.month}-${i}`}>
                {BANDS.map((b) => {
                  const start = cum;
                  const end = cum + d[b.key];
                  cum = end;
                  const rStart = rScale(start);
                  const rEnd = rScale(end);
                  return (
                    <path
                      key={`seg-${i}-${b.key}`}
                      d={wedgePath(rStart, rEnd, a0, a1)}
                      fill="var(--color-ink)"
                      fillOpacity={b.opacity}
                      stroke="var(--color-page)"
                      strokeWidth={0.5}
                    />
                  );
                })}
              </g>
            );
          })}
        </g>

        {/* Month labels */}
        <g data-data-layer="true">
          {DATA.map((d, i) => {
            const p = labelPos(i);
            const anchor =
              Math.abs(p.x - cx) < 2
                ? "middle"
                : p.x > cx
                ? "start"
                : "end";
            const isPeak = d.month === "Jan";
            return (
              <text
                key={`m-${d.month}`}
                x={p.x}
                y={p.y}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fontWeight={isPeak ? 600 : 400}
                fill={isPeak ? "var(--color-ink)" : "var(--color-ink-soft)"}
              >
                {d.month.toUpperCase()}
              </text>
            );
          })}
        </g>

        {/* Anchor: the January 1856 peak wedge */}
        <ExplainAnchor
          selector="peak-wedge"
          index={1}
          pin={{
            x: clamp(peakTip.x - 18, 10, iw - 10),
            y: clamp(peakTip.y + 8, 10, ih - 10),
          }}
          rect={{
            x: clamp(peakTip.x - 22, 0, iw),
            y: clamp(cy, 0, ih),
            width: 44,
            height: Math.max(18, peakTip.y - cy + 12),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor: the preventable-disease band (innermost, the chart's point) */}
        <ExplainAnchor
          selector="disease-band"
          index={2}
          pin={{
            x: clamp(peakDiseaseMid.x - 28, 10, iw - 10),
            y: clamp(peakDiseaseMid.y - 4, 10, ih - 10),
          }}
          rect={{
            x: clamp(cx - peakDiseaseR - 6, 0, iw),
            y: clamp(cy - 4, 0, ih),
            width: Math.max(14, peakDiseaseR * 2 + 12),
            height: 28,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor: the wounds band (the small middle slice) */}
        <ExplainAnchor
          selector="wounds-band"
          index={3}
          pin={{
            x: clamp(peakWoundsMid.x + 18, 10, iw - 10),
            y: clamp(peakWoundsMid.y, 10, ih - 10),
          }}
          rect={{
            x: clamp(peakWoundsMid.x - 8, 0, iw),
            y: clamp(peakWoundsMid.y - 8, 0, ih),
            width: 16,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor: the month labels (angular axis) */}
        <ExplainAnchor
          selector="month-labels"
          index={4}
          pin={{
            x: clamp(labelPos(0).x + 10, 10, iw - 10),
            y: clamp(labelPos(0).y - 10, 10, ih - 10),
          }}
          rect={{
            x: clamp(cx - maxRadius - 14, 0, iw),
            y: clamp(cy - maxRadius - 14, 0, ih),
            width: Math.min(iw, maxRadius * 2 + 28),
            height: Math.min(ih, maxRadius * 2 + 28),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor: the radial scale (deaths) */}
        <ExplainAnchor
          selector="radius-scale"
          index={5}
          pin={{
            x: clamp(cx + (ringLevels.length > 0 ? rScale(ringLevels[ringLevels.length - 1]) : maxRadius) + 18, 10, iw - 10),
            y: clamp(cy - 12, 10, ih - 10),
          }}
          rect={{
            x: clamp(cx, 0, iw),
            y: clamp(cy - 10, 0, ih),
            width: Math.max(14, maxRadius + 4),
            height: 14,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Legend — three cause bands */}
        <g data-data-layer="true">
          {BANDS.map((b, bi) => {
            const x = legendX0 + bi * swatchWidth;
            const y = legendY;
            return (
              <g key={`legend-${b.key}`} transform={`translate(${x}, ${y})`}>
                <rect
                  x={0}
                  y={0}
                  width={10}
                  height={10}
                  fill="var(--color-ink)"
                  fillOpacity={b.opacity}
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
                  {b.label.toUpperCase()}
                </text>
              </g>
            );
          })}
        </g>

        <ExplainAnchor
          selector="legend"
          index={6}
          pin={{
            x: clamp(legendX0 - 10, 4, iw - 4),
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
