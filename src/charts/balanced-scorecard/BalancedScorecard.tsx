"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Kaplan & Norton 1992 four-perspective framework — mock hospital example
const PERSPECTIVES = [
  {
    id: "financial",
    label: "Financial",
    position: "top",
    measures: [
      { name: "Cost per patient-day", target: "≤ $2,400" },
      { name: "Operating margin", target: "≥ 4.5%" },
      { name: "Revenue per FTE", target: "≥ $185K" },
    ],
  },
  {
    id: "customer",
    label: "Customer",
    position: "right",
    measures: [
      { name: "HCAHPS score", target: "≥ 85%" },
      { name: "30-day readmission rate", target: "≤ 8%" },
      { name: "Patient wait time (ED)", target: "≤ 42 min" },
    ],
  },
  {
    id: "process",
    label: "Internal Business Process",
    position: "bottom",
    measures: [
      { name: "OR turnover time", target: "≤ 28 min" },
      { name: "Medication error rate", target: "≤ 0.3/1K doses" },
      { name: "Hand hygiene compliance", target: "≥ 97%" },
    ],
  },
  {
    id: "learning",
    label: "Learning & Growth",
    position: "left",
    measures: [
      { name: "Staff board certification", target: "≥ 92%" },
      { name: "Training hours per FTE", target: "≥ 40 h/yr" },
      { name: "eNPS (employee NPS)", target: "≥ 25" },
    ],
  },
] as const;

const STRATEGY = "Deliver safe, coordinated\ncare at sustainable cost";

export function BalancedScorecardChart({ width, height }: { width: number; height: number }) {
  const margin = { top: 16, right: 16, bottom: 16, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Central strategy box
  const cx = iw / 2;
  const cy = ih / 2;
  const centreW = Math.min(iw * 0.28, 140);
  const centreH = Math.min(ih * 0.28, 80);

  // Quadrant dimensions — each quadrant occupies a rectangular region
  const quadPad = 10;
  const quadW = (iw - centreW) / 2 - quadPad * 2;
  const quadH = (ih - centreH) / 2 - quadPad * 2;

  // Quadrant positions: top, right, bottom, left
  const quadrant = {
    financial: {
      x: cx - centreW / 2 - quadPad - quadW,
      y: quadPad,
      w: iw - quadPad * 2,
      h: quadH,
    },
    customer: {
      x: cx + centreW / 2 + quadPad,
      y: cy - centreH / 2 - quadPad - quadH,
      w: quadW,
      h: ih - quadPad * 2,
    },
    process: {
      x: quadPad,
      y: cy + centreH / 2 + quadPad,
      w: iw - quadPad * 2,
      h: quadH,
    },
    learning: {
      x: quadPad,
      y: cy - centreH / 2 - quadPad - quadH,
      w: quadW,
      h: ih - quadPad * 2,
    },
  };

  const FONT = "var(--font-mono)";
  const INK = "var(--color-ink)";
  const INK_SOFT = "var(--color-ink-soft)";
  const INK_MUTE = "var(--color-ink-mute)";
  const HAIRLINE = "var(--color-hairline)";

  // Arrow endpoints for causal chain: Learning → Process → Customer → Financial
  // Simplified arrows from centre of each box to next, passing through the layout edges
  const arrowDefs = [
    // Learning (left) → Process (bottom): left box bottom-mid to process box left-mid
    {
      id: "lp",
      x1: quadrant.learning.x + quadrant.learning.w / 2,
      y1: cy + centreH / 2 + quadPad + quadH / 2,
      x2: cx - centreW / 2,
      y2: cy + centreH / 2 + quadPad + quadH / 2,
    },
    // Process (bottom) → Customer (right): process box top-right to customer box bottom-mid
    {
      id: "pc",
      x1: cx + centreW / 2 + quadPad + quadW / 2,
      y1: cy + centreH / 2 + quadPad,
      x2: cx + centreW / 2 + quadPad + quadW / 2,
      y2: cy - centreH / 2,
    },
    // Customer (right) → Financial (top): customer box top-mid to financial box right-mid
    {
      id: "cf",
      x1: cx + centreW / 2,
      y1: cy - centreH / 2 - quadPad - quadH / 2,
      x2: cx - centreW / 2 - quadPad,
      y2: cy - centreH / 2 - quadPad - quadH / 2,
    },
  ];

  function renderMeasures(
    measures: ReadonlyArray<{ name: string; target: string }>,
    boxX: number,
    boxY: number,
    boxW: number,
    boxH: number,
  ) {
    const lineH = Math.min(14, (boxH - 22) / measures.length);
    return measures.map((m, i) => {
      const my = boxY + 20 + i * lineH;
      return (
        <g key={m.name}>
          <circle cx={boxX + 10} cy={my - 2} r={2} fill={INK_SOFT} />
          <text x={boxX + 16} y={my} fontFamily={FONT} fontSize={8.5} fill={INK}>
            {m.name}
          </text>
          <text x={boxX + boxW - 4} y={my} fontFamily={FONT} fontSize={8} fill={INK_MUTE} textAnchor="end">
            {m.target}
          </text>
        </g>
      );
    });
  }

  function renderQuadrant(
    label: string,
    measures: ReadonlyArray<{ name: string; target: string }>,
    qx: number,
    qy: number,
    qw: number,
    qh: number,
  ) {
    return (
      <>
        <rect x={qx} y={qy} width={qw} height={qh} rx={4} fill="var(--color-ink)" fillOpacity={0.04} stroke={HAIRLINE} strokeWidth={1} />
        <text x={qx + qw / 2} y={qy + 12} fontFamily={FONT} fontSize={9.5} fontWeight="600" fill={INK} textAnchor="middle">
          {label}
        </text>
        <line x1={qx + 8} x2={qx + qw - 8} y1={qy + 15} y2={qy + 15} stroke={HAIRLINE} strokeWidth={0.5} />
        {renderMeasures(measures, qx + 4, qy + 6, qw - 8, qh)}
      </>
    );
  }

  // Arrow marker
  const arrowSize = 5;

  return (
    <svg width={width} height={height} role="img" aria-label="Balanced Scorecard — hospital strategy map (Kaplan & Norton 1992)">
      <defs>
        <marker id="bsc-arrow" markerWidth={arrowSize} markerHeight={arrowSize} refX={arrowSize - 1} refY={arrowSize / 2} orient="auto">
          <path d={`M 0 0 L ${arrowSize} ${arrowSize / 2} L 0 ${arrowSize} z`} fill={INK_MUTE} />
        </marker>
      </defs>
      <Group left={margin.left} top={margin.top}>

        {/* Causal arrows (behind quadrant boxes) */}
        <ExplainAnchor
          selector="causal-arrows"
          index={5}
          pin={{ x: cx + 8, y: cy + centreH / 2 + quadPad + quadH / 2 - 10 }}
          rect={{ x: cx - centreW / 2 - quadPad - quadW, y: cy - centreH / 2 - quadPad - quadH, width: iw, height: ih }}
        >
          <g data-data-layer="true">
            {arrowDefs.map((a) => (
              <line
                key={a.id}
                x1={a.x1}
                y1={a.y1}
                x2={a.x2}
                y2={a.y2}
                stroke={INK_MUTE}
                strokeWidth={1.2}
                strokeDasharray="3 2"
                markerEnd="url(#bsc-arrow)"
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Quadrant boxes */}
        <g data-data-layer="true">
          {/* Financial — top-spanning */}
          <ExplainAnchor
            selector="financial-perspective"
            index={1}
            pin={{ x: cx, y: quadrant.financial.y - 12 }}
            rect={{ x: quadrant.financial.x, y: quadrant.financial.y, width: quadrant.financial.w, height: quadrant.financial.h }}
          >
            {renderQuadrant(
              "Financial",
              PERSPECTIVES[0].measures,
              quadrant.financial.x,
              quadrant.financial.y,
              quadrant.financial.w,
              quadrant.financial.h,
            )}
          </ExplainAnchor>

          {/* Customer — right-spanning */}
          <ExplainAnchor
            selector="customer-perspective"
            index={2}
            pin={{ x: iw + 8, y: cy }}
            rect={{ x: quadrant.customer.x, y: quadrant.customer.y, width: quadrant.customer.w, height: quadrant.customer.h }}
          >
            {renderQuadrant(
              "Customer",
              PERSPECTIVES[1].measures,
              quadrant.customer.x,
              quadrant.customer.y,
              quadrant.customer.w,
              quadrant.customer.h,
            )}
          </ExplainAnchor>

          {/* Process — bottom-spanning */}
          <ExplainAnchor
            selector="process-perspective"
            index={3}
            pin={{ x: cx, y: ih + 8 }}
            rect={{ x: quadrant.process.x, y: quadrant.process.y, width: quadrant.process.w, height: quadrant.process.h }}
          >
            {renderQuadrant(
              "Internal Business Process",
              PERSPECTIVES[2].measures,
              quadrant.process.x,
              quadrant.process.y,
              quadrant.process.w,
              quadrant.process.h,
            )}
          </ExplainAnchor>

          {/* Learning — left-spanning */}
          <ExplainAnchor
            selector="learning-perspective"
            index={4}
            pin={{ x: -12, y: cy }}
            rect={{ x: quadrant.learning.x, y: quadrant.learning.y, width: quadrant.learning.w, height: quadrant.learning.h }}
          >
            {renderQuadrant(
              "Learning & Growth",
              PERSPECTIVES[3].measures,
              quadrant.learning.x,
              quadrant.learning.y,
              quadrant.learning.w,
              quadrant.learning.h,
            )}
          </ExplainAnchor>
        </g>

        {/* Central strategy statement */}
        <ExplainAnchor
          selector="strategy-statement"
          index={6}
          pin={{ x: cx + centreW / 2 + 12, y: cy - 8 }}
          rect={{ x: cx - centreW / 2, y: cy - centreH / 2, width: centreW, height: centreH }}
        >
          <g>
            <rect
              x={cx - centreW / 2}
              y={cy - centreH / 2}
              width={centreW}
              height={centreH}
              rx={5}
              fill="var(--color-ink)"
              fillOpacity={0.08}
              stroke={INK}
              strokeWidth={1.2}
            />
            <text
              x={cx}
              y={cy - 10}
              fontFamily={FONT}
              fontSize={8.5}
              fontWeight="600"
              fill={INK}
              textAnchor="middle"
            >
              STRATEGY
            </text>
            {STRATEGY.split("\n").map((line, i) => (
              <text key={i} x={cx} y={cy + 4 + i * 11} fontFamily={FONT} fontSize={8} fill={INK_SOFT} textAnchor="middle">
                {line}
              </text>
            ))}
          </g>
        </ExplainAnchor>

      </Group>
    </svg>
  );
}
