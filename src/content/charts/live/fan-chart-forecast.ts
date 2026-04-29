import type { LiveChart } from "@/content/chart-schema";

export const fanChartForecast: LiveChart = {
  id: "fan-chart-forecast",
  name: "Fan Chart (Forecast)",
  family: "change-over-time",
  sectors: ["finance"],
  dataShapes: ["temporal"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A central forecast line opens into nested uncertainty bands — the shape of the fan is the forecast's claim about its own confidence.",
  whenToUse:
    "Use a fan chart when you need to publish a point forecast alongside an honest admission of how much you trust it over time. It suits macro projections (GDP, inflation, interest rates) where uncertainty compounds year by year. Skip it for short horizons where one number will do, and for audiences who will read only the central line and ignore the cloud around it.",
  howToRead:
    "Start at the boundary where history ends and the fan opens. The central line is the best guess; each nested band is a probability interval — 50%, 80%, 95% by convention. A narrow fan claims high confidence; a fast-flaring fan admits the forecaster does not know. Compare band widths across horizons rather than reading off exact numbers — the widening rate is the real message.",
  example: {
    title: "Bank of England Inflation Report",
    description:
      "The Monetary Policy Committee's quarterly Inflation Report has published its CPI forecast as a fan chart since 1996. The bands are calibrated so each shade covers 10% of the distribution — the outermost edge is the 90% interval. In the 2020 reports, the bands visibly bulged as the MPC widened the variance to price in COVID uncertainty.",
  },
  elements: [
    {
      selector: "central-line",
      label: "Central line",
      explanation:
        "The modal forecast — the single most likely path. Historical data and the central projection share one line so the eye can read the forecast as a continuation of observed reality, not a separate object.",
    },
    {
      selector: "fifty-percent-band",
      label: "50% band",
      explanation:
        "The innermost, darkest band. There is a roughly 50% chance the outturn falls inside it at each horizon. If you took away everything else, this is the range a forecaster would bet on.",
    },
    {
      selector: "eighty-percent-band",
      label: "80% band",
      explanation:
        "The middle band. Four times in five, the outturn should land inside it. Outcomes outside this band are the interesting ones — they are the forecast being told it was wrong.",
    },
    {
      selector: "ninety-five-percent-band",
      label: "95% band",
      explanation:
        "The outermost, palest band — near-tail coverage. Anything beyond this edge is a 1-in-20 surprise. How quickly this outer edge flares is the forecast's admission of its own ignorance.",
    },
    {
      selector: "historical-vs-forecast-boundary",
      label: "History / forecast boundary",
      explanation:
        "The vertical line where observed data ends and projection begins. Uncertainty is zero to the left of it and grows monotonically to the right. Hiding this join lets readers confuse past and future; always mark it.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "The quantity being forecast — here, annual GDP growth in percent. The scale must be wide enough to contain the outermost band at the longest horizon; clipping the 95% edge at the top of the chart silently understates risk.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "Time, running from the last few years of history into the forecast horizon. Keep the same tick spacing on both sides of the boundary — a denser historical axis makes the fan's flare look more dramatic than it is.",
    },
  ],
};
