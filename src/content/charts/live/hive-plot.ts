import type { LiveChart } from "@/content/chart-schema";

export const hivePlot: LiveChart = {
  id: "hive-plot",
  name: "Hive Plot",
  family: "relationship",
  sectors: ["networks"],
  dataShapes: ["network"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Replaces the force-directed hairball with a deterministic layout: nodes sit on two or three radial axes and edges arc between them.",
  whenToUse:
    "Reach for a hive plot when nodes carry a category attribute that can serve as an axis — protein / gene / metabolite, attacker / victim / asset, producer / consumer — and you need the layout to be reproducible so two networks can be compared side-by-side. Force-directed layouts reposition every node on every run and make comparison across datasets impossible; the hive plot's fixed axes fix that. Skip it when the network has no categorical partition that would justify its axes.",
  howToRead:
    "Each radial spine is one node category. Position along a spine encodes a secondary attribute — here, connectivity — so a node sitting near the tip is highly connected and a node near the centre is peripheral. Edges between nodes on different axes are drawn as cubic Bezier curves whose control points are pulled toward the origin, so every edge arcs gently through the middle rather than cutting across. Dense bundles of curves between two axes mean the two categories interact heavily; a thin ribbon means they rarely touch.",
  example: {
    title: "A small biological interactome — proteins, genes, metabolites",
    description:
      "Martin Krzywinski introduced the hive plot in 2012 (Briefings in Bioinformatics) precisely because genome-scale interactomes had become unreadable as hairballs — repeat the force-directed layout and you get a different picture each time. A three-axis hive plot assigns proteins, genes, and metabolites each to their own spine; the resulting figure is deterministic enough that the same interactome rendered a year later is visibly the same picture, and two interactomes rendered side-by-side can actually be compared.",
  },
  elements: [
    {
      selector: "axis",
      label: "Radial axis",
      explanation:
        "One spine per node category. All axes share a common origin and fan out at equal angles — 120° apart for three axes, 90° apart for four. The axis is the chart's editorial commitment: changing the partition changes the layout, which is the entire point — it forces the author to decide what the categories are before any pixel is drawn.",
    },
    {
      selector: "centre",
      label: "Common origin",
      explanation:
        "All three axes meet at the centre. Nodes never sit exactly at the origin — a small inner radius is reserved so that edges passing through can arc cleanly rather than collapsing to a point. The origin is the chart's anchor; the deterministic geometry radiates from it.",
    },
    {
      selector: "axis-position",
      label: "Position along axis",
      explanation:
        "A node's distance from the centre encodes its secondary attribute — typically degree, betweenness, or some continuous numeric field. Move a node up the spine and its position says something about the node; move it to a different spine and it is a different kind of thing. The two encodings are orthogonal, which is what gives the hive plot its information density.",
    },
    {
      selector: "node",
      label: "Node",
      explanation:
        "One entity — a single protein, gene, or metabolite — placed on the axis for its category at the radius that encodes its attribute. TP53 sits near the tip of the protein axis because it is the most connected protein in this network; a less-connected protein sits closer to the middle. The node is always on exactly one axis; cross-axis combinations are expressed as edges, not positions.",
    },
    {
      selector: "edge",
      label: "Edge curve",
      explanation:
        "A cubic Bezier curve connecting two nodes on different axes, with control points pulled toward the centre so the curve bows inward. This is the hive plot's visual signature. Edge style can additionally encode the kind of relationship — solid for activation, dashed for inhibition, lighter for binding — which keeps the geometry clean while still carrying a third dimension of data.",
    },
    {
      selector: "axis-label",
      label: "Axis label",
      explanation:
        "The category name anchored at the tip of each axis. Because the hive plot's entire structure depends on which attribute partitions the nodes, the axis labels are the chart's caption — without them the reader has a pretty radial picture and no idea what category they are looking at.",
    },
  ],
};
