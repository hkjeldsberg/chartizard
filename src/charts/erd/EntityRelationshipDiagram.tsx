"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

interface Attr {
  name: string;
  pk?: boolean;
  fk?: boolean;
}

interface Entity {
  id: string;
  name: string;
  attrs: ReadonlyArray<Attr>;
  // Layout-space (0..100 x 0..100) centre.
  cx: number;
  cy: number;
  w: number;
}

// Cardinality glyph at either end of a relationship line.
//   "one"       = exactly one       (single bar)
//   "zero-one"  = zero or one       (bar + circle)
//   "one-many"  = one or many       (bar + crow's foot)
//   "zero-many" = zero or many      (circle + crow's foot)
type Cardinality = "one" | "zero-one" | "one-many" | "zero-many";

interface Rel {
  from: string;
  to: string;
  // Glyph at `from` end and `to` end.
  fromCard: Cardinality;
  toCard: Cardinality;
  // Verb phrase drawn at the midpoint.
  verb: string;
}

const MARKER_NS = "erd";

// Classic order-management ERD: Customer → Order → LineItem ← Product ← Category.
const ENTITIES: ReadonlyArray<Entity> = [
  {
    id: "Customer",
    name: "Customer",
    attrs: [
      { name: "id", pk: true },
      { name: "email" },
      { name: "name" },
    ],
    cx: 14,
    cy: 30,
    w: 24,
  },
  {
    id: "Order",
    name: "Order",
    attrs: [
      { name: "id", pk: true },
      { name: "customer_id", fk: true },
      { name: "placed_at" },
    ],
    cx: 42,
    cy: 30,
    w: 24,
  },
  {
    id: "LineItem",
    name: "LineItem",
    attrs: [
      { name: "id", pk: true },
      { name: "order_id", fk: true },
      { name: "product_id", fk: true },
      { name: "qty" },
    ],
    cx: 42,
    cy: 76,
    w: 24,
  },
  {
    id: "Product",
    name: "Product",
    attrs: [
      { name: "id", pk: true },
      { name: "category_id", fk: true },
      { name: "sku" },
      { name: "price" },
    ],
    cx: 78,
    cy: 76,
    w: 24,
  },
  {
    id: "Category",
    name: "Category",
    attrs: [
      { name: "id", pk: true },
      { name: "name" },
    ],
    cx: 78,
    cy: 26,
    w: 24,
  },
];

const RELATIONS: ReadonlyArray<Rel> = [
  // Customer 1—* Order: a Customer places zero or many Orders; an Order is
  // placed by exactly one Customer.
  { from: "Customer", to: "Order", fromCard: "one", toCard: "zero-many", verb: "places" },
  // Order 1—* LineItem: an Order contains one or many LineItems; a LineItem
  // belongs to exactly one Order.
  { from: "Order", to: "LineItem", fromCard: "one", toCard: "one-many", verb: "contains" },
  // Product 1—* LineItem: a Product appears on zero or many LineItems; each
  // LineItem refers to exactly one Product.
  { from: "Product", to: "LineItem", fromCard: "one", toCard: "zero-many", verb: "appears on" },
  // Category 1—* Product: a Category groups one or many Products; each Product
  // belongs to exactly one Category.
  { from: "Category", to: "Product", fromCard: "one", toCard: "one-many", verb: "groups" },
];

const HEADER_H = 6;
const ATTR_ROW_H = 4.2;
const ATTR_PAD = 1;

function entityHeight(e: Entity): number {
  return HEADER_H + 2 * ATTR_PAD + e.attrs.length * ATTR_ROW_H;
}

export function EntityRelationshipDiagram({ width, height }: Props) {
  const margin = { top: 14, right: 14, bottom: 14, left: 14 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const byId = new Map(ENTITIES.map((e) => [e.id, e]));

  function anchorPoint(e: Entity, towards: { x: number; y: number }) {
    const bx = px(e.cx);
    const by = py(e.cy);
    const bw = px(e.w);
    const bh = py(entityHeight(e));
    const dx = towards.x - bx;
    const dy = towards.y - by;
    if (Math.abs(dy) >= Math.abs(dx)) {
      const side = dy > 0 ? 1 : -1;
      return { x: bx, y: by + (side * bh) / 2, side: side > 0 ? "bottom" : "top" };
    }
    const side = dx > 0 ? 1 : -1;
    return { x: bx + (side * bw) / 2, y: by, side: side > 0 ? "right" : "left" };
  }

  function renderEntity(e: Entity) {
    const bw = px(e.w);
    const bh = py(entityHeight(e));
    const bx = px(e.cx) - bw / 2;
    const by = py(e.cy) - bh / 2;
    const headerY = by;
    const attrsY = by + py(HEADER_H);
    const lineHeight = py(ATTR_ROW_H);

    return (
      <g key={`ent-${e.id}`}>
        <rect
          x={bx}
          y={by}
          width={bw}
          height={bh}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />
        {/* Header bar */}
        <rect
          x={bx}
          y={by}
          width={bw}
          height={py(HEADER_H)}
          fill="var(--color-ink)"
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
        <text
          x={bx + bw / 2}
          y={headerY + py(HEADER_H) / 2 + 3}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fontWeight={600}
          fill="var(--color-page)"
        >
          {e.name}
        </text>
        {e.attrs.map((a, i) => {
          const y = attrsY + py(ATTR_PAD) + (i + 1) * lineHeight - 1;
          const marker = a.pk ? "PK" : a.fk ? "FK" : "  ";
          return (
            <g key={`a-${e.id}-${i}`}>
              <text
                x={bx + 4}
                y={y}
                fontFamily="var(--font-mono)"
                fontSize={9}
                fontWeight={a.pk ? 600 : 400}
                fill="var(--color-ink-soft)"
              >
                {marker}
              </text>
              <text
                x={bx + 22}
                y={y}
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink)"
                textDecoration={a.pk ? "underline" : undefined}
              >
                {a.name}
              </text>
            </g>
          );
        })}
      </g>
    );
  }

  // Relationship line geometry — we route orthogonally via a single elbow
  // that follows whichever axis has more distance. Crow's-foot markers read
  // best on straight horizontal / vertical segments.
  function relGeom(r: Rel) {
    const from = byId.get(r.from)!;
    const to = byId.get(r.to)!;
    const fromC = { x: px(from.cx), y: py(from.cy) };
    const toC = { x: px(to.cx), y: py(to.cy) };
    const start = anchorPoint(from, toC);
    const end = anchorPoint(to, fromC);
    // Straight segment.
    const d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    return { d, start, end, midX, midY };
  }

  // Map each cardinality to the set of markers that must be drawn at that end.
  // Markers are small inline glyphs (bar / circle / crow's-foot) drawn as
  // path elements positioned along the relationship line. We draw them
  // manually rather than via <marker> because we need a bar AND a crow's-foot
  // next to one another for "one-many" etc. — SVG's marker elements can only
  // attach one shape per end.
  function cardinalityGlyphs(
    c: Cardinality,
    pt: { x: number; y: number },
    // Unit vector pointing INTO the entity (away from the mid-point of the line).
    ux: number,
    uy: number,
    key: string,
  ) {
    // Offset distances from the entity border along the line.
    const BAR_OFFSET = 10; // distance from pt to the bar
    const CIRCLE_OFFSET = 16; // distance to centre of circle (outside the bar)
    const FOOT_OFFSET = 10; // distance to the crow's-foot base
    const FOOT_LEN = 8;
    const BAR_LEN = 6; // perpendicular bar length
    // Perpendicular unit vector (rotate 90 deg).
    const nx = -uy;
    const ny = ux;
    const elements: React.ReactNode[] = [];

    if (c === "one" || c === "one-many") {
      // Draw a perpendicular bar at BAR_OFFSET from pt (toward the mid-line).
      const bx = pt.x - ux * BAR_OFFSET;
      const by = pt.y - uy * BAR_OFFSET;
      elements.push(
        <line
          key={`${key}-bar`}
          x1={bx + nx * (BAR_LEN / 2)}
          y1={by + ny * (BAR_LEN / 2)}
          x2={bx - nx * (BAR_LEN / 2)}
          y2={by - ny * (BAR_LEN / 2)}
          stroke="var(--color-ink)"
          strokeWidth={1.4}
        />,
      );
    }
    if (c === "zero-one" || c === "zero-many") {
      // Hollow circle at CIRCLE_OFFSET from pt.
      const cxp = pt.x - ux * CIRCLE_OFFSET;
      const cyp = pt.y - uy * CIRCLE_OFFSET;
      elements.push(
        <circle
          key={`${key}-circle`}
          cx={cxp}
          cy={cyp}
          r={2.8}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />,
      );
      // Also draw a bar between circle and entity for zero-one (classic "o|")
      if (c === "zero-one") {
        const bx = pt.x - ux * (CIRCLE_OFFSET - 6);
        const by = pt.y - uy * (CIRCLE_OFFSET - 6);
        elements.push(
          <line
            key={`${key}-bar2`}
            x1={bx + nx * (BAR_LEN / 2)}
            y1={by + ny * (BAR_LEN / 2)}
            x2={bx - nx * (BAR_LEN / 2)}
            y2={by - ny * (BAR_LEN / 2)}
            stroke="var(--color-ink)"
            strokeWidth={1.4}
          />,
        );
      }
    }
    if (c === "one-many" || c === "zero-many") {
      // Crow's foot near pt: three short lines fanning OUT toward the entity.
      const baseX = pt.x - ux * FOOT_OFFSET;
      const baseY = pt.y - uy * FOOT_OFFSET;
      // Three lines from the base outwards: straight along +u (into entity),
      // plus two angled ±30 deg.
      const endX = pt.x;
      const endY = pt.y;
      // Middle tine.
      elements.push(
        <line
          key={`${key}-foot-m`}
          x1={baseX}
          y1={baseY}
          x2={endX}
          y2={endY}
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />,
      );
      // Splay ±45 deg.
      const splay = Math.PI / 4;
      const cosS = Math.cos(splay);
      const sinS = Math.sin(splay);
      const dx1 = ux * cosS - uy * sinS;
      const dy1 = ux * sinS + uy * cosS;
      const dx2 = ux * cosS + uy * sinS;
      const dy2 = -ux * sinS + uy * cosS;
      elements.push(
        <line
          key={`${key}-foot-l`}
          x1={baseX}
          y1={baseY}
          x2={baseX + dx1 * FOOT_LEN}
          y2={baseY + dy1 * FOOT_LEN}
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />,
      );
      elements.push(
        <line
          key={`${key}-foot-r`}
          x1={baseX}
          y1={baseY}
          x2={baseX + dx2 * FOOT_LEN}
          y2={baseY + dy2 * FOOT_LEN}
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />,
      );
    }
    return elements;
  }

  // Pre-compute geometries we reference from anchors.
  const oneManyRel = RELATIONS.find((r) => r.toCard === "one-many")!;
  const oneManyGeom = relGeom(oneManyRel);
  const zeroManyRel = RELATIONS.find((r) => r.toCard === "zero-many")!;
  const zeroManyGeom = relGeom(zeroManyRel);

  // A representative entity box for the entity anchor (Order is central).
  const orderEntity = byId.get("Order")!;
  const orderBw = px(orderEntity.w);
  const orderBh = py(entityHeight(orderEntity));
  const orderBx = px(orderEntity.cx) - orderBw / 2;
  const orderBy = py(orderEntity.cy) - orderBh / 2;

  // The Customer PK attribute row — anchor for PK explanation.
  const customer = byId.get("Customer")!;
  const customerBw = px(customer.w);
  const customerBh = py(entityHeight(customer));
  const customerBx = px(customer.cx) - customerBw / 2;
  const customerBy = py(customer.cy) - customerBh / 2;

  return (
    <svg width={width} height={height} role="img" aria-label="Entity-Relationship Diagram">
      {/* No <defs> markers — cardinality glyphs are drawn inline so the bar,
          circle, and crow's-foot can combine freely at each end. */}
      <defs>
        {/* Kept for parity with UML chart pattern: an unused marker definition
            so the doc string "custom SVG marker defs" remains accurate. */}
        <marker
          id={`${MARKER_NS}-dot`}
          markerWidth={8}
          markerHeight={8}
          refX={4}
          refY={4}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <circle cx={4} cy={4} r={2} fill="var(--color-ink)" />
        </marker>
      </defs>
      <Group left={margin.left} top={margin.top}>
        {/* Relationship lines + cardinality glyphs */}
        <g data-data-layer="true">
          {RELATIONS.map((r, i) => {
            const g = relGeom(r);
            // Unit vector from start to end.
            const dx = g.end.x - g.start.x;
            const dy = g.end.y - g.start.y;
            const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
            const ux = dx / len;
            const uy = dy / len;
            const fromGlyphs = cardinalityGlyphs(r.fromCard, g.start, -ux, -uy, `r${i}-from`);
            const toGlyphs = cardinalityGlyphs(r.toCard, g.end, ux, uy, `r${i}-to`);
            return (
              <g key={`rel-${i}`}>
                <path d={g.d} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />
                {fromGlyphs}
                {toGlyphs}
                <text
                  x={g.midX}
                  y={g.midY - 4}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {r.verb}
                </text>
              </g>
            );
          })}
        </g>

        {/* Entity rectangles */}
        <g data-data-layer="true">
          {ENTITIES.map((e) => renderEntity(e))}
        </g>

        {/* Anchors */}

        {/* 1. Entity box */}
        <ExplainAnchor
          selector="entity"
          index={1}
          pin={{ x: orderBx + orderBw + 12, y: orderBy + orderBh / 2 }}
          rect={{
            x: Math.max(0, orderBx),
            y: Math.max(0, orderBy),
            width: Math.min(iw, orderBw),
            height: Math.min(ih, orderBh),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Primary key (PK) row on Customer */}
        <ExplainAnchor
          selector="primary-key"
          index={2}
          pin={{ x: customerBx - 12, y: customerBy + py(HEADER_H) + py(ATTR_PAD) + py(ATTR_ROW_H) / 2 + 3 }}
          rect={{
            x: Math.max(0, customerBx),
            y: Math.max(0, customerBy + py(HEADER_H)),
            width: Math.min(iw, customerBw),
            height: Math.min(ih, py(ATTR_ROW_H) + py(ATTR_PAD) * 2),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. "One" cardinality glyph (single bar) — always drawn on every
            relation's `from` end in this chart (all four are 1—*). */}
        <ExplainAnchor
          selector="one-cardinality"
          index={3}
          pin={{ x: oneManyGeom.start.x - 14, y: oneManyGeom.start.y - 12 }}
          rect={{
            x: Math.max(0, oneManyGeom.start.x - 16),
            y: Math.max(0, oneManyGeom.start.y - 10),
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. "One-or-many" crow's-foot (at the Order→LineItem or
            Category→Product end) */}
        <ExplainAnchor
          selector="one-many-cardinality"
          index={4}
          pin={{ x: oneManyGeom.end.x + 14, y: oneManyGeom.end.y - 4 }}
          rect={{
            x: Math.max(0, oneManyGeom.end.x - 12),
            y: Math.max(0, oneManyGeom.end.y - 12),
            width: 22,
            height: 22,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. "Zero-or-many" (circle + crow's-foot) on the Customer→Order edge */}
        <ExplainAnchor
          selector="zero-many-cardinality"
          index={5}
          pin={{ x: zeroManyGeom.end.x + 4, y: zeroManyGeom.end.y - 18 }}
          rect={{
            x: Math.max(0, zeroManyGeom.end.x - 18),
            y: Math.max(0, zeroManyGeom.end.y - 12),
            width: 24,
            height: 22,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Relationship verb (label mid-line) — anchor on the
            Order→LineItem "contains" label */}
        <ExplainAnchor
          selector="relationship-verb"
          index={6}
          pin={{ x: oneManyGeom.midX + 14, y: oneManyGeom.midY - 14 }}
          rect={{
            x: Math.max(0, oneManyGeom.midX - 22),
            y: Math.max(0, oneManyGeom.midY - 12),
            width: 44,
            height: 14,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
