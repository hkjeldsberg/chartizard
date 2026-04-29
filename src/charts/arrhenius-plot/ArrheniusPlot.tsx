"use client";

import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// N₂O₅ decomposition kinetics (published values).
// A = 4.3×10¹³ s⁻¹, Ea = 103,000 J/mol, R = 8.314 J/(mol·K).
// k = A * exp(-Ea / (R * T))  =>  ln(k) = ln(A) - Ea/(R*T)
// Pre-computed so render is deterministic and dependency-free.

const R = 8.314;
const EA = 103000;
const LN_A = Math.log(4.3e13);

// Six measurement temperatures in Kelvin.
const TEMPS_K = [298, 318, 338, 358, 378, 398] as const;

interface DataPoint {
  invT: number; // 1/T in K⁻¹
  lnK: number;  // ln(k)
  T: number;    // temperature K, for labels
}

const DATA: ReadonlyArray<DataPoint> = TEMPS_K.map((T) => ({
  T,
  invT: 1 / T,
  lnK: LN_A - EA / (R * T),
}));

// Best-fit line: use the two endpoint invT values to draw across the full range.
// Slope = -Ea/R; intercept = ln(A). Computed analytically from the same params.
const invTMin = 1 / 420;  // slightly beyond 398 K
const invTMax = 1 / 280;  // slightly beyond 298 K
const fitLine: ReadonlyArray<{ invT: number; lnK: number }> = [
  { invT: invTMin, lnK: LN_A - EA / R * invTMin },
  { invT: invTMax, lnK: LN_A - EA / R * invTMax },
];

// Axis domain — pad slightly beyond the data.
const X_MIN = invTMin;
const X_MAX = invTMax;
const LN_K_MIN = LN_A - EA / R * invTMax - 2;
const LN_K_MAX = LN_A - EA / R * invTMin + 2;

interface Props {
  width: number;
  height: number;
}

export function ArrheniusPlot({ width, height }: Props) {
  const margin = { top: 24, right: 24, bottom: 52, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [X_MIN, X_MAX], range: [0, iw] });
  const yScale = scaleLinear({ domain: [LN_K_MIN, LN_K_MAX], range: [ih, 0] });

  // Representative data point for the anchor (midpoint, 338 K).
  const midPoint = DATA[2]; // 338 K
  const midX = xScale(midPoint.invT);
  const midY = yScale(midPoint.lnK);

  // Slope annotation position: midway along the fit line.
  const slopeAnnotX = xScale((X_MIN + X_MAX) / 2) - 10;
  const slopeAnnotY = yScale(LN_A - EA / R * ((X_MIN + X_MAX) / 2)) - 14;

  // Intercept annotation: near the left edge of the plot (low 1/T = high T).
  const interceptAnnotX = xScale(X_MIN) + 4;
  const interceptAnnotY = yScale(LN_A - EA / R * X_MIN) - 14;

  // Format 1/T tick labels: show value × 10³ for readability.
  const tickFormat = (v: number | { valueOf(): number }) => {
    const val = Number(v);
    return (val * 1000).toFixed(2);
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Arrhenius plot">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(6).map((t) => (
            <line
              key={t}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* Best-fit line */}
        <ExplainAnchor
          selector="fit-line"
          index={3}
          pin={{ x: slopeAnnotX, y: slopeAnnotY }}
          rect={{
            x: Math.max(0, xScale(X_MIN)),
            y: Math.max(0, Math.min(
              yScale(LN_A - EA / R * X_MIN),
              yScale(LN_A - EA / R * X_MAX)
            ) - 6),
            width: iw,
            height: Math.abs(
              yScale(LN_A - EA / R * X_MIN) - yScale(LN_A - EA / R * X_MAX)
            ) + 12,
          }}
        >
          <LinePath
            data={fitLine as { invT: number; lnK: number }[]}
            x={(d) => xScale(d.invT)}
            y={(d) => yScale(d.lnK)}
            stroke="var(--color-ink)"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeDasharray="5 3"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Data points */}
        <ExplainAnchor
          selector="data-point"
          index={6}
          pin={{ x: midX + 14, y: midY - 14 }}
          rect={{ x: Math.max(0, midX - 8), y: Math.max(0, midY - 8), width: 16, height: 16 }}
        >
          <g data-data-layer="true">
            {DATA.map((d) => (
              <circle
                key={d.T}
                cx={xScale(d.invT)}
                cy={yScale(d.lnK)}
                r={4}
                fill="var(--color-ink)"
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Slope annotation */}
        <g data-data-layer="true">
          <text
            x={slopeAnnotX - 2}
            y={slopeAnnotY + 2}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
            textAnchor="middle"
          >
            slope = −Ea/R
          </text>
          <text
            x={interceptAnnotX + 2}
            y={Math.max(14, interceptAnnotY)}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            Ea ≈ 103 kJ/mol
          </text>
        </g>

        {/* Slope anchor */}
        <ExplainAnchor
          selector="slope"
          index={4}
          pin={{ x: slopeAnnotX, y: Math.max(14, slopeAnnotY - 14) }}
          rect={{
            x: Math.max(0, slopeAnnotX - 30),
            y: Math.max(0, slopeAnnotY - 12),
            width: 60,
            height: 24,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Intercept (ln A) — anchor on the left edge where the fit line extrapolates to y-intercept */}
        <ExplainAnchor
          selector="intercept"
          index={5}
          pin={{ x: Math.min(iw - 14, interceptAnnotX + 60), y: Math.max(14, interceptAnnotY - 14) }}
          rect={{
            x: Math.max(0, interceptAnnotX),
            y: Math.max(0, interceptAnnotY - 12),
            width: Math.min(iw - interceptAnnotX, 90),
            height: 24,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={1}
          pin={{ x: iw / 2, y: ih + 40 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={tickFormat}
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
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            1/T × 10³ (K⁻¹)
          </text>
          <text
            x={iw / 2}
            y={ih + 47}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            (inverted temperature)
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={2}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={6}
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
            x={-margin.left + 4}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            ln(k)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
