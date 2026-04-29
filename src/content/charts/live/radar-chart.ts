import type { LiveChart } from "@/content/chart-schema";

export const radarChart: LiveChart = {
  id: "radar-chart",
  name: "Radar / Spider Chart",
  family: "comparison",
  sectors: ["general"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Plots several measurements for one subject on a ring of radial axes, producing a polygon whose silhouette is the comparison.",
  whenToUse:
    "Reach for a radar chart when you want to compare the profile of two or three subjects across the same four-to-eight attributes and the story is shape, not rank. It is strong for ability profiles, capability scorecards, and feature coverage. It is weak for precise magnitude comparison — use a bar chart for that.",
  howToRead:
    "Each spoke is one attribute; distance from the centre is that attribute's score. The closed polygon is the silhouette. Compare two polygons by their overall shape — is one pointy toward a specific axis or bulky and round? Do not compare areas: radar area scales with the square of the values and punishes low scores unfairly. Read the axes, not the fill.",
  example: {
    title: "Thundershock vs Ironhide — RPG ability profiles",
    description:
      "Two fictional characters scored 0-100 on Speed, Attack, Defence, HP, Special, and Evasion. Thundershock's polygon is pointy toward Speed and Special and caves in on Defence and HP. Ironhide's is the mirror: bulky toward Defence and HP, pinched on Speed and Evasion. The two silhouettes are immediately distinguishable — one is a sharp kite, the other a squat shield — and that shape difference is the read, not the polygon areas.",
  },
  elements: [
    {
      selector: "axis",
      label: "Axis",
      explanation:
        "One of the six radial spokes. Each axis measures one attribute on a 0-to-100 scale, with zero at the centre and 100 at the outer ring. The order of axes around the circle changes the shape of the polygon — choose an order that groups related attributes next to each other.",
    },
    {
      selector: "polygon",
      label: "Polygon",
      explanation:
        "The closed shape formed by connecting one subject's six vertex values. Thundershock's polygon is pointy and asymmetric, stretched toward Speed and Special; Ironhide's is bulky and tilted toward Defence and HP. Silhouette is the comparison — resist the urge to read area.",
    },
    {
      selector: "vertex",
      label: "Vertex",
      explanation:
        "A single subject's score on a single axis, drawn as a dot at the polygon corner. The Thundershock vertex on Speed sits near the outer ring (95), which is what gives the polygon its upward point.",
    },
    {
      selector: "tick-ring",
      label: "Tick ring",
      explanation:
        "A concentric reference ring at 25, 50, 75, and 100. The rings let the eye estimate a vertex's value without tracing back to the centre. Four rings is the sweet spot — fewer is vague, more is noise.",
    },
    {
      selector: "legend-item",
      label: "Legend item",
      explanation:
        "Matches each polygon to the subject it represents. Because both polygons overlap in the same ring, the legend is what keeps the two silhouettes distinguishable. Reinforce it with line weight or dash pattern so the chart does not rely on colour alone.",
    },
  ],
};
