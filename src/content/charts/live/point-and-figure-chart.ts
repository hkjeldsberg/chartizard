import type { LiveChart } from "@/content/chart-schema";

export const pointAndFigureChart: LiveChart = {
  id: "point-and-figure-chart",
  name: "Point-and-Figure Chart",
  family: "change-over-time",
  sectors: ["finance"],
  dataShapes: ["temporal"],
  tileSize: "S",
  status: "live",

  synopsis:
    "A price-only chart that filters time entirely, plotting X columns for rising boxes and O columns for falling boxes — a column changes only when price reverses by a fixed multiple of the box size.",

  whenToUse:
    "Use a Point-and-Figure chart when you want to identify support, resistance, and trend without the noise of low-volatility sessions. Because time is irrelevant to the grid, the chart compresses consolidation periods and expands volatile moves. Victor de Villiers codified the notation in 1933; the underlying method is older still, originating on 1880s NYSE trading floors where clerks tracked price levels in columns of hash marks.",

  howToRead:
    "Each column is either all X's (price rising) or all O's (price falling). A new X is added when price advances by one box size; a new O column begins one cell to the right only when price falls by the reversal amount — typically three box sizes — below the highest X. Read left to right for chronology, but the horizontal rows are price levels: any row with multiple X or O symbols marks a level the market tested repeatedly, making it a candidate support or resistance zone.",

  example: {
    title: "S&P 500 futures, 2002–2003 bear-market low",
    description:
      "Using a 10-point box size and three-box reversal, the P&F chart of S&P 500 futures from 2001 to 2003 collapsed the two-year bear market into roughly fifteen columns, with a single dense horizontal band of O's at the 800–820 zone that appeared in three consecutive columns — the double bottom that marked the eventual market floor. The same chart drawn day-by-day on a candlestick would have required scrolling through 500 bars to locate that zone.",
  },

  elements: [
    {
      selector: "x-column",
      label: "X column (rising)",
      explanation:
        "A vertical stack of X's marks a sustained advance. One X is added for each box size the price climbs. The column continues upward until the reversal condition triggers. The height of the column is a direct measure of the magnitude of the move — not its duration.",
    },
    {
      selector: "o-column",
      label: "O column (falling)",
      explanation:
        "A vertical stack of O's marks a sustained decline. O's are printed downward, one per box size. An O column begins only after a three-box reversal from the previous X column's high — so trivial counter-moves are filtered entirely from the record.",
    },
    {
      selector: "column-transition",
      label: "Column transition (X → O or O → X)",
      explanation:
        "When an X column reverses to O, the new O column starts one cell to the right and one cell below the X column's peak. This one-cell offset is the visual signature of a reversal — the staircase pattern of descending column tops traces a downtrend, ascending column bottoms an uptrend.",
    },
    {
      selector: "box-annotation",
      label: "Box-size / reversal parameters",
      explanation:
        "The two construction parameters are box size (the minimum price increment per symbol) and reversal (the multiple of box sizes required to switch columns). A 0.5% box with 3-box reversal means noise below 1.5% of current price is invisible. Smaller boxes produce more columns and more detail; larger boxes filter more aggressively.",
    },
    {
      selector: "reversal-rule",
      label: "3-box reversal rule",
      explanation:
        "The reversal rule is the chart's noise filter. A 3-box reversal means price must move at least three box sizes against the current column's direction before a new column starts. One or two boxes of counter-move leave the existing column unchanged. De Villiers' 1933 treatise established three boxes as the convention that balanced sensitivity against noise, and it remains the retail default today.",
    },
    {
      selector: "support-resistance",
      label: "Support / resistance row",
      explanation:
        "Any horizontal price level where multiple columns share the same row has been tested repeatedly — in P&F terms, that is a support or resistance zone. The grid makes these zones visible at a glance: a horizontal band of aligned X's or O's across several columns is exactly what technical analysts call a 'congestion area' or 'base'.",
    },
  ],
};
