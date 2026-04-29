"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Classic closed-loop motor-speed control:
//   reference ω* → Σ (error e = ω* - ω) → K (gain) → PID → motor amplifier →
//   motor (plant) → ω (speed out) ; sensor feeds speed back to the Σ minus
//   input.
//
// Block-diagram notation (1940s-50s control-systems):
//   - Rectangle    : functional block (transfer function, subsystem)
//   - Circle with ⊕ + signed labels : summing junction (Σ)
//   - Triangle     : pure gain (amplifier)
//   - Arrow        : signal flow (optionally labelled with the signal name)
//
// The feedback loop is the chart's entire point: changing the plant's output
// immediately corrects the error at the summing junction. No loop, no chart.

type BlockKind = "block" | "sum" | "gain" | "io";

interface Block {
  id: string;
  kind: BlockKind;
  // Centre in layout 0..100 units.
  cx: number;
  cy: number;
  // Primary label.
  label: string;
  // Secondary label (transfer function etc.).
  sub?: string;
  // Summing-junction sign inputs: map of side → "+" | "-".
  signs?: { left?: "+" | "-"; right?: "+" | "-"; top?: "+" | "-"; bottom?: "+" | "-" };
  // For "io" anchors (ref input / speed output) we draw a label only, no box.
  isLabel?: boolean;
}

interface Wire {
  from: string;
  to: string;
  // Override the side that the wire exits / enters on (auto chooses nearest).
  fromSide?: "left" | "right" | "top" | "bottom";
  toSide?: "left" | "right" | "top" | "bottom";
  // Route as an orthogonal elbow? Otherwise straight.
  elbow?: boolean;
  // Detour Y coord (for feedback wire that loops under the blocks).
  detourY?: number;
  // Signal label rendered near the wire.
  label?: string;
  // Feedback marker (dashed feedback sign style if true — kept solid here but
  // could be used to differentiate).
  isFeedback?: boolean;
}

// Main-line blocks sit on one horizontal axis (cy = 40). Feedback sensor sits
// below (cy = 72).
const BLOCKS: ReadonlyArray<Block> = [
  // Reference input (label only, leftmost)
  { id: "ref", kind: "io", cx: 4, cy: 40, label: "ω*", sub: "reference", isLabel: true },
  // Summing junction
  { id: "sum", kind: "sum", cx: 18, cy: 40, label: "", signs: { left: "+", bottom: "-" } },
  // Gain
  { id: "gain", kind: "gain", cx: 32, cy: 40, label: "K" },
  // PID controller
  { id: "pid", kind: "block", cx: 50, cy: 40, label: "PID", sub: "controller" },
  // Motor amplifier
  { id: "amp", kind: "block", cx: 70, cy: 40, label: "Amplifier", sub: "driver" },
  // Motor (plant)
  { id: "motor", kind: "block", cx: 88, cy: 40, label: "Motor", sub: "plant" },
  // Speed output (label only, rightmost)
  { id: "out", kind: "io", cx: 98, cy: 40, label: "ω", sub: "speed", isLabel: true },
  // Sensor (feedback path)
  { id: "sensor", kind: "block", cx: 50, cy: 78, label: "Tachometer", sub: "sensor" },
];

const WIRES: ReadonlyArray<Wire> = [
  { from: "ref", to: "sum", label: "ω*" },
  { from: "sum", to: "gain", label: "error e" },
  { from: "gain", to: "pid" },
  { from: "pid", to: "amp", label: "u" },
  { from: "amp", to: "motor", label: "V" },
  { from: "motor", to: "out", label: "ω" },
  // Feedback tap: motor → sensor → sum (bottom input). Routed via elbows.
  {
    from: "motor",
    to: "sensor",
    fromSide: "bottom",
    toSide: "right",
    elbow: true,
    isFeedback: true,
  },
  {
    from: "sensor",
    to: "sum",
    fromSide: "left",
    toSide: "bottom",
    elbow: true,
    label: "ω measured",
    isFeedback: true,
  },
];

interface Props {
  width: number;
  height: number;
}

export function BlockDiagram({ width, height }: Props) {
  const margin = { top: 28, right: 28, bottom: 36, left: 28 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  // Fixed pixel sizes for each shape.
  const BLOCK_W = Math.min(110, Math.max(72, iw / 7.2));
  const BLOCK_H = 34;
  const SUM_R = 10;
  const GAIN_W = 22;
  const GAIN_H = 22;

  const byId = new Map(BLOCKS.map((b) => [b.id, b]));

  // Compute the shape's bounding-box "side centre" for wire endpoints.
  function sideCentre(b: Block, side: "left" | "right" | "top" | "bottom") {
    const cx = px(b.cx);
    const cy = py(b.cy);
    let hw: number;
    let hh: number;
    if (b.kind === "block") {
      hw = BLOCK_W / 2;
      hh = BLOCK_H / 2;
    } else if (b.kind === "sum") {
      hw = SUM_R;
      hh = SUM_R;
    } else if (b.kind === "gain") {
      // Triangle bounding box ≈ GAIN_W × GAIN_H; wire on the right exits the
      // tip; wire on the left enters the flat side.
      hw = GAIN_W / 2;
      hh = GAIN_H / 2;
    } else {
      // io label — treat as a tiny point.
      hw = 2;
      hh = 2;
    }
    switch (side) {
      case "left":
        return { x: cx - hw, y: cy };
      case "right":
        return { x: cx + hw, y: cy };
      case "top":
        return { x: cx, y: cy - hh };
      case "bottom":
        return { x: cx, y: cy + hh };
    }
  }

  // Choose the natural side of block b facing towards point p.
  function naturalSide(b: Block, p: { x: number; y: number }): "left" | "right" | "top" | "bottom" {
    const cx = px(b.cx);
    const cy = py(b.cy);
    const dx = p.x - cx;
    const dy = p.y - cy;
    if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? "right" : "left";
    return dy >= 0 ? "bottom" : "top";
  }

  interface WireGeom {
    wire: Wire;
    d: string;
    tipX: number;
    tipY: number;
    tipAngle: number;
    labelX: number;
    labelY: number;
    rect: { x: number; y: number; width: number; height: number };
  }

  function wireGeom(w: Wire): WireGeom {
    const from = byId.get(w.from)!;
    const to = byId.get(w.to)!;
    const toCentre = { x: px(to.cx), y: py(to.cy) };
    const fromCentre = { x: px(from.cx), y: py(from.cy) };
    const fromSide = w.fromSide ?? naturalSide(from, toCentre);
    const toSide = w.toSide ?? naturalSide(to, fromCentre);
    const a = sideCentre(from, fromSide);
    const b = sideCentre(to, toSide);

    let d: string;
    let labelX = (a.x + b.x) / 2;
    let labelY = Math.min(a.y, b.y) - 6;
    let tangent = Math.atan2(b.y - a.y, b.x - a.x);

    if (!w.elbow) {
      d = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
      // For vertical wires, bias label to the right of the midpoint.
      if (Math.abs(b.y - a.y) > Math.abs(b.x - a.x)) {
        labelX = (a.x + b.x) / 2 + 10;
        labelY = (a.y + b.y) / 2;
      }
    } else {
      // Orthogonal elbow: route via a detour Y-row below the main line so
      // the feedback path is visually distinct.
      const detourY = w.detourY ?? Math.max(a.y, b.y) + 0;
      if (fromSide === "bottom" || toSide === "bottom") {
        // Use the lower of the two points for the horizontal run.
        const runY = Math.max(a.y + 14, b.y + 14, detourY);
        d = `M ${a.x} ${a.y} V ${runY} H ${b.x} V ${b.y}`;
        labelX = (a.x + b.x) / 2;
        labelY = runY + 14;
        // Final tangent approaches b from above or below.
        tangent = b.y > runY ? Math.PI / 2 : -Math.PI / 2;
      } else {
        // Generic right-angle elbow.
        d = `M ${a.x} ${a.y} H ${b.x} V ${b.y}`;
        tangent = b.y > a.y ? Math.PI / 2 : -Math.PI / 2;
      }
    }

    const rect = {
      x: Math.min(a.x, b.x) - 6,
      y: Math.min(a.y, b.y) - 8,
      width: Math.abs(b.x - a.x) + 12,
      height: Math.abs(b.y - a.y) + 16,
    };

    return {
      wire: w,
      d,
      tipX: b.x,
      tipY: b.y,
      tipAngle: (tangent * 180) / Math.PI,
      labelX,
      labelY,
      rect,
    };
  }

  const wireGeoms = WIRES.map(wireGeom);

  // Arrow head (triangle) at (tipX, tipY) pointing along angleDeg.
  function arrowHead(tipX: number, tipY: number, angleDeg: number, size = 5) {
    const rad = (angleDeg * Math.PI) / 180;
    const baseX = tipX - Math.cos(rad) * size;
    const baseY = tipY - Math.sin(rad) * size;
    const sx = Math.cos(rad - Math.PI / 2) * size * 0.55;
    const sy = Math.sin(rad - Math.PI / 2) * size * 0.55;
    return `${tipX},${tipY} ${baseX + sx},${baseY + sy} ${baseX - sx},${baseY - sy}`;
  }

  // Render a block by kind.
  function renderBlock(b: Block) {
    const cx = px(b.cx);
    const cy = py(b.cy);
    if (b.kind === "io") {
      // Label only: primary above, sub below.
      return (
        <g key={`bl-${b.id}`}>
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={11}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            {b.label}
          </text>
          {b.sub && (
            <text
              x={cx}
              y={cy + 10}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              {b.sub}
            </text>
          )}
        </g>
      );
    }
    if (b.kind === "sum") {
      const signs = b.signs ?? {};
      return (
        <g key={`bl-${b.id}`}>
          <circle
            cx={cx}
            cy={cy}
            r={SUM_R}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
          {/* Plus cross inside the circle, classic Σ glyph. */}
          <line
            x1={cx - 5}
            y1={cy}
            x2={cx + 5}
            y2={cy}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          <line
            x1={cx}
            y1={cy - 5}
            x2={cx}
            y2={cy + 5}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          {/* Side signs. */}
          {signs.left && (
            <text
              x={cx - SUM_R - 3}
              y={cy - SUM_R - 2}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink)"
            >
              {signs.left}
            </text>
          )}
          {signs.right && (
            <text
              x={cx + SUM_R + 3}
              y={cy - SUM_R - 2}
              textAnchor="start"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink)"
            >
              {signs.right}
            </text>
          )}
          {signs.top && (
            <text
              x={cx + SUM_R + 2}
              y={cy - SUM_R - 4}
              textAnchor="start"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink)"
            >
              {signs.top}
            </text>
          )}
          {signs.bottom && (
            <text
              x={cx + SUM_R + 2}
              y={cy + SUM_R + 10}
              textAnchor="start"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink)"
            >
              {signs.bottom}
            </text>
          )}
        </g>
      );
    }
    if (b.kind === "gain") {
      // Right-pointing triangle, apex on the right. Enter on the flat left,
      // exit at the apex.
      const left = cx - GAIN_W / 2;
      const right = cx + GAIN_W / 2;
      const top = cy - GAIN_H / 2;
      const bot = cy + GAIN_H / 2;
      return (
        <g key={`bl-${b.id}`}>
          <polygon
            points={`${left},${top} ${left},${bot} ${right},${cy}`}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
          <text
            x={cx - 2}
            y={cy + 3}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            {b.label}
          </text>
        </g>
      );
    }
    // Rectangle block.
    return (
      <g key={`bl-${b.id}`}>
        <rect
          x={cx - BLOCK_W / 2}
          y={cy - BLOCK_H / 2}
          width={BLOCK_W}
          height={BLOCK_H}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.3}
        />
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fontWeight={500}
          fill="var(--color-ink)"
        >
          {b.label}
        </text>
        {b.sub && (
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-soft)"
          >
            {b.sub}
          </text>
        )}
      </g>
    );
  }

  // Clamp helper for anchor rects.
  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const h = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width: w, height: h };
  };

  // Representative elements for anchors.
  const sumBlock = byId.get("sum")!;
  const gainBlock = byId.get("gain")!;
  const pidBlock = byId.get("pid")!;
  const motorBlock = byId.get("motor")!;
  const sensorBlock = byId.get("sensor")!;
  const feedbackWireGeom = wireGeoms.find(
    (g) => g.wire.from === "sensor" && g.wire.to === "sum",
  )!;
  const refInputWireGeom = wireGeoms.find(
    (g) => g.wire.from === "ref" && g.wire.to === "sum",
  )!;

  return (
    <svg width={width} height={height} role="img" aria-label="Block diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Wires — painted first so blocks cover any endpoint overdraw. */}
        <g data-data-layer="true">
          {wireGeoms.map((g, i) => {
            const rad = (g.tipAngle * Math.PI) / 180;
            const tipX = g.tipX - Math.cos(rad) * 1.5;
            const tipY = g.tipY - Math.sin(rad) * 1.5;
            return (
              <g key={`w-${i}`}>
                <path
                  d={g.d}
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeWidth={1.1}
                />
                <polygon
                  points={arrowHead(tipX, tipY, g.tipAngle)}
                  fill="var(--color-ink)"
                />
                {g.wire.label && (
                  <text
                    x={g.labelX}
                    y={g.labelY}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize={9}
                    fill="var(--color-ink-soft)"
                  >
                    {g.wire.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Blocks */}
        <g data-data-layer="true">{BLOCKS.map(renderBlock)}</g>

        {/* ----- Anchors ----- */}

        {/* 1. summing-junction (Σ circle with signs) */}
        <ExplainAnchor
          selector="summing-junction"
          index={1}
          pin={{ x: px(sumBlock.cx), y: py(sumBlock.cy) - SUM_R - 16 }}
          rect={clampRect({
            x: px(sumBlock.cx) - SUM_R - 6,
            y: py(sumBlock.cy) - SUM_R - 6,
            width: SUM_R * 2 + 12,
            height: SUM_R * 2 + 12,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. gain-block (triangle) */}
        <ExplainAnchor
          selector="gain-block"
          index={2}
          pin={{ x: px(gainBlock.cx), y: py(gainBlock.cy) - GAIN_H / 2 - 14 }}
          rect={clampRect({
            x: px(gainBlock.cx) - GAIN_W / 2 - 2,
            y: py(gainBlock.cy) - GAIN_H / 2 - 2,
            width: GAIN_W + 4,
            height: GAIN_H + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. controller-block (PID rectangle) */}
        <ExplainAnchor
          selector="controller-block"
          index={3}
          pin={{ x: px(pidBlock.cx), y: py(pidBlock.cy) - BLOCK_H / 2 - 14 }}
          rect={clampRect({
            x: px(pidBlock.cx) - BLOCK_W / 2,
            y: py(pidBlock.cy) - BLOCK_H / 2,
            width: BLOCK_W,
            height: BLOCK_H,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. plant-block (Motor — the system being controlled) */}
        <ExplainAnchor
          selector="plant-block"
          index={4}
          pin={{ x: px(motorBlock.cx), y: py(motorBlock.cy) - BLOCK_H / 2 - 14 }}
          rect={clampRect({
            x: px(motorBlock.cx) - BLOCK_W / 2,
            y: py(motorBlock.cy) - BLOCK_H / 2,
            width: BLOCK_W,
            height: BLOCK_H,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. feedback-path (sensor block + its wire back to Σ) */}
        <ExplainAnchor
          selector="feedback-path"
          index={5}
          pin={{
            x: px(sensorBlock.cx),
            y: py(sensorBlock.cy) + BLOCK_H / 2 + 14,
          }}
          rect={clampRect({
            x: Math.min(px(sumBlock.cx) - SUM_R, feedbackWireGeom.rect.x) - 4,
            y: py(sensorBlock.cy) - BLOCK_H / 2 - 4,
            width: Math.max(
              feedbackWireGeom.rect.width,
              px(motorBlock.cx) - px(sumBlock.cx) + 20,
            ),
            height: BLOCK_H + 28,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. signal-wire (the reference → Σ input wire, labelled ω*) */}
        <ExplainAnchor
          selector="signal-wire"
          index={6}
          pin={{ x: refInputWireGeom.labelX, y: refInputWireGeom.labelY - 14 }}
          rect={clampRect({
            x: refInputWireGeom.rect.x,
            y: refInputWireGeom.rect.y,
            width: refInputWireGeom.rect.width,
            height: refInputWireGeom.rect.height,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
