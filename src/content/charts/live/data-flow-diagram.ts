import type { LiveChart } from "@/content/chart-schema";

export const dataFlowDiagram: LiveChart = {
  id: "data-flow-diagram",
  name: "Data Flow Diagram (DFD)",
  family: "flow",
  sectors: ["software"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Traces how data moves through a system using three shapes: external entities, processes, and data stores, connected by labelled arrows.",
  whenToUse:
    "Use a DFD when the question is where data goes, not what decides the control flow. The diagram is for structured-analysis scoping — agreeing with stakeholders on the system's inputs, outputs, transformations, and stored state before anyone writes code. Pair it with a Control Flow Graph when the same system needs a control-view on the same page.",
  howToRead:
    "Rectangles on the edges are external entities — people or systems outside the scope. Circles inside the scope are processes, numbered in the order they're decomposed. The two parallel horizontal lines (no sides) are data stores, tagged D1, D2, and so on in the left gutter. Every arrow is labelled with the data that travels along it — an unlabelled DFD arrow is a bug, not a shortcut. Read the diagram by tracing the data, not by reading it top-to-bottom.",
  example: {
    title: "Online checkout, level-0 DFD",
    description:
      "A four-process DFD walks a customer cart through validation, payment, and confirmation: Submit Cart (1) writes to D1:Cart, Validate Payment (2) reads D1 and calls the Payment Gateway, Confirm Order (3) writes D2:Orders, Send Confirmation (4) reads D2 and returns to the customer. The same system rendered as a control-flow graph would look nothing like this — DFDs read data movement where CFGs read branching logic.",
  },
  elements: [
    {
      selector: "external-entity",
      label: "External entity (rectangle)",
      explanation:
        "A source or sink that lives outside the system boundary — a person, an upstream service, a regulator. Rectangles always sit on the periphery of a level-0 DFD; finding one in the middle of the chart means the scope is wrong.",
    },
    {
      selector: "process",
      label: "Process (circle)",
      explanation:
        "A transformation that takes one data flow in and produces another. Tom DeMarco drew these as circles in 1979; Chris Gane and Trish Sarson drew them as rounded rectangles the same year. Both notations survived — the shape matters less than the discipline of naming each process with an active verb.",
    },
    {
      selector: "data-store",
      label: "Data store (open-rectangle)",
      explanation:
        "Two parallel horizontal lines with no sides, tagged D1, D2, and so on in the left gutter. Data stores are persistent state — a database table, a queue, a file — and arrows into them write, arrows out of them read. A store with only inbound arrows is dead data; a store with only outbound arrows is a fixture.",
    },
    {
      selector: "data-flow",
      label: "Data flow (labelled arrow)",
      explanation:
        "Arrows are named by what travels along them — 'cart data', 'charge request', 'order details'. The label is non-negotiable: an unlabelled flow is the single most common DFD failure mode. Edward Yourdon's 1989 refinement added typed flows but kept the labelling rule.",
    },
    {
      selector: "process-number",
      label: "Process number",
      explanation:
        "Every process carries a number — 1, 2, 3, 4 at the top level — so a level-1 DFD can decompose process 2 into 2.1, 2.2, 2.3 and so on. The numbering is the bridge between a system sketched on one page and a specification broken across many.",
    },
    {
      selector: "level-0-scope",
      label: "Level-0 scope",
      explanation:
        "The dashed frame marks the system under design. Everything inside is something you build; everything outside is something you talk to. The level-0 DFD is also called the context diagram — its job is to make the system's boundary explicit before anyone argues about what it should do.",
    },
  ],
};
