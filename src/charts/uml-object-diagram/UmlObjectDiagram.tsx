"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// A single runtime instance in a UML 2.0 object diagram. Boxes have two
// compartments: an underlined `instanceName:ClassName` label on top and
// attribute = value pairs on the bottom. Both compartments are legal even
// when empty; we always render both to preserve the family silhouette.
interface ObjectInstance {
  id: string;
  instance: string;
  className: string;
  attrs: ReadonlyArray<{ name: string; value: string }>;
  // Layout-space centre coordinates (0..100 × 0..100) and width.
  cx: number;
  cy: number;
  w: number;
}

// Instance link between two objects. UML links are symmetric — solid line,
// no arrowhead. The optional label names the association role.
interface InstanceLink {
  from: string;
  to: string;
  label?: string;
}

const INSTANCES: ReadonlyArray<ObjectInstance> = [
  {
    id: "c1",
    instance: "c1",
    className: "Customer",
    attrs: [
      { name: "name", value: '"Alice"' },
      { name: "id", value: "1001" },
    ],
    cx: 16,
    cy: 28,
    w: 28,
  },
  {
    id: "cart3",
    instance: "cart3",
    className: "ShoppingCart",
    attrs: [
      { name: "itemCount", value: "2" },
      { name: "total", value: "45.98" },
    ],
    cx: 50,
    cy: 28,
    w: 30,
  },
  {
    id: "i1",
    instance: "i1",
    className: "LineItem",
    attrs: [
      { name: "qty", value: "1" },
      { name: "price", value: "29.99" },
    ],
    cx: 32,
    cy: 70,
    w: 26,
  },
  {
    id: "i2",
    instance: "i2",
    className: "LineItem",
    attrs: [
      { name: "qty", value: "2" },
      { name: "price", value: "7.99" },
    ],
    cx: 68,
    cy: 70,
    w: 26,
  },
  {
    id: "p5",
    instance: "p5",
    className: "Product",
    attrs: [
      { name: "name", value: '"The Elements"' },
      { name: "sku", value: '"BK-001"' },
    ],
    cx: 86,
    cy: 28,
    w: 28,
  },
];

const LINKS: ReadonlyArray<InstanceLink> = [
  { from: "c1", to: "cart3", label: "owns" },
  { from: "cart3", to: "i1" },
  { from: "cart3", to: "i2" },
  { from: "i1", to: "p5", label: "refers to" },
  { from: "i2", to: "p5", label: "refers to" },
];

// Box geometry in layout-space.
const HEADER_H = 7;
const ATTR_ROW_H = 5;
const COMPARTMENT_PAD = 1.4;

function boxHeight(o: ObjectInstance): number {
  return HEADER_H + 2 * COMPARTMENT_PAD + o.attrs.length * ATTR_ROW_H;
}

export function UmlObjectDiagram({ width, height }: Props) {
  // Pure-diagram; no axes. A touch more side margin than the class diagram
  // so the underline on the header label does not clip against the frame.
  const margin = { top: 14, right: 14, bottom: 14, left: 14 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const byId = new Map(INSTANCES.map((o) => [o.id, o]));

  // Perimeter anchor point on the object rectangle closest to `towards`.
  function anchorOf(o: ObjectInstance, towards: { x: number; y: number }) {
    const bx = px(o.cx);
    const by = py(o.cy);
    const bw = px(o.w);
    const bh = py(boxHeight(o));
    const dx = towards.x - bx;
    const dy = towards.y - by;
    if (Math.abs(dy) * bw >= Math.abs(dx) * bh) {
      const sign = dy >= 0 ? 1 : -1;
      return { x: bx, y: by + (sign * bh) / 2 };
    }
    const sign = dx >= 0 ? 1 : -1;
    return { x: bx + (sign * bw) / 2, y: by };
  }

  function renderBox(o: ObjectInstance) {
    const bw = px(o.w);
    const bh = py(boxHeight(o));
    const bx = px(o.cx) - bw / 2;
    const by = py(o.cy) - bh / 2;
    const headerY = by;
    const attrsY = by + py(HEADER_H);
    const lineHeight = py(ATTR_ROW_H);
    const headerLabel = `${o.instance} : ${o.className}`;
    const labelFontSize = 10;
    // Approximate text width for underline extent. Monospaced, so width
    // scales linearly with character count.
    const approxCharW = labelFontSize * 0.6;
    const underlineW = Math.min(bw - 8, headerLabel.length * approxCharW);
    const underlineX = bx + (bw - underlineW) / 2;
    const labelY = headerY + py(HEADER_H) / 2 + 3;

    return (
      <g key={`obj-${o.id}`}>
        {/* Outer rectangle */}
        <rect
          x={bx}
          y={by}
          width={bw}
          height={bh}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />
        {/* Compartment divider */}
        <line
          x1={bx}
          x2={bx + bw}
          y1={attrsY}
          y2={attrsY}
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
        {/* Underlined instance label — the single notation that distinguishes
            an object diagram from a class diagram. */}
        <text
          x={bx + bw / 2}
          y={labelY}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={labelFontSize}
          fontWeight={600}
          fill="var(--color-ink)"
        >
          {headerLabel}
        </text>
        <line
          x1={underlineX}
          x2={underlineX + underlineW}
          y1={labelY + 2}
          y2={labelY + 2}
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
        {/* Attribute = value pairs */}
        {o.attrs.map((a, i) => (
          <text
            key={`attr-${o.id}-${i}`}
            x={bx + 5}
            y={attrsY + py(COMPARTMENT_PAD) + (i + 1) * lineHeight - 1}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            {`${a.name} = ${a.value}`}
          </text>
        ))}
      </g>
    );
  }

  function linkGeom(lk: InstanceLink) {
    const from = byId.get(lk.from)!;
    const to = byId.get(lk.to)!;
    const fromC = { x: px(from.cx), y: py(from.cy) };
    const toC = { x: px(to.cx), y: py(to.cy) };
    const a = anchorOf(from, toC);
    const b = anchorOf(to, fromC);
    return {
      a,
      b,
      midX: (a.x + b.x) / 2,
      midY: (a.y + b.y) / 2,
    };
  }

  // Geometries used by anchors.
  const c1 = byId.get("c1")!;
  const cart3 = byId.get("cart3")!;
  const p5 = byId.get("p5")!;
  const i1 = byId.get("i1")!;
  const i2 = byId.get("i2")!;
  const ownsLink = LINKS.find((l) => l.from === "c1" && l.to === "cart3")!;
  const ownsGeom = linkGeom(ownsLink);
  const i1p5Link = LINKS.find((l) => l.from === "i1" && l.to === "p5")!;
  const i2p5Link = LINKS.find((l) => l.from === "i2" && l.to === "p5")!;
  const i1p5Geom = linkGeom(i1p5Link);
  const i2p5Geom = linkGeom(i2p5Link);

  // Bounding boxes for the anchors that sit on a specific object box.
  const c1Bw = px(c1.w);
  const c1Bh = py(boxHeight(c1));
  const c1Bx = px(c1.cx) - c1Bw / 2;
  const c1By = py(c1.cy) - c1Bh / 2;
  const cartBw = px(cart3.w);
  const cartBh = py(boxHeight(cart3));
  const cartBx = px(cart3.cx) - cartBw / 2;
  const cartBy = py(cart3.cy) - cartBh / 2;
  const p5Bw = px(p5.w);
  const p5Bh = py(boxHeight(p5));
  const p5Bx = px(p5.cx) - p5Bw / 2;
  const p5By = py(p5.cy) - p5Bh / 2;
  // Shared-reference anchor rect covers both i1→p5 and i2→p5 links plus p5.
  const sharedMinX = Math.min(i1p5Geom.a.x, i2p5Geom.a.x, p5Bx);
  const sharedMaxX = Math.max(i1p5Geom.b.x, i2p5Geom.b.x, p5Bx + p5Bw);
  const sharedMinY = Math.min(i1p5Geom.a.y, i2p5Geom.a.y, p5By);
  const sharedMaxY = Math.max(i1p5Geom.b.y, i2p5Geom.b.y, p5By + p5Bh);

  return (
    <svg width={width} height={height} role="img" aria-label="UML Object Diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Instance links — drawn behind boxes so box strokes paint on top.
            Solid straight line, no arrowhead, optional mid-segment label. */}
        <g data-data-layer="true">
          {LINKS.map((lk, i) => {
            const g = linkGeom(lk);
            return (
              <g key={`link-${i}`}>
                <line
                  x1={g.a.x}
                  y1={g.a.y}
                  x2={g.b.x}
                  y2={g.b.y}
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                />
                {lk.label && (
                  <text
                    x={g.midX + 4}
                    y={g.midY - 4}
                    fontFamily="var(--font-mono)"
                    fontSize={9}
                    fill="var(--color-ink-soft)"
                  >
                    {lk.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Object instance boxes */}
        <g data-data-layer="true">
          {INSTANCES.map((o) => renderBox(o))}
        </g>

        {/* ----- Anchors ----- */}

        {/* 1. Object instance rectangle (with underlined label) — c1:Customer */}
        <ExplainAnchor
          selector="instance-box"
          index={1}
          pin={{ x: c1Bx - 10, y: c1By + c1Bh / 2 }}
          rect={{
            x: Math.max(0, c1Bx),
            y: Math.max(0, c1By),
            width: Math.min(iw, c1Bw),
            height: Math.min(ih, c1Bh),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Instance label syntax — underlined `name : ClassName` in the
            header compartment of cart3:ShoppingCart */}
        <ExplainAnchor
          selector="instance-label"
          index={2}
          pin={{ x: cartBx + cartBw / 2, y: cartBy - 10 }}
          rect={{
            x: Math.max(0, cartBx),
            y: Math.max(0, cartBy),
            width: Math.min(iw, cartBw),
            height: py(HEADER_H),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Attribute = value pair — bottom compartment of c1:Customer */}
        <ExplainAnchor
          selector="attribute-value"
          index={3}
          pin={{ x: c1Bx + c1Bw + 10, y: c1By + py(HEADER_H) + 10 }}
          rect={{
            x: Math.max(0, c1Bx),
            y: Math.max(0, c1By + py(HEADER_H)),
            width: Math.min(iw, c1Bw),
            height: Math.min(ih, c1Bh - py(HEADER_H)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Instance link (no arrowhead) — the c1—cart3 "owns" link */}
        <ExplainAnchor
          selector="instance-link"
          index={4}
          pin={{ x: ownsGeom.midX, y: ownsGeom.midY - 18 }}
          rect={{
            x: Math.max(0, Math.min(ownsGeom.a.x, ownsGeom.b.x) - 4),
            y: Math.max(0, Math.min(ownsGeom.a.y, ownsGeom.b.y) - 10),
            width: Math.max(20, Math.abs(ownsGeom.b.x - ownsGeom.a.x) + 8),
            height: Math.max(20, Math.abs(ownsGeom.b.y - ownsGeom.a.y) + 20),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Link label ("refers to") on the i1—p5 link */}
        <ExplainAnchor
          selector="link-label"
          index={5}
          pin={{ x: i1p5Geom.midX + 18, y: i1p5Geom.midY - 14 }}
          rect={{
            x: Math.max(0, Math.min(i1p5Geom.a.x, i1p5Geom.b.x) - 4),
            y: Math.max(0, Math.min(i1p5Geom.a.y, i1p5Geom.b.y) - 4),
            width: Math.max(20, Math.abs(i1p5Geom.b.x - i1p5Geom.a.x) + 8),
            height: Math.max(16, Math.abs(i1p5Geom.b.y - i1p5Geom.a.y) + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Shared reference — p5 is linked to both i1 and i2. Rect covers
            p5 plus both incoming links so the hover area exposes the
            structure that makes the object diagram worth drawing. */}
        <ExplainAnchor
          selector="shared-reference"
          index={6}
          pin={{ x: p5Bx + p5Bw + 10, y: p5By + p5Bh / 2 }}
          rect={{
            x: Math.max(0, sharedMinX - 4),
            y: Math.max(0, sharedMinY - 4),
            width: Math.min(iw, sharedMaxX - sharedMinX + 8),
            height: Math.min(ih, sharedMaxY - sharedMinY + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Second LineItem instance — showing that i1 and i2 are distinct
            instances of the SAME class. This is the diagram's other
            load-bearing observation. */}
        <ExplainAnchor
          selector="class-instances"
          index={7}
          pin={{ x: px(i2.cx), y: py(i2.cy) + py(boxHeight(i2)) / 2 + 12 }}
          rect={{
            x: Math.max(0, px(i1.cx) - px(i1.w) / 2),
            y: Math.max(0, py(i1.cy) - py(boxHeight(i1)) / 2),
            width: Math.min(iw, (px(i2.cx) + px(i2.w) / 2) - (px(i1.cx) - px(i1.w) / 2)),
            height: Math.min(ih, py(boxHeight(i1))),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
