import type { LiveChart } from "@/content/chart-schema";

export const stackedBarChart: LiveChart = {
  id: "stacked-bar-chart",
  name: "Stacked Bar Chart",
  family: "composition",
  sectors: ["general", "business", "marketing", "finance"],
  dataShapes: ["categorical", "continuous"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Bars broken into coloured segments to show both total size and the proportional mix inside each category.",
  whenToUse:
    "Use a stacked bar when you need to answer two questions at once: 'how big is each category?' and 'what is each category made of?'. If the second question is the only one that matters, a 100% stacked bar or a small-multiples chart will read more clearly.",
  howToRead:
    "The total height (or length) of each bar is your first read — it's the category's overall size. The coloured segments inside carry the mix. The segment at the baseline is the easiest to compare across bars because it shares a zero reference; segments higher in the stack drift against different baselines and become harder to compare. Put your most important sub-category at the bottom.",
  example: {
    title: "Quarterly revenue by product line",
    description:
      "A SaaS company uses stacked bars in its investor updates: the total height shows revenue climbed from $18M to $31M across eight quarters, and the coloured segments reveal the mix shifted from 70% legacy on-premise to 55% new cloud product. One chart, two narratives — growth and strategic repositioning.",
  },
  elements: [
    {
      selector: "bar-total",
      label: "Bar total",
      explanation:
        "The full length of a bar shows the category's grand total. It's the first thing the eye reads. If total size isn't interesting for your data, use 100%-stacked bars instead.",
    },
    {
      selector: "bar-segment",
      label: "Bar segment",
      explanation:
        "Each coloured block is one sub-category's contribution to its bar's total. The bottom segment is easiest to compare across bars; higher segments drift as lower ones change.",
    },
    {
      selector: "legend-item",
      label: "Legend item",
      explanation:
        "Connects a colour to a sub-category. Order the legend the same way as the stack (bottom-to-top) so the visual order and the legend order match.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (value)",
      explanation:
        "Always start at zero. Stacked bars are about magnitudes of parts adding up to a whole; cutting the axis breaks the visual contract.",
    },
    {
      selector: "x-axis",
      label: "X-axis (categories)",
      explanation:
        "One tick per bar category. If categories have a natural order (time, size), use it; otherwise sort by total descending so the biggest bars come first.",
    },
    {
      selector: "gridline",
      label: "Gridline",
      explanation:
        "Horizontal reference at regular values. Helps when comparing similar-looking bars; drop them if they compete with the segment colours.",
    },
  ],
};
