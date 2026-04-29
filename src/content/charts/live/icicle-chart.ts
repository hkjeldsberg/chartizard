import type { LiveChart } from "@/content/chart-schema";

export const icicleChart: LiveChart = {
  id: "icicle-chart",
  name: "Icicle Chart",
  family: "hierarchy",
  sectors: ["hierarchical"],
  dataShapes: ["hierarchical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A flame graph turned upside down — each level of a hierarchy is a row, and width along each row encodes the summed value at that node.",
  whenToUse:
    "Reach for an icicle chart when you want to navigate a tree from the root down. It's the default shape for CPU and memory profilers, file-system views, and any data where the question is 'what lives inside this?'. A flame graph (bottom-up) is better when the question is 'where is time going?' — same rectangles, different reading order.",
  howToRead:
    "Depth grows downward. The top row is the root; each child row tiles its parent's width in proportion to its own summed value, so a row's widths always sum to their parent's width. Wide-and-shallow means a broad, cheap function; narrow-and-deep means a focused call chain. A hot path shows up as a wide rectangle that keeps being wide in the row below — a thick stem driving down through the diagram.",
  example: {
    title: "CPU profile of one page render — 100 ms broken down by call stack",
    description:
      "Four rows for four levels of the stack. `renderPage` takes 60% of the render, and inside it `LiveChartView` eats most of that, and inside THAT a single call to `Visx.render` is 30% of the whole page. The 'thick stem' down the left of the chart is the hot path — that's the shape a flame graph was designed to show, and an icicle chart shows it with the same economy while reading like a file tree.",
  },
  elements: [
    {
      selector: "root",
      label: "Root row",
      explanation:
        "The top row is the whole profile — 100ms of render time, one solid bar. Every row beneath is a decomposition of this total, so it's the reference length every comparison is made against.",
    },
    {
      selector: "branch",
      label: "Branch",
      explanation:
        "A mid-level node — here, `renderPage` — with children below it. Its width is the sum of its children's widths, so branches carry aggregate cost. The rows beneath it are only allowed to tile the extent this branch has claimed.",
    },
    {
      selector: "leaf",
      label: "Leaf",
      explanation:
        "A node with no children in the deepest row shown. `Visx.render` is a leaf here. Leaf width is the actual time spent in that frame alone, not counting anything called from it — which is why leaves matter when you're hunting the function to optimise.",
    },
    {
      selector: "depth-axis",
      label: "Depth axis",
      explanation:
        "Vertical position encodes depth in the call stack, not time. Each row down is one more function frame from the root. This is the convention the chart's name borrows — icicles hang downward, stacks grow downward, and the diagram matches the metaphor.",
    },
    {
      selector: "width-encoding",
      label: "Width encoding",
      explanation:
        "Width is the only quantitative channel. Twice the width means twice the value — milliseconds, megabytes, dollars, whatever the sum field represents. Position along the row is arbitrary and carries no meaning; only how far a rectangle spans does.",
    },
    {
      selector: "hot-path",
      label: "Hot path",
      explanation:
        "A rectangle that is wide at its level AND sits beneath another wide rectangle is the chart's headline shape — a hot path. `Visx.render` is the clearest one here: it's 30ms of a 40ms `LiveChartView` inside a 60ms `renderPage`, a straight column of width running from row one to row three.",
    },
  ],
};
