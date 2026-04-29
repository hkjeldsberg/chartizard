import type { LiveChart } from "@/content/chart-schema";

export const pughMatrix: LiveChart = {
  id: "pugh-matrix",
  name: "Pugh Matrix",
  family: "comparison",
  sectors: ["decision-analysis"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Scores alternatives against a single baseline across weighted criteria, forcing +1 / 0 / -1 choices.",
  whenToUse:
    "Reach for a Pugh matrix when a team needs to compare several alternatives against one declared baseline and a generic scorecard would let people hide behind 0.7s and 0.8s. The matrix's discipline is the three-value vocabulary: every cell is better, same, or worse than the baseline, full stop.",
  howToRead:
    "Read columns, not rows. Column 0 is the baseline and is definitionally all zeros — the other columns are signed deviations from it. A green cell is where the alternative beats the baseline on that criterion; a warm cell is where it loses. The bottom row is the weighted total, but it is the tiebreaker, not the verdict — the story is where each alternative gains and loses, which the grid makes obvious at a glance.",
  example: {
    title: "EV battery chemistries vs lithium-ion NMC",
    description:
      "Engineering teams use Pugh matrices to triage battery-chemistry candidates against an incumbent. Against a Li-ion NMC baseline, LFP loses on energy density but wins across cycle life, safety, cost, and supply chain — a shape that matches LFP's actual market take-over in 2023-24 utility-scale storage. Stuart Pugh introduced the method at the University of Strathclyde in the 1980s; it replaced weighted-average scoring because teams were gaming the decimals.",
  },
  elements: [
    {
      selector: "baseline-column",
      label: "Baseline column",
      explanation:
        "The leftmost alternative is the reference point and is zero by definition. Every other score is relative to it. If the baseline shifts mid-evaluation, every other column must be rescored — there is no such thing as changing the baseline 'just for this row'.",
    },
    {
      selector: "weight-column",
      label: "Weight column",
      explanation:
        "Each criterion carries an integer weight reflecting its importance — usually 1, 2, or 3. Keep the weights coarse. Fine-grained weights (2.5, 3.7) signal false precision and invite arguments about the weights instead of the scores.",
    },
    {
      selector: "plus-cell",
      label: "Plus cell (+1)",
      explanation:
        "A cell marked +1 says the alternative is clearly better than the baseline on this criterion. The rule of thumb: if the team cannot articulate a single concrete reason, it is 0, not +1. Tinting plus cells lets the eye read a column's profile of wins without summing anything.",
    },
    {
      selector: "minus-cell",
      label: "Minus cell (-1)",
      explanation:
        "A cell marked -1 is a concrete loss versus the baseline — a place the alternative would need mitigation to ship. A column dominated by minus cells that still has a positive weighted total is a warning sign: the weights are carrying the decision, not the evidence.",
    },
    {
      selector: "criterion-row",
      label: "Criterion row",
      explanation:
        "Reading across a row shows which alternatives win and lose on one dimension. A row that is mostly zeros means either the criterion does not discriminate between the options or the team is being polite — both are worth interrogating before the scoring is locked.",
    },
    {
      selector: "weighted-total",
      label: "Weighted total",
      explanation:
        "The sum of weight times signed score per alternative. Use it to break near-ties, not to pick winners. Two alternatives with the same total can have wildly different risk profiles; the signed-cell grid is what the reviewer should argue about.",
    },
  ],
};
