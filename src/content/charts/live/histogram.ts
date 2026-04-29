import type { LiveChart } from "@/content/chart-schema";

export const histogram: LiveChart = {
  id: "histogram",
  name: "Histogram",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Buckets a continuous variable into equal-width bins and draws a bar per bin, so the shape of the distribution becomes the chart.",
  whenToUse:
    "Reach for a histogram when the question is about shape — where the mass sits, whether the tail is long, how many modes the data has. A box plot summarises the same distribution in six numbers; a histogram shows you whether those six numbers are actually enough.",
  howToRead:
    "The x-axis is the measured quantity, cut into equal-width bins; bar height counts the observations that fell into each bin. A tall cluster is a mode; a gap is a gap; a slow fall-off on one side is a skew. Changes in bin width re-shape the picture, so a histogram is a tuned artefact, not a raw view of the data.",
  example: {
    title: "US household income, 2023 (~2,000-household sample)",
    description:
      "American Community Survey microdata on household income produces the canonical skewed shape: a thick shoulder around $50,000 to $90,000, a median near $75,000, and a right tail that thins but never quite dies, stretching past $300,000. The histogram tells that story in one glance; a mean alone would hide it entirely. Shift to 8 bins and the shoulder smooths into a blob; shift to 60 and the bars start looking like noise — the bin width is the editorial decision.",
  },
  elements: [
    {
      selector: "bin",
      label: "Bin",
      explanation:
        "One bar, one interval. Its height is the count of observations with values inside the interval's lower and upper edges. Every bin shares the same width, so bar area is proportional to frequency.",
    },
    {
      selector: "bin-width",
      label: "Bin width",
      explanation:
        "The only knob the author turns. Wide bins hide structure — modes, shoulders, gaps blur together. Narrow bins over-fit sample noise and the histogram starts to comb. Sturges' rule and Freedman-Diaconis are defensible defaults; always try at least two widths before committing.",
    },
    {
      selector: "long-tail",
      label: "Long tail",
      explanation:
        "The thin bars to the right carry a small count but a long span. Income, city size, file size and web traffic all produce tails like this. A log-x histogram or a cut-off with a note is often more honest than letting a few outliers stretch the axis flat.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (frequency)",
      explanation:
        "Counts per bin, or equivalently density if the y-axis is normalised by bin width and sample size. Must start at zero — a truncated frequency axis distorts relative bar heights and the whole point of the chart is relative bar heights.",
    },
    {
      selector: "x-axis",
      label: "X-axis (value)",
      explanation:
        "The measured variable, on a continuous scale. Bins tile the axis edge-to-edge with no gaps — that adjacency is what separates a histogram from a bar chart, which would leave space between categorical bars.",
    },
    {
      selector: "baseline",
      label: "Baseline",
      explanation:
        "Zero on the frequency axis. Bars rise from here; any bar of height zero leaves a visible gap in the tiling, which is itself informative.",
    },
  ],
};
