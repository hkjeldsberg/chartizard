"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Causal Loop Diagram — "Limits to Growth" system (Forrester 1956 / Meadows 1972).
// Variables are labelled nodes; arrows are curved and carry polarity symbols (+ or −).
// Two feedback loops are annotated:
//   R1 (reinforcing): Population → (+) Births → (+) Population
//   B1 (balancing):   Population → (+) Resource use → (−) Resources available
//                     → (−) Food availability → (−) Births → Population (slows growth)

interface Props {
  width: number;
  height: number;
}

// Layout space: 0..100 × 0..100
interface Node {
  id: string;
  label: string;
  cx: number;
  cy: number;
}

interface CLDArrow {
  id: string;
  from: string;
  to: string;
  polarity: "+" | "−";
  // Bezier control point offset (perpendicular to chord), in layout units.
  // Positive = right-of-direction, negative = left-of-direction.
  curve: number;
}

// Nodes — arranged so the two loops are visually distinct.
// R1 loop: Population (top-left), Births (centre-left)
// B1 loop: Population, Resource use (top-right), Resources available (right),
//           Food availability (bottom-right), Births
const NODES: ReadonlyArray<Node> = [
  { id: "population",          label: "Population",          cx: 28, cy: 42 },
  { id: "births",              label: "Births",               cx: 28, cy: 72 },
  { id: "resource-use",        label: "Resource use",         cx: 62, cy: 22 },
  { id: "resources-available", label: "Resources available",  cx: 85, cy: 42 },
  { id: "food-availability",   label: "Food availability",    cx: 72, cy: 72 },
];

const ARROWS: ReadonlyArray<CLDArrow> = [
  // R1 (reinforcing): Population → Births → Population
  { id: "pop-births",    from: "population", to: "births",    polarity: "+", curve: -14 },
  { id: "births-pop",    from: "births",     to: "population", polarity: "+", curve: -14 },
  // B1 (balancing): Population → Resource use → Resources available → Food → Births
  { id: "pop-res-use",   from: "population",          to: "resource-use",        polarity: "+", curve: 8 },
  { id: "res-use-avail", from: "resource-use",         to: "resources-available", polarity: "−", curve: 8 },
  { id: "avail-food",    from: "resources-available",  to: "food-availability",   polarity: "−", curve: 8 },
  { id: "food-births",   from: "food-availability",    to: "births",              polarity: "−", curve: 8 },
];

const MARKER_ID = "cld-filled-arrow";

export function CausalLoopDiagram({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const nodeById = new Map(NODES.map((n) => [n.id, n]));

  // Approximate node bounding box for anchor computation (all text labels).
  // We approximate each node as an ellipse with these half-dimensions in layout space.
  const NODE_HW = 13; // half-width in layout units
  const NODE_HH = 5;  // half-height in layout units

  // Return the perimeter point on a node's bounding ellipse toward a target.
  function anchorPoint(node: Node, towards: { x: number; y: number }) {
    const cx = px(node.cx);
    const cy = py(node.cy);
    const hw = px(NODE_HW);
    const hh = py(NODE_HH);
    const dx = towards.x - cx;
    const dy = towards.y - cy;
    const len = Math.hypot(dx / hw, dy / hh) || 1;
    return { x: cx + dx / len, y: cy + dy / len };
  }

  // Build quadratic Bezier path between two nodes.
  interface ArrowGeom {
    d: string;
    headX: number;
    headY: number;
    headAngle: number;
    midX: number;
    midY: number;
    cpX: number;
    cpY: number;
  }

  function buildArrow(a: CLDArrow): ArrowGeom {
    const from = nodeById.get(a.from)!;
    const to = nodeById.get(a.to)!;
    const fromPx = { x: px(from.cx), y: py(from.cy) };
    const toPx   = { x: px(to.cx),   y: py(to.cy)   };
    const start = anchorPoint(from, toPx);
    const end   = anchorPoint(to,   fromPx);

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const perpLen = Math.hypot(dx, dy) || 1;
    // Perpendicular unit vector (right-of-direction)
    const perpX = (-dy / perpLen) * px(a.curve);
    const perpY = ( dx / perpLen) * px(a.curve);

    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const cpX = midX + perpX;
    const cpY = midY + perpY;

    const d = `M ${start.x} ${start.y} Q ${cpX} ${cpY} ${end.x} ${end.y}`;

    // Tangent direction at t=1
    const headDx = end.x - cpX;
    const headDy = end.y - cpY;
    const headAngle = (Math.atan2(headDy, headDx) * 180) / Math.PI;

    return { d, headX: end.x, headY: end.y, headAngle, midX: cpX, midY: cpY, cpX, cpY };
  }

  // Pre-compute all arrow geometries.
  const arrowGeoms = new Map(ARROWS.map((a) => [a.id, buildArrow(a)]));

  function renderNode(n: Node) {
    const cx = px(n.cx);
    const cy = py(n.cy);
    const fontSize = Math.max(8, Math.min(10, iw * 0.022));
    // Multi-word labels: split at space to allow two-line text.
    const words = n.label.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const w of words) {
      if (current.length + w.length + 1 > 12) {
        if (current) lines.push(current);
        current = w;
      } else {
        current = current ? `${current} ${w}` : w;
      }
    }
    if (current) lines.push(current);

    const lineH = fontSize + 1;
    const totalH = lines.length * lineH;

    return (
      <g key={`node-${n.id}`}>
        <ellipse
          cx={cx}
          cy={cy}
          rx={px(NODE_HW)}
          ry={py(NODE_HH) + (lines.length > 1 ? lineH / 2 : 0)}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />
        {lines.map((line, i) => (
          <text
            key={i}
            x={cx}
            y={cy - totalH / 2 + (i + 0.75) * lineH}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={fontSize}
            fill="var(--color-ink)"
          >
            {line}
          </text>
        ))}
      </g>
    );
  }

  // Loop annotation: a small circle with a letter (R1 or B1) and a rotation
  // arrow inside, placed at the visual centre of each loop.
  function renderLoopLabel(
    label: string,
    lx: number,
    ly: number,
    clockwise: boolean,
  ) {
    const cx = px(lx);
    const cy = py(ly);
    const r = Math.min(px(5), py(5));
    // Small arc arrow inside the circle.
    const arcR = r * 0.55;
    // Clockwise arc from 200° to 340° (leaves gap for arrowhead).
    const startAngle = clockwise ? 200 : 340;
    const endAngle   = clockwise ? 340 : 200;
    const rad = (deg: number) => (deg * Math.PI) / 180;
    const ax1 = cx + arcR * Math.cos(rad(startAngle));
    const ay1 = cy + arcR * Math.sin(rad(startAngle));
    const ax2 = cx + arcR * Math.cos(rad(endAngle));
    const ay2 = cy + arcR * Math.sin(rad(endAngle));
    const sweep = clockwise ? 1 : 0;
    const arcPath = `M ${ax1} ${ay1} A ${arcR} ${arcR} 0 1 ${sweep} ${ax2} ${ay2}`;

    return (
      <g key={`loop-${label}`}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
        <text
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={Math.max(7, r * 0.8)}
          fontWeight={700}
          fill="var(--color-ink)"
        >
          {label}
        </text>
        <path
          d={arcPath}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={0.7}
          opacity={0.6}
        />
      </g>
    );
  }

  // Polarity symbol (+/−) placed near the arrowhead.
  function renderPolarity(geom: ArrowGeom, polarity: "+" | "−") {
    const angle = (geom.headAngle * Math.PI) / 180;
    // Offset perpendicular to the arrow, toward the outside of the curve.
    const offsetDist = 8;
    const perpX = -Math.sin(angle) * offsetDist;
    const perpY =  Math.cos(angle) * offsetDist;
    const tx = geom.headX + Math.cos(angle) * -8 + perpX;
    const ty = geom.headY + Math.sin(angle) * -8 + perpY;
    return (
      <text
        x={tx}
        y={ty + 3}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={9}
        fontWeight={700}
        fill="var(--color-ink)"
        opacity={0.9}
      >
        {polarity}
      </text>
    );
  }

  // Representative nodes/arrows for anchors.
  const populationNode       = nodeById.get("population")!;
  const birthsNode           = nodeById.get("births")!;
  const resourcesNode        = nodeById.get("resources-available")!;
  const popBirthsGeom        = arrowGeoms.get("pop-births")!;
  const foodBirthsGeom       = arrowGeoms.get("food-births")!;
  const resUseAvailGeom      = arrowGeoms.get("res-use-avail")!;

  // R1 loop centre — midpoint between Population and Births, offset left.
  const r1Cx = 14;
  const r1Cy = (populationNode.cy + birthsNode.cy) / 2;
  // B1 loop centre — approximate centre of the right loop.
  const b1Cx = 68;
  const b1Cy = 50;

  return (
    <svg width={width} height={height} role="img" aria-label="Causal Loop Diagram">
      <defs>
        <marker
          id={MARKER_ID}
          markerWidth={7}
          markerHeight={7}
          refX={6}
          refY={3.5}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0,0 7,3.5 0,7" fill="var(--color-ink)" />
        </marker>
      </defs>

      <Group left={margin.left} top={margin.top}>
        {/* Arrows */}
        <g data-data-layer="true">
          {ARROWS.map((a) => {
            const geom = arrowGeoms.get(a.id)!;
            return (
              <g key={`arrow-${a.id}`}>
                <path
                  d={geom.d}
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeWidth={1.3}
                  opacity={0.85}
                  markerEnd={`url(#${MARKER_ID})`}
                />
                {renderPolarity(geom, a.polarity)}
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g data-data-layer="true">
          {NODES.map((n) => renderNode(n))}
        </g>

        {/* Loop labels */}
        <g data-data-layer="true">
          {renderLoopLabel("R1", r1Cx, r1Cy, true)}
          {renderLoopLabel("B1", b1Cx, b1Cy, false)}
        </g>

        {/* ----- Anchors ----- */}

        {/* 1. A node (Population) */}
        <ExplainAnchor
          selector="node-variable"
          index={1}
          pin={{ x: px(populationNode.cx) - px(NODE_HW) - 14, y: py(populationNode.cy) }}
          rect={{
            x: Math.max(0, px(populationNode.cx) - px(NODE_HW)),
            y: Math.max(0, py(populationNode.cy) - py(NODE_HH) - 2),
            width: Math.min(iw, px(NODE_HW) * 2),
            height: Math.min(ih, py(NODE_HH) * 2 + 4),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. A (+) polarity arrow: Population → Births */}
        <ExplainAnchor
          selector="positive-polarity"
          index={2}
          pin={{ x: px(populationNode.cx) - px(NODE_HW) - 14, y: (py(populationNode.cy) + py(birthsNode.cy)) / 2 }}
          rect={{
            x: Math.max(0, px(populationNode.cx) - px(NODE_HW) - 6),
            y: Math.max(0, py(populationNode.cy) + py(NODE_HH)),
            width: Math.min(iw, px(NODE_HW) * 2 + 12),
            height: Math.min(
              ih - (py(populationNode.cy) + py(NODE_HH)),
              py(birthsNode.cy) - py(NODE_HH) - (py(populationNode.cy) + py(NODE_HH)),
            ),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. A (−) polarity arrow: Resources available → Food availability */}
        <ExplainAnchor
          selector="negative-polarity"
          index={3}
          pin={{ x: px(resourcesNode.cx) + px(NODE_HW) + 14, y: (py(resourcesNode.cy) + py(72)) / 2 }}
          rect={{
            x: Math.max(0, px(resourcesNode.cx) - px(NODE_HW) - 4),
            y: Math.max(0, py(resourcesNode.cy) + py(NODE_HH)),
            width: Math.min(iw - (px(resourcesNode.cx) - px(NODE_HW) - 4), px(NODE_HW) * 2 + 8),
            height: Math.min(
              ih - (py(resourcesNode.cy) + py(NODE_HH)),
              py(72) - py(NODE_HH) - (py(resourcesNode.cy) + py(NODE_HH)),
            ),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Reinforcing loop (R1) label */}
        <ExplainAnchor
          selector="reinforcing-loop"
          index={4}
          pin={{ x: px(r1Cx), y: py(r1Cy) - px(5) - 10 }}
          rect={{
            x: Math.max(0, px(r1Cx) - px(5) - 4),
            y: Math.max(0, py(r1Cy) - py(5) - 4),
            width: Math.min(iw, px(10) + 8),
            height: Math.min(ih, py(10) + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Balancing loop (B1) label */}
        <ExplainAnchor
          selector="balancing-loop"
          index={5}
          pin={{ x: px(b1Cx) + px(5) + 12, y: py(b1Cy) }}
          rect={{
            x: Math.max(0, px(b1Cx) - px(5) - 4),
            y: Math.max(0, py(b1Cy) - py(5) - 4),
            width: Math.min(iw - (px(b1Cx) - px(5) - 4), px(10) + 8),
            height: Math.min(ih - (py(b1Cy) - py(5) - 4), py(10) + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Feedback loop concept (arrow connecting back: Births → Population) */}
        <ExplainAnchor
          selector="feedback-loop"
          index={6}
          pin={{ x: px(populationNode.cx) + px(NODE_HW) + 14, y: (py(populationNode.cy) + py(birthsNode.cy)) / 2 }}
          rect={{
            x: Math.max(0, px(populationNode.cx) + px(NODE_HW) - 4),
            y: Math.max(0, py(populationNode.cy)),
            width: Math.min(iw - (px(populationNode.cx) + px(NODE_HW) - 4), 12),
            height: Math.min(ih - py(populationNode.cy), py(birthsNode.cy) - py(populationNode.cy)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Polarity symbol at arrowhead (near food → births polarity label) */}
        <ExplainAnchor
          selector="polarity-symbol"
          index={7}
          pin={{
            x: foodBirthsGeom.headX + 14,
            y: foodBirthsGeom.headY - 8,
          }}
          rect={{
            x: Math.max(0, foodBirthsGeom.headX - 14),
            y: Math.max(0, foodBirthsGeom.headY - 14),
            width: Math.min(iw - Math.max(0, foodBirthsGeom.headX - 14), 28),
            height: Math.min(ih - Math.max(0, foodBirthsGeom.headY - 14), 28),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
