"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Response time snapshot. Green/amber/red bands follow the SLA budget:
// 0-200ms is healthy, 200-400ms is a warning, 400-500ms is critical.
const VALUE_MS = 180;
const MIN_MS = 0;
const MAX_MS = 500;
const BANDS: ReadonlyArray<{
  selector: "band-green" | "band-amber" | "band-red";
  label: string;
  from: number;
  to: number;
  colour: string;
}> = [
  { selector: "band-green", label: "Healthy", from: 0, to: 200, colour: "#4a6a68" },
  { selector: "band-amber", label: "Warning", from: 200, to: 400, colour: "#b59b6b" },
  { selector: "band-red", label: "Critical", from: 400, to: 500, colour: "#8a4a4a" },
];

// Map a value in [MIN, MAX] to an angle. The arc spans from -π (left) to 0 (right)
// going clockwise across the top, so the gauge reads left-to-right like text.
function valueToAngle(v: number): number {
  const t = (v - MIN_MS) / (MAX_MS - MIN_MS);
  return -Math.PI + t * Math.PI;
}

function polar(cx: number, cy: number, r: number, angle: number): [number, number] {
  return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
}

// SVG path for a thick arc (ring segment) between two angles at radii rOuter/rInner.
// angles are in radians, negative = above horizontal centre.
function arcPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  a0: number,
  a1: number,
): string {
  const [x0o, y0o] = polar(cx, cy, rOuter, a0);
  const [x1o, y1o] = polar(cx, cy, rOuter, a1);
  const [x1i, y1i] = polar(cx, cy, rInner, a1);
  const [x0i, y0i] = polar(cx, cy, rInner, a0);
  const sweep = a1 - a0;
  const largeArc = Math.abs(sweep) > Math.PI ? 1 : 0;
  const clockwise = sweep > 0 ? 1 : 0;
  return [
    `M ${x0o} ${y0o}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} ${clockwise} ${x1o} ${y1o}`,
    `L ${x1i} ${y1i}`,
    `A ${rInner} ${rInner} 0 ${largeArc} ${1 - clockwise} ${x0i} ${y0i}`,
    "Z",
  ].join(" ");
}

interface Props {
  width: number;
  height: number;
}

export function GaugeChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 30, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Centre the semicircle horizontally; put its baseline ~75% down so the
  // numeric readout has room below.
  const cx = iw / 2;
  const cy = ih * 0.72;
  const maxR = Math.min(cx, cy);
  const rOuter = Math.max(20, maxR - 6);
  const rInner = rOuter * 0.66;

  const needleAngle = valueToAngle(VALUE_MS);
  const needleLen = rOuter * 0.92;
  const needleBase = 6;
  const [nTipX, nTipY] = polar(cx, cy, needleLen, needleAngle);
  const [nLx, nLy] = polar(cx, cy, needleBase, needleAngle - Math.PI / 2);
  const [nRx, nRy] = polar(cx, cy, needleBase, needleAngle + Math.PI / 2);

  // Position helpers for band anchor pins — use the middle angle of each band.
  const bandCentres = BANDS.map((b) => {
    const mid = (b.from + b.to) / 2;
    const a = valueToAngle(mid);
    const [px, py] = polar(cx, cy, (rOuter + rInner) / 2, a);
    return { ...b, px, py, a };
  });

  const readoutY = cy + 28;

  return (
    <svg width={width} height={height} role="img" aria-label="Gauge chart">
      <Group left={margin.left} top={margin.top}>
        {/* Full gauge arc — thin hairline background sets the expected span */}
        <ExplainAnchor
          selector="arc"
          index={1}
          pin={{ x: cx, y: cy - rOuter - 12 }}
          rect={{
            x: cx - rOuter - 6,
            y: cy - rOuter - 6,
            width: rOuter * 2 + 12,
            height: rOuter + 12,
          }}
        >
          <g data-data-layer="true">
            <path
              d={arcPath(cx, cy, rOuter + 2, rOuter, -Math.PI, 0)}
              fill="var(--color-ink-mute)"
              opacity={0.6}
            />
          </g>
        </ExplainAnchor>

        {/* Coloured zones */}
        <g data-data-layer="true">
          {bandCentres.map((b) => (
            <path
              key={b.selector}
              d={arcPath(cx, cy, rOuter, rInner, valueToAngle(b.from), valueToAngle(b.to))}
              fill={b.colour}
              stroke="var(--color-surface)"
              strokeWidth={1}
              opacity={0.92}
            />
          ))}
        </g>

        {/* Green band anchor */}
        <ExplainAnchor
          selector="band-green"
          index={2}
          pin={{
            x: bandCentres[0].px - 8,
            y: bandCentres[0].py - 14,
          }}
          rect={{
            x: cx - rOuter,
            y: cy - rOuter,
            width: rOuter * 0.75,
            height: rOuter,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Amber band anchor */}
        <ExplainAnchor
          selector="band-amber"
          index={3}
          pin={{ x: bandCentres[1].px, y: bandCentres[1].py - 18 }}
          rect={{
            x: cx - rOuter * 0.25,
            y: cy - rOuter,
            width: rOuter * 0.6,
            height: rOuter * 0.6,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Red band anchor */}
        <ExplainAnchor
          selector="band-red"
          index={4}
          pin={{
            x: bandCentres[2].px + 10,
            y: bandCentres[2].py - 10,
          }}
          rect={{
            x: cx + rOuter * 0.45,
            y: cy - rOuter * 0.6,
            width: rOuter * 0.6,
            height: rOuter * 0.6,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Tick marks at band boundaries and endpoints */}
        <g data-data-layer="true">
          {[0, 200, 400, 500].map((v) => {
            const a = valueToAngle(v);
            const [ox, oy] = polar(cx, cy, rOuter + 4, a);
            const [ix, iy] = polar(cx, cy, rOuter - 2, a);
            const [lx, ly] = polar(cx, cy, rOuter + 14, a);
            return (
              <g key={v}>
                <line
                  x1={ix}
                  y1={iy}
                  x2={ox}
                  y2={oy}
                  stroke="var(--color-ink-mute)"
                  strokeWidth={1}
                />
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-mute)"
                >
                  {v}
                </text>
              </g>
            );
          })}
        </g>

        {/* Needle — a narrow triangle rotated to the value */}
        <ExplainAnchor
          selector="needle"
          index={5}
          pin={{ x: nTipX + 10, y: nTipY - 12 }}
          rect={{
            x: Math.min(cx, nTipX) - 8,
            y: Math.min(cy, nTipY) - 8,
            width: Math.abs(nTipX - cx) + 16,
            height: Math.abs(nTipY - cy) + 16,
          }}
        >
          <g data-data-layer="true">
            <polygon
              points={`${nTipX},${nTipY} ${nLx},${nLy} ${nRx},${nRy}`}
              fill="var(--color-ink)"
            />
            <circle cx={cx} cy={cy} r={5} fill="var(--color-ink)" />
            <circle cx={cx} cy={cy} r={2} fill="var(--color-surface)" />
          </g>
        </ExplainAnchor>

        {/* Big numeric readout beneath the pivot */}
        <ExplainAnchor
          selector="value-readout"
          index={6}
          pin={{ x: cx + 54, y: readoutY - 4 }}
          rect={{
            x: cx - 56,
            y: readoutY - 22,
            width: 112,
            height: 32,
          }}
        >
          <g data-data-layer="true">
            <text
              x={cx}
              y={readoutY}
              textAnchor="middle"
              fontFamily="var(--font-display, var(--font-serif))"
              fontSize={32}
              fontWeight={500}
              fill="var(--color-ink)"
            >
              {VALUE_MS}
              <tspan
                fontFamily="var(--font-mono)"
                fontSize={12}
                fill="var(--color-ink-mute)"
                dx={4}
              >
                ms
              </tspan>
            </text>
            <text
              x={cx}
              y={readoutY + 14}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              P50 RESPONSE · SLA 500ms
            </text>
          </g>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
