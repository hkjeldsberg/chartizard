import type { LiveChart } from "@/content/chart-schema";

export const phylogeneticTree: LiveChart = {
  id: "phylogenetic-tree",
  name: "Phylogenetic Tree",
  family: "hierarchy",
  sectors: ["biology"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",

  synopsis:
    "A branching diagram that represents inferred evolutionary history, with branch lengths proportional to genetic distance or elapsed time.",

  whenToUse:
    "Use a phylogenetic tree (phylogram) when the magnitude of divergence matters, not only the branching order. Molecular clock analyses, rate-variation studies, and ancestral-state reconstructions all require branch-length information that a cladogram discards. The canonical output format of PhyML, RAxML, and MrBayes is a Newick-format tree with per-branch lengths.",

  howToRead:
    "Root is on the left; leaves (extant taxa or sequences) are on the right. The x-position of each leaf reflects cumulative distance from the root — a leaf far to the right has accumulated more substitutions or more geological time than one positioned closer. Horizontal branch length encodes distance; vertical connectors carry no quantitative meaning. Bootstrap support values near branch midpoints (e.g. 98%) are the proportion of bootstrap replicates that recovered that particular bipartition: values above 70% are conventionally considered supported.",

  example: {
    title: "Vertebrate divergence times, Hedges & Kumar TimeTree (2009)",
    description:
      "TimeTree integrates 2,274 published studies to produce a dated vertebrate phylogeny. The Lamprey–Gnathostomata split is placed at ~500 Ma; the Mouse–Human split at ~87 Ma. On a phylogram scaled to these dates, the lamprey branch is nearly six times the length of the rodent–primate branch, making the comparative antiquity of the agnathan lineage immediately legible — an effect invisible in a cladogram.",
  },

  elements: [
    {
      selector: "root",
      label: "Root",
      explanation:
        "The root is the inferred common ancestor of all taxa in the tree. Its x-position is set to zero distance; all other nodes are measured relative to it. In Darwin's 1837 Notebook B sketch — the first published phylogenetic tree — the root is the single unlabelled node at the base of the branching figure, captioned 'I think'.",
    },
    {
      selector: "internal-node",
      label: "Internal node (speciation event)",
      explanation:
        "Each internal node represents a hypothetical ancestral species at the moment it split into two descendant lineages — a speciation event. Willi Hennig's 1950 Grundzüge einer Theorie der phylogenetischen Systematik established that only these branching points, not overall similarity, constitute valid evidence of shared ancestry.",
    },
    {
      selector: "leaf",
      label: "Leaf (taxon)",
      explanation:
        "Leaves are the terminal taxa: extant species, sequences, or operational taxonomic units. Their names identify what is being compared. Leaf position on the y-axis is arbitrary (any rotation of a subtree preserves the topology); only the x-position carries quantitative information.",
    },
    {
      selector: "branch",
      label: "Branch (with length encoding)",
      explanation:
        "Horizontal branch length encodes evolutionary distance — either substitutions per site from a maximum-likelihood model (PhyML, RAxML) or millions of years from a Bayesian molecular clock (MrBayes, BEAST). Lamprey's long branch reflects its ~500 Ma divergence from jawed vertebrates; the Mouse–Human branch is proportionally short, consistent with a ~87 Ma split.",
    },
    {
      selector: "bootstrap",
      label: "Bootstrap support value",
      explanation:
        "Bootstrap values (Felsenstein, 1985) estimate clade robustness by re-sampling the sequence alignment 100–1000 times and counting how often the same bipartition appears. Values of 95–100% indicate the clade is strongly recovered; values below 50% are conventionally unreported. The 98% value on the Gnathostomata node reflects the near-universal agreement across studies that jawed vertebrates form a monophyletic group.",
    },
    {
      selector: "sister-group",
      label: "Sister-group relationship (Mouse + Human)",
      explanation:
        "Sister groups share an exclusive common ancestor not shared with any other taxon in the tree. Mouse and Human are sister groups within Mammalia: their shared Mammalia ancestor is the node at the base of both branches. The divergence between rodents and primates is among the best-dated mammalian splits, anchored by fossil calibrations from the Cretaceous–Palaeogene boundary.",
    },
    {
      selector: "outgroup",
      label: "Vertebrate outgroup (Lamprey)",
      explanation:
        "An outgroup is a taxon known from other evidence to have diverged before the ingroup. Lamprey (Petromyzontida) is the outgroup here: as an agnathan (jawless vertebrate), it is the sister group to all Gnathostomata. Its placement roots the tree and polarises character-state changes — traits shared by Lamprey and Gnathostomata were present in the vertebrate ancestor; traits absent in Lamprey arose within the gnathostome lineage.",
    },
  ],
};
