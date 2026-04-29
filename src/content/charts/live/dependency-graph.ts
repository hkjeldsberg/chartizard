import type { LiveChart } from "@/content/chart-schema";

export const dependencyGraph: LiveChart = {
  id: "dependency-graph",
  name: "Dependency Graph / Wheel",
  family: "relationship",
  sectors: ["networks", "software"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Packages on a ring, chords between any pair that imports the other — the shape of a build graph at a glance.",
  whenToUse:
    "Use a dependency wheel when the question is architectural: where are the hubs, where are the cycles, what breaks if you change a package. The radial layout is deterministic, so two snapshots of the same repo at different commits are directly comparable — a rectangular Sugiyama DAG re-flows every time a node is added.",
  howToRead:
    "Each node on the ring is a package; each chord is a direct import. Thick chords belong to the hub — here `ui-core`, which nearly every feature package depends on. Follow an arrow from tail to head: A → B reads \"A depends on B\". Trace a path across the chart to find import chains: analytics → auth → db-client → http-client → config is four hops deep, and any cycle in the graph would show up as a chord that loops back on itself.",
  example: {
    title: "A front-end monorepo's 18-package import graph",
    description:
      "Tools like Madge and Nx render exactly this shape for real TypeScript monorepos — the hub is almost always a `ui-core`, `design-system`, or `shared` package that everything else reaches for. GitHub's `dependency-wheel` visualisation (Fernando Gastón, 2012) popularised the radial layout for package graphs; the chart's enduring use is architectural enforcement: a package that grows to touch every chord on the wheel is, by definition, the load-bearing wall of the codebase.",
  },
  elements: [
    {
      selector: "hub-node",
      label: "Hub node",
      explanation:
        "A package with high in-degree — many chords land on it. Hubs are load-bearing: `ui-core` here is imported by most feature packages, so a breaking change to its public API ripples across the repo. Identify hubs by eye (thickest-chord node) or by counting incoming arrows.",
    },
    {
      selector: "leaf-node",
      label: "Leaf / feature node",
      explanation:
        "A package with low in-degree — few or no chords land on it. Leaves are feature packages, apps, or entry points. They depend on the hub and on each other, but nothing depends on them. Safe to refactor in isolation.",
    },
    {
      selector: "edge",
      label: "Dependency edge",
      explanation:
        "A chord connecting two packages represents a direct `import` or `require`. Chord length is visual only — a short chord between adjacent nodes is not 'closer' than a long chord across the ring. The edge says only that one package references the other's public API.",
    },
    {
      selector: "direction",
      label: "Direction arrowhead",
      explanation:
        "The arrowhead sits at the imported package, pointing away from the importer. A → B means A depends on B; changes in B propagate up to A, not the other way round. Without arrowheads a wheel is ambiguous — you cannot tell which side is the consumer.",
    },
    {
      selector: "chain",
      label: "Dependency chain",
      explanation:
        "A path through several nodes — analytics → auth → db-client → http-client → config is a four-hop chain. Long chains amplify change cost: a breaking change at the tail forces updates at every node along the path. Build systems minimise chain depth by design.",
    },
    {
      selector: "wheel-layout",
      label: "Radial layout",
      explanation:
        "Nodes sit at fixed angular positions around a circle — the ordering is editorial (here: hub at top, then grouped by layer). The fixed layout is the wheel's superpower over force-directed graphs: two snapshots of the same repo are directly comparable because node positions are deterministic, not emergent.",
    },
  ],
};
