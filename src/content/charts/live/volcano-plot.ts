import type { LiveChart } from "@/content/chart-schema";

export const volcanoPlot: LiveChart = {
  id: "volcano-plot",
  name: "Volcano Plot",
  family: "distribution",
  sectors: ["genetics", "statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A scatter of effect size against statistical significance that names itself — the erupting plume of hits in the upper corners is the analyst's target.",
  whenToUse:
    "Use a volcano plot when you are screening thousands of features at once — differentially expressed genes in an RNA-seq contrast, differentially abundant proteins in mass-spec, any high-dimensional hypothesis test — and need to separate the few that matter from the many that do not. It trades precision for triage: one glance sorts the screen into 'worth chasing' and 'background'.",
  howToRead:
    "The x-axis is the direction and magnitude of the effect (log2 fold-change): right means up-regulated in the treatment, left means down-regulated, zero means no change. The y-axis is -log10(p), so higher means more statistically significant. The two dashed vertical lines mark the fold-change cutoff (|log2FC| > 1) and the dashed horizontal marks the p = 0.01 cutoff. Only points in the upper-left and upper-right quadrants clear both bars — those are your hits.",
  example: {
    title: "Tumour vs adjacent-normal breast tissue, TCGA-BRCA RNA-seq",
    description:
      "A classic cancer-genomics volcano plot over ~20,000 genes places TP53 deep in the down-regulated corner and MYC, KRAS high in the up-regulated corner. The same table of log2FC and p-values in a spreadsheet is unreadable; plotted this way, three decades of oncology lands in a single image.",
  },
  elements: [
    {
      selector: "up-regulated-corner",
      label: "Up-regulated corner",
      explanation:
        "The upper-right quadrant holds genes that are both more abundant in the treatment condition (large positive log2FC) and unlikely to be a chance finding (small p). The name 'volcano' comes from the shape this region makes as hits erupt upward and outward from the null cloud.",
    },
    {
      selector: "down-regulated-corner",
      label: "Down-regulated corner",
      explanation:
        "The upper-left mirror of the up-regulated corner — genes suppressed in the treatment. Interpreting the two corners together prevents the common mistake of reporting only one direction of effect.",
    },
    {
      selector: "fold-change-threshold",
      label: "Fold-change threshold",
      explanation:
        "Dashed vertical lines at log2FC = ±1, i.e. a two-fold change. Statistical significance alone is not enough — a gene whose expression shifts by 3% is measurable but rarely biologically interesting. This cutoff enforces an effect-size floor.",
    },
    {
      selector: "significance-threshold",
      label: "Significance threshold",
      explanation:
        "Dashed horizontal line at -log10(p) = 2, i.e. p = 0.01. In practice this is usually replaced by an FDR-adjusted threshold when the test count is large — plotting the raw p makes the cutoff tuneable by eye during exploration.",
    },
    {
      selector: "labelled-gene",
      label: "Labelled gene",
      explanation:
        "A handful of named hits are labelled directly on the plot. Picking which to name is editorial: it anchors the reader in a known biology before they scan the rest of the cloud.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "Log2 fold-change — symmetric around zero, so a doubling is +1 and a halving is -1. The log scale keeps the plot balanced regardless of which direction the larger effects land in.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "Negative log10 of the p-value: higher means more significant. The negative-log transform is what turns the densely-packed significant p-values (0.001, 0.0001, 1e-10) into a legible vertical axis.",
    },
  ],
};
