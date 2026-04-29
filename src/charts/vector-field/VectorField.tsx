"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Point vortex centred at origin:
//   V(x, y) = (-y, x) / sqrt(x^2 + y^2 + 0.1)
// The +0.1 avoids the singularity at the origin and gives the field a
// slightly softened core that is still clearly circulatory.
const DOMAIN: [number, number] = [-5, 5];
const GRID_N = 12;

function field(x: number, y: number): [number, number] {
  const denom = Math.sqrt(x * x + y * y + 0.1);
  return [-y / denom, x / denom];
}

interface Props {
  width: number;
  height: number;
}

export function VectorField({ width, height }: Props) {
  const margin = { top: 20, right: 24, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: DOMAIN, range: [0, iw] });
  const yScale = scaleLinear({ domain: DOMAIN, range: [ih, 0] });

  const { arrows, maxMag } = useMemo(() => {
    const step = (DOMAIN[1] - DOMAIN[0]) / (GRID_N - 1);
    const list: Array<{
      x: number;
      y: number;
      dx: number;
      dy: number;
      mag: number;
    }> = [];
    let maxMag = 0;
    for (let i = 0; i < GRID_N; i++) {
      for (let j = 0; j < GRID_N; j++) {
        const x = DOMAIN[0] + i * step;
        const y = DOMAIN[0] + j * step;
        const [fx, fy] = field(x, y);
        const mag = Math.sqrt(fx * fx + fy * fy);
        if (mag > maxMag) maxMag = mag;
        list.push({ x, y, dx: fx, dy: fy, mag });
      }
    }
    return { arrows: list, maxMag };
  }, []);

  const px = (x: number) => xScale(x);
  const py = (y: number) => yScale(y);

  // Fixed visual arrow length in data units. Direction-only rendering —
  // we encode magnitude via stroke thickness so every arrow reads as a
  // direction indicator regardless of |V|.
  const ARROW_LEN = 0.7; // data units (domain span is 10)

  // Origin (vortex centre).
  const originX = px(0);
  const originY = py(0);

  // Representative arrow: pick one near (x=2, y=0) — tangent to the
  // y-axis, clearly pointing "up".
  const repIdx = (() => {
    let bestI = 0;
    let bestD = Infinity;
    arrows.forEach((a, i) => {
      const d = Math.abs(a.x - 2) + Math.abs(a.y - 0);
      if (d < bestD) {
        bestD = d;
        bestI = i;
      }
    });
    return bestI;
  })();
  const repArrow = arrows[repIdx];
  const repPx = { x: px(repArrow.x), y: py(repArrow.y) };

  // Representative edge arrow — far from origin, where |V| is largest.
  const edgeIdx = (() => {
    let bestI = 0;
    let bestD = Infinity;
    arrows.forEach((a, i) => {
      const d = Math.abs(a.x - 5) + Math.abs(a.y - 0);
      if (d < bestD) {
        bestD = d;
        bestI = i;
      }
    });
    return bestI;
  })();
  const edgeArrow = arrows[edgeIdx];
  const edgePx = { x: px(edgeArrow.x), y: py(edgeArrow.y) };

  // Near-centre arrow — short, because |V| ~ small near origin due to
  // the +0.1 softening. Choose an arrow at ~(0.9, 0).
  const nearIdx = (() => {
    let bestI = 0;
    let bestD = Infinity;
    arrows.forEach((a, i) => {
      const d = Math.abs(a.x - 0.91) + Math.abs(a.y - 0);
      if (d < bestD) {
        bestD = d;
        bestI = i;
      }
    });
    return bestI;
  })();
  const nearArrow = arrows[nearIdx];
  const nearPx = { x: px(nearArrow.x), y: py(nearArrow.y) };

  // Thickness encodes magnitude.
  const strokeFor = (mag: number) => 0.5 + (mag / maxMag) * 1.2;
  const opacityFor = (mag: number) => 0.45 + (mag / maxMag) * 0.45;

  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Vector field / quiver plot of a point vortex"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Plot frame + faint grid */}
        <g data-data-layer="true">
          <rect
            x={0}
            y={0}
            width={iw}
            height={ih}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={0.75}
          />
          {xScale.ticks(5).map((t) => (
            <line
              key={`gx-${t}`}
              x1={px(t)}
              x2={px(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeWidth={0.4}
              strokeDasharray="2 4"
            />
          ))}
          {yScale.ticks(5).map((t) => (
            <line
              key={`gy-${t}`}
              x1={0}
              x2={iw}
              y1={py(t)}
              y2={py(t)}
              stroke="var(--color-hairline)"
              strokeWidth={0.4}
              strokeDasharray="2 4"
            />
          ))}
        </g>

        {/* Arrows */}
        <g data-data-layer="true">
          {arrows.map((a, i) => {
            const mag = a.mag || 1e-9;
            // Unit direction
            const ux = a.dx / mag;
            const uy = a.dy / mag;
            // Fixed visual length in data units
            const x0 = a.x - (ux * ARROW_LEN) / 2;
            const y0 = a.y - (uy * ARROW_LEN) / 2;
            const x1 = a.x + (ux * ARROW_LEN) / 2;
            const y1 = a.y + (uy * ARROW_LEN) / 2;

            const sx = px(x0);
            const sy = py(y0);
            const ex = px(x1);
            const ey = py(y1);

            // Arrowhead direction in pixel space.
            const vx = ex - sx;
            const vy = ey - sy;
            const plen = Math.sqrt(vx * vx + vy * vy) || 1;
            const pux = vx / plen;
            const puy = vy / plen;
            const headLen = 3.5;
            const headAngle = 0.45;
            const hx1 =
              ex - headLen * (pux * Math.cos(headAngle) - puy * Math.sin(headAngle));
            const hy1 =
              ey - headLen * (puy * Math.cos(headAngle) + pux * Math.sin(headAngle));
            const hx2 =
              ex - headLen * (pux * Math.cos(headAngle) + puy * Math.sin(headAngle));
            const hy2 =
              ey - headLen * (puy * Math.cos(headAngle) - pux * Math.sin(headAngle));

            return (
              <g key={`arrow-${i}`}>
                <line
                  x1={sx}
                  y1={sy}
                  x2={ex}
                  y2={ey}
                  stroke="var(--color-ink)"
                  strokeWidth={strokeFor(a.mag)}
                  strokeOpacity={opacityFor(a.mag)}
                  strokeLinecap="round"
                />
                <polygon
                  points={`${hx1},${hy1} ${ex},${ey} ${hx2},${hy2}`}
                  fill="var(--color-ink)"
                  fillOpacity={opacityFor(a.mag)}
                />
              </g>
            );
          })}
        </g>

        {/* Representative arrow anchor */}
        <ExplainAnchor
          selector="arrow"
          index={1}
          pin={{
            x: clamp(repPx.x + 20, 10, iw - 10),
            y: clamp(repPx.y - 16, 10, ih - 10),
          }}
          rect={{
            x: clamp(repPx.x - 14, 0, iw),
            y: clamp(repPx.y - 14, 0, ih),
            width: 28,
            height: 28,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Vortex centre */}
        <ExplainAnchor
          selector="vortex-centre"
          index={2}
          pin={{
            x: clamp(originX + 18, 10, iw - 10),
            y: clamp(originY - 18, 10, ih - 10),
          }}
          rect={{
            x: clamp(originX - 10, 0, iw),
            y: clamp(originY - 10, 0, ih),
            width: 20,
            height: 20,
          }}
        >
          <g data-data-layer="true">
            <line
              x1={originX - 5}
              x2={originX + 5}
              y1={originY}
              y2={originY}
              stroke="var(--color-ink)"
              strokeWidth={1.4}
            />
            <line
              x1={originX}
              x2={originX}
              y1={originY - 5}
              y2={originY + 5}
              stroke="var(--color-ink)"
              strokeWidth={1.4}
            />
            <text
              x={originX + 7}
              y={originY + 12}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink)"
            >
              VORTEX
            </text>
          </g>
        </ExplainAnchor>

        {/* Near-centre arrow concept */}
        <ExplainAnchor
          selector="near-centre"
          index={3}
          pin={{
            x: clamp(nearPx.x - 22, 10, iw - 10),
            y: clamp(nearPx.y + 22, 10, ih - 10),
          }}
          rect={{
            x: clamp(nearPx.x - 12, 0, iw),
            y: clamp(nearPx.y - 12, 0, ih),
            width: 24,
            height: 24,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Far-from-centre arrow — large magnitude */}
        <ExplainAnchor
          selector="far-edge"
          index={4}
          pin={{
            x: clamp(edgePx.x - 22, 10, iw - 10),
            y: clamp(edgePx.y - 18, 10, ih - 10),
          }}
          rect={{
            x: clamp(edgePx.x - 14, 0, iw),
            y: clamp(edgePx.y - 14, 0, ih),
            width: 28,
            height: 28,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Tangent-to-circle concept — the whole field reads as circular flow */}
        <ExplainAnchor
          selector="tangent-signature"
          index={5}
          pin={{
            x: clamp(px(-3.3), 10, iw - 10),
            y: clamp(py(3.3), 10, ih - 10),
          }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
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
            numTicks={5}
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
            X
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={7}
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
              fontSize: 10,
              fill: "var(--color-ink-soft)",
              textAnchor: "end",
              dx: "-0.33em",
              dy: "0.33em",
            })}
          />
          <text
            x={-44}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            Y
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
