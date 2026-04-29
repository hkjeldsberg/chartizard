import type { LiveChart } from "@/content/chart-schema";

export const genogram: LiveChart = {
  id: "genogram",
  name: "Genogram",
  family: "hierarchy",
  sectors: ["medicine", "social-sciences"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",

  synopsis:
    "A three-generation family diagram that records both biological descent and the quality of relationships — affection, conflict, estrangement — alongside trait inheritance.",

  whenToUse:
    "Use a genogram when a case requires both the biological structure of a family and the texture of its relationships in the same frame. It is the standard intake instrument in family therapy, primary-care behavioural health, and medical-genetics consultations. A pedigree chart is sufficient when only Mendelian inheritance of a single trait matters; a genogram is required when the question involves bonds, conflicts, substance patterns, caregiving roles, or any relational dynamic that tracks across generations alongside the biology.",

  howToRead:
    "Read top-to-bottom by generation, Roman-numeralled on the left margin. Squares are male, circles are female, diamonds are unknown or non-binary. A filled glyph means the person carries the trait being tracked — here, clinically diagnosed coronary artery disease. A diagonal X through a glyph marks the individual as deceased. A single horizontal line between two figures is a marriage or partnership; a double line is a particularly strong bond; a dashed line is estrangement; a zigzag is conflict. Vertical lines falling from the midpoint of a marriage to a sibship bar carry descent. The chart makes two inheritance patterns visible at once: a genetic trait descending down one side of the tree, and the relational patterns — who is close, who is fighting, who has stopped speaking — that a purely biological diagram would erase.",

  example: {
    title: "Three-generation coronary-artery-disease family, McGoldrick–Gerson notation",
    description:
      "Monica McGoldrick and Randy Gerson codified this notation in the 1985 first edition of Genograms in Family Assessment (W.W. Norton); the fourth edition (2020) is still the standard reference. In this composite family the paternal grandfather (I-1) was diagnosed with coronary artery disease after a myocardial infarction in 1988 and died in 1995; his son II-1 was diagnosed in 2015; two of the five grandchildren are now affected. The trait travels down a single side of the tree, but the relational notation records something the pedigree convention cannot: II-1's marriage is unusually strong, II-3's is estranged, and an unresolved cousin conflict spans the two branches.",
  },

  elements: [
    {
      selector: "sex-glyph",
      label: "Sex glyph (square / circle / diamond)",
      explanation:
        "Squares denote males, circles denote females, diamonds denote individuals of unknown or non-binary sex. The convention is shared with the clinical pedigree and predates molecular genetics. In a genogram the glyph is the anchor for every other piece of information about an individual: fill state, deceased mark, annotations, and relational lines all attach to it.",
    },
    {
      selector: "affected-glyph",
      label: "Filled glyph (has trait)",
      explanation:
        "A fully filled glyph indicates the individual has the trait the genogram is tracking — in this family, clinically diagnosed coronary artery disease. The convention is phenotypic, not genotypic: the fill records whether the diagnosis has been made, not the underlying allele state. When multiple traits are tracked, the glyph is divided into sectors, each filled independently.",
    },
    {
      selector: "deceased-mark",
      label: "Deceased mark (diagonal X)",
      explanation:
        "A diagonal X drawn through a glyph marks the individual as deceased. The genogram convention pairs it with a year-of-death annotation in the form 'b.YYYY, †YYYY'; for disease-specific genograms, the age at diagnosis is noted alongside. I-1 here was diagnosed with a myocardial infarction in 1988 and died in 1995, seven years after diagnosis — information a pedigree would omit.",
    },
    {
      selector: "marriage-line",
      label: "Marriage line and descent drop",
      explanation:
        "A horizontal line between two adult glyphs is a marriage or long-term partnership; a vertical line falling from its midpoint carries descent to the next generation. The sibship bar across the top of a row of children is what allows a genogram (like a pedigree) to show shared parentage without drawing one line per parent-child pair. Consanguineous unions are drawn as double horizontal lines between the mates; none appear here.",
    },
    {
      selector: "strong-bond",
      label: "Strong bond (double line)",
      explanation:
        "A double horizontal line between two figures marks an unusually close emotional bond. In McGoldrick–Gerson notation this is distinct from a consanguineous marriage (also double-lined) by context — the double line between a married couple encodes relational closeness, while a double line between biological relatives encodes shared descent. Family therapists use the mark to flag alliances whose disruption would reshape the system.",
    },
    {
      selector: "estranged-line",
      label: "Estranged line (dashed)",
      explanation:
        "A dashed horizontal line marks estrangement: the biological or legal relationship still exists, but contact has broken down. The distinction from a solid marriage line is not decorative — intake clinicians read the dashed line as a prompt to ask about cutoff, divorce, or prolonged silence. II-3 and II-4 are recorded here as estranged, which the chart flags as a risk factor for cascading cutoffs in the next generation.",
    },
    {
      selector: "conflict-line",
      label: "Conflict line (zigzag)",
      explanation:
        "A zigzag between two figures denotes active conflict — a relationship that is present, intense, and antagonistic. It is the genogram's most-cited departure from the purely biological pedigree: it records a state of the relationship, not a state of the genome. Here the conflict runs between two cousins in generation III, crossing between the affected and unaffected branches of the family.",
    },
  ],
};
