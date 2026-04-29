import type { LiveChart } from "@/content/chart-schema";

export const pertChart: LiveChart = {
  id: "pert-chart",
  name: "PERT Chart",
  family: "flow",
  sectors: ["project-management"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Activity-on-node network whose longest path through the dependency graph is the schedule — everything shorter has slack.",
  whenToUse:
    "Use a PERT chart when you need to see the dependency graph itself, not the calendar. A Gantt chart is the better picture of duration; a PERT chart is the better picture of structure. Reach for it when the question is 'which tasks are actually on the critical path' or 'where do I have slack to absorb a slip' — both are answered by the network shape before any bar is drawn.",
  howToRead:
    "Each node is a task. The four corners of the box are the results of the CPM math: ES (earliest start) and EF (earliest finish) in the top row from a forward pass through the graph; LS (latest start) and LF (latest finish) in the bottom row from a backward pass. Slack is LS − ES. Any task with zero slack is on the critical path — the longest chain from start to finish, highlighted in red. A one-day slip on a red task slips the whole project; a slip on a black task consumes slack without moving the launch date.",
  example: {
    title: "Polaris submarine missile program, US Navy Special Projects Office, 1957",
    description:
      "PERT was built to schedule the Polaris program — thousands of contractors, no historical duration data. Willard Fazar's team coped by asking each vendor for three estimates per task — optimistic, most-likely, pessimistic — and weighting them (o + 4m + p) / 6 to get an expected duration with uncertainty. That three-point estimation is what distinguishes classical PERT from CPM (DuPont, same year): identical graph math, different treatment of duration. The network here is a small 8-task software release whose critical path runs Design → Back-end API → Integration → QA → Launch, totalling 18 days.",
  },
  elements: [
    {
      selector: "task-node",
      label: "Task node",
      explanation:
        "A four-panel box. Top-left is earliest start (ES); top-right is earliest finish (EF); bottom-left is latest start (LS); bottom-right is latest finish (LF). The task name and duration sit in the middle. A node with matching ES=LS and EF=LF has zero slack and is on the critical path.",
    },
    {
      selector: "critical-path-arrow",
      label: "Critical-path arrow",
      explanation:
        "A red, thicker arrow marks an edge on the longest chain from start to finish. The critical path is the schedule: its total length is the project's minimum duration, and every task on it has zero slack. Slip any critical task and the launch date moves.",
    },
    {
      selector: "dependency-arrow",
      label: "Dependency arrow",
      explanation:
        "A normal-weight arrow is a precedence link on a path with slack. The successor cannot start until the predecessor finishes, but because the successor's path is shorter than the critical one, a bounded slip in either task can be absorbed without moving the finish date.",
    },
    {
      selector: "slack-node",
      label: "Slack node",
      explanation:
        "A task whose LS is later than its ES has slack equal to LS − ES. Docs here has 5 days of slack because its chain (A → C → Docs → Launch) is 5 days shorter than the critical chain. Slack is free scheduling capacity: it's where overtime should never be spent first.",
    },
    {
      selector: "three-point-estimate",
      label: "Three-point estimate",
      explanation:
        "The 'd' in each node hides PERT's signature move. Each duration is derived from three asks — optimistic (o), most-likely (m), pessimistic (p) — combined as (o + 4m + p) / 6. This is what separates PERT from CPM: the graph math is identical, but PERT treats duration as a distribution and CPM treats it as a point.",
    },
    {
      selector: "legend",
      label: "Legend",
      explanation:
        "Decodes the two line weights. Red, thicker lines are the critical path; thinner black lines are edges with slack. The total on the critical-path swatch (18d here) is the earliest possible finish — the single number a PERT chart exists to produce.",
    },
  ],
};
