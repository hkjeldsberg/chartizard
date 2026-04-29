import type { LiveChart } from "@/content/chart-schema";

export const equivolumeChart: LiveChart = {
  id: "equivolume-chart",
  name: "Equivolume Chart",
  family: "change-over-time",
  sectors: ["finance"],
  dataShapes: ["temporal"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Price bars whose horizontal width is proportional to trading volume, replacing calendar time with cumulative volume on the x-axis.",

  whenToUse:
    "Use an equivolume chart when volume is the primary driver of price movement rather than the passage of calendar time. The chart is especially useful for distinguishing breakouts on high volume from price drifts on thin trading: a wide bar forces the eye to recognise that many shares changed hands, while a narrow bar signals that the move happened without conviction.",

  howToRead:
    "Each bar spans the session's price range vertically (high at top, low at bottom). Its width is proportional to that session's volume — not its duration in days. The x-axis is cumulative volume in shares, so a day with 2 million shares traded takes up four times as much horizontal space as a day with 500,000 shares. Up-sessions (close above open) are shown as hollow bars; down-sessions are filled. Richard W. Arms Jr. introduced this chart in 1971 in *Trading Without Fear* (Simon & Schuster), later expanded in *Volume Cycles in the Stock Market*. His argument: calendar time is noise; volume is the true clock of market activity.",

  example: {
    title: "NYSE equities during the 1987 crash, October 1987",
    description:
      "Arms applied his own chart to the October 19 session ('Black Monday'), which recorded then-record NYSE volume of 604 million shares. On an equivolume chart that single session would occupy an extraordinarily wide bar — wider than many weeks combined — making the scale of participation immediately visible in a way a calendar chart would compress to one of 250 trading days.",
  },

  elements: [
    {
      selector: "wide-bar",
      label: "Wide bar (high-volume day)",
      explanation:
        "A wide bar indicates a high-volume session. Because the x-axis is cumulative volume, this day occupies more horizontal space than its neighbouring sessions. Arms argued that high-volume price action carries more market weight than thin-volume moves of equal size.",
    },
    {
      selector: "narrow-bar",
      label: "Narrow bar (low-volume day)",
      explanation:
        "A narrow bar represents a low-volume session. The price range may be similar to adjacent bars, but the slender width signals that the move occurred on thin participation — what Arms called a 'reluctant' price movement.",
    },
    {
      selector: "up-bar",
      label: "Up-bar (close above open)",
      explanation:
        "Hollow bars with a green outline mark sessions where the closing price exceeded the opening price. The hollow fill distinguishes direction without relying solely on colour — a small triangle at the top-right corner reinforces the up-direction for readers in monochrome.",
    },
    {
      selector: "down-bar",
      label: "Down-bar (close below open)",
      explanation:
        "Filled dark bars mark sessions where the closing price fell below the opening price. A small triangle marker at the bottom-left corner provides a secondary direction cue independent of fill colour.",
    },
    {
      selector: "cumulative-volume-axis",
      label: "Cumulative volume (x-axis)",
      explanation:
        "The x-axis measures cumulative shares traded, not calendar dates. A gap in this axis would represent a day with zero volume — which does not exist in practice. This axis is the chart's defining innovation: it subordinates time to market activity. Variant charts using the same principle applied to candlestick bodies are called CandleVolume charts.",
    },
    {
      selector: "price-axis",
      label: "Price (y-axis)",
      explanation:
        "The y-axis shows price. Each bar spans the full high-low range of the session: there are no wicks because the bar body already represents the complete traded range, from the lowest to the highest transaction of the day.",
    },
  ],
};
