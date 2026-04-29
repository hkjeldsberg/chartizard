import type { LiveChart } from "@/content/chart-schema";

export const threeLineBreakChart: LiveChart = {
  id: "three-line-break-chart",
  name: "Three-Line Break Chart",
  family: "change-over-time",
  sectors: ["finance"],
  dataShapes: ["temporal"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Vertical bars filtered by a three-bar reversal rule eliminate the time axis and noise, registering only moves that break the prior three bars in the opposite direction.",

  whenToUse:
    "Use a Three-Line Break chart when you want to filter sub-threshold price oscillations without committing to a fixed brick size (as Renko does). Because the reversal threshold is dynamic — the low or high of the preceding three bars — it adapts to volatility without requiring a parameter. The chart is particularly useful for identifying whether an existing trend is intact or has been genuinely reversed, rather than merely retraced.",

  howToRead:
    "Read the chart left to right: a hollow bar is an up-bar; a filled bar is a down-bar. A new bar appears only when price extends the current run (closes above the prior up-bar's high, or below the prior down-bar's low) or when it breaks the extreme of the previous three bars in the opposite direction. There are no time labels on the x-axis because bars are event-indexed — a session that fails to qualify leaves no mark. A long run of one-colour bars is a confirmed trend; the first bar of the opposite colour after a break is the reversal signal.",

  example: {
    title: "Nikkei 225 cash index, 1989–1992 bear market",
    description:
      "Steven Nison documented the Nikkei collapse in *Beyond Candlesticks* (Wiley, 1994): a Three-Line Break chart filtered the daily noise in the post-bubble sell-off and produced a compact sequence of filled bars that clearly marked the regime change. The chart showed the reversal in early 1990 as a down-bar that broke the low of the prior three up-bars — a clean signal that 30 years of raw Nikkei daily data obscures in volatility.",
  },

  elements: [
    {
      selector: "up-bar",
      label: "Up-bar (hollow)",
      explanation:
        "An up-bar appears when the closing price exceeds the high of the immediately preceding bar. It is rendered hollow — outline only, no fill — following the Japanese rice-trading convention that rising prices need no ink. Each bar's open is set to the prior bar's close, so the chart forms a seamless staircase in one direction.",
    },
    {
      selector: "down-bar",
      label: "Down-bar (filled)",
      explanation:
        "A down-bar appears when the close falls below the low of the immediately preceding bar. It is filled solid, signalling negative pressure. Alternating hollow and filled bars without a three-bar break are not possible: the current direction must first be exhausted before a reversal bar can be drawn.",
    },
    {
      selector: "reversal-event",
      label: "Reversal event",
      explanation:
        "The reversal bar is the chart's defining moment: it appears only when price breaks below the lowest low of the prior three up-bars (to reverse down), or above the highest high of the prior three down-bars (to reverse up). A single bar that merely gives back some gain does not qualify. This three-bar threshold is more conservative than a two-bar rule and less path-dependent than the Kagi reversal percentage.",
    },
    {
      selector: "three-bar-lookback",
      label: "Three-bar lookback",
      explanation:
        "The reversal threshold is not computed from the single prior bar but from the extreme of the last three bars in the current direction. This lookback is the rule that names the chart. One of those three bars is anchored here; together they define the price level that the reversal bar must break to change direction.",
    },
    {
      selector: "event-axis",
      label: "Event-indexed axis (no time)",
      explanation:
        "The x-axis carries no date labels. Each bar occupies the same horizontal width regardless of how many calendar sessions it took for price to qualify. A quiet sideways market may produce no new bars for days; a sharp trending move may stack bars rapidly. This is the same noise-filtering principle used by Kagi, Renko, and Point-and-Figure charts.",
    },
    {
      selector: "trend-sequence",
      label: "Trend sequence",
      explanation:
        "A run of consecutive same-colour bars is the primary trend signal. Three consecutive up-bars, for instance, sets the reversal threshold for the next potential down-bar. Longer runs lower the probability of a qualifying reversal because the extreme being tested grows more distant from current price.",
    },
  ],
};
