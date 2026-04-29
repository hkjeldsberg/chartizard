import type { LiveChart } from "@/content/chart-schema";

export const umlObjectDiagram: LiveChart = {
  id: "uml-object-diagram",
  name: "UML Object Diagram",
  family: "relationship",
  sectors: ["software"],
  dataShapes: ["network"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A snapshot of live object instances — underlined instance:Class labels in the header, attribute = value pairs below, symmetric links between.",
  whenToUse:
    "Reach for an object diagram when the class diagram is not enough — when you need to pin down a specific runtime configuration: which instances exist at a moment in time, what values their attributes hold, which references they share. Use it to debug object-reference confusion (two instances of the same class, circular graphs, aliasing), to illustrate a test fixture, or to walk through a scenario that the class diagram can only describe generically. Skip it for type-level modelling — that is the class diagram's job.",
  howToRead:
    "Each rectangle is one object instance. The top compartment carries the underlined label `instance : ClassName` — the underline is the single notation that distinguishes an object from a class. The bottom compartment lists `attribute = value` pairs with concrete values, not type names. Lines between boxes are instance links (not associations): solid, no arrowheads, because a link is a bidirectional runtime reference. Optional role labels name the link. When one box is linked from two others, the object is shared — the same runtime instance is referenced from two places, which is exactly the kind of structure a class diagram's cardinality annotation can only gesture at.",
  example: {
    title: "Shopping cart snapshot: c1:Customer owns cart3:ShoppingCart with two LineItems that share a Product",
    description:
      "James Rumbaugh's OMT notation (1991) standardised instance-label underlining, and the convention survived into UML 1.0 (1997) and UML 2.0 (2005) unchanged. A canonical teaching example is the shopping cart: c1:Customer owns cart3:ShoppingCart, which holds two LineItems i1 and i2, both of which refer to the same p5:Product 'The Elements'. The shared reference — p5 linked from both i1 and i2 — is the observation the class diagram cannot render: at the type level, LineItem refers to Product is a single arrow; at the instance level, two distinct LineItems can point at the same Product object, which matters for equality, update propagation, and garbage collection. Treat the object diagram as the class diagram's dynamic companion.",
  },
  elements: [
    {
      selector: "instance-box",
      label: "Object instance rectangle",
      explanation:
        "Two stacked compartments, the same silhouette as a class box minus the methods compartment. The box represents one live instance at one moment in time. Instances can be anonymous — `:Customer` with no name prefix is legal UML — but named instances are more useful because they let the diagram talk about the same object twice without ambiguity.",
    },
    {
      selector: "instance-label",
      label: "Instance label syntax",
      explanation:
        "The header reads `instanceName : ClassName`, underlined. The colon-plus-underline notation is UML's most compressed piece of vocabulary: colon signals 'is typed as', the underline signals 'this is an instance, not a type'. Dropping the underline produces a class diagram accidentally; dropping the colon produces ambiguous labels that could read as either. The syntax was inherited from OMT (Rumbaugh, 1991) when UML consolidated the competing 1990s object-oriented notations.",
    },
    {
      selector: "attribute-value",
      label: "Attribute = value",
      explanation:
        "The bottom compartment holds `attribute = value` pairs — concrete values, not type signatures. This is the other notational distinction from a class diagram, where the same compartment holds `attribute : Type`. Leaving values off an object diagram reduces it to a 'class diagram with extra underlines' and erases the reason to draw one in the first place: the snapshot is the point.",
    },
    {
      selector: "instance-link",
      label: "Instance link",
      explanation:
        "A solid straight line between two object boxes. Unlike class-diagram associations, instance links carry no arrowheads — a link is a symmetric runtime fact ('these two objects hold references to each other'). An arrowhead on an instance link is a notation error. An optional role label near the line midpoint names the association the link instantiates.",
    },
    {
      selector: "link-label",
      label: "Link label",
      explanation:
        "A small text label on a link names the role or association it instantiates — 'owns', 'refers to', 'manages'. Labels are optional; when the link's meaning is obvious from the class types at its ends, many modellers leave it off. The label is the only mechanism for distinguishing two links between the same pair of objects that mean different things.",
    },
    {
      selector: "shared-reference",
      label: "Shared reference",
      explanation:
        "When a single object is linked from two others, both referrers share the same runtime instance — the object is aliased. Here p5:Product is linked from both i1:LineItem and i2:LineItem, so a mutation to p5.price is observed by both line-items and a `==` comparison between i1.product and i2.product returns true. The shared-reference structure is the diagram's defining insight; a class diagram's cardinality annotation tells you 'many LineItems refer to one Product' but cannot tell you 'here are two specific LineItems that happen to refer to the same one'.",
    },
    {
      selector: "class-instances",
      label: "Multiple instances of one class",
      explanation:
        "i1:LineItem and i2:LineItem are two distinct instances of the same class, each with its own attribute values (qty, price). The object diagram is the only UML view that exposes this distinction — in a class diagram, LineItem appears exactly once no matter how many runtime copies exist. Use it to illustrate test fixtures, to walk through a failing scenario, or to pin down object identity in a bug report.",
    },
  ],
};
