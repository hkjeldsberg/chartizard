import type { LiveChart } from "@/content/chart-schema";

export const arcMatrix: LiveChart = {
  id: "arc-matrix",
  name: "Arc / Reorderable Matrix",
  family: "relationship",
  sectors: ["networks"],
  dataShapes: ["network"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Two adjacency matrices of the same graph side by side — one in the raw node order, one reordered by community — so the reader sees the reordering is the analysis.",
  whenToUse:
    "Reach for an arc matrix when the argument you want to make is not \"this graph has edges\" but \"this graph has communities, and the right ordering makes them visible.\" A plain adjacency matrix shows the data; an arc matrix shows the step between data and structure. Use it in teaching material, in methods sections, and anywhere the audience might miss that choosing a row order is a modelling decision and not a cosmetic one.",
  howToRead:
    "Read left to right. The left matrix is the same nodes in whatever the data came in — alphabetical here — and the filled cells look scattered. Apply a community-detection reordering (Louvain, spectral, Bertin's hand permutation from 1967) and the same edges regroup along the diagonal of the right matrix as three dense blocks. Each block is a community: a set of nodes that connect to each other far more than to outsiders. The rare cells that remain off the diagonal in the right matrix are the bridges — the cross-community ties that hold the whole network together.",
  example: {
    title: "A 20-person network reordered by Louvain modularity",
    description:
      "Jacques Bertin spent chapter seven of Sémiologie graphique (1967) arguing that a matrix without permutation is an image without analysis — he reordered matrices by hand at his lab in Paris and called it the most important data-analysis operation a cartographer could learn. Here the same 20-node social network is drawn twice: alphabetically on the left, where ties scatter across the grid, and Louvain-reordered on the right, where the three communities — the science lab, the book club, the climbing gym — appear as three clean diagonal blocks.",
  },
  elements: [
    {
      selector: "scattered-cells",
      label: "Alphabetical (left)",
      explanation:
        "The left matrix uses the raw node order the data happened to arrive in. The edges are the same edges that appear in the right matrix, but because related nodes are not adjacent in the row list, the filled cells scatter across the grid and no structure is visible. A viewer looking only at this matrix would conclude the network had no communities — the wrong conclusion, drawn from a cosmetic choice.",
    },
    {
      selector: "permutation",
      label: "Permutation",
      explanation:
        "The arrow between the two matrices stands for a reordering of rows and columns. Rows and columns must be permuted by the same sequence so the matrix stays symmetric. The permutation can come from a community-detection algorithm — Louvain, Leiden, spectral — or from a hand seriation in the Bertin tradition. The permutation is the analysis; everything to its right is consequence.",
    },
    {
      selector: "community-block",
      label: "Community block",
      explanation:
        "A dense square patch sitting on the diagonal of the right matrix marks a community — a group of nodes heavily tied to each other and sparsely tied to outsiders. The three blocks here, of 7, 6, and 7 nodes, carry roughly the same edges they carried on the left; the only thing that changed is which rows sit next to which.",
    },
    {
      selector: "diagonal",
      label: "Diagonal",
      explanation:
        "The leading diagonal represents each node against itself and is left blank — a standard network has no self-loops. The diagonal serves a second job in a reordered matrix: it is the spine that community blocks sit on, and the visible three-block-on-diagonal pattern is the chart's punchline.",
    },
    {
      selector: "bridge-cell",
      label: "Bridge cell",
      explanation:
        "A filled cell far from the diagonal in the right matrix is an edge that crosses between two communities. Bridges are rare and structurally important: remove them and the network falls into disconnected pieces. In a left-matrix view these cells blended in with the noise; the reordering separates them from the blocks and exposes them individually.",
    },
    {
      selector: "matrix-pair",
      label: "Matrix pair",
      explanation:
        "The two matrices together — not either one alone — are the chart. A lone reordered matrix risks looking like a lucky arrangement; the pair proves that the same data under a different ordering looks structurally different. This before-and-after framing is why Bertin insisted the permutation step be shown, not hidden inside a pipeline.",
    },
  ],
};
