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

// Open-loop transfer function used throughout Chartizard's Nichols / Nyquist
// pair:
//   G(jω) = K / ( jω · (1 + jω/p1) · (1 + jω/p2) )
// with K = 10, p1 = 5, p2 = 20. Type-1 third-order — the minimum complexity
// that gives a finite gain margin (the phase actually crosses −180°).
const K = 10;
const P1 = 5;
const P2 = 20;

type FRPoint = { w: number; mag_dB: number; phase_deg: number };

function sampleG(): ReadonlyArray<FRPoint> {
  const N = 61;
  const wMin = 0.1;
  const wMax = 100;
  const out: FRPoint[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const w = wMin * Math.pow(wMax / wMin, t); // log-spaced
    const mag =
      K /
      (w *
        Math.sqrt(1 + (w / P1) * (w / P1)) *
        Math.sqrt(1 + (w / P2) * (w / P2)));
    const mag_dB = 20 * Math.log10(mag);
    const phase_rad =
      -Math.PI / 2 - Math.atan(w / P1) - Math.atan(w / P2);
    const phase_deg = (phase_rad * 180) / Math.PI;
    out.push({ w, mag_dB, phase_deg });
  }
  return out;
}

// Linear interpolation at target phase or magnitude to locate crossovers.
function interp(
  series: ReadonlyArray<FRPoint>,
  key: "phase_deg" | "mag_dB",
  target: number,
): { mag_dB: number; phase_deg: number; w: number } | null {
  for (let i = 1; i < series.length; i++) {
    const a = series[i - 1];
    const b = series[i];
    const va = a[key];
    const vb = b[key];
    if ((va - target) * (vb - target) <= 0 && va !== vb) {
      const t = (target - va) / (vb - va);
      return {
        mag_dB: a.mag_dB + t * (b.mag_dB - a.mag_dB),
        phase_deg: a.phase_deg + t * (b.phase_deg - a.phase_deg),
        w: a.w + t * (b.w - a.w),
      };
    }
  }
  return null;
}

export function NicholsPlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => sampleG(), []);

  // Phase (x) and magnitude (y) domains chosen to frame the critical point
  // (−180°, 0 dB) with the curve and a margin either side.
  const xScale = scaleLinear({ domain: [-270, 0], range: [0, iw] });
  const yScale = scaleLinear({ domain: [-50, 40], range: [ih, 0] });

  const pathD = useMemo(() => {
    return data
      .map(
        (d, i) =>
          `${i === 0 ? "M" : "L"} ${xScale(d.phase_deg).toFixed(2)} ${yScale(d.mag_dB).toFixed(2)}`,
      )
      .join(" ");
  }, [data, xScale, yScale]);

  // Critical point (−180°, 0 dB): where the Nyquist criterion lives.
  const critX = xScale(-180);
  const critY = yScale(0);

  // Crossover points on the curve.
  const phaseCross = useMemo(() => interp(data, "phase_deg", -180), [data]);
  const gainCross = useMemo(() => interp(data, "mag_dB", 0), [data]);

  // Gain-margin tick: vertical segment from (−180°, 0 dB) to (−180°, curve).
  const gmX = critX;
  const gmY1 = critY;
  const gmY2 = phaseCross ? yScale(phaseCross.mag_dB) : critY;
  const gmDB = phaseCross ? -phaseCross.mag_dB : null;

  // Phase-margin tick: horizontal segment from (−180°, 0 dB) to (curve, 0 dB).
  const pmY = critY;
  const pmX1 = critX;
  const pmX2 = gainCross ? xScale(gainCross.phase_deg) : critX;
  const pmDeg = gainCross ? 180 + gainCross.phase_deg : null;

  // M-circle (constant closed-loop magnitude) guide curves — plotted here as
  // contours in the open-loop (phase, magnitude-dB) plane. For a closed-loop
  // magnitude M (in dB), the contour is:
  //   |G/(1+G)| = M  ⇒  solve for |G| at each ∠G.
  //   Let r = |G|, φ = ∠G (radians). Then
  //     M² = r² / (1 + 2r·cos(φ) + r²)
  //   Solve the quadratic in r:
  //     r² (1 − M²) − 2 M² cos(φ) r − M² = 0
  //   Closed form:
  //     r = ( M² cos(φ) ± √( M⁴ cos²(φ) + M² (1 − M²) ) ) / (1 − M²)
  //   Use the positive root for M < 1, and the appropriate root for M > 1.
  const mCirclePath = (M_dB: number): string => {
    const M = Math.pow(10, M_dB / 20);
    const M2 = M * M;
    const pts: Array<[number, number]> = [];
    const N = 180;
    for (let i = 0; i <= N; i++) {
      const phi_deg = -359 + (i / N) * 358; // sweep most of the chart
      const phi = (phi_deg * Math.PI) / 180;
      const cosp = Math.cos(phi);
      let r: number | null = null;
      if (Math.abs(1 - M2) < 1e-9) {
        // M ≈ 1: line r = −1/(2 cos φ), valid where cos φ < 0.
        if (cosp < -1e-6) r = -1 / (2 * cosp);
      } else {
        const a = 1 - M2;
        const b = -2 * M2 * cosp;
        const c = -M2;
        const disc = b * b - 4 * a * c;
        if (disc >= 0) {
          const sq = Math.sqrt(disc);
          const r1 = (-b + sq) / (2 * a);
          const r2 = (-b - sq) / (2 * a);
          // Pick the physically sensible root (positive magnitude).
          r = Math.max(r1, r2);
          if (r <= 0) r = Math.min(r1, r2);
          if (r <= 0) r = null;
        }
      }
      if (r !== null && r > 0 && isFinite(r)) {
        const magDB = 20 * Math.log10(r);
        pts.push([phi_deg, magDB]);
      }
    }
    // Break into segments only where both points are on-chart.
    let d = "";
    let penUp = true;
    for (const [phi_deg, magDB] of pts) {
      if (
        phi_deg < -270 ||
        phi_deg > 0 ||
        magDB < -50 ||
        magDB > 40
      ) {
        penUp = true;
        continue;
      }
      const x = xScale(phi_deg).toFixed(2);
      const y = yScale(magDB).toFixed(2);
      d += `${penUp ? "M" : "L"} ${x} ${y} `;
      penUp = false;
    }
    return d;
  };

  const mCircle_m3dB = mCirclePath(-3);
  const mCircle_p3dB = mCirclePath(3);

  const ticksX = [-270, -225, -180, -135, -90, -45, 0];
  const ticksY = yScale.ticks(6);

  return (
    <svg width={width} height={height} role="img" aria-label="Nichols Plot">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
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
          {ticksX.map((t) => (
            <line
              key={`gx-${t}`}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray={t === -180 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* M-circle guides (faint constant closed-loop magnitude contours) */}
        <ExplainAnchor
          selector="m-circles"
          index={5}
          pin={{ x: xScale(-135) + 8, y: yScale(12) - 8 }}
          rect={{
            x: xScale(-225),
            y: yScale(25),
            width: xScale(-90) - xScale(-225),
            height: yScale(-10) - yScale(25),
          }}
        >
          <g data-data-layer="true" opacity={0.55}>
            <path
              d={mCircle_m3dB}
              fill="none"
              stroke="var(--color-hairline)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <path
              d={mCircle_p3dB}
              fill="none"
              stroke="var(--color-hairline)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <text
              x={xScale(-150)}
              y={yScale(10) - 2}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              +3 dB
            </text>
            <text
              x={xScale(-210)}
              y={yScale(-14) - 2}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              −3 dB
            </text>
          </g>
        </ExplainAnchor>

        {/* The open-loop frequency response curve */}
        <ExplainAnchor
          selector="open-loop-curve"
          index={1}
          pin={{ x: xScale(-135) - 14, y: yScale(2) - 14 }}
          rect={{
            x: xScale(-225),
            y: yScale(30),
            width: xScale(-45) - xScale(-225),
            height: yScale(-30) - yScale(30),
          }}
        >
          <g data-data-layer="true">
            <path
              d={pathD}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Tick marks at each sampled ω */}
            {data.map((d, i) =>
              i % 10 === 0 ? (
                <circle
                  key={`w-${i}`}
                  cx={xScale(d.phase_deg)}
                  cy={yScale(d.mag_dB)}
                  r={1.8}
                  fill="var(--color-ink)"
                />
              ) : null,
            )}
          </g>
        </ExplainAnchor>

        {/* Critical point (−180°, 0 dB) */}
        <ExplainAnchor
          selector="critical-point"
          index={2}
          pin={{ x: critX + 14, y: critY - 14 }}
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
              r={4}
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
          </g>
        </ExplainAnchor>

        {/* Gain-margin annotation */}
        <ExplainAnchor
          selector="gain-margin"
          index={3}
          pin={{ x: gmX - 18, y: (gmY1 + gmY2) / 2 }}
          rect={{
            x: gmX - 10,
            y: Math.min(gmY1, gmY2) - 2,
            width: 20,
            height: Math.abs(gmY2 - gmY1) + 4,
          }}
        >
          <g data-data-layer="true">
            <line
              x1={gmX}
              x2={gmX}
              y1={gmY1}
              y2={gmY2}
              stroke="var(--color-ink)"
              strokeWidth={1.4}
            />
            {/* Tiny end caps */}
            <line
              x1={gmX - 4}
              x2={gmX + 4}
              y1={gmY2}
              y2={gmY2}
              stroke="var(--color-ink)"
              strokeWidth={1.4}
            />
            {gmDB !== null && (
              <text
                x={gmX + 6}
                y={(gmY1 + gmY2) / 2 + 3}
                fontFamily="var(--font-mono)"
                fontSize={10}
                fontWeight={600}
                fill="var(--color-ink)"
              >
                GM ≈ {gmDB.toFixed(1)} dB
              </text>
            )}
          </g>
        </ExplainAnchor>

        {/* Phase-margin annotation */}
        <ExplainAnchor
          selector="phase-margin"
          index={4}
          pin={{ x: (pmX1 + pmX2) / 2, y: pmY + 18 }}
          rect={{
            x: Math.min(pmX1, pmX2) - 2,
            y: pmY - 10,
            width: Math.abs(pmX2 - pmX1) + 4,
            height: 20,
          }}
        >
          <g data-data-layer="true">
            <line
              x1={pmX1}
              x2={pmX2}
              y1={pmY}
              y2={pmY}
              stroke="var(--color-ink)"
              strokeWidth={1.4}
            />
            <line
              x1={pmX2}
              x2={pmX2}
              y1={pmY - 4}
              y2={pmY + 4}
              stroke="var(--color-ink)"
              strokeWidth={1.4}
            />
            {pmDeg !== null && (
              <text
                x={(pmX1 + pmX2) / 2}
                y={pmY - 6}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fontWeight={600}
                fill="var(--color-ink)"
              >
                PM ≈ {pmDeg.toFixed(0)}°
              </text>
            )}
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
            tickFormat={(v) => `${v}°`}
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
            OPEN-LOOP PHASE ∠G(jω)
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
            numTicks={6}
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
            x={-margin.left + 2}
            y={-6}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            |G| dB
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
