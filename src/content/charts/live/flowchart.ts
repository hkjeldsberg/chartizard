import type { LiveChart } from "@/content/chart-schema";

export const flowchart: LiveChart = {
  id: "flowchart",
  name: "Flowchart",
  family: "flow",
  sectors: ["flow"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Encodes a process as shapes and directed arrows — ovals begin and end, rectangles act, diamonds branch.",
  whenToUse:
    "Use a flowchart when the thing you're documenting is a decision-bearing process: something that has steps, branches, and an end state. If the diagram has no decisions, a numbered list is clearer. If it has loops, dependencies, or swim-lanes, consider a BPMN or UML activity diagram instead.",
  howToRead:
    "Start at the oval and follow the arrows. Rectangles are actions the system or user performs; diamonds are decisions whose outgoing edges are labelled with the condition (usually YES/NO). A dashed edge is a loop — the process is meant to run again under that branch. The chart's discipline is its shape vocabulary: three shapes, consistently used, is what separates a flowchart from a doodle.",
  example: {
    title: "User-login with 2FA and retry-on-failure",
    description:
      "A login flow maps cleanly onto the canonical three shapes: enter credentials (oval), validate password (rectangle), match? (diamond) — with a dashed loop back when the hash check fails. The chart's lineage traces to Frank Gilbreth's 1921 process charts, and the reason it still works a century later is that every edge is labelled and every shape carries exactly one meaning.",
  },
  elements: [
    {
      selector: "terminator",
      label: "Terminator (oval)",
      explanation:
        "An oval marks a start or end state. A flowchart should have exactly one start and at least one end; multiple starts are almost always a sign the process hasn't been scoped yet.",
    },
    {
      selector: "process-node",
      label: "Process (rectangle)",
      explanation:
        "Rectangles are actions — something the system or a user performs. Keep the verb first: 'Validate password hash', not 'Password validation'. If a rectangle has more than one outgoing arrow without a diamond in between, you've hidden a decision.",
    },
    {
      selector: "decision-node",
      label: "Decision (diamond)",
      explanation:
        "Diamonds branch the flow. Every diamond must have at least two outgoing edges, each labelled with the condition that takes you down that path. If only one branch is interesting, you don't need a diamond — just a rectangle.",
    },
    {
      selector: "flow-arrow",
      label: "Flow arrow",
      explanation:
        "Arrows impose direction and ordering. Flowcharts conventionally flow top-to-bottom or left-to-right; mixing directions in one chart forces the reader to re-orient at every edge.",
    },
    {
      selector: "branch",
      label: "Branch label",
      explanation:
        "The YES/NO tag on a decision's outgoing edge tells the reader which condition takes this path. Unlabelled branches are the single most common flowchart failure mode — the diagram looks right but means nothing.",
    },
    {
      selector: "loop",
      label: "Loop (dashed retry)",
      explanation:
        "A dashed edge returns the flow to an earlier step. Dashing distinguishes 'go back and try again' from the forward process path, so the reader sees at a glance which edges are retries versus progress.",
    },
    {
      selector: "shape-vocabulary",
      label: "Shape vocabulary",
      explanation:
        "Disciplined flowcharts use three shapes only: oval, rectangle, diamond. Adding cylinders, parallelograms, or subroutine boxes collapses the reader's ability to skim — every extra shape is a new rule to learn.",
    },
  ],
};
