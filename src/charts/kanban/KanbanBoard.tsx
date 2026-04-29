"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

type ColumnKey = "todo" | "in-progress" | "review" | "done";

interface Column {
  key: ColumnKey;
  label: string;
  // WIP limit — null means no limit (To Do, Done).
  wipLimit: number | null;
}

interface Card {
  id: string;
  col: ColumnKey;
  title: string;
  // Assignee initials rendered in the avatar circle.
  initials: string;
  // Priority — drives a P1/P2/P3 chip in the top-right of the card.
  priority: "P1" | "P2" | "P3";
}

// Four left-to-right columns. WIP limits only live on the middle columns;
// that's where the pull-system constraint bites.
const COLUMNS: ReadonlyArray<Column> = [
  { key: "todo", label: "To Do", wipLimit: null },
  { key: "in-progress", label: "In Progress", wipLimit: 5 },
  { key: "review", label: "Review", wipLimit: 3 },
  { key: "done", label: "Done", wipLimit: null },
];

// 10 hand-picked cards, distributed 3 / 3 / 2 / 2. Titles deliberately look
// like real software-engineering tickets.
const CARDS: ReadonlyArray<Card> = [
  // To Do (3)
  { id: "t1", col: "todo", title: "SSO: SAML assertion timeout", initials: "JM", priority: "P2" },
  { id: "t2", col: "todo", title: "Dashboard filter persistence", initials: "AK", priority: "P3" },
  { id: "t3", col: "todo", title: "Analytics: weekly digest email", initials: "RN", priority: "P3" },

  // In Progress (3 — the WIP 3/5 chip)
  { id: "p1", col: "in-progress", title: "Auth bug: iOS session expiry", initials: "HK", priority: "P1" },
  { id: "p2", col: "in-progress", title: "Import CSV mapping UI", initials: "LM", priority: "P2" },
  { id: "p3", col: "in-progress", title: "Rate-limit retry backoff", initials: "SO", priority: "P2" },

  // Review (2 — the WIP 2/3 chip)
  { id: "r1", col: "review", title: "Refactor billing adapter", initials: "DV", priority: "P2" },
  { id: "r2", col: "review", title: "Audit-log retention policy", initials: "EC", priority: "P3" },

  // Done (2)
  { id: "d1", col: "done", title: "Sentry DSN rotation", initials: "HK", priority: "P2" },
  { id: "d2", col: "done", title: "Copy: onboarding tooltip pass", initials: "AK", priority: "P3" },
];

export function KanbanBoard({ width, height }: Props) {
  const margin = { top: 36, right: 16, bottom: 20, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Column geometry — 4 equal columns, small gutter between them.
  const colGap = 10;
  const colW = Math.max(0, (iw - colGap * (COLUMNS.length - 1)) / COLUMNS.length);
  const colX = (i: number) => i * (colW + colGap);

  // Card geometry
  const cardH = 44;
  const cardGap = 8;
  const cardPadX = 8;
  const headerH = 28;

  // Group cards by column (preserving declared order).
  const cardsByCol: Record<ColumnKey, Card[]> = {
    todo: [],
    "in-progress": [],
    review: [],
    done: [],
  };
  for (const c of CARDS) cardsByCol[c.col].push(c);

  // Returns the pixel rect of a given card, given its column index and
  // within-column position.
  function cardRect(colIdx: number, rowIdx: number) {
    const x = colX(colIdx) + cardPadX;
    const y = headerH + 6 + rowIdx * (cardH + cardGap);
    const w = colW - cardPadX * 2;
    return { x, y, w, h: cardH };
  }

  // Pre-compute a representative card geometry for the card anchor — use
  // the first "In Progress" card because it's the chart's working unit.
  const inProgIdx = COLUMNS.findIndex((c) => c.key === "in-progress");
  const anchorRect = cardRect(inProgIdx, 0);

  // WIP chip anchor — the "WIP 3/5" chip on the In Progress column header.
  const wipChipX = colX(inProgIdx) + colW - 44;
  const wipChipY = 6;

  // Priority chip anchor — the P1 chip on the iOS session-expiry card.
  const priChipX = anchorRect.x + anchorRect.w - 22;
  const priChipY = anchorRect.y + 6;

  // Avatar anchor — bottom-right circle of the anchor card.
  const avatarCX = anchorRect.x + anchorRect.w - 12;
  const avatarCY = anchorRect.y + anchorRect.h - 12;

  // Full In-Progress column rect (for the column anchor).
  const inProgColRect = {
    x: colX(inProgIdx),
    y: 0,
    width: colW,
    height: ih,
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Kanban board">
      <Group left={margin.left} top={margin.top}>
        {/* Column backgrounds — subtle tint so each column reads as a band */}
        <g data-data-layer="true">
          {COLUMNS.map((col, i) => (
            <rect
              key={`bg-${col.key}`}
              x={colX(i)}
              y={0}
              width={colW}
              height={ih}
              fill="var(--color-hairline)"
              opacity={0.25}
              rx={4}
              ry={4}
            />
          ))}
        </g>

        {/* Column headers (label + optional WIP chip) */}
        <g data-data-layer="true">
          {COLUMNS.map((col, i) => {
            const x = colX(i);
            const count = cardsByCol[col.key].length;
            const hasLimit = col.wipLimit !== null;
            return (
              <g key={`hdr-${col.key}`}>
                <text
                  x={x + cardPadX}
                  y={18}
                  fontFamily="var(--font-mono)"
                  fontSize={11}
                  fontWeight={500}
                  fill="var(--color-ink)"
                >
                  {col.label.toUpperCase()}
                </text>
                {hasLimit ? (
                  <g>
                    <rect
                      x={x + colW - 44}
                      y={6}
                      width={38}
                      height={16}
                      rx={8}
                      ry={8}
                      fill="var(--color-surface)"
                      stroke="var(--color-ink)"
                      strokeWidth={1}
                    />
                    <text
                      x={x + colW - 25}
                      y={17}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontSize={9}
                      fill="var(--color-ink)"
                    >
                      {`WIP ${count}/${col.wipLimit}`}
                    </text>
                  </g>
                ) : (
                  <text
                    x={x + colW - 6}
                    y={17}
                    textAnchor="end"
                    fontFamily="var(--font-mono)"
                    fontSize={9}
                    fill="var(--color-ink-mute)"
                  >
                    {count}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Column divider rules (top of card area) */}
        <g data-data-layer="true">
          {COLUMNS.map((col, i) => (
            <line
              key={`rule-${col.key}`}
              x1={colX(i)}
              x2={colX(i) + colW}
              y1={headerH}
              y2={headerH}
              stroke="var(--color-hairline)"
              strokeWidth={1}
            />
          ))}
        </g>

        {/* Cards */}
        <g data-data-layer="true">
          {COLUMNS.map((col, colIdx) =>
            cardsByCol[col.key].map((card, rowIdx) => {
              const r = cardRect(colIdx, rowIdx);
              return (
                <g key={`card-${card.id}`}>
                  {/* card body */}
                  <rect
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    rx={4}
                    ry={4}
                    fill="var(--color-surface)"
                    stroke="var(--color-ink)"
                    strokeWidth={1}
                  />
                  {/* title (clipped visually by column width; short strings
                      chosen so no clipping actually happens at the common
                      tile size) */}
                  <text
                    x={r.x + 8}
                    y={r.y + 16}
                    fontFamily="var(--font-mono)"
                    fontSize={9.5}
                    fill="var(--color-ink)"
                  >
                    {card.title}
                  </text>
                  {/* priority chip (top-right) */}
                  <g>
                    <rect
                      x={r.x + r.w - 22}
                      y={r.y + 6}
                      width={18}
                      height={10}
                      rx={2}
                      ry={2}
                      fill={
                        card.priority === "P1"
                          ? "var(--color-ink)"
                          : "var(--color-surface)"
                      }
                      stroke="var(--color-ink)"
                      strokeWidth={1}
                    />
                    <text
                      x={r.x + r.w - 13}
                      y={r.y + 14}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontSize={8}
                      fontWeight={500}
                      fill={
                        card.priority === "P1"
                          ? "var(--color-page)"
                          : "var(--color-ink)"
                      }
                    >
                      {card.priority}
                    </text>
                  </g>
                  {/* assignee avatar (bottom-right) */}
                  <g>
                    <circle
                      cx={r.x + r.w - 12}
                      cy={r.y + r.h - 12}
                      r={8}
                      fill="var(--color-surface)"
                      stroke="var(--color-ink)"
                      strokeWidth={1}
                    />
                    <text
                      x={r.x + r.w - 12}
                      y={r.y + r.h - 9}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontSize={8}
                      fill="var(--color-ink)"
                    >
                      {card.initials}
                    </text>
                  </g>
                </g>
              );
            }),
          )}
        </g>

        {/* -------- Anchors (6) -------- */}

        {/* 1. Column header — "To Do" header text */}
        <ExplainAnchor
          selector="column-header"
          index={1}
          pin={{ x: colX(0) + 40, y: -12 }}
          rect={{ x: colX(0), y: 0, width: colW, height: headerH }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. WIP limit chip — the "WIP 3/5" pill on In Progress */}
        <ExplainAnchor
          selector="wip-limit"
          index={2}
          pin={{ x: wipChipX + 19, y: wipChipY - 12 }}
          rect={{ x: wipChipX - 2, y: wipChipY - 2, width: 42, height: 20 }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. In-Progress column — the whole active-work band */}
        <ExplainAnchor
          selector="in-progress-column"
          index={3}
          pin={{ x: inProgColRect.x + inProgColRect.width / 2, y: ih - 10 }}
          rect={inProgColRect}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Task card — the iOS auth-bug card */}
        <ExplainAnchor
          selector="task-card"
          index={4}
          pin={{ x: anchorRect.x + anchorRect.w / 2, y: anchorRect.y + anchorRect.h + 14 }}
          rect={{
            x: anchorRect.x,
            y: anchorRect.y,
            width: anchorRect.w,
            height: anchorRect.h,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Priority chip — the P1 chip on the auth-bug card */}
        <ExplainAnchor
          selector="priority-chip"
          index={5}
          pin={{ x: priChipX + 9, y: priChipY - 12 }}
          rect={{ x: priChipX - 2, y: priChipY - 2, width: 22, height: 14 }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Assignee avatar — initials circle bottom-right of the card */}
        <ExplainAnchor
          selector="assignee-avatar"
          index={6}
          pin={{ x: avatarCX + 18, y: avatarCY + 2 }}
          rect={{
            x: avatarCX - 10,
            y: avatarCY - 10,
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

      </Group>
    </svg>
  );
}
