import type { LiveChart } from "@/content/chart-schema";

export const phylogram: LiveChart = {
  id: "phylogram",
  name: "Phylogram",
  family: "hierarchy",
  sectors: ["biology"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",

  synopsis:
    "A phylogenetic tree in which branch lengths are proportional to a quantitative measure of evolutionary distance — either substitutions per site, or calibrated time.",

  howToRead:
    "Root is on the left, present is on the right. Each horizontal segment is a lineage; its length is the quantity being encoded — in this ultrametric rendering, time in millions of years ago. Internal nodes are speciation events; their x-coordinates are divergence dates. Read the x-axis as geological time flowing from the distant past to today. The scale bar in the corner is the phylogram's answer to the cladogram's silence about distance: it declares the measuring unit and invites you to read the topology as metric. All leaves share the same rightmost x because the tree is ultrametric — time-calibrated — so every extant lineage ends at the present.",

  whenToUse:
    "Use a phylogram when the question is not only 'who is related to whom' but also 'how long ago' or 'how much change'. A cladogram is sufficient when branching order alone carries the argument; a generic phylogenetic tree is the umbrella term; a phylogram specifically commits to encoding length. The ultrametric sub-variant (shown here) is produced by time-calibrated methods such as Drummond and Rambaut's BEAST (2007) — all leaves align at the present because the model assumes a molecular clock. The additive sub-variant (not shown) permits leaves to terminate at different x-coordinates because each lineage has evolved at its own rate, measured in substitutions per site; this is the output of Felsenstein's PHYLIP (1980) under maximum likelihood without a clock. A phylogram loses information compared to a cladogram only if the reader ignores the axis.",

  example: {
    title: "Bird tree-of-life calibration, after Jarvis et al. 2014 and Prum et al. 2015",
    description:
      "The deep structure of modern birds has been redrawn twice in a decade by genome-scale phylogenies. Jarvis and colleagues' 2014 whole-genome phylogeny (Science, 48 species, TENT alignment) and Prum and colleagues' 2015 anchored-hybrid-enrichment tree (Nature, 259 species) converged on a Palaeognathae-Neognathae split near the end of the Cretaceous. This ultrametric rendering places that split at ~85 Mya and recovers the modern ratites (Ostrich, Emu, Kiwi) plus their Tinamou sister-group on one side of the root, with Galliformes and Anseriformes branching recently within the neognaths. The chart makes the deep ratite divergence visually distinct from the shallow duck-goose split — a distinction a cladogram deliberately suppresses.",
  },

  elements: [
    {
      selector: "root",
      label: "Root",
      explanation:
        "The root is the most recent common ancestor of every taxon in the tree, placed at the deepest divergence on the x-axis — here 85 Mya, the inferred Palaeognathae-Neognathae split. In a rooted phylogram the root's x-coordinate is a real number with real units: it is the tree's oldest calibration point, not a decorative starting position as on a cladogram.",
    },
    {
      selector: "internal-node",
      label: "Internal node (speciation event)",
      explanation:
        "Each internal node is a speciation event — an ancestral lineage splitting into two descendant lineages. Its x-coordinate is the date of the split; its two outgoing branches are the two daughter lineages. The Neognathae node marks the common ancestor of all non-ratite birds in this tree; galliformes and anseriformes crown outward from it at shallower dates.",
    },
    {
      selector: "leaf",
      label: "Leaf (extant taxon)",
      explanation:
        "Leaves are the sampled taxa alive today. In an ultrametric phylogram they all share the rightmost x-coordinate because the molecular-clock calibration forces every extant lineage to terminate at the present. The Ostrich leaf sits at 0 Mya even though the Ostrich lineage has evolved for ~60 million years since its split from the Emu-Kiwi clade — the branch is long; the leaf is current.",
    },
    {
      selector: "branch-length",
      label: "Branch length",
      explanation:
        "The horizontal extent of a branch is the quantity the phylogram encodes. Here the Emu-Kiwi split is labelled at 50 Mya — the branch from the Emu-Kiwi node out to each leaf represents 50 million years of independent lineage evolution. On a cladogram this branch would be drawn the same length as every other branch; on an additive phylogram it would instead encode substitutions per site, and Emu and Kiwi might terminate at slightly different x-coordinates.",
    },
    {
      selector: "time-axis",
      label: "Time axis",
      explanation:
        "The x-axis is the single feature that separates a phylogram from a cladogram. Its units — millions of years ago in this ultrametric example, or substitutions per site in an additive phylogram — specify exactly what the branch lengths measure. A tree without an axis or scale bar is a cladogram regardless of how its branches happen to be drawn.",
    },
    {
      selector: "ultrametric-alignment",
      label: "Ultrametric alignment",
      explanation:
        "Every leaf sits at x = 0 Mya on the right edge. This alignment is the visual signature of the ultrametric sub-variant: the tree has been time-calibrated under a molecular-clock model (as in Drummond and Rambaut's BEAST, 2007) so that the path length from root to each leaf is the same in years. The alternative sub-variant — the additive phylogram — allows unequal leaf x-coordinates because it measures substitutions per site, and different lineages accumulate substitutions at different rates.",
    },
    {
      selector: "scale-bar",
      label: "Scale bar (20 Mya)",
      explanation:
        "The scale bar fixes the metric. A 20-million-year bar lets the reader calibrate any branch by eye: the Duck-Goose split at 20 Mya is exactly one scale-bar long; the Palaeognathae-Neognathae split at 85 Mya is a bit more than four scale-bars. Haeckel's 1866 Generelle Morphologie published the first trees with meaningful branch lengths without an explicit scale bar — modern computational phylograms always include one, because the whole point of the diagram is that the lengths are measurements, not sketches.",
    },
  ],
};
