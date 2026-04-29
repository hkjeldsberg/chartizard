import type { LiveChart } from "@/content/chart-schema";

export const pieOfPieChart: LiveChart = {
  id: "pie-of-pie-chart",
  name: "Pie-of-Pie / Bar-of-Pie",
  family: "composition",
  sectors: ["general"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A primary pie whose smallest slice is extracted and re-pied so the long tail becomes legible.",
  whenToUse:
    "Reach for pie-of-pie when one slice dominates (>40%) or when a catch-all \"Other\" swallows too many small categories to distinguish. The chart reserves the primary pie for first-order share and delegates the long tail to a second pie at readable scale. If the data has three or more levels of hierarchy, use a sunburst instead — pie-of-pie is strictly two levels.",
  howToRead:
    "Read the left pie as the full 100%. Find the slice connected by dashed lines to the right pie — that slice's value IS the right pie's total. The right pie's wedges sum to the left slice, not to 100%. The dashed connectors are the scale bridge: they say \"this small wedge, expanded.\" Labels on the secondary pie are absolute vendor names; percentages there are shares of the break-out total, not of the global whole.",
  example: {
    title: "Smartphone OEM market share, 2024 Q4",
    description:
      "iPhone (48%) and Samsung (18%) dominate the primary pie; Xiaomi and Oppo sit at 12% and 8%. The remaining 14% is a \"Other\" slice that crams seven vendors together — unreadable as a single wedge. The break-out pie expands \"Other\" into Vivo, Huawei, Pixel, OnePlus, Realme, Transsion, and a rest-residual. Excel shipped this exact chart type in 1997 because flat pies broke on exactly this distribution.",
  },
  elements: [
    {
      selector: "primary-pie",
      label: "Primary pie",
      explanation:
        "The first-order composition. Each slice's angle is proportional to its share of the whole. Order slices largest-first clockwise from 12 o'clock so the eye can rank them without re-sorting.",
    },
    {
      selector: "breakout-slice",
      label: "Break-out slice",
      explanation:
        "The slice being exploded — usually \"Other\" or the smallest wedge. This is the only slice on the primary pie whose internal structure is shown; every other slice is treated as atomic. Pick the slice to break out based on analytical importance, not just size.",
    },
    {
      selector: "breakout-connector",
      label: "Break-out connector",
      explanation:
        "Dashed lines from the edges of the break-out slice to the top and bottom of the secondary pie. They are the scale bridge: they declare that the second pie's 100% equals the first pie's 14% (here). Without them the secondary pie floats as a disconnected chart.",
    },
    {
      selector: "secondary-pie",
      label: "Secondary pie",
      explanation:
        "The zoomed-in break-out. Its slices sum to the break-out slice's value, not to the overall total. Label each wedge directly — the whole point is that these vendors were invisible in the primary pie, so their names must be readable here.",
    },
    {
      selector: "secondary-scale",
      label: "Secondary scale caption",
      explanation:
        "A small caption reminding the viewer that the right pie represents 14% of the left pie — not a separate dataset. Omitting this caption is the chart's single most common failure mode: readers mistake the secondary pie for a parallel analysis and double-count.",
    },
  ],
};
