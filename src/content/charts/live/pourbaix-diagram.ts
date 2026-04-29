import type { LiveChart } from "@/content/chart-schema";

export const pourbaixDiagram: LiveChart = {
  id: "pourbaix-diagram",
  name: "Pourbaix Diagram",
  family: "specialty",
  sectors: ["chemistry"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A thermodynamic map of a metal–water system: pH on x, electrode potential on y, with each region labelling the stable species under those conditions.",
  whenToUse:
    "Reach for a Pourbaix diagram when a corrosion, plating, or electrochemistry question hinges on 'which species wins at this pH and this voltage?' — pipeline coatings, battery electrode stability, groundwater remediation. The diagram is a thermodynamic statement, not a kinetic one: it tells you which phase is favoured, not how fast the reaction reaches it. If the timescale matters, pair it with a Tafel plot.",
  howToRead:
    "Locate your operating conditions on the (pH, E) plane and read the label on the region you land in — that's the thermodynamically stable species. Horizontal region boundaries are redox reactions (change potential and the metal oxidizes or reduces); vertical boundaries are acid-base reactions (change pH and a hydroxide forms or dissolves). The two dashed diagonals bound water's own stability: above the upper line water oxidizes to O₂, below the lower line it reduces to H₂. Anything drawn outside that corridor describes a system that would also decompose the solvent.",
  example: {
    title: "Iron in aqueous solution — the classical corrosion map",
    description:
      "Marcel Pourbaix published his atlas in 1945 and the iron-water diagram is its most-reprinted page: Fe metal at low potential (immunity), Fe²⁺ and Fe³⁺ in acidic oxidizing conditions (active corrosion), Fe(OH)₂ and Fe(OH)₃/Fe₂O₃ at neutral-to-alkaline pH (passivation). The same diagram explains why iron rusts in aerated water near pH 7 (you land in the Fe(OH)₃ region) but survives in a sealed anoxic system (you stay in the Fe region below the H₂ line). A tank coating engineer reads a single point on this chart to predict decades of field behaviour.",
  },
  elements: [
    {
      selector: "region",
      label: "Stability region",
      explanation:
        "Each labelled polygon marks the (pH, E) conditions where one species is thermodynamically favoured. The label is the species — Fe²⁺, Fe(OH)₃, Fe metal — not the reaction. Moving inside a region changes nothing about the dominant phase; only crossing a boundary does.",
    },
    {
      selector: "species-boundary",
      label: "Species boundary",
      explanation:
        "An edge between two regions is an equilibrium line: on it, both species coexist. Horizontal boundaries respond only to potential (a redox couple like Fe²⁺/Fe); vertical boundaries respond only to pH (an acid-base hydrolysis); sloped boundaries involve both electrons and protons. The slope is how you read the stoichiometry.",
    },
    {
      selector: "reference-line-upper",
      label: "O₂/H₂O line (upper)",
      explanation:
        "The upper dashed diagonal follows E = 1.23 − 0.059·pH — the potential above which water is oxidized to O₂. Any species drawn above this line is only stable in a system where water itself is being consumed, so real operating points rarely sit there for long.",
    },
    {
      selector: "reference-line-lower",
      label: "H₂/H₂O line (lower)",
      explanation:
        "The lower dashed diagonal follows E = −0.059·pH — the potential below which water is reduced to H₂. In the Fe diagram, the iron-metal region sits well below this line, which is why iron is said to be cathodically protected only when coupled to a potential inside the water-stability corridor.",
    },
    {
      selector: "x-axis",
      label: "pH axis",
      explanation:
        "The horizontal axis runs from acidic (0) to alkaline (14). Moving rightward drives acid-base reactions — protons leaving the metal and hydroxides forming. The vertical edges of each region encode the pKa-like transitions that gate those reactions.",
    },
    {
      selector: "y-axis",
      label: "Potential axis (E vs SHE)",
      explanation:
        "The vertical axis is electrode potential in volts versus the standard hydrogen electrode. Moving upward oxidizes the metal (Fe → Fe²⁺ → Fe³⁺); moving downward reduces it back. The axis doesn't describe an applied voltage in a specific cell — it describes the redox environment the metal sees.",
    },
    {
      selector: "corrosion-passivation-immunity",
      label: "Corrosion, passivation, immunity",
      explanation:
        "The diagram's practical payload is a three-way verdict on the metal. Aqueous-ion regions (Fe²⁺, Fe³⁺) mean the metal actively corrodes — it dissolves. Solid-oxide/hydroxide regions mean it passivates — a protective film forms. The bare-metal region means immunity — the metal is stable. Coating choice, cathodic protection voltage, and inhibitor chemistry are all ways to move the operating point into the passivation or immunity zone.",
    },
  ],
};
