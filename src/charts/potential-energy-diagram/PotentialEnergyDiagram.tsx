"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { LinePath } from "@visx/shape";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// -------------------------------------------------------------------------
// Hand-tabulated reaction-coordinate curves.
//
// x = reaction coordinate (0..1, dimensionless)
// y = potential energy (kJ/mol)
//
// Uncatalysed pathway:
//   - Reactants plateau at 0 kJ/mol: x ∈ [0, 0.15]
//   - Rising to transition state peak at y = 100 kJ/mol, x = 0.45
//   - Falling to products plateau at y = −80 kJ/mol: x ∈ [0.75, 1.0]
//
// Catalysed pathway (same endpoints, lower peak):
//   - Peak at y = 60 kJ/mol, x = 0.45
// -------------------------------------------------------------------------

interface Pt {
  x: number;
  y: number;
}

// Uncatalysed control points (hand-tabulated for curveBasis / curveMonotoneX).
const UNCATALYSED: Pt[] = [
  { x: 0.00, y: 0 },
  { x: 0.05, y: 0 },
  { x: 0.15, y: 0 },
  { x: 0.25, y: 20 },
  { x: 0.35, y: 65 },
  { x: 0.45, y: 100 }, // transition state peak
  { x: 0.55, y: 55 },
  { x: 0.65, y: 10 },
  { x: 0.75, y: -80 },
  { x: 0.85, y: -80 },
  { x: 1.00, y: -80 },
];

// Catalysed pathway — same reactant and product plateaus, lower TS peak.
const CATALYSED: Pt[] = [
  { x: 0.00, y: 0 },
  { x: 0.05, y: 0 },
  { x: 0.15, y: 0 },
  { x: 0.25, y: 10 },
  { x: 0.35, y: 38 },
  { x: 0.45, y: 60 }, // catalysed TS peak
  { x: 0.55, y: 28 },
  { x: 0.65, y: -10 },
  { x: 0.75, y: -80 },
  { x: 0.85, y: -80 },
  { x: 1.00, y: -80 },
];

export function PotentialEnergyDiagram({ width, height }: Props) {
  const margin = { top: 20, right: 28, bottom: 48, left: 62 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 1], range: [0, iw] });
  const yScale = scaleLinear({ domain: [-120, 140], range: [ih, 0] });

  // Key pixel positions
  const reactantsX = xScale(0.08);
  const reactantsY = yScale(0);
  const tsX = xScale(0.45);
  const tsY = yScale(100);
  const caTsY = yScale(60);
  const productsX = xScale(0.88);
  const productsY = yScale(-80);

  // Annotation arrows: Ea — from reactants level up to TS peak (right of TS)
  const eaArrowX = tsX + 16;
  // ΔH — from reactants level down to products level (right of products)
  const dhArrowX = productsX + 16;

  // Arrowhead helper (pointing direction dy: +1 = down, -1 = up)
  function arrowHead(x: number, y: number, dir: 1 | -1, size = 4.5): string {
    const tip = y;
    const base = y - dir * size;
    return `${x},${tip} ${x - size * 0.55},${base} ${x + size * 0.55},${base}`;
  }

  return (
    <svg width={width} height={height} role="img" aria-label="Potential energy diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {[-80, 0, 60, 100].map((v) => (
            <line
              key={v}
              x1={0}
              x2={iw}
              y1={yScale(v)}
              y2={yScale(v)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 4"
            />
          ))}
        </g>

        {/* Catalysed pathway (dashed, rendered first so uncatalysed sits on top) */}
        <g data-data-layer="true">
          <LinePath
            data={CATALYSED}
            x={(d) => xScale(d.x)}
            y={(d) => yScale(d.y)}
            stroke="var(--color-ink)"
            strokeWidth={1.6}
            strokeDasharray="5 3"
            strokeOpacity={0.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            curve={curveMonotoneX}
          />
          {/* Catalysed TS label */}
          <text
            x={tsX - 4}
            y={caTsY - 7}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink)"
            opacity={0.65}
          >
            TS‡ (cat.)
          </text>
          <text
            x={tsX - 4}
            y={caTsY + 4}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink)"
            opacity={0.55}
          >
            60 kJ/mol
          </text>
        </g>

        {/* Uncatalysed pathway (solid) */}
        <g data-data-layer="true">
          <LinePath
            data={UNCATALYSED}
            x={(d) => xScale(d.x)}
            y={(d) => yScale(d.y)}
            stroke="var(--color-ink)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            curve={curveMonotoneX}
          />
        </g>

        {/* Reactants plateau label */}
        <g data-data-layer="true">
          <text
            x={reactantsX}
            y={reactantsY - 8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink)"
          >
            R: A + B
          </text>
          <text
            x={reactantsX}
            y={reactantsY - 18}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink)"
            opacity={0.65}
          >
            0 kJ/mol
          </text>
        </g>

        {/* Transition state label */}
        <g data-data-layer="true">
          <text
            x={tsX}
            y={tsY - 9}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            TS‡
          </text>
          <text
            x={tsX}
            y={tsY - 20}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink)"
            opacity={0.7}
          >
            100 kJ/mol
          </text>
        </g>

        {/* Products plateau label */}
        <g data-data-layer="true">
          <text
            x={productsX}
            y={productsY - 8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink)"
          >
            P: C + D
          </text>
          <text
            x={productsX}
            y={productsY - 18}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink)"
            opacity={0.65}
          >
            −80 kJ/mol
          </text>
        </g>

        {/* Eₐ annotation arrow — from reactants level up to TS peak */}
        <g data-data-layer="true">
          {/* Vertical bracket line */}
          <line
            x1={eaArrowX}
            x2={eaArrowX}
            y1={reactantsY}
            y2={tsY}
            stroke="var(--color-ink)"
            strokeWidth={1.2}
            opacity={0.8}
          />
          {/* Arrow at top (pointing up) */}
          <polygon
            points={arrowHead(eaArrowX, tsY, -1)}
            fill="var(--color-ink)"
            opacity={0.8}
          />
          {/* Arrow at bottom (pointing down) */}
          <polygon
            points={arrowHead(eaArrowX, reactantsY, 1)}
            fill="var(--color-ink)"
            opacity={0.8}
          />
          <text
            x={eaArrowX + 5}
            y={(reactantsY + tsY) / 2}
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink)"
            opacity={0.85}
          >
            Eₐ = 100
          </text>
        </g>

        {/* ΔH annotation arrow — from reactants level down to products level */}
        <g data-data-layer="true">
          <line
            x1={dhArrowX}
            x2={dhArrowX}
            y1={reactantsY}
            y2={productsY}
            stroke="var(--color-ink)"
            strokeWidth={1.2}
            opacity={0.8}
            strokeDasharray="3 2"
          />
          <polygon
            points={arrowHead(dhArrowX, productsY, 1)}
            fill="var(--color-ink)"
            opacity={0.8}
          />
          <polygon
            points={arrowHead(dhArrowX, reactantsY, -1)}
            fill="var(--color-ink)"
            opacity={0.8}
          />
          <text
            x={Math.min(iw - 4, dhArrowX + 5)}
            y={(reactantsY + productsY) / 2}
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink)"
            opacity={0.85}
            textAnchor="start"
          >
            ΔH = −80
          </text>
        </g>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={1}
          pin={{ x: iw / 2, y: ih + 36 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={0}
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
            y={ih + 24}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            REACTION COORDINATE →
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={2}
          pin={{ x: -42, y: ih / 2 }}
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
            x={-margin.left + 2}
            y={-6}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            PE (kJ/mol)
          </text>
        </ExplainAnchor>

        {/* 3. Reactants plateau */}
        <ExplainAnchor
          selector="reactants-plateau"
          index={3}
          pin={{ x: reactantsX - 18, y: reactantsY - 14 }}
          rect={{
            x: Math.max(0, xScale(0) - 2),
            y: Math.max(0, reactantsY - 6),
            width: Math.min(iw, xScale(0.2)),
            height: 12,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Transition state peak */}
        <ExplainAnchor
          selector="transition-state"
          index={4}
          pin={{ x: tsX + 16, y: tsY - 4 }}
          rect={{
            x: Math.max(0, tsX - 14),
            y: Math.max(0, tsY - 8),
            width: 28,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Products plateau */}
        <ExplainAnchor
          selector="products-plateau"
          index={5}
          pin={{ x: productsX - 18, y: productsY + 14 }}
          rect={{
            x: Math.max(0, Math.min(iw - xScale(0.25), xScale(0.74))),
            y: Math.max(0, productsY - 6),
            width: Math.min(iw, xScale(0.26)),
            height: 12,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Eₐ activation energy arrow */}
        <ExplainAnchor
          selector="activation-energy"
          index={6}
          pin={{ x: Math.min(iw - 8, eaArrowX + 50), y: (reactantsY + tsY) / 2 }}
          rect={{
            x: Math.max(0, eaArrowX - 4),
            y: Math.max(0, tsY),
            width: 8,
            height: reactantsY - tsY,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Catalysed pathway (dashed curve) */}
        <ExplainAnchor
          selector="catalysed-pathway"
          index={7}
          pin={{ x: tsX - 28, y: (caTsY + tsY) / 2 }}
          rect={{
            x: Math.max(0, tsX - 18),
            y: Math.max(0, caTsY - 6),
            width: 36,
            height: tsY - caTsY + 12,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
