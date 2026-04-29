"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Yourdon & Constantine (1975) Structured Design — structure chart for a
// payroll program. Three-level module hierarchy with data couples (filled
// circle + tail) and control couples (open circle + tail) labelled on edges.
// Dashed rectangle = pre-written library module (I/O).

type ModuleKind = "module" | "library";

interface Mod {
  id: string;
  label: string;
  // Centre in 0..100 layout space.
  cx: number;
  cy: number;
  kind: ModuleKind;
}

interface Couple {
  // Name of the parameter / flag.
  label: string;
  // "data" = filled circle with arrow tail (parameter).
  // "control" = open circle with arrow tail (flag / status).
  kind: "data" | "control";
  // Direction the couple flows along the edge: "down" means parent → child.
  direction: "down" | "up";
  // Horizontal offset from the edge midpoint, in pixels, where the glyph sits.
  offsetX: number;
  // Vertical offset from the edge midpoint, in pixels.
  offsetY: number;
}

interface Edge {
  from: string;
  to: string;
  couples: Couple[];
}

// Three-level tree:
//   Main Payroll
//     ├── Read Employee Records   (library — dashed)
//     ├── Compute Pay
//     │     ├── Compute Gross
//     │     ├── Compute Tax
//     │     └── Compute Net
//     └── Write Paycheck          (library — dashed)
const MODULES: ReadonlyArray<Mod> = [
  { id: "main", label: "Main Payroll", cx: 50, cy: 10, kind: "module" },
  // Level 2
  { id: "read", label: "Read Employee Records", cx: 14, cy: 45, kind: "library" },
  { id: "compute", label: "Compute Pay", cx: 50, cy: 45, kind: "module" },
  { id: "write", label: "Write Paycheck", cx: 86, cy: 45, kind: "library" },
  // Level 3 (children of Compute Pay)
  { id: "gross", label: "Compute Gross", cx: 22, cy: 86, kind: "module" },
  { id: "tax", label: "Compute Tax", cx: 50, cy: 86, kind: "module" },
  { id: "net", label: "Compute Net", cx: 78, cy: 86, kind: "module" },
];

const EDGES: ReadonlyArray<Edge> = [
  // Main → Read Employee Records  (returns emp-record)
  {
    from: "main",
    to: "read",
    couples: [
      { label: "emp-id", kind: "data", direction: "down", offsetX: -10, offsetY: -6 },
      { label: "emp-record", kind: "data", direction: "up", offsetX: 10, offsetY: 6 },
      { label: "eof", kind: "control", direction: "up", offsetX: 10, offsetY: 18 },
    ],
  },
  // Main → Compute Pay
  {
    from: "main",
    to: "compute",
    couples: [
      { label: "hours", kind: "data", direction: "down", offsetX: -12, offsetY: -4 },
      { label: "net-pay", kind: "data", direction: "up", offsetX: 12, offsetY: 4 },
    ],
  },
  // Main → Write Paycheck
  {
    from: "main",
    to: "write",
    couples: [
      { label: "net-pay", kind: "data", direction: "down", offsetX: -10, offsetY: -6 },
      { label: "print-ok", kind: "control", direction: "up", offsetX: 10, offsetY: 6 },
    ],
  },
  // Compute Pay → Compute Gross
  {
    from: "compute",
    to: "gross",
    couples: [
      { label: "hours", kind: "data", direction: "down", offsetX: -8, offsetY: -4 },
      { label: "gross", kind: "data", direction: "up", offsetX: 8, offsetY: 4 },
    ],
  },
  // Compute Pay → Compute Tax
  {
    from: "compute",
    to: "tax",
    couples: [
      { label: "gross", kind: "data", direction: "down", offsetX: -10, offsetY: -4 },
      { label: "tax", kind: "data", direction: "up", offsetX: 10, offsetY: 4 },
    ],
  },
  // Compute Pay → Compute Net
  {
    from: "compute",
    to: "net",
    couples: [
      { label: "tax-rate", kind: "data", direction: "down", offsetX: -10, offsetY: -4 },
      { label: "net", kind: "data", direction: "up", offsetX: 8, offsetY: 4 },
    ],
  },
];

interface Props {
  width: number;
  height: number;
}

export function StructureChart({ width, height }: Props) {
  const margin = { top: 28, right: 24, bottom: 28, left: 24 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Layout → pixel space.
  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  // Module box dimensions (sized to longest label).
  const BOX_W = Math.min(130, Math.max(88, iw / 4.6));
  const BOX_H = 30;

  const byId = new Map(MODULES.map((m) => [m.id, m]));

  // Edge endpoints travel from bottom-centre of parent to top-centre of child.
  function edgeEndpoints(from: Mod, to: Mod) {
    const sx = px(from.cx);
    const sy = py(from.cy) + BOX_H / 2;
    const tx = px(to.cx);
    const ty = py(to.cy) - BOX_H / 2;
    return { sx, sy, tx, ty };
  }

  // Simple elbow path: down, across, down. Yourdon charts prefer straight lines
  // with right-angled bends.
  function edgePath(sx: number, sy: number, tx: number, ty: number) {
    const midY = (sy + ty) / 2;
    return `M ${sx} ${sy} V ${midY} H ${tx} V ${ty}`;
  }

  // Midpoint of the horizontal segment of the elbow — a natural home for the
  // couple glyph.
  function edgeMid(sx: number, sy: number, tx: number, ty: number) {
    const midY = (sy + ty) / 2;
    return { mx: (sx + tx) / 2, my: midY };
  }

  // Arrow head at the top of a child box, pointing down.
  function downArrow(tx: number, ty: number) {
    const size = 4;
    return `${tx},${ty} ${tx - size * 0.55},${ty - size} ${tx + size * 0.55},${ty - size}`;
  }

  // Build geometry once.
  interface EdgeGeom {
    edge: Edge;
    sx: number;
    sy: number;
    tx: number;
    ty: number;
    mx: number;
    my: number;
    d: string;
  }

  const edgeGeoms: EdgeGeom[] = EDGES.map((edge) => {
    const from = byId.get(edge.from)!;
    const to = byId.get(edge.to)!;
    const { sx, sy, tx, ty } = edgeEndpoints(from, to);
    const { mx, my } = edgeMid(sx, sy, tx, ty);
    return { edge, sx, sy, tx, ty, mx, my, d: edgePath(sx, sy, tx, ty) };
  });

  // Render a couple glyph: small circle (filled = data, hollow = control) with
  // a short curved tail indicating direction. Classic Yourdon notation.
  function renderCouple(cx: number, cy: number, c: Couple, key: string) {
    const isData = c.kind === "data";
    const r = 2.3;
    // Tail: a short arc pointing in the flow direction.
    const tailDY = c.direction === "down" ? 6 : -6;
    const tailPath = `M ${cx - 3} ${cy} A 3 3 0 0 ${c.direction === "down" ? 1 : 0} ${cx + 3} ${cy + tailDY / 2}`;
    const arrowY = cy + tailDY;
    const arrowHead = `${cx + 3},${arrowY} ${cx + 1.6},${arrowY - (c.direction === "down" ? 2.2 : -2.2)} ${cx + 4.4},${arrowY - (c.direction === "down" ? 2.2 : -2.2)}`;
    return (
      <g key={key}>
        <path
          d={tailPath}
          fill="none"
          stroke="var(--color-ink-mute)"
          strokeWidth={0.9}
        />
        <polygon points={arrowHead} fill="var(--color-ink-mute)" opacity={0.9} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={isData ? "var(--color-ink)" : "var(--color-surface)"}
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
      </g>
    );
  }

  // Render a module box: rectangle for normal modules, dashed double-sided
  // rectangle for library modules (inner vertical lines inside each short side).
  function renderModule(m: Mod) {
    const cx = px(m.cx);
    const cy = py(m.cy);
    const x = cx - BOX_W / 2;
    const y = cy - BOX_H / 2;
    const isLibrary = m.kind === "library";
    return (
      <g key={`mod-${m.id}`}>
        <rect
          x={x}
          y={y}
          width={BOX_W}
          height={BOX_H}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.3}
        />
        {isLibrary && (
          <>
            {/* Inner vertical rules on each short side — double-sided rectangle
                is the Yourdon glyph for a pre-written / library module. */}
            <line
              x1={x + 4}
              y1={y}
              x2={x + 4}
              y2={y + BOX_H}
              stroke="var(--color-ink)"
              strokeWidth={1}
            />
            <line
              x1={x + BOX_W - 4}
              y1={y}
              x2={x + BOX_W - 4}
              y2={y + BOX_H}
              stroke="var(--color-ink)"
              strokeWidth={1}
            />
          </>
        )}
        <text
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink)"
        >
          {m.label}
        </text>
      </g>
    );
  }

  // Anchor helper: clamp rect to plot.
  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const h = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width: w, height: h };
  };

  // Representative nodes / edges for anchors.
  const mainMod = byId.get("main")!;
  const computeMod = byId.get("compute")!;
  const readLib = byId.get("read")!;
  const grossMod = byId.get("gross")!;
  const mainComputeEdge = edgeGeoms.find((g) => g.edge.from === "main" && g.edge.to === "compute")!;
  const mainReadEdge = edgeGeoms.find((g) => g.edge.from === "main" && g.edge.to === "read")!;

  // Find specific couple glyph positions for anchors.
  function coupleAt(g: EdgeGeom, predicate: (c: Couple) => boolean) {
    const c = g.edge.couples.find(predicate);
    if (!c) return { cx: g.mx, cy: g.my };
    return { cx: g.mx + c.offsetX, cy: g.my + c.offsetY };
  }

  const dataCouplePt = coupleAt(mainComputeEdge, (c) => c.kind === "data" && c.direction === "down");
  const controlCouplePt = coupleAt(mainReadEdge, (c) => c.kind === "control");

  return (
    <svg width={width} height={height} role="img" aria-label="Structure chart">
      <Group left={margin.left} top={margin.top}>
        {/* Edges drawn first so boxes paint on top. */}
        <g data-data-layer="true">
          {edgeGeoms.map((g, i) => (
            <g key={`e-${i}`}>
              <path
                d={g.d}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={1.1}
              />
              {/* Arrow at the child end, pointing down. */}
              <polygon
                points={downArrow(g.tx, g.ty)}
                fill="var(--color-ink)"
              />
            </g>
          ))}
        </g>

        {/* Couple glyphs on edges. */}
        <g data-data-layer="true">
          {edgeGeoms.flatMap((g, i) =>
            g.edge.couples.map((c, j) => {
              const cx = g.mx + c.offsetX;
              const cy = g.my + c.offsetY;
              return (
                <g key={`c-${i}-${j}`}>
                  {renderCouple(cx, cy, c, `cg-${i}-${j}`)}
                  <text
                    x={cx + 7}
                    y={cy + 3}
                    fontFamily="var(--font-mono)"
                    fontSize={8}
                    fill="var(--color-ink-soft)"
                  >
                    {c.label}
                  </text>
                </g>
              );
            }),
          )}
        </g>

        {/* Module boxes. */}
        <g data-data-layer="true">{MODULES.map(renderModule)}</g>

        {/* ----- Anchors ----- */}

        {/* 1. root-module (Main Payroll) */}
        <ExplainAnchor
          selector="root-module"
          index={1}
          pin={{ x: px(mainMod.cx) + BOX_W / 2 + 14, y: py(mainMod.cy) }}
          rect={clampRect({
            x: px(mainMod.cx) - BOX_W / 2,
            y: py(mainMod.cy) - BOX_H / 2,
            width: BOX_W,
            height: BOX_H,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. sub-module (Compute Pay — internal mid-level) */}
        <ExplainAnchor
          selector="sub-module"
          index={2}
          pin={{ x: px(computeMod.cx) + BOX_W / 2 + 14, y: py(computeMod.cy) }}
          rect={clampRect({
            x: px(computeMod.cx) - BOX_W / 2,
            y: py(computeMod.cy) - BOX_H / 2,
            width: BOX_W,
            height: BOX_H,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. library-module (Read Employee Records — dashed / double-sided) */}
        <ExplainAnchor
          selector="library-module"
          index={3}
          pin={{ x: px(readLib.cx), y: py(readLib.cy) - BOX_H / 2 - 14 }}
          rect={clampRect({
            x: px(readLib.cx) - BOX_W / 2,
            y: py(readLib.cy) - BOX_H / 2,
            width: BOX_W,
            height: BOX_H,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. data-couple (filled circle — parameter passed between modules) */}
        <ExplainAnchor
          selector="data-couple"
          index={4}
          pin={{ x: dataCouplePt.cx - 18, y: dataCouplePt.cy - 10 }}
          rect={clampRect({
            x: dataCouplePt.cx - 10,
            y: dataCouplePt.cy - 10,
            width: 48,
            height: 18,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. control-couple (open circle — flag / status) */}
        <ExplainAnchor
          selector="control-couple"
          index={5}
          pin={{ x: controlCouplePt.cx + 42, y: controlCouplePt.cy + 8 }}
          rect={clampRect({
            x: controlCouplePt.cx - 10,
            y: controlCouplePt.cy - 6,
            width: 46,
            height: 16,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. invocation-edge (the line from Compute Pay down to Compute Gross) */}
        <ExplainAnchor
          selector="invocation-edge"
          index={6}
          pin={{
            x: (px(computeMod.cx) + px(grossMod.cx)) / 2 - 18,
            y: (py(computeMod.cy) + py(grossMod.cy)) / 2 + 14,
          }}
          rect={clampRect({
            x: Math.min(px(computeMod.cx), px(grossMod.cx)) - 4,
            y: py(computeMod.cy) + BOX_H / 2,
            width: Math.abs(px(grossMod.cx) - px(computeMod.cx)) + 8,
            height: py(grossMod.cy) - py(computeMod.cy) - BOX_H,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
