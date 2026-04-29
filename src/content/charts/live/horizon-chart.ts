import type { LiveChart } from "@/content/chart-schema";

export const horizonChart: LiveChart = {
  id: "horizon-chart",
  name: "Horizon Chart",
  family: "change-over-time",
  sectors: ["time-series"],
  dataShapes: ["temporal"],
  tileSize: "W",
  status: "live",
  synopsis:
    "Folds negative values up to positive and stacks banded intensity, so many series fit in a fraction of the vertical space.",
  whenToUse:
    "Reach for a horizon chart when you need to compare a dozen time series at once and a small-multiples grid would run off the screen. Heer and Perer (2006) showed that horizon charts let you read roughly ten times as many series in the same vertical space as line charts without losing task accuracy. The encoding trades resolution per row for density across rows.",
  howToRead:
    "Each row is one series, sharing the same time axis. Values below zero are folded upward and recoloured so both signs climb away from the baseline. Within a row the plot is sliced into three intensity bands — the darkest band is the highest magnitude, so a spike shows as a compact dark mass rather than a tall line. Read across a row for that series's story; scan vertically down a column of time to compare many series at one instant.",
  example: {
    title: "Eight tech-heavy tickers through 500 trading days",
    description:
      "AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA, and JPM each get one row of daily log-returns. The Covid-19 drawdown in March 2020 reads as a synchronous stripe of dark blue (folded negatives) running vertically across every row — a pattern a line chart of eight overlapping series would bury in crosshatch. NVDA and TSLA's fatter tails show up as wider dark bands on their rows; JPM's calmer profile reads as a pale band.",
  },
  elements: [
    {
      selector: "band-stack",
      label: "Band stack",
      explanation:
        "Each row is sliced into three equal-magnitude bands. The lightest band covers the first third of the row's range, the next covers the second third, the darkest covers the top third. Stacking them in place means a small spike stays short-and-pale while a large spike fills the row with a dark stack. That compression is how horizon charts fit many series in one viewport.",
    },
    {
      selector: "negative-fold",
      label: "Negative fold",
      explanation:
        "Negative values are mirrored upward so they climb away from the baseline the same way positives do. A different hue family (cool blue versus warm ink) preserves the sign distinction. Without the fold, negatives would eat half the row's vertical budget; with it, the full row's height is available to both signs.",
    },
    {
      selector: "baseline",
      label: "Baseline",
      explanation:
        "The zero line sits at the bottom of every row. All bands — positive and folded-negative — are anchored to it. The baseline is the only common reference between rows, which is why horizon charts share one value scale across every series in the stack.",
    },
    {
      selector: "intensity",
      label: "Intensity encoding",
      explanation:
        "Darker means larger magnitude. The colour ramp is ordinal, not continuous: three discrete tones per hue. Readers decode magnitude primarily from colour, not from height, so a compressed row still communicates spikes clearly.",
    },
    {
      selector: "row",
      label: "Row",
      explanation:
        "One row equals one series over the full time axis. Rows share a common x-axis and a common value scale, so vertical alignment between rows lets you compare magnitudes across series at any instant. Adding more rows costs almost nothing — the chart scales downward gracefully where a small-multiples grid of line charts would force scrolling.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "The shared time axis, running left to right across every row. One vertical drop through the stack reads every series at the same moment, which is what makes synchronous events — market-wide drawdowns, earnings days, macro shocks — visible as vertical stripes.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "The series labels. There is no numeric y-scale inside a row: the row's height is fixed, and magnitude lives in the band colours. The y-axis is categorical — it names which series sits on which row.",
    },
  ],
};
