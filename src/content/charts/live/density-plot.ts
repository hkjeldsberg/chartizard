import type { LiveChart } from "@/content/chart-schema";

export const densityPlot: LiveChart = {
  id: "density-plot",
  name: "Density Plot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Estimates a smooth probability density from a sample, drawn as a filled curve so the shape of the distribution replaces the stair-step of a histogram.",
  whenToUse:
    "Reach for a density plot when a histogram's bars feel like the wrong resolution — when shoulders, dips, and tails are the story and you don't want bin edges to invent structure that isn't there. It is also the natural choice when you want to overlay multiple distributions on one axis without the bars stacking into a mess.",
  howToRead:
    "The x-axis is the measured variable; the y-axis is density, not count. The area under the curve integrates to one, so height at any point is the relative likelihood of a value falling near there. Look for the peak (the mode), the shoulders (secondary modes or plateaus), and the tails (how slowly the mass falls off). The curve is an estimate, not the data — it depends on a bandwidth, and changing that number changes what you see.",
  example: {
    title: "US household income, 2023 (~2,000-household KDE)",
    description:
      "Run a Gaussian kernel density estimate on American Community Survey household-income microdata and the familiar skew appears without any bin edges: a single mode near $60,000, a shoulder that fades into six figures, and a right tail that drags past $300,000. A histogram of the same data would show the same shape but let the bin width dictate where the peak sits; the KDE smooths the discretisation the histogram imposes. The trade-off is that bandwidth is the new bin-width: too small and you're just wiggling, too large and you smear the story.",
  },
  elements: [
    {
      selector: "curve",
      label: "Density curve",
      explanation:
        "The filled area under the curve is the estimated probability density. Height at any x is how concentrated the data is near that value, and the total area integrates to one. It's a model fitted to the sample, not the sample itself — treat it as an educated smoothing, not a measurement.",
    },
    {
      selector: "peak",
      label: "Peak (mode)",
      explanation:
        "The tallest point marks the mode — the value the sample clusters around. For skewed distributions like income the mode sits left of the mean and well left of the tail, which is why a single summary statistic never tells the whole story.",
    },
    {
      selector: "tail",
      label: "Long tail",
      explanation:
        "The thin right-hand region where density is small but non-zero for a long distance. Income, city size, and insurance claims all produce tails like this, and KDEs handle them gracefully where histograms would leave sparsely-populated bars. Watch for the bandwidth artificially extending the tail past the data's actual support.",
    },
    {
      selector: "bandwidth",
      label: "Bandwidth",
      explanation:
        "The smoothing radius of the Gaussian kernel placed over each sample. Narrow bandwidth preserves every wiggle in the sample and starts to look like noise. Wide bandwidth blurs genuine modes into a single blob. Silverman's rule and cross-validation are the two defensible starting points; never accept the default without trying a wider and a narrower one.",
    },
    {
      selector: "x-axis",
      label: "X-axis (value)",
      explanation:
        "The measured variable on its native scale. Income and other heavy-tailed variables are often more readable on a log-x density plot, where the skew becomes a roughly symmetric shape.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (density)",
      explanation:
        "Probability density — count per unit of x, normalised so the curve's integral is one. The numeric values rarely matter to the reader, which is why the ticks are usually unlabeled; the shape carries the meaning.",
    },
  ],
};
