"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// 50 US states as hexagons, point-top orientation, laid out in the
// approximately-geographically-correct template popularised by the Wall
// Street Journal. Uses the SAME 2023-ballpark median household income
// dataset as the tile-map companion so the two charts form an A/B study.
//
// Odd rows are offset horizontally by half a hex width. Positions are
// hand-encoded using the widely-circulated WSJ / Mike Bostock hex-state
// template — AK parked upper-left as a convention, HI drifted below the
// southwest, FL carrying the southeast corner alone.
type State = { code: string; col: number; row: number; income: number };

const STATES: ReadonlyArray<State> = [
  // Row 0 — AK floats upper-left, ME anchors upper-right.
  { code: "AK", col: 0, row: 0, income: 86 },
  { code: "ME", col: 11, row: 0, income: 68 },
  // Row 1
  { code: "VT", col: 10, row: 1, income: 74 },
  { code: "NH", col: 11, row: 1, income: 90 },
  // Row 2 — Northern tier.
  { code: "WA", col: 1, row: 2, income: 91 },
  { code: "ID", col: 2, row: 2, income: 70 },
  { code: "MT", col: 3, row: 2, income: 66 },
  { code: "ND", col: 4, row: 2, income: 73 },
  { code: "MN", col: 5, row: 2, income: 85 },
  { code: "WI", col: 6, row: 2, income: 72 },
  { code: "MI", col: 8, row: 2, income: 69 },
  { code: "NY", col: 9, row: 2, income: 82 },
  { code: "MA", col: 10, row: 2, income: 96 },
  // Row 3
  { code: "OR", col: 1, row: 3, income: 76 },
  { code: "UT", col: 2, row: 3, income: 87 },
  { code: "WY", col: 3, row: 3, income: 72 },
  { code: "SD", col: 4, row: 3, income: 70 },
  { code: "IA", col: 5, row: 3, income: 73 },
  { code: "IL", col: 6, row: 3, income: 79 },
  { code: "IN", col: 7, row: 3, income: 68 },
  { code: "OH", col: 8, row: 3, income: 67 },
  { code: "PA", col: 9, row: 3, income: 75 },
  { code: "NJ", col: 10, row: 3, income: 97 },
  { code: "CT", col: 11, row: 3, income: 90 },
  { code: "RI", col: 12, row: 3, income: 81 },
  // Row 4
  { code: "CA", col: 1, row: 4, income: 92 },
  { code: "NV", col: 2, row: 4, income: 74 },
  { code: "CO", col: 3, row: 4, income: 87 },
  { code: "NE", col: 4, row: 4, income: 71 },
  { code: "MO", col: 5, row: 4, income: 65 },
  { code: "KY", col: 6, row: 4, income: 60 },
  { code: "WV", col: 7, row: 4, income: 55 },
  { code: "VA", col: 8, row: 4, income: 87 },
  { code: "MD", col: 9, row: 4, income: 98 },
  { code: "DE", col: 10, row: 4, income: 79 },
  // Row 5
  { code: "AZ", col: 2, row: 5, income: 72 },
  { code: "NM", col: 3, row: 5, income: 59 },
  { code: "KS", col: 4, row: 5, income: 69 },
  { code: "AR", col: 5, row: 5, income: 56 },
  { code: "TN", col: 6, row: 5, income: 64 },
  { code: "NC", col: 8, row: 5, income: 66 },
  { code: "SC", col: 9, row: 5, income: 63 },
  { code: "DC", col: 10, row: 5, income: 93 },
  // Row 6
  { code: "OK", col: 4, row: 6, income: 61 },
  { code: "LA", col: 5, row: 6, income: 56 },
  { code: "MS", col: 6, row: 6, income: 52 },
  { code: "AL", col: 7, row: 6, income: 60 },
  { code: "GA", col: 8, row: 6, income: 71 },
  { code: "FL", col: 10, row: 6, income: 67 },
  // Row 7
  { code: "HI", col: 1, row: 7, income: 94 },
  { code: "TX", col: 4, row: 7, income: 73 },
];

const COLS = 13;
const ROWS = 8;

const INCOME_MIN = 50;
const INCOME_MAX = 100;

interface Props {
  width: number;
  height: number;
}

// Build a point-top regular hexagon path centred at origin, radius r
// (distance from centre to a vertex). Point-top: two vertices top/bottom,
// four on the sides. Width = √3 · r, height = 2r.
function hexPath(r: number): string {
  const s = Math.sqrt(3) / 2;
  // Vertices in order (clockwise from top).
  const pts: Array<[number, number]> = [
    [0, -r],
    [s * r, -r / 2],
    [s * r, r / 2],
    [0, r],
    [-s * r, r / 2],
    [-s * r, -r / 2],
  ];
  return (
    "M" +
    pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join("L") +
    "Z"
  );
}

export function HexbinMapChart({ width, height }: Props) {
  const margin = { top: 24, right: 80, bottom: 32, left: 24 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Point-top hex layout metrics.
  // Horizontal column-centre spacing = √3 · r.
  // Vertical row-centre spacing = 1.5 · r.
  // The grid occupies:
  //   width  = (COLS - 0.5) · √3 · r + √3 · r = COLS · √3 · r + (√3/2)·r (odd-row offset)
  //   height = (ROWS - 1) · 1.5 · r + 2r
  // Solve for r to fit inside (iw, ih).
  const horizSpanUnits = COLS + 0.5; // widest odd-row shift + full right hex
  const vertSpanUnits = (ROWS - 1) * 1.5 + 2;
  const rFromW = iw / (horizSpanUnits * Math.sqrt(3));
  const rFromH = ih / vertSpanUnits;
  const r = Math.max(0, Math.min(rFromW, rFromH));
  const s3 = Math.sqrt(3);

  // Centre the grid within the plot area.
  const gridW = (COLS - 1) * s3 * r + s3 * r + (s3 / 2) * r; // account for odd-row offset
  const gridH = (ROWS - 1) * 1.5 * r + 2 * r;
  const offsetX = Math.max(0, (iw - gridW) / 2) + (s3 / 2) * r;
  const offsetY = Math.max(0, (ih - gridH) / 2) + r;

  const hexCentre = (col: number, row: number) => {
    const xOdd = row % 2 === 1 ? s3 * r * 0.5 : 0;
    return {
      cx: offsetX + col * s3 * r + xOdd,
      cy: offsetY + row * 1.5 * r,
    };
  };

  const path = hexPath(r);

  const incomeT = (income: number) =>
    Math.max(0, Math.min(1, (income - INCOME_MIN) / (INCOME_MAX - INCOME_MIN)));

  const fillFor = (income: number) => {
    const t = incomeT(income);
    const opacity = 0.1 + t * 0.85;
    return `rgba(26,22,20,${opacity.toFixed(3)})`;
  };

  const labelFillFor = (income: number) =>
    incomeT(income) > 0.55 ? "var(--color-page)" : "var(--color-ink)";

  // Focal states for anchors.
  const ma = STATES.find((s) => s.code === "MA")!;
  const ak = STATES.find((s) => s.code === "AK")!;
  const md = STATES.find((s) => s.code === "MD")!;
  const nj = STATES.find((s) => s.code === "NJ")!;
  const ca = STATES.find((s) => s.code === "CA")!;

  const maC = hexCentre(ma.col, ma.row);
  const akC = hexCentre(ak.col, ak.row);
  const mdC = hexCentre(md.col, md.row);
  const njC = hexCentre(nj.col, nj.row);
  const caC = hexCentre(ca.col, ca.row);

  // High-income cluster (Northeast) — rect around MA/CT/NJ/MD/DE/NH/VT.
  const clusterCells = STATES.filter((s) =>
    ["MA", "CT", "RI", "NH", "VT", "NJ", "MD", "DE", "NY", "DC"].includes(s.code),
  );
  const clusterXs = clusterCells.map((s) => hexCentre(s.col, s.row).cx);
  const clusterYs = clusterCells.map((s) => hexCentre(s.col, s.row).cy);
  const clusterPad = s3 * r * 0.7;
  const clusterRect = {
    x: Math.max(0, Math.min(...clusterXs) - clusterPad),
    y: Math.max(0, Math.min(...clusterYs) - clusterPad),
    width: 0,
    height: 0,
  };
  clusterRect.width = Math.min(
    iw - clusterRect.x,
    Math.max(...clusterXs) + clusterPad - clusterRect.x,
  );
  clusterRect.height = Math.min(
    ih - clusterRect.y,
    Math.max(...clusterYs) + clusterPad - clusterRect.y,
  );

  // Hexagon half-width/height for rect clamping around a single hex.
  const hexHW = s3 * r * 0.5;
  const hexHH = r;

  // Legend — vertical ramp on the right margin.
  const legendW = 10;
  const legendH = Math.min(ih, 200);
  const legendX = iw + 28;
  const legendY = Math.max(0, (ih - legendH) / 2);
  const legendSteps = 22;

  return (
    <svg width={width} height={height} role="img" aria-label="Hexbin map">
      <Group left={margin.left} top={margin.top}>
        {/* Hexagons */}
        <g data-data-layer="true">
          {STATES.map((s) => {
            const { cx, cy } = hexCentre(s.col, s.row);
            return (
              <g key={s.code} transform={`translate(${cx}, ${cy})`}>
                <path d={path} fill={fillFor(s.income)} />
                {r >= 14 && (
                  <text
                    x={0}
                    y={0}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize={Math.max(8, Math.min(12, r * 0.58))}
                    fill={labelFillFor(s.income)}
                  >
                    {s.code}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Anchor 1 — a single hexagon (MA, a recognisable high-income state) */}
        <ExplainAnchor
          selector="hexagon"
          index={1}
          pin={{ x: maC.cx, y: Math.max(0, maC.cy - hexHH - 10) }}
          rect={{
            x: Math.max(0, maC.cx - hexHW),
            y: Math.max(0, maC.cy - hexHH),
            width: Math.min(iw - Math.max(0, maC.cx - hexHW), hexHW * 2),
            height: Math.min(ih - Math.max(0, maC.cy - hexHH), hexHH * 2),
          }}
        >
          <g transform={`translate(${maC.cx}, ${maC.cy})`}>
            <path
              d={path}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.25}
            />
          </g>
        </ExplainAnchor>

        {/* Anchor 2 — the tessellation / shared-edge property (NJ, shares edges
            with 5-6 neighbours depending on parity) */}
        <ExplainAnchor
          selector="tessellation"
          index={2}
          pin={{ x: Math.min(iw - 8, njC.cx + hexHW + 14), y: njC.cy }}
          rect={{
            x: Math.max(0, njC.cx - hexHW * 2.2),
            y: Math.max(0, njC.cy - hexHH * 2.2),
            width: Math.min(iw - Math.max(0, njC.cx - hexHW * 2.2), hexHW * 4.4),
            height: Math.min(ih - Math.max(0, njC.cy - hexHH * 2.2), hexHH * 4.4),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — the geographic-approximation trade-off (AK, floated
            upper-left by convention — a position that is clearly "wrong"
            geographically) */}
        <ExplainAnchor
          selector="geographic-approximation"
          index={3}
          pin={{ x: akC.cx + hexHW + 14, y: akC.cy }}
          rect={{
            x: Math.max(0, akC.cx - hexHW),
            y: Math.max(0, akC.cy - hexHH),
            width: Math.min(iw - Math.max(0, akC.cx - hexHW), hexHW * 2),
            height: Math.min(ih - Math.max(0, akC.cy - hexHH), hexHH * 2),
          }}
        >
          <g transform={`translate(${akC.cx}, ${akC.cy})`}>
            <path
              d={path}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1}
              strokeDasharray="3 2"
            />
          </g>
        </ExplainAnchor>

        {/* Anchor 4 — the high-income cluster (Northeast corridor) */}
        <ExplainAnchor
          selector="high-income-cluster"
          index={4}
          pin={{
            x: mdC.cx,
            y: Math.min(ih, clusterRect.y + clusterRect.height + 10),
          }}
          rect={clusterRect}
        >
          <rect
            x={clusterRect.x}
            y={clusterRect.y}
            width={clusterRect.width}
            height={clusterRect.height}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="3 2"
          />
        </ExplainAnchor>

        {/* Anchor 5 — the colour ramp / legend */}
        <g data-data-layer="true" transform={`translate(${legendX}, ${legendY})`}>
          {Array.from({ length: legendSteps }).map((_, i) => {
            const t = i / (legendSteps - 1);
            const opacity = 0.1 + t * 0.85;
            const segH = legendH / legendSteps;
            return (
              <rect
                key={i}
                x={0}
                y={legendH - (i + 1) * segH}
                width={legendW}
                height={segH + 0.5}
                fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
              />
            );
          })}
          <text
            x={legendW + 6}
            y={8}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            $100k
          </text>
          <text
            x={legendW + 6}
            y={legendH - 2}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            $50k
          </text>
          <text
            x={legendW + 6}
            y={legendH / 2}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            MHI
          </text>
        </g>
        <ExplainAnchor
          selector="colour-ramp"
          index={5}
          pin={{ x: Math.min(iw - 4, iw - 6), y: legendY + legendH / 2 }}
          rect={{
            x: legendX - 2,
            y: legendY,
            width: legendW + 30,
            height: legendH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6 — a single recognisable state (CA, a big Pacific hex
            that establishes "west = left side") */}
        <ExplainAnchor
          selector="anchor-state"
          index={6}
          pin={{ x: Math.max(0, caC.cx - hexHW - 14), y: caC.cy }}
          rect={{
            x: Math.max(0, caC.cx - hexHW),
            y: Math.max(0, caC.cy - hexHH),
            width: Math.min(iw - Math.max(0, caC.cx - hexHW), hexHW * 2),
            height: Math.min(ih - Math.max(0, caC.cy - hexHH), hexHH * 2),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
