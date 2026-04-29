import type { LiveChart } from "@/content/chart-schema";

export const gapChart: LiveChart = {
  id: "gap-chart",
  name: "Gap Chart",
  family: "comparison",
  sectors: ["general"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Per-category vertical line joining an actual value to its target — the line's length is the miss, its colour is the sign.",
  whenToUse:
    "Reach for a gap chart when every category has its own target and the chart's job is to show which categories cleared the bar and which fell under it. A dumbbell chart compares two points in time; a deviation chart centres every row on a single shared baseline. The gap chart sits between them: each category keeps its own target, and the gap between target and actual is the mark on the page.",
  howToRead:
    "Each category owns one vertical slot. The horizontal tick is the target; the dot is the actual value. The line between them is the gap — its length is the miss or beat, its colour is the sign. Read the x-axis as a flat list of categories, not an ordered axis; read the y-axis for absolute magnitude. A short line means the category is close to plan, a long line means it is not.",
  example: {
    title: "Quarterly revenue: actual vs target across eight regions",
    description:
      "A multinational closes the quarter and plots each region's actual against its own budget target. APAC prints $88M against a $72M plan; USA prints $74M against a $92M plan. A deviation chart would centre every row on zero and throw the target's dollar level away; the gap chart keeps both, so a reader can see that USA missed by $18M AND that the bar was set 30% higher than APAC's.",
  },
  elements: [
    {
      selector: "gap-line",
      label: "Gap line",
      explanation:
        "The vertical segment from target to actual. Its length is the absolute size of the miss or beat, in the y-axis's own units. The line itself is the encoding — a category sitting near zero gap produces a dot-on-tick with no visible segment, which is the chart correctly reporting on plan.",
    },
    {
      selector: "target-marker",
      label: "Target marker",
      explanation:
        "A short horizontal tick at the target's y-value. Each category carries its own target, and the tick sits at the level the plan was set to — not a shared baseline. Keep the ticks dimmer than the actual dots so the eye goes to the observation first and references the target second.",
    },
    {
      selector: "actual-dot",
      label: "Actual dot",
      explanation:
        "The observed value for the period. Drawn as a filled circle so the eye can resolve it against the thinner target tick and the gap line. Its absolute y-position still reads off the value axis, even though the line tells the rest of the story.",
    },
    {
      selector: "gap-sign",
      label: "Gap sign (colour)",
      explanation:
        "The line and dot switch colour when actual falls below target — a miss. Sign is already encoded by whether the dot sits above or below the tick, but the colour flip makes the polarity survive on a short gap that might otherwise read as on plan. Sign is the first thing a reader should see.",
    },
    {
      selector: "category-axis",
      label: "Category axis",
      explanation:
        "Discrete categories along the bottom — regions, products, teams. The axis is unordered in the arithmetic sense; sort the categories by signed gap, by absolute gap, or by a stable business order. Alphabetical order is a reasonable default only when the reader needs to look up a specific row.",
    },
    {
      selector: "value-axis",
      label: "Value axis",
      explanation:
        "The quantity axis on the left, carrying the unit of both actual and target. Starting at zero is honest here because the target tick is meaningful only against the absolute value level — a broken baseline would make a $1M miss and a $10M miss look the same.",
    },
  ],
};
