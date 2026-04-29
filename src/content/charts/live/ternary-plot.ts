import type { LiveChart } from "@/content/chart-schema";

export const ternaryPlot: LiveChart = {
  id: "ternary-plot",
  name: "Ternary Plot",
  family: "composition",
  sectors: ["chemistry", "earth-sciences"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Three components that sum to one, plotted as a point inside an equilateral triangle. The canonical chart for compositions where the parts lock together — soil texture, rock classification, alloy phases.",
  whenToUse:
    "Use a ternary plot when you have three continuous parts that must sum to a constant (usually 100% or 1) and you want to read them together rather than three separate bars. It is the right chart for soil-texture classes, igneous-rock QAP classification, ink mixtures, or alloy phase behaviour. It is the wrong chart once you have four components — vertices of a tetrahedron do not read in two dimensions.",
  howToRead:
    "Each vertex is a pure-component extreme: the SAND vertex is 100% sand, 0% silt, 0% clay. A point's share of any component is its distance from the opposite edge, scaled from 0 at that edge to 1 at the vertex. The three gridlines parallel to each edge mark the 25/50/75 percent isolines — you read a point by noting which isoline it sits on for each component. Points huddled at the centre are balanced mixtures; points hugging a vertex are dominated by that component; points hugging an edge have almost none of the opposite component.",
  example: {
    title: "USDA soil texture triangle",
    description:
      "The USDA soil texture triangle classifies every soil sample by its sand / silt / clay percentages into twelve named classes — Loam sits in the balanced middle, Clay crowds one vertex, Sand crowds another. The same geometry reappears as the QAP diagram for quartz-alkali-plagioclase in igneous petrology and as ternary phase diagrams for binary-plus alloys. Three axes that add to 100% are more teachable as vertices of a triangle than as three separate bars: the triangle makes the sum-constraint visible.",
  },
  elements: [
    {
      selector: "vertex-label",
      label: "Vertex",
      explanation:
        "Each vertex is a pure-component extreme — 100% of the labelled component, 0% of the other two. The three vertex labels are the only categorical information on the chart; everything inside the triangle is a continuous mixture.",
    },
    {
      selector: "loam-point",
      label: "Balanced sample",
      explanation:
        "A point near the centre of the triangle holds roughly equal shares of all three components. In the USDA scheme this neighbourhood is the Loam class — the texture most crops prefer. On any ternary plot, the centre is where no single component dominates.",
    },
    {
      selector: "percent-isoline",
      label: "Percent isoline",
      explanation:
        "The gridlines parallel to each edge mark constant shares of one component: the line parallel to the SAND-SILT edge is the 50% clay isoline, every point on it has exactly half clay. Without these isolines a ternary plot is unreadable — they turn the triangle from a shape into a graph.",
    },
    {
      selector: "corner-outlier",
      label: "Corner outlier",
      explanation:
        "A point that hugs a vertex is dominated by that component. Corner outliers carry the sum-constraint message loudest — as one component climbs toward 1, the other two are forced toward 0.",
    },
    {
      selector: "triangle-boundary",
      label: "Triangle boundary",
      explanation:
        "The outer edges are the zero-lines: the SAND-SILT edge has zero clay, and so on. A point cannot sit outside the triangle because its three components cannot be negative or exceed 1 while still summing to 1 — the triangle is the entire universe of valid compositions.",
    },
  ],
};
