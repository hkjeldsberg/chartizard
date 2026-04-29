import type { LiveChart } from "@/content/chart-schema";

export const movingAverage: LiveChart = {
  id: "moving-average",
  name: "Moving Average",
  family: "change-over-time",
  sectors: ["time-series"],
  dataShapes: ["temporal"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Replaces each point with the mean of the last N points — a boxcar filter named after what it does, not what it shows.",
  whenToUse:
    "Reach for a moving average when the day-to-day series is too noisy to read structural moves off directly. The MA is a trade: you buy legibility with lag, so the window length is a decision about how much you are willing to be late. Overlay two windows when the question is about regime changes rather than the latest print.",
  howToRead:
    "Follow the smooth lines, not the noisy one. The short window (MA-20) tracks recent direction; the long window (MA-50) tracks the slower structure. Where the short line crosses above the long line is a crossover — in the technical-analysis convention a bullish crossover is called a golden cross, the opposite a death cross. The crossover is not a prediction; it is a declaration that the short-term mean has already climbed past the long-term mean.",
  example: {
    title: "A SPY-style index through a drawdown and recovery",
    description:
      "A 250-day synthetic series drops through a sharp bear window, recovers, and then trends into a late-stage rally. The 20-day MA leads into the recovery; the 50-day MA drags behind. Both MAs hide the drawdown's worst day by averaging it with its neighbours — which is the point and also the cost. The short line eventually crosses above the long line in the final third of the chart: that crossover is a summary of what already happened, not a forecast of what comes next.",
  },
  elements: [
    {
      selector: "price-line",
      label: "Raw price",
      explanation:
        "The underlying daily series — the noise the moving averages are meant to mute. Rendered light and thin so the reader treats it as texture, not signal. Remove it and the chart lies about how much smoothing has been done.",
    },
    {
      selector: "ma-20",
      label: "MA-20 (short window)",
      explanation:
        "The mean of the trailing 20 observations, re-computed each day. A short window reacts quickly to direction changes but also re-traces every minor reversal. Think of it as a low-pass filter with a 20-day cutoff.",
    },
    {
      selector: "ma-50",
      label: "MA-50 (long window)",
      explanation:
        "The mean of the trailing 50 observations. Smoother than MA-20 but visibly lagged: a turn in the underlying series takes longer to show up here. The gap between the two windows is where the crossover signal lives.",
    },
    {
      selector: "golden-cross",
      label: "Golden cross",
      explanation:
        "The point where MA-20 crosses above MA-50. Technical analysts call the upward crossover a golden cross and the downward one a death cross. Mechanically it is a statement about past averages, not a prediction — by the time the crossover prints, the move that caused it is already on the chart.",
    },
    {
      selector: "lag-artefact",
      label: "Lag artefact",
      explanation:
        "The shaded strip on the left shows the first 49 trading days, where the 50-day window does not yet have enough history to compute. A moving average is defined as trailing, so its line starts short of the left edge. Forgetting this is the most common way to mis-read an MA chart.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "Trading days, left to right. Calendar weekends and holidays are collapsed out so the MA windows count in market days — a 20-day MA is a calendar month of trading, not a calendar month of days.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "Price in dollars on the same scale as the raw series. Do not zero-anchor this axis: MAs are about within-range movement, and a zero-anchored scale flattens the smoothing story into a featureless ribbon.",
    },
  ],
};
