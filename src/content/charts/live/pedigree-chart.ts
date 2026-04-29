import type { LiveChart } from "@/content/chart-schema";

export const pedigreeChart: LiveChart = {
  id: "pedigree-chart",
  name: "Pedigree Chart",
  family: "hierarchy",
  sectors: ["genetics", "medicine"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Encodes family structure and trait status using sex-specific glyphs, fill conventions, and kinship lines to map inheritance across generations.",
  whenToUse:
    "Use a pedigree when you need to represent both the topology of a family and the phenotypic or genotypic status of each member simultaneously. It is the standard clinical instrument for genetic counselling — every evaluation of an inherited condition begins with one. It is unsuitable for population-level data; use it for family-scale inference only.",
  howToRead:
    "Read top-to-bottom by generation (Roman numerals on the left) and left-to-right within a generation (Arabic numerals under each symbol). Squares are males; circles are females. A filled symbol is affected (trait expressed). A half-filled symbol (vertical split, right half dark) is a carrier — one copy of a recessive allele, phenotypically normal. An open symbol is unaffected. A horizontal line between two symbols is the mate line; a horizontal bar above a row of children is the sibship line; a vertical drop from the sibship line connects each child to the lineage.",
  example: {
    title: "Carrier × carrier cross, autosomal recessive (Aa × Aa)",
    description:
      "The canonical clinical scenario: two unaffected parents each carry one copy of a recessive disease allele (CFTR for cystic fibrosis, HBB for sickle-cell, etc.). Mendelian expectation is 1:2:1 — one unaffected (AA), two carriers (Aa), one affected (aa). This two-generation pedigree demonstrates all three fill states and the sibship-line structure that distinguishes a pedigree from an ordinary tree diagram.",
  },
  elements: [
    {
      selector: "square-glyph",
      label: "Square glyph (male)",
      explanation:
        "A square denotes a male individual in every pedigree drawn to Bennett et al., 1995 NSGC standards. The convention predates molecular genetics and is universal across clinical genetics, veterinary genetics, and model-organism research. Fill state (open, half, solid) is overlaid on the shape.",
    },
    {
      selector: "circle-glyph",
      label: "Circle glyph (female)",
      explanation:
        "A circle denotes a female individual. Together, the square-circle pair encodes biological sex without text labels, allowing large multi-generation pedigrees to be read at a glance. Individuals of unknown or non-binary sex are occasionally denoted by a diamond; that variant is not shown here.",
    },
    {
      selector: "half-filled-glyph",
      label: "Half-filled glyph (carrier)",
      explanation:
        "A vertically split symbol — right half filled, left half open — marks a carrier: an individual who carries one copy of a recessive disease allele but does not express the trait. Casually called a 'heterozygous carrier.' The half-fill convention distinguishes carriers visually from both affected (fully filled) and unaffected (open) individuals.",
    },
    {
      selector: "filled-glyph",
      label: "Filled glyph (affected)",
      explanation:
        "A fully filled symbol denotes an affected individual — the trait or disease is expressed. In an autosomal recessive pedigree, affected individuals are typically homozygous for the recessive allele (aa). In autosomal dominant pedigrees, a single copy suffices. The fill convention is phenotypic, not genotypic: carriers are filled in pedigrees that track obligate heterozygotes only when specifically labelled.",
    },
    {
      selector: "mate-line",
      label: "Mate line",
      explanation:
        "A horizontal line between two symbols indicates a reproductive pair. A double horizontal line (not shown here) indicates a consanguineous mating — the parents are also related by descent. A vertical line descends from the midpoint of the mate line to the sibship line below.",
    },
    {
      selector: "sibship-line",
      label: "Sibship line",
      explanation:
        "A horizontal bar just above the children's row connects all full siblings. Vertical lines drop from the sibship bar to each individual child. The sibship line is the key structural element that distinguishes a pedigree's layout from a generic tree: it encodes simultaneous shared parentage for multiple children, not a one-to-one parent-child chain.",
    },
    {
      selector: "generation-label",
      label: "Generation label (Roman numerals)",
      explanation:
        "Roman numerals (I, II, III…) on the left margin identify each generation. Arabic numerals under each symbol (1, 2, 3…) identify individuals within a generation, forming the standard pedigree notation — I-1 is the first individual in generation one. This coordinate system lets clinicians, researchers, and family members refer to specific individuals unambiguously in case notes and publications.",
    },
  ],
};
