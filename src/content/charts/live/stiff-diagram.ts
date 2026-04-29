import type { LiveChart } from "@/content/chart-schema";

export const stiffDiagram: LiveChart = {
  id: "stiff-diagram",
  name: "Stiff Diagram",
  family: "specialty",
  sectors: ["earth-sciences"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Kite-shaped polygon encoding one water sample's ion chemistry: cations extend leftward and anions rightward from a central vertical axis, producing a shape that is the composition.",

  whenToUse:
    "Use a Stiff diagram when you need a single water sample's complete ionic chemistry legible at a glance — for field reports, well-completion logs, or side-by-side comparison of a handful of samples. Introduced by Henry A. Stiff Jr. in 1951 (Journal of Petroleum Technology 3(10)) to help oilfield engineers characterise formation water without tabular chemistry. For comparing many samples simultaneously, pair with a Piper diagram: Stiff reads one sample in depth, Piper compares a regional network.",

  howToRead:
    "A central vertical dashed axis represents zero concentration. Three rows run top to bottom: Na⁺+K⁺ (left) vs Cl⁻ (right), Ca²⁺ (left) vs HCO₃⁻ (right), Mg²⁺ (left) vs SO₄²⁻ (right). Each ion's concentration in milliequivalents per litre is plotted as a horizontal distance from the axis. The six vertices are connected into a closed polygon — the kite. A narrow kite with Ca²⁺ and HCO₃⁻ dominant at the middle row is a fresh carbonate spring; a broad kite with wide Na⁺+K⁺ and Cl⁻ wings at the top is a brine. Width equals total ion load; left-right asymmetry indicates cation or anion dominance; the overall shape is reproducible and recognisable across hundreds of samples.",

  example: {
    title: "Permian Basin oilfield formation waters, West Texas",
    description:
      "Stiff (1951) used this diagram to classify Permian Basin formation waters for corrosion risk assessment. Waters with broad Na⁺+Cl⁻ wings — high-salinity brines in contact with evaporite layers — were flagged as aggressive to steel casing. The kite shape allowed a completion engineer to assess corrosion risk from a single glance at the pattern, without computing ionic strength separately.",
  },

  elements: [
    {
      selector: "central-axis",
      label: "Central vertical axis",
      explanation:
        "The dashed vertical line through the centre represents zero concentration. All ions are measured outward from this baseline. Width of the kite at any row is the sum of the cation and anion concentrations for that ion pair, in milliequivalents per litre. A narrow kite means low mineralisation; a broad kite means high total dissolved load.",
    },
    {
      selector: "cation-vertex",
      label: "Cation vertex (Na⁺+K⁺)",
      explanation:
        "The leftward extension at the top row encodes the combined sodium and potassium concentration. It is plotted leftward from the central axis because cations are conventionally on the left side of a Stiff diagram. The further left the vertex, the higher the Na⁺+K⁺ load — a signature of seawater mixing, halite dissolution, or cation exchange in clay-rich sediments.",
    },
    {
      selector: "anion-vertex",
      label: "Anion vertex (Cl⁻)",
      explanation:
        "The rightward extension at the top row encodes chloride concentration. Chloride is conservative — it does not react with rock minerals — so a high Cl⁻ vertex indicates water that has either evaporated, mixed with seawater, or contacted evaporite deposits. A matching wide Na⁺+K⁺ vertex on the left produces the characteristic broad-topped kite of brines.",
    },
    {
      selector: "kite-polygon",
      label: "Kite polygon",
      explanation:
        "The six vertices are connected in sequence to form a closed polygon. The shape encodes the full ionic composition of one sample: overall area scales roughly with total dissolved solids; the widest row reveals the dominant ion pair; asymmetry between left (cation) and right (anion) extent reflects charge imbalance if the analysis is imperfect. Stiff diagrams from the same aquifer system share recognisably similar shapes.",
    },
    {
      selector: "kite-shape-reading",
      label: "Kite shape as composition",
      explanation:
        "The narrow kite of a fresh karst spring is visually distinct from the broad kite of a brackish borehole — this is the diagram's core claim. Stiff designed it so an engineer could sort a stack of paper forms by shape without tabulating values. The Ca²⁺-HCO₃⁻ row (middle) widens for carbonate aquifers; the Na⁺+K⁺/Cl⁻ row (top) widens for marine or evaporitic water.",
    },
    {
      selector: "meq-scale",
      label: "Milliequivalents per litre scale",
      explanation:
        "Concentrations are expressed in milliequivalents per litre (meq/L = mmol/L × ion charge), not mg/L, so that cation and anion totals balance for a charge-neutral sample. Comparing Ca²⁺ (charge 2) directly with Na⁺ (charge 1) in mg/L would distort the shape; meq/L normalises for valence and makes the kite geometrically meaningful.",
    },
  ],
};
