import type { LiveChart } from "@/content/chart-schema";

export const sequenceLogo: LiveChart = {
  id: "sequence-logo",
  name: "Sequence Logo",
  family: "distribution",
  sectors: ["genetics"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Stacks nucleotide or amino-acid glyphs at each motif position so that stack height encodes information content in bits and letter height within the stack encodes per-position frequency.",

  whenToUse:
    "Use a sequence logo to visualise a multiple sequence alignment or position-weight matrix — any situation where you want to show both the consensus sequence and the statistical strength of that consensus simultaneously. The standard scenario is transcription-factor binding-site motifs, splice junctions, or conserved protein domains where a flat enumeration of the consensus would hide how variable each position actually is.",

  howToRead:
    "Read each column as one alignment position. The total height of the stack is its information content in bits: 2 bits means the position is perfectly conserved (only one base observed); 0 bits means all four bases are equally frequent and the position carries no signal. Within the stack, each letter's height is proportional to its frequency at that position, and the largest letter sits on top so the consensus is readable at a glance. A tall column with one dominant letter is a strongly selected-for position; a short column with jumbled letters is unconstrained.",

  example: {
    title: "TATA-box motif at RNA Polymerase II promoters",
    description:
      "Schneider and Stephens (1990, Nucleic Acids Research 18(20)) introduced the sequence logo to replace consensus-string notation. Plotting 300 vertebrate TATA-box-containing promoters, positions 3–8 produce stacks of nearly 2 bits dominated by T, A, T, A, A, A respectively — the canonical TATAAA hexamer. Flanking positions 1–2 and 9–10 collapse to near-zero height, showing that only the six-base core is biochemically constrained. WebLogo (Crooks, Hon, Chandonia, Brenner, 2004, Genome Research 14(6)) implemented this as a web service and established the colour convention: A green, C blue, G gold, T red.",
  },

  elements: [
    {
      selector: "y-axis",
      label: "Y-axis (bits)",
      explanation:
        "The y-axis runs from 0 to 2 bits — the theoretical maximum for a four-letter alphabet (log₂ 4 = 2). A position at 2 bits is invariant: one base appears in every sequence. A position at 0 bits is maximally uncertain: all four bases appear with equal frequency and the column contributes nothing to identifying the motif.",
    },
    {
      selector: "x-axis",
      label: "Position",
      explanation:
        "Each tick on the x-axis is one column of the multiple sequence alignment. Position numbering is relative to the motif anchor — for promoter motifs this is conventionally the transcription start site at +1, with the TATA-box falling near −30.",
    },
    {
      selector: "letter",
      label: "Letter glyph",
      explanation:
        "Each letter is a standard nucleotide or amino-acid symbol rendered as a scaled SVG text element. Letter height within its column encodes frequency: if T appears in 85% of sequences at a given position, the T glyph occupies 85% of that column's total pixel height. Colour follows the WebLogo convention: A = green, C = blue, G = gold, T = red.",
    },
    {
      selector: "frequency-encoding",
      label: "Frequency-within-stack",
      explanation:
        "Letter order within a column is ascending by frequency: the rarest letters sit at the bottom where they are hardest to read, and the most frequent letter sits on top. This puts the dominant consensus character at the most visually prominent position. The proportional height of each letter is its observed frequency at that alignment column — not its information content.",
    },
    {
      selector: "conserved-column",
      label: "Conserved column",
      explanation:
        "A tall, single-letter column such as position 4 (A, ~1.8 bits) indicates a strongly conserved residue: nearly all sequences in the alignment carry that nucleotide at this position. In biochemical terms this means mutations at this site disrupt function, so selection has purged variation. The TATA-box core positions 3–8 are the textbook example.",
    },
    {
      selector: "variable-column",
      label: "Variable column",
      explanation:
        "A short column such as position 10 (~0.3 bits) indicates a variable, unconstrained position: the four bases appear at roughly equal frequencies, so no one letter represents the consensus. In binding-site analysis these flanking positions are outside the protein-contact footprint and are free to drift.",
    },
  ],
};
