import type { LiveChart } from "@/content/chart-schema";

export const partialAutocorrelationPlot: LiveChart = {
  id: "partial-autocorrelation-plot",
  name: "Partial Autocorrelation Plot (PACF)",
  family: "distribution",
  sectors: ["time-series", "statistics"],
  dataShapes: ["temporal"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Strips out the correlation carried by intermediate lags to reveal which lags have a direct relationship with the present value.",

  whenToUse:
    "Use the PACF alongside the ACF when identifying the order of an autoregressive model. The reading rule Box and Jenkins established in 1970 is: if the ACF tails off while the PACF cuts off sharply after lag p, the data-generating process is AR(p). Neither chart alone is diagnostic — the pair together resolves the ambiguity between AR and MA structure.",

  howToRead:
    "Each stem at lag k shows the correlation between y_t and y_{t-k} after partialling out the contributions of all intermediate lags 1 through k−1. The diagnostic signature of AR(1) is unambiguous: one tall stem at lag 1, and all subsequent stems inside the confidence band. In an MA(q) series the pattern reverses — the ACF cuts off after lag q while the PACF tails off. The dashed lines mark the approximate 95 % significance boundary at ±1.96/√n.",

  example: {
    title: "UK retail sales monthly index, 2000–2019",
    description:
      "The Office for National Statistics retail sales volume index (n = 240 months) shows an ACF with slow sinusoidal decay and spikes at multiples of lag 12, consistent with a seasonal ARIMA structure. The PACF has significant spikes at lags 1, 12, and 13, and cuts off elsewhere — pointing to an AR(1) × SAR(1)_{12} component. Box-Jenkins order identification using both plots guided the final SARIMA(1,1,0)(1,1,0)_{12} fit.",
  },

  elements: [
    {
      selector: "x-axis",
      label: "Lag axis",
      explanation:
        "The horizontal axis counts the lag k, from 0 at left to the maximum displayed lag (conventionally around n/4). The spacing is uniform; each step is one observation period. On monthly data, lag 12 marks exactly one year back.",
    },
    {
      selector: "y-axis",
      label: "Partial correlation axis",
      explanation:
        "The vertical axis runs from −1 to +1, the full range of partial correlation. Fixing the axis range makes PACF plots from different series visually comparable — the height of a stem carries absolute meaning, not just relative rank.",
    },
    {
      selector: "significant-stem",
      label: "Significant stem (lag 1)",
      explanation:
        "The stem at lag 1 protrudes well above the confidence band at r ≈ 0.7, confirming a direct one-step dependency. This is the only lag with a genuine partial autocorrelation in an AR(1) process; every longer stem is attributable to chains of one-step dependencies that the PACF procedure has already removed.",
    },
    {
      selector: "confidence-band",
      label: "Confidence band (±1.96/√n)",
      explanation:
        "The dashed horizontal lines bound the region consistent with white noise at the 95 % level. For n = 100 the band is ±0.196. Lags where every stem falls inside this band are statistically indistinguishable from zero partial autocorrelation — they contribute nothing to the AR specification beyond what shorter lags already explain.",
    },
    {
      selector: "cut-off-region",
      label: "Cut-off region (lags > 1)",
      explanation:
        "From lag 2 onward, all stems lie inside the confidence band. This abrupt cut-off is the definitive AR(1) signature: the process has no direct memory beyond one step. A PACF that tails off instead of cutting off signals an MA or mixed ARMA structure, and the ACF must be examined together to resolve the order.",
    },
    {
      selector: "lag-zero",
      label: "Lag-0 unit stem",
      explanation:
        "The partial autocorrelation at lag 0 is defined as 1 — a series is its own perfect predictor when no lags intervene. Like the ACF lag-0, it is a reference anchor rather than a diagnostic feature, and some software suppresses it to save space.",
    },
  ],
};
