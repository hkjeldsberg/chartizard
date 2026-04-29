"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

type ShapeKind = "terminator" | "process" | "decision";

interface Shape {
  id: string;
  kind: ShapeKind;
  // Centre position in a 0..100 x 0..100 layout space.
  cx: number;
  cy: number;
  // Size in layout space.
  w: number;
  h: number;
  label: string;
  // Optional sub-label (e.g. second line).
  sub?: string;
}

interface Arrow {
  from: string;
  to: string;
  // Optional label printed mid-edge (e.g. "YES" / "NO" on decision branches).
  label?: string;
  // Routing: "straight" draws a single segment; "elbow-h" goes horizontal then
  // vertical; "elbow-v" goes vertical then horizontal. Keeps the geometry
  // predictable without a layout algorithm.
  route?: "straight" | "elbow-h" | "elbow-v";
  // Dashed edge (used for the retry loop).
  dashed?: boolean;
}

// Hand-positioned login-decision flow. Coordinates live in a 0..100 × 0..100
// layout space and are mapped to the plot area by the renderer.
const SHAPES: ReadonlyArray<Shape> = [
  { id: "start", kind: "terminator", cx: 50, cy: 4, w: 30, h: 7, label: "User enters credentials" },
  { id: "validate", kind: "process", cx: 50, cy: 19, w: 34, h: 7, label: "Validate password hash" },
  { id: "hash-ok", kind: "decision", cx: 50, cy: 36, w: 26, h: 12, label: "Hash matches?" },
  { id: "fail", kind: "process", cx: 14, cy: 36, w: 24, h: 9, label: "Show error,", sub: "increment failures" },
  { id: "twofa-enabled", kind: "decision", cx: 50, cy: 56, w: 26, h: 12, label: "2FA enabled?" },
  { id: "prompt-2fa", kind: "process", cx: 82, cy: 56, w: 28, h: 7, label: "Prompt for 2FA code" },
  { id: "code-ok", kind: "decision", cx: 82, cy: 74, w: 26, h: 12, label: "Code valid?" },
  { id: "create-session", kind: "process", cx: 50, cy: 82, w: 30, h: 7, label: "Create session" },
  { id: "end", kind: "terminator", cx: 50, cy: 96, w: 36, h: 7, label: "Redirect to dashboard" },
];

const ARROWS: ReadonlyArray<Arrow> = [
  { from: "start", to: "validate", route: "straight" },
  { from: "validate", to: "hash-ok", route: "straight" },
  { from: "hash-ok", to: "fail", label: "NO", route: "straight" },
  // Retry loop: failure path loops back up to the start (dashed).
  { from: "fail", to: "start", route: "elbow-v", dashed: true },
  { from: "hash-ok", to: "twofa-enabled", label: "YES", route: "straight" },
  { from: "twofa-enabled", to: "prompt-2fa", label: "YES", route: "straight" },
  { from: "prompt-2fa", to: "code-ok", route: "straight" },
  { from: "code-ok", to: "create-session", label: "YES", route: "elbow-v" },
  { from: "twofa-enabled", to: "create-session", label: "NO", route: "elbow-v" },
  { from: "create-session", to: "end", route: "straight" },
];

export function FlowchartChart({ width, height }: Props) {
  const margin = { top: 16, right: 20, bottom: 20, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Map layout-space (0..100) to pixels.
  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const shapeById = new Map(SHAPES.map((s) => [s.id, s]));

  // Return the [x, y] anchor on a shape's perimeter closest to a target point,
  // for each shape kind. Keeps arrow endpoints flush against the border
  // without overlapping the interior.
  function anchor(shape: Shape, towards: { x: number; y: number }) {
    const cx = px(shape.cx);
    const cy = py(shape.cy);
    const w = px(shape.w);
    const h = py(shape.h);
    const dx = towards.x - cx;
    const dy = towards.y - cy;
    // Prefer vertical sides for mostly-vertical links, horizontal for mostly-horizontal.
    if (Math.abs(dy) >= Math.abs(dx)) {
      // Exit top or bottom.
      const side = dy > 0 ? 1 : -1;
      return { x: cx, y: cy + (side * h) / 2 };
    }
    const side = dx > 0 ? 1 : -1;
    return { x: cx + (side * w) / 2, y: cy };
  }

  function renderShape(s: Shape) {
    const cx = px(s.cx);
    const cy = py(s.cy);
    const w = px(s.w);
    const h = py(s.h);
    const x = cx - w / 2;
    const y = cy - h / 2;

    if (s.kind === "terminator") {
      return (
        <rect
          key={s.id}
          x={x}
          y={y}
          width={w}
          height={h}
          rx={Math.min(w, h) / 2}
          ry={Math.min(w, h) / 2}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.4}
        />
      );
    }
    if (s.kind === "process") {
      return (
        <rect
          key={s.id}
          x={x}
          y={y}
          width={w}
          height={h}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.4}
        />
      );
    }
    // Diamond — polygon with 4 points.
    const points = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
    return (
      <polygon
        key={s.id}
        points={points}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.4}
      />
    );
  }

  function renderLabel(s: Shape) {
    const cx = px(s.cx);
    const cy = py(s.cy);
    const fontSize = 10;
    if (s.sub) {
      return (
        <g key={`lbl-${s.id}`}>
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={fontSize}
            fill="var(--color-ink)"
          >
            {s.label}
          </text>
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={fontSize}
            fill="var(--color-ink)"
          >
            {s.sub}
          </text>
        </g>
      );
    }
    return (
      <text
        key={`lbl-${s.id}`}
        x={cx}
        y={cy + 3}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={fontSize}
        fill="var(--color-ink)"
      >
        {s.label}
      </text>
    );
  }

  function arrowPath(a: Arrow): { d: string; headX: number; headY: number; midX: number; midY: number; headAngle: number } {
    const from = shapeById.get(a.from)!;
    const to = shapeById.get(a.to)!;
    const fromCentre = { x: px(from.cx), y: py(from.cy) };
    const toCentre = { x: px(to.cx), y: py(to.cy) };
    const start = anchor(from, toCentre);
    const end = anchor(to, fromCentre);

    let d = "";
    let headAngle = 0;
    let midX = (start.x + end.x) / 2;
    let midY = (start.y + end.y) / 2;

    if (a.route === "elbow-h") {
      // horizontal first, then vertical
      d = `M ${start.x} ${start.y} L ${end.x} ${start.y} L ${end.x} ${end.y}`;
      midX = end.x;
      midY = (start.y + end.y) / 2;
      headAngle = end.y > start.y ? 90 : -90;
    } else if (a.route === "elbow-v") {
      // vertical first, then horizontal
      d = `M ${start.x} ${start.y} L ${start.x} ${end.y} L ${end.x} ${end.y}`;
      midX = (start.x + end.x) / 2;
      midY = end.y;
      headAngle = end.x > start.x ? 0 : 180;
    } else {
      d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      headAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
    }
    return { d, headX: end.x, headY: end.y, midX, midY, headAngle };
  }

  // Specific anchors (pre-computed so ExplainAnchor geometry is reliable).
  const processShape = shapeById.get("validate")!; // rectangle — process-node anchor
  const decisionShape = shapeById.get("hash-ok")!; // diamond — decision-node anchor
  const startShape = shapeById.get("start")!; // oval — terminator anchor
  const branchArrow = ARROWS.find((a) => a.from === "hash-ok" && a.to === "twofa-enabled")!;
  const branchGeom = arrowPath(branchArrow);
  const loopArrow = ARROWS.find((a) => a.from === "fail" && a.to === "start")!;
  const loopGeom = arrowPath(loopArrow);
  const flowArrow = ARROWS.find((a) => a.from === "start" && a.to === "validate")!;
  const flowGeom = arrowPath(flowArrow);

  // Shape-vocabulary anchor: pin it near the top-right where we render a small
  // legend that names the three allowed shapes.
  const legendX = iw - 92;
  const legendY = 2;
  const legendW = 92;
  const legendH = 42;

  return (
    <svg width={width} height={height} role="img" aria-label="Flowchart">
      <Group left={margin.left} top={margin.top}>
        {/* Arrows first so shapes paint on top */}
        <g data-data-layer="true">
          {ARROWS.map((a, i) => {
            const geom = arrowPath(a);
            const headSize = 5;
            const rad = (geom.headAngle * Math.PI) / 180;
            // Pull the arrowhead tip back slightly so it doesn't overrun the shape border.
            const backX = geom.headX - Math.cos(rad) * 2;
            const backY = geom.headY - Math.sin(rad) * 2;
            // Arrowhead as a triangle with tip at (backX, backY).
            const p1x = backX;
            const p1y = backY;
            const p2x = backX - Math.cos(rad) * headSize + Math.cos(rad - Math.PI / 2) * (headSize * 0.55);
            const p2y = backY - Math.sin(rad) * headSize + Math.sin(rad - Math.PI / 2) * (headSize * 0.55);
            const p3x = backX - Math.cos(rad) * headSize - Math.cos(rad - Math.PI / 2) * (headSize * 0.55);
            const p3y = backY - Math.sin(rad) * headSize - Math.sin(rad - Math.PI / 2) * (headSize * 0.55);
            return (
              <g key={`arrow-${i}`}>
                <path
                  d={geom.d}
                  fill="none"
                  stroke="var(--color-ink-mute)"
                  strokeWidth={1.2}
                  strokeDasharray={a.dashed ? "3 3" : undefined}
                  opacity={a.dashed ? 0.7 : 0.9}
                />
                <polygon
                  points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`}
                  fill="var(--color-ink-mute)"
                  opacity={a.dashed ? 0.7 : 0.9}
                />
                {a.label && (
                  <text
                    x={geom.midX + 6}
                    y={geom.midY - 4}
                    fontFamily="var(--font-mono)"
                    fontSize={9}
                    fill="var(--color-ink-soft)"
                  >
                    {a.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Shapes */}
        <g data-data-layer="true">
          {SHAPES.map((s) => renderShape(s))}
        </g>

        {/* Labels */}
        <g data-data-layer="true">
          {SHAPES.map((s) => renderLabel(s))}
        </g>

        {/* Shape-vocabulary legend (only the three canonical shapes) */}
        <g data-data-layer="true" transform={`translate(${legendX}, ${legendY})`}>
          <rect
            x={0}
            y={0}
            width={legendW}
            height={legendH}
            fill="var(--color-surface)"
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
          {/* oval */}
          <rect x={6} y={4} width={14} height={7} rx={3.5} ry={3.5} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
          <text x={24} y={11} fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">
            START/END
          </text>
          {/* rectangle */}
          <rect x={6} y={16} width={14} height={7} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
          <text x={24} y={23} fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">
            PROCESS
          </text>
          {/* diamond */}
          <polygon
            points={`13,28 20,33.5 13,39 6,33.5`}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          <text x={24} y={35} fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">
            DECISION
          </text>
        </g>

        {/* Anchors */}

        {/* 1. terminator (start oval) */}
        <ExplainAnchor
          selector="terminator"
          index={1}
          pin={{ x: px(startShape.cx) + px(startShape.w) / 2 + 12, y: py(startShape.cy) }}
          rect={{
            x: Math.max(0, px(startShape.cx) - px(startShape.w) / 2),
            y: Math.max(0, py(startShape.cy) - py(startShape.h) / 2),
            width: Math.min(iw, px(startShape.w)),
            height: Math.min(ih, py(startShape.h)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. process-node (Validate rectangle) */}
        <ExplainAnchor
          selector="process-node"
          index={2}
          pin={{ x: px(processShape.cx) - px(processShape.w) / 2 - 12, y: py(processShape.cy) }}
          rect={{
            x: Math.max(0, px(processShape.cx) - px(processShape.w) / 2),
            y: Math.max(0, py(processShape.cy) - py(processShape.h) / 2),
            width: Math.min(iw, px(processShape.w)),
            height: Math.min(ih, py(processShape.h)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. decision-node (Hash-matches diamond) */}
        <ExplainAnchor
          selector="decision-node"
          index={3}
          pin={{ x: px(decisionShape.cx) + px(decisionShape.w) / 2 + 14, y: py(decisionShape.cy) - 10 }}
          rect={{
            x: Math.max(0, px(decisionShape.cx) - px(decisionShape.w) / 2),
            y: Math.max(0, py(decisionShape.cy) - py(decisionShape.h) / 2),
            width: Math.min(iw, px(decisionShape.w)),
            height: Math.min(ih, py(decisionShape.h)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. flow-arrow (start -> validate edge) */}
        <ExplainAnchor
          selector="flow-arrow"
          index={4}
          pin={{ x: flowGeom.midX + 14, y: flowGeom.midY }}
          rect={{
            x: Math.max(0, Math.min(flowGeom.midX - 10, iw - 20)),
            y: Math.max(0, Math.min(py(startShape.cy) + py(startShape.h) / 2, ih - 10)),
            width: 20,
            height: Math.max(6, py(processShape.cy) - py(processShape.h) / 2 - (py(startShape.cy) + py(startShape.h) / 2)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. branch (YES/NO off a decision) — anchor on the YES edge leaving hash-ok */}
        <ExplainAnchor
          selector="branch"
          index={5}
          pin={{ x: branchGeom.midX + 18, y: branchGeom.midY - 4 }}
          rect={{
            x: Math.max(0, branchGeom.midX - 10),
            y: Math.max(0, py(decisionShape.cy) + py(decisionShape.h) / 2),
            width: 20,
            height: Math.max(
              8,
              py(shapeById.get("twofa-enabled")!.cy) - py(shapeById.get("twofa-enabled")!.h) / 2 -
                (py(decisionShape.cy) + py(decisionShape.h) / 2),
            ),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. loop (dashed retry edge back to start) */}
        <ExplainAnchor
          selector="loop"
          index={6}
          pin={{ x: Math.max(8, px(shapeById.get("fail")!.cx) - px(shapeById.get("fail")!.w) / 2 - 12), y: (py(shapeById.get("fail")!.cy) + py(startShape.cy)) / 2 }}
          rect={{
            x: 0,
            y: Math.max(0, py(startShape.cy) - py(startShape.h) / 2 - 2),
            width: Math.max(8, px(shapeById.get("fail")!.cx) - px(shapeById.get("fail")!.w) / 2),
            height: Math.min(
              ih - (py(startShape.cy) - py(startShape.h) / 2 - 2),
              py(shapeById.get("fail")!.cy) - (py(startShape.cy) - py(startShape.h) / 2 - 2),
            ),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. shape-vocabulary (legend block at top-right) */}
        <ExplainAnchor
          selector="shape-vocabulary"
          index={7}
          pin={{ x: Math.min(iw - 6, legendX + legendW + 10), y: legendY + legendH / 2 }}
          rect={{
            x: Math.max(0, legendX),
            y: Math.max(0, legendY),
            width: Math.min(iw - Math.max(0, legendX), legendW),
            height: Math.min(ih - Math.max(0, legendY), legendH),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
