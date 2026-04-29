import type { LiveChart } from "@/content/chart-schema";

export const manhattanPlot: LiveChart = {
  id: "manhattan-plot",
  name: "Manhattan Plot",
  family: "distribution",
  sectors: ["genetics"],
  dataShapes: ["geospatial"],
  tileSize: "W",
  status: "live",
  synopsis:
    "A skyline of the genome: each SNP is a dot, position runs left-to-right across chromosomes, and height is evidence against the null.",
  whenToUse:
    "Use a Manhattan plot to present results from a genome-wide association study (GWAS) or any scan where tens of thousands of positional tests are run in one shot. It compresses an entire genome into a single image and lets the eye pick out the handful of loci that rise above the multiple-testing floor.",
  howToRead:
    "The x-axis is physical position along the genome, with the 22 autosomes and the X chromosome concatenated end-to-end and shaded in alternating tones so you can tell one chromosome from the next. The y-axis is -log10 of the association p-value, so taller dots are more significant. The dashed horizontal line at p = 5×10⁻⁸ is the Bonferroni-style genome-wide significance cutoff — roughly 0.05 divided by the one million independent tests across the genome. Towers piercing that line are the hits; everything below is the noise floor you paid the correction to reject.",
  example: {
    title: "WTCCC 2007 — seven common diseases, ~2,000 cases each",
    description:
      "The Wellcome Trust Case Control Consortium's 2007 Nature paper is the Manhattan plot's breakthrough moment: one figure per disease, each a skyline of 500,000 SNPs, surfaced confirmed loci for type 1 and type 2 diabetes, Crohn's disease, and coronary artery disease that a per-SNP table would have buried. The chart's resemblance to the Manhattan skyline gave the visualisation its name.",
  },
  elements: [
    {
      selector: "significance-threshold",
      label: "Genome-wide significance",
      explanation:
        "Dashed horizontal line at p = 5×10⁻⁸, i.e. -log10(p) ≈ 7.3. This is the Bonferroni-corrected threshold for one million independent tests — the price of scanning the whole genome is a ferocious per-SNP cutoff. A secondary line at p = 10⁻⁵ marks a weaker, suggestive tier.",
    },
    {
      selector: "chromosome-band",
      label: "Chromosome band",
      explanation:
        "Each chromosome occupies a slab of the x-axis, shaded in alternating tones so neighbouring chromosomes are distinguishable without a legend. Band widths are proportional to chromosome length, not to SNP count.",
    },
    {
      selector: "gwas-peak",
      label: "GWAS peak",
      explanation:
        "A cluster of high -log10(p) dots at a single locus — linkage disequilibrium means neighbouring SNPs share association signal, so a true hit shows up as a tower, not a lone spike. The tower's base width hints at the LD block; its height is the strength of the association.",
    },
    {
      selector: "snp-point",
      label: "SNP point",
      explanation:
        "One dot is one single-nucleotide polymorphism. Most SNPs sit near the floor because most SNPs have nothing to do with the trait under test — a Manhattan plot is a chart of haystacks that happens to also show the needles.",
    },
    {
      selector: "x-axis",
      label: "Chromosome axis",
      explanation:
        "Position along the genome, with chromosomes 1-22 and X concatenated in order. The axis is continuous within each chromosome and discontinuous between them; tick labels sit at band midpoints, not at tick marks.",
    },
    {
      selector: "y-axis",
      label: "-log10(p) axis",
      explanation:
        "Negative-log10 of the p-value, so p = 10⁻⁸ reads as 8 and p = 10⁻¹² reads as 12. The transform is what keeps the densely-packed small p-values legible — without it, every interesting point would be glued to zero.",
    },
  ],
};
