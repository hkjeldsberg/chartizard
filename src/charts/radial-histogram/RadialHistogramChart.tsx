"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Capital Bikeshare-style trip-start counts by hour-of-day. Roughly tracks the
// published DC commuter pattern: near-zero overnight, a sharp 8am spike, a
// midday shoulder, a taller 5pm evening peak, then a long falloff. Integers in
// thousands of trips per hour summed across a representative month.
const HOURLY: ReadonlyArray<{ hour: number; trips: number }> = [
  { hour: 0, trips: 9 },
  { hour: 1, trips: 5 },
  { hour: 2, trips: 3 },
  { hour: 3, trips: 2 },
  { hour: 4, trips: 3 },
  { hour: 5, trips: 8 },
  { hour: 6, trips: 22 },
  { hour: 7, trips: 48 },
  { hour: 8, trips: 72 },
  { hour: 9, trips: 46 },
  { hour: 10, trips: 32 },
  { hour: 11, trips: 38 },
  { hour: 12, trips: 44 },
  { hour: 13, trips: 42 },
  { hour: 14, trips: 40 },
  { hour: 15, trips: 48 },
  { hour: 16, trips: 62 },
  { hour: 17, trips: 84 },
  { hour: 18, trips: 70 },
  { hour: 19, trips: 48 },
  { hour: 20, trips: 34 },
  { hour: 21, trips: 24 },
  { hour: 22, trips: 18 },
  { hour: 23, trips: 12 },
];

const N = HOURLY.length; // 24

interface Props {
  width: number;
  height: number;
}

export function RadialHistogramChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 36, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const cx = iw / 2;
  const cy = ih / 2;
  // Reserve outer padding for hour labels.
  const outerRadius = Math.max(0, Math.min(iw, ih) / 2 - 16);
  // Small inner disc so thin wedges stay legible near the centre.
  const innerRadius = Math.max(0, outerRadius * 0.22);

  const maxTrips = HOURLY.reduce((m, d) => Math.max(m, d.trips), 0);
  const rScale = scaleLinear({
    domain: [0, maxTrips],
    range: [innerRadius, outerRadius],
  });

  // Wedge angles. Hour 0 sits at 12 o'clock, hours advance clockwise.
  const wedgeAngle = (2 * Math.PI) / N;
  // Small gap between wedges, in radians.
  const gap = wedgeAngle * 0.08;
  // Convert "clock angle" (0 = up, clockwise positive) to SVG screen angle.
  const clockToScreen = (clock: number) => clock - Math.PI / 2;

  const wedgePath = (hour: number, trips: number) => {
    const startClock = hour * wedgeAngle + gap / 2;
    const endClock = (hour + 1) * wedgeAngle - gap / 2;
    const a0 = clockToScreen(startClock);
    const a1 = clockToScreen(endClock);
    const rOuter = rScale(trips);
    const rInner = innerRadius;

    const x0 = cx + rInner * Math.cos(a0);
    const y0 = cy + rInner * Math.sin(a0);
    const x1 = cx + rOuter * Math.cos(a0);
    const y1 = cy + rOuter * Math.sin(a0);
    const x2 = cx + rOuter * Math.cos(a1);
    const y2 = cy + rOuter * Math.sin(a1);
    const x3 = cx + rInner * Math.cos(a1);
    const y3 = cy + rInner * Math.sin(a1);

    // Large-arc flag is 0 since each wedge spans < 180°.
    return [
      `M ${x0.toFixed(2)} ${y0.toFixed(2)}`,
      `L ${x1.toFixed(2)} ${y1.toFixed(2)}`,
      `A ${rOuter.toFixed(2)} ${rOuter.toFixed(2)} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
      `L ${x3.toFixed(2)} ${y3.toFixed(2)}`,
      `A ${rInner.toFixed(2)} ${rInner.toFixed(2)} 0 0 0 ${x0.toFixed(2)} ${y0.toFixed(2)}`,
      "Z",
    ].join(" ");
  };

  // Concentric reference rings (counts at 25/50/75/100% of maxTrips).
  const ringLevels = [0.25, 0.5, 0.75, 1.0];

  // Label position just outside the outer ring, centred on each wedge.
  const labelAt = (hour: number) => {
    const midClock = (hour + 0.5) * wedgeAngle;
    const a = clockToScreen(midClock);
    const r = outerRadius + 10;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  // Indexes for anchor targets.
  const evening = HOURLY.reduce(
    (best, d, i, arr) => (d.trips > arr[best].trips ? i : best),
    0,
  ); // 17 — the biggest wedge
  const trough = HOURLY.reduce(
    (best, d, i, arr) => (d.trips < arr[best].trips ? i : best),
    0,
  ); // 3 — the smallest wedge

  // Centre points for key wedges — midpoint of the wedge at half its outer radius.
  const wedgeCentre = (hour: number) => {
    const midClock = (hour + 0.5) * wedgeAngle;
    const a = clockToScreen(midClock);
    const r = (innerRadius + rScale(HOURLY[hour].trips)) / 2;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  // Midnight anchor — the 0h position at 12 o'clock. Used to explain that the
  // axis wraps, i.e. there's no 0-to-24 seam.
  const midnightTop = { x: cx, y: cy - outerRadius - 2 };

  const eveningCentre = wedgeCentre(evening);
  const troughCentre = wedgeCentre(trough);

  // Ring anchor rect — clamp to plot bounds. The full-ring square is a
  // legitimate region-of-interest; its bounding box is 2*outerRadius.
  const ringAnchorR = rScale(maxTrips * 0.5);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Radial histogram"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Concentric reference rings */}
        <g data-data-layer="true">
          {ringLevels.map((pct) => {
            const r = rScale(maxTrips * pct);
            return (
              <circle
                key={pct}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="var(--color-hairline)"
                strokeWidth={pct === 1 ? 1 : 0.6}
                strokeDasharray={pct === 1 ? undefined : "2 3"}
              />
            );
          })}
          {/* Inner hole outline */}
          <circle
            cx={cx}
            cy={cy}
            r={innerRadius}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={0.6}
          />
        </g>

        {/* Wedges */}
        <g data-data-layer="true">
          {HOURLY.map((d) => (
            <path
              key={d.hour}
              d={wedgePath(d.hour, d.trips)}
              fill="var(--color-ink)"
              opacity={0.86}
            />
          ))}
        </g>

        {/* Hour labels — every 3 hours, else the ring gets crowded */}
        <g data-data-layer="true">
          {HOURLY.filter((d) => d.hour % 3 === 0).map((d) => {
            const p = labelAt(d.hour);
            const hh = d.hour.toString().padStart(2, "0");
            return (
              <text
                key={d.hour}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
              >
                {hh}
              </text>
            );
          })}
        </g>

        {/* Centre caption */}
        <g data-data-layer="true">
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
            letterSpacing="0.04em"
          >
            24H
          </text>
        </g>

        {/* 1. Angular axis — hour of day, 24 positions around the ring */}
        <ExplainAnchor
          selector="angular-axis"
          index={1}
          pin={{ x: midnightTop.x, y: Math.max(8, midnightTop.y - 6) }}
          rect={{
            x: Math.max(0, cx - outerRadius - 8),
            y: Math.max(0, cy - outerRadius - 8),
            width: Math.min(iw, 2 * outerRadius + 16),
            height: Math.min(ih, 2 * outerRadius + 16),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Wedge — the 5pm commute peak */}
        <ExplainAnchor
          selector="wedge"
          index={2}
          pin={{ x: eveningCentre.x + 18, y: eveningCentre.y + 4 }}
          rect={{
            x: Math.max(0, eveningCentre.x - 10),
            y: Math.max(0, eveningCentre.y - 10),
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Radial scale — distance from centre encodes count */}
        <ExplainAnchor
          selector="radial-scale"
          index={3}
          pin={{ x: cx + ringAnchorR + 10, y: cy - 2 }}
          rect={{
            x: Math.max(0, cx),
            y: Math.max(0, cy - ringAnchorR - 4),
            width: Math.min(iw - cx, outerRadius + 4),
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Trough — the pre-dawn low, ~3am */}
        <ExplainAnchor
          selector="trough"
          index={4}
          pin={{ x: troughCentre.x - 16, y: troughCentre.y + 4 }}
          rect={{
            x: Math.max(0, troughCentre.x - 10),
            y: Math.max(0, troughCentre.y - 10),
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Midnight wrap — the axis is cyclical, no 0→24 seam */}
        <ExplainAnchor
          selector="midnight-wrap"
          index={5}
          pin={{ x: midnightTop.x + 22, y: midnightTop.y + 6 }}
          rect={{
            x: Math.max(0, cx - 14),
            y: Math.max(0, cy - outerRadius - 6),
            width: 28,
            height: Math.min(ih - (cy - outerRadius - 6), 16),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Centre hole — wedges are truncated so thin bars stay legible */}
        <ExplainAnchor
          selector="centre"
          index={6}
          pin={{ x: cx + innerRadius + 10, y: cy + innerRadius + 8 }}
          rect={{
            x: Math.max(0, cx - innerRadius),
            y: Math.max(0, cy - innerRadius),
            width: innerRadius * 2,
            height: innerRadius * 2,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
