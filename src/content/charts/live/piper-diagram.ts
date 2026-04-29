import type { LiveChart } from "@/content/chart-schema";

export const piperDiagram: LiveChart = {
  id: "piper-diagram",
  name: "Piper Diagram",
  family: "specialty",
  sectors: ["earth-sciences"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Trilinear diagram for classifying groundwater chemistry by plotting cation and anion compositions in two triangles projected onto a central diamond.",

  whenToUse:
    "Use a Piper diagram when you need to classify multiple groundwater samples simultaneously and reveal mixing trends or water-rock interaction. Introduced by Arthur M. Piper in 1944 (AGU Transactions 25(6)), it is the standard plot in hydrogeochemistry for identifying aquifer facies — Ca-HCO₃, Na-Cl, mixed — across dozens of samples at once. Single-sample chemistry is better read from a Stiff diagram; the Piper's strength is comparative.",

  howToRead:
    "Read the lower-left triangle first: each point's position encodes the relative proportions of Ca²⁺, Mg²⁺, and Na⁺+K⁺ as milliequivalent percentages summing to 100%. The lower-right triangle does the same for HCO₃⁻, SO₄²⁻, and Cl⁻. A point in each triangle is then projected upward into the central diamond — the projection follows lines parallel to the outer edges — landing the sample in a single rhombus field. The diamond's bottom corner represents Ca²⁺+HCO₃⁻ (carbonate-rock) water; the top corner represents Na⁺+Cl⁻ (saline or marine) water; left and right corners represent mixed sulphate-dominated facies. The shape of the cluster in the diamond, and whether samples plot along mixing lines, is the interpretive content.",

  example: {
    title: "USGS Edwards Aquifer monitoring network, Texas",
    description:
      "Hydrogeologists at the USGS used Piper diagrams of the Edwards Aquifer (Texas) to show that recharge zones plot near the Ca-HCO₃ corner — limestone-derived bicarbonate water — while downgradient samples migrate toward the Na-Cl corner as prolonged contact with evaporite lenses introduces sodium and chloride. The diagonal migration path through the diamond is visible in a single Piper plot spanning fifty wells and is invisible in any tabular summary.",
  },

  elements: [
    {
      selector: "cation-triangle",
      label: "Cation triangle",
      explanation:
        "The lower-left equilateral triangle. Each vertex is a cation: Ca²⁺ at bottom-left, Na⁺+K⁺ at bottom-right, Mg²⁺ at apex. A sample's position encodes its cation composition as milliequivalent percentages summing to 100%. A point near the Ca²⁺ corner means that ion dominates; a point near the centre means roughly equal contributions from all three.",
    },
    {
      selector: "anion-triangle",
      label: "Anion triangle",
      explanation:
        "The lower-right equilateral triangle mirrors the cation triangle for anions: HCO₃⁻ at bottom-left, Cl⁻ at bottom-right, SO₄²⁻ at apex. Position rules are identical to the cation triangle. Spring waters recharged through limestone typically cluster near the HCO₃⁻ corner; coastal and oilfield brines cluster near Cl⁻.",
    },
    {
      selector: "diamond-projection",
      label: "Diamond (central rhombus)",
      explanation:
        "The upper diamond combines both triangles into a single composite field. Each sample is projected from its cation position and its anion position along lines parallel to the outer edges of the respective triangles; the intersection of those two projection lines falls inside the diamond. The diamond's position summarises both cation and anion character simultaneously and reveals mixing trends that neither triangle alone can show.",
    },
    {
      selector: "ca-corner",
      label: "Ca²⁺ corner",
      explanation:
        "The bottom-left vertex of the cation triangle is the carbonate endmember: water that has dissolved primarily calcite or dolomite rock. Samples from unconfined limestone aquifers — karst springs, shallow carbonate wells — plot near this corner. Their paired anion plot near HCO₃⁻, so the diamond places them at its bottom vertex.",
    },
    {
      selector: "na-cl-corner",
      label: "Na⁺+Cl⁻ saline endmember",
      explanation:
        "The bottom-right vertex of the cation triangle (Na⁺+K⁺) and the bottom-right vertex of the anion triangle (Cl⁻) define the saline or marine endmember. Seawater intrusion, connate brines, and halite dissolution push samples toward this corner on both triangles. When projected into the diamond, these samples land at the top vertex — Na+Cl field.",
    },
    {
      selector: "sample-projection",
      label: "Sample point and projection",
      explanation:
        "Each coloured symbol represents one water sample and appears in identical shape and tone in all three panels — cation triangle, anion triangle, and diamond — so a viewer can track the same sample across all three fields without colour-only encoding. The projection lines (implicit) connect a sample's triangle positions to its landing point in the diamond.",
    },
  ],
};
