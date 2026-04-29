import type { LiveChart } from "@/content/chart-schema";

export const treeChart: LiveChart = {
  id: "tree-chart",
  name: "Tree Chart",
  family: "hierarchy",
  sectors: ["hierarchical"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Draws a parent-child hierarchy as a top-down node-link diagram, emphasising shape of lineage, not quantity.",
  whenToUse:
    "Reach for a tree chart when the structure of a hierarchy is the story — how branches diverge, how deep a lineage runs, which clusters share an ancestor. If you want to encode counts or size, pick a treemap or icicle chart; a tree chart carries no area metric.",
  howToRead:
    "Start at the root and follow the elbows down. Each vertical level is one depth step in the hierarchy, and lines only connect a node to its direct parent. Siblings sit at the same depth and never cross-link. The picture reveals breadth (fan-out at each level) and depth (how many steps to a leaf), and nothing else — gaps in the canvas are not data, they're just layout.",
  example: {
    title: "Genealogy of programming languages, 1950s–1990s",
    description:
      "Root \"Programming Languages\" fans out into five paradigms — Imperative (Fortran, C, Pascal), Functional (Lisp, ML, Haskell), Object-Oriented (Smalltalk, Java, Ruby), Logic (Prolog, Datalog), Scripting (Perl, Python, JavaScript). Depth traces the decade of emergence and the branching structure reveals that Functional and Logic stayed narrow while Object-Oriented and Scripting exploded in the 1980s–90s.",
  },
  elements: [
    {
      selector: "root-node",
      label: "Root node",
      explanation:
        "The single ancestor at the top of the tree. Every other node descends from it along exactly one path. A tree with more than one root is a forest and needs a different layout.",
    },
    {
      selector: "intermediate-node",
      label: "Intermediate node",
      explanation:
        "A node with both a parent and children — here, a paradigm like Functional. Intermediates carry the taxonomy: removing one collapses a whole sub-branch, which is how tree charts telegraph the cost of missing data.",
    },
    {
      selector: "leaf-node",
      label: "Leaf node",
      explanation:
        "A node with no children. Leaves are the terminal observations of the hierarchy — in this chart, individual languages. Count them to size the hierarchy; compare their depths to see which branches are deeper.",
    },
    {
      selector: "link",
      label: "Parent-child link",
      explanation:
        "A right-angle connector from a parent to one of its children. Links only go down one step — a tree chart never draws lateral edges. The elbow shape is conventional; the data is the connection itself, not the path.",
    },
    {
      selector: "depth-axis",
      label: "Depth (vertical position)",
      explanation:
        "Vertical position encodes depth from the root. All nodes at the same y-coordinate share a generation. Here depth doubles as decade of emergence, but in a generic tree the y-axis carries no metric — only ordinal distance from the root.",
    },
    {
      selector: "sibling-ordering",
      label: "Sibling ordering",
      explanation:
        "Siblings are laid out left-to-right to minimise link crossings, not by value. Don't read left-right order as a ranking — swap two siblings and the tree is mathematically identical.",
    },
  ],
};
