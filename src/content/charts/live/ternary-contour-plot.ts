import type { LiveChart } from "@/content/chart-schema";

export const ternaryContourPlot: LiveChart = {
  id: "ternary-contour-plot",
  name: "Ternary Contour Plot",
  family: "distribution",
  sectors: ["chemistry"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A ternary triangle with iso-scalar contour lines overlaid — the standard format for mapping a fourth quantity (temperature, enthalpy, density) across a three-component composition space.",
  whenToUse:
    "Use a ternary contour plot when you have a scalar property measured (or modelled) across a three-component composition and want to show how that property varies continuously across the triangle. The canonical use is phase-diagram projections in metallurgy: solidus and liquidus isotherms for Fe-Ni-Cu, Al-Si-Mg, or similar ternary alloys. It is also the right chart for petrology (CIPW-norm mineral isopleths) and chemical engineering (isothermal sections of vapour-liquid diagrams). Do not use it if the scalar property is only measured at scattered points without a reliable interpolant — the contours will mislead.",
  howToRead:
    "Read the vertices as pure-component extremes (Fe corner = 100% Fe, 0% Ni, 0% Cu). Any interior point's composition is read by following the three families of isolines parallel to each edge. The overlaid contour lines are iso-scalar curves: every point on the 1200 °C contour has exactly the same solidus temperature, regardless of the Fe/Ni/Cu split. Contours close in toward the temperature minimum or maximum; widely-spaced contours indicate a region where the scalar changes slowly with composition; tightly-packed contours indicate a steep gradient. The projection follows the standard equilateral mapping: x = (2·Ni + Cu)/2, y = Cu·√3/2.",
  example: {
    title: "Fe-Ni-Cu solidus isotherms",
    description:
      "The Fe-Ni-Cu ternary is a model system for understanding how copper contamination of nickel steels depresses solidification temperature. Pure Fe melts at 1538 °C, pure Ni at 1455 °C, pure Cu at 1085 °C. Mapping solidus isotherms across the triangle (1100, 1200, 1300, 1400 °C) shows that the low-temperature region clusters near the Cu-rich corner, while the Fe-Ni binary edge remains above 1400 °C throughout. The technique — drawing scalar fields on the ternary triangle — was systematised by Gibbs (1875) and remains the standard format in binary-plus alloy phase-diagram atlases.",
  },
  elements: [
    {
      selector: "fe-corner",
      label: "Fe corner",
      explanation:
        "The bottom-left vertex is the 100% iron end-member. Pure iron melts at 1538 °C — the highest solidus temperature in this system. All compositions along the Fe-Ni edge (zero Cu) remain above 1400 °C, making the Fe-rich region thermally robust.",
    },
    {
      selector: "ni-corner",
      label: "Ni corner",
      explanation:
        "The bottom-right vertex is the 100% nickel end-member. Pure nickel melts at 1455 °C. Compositions along the Ni-Fe binary edge form a near-ideal solid solution, so the solidus temperature decreases smoothly as Cu is added.",
    },
    {
      selector: "cu-corner",
      label: "Cu corner",
      explanation:
        "The apex is the 100% copper end-member. Pure copper melts at 1085 °C — the lowest temperature in this system. The Cu-rich region pulls the isotherms up toward the apex, creating the characteristic clustering of low-temperature contours near the top of the triangle.",
    },
    {
      selector: "isotherm-contour",
      label: "Isotherm contour",
      explanation:
        "Each contour is an iso-scalar curve — every composition on the line shares the same solidus temperature. Contours are computed by finding compositions where the weighted-blend temperature function equals the target value. Widely spaced contours (as near the Fe-Ni edge) indicate a region where composition changes little affect the solidus; tightly packed contours (near the Cu apex) signal a steep thermal gradient.",
    },
    {
      selector: "temperature-label",
      label: "Temperature label",
      explanation:
        "Direct contour labels eliminate the need for a separate colour scale. Labelling 2-3 representative isotherms (here 1200, 1300, and 1400 °C) lets a reader estimate the temperature of any unlabelled contour by interpolation without consulting a legend.",
    },
    {
      selector: "sample-point",
      label: "Sample point",
      explanation:
        "The marked interior point represents a specific composition (Fe 33%, Ni 33%, Cu 34%) and its model solidus temperature. In practice, measured alloy specimens appear as discrete points inside the triangle; the contour field is interpolated between them. The point's distance from the nearest contours indicates how closely the measurement agrees with the modelled surface.",
    },
    {
      selector: "triangle-projection",
      label: "Triangle projection",
      explanation:
        "The outer triangle boundary is the sum-constraint made visible. A composition cannot leave the triangle because its three fractions must add to 1. The equilateral projection — x = (2·Ni + Cu)/2, y = Cu·√3/2 — preserves the symmetry of the three components and maps each vertex to a distinct corner, which is why Gibbs chose it in 1875.",
    },
  ],
};
