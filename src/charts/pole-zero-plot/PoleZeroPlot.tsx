"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// -----------------------------------------------------------------------
// Transfer function H(s) = (s + 3) / ((s + 1 + 2j)(s + 1 - 2j))
//   = (s + 3) / (s² + 2s + 5)
//
// Zeros:  −3 + 0j
// Poles:  −1 + 2j,  −1 − 2j  (conjugate pair, left half-plane → stable)
// -----------------------------------------------------------------------

// Poles (×) — left half-plane, conjugate pair
const POLES: ReadonlyArray<{ re: number; im: number; label: string }> = [
  { re: -1, im: 2, label: "−1+2j" },
  { re: -1, im: -2, label: "−1−2j" },
];

// Zeros (○) — negative real axis
const ZEROS: ReadonlyArray<{ re: number; im: number; label: string }> = [
  { re: -3, im: 0, label: "−3" },
];

interface Props {
  width: number;
  height: number;
}

export function PoleZeroPlot({ width, height }: Props) {
  const margin = { top: 20, right: 24, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Real axis: −4 to 1; imaginary axis: −3 to 3
  const xScale = scaleLinear<number>({ domain: [-4, 1], range: [0, iw] });
  const yScale = scaleLinear<number>({ domain: [-3, 3], range: [ih, 0] });

  // Pixel coordinate helpers
  const px = (re: number) => (iw > 0 ? xScale(re) : 0);
  const py = (im: number) => (ih > 0 ? yScale(im) : 0);

  // Imaginary axis (jω axis) pixel x-position
  const imagAxisX = px(0);

  // Cross-hair size for × marker (poles)
  const X_HALF = 6;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Pole-zero plot of transfer function H(s) = (s+3)/((s+1)^2+4) on the complex plane"
    >
      <Group left={margin.left} top={margin.top}>
        {/* ================================================================
            Data layer: gridlines, stability boundary, marks
            ================================================================ */}
        <g data-data-layer="true">
          {/* Light horizontal and vertical gridlines */}
          {[-2, -1, 0, 1, 2].map((v) => (
            <line
              key={`hg-${v}`}
              x1={0}
              x2={iw}
              y1={py(v)}
              y2={py(v)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
          {[-3, -2, -1, 0].map((v) => (
            <line
              key={`vg-${v}`}
              x1={px(v)}
              x2={px(v)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* 1. Stability boundary (imaginary / jω axis) */}
        <ExplainAnchor
          selector="stability-boundary"
          index={1}
          pin={{ x: imagAxisX + 10, y: Math.max(4, ih / 2 - 16) }}
          rect={{ x: Math.max(0, imagAxisX - 4), y: 0, width: 8, height: ih }}
        >
          <line
            x1={imagAxisX}
            x2={imagAxisX}
            y1={0}
            y2={ih}
            stroke="var(--color-ink)"
            strokeWidth={1.5}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* jω label */}
        <text
          x={imagAxisX + 4}
          y={8}
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-mute)"
        >
          jω
        </text>

        {/* 2. Real axis */}
        <ExplainAnchor
          selector="real-axis"
          index={2}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
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
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            σ (real)
          </text>
        </ExplainAnchor>

        {/* Imaginary axis */}
        <ExplainAnchor
          selector="imaginary-axis"
          index={3}
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
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "end",
              dx: "-0.33em",
              dy: "0.33em",
            })}
          />
          <text
            x={-38}
            y={ih / 2}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
            transform={`rotate(-90, -38, ${ih / 2})`}
          >
            Im
          </text>
        </ExplainAnchor>

        {/* 4. Conjugate pair: poles */}
        <ExplainAnchor
          selector="conjugate-pair"
          index={4}
          pin={{ x: Math.min(iw - 10, px(-1) + 14), y: Math.max(4, py(2) - 14) }}
          rect={{
            x: Math.max(0, px(-1) - 14),
            y: Math.max(0, py(2) - 14),
            width: Math.min(iw - Math.max(0, px(-1) - 14), 28),
            height: Math.min(ih, Math.abs(py(-2) - py(2)) + 28),
          }}
        >
          <g data-data-layer="true">
            {/* Dashed reflection line between conjugate poles */}
            <line
              x1={px(-1)}
              y1={py(2)}
              x2={px(-1)}
              y2={py(-2)}
              stroke="var(--color-ink-mute)"
              strokeWidth={0.8}
              strokeDasharray="3 3"
            />
            {POLES.map((p) => (
              <g key={p.label}>
                {/* × as two crossed lines */}
                <line
                  x1={px(p.re) - X_HALF}
                  y1={py(p.im) - X_HALF}
                  x2={px(p.re) + X_HALF}
                  y2={py(p.im) + X_HALF}
                  stroke="var(--color-ink)"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <line
                  x1={px(p.re) + X_HALF}
                  y1={py(p.im) - X_HALF}
                  x2={px(p.re) - X_HALF}
                  y2={py(p.im) + X_HALF}
                  stroke="var(--color-ink)"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </g>
            ))}
          </g>
        </ExplainAnchor>

        {/* 5. Zero marker */}
        <ExplainAnchor
          selector="zero-marker"
          index={5}
          pin={{ x: Math.min(iw - 10, px(-3) + 14), y: Math.max(4, py(0) - 14) }}
          rect={{
            x: Math.max(0, px(-3) - 10),
            y: Math.max(0, py(0) - 10),
            width: Math.min(iw - Math.max(0, px(-3) - 10), 20),
            height: Math.min(ih - Math.max(0, py(0) - 10), 20),
          }}
        >
          <g data-data-layer="true">
            {ZEROS.map((z) => (
              <circle
                key={z.label}
                cx={px(z.re)}
                cy={py(z.im)}
                r={6}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={2}
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Pole/zero labels */}
        <g data-data-layer="true">
          {POLES.map((p) => (
            <text
              key={`lbl-${p.label}`}
              x={px(p.re) + 10}
              y={py(p.im) + (p.im > 0 ? -4 : 10)}
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              {p.label}
            </text>
          ))}
          {ZEROS.map((z) => (
            <text
              key={`lbl-${z.label}`}
              x={px(z.re) + 10}
              y={py(z.im) - 4}
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              {z.label}
            </text>
          ))}
        </g>

        {/* 6. Legend */}
        <ExplainAnchor
          selector="legend"
          index={6}
          pin={{ x: iw - 40, y: 10 }}
          rect={{ x: Math.max(0, iw - 80), y: 0, width: Math.min(iw, 80), height: 36 }}
        >
          <g data-data-layer="true">
            <rect
              x={Math.max(0, iw - 72)}
              y={2}
              width={70}
              height={34}
              fill="var(--color-page)"
              stroke="var(--color-hairline)"
              strokeWidth={0.8}
              rx={2}
            />
            {/* × pole symbol */}
            <line
              x1={Math.max(0, iw - 64)}
              y1={12}
              x2={Math.max(0, iw - 56)}
              y2={20}
              stroke="var(--color-ink)"
              strokeWidth={1.8}
              strokeLinecap="round"
            />
            <line
              x1={Math.max(0, iw - 56)}
              y1={12}
              x2={Math.max(0, iw - 64)}
              y2={20}
              stroke="var(--color-ink)"
              strokeWidth={1.8}
              strokeLinecap="round"
            />
            <text
              x={Math.max(0, iw - 52)}
              y={18}
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-soft)"
              dominantBaseline="central"
            >
              pole
            </text>
            {/* ○ zero symbol */}
            <circle
              cx={Math.max(0, iw - 60)}
              cy={30}
              r={4}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.8}
            />
            <text
              x={Math.max(0, iw - 52)}
              y={30}
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-soft)"
              dominantBaseline="central"
            >
              zero
            </text>
          </g>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
