import type { LiveChart } from "@/content/chart-schema";

export const circosPlot: LiveChart = {
  id: "circos-plot",
  name: "Circos Plot",
  family: "relationship",
  sectors: ["genetics"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",

  synopsis:
    "Wraps the genome into a ring and draws ribbons across the disc to represent long-range structural relationships between chromosomal positions.",

  whenToUse:
    "Use a Circos plot when the dataset is intrinsically genomic and the relationships are N-to-N structural variants (translocations, fusions, large-scale rearrangements) between chromosomes. A linear genome browser renders a translocation as a pair of arrows pointing off-screen; the circular layout pulls both endpoints onto the same page so the edge can be drawn as a single ribbon. It scales: a Cartesian panel of 22 × 22 pairwise tracks drowns in edge congestion at the scale at which The Cancer Genome Atlas produces data, whereas a Circos figure reads at a glance.",

  howToRead:
    "Begin with the outermost ring: 22 arcs, one per human autosome, labelled 1 through 22, their lengths proportional to the physical size of each chromosome. Alternating light and dark shading separates neighbours — the same convention a Manhattan plot uses, wrapped into a circle. Work inward through the data tracks: the first inner ring is the GC-content heatmap (darker = higher GC%), the next is a scatter-track of copy-number variant density. At the centre, ribbons connect pairs of chromosomal positions to represent structural rearrangements; each ribbon's endpoints are the breakpoints, and the label names the clinical fusion (BCR-ABL1, IGH-BCL2, MYC-IGH).",

  example: {
    title: "Krzywinski et al., Genome Research, 2009",
    description:
      "Circos was introduced by Martin Krzywinski and colleagues in Genome Research 19(9) as a figure format for The Cancer Genome Atlas. The Philadelphia chromosome — a t(9;22) translocation fusing BCR to ABL1, which causes chronic myeloid leukaemia — is the textbook case: on a linear browser the fusion is two unconnected arrows on separate ideograms; on Circos it is one ribbon arcing from the q-arm of chromosome 9 to the q-arm of chromosome 22. Dozens of such rearrangements per tumour render legibly on the same disc.",
  },

  elements: [
    {
      selector: "chromosome-arc",
      label: "Chromosome arc",
      explanation:
        "Each of the 22 outer arcs represents one human autosome. Arc length is proportional to physical chromosome size in megabases, so chromosome 1 (~249 Mb) occupies roughly five times the circumference of chromosome 22 (~51 Mb). Positions along an arc correspond to genomic coordinates running clockwise.",
    },
    {
      selector: "chromosome-label",
      label: "Chromosome label",
      explanation:
        "Labels 1 through 22 sit just outside each arc, numbered in the karyotype-standard order by decreasing size. X and Y are omitted here because the 2009 TCGA Circos figures — and many derivatives — restrict the ring to autosomes to keep representations comparable across sample sex.",
    },
    {
      selector: "alternating-band",
      label: "Alternating band convention",
      explanation:
        "Adjacent chromosome arcs are shaded in alternating light/dark tones so the eye can count them without labels. This is the same trick Gibson & Muse (2004) established for Manhattan plots — its role here is the same: to stabilise boundary perception around a ring where the usual gridlines are absent.",
    },
    {
      selector: "gc-track",
      label: "GC% data track (ring 1)",
      explanation:
        "The first inner ring is a heatmap of mean GC content per chromosome; darker segments are more GC-rich. Chromosomes 19 and 22 sit near 48%, chromosomes 4 and 13 near 38%. GC content predicts gene density and CpG-island frequency, which is why it is the canonical first track on a Circos figure.",
    },
    {
      selector: "scatter-track",
      label: "Scatter track (ring 2)",
      explanation:
        "The second inner ring carries a scatter-track — here, copy-number variant density per chromosome, each point placed at its genomic position and jittered radially within the track. Circos supports any per-position scalar as a track type (histograms, lines, tiles); scatter is the standard choice for variant catalogues with low local density.",
    },
    {
      selector: "sv-ribbon",
      label: "Structural-variant ribbon",
      explanation:
        "A ribbon is a cubic-Bezier band connecting two chromosomal positions, drawn across the centre of the disc. Each ribbon here is a recurrent cancer translocation: BCR-ABL1 (t(9;22), chronic myeloid leukaemia, Rowley 1973), IGH-BCL2 (t(14;18), follicular lymphoma), and MYC-IGH (t(8;14), Burkitt lymphoma). The same primitive is used in chord diagrams — Circos is the genomic specialisation of that idea.",
    },
    {
      selector: "breakpoint",
      label: "Breakpoint",
      explanation:
        "A breakpoint is the exact position at which a ribbon attaches to a chromosome arc — the DNA position where the rearrangement splits one chromosome and joins it to another. The BCR-ABL1 breakpoint on chromosome 9 is at q34, about 82% of the way along the arc; its partner on chromosome 22 is in band q11. Breakpoint clustering within a gene (the M-bcr region of BCR) is what makes a translocation recurrent and diagnostically useful.",
    },
  ],
};
