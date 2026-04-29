import type { LiveChart } from "@/content/chart-schema";

export const finiteStateMachine: LiveChart = {
  id: "finite-state-machine",
  name: "Finite State Machine",
  family: "flow",
  sectors: ["software"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Models behaviour as a finite set of named states connected by labelled transitions fired on events.",
  whenToUse:
    "Reach for a finite state machine when behaviour is genuinely stateful — a UI component, a network protocol, a parser, a game entity — and the set of distinct states is small and nameable. Warren McCulloch and Walter Pitts formalised neurons as state machines in 1943; Stephen Kleene proved the Chomsky-hierarchy correspondence in 1956. A language is regular if and only if an FSM can recognise it. When the diagram starts exploding into dozens of states for a moderately complex UI, the fix is a statechart (David Harel, 1987) — hierarchical states and orthogonal regions compress the combinatorial blowup.",
  howToRead:
    "Each rounded-rectangle node is a state. The filled black dot marks the initial state and the double-border state is accepting or terminal. Directed arrows are transitions, labelled in event [guard] / action form: the machine must be in the source state and see the event, the guard must evaluate true, the action fires, and the machine moves to the target state. A self-loop means the state responds to an event without leaving — useful for timers, retries, or side-effects that don't change state.",
  example: {
    title: "Async request with retry",
    description:
      "The vocabulary every front-end data layer reinvents: Idle → Loading on request, Loading → Success on 200, Loading → Error on 4xx/5xx, Error → Retrying on retry guarded by attempt count, Retrying → Loading on fire, and reset edges home to Idle. Libraries like XState and Redux Toolkit Query externalise exactly this diagram so the component tree stops inventing private ad-hoc booleans for isLoading and hasError.",
  },
  elements: [
    {
      selector: "state",
      label: "State",
      explanation:
        "A named mode the machine can occupy — at any moment the machine is in exactly one state. Pick names that describe what the system is currently doing, not the event that got it there.",
    },
    {
      selector: "initial-state",
      label: "Initial state",
      explanation:
        "The filled black dot with an arrow into a state marks where the machine starts. Every FSM has exactly one initial state; omitting it leaves the diagram ambiguous about which edges are reachable from the start.",
    },
    {
      selector: "accepting-state",
      label: "Accepting state",
      explanation:
        "Drawn with a second inner border. In a language-recognition FSM it means the input was accepted; in a behaviour FSM it marks a terminal or success state where no further transitions are required.",
    },
    {
      selector: "transition",
      label: "Transition",
      explanation:
        "A directed arrow from source state to target state. The machine traverses it only when the labelled event arrives and its guard holds. Multiple outgoing edges with overlapping guards make the machine nondeterministic — usually a modelling bug.",
    },
    {
      selector: "self-loop",
      label: "Self-loop",
      explanation:
        "An arrow that leaves a state and re-enters the same state. The machine reacts to the event — often by firing an action like a timer reset or counter bump — without changing state.",
    },
    {
      selector: "guard-action",
      label: "Guard and action",
      explanation:
        "The full edge-label form is event [guard] / action. The guard is a boolean predicate over state data; without it, an edge would fire on every occurrence of the event. The action is a side-effect the machine performs as it traverses the edge.",
    },
  ],
};
