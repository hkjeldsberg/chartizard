import type { LiveChart } from "@/content/chart-schema";

export const heikinAshiChart: LiveChart = {
  id: "heikin-ashi-chart",
  name: "Heikin-Ashi Chart",
  family: "change-over-time",
  sectors: ["finance"],
  dataShapes: ["temporal"],
  tileSize: "S",
  status: "live",

  synopsis:
    "A candlestick variant in which each bar's OHLC values are averaged with the preceding bar, suppressing counter-trend noise and making trend regimes visually unambiguous.",

  whenToUse:
    "Use Heikin-Ashi when you want to identify the dominant trend without being distracted by single-session reversals. The chart is a direct transformation of standard OHLC data — not an independent source — so it should sit alongside a conventional candlestick view rather than replace it for entry and exit timing. Dan Valcu's 2011 Wiley book 'Heikin-Ashi: How to Trade Without Candlestick Patterns' is the canonical retail trading reference for the technique.",

  howToRead:
    "HA bars look like candlesticks but encode averaged values. In a strong up-trend, bars will have hollow bodies, long upper wicks, and little or no lower wick — the lower wick vanishes because the HA formula averages away the brief dips that appear in raw candlesticks. In a down-trend the hallmark is filled bars with long lower wicks and no upper wick. A bar with wicks on both sides and a small body signals weakening momentum or a potential reversal. Because the open of each bar is computed from the prior bar, HA prices cannot be used to place exact price orders.",

  example: {
    title: "Nikkei 225, Q4 2012 to Q2 2013 (Abenomics rally)",
    description:
      "Applied to the Nikkei 225 during the 60% rally that followed Shinzo Abe's election in late 2012, Heikin-Ashi produced an almost unbroken sequence of hollow, wickless-bottom bars from December 2012 through May 2013. A raw candlestick chart of the same period contains 15 red sessions inside that advance; the HA chart collapses them into a near-monotone column of hollow bars, making the trend unmistakable. The comparison illustrates the chart's single job: remove intra-trend pullbacks from the visual signal.",
  },

  elements: [
    {
      selector: "ha-up-bar",
      label: "HA up-bar (hollow, no lower wick)",
      explanation:
        "The diagnostic mark of a Heikin-Ashi up-trend. The hollow body means HA_Close exceeded HA_Open; the missing lower wick means the low of the session coincided with HA_Open or HA_Close — the averaging formula absorbed the raw intraday low. A run of these bars is the strongest HA trend signal.",
    },
    {
      selector: "ha-down-bar",
      label: "HA down-bar (filled, no upper wick)",
      explanation:
        "The filled body marks a session where HA_Close fell below HA_Open. In a clean down-trend the upper wick disappears for the same reason: the session high was fully absorbed into the HA_High formula. Filled bars without upper wicks are the down-trend equivalent of the hollow/no-lower-wick signature.",
    },
    {
      selector: "wick-segment",
      label: "Wick segment",
      explanation:
        "A visible wick on the counter-trend side — a lower wick on a rising bar, or an upper wick on a falling bar — signals weakening momentum. The longer the wick, the more of the raw price excursion survived the smoothing. Wicks appearing on both sides of a small body mark a transition zone between trend regimes.",
    },
    {
      selector: "trend-region",
      label: "Clean trend region",
      explanation:
        "A sequence of same-direction bars with no counter-trend wicks is the Heikin-Ashi diagnostic: the market is in a persistent trend strong enough that each bar's four-component average still moves in the same direction. Heikin-Ashi compresses raw candlesticks during these phases — a five-day HA up-sequence may correspond to ten raw sessions with two or three red days buried inside it.",
    },
    {
      selector: "smoothing-formula",
      label: "Smoothing formula (body length)",
      explanation:
        "Body length is the primary diagnostic in Heikin-Ashi. A long body means the four-component average (O+H+L+C)/4 moved far from the averaged open — momentum is strong. A short body means the smoothed values converged — momentum is weak. Unlike raw candlesticks, the HA body length is inherently smoothed, so it is a more stable signal than a single session's close-minus-open.",
    },
    {
      selector: "time-axis",
      label: "Time axis",
      explanation:
        "Heikin-Ashi preserves the time axis of the underlying OHLC series — each bar corresponds to exactly one session. The chart's averaging does not compress time, only price. Comparing HA bars to their raw candlestick counterparts at the same session is the standard method for verifying how much counter-trend noise the smoothing absorbed.",
    },
  ],
};
