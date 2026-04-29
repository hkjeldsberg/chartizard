import type { LiveChart } from "@/content/chart-schema";

export const ppPlot: LiveChart = {
  id: "pp-plot",
  name: "P-P Plot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Scatters empirical CDF values against theoretical CDF values to test whether a sample follows a reference distribution.",

  whenToUse:
    "Use a P-P plot when you need to assess distributional fit and your primary concern is the bulk of the data rather than the tails. The axes are linear in cumulative probability, so deviations near the centre (CDF ≈ 0.3–0.7) are magnified relative to what a QQ-plot would show. Wilk and Gnanadesikan (1968, *Probability Plotting Methods for the Analysis of Data*, Biometrika 55(1)) formalised both PP and QQ plots within a single framework; the two charts are complementary rather than redundant.",

  howToRead:
    "Sort the sample and assign each observation a plotting position F̂(x_(i)) = (i − 0.5) / n — its empirical CDF value. For each observation, compute the theoretical CDF value F(x_(i)) under the reference distribution (here, the standard normal applied to the standardised value). Plot the pair (F̂, F) as a dot; both axes run 0 to 1. If the sample follows the reference distribution, all dots fall on the 45° diagonal. Points bending below the diagonal in the lower tail and above it in the upper tail indicate heavier-than-normal tails — the opposite of a light-tailed distribution. The PP plot's uniform probability scale compresses tail information relative to a QQ-plot and expands centre information.",

  example: {
    title: "Residuals from an OLS regression on macroeconomic panel data",
    description:
      "A standard OLS regression on quarterly GDP growth across 40 countries produces residuals that appear normal in the central range but whose PP plot reveals modest tail excess — points pulling off the diagonal beyond the 10th and 90th percentile marks. The corresponding QQ-plot shows the same excess more dramatically in the tails but obscures the excellent central fit the PP-plot makes obvious.",
  },

  elements: [
    {
      selector: "diagonal",
      label: "45° diagonal — perfect fit",
      explanation:
        "The 45° reference line marks where every point would lie if the sample were drawn exactly from the reference distribution. Departure from this line is the signal; the direction of departure — above or below — identifies whether the sample has heavier or lighter tails than expected.",
    },
    {
      selector: "point",
      label: "Observation pair",
      explanation:
        "Each dot represents one ordered observation. Its x-coordinate is the empirical CDF value (i − 0.5) / n; its y-coordinate is the theoretical CDF value under the reference distribution. A dot on the diagonal means that observation is exactly where the reference distribution predicts it should rank.",
    },
    {
      selector: "centre-sensitivity",
      label: "Centre sensitivity",
      explanation:
        "Points near CDF = 0.5 lie in the densest part of the probability scale. The PP-plot's linear probability axis stretches this region relative to a QQ-plot, which is linear in the variable's units. Subtle departures in the centre — a slight S-curve — are easier to detect here than on a QQ-plot.",
    },
    {
      selector: "tail-deviation",
      label: "Tail bend",
      explanation:
        "In the lower tail (CDF below ~0.15), a sample with heavier tails than the reference has empirical CDF values that advance more slowly than the theoretical, pulling points below the diagonal. The upper tail mirrors this above the diagonal. Wilk and Gnanadesikan (1968) note this S-shaped deviation as the canonical signature of leptokurtosis on a PP-plot.",
    },
    {
      selector: "x-axis",
      label: "X-axis — empirical CDF",
      explanation:
        "The horizontal axis shows each observation's rank as a proportion of n, using the (i − 0.5)/n plotting position. Both axes share the same [0, 1] scale, which is what makes the 45° diagonal the natural reference — a feature the QQ-plot, with its differently-scaled axes, does not have.",
    },
    {
      selector: "y-axis",
      label: "Y-axis — theoretical CDF",
      explanation:
        "The vertical axis shows what the reference distribution predicts each observation's cumulative probability should be. For a standard-normal reference, this is Φ((x − x̄) / s). When theoretical and empirical CDF values match across the full range, the model is a good fit.",
    },
  ],
};
