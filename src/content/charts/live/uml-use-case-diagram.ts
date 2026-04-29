import type { LiveChart } from "@/content/chart-schema";

export const umlUseCaseDiagram: LiveChart = {
  id: "uml-use-case-diagram",
  name: "UML Use Case Diagram",
  family: "relationship",
  sectors: ["software"],
  dataShapes: ["network"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Stick-figure actors outside a system boundary, labelled ovals inside, association lines for every scenario.",
  whenToUse:
    "Reach for a use-case diagram at the point in a project where domain experts and engineers first try to agree on what the system is for. It answers two questions and only two: who interacts with the system, and what goals can they pursue. Use a sequence diagram for message order, an activity diagram for internal control flow, and a class diagram for data shape — the use-case diagram is the contract surface, nothing more.",
  howToRead:
    "Everything inside the labelled rectangle is the system; everything outside is the world that talks to it. Each stick figure is an actor — a role, not a person — with the primary actor (who initiates scenarios) on the left and secondary actors (who respond or supervise) on the right. Each oval is a use case, named goal-first ('Withdraw Cash', not 'Cash Withdrawal Handler'). A solid line from actor to use case says 'this actor participates in this scenario' and is a promise that the scenario has been specified and can be tested. A dashed arrow with «include» between two use cases marks shared behaviour the base case always executes — distinct from «extend», which is conditional, and from generalisation (triangle arrowhead), which is actor or use-case inheritance.",
  example: {
    title: "ATM: Customer, Bank Staff, and the Authenticate inclusion",
    description:
      "Ivar Jacobson introduced use cases at Objectory AB in 1987 and codified them in 'Object-Oriented Software Engineering' (Addison-Wesley, 1992). Use-case-driven development became one of the three pillars of the Rational Unified Process (IBM/Rational, 1998) alongside iterative delivery and architecture-centric design. The ATM domain is the canonical teaching example because it exposes every relationship type in one picture: a primary Customer initiates Withdraw, Deposit, Check Balance, and Transfer; a secondary Bank Staff actor supervises withdrawals and maintains the receipt printer; and the shared pre-condition Authenticate is pulled out as a separate oval linked by an «include» dashed arrow so it is specified once and reused by every sensitive scenario.",
  },
  elements: [
    {
      selector: "system-boundary",
      label: "System boundary",
      explanation:
        "The labelled rectangle draws the line between what the project is building and what it is not. Its title — 'ATM System', 'Checkout', 'Portal' — is the name of the contract. Use cases live inside, actors live outside, and the boundary doubles as scope: a stakeholder arguing to add a use case must place it inside the rectangle or justify moving the rectangle.",
    },
    {
      selector: "primary-actor",
      label: "Primary actor",
      explanation:
        "A stick figure on the left whose goals the system exists to serve. Jacobson's rule is that the primary actor initiates each of its use cases — the scenario exists because this actor wanted an outcome. Actors are roles, never individuals: 'Customer' not 'Jane', because the same person may play Customer on Tuesday and Bank Staff on Wednesday.",
    },
    {
      selector: "secondary-actor",
      label: "Secondary actor",
      explanation:
        "A stick figure on the right that the system calls on, or that supervises scenarios it did not initiate — a printer, a payment gateway, a supervising clerk. The left/right convention is typographic only; UML does not require it, but it tells the reader at a glance who drives the interaction and who responds.",
    },
    {
      selector: "use-case",
      label: "Use case",
      explanation:
        "A labelled oval naming one goal the system delivers to an actor. The phrasing is verb-first and outcome-oriented: 'Withdraw Cash', not 'Cash Withdrawal Module'. Every oval implies a written use-case description — basic flow, alternate flows, exceptions — and the oval on the diagram is its thumbnail index. An unlabelled or noun-labelled oval is almost always a class or module masquerading as a scenario.",
    },
    {
      selector: "association-line",
      label: "Association line",
      explanation:
        "A plain solid line from actor to use case declaring participation. Each line is a commitment: if Customer connects to Withdraw Cash, then a Withdraw Cash scenario starring Customer must exist, be specified, and be testable. A use case with no actor line is dead code on the diagram; an actor with no lines is either misplaced or missing a scenario.",
    },
    {
      selector: "include-relationship",
      label: "«include» relationship",
      explanation:
        "A dashed arrow from base to included use case with the «include» stereotype — shared behaviour the base always executes. Withdraw Cash includes Authenticate because authentication runs every time. Distinguish from «extend» (the extension only runs if its extension point's condition fires) and from generalisation (drawn with a triangle arrowhead, actor-inherits-from-actor or use-case-inherits-from-use-case). Collapsing all three into plain arrows is the most common misuse of the notation.",
    },
  ],
};
