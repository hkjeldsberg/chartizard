import type { LiveChart } from "@/content/chart-schema";

export const cumulativeFlowDiagram: LiveChart = {
  id: "cumulative-flow-diagram",
  name: "Cumulative Flow Diagram",
  family: "change-over-time",
  sectors: ["project-management"],
  dataShapes: ["temporal"],
  tileSize: "L",
  status: "live",
  synopsis:
    "A stacked area chart of work-item counts by workflow state over time — lead time, WIP, and throughput are all visible as band widths, not hidden in a table.",
  whenToUse:
    "Use a cumulative flow diagram to monitor a team's Kanban flow or any queue-based process where items move through discrete states. It is the canonical chart of the Kanban community for a reason: a single picture shows whether work is accumulating, flowing, or stuck, and the width of each band is the answer to a specific question about the process. Skip it if you only care about one state — a run chart is simpler. Skip it if items can skip states or loop back — the stack order stops meaning anything.",
  howToRead:
    "Bands are stacked bottom to top in workflow order: Done at the bottom, then In Review, then In Progress, with To-Do as the backlog on top. Read vertical thickness as the number of items currently in that state; read horizontal distance between a band's top and the Done band's top at the same y-value as the lead time for an item that entered at that count. A parallel rise of all bands means scope and throughput are balanced; a band that swells without a matching swell below it is a bottleneck forming.",
  example: {
    title: "The Kanban community's canonical chart, after David J. Anderson",
    description:
      "Popularised by David J. Anderson's 2010 book Kanban: Successful Evolutionary Change for Your Technology Business, the cumulative flow diagram became the Kanban community's default lens on a team's flow. The most common finding on a real team's CFD is the In Progress band ballooning while In Review stays thin — a reviewer bottleneck. The chart is usually what triggers the WIP-limit conversation; a spreadsheet of the same counts would not.",
  },
  elements: [
    {
      selector: "in-progress-band",
      label: "In Progress band",
      explanation:
        "One workflow state's layer in the stack — here, items currently being worked on. Its vertical thickness at any day is the count in that state. A healthy In Progress band is thin and roughly constant; a growing one means work is piling up faster than it moves out.",
    },
    {
      selector: "wip-balloon",
      label: "WIP balloon",
      explanation:
        "The moment the In Progress band visibly swells while the band above it (To-Do) drains but the one below (In Review) does not grow. That shape is a bottleneck forming — items are being started faster than the next stage can accept them. On a real team's chart this is the cue for a WIP-limit conversation.",
    },
    {
      selector: "lead-time",
      label: "Lead time",
      explanation:
        "The horizontal distance from the top edge of an upstream band to the top edge of Done at the same count — how long it took the Nth item to cross the whole workflow. A widening gap between those two edges over time means lead time is growing; a narrowing one means the team is speeding up.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "Cumulative item count. Because the chart stacks states, the y-axis reads as the total scope at the top of the stack — scope rising is the To-Do band growing. Starting at zero is mandatory here: a truncated baseline would make the bands look like a magnitude chart, which they aren't.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "Time, usually in days from project start or sprint start. Intervals must be uniform — a weekend gap or a skipped day distorts every band's apparent slope and makes the lead-time measurement lie.",
    },
    {
      selector: "band-order",
      label: "Band order",
      explanation:
        "Bands stack in workflow order so the eye reads downstream-to-upstream bottom-to-top. Done at the floor, To-Do at the ceiling. Reordering bands would break the lead-time measurement: it relies on the top edge of each band being a cumulative arrival curve at that stage.",
    },
    {
      selector: "legend",
      label: "Legend",
      explanation:
        "The key between shade and workflow state. Four or five bands are near the limit of what colour-by-shade can separate; beyond that, direct labels inside the bands read better than a side legend.",
    },
  ],
};
