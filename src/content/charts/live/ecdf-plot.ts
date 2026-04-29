import type { LiveChart } from "@/content/chart-schema";

export const ecdfPlot: LiveChart = {
  id: "ecdf-plot",
  name: "ECDF Plot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A staircase built directly from a sample — every jump is one observation, every height is an empirical probability.",
  whenToUse:
    "Use an ECDF when you have a raw sample and want to read it without binning decisions, kernel bandwidth, or parametric assumptions. It is the right first look at a small or medium dataset, especially for comparing two samples: overlay two ECDFs and the biggest vertical gap is the Kolmogorov-Smirnov statistic.",
  howToRead:
    "Start at y = 0 on the left. Each data point adds one horizontal-then-vertical step of height 1/n at its value. The curve reaches y = 1 after the largest observation. Steep regions contain many sample points close together; long flat regions are gaps. Quantiles read off directly: draw a horizontal line at p, drop to the x-axis, that value is the p-th sample quantile.",
  example: {
    title: "Twenty-five draws from a standard normal",
    description:
      "Twenty-five Box-Muller samples from N(0, 1), sorted and plotted as a staircase. The faint dashed curve is the population CDF Φ(x) those samples are drawn from. Glivenko-Cantelli guarantees the staircase converges uniformly to the dashed curve as n grows; with n = 25 the fit is already visibly tight in the body and loose only in the tails.",
  },
  elements: [
    {
      selector: "staircase",
      label: "Staircase",
      explanation:
        "The empirical CDF: F̂(x) counts what fraction of the sample lies at or below x. It jumps by exactly 1/n at every observation and is flat between observations. No binning, no bandwidth, no model — just the sorted sample.",
    },
    {
      selector: "jump",
      label: "Jump of 1/n",
      explanation:
        "Each vertical step is exactly one observation. The step size 1/n is the chart's resolution: a sample of 25 gives steps of 4 percentage points; a sample of 1000 gives a curve that looks smooth. Ties in the data produce a single taller jump.",
    },
    {
      selector: "reference-curve",
      label: "Reference CDF",
      explanation:
        "The faint dashed curve is the population CDF the sample is drawn from. Overlaying it turns the ECDF into a goodness-of-fit diagnostic — the largest vertical gap between the two is the Kolmogorov-Smirnov test statistic.",
    },
    {
      selector: "x-axis",
      label: "X-axis (sample value)",
      explanation:
        "The variable's value in the sample's own units. Unlike a histogram x-axis, there are no bin edges to argue over — the tick marks carry no chart-level decisions.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (empirical probability)",
      explanation:
        "The cumulative proportion of the sample at or below x. Bounded in [0, 1] by construction. Two ECDFs on the same axes are directly comparable without rescaling — this is why the ECDF is the standard tool for two-sample comparisons.",
    },
  ],
};
