import type { LiveChart } from "@/content/chart-schema";

export const umlComponentDiagram: LiveChart = {
  id: "uml-component-diagram",
  name: "UML Component Diagram",
  family: "relationship",
  sectors: ["software"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Replaceable software units drawn as rectangles with interface contracts — lollipops for provided, sockets for required.",
  whenToUse:
    "Reach for a component diagram when the architectural question is 'which services does this system decompose into, and what does each one publish?' It is the right picture for reviewing deployable units, planning service boundaries, and arguing about coupling. Use a class diagram for compile-time object structure, a deployment diagram for runtime placement on hardware, and a sequence diagram for the order in which the components talk.",
  howToRead:
    "Each rectangle is one component — a replaceable unit with a published contract. The «component» stereotype label in the top-left and the two-box icon in the top-right are redundant signals that this rectangle is not a class. A lollipop (short stem ending in a filled circle) is a provided interface: the component implements this contract and anyone can depend on it. A socket (short stem ending in a half-circle opening outward) is a required interface: the component will not function until something wires a matching lollipop into it. Read the architecture by following couplings — a lollipop touching a socket says 'this provider satisfies that consumer'. A socket with no lollipop pointed at it is an unwired dependency, which is the diagram's most useful failure mode.",
  example: {
    title: "E-commerce backend: WebFrontend, AuthService, OrderService, PaymentGateway",
    description:
      "The OMG adopted UML 2.0 in 2005, and with it the lollipop-socket notation that distinguishes component diagrams from the class-based picture in UML 1.x. The canonical teaching example is a small e-commerce backend: the WebFrontend requires Auth, Catalog, and Order; the AuthService and ProductCatalog each publish one lollipop; the OrderService provides Order while requiring Payment and Shipping, wiring the PaymentGateway and ShippingService in turn. The diagram reads as a chain of explicit contracts — every service boundary is a named interface, every socket either finds its lollipop or exposes a missing dependency the reviewer can argue about.",
  },
  elements: [
    {
      selector: "component-rectangle",
      label: "Component rectangle",
      explanation:
        "A plain rectangle stands for one replaceable unit of software. The shape deliberately resembles a class box so UML 1.x tools could render it, but the stereotype and icon force the reader to treat it as a component — code that can be deployed, swapped, or versioned independently. The rectangle's internals are hidden; only the interfaces on its perimeter matter to the rest of the diagram.",
    },
    {
      selector: "stereotype-label",
      label: "«component» stereotype",
      explanation:
        "The guillemets around 'component' are UML's stereotype syntax — metadata that refines a base element's meaning. Here the stereotype elevates a generic rectangle into a component-kind classifier. Stereotypes are how UML stays extensible without adding new shapes to the notation; every shape in UML 2 can carry one.",
    },
    {
      selector: "component-icon",
      label: "Component icon",
      explanation:
        "The small two-box glyph in the top-right — one rectangle with two smaller tabs on its left edge — is the UML 2 component marker. It carries the same information as the «component» stereotype and is redundant by design: in printed diagrams the icon is legible at a distance where the stereotype text is not.",
    },
    {
      selector: "provided-interface",
      label: "Provided interface (lollipop)",
      explanation:
        "A short stem ending in a filled circle declares that the component implements the named interface — a promise to anyone who wants to depend on this contract. Lollipops are the public API of the rectangle. A component with no lollipops is either an application shell (only requires) or a dead end.",
    },
    {
      selector: "required-interface",
      label: "Required interface (socket)",
      explanation:
        "A stem ending in an outward-opening half-circle declares that the component needs a matching lollipop plugged into it before it will function. Sockets make dependencies explicit at the architecture level. A socket with nothing wired into it is an unresolved dependency — the diagram's equivalent of a build error.",
    },
    {
      selector: "coupling",
      label: "Lollipop-socket coupling",
      explanation:
        "A lollipop drawn tangent to a matching socket is one coupling: the provider satisfies the consumer's requirement. The visual 'ball-sitting-in-cup' reading is the chart family's main innovation over UML 1.x, where a plain arrow served both composition and dependency. The same interface name must appear on both the lollipop and the socket — that textual match is the actual contract; the geometry is just the index.",
    },
    {
      selector: "interface-name",
      label: "Interface name",
      explanation:
        "Every lollipop and socket carries the name of the interface it represents — Auth, Catalog, Payment. The name is a reference to a separately-defined UML interface (methods, signatures, protocol), not an inline definition. Two interfaces with the same name on different components must resolve to the same declaration; architecture reviews that accept lookalike names by accident are how coupling leaks in.",
    },
  ],
};
