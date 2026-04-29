import type { LiveChart } from "@/content/chart-schema";

export const scorecard: LiveChart = {
  id: "scorecard",
  name: "Scorecard",
  family: "comparison",
  sectors: ["business"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",

  synopsis:
    "A tabular KPI summary where each row is one metric and the status column — not the value — is the eye's entry point.",

  whenToUse:
    "Use a scorecard when an executive or operations team needs to scan many metrics simultaneously and immediately isolate anything off-target. The fixed four-column structure (metric, actual, target, status) enforces discipline: every row must have a defined target, which rules out vanity metrics. It is the operational language of board meetings and weekly business reviews.",

  howToRead:
    "Scan the status column first — the coloured dots or symbols route attention to the rows that need it. Then read across the row: actual versus target gives the magnitude of the gap; the variance column converts that gap into a directional percentage or point change. Green means on or ahead of plan; amber means within threshold but tracking toward risk; red means intervention required.",

  example: {
    title: "GE Capital quarterly operating review, 1950s-style",
    description:
      "General Electric's 1950s management system formalised the scorecard as a one-page board document: eight to twelve operating metrics (ROE, receivables turnover, inventory days, headcount) with prior-quarter actuals, current targets, and a traffic-light status coded by Jack Welch's team into the Session C reviews. The insight the format produced was relentless: no single metric could hide behind the aggregate, because every row stood alone and demanded a number.",
  },

  elements: [
    {
      selector: "header-row",
      label: "Header row",
      explanation:
        "The column labels — Metric, Actual, Target, Status — are the scorecard's schema. Their presence transforms an ordinary table into a performance instrument: every row must answer the same four questions, which forces the author to pre-commit a target before reporting results.",
    },
    {
      selector: "metric-column",
      label: "Metric column",
      explanation:
        "Each row names exactly one KPI. The choice of which metrics appear is itself editorial: a scorecard with forty rows is a data dump; one with six to twelve rows forces prioritisation. Grouping by domain (financial, operational, customer) is optional but aids scanning.",
    },
    {
      selector: "actual-target",
      label: "Actual and target columns",
      explanation:
        "Actual is the measured value for the period; target is the pre-committed benchmark. Right-aligning both columns ensures digits align on the decimal, allowing rapid comparison without arithmetic. The columns work together — neither is meaningful without the other.",
    },
    {
      selector: "status-dot",
      label: "Status indicator",
      explanation:
        "The coloured dot (green / amber / red) is the scorecard's primary encoding. Readers scan this column in under two seconds to triage the board report. Status thresholds must be defined in advance; a status column computed post-hoc to make everything green defeats the format.",
    },
    {
      selector: "variance",
      label: "Variance",
      explanation:
        "The signed difference between actual and target, expressed as a percentage or unit delta. Positive variance on a cost metric is bad; positive on a revenue metric is good — context determines direction. Showing variance alongside status prevents misreading a near-miss as equivalent to a large miss.",
    },
  ],
};
