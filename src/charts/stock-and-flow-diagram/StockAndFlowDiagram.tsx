"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Stock-and-Flow Diagram — Forrester's quantitative systems-dynamics notation.
// Canonical population model:
//   Source cloud → [Birth rate valve] → Population (stock) → [Death rate valve] → Sink cloud
// Auxiliaries:
//   Birth fraction (circle) →info→ Birth rate valve
//   Life expectancy (circle) →info→ Death rate valve
//   Population (stock)       →info→ Birth rate valve (feedback)

interface Props {
  width: number;
  height: number;
}

// Layout in a 0..100 × 0..100 space, mapped to the plot rectangle.
// Flow chain runs along a horizontal "pipe line" at y = 46.
const PIPE_Y = 46;

// Horizontal positions for the main chain elements.
const X_SOURCE = 8;       // source cloud centre
const X_BIRTH  = 26;      // birth-rate valve centre
const X_STOCK_L = 40;     // stock left edge
const X_STOCK_R = 64;     // stock right edge
const X_STOCK_C = (X_STOCK_L + X_STOCK_R) / 2;
const X_DEATH  = 78;      // death-rate valve centre
const X_SINK   = 96;      // sink cloud centre

// Auxiliary circles.
const AUX_BIRTH_FRACTION = { cx: 26, cy: 16, label: "Birth fraction" };
const AUX_LIFE_EXPECT    = { cx: 78, cy: 16, label: "Life expectancy" };

// Stock rectangle vertical half-height.
const STOCK_HH = 8;

export function StockAndFlowDiagram({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  // --- Marker defs (info-arrow arrowhead) ------------------------------
  const INFO_MARKER = "sfd-info-arrow";

  // --- Shape renderers -------------------------------------------------

  function renderCloud(cx: number, cy: number, r: number) {
    // A small cloud outline built from five overlapping arcs — a single path
    // with circular bumps along the top and bottom.
    // Work in pixel space directly.
    const bumps = 5;
    // Build path: start at left, loop over top bumps, down right, loop over bottom bumps.
    // Simpler: compose from circles as one <path> per bump plus a baseline ellipse.
    // We use one <g> with multiple <circle> elements to fake the lobed silhouette,
    // then mask via matching fill+stroke so it reads as one cloud outline.
    const lobeR = r * 0.55;
    const positions: Array<[number, number]> = [
      [cx - r * 0.85, cy + r * 0.1],
      [cx - r * 0.3, cy - r * 0.4],
      [cx + r * 0.35, cy - r * 0.35],
      [cx + r * 0.9, cy + r * 0.05],
      [cx + r * 0.15, cy + r * 0.45],
      [cx - r * 0.45, cy + r * 0.45],
    ];
    return (
      <g>
        {positions.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={lobeR}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.1}
          />
        ))}
        {/* Inner fill to mask the overlapping strokes so the silhouette reads
            as a single cloud — a surface-filled circle over the centre. */}
        <circle
          cx={cx}
          cy={cy + r * 0.05}
          r={r * 0.6}
          fill="var(--color-surface)"
          stroke="none"
        />
      </g>
    );
  }

  // Flow "pipe" between two x-positions on PIPE_Y, with a valve (butterfly)
  // centred on valveX. Pipe = two parallel horizontal lines.
  function renderPipeSegment(x1: number, x2: number) {
    const y = py(PIPE_Y);
    const offset = Math.max(3, py(2.2));
    return (
      <g>
        <line
          x1={x1}
          x2={x2}
          y1={y - offset}
          y2={y - offset}
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />
        <line
          x1={x1}
          x2={x2}
          y1={y + offset}
          y2={y + offset}
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />
      </g>
    );
  }

  // Valve symbol: an hourglass / butterfly — two triangles meeting at their tips,
  // with a small circle at the pinch (the flow-rate variable anchor).
  function renderValve(cx: number, cy: number, size: number, label: string) {
    const halfW = size * 0.9;
    const halfH = size * 0.7;
    // Two triangles meeting at (cx, cy)
    const leftTri = `${cx - halfW},${cy - halfH} ${cx - halfW},${cy + halfH} ${cx},${cy}`;
    const rightTri = `${cx + halfW},${cy - halfH} ${cx + halfW},${cy + halfH} ${cx},${cy}`;
    return (
      <g>
        <polygon
          points={leftTri}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />
        <polygon
          points={rightTri}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />
        {/* Flow-rate variable circle at the pinch */}
        <circle
          cx={cx}
          cy={cy}
          r={size * 0.25}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
        <text
          x={cx}
          y={cy + halfH + 10}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink)"
        >
          {label}
        </text>
      </g>
    );
  }

  // Auxiliary: small circle with a label.
  function renderAuxiliary(cx: number, cy: number, r: number, label: string) {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.1}
        />
        <text
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={8.5}
          fill="var(--color-ink)"
        >
          {label}
        </text>
      </g>
    );
  }

  // Info link: thin curved arrow from (x1,y1) to (x2,y2), with a marker arrowhead.
  function renderInfoLink(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    bend: number,
  ) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.max(0.0001, Math.hypot(dx, dy));
    const nx = -dy / len;
    const ny = dx / len;
    const cpX = mx + nx * bend;
    const cpY = my + ny * bend;
    const d = `M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`;
    return (
      <path
        d={d}
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth={0.9}
        strokeDasharray="2 2"
        markerEnd={`url(#${INFO_MARKER})`}
        opacity={0.9}
      />
    );
  }

  // Stock rectangle with label.
  function renderStock(
    xL: number,
    xR: number,
    cy: number,
    halfH: number,
    label: string,
  ) {
    return (
      <g>
        <rect
          x={xL}
          y={cy - halfH}
          width={xR - xL}
          height={halfH * 2}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.4}
        />
        <text
          x={(xL + xR) / 2}
          y={cy + 4}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={11}
          fontWeight={500}
          fill="var(--color-ink)"
        >
          {label}
        </text>
      </g>
    );
  }

  // --- Precomputed pixel positions ------------------------------------

  const pipeY = py(PIPE_Y);
  const stockL = px(X_STOCK_L);
  const stockR = px(X_STOCK_R);
  const stockC = px(X_STOCK_C);
  const stockHalfH = py(STOCK_HH);
  const sourceCx = px(X_SOURCE);
  const sinkCx = px(X_SINK);
  const birthCx = px(X_BIRTH);
  const deathCx = px(X_DEATH);

  const cloudR = Math.min(py(6), px(4.5));
  const valveSize = Math.min(py(5.5), px(4.5));

  const auxR = Math.min(py(5), px(4.5));
  const auxBirthCx = px(AUX_BIRTH_FRACTION.cx);
  const auxBirthCy = py(AUX_BIRTH_FRACTION.cy);
  const auxLifeCx = px(AUX_LIFE_EXPECT.cx);
  const auxLifeCy = py(AUX_LIFE_EXPECT.cy);

  // Pipe segment endpoints — trimmed so they start/end at cloud/stock/valve edges.
  const seg1Start = sourceCx + cloudR;                // source cloud → birth valve (left piece)
  const seg1End   = birthCx - valveSize * 0.9;
  const seg2Start = birthCx + valveSize * 0.9;        // birth valve → stock (right piece of first flow)
  const seg2End   = stockL;
  const seg3Start = stockR;                           // stock → death valve (left piece of second flow)
  const seg3End   = deathCx - valveSize * 0.9;
  const seg4Start = deathCx + valveSize * 0.9;        // death valve → sink cloud
  const seg4End   = sinkCx - cloudR;

  // --- Anchor geometry -------------------------------------------------

  // 1. Stock rectangle (Population)
  // 2. Flow (pipe + valve) — we anchor on the Birth rate valve
  // 3. Source cloud
  // 4. Auxiliary (Birth fraction)
  // 5. Info link (Birth fraction → Birth rate)
  // 6. Feedback loop (Population → Birth rate info link)
  // 7. Sink cloud

  // Clamp helper keeps rects inside the plot area.
  const clamp = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const h = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width: w, height: h };
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Stock and Flow Diagram">
      <defs>
        <marker
          id={INFO_MARKER}
          markerWidth={6}
          markerHeight={6}
          refX={5}
          refY={3}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0,0 6,3 0,6" fill="var(--color-ink-mute)" />
        </marker>
      </defs>

      <Group left={margin.left} top={margin.top}>
        {/* Flow pipes */}
        <g data-data-layer="true">
          {renderPipeSegment(seg1Start, seg1End)}
          {renderPipeSegment(seg2Start, seg2End)}
          {renderPipeSegment(seg3Start, seg3End)}
          {renderPipeSegment(seg4Start, seg4End)}
        </g>

        {/* Clouds — source and sink */}
        <g data-data-layer="true">
          {renderCloud(sourceCx, pipeY, cloudR)}
          {renderCloud(sinkCx, pipeY, cloudR)}
        </g>

        {/* Stock */}
        <g data-data-layer="true">
          {renderStock(stockL, stockR, pipeY, stockHalfH, "Population")}
        </g>

        {/* Valves (flow rates) */}
        <g data-data-layer="true">
          {renderValve(birthCx, pipeY, valveSize, "Birth rate")}
          {renderValve(deathCx, pipeY, valveSize, "Death rate")}
        </g>

        {/* Info links — drawn before auxiliaries so the arrowhead sits under
            the circle boundary, not over it. */}
        <g data-data-layer="true">
          {/* Birth fraction → Birth rate valve */}
          {renderInfoLink(
            auxBirthCx,
            auxBirthCy + auxR,
            birthCx,
            pipeY - valveSize * 0.7 - 2,
            -4,
          )}
          {/* Life expectancy → Death rate valve */}
          {renderInfoLink(
            auxLifeCx,
            auxLifeCy + auxR,
            deathCx,
            pipeY - valveSize * 0.7 - 2,
            4,
          )}
          {/* Population stock → Birth rate valve (feedback from stock to flow).
              Starts from the top of the stock and curves up-left to the birth valve. */}
          {renderInfoLink(
            stockL + (stockR - stockL) * 0.2,
            pipeY - stockHalfH,
            birthCx + valveSize * 0.3,
            pipeY - valveSize * 0.7 - 2,
            -18,
          )}
          {/* Population stock → Death rate valve (stock self-drives its outflow). */}
          {renderInfoLink(
            stockL + (stockR - stockL) * 0.8,
            pipeY - stockHalfH,
            deathCx - valveSize * 0.3,
            pipeY - valveSize * 0.7 - 2,
            18,
          )}
        </g>

        {/* Auxiliaries */}
        <g data-data-layer="true">
          {renderAuxiliary(auxBirthCx, auxBirthCy, auxR, "Birth")}
          <text
            x={auxBirthCx}
            y={auxBirthCy - auxR - 4}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            fraction
          </text>
          {renderAuxiliary(auxLifeCx, auxLifeCy, auxR, "Life")}
          <text
            x={auxLifeCx}
            y={auxLifeCy - auxR - 4}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            expectancy
          </text>
        </g>

        {/* ----- Anchors ----- */}

        {/* 1. Stock (Population rectangle) */}
        <ExplainAnchor
          selector="stock"
          index={1}
          pin={{ x: stockC, y: pipeY - stockHalfH - 14 }}
          rect={clamp({
            x: stockL - 2,
            y: pipeY - stockHalfH - 2,
            width: stockR - stockL + 4,
            height: stockHalfH * 2 + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Flow (Birth-rate pipe + valve) */}
        <ExplainAnchor
          selector="flow"
          index={2}
          pin={{ x: birthCx, y: pipeY + valveSize * 0.9 + 18 }}
          rect={clamp({
            x: birthCx - valveSize * 1.2,
            y: pipeY - valveSize * 0.9 - 3,
            width: valveSize * 2.4,
            height: valveSize * 1.8 + 6,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Source cloud (left) */}
        <ExplainAnchor
          selector="source-cloud"
          index={3}
          pin={{ x: sourceCx, y: pipeY + cloudR + 16 }}
          rect={clamp({
            x: sourceCx - cloudR - 2,
            y: pipeY - cloudR - 2,
            width: cloudR * 2 + 4,
            height: cloudR * 2 + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Auxiliary (Birth fraction circle) */}
        <ExplainAnchor
          selector="auxiliary"
          index={4}
          pin={{ x: auxBirthCx - auxR - 12, y: auxBirthCy }}
          rect={clamp({
            x: auxBirthCx - auxR - 2,
            y: auxBirthCy - auxR - 12,
            width: auxR * 2 + 4,
            height: auxR * 2 + 16,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Information link (Birth fraction → Birth valve) */}
        <ExplainAnchor
          selector="info-link"
          index={5}
          pin={{ x: (auxBirthCx + birthCx) / 2 - 10, y: (auxBirthCy + pipeY) / 2 - 12 }}
          rect={clamp({
            x: Math.min(auxBirthCx, birthCx) - 4,
            y: Math.min(auxBirthCy + auxR, pipeY - valveSize) - 4,
            width: Math.abs(birthCx - auxBirthCx) + 8,
            height: Math.abs(pipeY - valveSize - (auxBirthCy + auxR)) + 8,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Feedback loop (Population stock → Birth rate info link) */}
        <ExplainAnchor
          selector="feedback"
          index={6}
          pin={{ x: stockL + (stockR - stockL) * 0.2, y: pipeY - stockHalfH - 16 }}
          rect={clamp({
            x: birthCx - 4,
            y: pipeY - stockHalfH - 22,
            width: stockL - birthCx + (stockR - stockL) * 0.25 + 8,
            height: stockHalfH + 22,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Sink cloud (right) */}
        <ExplainAnchor
          selector="sink-cloud"
          index={7}
          pin={{ x: sinkCx, y: pipeY + cloudR + 16 }}
          rect={clamp({
            x: sinkCx - cloudR - 2,
            y: pipeY - cloudR - 2,
            width: cloudR * 2 + 4,
            height: cloudR * 2 + 4,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
