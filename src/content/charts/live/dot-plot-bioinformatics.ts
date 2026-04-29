import type { LiveChart } from "@/content/chart-schema";

export const dotPlotBioinformatics: LiveChart = {
  id: "dot-plot-bioinformatics",
  name: "Dot Plot (Bioinformatics)",
  family: "relationship",
  sectors: ["genetics"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Compares two biological sequences by placing a dot wherever a window of residues in one sequence matches a window in the other, revealing homology, repeats, and inversions as geometric patterns.",

  whenToUse:
    "Use a bioinformatics dot plot when you want a panoramic, alignment-free view of two sequences before committing to a dynamic-programming alignment. It is especially useful for long genomic comparisons where synteny blocks, segmental duplications, and large-scale inversions need to be seen before being quantified. For protein pairs, it shows which structural domains are conserved without first deciding on a scoring matrix.",

  howToRead:
    "Each axis represents one sequence; every residue position is a discrete tick. A dot at position (i, j) means that a window of residues centered at i in sequence 1 matches a window centered at j in sequence 2. A continuous diagonal running from bottom-left to top-right indicates a stretch of conserved sequence. A diagonal that jumps offset indicates an insertion or deletion in one sequence. A perpendicular diagonal (bottom-right to top-left) signals an inverted repeat. Scattered isolated dots are noise — short coincidental matches below the window threshold.",

  example: {
    title: "Human alpha-globin vs myoglobin, Gibbs & McIntyre 1970",
    description:
      "The original 1970 dot plot by Gibbs and McIntyre compared two globin protein sequences and produced a single long diagonal with a visible 4-residue step around the CD loop — the first computational evidence that the two proteins shared a common ancestral domain. A scatter plot of the same data (treating residue identity as a y-value) would collapse that structural signal into meaningless vertical bars. The dot plot's matrix geometry made the step in the diagonal immediately interpretable as an insertion event.",
  },

  elements: [
    {
      selector: "x-axis",
      label: "Sequence 1 axis (residue positions)",
      explanation:
        "The horizontal axis indexes the residue positions of the first sequence — here, human alpha-globin. Each tick is a discrete amino-acid position, not a continuous variable. The axis does not carry magnitude; position is its only meaning.",
    },
    {
      selector: "y-axis",
      label: "Sequence 2 axis (residue positions)",
      explanation:
        "The vertical axis indexes the residue positions of the second sequence — here, myoglobin. Reading up is analogous to scanning the second protein from N-terminus to C-terminus. Both axes are always discrete; the dot plot is never a scatter plot.",
    },
    {
      selector: "main-diagonal",
      label: "Main diagonal (homologous region)",
      explanation:
        "A continuous run of dots along the diagonal where i == j indicates that the two sequences are conserved at the same residue positions. In globins, this corresponds to the alpha-helical core shared by all members of the globin superfamily, conserved for over 500 million years of vertebrate evolution.",
    },
    {
      selector: "offset-diagonal",
      label: "Offset diagonal (insertion or deletion)",
      explanation:
        "Where the main diagonal steps sideways by several positions, an indel event has shifted the reading frame of the alignment. This signature in the human alpha-globin vs myoglobin comparison corresponds to a 4-residue insertion in myoglobin's CD loop, a flexible linker that differs between tissue-oxygen-carrier (myoglobin) and blood-transport (haemoglobin) roles.",
    },
    {
      selector: "noise-dots",
      label: "Scattered noise dots",
      explanation:
        "Isolated dots outside any diagonal are short coincidental window matches — the expected background rate for any pair of sequences. Increasing the window size or the match-score threshold filters them out. Their presence confirms that the diagonal is meaningful signal, not chance.",
    },
  ],
};
