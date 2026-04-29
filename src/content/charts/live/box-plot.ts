import type { LiveChart } from "@/content/chart-schema";

export const boxPlot: LiveChart = {
  id: "box-plot",
  name: "Box Plot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Compresses a distribution into five numbers per category — minimum, first quartile, median, third quartile, maximum — plus outliers.",
  whenToUse:
    "Reach for a box plot when you need to compare distributions across many categories at once and you care about the middle 50% and the tails more than the shape. It is the densest honest summary you can draw of a one-dimensional sample.",
  howToRead:
    "Each category gets a box: top and bottom of the box are the 75th and 25th percentiles, the line across the middle is the median, and the whiskers extend to the farthest non-outlier point (typically 1.5 × IQR beyond the box). Points drawn outside the whiskers are outliers — individual observations that would distort the summary if folded in. Compare boxes by reading three things at once: where the median sits, how tall the box is, and how far the whiskers reach.",
  example: {
    title: "Men's Olympic 100m-final times by decade, 1920s–2020s",
    description:
      "Plot the finalists' times for every Olympic 100m final since 1924 and the box plot tells two stories in one picture. The median drops almost a full second across the century — runners got faster. The boxes also shrink — the gap between gold and fourth place closed. By the 2010s the entire IQR fits inside what was a single runner's margin in the 1920s, and Usain Bolt's 9.63 sits as a clear outlier even against his own peers.",
  },
  elements: [
    {
      selector: "median-line",
      label: "Median line",
      explanation:
        "The bold horizontal inside the box is the 50th percentile — half the observations are above it, half below. It is the box plot's load-bearing statistic. If the median sits near one end of the box the distribution is skewed, not symmetric.",
    },
    {
      selector: "iqr-box",
      label: "Box (interquartile range)",
      explanation:
        "The box spans the 25th to 75th percentile — the middle 50% of the data. Its height is the interquartile range, a spread measure that ignores extreme tails. A short box means the centre of the distribution is tight; a tall box means even the typical outcome varies a lot.",
    },
    {
      selector: "whisker",
      label: "Whisker",
      explanation:
        "Each whisker extends from the box out to the farthest observation still within 1.5 × IQR of the box edge. Whisker length tells you how far the non-outlier tail reaches. Everything beyond the whisker tip is drawn as an individual outlier point.",
    },
    {
      selector: "x-axis",
      label: "X-axis (category)",
      explanation:
        "The categorical axis — one box per group. Order boxes meaningfully: by time, by sample size, or by median value. Alphabetical order is almost never the right choice for a box plot — the reader should be able to trace a trend along the axis.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (value)",
      explanation:
        "The continuous axis the distribution lives on. For times, note that the visual direction is flipped from intuition: lower numbers (faster runs) sit higher on the chart. Starting the y-axis near the data's range is honest here — a box plot is a zoom lens on the middle of the distribution, not a magnitude chart.",
    },
    {
      selector: "gridline",
      label: "Gridline",
      explanation:
        "A faint horizontal at each major y-tick. Gridlines let the reader compare a median or a whisker across non-adjacent boxes without having to track back to the axis. Keep them subtle — if the gridlines are as dark as the boxes, the boxes lose the page.",
    },
  ],
};
