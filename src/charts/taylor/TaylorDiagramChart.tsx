"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Six CMIP-style climate-model simulations compared against an observational
// reference. correlation is Pearson's r between the model's annual field and
// the observations; stddev is the model's normalised standard deviation
// (1.0 = matches the variability of the reference). Hand-picked so the plot
// shows a clear best performer (M1) and a clear outlier (M6).
const MODELS: ReadonlyArray<{
  name: string;
  correlation: number;
  stddev: number;
}> = [
  { name: "M1", correlation: 0.95, stddev: 1.02 }, // best
  { name: "M2", correlation: 0.92, stddev: 1.10 },
  { name: "M3", correlation: 0.88, stddev: 0.88 },
  { name: "M4", correlation: 0.85, stddev: 1.18 },
  { name: "M5", correlation: 0.80, stddev: 0.82 },
  { name: "M6", correlation: 0.72, stddev: 1.25 }, // poor performer
];

// Reference point: correlation = 1, stddev = 1 (sits on the x-axis).
const REF_STDDEV = 1.0;

// Chart radial domain: 0 to R_MAX in stddev units.
const R_MAX = 1.5;

// Stddev arc labels
const STDDEV_ARCS = [0.5, 1.0, 1.5];

// Correlation ray labels — angular axis ticks. In polar form, angle = acos(r).
const CORR_TICKS = [0.0, 0.5, 0.7, 0.9, 0.95, 0.99];

// RMS error arcs — drawn as concentric arcs around the reference point.
const RMS_ARCS = [0.25, 0.5, 0.75];

interface Props {
  width: number;
  height: number;
}

export function TaylorDiagramChart({ width, height }: Props) {
  // Quarter-circle plot — origin sits at bottom-left; east = correlation=1,
  // north = correlation=0. Reserve extra bottom/left margin for axis labels.
  const margin = { top: 22, right: 32, bottom: 44, left: 48 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Screen radius for the quarter-circle — use the smaller plot dimension
  // so the arc fits even in skinny tiles.
  const R = Math.max(0, Math.min(iw, ih));
  // Origin in Group-local coords — bottom-left of the quarter circle.
  const ox = 0;
  const oy = R;

  // Scale from stddev value to screen radius.
  const stddevToR = (s: number) => (s / R_MAX) * R;

  // Convert polar (correlation, stddev) → screen (x, y).
  // angle measured from positive x-axis, going counter-clockwise.
  const toXY = (correlation: number, stddev: number) => {
    const angle = Math.acos(correlation);
    const r = stddevToR(stddev);
    return {
      x: ox + r * Math.cos(angle),
      y: oy - r * Math.sin(angle),
    };
  };

  // Arc (quarter-circle segment) from angle 0 → π/2, radius r in screen units,
  // centred at (cxs, cys).
  const quarterArcPath = (cxs: number, cys: number, r: number) => {
    const x0 = cxs + r;
    const y0 = cys;
    const x1 = cxs;
    const y1 = cys - r;
    return `M ${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1}`;
  };

  // RMS arc around the reference point, clipped to the quarter-disc of the
  // main plot. We compute explicit endpoints where the rms-circle intersects
  // either the x-axis, the y-axis, or the outer R_MAX arc. Fallback: if the
  // rms circle sits entirely inside the quarter disc, draw a full circle.
  const refXY = toXY(1, REF_STDDEV);
  const rmsArcPath = (rms: number) => {
    // rms is in stddev units; convert to screen units.
    const rScreen = stddevToR(rms);
    // Parametric circle around refXY, sweep over angles in [0, 2π].
    // Find the first and last angle where the circle lies within the
    // quarter-disc (x>=ox, y<=oy, and dist-to-origin <= R).
    const samples = 64;
    const pts: Array<{ x: number; y: number; theta: number }> = [];
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * 2 * Math.PI;
      const x = refXY.x + rScreen * Math.cos(t);
      const y = refXY.y - rScreen * Math.sin(t);
      pts.push({ x, y, theta: t });
    }
    const inside = pts.map(
      (p) =>
        p.x >= ox - 0.5 &&
        p.y <= oy + 0.5 &&
        Math.hypot(p.x - ox, p.y - oy) <= R + 0.5,
    );
    // Build polyline over contiguous inside segments.
    const segments: Array<Array<{ x: number; y: number }>> = [];
    let current: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < pts.length; i++) {
      if (inside[i]) {
        current.push({ x: pts[i].x, y: pts[i].y });
      } else if (current.length > 0) {
        segments.push(current);
        current = [];
      }
    }
    if (current.length > 0) segments.push(current);
    return segments
      .map(
        (seg) =>
          "M " +
          seg
            .map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
            .join(" L "),
      )
      .join(" ");
  };

  // Anchor targets ---------------------------------------------------------
  const best = MODELS[0]; // M1, closest to reference
  const bestXY = toXY(best.correlation, best.stddev);
  const worst = MODELS[MODELS.length - 1]; // M6, farthest
  const worstXY = toXY(worst.correlation, worst.stddev);

  const stddevArcAnchorR = stddevToR(1.0);
  const stddevArcMidAngle = Math.PI / 4; // 45°, for pin placement
  const stddevArcPinX = ox + stddevArcAnchorR * Math.cos(stddevArcMidAngle);
  const stddevArcPinY = oy - stddevArcAnchorR * Math.sin(stddevArcMidAngle);

  const corrRayAngle = Math.acos(0.9);
  const corrRayPinX = ox + R * Math.cos(corrRayAngle);
  const corrRayPinY = oy - R * Math.sin(corrRayAngle);

  // RMS arc anchor — the 0.5 arc, pick a point roughly on it.
  const rmsAnchorAngle = (3 * Math.PI) / 4;
  const rmsAnchorX = refXY.x + stddevToR(0.5) * Math.cos(rmsAnchorAngle);
  const rmsAnchorY = refXY.y - stddevToR(0.5) * Math.sin(rmsAnchorAngle);

  return (
    <svg width={width} height={height} role="img" aria-label="Taylor diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Stddev (concentric quarter-circles from origin) */}
        <g data-data-layer="true">
          {STDDEV_ARCS.map((s) => (
            <path
              key={`std-${s}`}
              d={quarterArcPath(ox, oy, stddevToR(s))}
              fill="none"
              stroke={
                s === REF_STDDEV ? "var(--color-ink-mute)" : "var(--color-hairline)"
              }
              strokeWidth={s === REF_STDDEV ? 1 : 0.75}
              strokeDasharray={s === REF_STDDEV ? "3 3" : undefined}
            />
          ))}
          {/* Radial axis line along the x-axis (correlation = 1) */}
          <line
            x1={ox}
            y1={oy}
            x2={ox + R}
            y2={oy}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          {/* Radial axis line along the y-axis (correlation = 0) */}
          <line
            x1={ox}
            y1={oy}
            x2={ox}
            y2={oy - R}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
        </g>

        {/* Correlation rays + labels */}
        <g data-data-layer="true">
          {CORR_TICKS.map((c) => {
            const angle = Math.acos(c);
            const tickOuter = R;
            const tickInner = R - 6;
            const x1 = ox + tickInner * Math.cos(angle);
            const y1 = oy - tickInner * Math.sin(angle);
            const x2 = ox + tickOuter * Math.cos(angle);
            const y2 = oy - tickOuter * Math.sin(angle);
            const lx = ox + (R + 12) * Math.cos(angle);
            const ly = oy - (R + 12) * Math.sin(angle);
            return (
              <g key={`corr-${c}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="var(--color-ink-mute)"
                  strokeWidth={0.75}
                />
                <text
                  x={lx}
                  y={ly}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                  textAnchor={c < 0.1 ? "middle" : c > 0.98 ? "start" : "middle"}
                  dominantBaseline={c > 0.98 ? "central" : "alphabetic"}
                >
                  {c}
                </text>
              </g>
            );
          })}
          {/* Outer quarter-circle (correlation rays live on this) */}
          <path
            d={quarterArcPath(ox, oy, R)}
            fill="none"
            stroke="var(--color-ink-mute)"
            strokeWidth={0.75}
          />
        </g>

        {/* RMS error arcs (centred on the reference point) */}
        <g data-data-layer="true">
          {RMS_ARCS.map((rms) => (
            <path
              key={`rms-${rms}`}
              d={rmsArcPath(rms)}
              fill="none"
              stroke="var(--color-hairline)"
              strokeWidth={0.75}
              strokeDasharray="1 3"
            />
          ))}
        </g>

        {/* Stddev axis labels — along the x-axis */}
        <g data-data-layer="true">
          {STDDEV_ARCS.map((s) => (
            <text
              key={`slbl-${s}`}
              x={ox + stddevToR(s)}
              y={oy + 14}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              {s.toFixed(1)}
            </text>
          ))}
          <text
            x={ox + R / 2}
            y={oy + 30}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            STDDEV (norm.)
          </text>
          <text
            x={ox + R * 0.75}
            y={oy - R * 0.75 - 8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
            transform={`rotate(-45, ${ox + R * 0.75}, ${oy - R * 0.75 - 8})`}
          >
            CORRELATION
          </text>
        </g>

        {/* Model dots */}
        <g data-data-layer="true">
          {MODELS.map((m) => {
            const p = toXY(m.correlation, m.stddev);
            return (
              <g key={m.name}>
                <circle cx={p.x} cy={p.y} r={3.2} fill="var(--color-ink)" />
                <text
                  x={p.x + 6}
                  y={p.y - 6}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {m.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* Reference point — filled square at (1.0, 0°) */}
        <ExplainAnchor
          selector="reference-point"
          index={1}
          pin={{ x: refXY.x - 14, y: refXY.y - 16 }}
          rect={{ x: refXY.x - 8, y: refXY.y - 8, width: 16, height: 16 }}
        >
          <g data-data-layer="true">
            <rect
              x={refXY.x - 4}
              y={refXY.y - 4}
              width={8}
              height={8}
              fill="var(--color-ink)"
            />
            <text
              x={refXY.x}
              y={refXY.y - 10}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              REF
            </text>
          </g>
        </ExplainAnchor>

        {/* 2. Correlation rays — the angular axis */}
        <ExplainAnchor
          selector="correlation-axis"
          index={2}
          pin={{ x: corrRayPinX + 8, y: corrRayPinY - 6 }}
          rect={{ x: 0, y: 0, width: R, height: R }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Stddev arcs — the radial axis */}
        <ExplainAnchor
          selector="stddev-arcs"
          index={3}
          pin={{ x: stddevArcPinX + 6, y: stddevArcPinY - 6 }}
          rect={{ x: 0, y: 0, width: R, height: R }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. RMS error arcs — concentric around the reference */}
        <ExplainAnchor
          selector="rms-arcs"
          index={4}
          pin={{ x: rmsAnchorX - 14, y: rmsAnchorY - 6 }}
          rect={{ x: 0, y: 0, width: R, height: R }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Best model (M1) */}
        <ExplainAnchor
          selector="best-model"
          index={5}
          pin={{ x: bestXY.x + 16, y: bestXY.y + 14 }}
          rect={{ x: bestXY.x - 8, y: bestXY.y - 8, width: 16, height: 16 }}
        >
          <circle
            cx={bestXY.x}
            cy={bestXY.y}
            r={6}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
        </ExplainAnchor>

        {/* 6. Poor-performing outlier (M6) */}
        <ExplainAnchor
          selector="outlier-model"
          index={6}
          pin={{ x: worstXY.x - 14, y: worstXY.y + 14 }}
          rect={{ x: worstXY.x - 8, y: worstXY.y - 8, width: 16, height: 16 }}
        >
          <circle
            cx={worstXY.x}
            cy={worstXY.y}
            r={6}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
            strokeDasharray="2 2"
          />
        </ExplainAnchor>

        {/* 7. Origin */}
        <ExplainAnchor
          selector="origin"
          index={7}
          pin={{ x: ox - 20, y: oy + 8 }}
          rect={{ x: Math.max(0, ox - 8), y: oy - 8, width: 16, height: 16 }}
        >
          <circle cx={ox} cy={oy} r={2.5} fill="var(--color-ink)" />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
