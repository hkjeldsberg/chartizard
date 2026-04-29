"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Shmoo plot — a 16×16 pass/fail grid over (V_cc, clock frequency) for a
// memory die. Fail rule: voltage too low for the requested clock. The
// boundary isFail(vcc, freq) = vcc < 1.0 + 0.002 * freq carves a diagonal
// that separates the passing upper-left from the failing lower-right.
const COLS = 16; // V_cc steps
const ROWS = 16; // clock-freq steps
const VCC_DOMAIN: [number, number] = [1.0, 1.5];
const FREQ_DOMAIN: [number, number] = [100, 400];

function isFail(vcc: number, freq: number): boolean {
  return vcc < 1.0 + 0.002 * freq;
}

// Cell centre values — sampled uniformly across the operating envelope.
function cellValue(col: number, row: number): { vcc: number; freq: number } {
  const vcc =
    VCC_DOMAIN[0] + ((col + 0.5) / COLS) * (VCC_DOMAIN[1] - VCC_DOMAIN[0]);
  const freq =
    FREQ_DOMAIN[0] + ((row + 0.5) / ROWS) * (FREQ_DOMAIN[1] - FREQ_DOMAIN[0]);
  return { vcc, freq };
}

interface Props {
  width: number;
  height: number;
}

export function ShmooPlot({ width, height }: Props) {
  const margin = { top: 18, right: 16, bottom: 44, left: 50 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: VCC_DOMAIN, range: [0, iw] });
  const yScale = scaleLinear({ domain: FREQ_DOMAIN, range: [ih, 0] });

  const cellW = iw / COLS;
  const cellH = ih / ROWS;

  // Boundary contour — for each row, find the V_cc at which the pass/fail
  // rule flips. Yields a single (vcc, freq) point per row that defines the
  // operating-margin edge. The line is the "design margin" the chart exists
  // to communicate.
  const boundary = useMemo(() => {
    const pts: Array<[number, number]> = [];
    for (let row = 0; row < ROWS; row++) {
      const freq =
        FREQ_DOMAIN[0] +
        ((row + 0.5) / ROWS) * (FREQ_DOMAIN[1] - FREQ_DOMAIN[0]);
      const vccEdge = 1.0 + 0.002 * freq;
      pts.push([vccEdge, freq]);
    }
    return pts;
  }, []);

  // Representative cells for the two region anchors.
  const passCell = { col: 3, row: 12 }; // upper-left: high V_cc room, low freq
  const failCell = { col: 2, row: 2 }; // lower-right in y-flipped grid: low V, high freq
  const passCentre = cellValue(passCell.col, passCell.row);
  const failCentre = cellValue(failCell.col, failCell.row);

  // A spot along the boundary for the contour anchor pin.
  const boundaryAnchorIdx = Math.floor(ROWS * 0.55);
  const boundaryAnchor = boundary[boundaryAnchorIdx];

  const boundaryPathD = boundary
    .map(
      ([vcc, freq], i) =>
        `${i === 0 ? "M" : "L"}${xScale(vcc).toFixed(2)} ${yScale(freq).toFixed(2)}`,
    )
    .join(" ");

  return (
    <svg width={width} height={height} role="img" aria-label="Shmoo plot">
      <Group left={margin.left} top={margin.top}>
        {/* Cells — pass (light) and fail (dark, hatched visually via opacity). */}
        <g data-data-layer="true">
          {Array.from({ length: ROWS }).map((_, row) =>
            Array.from({ length: COLS }).map((__, col) => {
              const { vcc, freq } = cellValue(col, row);
              const fail = isFail(vcc, freq);
              const x = (col / COLS) * iw;
              // Row 0 sits at high freq visually (top) after the y inversion
              // of freq; invert row for correct screen-y.
              const y = ih - ((row + 1) / ROWS) * ih;
              return (
                <rect
                  key={`${row}-${col}`}
                  x={x}
                  y={y}
                  width={cellW}
                  height={cellH}
                  fill={
                    fail
                      ? "rgba(26,22,20,0.72)"
                      : "rgba(26,22,20,0.10)"
                  }
                  stroke="var(--color-surface)"
                  strokeWidth={0.6}
                />
              );
            }),
          )}
        </g>

        {/* Boundary contour — the pass/fail edge. */}
        <ExplainAnchor
          selector="boundary"
          index={1}
          pin={{
            x: Math.min(iw - 10, xScale(boundaryAnchor[0]) + 18),
            y: Math.max(10, yScale(boundaryAnchor[1]) - 14),
          }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <path
            d={boundaryPathD}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.6}
            strokeDasharray="3 3"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Pass region anchor — one representative passing cell. */}
        <ExplainAnchor
          selector="pass-cell"
          index={2}
          pin={{
            x: xScale(passCentre.vcc) + 18,
            y: yScale(passCentre.freq) - 14,
          }}
          rect={{
            x: (passCell.col / COLS) * iw,
            y: ih - ((passCell.row + 1) / ROWS) * ih,
            width: cellW,
            height: cellH,
          }}
        >
          <rect
            x={(passCell.col / COLS) * iw}
            y={ih - ((passCell.row + 1) / ROWS) * ih}
            width={cellW}
            height={cellH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
        </ExplainAnchor>

        {/* Fail region anchor — one representative failing cell. */}
        <ExplainAnchor
          selector="fail-cell"
          index={3}
          pin={{
            x: xScale(failCentre.vcc) - 18,
            y: yScale(failCentre.freq) + 16,
          }}
          rect={{
            x: (failCell.col / COLS) * iw,
            y: ih - ((failCell.row + 1) / ROWS) * ih,
            width: cellW,
            height: cellH,
          }}
        >
          <rect
            x={(failCell.col / COLS) * iw}
            y={ih - ((failCell.row + 1) / ROWS) * ih}
            width={cellW}
            height={cellH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
        </ExplainAnchor>

        {/* X-axis — V_cc */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickFormat={(v) => Number(v).toFixed(1)}
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
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            V_CC (V)
          </text>
        </ExplainAnchor>

        {/* Y-axis — clock frequency */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={4}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickFormat={(v) => String(Number(v))}
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
            x={-44}
            y={-6}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            F (MHZ)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
