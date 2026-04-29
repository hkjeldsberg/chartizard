import type { LiveChart } from "@/content/chart-schema";

export const rugPlot: LiveChart = {
  id: "rug-plot",
  name: "Rug Plot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Draws one short tick per observation directly on the number line — no binning, no stacking, no smoothing.",
  whenToUse:
    "Reach for a rug plot as annotation under a density curve or histogram when you want to prove the smoothing isn't inventing structure, or as a standalone chart for small samples where the axis itself carries enough information. It's the honest minimum: every datum is on the axis, countable, in its raw position.",
  howToRead:
    "Each vertical tick is one observation at its x-value. A dense cluster of overlapping ticks darkens the axis and signals the mode; sparse regions reveal tails and gaps. Because ticks stack on top of each other rather than beside each other, you lose the frequency reading that a dot plot gives you — the compensation is the overlayed density curve, which turns ink darkness back into a height you can compare.",
  example: {
    title: "Exam scores, n = 60, same dataset as the stacked dot plot",
    description:
      "Plotting the same sixty exam scores as a rug gives the teacher something a dot plot cannot: the axis itself, undamaged. Ticks crowd around 76 and thin out past 90 exactly where the stacked columns rose and fell, but the mode now reads as darkness rather than height, and the low tail below 60 reads as four lonely ticks on an otherwise-empty stretch. Added under a density curve, the rug becomes the footnote that proves the smooth is tracking real observations.",
  },
  elements: [
    {
      selector: "tick",
      label: "Tick (one observation)",
      explanation:
        "Every tick is a single datum positioned at its exact value on the axis. Keep them short — six to eight pixels — and semi-transparent so two ticks at the same value visibly darken. This is the rug's whole grammar: position is value, ink is count.",
    },
    {
      selector: "cluster",
      label: "Dense cluster (mode)",
      explanation:
        "Where many ticks overlap, the axis darkens. The darkest stretch is the modal region, same information a histogram's tallest bar encodes but without the binning decision. Unlike a dot plot, you cannot count the individuals here — you trade countability for a direct reading of the underlying scale.",
    },
    {
      selector: "tail",
      label: "Sparse tail",
      explanation:
        "A thin scatter of isolated ticks far from the bulk marks the tail. Because nothing is binned, a single outlier reads as exactly one tick in empty space — louder than a bar of height one would be, which is the rug's job when you are hunting for stragglers.",
    },
    {
      selector: "density",
      label: "Density overlay",
      explanation:
        "A thin smoothed curve placed above the rug completes the idiom: the curve gives you a height to compare, the rug gives you the raw evidence it is built from. If the curve has a bump the rug doesn't support, the bandwidth is too small; if the rug has a cluster the curve flattens, the bandwidth is too large.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "The raw scale every observation is pinned to. A rug plot asks nothing of the axis beyond being continuous and honest — no binning edges, no category bands. When it stands alone, label the axis carefully; the ticks are the only other information in the chart.",
    },
  ],
};
