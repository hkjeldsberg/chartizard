"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Five participants in the login scenario, ordered left-to-right.
type ParticipantId =
  | "client"
  | "web"
  | "auth"
  | "db"
  | "session";

interface Participant {
  id: ParticipantId;
  label: string;
}

const PARTICIPANTS: ReadonlyArray<Participant> = [
  { id: "client", label: "Client" },
  { id: "web", label: "WebServer" },
  { id: "auth", label: "AuthService" },
  { id: "db", label: "UserDB" },
  { id: "session", label: "SessionStore" },
];

type MessageKind = "sync" | "return";

interface Message {
  // Time-ordered index (1..N) used in the label prefix.
  n: number;
  from: ParticipantId;
  to: ParticipantId;
  label: string;
  kind: MessageKind;
  // Layout-space y (0..100) where the arrow sits.
  y: number;
}

// Eight messages — the login handshake. y increases top-to-bottom.
const MESSAGES: ReadonlyArray<Message> = [
  { n: 1, from: "client", to: "web", label: "POST /login(email, pw)", kind: "sync", y: 10 },
  { n: 2, from: "web", to: "auth", label: "validateCreds(email, pw)", kind: "sync", y: 22 },
  { n: 3, from: "auth", to: "db", label: "SELECT * FROM users WHERE email=?", kind: "sync", y: 34 },
  { n: 4, from: "db", to: "auth", label: "row (or null)", kind: "return", y: 46 },
  { n: 5, from: "auth", to: "auth", label: "verify(hash, pw)", kind: "sync", y: 58 },
  { n: 6, from: "auth", to: "session", label: "createSession(userId)", kind: "sync", y: 70 },
  { n: 7, from: "session", to: "auth", label: "{sessionId}", kind: "return", y: 82 },
  { n: 8, from: "web", to: "client", label: "200 OK + Set-Cookie", kind: "return", y: 94 },
];

// Activation bars: thin filled rectangles on a participant's lifeline spanning
// the interval it is actively handling a synchronous call. Hand-chosen to
// match the login scenario's call/return structure.
interface Activation {
  participant: ParticipantId;
  // y-range in layout space.
  yStart: number;
  yEnd: number;
}

const ACTIVATIONS: ReadonlyArray<Activation> = [
  // WebServer active from the POST until it returns 200 OK.
  { participant: "web", yStart: 10, yEnd: 94 },
  // AuthService active from validateCreds until createSession returns.
  { participant: "auth", yStart: 22, yEnd: 82 },
  // UserDB active for the SELECT round-trip.
  { participant: "db", yStart: 34, yEnd: 46 },
  // SessionStore active for the createSession round-trip.
  { participant: "session", yStart: 70, yEnd: 82 },
];

export function UmlSequenceDiagram({ width, height }: Props) {
  // Top margin leaves room for the actor boxes; bottom for the x-label strip.
  const margin = { top: 44, right: 20, bottom: 24, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Evenly space participants across the plot area.
  const n = PARTICIPANTS.length;
  const lifelineX = (i: number) => {
    if (n === 1) return iw / 2;
    return (i / (n - 1)) * iw;
  };
  const xById = new Map<ParticipantId, number>(
    PARTICIPANTS.map((p, i) => [p.id, lifelineX(i)]),
  );

  // Layout-space y (0..100) → pixel y inside plot area.
  const py = (ly: number) => (ly / 100) * ih;

  const ACTOR_W = Math.min(110, (iw / n) * 0.82);
  const ACTOR_H = 22;
  const ACTIVATION_W = 8;

  // Geometry of the alt / opt / loop combined fragment box. We wrap the two
  // "verify + createSession" messages in an `alt [user found]` fragment — this
  // illustrates UML 2.0's branching mechanism without an actual branch in the
  // visual data.
  const altMessages = MESSAGES.filter((m) => m.n === 5 || m.n === 6);
  const altYTop = py(altMessages[0].y) - 10;
  const altYBottom = py(altMessages[altMessages.length - 1].y) + 8;
  const altXLeft = (xById.get("auth") ?? 0) - 14;
  const altXRight = (xById.get("session") ?? 0) + 14;

  // Pre-compute representative message geometries for anchors.
  const msg1 = MESSAGES[0]; // sync: client → web
  const msg4 = MESSAGES[3]; // return: db → auth
  const msg1X1 = xById.get(msg1.from)!;
  const msg1X2 = xById.get(msg1.to)!;
  const msg1Y = py(msg1.y);
  const msg4X1 = xById.get(msg4.from)!;
  const msg4X2 = xById.get(msg4.to)!;
  const msg4Y = py(msg4.y);

  // Activation bar for AuthService (representative).
  const authAct = ACTIVATIONS.find((a) => a.participant === "auth")!;
  const authX = xById.get("auth")!;
  const authActY1 = py(authAct.yStart);
  const authActY2 = py(authAct.yEnd);

  // Lifeline geometry for the "lifeline" anchor — target the Client column.
  const clientX = xById.get("client")!;

  return (
    <svg width={width} height={height} role="img" aria-label="UML sequence diagram">
      {/* Actor boxes — above the Group transform so we can paint into the
          top margin space without extra offset math. */}
      <g>
        {PARTICIPANTS.map((p, i) => {
          const cx = margin.left + lifelineX(i);
          const y = 12;
          return (
            <g key={`actor-${p.id}`} data-data-layer="true">
              <rect
                x={cx - ACTOR_W / 2}
                y={y}
                width={ACTOR_W}
                height={ACTOR_H}
                fill="var(--color-surface)"
                stroke="var(--color-ink)"
                strokeWidth={1.4}
              />
              <text
                x={cx}
                y={y + ACTOR_H / 2 + 4}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={11}
                fill="var(--color-ink)"
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </g>

      <Group left={margin.left} top={margin.top}>
        {/* Dashed lifelines dropping from each actor box. */}
        <g data-data-layer="true">
          {PARTICIPANTS.map((p, i) => {
            const cx = lifelineX(i);
            return (
              <line
                key={`lifeline-${p.id}`}
                x1={cx}
                x2={cx}
                y1={0}
                y2={ih}
                stroke="var(--color-ink-mute)"
                strokeWidth={1}
                strokeDasharray="3 4"
              />
            );
          })}
        </g>

        {/* Activation bars — thin filled rectangles on the lifelines. */}
        <g data-data-layer="true">
          {ACTIVATIONS.map((a) => {
            const cx = xById.get(a.participant)!;
            const y1 = py(a.yStart);
            const y2 = py(a.yEnd);
            return (
              <rect
                key={`act-${a.participant}-${a.yStart}`}
                x={cx - ACTIVATION_W / 2}
                y={y1}
                width={ACTIVATION_W}
                height={Math.max(2, y2 - y1)}
                fill="var(--color-surface)"
                stroke="var(--color-ink)"
                strokeWidth={1}
              />
            );
          })}
        </g>

        {/* `alt` combined fragment — UML 2.0 rectangular wrapper with a tab. */}
        <g data-data-layer="true">
          <rect
            x={altXLeft}
            y={altYTop}
            width={altXRight - altXLeft}
            height={altYBottom - altYTop}
            fill="none"
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="1 3"
          />
          {/* Tab */}
          <rect
            x={altXLeft}
            y={altYTop}
            width={34}
            height={12}
            fill="var(--color-surface)"
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          <text
            x={altXLeft + 4}
            y={altYTop + 9}
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-soft)"
          >
            alt
          </text>
          <text
            x={altXLeft + 38}
            y={altYTop + 9}
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            [user found]
          </text>
        </g>

        {/* Messages — horizontal arrows with mid-line labels. */}
        <g data-data-layer="true">
          {MESSAGES.map((m) => {
            const x1 = xById.get(m.from)!;
            const x2 = xById.get(m.to)!;
            const y = py(m.y);
            const dashed = m.kind === "return";
            const isSelfCall = m.from === m.to;

            if (isSelfCall) {
              // Self-call bracket: a small rightward loop off the lifeline.
              const stubW = 26;
              const stubH = 12;
              const path = `M ${x1 + 4} ${y} H ${x1 + stubW} V ${y + stubH} H ${x1 + 4}`;
              const headX = x1 + 4;
              const headY = y + stubH;
              return (
                <g key={`m-${m.n}`}>
                  <path
                    d={path}
                    fill="none"
                    stroke="var(--color-ink)"
                    strokeWidth={1.2}
                  />
                  <polygon
                    points={`${headX},${headY} ${headX + 6},${headY - 3} ${headX + 6},${headY + 3}`}
                    fill="var(--color-ink)"
                  />
                  <text
                    x={x1 + stubW + 6}
                    y={y + stubH / 2 + 3}
                    fontFamily="var(--font-mono)"
                    fontSize={10}
                    fill="var(--color-ink)"
                  >
                    {m.n}. {m.label}
                  </text>
                </g>
              );
            }

            const rightward = x2 > x1;
            // Shorten arrow so its head sits flush against the target lifeline
            // rather than overlapping it.
            const headSize = 6;
            const tipX = rightward ? x2 - 1 : x2 + 1;
            const baseX = rightward ? tipX - headSize : tipX + headSize;
            return (
              <g key={`m-${m.n}`}>
                <line
                  x1={x1}
                  x2={baseX}
                  y1={y}
                  y2={y}
                  stroke="var(--color-ink)"
                  strokeWidth={dashed ? 1 : 1.3}
                  strokeDasharray={dashed ? "4 3" : undefined}
                  opacity={dashed ? 0.85 : 1}
                />
                {/* Arrowhead */}
                <polygon
                  points={`${tipX},${y} ${baseX},${y - 4} ${baseX},${y + 4}`}
                  fill={dashed ? "var(--color-ink-mute)" : "var(--color-ink)"}
                />
                <text
                  x={(x1 + x2) / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink)"
                >
                  {m.n}. {m.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Time-arrow caption along the left gutter. */}
        <g data-data-layer="true">
          <text
            x={-6}
            y={ih + 18}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            TIME ↓
          </text>
        </g>

        {/* ----- Anchors ----- */}

        {/* 1. participant (Client actor box) */}
        <ExplainAnchor
          selector="participant"
          index={1}
          pin={{ x: clientX, y: -24 }}
          rect={{
            x: Math.max(0, clientX - ACTOR_W / 2),
            y: Math.max(0, -margin.top + 10),
            width: Math.min(iw, ACTOR_W),
            height: ACTOR_H + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. lifeline (Client's dashed vertical drop) */}
        <ExplainAnchor
          selector="lifeline"
          index={2}
          pin={{ x: clientX - 18, y: ih * 0.5 }}
          rect={{
            x: Math.max(0, clientX - 6),
            y: 0,
            width: 12,
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. sync-message (the POST /login call) */}
        <ExplainAnchor
          selector="sync-message"
          index={3}
          pin={{ x: (msg1X1 + msg1X2) / 2, y: msg1Y - 22 }}
          rect={{
            x: Math.min(msg1X1, msg1X2),
            y: Math.max(0, msg1Y - 10),
            width: Math.abs(msg1X2 - msg1X1),
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. return-message (dashed db → auth) */}
        <ExplainAnchor
          selector="return-message"
          index={4}
          pin={{ x: (msg4X1 + msg4X2) / 2, y: msg4Y + 18 }}
          rect={{
            x: Math.min(msg4X1, msg4X2),
            y: msg4Y - 8,
            width: Math.abs(msg4X2 - msg4X1),
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. activation-bar (AuthService's active interval) */}
        <ExplainAnchor
          selector="activation-bar"
          index={5}
          pin={{ x: authX + 22, y: (authActY1 + authActY2) / 2 }}
          rect={{
            x: Math.max(0, authX - ACTIVATION_W / 2 - 2),
            y: authActY1,
            width: ACTIVATION_W + 4,
            height: Math.max(4, authActY2 - authActY1),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. combined-fragment (alt tab / wrapper box) */}
        <ExplainAnchor
          selector="combined-fragment"
          index={6}
          pin={{ x: altXLeft + 16, y: altYTop - 12 }}
          rect={{
            x: Math.max(0, altXLeft),
            y: Math.max(0, altYTop),
            width: Math.min(iw - Math.max(0, altXLeft), altXRight - altXLeft),
            height: Math.min(ih - Math.max(0, altYTop), altYBottom - altYTop),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
