import type { LiveChart } from "@/content/chart-schema";

export const ideogram: LiveChart = {
  id: "ideogram",
  name: "Ideogram",
  family: "specialty",
  sectors: ["genetics"],
  dataShapes: ["geospatial"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A scale drawing of a single chromosome showing cytogenetic G-bands, the centromere waist, telomere caps, and gene-position annotations.",

  whenToUse:
    "Reach for an ideogram when you need to report the genomic address of one or a small number of genes, variants, or structural rearrangements on a specific chromosome. It is the companion to the full karyotype (46-chromosome overview): karyotype diagnoses gross numerical or structural abnormalities; ideogram zooms to a single chromosome to show precisely where a locus sits relative to the G-band landmarks that pathologists and geneticists use as street addresses. ISCN 2020 (An International System for Human Cytogenomic Nomenclature, Karger) is the current standard for band naming.",

  howToRead:
    "The vertical bar represents the physical chromosome, oriented with the short arm (p, for petit) at the top and the long arm (q, for queue) at the bottom. The narrow waist is the centromere — the attachment point for the mitotic spindle. Alternating dark and light horizontal stripes are Giemsa-stained bands: dark G-bands are AT-rich, late-replicating heterochromatin; light G-bands are GC-rich, gene-dense euchromatin. Band addresses read as chromosome + arm + region + band + sub-band, e.g. 17q21.31 means chromosome 17, long arm, region 2, band 1, sub-band 31. Rounded caps at top and bottom are the telomeres — repetitive TTAGGG arrays that protect chromosome ends from degradation.",

  example: {
    title: "Human chromosome 17 — BRCA1 at 17q21.31 and TP53 at 17p13.1",
    description:
      "Chromosome 17 is mid-sized at roughly 83 Mb but unusually gene-dense. BRCA1, whose germline mutations account for most hereditary breast-ovarian cancer syndrome families (Hall et al., 1990, Science 250(4988)), sits in the dark G-band at 17q21.31. TP53, the most frequently mutated gene in sporadic human cancers (Nigro et al., 1989, Nature 342(6250)), sits in the dark band at 17p13.1. Plotting both on the same ideogram shows immediately that they lie on opposite arms, separated by the centromere — a fact that is cryptic in a gene list but obvious in the band-addressed coordinate system.",
  },

  elements: [
    {
      selector: "p-arm",
      label: "p-arm (short arm)",
      explanation:
        "The short arm of the chromosome, conventionally drawn at the top. 'p' derives from the French 'petit'. Chromosome 17's p-arm spans approximately 24 Mb and hosts TP53 in band p13.1. In cytogenetics, loss of heterozygosity on 17p is a classic marker of TP53-related tumour suppression failure.",
    },
    {
      selector: "q-arm",
      label: "q-arm (long arm)",
      explanation:
        "The long arm, drawn below the centromere. 'q' is conventionally taken as the next letter after 'p'. Chromosome 17's q-arm spans roughly 59 Mb and contains BRCA1 in band q21.31 as well as HER2/ERBB2 in band q12 — both clinically actionable breast-cancer loci.",
    },
    {
      selector: "centromere",
      label: "Centromere",
      explanation:
        "The primary constriction where the two sister chromatids are joined by cohesin and where the kinetochore assembles to attach to spindle microtubules during mitosis. On a stained karyotype it appears as a narrow gap in the banding pattern. On chromosome 17 the centromere sits at approximately 24–26 Mb, giving a p:q arm length ratio near 1:2.5.",
    },
    {
      selector: "g-band",
      label: "G-band (cytogenetic address)",
      explanation:
        "Giemsa banding (G-banding) produces the alternating dark-light stripe pattern after mild protease digestion and Giemsa stain. Dark G-bands correspond to AT-rich, late-replicating, relatively gene-poor chromatin; light G-bands are GC-rich, early-replicating, and enriched for protein-coding genes. The ISCN 2020 standard names every resolvable band: in '17q21.31', the digits read as region 2, band 1, sub-band 3, sub-sub-band 1.",
    },
    {
      selector: "gene-annotation",
      label: "Gene annotation (BRCA1)",
      explanation:
        "A horizontal tick mark with a label pinpoints a gene's cytogenetic position. BRCA1 at 17q21.31 was mapped in 1990 (Hall et al.) by linkage analysis in large breast-cancer families and cloned in 1994 (Miki et al., Science 266(5182)). The ideogram annotation communicates the gene's band address in the coordinate system that clinicians read on a diagnostic karyotype report.",
    },
    {
      selector: "telomere",
      label: "Telomere cap",
      explanation:
        "The rounded caps at the chromosome ends represent the telomeres — tandem arrays of TTAGGG hexanucleotides bound by the shelterin complex. Human telomeres are typically 5–15 kb in somatic cells and shorten with each cell division. On the ideogram they are rendered as semicircular endcaps that distinguish the chromosome termini from internal breaks.",
    },
  ],
};
