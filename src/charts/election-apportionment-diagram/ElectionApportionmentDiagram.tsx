"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// 2024 UK House of Commons seat counts, ordered left-to-right across the
// hemicycle in the conventional political spectrum (SNP & Lib Dem sit to
// Labour's right of the chamber in Westminster but for apportionment-diagram
// clarity we order by the generic European left→right axis that most
// election-night broadcasts use: Greens/SDLP on the far left, through
// Labour/Lib Dem, independents in the centre, Conservatives/Reform on the
// right, DUP on the far right).
const PARTIES: ReadonlyArray<{
  key: string;
  label: string;
  seats: number;
  color: string;
}> = [
  { key: "greens",  label: "Green",       seats: 4,   color: "#4b8a3e" },
  { key: "snp",     label: "SNP",         seats: 9,   color: "#ffd83b" },
  { key: "labour",  label: "Labour",      seats: 411, color: "#c8102e" },
  { key: "libdem",  label: "Lib Dem",     seats: 72,  color: "#faa61a" },
  { key: "others",  label: "Others",      seats: 28,  color: "#8e8e8e" },
  { key: "con",     label: "Conservative", seats: 121, color: "#0087dc" },
  { key: "reform",  label: "Reform UK",   seats: 5,   color: "#12b6cf" },
];

const TOTAL_SEATS = PARTIES.reduce((s, p) => s + p.seats, 0); // = 650

interface Props {
  width: number;
  height: number;
}

// Hemicycle seat placement. Distribute `total` seats across `rows` concentric
// arcs from angle π (left) to 0 (right). Inner rows have fewer seats than
// outer rows, roughly proportional to arc length.
//
// Returns a flat ordered list: seat 0 is the leftmost seat in some row, and
// the list walks through rows such that indexing 0..total-1 corresponds to
// the strict left-to-right political ordering.
function buildHemicycle(
  total: number,
  rows: number,
  innerRadius: number,
  outerRadius: number,
  seatRadius: number,
): Array<{ x: number; y: number; row: number; col: number; angle: number }> {
  // Row radii evenly spaced
  const radii = Array.from({ length: rows }, (_, r) => {
    const t = rows === 1 ? 0.5 : r / (rows - 1);
    return innerRadius + t * (outerRadius - innerRadius);
  });

  // Seats per row proportional to radius; then normalise to sum = total.
  const raw = radii.map((r) => r);
  const rawSum = raw.reduce((a, b) => a + b, 0);
  const floats = raw.map((r) => (r / rawSum) * total);
  const counts = floats.map((f) => Math.floor(f));
  // Distribute remainder to rows with largest fractional parts.
  const remainder = total - counts.reduce((a, b) => a + b, 0);
  const fracs = floats
    .map((f, i) => ({ i, frac: f - Math.floor(f) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < remainder; k++) counts[fracs[k % fracs.length].i] += 1;

  // Build seats per row: angle from π (left) to 0 (right), inclusive of both
  // ends so that end-seats sit on the diameter line for a clean baseline.
  const seatsByRow: Array<
    Array<{ x: number; y: number; row: number; col: number; angle: number }>
  > = [];
  for (let r = 0; r < rows; r++) {
    const nr = counts[r];
    const rad = radii[r];
    const row: Array<{
      x: number;
      y: number;
      row: number;
      col: number;
      angle: number;
    }> = [];
    for (let c = 0; c < nr; c++) {
      // Angle from π at col=0 to 0 at col=nr-1. For a single-seat row, centre it.
      const angle = nr === 1 ? Math.PI / 2 : Math.PI - (c / (nr - 1)) * Math.PI;
      row.push({
        x: Math.cos(angle) * rad,
        y: -Math.sin(angle) * rad, // negative because SVG y increases downward
        row: r,
        col: c,
        angle,
      });
    }
    seatsByRow.push(row);
  }

  // To get a strict left-to-right ordering across the whole chamber, we sort
  // seats by angle descending (π first, 0 last). Ties broken by row so that
  // within a shared angle (leftmost seat of every row), outer row comes first
  // — this matches how election-night graphics fill the chamber.
  const all = seatsByRow.flat();
  all.sort((a, b) => {
    if (b.angle !== a.angle) return b.angle - a.angle;
    return b.row - a.row;
  });
  return all;
}

export function ElectionApportionmentDiagram({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // The hemicycle sits in the upper half of the plot area. Its geometric
  // centre (on the baseline) is at (cx, baseY).
  const outerRadius = Math.max(40, Math.min(iw / 2 - 20, ih - 60));
  const innerRadius = outerRadius * 0.45;
  const rows = 8;
  const cx = iw / 2;
  const baseY = Math.min(ih - 20, outerRadius + 10);

  // Seat size calibrated so 650 dots fit across the rows.
  const seatRadius = Math.max(1.5, Math.min(3.2, outerRadius / 36));

  const seats = useMemo(
    () => buildHemicycle(TOTAL_SEATS, rows, innerRadius, outerRadius, seatRadius),
    [rows, innerRadius, outerRadius, seatRadius],
  );

  // Assign party colour to each seat in left-to-right order. Cumulative seat
  // assignment walks through PARTIES in order.
  const seatAssignments = useMemo(() => {
    const assigned: Array<{
      party: (typeof PARTIES)[number];
      seat: (typeof seats)[number];
    }> = [];
    let cursor = 0;
    for (const party of PARTIES) {
      for (let k = 0; k < party.seats; k++) {
        if (cursor >= seats.length) break;
        assigned.push({ party, seat: seats[cursor] });
        cursor += 1;
      }
    }
    return assigned;
  }, [seats]);

  // For each party block, compute an anchor seat (the middle one) and a
  // centroid for legend / label placement.
  const partyCentroids = useMemo(() => {
    const out: Record<
      string,
      { x: number; y: number; midSeat: (typeof seats)[number] }
    > = {};
    let cursor = 0;
    for (const party of PARTIES) {
      const start = cursor;
      const end = cursor + party.seats - 1;
      cursor += party.seats;
      if (start >= seats.length) continue;
      const clampedEnd = Math.min(end, seats.length - 1);
      const midIdx = Math.floor((start + clampedEnd) / 2);
      let sx = 0;
      let sy = 0;
      for (let i = start; i <= clampedEnd; i++) {
        sx += seats[i].x;
        sy += seats[i].y;
      }
      const n = clampedEnd - start + 1;
      out[party.key] = {
        x: sx / n,
        y: sy / n,
        midSeat: seats[midIdx],
      };
    }
    return out;
  }, [seats]);

  const clampRect = (r: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    const x = Math.max(0, r.x);
    const y = Math.max(0, r.y);
    const width = Math.max(0, Math.min(iw - x, r.x + r.width - x));
    const height = Math.max(0, Math.min(ih - y, r.y + r.height - y));
    return { x, y, width, height };
  };

  const absClamp = (x: number, y: number, pad = 10) => ({
    x: Math.max(pad, Math.min(iw - pad, x)),
    y: Math.max(pad, Math.min(ih - pad, y)),
  });

  // Anchor 1: Majority block — Labour (411 seats).
  const labourC = partyCentroids["labour"];
  const labourAbs = labourC
    ? { x: cx + labourC.x, y: baseY + labourC.y }
    : { x: cx, y: baseY };
  const labourPin = absClamp(labourAbs.x, labourAbs.y - 8);
  const labourRect = clampRect({
    x: labourAbs.x - 70,
    y: labourAbs.y - 28,
    width: 140,
    height: 56,
  });

  // Anchor 2: Single seat (representative dot) — first Conservative seat,
  // picked because it's away from the majority block and sits on a visible
  // right-side row of the hemicycle.
  const repSeatIdx = seatAssignments.findIndex((a) => a.party.key === "con");
  const repSeat =
    repSeatIdx >= 0 ? seatAssignments[repSeatIdx].seat : seats[seats.length - 1];
  const repAbs = { x: cx + repSeat.x, y: baseY + repSeat.y };
  const repPin = absClamp(repAbs.x + 22, repAbs.y - 22);
  const repRect = clampRect({
    x: repAbs.x - 6,
    y: repAbs.y - 6,
    width: 12,
    height: 12,
  });

  // Anchor 3: Concentric rows — outer row rightmost, just a tall-narrow rect.
  const outerRowSeat = seats.find((s) => s.row === rows - 1 && s.angle < 0.3);
  const rowAbs = outerRowSeat
    ? { x: cx + outerRowSeat.x, y: baseY + outerRowSeat.y }
    : { x: cx + outerRadius - 4, y: baseY };
  const rowsPin = absClamp(rowAbs.x - 20, rowAbs.y - 30);
  // Cover a radial strip between innerRadius and outerRadius on the right side.
  const rowsRect = clampRect({
    x: cx + innerRadius * 0.7,
    y: baseY - outerRadius - 2,
    width: outerRadius - innerRadius * 0.7 + 6,
    height: outerRadius + 4,
  });

  // Anchor 4: Left-right ordering — far-left seat (Greens).
  const leftSeat = seats[0];
  const leftAbs = { x: cx + leftSeat.x, y: baseY + leftSeat.y };
  const leftPin = absClamp(leftAbs.x + 12, leftAbs.y + 18);
  const leftRect = clampRect({
    x: leftAbs.x - 8,
    y: leftAbs.y - 8,
    width: 26,
    height: 26,
  });

  // Anchor 5: Small-party block — Lib Dem (72 seats).
  const libdemC = partyCentroids["libdem"];
  const libdemAbs = libdemC
    ? { x: cx + libdemC.x, y: baseY + libdemC.y }
    : { x: cx, y: baseY };
  const libdemPin = absClamp(libdemAbs.x - 6, libdemAbs.y - 30);
  const libdemRect = clampRect({
    x: libdemAbs.x - 30,
    y: libdemAbs.y - 18,
    width: 60,
    height: 36,
  });

  // Anchor 6: Baseline / diameter — the chord line at the bottom of the semicircle.
  const baselinePin = absClamp(cx, baseY + 18);
  const baselineRect = clampRect({
    x: cx - outerRadius,
    y: baseY - 3,
    width: outerRadius * 2,
    height: 14,
  });

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Election apportionment hemicycle"
    >
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {/* Baseline (diameter of the hemicycle) */}
          <line
            x1={cx - outerRadius}
            x2={cx + outerRadius}
            y1={baseY}
            y2={baseY}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />

          {/* Seats */}
          <g>
            {seatAssignments.map((a, i) => (
              <circle
                key={i}
                cx={cx + a.seat.x}
                cy={baseY + a.seat.y}
                r={seatRadius}
                fill={a.party.color}
                stroke="var(--color-surface)"
                strokeWidth={0.35}
              />
            ))}
          </g>

          {/* Legend: compact party swatches + seat counts below the baseline */}
          <g transform={`translate(${margin.left - margin.left}, ${baseY + 14})`}>
            {(() => {
              // Layout legend in a single horizontal row; wrap if needed.
              const entries = PARTIES.map((p) => ({
                ...p,
                text: `${p.label} ${p.seats}`,
              }));
              // Approximate text width per char for mono 9px ~ 5.4px.
              const charW = 5.4;
              const swatchW = 9;
              const gap = 10;
              const paddings = entries.map((e) => swatchW + 3 + e.text.length * charW);
              const totalW = paddings.reduce((a, b) => a + b, 0) + gap * (entries.length - 1);
              const startX = Math.max(0, cx - totalW / 2);
              let x = startX;
              return entries.map((e, i) => {
                const w = paddings[i];
                const node = (
                  <g key={e.key} transform={`translate(${x}, 0)`}>
                    <rect
                      x={0}
                      y={-4}
                      width={swatchW}
                      height={9}
                      fill={e.color}
                    />
                    <text
                      x={swatchW + 3}
                      y={4.5}
                      fontFamily="var(--font-mono)"
                      fontSize={9}
                      fill="var(--color-ink)"
                    >
                      {e.text}
                    </text>
                  </g>
                );
                x += w + gap;
                return node;
              });
            })()}
          </g>

          {/* Total label in the hole */}
          <text
            x={cx}
            y={baseY - innerRadius + 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={11}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            {TOTAL_SEATS} seats
          </text>
          <text
            x={cx}
            y={baseY - innerRadius + 16}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            UK 2024
          </text>
        </g>

        {/* 1. Majority block (Labour) */}
        <ExplainAnchor
          selector="majority-block"
          index={1}
          pin={{ x: labourPin.x, y: labourPin.y }}
          rect={labourRect}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Single seat */}
        <ExplainAnchor
          selector="seat"
          index={2}
          pin={{ x: repPin.x, y: repPin.y }}
          rect={repRect}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Concentric rows */}
        <ExplainAnchor
          selector="rows"
          index={3}
          pin={{ x: rowsPin.x, y: rowsPin.y }}
          rect={rowsRect}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Left-right ordering */}
        <ExplainAnchor
          selector="left-right-ordering"
          index={4}
          pin={{ x: leftPin.x, y: leftPin.y }}
          rect={leftRect}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Small-party block (Lib Dem) */}
        <ExplainAnchor
          selector="small-party"
          index={5}
          pin={{ x: libdemPin.x, y: libdemPin.y }}
          rect={libdemRect}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Baseline */}
        <ExplainAnchor
          selector="baseline"
          index={6}
          pin={{ x: baselinePin.x, y: baselinePin.y }}
          rect={baselineRect}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
