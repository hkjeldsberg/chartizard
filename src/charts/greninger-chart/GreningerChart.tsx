"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Greninger Chart: stereographic-projection chart for indexing Laue X-ray diffraction
// Polar grid — radial distance encodes 2θ (Bragg angle), azimuthal encodes azimuthal angle
// Miller-indexed spots for a cubic crystal near the (001) pole

// Maximum 2θ shown: 60° (back-reflection Laue typically 60°-160°; we show forward portion)
const MAX_2THETA = 60;

// Miller-indexed spots for a cubic crystal — (hkl) labels, 2θ (deg), φ (azimuthal, deg)
// Simplified: computed from cubic crystal geometry d = a/sqrt(h²+k²+l²), a=3.5Å, λ=1.54Å
// Using 2θ = 2 * arcsin(λ / 2d) and azimuthal angles typical for (001) zone axis
const SPOTS: { hkl: string; theta2: number; phi: number }[] = [
  { hkl: "001", theta2:  0,  phi:   0  }, // direct beam / centre
  { hkl: "100", theta2: 32,  phi:   0  },
  { hkl: "010", theta2: 32,  phi:  90  },
  { hkl: "110", theta2: 43,  phi:  45  },
  { hkl: "110", theta2: 43,  phi: 135  }, // -110
  { hkl: "200", theta2: 53,  phi:   0  },
  { hkl: "020", theta2: 53,  phi:  90  },
  { hkl: "210", theta2: 52,  phi:  27  },
  { hkl: "120", theta2: 52,  phi:  63  },
  { hkl: "210", theta2: 52,  phi: 207  }, // equivalent by symmetry — shown as 2̄10
  { hkl: "011", theta2: 43,  phi: 315  },
  { hkl: "101", theta2: 43,  phi: 225  },
  { hkl: "111", theta2: 54,  phi: 315  },
  { hkl: "111", theta2: 54,  phi:  45  }, // 1̄11
  { hkl: "112", theta2: 57,  phi:  26  },
];

function polarToXY(theta2: number, phi: number, radius: number) {
  // radial = theta2 / MAX_2THETA * radius, azimuthal = phi (0° = right, CCW)
  const r = (theta2 / MAX_2THETA) * radius;
  const rad = (phi * Math.PI) / 180;
  return { x: r * Math.cos(rad), y: -r * Math.sin(rad) };
}

export function GreningerChart({ width, height }: { width: number; height: number }) {
  const margin = { top: 20, right: 20, bottom: 44, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Chart is centred in available space; radius = min(iw, ih)/2 - a bit of padding
  const cx = iw / 2;
  const cy = ih / 2;
  const chartR = Math.min(iw, ih) / 2 - 8;

  // Radial rings at 10°, 20°, 30°, 40°, 50°, 60° 2θ
  const radialRings = [10, 20, 30, 40, 50, 60];

  // Azimuthal grid lines every 30°
  const azimuthalLines = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  // Scale for label positioning (not a visx transform, just arithmetic)
  const xScale = scaleLinear({ domain: [-MAX_2THETA, MAX_2THETA], range: [-chartR, chartR] });
  void xScale; // keep import used

  return (
    <svg width={width} height={height} role="img" aria-label="Greninger Chart: stereographic projection for Laue X-ray diffraction indexing">
      <Group left={margin.left} top={margin.top}>

        {/* Polar grid */}
        <ExplainAnchor
          selector="polar-grid"
          index={1}
          pin={{ x: cx + chartR + 10, y: cy }}
          rect={{ x: cx - chartR, y: cy - chartR, width: 2 * chartR, height: 2 * chartR }}
        >
          <g data-data-layer="true">
            {/* Radial rings */}
            {radialRings.map((deg) => {
              const r = (deg / MAX_2THETA) * chartR;
              return (
                <circle
                  key={`ring-${deg}`}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="var(--color-hairline)"
                  strokeWidth={0.8}
                />
              );
            })}
            {/* Azimuthal spokes */}
            {azimuthalLines.map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <line
                  key={`spoke-${deg}`}
                  x1={cx}
                  y1={cy}
                  x2={cx + chartR * Math.cos(rad)}
                  y2={cy - chartR * Math.sin(rad)}
                  stroke="var(--color-hairline)"
                  strokeWidth={0.8}
                />
              );
            })}
            {/* Outer boundary circle */}
            <circle cx={cx} cy={cy} r={chartR} fill="none" stroke="var(--color-ink)" strokeWidth={1} strokeOpacity={0.4} />
          </g>
        </ExplainAnchor>

        {/* 2θ ring labels */}
        <g>
          {[10, 20, 30, 40, 50].map((deg) => {
            const r = (deg / MAX_2THETA) * chartR;
            return (
              <text
                key={`rlabel-${deg}`}
                x={cx + r + 2}
                y={cy - 2}
                fontFamily="var(--font-mono)"
                fontSize={7}
                fill="var(--color-ink-mute)"
              >
                {deg}°
              </text>
            );
          })}
        </g>

        {/* Diffraction spots */}
        <ExplainAnchor
          selector="diffraction-spots"
          index={2}
          pin={{ x: cx + polarToXY(43, 45, chartR).x + 14, y: cy + polarToXY(43, 45, chartR).y }}
          rect={{
            x: cx - chartR * 0.65,
            y: cy - chartR * 0.65,
            width: chartR * 1.3,
            height: chartR * 1.3,
          }}
        >
          <g data-data-layer="true">
            {SPOTS.map((spot, i) => {
              const { x, y } = polarToXY(spot.theta2, spot.phi, chartR);
              const sx = cx + x;
              const sy = cy + y;
              const isCentre = spot.theta2 === 0;
              return (
                <g key={i}>
                  <circle
                    cx={sx}
                    cy={sy}
                    r={isCentre ? 4 : 3}
                    fill="var(--color-ink)"
                    fillOpacity={isCentre ? 1 : 0.8}
                  />
                </g>
              );
            })}
          </g>
        </ExplainAnchor>

        {/* Miller index labels on spots */}
        <ExplainAnchor
          selector="miller-labels"
          index={3}
          pin={{ x: cx + polarToXY(32, 0, chartR).x + 10, y: cy + polarToXY(32, 0, chartR).y - 10 }}
          rect={{
            x: cx + polarToXY(32, 0, chartR).x - 5,
            y: cy + polarToXY(32, 0, chartR).y - 14,
            width: 36,
            height: 14,
          }}
        >
          <g data-data-layer="true">
            {SPOTS.map((spot, i) => {
              const { x, y } = polarToXY(spot.theta2, spot.phi, chartR);
              const sx = cx + x;
              const sy = cy + y;
              // Only label selected spots to avoid clutter
              const labeled = ["001", "100", "110", "200", "111"].includes(spot.hkl) && i <= 8;
              if (!labeled) return null;
              const dx = x === 0 ? 0 : (x > 0 ? 6 : -6);
              const dy = y === 0 ? -8 : (y < 0 ? -6 : 8);
              return (
                <text
                  key={i}
                  x={sx + dx}
                  y={sy + dy}
                  fontFamily="var(--font-mono)"
                  fontSize={7}
                  fill="var(--color-ink-soft)"
                  textAnchor={x > 0 ? "start" : x < 0 ? "end" : "middle"}
                >
                  {spot.hkl}
                </text>
              );
            })}
          </g>
        </ExplainAnchor>

        {/* Zone axis label — (001) pole at centre */}
        <g data-data-layer="true">
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            [001]
          </text>
        </g>

        {/* Radial axis annotation */}
        <ExplainAnchor
          selector="radial-axis"
          index={4}
          pin={{ x: cx, y: cy - chartR - 12 }}
          rect={{ x: cx - 4, y: cy - chartR - 4, width: chartR * 0.7, height: chartR * 0.5 }}
        >
          <g>
            <text
              x={cx + chartR * 0.35}
              y={cy - chartR * 0.6}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
              transform={`rotate(-60, ${cx + chartR * 0.35}, ${cy - chartR * 0.6})`}
            >
              2θ →
            </text>
          </g>
        </ExplainAnchor>

        {/* Azimuthal angle annotation */}
        <ExplainAnchor
          selector="azimuthal-axis"
          index={5}
          pin={{ x: cx - chartR - 14, y: cy }}
          rect={{ x: cx - chartR - 4, y: cy - 4, width: chartR * 0.4, height: 8 }}
        >
          <g>
            <text
              x={cx - chartR * 0.5}
              y={cy}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              φ
            </text>
          </g>
        </ExplainAnchor>

        {/* Caption */}
        <text
          x={cx}
          y={ih + 36}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-mute)"
        >
          CUBIC CRYSTAL — BACK-REFLECTION LAUE
        </text>

      </Group>
    </svg>
  );
}
