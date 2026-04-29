"use client";

import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ΔG° vs T data (kJ/mol O₂)
// Each line defined by two points: T=300K and T=2300K
// Data sourced from standard thermodynamic tables (JANAF, Kubaschewski)
// All lines: 2M + O₂ → 2MO except Si + O₂ → SiO₂ and 2C + O₂ → 2CO

interface ReactionLine {
  id: string;
  label: string;
  color: string;
  // ΔG°(T) = a + b*T  (kJ/mol O₂)
  intercept: number; // a at T=0 (approx.)
  slope: number; // b (kJ/mol O₂ per K)
  dashed?: boolean;
}

// Standard Ellingham line parameters (linear approx): ΔG° = ΔH° - T·ΔS°
// Slopes are positive for metal oxides (entropy decreases for 2M + O₂ → 2MO)
// The 2C + O₂ → 2CO line has NEGATIVE slope (entropy increases: 1 mol O₂ gas → 2 mol CO gas)
const REACTIONS: ReactionLine[] = [
  { id: "ca",    label: "2Ca + O₂ → 2CaO",        color: "var(--color-ink)", intercept: -1270, slope: 0.205 },
  { id: "mg",    label: "2Mg + O₂ → 2MgO",         color: "var(--color-ink)", intercept: -1138, slope: 0.208 },
  { id: "al",    label: "4/3Al + O₂ → 2/3Al₂O₃",  color: "var(--color-ink)", intercept: -1046, slope: 0.210 },
  { id: "si",    label: "Si + O₂ → SiO₂",          color: "var(--color-ink)", intercept:  -856, slope: 0.172 },
  { id: "fe",    label: "2Fe + O₂ → 2FeO",         color: "var(--color-ink)", intercept:  -528, slope: 0.130 },
  { id: "cu",    label: "2Cu + O₂ → 2Cu₂O",        color: "var(--color-ink)", intercept:  -340, slope: 0.148 },
  // Carbon line: 2C + O₂ → 2CO — NEGATIVE slope, crosses Fe line near 1000 K
  { id: "c_co",  label: "2C + O₂ → 2CO",           color: "var(--color-ink)", intercept:  -222, slope: -0.178, dashed: true },
];

const T_MIN = 300;
const T_MAX = 2300;
const DG_MIN = -1400;
const DG_MAX = 100;

function getDG(rxn: ReactionLine, T: number) {
  return rxn.intercept + rxn.slope * T;
}

function makePoints(rxn: ReactionLine, numPts = 20): { T: number; dg: number }[] {
  const step = (T_MAX - T_MIN) / (numPts - 1);
  return Array.from({ length: numPts }, (_, i) => {
    const T = T_MIN + i * step;
    return { T, dg: getDG(rxn, T) };
  });
}

export function EllinghamDiagram({ width, height }: { width: number; height: number }) {
  const margin = { top: 24, right: 110, bottom: 48, left: 64 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [T_MIN, T_MAX], range: [0, iw] });
  const yScale = scaleLinear({ domain: [DG_MIN, DG_MAX], range: [ih, 0], nice: true });

  const ticksY = yScale.ticks(6);

  // Pre-compute crossing T between 2C+O₂→2CO and 2Fe+O₂→2FeO
  // Crossing: intercept_c + slope_c * T = intercept_fe + slope_fe * T
  const cLine = REACTIONS.find((r) => r.id === "c_co")!;
  const feLine = REACTIONS.find((r) => r.id === "fe")!;
  const crossT = (feLine.intercept - cLine.intercept) / (cLine.slope - feLine.slope);
  const crossDG = getDG(feLine, crossT);
  const crossX = xScale(crossT);
  const crossY = yScale(crossDG);

  return (
    <svg width={width} height={height} role="img" aria-label="Ellingham Diagram: ΔG° of oxide formation vs temperature">
      <Group left={margin.left} top={margin.top}>

        {/* Gridlines */}
        <g data-data-layer="true">
          {ticksY.map((t) => (
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
          {/* Zero-ΔG line */}
          {yScale(0) >= 0 && yScale(0) <= ih && (
            <line
              x1={0} x2={iw}
              y1={yScale(0)} y2={yScale(0)}
              stroke="var(--color-ink)"
              strokeOpacity={0.25}
              strokeWidth={1}
            />
          )}
        </g>

        {/* Data lines */}
        <ExplainAnchor
          selector="oxide-lines"
          index={1}
          pin={{ x: iw / 2, y: yScale(-800) - 14 }}
          rect={{ x: 0, y: 0, width: iw * 0.7, height: ih }}
        >
          <g data-data-layer="true">
            {REACTIONS.filter((r) => r.id !== "c_co").map((rxn) => {
              const pts = makePoints(rxn);
              return (
                <LinePath
                  key={rxn.id}
                  data={pts}
                  x={(d) => xScale(d.T)}
                  y={(d) => yScale(d.dg)}
                  stroke={rxn.color}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
          </g>
        </ExplainAnchor>

        {/* Carbon line (dashed, distinct) */}
        <ExplainAnchor
          selector="carbon-line"
          index={2}
          pin={{ x: xScale(800), y: yScale(getDG(cLine, 800)) - 14 }}
          rect={{ x: xScale(600), y: yScale(getDG(cLine, 600)) - 8, width: xScale(1100) - xScale(600), height: 16 }}
        >
          <g data-data-layer="true">
            <LinePath
              data={makePoints(cLine)}
              x={(d) => xScale(d.T)}
              y={(d) => yScale(d.dg)}
              stroke="var(--color-ink)"
              strokeWidth={2}
              strokeDasharray="6 3"
              strokeLinecap="round"
            />
          </g>
        </ExplainAnchor>

        {/* Crossing point annotation */}
        <ExplainAnchor
          selector="crossing-point"
          index={3}
          pin={{ x: crossX + 10, y: crossY - 16 }}
          rect={{ x: crossX - 10, y: crossY - 10, width: 20, height: 20 }}
        >
          <g data-data-layer="true">
            <circle cx={crossX} cy={crossY} r={5} fill="none" stroke="var(--color-ink)" strokeWidth={1.5} />
            <circle cx={crossX} cy={crossY} r={2} fill="var(--color-ink)" />
          </g>
        </ExplainAnchor>

        {/* Reaction line labels (right margin) */}
        <g data-data-layer="true">
          {REACTIONS.map((rxn) => {
            const endDG = getDG(rxn, T_MAX);
            const clampedDG = Math.min(DG_MAX - 10, Math.max(DG_MIN + 10, endDG));
            const labelY = yScale(clampedDG);
            const shortLabel =
              rxn.id === "ca" ? "Ca" :
              rxn.id === "mg" ? "Mg" :
              rxn.id === "al" ? "Al" :
              rxn.id === "si" ? "Si" :
              rxn.id === "fe" ? "Fe" :
              rxn.id === "cu" ? "Cu" :
              "C→CO";
            return (
              <text
                key={rxn.id}
                x={iw + 6}
                y={labelY}
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
                dominantBaseline="middle"
              >
                {shortLabel}
              </text>
            );
          })}
        </g>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 32 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
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
            y={ih + 40}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            TEMPERATURE (K)
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -44, y: ih / 2 }}
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
            x={0}
            y={-14}
            textAnchor="start"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            ΔG° (kJ/mol O₂)
          </text>
        </ExplainAnchor>

      </Group>
    </svg>
  );
}
