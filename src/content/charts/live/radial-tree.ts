import type { LiveChart } from "@/content/chart-schema";

export const radialTree: LiveChart = {
  id: "radial-tree",
  name: "Radial Tree",
  family: "hierarchy",
  sectors: ["hierarchical"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",

  synopsis:
    "Projects a rooted tree onto polar coordinates — root at centre, children radiating outward — so the hierarchy occupies a circular canvas instead of a rectangular strip.",

  whenToUse:
    "Use a radial tree when the hierarchy is the message and you want to fit more leaves on the available canvas than a rectangular dendrogram allows. Circumference scales linearly with radius, so each successive depth level has proportionally more arc to distribute its children. Avoid it when you need to compare node depths precisely — angular crowding near the root compresses horizontal distance cues that a linear layout preserves.",

  howToRead:
    "Start at the centre dot: that is the root. Follow any spoke outward through internal nodes (solid dots) until you reach a labelled leaf at the circumference. Each edge encodes a parent–child relationship, not a distance. All nodes at the same depth level lie on the same arc. Labels rotate to read outward, so text on the left half is flipped 180° to avoid upside-down reading.",

  example: {
    title: "A software project's directory tree",
    description:
      "Mapping project/ with three depths — root, first-level directories and config files, then source subdirectories and leaf files — into a radial layout shows at a glance that src/ is the most branching node and that tsconfig.json, README.md, and package.json are shallow singletons. The same data as a vertical rectangular tree would require a canvas twice as tall to space the 25-node leaf level legibly.",
  },

  elements: [
    {
      selector: "root-node",
      label: "Root node",
      explanation:
        "The central dot is the tree's root — project/ in this layout. d3-hierarchy.cluster().size([2π, radius]) places the root at angle 0 and radius 0, which maps to the canvas centre regardless of the polar-to-cartesian rotation applied. Every other node's position derives from this single anchor point.",
    },
    {
      selector: "level-1-node",
      label: "Level-1 node",
      explanation:
        "First-level children (src/, tests/, docs/, and the config files) are distributed evenly across 2π radians. The cluster layout assigns equal angular weight to each subtree, so src/ — which has 6 children — occupies a wider arc than package.json, a leaf at the same depth. This angular disproportion is the layout's main information: wide sectors indicate deep or wide subtrees.",
    },
    {
      selector: "leaf-label",
      label: "Leaf label",
      explanation:
        "Leaves sit at the outermost radius and are labelled radially — the text rotates to point outward from the centre. On the left half of the circle, labels are flipped 180° so they remain readable. This rotation convention originates with the d3-hierarchy example gallery (Bostock, 2011) and is standard in radial tree implementations since D3 v2.",
    },
    {
      selector: "radial-edge",
      label: "Edge",
      explanation:
        "Each straight line connects a parent node to one child. The radial tree uses straight Euclidean edges; a curved variant (arc-then-radial, as in the tree-of-life-radial-phylogeny chart) uses an arc at the parent radius to show common ancestry more explicitly. For a file-system hierarchy — where depth is uniform and ancestry is unambiguous — straight lines reduce visual noise.",
    },
    {
      selector: "angular-distribution",
      label: "2π angular span",
      explanation:
        "All leaves are distributed across a full 360° sweep. Tamara Munzner's Visualization Analysis and Design (2014, ch. 12) identifies this as the key advantage of radial trees over rectangular dendrograms: the circumference available to leaves grows with radius, so a 4-level tree with 20 leaves can display at a quarter the vertical height of its rectangular counterpart. The tradeoff is that angular positions are harder to compare than Cartesian x-positions.",
    },
    {
      selector: "subtree",
      label: "Subtree (src/ → components/)",
      explanation:
        "The path from project/ through src/ to components/ and its three leaf files (Header.tsx, Footer.tsx, Nav.tsx) is a depth-3 subtree. In the cluster layout the radial gap between each depth ring is equal regardless of the data — it is a topological, not a metric, layout. Contrast with a phylogram (tree-of-life-radial-phylogeny), which uses branch-length data to scale the radial axis.",
    },
  ],
};
