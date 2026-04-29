import type { LiveChart } from "@/content/chart-schema";

export const swotAnalysis: LiveChart = {
  id: "swot-analysis",
  name: "SWOT Analysis",
  family: "comparison",
  sectors: ["business"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A 2×2 matrix that sorts strategic factors by internal/external origin and positive/negative effect.",
  whenToUse:
    "Use a SWOT when a team needs to audit its strategic position before a decision — a pricing change, a market entry, an acquisition. The grid is the point: it forces the group to fill all four cells, which stops the common failure where leadership lists strengths at length and fails to name a single weakness. If the question is 'which option do we pick?' reach for a decision matrix instead; SWOT diagnoses, it does not choose.",
  howToRead:
    "Read the grid as two axes. The vertical split separates internal factors you control (top row: strengths, weaknesses) from external factors you do not (bottom row: opportunities, threats). The horizontal split separates helpful from harmful. Cells in the same column share valence — the left column is what's working, the right column is what isn't. A balanced SWOT has three to five items per cell; empty cells or overflow cells both signal the analysis isn't finished.",
  example: {
    title: "Mid-market SaaS preparing an enterprise push",
    description:
      "A Series-B SaaS running its annual strategy offsite fills the grid: brand loyalty and profitable unit economics in strengths, an aging tech stack and thin mobile presence in weaknesses, AI features and EU expansion in opportunities, a new well-funded competitor and app-store platform risk in threats. The framework dates to Albert Humphrey's SRI research in the 1960s, and its longevity is earned — the grid's shape is the diagnostic, because a blank weaknesses cell is visible at a glance in a way that a missing bullet in a linear list is not.",
  },
  elements: [
    {
      selector: "strengths-cell",
      label: "Strengths (top-left)",
      explanation:
        "Internal factors that help — capabilities, assets, and advantages the organization owns. Keep items concrete and defensible: 'net-revenue retention above 115%' beats 'great customer relationships'. A strength that can't be evidenced is a belief, not a finding.",
    },
    {
      selector: "weaknesses-cell",
      label: "Weaknesses (top-right)",
      explanation:
        "Internal factors that hurt — gaps, debts, and constraints under the organization's control. This is the cell teams flinch from; a SWOT that lists three strengths and one weakness is almost always a SWOT that hasn't been run honestly. List real weaknesses you could fix, not rhetorical ones.",
    },
    {
      selector: "opportunities-cell",
      label: "Opportunities (bottom-left)",
      explanation:
        "External factors that help — market shifts, unmet demand, regulatory tailwinds. These are conditions in the environment, not actions you'd take; 'launch an AI feature' belongs in a roadmap, whereas 'generative AI is reshaping buyer expectations' belongs here.",
    },
    {
      selector: "threats-cell",
      label: "Threats (bottom-right)",
      explanation:
        "External factors that hurt — competitors, regulatory pressure, platform risk. Threats the team can't influence are still worth naming, because the analysis feeds contingency planning. Pair each threat with the internal weakness it exploits when you move to the TOWS step.",
    },
    {
      selector: "internal-external-axis",
      label: "Internal vs external (vertical split)",
      explanation:
        "The horizontal divider separates factors the organization controls from factors it does not. Miscategorization here is the most common SWOT error — 'we have a small sales team' is internal (weakness), while 'the buying cycle is getting longer' is external (threat). Getting this split right is what distinguishes strategy from complaint.",
    },
    {
      selector: "positive-negative-axis",
      label: "Positive vs negative (horizontal split)",
      explanation:
        "The vertical divider separates helpful from harmful factors. The structural symmetry is the point: every strength has a latent weakness, every opportunity implies a threat to those who fail to move. The grid is how the reader sees both sides of each axis at once.",
    },
  ],
};
