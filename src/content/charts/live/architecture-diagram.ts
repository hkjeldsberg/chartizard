import type { LiveChart } from "@/content/chart-schema";

export const architectureDiagram: LiveChart = {
  id: "architecture-diagram",
  name: "Architecture Diagram",
  family: "relationship",
  sectors: ["software"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Which services exist, how they talk, where data lives — one screen that orients a new team member before any code is opened.",
  whenToUse:
    "Reach for an architecture diagram when a new engineer needs to understand a running system before they read any source. The diagram's job is orientation, not specification: which services exist, which protocols connect them, which data store each service owns. Use a UML deployment diagram when the question is physical placement on hardware, a UML component diagram when the question is interface contracts, and a sequence diagram when the question is the order of calls.",
  howToRead:
    "Read left to right as a dependency gradient: actors that start work on the left, services that do the work in the middle, stores and third-party systems that persist the work on the right. Shape carries the kind of each box — rounded rectangle for a service, cylinder for a database, stadium pill for a queue, dashed border for anything outside the system's trust boundary. Each arrow is Manhattan-routed (axis-aligned) so crossings are visually obvious and annotated with a protocol label (HTTPS, gRPC, SQL, AMQP) and a short data description (orders, auth tokens, payments).",
  example: {
    title:
      "C4-model container view of an e-commerce backend, after Simon Brown (2018)",
    description:
      "Architecture diagrams have no single standardised notation — IEEE 1471 (2000), later ISO/IEC/IEEE 42010, only describes the practice of writing architecture descriptions. Simon Brown's C4 model (2018) supplied one widely-adopted lightweight notation with four zoom levels (Context, Container, Component, Code); this chart is a Container-level sketch in that spirit. The canonical teaching example — a web frontend behind an API gateway, fanned out to Auth / Order / Payment / Shipping, with Postgres and Redis owned by Order, an SQS queue wiring Payment to Shipping asynchronously, and Stripe + FedEx as explicit third-party boxes outside the trust boundary — turns out to be the one shape that answers 'what does this system do?' in under a minute.",
  },
  elements: [
    {
      selector: "service",
      label: "Service (rounded rectangle)",
      explanation:
        "A solid-filled rounded rectangle stands for one internal service — a deployable unit the team owns and operates. Read the verbs on the outgoing arrows to learn what the service does; the rectangle itself deliberately hides internal structure. In Brown's C4 model this is the Container level: any service that runs in its own process.",
    },
    {
      selector: "database",
      label: "Database (cylinder)",
      explanation:
        "The cylinder is a persistent data store — the oldest chart idiom for storage, borrowed from the physical tape/disk pack it once resembled. A cylinder on an architecture diagram means durable state; a service with no cylinder attached is stateless. A single database connected to more than one service is usually the diagram's most expensive line to read, because it signals a contract the schema now enforces.",
    },
    {
      selector: "queue",
      label: "Queue (stadium pill)",
      explanation:
        "A stadium-shaped pill is a message queue — asynchronous, ordered, with at-least-once delivery as the default. The pill shape is convention rather than standard; the meaning is that an arrow into a queue returns immediately and the arrow out happens on another service's clock. SQS and Kafka are both drawn the same way at this zoom level.",
    },
    {
      selector: "external",
      label: "External system (dashed border)",
      explanation:
        "A dashed border means this box is outside the trust boundary — the team does not own it, cannot deploy it, and must assume it can fail or change contract without notice. Stripe and FedEx here are canonical third parties: the diagram admits the dependency rather than hiding it behind a service boundary the team does not actually control.",
    },
    {
      selector: "manhattan-arrow",
      label: "Manhattan-routed arrow",
      explanation:
        "Every connector is drawn with axis-aligned horizontal and vertical segments only, turning at right angles — the same 'Manhattan distance' geometry that city-block routing uses. The convention makes edge crossings easy to spot and keeps labels readable on the longest segment. Straight diagonals would save ink but cost the eye.",
    },
    {
      selector: "protocol-label",
      label: "Protocol label",
      explanation:
        "Every arrow carries two labels: the protocol above (HTTPS, gRPC, SQL, AMQP) and the data it carries below (orders, auth tokens, payments, labels). Without the protocol the diagram collapses into a topology with no contract; without the data the contract has no business meaning. Both are required at this zoom level.",
    },
    {
      selector: "external-boundary",
      label: "Third-party boundary",
      explanation:
        "A dashed frame around a group of boxes names the trust boundary — here, everything owned by a third party. Anything inside the frame can change without warning; anything crossing it is a contract the team has to monitor. Architecture reviews that surface a hidden dependency usually do it by drawing this frame for the first time.",
    },
  ],
};
