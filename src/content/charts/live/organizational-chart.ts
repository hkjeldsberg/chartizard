import type { LiveChart } from "@/content/chart-schema";

export const organizationalChart: LiveChart = {
  id: "organizational-chart",
  name: "Organizational Chart",
  family: "hierarchy",
  sectors: ["business"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Draws reporting relationships as a top-down tree of boxes. The first artefact a new hire reads, and almost always incomplete.",
  whenToUse:
    "Reach for an org chart when you need to communicate the formal reporting structure — who-reports-to-whom on the HR record. Use it for onboarding, role-change announcements, and scope reviews. Do not use it to argue about how work actually gets done.",
  howToRead:
    "The root at the top is authority; distance downward is depth in the hierarchy. A solid line is a direct report. A dashed line — the 'dotted line' — is a secondary reporting relationship, usually where accountability crosses a functional boundary. Wide branches show spans of control: a VP with seven directors is doing something structurally different from one with two.",
  example: {
    title: "A 16-person company reporting tree, with one dotted line",
    description:
      "CEO → four VPs (Engineering, Product, Sales, Finance) → eleven directors. Engineering's VP has four directs; Finance's has two. Revenue Ops sits under Finance on the HR record but reports dotted-line to the VP of Sales — because the metrics it owns are the Sales team's. The chart is truthful about the boxes, but the dotted line is where the real work lives.",
  },
  elements: [
    {
      selector: "root-node",
      label: "Root (CEO)",
      explanation:
        "The top of an org chart is the final authority — no one reports up from here inside the unit being drawn. Every other box's position is defined relative to it.",
    },
    {
      selector: "mid-level",
      label: "Mid-level (VP)",
      explanation:
        "A VP sits between the root and the leaves. Their span of control — how many directs fan out underneath — is one of the few structural signals the chart actually carries honestly.",
    },
    {
      selector: "leaf-node",
      label: "Leaf (Director)",
      explanation:
        "Leaves are terminals of the HR record at the chart's scope, not literally the bottom of the company — most directors have their own teams that have been elided here. The chart's level of detail is an editorial choice.",
    },
    {
      selector: "dotted-line",
      label: "Dotted-line relationship",
      explanation:
        "A dashed edge marks a secondary reporting relationship — influence, accountability, or shared objectives that cross the solid-line hierarchy. Revenue Ops reports to Finance on the HR record but to Sales on the metrics that matter. The dotted line is where the form admits the work is more complicated than the boxes.",
    },
    {
      selector: "tree-direction",
      label: "Top-down = authority",
      explanation:
        "Growing a tree downward is a convention — authority at the top, execution at the bottom. Flip the tree upside-down and it's the same data but reads like a rebellion. The direction carries meaning the ink doesn't.",
    },
    {
      selector: "span-of-control",
      label: "Span of control",
      explanation:
        "The fan-out at each level is the one quantitative signal the chart carries. Engineering's VP has four directs; Finance's has two. Equal-looking VP roles often have very unequal structural loads, and an honest chart lets you see that at a glance.",
    },
  ],
};
