import type { LiveChart } from "@/content/chart-schema";

export const flameGraph: LiveChart = {
  id: "flame-graph",
  name: "Flame Graph",
  family: "specialty",
  sectors: ["software"],
  dataShapes: ["hierarchical"],
  tileSize: "W",
  status: "live",
  synopsis:
    "Brendan Gregg's 2011 answer to 'where is time spent?' — stacked frames, width is sampled time, the widest rectangle is the bottleneck.",
  whenToUse:
    "Reach for a flame graph when you have sampled profile data and you want to find the bottleneck by eye. It is the default shape for CPU profiling, allocation profiling, and any 'where does the time go?' question whose answer is a call stack. Prefer an icicle chart (Batch 3, same layout flipped upside-down) when the question is 'what lives inside this?' — hierarchical composition rather than call-stack time. Before flame graphs, profiler output was a text tree of percentages; Brendan Gregg's contribution was making the widest rectangle obvious at a glance.",
  howToRead:
    "The x-axis is the proportion of sampled CPU time. The y-axis is call-stack depth, with the root frame at the BOTTOM of the chart and children stacked upward — this is the orientation that gives the chart its name, and the single convention that distinguishes it from an icicle chart. Each rectangle's width is how much sampled time the frame occupied; height is fixed per row. Colour is a warm random-ish palette hashed from the function name — it separates adjacent stacks visually but carries no semantic meaning. Ignore height, ignore colour, trust width: the widest rectangle at any depth is where the profiler found the program living. The widest leaf near the top of the diagram is the bottleneck.",
  example: {
    title:
      "Synthetic request profile — socketRead() is 35% of CPU time",
    description:
      "Brendan Gregg invented the flame graph at Joyent in 2011 and shipped it as an open-source Perl tool the same year; he went on to popularise it further at Netflix and is now at Intel. The essay 'Flame Graphs' (2011) and the ACM Queue paper 'The Flame Graph' (2016) are the canonical references, and Gregg is also the author of the differential flame graph (red = got slower, blue = got faster) which is the standard shape for before/after performance comparisons. This example is a stock web-request profile: main() fans out into handleRequest() at 70% and a backgroundJob() at 30%; inside handleRequest(), queryDB() eats 50%; inside queryDB() a single socketRead() at 35% is the widest leaf in the whole chart. A staff engineer would read this graph in ten seconds and spend the next hour on the database driver's I/O path.",
  },
  elements: [
    {
      selector: "root-frame",
      label: "Root frame",
      explanation:
        "The bottom row is the root of every captured stack — here, main(). It spans the entire x-axis because every sample was somewhere inside it. Every rectangle above it is a decomposition of this total, which is why the root bar is the reference length every width comparison is made against.",
    },
    {
      selector: "child-frame",
      label: "Child frame",
      explanation:
        "A rectangle directly above its parent is a function the parent called, with width equal to how much sampled CPU time the call took. Children above the same parent always tile that parent's width — their widths sum to the parent's width exactly, because profiler samples land in exactly one frame at each depth. Gaps above a parent mean the parent spent that portion of its time in its own code, not in a callee.",
    },
    {
      selector: "hot-path",
      label: "Hot path",
      explanation:
        "The widest rectangle near the top of the chart is the bottleneck — a single leaf function that accounts for a large fraction of total CPU time. In this example socketRead() at 35% is the hot path: the profiler spent more than a third of every request sitting in one database-driver read. Flame graphs were invented to make this shape impossible to miss; before them the same information lived in text output that hid the bottleneck behind a tree of percentages.",
    },
    {
      selector: "x-axis",
      label: "X-axis (proportion of CPU)",
      explanation:
        "The x-axis is the proportion of total sampled CPU time from 0% to 100%. Absolute time in seconds is not drawn — the chart is about the shape of where time goes, not the total. Two flame graphs with the same shape but different totals tell the same optimisation story; two with different shapes but the same total do not.",
    },
    {
      selector: "depth-axis",
      label: "Call-stack depth axis",
      explanation:
        "The y-axis is call-stack depth, with zero at the bottom and each row one frame deeper. Unlike the x-axis, depth is categorical — row four is not 'twice as much' as row two, it is simply two frames further into the call stack. A tall-and-narrow shape is a focused call chain; a short-and-wide shape is a program whose work lives near the root.",
    },
    {
      selector: "narrow-leaf",
      label: "Narrow leaf",
      explanation:
        "A thin rectangle at any depth is a function the profiler found quickly — here, parseJSON() at about 5%. Narrow leaves are not a problem to fix. They are the chart's negative space: they let the eye pick out the wide leaves that are. Most of any real flame graph is narrow rectangles.",
    },
    {
      selector: "root-at-bottom",
      label: "Root-at-bottom convention",
      explanation:
        "Root at the bottom is the convention that names the chart — flames grow upward from the base. An icicle chart (already in this catalogue) uses the same geometry with the root at the TOP, because icicles hang downward. Gregg chose the upward orientation deliberately: a flame that narrows as it rises matches the intuition that deep call stacks are focused, not sprawling.",
    },
  ],
};
