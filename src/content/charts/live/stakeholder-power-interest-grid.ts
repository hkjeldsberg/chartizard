import type { LiveChart } from "@/content/chart-schema";

export const stakeholderPowerInterestGrid: LiveChart = {
  id: "stakeholder-power-interest-grid",
  name: "Stakeholder Power–Interest Grid",
  family: "comparison",
  sectors: ["business", "project-management"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Mendelow's 1991 2×2 that routes communication effort by plotting each stakeholder's power against their interest.",
  whenToUse:
    "Use the Power–Interest Grid at the start of a project, a change programme, or any initiative where different audiences will react differently to the same update. It answers a narrow question — who gets which cadence and depth of communication — by asking two others first: how much power does this person have over the outcome, and how much do they care.",
  howToRead:
    "Read the quadrant a stakeholder lands in, not their coordinates. Each corner maps to a verb: Manage Closely (high power, high interest), Keep Satisfied (high power, low interest — don't overload them), Keep Informed (low power, high interest — your champions and affected users), and Monitor with minimum effort (low power, low interest). The grid is a routing diagram disguised as a comparison chart — what matters is which box every name sits in, because that box is the communication plan.",
  example: {
    title: "Pre-launch stakeholder map for a B2B SaaS release",
    description:
      "A project manager running a migration to a new billing platform maps twelve stakeholders — CEO, CTO, VP Engineering, Board, Regulator, two pilot customers, the PR firm, a junior analyst, and a couple of watchers — onto a Power–Interest Grid. The CEO and CTO end up in Manage Closely and get a Friday synchronous review; the Board sits in Keep Satisfied and receives a two-paragraph monthly note; pilot customers in Keep Informed get release notes and a Slack channel. The grid's job is to prevent the default failure mode of sending everyone the same update.",
  },
  elements: [
    {
      selector: "stakeholder-point",
      label: "Stakeholder (CEO)",
      explanation:
        "One name, one dot. The CEO lands in Manage Closely — high power and high interest — so the communication plan for this stakeholder is a named owner, a recurring review, and early notice of every material change.",
    },
    {
      selector: "manage-closely-quadrant",
      label: "Manage Closely",
      explanation:
        "High power, high interest. Executives, project sponsors, the engineering leads who can both help and hurt. They expect context, frequency, and the chance to redirect before decisions ship. Everyone in this quadrant should have an owner inside the project team.",
    },
    {
      selector: "keep-informed-quadrant",
      label: "Keep Informed",
      explanation:
        "Low power, high interest — your champions, affected users, and external partners who care deeply but cannot change the plan. Under-communicating with this quadrant is how projects end up with angry Reddit threads and blindsided customers. Release notes, office hours, and a place to file feedback are the usual answer.",
    },
    {
      selector: "quadrant-dividers",
      label: "Quadrant dividers",
      explanation:
        "The horizontal and vertical cut-lines through the middle. Moving either line reshuffles the entire map — which is why the grid rewards defending the cut-points explicitly. Are you above the power line only if you can veto the project, or also if you can delay it by a quarter? The dividers are where the editorial judgement lives.",
    },
    {
      selector: "power-axis",
      label: "Power axis",
      explanation:
        "Horizontal. Power here is specifically influence over this project's outcome — not seniority, not headcount. A Regulator with no knowledge of the release still has high power because they can stop it. A CEO on sabbatical can have surprisingly low power for the duration.",
    },
    {
      selector: "interest-axis",
      label: "Interest axis",
      explanation:
        "Vertical. Interest is how much this stakeholder cares about the outcome, not how much they know. A pilot customer may have low knowledge of your roadmap but very high interest — treat them like a Keep Informed channel, not a Monitor one.",
    },
  ],
};
