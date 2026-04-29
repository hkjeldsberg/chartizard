"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

type Visibility = "+" | "-" | "#";

interface ClassBox {
  id: string;
  name: string;
  fields: ReadonlyArray<{ v: Visibility; text: string }>;
  methods: ReadonlyArray<{ v: Visibility; text: string }>;
  // Layout-space (0..100 x 0..100) centre coordinates.
  cx: number;
  cy: number;
  // Layout-space width.
  w: number;
}

type Relation = "association" | "aggregation" | "composition" | "inheritance";

interface Edge {
  from: string;
  to: string;
  kind: Relation;
  // Force routing side — "elbow-h" = horizontal then vertical,
  // "elbow-v" = vertical then horizontal, "straight" = direct segment.
  route: "straight" | "elbow-h" | "elbow-v";
  // Optional edge label (association verb / role name).
  label?: string;
}

// Unique marker IDs so multiple UmlClassDiagram instances on the same page
// don't collide. Appended as a suffix to the marker id attribute.
const MARKER_NS = "uml";

// An e-commerce domain. Six classes, four relationship types — one of each
// arrow shape renders at least once.
const CLASSES: ReadonlyArray<ClassBox> = [
  {
    id: "Customer",
    name: "Customer",
    fields: [
      { v: "-", text: "id: UUID" },
      { v: "-", text: "email: String" },
    ],
    methods: [
      { v: "+", text: "placeOrder(): Order" },
    ],
    cx: 18,
    cy: 20,
    w: 30,
  },
  {
    id: "Address",
    name: "Address",
    fields: [
      { v: "-", text: "street: String" },
      { v: "-", text: "postcode: String" },
    ],
    methods: [
      { v: "+", text: "format(): String" },
    ],
    cx: 18,
    cy: 72,
    w: 30,
  },
  {
    id: "Order",
    name: "Order",
    fields: [
      { v: "-", text: "id: UUID" },
      { v: "-", text: "placedAt: Date" },
    ],
    methods: [
      { v: "+", text: "total(): Money" },
      { v: "#", text: "recalc(): void" },
    ],
    cx: 52,
    cy: 20,
    w: 30,
  },
  {
    id: "LineItem",
    name: "LineItem",
    fields: [
      { v: "-", text: "qty: Int" },
      { v: "-", text: "unitPrice: Money" },
    ],
    methods: [
      { v: "+", text: "subtotal(): Money" },
    ],
    cx: 52,
    cy: 72,
    w: 30,
  },
  {
    id: "Product",
    name: "Product",
    fields: [
      { v: "-", text: "sku: String" },
      { v: "-", text: "price: Money" },
    ],
    methods: [
      { v: "+", text: "label(): String" },
    ],
    cx: 86,
    cy: 72,
    w: 28,
  },
  {
    id: "Payment",
    name: "Payment",
    fields: [
      { v: "#", text: "amount: Money" },
    ],
    methods: [
      { v: "+", text: "capture(): Bool" },
    ],
    cx: 86,
    cy: 14,
    w: 28,
  },
  {
    id: "CreditCardPayment",
    name: "CreditCardPayment",
    fields: [
      { v: "-", text: "cardToken: String" },
    ],
    methods: [
      { v: "+", text: "authorize(): Bool" },
    ],
    cx: 86,
    cy: 42,
    w: 28,
  },
];

const EDGES: ReadonlyArray<Edge> = [
  // Order ◆— LineItem (composition: LineItems cannot outlive Order)
  { from: "Order", to: "LineItem", kind: "composition", route: "straight", label: "composed of" },
  // LineItem —> Product (plain association: LineItem references Product)
  { from: "LineItem", to: "Product", kind: "association", route: "straight", label: "refers to" },
  // Customer ◇— Address (aggregation: Customer has Address, Address survives)
  { from: "Customer", to: "Address", kind: "aggregation", route: "straight", label: "has" },
  // CreditCardPayment ▷ Payment (inheritance: triangle points at superclass)
  { from: "CreditCardPayment", to: "Payment", kind: "inheritance", route: "straight" },
];

// Visual constants in layout space for each compartment of a class box.
const HEADER_H = 6;
const FIELD_ROW_H = 4;
const METHOD_ROW_H = 4;
const COMPARTMENT_PAD = 1.2;

function classBoxHeight(c: ClassBox): number {
  return (
    HEADER_H +
    2 * COMPARTMENT_PAD +
    c.fields.length * FIELD_ROW_H +
    2 * COMPARTMENT_PAD +
    c.methods.length * METHOD_ROW_H
  );
}

export function UmlClassDiagram({ width, height }: Props) {
  // Pure-diagram layout — tight margins, no axes.
  const margin = { top: 14, right: 14, bottom: 14, left: 14 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Map layout-space (0..100) to pixels.
  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const boxById = new Map(CLASSES.map((c) => [c.id, c]));

  // Return the class box's perimeter point closest to target centre.
  function anchorPoint(c: ClassBox, towards: { x: number; y: number }) {
    const bx = px(c.cx);
    const by = py(c.cy);
    const bw = px(c.w);
    const bh = py(classBoxHeight(c));
    const dx = towards.x - bx;
    const dy = towards.y - by;
    if (Math.abs(dy) >= Math.abs(dx)) {
      const side = dy > 0 ? 1 : -1;
      return { x: bx, y: by + (side * bh) / 2 };
    }
    const side = dx > 0 ? 1 : -1;
    return { x: bx + (side * bw) / 2, y: by };
  }

  function renderClassBox(c: ClassBox) {
    const bw = px(c.w);
    const bh = py(classBoxHeight(c));
    const bx = px(c.cx) - bw / 2;
    const by = py(c.cy) - bh / 2;

    const headerY = by;
    const fieldsY = by + py(HEADER_H);
    const methodsY = fieldsY + py(2 * COMPARTMENT_PAD + c.fields.length * FIELD_ROW_H);

    const fontSize = 9;
    const lineHeight = py(FIELD_ROW_H);

    return (
      <g key={`cls-${c.id}`}>
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
        {/* Compartment dividers */}
        <line
          x1={bx}
          x2={bx + bw}
          y1={fieldsY}
          y2={fieldsY}
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
        <line
          x1={bx}
          x2={bx + bw}
          y1={methodsY}
          y2={methodsY}
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
        {/* Class name */}
        <text
          x={bx + bw / 2}
          y={headerY + py(HEADER_H) / 2 + 3}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={fontSize + 1}
          fontWeight={600}
          fill="var(--color-ink)"
        >
          {c.name}
        </text>
        {/* Fields */}
        {c.fields.map((f, i) => (
          <text
            key={`f-${c.id}-${i}`}
            x={bx + 4}
            y={fieldsY + py(COMPARTMENT_PAD) + (i + 1) * lineHeight - 1}
            fontFamily="var(--font-mono)"
            fontSize={fontSize}
            fill="var(--color-ink-soft)"
          >
            {`${f.v} ${f.text}`}
          </text>
        ))}
        {/* Methods */}
        {c.methods.map((m, i) => (
          <text
            key={`m-${c.id}-${i}`}
            x={bx + 4}
            y={methodsY + py(COMPARTMENT_PAD) + (i + 1) * lineHeight - 1}
            fontFamily="var(--font-mono)"
            fontSize={fontSize}
            fill="var(--color-ink-soft)"
          >
            {`${m.v} ${m.text}`}
          </text>
        ))}
      </g>
    );
  }

  function edgeGeom(e: Edge) {
    const from = boxById.get(e.from)!;
    const to = boxById.get(e.to)!;
    const fromC = { x: px(from.cx), y: py(from.cy) };
    const toC = { x: px(to.cx), y: py(to.cy) };
    const start = anchorPoint(from, toC);
    const end = anchorPoint(to, fromC);
    let d = "";
    let midX = (start.x + end.x) / 2;
    let midY = (start.y + end.y) / 2;
    if (e.route === "elbow-h") {
      d = `M ${start.x} ${start.y} L ${end.x} ${start.y} L ${end.x} ${end.y}`;
      midX = (start.x + end.x) / 2;
      midY = start.y;
    } else if (e.route === "elbow-v") {
      d = `M ${start.x} ${start.y} L ${start.x} ${end.y} L ${end.x} ${end.y}`;
      midX = start.x;
      midY = (start.y + end.y) / 2;
    } else {
      d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    }
    return { d, start, end, midX, midY };
  }

  // Marker ids keyed per-kind. Each renders in the opposite-pointing direction
  // we need at the "far" end of the arrow:
  //   association → markerEnd (open arrowhead at target)
  //   aggregation → markerStart (hollow diamond at "whole" end)
  //   composition → markerStart (filled diamond at "whole" end)
  //   inheritance → markerEnd (hollow triangle at superclass)
  // In our edge list, `from` is always the "whole" (or subclass) and `to` is
  // the "part" / "referenced" / "superclass". So:
  //   association  → markerEnd  open arrow   at `to`
  //   aggregation  → markerStart hollow diamond at `from`
  //   composition  → markerStart filled diamond at `from`
  //   inheritance  → markerEnd  hollow triangle at `to` (the superclass)
  const MARKERS = {
    openArrow: `${MARKER_NS}-open-arrow`,
    hollowDiamond: `${MARKER_NS}-hollow-diamond`,
    filledDiamond: `${MARKER_NS}-filled-diamond`,
    hollowTriangle: `${MARKER_NS}-hollow-triangle`,
  } as const;

  // Specific edges used to position anchors (these relationship types always
  // render — anchors are safe).
  const compEdge = EDGES.find((e) => e.kind === "composition")!;
  const assocEdge = EDGES.find((e) => e.kind === "association")!;
  const aggEdge = EDGES.find((e) => e.kind === "aggregation")!;
  const inhEdge = EDGES.find((e) => e.kind === "inheritance")!;
  const compGeom = edgeGeom(compEdge);
  const assocGeom = edgeGeom(assocEdge);
  const aggGeom = edgeGeom(aggEdge);
  const inhGeom = edgeGeom(inhEdge);

  // Representative compartment (Order box) for the three-compartment anchor.
  const orderBox = boxById.get("Order")!;
  const orderBw = px(orderBox.w);
  const orderBh = py(classBoxHeight(orderBox));
  const orderBx = px(orderBox.cx) - orderBw / 2;
  const orderBy = py(orderBox.cy) - orderBh / 2;

  function renderEdge(e: Edge, i: number) {
    const g = edgeGeom(e);
    let markerStart: string | undefined;
    let markerEnd: string | undefined;
    if (e.kind === "association") markerEnd = `url(#${MARKERS.openArrow})`;
    if (e.kind === "aggregation") markerStart = `url(#${MARKERS.hollowDiamond})`;
    if (e.kind === "composition") markerStart = `url(#${MARKERS.filledDiamond})`;
    if (e.kind === "inheritance") markerEnd = `url(#${MARKERS.hollowTriangle})`;
    return (
      <g key={`edge-${i}`}>
        <path
          d={g.d}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={1.2}
          markerStart={markerStart}
          markerEnd={markerEnd}
        />
        {e.label && (
          <text
            x={g.midX + 4}
            y={g.midY - 4}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            {e.label}
          </text>
        )}
      </g>
    );
  }

  return (
    <svg width={width} height={height} role="img" aria-label="UML Class Diagram">
      <defs>
        {/* Open arrowhead — association. orient="auto" so markerEnd rotates. */}
        <marker
          id={MARKERS.openArrow}
          markerWidth={12}
          markerHeight={12}
          refX={10}
          refY={5}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M 0 0 L 10 5 L 0 10"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.4}
          />
        </marker>
        {/* Hollow diamond — aggregation. At markerStart end. */}
        <marker
          id={MARKERS.hollowDiamond}
          markerWidth={14}
          markerHeight={14}
          refX={1}
          refY={5}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M 0 5 L 5 0 L 10 5 L 5 10 Z"
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
        </marker>
        {/* Filled diamond — composition. At markerStart end. */}
        <marker
          id={MARKERS.filledDiamond}
          markerWidth={14}
          markerHeight={14}
          refX={1}
          refY={5}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M 0 5 L 5 0 L 10 5 L 5 10 Z"
            fill="var(--color-ink)"
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
        </marker>
        {/* Hollow triangle — inheritance. At markerEnd end. */}
        <marker
          id={MARKERS.hollowTriangle}
          markerWidth={14}
          markerHeight={14}
          refX={10}
          refY={5}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M 0 0 L 10 5 L 0 10 Z"
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
        </marker>
      </defs>
      <Group left={margin.left} top={margin.top}>
        {/* Edges first so boxes paint on top */}
        <g data-data-layer="true">
          {EDGES.map((e, i) => renderEdge(e, i))}
        </g>

        {/* Class boxes */}
        <g data-data-layer="true">
          {CLASSES.map((c) => renderClassBox(c))}
        </g>

        {/* Anchors */}

        {/* 1. Three-compartment class box (anchored on Order) */}
        <ExplainAnchor
          selector="class-box"
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

        {/* 2. Association (thin line, open arrowhead) */}
        <ExplainAnchor
          selector="association"
          index={2}
          pin={{ x: assocGeom.midX + 10, y: assocGeom.midY - 10 }}
          rect={{
            x: Math.max(0, Math.min(assocGeom.start.x, assocGeom.end.x) - 4),
            y: Math.max(0, Math.min(assocGeom.start.y, assocGeom.end.y) - 4),
            width: Math.max(10, Math.abs(assocGeom.end.x - assocGeom.start.x) + 8),
            height: Math.max(10, Math.abs(assocGeom.end.y - assocGeom.start.y) + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Aggregation (hollow diamond) */}
        <ExplainAnchor
          selector="aggregation"
          index={3}
          pin={{ x: aggGeom.start.x + 14, y: (aggGeom.start.y + aggGeom.end.y) / 2 }}
          rect={{
            x: Math.max(0, Math.min(aggGeom.start.x, aggGeom.end.x) - 6),
            y: Math.max(0, Math.min(aggGeom.start.y, aggGeom.end.y) - 4),
            width: Math.max(12, Math.abs(aggGeom.end.x - aggGeom.start.x) + 12),
            height: Math.max(10, Math.abs(aggGeom.end.y - aggGeom.start.y) + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Composition (filled diamond) */}
        <ExplainAnchor
          selector="composition"
          index={4}
          pin={{ x: (compGeom.start.x + compGeom.end.x) / 2, y: compGeom.start.y + 14 }}
          rect={{
            x: Math.max(0, Math.min(compGeom.start.x, compGeom.end.x) - 4),
            y: Math.max(0, Math.min(compGeom.start.y, compGeom.end.y) - 4),
            width: Math.max(10, Math.abs(compGeom.end.x - compGeom.start.x) + 8),
            height: Math.max(10, Math.abs(compGeom.end.y - compGeom.start.y) + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Inheritance (hollow triangle) */}
        <ExplainAnchor
          selector="inheritance"
          index={5}
          pin={{ x: inhGeom.end.x - 14, y: (inhGeom.start.y + inhGeom.end.y) / 2 }}
          rect={{
            x: Math.max(0, Math.min(inhGeom.start.x, inhGeom.end.x) - 6),
            y: Math.max(0, Math.min(inhGeom.start.y, inhGeom.end.y) - 4),
            width: Math.max(10, Math.abs(inhGeom.end.x - inhGeom.start.x) + 12),
            height: Math.max(10, Math.abs(inhGeom.end.y - inhGeom.start.y) + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Visibility glyphs (+ / - / #) — anchor on Order's fields block */}
        <ExplainAnchor
          selector="visibility"
          index={6}
          pin={{ x: orderBx - 12, y: orderBy + py(HEADER_H) + py(COMPARTMENT_PAD) + 6 }}
          rect={{
            x: Math.max(0, orderBx),
            y: Math.max(0, orderBy + py(HEADER_H)),
            width: Math.min(iw, orderBw),
            height: Math.min(ih, orderBh - py(HEADER_H)),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
