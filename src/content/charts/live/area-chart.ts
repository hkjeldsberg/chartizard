import type { LiveChart } from "@/content/chart-schema";

export const areaChart: LiveChart = {
  id: "area-chart",
  name: "Area Chart",
  family: "change-over-time",
  sectors: ["general", "statistics", "time-series", "finance"],
  dataShapes: ["continuous", "temporal"],
  tileSize: "L",
  status: "live",
  synopsis:
    "A line chart with its area below filled, emphasising volume, accumulation, or magnitude over time.",
  whenToUse:
    "Use an area chart when the size of the thing matters — total volume, cumulative value, or magnitude — rather than the precise slope at each moment. Avoid it when you need to compare two lines closely; the fills will overlap and mask the signal.",
  howToRead:
    "The upper edge is still a line chart: slope tells you rate of change. The fill below the line adds a second reading — the visual weight of the area represents the cumulative magnitude. Big filled regions look heavy for a reason: they are. Be careful with overlapping areas on a shared baseline; they read as 'more' even when they're the same.",
  example: {
    title: "Daily electricity demand on a utility grid",
    description:
      "Grid operators publish demand as an area chart to make the sheer size of peak hours feel undeniable. A line alone would show the shape; the fill makes you feel the 4pm ramp, which is what planners are actually sizing generation against.",
  },
  elements: [
    {
      selector: "area-fill",
      label: "Area fill",
      explanation:
        "The shaded region between the line and the baseline. Its area encodes cumulative magnitude. Keep the fill semi-transparent when overlaying multiple series; opaque fills hide data behind them.",
    },
    {
      selector: "upper-edge",
      label: "Upper edge (line)",
      explanation:
        "The top boundary of the area — this is the value you're plotting. Reading slope here tells you rate of change, just like a line chart.",
    },
    {
      selector: "baseline",
      label: "Baseline",
      explanation:
        "The bottom of the fill. For most area charts this is zero. Moving the baseline off zero silently exaggerates change, so keep it anchored unless you're drawing a ribbon/streamgraph.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "Must be quantitative and must start at zero for a standard area chart — the filled area is only meaningful relative to a true zero baseline.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "The progression axis — usually time. Because area charts imply continuity, an evenly-spaced x-axis is expected; irregular intervals will distort the apparent volume.",
    },
  ],
};
