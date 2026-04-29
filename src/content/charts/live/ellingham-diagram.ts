import type { LiveChart } from "@/content/chart-schema";

export const ellinghamDiagram: LiveChart = {
  id: "ellingham-diagram",
  name: "Ellingham Diagram",
  family: "specialty",
  sectors: ["chemistry"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Ranks metal oxides by thermodynamic stability across temperature, revealing which metals can reduce one another's oxides.",

  whenToUse:
    "Use an Ellingham diagram when designing or analysing a pyrometallurgical reduction process — selecting a reducing agent (carbon, aluminium, or another metal) at a target operating temperature. The diagram gives a direct read on whether a proposed reduction is thermodynamically spontaneous without running a calculation.",

  howToRead:
    "The y-axis is the standard Gibbs free energy of formation (ΔG°, kJ/mol O₂); the x-axis is temperature in Kelvin. Each line is one oxidation reaction. A lower line means a more stable oxide — the corresponding metal binds oxygen more tightly. At any temperature, a metal whose line sits below another metal's line can reduce that metal's oxide. The dashed carbon line (2C + O₂ → 2CO) is the key exception: it has a negative slope, so it crosses metal lines from above. Above each crossing temperature, carbon becomes the stronger reducing agent — the operating principle of every blast furnace.",

  example: {
    title: "Iron smelting in a blast furnace, c. 1944",
    description:
      "Harold Ellingham's 1944 diagram for the Journal of the Society of Chemical Industry showed that the C/CO line crosses the Fe/FeO line near 1000 K. Tata Steel's blast furnaces operate at 1300–1600 K, comfortably above that crossing, so coke reliably reduces iron ore (Fe₂O₃) to pig iron — a thermodynamic certainty the diagram makes visible at a glance. The same reading explains why aluminium cannot be reduced by carbon (the Al₂O₃ line is always below the C line) and must be produced electrolytically.",
  },

  elements: [
    {
      selector: "oxide-lines",
      label: "Metal oxide lines",
      explanation:
        "Each line plots ΔG° of formation for one metal oxide reaction (2M + O₂ → 2MO) as a linear function of temperature. The positive slope reflects the entropy decrease when gas-phase O₂ is consumed. Lower lines correspond to more stable oxides — metals that are harder to extract from their ores.",
    },
    {
      selector: "carbon-line",
      label: "Carbon (2C + O₂ → 2CO)",
      explanation:
        "The dashed carbon line has a negative slope, unique among the reactions shown. When 1 mol of O₂ reacts with 2 mol of solid carbon to make 2 mol of CO gas, total entropy increases — the opposite of every metal oxide line. This makes carbon an increasingly strong reducing agent as temperature rises.",
    },
    {
      selector: "crossing-point",
      label: "C–Fe crossing (~1000 K)",
      explanation:
        "Where the carbon line crosses a metal oxide line, carbon's reducing power matches the metal's. Above this temperature, carbon can spontaneously reduce the metal oxide. The Fe–C crossing near 1000 K is the thermodynamic justification for iron smelting with coke; every blast furnace runs well above it.",
    },
    {
      selector: "x-axis",
      label: "Temperature axis",
      explanation:
        "Temperature in Kelvin runs left to right. Most industrially relevant reduction operations fall between 700 K and 2000 K. Phase transitions in a reaction (melting, boiling) produce kinks in the line — not shown here in the linear approximation.",
    },
    {
      selector: "y-axis",
      label: "ΔG° axis",
      explanation:
        "Standard Gibbs free energy of formation in kJ per mole of O₂ consumed. Values are negative because oxide formation is exothermic and thermodynamically favoured at room temperature. The more negative the value, the stronger the oxide's thermodynamic hold on oxygen.",
    },
  ],
};
