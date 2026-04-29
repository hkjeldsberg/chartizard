import type { LiveChart } from "@/content/chart-schema";

export const treeOfLifeRadialPhylogeny: LiveChart = {
  id: "tree-of-life-radial-phylogeny",
  name: "Radial Phylogeny (Tree of Life)",
  family: "hierarchy",
  sectors: ["biology"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",

  synopsis:
    "A dendrogram projected onto polar coordinates — root at the centre, leaves at the circumference — so the three-domain symmetry of the tree of life reads in one glance.",

  whenToUse:
    "Use a radial phylogeny when the tree's topology is deep and approximately balanced across several high-level clades, and you want each clade to occupy a comparable visual footprint. A rectangular phylogram of the whole tree of life gives the Eukarya branch the full bottom half of the figure while Bacteria and Archaea get a narrow band at the top — a false impression of relative diversity. A radial layout gives each of the three domains a fair third of the circle.",

  howToRead:
    "The root (LUCA — Last Universal Common Ancestor) sits at the centre of the disc. Every branch runs outward; radial distance from the centre encodes cumulative branch length (substitutions per site, or inferred time). Siblings in the tree are neighbours in angle, so a dense cluster of leaves on one side of the disc is a clade. Each of the three domains — Bacteria, Archaea, Eukarya — occupies its own arc, colour-coded and distinguished by leaf-glyph shape. The deepest branching point, just outside the LUCA dot, is the first split: in Woese & Fox's topology, Bacteria diverge from the Archaea-Eukarya lineage.",

  example: {
    title: "Woese & Fox, PNAS, 1977 — the third domain of life",
    description:
      "Carl Woese and George Fox compared 16S/18S ribosomal RNA sequences and discovered that methanogens (previously classified as bacteria) are as evolutionarily distant from E. coli as eukaryotes are — a third domain, Archaea, co-equal with Bacteria and Eukarya. The radial layout dramatises this: the Bacteria arc and the Archaea-plus-Eukarya arc meet at a single deep node near the centre. The Open Tree of Life (Hinchliff et al., PNAS 2015) is the modern realisation of this figure — a synthesis of 484 published trees covering roughly 500,000 taxa, served as a single navigable phylogeny.",
  },

  elements: [
    {
      selector: "luca",
      label: "LUCA (root)",
      explanation:
        "The centre dot is LUCA — the Last Universal Common Ancestor, the most recent organism from which all life on Earth descends. Its existence is inferred, not observed; genomic reconstructions (Weiss et al., Nature Microbiology 2016) place it in a hydrothermal-vent-like environment with roughly 355 protein families already present. In a radial tree LUCA occupies the mathematical origin: every other node's radial coordinate is measured from here.",
    },
    {
      selector: "bacteria-domain",
      label: "Bacteria domain",
      explanation:
        "One of the three domains (Woese et al., 1990). Bacteria possess peptidoglycan cell walls, ester-linked membrane lipids, and Type-II RNA polymerase. Representatives on the disc include E. coli (Proteobacteria, the model gram-negative), Bacillus subtilis (Firmicutes), Mycobacterium tuberculosis (Actinobacteria), Cyanobacteria (the oxygenic photosynthesisers whose descendants became plant chloroplasts), and Helicobacter pylori (the gastric-ulcer organism).",
    },
    {
      selector: "archaea-domain",
      label: "Archaea domain",
      explanation:
        "Woese & Fox's 1977 discovery: a third domain, ether-linked membrane lipids and a unique ribosomal RNA signature, sister to Eukarya in most modern phylogenies. Methanococcus and Halobacterium are Euryarchaeota; Sulfolobus is a Crenarchaeote isolated from sulphuric hot springs; Nanoarchaeum equitans is a 400 nm parasitic archaeon with the smallest non-viral genome known. No known archaeal pathogen of humans exists.",
    },
    {
      selector: "eukarya-domain",
      label: "Eukarya domain",
      explanation:
        "The domain of organisms with membrane-bounded nuclei and mitochondria. Modern phylogenomics (Burki et al., 2020) groups Eukarya into five or six super-groups — SAR, Archaeplastida, Amoebozoa, Excavata, Opisthokonta — represented here by Plasmodium, Arabidopsis, Dictyostelium, Giardia, and the Metazoan clade containing Drosophila, Danio rerio, Mus musculus, and Homo sapiens. The Eukarya arc carries more leaves than the other two combined because the catalog of described eukaryotes is larger, not because eukaryotic diversity exceeds microbial diversity.",
    },
    {
      selector: "domain-split",
      label: "Deep domain split",
      explanation:
        "The internal node nearest LUCA is the deepest branching point: it separates Bacteria from the Archaea + Eukarya lineage. Woese & Fox's original 1977 tree placed this split unrooted; the Bacteria-first rooting was proposed by Gogarten et al. (1989) and Iwabe et al. (1989) using paralogous gene pairs. The angular position of this node here carries no data meaning — only its radial position does.",
    },
    {
      selector: "leaf-taxon",
      label: "Leaf (taxon)",
      explanation:
        "Each leaf is a single taxon — here, named genera or species sampled to represent their clade. Homo sapiens is one leaf among 32 on this disc, and the length of its radial branch is a direct measurement of how much sequence divergence separates it from the tetrapod common ancestor. Treating any leaf as \"higher\" or \"more evolved\" than another is a misreading: every extant leaf has been evolving for exactly the same amount of time since LUCA.",
    },
    {
      selector: "branch-length",
      label: "Radial branch-length encoding",
      explanation:
        "A leaf's radial distance from the centre is proportional to its cumulative branch length — substitutions per site in molecular work, or millions of years in a time-calibrated tree. Long branches (Nanoarchaeum, Giardia, Chlamydia) indicate long-branch attraction risk: rapidly evolving lineages can be misplaced by parsimony methods. Short internal branches near the centre indicate that the deep splits happened in rapid succession, which is why the relative order of the three domains is still contested (Williams et al., Nature Reviews Microbiology 2013).",
    },
  ],
};
