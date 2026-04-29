import type { LiveChart } from "@/content/chart-schema";

export const influenceDiagram: LiveChart = {
  id: "influence-diagram",
  name: "Influence Diagram",
  family: "relationship",
  sectors: ["decision-analysis"],
  dataShapes: ["network"],
  tileSize: "M",
  status: "live",

  synopsis:
    "A compact graphical language for structuring a decision problem: rectangles are choices, ellipses are uncertainties, hexagons are payoffs, and arrows encode relevance.",

  whenToUse:
    "Use an influence diagram when you need to map the logical structure of a decision before quantifying it. It replaces a sprawling decision tree with a single picture that fits on one page, scales to many variables, and makes dependencies explicit. Howard and Matheson introduced the notation in 1984 specifically to communicate problem structure to non-specialists before committing to numerical analysis.",

  howToRead:
    "Read node shapes first: a rectangle is a variable the decision-maker controls; an ellipse is a probabilistic uncertainty outside their control; a hexagon is the utility or payoff the decision is meant to maximise. Then follow the arrows. A solid arrow from node A to node B means A is relevant to B — knowing A's value changes the probability distribution of B, or directly determines it. An arrow from a chance node into the decision node is an information arrow: it means that uncertainty is resolved before the decision is made. The diagram shows structure, not probabilities; it must be converted to a decision tree or influence-diagram algorithm for numerical evaluation.",

  example: {
    title: "Product launch, Howard & Matheson (1984)",
    description:
      "Ronald A. Howard and James E. Matheson introduced the canonical product-launch example in their 1984 chapter in Readings on the Principles and Applications of Decision Analysis (Strategic Decisions Group / Stanford). The decision node is 'Launch product?'; the chance nodes are 'Market size' and 'Product quality', both resolved before launch (information arrows); the value node is 'Profit'. The diagram encodes in four nodes and five arrows what a full decision tree would require dozens of branches to represent. Howard and Matheson's point was that the influence diagram is the 'rolled-up' form of the decision tree — same problem, radically less ink, and the structure is visible at a glance rather than buried in enumerated paths.",
  },

  elements: [
    {
      selector: "decision-node",
      label: "Decision node (rectangle)",
      explanation:
        "A rectangle marks a variable entirely within the decision-maker's control — here, whether to launch the product. Its value is chosen, not observed. The rectangle shape is the universal convention in decision-analytic notation, introduced by Howard & Matheson (1984). Every influence diagram must contain at least one decision node.",
    },
    {
      selector: "chance-node",
      label: "Chance node (ellipse)",
      explanation:
        "An ellipse represents a random variable — an uncertainty the decision-maker cannot control but whose distribution can be estimated. Here, 'Market size' and 'Product quality' are the two prior uncertainties. The ellipse carries a probability distribution over its possible states, which is assigned separately in the numerical phase of the analysis.",
    },
    {
      selector: "value-node",
      label: "Value node (hexagon)",
      explanation:
        "A hexagon (sometimes drawn as a rounded diamond) holds the payoff function — the utility or monetary value the decision is designed to maximise. 'Profit' is the single value node here; it receives arrows from every variable that determines it. There is exactly one value node in a standard single-objective influence diagram.",
    },
    {
      selector: "relevance-arrow",
      label: "Relevance arrow",
      explanation:
        "A solid arrow from node A to node B means A is probabilistically relevant to B: knowing A's realised value changes the probability distribution of B, or directly computes B's value. 'Launch → Profit' is a relevance arrow because the launch decision directly determines whether profit is realised. Arrow direction encodes causal or informational flow from upstream to downstream.",
    },
    {
      selector: "information-arrow",
      label: "Information arrow",
      explanation:
        "An arrow from a chance node into the decision node is an information arrow. It encodes the fact that the uncertainty is resolved before the decision is made — the decision-maker observes 'Market size' and 'Product quality' before choosing whether to launch. Removing this arrow would change the problem to one where the decision is made in ignorance of those variables, which would yield a different optimal policy.",
    },
    {
      selector: "node-shape-vocabulary",
      label: "Node-shape vocabulary",
      explanation:
        "The three shapes — rectangle (decision), ellipse (chance), hexagon (value) — are the complete vocabulary of a standard influence diagram. Every node in the diagram must be one of these three types. The shape convention was standardised by Howard & Matheson (1984) and has been the dominant notation in decision analysis ever since. A diagram that uses any other shape is either an extension or a different notation entirely.",
    },
    {
      selector: "upstream-downstream-flow",
      label: "Upstream-to-downstream flow",
      explanation:
        "Arrows always point from the variable that is known or chosen earlier (upstream) to the variable that depends on it (downstream). 'Product quality → Profit' runs left-to-right: quality is an input that influences the payoff. Reading the diagram from left to right follows the logical order of the decision problem: uncertainties resolve, the decision is made, the payoff is realised.",
    },
  ],
};
