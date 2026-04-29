import type { LiveChart } from "@/content/chart-schema";

export const cladogram: LiveChart = {
  id: "cladogram",
  name: "Cladogram",
  family: "hierarchy",
  sectors: ["biology"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",

  synopsis:
    "A branching diagram that encodes only the order of evolutionary splits; all branches are drawn at equal length, so no distance or time information is implied.",

  whenToUse:
    "Use a cladogram when the question is about branching topology — which taxa form a clade together — not about how long ago they diverged or how much they have changed. Synapomorphy (shared derived character) mapping is the canonical use case: each internal node is labelled with the apomorphies that define the clade above it. Willi Hennig's 1966 English translation of Phylogenetic Systematics (University of Illinois Press) established this as the only permissible basis for biological classification.",

  howToRead:
    "Root is on the left; leaves are on the right. All leaves terminate at the same x-coordinate — the equal-length convention is a deliberate signal that no metric information is encoded. Read the branching order from left to right: the first fork (root split) is the most ancient separation; the last forks near the leaves are the most recent. Filled squares (■) on branch segments mark synapomorphies — derived character states that first appeared in the ancestor at that node and are shared by all taxa above it. A grade grouping that skips intermediate taxa (e.g. 'reptiles' without birds) cuts across a real clade and is invalid under cladistic principles.",

  example: {
    title: "Vertebrate synapomorphy map, Hennig 1966 / Donoghue & Benton 2007",
    description:
      "Donoghue and Benton's 2007 review in Trends in Ecology & Evolution uses this exact topology to illustrate how character-state transformations are mapped onto a cladogram: jaws appear at the base of Gnathostomata, four limbs at the base of Tetrapoda, the amniotic egg at the base of Amniota, and mammary glands at the base of Mammalia. Each mark is a testable hypothesis — it predicts that every taxon above the node possesses the derived state, and every taxon below does not.",
  },

  elements: [
    {
      selector: "root",
      label: "Root",
      explanation:
        "The root is the hypothetical common ancestor of all taxa in the diagram. On a cladogram, its x-position carries no temporal meaning — only its topological relationship to the first bifurcation matters. Hennig's founding principle was that the root must be defined by an outgroup, not by assumed primitiveness: Lamprey here is the outgroup that roots the vertebrate tree.",
    },
    {
      selector: "internal-node",
      label: "Internal node",
      explanation:
        "Each internal node is a synapomorphy node — a hypothetical ancestor defined by the set of shared derived characters (synapomorphies) that all its descendants possess. In cladistics, internal nodes are the only legitimate basis for naming groups: 'Gnathostomata' is valid because it is defined by the possession of jaws; 'fish' (excluding tetrapods) is invalid because it is defined by what the group lacks.",
    },
    {
      selector: "leaf",
      label: "Leaf (taxon)",
      explanation:
        "Leaves are terminal taxa — the organisms or lineages being classified. Because all leaves share the same x-coordinate, their right-hand alignment is a visual declaration that no evolutionary distance is encoded. The labels should be in italic by convention (species epithets), though this cladogram uses common names for legibility.",
    },
    {
      selector: "synapomorphy",
      label: "Synapomorphy mark",
      explanation:
        "The filled square (■) on a branch marks a synapomorphy — a derived character state that first evolved in the ancestor at the next node to the right and was inherited by all descendants above. 'Jaws' on the Gnathostomata branch means jaws evolved once, in the ancestor of all jawed vertebrates, and every taxon from Shark to Human shares this derived state. Alternative placements of the same mark on two separate branches would instead indicate homoplasy (convergent evolution).",
    },
    {
      selector: "equal-branch-length",
      label: "Equal branch length",
      explanation:
        "Every horizontal branch segment in a cladogram is drawn the same length, regardless of the actual evolutionary distance it represents. This is not a simplification — it is the defining convention. It signals to the reader that the diagram makes no claim about rate or time. The contrast with a phylogram (which uses proportional branch lengths) is the single most important visual distinction between the two diagram types.",
    },
    {
      selector: "basal-split",
      label: "Most-basal split",
      explanation:
        "The first fork from the root is the most-basal split: the deepest division in the group under study. Here it separates Lamprey (the outgroup / agnathan lineage) from all Gnathostomata (jawed vertebrates). In cladistic terminology, Lamprey is the sister group to Gnathostomata — not 'more primitive', but simply the lineage that diverged first in the topology as drawn.",
    },
    {
      selector: "sister-pair",
      label: "Most-derived sister pair (Mouse + Human)",
      explanation:
        "Sister groups at the tips of the tree represent the most recent bifurcation in the study group. Mouse and Human are sister groups within Mammalia: they share an exclusive common ancestor (the Mammalia node) not shared by any other taxon in the diagram. 'Most derived' means their lineage has passed through the largest number of successive synapomorphy nodes from the root — here: Gnathostomata, Osteichthyes, Amniota, Mammalia.",
    },
  ],
};
