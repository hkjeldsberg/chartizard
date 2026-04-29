import type { LiveChart } from "@/content/chart-schema";

export const sankeyDiagram: LiveChart = {
  id: "sankey-diagram",
  name: "Sankey Diagram",
  family: "flow",
  sectors: ["flow", "business"],
  dataShapes: ["network"],
  tileSize: "W",
  status: "live",
  synopsis:
    "Ribbons between nodes whose width encodes a flow value, so you can trace a single quantity from origin to destination.",
  whenToUse:
    "Use a Sankey when flows share a unit — energy, money, people, bytes — and the reader needs to see both how much moves and where it goes. It rewards a hierarchy of stages (sources on the left, sinks on the right) and punishes many-to-many graphs that have no clear direction.",
  howToRead:
    "Ribbon widths are everything. Pick a source node on the left, follow its ribbons rightward with your eye, and watch how they subdivide or converge on the sinks. Each node's height is the sum of the ribbons entering or leaving it, so conservation is built in: a wide band cannot disappear, it can only split, merge, or be absorbed by a sink. The ribbon colour usually carries no information; the band's thickness is what you are reading.",
  example: {
    title: "US primary energy flow, 2023",
    description:
      "Petroleum, natural gas, coal, nuclear, and renewables feed four consuming sectors plus a loss sink labelled 'Electric loss'. Two things jump out. First, almost the whole petroleum ribbon lands on transportation — there is effectively no other car-fuel alternative in the grid. Second, the electric-loss sink eats roughly two-thirds of the coal and nuclear ribbons and a large share of natural gas; that band is the thermal-plant inefficiency that a source-only chart would hide.",
  },
  elements: [
    {
      selector: "source-node",
      label: "Source node (Petroleum)",
      explanation:
        "A node on the left edge is an origin. Its height is its total outflow in the shared unit. Pick one and follow it rightward — petroleum spills almost entirely into the transportation sink, which is the single largest flow in the diagram.",
    },
    {
      selector: "flow",
      label: "Flow ribbon",
      explanation:
        "One ribbon is one source-to-sink pairing. Its width is the flow value; its path is purely cosmetic. The petroleum-to-transportation ribbon is the thickest single band on the canvas — that is a reading about the economy, not about the layout.",
    },
    {
      selector: "ribbon-width",
      label: "Ribbon width",
      explanation:
        "Width is the only channel that carries data. Two ribbons that look the same thickness represent the same flow, regardless of which colour they are drawn in or which direction they curve. If widths are not comparable, a Sankey is the wrong chart.",
    },
    {
      selector: "sink-node",
      label: "Sink node (Transportation)",
      explanation:
        "A node on the right edge is a destination. Its height is its total inflow. Transportation is almost entirely a petroleum sink, so the node is nearly monochrome when you trace its incoming bands back to their sources.",
    },
    {
      selector: "node-value",
      label: "Node value",
      explanation:
        "Each node is labelled with its total flow. Because the layout enforces conservation, a node's height relative to its neighbour is already a visual version of this number — the label is for readers who need the exact quantity, not the comparison.",
    },
    {
      selector: "conversion-loss",
      label: "Conversion loss",
      explanation:
        "The 'Electric loss' sink is drawn as a node like any other, but its existence is the chart's point. Roughly two-thirds of the energy that enters a thermal power plant leaves as waste heat, and a Sankey makes that loss visible as a ribbon instead of an asterisk in a caption.",
    },
  ],
};
