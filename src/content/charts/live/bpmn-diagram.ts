import type { LiveChart } from "@/content/chart-schema";

export const bpmnDiagram: LiveChart = {
  id: "bpmn-diagram",
  name: "BPMN Diagram",
  family: "flow",
  sectors: ["business"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Business Process Model and Notation — a fixed vocabulary for drawing a business process so the diagram doubles as an executable workflow.",
  whenToUse:
    "Reach for BPMN when a process needs to be both read by a business analyst and run by a workflow engine. The notation is standardised by OMG, so a well-drawn BPMN diagram is unambiguous about where work branches, waits, and escalates — the shapes carry the semantics, not the prose around them.",
  howToRead:
    "Start at the thin-stroke circle on the left edge of the pool and follow the solid sequence-flow arrows. Rounded rectangles are activities (work performed); diamonds are gateways (routing choices), with the glyph inside naming the type — × for exclusive, + for parallel, ○ for inclusive. Double-stroke circles are intermediate events that fire mid-process; the thick-stroke circle on the right edge is the end. A single labelled swimlane pool groups everything by the participant responsible for the work.",
  example: {
    title: "OMG BPMN 2.0, 2011 — an expense-approval process",
    description:
      "OMG released BPMN 1.0 in 2004, drafted by Stephen White at IBM; version 2.0 (2011) added an executable meta-model, meaning the same diagram that describes the process to the business can also generate the BPEL (and now BPMN-native) workflow that runs it. The chart shown here is a textbook expense approval: submit, split on amount-threshold, auto-approve or manager-review, then merge and post to the ledger. The attached timer intermediate event on Manager Review is the escalation rule — three days of inactivity and the process jumps past the reviewer. This is where BPMN diverges from this catalog's UML Activity Diagram: both use rounded activities and diamonds, but BPMN targets the business-analyst/developer handshake and types its gateways, while UML Activity targets software engineers and leaves decision semantics implicit.",
  },
  elements: [
    {
      selector: "pool",
      label: "Pool (swimlane)",
      explanation:
        "The outer rectangle with the vertical label strip. A pool represents a single participant or organisation — here, Accounting. Message flows cross pools; sequence flows do not. A BPMN diagram with no pool is informal sketching, not BPMN.",
    },
    {
      selector: "start-event",
      label: "Start event",
      explanation:
        "A thin-stroke circle on the left edge of the pool. It marks where the process begins and almost always carries a label naming the trigger (an expense submission, a customer request). Every well-formed process has exactly one unambiguous start.",
    },
    {
      selector: "activity",
      label: "Activity",
      explanation:
        "A rounded rectangle representing work performed. The icon in the top-left names the task type — user task (a human does it), service task (an API call), script, manual. Activities are the only elements the process engine actually executes; everything else routes, signals, or terminates.",
    },
    {
      selector: "exclusive-gateway",
      label: "Exclusive gateway",
      explanation:
        "A diamond with an × glyph. The process takes exactly one of the outgoing branches based on a condition evaluated against process data. Parallel gateways (+) fire all branches; inclusive gateways (○) fire any branch whose condition holds. The glyph is load-bearing — a diamond without one is ambiguous.",
    },
    {
      selector: "intermediate-event",
      label: "Intermediate event",
      explanation:
        "A double-stroke circle. When attached to an activity's border (as the timer here is), it catches an event fired during the activity — a timeout, an error, a message — and diverts flow. This is how BPMN expresses escalation without an explicit if-then branch.",
    },
    {
      selector: "end-event",
      label: "End event",
      explanation:
        "A thick-stroke circle on the right edge of the pool. The stroke weight is the only thing distinguishing it from a start event in a monochrome diagram, which is why BPMN renderers that lighten line weight for aesthetic reasons break the spec.",
    },
    {
      selector: "sequence-flow",
      label: "Sequence flow",
      explanation:
        "A solid directed line with a filled arrowhead. It says: when the source completes, the target begins. Sequence flows cannot cross pool boundaries — a dashed message flow does that job instead.",
    },
  ],
};
