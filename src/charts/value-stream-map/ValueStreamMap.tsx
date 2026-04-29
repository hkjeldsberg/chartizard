"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

interface Process {
  id: string;
  name: string;
  // The cycle time in seconds is what goes under each process box on the
  // sawtooth as the value-add peak; changeover and uptime are process-tile
  // fields. Queue is the push inventory triangle immediately LEFT of the
  // process (units waiting).
  cycleSec: number;
  changeoverMin: number;
  uptimePct: number;
  operators: number;
  // queueUnits: inventory waiting BEFORE this process (left-side triangle).
  queueUnits: number;
  // inventoryDays: the flat non-value-add segment on the timeline before
  // this process (lead-time contribution of the queue).
  inventoryDays: number;
}

// Four-step fabrication line, numbers tuned so the LT:PT ratio is dramatic
// (23 days to 180 seconds value-add ≈ 1:11000, classic Rother/Shook territory).
const PROCESSES: ReadonlyArray<Process> = [
  { id: "stamp",   name: "Stamping",   cycleSec: 45, changeoverMin: 60, uptimePct: 85, operators: 1, queueUnits: 5000, inventoryDays: 4.5 },
  { id: "weld",    name: "Welding",    cycleSec: 40, changeoverMin: 10, uptimePct: 100, operators: 1, queueUnits: 1100, inventoryDays: 7.6 },
  { id: "assemble",name: "Assembly",   cycleSec: 62, changeoverMin: 0,  uptimePct: 100, operators: 1, queueUnits: 1600, inventoryDays: 1.8 },
  { id: "ship",    name: "Shipping",   cycleSec: 40, changeoverMin: 0,  uptimePct: 100, operators: 1, queueUnits: 2400, inventoryDays: 4.5 },
];

// Terminal inventory AFTER the last process (before the customer picks it up).
const TERMINAL_INVENTORY_DAYS = 4.5;

// Totals used for the LT / PT ratio summary.
const TOTAL_LT_DAYS =
  PROCESSES.reduce((s, p) => s + p.inventoryDays, 0) + TERMINAL_INVENTORY_DAYS;
const TOTAL_PT_SEC = PROCESSES.reduce((s, p) => s + p.cycleSec, 0);

export function ValueStreamMap({ width, height }: Props) {
  const margin = { top: 28, right: 16, bottom: 20, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Vertical bands: top entity row (customer/supplier/production-control),
  // middle process row (with data tiles below), bottom timeline sawtooth.
  const entityH = Math.max(32, Math.min(ih * 0.18, 48));
  const entityY = 0;

  const timelineH = Math.max(32, Math.min(ih * 0.22, 52));
  const ltSummaryH = 16;
  const timelineY = ih - timelineH;

  const processRowY = entityY + entityH + 12;
  const processRowH = timelineY - processRowY - 6;

  // Process box geometry.
  const procBoxW = Math.max(56, Math.min(iw * 0.13, 96));
  const procBoxH = Math.max(22, Math.min(processRowH * 0.22, 32));

  // Data tile: 4 rows under each process.
  const tileRowH = Math.max(11, Math.min(processRowH * 0.1, 15));
  const tileW = procBoxW;
  const tileH = tileRowH * 4;

  // Processes are spaced evenly across the interior.
  const procCount = PROCESSES.length;
  const procStep = iw / procCount;
  const procX = (i: number) => procStep * (i + 0.5);

  // Entity boxes.
  const entityW = Math.max(70, Math.min(iw * 0.16, 110));
  const supplierX = 0;
  const customerX = iw - entityW;
  const prodCtrlX = iw / 2 - entityW / 2;

  // Inventory triangle positions — between each pair of processes, plus one
  // before the first process and one after the last.
  const triangleH = Math.max(8, Math.min(procBoxH * 0.5, 14));

  // Timeline geometry. Segment widths correspond to log-space scaling — flat
  // inventory segments are wide, value-add peaks are narrow spikes.
  // We'll compute x positions along the timeline for each segment.
  const timelineInnerX = 0;
  const timelineInnerW = iw;
  const timelineBaseY = timelineY + timelineH - ltSummaryH - 6;
  const timelinePeakY = timelineY + 6;

  // Use a fixed split: each inventory segment gets a "wide" share, each
  // value-add peak gets a "narrow" share, with the total summing to
  // timelineInnerW. This is the convention in VSM — you're not drawing to
  // scale, you're drawing to *emphasise* the wide:narrow asymmetry.
  const nInv = PROCESSES.length + 1;
  const nProc = PROCESSES.length;
  const invW = (timelineInnerW * 0.8) / nInv;
  const peakW = (timelineInnerW * 0.2) / nProc;

  // Build the sawtooth polyline. Starts at the left on the base line,
  // walks across alternating (flat inventory) and (peak slope up + slope
  // down) segments.
  const sawPoints: Array<[number, number]> = [];
  let cx = timelineInnerX;
  sawPoints.push([cx, timelineBaseY]);
  for (let i = 0; i < nInv; i++) {
    // inventory flat segment
    cx += invW;
    sawPoints.push([cx, timelineBaseY]);
    if (i < nProc) {
      // peak: go up-diagonal, then down-diagonal to next base-line point.
      cx += peakW / 2;
      sawPoints.push([cx, timelinePeakY]);
      cx += peakW / 2;
      sawPoints.push([cx, timelineBaseY]);
    }
  }
  const sawD = sawPoints.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");

  // Position labels under each inventory segment (days) and over each peak
  // (cycle seconds).
  function invSegmentCentre(i: number): number {
    // ith inventory segment starts after i*(invW+peakW) (with peaks only
    // before each non-first inv segment). Walk it.
    let x = timelineInnerX;
    for (let k = 0; k < i; k++) {
      x += invW + peakW;
    }
    return x + invW / 2;
  }
  function peakCentre(i: number): number {
    // ith peak comes after (i+1) inv segments and i peaks.
    let x = timelineInnerX;
    for (let k = 0; k <= i; k++) {
      x += invW;
      if (k < i) x += peakW;
    }
    return x + peakW / 2;
  }

  // Anchor targets.
  const anchorProc = PROCESSES[1]; // Welding — its data tile is the anchor.
  const anchorProcIdx = 1;
  const anchorProcCx = procX(anchorProcIdx);
  const anchorProcBoxY = processRowY + 4;
  const anchorTileY = anchorProcBoxY + procBoxH + 6;

  // Inventory triangle anchor — between Stamping (0) and Welding (1).
  const anchorTriIdx = 1;
  const anchorTriX = (procX(anchorTriIdx - 1) + procX(anchorTriIdx)) / 2;
  const anchorTriY = anchorProcBoxY + procBoxH / 2;

  // Timeline anchor — first peak and its valley.
  const firstPeakX = peakCentre(0);
  const firstInvX = invSegmentCentre(0);

  // LT / PT ratio summary box at the right edge of the timeline.
  const summaryW = Math.max(86, Math.min(iw * 0.22, 130));
  const summaryX = iw - summaryW;
  const summaryY = timelineY + timelineH - ltSummaryH;

  return (
    <svg width={width} height={height} role="img" aria-label="Value stream map">
      <defs>
        <marker
          id="vsm-push-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-ink-mute)" />
        </marker>
      </defs>

      <Group left={margin.left} top={margin.top}>
        {/* Top row — entity boxes */}
        <g data-data-layer="true">
          {/* Supplier */}
          <rect
            x={supplierX}
            y={entityY}
            width={entityW}
            height={entityH}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          <text
            x={supplierX + entityW / 2}
            y={entityY + 12}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            SUPPLIER
          </text>
          <text
            x={supplierX + entityW / 2}
            y={entityY + entityH / 2 + 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            Steel Co.
          </text>

          {/* Production control (top-centre) */}
          <rect
            x={prodCtrlX}
            y={entityY}
            width={entityW}
            height={entityH}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          <text
            x={prodCtrlX + entityW / 2}
            y={entityY + 12}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            PRODUCTION CONTROL
          </text>
          <text
            x={prodCtrlX + entityW / 2}
            y={entityY + entityH / 2 + 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            MRP — weekly
          </text>

          {/* Customer */}
          <rect
            x={customerX}
            y={entityY}
            width={entityW}
            height={entityH}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          <text
            x={customerX + entityW / 2}
            y={entityY + 12}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            CUSTOMER
          </text>
          <text
            x={customerX + entityW / 2}
            y={entityY + entityH / 2 + 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            OEM Assy.
          </text>

          {/* Electronic info flow (zigzag) supplier → production control */}
          <path
            d={`M ${supplierX + entityW} ${entityY + entityH / 2} l 6 -4 l 6 4 l 6 -4 l 6 4 L ${prodCtrlX} ${entityY + entityH / 2}`}
            fill="none"
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          {/* Electronic info flow production control → customer */}
          <path
            d={`M ${prodCtrlX + entityW} ${entityY + entityH / 2} l 6 -4 l 6 4 l 6 -4 l 6 4 L ${customerX} ${entityY + entityH / 2}`}
            fill="none"
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
        </g>

        {/* Middle row — process boxes + data tiles */}
        <g data-data-layer="true">
          {PROCESSES.map((p, i) => {
            const cx = procX(i);
            const boxX = cx - procBoxW / 2;
            return (
              <g key={`proc-${p.id}`}>
                {/* Process box */}
                <rect
                  x={boxX}
                  y={anchorProcBoxY}
                  width={procBoxW}
                  height={procBoxH}
                  fill="var(--color-surface)"
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                />
                <text
                  x={cx}
                  y={anchorProcBoxY + procBoxH / 2 + 4}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fontWeight={500}
                  fill="var(--color-ink)"
                >
                  {p.name}
                </text>

                {/* Data tile (4 rows) */}
                {(() => {
                  const rows: Array<[string, string]> = [
                    ["C/T", `${p.cycleSec}s`],
                    ["C/O", `${p.changeoverMin}m`],
                    ["Uptime", `${p.uptimePct}%`],
                    ["Ops", `${p.operators}`],
                  ];
                  const ty = anchorProcBoxY + procBoxH + 6;
                  return (
                    <g>
                      <rect
                        x={boxX}
                        y={ty}
                        width={tileW}
                        height={tileH}
                        fill="var(--color-surface)"
                        stroke="var(--color-ink)"
                        strokeWidth={1}
                      />
                      {rows.map(([k, v], r) => (
                        <g key={`${p.id}-row-${r}`}>
                          {r > 0 && (
                            <line
                              x1={boxX}
                              y1={ty + r * tileRowH}
                              x2={boxX + tileW}
                              y2={ty + r * tileRowH}
                              stroke="var(--color-hairline)"
                              strokeWidth={0.8}
                            />
                          )}
                          <text
                            x={boxX + 4}
                            y={ty + r * tileRowH + tileRowH / 2 + 3}
                            fontFamily="var(--font-mono)"
                            fontSize={8.5}
                            fill="var(--color-ink-soft)"
                          >
                            {k}
                          </text>
                          <text
                            x={boxX + tileW - 4}
                            y={ty + r * tileRowH + tileRowH / 2 + 3}
                            textAnchor="end"
                            fontFamily="var(--font-mono)"
                            fontSize={8.5}
                            fill="var(--color-ink)"
                          >
                            {v}
                          </text>
                        </g>
                      ))}
                    </g>
                  );
                })()}
              </g>
            );
          })}
        </g>

        {/* Inventory triangles (push arrows) between processes */}
        <g data-data-layer="true">
          {PROCESSES.map((p, i) => {
            // Triangle sits to the LEFT of process i. For i=0 it sits
            // between the supplier-side edge and process 0.
            const rightCx = procX(i) - procBoxW / 2;
            const leftCx = i === 0 ? supplierX + entityW : procX(i - 1) + procBoxW / 2;
            const cx = (leftCx + rightCx) / 2;
            const cy = anchorProcBoxY + procBoxH / 2;
            const s = triangleH;
            return (
              <g key={`inv-${p.id}`}>
                {/* Push arrow: striped arrow from prev to this */}
                <path
                  d={`M ${leftCx + 2} ${cy} L ${cx - s - 2} ${cy}`}
                  fill="none"
                  stroke="var(--color-ink-mute)"
                  strokeWidth={1}
                />
                <path
                  d={`M ${cx + s + 2} ${cy} L ${rightCx - 2} ${cy}`}
                  fill="none"
                  stroke="var(--color-ink-mute)"
                  strokeWidth={1}
                  markerEnd="url(#vsm-push-arrow)"
                />
                {/* Inventory triangle */}
                <polygon
                  points={`${cx},${cy - s} ${cx + s},${cy + s * 0.8} ${cx - s},${cy + s * 0.8}`}
                  fill="var(--color-surface)"
                  stroke="var(--color-ink)"
                  strokeWidth={1}
                />
                <text
                  x={cx}
                  y={cy + s + 9}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={8.5}
                  fill="var(--color-ink-soft)"
                >
                  {p.queueUnits}
                </text>
              </g>
            );
          })}
          {/* Terminal triangle AFTER last process, going to the customer. */}
          {(() => {
            const lastIdx = PROCESSES.length - 1;
            const leftCx = procX(lastIdx) + procBoxW / 2;
            const rightCx = customerX;
            const cx = (leftCx + rightCx) / 2;
            const cy = anchorProcBoxY + procBoxH / 2;
            const s = triangleH;
            return (
              <g>
                <path
                  d={`M ${leftCx + 2} ${cy} L ${cx - s - 2} ${cy}`}
                  fill="none"
                  stroke="var(--color-ink-mute)"
                  strokeWidth={1}
                />
                <path
                  d={`M ${cx + s + 2} ${cy} L ${rightCx - 2} ${cy}`}
                  fill="none"
                  stroke="var(--color-ink-mute)"
                  strokeWidth={1}
                  markerEnd="url(#vsm-push-arrow)"
                />
                <polygon
                  points={`${cx},${cy - s} ${cx + s},${cy + s * 0.8} ${cx - s},${cy + s * 0.8}`}
                  fill="var(--color-surface)"
                  stroke="var(--color-ink)"
                  strokeWidth={1}
                />
                <text
                  x={cx}
                  y={cy + s + 9}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={8.5}
                  fill="var(--color-ink-soft)"
                >
                  2400
                </text>
              </g>
            );
          })()}
        </g>

        {/* Timeline sawtooth */}
        <g data-data-layer="true">
          <path
            d={sawD}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
            strokeLinejoin="miter"
          />
          {/* Inventory-segment labels (days) under base line */}
          {Array.from({ length: nInv }).map((_, i) => {
            const xc = invSegmentCentre(i);
            const days = i < PROCESSES.length ? PROCESSES[i].inventoryDays : TERMINAL_INVENTORY_DAYS;
            return (
              <text
                key={`inv-lbl-${i}`}
                x={xc}
                y={timelineBaseY + 10}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={8.5}
                fill="var(--color-ink-soft)"
              >
                {days}d
              </text>
            );
          })}
          {/* Peak labels (cycle seconds) above peak */}
          {PROCESSES.map((p, i) => {
            const xc = peakCentre(i);
            return (
              <text
                key={`peak-lbl-${i}`}
                x={xc}
                y={timelinePeakY - 3}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={8.5}
                fill="var(--color-ink)"
              >
                {p.cycleSec}s
              </text>
            );
          })}
        </g>

        {/* LT / PT summary */}
        <g data-data-layer="true">
          <rect
            x={summaryX}
            y={summaryY}
            width={summaryW}
            height={ltSummaryH}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          <text
            x={summaryX + summaryW / 2}
            y={summaryY + ltSummaryH / 2 + 3}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink)"
          >
            LT: {TOTAL_LT_DAYS.toFixed(1)}d / PT: {TOTAL_PT_SEC}s
          </text>
        </g>

        {/* Anchors (6) — all render unconditionally. */}

        {/* 1. Process box */}
        <ExplainAnchor
          selector="process-box"
          index={1}
          pin={{ x: anchorProcCx, y: anchorProcBoxY - 12 }}
          rect={{
            x: anchorProcCx - procBoxW / 2,
            y: anchorProcBoxY,
            width: procBoxW,
            height: procBoxH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Data tile (C/T row under Welding) */}
        <ExplainAnchor
          selector="data-tile"
          index={2}
          pin={{
            x: anchorProcCx + procBoxW / 2 + 14,
            y: anchorTileY + tileH / 2,
          }}
          rect={{
            x: anchorProcCx - tileW / 2,
            y: anchorTileY,
            width: tileW,
            height: tileH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Inventory triangle (push, between Stamping and Welding) */}
        <ExplainAnchor
          selector="inventory-triangle"
          index={3}
          pin={{ x: anchorTriX, y: anchorTriY + triangleH + 20 }}
          rect={{
            x: anchorTriX - triangleH - 2,
            y: anchorTriY - triangleH - 2,
            width: triangleH * 2 + 4,
            height: triangleH * 2 + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Customer / supplier entity (the Customer box on the top-right) */}
        <ExplainAnchor
          selector="entity"
          index={4}
          pin={{ x: customerX + entityW / 2, y: entityY + entityH + 12 }}
          rect={{
            x: customerX,
            y: entityY,
            width: entityW,
            height: entityH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Timeline sawtooth (one peak + one valley) */}
        <ExplainAnchor
          selector="timeline-sawtooth"
          index={5}
          pin={{ x: firstPeakX, y: timelinePeakY - 14 }}
          rect={{
            x: Math.min(firstInvX, firstPeakX) - invW / 2,
            y: timelinePeakY - 4,
            width: invW + peakW,
            height: timelineBaseY - timelinePeakY + 10,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. LT / PT ratio */}
        <ExplainAnchor
          selector="lt-pt-ratio"
          index={6}
          pin={{ x: summaryX - 14, y: summaryY + ltSummaryH / 2 }}
          rect={{
            x: summaryX,
            y: summaryY,
            width: summaryW,
            height: ltSummaryH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Electronic info flow (the zigzag line, supplier → production control) */}
        <ExplainAnchor
          selector="info-flow"
          index={7}
          pin={{ x: (supplierX + entityW + prodCtrlX) / 2, y: entityY + entityH / 2 - 14 }}
          rect={{
            x: supplierX + entityW - 2,
            y: entityY + entityH / 2 - 8,
            width: prodCtrlX - (supplierX + entityW) + 4,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
