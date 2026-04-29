import type { LiveChart } from "@/content/chart-schema";

export const umlClassDiagram: LiveChart = {
  id: "uml-class-diagram",
  name: "UML Class Diagram",
  family: "relationship",
  sectors: ["software"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Three-compartment boxes for classes, four arrow shapes for the relationships between them.",
  whenToUse:
    "Reach for a class diagram when you need to pin down the static shape of an object-oriented system — which types exist, what data each carries, what operations each exposes, and how they reference one another. It is the wrong tool for runtime behaviour (use a sequence or activity diagram) and overkill for value-object sketches that a record of field names would cover.",
  howToRead:
    "Each rectangle is a class split into three compartments: name on top, fields in the middle, methods at the bottom. Visibility glyphs prefix every member — '+' public, '-' private, '#' protected. Follow the connecting lines outward: an open arrowhead is a plain reference, a hollow diamond at the whole end says the part can outlive the whole (aggregation), a filled diamond says it cannot (composition), and a hollow triangle at the superclass end is inheritance. Mixing diamond fills in the same diagram is a code-review smell because it means the modeller has not decided who owns the lifetime.",
  example: {
    title: "E-commerce domain: Customer, Order, LineItem, Product, Payment",
    description:
      "Grady Booch, Ivar Jacobson and James Rumbaugh — the 'Three Amigos' at Rational Software in 1997 — consolidated three competing object-oriented notations into UML, which the OMG standardised that same year. The shop-order example is the canonical teaching set because every arrow shape appears: Order is composed of LineItems (filled diamond — delete the order, the line items go with it), LineItem references Product (plain association — Products outlive any one order), Customer has an Address (hollow diamond — the Address exists independently), and CreditCardPayment inherits from Payment (hollow triangle pointing at the superclass).",
  },
  elements: [
    {
      selector: "class-box",
      label: "Class box",
      explanation:
        "Three stacked compartments: name, fields, methods. A class box with only a name is legal but says nothing; a box with twenty methods is a refactoring target. Keep the fields and methods compartments to what the reader needs to understand the relationship — UML is documentation, not source.",
    },
    {
      selector: "association",
      label: "Association",
      explanation:
        "A thin line with an open arrowhead: one class holds a reference to another, and neither owns the other's lifetime. The arrow points at the class being referenced. A bidirectional association (no arrowhead) is almost always a modelling mistake — it usually means the direction has not been thought through.",
    },
    {
      selector: "aggregation",
      label: "Aggregation",
      explanation:
        "A hollow diamond at the 'whole' end: the whole has-a part, but the part can exist without the whole. A Customer has an Address, but deleting the customer does not erase the street. Aggregation is the weakest ownership in UML and is often hand-waved — many teams drop it entirely and use plain association, on the grounds that if lifetimes are not coupled, the relationship is not ownership.",
    },
    {
      selector: "composition",
      label: "Composition",
      explanation:
        "A filled diamond at the 'whole' end: the part cannot outlive the whole. Deleting an Order cascades to its LineItems because a LineItem has no meaning without the Order it belongs to. A class with multiple filled-diamond parts is the object-oriented analogue of a database table with a foreign-key cascade.",
    },
    {
      selector: "inheritance",
      label: "Inheritance",
      explanation:
        "A hollow triangle at the superclass end: the subclass is-a specialisation. CreditCardPayment is-a Payment and may override capture(). Deep inheritance chains in a class diagram are a warning sign — the Gang of Four's 1994 rule 'favour composition over inheritance' was written in response to exactly the kind of six-level hierarchies that class diagrams make easy to draw.",
    },
    {
      selector: "visibility",
      label: "Visibility glyph",
      explanation:
        "The '+', '-' and '#' prefixes mark members as public, private, and protected respectively (UML also defines '~' for package-private). Omitting them is legal and almost always wrong — a class diagram without visibility glyphs hides the API surface, which is the single most useful thing the diagram could be telling a caller.",
    },
  ],
};
