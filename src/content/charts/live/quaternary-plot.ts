import type { LiveChart } from "@/content/chart-schema";

export const quaternaryPlot: LiveChart = {
  id: "quaternary-plot",
  name: "Quaternary (Tetrahedral) Plot",
  family: "composition",
  sectors: ["chemistry"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",

  synopsis:
    "A regular tetrahedron in isometric projection where each vertex is a pure component and any interior point is a quaternary mixture summing to 100%.",

  whenToUse:
    "Use a quaternary plot when a system has exactly four components that sum to a fixed total (100% by weight, mole fraction, or volume). Common contexts are alloy design, petroleum refining (light hydrocarbon fractions), and ceramic formulation, where a ternary diagram cannot capture the full composition space.",

  howToRead:
    "Each vertex represents 100% of one component; the opposite face represents 0%. A point's distance from each vertex encodes its concentration in that component. To read a composition, drop perpendiculars to each of the four opposite faces — the four distances (each normalised to the edge length) give the four component fractions. Points near a vertex are almost-pure that component; points near a face lie on a ternary sub-system. One back face is always hidden in a 2D projection — the dashed edge marks where the hidden face would intersect.",

  example: {
    title: "316 stainless steel in the Fe-C-Cr-Ni quaternary system",
    description:
      "Type 316 stainless steel sits at approximately 74% Fe, 18% Cr, 7.5% Ni, and 0.5% C in the quaternary phase diagram. Its position deep inside the tetrahedron close to the Fe vertex — but with substantial Cr and Ni — explains why it occupies a different corrosion-resistance regime than plain carbon steel: the Cr-rich ternary face of the tetrahedron is where austenitic stainless steels cluster.",
  },

  elements: [
    {
      selector: "tetrahedron-edges",
      label: "Tetrahedron frame",
      explanation:
        "Six edges connect four vertices to form the regular tetrahedron. Each edge represents a binary mixture of its two endpoint components. The tetrahedron's interior is the quaternary composition space; its four triangular faces are the four ternary sub-systems. Edges are displayed in isometric projection — the lengths appear equal but the back edges are foreshortened.",
    },
    {
      selector: "vertices",
      label: "Pure-component vertices",
      explanation:
        "Fe, Cr, Ni, and C sit at the four corners of the tetrahedron, each representing 100% of that element. The labels follow the convention that the most abundant component (Fe in stainless steels) occupies the visually dominant front-left position. Any alloy whose composition can be expressed as a convex combination of these four vertices appears as a point inside or on the tetrahedron.",
    },
    {
      selector: "composition-point",
      label: "Composition point",
      explanation:
        "The filled circle marks 316 stainless steel: 74% Fe, 18% Cr, 7.5% Ni, 0.5% C. Its barycentric position is computed as the weighted average of the four vertex positions. The point sits close to the Fe vertex because iron is the dominant constituent, but the visible offset toward Cr reflects the significant chromium content that confers corrosion resistance.",
    },
    {
      selector: "composition-label",
      label: "Composition label",
      explanation:
        "The annotation restates the alloy's name and its dominant component fractions in plain numbers. In working diagrams, multiple alloy compositions are often plotted simultaneously to compare how different grades cluster in the quaternary space — for example, 304, 316, and 430 stainless steels form a band near the Fe-Cr-Ni face.",
    },
    {
      selector: "hidden-face",
      label: "Hidden back face",
      explanation:
        "Projecting a 3D tetrahedron onto 2D necessarily obscures one face. The dashed edge marks the hidden back edge — in this projection, the Fe-Ni edge runs behind the body of the tetrahedron and is not directly visible. The face it belongs to (Fe-Ni-C_apex) is the one the viewer cannot see. This occlusion is an inherent property of any 2D representation of a quaternary diagram.",
    },
  ],
};
