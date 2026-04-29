import type { LiveChart } from "@/content/chart-schema";

export const cumulativeGainsChart: LiveChart = {
  id: "cumulative-gains-chart",
  name: "Cumulative Gains Chart",
  family: "distribution",
  sectors: ["data-science", "marketing"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Traces the fraction of positives captured as the top-ranked fraction of the population is contacted.",
  whenToUse:
    "Reach for a cumulative gains chart when the operational question is cumulative — not 'how good is decile 3 specifically?' but 'if I can afford to contact the top 30%, what share of responders do I actually reach?'. It is the sibling of the lift chart: same underlying ranking, two views. Lift reads per-decile and answers ROI per slice; gains reads cumulatively and answers coverage at an operating point.",
  howToRead:
    "Sort the population by model score, walk left-to-right as you contact more of it, and read the curve as the share of all positives you have captured so far. A perfectly ranked model would be a hard elbow — it reaches y = 1.0 at x = prevalence. A random model is the diagonal — you only get what you pay for. A typical usable model is a concave curve well above the diagonal, flattening well before x = 1. The area between the curve and the diagonal is the model's advantage; a curve that hugs the diagonal is telling you the scores are no better than coin flips.",
  example: {
    title: "Direct-mail campaign, 100k contacts, 10% baseline response",
    description:
      "A retention model scores the customer base; marketing contacts the top 30% by score and captures 63% of the customers who would have churned. The curve collapses that decision into one picture — on a budget that can only reach 30% of the list, this model gets twice the positives a random draw would. The same data as the lift chart, re-read as cumulative coverage instead of per-decile ratio.",
  },
  elements: [
    {
      selector: "curve",
      label: "Cumulative gains curve",
      explanation:
        "Each point on the curve is an operating decision: 'if I contact x% of the list, starting with the highest-scoring, I capture y% of the positives.' The curve's concavity is the model's separation power. A steep initial rise followed by a long flat tail is the ideal shape — the model's confidence is concentrated near the top of the ranking.",
    },
    {
      selector: "diagonal",
      label: "Random-targeting diagonal",
      explanation:
        "The y = x line is what you would capture by contacting a random x% of the population: no ranking, no model. Any curve above this line is useful; any curve below it is worse than random and would be improved by flipping its ranking. The diagonal is the honesty check every gains chart needs — without it, a mediocre curve looks impressive.",
    },
    {
      selector: "gain-area",
      label: "Gain area",
      explanation:
        "The shaded region between the curve and the diagonal. Its area is a single summary of the model's ranking advantage across every possible operating point — a close relative of the Gini coefficient used in credit scoring. A larger gain area means a more useful ranking; a gain area of zero means the scores carry no information.",
    },
    {
      selector: "operating-point",
      label: "Operating point",
      explanation:
        "A single chosen contact budget marked on the curve — here, 30% contacted captures 63% of positives. In production this is where the budget meets the model: the curve is the menu, the bead is the cell in the budget spreadsheet. Sliding the bead right catches more positives at higher cost; sliding left saves money at the cost of missed responders.",
    },
    {
      selector: "x-axis",
      label: "% contacted",
      explanation:
        "The fraction of the population reached, sorted best-first by model score. The axis is cumulative — at x = 0.3 the chart is summarising the top 30% of contacts taken together, not the third decile in isolation. That is the core difference from a lift chart, where each decile stands alone.",
    },
    {
      selector: "y-axis",
      label: "% captured",
      explanation:
        "The share of all positives reached so far. At x = 1.0 every curve ends at y = 1.0 — if you contact everyone you find every positive, ranking or no ranking. The interesting part of the chart is the climb, not the endpoints: how quickly does y reach 0.8?",
    },
  ],
};
