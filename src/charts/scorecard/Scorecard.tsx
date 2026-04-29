"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Q1 2026 SaaS scorecard — 8 metrics, 4 columns
const METRICS = [
  { label: "Monthly Recurring Revenue", actual: "$4.18M", target: "$4.00M", variance: "+4.5%", status: "green" },
  { label: "Net Revenue Retention", actual: "112%", target: "110%", variance: "+2pp", status: "green" },
  { label: "Customer Acquisition Cost", actual: "$1,840", target: "$1,750", variance: "+5.1%", status: "amber" },
  { label: "Net Promoter Score", actual: "41", target: "45", variance: "-4", status: "amber" },
  { label: "Monthly Churn Rate", actual: "1.9%", target: "1.5%", variance: "+0.4pp", status: "red" },
  { label: "Active Users (WAU)", actual: "28.4K", target: "30.0K", variance: "-5.3%", status: "red" },
  { label: "Support CSAT", actual: "94%", target: "92%", variance: "+2pp", status: "green" },
  { label: "Gross Margin", actual: "73.2%", target: "72.0%", variance: "+1.2pp", status: "green" },
] as const;

const STATUS_COLOR: Record<string, string> = {
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#ef4444",
};

export function ScorecardChart({ width, height }: { width: number; height: number }) {
  const margin = { top: 28, right: 20, bottom: 20, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const ROW_COUNT = METRICS.length;
  const HEADER_H = 22;
  const rowH = Math.max(18, (ih - HEADER_H) / ROW_COUNT);

  // Column widths (proportional)
  const colMetric = iw * 0.38;
  const colActual = iw * 0.2;
  const colTarget = iw * 0.2;
  const colStatus = iw * 0.22;

  const colX = [
    0,
    colMetric,
    colMetric + colActual,
    colMetric + colActual + colTarget,
    colMetric + colActual + colTarget + colStatus,
  ];

  const FONT = "var(--font-mono)";
  const INK = "var(--color-ink)";
  const INK_SOFT = "var(--color-ink-soft)";
  const INK_MUTE = "var(--color-ink-mute)";
  const HAIRLINE = "var(--color-hairline)";

  // Representative status dot Y (first green row)
  const firstGreenIdx = 0;
  const dotRowY = HEADER_H + firstGreenIdx * rowH + rowH / 2;

  // Representative variance cell Y (first amber row = index 2)
  const varianceRowIdx = 2;
  const varRowY = HEADER_H + varianceRowIdx * rowH + rowH / 2;

  return (
    <svg width={width} height={height} role="img" aria-label="Scorecard — Q1 2026 SaaS KPI summary">
      <Group left={margin.left} top={margin.top}>

        {/* Header row */}
        <ExplainAnchor
          selector="header-row"
          index={1}
          pin={{ x: colX[0] + colMetric / 2, y: -10 }}
          rect={{ x: 0, y: -HEADER_H + 4, width: iw, height: HEADER_H }}
        >
          <g>
            <text x={colX[0]} y={HEADER_H - 6} fontFamily={FONT} fontSize={9} fill={INK_MUTE} fontWeight="600">METRIC</text>
            <text x={colX[1] + colActual - 4} y={HEADER_H - 6} fontFamily={FONT} fontSize={9} fill={INK_MUTE} fontWeight="600" textAnchor="end">ACTUAL</text>
            <text x={colX[2] + colTarget - 4} y={HEADER_H - 6} fontFamily={FONT} fontSize={9} fill={INK_MUTE} fontWeight="600" textAnchor="end">TARGET</text>
            <text x={colX[3] + colStatus / 2} y={HEADER_H - 6} fontFamily={FONT} fontSize={9} fill={INK_MUTE} fontWeight="600" textAnchor="middle">STATUS</text>
          </g>
        </ExplainAnchor>

        {/* Header separator */}
        <line x1={0} x2={iw} y1={HEADER_H} y2={HEADER_H} stroke={HAIRLINE} strokeWidth={1} />

        {/* Data rows */}
        <g data-data-layer="true">
          {METRICS.map((m, i) => {
            const y = HEADER_H + i * rowH;
            const textY = y + rowH / 2 + 4;
            const isEven = i % 2 === 0;
            return (
              <g key={m.label}>
                {isEven && (
                  <rect x={0} y={y} width={iw} height={rowH} fill="var(--color-ink)" fillOpacity={0.03} />
                )}
                {/* Row separator */}
                <line x1={0} x2={iw} y1={y + rowH} y2={y + rowH} stroke={HAIRLINE} strokeWidth={0.5} />

                {/* Metric label */}
                <text x={colX[0] + 4} y={textY} fontFamily={FONT} fontSize={10} fill={INK}>
                  {m.label}
                </text>

                {/* Actual */}
                <text x={colX[1] + colActual - 6} y={textY} fontFamily={FONT} fontSize={10} fill={INK} textAnchor="end">
                  {m.actual}
                </text>

                {/* Target */}
                <text x={colX[2] + colTarget - 6} y={textY} fontFamily={FONT} fontSize={10} fill={INK_SOFT} textAnchor="end">
                  {m.target}
                </text>

                {/* Status dot */}
                <circle
                  cx={colX[3] + colStatus * 0.35}
                  cy={y + rowH / 2}
                  r={4.5}
                  fill={STATUS_COLOR[m.status]}
                />

                {/* Variance label */}
                <text
                  x={colX[3] + colStatus * 0.55}
                  y={textY}
                  fontFamily={FONT}
                  fontSize={9}
                  fill={STATUS_COLOR[m.status]}
                >
                  {m.variance}
                </text>
              </g>
            );
          })}
        </g>

        {/* Anchor: metric column */}
        <ExplainAnchor
          selector="metric-column"
          index={2}
          pin={{ x: colMetric * 0.6, y: HEADER_H + 1 * rowH + rowH / 2 }}
          rect={{ x: 0, y: HEADER_H, width: colMetric, height: ih - HEADER_H }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor: actual vs target */}
        <ExplainAnchor
          selector="actual-target"
          index={3}
          pin={{ x: colX[2] + colTarget / 2, y: varRowY - rowH }}
          rect={{ x: colX[1], y: HEADER_H, width: colActual + colTarget, height: ih - HEADER_H }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor: status dot */}
        <ExplainAnchor
          selector="status-dot"
          index={4}
          pin={{ x: colX[3] + colStatus * 0.35 + 16, y: dotRowY - 8 }}
          rect={{ x: colX[3], y: HEADER_H, width: colStatus, height: ih - HEADER_H }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor: variance */}
        <ExplainAnchor
          selector="variance"
          index={5}
          pin={{ x: colX[3] + colStatus * 0.55 + 28, y: varRowY }}
          rect={{ x: colX[3] + colStatus * 0.5, y: HEADER_H + varianceRowIdx * rowH, width: colStatus * 0.5, height: rowH }}
        >
          <g />
        </ExplainAnchor>

        {/* Title */}
        <text
          x={iw / 2}
          y={-margin.top + 12}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={11}
          fontWeight="600"
          fill={INK}
        >
          Q1 2026 — SaaS Operating Scorecard
        </text>
      </Group>
    </svg>
  );
}
