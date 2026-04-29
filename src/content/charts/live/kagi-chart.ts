import type { LiveChart } from "@/content/chart-schema";

export const kagiChart: LiveChart = {
  id: "kagi-chart",
  name: "Kagi Chart",
  family: "change-over-time",
  sectors: ["finance"],
  dataShapes: ["temporal"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Alternating thick and thin vertical line segments, connected by right-angle horizontal turns, that register only price reversals above a fixed threshold — time does not appear on the x-axis.",

  whenToUse:
    "Use a Kagi chart when the question is whether price has established a new trend direction, not when it happened. The chart discards every price move smaller than the reversal threshold, so a crowded intraday series collapses into a handful of meaningful segments. It is most useful for medium-term equity and commodity trend-following, where the date of a reversal matters less than its magnitude.",

  howToRead:
    "Read left to right along the event axis, which counts reversals, not calendar days. A thick (yang) line signals that price has broken above the previous peak — the market is in an uptrend. A thin (yin) line signals a break below the previous trough — the market is in a downtrend. The short horizontal connector between two vertical segments marks the exact price level where a reversal of sufficient magnitude occurred. The reversal threshold, stated in the annotation, is the minimum price change required to begin a new segment.",

  example: {
    title: "Nikkei 225 daily closes, 1989–1992 bear market",
    description:
      "Applied to the Nikkei's collapse from its December 1989 peak of ¥38,957 to the mid-1992 trough near ¥15,000, a Kagi chart with a 3% reversal threshold produced roughly 18 alternating segments across a three-year span — compressing 750 trading days into a single visual confirmation that each apparent recovery failed to break the previous yang peak and therefore remained a yin (bear) structure throughout.",
  },

  elements: [
    {
      selector: "yang-segment",
      label: "Yang segment (thick)",
      explanation:
        "A thick vertical line drawn when the current segment's high has crossed above the previous Kagi peak. Japanese traders named this state 'yang' after the active, rising principle. Steven Nison introduced the yang/yin terminology to Western analysts in *Beyond Candlesticks* (1994, Wiley). A sustained run of yang segments identifies an established uptrend.",
    },
    {
      selector: "yin-segment",
      label: "Yin segment (thin)",
      explanation:
        "A thin vertical line drawn when the current segment's low has crossed below the previous Kagi trough. The market is bearish while yin lines persist. Line thickness — not colour — is the primary encoding, so the chart remains legible in monochrome.",
    },
    {
      selector: "reversal-connector",
      label: "Right-angle connector",
      explanation:
        "The short horizontal line linking the end of one vertical segment to the start of the next. It marks the reversal price and the 'hook' shape that gives the chart its name: 'kagi' is Japanese for hook or key. The connector appears only after a price move of at least the reversal threshold has occurred in the opposite direction.",
    },
    {
      selector: "yin-yang-transition",
      label: "Yin-to-yang transition",
      explanation:
        "The point where a rising segment clears the most recent Kagi peak and the line switches from thin to thick. Technicians treat this transition as a buy signal. Pre-Meiji rice traders in Osaka tracked this transition on paper scrolls to decide when to increase long positions in the Dojima futures markets.",
    },
    {
      selector: "reversal-threshold",
      label: "Reversal threshold",
      explanation:
        "The minimum price change, stated as a percentage or fixed amount, required before a new opposite-direction segment begins. A 3% threshold ignores all moves smaller than 3% of the current price. Choosing a larger threshold produces fewer, higher-confidence reversals; a smaller threshold produces a noisier chart that closely resembles an OHLC series.",
    },
    {
      selector: "event-axis",
      label: "Event axis (not time)",
      explanation:
        "The horizontal axis counts reversals, not calendar intervals. Two segments may represent one week or one year of real time depending on market volatility. This is the chart's defining design principle: time is noise, and only movements that exceed the threshold deserve a mark. Contrast with candlestick or OHLC charts, where every trading session occupies equal horizontal space regardless of its informational content.",
    },
  ],
};
