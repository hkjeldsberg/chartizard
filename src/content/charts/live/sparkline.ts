import type { LiveChart } from "@/content/chart-schema";

export const sparkline: LiveChart = {
  id: "sparkline",
  name: "Sparkline",
  family: "change-over-time",
  sectors: ["general", "finance"],
  dataShapes: ["temporal"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A word-sized line chart. No axes, no legend — just the shape of change, sized to sit inline with prose.",
  whenToUse:
    "Reach for a sparkline when the reader needs the trajectory of a single series as a glance, not a study. They belong next to the number they contextualise: a KPI tile, a row in a table, a sentence of copy. If the reader needs to compare values, use a full line chart; if they need the exact number, use a number.",
  howToRead:
    "Read the shape. Up-and-to-the-right is growth; a valley is a dip that recovered; a flat run is stasis. Because there is no y-axis, the chart will not tell you magnitude — that is what the inline start and end values are for. Treat the endpoints as the anchors and the curve between them as the story of how they got there.",
  example: {
    title: "AAPL closing price, 90 trading days",
    description:
      "A sparkline set beside a price ticker shows a climb from $170 to $195 with a small dip around day 55 and a late run to a new high. The reader does not need ticks or gridlines to see that the quarter ended strong; the glyph carries the whole argument in the space of a word.",
  },
  elements: [
    {
      selector: "line-path",
      label: "Line path",
      explanation:
        "The smoothed curve connecting every observation. Shape is the entire read — a sparkline trades numerical precision for a trend you can take in at a glance.",
    },
    {
      selector: "start-value",
      label: "Start value",
      explanation:
        "The opening observation, labelled inline in small mono type. Without an axis this is how the reader anchors magnitude at the left edge.",
    },
    {
      selector: "end-value",
      label: "End value",
      explanation:
        "The final observation, labelled inline and weighted slightly heavier than the start. In a KPI context this is usually the number the reader came for; the curve explains how it got here.",
    },
    {
      selector: "baseline",
      label: "Baseline",
      explanation:
        "A muted dashed line at the starting value. It is the only reference mark a sparkline earns: it lets the eye separate runs that finished above the opening level from runs that finished below it.",
    },
    {
      selector: "trough",
      label: "Trough",
      explanation:
        "The lowest point in the series. Calling it out with a small dot prevents the dip from being read as noise — here it is an intra-quarter pullback the eye might otherwise smooth away.",
    },
    {
      selector: "crown",
      label: "Crown",
      explanation:
        "The high point in the back half of the series. Marking it makes the late-quarter new high legible at this scale — without the dot it reads as just the end of the curve.",
    },
  ],
};
