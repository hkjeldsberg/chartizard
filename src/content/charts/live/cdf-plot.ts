import type { LiveChart } from "@/content/chart-schema";

export const cdfPlot: LiveChart = {
  id: "cdf-plot",
  name: "CDF Plot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A monotonic curve from 0 to 1 giving the probability that a random draw lands at or below each value.",
  whenToUse:
    "Reach for a CDF when the reader needs to ask probability questions directly — quantiles, tail probabilities, percentile ranks. Unlike a histogram or density, the y-axis here is a real number the reader can act on: the height at x is P(X ≤ x).",
  howToRead:
    "Read the x-axis as the value and the y-axis as the probability that a draw from the distribution falls at or below it. The curve is always non-decreasing, starts at 0, and ends at 1. Horizontal distance between two heights is a quantile span; vertical distance between two x-values is a probability mass. The steepest part of the curve is the mode of the underlying density.",
  example: {
    title: "Standard normal Φ(x) over ±3σ",
    description:
      "The smooth S-curve is Φ(x) = ½(1 + erf(x/√2)), the population CDF of N(0, 1). The crosshair at (0, 0.5) locates the median. Half the probability mass lies below zero; about 84% lies below +1σ. Paired with an ECDF from a sample, this curve is the ground truth the sample converges to.",
  },
  elements: [
    {
      selector: "curve",
      label: "CDF curve",
      explanation:
        "The sibling of the PDF. Every probability distribution has one. Where a PDF's height is arbitrary — it depends on bin width or kernel bandwidth — a CDF's height is directly readable as a probability. The curve is monotonically non-decreasing by construction.",
    },
    {
      selector: "median",
      label: "Median crosshair",
      explanation:
        "The 50th percentile, where the curve crosses y = 0.5. For a symmetric distribution like the standard normal, the median sits at the mean and the mode. Any quantile qₚ is read the same way: draw a horizontal line at p and drop to the x-axis.",
    },
    {
      selector: "lower-tail",
      label: "Lower-tail probability",
      explanation:
        "At x = -1σ the curve has risen to about 0.159, so roughly 16% of draws fall below -1σ. Lower-tail probabilities are the CDF's native currency — no integration, no bin-width guessing, just the curve's height.",
    },
    {
      selector: "upper-plateau",
      label: "Upper plateau",
      explanation:
        "At x = +2σ the curve is already above 0.977. The CDF flattens asymptotically toward 1 because probability is conserved — the total area under any density is exactly 1, and the CDF accumulates it.",
    },
    {
      selector: "x-axis",
      label: "X-axis (value)",
      explanation:
        "The variable's value, here expressed in standard-deviation units so the curve is distribution-agnostic. In applied use the axis carries real units: dollars, millimetres, days.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (probability)",
      explanation:
        "Cumulative probability, always bounded in [0, 1]. This boundedness is the CDF's great advantage over a density: two CDFs from different populations can always be compared on the same y-axis without rescaling.",
    },
  ],
};
