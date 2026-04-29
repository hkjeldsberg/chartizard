import type { LiveChart } from "@/content/chart-schema";

export const alleleChart: LiveChart = {
  id: "allele-chart",
  name: "Allele Chart",
  family: "composition",
  sectors: ["genetics"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Stacked bars of allele frequencies at a single genetic locus across multiple populations, encoding how common each DNA variant is within each group.",

  whenToUse:
    "Use an allele chart when you need to compare the distribution of alleles at one SNP or variant site across two or more populations. It is the standard display format in population genetics, pharmacogenomics, and forensic ancestry analysis. When you have multiple loci to compare simultaneously, prefer a heatmap of frequency values; the allele chart's strength is depth at a single locus, not breadth across many.",

  howToRead:
    "Each bar represents one population. The bar's total height reaches 100% of frequency. The stacked segments encode allele frequency: a tall dark segment means the derived allele is common in that population; a tall light segment means the ancestral allele dominates. Differences in stack proportions between bars show how much allele frequencies vary across populations — the primary signal in population-stratification analysis.",

  example: {
    title: "rs1426654 (SLC24A5), 1000 Genomes Project phase 3",
    description:
      "The A allele of rs1426654 — a missense variant in the membrane transporter SLC24A5 — is at near-fixation in European populations (99%) and near-absent in Yoruba (1%) and East Asian (2%) populations. South Asian populations show intermediate frequency (78%), consistent with the Eurasian migration history inferred by Cavalli-Sforza's *Genes, Peoples, and Languages* (2000). The chart makes visible in a single glance what population-differentiation statistics such as Fst summarise in a single number: this SNP is among the most strongly differentiated loci in the human genome.",
  },

  elements: [
    {
      selector: "stacked-bars",
      label: "Stacked bars",
      explanation:
        "Each bar is one population; each segment is one allele. The stacking encodes both alleles simultaneously so the viewer reads both frequency and its complement without a second chart. Bar width is equal across populations, so visual attention is directed to height differences, not sample-size differences.",
    },
    {
      selector: "derived-allele",
      label: "Derived allele (A)",
      explanation:
        "The dark segment shows the frequency of the derived allele — the variant that arose by mutation in an ancestral lineage and may be under selection. For rs1426654, the A allele is the derived form; its near-fixation in European populations (≥99%) is evidence of a strong selective sweep, likely related to vitamin D synthesis efficiency at high latitudes.",
    },
    {
      selector: "ancestral-allele",
      label: "Ancestral allele (G)",
      explanation:
        "The light segment shows the ancestral allele — the form shared with other primates and inferred to be present in the common ancestor of modern humans. In African and East Asian populations, the G allele is near-fixed, indicating that the derived A allele either arose after those populations diverged or was selected against in equatorial environments.",
    },
    {
      selector: "x-axis",
      label: "Population axis",
      explanation:
        "Each tick is one super-population from the 1000 Genomes Project: AFR (African), EUR (European), EAS (East Asian), AMR (admixed American), SAS (South Asian). These are continental groupings of sequenced individuals, not biological races; they serve as reference panels for frequency estimation.",
    },
    {
      selector: "y-axis",
      label: "Frequency axis",
      explanation:
        "The y-axis runs from 0% to 100%, encoding allele frequency — the proportion of chromosomes in that population carrying the allele. Because diploid individuals carry two copies, a population frequency of 50% means half of all chromosomes, not half of all individuals, carry the allele.",
    },
    {
      selector: "legend",
      label: "Allele legend",
      explanation:
        "The legend maps fill colour to allele identity. Without the legend, the chart shows population differences but not which allele is which. Labelling by allele letter (A / G) and status (derived / ancestral) is the minimum annotation for a scientifically interpretable chart.",
    },
  ],
};
