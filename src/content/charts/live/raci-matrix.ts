import type { LiveChart } from "@/content/chart-schema";

export const raciMatrix: LiveChart = {
  id: "raci-matrix",
  name: "RACI Matrix",
  family: "comparison",
  sectors: ["business", "project-management"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",

  synopsis:
    "A task-by-role grid that assigns each cell one of four accountability codes: Responsible, Accountable, Consulted, or Informed.",

  whenToUse:
    "Use a RACI matrix when a project has multiple roles acting on the same tasks and ambiguity about who owns each outcome. The chart's diagnostic value is negative: a row with no A reveals a drifting task; a row with two A cells reveals diffused ownership. It originated in US Department of Defense program management in the mid-1950s and was formalised by PMI in the PMBOK Guide.",

  howToRead:
    "Read across each row (task) and confirm that exactly one cell carries A — the accountable owner. Distinguish R from A: R is the person doing the work; A is the person who must answer for the outcome. They are often different roles. Distinguish C from I: C means consulted before a decision (two-way communication); I means informed after (one-way notification). An empty cell means the role has no involvement with that task.",

  example: {
    title: "Software-release accountability, cross-functional team",
    description:
      "A product team working across PM, Engineering, Design, QA, and Support assigns RACI codes to six tasks from spec-drafting through post-release monitoring. The matrix immediately surfaces that Support owns accountability for both Release to prod and Monitor post-release — a common finding that product teams discover only after an incident reveals no single engineer felt responsible for the cutover.",
  },

  elements: [
    {
      selector: "row",
      label: "Task row",
      explanation:
        "Each row is one task or deliverable. Reading across it shows the accountability pattern for that task. The one-A-per-row rule is the matrix's core invariant: if a row has zero A cells, the task has no owner and will drift; if it has two A cells, ownership is ambiguous and both parties will assume the other is responsible.",
    },
    {
      selector: "column",
      label: "Role column",
      explanation:
        "Each column is one organisational role. Reading down it shows the load on that role across all tasks. A column dense with A cells flags a single point of failure; a column with only I cells flags a role that is rarely consulted and may be surprised by outcomes.",
    },
    {
      selector: "a-cell",
      label: "A — Accountable",
      explanation:
        "The filled-square A cell marks the single person who must answer for the task's outcome. PMI's PMBOK distinguishes accountability (ownership of the result) from responsibility (execution of the work). The A role approves the deliverable and escalates if the R role is blocked. There must be exactly one per row.",
    },
    {
      selector: "r-cell",
      label: "R — Responsible",
      explanation:
        "The filled-circle R cell marks the person or persons who do the work. Unlike A, multiple R assignments on the same row are permitted — two engineers can both be responsible for implementing a feature. The R role reports to the A role on progress.",
    },
    {
      selector: "c-vs-i",
      label: "C vs I — Consulted vs Informed",
      explanation:
        "C (diamond) means consulted before the decision: the role provides input and expects a two-way conversation. I (dot) means informed after the decision: the role receives notification with no expectation of influencing the outcome. Confusing C and I is the most common RACI authoring error — it either over-loads stakeholders with decisions or under-informs them until it is too late.",
    },
    {
      selector: "empty-cell",
      label: "Empty cell — not involved",
      explanation:
        "A blank cell means the role has no involvement with the task. Blanks are structural: they draw the boundary of a role's scope. The RASCI variant replaces blanks with an explicit S (Support) code to distinguish 'no involvement' from 'supportive but not named as C or I'. DACI, a 2010s variant from Atlassian and Intuit, replaces the four codes with Driver, Approver, Contributor, Informed — a decision-focused reformulation of the same grid.",
    },
  ],
};
