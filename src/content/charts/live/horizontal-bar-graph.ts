import type { LiveChart } from "@/content/chart-schema";

export const horizontalBarGraph: LiveChart = {
  id: "horizontal-bar-graph",
  name: "Horizontal Bar Graph",
  family: "comparison",
  sectors: ["general"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Rotates the bar chart so long category labels sit flat on the left and the eye scans left-to-right along each bar.",
  whenToUse:
    "Reach for a horizontal bar graph whenever the category labels are long, variable in length, or more than seven or eight in number. The rotation keeps every label horizontal and gives the chart room to breathe vertically, where adding rows costs less than widening a page.",
  howToRead:
    "Read each row as one category: label on the left, bar extending right from a shared zero. Bar length is the value, so longer bars mean more. Sort rows by value unless the categories have an inherent order, and keep the value axis at the bottom so the tick labels don't crowd the category labels.",
  example: {
    title: "The world's twelve most-spoken first languages, by speaker count",
    description:
      "Ethnologue's 2023 edition lists Mandarin at roughly 940 million first-language speakers, nearly twice Spanish's 485 million and more than eleven times Wu Chinese's 80 million. The horizontal layout lets each language name sit fully readable on the left — 'Portuguese' and 'Vietnamese' would collide on the x-axis of a vertical bar chart, but here they read cleanly.",
  },
  elements: [
    {
      selector: "bar",
      label: "Bar",
      explanation:
        "One bar per category, growing rightward from the shared baseline. Length encodes the value. Rows are sorted by length so the reader sees the ranking before reading any numbers.",
    },
    {
      selector: "category-label",
      label: "Category label",
      explanation:
        "Placed to the left of the bar so the eye reads label then magnitude in a single left-to-right pass. This is the layout's core advantage over a vertical bar chart, where long labels either rotate or collide.",
    },
    {
      selector: "value-axis",
      label: "Value axis",
      explanation:
        "The magnitude axis, now running horizontally along the bottom. As with a vertical bar chart, it must start at zero so that bar lengths are directly proportional to values.",
    },
    {
      selector: "value-label",
      label: "Value label",
      explanation:
        "The number printed at the end of each bar. Direct labels free the reader from squinting back at the axis; keep them when the value itself is the point and drop them when the ranking is what matters.",
    },
    {
      selector: "gridline",
      label: "Gridline",
      explanation:
        "A vertical reference line at a regular interval. Gridlines help the eye measure a bar against the value axis; keep them faint so the bars remain the visual subject.",
    },
    {
      selector: "baseline",
      label: "Baseline",
      explanation:
        "The vertical line every bar grows from. Because all bars share this origin, the ratio of their lengths is the ratio of their values — the property that makes bar graphs honest.",
    },
  ],
};
