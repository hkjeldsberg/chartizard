import type { LiveChart } from "@/content/chart-schema";

export const kanbanBoard: LiveChart = {
  id: "kanban-board",
  name: "Kanban Board",
  family: "flow",
  sectors: ["project-management"],
  dataShapes: ["categorical"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Columns of cards track each task's position in a pull-based workflow, with WIP limits printed on the column header so the constraint is unmissable.",
  whenToUse:
    "Use a Kanban board when the team pulls work rather than pushes it. Unlike a Gantt chart, a board assumes the schedule is emergent, not planned — the question is not 'when does this finish' but 'what is blocked, and how much is in flight'. Reach for it on any continuous-flow team: maintenance, support, anything without a natural release cadence.",
  howToRead:
    "Read the columns left-to-right as stages of work: To Do, In Progress, Review, Done. Each card is one task. The WIP chip on a column header is the rule of the board — 'WIP 3/5' means three tasks are in progress against a policy limit of five. When a column saturates its limit, no new card is pulled in until one leaves. That saturation is the point: visual fullness enforces the constraint better than any spreadsheet. Priority chips (P1 / P2 / P3) and assignee initials attach ownership and urgency to each card.",
  example: {
    title: "Taiichi Ohno's signboard, 1953 — ported to software by David Anderson, 2010",
    description:
      "Ohno watched American supermarket restocking in 1953 and saw a pull system: shelves trigger upstream production only when they empty. Toyota's factory floor adopted the same logic with a physical 看板 — a signboard passed back up the line. David Anderson's 2010 book mapped the pattern onto knowledge work: columns become workflow stages, the card becomes a ticket, and the WIP limit — the most important number on the board — becomes the policy that keeps everyone from starting more than they can finish.",
  },
  elements: [
    {
      selector: "column-header",
      label: "Column header",
      explanation:
        "Names a stage in the workflow. Columns are ordered left-to-right by flow direction — a card's physical position is its status, so you never need a separate status field. Change the column set to change the process.",
    },
    {
      selector: "wip-limit",
      label: "WIP limit",
      explanation:
        "The policy cap on how many cards a column is allowed to hold at once, printed as 'current/limit'. When the count hits the limit, the column is saturated and upstream work stops until a card is pulled out. This is the one invariant that separates a Kanban board from a task list.",
    },
    {
      selector: "in-progress-column",
      label: "In-Progress column",
      explanation:
        "The working-set column — the cards this team is actively carrying right now. Its WIP limit is usually the tightest number on the board because context-switching cost scales with in-flight items. If In-Progress is full, start nothing new.",
    },
    {
      selector: "task-card",
      label: "Task card",
      explanation:
        "One ticket of work. The card is the atomic unit the board moves: it enters at the left, crosses each column by being physically pulled, and leaves at the right. Keep cards small enough that a single card is done in days, not weeks — large cards stall columns.",
    },
    {
      selector: "priority-chip",
      label: "Priority chip",
      explanation:
        "A small tag (P1, P2, P3) that annotates urgency without reordering cards. A board is not a priority queue — priority rides with the card so a reviewer pulling the next item can break ties without scrolling a backlog.",
    },
    {
      selector: "assignee-avatar",
      label: "Assignee avatar",
      explanation:
        "Initials in a circle mark who owns the card in its current column. Avatars become a second layer of WIP signal: if one person's initials appear on three In-Progress cards, the system-level limit hid an individual-level overload.",
    },
  ],
};
