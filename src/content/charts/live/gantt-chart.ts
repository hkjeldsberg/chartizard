import type { LiveChart } from "@/content/chart-schema";

export const ganttChart: LiveChart = {
  id: "gantt-chart",
  name: "Gantt Chart",
  family: "change-over-time",
  sectors: ["project-management"],
  dataShapes: ["temporal"],
  tileSize: "W",
  status: "live",
  synopsis:
    "Plots tasks as horizontal bars on a time axis so duration, overlap, and dependency collapse into a single picture.",
  whenToUse:
    "Use a Gantt chart when the plan has dependencies. Task-lists and burn-down charts tell you the work and the pace, but only a Gantt shows you which tasks block which, where slack lives, and how long the critical path actually is. Reach for it at the start of any multi-phase rollout where the question is not 'what are we doing' but 'what has to finish before what can start'.",
  howToRead:
    "Each row is a task. Bar length is duration; bar position is the time window. The faint connectors between bars encode dependency — the tail sits at a task's end, the arrow at the dependent task's start. The chart's headline feature is the critical path: the longest chain of dependent tasks, whose total length is the earliest possible finish date. Tasks off the critical path have slack and can slip without moving the launch. Zero-duration milestones are drawn as diamonds rather than bars.",
  example: {
    title: "Eight-week software rollout, six tasks, one critical path",
    description:
      "Discovery, Design, API build, Frontend build, QA, Launch. Frontend runs in parallel with API build and is not on the critical path — compressing it saves nothing. The critical path runs Discovery → Design → API → QA → Launch, and the earliest possible launch is week 8 because that chain sums to eight weeks. The Gantt chart makes that conclusion readable in one glance; the same information in a task list takes a spreadsheet formula.",
  },
  elements: [
    {
      selector: "bar",
      label: "Task bar",
      explanation:
        "A horizontal rectangle whose left edge is the task's start, right edge is its end, and length is its duration. The whole chart is built from these bars; everything else is scaffolding that puts them in context.",
    },
    {
      selector: "x-axis",
      label: "X-axis (weeks)",
      explanation:
        "The time axis. Here calibrated in weeks from W0 to W8; in practice it can be days, weeks, or months depending on the scale of the plan. Reading a Gantt chart always starts here.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (task list)",
      explanation:
        "One row per task. Order usually follows the plan's logical flow — earliest starts at the top — so the critical path reads as a staircase descending left to right.",
    },
    {
      selector: "dependency-arrow",
      label: "Dependency connector",
      explanation:
        "Links a predecessor's end to a successor's start. Connectors are the reason Gantt charts survive: without them you have a timeline of bars; with them you have a plan that can tell you what slips if a predecessor does.",
    },
    {
      selector: "milestone",
      label: "Milestone",
      explanation:
        "A zero-duration event drawn as a diamond. Launch is the canonical case — nothing happens over an interval, a single thing happens on a date. Collapsing it to a point prevents readers from over-counting how much work remains.",
    },
    {
      selector: "critical-path",
      label: "Critical path",
      explanation:
        "The longest chain of dependent tasks. Its total length is the earliest possible finish; its tasks have zero slack, so any slip on the critical path slips the launch. Non-critical tasks (here: Frontend build) can absorb delay without moving the date.",
    },
  ],
};
