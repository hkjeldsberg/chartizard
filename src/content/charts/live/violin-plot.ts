import type { LiveChart } from "@/content/chart-schema";

export const violinPlot: LiveChart = {
  id: "violin-plot",
  name: "Violin Plot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Draws a mirrored kernel density estimate for each category — the full shape of the distribution, not just its quartiles.",
  whenToUse:
    "Reach for a violin plot when the shape of the distribution matters — when you suspect bimodality, skew, or multiple regimes hiding inside a single summary statistic. It is the box plot's successor when the five-number summary is not enough.",
  howToRead:
    "Each category is a shape symmetric about its centre line: the horizontal width at any y-value is proportional to how many observations fall near that value. Bumps and bulges are where observations cluster; pinches are gaps. A violin with one broad lobe is unimodal; two distinct bulges is bimodal; a tall, narrow shape is tightly concentrated; a stubby wide shape is dispersed. Read the median line inside each violin as you would in a box plot — but trust the shape around it for what the median alone cannot say.",
  example: {
    title: "Men's Olympic 100m-final times by decade, 1920s–2020s",
    description:
      "Feed the same finalists-per-decade times into a violin plot and a story the box plot flattened reappears: the 1960s and 2000s violins show a clear bimodal pinch — a single generational outlier (Jim Hines, Usain Bolt) sprinting a full tenth ahead of the rest of the field while the other finalists cluster together. The 2010s and 2020s violins are unimodal and narrow — everyone at the final is now running within a few hundredths of each other. The box plot said fields got tighter; the violin shows the field also stopped being bimodal.",
  },
  elements: [
    {
      selector: "violin",
      label: "Violin (KDE shape)",
      explanation:
        "Each violin is a kernel density estimate reflected about its centre line. Its outline is the smoothed shape of the distribution for that category. The total area inside every violin is identical — violins show where observations are, not how many observations there are.",
    },
    {
      selector: "median-line",
      label: "Median line",
      explanation:
        "The short horizontal across the centre of the violin is the median of the raw sample. It gives the viewer one anchor statistic inside the density shape. Some authors add quartile ticks as well; show the median at minimum.",
    },
    {
      selector: "density-width",
      label: "Density width",
      explanation:
        "The horizontal width at any height encodes density — wider is more observations near that value. A bimodal distribution shows two wide lobes separated by a pinch. Use a consistent scale across all violins in the chart so widths are comparable; an uncaled-per-violin variant hides relative frequency.",
    },
    {
      selector: "x-axis",
      label: "X-axis (category)",
      explanation:
        "One violin per group. Order violins meaningfully — by time, sample size, or median — so the reader can trace a trend in shape across the axis, not just in level.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (value)",
      explanation:
        "The continuous axis the distribution lives on. For sprint times, lower numbers mean faster runs, so the fastest observations sit at the top of each violin. Keep the y-axis consistent across violins — a separate scale per violin is a different chart.",
    },
  ],
};
