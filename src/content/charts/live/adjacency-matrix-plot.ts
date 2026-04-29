import type { LiveChart } from "@/content/chart-schema";

export const adjacencyMatrixPlot: LiveChart = {
  id: "adjacency-matrix-plot",
  name: "Adjacency Matrix",
  family: "relationship",
  sectors: ["networks"],
  dataShapes: ["network"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A square grid where filled cells mark the edges of a graph — the storage form of every network.",
  whenToUse:
    "Reach for an adjacency matrix when a node-link diagram turns into a hairball. Matrices scale past a few hundred nodes without occlusion, and they expose cluster structure the instant you re-order rows and columns to match it.",
  howToRead:
    "Each row and each column is a node; a filled cell at (row i, col j) means an edge between i and j. For an undirected graph the matrix is symmetric across the diagonal, and the diagonal itself is blank because nodes don't connect to themselves. The payoff is in the ordering: sort rows and columns so that connected nodes sit next to each other and dense sub-matrices — the clusters — appear as dark square blocks. The rare cells far off the diagonal are the bridge edges that stitch one cluster to another.",
  example: {
    title: "A 12-person friendship network, reordered by community",
    description:
      "Jacques Bertin, in Sémiologie graphique (1967), argued that the value of a matrix lies in its reorderability — the same 12 nodes drawn as a node-link graph look like tangled spaghetti, but ordered by community the matrix shows three clean blocks on the diagonal plus a handful of scattered bridges. The storage was always there; the chart just made it visible.",
  },
  elements: [
    {
      selector: "cell",
      label: "Cell",
      explanation:
        "A single filled square at (row i, column j) marks one edge between node i and node j. For an undirected graph the cell at (j, i) is filled as well — the matrix is a mirror across the diagonal.",
    },
    {
      selector: "diagonal",
      label: "Diagonal",
      explanation:
        "The line from the top-left to the bottom-right cell represents each node against itself. It is blank by convention: a standard graph has no self-loops, and keeping the diagonal empty preserves that rule visually.",
    },
    {
      selector: "cluster-block",
      label: "Cluster block",
      explanation:
        "A dense square patch on the diagonal is a community — a group of nodes heavily connected to one another. Blocks only appear when you order rows and columns by community membership; in the wrong order the same edges scatter across the grid and the structure disappears.",
    },
    {
      selector: "bridge-edge",
      label: "Bridge edge",
      explanation:
        "A filled cell far from any block is an edge that crosses between two communities. Bridges are the rare links that hold the network together; in a node-link diagram they are hidden behind the tangle, here they stand alone.",
    },
    {
      selector: "row-labels",
      label: "Row labels",
      explanation:
        "Each row corresponds to one node. The order of the labels is not cosmetic — it is the chart's most important design choice. Re-ordering rows (and the columns in the same order) turns a noisy grid into one with visible blocks.",
    },
    {
      selector: "column-labels",
      label: "Column labels",
      explanation:
        "Columns carry the same node set as the rows, in the same order. This symmetry is what lets a filled cell at (i, j) be read identically as 'i connects to j' or 'j connects to i'.",
    },
  ],
};
