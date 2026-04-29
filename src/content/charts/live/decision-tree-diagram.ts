import type { LiveChart } from "@/content/chart-schema";

export const decisionTreeDiagram: LiveChart = {
  id: "decision-tree-diagram",
  name: "Decision Tree Diagram",
  family: "hierarchy",
  sectors: ["decision-analysis"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Lays out a sequential decision as squares (choices), circles (chance), and leaves (terminal payoffs) so expected value can be computed by backward induction.",
  whenToUse:
    "Reach for a decision tree when a choice has downstream uncertainty and you need to price the branches. It forces the analyst to write down the probabilities and payoffs explicitly — which is usually where the real argument lives.",
  howToRead:
    "Read left to right: the root square is the choice you're facing, circles are events outside your control, and triangles on the right are terminal payoffs. Every edge out of a square is a labeled alternative; every edge out of a circle is a probability that must sum to one across that fan. Fold the tree back right-to-left — at a chance node, weight the children by probability; at a decision node, pick the child with the highest expected value. The number that rolls up to the root is your decision.",
  example: {
    title: "Launch product X?",
    description:
      "The canonical product-launch worked example. Market reception is modeled as a chance circle with Strong (0.3 → +$50M), Moderate (0.5 → +$10M), and Weak (0.2 → -$15M) outcomes. EV[Launch] = 0.3·50 + 0.5·10 + 0.2·(-15) = $17M, which beats the $0 baseline of not launching — but the whole answer is sensitive to the priors the analyst put on that chance circle, which is the lesson.",
  },
  elements: [
    {
      selector: "decision-node",
      label: "Decision node (square)",
      explanation:
        "A square marks a point where the analyst chooses. Every edge leaving a square is a labeled alternative the decision-maker can pick. Howard Raiffa's Decision Analysis (1968) fixed this convention and it has held for sixty years.",
    },
    {
      selector: "chance-node",
      label: "Chance node (circle)",
      explanation:
        "A circle marks a point where nature chooses. Edges leaving a circle must carry probabilities that sum to one across the fan. The priors are the analyst's — a decision tree makes the assumptions auditable, which is most of its value.",
    },
    {
      selector: "probability-edge",
      label: "Probability edge",
      explanation:
        "Edges out of a chance node are labeled with probabilities; edges out of a decision node are labeled with the choice name. Never relabel an edge with a payoff — payoffs live on the terminal leaves, not the branches.",
    },
    {
      selector: "terminal-leaf",
      label: "Terminal leaf",
      explanation:
        "Triangles on the right hold terminal payoffs — the scenario's final value in whatever unit matters (dollars, utils, lives saved). Every root-to-leaf path is one complete scenario; the set of paths is the set of futures the model admits.",
    },
    {
      selector: "expected-value",
      label: "Expected-value annotation",
      explanation:
        "The rolled-up expected value at a chance node is its children weighted by probability. Write it next to the node during backward induction so the comparison at the parent decision is visible, not hidden.",
    },
    {
      selector: "shape-legend",
      label: "Shape convention",
      explanation:
        "Squares, circles, and triangles are a fixed visual vocabulary — swapping them breaks the form. This is also what distinguishes a decision tree from a machine-learning decision tree, which looks similar but encodes splits on feature values, not human choices.",
    },
  ],
};
