"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// SIPOC Diagram — customer-support ticket flow.
// Five columns: Suppliers / Inputs / Process / Outputs / Customers.
// The Process column shows 5 steps with arrows; the outer four show text lists.
// Column widths: Process ~32%, others ~17% each.

const COLUMN_KEYS = [
  "suppliers",
  "inputs",
  "process",
  "outputs",
  "customers",
] as const;
type ColKey = (typeof COLUMN_KEYS)[number];

const COLUMN_LABELS: Record<ColKey, string> = {
  suppliers: "SUPPLIERS",
  inputs: "INPUTS",
  process: "PROCESS",
  outputs: "OUTPUTS",
  customers: "CUSTOMERS",
};

// Text entries for the four outer columns.
const SUPPLIERS = ["Reporting customer", "Monitoring system", "Engineering team"];
const INPUTS = ["Ticket text", "Severity level", "System logs", "Customer context"];
const OUTPUTS = ["Resolution message", "Knowledge-base update", "Follow-up task"];
const CUSTOMERS = [
  "Reporting customer",
  "Support manager (metrics)",
  "Future searchers",
];

// The Process column: 5 sequential steps with arrows between them.
const PROCESS_STEPS = ["Triage", "Assign", "Investigate", "Resolve", "Close"];

interface Props {
  width: number;
  height: number;
}

// Column weight fractions (sum = 1).
// Process gets ~32%; the other four share ~68% equally (~17% each).
const COL_FRACS: Record<ColKey, number> = {
  suppliers: 0.17,
  inputs: 0.17,
  process: 0.32,
  outputs: 0.17,
  customers: 0.17,
};

// Header colour per column — each column has a distinct tint for fast scanning.
const HEADER_FILLS: Record<ColKey, string> = {
  suppliers: "rgba(80,100,140,0.18)",
  inputs: "rgba(80,130,120,0.18)",
  process: "rgba(120,90,50,0.18)",
  outputs: "rgba(80,130,120,0.18)",
  customers: "rgba(80,100,140,0.18)",
};

export function SipocDiagram({ width, height }: Props) {
  const margin = { top: 16, right: 16, bottom: 16, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const headerH = Math.max(22, ih * 0.12);
  const bodyH = ih - headerH;

  // Compute column x positions from fractional widths.
  const colWidths: Record<ColKey, number> = {
    suppliers: iw * COL_FRACS.suppliers,
    inputs: iw * COL_FRACS.inputs,
    process: iw * COL_FRACS.process,
    outputs: iw * COL_FRACS.outputs,
    customers: iw * COL_FRACS.customers,
  };

  const colX: Record<ColKey, number> = {
    suppliers: 0,
    inputs: colWidths.suppliers,
    process: colWidths.suppliers + colWidths.inputs,
    outputs: colWidths.suppliers + colWidths.inputs + colWidths.process,
    customers:
      colWidths.suppliers +
      colWidths.inputs +
      colWidths.process +
      colWidths.outputs,
  };

  // Text entry rows in body area — outer columns.
  const maxRows = Math.max(
    SUPPLIERS.length,
    INPUTS.length,
    OUTPUTS.length,
    CUSTOMERS.length,
  );
  const rowH = bodyH / Math.max(maxRows, 4);
  const fontSize = Math.max(8, Math.min(11, rowH * 0.4));

  // Process steps geometry — horizontal chain inside the Process column.
  const procStepCount = PROCESS_STEPS.length;
  const procW = colWidths.process;
  const stepW = Math.min((procW - 12) / procStepCount, 48);
  const stepH = Math.max(18, Math.min(30, bodyH * 0.18));
  const stepGap = (procW - procStepCount * stepW) / (procStepCount + 1);
  const stepY = headerH + bodyH / 2 - stepH / 2;

  function stepCX(i: number) {
    return colX.process + stepGap * (i + 1) + stepW * i + stepW / 2;
  }
  function stepX(i: number) {
    return colX.process + stepGap * (i + 1) + stepW * i;
  }

  // Arrow head helper — right-pointing triangle at (tx, ty).
  function ArrowHead({ tx, ty }: { tx: number; ty: number }) {
    const h = 5;
    return (
      <polygon
        points={`${tx},${ty} ${tx - h},${ty - h * 0.6} ${tx - h},${ty + h * 0.6}`}
        fill="var(--color-ink-mute)"
      />
    );
  }

  // Vertical divider x positions (between each pair of columns).
  const dividers: number[] = [
    colX.inputs,
    colX.process,
    colX.outputs,
    colX.customers,
  ];

  // Anchor targets:
  // 1. suppliers column header + body
  // 2. inputs column body
  // 3. process column (the step chain)
  // 4. outputs column body
  // 5. customers column
  // 6. column header row (overall)
  // 7. process step chain arrows

  return (
    <svg width={width} height={height} role="img" aria-label="SIPOC Diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Column header row */}
        <g data-data-layer="true">
          {COLUMN_KEYS.map((col) => (
            <g key={`hdr-${col}`}>
              <rect
                x={colX[col]}
                y={0}
                width={colWidths[col]}
                height={headerH}
                fill={HEADER_FILLS[col]}
                stroke="var(--color-hairline)"
                strokeWidth={1}
              />
              <text
                x={colX[col] + colWidths[col] / 2}
                y={headerH / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={Math.max(8, Math.min(11, colWidths[col] * 0.11))}
                fontWeight={700}
                fill="var(--color-ink)"
              >
                {COLUMN_LABELS[col]}
              </text>
            </g>
          ))}
        </g>

        {/* Body area background */}
        <g data-data-layer="true">
          <rect
            x={0}
            y={headerH}
            width={iw}
            height={bodyH}
            fill="var(--color-surface)"
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
        </g>

        {/* Vertical dividers */}
        <g data-data-layer="true">
          {dividers.map((dx) => (
            <line
              key={`div-${dx}`}
              x1={dx}
              y1={0}
              x2={dx}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeWidth={1}
            />
          ))}
        </g>

        {/* Suppliers text list */}
        <g data-data-layer="true">
          {SUPPLIERS.map((s, i) => (
            <text
              key={`sup-${i}`}
              x={colX.suppliers + colWidths.suppliers / 2}
              y={headerH + i * rowH + rowH / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={fontSize}
              fill="var(--color-ink)"
            >
              {s}
            </text>
          ))}
        </g>

        {/* Inputs text list */}
        <g data-data-layer="true">
          {INPUTS.map((s, i) => (
            <text
              key={`inp-${i}`}
              x={colX.inputs + colWidths.inputs / 2}
              y={headerH + i * rowH + rowH / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={fontSize}
              fill="var(--color-ink)"
            >
              {s}
            </text>
          ))}
        </g>

        {/* Outputs text list */}
        <g data-data-layer="true">
          {OUTPUTS.map((s, i) => (
            <text
              key={`out-${i}`}
              x={colX.outputs + colWidths.outputs / 2}
              y={headerH + i * rowH + rowH / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={fontSize}
              fill="var(--color-ink)"
            >
              {s}
            </text>
          ))}
        </g>

        {/* Customers text list */}
        <g data-data-layer="true">
          {CUSTOMERS.map((s, i) => (
            <text
              key={`cust-${i}`}
              x={colX.customers + colWidths.customers / 2}
              y={headerH + i * rowH + rowH / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={fontSize}
              fill="var(--color-ink)"
            >
              {s}
            </text>
          ))}
        </g>

        {/* Process column: step boxes + arrows */}
        <g data-data-layer="true">
          {PROCESS_STEPS.map((step, i) => {
            const sx = stepX(i);
            const cy = stepY + stepH / 2;
            const labelFontSize = Math.max(7, Math.min(10, stepW * 0.18));
            return (
              <g key={`step-${i}`}>
                {/* Arrow connecting to next step */}
                {i < PROCESS_STEPS.length - 1 && (
                  <g>
                    <line
                      x1={sx + stepW}
                      y1={cy}
                      x2={stepX(i + 1) - 1}
                      y2={cy}
                      stroke="var(--color-ink-mute)"
                      strokeWidth={1.2}
                    />
                    <ArrowHead tx={stepX(i + 1) - 1} ty={cy} />
                  </g>
                )}
                {/* Step box */}
                <rect
                  x={sx}
                  y={stepY}
                  width={stepW}
                  height={stepH}
                  rx={3}
                  ry={3}
                  fill="var(--color-surface)"
                  stroke="var(--color-ink)"
                  strokeWidth={1.1}
                />
                <text
                  x={sx + stepW / 2}
                  y={stepY + stepH / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={labelFontSize}
                  fill="var(--color-ink)"
                >
                  {step}
                </text>
              </g>
            );
          })}
        </g>

        {/* Anchors — 7 total, all unconditional. */}

        {/* 1. Suppliers column */}
        <ExplainAnchor
          selector="suppliers-column"
          index={1}
          pin={{ x: colX.suppliers + colWidths.suppliers / 2, y: -10 }}
          rect={{
            x: Math.max(0, colX.suppliers),
            y: 0,
            width: Math.min(iw - colX.suppliers, colWidths.suppliers),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Inputs column */}
        <ExplainAnchor
          selector="inputs-column"
          index={2}
          pin={{ x: colX.inputs + colWidths.inputs / 2, y: -10 }}
          rect={{
            x: Math.max(0, colX.inputs),
            y: 0,
            width: Math.min(iw - colX.inputs, colWidths.inputs),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Process column — the step chain */}
        <ExplainAnchor
          selector="process-column"
          index={3}
          pin={{ x: colX.process + colWidths.process / 2, y: -10 }}
          rect={{
            x: Math.max(0, colX.process),
            y: 0,
            width: Math.min(iw - colX.process, colWidths.process),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Outputs column */}
        <ExplainAnchor
          selector="outputs-column"
          index={4}
          pin={{ x: colX.outputs + colWidths.outputs / 2, y: -10 }}
          rect={{
            x: Math.max(0, colX.outputs),
            y: 0,
            width: Math.min(iw - colX.outputs, colWidths.outputs),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Customers column */}
        <ExplainAnchor
          selector="customers-column"
          index={5}
          pin={{ x: colX.customers + colWidths.customers / 2, y: -10 }}
          rect={{
            x: Math.max(0, colX.customers),
            y: 0,
            width: Math.min(iw - colX.customers, colWidths.customers),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Column header row */}
        <ExplainAnchor
          selector="column-header-row"
          index={6}
          pin={{ x: iw / 2, y: -10 }}
          rect={{
            x: 0,
            y: 0,
            width: iw,
            height: headerH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Process step chain (arrows between steps) — anchor on the
             midpoint arrow between Triage and Assign. */}
        <ExplainAnchor
          selector="process-step-chain"
          index={7}
          pin={{
            x: (stepX(0) + stepW + stepX(1)) / 2,
            y: stepY + stepH + 12,
          }}
          rect={{
            x: Math.max(0, colX.process),
            y: Math.max(0, stepY - 4),
            width: Math.min(iw - colX.process, colWidths.process),
            height: Math.min(ih - stepY + 4, stepH + 8),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
