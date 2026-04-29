import type { LiveChart } from "@/content/chart-schema";

export const quadrantChart: LiveChart = {
  id: "quadrant-chart",
  name: "Quadrant Chart",
  family: "comparison",
  sectors: ["business"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Plots items on two continuous axes and names the four resulting regions, turning a scatter into a decision rule.",
  whenToUse:
    "Use a quadrant chart when every item you're weighing deserves to be rated on exactly two axes, and the decision you want the reader to make is categorical — do it, do it later, don't do it. Effort-vs-impact backlogs, risk-vs-likelihood registers, and priority-vs-urgency queues all fit this shape.",
  howToRead:
    "Scan the corners first, not the points. Each quadrant is a named strategy, and a dot's membership — not its exact coordinates — is the punchline. The central axis-crossing is an implicit zero: every placement is a claim about whether an item sits above or below the median on each axis. The bubble version, where a third dimension is encoded as circle size, is a quadrant chart's slippery cousin — that third encoding usually blurs the 2×2 story the quadrants exist to tell.",
  example: {
    title: "Product backlog prioritisation — 15 candidate initiatives",
    description:
      "A product team rates 15 candidate features on effort and impact, then places them on a quadrant chart for the quarterly planning meeting. The Quick Wins column fills with copy changes and small UX fixes; Major Projects hold the mobile app and SSO; two items end up clearly labelled Time Sinks — which is the whole point of drawing the grid, because until they are rendered in that quadrant no one has to admit it out loud.",
  },
  elements: [
    {
      selector: "quadrant-label",
      label: "Quadrant label",
      explanation:
        "Each corner is a named strategy, not a range of values. The label is what makes a quadrant chart a decision tool rather than a scatter with tinted corners — you're asking the reader to choose a verb for each region.",
    },
    {
      selector: "initiative-point",
      label: "Initiative",
      explanation:
        "One item on the backlog. Position is a two-axis rating, but the quadrant is the conclusion. Resist the urge to add a third encoding via bubble size — it turns the 2×2 read into a three-variable scatter and buries the decision rule.",
    },
    {
      selector: "example-initiative",
      label: "Example Quick Win",
      explanation:
        "A labelled Quick Win — low effort, high impact, the quadrant every stakeholder wants to claim. Labelling even one point per quadrant makes the chart legible without a legend.",
    },
    {
      selector: "axis-crossing",
      label: "Axis crossing",
      explanation:
        "The implicit zero. The quadrant chart has no origin in the usual sense — the centre is a median or a judgement call, and every placement is relative to it. Move the crossing and the whole story changes, which is why quadrant charts reward opinionated cut-points.",
    },
    {
      selector: "x-axis",
      label: "Effort axis",
      explanation:
        "The horizontal dimension. A quadrant chart spends exactly one axis on this — no heroic three-variable encoding, no logarithmic rescue. The simplification is the value.",
    },
    {
      selector: "y-axis",
      label: "Impact axis",
      explanation:
        "The vertical dimension. Paired with effort, it produces a quarterly decision rule: do the top-left, plan the top-right, fill the bottom-left, refuse the bottom-right. If the y-axis of your business problem isn't really a single quantity, a 2×2 matrix is the wrong tool.",
    },
  ],
};
