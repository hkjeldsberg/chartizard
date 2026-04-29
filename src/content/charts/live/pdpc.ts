import type { LiveChart } from "@/content/chart-schema";

export const pdpc: LiveChart = {
  id: "pdpc",
  name: "Process Decision Program Chart (PDPC)",
  family: "flow",
  sectors: ["quality"],
  dataShapes: ["hierarchical"],
  tileSize: "M",
  status: "live",

  synopsis:
    "A tree diagram that pre-maps failure modes at each step of a plan and attaches a feasibility-tested countermeasure to every leaf.",

  whenToUse:
    "Use a PDPC at the planning stage of a complex project when failure is costly and surprises are predictable. It works on any multi-step goal where individual steps can go wrong in distinct ways: product launches, clinical protocols, infrastructure deployments. The chart is most useful when the planning team runs through each branch to decide which countermeasures are actually worth implementing before they are needed.",

  howToRead:
    "Read top-down: the root is the overall goal; the second level is the set of major tasks required to reach it; the third level is the list of potential problems under each task. The bottom level is the countermeasure for each problem. A circle (○) marks a countermeasure judged feasible and adopted; a cross (×) marks one evaluated and rejected. The tree's branching structure makes it immediately obvious which tasks carry the most risk by the density of ×-marked leaves.",

  example: {
    title: "Toyota supplier-disruption response, 2011 Tohoku earthquake",
    description:
      "Toyota's supply-chain resilience team used PDPC-style contingency maps after the 2011 earthquake cut 150 critical parts from single-source suppliers. Each disrupted part was a leaf; countermeasures included alternative sourcing, design substitution, and inventory build-ahead — each rated ○ or × based on lead-time and cost. The visible ×-chain for rare resins forced the redesign of two engine-bay components to use available materials before the next seismic event.",
  },

  elements: [
    {
      selector: "goal-node",
      label: "Goal node",
      explanation:
        "The root of the tree, representing the ultimate objective of the plan. All branches trace back to this node. The goal should be stated as a concrete outcome, not a process — 'Launch new product by Q4' rather than 'Run the launch process'.",
    },
    {
      selector: "task-node",
      label: "Task node",
      explanation:
        "Each second-level node is a major phase or activity required to achieve the goal. Tasks are the natural breakdown of the work, typically corresponding to project milestones or process steps. Failure at any task threatens the goal, which is why each task spawns its own sub-tree of risks.",
    },
    {
      selector: "problem-node",
      label: "Problem node",
      explanation:
        "Each leaf-level dashed box names a specific failure mode under its parent task. PDPC asks 'what could go wrong here?' rather than 'what is the ideal path?' This reversal is the chart's structural innovation: it forces planners to reason about deviation before committing to a schedule.",
    },
    {
      selector: "feasible-countermeasure",
      label: "Feasible countermeasure (○)",
      explanation:
        "A circle marks a countermeasure that has been evaluated and judged actionable — the team will pre-position resources or prepare the response before it is needed. The countermeasure box names the specific action. A chart full of ○ marks indicates a well-resourced contingency plan.",
    },
    {
      selector: "infeasible-countermeasure",
      label: "Infeasible countermeasure (×)",
      explanation:
        "A cross marks a countermeasure considered and rejected as impractical, too costly, or too slow to help if the problem fires. The × is not a blank — it records that the team thought about this response and decided against it. A cluster of × marks under a task signals that task needs to be restructured or derisked at the design level.",
    },
    {
      selector: "tree-branch",
      label: "Branch connector",
      explanation:
        "Lines connecting each level of the tree represent the causal dependency: a task depends on reaching the goal, a problem is triggered by a task's failure mode, and a countermeasure responds to that problem. Unlike a fault tree (which points upward from failure to cause), PDPC points downward from plan to risk — it is a forward-reasoning structure.",
    },
  ],
};
