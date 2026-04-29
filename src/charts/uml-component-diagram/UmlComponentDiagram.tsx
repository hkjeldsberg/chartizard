"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// A UML 2 component: rectangle with the «component» stereotype top-left and
// the two-box component icon top-right. Provides zero or more interfaces
// (lollipops) and requires zero or more interfaces (sockets).
interface Component {
  id: string;
  name: string;
  // Layout-space (0..100 × 0..100) centre.
  cx: number;
  cy: number;
  // Layout-space width / height.
  w: number;
  h: number;
  // Provided interfaces — lollipops drawn on a specific side of the rectangle.
  provides: ReadonlyArray<{ name: string; side: Side }>;
  // Required interfaces — sockets drawn on a specific side.
  requires: ReadonlyArray<{ name: string; side: Side }>;
}

type Side = "left" | "right" | "top" | "bottom";

// Connection: a required interface on one component fits a provided interface
// on another. Rendered as "socket embracing the lollipop" tangentially.
interface Connection {
  provider: string; // component id that owns the lollipop
  consumer: string; // component id that owns the socket
  interfaceName: string; // must match both sides' interface label
}

// E-commerce backend: six components with provides/requires wiring that
// produces four lollipop/socket pairs.
const COMPONENTS: ReadonlyArray<Component> = [
  {
    id: "web",
    name: "WebFrontend",
    cx: 14,
    cy: 50,
    w: 22,
    h: 18,
    provides: [],
    requires: [
      { name: "Auth", side: "right" },
      { name: "Catalog", side: "right" },
      { name: "Order", side: "right" },
    ],
  },
  {
    id: "auth",
    name: "AuthService",
    cx: 52,
    cy: 14,
    w: 22,
    h: 16,
    provides: [{ name: "Auth", side: "left" }],
    requires: [],
  },
  {
    id: "catalog",
    name: "ProductCatalog",
    cx: 52,
    cy: 38,
    w: 22,
    h: 16,
    provides: [{ name: "Catalog", side: "left" }],
    requires: [],
  },
  {
    id: "order",
    name: "OrderService",
    cx: 52,
    cy: 66,
    w: 22,
    h: 18,
    provides: [{ name: "Order", side: "left" }],
    requires: [
      { name: "Payment", side: "right" },
      { name: "Shipping", side: "right" },
    ],
  },
  {
    id: "payment",
    name: "PaymentGateway",
    cx: 88,
    cy: 54,
    w: 22,
    h: 16,
    provides: [{ name: "Payment", side: "left" }],
    requires: [],
  },
  {
    id: "shipping",
    name: "ShippingService",
    cx: 88,
    cy: 82,
    w: 22,
    h: 16,
    provides: [{ name: "Shipping", side: "left" }],
    requires: [],
  },
];

const CONNECTIONS: ReadonlyArray<Connection> = [
  { provider: "auth", consumer: "web", interfaceName: "Auth" },
  { provider: "catalog", consumer: "web", interfaceName: "Catalog" },
  { provider: "order", consumer: "web", interfaceName: "Order" },
  { provider: "payment", consumer: "order", interfaceName: "Payment" },
  { provider: "shipping", consumer: "order", interfaceName: "Shipping" },
];

// Pixel length of the stem that carries a lollipop or socket out from a
// component edge. Chosen so that the lollipop ball and its matching socket
// half-circle can kiss at the midpoint between two adjacent components.
const STEM = 14;
const LOLLI_R = 3.6;
const SOCKET_R = 5.6;

export function UmlComponentDiagram({ width, height }: Props) {
  const margin = { top: 16, right: 16, bottom: 16, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const byId = new Map(COMPONENTS.map((c) => [c.id, c]));

  // Compute the pixel-space geometry of a component rectangle.
  function rectOf(c: Component) {
    const w = px(c.w);
    const h = py(c.h);
    const x = px(c.cx) - w / 2;
    const y = py(c.cy) - h / 2;
    return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
  }

  // Return the anchor point where an interface stem attaches to a component
  // edge. Multiple interfaces on the same side are distributed along that
  // edge so their stems don't overlap.
  function interfaceAttachPoint(
    c: Component,
    side: Side,
    idx: number,
    count: number,
  ) {
    const r = rectOf(c);
    const t = (idx + 1) / (count + 1); // fraction along the edge (0..1)
    if (side === "left") return { x: r.x, y: r.y + r.h * t };
    if (side === "right") return { x: r.x + r.w, y: r.y + r.h * t };
    if (side === "top") return { x: r.x + r.w * t, y: r.y };
    return { x: r.x + r.w * t, y: r.y + r.h };
  }

  // Given an edge side, return the outward unit vector (stems grow away
  // from the component).
  function outwardVec(side: Side): { dx: number; dy: number } {
    if (side === "left") return { dx: -1, dy: 0 };
    if (side === "right") return { dx: 1, dy: 0 };
    if (side === "top") return { dx: 0, dy: -1 };
    return { dx: 0, dy: 1 };
  }

  interface LollipopGeom {
    stemStartX: number;
    stemStartY: number;
    stemEndX: number;
    stemEndY: number;
    ballX: number;
    ballY: number;
    labelX: number;
    labelY: number;
    side: Side;
  }

  interface SocketGeom {
    stemStartX: number;
    stemStartY: number;
    stemEndX: number;
    stemEndY: number;
    cupCX: number;
    cupCY: number;
    // Orientation angle for the half-circle opening (degrees).
    openingAngle: number;
    labelX: number;
    labelY: number;
    side: Side;
  }

  function lollipopGeom(c: Component, name: string): LollipopGeom {
    const provides = c.provides;
    const idx = provides.findIndex((p) => p.name === name);
    const side = provides[idx].side;
    const onSide = provides.filter((p) => p.side === side);
    const onSideIdx = onSide.findIndex((p) => p.name === name);
    const attach = interfaceAttachPoint(c, side, onSideIdx, onSide.length);
    const v = outwardVec(side);
    const stemEndX = attach.x + v.dx * STEM;
    const stemEndY = attach.y + v.dy * STEM;
    const ballX = stemEndX + v.dx * LOLLI_R;
    const ballY = stemEndY + v.dy * LOLLI_R;
    // Label sits past the ball in the outward direction.
    const labelX = ballX + v.dx * 9;
    const labelY = ballY + v.dy * 9 + (side === "bottom" ? 4 : side === "top" ? -2 : 3);
    return {
      stemStartX: attach.x,
      stemStartY: attach.y,
      stemEndX,
      stemEndY,
      ballX,
      ballY,
      labelX,
      labelY,
      side,
    };
  }

  function socketGeom(c: Component, name: string): SocketGeom {
    const requires = c.requires;
    const idx = requires.findIndex((r) => r.name === name);
    const side = requires[idx].side;
    const onSide = requires.filter((r) => r.side === side);
    const onSideIdx = onSide.findIndex((r) => r.name === name);
    const attach = interfaceAttachPoint(c, side, onSideIdx, onSide.length);
    const v = outwardVec(side);
    const stemEndX = attach.x + v.dx * STEM;
    const stemEndY = attach.y + v.dy * STEM;
    // The cup's centre sits at the stem tip; the half-circle opens outward.
    const cupCX = stemEndX;
    const cupCY = stemEndY;
    const openingAngle = side === "right" ? 0 : side === "left" ? 180 : side === "bottom" ? 90 : -90;
    const labelX = stemEndX + v.dx * (SOCKET_R + 8);
    const labelY = stemEndY + v.dy * (SOCKET_R + 8) + (side === "bottom" ? 4 : side === "top" ? -2 : 3);
    return {
      stemStartX: attach.x,
      stemStartY: attach.y,
      stemEndX,
      stemEndY,
      cupCX,
      cupCY,
      openingAngle,
      labelX,
      labelY,
      side,
    };
  }

  // Build a path for a half-circle that opens in the direction given by
  // `openingAngle` (degrees, standard math convention where 0° = +x).
  // The arc's diameter is SOCKET_R*2 and it's centred at (cx, cy).
  function halfCirclePath(cx: number, cy: number, r: number, openingAngle: number): string {
    // The "closed" side of the cup is opposite the opening. The arc endpoints
    // are perpendicular to the opening direction.
    const rad = (openingAngle * Math.PI) / 180;
    const perpX = -Math.sin(rad);
    const perpY = Math.cos(rad);
    const p1x = cx + perpX * r;
    const p1y = cy + perpY * r;
    const p2x = cx - perpX * r;
    const p2y = cy - perpY * r;
    // Sweep away from the opening direction.
    // We choose sweep-flag so the arc bulges in the direction of -opening.
    const sweepFlag = 1;
    return `M ${p1x} ${p1y} A ${r} ${r} 0 0 ${sweepFlag} ${p2x} ${p2y}`;
  }

  function renderComponent(c: Component) {
    const r = rectOf(c);
    // Component icon (2-box UML glyph) at top-right.
    const iconW = 11;
    const iconH = 7;
    const iconX = r.x + r.w - iconW - 4;
    const iconY = r.y + 4;
    return (
      <g key={`comp-${c.id}`}>
        <rect
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.3}
        />
        {/* Stereotype «component» label, top-left */}
        <text
          x={r.x + 4}
          y={r.y + 11}
          fontFamily="var(--font-mono)"
          fontSize={8}
          fill="var(--color-ink-mute)"
        >
          «component»
        </text>
        {/* Component icon — one large rectangle with two small boxes on its
            left edge, per UML 2.0 notation. */}
        <rect
          x={iconX + 2}
          y={iconY}
          width={iconW - 2}
          height={iconH}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
        <rect
          x={iconX}
          y={iconY + 1}
          width={4}
          height={2}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
        <rect
          x={iconX}
          y={iconY + 4}
          width={4}
          height={2}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
        {/* Component name, centred vertically in the rectangle body */}
        <text
          x={r.cx}
          y={r.cy + 4}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10.5}
          fontWeight={600}
          fill="var(--color-ink)"
        >
          {c.name}
        </text>
      </g>
    );
  }

  function renderLollipop(g: LollipopGeom, name: string) {
    return (
      <g key={`lolli-${name}-${g.ballX.toFixed(1)}`}>
        <line
          x1={g.stemStartX}
          y1={g.stemStartY}
          x2={g.stemEndX}
          y2={g.stemEndY}
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />
        <circle
          cx={g.ballX}
          cy={g.ballY}
          r={LOLLI_R}
          fill="var(--color-ink)"
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
        <text
          x={g.labelX}
          y={g.labelY}
          textAnchor={g.side === "left" ? "end" : g.side === "right" ? "start" : "middle"}
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-soft)"
        >
          {name}
        </text>
      </g>
    );
  }

  function renderSocket(g: SocketGeom, name: string) {
    return (
      <g key={`socket-${name}-${g.cupCX.toFixed(1)}`}>
        <line
          x1={g.stemStartX}
          y1={g.stemStartY}
          x2={g.stemEndX}
          y2={g.stemEndY}
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />
        <path
          d={halfCirclePath(g.cupCX, g.cupCY, SOCKET_R, g.openingAngle)}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={1.3}
        />
        <text
          x={g.labelX}
          y={g.labelY}
          textAnchor={g.side === "left" ? "end" : g.side === "right" ? "start" : "middle"}
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-soft)"
        >
          {name}
        </text>
      </g>
    );
  }

  // Coupling lines — connect the lollipop's ball to the matching socket's
  // cup centre. Rendered as a plain line so the "ball sits inside the cup"
  // visual reads as one atomic connector at this tile size.
  interface Coupling {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    interfaceName: string;
  }
  const couplings: Coupling[] = CONNECTIONS.map((conn) => {
    const provider = byId.get(conn.provider)!;
    const consumer = byId.get(conn.consumer)!;
    const lolli = lollipopGeom(provider, conn.interfaceName);
    const sock = socketGeom(consumer, conn.interfaceName);
    return {
      x1: lolli.ballX,
      y1: lolli.ballY,
      x2: sock.cupCX,
      y2: sock.cupCY,
      interfaceName: conn.interfaceName,
    };
  });

  // Pre-compute geometry for anchors.
  const authComp = byId.get("auth")!;
  const authLolli = lollipopGeom(authComp, "Auth");
  const webSocketAuth = socketGeom(byId.get("web")!, "Auth");
  const authCoupling = couplings.find((c) => c.interfaceName === "Auth")!;

  return (
    <svg width={width} height={height} role="img" aria-label="UML Component Diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Coupling lines first so the lollipop/socket glyphs paint on top. */}
        <g data-data-layer="true">
          {couplings.map((c, i) => (
            <line
              key={`coup-${i}`}
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              stroke="var(--color-ink)"
              strokeWidth={1.2}
              opacity={0.85}
            />
          ))}
        </g>

        {/* Component rectangles */}
        <g data-data-layer="true">
          {COMPONENTS.map((c) => renderComponent(c))}
        </g>

        {/* Lollipops (provided interfaces) */}
        <g data-data-layer="true">
          {COMPONENTS.flatMap((c) =>
            c.provides.map((p) => {
              const g = lollipopGeom(c, p.name);
              return renderLollipop(g, p.name);
            }),
          )}
        </g>

        {/* Sockets (required interfaces) */}
        <g data-data-layer="true">
          {COMPONENTS.flatMap((c) =>
            c.requires.map((r) => {
              const g = socketGeom(c, r.name);
              return renderSocket(g, r.name);
            }),
          )}
        </g>

        {/* ----- Anchors ----- */}

        {/* 1. Component rectangle (anchored on AuthService — shows stereotype + icon clearly). */}
        <ExplainAnchor
          selector="component-rectangle"
          index={1}
          pin={{ x: (rectOf(authComp).x + rectOf(authComp).w / 2), y: rectOf(authComp).y - 10 }}
          rect={{
            x: Math.max(0, rectOf(authComp).x),
            y: Math.max(0, rectOf(authComp).y),
            width: Math.min(iw, rectOf(authComp).w),
            height: Math.min(ih, rectOf(authComp).h),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Stereotype label (the «component» string in top-left corner). */}
        <ExplainAnchor
          selector="stereotype-label"
          index={2}
          pin={{ x: rectOf(authComp).x - 10, y: rectOf(authComp).y + 10 }}
          rect={{
            x: Math.max(0, rectOf(authComp).x),
            y: Math.max(0, rectOf(authComp).y),
            width: Math.min(iw, 62),
            height: Math.min(ih, 16),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Provided interface (lollipop on AuthService). */}
        <ExplainAnchor
          selector="provided-interface"
          index={3}
          pin={{ x: authLolli.ballX, y: authLolli.ballY - 12 }}
          rect={{
            x: Math.max(0, Math.min(authLolli.stemStartX, authLolli.ballX) - 6),
            y: Math.max(0, Math.min(authLolli.stemStartY, authLolli.ballY) - 6),
            width: Math.max(12, Math.abs(authLolli.ballX - authLolli.stemStartX) + 12),
            height: Math.max(12, Math.abs(authLolli.ballY - authLolli.stemStartY) + 12),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Required interface (socket on WebFrontend — Auth socket). */}
        <ExplainAnchor
          selector="required-interface"
          index={4}
          pin={{ x: webSocketAuth.cupCX, y: webSocketAuth.cupCY - 14 }}
          rect={{
            x: Math.max(0, Math.min(webSocketAuth.stemStartX, webSocketAuth.cupCX) - SOCKET_R - 2),
            y: Math.max(0, Math.min(webSocketAuth.stemStartY, webSocketAuth.cupCY) - SOCKET_R - 2),
            width: Math.max(14, Math.abs(webSocketAuth.cupCX - webSocketAuth.stemStartX) + SOCKET_R * 2 + 4),
            height: Math.max(14, Math.abs(webSocketAuth.cupCY - webSocketAuth.stemStartY) + SOCKET_R * 2 + 4),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Lollipop-socket coupling (Auth connection — between AuthService and WebFrontend). */}
        <ExplainAnchor
          selector="coupling"
          index={5}
          pin={{ x: (authCoupling.x1 + authCoupling.x2) / 2, y: (authCoupling.y1 + authCoupling.y2) / 2 - 14 }}
          rect={{
            x: Math.max(0, Math.min(authCoupling.x1, authCoupling.x2) - 4),
            y: Math.max(0, Math.min(authCoupling.y1, authCoupling.y2) - 4),
            width: Math.max(16, Math.abs(authCoupling.x2 - authCoupling.x1) + 8),
            height: Math.max(16, Math.abs(authCoupling.y2 - authCoupling.y1) + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Interface name label (anchored on the WebFrontend Auth socket's label). */}
        <ExplainAnchor
          selector="interface-name"
          index={6}
          pin={{ x: webSocketAuth.labelX, y: webSocketAuth.labelY - 14 }}
          rect={{
            x: Math.max(0, webSocketAuth.labelX - 20),
            y: Math.max(0, webSocketAuth.labelY - 10),
            width: Math.min(iw, 40),
            height: Math.min(ih, 16),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Component icon (the 2-box glyph in AuthService's top-right). */}
        <ExplainAnchor
          selector="component-icon"
          index={7}
          pin={{ x: rectOf(authComp).x + rectOf(authComp).w + 10, y: rectOf(authComp).y + 8 }}
          rect={{
            x: Math.max(0, rectOf(authComp).x + rectOf(authComp).w - 18),
            y: Math.max(0, rectOf(authComp).y + 2),
            width: Math.min(iw, 18),
            height: Math.min(ih, 12),
          }}
        >
          <g />
        </ExplainAnchor>

      </Group>
    </svg>
  );
}
