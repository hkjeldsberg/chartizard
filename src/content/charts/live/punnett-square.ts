import type { LiveChart } from "@/content/chart-schema";

export const punnettSquare: LiveChart = {
  id: "punnett-square",
  name: "Punnett Square",
  family: "comparison",
  sectors: ["genetics"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Crosses two parents' gametes in a 2×2 grid so offspring genotype frequencies are read as areas, not computed from probabilities.",
  whenToUse:
    "Reach for a Punnett square when you need to show the offspring distribution of a single-gene cross and want the ratio to be visible, not arithmetic. It is the canonical teaching chart for Mendelian inheritance, and the right choice whenever the story is \"one in four offspring will be homozygous recessive.\" For multi-gene crosses it grows to 4×4 or 16×16 and loses its readability; use a probability tree instead.",
  howToRead:
    "One parent's two possible gametes sit across the top, the other's down the left. Each interior cell is the genotype a child inherits by pulling one allele from each parent, and because the four cells are equiprobable, counting cells gives the ratio. Read genotypes directly (AA, Aa, aa) and phenotypes by shading: cells that carry at least one dominant A express the dominant trait, so three of the four cells here match. The ratio caption confirms 1:2:1 genotypic and 3:1 phenotypic.",
  example: {
    title: "Mendel's 1866 monohybrid pea cross",
    description:
      "Gregor Mendel's Versuche über Pflanzenhybriden (Brünn, 1866) reported an Aa × Aa cross of tall and short pea plants yielding roughly 3 tall to 1 short across 1,064 F2 offspring. Reginald Punnett's grid, drawn at Cambridge around 1905, makes that 3:1 ratio a matter of counting squares instead of multiplying probabilities — which is why the chart has not changed in more than a century.",
  },
  elements: [
    {
      selector: "parent-gametes",
      label: "Parent gametes",
      explanation:
        "The two rows of letters outside the grid are the gametes each parent can produce. In an Aa heterozygote, meiosis sorts A and a into separate gametes in equal numbers, so each parent contributes a 50/50 pair. The grid reconstructs fertilisation by pairing one gamete from each parent in every cell.",
    },
    {
      selector: "homozygous-dominant",
      label: "Homozygous dominant (AA)",
      explanation:
        "The top-left cell inherits A from both parents. It is one of four equiprobable outcomes, so the AA genotype appears at a frequency of one in four. Phenotypically it is indistinguishable from Aa — both express the dominant trait — which is what makes dominance a hypothesis and not a direct observation.",
    },
    {
      selector: "heterozygous",
      label: "Heterozygous (Aa)",
      explanation:
        "Two of the four cells — top-right and bottom-left — are Aa. They carry one dominant and one recessive allele, occur at a frequency of two in four, and are the reason the genotypic ratio is 1:2:1 rather than 1:1:1. Mendel called this the hybrid class; a modern geneticist calls them carriers.",
    },
    {
      selector: "homozygous-recessive",
      label: "Homozygous recessive (aa)",
      explanation:
        "The bottom-right cell inherits a from both parents. It is the only cell that expresses the recessive phenotype, and its one-in-four frequency is the entire visible signal in an F2 generation. Cystic fibrosis carrier couples read their risk off exactly this cell.",
    },
    {
      selector: "phenotype-shading",
      label: "Phenotype shading",
      explanation:
        "Cells carrying at least one A allele share the dark fill; the single aa cell is light. The shading compresses genotype into phenotype and makes the 3:1 phenotypic ratio visible without counting — which is the chart's reason to exist. Without the shading you would have to do the arithmetic the grid is trying to replace.",
    },
    {
      selector: "ratio-caption",
      label: "Ratio caption",
      explanation:
        "The 1:2:1 genotypic and 3:1 phenotypic ratios are the experimental prediction. Mendel's 1866 pea counts matched this to within sampling error, which is why they survived obscurity and were rediscovered in 1900. The caption is where the grid graduates from demonstration to prediction.",
    },
  ],
};
