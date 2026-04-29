import type { LiveChart } from "@/content/chart-schema";

export const circlePacking: LiveChart = {
  id: "circle-packing",
  name: "Circle Packing",
  family: "composition",
  sectors: ["hierarchical"],
  dataShapes: ["hierarchical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Nested circles where each child sits inside its parent and siblings pack against one another — a treemap drawn in curves.",
  whenToUse:
    "Reach for circle packing when the hierarchy matters more than the comparison. Containment reads as parent-child at a glance, which is why it wins for 'what is inside what' questions: disk usage by folder, budgets by department, taxonomies of species. Treemaps pack values tighter into the same rectangle, so prefer a treemap when the viewer needs to compare leaf sizes with care.",
  howToRead:
    "Radius encodes value — a circle with twice the area holds twice the quantity. A child circle sits fully inside its parent, so moving inward walks down the tree and any cluster of circles inside one ring is one branch of the hierarchy. Siblings nudge against each other in a dense, roughly-circular pack; the remaining whitespace between them is the cost of using circles instead of rectangles. Ignore orientation, read the rings.",
  example: {
    title: "node_modules for one Next.js project, by package size",
    description:
      "All 360 MB of a representative install rendered as one outer circle. The largest inner rings are `tailwindcss`, `typescript`, and `next`; inside `next`, `swc` alone is a third of the package. The chart makes the 'where is the weight' question answer itself — a single leaf the size of most of its parents explains the install time better than any table of byte counts.",
  },
  elements: [
    {
      selector: "root-circle",
      label: "Root circle",
      explanation:
        "The outermost ring is the whole tree. Every other circle in the chart is inside this one, so it's the visual stand-in for the root total. We draw it as a dashed outline so it reads as a bound, not a mark.",
    },
    {
      selector: "parent-circle",
      label: "Parent circle",
      explanation:
        "One top-level package — here, `next`. Its radius encodes the sum of its children, not its own direct weight. Parent circles are drawn lighter than leaves so the eye treats them as containers, not rival data points.",
    },
    {
      selector: "leaf-circle",
      label: "Leaf circle",
      explanation:
        "A leaf is a sub-package with no further children. Its radius is the actual megabytes on disk. Leaves carry the full tint because they're where the quantitative encoding terminates — everything outward is an aggregate of leaves like this.",
    },
    {
      selector: "nesting",
      label: "Nesting",
      explanation:
        "Inside means child-of. A circle fully contained by another is a descendant of it, period — there is no second meaning for position. That single rule is what lets circle packing show a three-level hierarchy without any lines, labels, or indentation.",
    },
    {
      selector: "packing",
      label: "Packing",
      explanation:
        "Siblings pack tight against each other using a front-chain algorithm that places each new circle in the gap where it fits best. The resulting arrangement is compact but never as space-efficient as a treemap's rectangles — the whitespace between circles is the price of the curved form.",
    },
    {
      selector: "size",
      label: "Size",
      explanation:
        "Radius — not diameter, not area on-screen — is what the human eye actually reads here, and humans read circular area poorly. A leaf that looks 'small' can still be a non-trivial share; trust the packing to show which leaves are the outliers, not your estimate of any single radius.",
    },
  ],
};
