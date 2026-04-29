import type { LiveChart } from "@/content/chart-schema";

export const autocorrelationPlot: LiveChart = {
  id: "autocorrelation-plot",
  name: "Autocorrelation Plot (ACF)",
  family: "distribution",
  sectors: ["time-series", "statistics"],
  dataShapes: ["temporal"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Plots the correlation of a time series with its own lagged copies, revealing whether the series remembers its past.",

  whenToUse:
    "Use the ACF before fitting any time-series model. A slow, hyperbolic decay signals non-stationarity and calls for differencing. A sharp cut-off after lag q identifies the moving-average order in a Box-Jenkins MA(q) process. Box and Jenkins codified this diagnostic in their 1970 monograph, and it remains the first plot every time-series analyst draws.",

  howToRead:
    "Each vertical stem shows the sample correlation r_k between the series and its lag-k copy. Lag 0 is always exactly 1 — a series is perfectly correlated with itself. The two horizontal dashed lines mark the approximate 95 % confidence band at ±1.96/√n; stems that exceed these lines are statistically significant at the conventional level. In this AR(1) example with coefficient 0.7, the stems decay geometrically: r_1 ≈ 0.7, r_2 ≈ 0.49, r_3 ≈ 0.34. A spike at lag 12 on monthly data exposes annual seasonality.",

  example: {
    title: "Yule's 1927 sunspot autoregression",
    description:
      "G. Udny Yule computed autocorrelations of the Wolf sunspot number series in his 1927 Royal Society paper to demonstrate that the 11-year solar cycle could be modelled as a second-order autoregression — AR(2). The ACF of the sunspot series shows a damped sinusoidal pattern, distinguishing it from the monotone geometric decay of a pure AR(1). Yule's paper is the direct ancestor of the Box-Jenkins framework.",
  },

  elements: [
    {
      selector: "x-axis",
      label: "Lag axis",
      explanation:
        "The horizontal axis counts the lag k — the number of time steps between the original series and its shifted copy. Lag 0 always appears at the left; the maximum displayed lag is conventionally around n/4. The spacing is uniform: each step is one observation period (day, month, quarter).",
    },
    {
      selector: "y-axis",
      label: "Correlation axis",
      explanation:
        "The vertical axis runs from −1 to +1, the full range of Pearson correlation. Values near +1 mean the series at time t tends to be high whenever t − k is also high; values near −1 indicate antiphasic behaviour. The axis is fixed — never truncated — so the decay shape is visually comparable across series.",
    },
    {
      selector: "stem",
      label: "Autocorrelation stem",
      explanation:
        "Each stem is a vertical line from the zero baseline to r_k, capped with a filled circle. The height encodes the autocorrelation magnitude; the direction (above or below zero) encodes sign. In this AR(1) chart, lag-1 has the tallest stem at r_1 ≈ 0.7, confirming strong one-step memory.",
    },
    {
      selector: "confidence-band",
      label: "Confidence band (±1.96/√n)",
      explanation:
        "The two dashed horizontal lines mark the approximate 95 % significance threshold under the null hypothesis of white noise. For n = 100 observations the band sits at ±0.196. Stems outside the band are evidence against white noise at that lag; stems inside it are consistent with chance autocorrelation.",
    },
    {
      selector: "lag-zero",
      label: "Lag-0 unit stem",
      explanation:
        "The lag-0 stem is always exactly 1 because any series has perfect correlation with an un-shifted copy of itself. It anchors the scale but carries no diagnostic information; some authors omit it to save horizontal space.",
    },
    {
      selector: "decay-pattern",
      label: "Geometric decay",
      explanation:
        "For a stationary AR(1) process with coefficient φ, the theoretical ACF is r_k = φ^k. The visual signature is a smooth geometric decay that approaches zero from above (for positive φ). A slow hyperbolic decay — one that seems never to reach zero — is the ACF signature of a unit-root non-stationary series and calls for first-differencing before modelling.",
    },
  ],
};
