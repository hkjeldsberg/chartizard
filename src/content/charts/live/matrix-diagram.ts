import type { LiveChart } from "@/content/chart-schema";

export const matrixDiagram: LiveChart = {
  id: "matrix-diagram",
  name: "Matrix Diagram",
  family: "relationship",
  sectors: ["quality"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Encodes the strength of relationships between two different sets of items in a grid, with strength shown by symbol weight — the structural spine of Quality Function Deployment.",

  whenToUse:
    "Reach for a matrix diagram when you need to map one set of variables against a qualitatively different set — customer requirements vs engineering parameters, failure modes vs process steps, training courses vs competency gaps. It is the right tool when the relationships between categories matter more than any single number. If both axes carry the same variable, use a correlation matrix instead; that distinction is the chart's founding premise.",

  howToRead:
    "Read across a row to see which engineering specs are most implicated by one customer need. Read down a column to see which customer needs drive one spec. A column with many ● symbols is a high-leverage engineering target. The optional roof triangle above the column headers shows correlations among the specs themselves: a − between two columns flags a trade-off (adding battery capacity conflicts with reducing case thickness). The legend decodes the three symbol levels: ● strong / ○ medium / △ weak.",

  example: {
    title: "Toyota Minolta QFD pilot, 1984 — camera design",
    description:
      "Don Clausing and Yoji Akao's 1984 application at Xerox and Toyota's Minolta division used a 15×12 House of Quality to translate 15 customer needs for a 35mm camera into 12 engineering specifications. The roof triangle revealed that film-advance speed and shutter precision were positively correlated (easy to improve together), while body weight and lens quality were in tension. The matrix made the trade-off structure visible to engineers who had previously optimised each parameter independently. Distinct from a correlation matrix: a camera's customer needs and its engineering specs are fundamentally different variable types; treating them as the same axis would be a category error.",
  },

  elements: [
    {
      selector: "matrix-cell",
      label: "Relationship cell",
      explanation:
        "Each cell sits at the intersection of one customer need (row) and one engineering spec (column). Its symbol encodes how strongly that spec affects that need: ● = strong (a primary design driver), ○ = medium (notable but not dominant), △ = weak (peripheral). Empty cells are a design signal: if a spec has no ● in any cell, it may not be addressing any stated customer need.",
    },
    {
      selector: "customer-needs",
      label: "Customer needs (rows)",
      explanation:
        "The row axis lists what the customer wants in their own language — 'long battery life', 'light weight', 'clear camera', 'loud speaker'. These are elicited through interviews and surveys before any engineering language is introduced. Keeping them in customer terms is the method's discipline: translating prematurely into engineering specs collapses the distinction the matrix is designed to preserve.",
    },
    {
      selector: "engineering-specs",
      label: "Engineering specs (columns)",
      explanation:
        "The column axis lists what engineers can control and measure: battery capacity (mAh), case thickness (mm), megapixel count, speaker wattage. Each spec must be quantifiable and actionable. The matrix's job is to trace which specs most strongly affect which needs — the translation layer between customer voice and engineering decision.",
    },
    {
      selector: "relationship-symbols",
      label: "Relationship symbol",
      explanation:
        "The ● / ○ / △ encoding comes directly from Akao's 1966 QFD formulation. The symbols are intentionally non-numeric: the matrix captures directional strength of influence, not a measured coefficient. Teams assign symbols through structured consensus discussion, not calculation. The visual weight difference between ● and △ is immediate; a table of numbers would demand mental arithmetic.",
    },
    {
      selector: "roof-triangle",
      label: "Roof triangle",
      explanation:
        "The triangular region above the column headers encodes spec-to-spec correlations — the 'House of Quality' nickname comes from this roof. A + symbol in a roof cell means improving both specs tends to reinforce each other; a − means improving one typically degrades the other. A column pair with a − and both connected to the same high-need row is a primary trade-off that engineers must resolve explicitly.",
    },
    {
      selector: "legend",
      label: "Symbol legend",
      explanation:
        "The three symbols form an ordinal scale, not a cardinal one. ● is roughly 9 weight units, ○ is 3, △ is 1 in some QFD scoring schemes — but those numbers are heuristics, not measurements. The legend's job is to make the scale unambiguous for any reader who encounters the chart without prior QFD training.",
    },
  ],
};
