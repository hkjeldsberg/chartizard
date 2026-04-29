import type { LiveChart } from "@/content/chart-schema";

export const marketProfileChart: LiveChart = {
  id: "market-profile-chart",
  name: "Market Profile Chart",
  family: "distribution",
  sectors: ["finance"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",

  synopsis:
    "A vertical price distribution built from TPO (Time Price Opportunity) letters that record which 30-minute periods traded at each price level during a session.",

  whenToUse:
    "Use a market profile chart when you need to identify intra-day price levels where significant trading activity concentrated (the Value Area) versus levels that were merely touched (single prints). It is primarily a tool for futures traders and active equity traders who need to locate the session's 'fair value' zone and diagnose whether the market accepted or rejected a price level.",

  howToRead:
    "The y-axis is price. Each price row contains one letter per 30-minute trading period (A–M for a 6.5-hour U.S. equity session). A row with many letters indicates price traded there across multiple periods; a row with one letter (a 'single print') indicates rapid passage through that level without rebalancing. The widest row is the Point of Control (POC), the price that attracted the most time. The Value Area is the band of rows containing approximately 70% of all TPOs, centred on the POC. J. Peter Steidlmayer introduced this framework in 1985 at the Chicago Board of Trade; James Dalton formalised the pedagogy in *Mind over Markets* (1993).",

  example: {
    title: "S&P 500 futures, 15 March 2023 (Silicon Valley Bank crisis week)",
    description:
      "During the SVB crisis week, intraday market profiles showed extended single prints at the lower extremes — prices the market swept through without establishing value — while the POC drifted lower across successive sessions. Traders using Steidlmayer's framework could distinguish panic-selling single prints (no value established) from the developing Value Area that marked the week's eventual acceptance zone near 3,860.",
  },

  elements: [
    {
      selector: "tpo-letters",
      label: "TPO letters (time-price opportunities)",
      explanation:
        "Each letter represents one 30-minute trading period (A = open, B = second half-hour, etc.). A letter appears in a price row if the market traded at that price during that period. The number of letters in a row is the row's TPO count — the raw material for computing the POC and Value Area.",
    },
    {
      selector: "poc",
      label: "POC — Point of Control",
      explanation:
        "The price row with the greatest number of TPO letters. In auction theory, the POC is the price at which the market spent the most time — the intraday 'fairest' price. The dashed horizontal line extends across the chart to make the level easy to identify.",
    },
    {
      selector: "value-area",
      label: "Value Area",
      explanation:
        "The contiguous band of price rows containing approximately 70% of the session's total TPOs, centred on the POC. The 70% threshold comes from Steidlmayer's observation that normal distributions contain roughly 70% of observations within one standard deviation of the mean. The bracket on the right edge marks the Value Area High and Value Area Low — levels that function as support and resistance in the following session.",
    },
    {
      selector: "single-print",
      label: "Single print",
      explanation:
        "A price row with exactly one TPO letter. It indicates a rapid price movement through that level without the market pausing to establish value. Single prints at the extremes of a profile are a diagnostic feature: they typically mark the point at which an initiative participant drove price away before other participants could respond. In Dalton's framework, unfilled single prints are often revisited in subsequent sessions.",
    },
    {
      selector: "price-axis",
      label: "Price (y-axis)",
      explanation:
        "The vertical axis is price, scaled continuously. Unlike a bar or candlestick chart, there is no time axis: the horizontal dimension represents only the count of TPO periods, not elapsed clock time. This is what distinguishes a market profile from a traditional OHLC chart.",
    },
    {
      selector: "bell-shape",
      label: "Bell-shape distribution",
      explanation:
        "A normally distributed trading session produces a profile widest at the centre and tapering at the extremes, resembling a bell curve rotated 90 degrees. Steidlmayer called this a 'normal day'. Skewed or bimodal profiles indicate trend days or two-time-frame auctions, respectively — both deviations from the bell are actionable signals in the framework.",
    },
  ],
};
