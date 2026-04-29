import type { LiveChart } from "@/content/chart-schema";

export const polarAreaDiagram: LiveChart = {
  id: "polar-area-diagram",
  name: "Polar Area Diagram",
  family: "composition",
  sectors: ["general"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A bar chart with the bars bent into equal-angle wedges — the radius carries the value, the arc is purely decorative.",
  whenToUse:
    "Use a polar-area diagram when the categorical comparison is the subject but the chart needs to feel like a single composed object — a dashboard tile, a printed field report, a ceremonial figure. Skip it when precise length comparisons matter; the eye reads bent bars less accurately than straight ones.",
  howToRead:
    "Every wedge owns the same slice of angle, so angle carries no information — it's a label slot, nothing more. Read the radius of each wedge against the concentric rings to recover the value. Rank the categories by how far each wedge reaches; that ranking is all the chart can tell you reliably.",
  example: {
    title: "Weekly time-budget for a knowledge-worker — 168 hours across 8 activities",
    description:
      "A polar-area diagram is a Nightingale chart with a point to make subtracted. Nightingale stacked causes of death inside each monthly wedge to argue that one cause dominated; a modern time-budget polar-area keeps the ring of categories but drops the stack, because there's nothing being argued — only the day's shape being shown. The chart trades precision for a recognisable silhouette, which is a fair trade for a tile but a poor one for a report.",
  },
  elements: [
    {
      selector: "wedge",
      label: "Wedge",
      explanation:
        "One category, drawn from the hub outward. Its radius is the value; its angular width is fixed and identical to every other wedge's. Comparing two wedges means comparing their radii — don't be fooled by the perceived area, which scales as the square of the radius and exaggerates differences.",
    },
    {
      selector: "angular-axis",
      label: "Angular axis",
      explanation:
        "Equal-angle spokes divide the circle into as many slices as there are categories. Because every slice is the same width, the angle encodes nothing — it's ornamentation. If you ever see unequal angles on a polar-area chart, you're looking at a Nightingale, not a polar-area.",
    },
    {
      selector: "radius-scale",
      label: "Radius scale",
      explanation:
        "Concentric rings mark value levels. The rings are the only quantitative scale on the chart; without them, a polar-area is a logo, not a plot. Keep the ring labels on one spoke so the eye treats them as a ruler.",
    },
    {
      selector: "category-label",
      label: "Category label",
      explanation:
        "Each wedge needs a name attached at its outer edge — colour or position alone won't do, because polar layouts obscure the ordering a list would give you. A wedge with no label is a shape, not a measurement.",
    },
    {
      selector: "hub",
      label: "Hub (zero)",
      explanation:
        "Every wedge starts at the hub, so the hub is the common baseline — it is the chart's zero. A polar-area with a non-zero hub (a 'doughnut polar-area') breaks the radius-to-value mapping and should be avoided.",
    },
  ],
};
