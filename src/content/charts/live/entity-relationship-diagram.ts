import type { LiveChart } from "@/content/chart-schema";

export const entityRelationshipDiagram: LiveChart = {
  id: "entity-relationship-diagram",
  name: "Entity-Relationship Diagram",
  family: "relationship",
  sectors: ["software"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Rectangles for entities, lines for relationships, crow's-foot glyphs for cardinality.",
  whenToUse:
    "Reach for an ERD when you need to design or document a relational schema: the nouns of the domain, the keys that identify each, and the cardinalities that connect them. It is the right tool for translating domain language into tables, and the wrong tool for behaviour (use a sequence diagram) or hierarchy (use a tree).",
  howToRead:
    "Each rectangle is an entity — think table. The header names it; the rows underneath list attributes, with a PK marker on the primary key and an FK marker on each foreign key. Follow a line between two entities to read the relationship: the glyph at each end is the cardinality on that side. A single bar means exactly one; a bar plus a circle means zero or one; a bar plus a crow's-foot means one or many; a circle plus a crow's-foot means zero or many. The verb label in the middle gives the relationship direction in natural language — 'places', 'contains', 'belongs to'.",
  example: {
    title: "Order-management schema: Customer, Order, LineItem, Product, Category",
    description:
      "Peter Chen introduced the entity-relationship model in 1976 in the ACM Transactions on Database Systems paper 'The Entity-Relationship Model — Toward a Unified View of Data'. It became the Rosetta Stone between domain language and relational schema: every entity becomes a table, and every many-to-many relationship becomes a join table. Chen drew relationships as diamonds, but the crow's-foot notation — popularised by James Martin and Clive Finkelstein in the 1981 Information Engineering method — won out in practice because the glyphs read at a glance. A Customer places zero-or-many Orders; each Order contains one-or-many LineItems; each LineItem refers to exactly one Product; each Product belongs to exactly one Category.",
  },
  elements: [
    {
      selector: "entity",
      label: "Entity",
      explanation:
        "A rectangle with a header and an attribute list — think table, think domain noun. Entity names are singular ('Order', not 'Orders') because each row is one instance of the noun. If an entity has no attributes beyond its key, it is probably a join table and should be named for the relationship it represents.",
    },
    {
      selector: "primary-key",
      label: "Primary key",
      explanation:
        "The PK marker identifies the attribute (or composite set) that uniquely identifies each row. In crow's-foot notation it is usually shown underlined or prefixed with 'PK'. Every entity must have one; an entity without a primary key is not a table, it is a bag.",
    },
    {
      selector: "one-cardinality",
      label: "One (|)",
      explanation:
        "A single perpendicular bar means exactly one. On the Order side of Customer-places-Order, it reads 'an Order is placed by exactly one Customer' — the row cannot exist without a customer. In SQL this is the NOT NULL foreign key.",
    },
    {
      selector: "one-many-cardinality",
      label: "One or many (|<)",
      explanation:
        "A bar plus a three-tine crow's-foot means one or many — at least one, possibly more. On the LineItem side of Order-contains-LineItem it reads 'an Order has one or many LineItems' — a zero-line Order would be an empty invoice, which the business rule excludes.",
    },
    {
      selector: "zero-many-cardinality",
      label: "Zero or many (o<)",
      explanation:
        "A circle plus a crow's-foot means zero or many. On the Order side of Customer-places-Order it reads 'a Customer places zero or many Orders' — a freshly registered customer has placed none yet, and the schema must allow that. The circle is the difference between a customer who is new and one who should not exist.",
    },
    {
      selector: "relationship-verb",
      label: "Relationship verb",
      explanation:
        "The verb phrase mid-line gives the reading direction: 'Customer places Order', not 'Order places Customer'. Chen's original notation drew the verb inside a diamond on the line; Martin-style ERDs drop the diamond but keep the label, and the discipline is the same — a relationship without a verb is just two rectangles with a line between them.",
    },
  ],
};
