"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Fixed complex number: z = 3 + 4i, |z| = 5, arg(z) ≈ 53.13°
// Conjugate: z* = 3 - 4i
const Z_RE = 3;
const Z_IM = 4;
const Z_MOD = 5; // sqrt(3² + 4²) = 5 exactly
const Z_ARG_DEG = (Math.atan2(Z_IM, Z_RE) * 180) / Math.PI; // ≈ 53.13°

interface Props {
  width: number;
  height: number;
}

export function ArgandDiagram({ width, height }: Props) {
  const margin = { top: 28, right: 36, bottom: 48, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Domain: slightly beyond ±5 in both axes
  const xScale = scaleLinear({ domain: [-1.2, 5.8], range: [0, iw] });
  const yScale = scaleLinear({ domain: [-5.5, 5.5], range: [ih, 0] });

  const ox = xScale(0); // pixel x of origin
  const oy = yScale(0); // pixel y of origin

  // Pixel coords for z = 3 + 4i
  const zx = xScale(Z_RE);
  const zy = yScale(Z_IM);

  // Pixel coords for z* = 3 - 4i
  const zcx = xScale(Z_RE);
  const zcy = yScale(-Z_IM);

  // Dashed perpendicular foot on real axis: (3, 0)
  const footRealX = xScale(Z_RE);
  const footRealY = yScale(0);

  // Dashed perpendicular foot on imaginary axis: (0, 4)
  const footImagX = xScale(0);
  const footImagY = yScale(Z_IM);

  // Arc from positive real axis to z (for arg indicator)
  // We draw a circular arc of radius R around the origin
  const arcR = Math.min(iw, ih) * 0.18;
  const arcStartAngle = 0; // positive real axis
  const arcEndAngle = (Math.atan2(Z_IM, Z_RE)); // arg(z) in radians
  // SVG arc: start at (ox + arcR, oy), end at angle arcEndAngle
  const arcStartX = ox + arcR;
  const arcStartY = oy;
  const arcEndX = ox + arcR * Math.cos(arcEndAngle);
  const arcEndY = oy - arcR * Math.sin(arcEndAngle); // SVG y-flipped
  // Arc path (small arc, not large-arc)
  const arcPath = `M ${arcStartX} ${arcStartY} A ${arcR} ${arcR} 0 0 0 ${arcEndX} ${arcEndY}`;

  // Midpoint of arc for label placement
  const arcMidAngle = arcEndAngle / 2;
  const arcLabelX = ox + (arcR + 14) * Math.cos(arcMidAngle);
  const arcLabelY = oy - (arcR + 14) * Math.sin(arcMidAngle);

  // Arrow helper: draw a small filled arrowhead at (tipX, tipY) pointing in direction (dx, dy)
  function arrowPoly(
    tipX: number,
    tipY: number,
    dx: number,
    dy: number,
    size = 7
  ): string {
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const baseX = tipX - ux * size;
    const baseY = tipY - uy * size;
    const nx = -uy;
    const ny = ux;
    const half = size * 0.45;
    return `${tipX},${tipY} ${baseX + nx * half},${baseY + ny * half} ${baseX - nx * half},${baseY - ny * half}`;
  }

  // Vectors: from origin to z
  const dxZ = zx - ox;
  const dyZ = zy - oy;
  // From origin to z*
  const dxZc = zcx - ox;
  const dyZc = zcy - oy;

  // Shorten vectors slightly for arrowhead clearance
  const shorten = 8;
  const lenZ = Math.sqrt(dxZ * dxZ + dyZ * dyZ) || 1;
  const lenZc = Math.sqrt(dxZc * dxZc + dyZc * dyZc) || 1;
  const tipZx = zx - (dxZ / lenZ) * shorten;
  const tipZy = zy - (dyZ / lenZ) * shorten;
  const tipZcx = zcx - (dxZc / lenZc) * shorten;
  const tipZcy = zcy - (dyZc / lenZc) * shorten;

  // Mid-vector label for |z| = 5
  const modLabelX = ox + (zx - ox) * 0.5 - 10;
  const modLabelY = oy + (zy - oy) * 0.5 - 8;

  // Axis tick props
  const tickLabelProps = () => ({
    fontFamily: "var(--font-mono)" as const,
    fontSize: 10,
    fill: "var(--color-ink-soft)",
    textAnchor: "end" as const,
    dx: "-0.33em",
    dy: "0.33em",
  });
  const tickLabelPropsX = () => ({
    fontFamily: "var(--font-mono)" as const,
    fontSize: 10,
    fill: "var(--color-ink-soft)",
    textAnchor: "middle" as const,
    dy: "0.33em",
  });

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Argand diagram showing z = 3 + 4i and its complex conjugate z* = 3 − 4i"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Main data layer */}
        <g data-data-layer="true">
          {/* Dashed perpendiculars showing Cartesian decomposition */}
          {/* Vertical dashed: from z=(3,4) down to real axis at (3,0) */}
          <line
            x1={footRealX}
            y1={zy}
            x2={footRealX}
            y2={footRealY}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="3 3"
            opacity={0.5}
          />
          {/* Horizontal dashed: from z=(3,4) left to imag axis at (0,4) */}
          <line
            x1={zx}
            y1={footImagY}
            x2={footImagX}
            y2={footImagY}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="3 3"
            opacity={0.5}
          />
          {/* Dashed perpendiculars for z* (mirror) */}
          <line
            x1={footRealX}
            y1={zcy}
            x2={footRealX}
            y2={footRealY}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="3 3"
            opacity={0.3}
          />

          {/* Argument arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
            opacity={0.7}
          />
          {/* arg(z) label */}
          <text
            x={arcLabelX}
            y={arcLabelY}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            {Z_ARG_DEG.toFixed(1)}°
          </text>

          {/* Vector z = 3 + 4i (shaft) */}
          <line
            x1={ox}
            y1={oy}
            x2={tipZx}
            y2={tipZy}
            stroke="var(--color-ink)"
            strokeWidth={2}
          />
          {/* Arrowhead for z */}
          <polygon
            points={arrowPoly(zx, zy, dxZ, dyZ)}
            fill="var(--color-ink)"
          />

          {/* Vector z* = 3 − 4i (shaft) */}
          <line
            x1={ox}
            y1={oy}
            x2={tipZcx}
            y2={tipZcy}
            stroke="var(--color-ink)"
            strokeWidth={1.6}
            opacity={0.6}
          />
          {/* Arrowhead for z* */}
          <polygon
            points={arrowPoly(zcx, zcy, dxZc, dyZc)}
            fill="var(--color-ink)"
            opacity={0.6}
          />

          {/* |z| = 5 label on the vector */}
          <text
            x={modLabelX}
            y={modLabelY}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9.5}
            fill="var(--color-ink-soft)"
          >
            |z| = {Z_MOD}
          </text>

          {/* Point dots */}
          <circle cx={zx} cy={zy} r={3.5} fill="var(--color-ink)" />
          <circle cx={zcx} cy={zcy} r={3} fill="var(--color-ink)" opacity={0.6} />

          {/* z label */}
          <text
            x={zx + 6}
            y={zy - 6}
            fontFamily="var(--font-mono)"
            fontSize={11}
            fill="var(--color-ink)"
          >
            z = 3+4i
          </text>

          {/* z* label */}
          <text
            x={zcx + 6}
            y={zcy + 14}
            fontFamily="var(--font-mono)"
            fontSize={11}
            fill="var(--color-ink)"
            opacity={0.75}
          >
            z* = 3−4i
          </text>

          {/* Foot dots on axes */}
          <circle cx={footRealX} cy={footRealY} r={2.5} fill="var(--color-ink)" opacity={0.5} />
          <circle cx={footImagX} cy={footImagY} r={2.5} fill="var(--color-ink)" opacity={0.5} />
        </g>

        {/* Real axis (x-axis) */}
        <ExplainAnchor
          selector="real-axis"
          index={1}
          pin={{ x: iw * 0.65, y: oy + 28 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v) => String(v)}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={tickLabelPropsX}
          />
          <text
            x={iw}
            y={oy + 4}
            fontFamily="var(--font-mono)"
            fontSize={12}
            fill="var(--color-ink)"
            textAnchor="start"
          >
            ℜ
          </text>
          <text
            x={iw / 2}
            y={ih + 38}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            REAL AXIS
          </text>
        </ExplainAnchor>

        {/* Imaginary axis (y-axis) */}
        <ExplainAnchor
          selector="imaginary-axis"
          index={2}
          pin={{ x: -36, y: ih * 0.25 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={6}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={tickLabelProps}
          />
          <text
            x={ox - 4}
            y={6}
            fontFamily="var(--font-mono)"
            fontSize={12}
            fill="var(--color-ink)"
            textAnchor="end"
          >
            ℑ
          </text>
          <text
            x={-margin.left + 4}
            y={-14}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            IMAG AXIS
          </text>
        </ExplainAnchor>

        {/* Vector z */}
        <ExplainAnchor
          selector="vector-z"
          index={3}
          pin={{ x: ox + (zx - ox) * 0.5 + 12, y: oy + (zy - oy) * 0.5 + 12 }}
          rect={{
            x: Math.max(0, Math.min(ox, zx) - 6),
            y: Math.max(0, Math.min(oy, zy) - 6),
            width: Math.abs(zx - ox) + 12,
            height: Math.abs(zy - oy) + 12,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Magnitude |z| */}
        <ExplainAnchor
          selector="magnitude"
          index={4}
          pin={{ x: modLabelX - 16, y: modLabelY - 14 }}
          rect={{
            x: Math.max(0, modLabelX - 28),
            y: Math.max(0, modLabelY - 10),
            width: 56,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Argument arc */}
        <ExplainAnchor
          selector="argument-arc"
          index={5}
          pin={{ x: arcLabelX + 14, y: arcLabelY - 10 }}
          rect={{
            x: Math.max(0, ox),
            y: Math.max(0, oy - arcR - 4),
            width: arcR + 20,
            height: arcR + 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Complex conjugate z* */}
        <ExplainAnchor
          selector="conjugate"
          index={6}
          pin={{ x: zcx + 60, y: zcy + 6 }}
          rect={{
            x: Math.max(0, Math.min(ox, zcx) - 6),
            y: Math.max(0, Math.min(oy, zcy) - 6),
            width: Math.abs(zcx - ox) + 12,
            height: Math.abs(zcy - oy) + 12,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
