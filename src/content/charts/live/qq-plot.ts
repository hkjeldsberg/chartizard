import type { LiveChart } from "@/content/chart-schema";

export const qqPlot: LiveChart = {
  id: "qq-plot",
  name: "Q-Q Plot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Plots sample quantiles against the quantiles of a reference distribution so deviations from that distribution show up as deviations from a line.",
  whenToUse:
    "Reach for a Q-Q plot when the question is 'does this sample come from that distribution?' — almost always the normal. A histogram with an overlaid bell curve answers the same question, but the eye reads line-deviation more accurately than shape-overlap, and the tails — where deviations matter most — are where a histogram's bars are smallest and least trustworthy.",
  howToRead:
    "The x-axis lists theoretical quantiles from the reference distribution (here, standard normal). The y-axis lists the sorted sample, plotted at the matching quantile. If the sample follows the reference, points hug the diagonal y = mean + sd·x. Curvature says 'wrong shape'; a bow away from the line at one end says 'that tail is heavier or lighter than a normal would produce'. Deviations at the extremes carry more weight than deviations in the middle.",
  example: {
    title: "200 draws from an 'almost normal' distribution with a right-tail skew",
    description:
      "The sample is drawn from a Gaussian (mean 50, sd 10) and then nudged upward in the right tail by a 1.5-power bump. In the centre the points hug the diagonal exactly — the kind of agreement a Shapiro-Wilk test would pass without complaint. The upper-right quantiles bow above the line: the largest observed values are bigger than a normal distribution of that mean and sd would produce. That is the signature the Q-Q plot is built to reveal; a histogram with a normal overlay would hide it in the tallest bin's rounding.",
  },
  elements: [
    {
      selector: "point",
      label: "Data point",
      explanation:
        "Each dot is one sample. Its x coordinate is the theoretical z-score at its rank (the inverse normal CDF of the plotting position (i - 0.5)/n); its y coordinate is the actual observed value at that rank. A Q-Q plot is a scatter with one point per observation, no bins, no smoothing.",
    },
    {
      selector: "diagonal",
      label: "Reference line",
      explanation:
        "The diagonal y = sample mean + sample sd · x is the line a perfectly normal sample with this mean and sd would trace. It is fit from the data itself, not drawn a priori; the question the plot answers is not 'are these standard normal' but 'do these have the shape a normal with the observed mean and sd would have'.",
    },
    {
      selector: "centre",
      label: "Centre of the cloud",
      explanation:
        "Near the median, sample and theoretical quantiles agree almost exactly — the cloud is thick with points and the diagonal runs right through them. This is the region where almost every distribution looks normal. The whole purpose of the Q-Q plot is to stop you declaring victory here and make you check the tails.",
    },
    {
      selector: "tail-deviation",
      label: "Tail deviation",
      explanation:
        "In the upper tail the points bow above the diagonal — the largest observed values exceed what a normal of this mean and sd would produce. The vertical stub connects the observed point to the line it would have sat on under exact normality. A right-tail bow like this is the classic fingerprint of positive skew; a left-tail bow below the line would mean a heavy or long left tail.",
    },
    {
      selector: "x-axis",
      label: "Theoretical quantiles",
      explanation:
        "The x-axis lists z-scores from the reference distribution. Each rank i in the sorted sample is mapped to the plotting position (i - 0.5)/n and then through the inverse normal CDF — so rank 1 sits near z = -2.6, the median sits at z = 0, and the largest observation sits near z = +2.6. The axis is linear in z, which is why the diagonal is straight.",
    },
    {
      selector: "y-axis",
      label: "Sample quantiles",
      explanation:
        "The y-axis is the observed value at each rank — the sorted sample in its own units. Keeping the axis in the sample's native units (rather than standardising) lets you read the mean and sd of the fitted line directly off the chart: the intercept is the mean, the slope is the sd.",
    },
  ],
};
