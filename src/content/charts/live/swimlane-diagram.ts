import type { LiveChart } from "@/content/chart-schema";

export const swimlaneDiagram: LiveChart = {
  id: "swimlane-diagram",
  name: "Swimlane Diagram",
  family: "flow",
  sectors: ["business"],
  dataShapes: ["network"],
  tileSize: "W",
  status: "live",
  synopsis:
    "Partitions a process flowchart into horizontal lanes, one per role, so every step carries its owner as part of its position.",
  whenToUse:
    "Reach for a swimlane when a process crosses functions and the handoffs between roles are the thing you need to examine. A plain flowchart hides who owns each step; a swimlane makes that ownership unavoidable. Use it for cross-functional procedures, service blueprints, and any review where 'who does this?' is the question being asked.",
  howToRead:
    "Each horizontal lane is one role; each box is one step, placed in the lane of the responsible actor and at its position in the sequence. Follow arrows left to right. A same-lane arrow is routine — the role owns both ends. A cross-lane arrow is a handoff: the step that originates it leaves this role's scope and another role picks it up. Count the cross-lane arrows: each one is a place where the process can stall or lose information between teams.",
  example: {
    title: "Order fulfillment across Customer, Sales, Engineering, Finance",
    description:
      "Swimlanes were invented by Geary Rummler and Alan Brache in the late 1980s to map GM and Ford production workflows, then standardised as 'pools and lanes' in the OMG's BPMN 2.0 spec (2011). A cross-functional order-fulfillment flow is the canonical teaching example: the same order moves through five lanes, and the chart's job is to make the four or five cross-lane handoffs visually loud. A Toyota kaizen team reading this diagram counts the handoffs first and reads the step labels second — each handoff is a candidate for elimination.",
  },
  elements: [
    {
      selector: "lane",
      label: "Lane",
      explanation:
        "A horizontal band that represents one role, team, or system. Every step placed inside a lane is owned by that role. Lanes are the chart's organising unit — without them, the diagram is just a flowchart.",
    },
    {
      selector: "box",
      label: "Process step",
      explanation:
        "A single activity performed by the lane's owner. Positioned left-to-right along the time axis and vertically inside the owning lane. Two boxes at the same time column in different lanes represent parallel work — a handoff, not a sequence.",
    },
    {
      selector: "cross-lane-handoff",
      label: "Cross-lane handoff",
      explanation:
        "An arrow whose endpoints sit in different lanes. This is the chart's signature encoding and the reason a swimlane beats a flowchart for cross-functional analysis. Every cross-lane arrow is a transfer of responsibility and a known risk point for delay, dropped context, or duplicated effort.",
    },
    {
      selector: "same-lane-arrow",
      label: "Same-lane arrow",
      explanation:
        "An arrow whose endpoints sit in the same lane. The routine case — no transfer of ownership, no cross-team communication needed. Same-lane arrows should outnumber cross-lane arrows in a healthy process.",
    },
    {
      selector: "lane-divider",
      label: "Lane divider",
      explanation:
        "The horizontal rule between two lanes. A cross-lane arrow must bend around it, which is why the bent elbow is the visual signature of role transfer. The divider is structural, not decorative.",
    },
    {
      selector: "role-label",
      label: "Role label",
      explanation:
        "The name of the role, team, or system that owns this lane, printed at the left. Roles should be specific enough that a reader can point at a step and name the responsible person or team; generic labels like 'Back office' defeat the chart's purpose.",
    },
  ],
};
