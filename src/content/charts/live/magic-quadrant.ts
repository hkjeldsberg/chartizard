import type { LiveChart } from "@/content/chart-schema";

export const magicQuadrant: LiveChart = {
  id: "magic-quadrant",
  name: "Magic Quadrant",
  family: "comparison",
  sectors: ["business"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Gartner's trademarked 2×2: Completeness of Vision against Ability to Execute, with vendors sorted into Leaders, Challengers, Visionaries, and Niche Players.",
  whenToUse:
    "Use a Magic Quadrant when the audience is a procurement committee choosing a vendor and you want them to reach the same shortlist you already reached. It is a genre of argument dressed as a chart: two scores, four named fates, and a persistent institutional hand on the ruler. Outside that specific context, a plain labelled scatter is almost always the honest move.",
  howToRead:
    "The x-axis is Completeness of Vision (left low, right high) and the y-axis is Ability to Execute (bottom low, top high). The plot area is carved into four named quadrants: Leaders top-right, Challengers top-left, Visionaries bottom-right, Niche Players bottom-left. Read a vendor's position relative to the cross-hairs at the centre rather than in absolute terms — the two axis scores are composite indices whose component weights Gartner does not publish, so the ordering inside a quadrant is softer than it looks.",
  example: {
    title: "Gartner Magic Quadrant, Stamford CT, 1980s onward",
    description:
      "Gartner Group popularised the Magic Quadrant in the late 1980s and still trademarks the phrase — vendors licence the right to republish their dot. The format's persistent critique, going back at least to a 2012 ruling in ZL Technologies v. Gartner, is structural: the two axes are opaque composites and being designated a 'Leader' correlates closely with being a Gartner advisory client. The chart is simultaneously methodology and business model.",
  },
  elements: [
    {
      selector: "leaders-quadrant",
      label: "Leaders quadrant",
      explanation:
        "Top-right: vendors rated high on both axes. The canonical outcome the chart is organised to produce. Most readers' eyes land here first, which is the intended reading order and the load-bearing reason the quadrant is drawn top-right rather than anywhere else.",
    },
    {
      selector: "vendor-bubble",
      label: "Vendor bubble",
      explanation:
        "Each dot is one vendor, placed by its (Vision, Execute) score. Gartner charges the named vendor for the right to reprint its own bubble in marketing materials — the bubble is the product being sold as much as the analysis is.",
    },
    {
      selector: "cross-hairs",
      label: "Cross-hairs",
      explanation:
        "The two dividing lines meet at the composite-scale midpoint and define quadrant membership. A vendor just left of centre is a Challenger; the same vendor shifted three pixels right is a Leader. This is where the trademark earns its keep — the cross-hair promotion is the transaction.",
    },
    {
      selector: "vision-axis",
      label: "Completeness of Vision",
      explanation:
        "Horizontal axis: Gartner's composite score of strategy, market understanding, innovation, and roadmap. The component weights are not published. Treat positions as ordinal within a quadrant and reject any attempt to read precise ratios.",
    },
    {
      selector: "execute-axis",
      label: "Ability to Execute",
      explanation:
        "Vertical axis: a second composite, this time of product viability, sales execution, customer experience, and operations. Because both axes are composites, moving a vendor up-and-right is the result of a dozen reweighting choices no external reviewer can audit.",
    },
  ],
};
