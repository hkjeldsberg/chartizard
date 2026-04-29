import type { LiveChart } from "@/content/chart-schema";

export const lollipopPlot: LiveChart = {
  id: "lollipop-plot",
  name: "Lollipop Plot",
  family: "comparison",
  sectors: ["general"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A bar chart with the bar stripped down to a hairline stem and a dot at the value — the head carries the signal.",
  whenToUse:
    "Use a lollipop when you have a ranked, sparse set of values and the bars would collide or look like a wall. It is most useful at ~10 to 40 categories: enough that a bar chart becomes dense ink, few enough that you can still read each category label. Sort descending so the shape itself communicates rank.",
  howToRead:
    "Each city sits in its own column. The dot is the value — find the city along the x-axis, then read its dot's height off the y-axis. The thin stem only exists to remind you the values share a common zero baseline. Compare dots to each other; ignore the stems once you have got the rank.",
  example: {
    title: "Median monthly rent, top 12 US metros, 2024",
    description:
      "Rent indices published by Zillow and Apartment List rank NYC at roughly $3,500/mo and Atlanta at $1,700 — a 2x gap across twelve cities. Rendered as bars this is a wall of nearly-identical rectangles whose tops you have to squint at; rendered as lollipops, the dots carry the rank at a glance and the stems fade into the background. The stems are not decoration — they are the chart's reminder that rent is measured against zero, not against the cheapest city.",
  },
  elements: [
    {
      selector: "lollipop-head",
      label: "Lollipop head",
      explanation:
        "The dot at the top of each stem is the actual value. Make it large enough to read at tile scale (roughly 5-6px radius here). The head is the only ink that encodes data — everything else is scaffolding.",
    },
    {
      selector: "stem",
      label: "Stem",
      explanation:
        "The thin vertical line from the baseline to the head. Unlike a bar's width, the stem's weight carries no information. That is the point: a lollipop is a bar chart admitting its bar was wasted ink.",
    },
    {
      selector: "ranked-order",
      label: "Ranked order",
      explanation:
        "The categories are sorted by value, left to right. This is not optional — an unsorted lollipop is worse than an unsorted bar chart, because the eye cannot quickly compare dot heights across non-adjacent columns.",
    },
    {
      selector: "baseline",
      label: "Baseline",
      explanation:
        "The zero line. Lollipops must start at zero, same as bars: the head's height above baseline is the value. A truncated baseline turns the chart into a dot plot and invalidates the visual comparison.",
    },
    {
      selector: "category-axis",
      label: "Category axis",
      explanation:
        "The x-axis lists cities — categorical, not continuous. Short labels (NYC, SF, BOS) keep the axis legible when twelve columns are packed into a small tile.",
    },
    {
      selector: "value-axis",
      label: "Value axis",
      explanation:
        "The y-axis shows the quantity — median monthly rent in USD. Always label the unit; a lollipop without a y-axis caption is a polka-dot pattern.",
    },
  ],
};
