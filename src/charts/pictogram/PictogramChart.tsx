"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Daily coffee consumption by department (cups/day, self-reported).
// 1 cup glyph = 10 cups. Fractional last icons rendered as half-width to
// preserve honesty about the underlying count (Isotype convention).
type Row = { dept: string; cups: number };

const DATA: ReadonlyArray<Row> = [
  { dept: "Engineering", cups: 65 },
  { dept: "Design", cups: 45 },
  { dept: "Sales", cups: 30 },
  { dept: "Marketing", cups: 20 },
];

const UNIT = 10; // one glyph represents ten cups

interface Props {
  width: number;
  height: number;
}

// Stylised coffee cup inside a 20×20 box. Body + handle + steam notch.
// Rendered at any scale via transform so we can draw full- and half-icons.
function CoffeeCup({
  x,
  y,
  size,
  fraction = 1,
}: {
  x: number;
  y: number;
  size: number;
  fraction?: number;
}) {
  const id = `pic-clip-${Math.round(x)}-${Math.round(y)}-${Math.round(fraction * 100)}`;
  const s = size / 20;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <clipPath id={id}>
          <rect x={0} y={0} width={20 * fraction} height={20} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        {/* Cup body: trapezoid */}
        <path
          d="M3.5 7 L16.5 7 L15 17 Q15 18 14 18 L6 18 Q5 18 5 17 Z"
          fill="var(--color-ink)"
        />
        {/* Handle: open arc on right side */}
        <path
          d="M16.5 9 Q19 9.5 19 12 Q19 14.5 16.5 15"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={1.3}
          strokeLinecap="round"
        />
        {/* Steam notch on top lip (two short wavy strokes) */}
        <path
          d="M8 5 Q9 3.5 8 2"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={1.1}
          strokeLinecap="round"
        />
        <path
          d="M12 5 Q13 3.5 12 2"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={1.1}
          strokeLinecap="round"
        />
      </g>
      {/* Half-icon honesty mark: hairline outline of the full cup body so the
          missing half is visible, not erased. */}
      {fraction < 1 && (
        <path
          d="M3.5 7 L16.5 7 L15 17 Q15 18 14 18 L6 18 Q5 18 5 17 Z"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={0.6}
          opacity={0.5}
        />
      )}
    </g>
  );
}

export function PictogramChart({ width, height }: Props) {
  const margin = { top: 24, right: 20, bottom: 40, left: 96 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Reserve the bottom strip for the scale caption.
  const captionGap = 6;
  const rowsArea = Math.max(0, ih - 18 - captionGap);
  const rowH = DATA.length > 0 ? rowsArea / DATA.length : 0;

  // Size each glyph so that the widest row (65 cups → 6.5 icons) fits.
  const maxUnits = Math.max(...DATA.map((d) => d.cups)) / UNIT; // 6.5
  const glyphGap = 4;
  // Solve: maxUnits * glyph + (ceil(maxUnits) - 1) * gap = iw
  // Use a conservative max slot count of ceil(6.5) = 7.
  const maxSlots = Math.ceil(maxUnits);
  const glyph = Math.max(
    8,
    Math.min(rowH - 4, (iw - (maxSlots - 1) * glyphGap) / maxUnits),
  );

  function rowY(i: number) {
    return i * rowH;
  }
  function iconX(j: number) {
    return j * (glyph + glyphGap);
  }

  // Modal row (Engineering — highest consumption) is row 0.
  const modalIdx = 0;
  const modal = DATA[modalIdx];
  const modalUnits = modal.cups / UNIT; // 6.5
  const modalWholeCount = Math.floor(modalUnits);
  const modalFrac = modalUnits - modalWholeCount; // 0.5

  // Anchor targets within the modal row.
  const wholeIconAnchorJ = 0;
  const fracIconAnchorJ = modalWholeCount; // slot of the fractional icon

  function clampRect(r: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const right = Math.max(0, Math.min(iw, r.x + r.width));
    const bottom = Math.max(0, Math.min(ih, r.y + r.height));
    return { x, y, width: right - x, height: bottom - y };
  }

  return (
    <svg width={width} height={height} role="img" aria-label="Pictogram">
      <Group left={margin.left} top={margin.top}>
        {/* Category labels (left of plot) + glyph rows */}
        <g data-data-layer="true">
          {DATA.map((d, i) => {
            const units = d.cups / UNIT;
            const whole = Math.floor(units);
            const frac = units - whole;
            const yTop = rowY(i);
            const yMid = yTop + rowH / 2;
            const iconTop = yMid - glyph / 2;
            return (
              <g key={d.dept}>
                <text
                  x={-12}
                  y={yMid}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink-soft)"
                >
                  {d.dept.toUpperCase()}
                </text>
                {Array.from({ length: whole }).map((_, j) => (
                  <CoffeeCup
                    key={`w-${j}`}
                    x={iconX(j)}
                    y={iconTop}
                    size={glyph}
                  />
                ))}
                {frac > 0 && (
                  <CoffeeCup
                    x={iconX(whole)}
                    y={iconTop}
                    size={glyph}
                    fraction={frac}
                  />
                )}
                {/* Trailing count on the right */}
                <text
                  x={iconX(Math.ceil(units)) + 4}
                  y={yMid}
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink-mute)"
                >
                  {d.cups}
                </text>
              </g>
            );
          })}
        </g>

        {/* Scale caption under the rows */}
        <g data-data-layer="true">
          <text
            x={0}
            y={rowsArea + 18}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            1 CUP = 10 CUPS / DAY
          </text>
        </g>

        {/* 1. Unit glyph — a whole cup stands for 10 cups. Pin the first icon
            of the modal row. */}
        <ExplainAnchor
          selector="unit-glyph"
          index={1}
          pin={{
            x: iconX(wholeIconAnchorJ) + glyph / 2,
            y: rowY(modalIdx) + rowH / 2 - glyph / 2 - 10,
          }}
          rect={clampRect({
            x: iconX(wholeIconAnchorJ) - 2,
            y: rowY(modalIdx) + rowH / 2 - glyph / 2 - 2,
            width: glyph + 4,
            height: glyph + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Fractional glyph — the half-cup is Isotype's honesty feature. */}
        <ExplainAnchor
          selector="fractional-glyph"
          index={2}
          pin={{
            x: iconX(fracIconAnchorJ) + glyph / 2,
            y: rowY(modalIdx) + rowH / 2 + glyph / 2 + 14,
          }}
          rect={clampRect({
            x: iconX(fracIconAnchorJ) - 2,
            y: rowY(modalIdx) + rowH / 2 - glyph / 2 - 2,
            width: glyph + 4,
            height: glyph + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Row label — the category axis lives on the left margin. */}
        <ExplainAnchor
          selector="row-label"
          index={3}
          pin={{ x: -60, y: rowY(modalIdx) + rowH / 2 }}
          rect={{
            x: -margin.left + 4,
            y: rowY(modalIdx),
            width: margin.left - 16,
            height: rowH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Modal row — the department with the most cups. */}
        <ExplainAnchor
          selector="modal-row"
          index={4}
          pin={{
            x: iconX(Math.ceil(modalUnits)) + 20,
            y: rowY(modalIdx) + rowH / 2,
          }}
          rect={clampRect({
            x: 0,
            y: rowY(modalIdx) + 2,
            width: iw,
            height: rowH - 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Scale annotation — "1 cup = 10 cups/day" is the chart's Rosetta
            Stone; without it the glyphs are decoration. */}
        <ExplainAnchor
          selector="scale-annotation"
          index={5}
          pin={{ x: 120, y: rowsArea + 18 }}
          rect={{
            x: 0,
            y: rowsArea + 6,
            width: iw,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
