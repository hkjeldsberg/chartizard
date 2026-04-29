"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Actors sit outside the system boundary; use cases inside.
interface Actor {
  id: string;
  name: string;
  // Layout-space (0..100 × 0..100) position of the stick-figure's head centre.
  cx: number;
  cy: number;
  // "primary" = left, initiates scenarios. "secondary" = right, serves or supervises.
  role: "primary" | "secondary";
}

interface UseCase {
  id: string;
  label: string;
  // Centre in layout space.
  cx: number;
  cy: number;
}

type AssocKind = "association" | "include";

interface Association {
  from: string; // actor id OR use-case id (for include)
  to: string; // use-case id
  kind: AssocKind;
  // Include edges are directed use-case → use-case and drawn dashed with a
  // «include» stereotype label.
}

// The ATM domain — Jacobson's own teaching example in OOSE (1992 book;
// the method was developed at Objectory AB from 1987).
const ACTORS: ReadonlyArray<Actor> = [
  { id: "customer", name: "Customer", cx: 8, cy: 48, role: "primary" },
  { id: "staff", name: "Bank Staff", cx: 92, cy: 48, role: "secondary" },
];

const USE_CASES: ReadonlyArray<UseCase> = [
  { id: "withdraw", label: "Withdraw Cash", cx: 36, cy: 22 },
  { id: "deposit", label: "Deposit Cash", cx: 64, cy: 22 },
  { id: "balance", label: "Check Balance", cx: 36, cy: 44 },
  { id: "transfer", label: "Transfer Funds", cx: 64, cy: 44 },
  { id: "authenticate", label: "Authenticate", cx: 50, cy: 66 },
  { id: "receipt", label: "Print Receipt", cx: 64, cy: 84 },
];

const ASSOCIATIONS: ReadonlyArray<Association> = [
  // Customer participates in the four user-facing scenarios.
  { from: "customer", to: "withdraw", kind: "association" },
  { from: "customer", to: "deposit", kind: "association" },
  { from: "customer", to: "balance", kind: "association" },
  { from: "customer", to: "transfer", kind: "association" },
  // Bank Staff supervises withdrawals and maintains receipt hardware.
  { from: "staff", to: "withdraw", kind: "association" },
  { from: "staff", to: "receipt", kind: "association" },
  // «include»: every Withdraw scenario executes Authenticate first.
  { from: "withdraw", to: "authenticate", kind: "include" },
];

// Use-case oval geometry (layout-space).
const UC_RX = 12; // horizontal radius as % of iw
const UC_RY = 5; // vertical radius as % of ih

// System boundary rectangle (layout-space).
const BOUND_X = 22;
const BOUND_Y = 10;
const BOUND_W = 56;
const BOUND_H = 82;

// Unique marker namespace (avoids collisions if multiple diagrams mount).
const MARKER_NS = "uml-usecase";

export function UmlUseCaseDiagram({ width, height }: Props) {
  const margin = { top: 14, right: 14, bottom: 14, left: 14 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  // Pixel radii for use-case ovals (track aspect ratio via iw/ih).
  const rx = (iw * UC_RX) / 100;
  const ry = (ih * UC_RY) / 100;

  const ucById = new Map(USE_CASES.map((u) => [u.id, u]));
  const actorById = new Map(ACTORS.map((a) => [a.id, a]));

  // Return the perimeter point on a use-case ellipse closest to `towards`.
  function ellipseAnchor(u: UseCase, towards: { x: number; y: number }) {
    const cx = px(u.cx);
    const cy = py(u.cy);
    const dx = towards.x - cx;
    const dy = towards.y - cy;
    const len = Math.hypot(dx / rx, dy / ry) || 1;
    return { x: cx + dx / len, y: cy + dy / len };
  }

  // Stick-figure anchor — aim for the torso centre. Edges leave the figure
  // from shoulder height on the side that faces the target.
  function actorAnchor(a: Actor, towards: { x: number; y: number }) {
    const cx = px(a.cx);
    const cy = py(a.cy);
    const sign = towards.x >= cx ? 1 : -1;
    return { x: cx + sign * 6, y: cy + 4 };
  }

  // Association edge geometry (straight line between actor and use-case).
  interface EdgeGeom {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    midX: number;
    midY: number;
  }

  function actorToUseCase(a: Actor, u: UseCase): EdgeGeom {
    const uCentre = { x: px(u.cx), y: py(u.cy) };
    const aPoint = actorAnchor(a, uCentre);
    const uPoint = ellipseAnchor(u, aPoint);
    return {
      x1: aPoint.x,
      y1: aPoint.y,
      x2: uPoint.x,
      y2: uPoint.y,
      midX: (aPoint.x + uPoint.x) / 2,
      midY: (aPoint.y + uPoint.y) / 2,
    };
  }

  function useCaseToUseCase(from: UseCase, to: UseCase): EdgeGeom {
    const fromCentre = { x: px(from.cx), y: py(from.cy) };
    const toCentre = { x: px(to.cx), y: py(to.cy) };
    const a = ellipseAnchor(from, toCentre);
    const b = ellipseAnchor(to, fromCentre);
    return {
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      midX: (a.x + b.x) / 2,
      midY: (a.y + b.y) / 2,
    };
  }

  function renderStickFigure(a: Actor) {
    const cx = px(a.cx);
    const cy = py(a.cy);
    // Proportions: head r=4, torso 10, legs 10, arms span 14.
    return (
      <g key={`actor-${a.id}`}>
        {/* Head */}
        <circle
          cx={cx}
          cy={cy - 6}
          r={4}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.3}
        />
        {/* Torso */}
        <line x1={cx} y1={cy - 2} x2={cx} y2={cy + 8} stroke="var(--color-ink)" strokeWidth={1.3} />
        {/* Arms (outstretched) */}
        <line x1={cx - 7} y1={cy + 2} x2={cx + 7} y2={cy + 2} stroke="var(--color-ink)" strokeWidth={1.3} />
        {/* Legs */}
        <line x1={cx} y1={cy + 8} x2={cx - 5} y2={cy + 16} stroke="var(--color-ink)" strokeWidth={1.3} />
        <line x1={cx} y1={cy + 8} x2={cx + 5} y2={cy + 16} stroke="var(--color-ink)" strokeWidth={1.3} />
        {/* Name label under the figure */}
        <text
          x={cx}
          y={cy + 26}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink)"
        >
          {a.name}
        </text>
        {/* Role qualifier in small caps underneath */}
        <text
          x={cx}
          y={cy + 37}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={8}
          fill="var(--color-ink-mute)"
        >
          {a.role === "primary" ? "«primary»" : "«secondary»"}
        </text>
      </g>
    );
  }

  function renderUseCase(u: UseCase) {
    const cx = px(u.cx);
    const cy = py(u.cy);
    return (
      <g key={`uc-${u.id}`}>
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />
        <text
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9.5}
          fill="var(--color-ink)"
        >
          {u.label}
        </text>
      </g>
    );
  }

  // Pre-compute geometry for anchor positioning.
  const customer = actorById.get("customer")!;
  const staff = actorById.get("staff")!;
  const withdraw = ucById.get("withdraw")!;
  const authenticate = ucById.get("authenticate")!;

  // Representative association (Customer → Withdraw).
  const assocGeom = actorToUseCase(customer, withdraw);
  // Include edge geometry (Withdraw → Authenticate).
  const includeGeom = useCaseToUseCase(withdraw, authenticate);

  // System boundary pixel rect.
  const boundPxX = px(BOUND_X);
  const boundPxY = py(BOUND_Y);
  const boundPxW = px(BOUND_W);
  const boundPxH = py(BOUND_H);

  const MARKERS = {
    openArrow: `${MARKER_NS}-open-arrow`,
  } as const;

  return (
    <svg width={width} height={height} role="img" aria-label="UML Use Case Diagram">
      <defs>
        {/* Open arrowhead — solid V shape at line end, per UML 2 notation. */}
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
      </defs>
      <Group left={margin.left} top={margin.top}>
        {/* System boundary — labelled rectangle enclosing the use cases. */}
        <g data-data-layer="true">
          <rect
            x={boundPxX}
            y={boundPxY}
            width={boundPxW}
            height={boundPxH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          <text
            x={boundPxX + boundPxW / 2}
            y={boundPxY + 14}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={11}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            ATM System
          </text>
          {/* Divider under the system label */}
          <line
            x1={boundPxX + 10}
            x2={boundPxX + boundPxW - 10}
            y1={boundPxY + 20}
            y2={boundPxY + 20}
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
        </g>

        {/* Associations — drawn before ovals so ovals paint on top. */}
        <g data-data-layer="true">
          {ASSOCIATIONS.map((e, i) => {
            if (e.kind === "association") {
              const a = actorById.get(e.from)!;
              const u = ucById.get(e.to)!;
              const g = actorToUseCase(a, u);
              return (
                <line
                  key={`assoc-${i}`}
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                  opacity={0.9}
                />
              );
            }
            // include edge — dashed with open arrow at the target (Authenticate).
            const from = ucById.get(e.from)!;
            const to = ucById.get(e.to)!;
            const g = useCaseToUseCase(from, to);
            return (
              <g key={`inc-${i}`}>
                <line
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                  strokeDasharray="4 3"
                  markerEnd={`url(#${MARKERS.openArrow})`}
                />
                <text
                  x={g.midX + 6}
                  y={g.midY - 2}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  «include»
                </text>
              </g>
            );
          })}
        </g>

        {/* Use-case ovals (inside boundary). */}
        <g data-data-layer="true">
          {USE_CASES.map((u) => renderUseCase(u))}
        </g>

        {/* Actors (outside boundary). */}
        <g data-data-layer="true">
          {ACTORS.map((a) => renderStickFigure(a))}
        </g>

        {/* ----- Anchors ----- */}

        {/* 1. System boundary (the labelled rectangle). */}
        <ExplainAnchor
          selector="system-boundary"
          index={1}
          pin={{ x: boundPxX + boundPxW / 2, y: boundPxY - 6 }}
          rect={{
            x: Math.max(0, boundPxX),
            y: Math.max(0, boundPxY),
            width: Math.min(iw, boundPxW),
            height: Math.min(ih, 22),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Primary actor — Customer stick-figure on the left. */}
        <ExplainAnchor
          selector="primary-actor"
          index={2}
          pin={{ x: px(customer.cx), y: py(customer.cy) - 22 }}
          rect={{
            x: Math.max(0, px(customer.cx) - 10),
            y: Math.max(0, py(customer.cy) - 12),
            width: 20,
            height: 44,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Secondary actor — Bank Staff stick-figure on the right. */}
        <ExplainAnchor
          selector="secondary-actor"
          index={3}
          pin={{ x: px(staff.cx), y: py(staff.cy) - 22 }}
          rect={{
            x: Math.max(0, px(staff.cx) - 10),
            y: Math.max(0, py(staff.cy) - 12),
            width: Math.min(iw - Math.max(0, px(staff.cx) - 10), 20),
            height: 44,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Use-case oval (anchored on Withdraw Cash). */}
        <ExplainAnchor
          selector="use-case"
          index={4}
          pin={{ x: px(withdraw.cx), y: py(withdraw.cy) - ry - 8 }}
          rect={{
            x: Math.max(0, px(withdraw.cx) - rx),
            y: Math.max(0, py(withdraw.cy) - ry),
            width: Math.min(iw, rx * 2),
            height: Math.min(ih, ry * 2),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Association line (Customer → Withdraw Cash). */}
        <ExplainAnchor
          selector="association-line"
          index={5}
          pin={{ x: assocGeom.midX, y: assocGeom.midY - 10 }}
          rect={{
            x: Math.max(0, Math.min(assocGeom.x1, assocGeom.x2) - 3),
            y: Math.max(0, Math.min(assocGeom.y1, assocGeom.y2) - 6),
            width: Math.max(10, Math.abs(assocGeom.x2 - assocGeom.x1) + 6),
            height: Math.max(10, Math.abs(assocGeom.y2 - assocGeom.y1) + 12),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. «include» relationship (Withdraw Cash → Authenticate). */}
        <ExplainAnchor
          selector="include-relationship"
          index={6}
          pin={{ x: includeGeom.midX - 14, y: includeGeom.midY + 2 }}
          rect={{
            x: Math.max(0, Math.min(includeGeom.x1, includeGeom.x2) - 6),
            y: Math.max(0, Math.min(includeGeom.y1, includeGeom.y2) - 6),
            width: Math.max(14, Math.abs(includeGeom.x2 - includeGeom.x1) + 12),
            height: Math.max(14, Math.abs(includeGeom.y2 - includeGeom.y1) + 12),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
