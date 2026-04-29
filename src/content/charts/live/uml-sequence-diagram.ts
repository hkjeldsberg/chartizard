import type { LiveChart } from "@/content/chart-schema";

export const umlSequenceDiagram: LiveChart = {
  id: "uml-sequence-diagram",
  name: "UML Sequence Diagram",
  family: "flow",
  sectors: ["software"],
  dataShapes: ["temporal"],
  tileSize: "W",
  status: "live",
  synopsis:
    "Traces one scenario's message choreography across named participants with time running down the page.",
  whenToUse:
    "Reach for a sequence diagram when the question is ordering: which component calls which, in what order, and what comes back. It's the UML complement to the class diagram — a class diagram captures static structure, a sequence diagram captures a single scenario's temporal behaviour. Use it to audit a login flow, reconstruct an incident, or spec an API handshake before code exists.",
  howToRead:
    "Participants sit across the top as boxed actors. Dashed lifelines drop from each and time flows top-to-bottom. Solid horizontal arrows are synchronous calls; dashed arrows are returns. The thin filled rectangles on a lifeline are activation bars — the participant is actively processing a call for as long as its bar is drawn. Rectangular fragments wrap groups of messages and name a branching operator (alt, opt, loop) on the tab.",
  example: {
    title: "Browser login across five services",
    description:
      "A canonical web-app login: Client POSTs credentials to WebServer, which asks AuthService to validate, which reads UserDB, verifies the hash, and writes a session to SessionStore before returning 200 OK with a Set-Cookie header. The diagram makes one thing visible that prose can't — that AuthService's activation bar spans the full credential check, so a timeout there stalls every login regardless of which downstream service is the actual culprit.",
  },
  elements: [
    {
      selector: "participant",
      label: "Participant",
      explanation:
        "A named actor across the top — typically a component, service, or role. Keep the count to roughly seven, ordered left-to-right by who initiates (client on the left, deepest dependency on the right). An unnamed lifeline is useless; if you can't name it, you don't understand the scenario.",
    },
    {
      selector: "lifeline",
      label: "Lifeline",
      explanation:
        "The dashed vertical drop beneath each participant. Its only job is to provide a timeline — time runs down the page, so vertical distance between two arrows is the scenario's order, not its duration.",
    },
    {
      selector: "sync-message",
      label: "Synchronous message",
      explanation:
        "A solid horizontal arrow from caller to callee. The caller blocks until a return arrives, so the arrow's tail marks the moment the caller went quiet and its activation bar began stretching.",
    },
    {
      selector: "return-message",
      label: "Return message",
      explanation:
        "A dashed horizontal arrow carrying the reply back to the caller. Returns are often omitted for brevity, but dropping them leaves ambiguity about when the caller resumes — draw them when the order of completions matters.",
    },
    {
      selector: "activation-bar",
      label: "Activation bar",
      explanation:
        "The thin filled rectangle riding a lifeline while a participant is actively processing a call. Its height equals the call's duration in scenario-time. Nested bars on the same lifeline mean recursive or re-entrant calls.",
    },
    {
      selector: "combined-fragment",
      label: "Combined fragment",
      explanation:
        "A rectangular wrapper around one or more messages, named on its tab: alt for branching, opt for conditional, loop for repetition, par for parallel. UML 2.0 added these so one diagram can encode branching behaviour — without them, each branch would need its own separate diagram.",
    },
  ],
};
