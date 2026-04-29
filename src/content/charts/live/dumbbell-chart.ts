import type { LiveChart } from "@/content/chart-schema";

export const dumbbellChart: LiveChart = {
  id: "dumbbell-chart",
  name: "Dumbbell Chart",
  family: "comparison",
  sectors: ["general"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Two dots joined by a bar — one row per category, encoding a pairwise gap's direction and magnitude at a glance.",
  whenToUse:
    "Reach for a dumbbell when every category carries two comparable values and the gap between them is the story. A grouped bar chart shows the same two numbers but forces the reader to mentally subtract; the dumbbell does the subtraction visually. Sort the rows by gap and the ranking of differences reads top-down.",
  howToRead:
    "Each row is one category. The two dots mark the two absolute values; the bar between them is the gap. Dot colour identifies which value is which, and the bar's length — not its position — is what the chart is really about. Rows are sorted by gap, so the widest bars sit at the top.",
  example: {
    title: "US median salary by industry, male vs female — 2024 approximation",
    description:
      "Across ten industries, Legal shows the widest gap at $35k (male median $140k, female $105k), followed by Finance at $30k. Education nearly closes it at $3k. A grouped bar chart would leave the reader eyeballing bar-height differences; the dumbbell draws each gap as a single bar whose length is the subtraction the reader wanted to do.",
  },
  elements: [
    {
      selector: "left-dot",
      label: "Left dot (female median)",
      explanation:
        "The lower of the two values in the pair, by convention on the left. Its x-position is the absolute value, not a relative one — the chart still works as a two-point strip plot if you ignore the connecting bar.",
    },
    {
      selector: "right-dot",
      label: "Right dot (male median)",
      explanation:
        "The higher of the two values. Colour separates the two series and the legend labels them directly, so the chart is readable in greyscale and for colour-blind viewers.",
    },
    {
      selector: "connecting-bar",
      label: "Connecting bar",
      explanation:
        "The bar's length encodes the pairwise gap; its direction points from the lower value to the higher. Unlike a grouped bar chart, the gap itself is a mark on the page, not a subtraction the reader performs.",
    },
    {
      selector: "gap",
      label: "Gap (labelled)",
      explanation:
        "The numeric gap printed at the right end of each row. Direct labels free the reader from reading both dot positions off the axis; keep them when the gap is the headline, drop them when a clean ranking suffices.",
    },
    {
      selector: "category-axis",
      label: "Category axis",
      explanation:
        "Industries sit on the y-axis. Rows are sorted by gap, descending — the ranking of differences reads top-down without any axis trickery. Alphabetical order would waste the chart's strongest signal.",
    },
    {
      selector: "value-axis",
      label: "Value axis",
      explanation:
        "Median salary in thousands of dollars, running along the bottom. The shared scale is what lets dot positions be compared across rows; without a zero baseline, the rank of absolute values — not just gaps — is still readable.",
    },
  ],
};
