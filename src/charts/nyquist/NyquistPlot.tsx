"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Same open-loop transfer function as the sibling Nichols chart:
//   G(jω) = K / ( jω · (1 + jω/p1) · (1 + jω/p2) ),  K = 10, p1 = 5, p2 = 20.
const K = 10;
const P1 = 5;
const P2 = 20;

type Complex = { re: number; im: number };

function G(w: number): Complex {
  // Denominator D(jω) = jω · (1 + jω/p1) · (1 + jω/p2)
  //   = −ω²(1/p1 + 1/p2) + j · ω(1 − ω²/(p1·p2))
  const A = -w * w * (1 / P1 + 1 / P2);
  const B = w * (1 - (w * w) / (P1 * P2));
  const denom2 = A * A + B * B;
  // G = K / (A + jB) = K(A − jB) / (A² + B²)
  return { re: (K * A) / denom2, im: (-K * B) / denom2 };
}

function sampleCurve(): ReadonlyArray<Complex & { w: number }> {
  const N = 81;
  const wMin = 0.8;
  const wMax = 100;
  const out: Array<Complex & { w: number }> = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const w = wMin * Math.pow(wMax / wMin, t); // log-spaced in ω
    const g = G(w);
    out.push({ w, re: g.re, im: g.im });
  }
  return out;
}

export function NyquistPlot({ width, height }: Props) {
  // Equal left/right margin + square plot area so that the polar shape
  // reads geometrically (1 unit horizontal = 1 unit vertical).
  const margin = { top: 20, right: 20, bottom: 44, left: 20 };
  const aw = Math.max(0, width - margin.left - margin.right);
  const ah = Math.max(0, height - margin.top - margin.bottom);
  const side = Math.max(0, Math.min(aw, ah));
  const iw = side;
  const ih = side;
  const plotLeft = margin.left + (aw - side) / 2;

  const data = useMemo(() => sampleCurve(), []);

  // Complex-plane viewport. Chosen to keep (−1, 0) central and show the
  // spiral to origin on the right, while letting the low-ω tail exit
  // cleanly through the bottom edge.
  const xScale = scaleLinear({ domain: [-3, 1], range: [0, iw] });
  const yScale = scaleLinear({ domain: [-3, 3], range: [ih, 0] });

  // Upper-half branch (ω > 0). Imaginary part negated for plotting?
  // Actually in a conventional Nyquist plot the ω > 0 branch traces the
  // lower half-plane first (negative imaginary) and swings back through
  // the real axis — and the ω < 0 branch is the mirror image. That is
  // exactly what G(jω) computed above produces.
  const posPath = useMemo(() => {
    return data
      .map(
        (d, i) =>
          `${i === 0 ? "M" : "L"} ${xScale(d.re).toFixed(2)} ${yScale(d.im).toFixed(2)}`,
      )
      .join(" ");
  }, [data, xScale, yScale]);

  // Mirror branch for ω < 0: G(−jω) = conj(G(jω)).
  const negPath = useMemo(() => {
    return data
      .map(
        (d, i) =>
          `${i === 0 ? "M" : "L"} ${xScale(d.re).toFixed(2)} ${yScale(-d.im).toFixed(2)}`,
      )
      .join(" ");
  }, [data, xScale, yScale]);

  // Critical point (−1, 0).
  const critX = xScale(-1);
  const critY = yScale(0);

  // Arrow-head helpers. Place a small triangle at the midpoint of each
  // branch, oriented along the tangent, to show the direction of
  // increasing |ω|.
  const arrowAt = (
    points: ReadonlyArray<{ re: number; im: number }>,
    flipIm: boolean,
  ): { x: number; y: number; path: string } => {
    const mid = Math.floor(points.length / 2);
    const a = points[mid - 1];
    const b = points[mid + 1];
    const ax = xScale(a.re);
    const ay = yScale(flipIm ? -a.im : a.im);
    const bx = xScale(b.re);
    const by = yScale(flipIm ? -b.im : b.im);
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const tipX = xScale(points[mid].re);
    const tipY = yScale(flipIm ? -points[mid].im : points[mid].im);
    const size = 6;
    const p1x = tipX - ux * size + -uy * size * 0.5;
    const p1y = tipY - uy * size + ux * size * 0.5;
    const p2x = tipX - ux * size - -uy * size * 0.5;
    const p2y = tipY - uy * size - ux * size * 0.5;
    return {
      x: tipX,
      y: tipY,
      path: `M ${tipX.toFixed(2)} ${tipY.toFixed(2)} L ${p1x.toFixed(2)} ${p1y.toFixed(2)} L ${p2x.toFixed(2)} ${p2y.toFixed(2)} Z`,
    };
  };

  const posArrow = arrowAt(data, false);
  const negArrow = arrowAt(data, true);

  // Infinity-detour connector: the semi-circular arc at |ω| → ∞ that
  // closes the Nyquist contour. Because G → 0 as ω → ±∞, the two
  // branches meet at the origin — represented by a small gap that we
  // close with an indicative hairline loop around (0, 0).
  const originX = xScale(0);
  const originY = yScale(0);

  // Small ω → 0 "infinite semicircle" indicator: for a Type-1 system with
  // a pole at the origin, the Nyquist contour includes a small right-half
  // detour around that pole, which G maps to an enormous semicircle at
  // infinity. We can only gesture at it — draw two arrowheads on the
  // bottom/top edges of the viewport at x ≈ −2.5 (the asymptote Re(G) →
  // −K·(1/p1 + 1/p2) as ω → 0) with a faint dashed arc linking them.
  const asymRe = -K * (1 / P1 + 1 / P2); // = −2.5
  const asymX = xScale(asymRe);

  const ticksX = [-3, -2, -1, 0, 1];
  const ticksY = [-3, -2, -1, 0, 1, 2, 3];

  return (
    <svg width={width} height={height} role="img" aria-label="Nyquist Plot">
      <Group left={plotLeft} top={margin.top}>
        {/* Gridlines — unit circle is a genuinely useful guide here. */}
        <g data-data-layer="true">
          {ticksX.map((t) => (
            <line
              key={`gx-${t}`}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray={t === 0 ? undefined : "2 3"}
            />
          ))}
          {ticksY.map((t) => (
            <line
              key={`gy-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray={t === 0 ? undefined : "2 3"}
            />
          ))}
          {/* Unit circle: |G| = 1 */}
          <circle
            cx={originX}
            cy={originY}
            r={xScale(1) - xScale(0)}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
        </g>

        {/* Asymptote indicator — the low-|ω| detour closing at ω = ±0. */}
        <g data-data-layer="true" opacity={0.55}>
          <line
            x1={asymX}
            x2={asymX}
            y1={0}
            y2={ih}
            stroke="var(--color-hairline)"
            strokeDasharray="1 3"
          />
          <text
            x={asymX - 4}
            y={12}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            ω → 0
          </text>
        </g>

        {/* ω > 0 branch */}
        <ExplainAnchor
          selector="positive-branch"
          index={1}
          pin={{ x: posArrow.x + 14, y: posArrow.y + 14 }}
          rect={{
            x: Math.min(posArrow.x - 12, iw - 2),
            y: Math.min(posArrow.y - 12, ih - 2),
            width: 24,
            height: 24,
          }}
        >
          <g data-data-layer="true">
            <path
              d={posPath}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d={posArrow.path} fill="var(--color-ink)" />
          </g>
        </ExplainAnchor>

        {/* ω < 0 mirror branch */}
        <ExplainAnchor
          selector="mirror-branch"
          index={2}
          pin={{ x: negArrow.x + 14, y: negArrow.y - 14 }}
          rect={{
            x: Math.min(negArrow.x - 12, iw - 2),
            y: Math.max(0, negArrow.y - 12),
            width: 24,
            height: 24,
          }}
        >
          <g data-data-layer="true">
            <path
              d={negPath}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.6}
              strokeDasharray="4 3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d={negArrow.path} fill="var(--color-ink)" />
          </g>
        </ExplainAnchor>

        {/* Critical point (−1, 0) */}
        <ExplainAnchor
          selector="critical-point"
          index={3}
          pin={{ x: critX + 16, y: critY - 16 }}
          rect={{
            x: critX - 10,
            y: critY - 10,
            width: 20,
            height: 20,
          }}
        >
          <g data-data-layer="true">
            <circle
              cx={critX}
              cy={critY}
              r={4.5}
              fill="var(--color-surface)"
              stroke="var(--color-ink)"
              strokeWidth={1.8}
            />
            <line
              x1={critX - 7}
              x2={critX + 7}
              y1={critY}
              y2={critY}
              stroke="var(--color-ink)"
              strokeWidth={1.2}
            />
            <line
              x1={critX}
              x2={critX}
              y1={critY - 7}
              y2={critY + 7}
              stroke="var(--color-ink)"
              strokeWidth={1.2}
            />
            <text
              x={critX + 8}
              y={critY + 14}
              fontFamily="var(--font-mono)"
              fontSize={10}
              fontWeight={600}
              fill="var(--color-ink)"
            >
              (−1, 0)
            </text>
          </g>
        </ExplainAnchor>

        {/* Unit circle — the |G| = 1 guide */}
        <ExplainAnchor
          selector="unit-circle"
          index={4}
          pin={{ x: xScale(0.8) + 6, y: yScale(0.8) - 6 }}
          rect={{
            x: xScale(0.7) - 2,
            y: yScale(0.7) - 2,
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Origin / spiral-in point — the ω → ±∞ limit */}
        <ExplainAnchor
          selector="origin"
          index={5}
          pin={{ x: originX + 16, y: originY + 16 }}
          rect={{
            x: originX - 8,
            y: originY - 8,
            width: 16,
            height: 16,
          }}
        >
          <g data-data-layer="true">
            <circle
              cx={originX}
              cy={originY}
              r={2.4}
              fill="var(--color-ink)"
            />
          </g>
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
            tickValues={ticksX}
            tickFormat={(v) => `${v}`}
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
            Re G(jω)
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={7}
          pin={{ x: -16, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            tickValues={ticksY}
            tickFormat={(v) => `${v}`}
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
            x={4}
            y={-6}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            Im G(jω)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
