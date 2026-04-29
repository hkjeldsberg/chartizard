import type { LiveChart } from "@/content/chart-schema";

export const umlStateDiagram: LiveChart = {
  id: "uml-state-diagram",
  name: "UML State Diagram",
  family: "flow",
  sectors: ["software"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Harel statechart — rounded states, labelled transitions, and composite (nested) states for hierarchy.",
  whenToUse:
    "Reach for a statechart when an object's behaviour depends on a named mode that changes in response to events, and especially when a flat finite state machine would explode combinatorially. A plain FSM is fine when the set of states is small and independent; a statechart earns its complexity when you need hierarchy (a sub-machine inside a state), orthogonal concurrent regions, or shared sub-states across many parents.",
  howToRead:
    "Each rounded rectangle is a state; the filled dot with an arrow marks where the machine starts. Directed arrows are transitions labelled event [guard] / action — the event triggers it, the bracketed guard must hold, and the slash-action fires as the arrow is traversed. A self-loop means the state reacts without leaving. The larger rounded rectangle with a small name-tab in its corner is a composite state: while the machine is in Processing, it is also in exactly one of the sub-states Picking or Packing. The bullseye marks a final state.",
  example: {
    title: "Order lifecycle with a nested Processing sub-machine",
    description:
      "David Harel introduced statecharts in 'Statecharts: A Visual Formalism for Complex Systems' (Science of Computer Programming, 1987) while designing the avionics for the Lavi fighter jet; the flat-FSM diagrams had grown past what any engineer could hold in their head. UML adopted the notation in 1997. An order-lifecycle example shows the payoff — Draft (with a self-loop on edit/save) → Submitted → Approved → Processing, where Processing is a composite state containing the Picking → Packing sub-machine. A flat FSM would need to enumerate Processing-Picking and Processing-Packing as separate peer states, and every shared transition out of Processing would have to be duplicated on both.",
  },
  elements: [
    {
      selector: "initial-state-marker",
      label: "Initial state marker",
      explanation:
        "The filled black circle with a short arrow names where the machine starts when the containing state is entered. It is not a state in its own right; it is a pseudo-state, and a diagram with no initial marker is ambiguous about where execution begins.",
    },
    {
      selector: "state",
      label: "State",
      explanation:
        "A named mode the object can occupy — drawn as a rounded rectangle. Harel's rule is that every state should describe a condition that is stable over some duration; a state you leave the same instant you enter it is almost always a transition in disguise.",
    },
    {
      selector: "composite-state",
      label: "Composite state",
      explanation:
        "A state that itself contains a sub-machine — the hallmark innovation over flat FSMs. While the machine is in Processing, it is simultaneously in exactly one of its sub-states. Any transition out of the composite applies from all its sub-states, which collapses the combinatorial cross-product of sub-states-times-exit-events that a flat FSM would have to enumerate.",
    },
    {
      selector: "sub-state",
      label: "Sub-state",
      explanation:
        "A state nested inside a composite — Picking and Packing live inside Processing. Sub-states can have their own initial marker, their own transitions, and their own sub-composites. Deep hierarchies are legal but expensive to read; two levels is usually the sweet spot.",
    },
    {
      selector: "transition",
      label: "Transition",
      explanation:
        "A directed arrow labelled event [guard] / action. The event fires the transition, the bracketed guard is a boolean that must hold, and the slash-action is a side-effect performed as the edge is traversed. Omitting the guard means the transition fires on every occurrence of the event; omitting the event means the transition fires on completion of the state's activity.",
    },
    {
      selector: "self-loop",
      label: "Self-loop",
      explanation:
        "A transition that leaves a state and re-enters the same state, drawn as a curved arc with distinct exit and entry tangent angles. Firing a self-loop still runs the state's exit and entry actions — this is how statecharts let a self-transition reset an internal timer or counter without needing a separate dummy state.",
    },
    {
      selector: "final-state",
      label: "Final state",
      explanation:
        "The bullseye (ringed filled circle) terminates the enclosing region. Once reached, no further transitions fire in that region. In a top-level statechart it ends the machine; inside a composite it completes that composite and fires any completion-event transitions leaving the composite's boundary.",
    },
  ],
};
