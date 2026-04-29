import type { LiveChart } from "@/content/chart-schema";

export const umlActivityDiagram: LiveChart = {
  id: "uml-activity-diagram",
  name: "UML Activity Diagram",
  family: "flow",
  sectors: ["software"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Flowchart with concurrency primitives — fork and join bars, decision diamonds with guards, and swimlanes.",
  whenToUse:
    "Reach for an activity diagram when the process has genuine concurrency — steps that run in parallel and must synchronise before the flow continues. The 1970s flowchart has no vocabulary for this; activity diagrams add fork/join bars, guarded decisions, merge nodes, and partition swimlanes. Use a plain flowchart when the process is strictly sequential, a sequence diagram when the story is who-calls-whom over time, and a statechart when the object's mode of being is the subject.",
  howToRead:
    "Start at the filled circle and follow the arrows downward. Rounded rectangles are actions; the thick black bar with several outgoing edges is a fork (spawn parallel threads), and the matching bar with several incoming edges is a join (wait for all). Diamonds are decisions: every outgoing edge carries a condition in square brackets, e.g. [credit_ok]. The bullseye is the final node. Swimlane partitions indicate which actor or subsystem owns each action — a column labelled Warehouse owns everything plotted inside it.",
  example: {
    title: "Order fulfilment with a Warehouse / Billing parallel region",
    description:
      "The OMG standardised activity diagrams in UML 2.0 (2005), consolidating ideas from SDL and Petri nets dating to the 1960s. A canonical fork/join example is order fulfilment: after Place Order, Reserve Inventory and Charge Card run in parallel on separate teams, and only once both complete does the flow reach the payment-success decision — ship on [credit_ok], cancel on [declined], then merge to the final node. A flowchart of the same process forces a serial ordering that falsifies the real concurrency.",
  },
  elements: [
    {
      selector: "initial-node",
      label: "Initial node",
      explanation:
        "A solid filled circle marks where the activity begins. UML permits exactly one initial node per activity; its single outgoing edge fires immediately when the activity is invoked. The flowchart's oval is more forgiving — activity diagrams inherit the stricter Petri-net discipline.",
    },
    {
      selector: "action-node",
      label: "Action node",
      explanation:
        "A rounded-corner rectangle is an action — an atomic unit of behaviour. Name it verb-first ('Place Order', not 'Order Placement'). Actions execute when a token arrives on every incoming edge; this token-passing semantics is inherited from Petri nets and is what lets fork/join work correctly without a central scheduler.",
    },
    {
      selector: "fork-bar",
      label: "Fork bar",
      explanation:
        "A thick black horizontal bar with one incoming edge and several outgoing edges. Splits the single control token into multiple concurrent tokens — every outgoing branch starts running. Fork bars are the defining addition over 1970s flowcharts, which can only express sequential branching.",
    },
    {
      selector: "join-bar",
      label: "Join bar",
      explanation:
        "The mirror of a fork: a thick black bar with several incoming edges and one outgoing edge. The join waits until a token has arrived on every incoming branch, then emits a single token downstream. A join without a matching fork leaks tokens; a fork without a matching join races.",
    },
    {
      selector: "decision-guard",
      label: "Decision with guard",
      explanation:
        "A diamond with two or more outgoing edges, each labelled with a boolean condition in square brackets — [credit_ok], [declined]. Exactly one guard must be true at runtime or the model is ill-formed. Bracket syntax distinguishes a guard (decides which edge fires) from an action (fires as the edge is traversed) under the standard event [guard] / action form.",
    },
    {
      selector: "swimlane-partition",
      label: "Swimlane partition",
      explanation:
        "A vertical band assigning every action inside it to one actor, role, or subsystem — Warehouse, Billing, Customer. Partitions answer 'who does this step?' and are the cheapest way to spot a step that has drifted into the wrong team's responsibility. UML also permits horizontal and two-dimensional partitions.",
    },
    {
      selector: "final-node",
      label: "Final node",
      explanation:
        "The bullseye (ringed filled circle) at the bottom terminates the activity — all remaining tokens are destroyed. UML distinguishes an activity-final (ends the whole activity) from a flow-final (ends just this branch); the bullseye is the former. An activity with no final node has no defined terminus.",
    },
  ],
};
