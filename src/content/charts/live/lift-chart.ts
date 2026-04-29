import type { LiveChart } from "@/content/chart-schema";

export const liftChart: LiveChart = {
  id: "lift-chart",
  name: "Lift Chart",
  family: "distribution",
  sectors: ["data-science", "marketing"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Compares a ranking model's response rate inside each decile to the baseline rate you would get from random targeting.",
  whenToUse:
    "Reach for a lift chart when a ranking model drives a cost-per-contact decision — direct mail, outbound calls, email blasts, risk-based audits. The chart answers one operational question: if we only act on the top slice the model ranks highest, how much better than random is that slice? Pair with a cumulative-gains chart on the same scores. Lift reads per-decile; gains reads cumulatively.",
  howToRead:
    "Sort the population by model score, split into ten equal deciles with decile 1 as the highest-scoring, and plot each decile's response rate divided by the overall baseline rate. A usable ranking model starts well above 1.0 in decile 1 and decays monotonically toward 1.0 in the middle deciles, then below 1.0 in the tail — random targeting is a flat line at 1.0. A chart that is flat across all deciles means the model has no separation. A lift of 2.6 in decile 1 means the top 10% of contacts respond 2.6× more often than a randomly chosen contact.",
  example: {
    title: "Direct-mail campaign, response-model targeting",
    description:
      "A retailer with a 10% baseline response rate and a logistic-regression ranking model sees lift ~2.6 in decile 1 and lift ~1 by decile 6. The business decision is built directly off the bars: mailing only to deciles 1-3 captures about half the responders at 30% of the postage. The chart is the direct-marketing industry's standard ROI argument — older than scikit-learn and still taught first in SAS Enterprise Miner.",
  },
  elements: [
    {
      selector: "top-decile",
      label: "Top-decile bar",
      explanation:
        "The response rate of the best-scoring 10% of the population, expressed as a multiple of the overall rate. This is usually the only number a marketing team quotes from the chart. A decile-1 lift of 2× means that slice responds twice as often as a random slice of the same size.",
    },
    {
      selector: "lift-curve",
      label: "Lift curve",
      explanation:
        "The curve connecting the decile midpoints shows how quickly the model's advantage decays as you reach down the ranking. A steep, monotone decay is the signature of a model that concentrates responders near the top. A curve that wobbles non-monotonically is a symptom of overfitting or a score that is not well-calibrated to the outcome.",
    },
    {
      selector: "baseline",
      label: "Random-targeting baseline",
      explanation:
        "The horizontal reference at lift = 1.0 — what you would get from contacting a random slice of the population. Any decile above this line is a slice the model ranks usefully; any decile below it is a slice the model correctly identifies as unlikely to respond. A chart with every bar at 1.0 is a flat rejection of the model.",
    },
    {
      selector: "x-axis",
      label: "Decile",
      explanation:
        "Population bins of equal size, sorted best-first by model score. Decile 1 is the top 10% the model is most confident about; decile 10 is the bottom 10%. The axis is ordinal, not continuous — there is no partial decile, and 5 is not halfway between 1 and 10 in any geometric sense.",
    },
    {
      selector: "y-axis",
      label: "Lift",
      explanation:
        "Ratio of a decile's response rate to the overall baseline rate. Lift of 2 means the decile responds twice as often as the whole population; lift of 1 means the decile is no different from random. Always stated as a multiple, never a percentage — confusing the two is the most common misread of this chart.",
    },
  ],
};
