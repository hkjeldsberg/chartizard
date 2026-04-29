import type { LiveChart } from "@/content/chart-schema";

export const lineChart: LiveChart = {
  id: "line-chart",
  name: "Line Chart",
  family: "change-over-time",
  sectors: ["general", "statistics", "time-series", "finance"],
  dataShapes: ["continuous", "temporal"],
  tileSize: "W",
  status: "live",
  synopsis:
    "Connects ordered data points to reveal how a single quantity moves over an interval.",
  whenToUse:
    "Reach for a line chart when you need to emphasise the shape of change over a continuous axis — usually time. It's the default for trend, trajectory, and rate-of-change questions.",
  howToRead:
    "Read the x-axis as the progression (time, dose, distance) and follow the line from left to right. Slope is the story: a line climbing steeply is accelerating; a flat line is stable; a dip is a reversal. Where the line sits on the y-axis tells you magnitude, but what changes along it tells you why the chart exists. Compare multiple lines only when they share the same y-scale, otherwise you're comparing shapes, not values.",
  example: {
    title: "Global average surface temperature, 1880–2024",
    description:
      "Climate scientists use a single line chart with a smoothed anomaly series to show that temperatures were near-flat for most of the 20th century and have climbed sharply since the 1980s. The chart's power is cumulative — no single data point is persuasive, but the run of points forms a shape the eye can't dismiss.",
  },
  elements: [
    {
      selector: "line-path",
      label: "Line path",
      explanation:
        "The line connects every data point in x-order. Its slope between two points is the local rate of change. Gaps in the line indicate missing data.",
    },
    {
      selector: "data-point",
      label: "Data point",
      explanation:
        "Each point is one observation. Make the points small relative to the line so the trend is the visual subject, not the individual measurements.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "The progression axis — usually time, dose, or ordered step. Must be continuous; if your x-axis is categorical, use a bar chart instead.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "The magnitude axis. Starting the y-axis at zero is optional for line charts (unlike bars): if the story is proportional change, starting near the data's range is often more honest.",
    },
    {
      selector: "gridline",
      label: "Gridline",
      explanation:
        "A light horizontal reference at regular intervals. Use them sparingly — too many gridlines compete with the line for attention.",
    },
    {
      selector: "y-label",
      label: "Y-axis label",
      explanation:
        "Always state the unit. A line chart with an unlabeled y-axis is just a shape, not data.",
    },
    {
      selector: "reference-line",
      label: "Reference line",
      explanation:
        "An optional horizontal line (e.g. a baseline, target, or zero line) that gives the viewer something to measure against. Especially useful when small changes carry the meaning.",
    },
  ],
};
