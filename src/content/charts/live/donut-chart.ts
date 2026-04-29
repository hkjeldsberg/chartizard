import type { LiveChart } from "@/content/chart-schema";

export const donutChart: LiveChart = {
  id: "donut-chart",
  name: "Donut Chart",
  family: "composition",
  sectors: ["general"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A pie chart with the centre punched out, freeing the middle for a whole-number anchor the slices are proportions of.",
  whenToUse:
    "Use a donut when you have three to six parts of one whole and you want the total itself to be a first-class label, not a footnote. If the total has no editorial weight, a plain pie or a stacked bar is simpler; if you have more than seven slices, switch to a bar chart.",
  howToRead:
    "Each arc's sweep encodes its share of the total. Read the ring clockwise from 12 o'clock; sort by size so the eye can rank slices without counting ticks. The centre holds the number everything else is a fraction of — look there first, then outward to see how the total decomposes.",
  example: {
    title: "World electricity generation mix, 2024",
    description:
      "Global power output totalled roughly 28,400 TWh in 2024. Coal still supplied about 36 percent, natural gas 23 percent, and hydro 15 percent; wind plus solar together reached 14 percent, with nuclear at 10 percent and oil a residual 3 percent. Rendering the mix as a donut puts the 28,400 TWh total in the middle — the slices are only meaningful as fractions of that figure, so placing it in the hole collapses two readings into one glance.",
  },
  elements: [
    {
      selector: "slice",
      label: "Slice",
      explanation:
        "Each arc's angular sweep equals its share of the total. Sort slices largest-to-smallest starting at 12 o'clock; readers compare angles clockwise and give up if the order is random.",
    },
    {
      selector: "slice-label",
      label: "Slice label",
      explanation:
        "Percentages inside the ring let readers skip the legend for the big slices. Drop the label when a slice is too thin to hold its own text and defer to the legend instead.",
    },
    {
      selector: "centre",
      label: "Centre total",
      explanation:
        "The donut's structural advantage over a pie. Put the whole-number context in the hole so the reader never has to ask what the percentages are percentages of.",
    },
    {
      selector: "ring",
      label: "The ring",
      explanation:
        "The hollow band carries all the data; the empty centre is editorial space. Keep the ring thickness around one-third of the outer radius so arcs stay readable without the hole shrinking to a dot.",
    },
    {
      selector: "legend-item",
      label: "Legend item",
      explanation:
        "Pairs each colour with a category name. Order the legend to match the slice order on the ring — the reader's eye travels between them many times and any mismatch taxes every comparison.",
    },
  ],
};
