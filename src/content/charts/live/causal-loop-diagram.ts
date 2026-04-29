import type { LiveChart } from "@/content/chart-schema";

export const causalLoopDiagram: LiveChart = {
  id: "causal-loop-diagram",
  name: "Causal Loop Diagram",
  family: "flow",
  sectors: ["decision-analysis"],
  dataShapes: ["network"],
  tileSize: "M",
  status: "live",

  synopsis:
    "A qualitative systems-dynamics diagram where directed arrows carry polarity signs (+ or −) and closed loops are labelled R (reinforcing) or B (balancing).",

  whenToUse:
    "Use a causal loop diagram when the behaviour you want to explain is produced by feedback — when A affects B, B affects C, and C eventually affects A again. The diagram is the qualitative precursor to a quantitative stock-and-flow model. Jay Forrester developed the underlying systems dynamics framework at MIT in 1956; the CLD notation emerged as the lightweight companion tool for mapping feedback structure before committing to equations.",

  howToRead:
    "Read each arrow as a causal claim with a polarity sign: a + arrow means an increase in the source variable produces an increase in the target (same direction); a − arrow means an increase in the source produces a decrease in the target (opposite direction). Then count the negative arrows in each closed loop: an even number (including zero) makes the loop reinforcing (R) — it amplifies whatever change started it, producing exponential growth or collapse. An odd number makes the loop balancing (B) — it resists the change and drives the system toward a goal or equilibrium. The loop labels (R1, B1) name each closed feedback circuit. Loop annotations are placed at the loop's visual centre with a rotation arrow indicating the direction of causation.",

  example: {
    title: "Limits to Growth, Meadows et al. (1972, Club of Rome)",
    description:
      "Jay Forrester's 1956 framework was popularised in Donella Meadows, Dennis Meadows, Jørgen Randers, and William Behrens III, The Limits to Growth (1972, commissioned by the Club of Rome). Their world-model used a CLD with two opposing loops: a reinforcing loop where population growth drives more births (R1), and a balancing loop where population depletes resources, reducing food availability, which reduces births (B1). Peter Senge's The Fifth Discipline (1990) brought both loops into mainstream business strategy: the reinforcing loop as the engine of compound interest or market share escalation, the balancing loop as the structural reason why sales forces plateau and capacity expansions stall. Every meaningful CLD contains at least one of each loop type — a diagram with only R loops describes an unlimited exponential, which does not exist; only B loops describes a system with no growth driver.",
  },

  elements: [
    {
      selector: "node-variable",
      label: "Node (variable)",
      explanation:
        "Each node names a quantity in the system that changes over time — not an action or event, but a state: Population, Food availability, Resource use. Nodes are labelled ellipses or plain text. The choice of what to name as a node is the analyst's first structural decision: a variable left unnamed cannot participate in a loop, so omissions are visible as broken causal chains.",
    },
    {
      selector: "positive-polarity",
      label: "(+) polarity arrow",
      explanation:
        "A + arrow from A to B means: when A increases, B increases (all else equal); when A decreases, B decreases. 'Population → (+) Births' is the clearest case: more people produce more births. The + polarity does not mean the relationship is desirable or large — only that the two variables move in the same direction.",
    },
    {
      selector: "negative-polarity",
      label: "(−) polarity arrow",
      explanation:
        "A − arrow from A to B means: when A increases, B decreases; when A decreases, B increases. 'Resources available → (−) Food availability' carries a − because resource depletion reduces the food supply. The − polarity is what introduces goal-seeking or stabilising behaviour when it appears in an odd number within a loop.",
    },
    {
      selector: "reinforcing-loop",
      label: "Reinforcing loop (R1)",
      explanation:
        "The R1 loop — Population → (+) Births → (+) Population — contains zero negative arrows and therefore amplifies: more population produces more births, which adds to population, which produces still more births. This is the structural signature of compound interest, viral spread, and exponential growth. R loops produce growth when above equilibrium and collapse when below it. The Meadows (1972) model's world population trajectory is driven entirely by this reinforcing structure, modulated by the B1 loop.",
    },
    {
      selector: "balancing-loop",
      label: "Balancing loop (B1)",
      explanation:
        "The B1 loop — Population → (+) Resource use → (−) Resources available → (−) Food availability → (−) Births → (+) Population — contains three negative arrows (an odd number), so it is balancing: it resists the growth produced by R1 by cutting back the birth rate as resources deplete. B loops do not always prevent growth; they set the ceiling. Forrester (1956) called this structure a 'negative feedback loop'; Senge (1990) named it the balancing archetype in The Fifth Discipline.",
    },
    {
      selector: "feedback-loop",
      label: "Feedback loop",
      explanation:
        "A feedback loop is any closed path of arrows in the diagram — a chain where the effect eventually circles back to affect the cause. The existence of a loop, not the individual arrows, is what produces non-linear dynamic behaviour: oscillation, overshoot, exponential growth, or equilibrium-seeking. A diagram with no closed loops is not a CLD in the meaningful sense; it is a directed influence diagram (see the companion 'Influence Diagram' chart).",
    },
    {
      selector: "polarity-symbol",
      label: "Polarity symbol at arrowhead",
      explanation:
        "The + or − symbol is printed near the arrowhead — not at the midpoint, not at the source. Placement at the head is the dominant convention in systems dynamics (Sterman, Business Dynamics, 2000) because it names what the arrow does to the target variable: 'this is what the incoming signal does when it arrives'. An arrowhead without a polarity symbol is incomplete; it encodes direction but not the sign of the causal relationship.",
    },
  ],
};
