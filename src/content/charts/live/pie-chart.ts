import type { LiveChart } from "@/content/chart-schema";

export const pieChart: LiveChart = {
  id: "pie-chart",
  name: "Pie Chart",
  family: "composition",
  sectors: ["general", "business", "marketing", "infographics"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A circle divided into slices proportional to the parts of a whole.",
  whenToUse:
    "Use a pie when you need to show a single snapshot of proportions and you have three to five categories with clearly different sizes. If you have more than seven slices, or need to compare multiple wholes, a bar chart will nearly always read faster.",
  howToRead:
    "Read slices as angles, not areas or arcs. Humans judge angles poorly past 90°, which is why a 3-slice pie with one obvious majority works and a 9-slice pie doesn't. Start the biggest slice at 12 o'clock and sweep clockwise — the eye expects this and will accept the order as meaningful. A percentage label on each slice rescues precision; without it, a pie is a vibe.",
  example: {
    title: "Revenue split by customer segment — Annual Report 2024",
    description:
      "A mid-market B2B company reports its customer mix in its annual report: a pie with three slices — Enterprise 62%, Mid-market 27%, SMB 11%. A stacked bar would be more precise; the pie won because the company wanted the reader to feel the dominance of the 62% at a single glance. That's what pies are for.",
  },
  elements: [
    {
      selector: "slice",
      label: "Slice",
      explanation:
        "One category's share of the whole, encoded as its sweep angle (360° = 100%). A 90° slice is 25%, a 180° slice is 50%. Readers judge angles better when the slice sits adjacent to the 12 o'clock line.",
    },
    {
      selector: "slice-label",
      label: "Slice label",
      explanation:
        "Percentage or value printed inside or next to the slice. Without it, viewers can read 'biggest/smallest' but not actual shares. Label every slice that's asked to carry meaning.",
    },
    {
      selector: "legend-item",
      label: "Legend item",
      explanation:
        "Maps slice colour to category name. Prefer labels placed directly next to the slice over a detached legend when space allows — it removes an eye-trip.",
    },
    {
      selector: "centre",
      label: "Centre",
      explanation:
        "Traditionally empty in a pie, filled with a headline in a donut chart variant. Use the centre to display the grand total or the unit — 'Total: $4.8M' turns a pie into a small dashboard.",
    },
  ],
};
