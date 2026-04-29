import type { LiveChart } from "@/content/chart-schema";

export const phaseDiagram: LiveChart = {
  id: "phase-diagram",
  name: "Phase Diagram",
  family: "specialty",
  sectors: ["chemistry", "physics"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A pressure-temperature map of a pure substance, carved into solid, liquid, and gas regions by three equilibrium curves that meet at the triple point.",
  whenToUse:
    "Reach for a P-T phase diagram when a question turns on whether a substance is solid, liquid, or gas under some operating condition — freeze-drying a biological, venting a pressurised CO₂ line, or designing a steam turbine's condenser. The chart is the thermodynamic model: every interior point is a stable state, every curve is a phase transition.",
  howToRead:
    "Pick your temperature on the x-axis and your pressure on the log y-axis and land on a region — the label is the phase that's stable there. Cross a boundary curve and the phase changes: cross the vaporisation curve rightward and liquid becomes gas (boiling); cross the melting curve leftward and liquid becomes solid (freezing). The single point where all three curves meet is the triple point — the only condition at which all three phases coexist. The vaporisation curve ends abruptly at the critical point, beyond which liquid and gas become indistinguishable.",
  example: {
    title: "Water — the textbook P-T diagram",
    description:
      "Water's triple point sits at 273.16 K and 611.657 Pa — a condition reproducible enough that it defined the kelvin from 1954 until the 2019 SI redefinition. Its critical point at 647.1 K and 22.064 MPa is where the vaporisation curve stops and supercritical water begins (used industrially for waste oxidation because it dissolves organics like a nonpolar solvent). The melting curve leans LEFT — negative dP/dT — which is the signature of water's density anomaly: ice is less dense than liquid water, so squeezing ice melts it. That one-in-a-few-dozen quirk is why ice floats, why lakes freeze top-down leaving fish alive underneath, and why ice skates glide (pressure-melting plus frictional heat).",
  },
  elements: [
    {
      selector: "triple-point",
      label: "Triple point",
      explanation:
        "The single (T, P) at which solid, liquid, and gas coexist in equilibrium. For water it's 273.16 K and 611.657 Pa — a condition so reproducible that the kelvin was defined by it from 1954 to 2019. Moving the operating point a hair in any direction collapses the system to one or two phases.",
    },
    {
      selector: "solid-region",
      label: "Solid region",
      explanation:
        "Conditions under which the substance is a solid at equilibrium. Any (T, P) point in this region names ice as the stable phase, regardless of how the system got there. The region's size and shape are what make a substance 'hard to freeze' or 'hard to melt' in practical terms.",
    },
    {
      selector: "liquid-region",
      label: "Liquid region",
      explanation:
        "The (T, P) window in which the substance flows as a liquid. For water at ambient pressure (1.013 × 10⁵ Pa) this runs from 273.15 K to 373.15 K — the familiar 0–100 °C. The region narrows and widens with pressure, which is why food cooks faster in a pressure cooker and why water boils at room temperature on Everest.",
    },
    {
      selector: "gas-region",
      label: "Gas region",
      explanation:
        "Where the substance is a vapour. The region's lower-left boundary is the sublimation curve (solid → gas directly, no liquid); its upper-left boundary is the vaporisation curve (liquid → gas). At the critical point the curve ends, and beyond it there is no phase distinction — just a dense supercritical fluid.",
    },
    {
      selector: "vaporisation-curve",
      label: "Vaporisation curve",
      explanation:
        "The liquid-gas equilibrium line. Crossing it rightward is boiling; leftward is condensation. It runs from the triple point up to the critical point and then stops — this is the only phase boundary with an endpoint, and it exists because liquid and gas differ only in density, not in symmetry.",
    },
    {
      selector: "critical-point",
      label: "Critical point",
      explanation:
        "The terminus of the vaporisation curve. Above it (T > 647.1 K and P > 22.064 MPa for water) the distinction between liquid and gas disappears — meniscus vanishes, compressibility diverges, the fluid becomes supercritical. Supercritical CO₂ is used to decaffeinate coffee; supercritical water is used to destroy PCBs. Industrial chemistry lives in this corner of the diagram.",
    },
    {
      selector: "melting-anomaly",
      label: "Melting-curve lean (water's anomaly)",
      explanation:
        "For almost every substance the solid-liquid boundary leans right — increase pressure and the melting point rises. Water's leans LEFT: the melting curve has negative dP/dT, meaning pressure MELTS ice. That's because ice is less dense than liquid water (hydrogen-bonded open lattice). The same anomaly is why ice floats, why lakes freeze from the top, and part of the classical explanation for why ice skates glide.",
    },
  ],
};
