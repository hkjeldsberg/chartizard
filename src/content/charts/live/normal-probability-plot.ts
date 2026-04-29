import type { LiveChart } from "@/content/chart-schema";

export const normalProbabilityPlot: LiveChart = {
  id: "normal-probability-plot",
  name: "Normal Probability Plot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Rescales the cumulative-probability axis so any normal distribution plots as a straight line. Deviations from normality show up as deviations from that line.",
  whenToUse:
    "Reach for a normal probability plot when you want a Q-Q plot's diagnostic power without asking the reader to remember what a diagonal means. The null hypothesis of normality is baked into the axis itself: a straight line is normal, anything curved is not. Because the y-scale is labelled in familiar percentage terms — 1%, 5%, 50%, 95%, 99% — readers can also read percentile levels directly off the chart.",
  howToRead:
    "The x-axis is the sample value in its own units. The y-axis is cumulative probability, but drawn on a non-linear 'probability scale' where the spacing between 50% and 84% matches the spacing between 16% and 50% — one standard deviation either way. A true normal sample traces a straight line on this axis; the fitted line you see is drawn from the sample's own mean and sd. Read a single point as 'this value sits at this percentile of the sample'; read the whole cloud as 'does it follow the line'.",
  example: {
    title: "200 draws from an 'almost normal' distribution, right-skewed in the upper tail",
    description:
      "This is the same 200 samples rendered next door as a Q-Q plot. The middle 80% of points (roughly the 10th through 90th percentile levels) sit almost exactly on the fitted line — the distribution is normal where there is most data. Above the 95% line the points peel upward and away: the observed 99th-percentile value is bigger than a normal of this mean and sd would produce. The normal probability plot is the Q-Q's more opinionated cousin: a straight line is the only sign the data is well-behaved, so you never have to remember which diagonal you were supposed to be comparing against.",
  },
  elements: [
    {
      selector: "point",
      label: "Data point",
      explanation:
        "Each dot is one sample. Its x coordinate is the observed value; its y coordinate is the inverse normal CDF of the plotting position (i - 0.5)/n. The y-axis is labelled as a percentage, but internally the point sits at a z-score — which is how a normal sample ends up on a straight line.",
    },
    {
      selector: "fitted-line",
      label: "Fitted normal",
      explanation:
        "The dashed line is the straight line a true normal distribution with the sample's own mean and sd would trace. It passes through the median at the 50% level and slopes at a rate of one sample-sd per unit z. Compare the cloud of points to this line; the line is not a regression, it is the null hypothesis drawn at scale.",
    },
    {
      selector: "probability-axis",
      label: "Probability axis",
      explanation:
        "The y-axis is drawn on a non-linear 'probability scale' — the spacing between 50% and 84% matches the spacing between 16% and 50%, because both are one sample-sd away from the median under normality. That rescaling is the entire trick: a normal sample comes out straight because its cumulative distribution function is the inverse of the axis transform.",
    },
    {
      selector: "label-at-50",
      label: "50% — the median level",
      explanation:
        "The 50% tick marks the sample median on the rescaled axis; below it sit the lowest half of observations, above it the top half. Because the fitted line is built from the sample mean and sd, it crosses the 50% line exactly at the sample mean — so any daylight between mean and median on this axis is a first hint that the distribution is not symmetric.",
    },
    {
      selector: "tail-deviation",
      label: "Tail deviation",
      explanation:
        "In the upper tail the points peel up and away from the fitted line — the highest observed values are larger than a normal of this mean and sd would produce. The short dashed stub connects the observation to the sample value the line would have predicted at that probability level. A right-tail upward peel is the fingerprint of positive skew; a left-tail downward peel would be a long or heavy left tail.",
    },
    {
      selector: "x-axis",
      label: "Sample value",
      explanation:
        "The x-axis is linear in the sample's native units — no rank, no z-score, no transform. That is deliberate: all the non-linearity in this chart lives in the y-axis, so you can read sample values directly. A point at x = 70 is a value of 70 in your dataset, sitting at whatever percentile the y-axis tells you.",
    },
  ],
};
