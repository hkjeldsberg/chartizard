import type { LiveChart } from "@/content/chart-schema";

export const arrheniusPlot: LiveChart = {
  id: "arrhenius-plot",
  name: "Arrhenius Plot",
  family: "relationship",
  sectors: ["chemistry"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Linearises the Arrhenius equation by plotting ln(k) against 1/T, turning an exponential rate law into a straight line whose slope measures activation energy.",

  whenToUse:
    "Use an Arrhenius plot when you have rate constants measured at multiple temperatures and want to extract the activation energy Ea and the pre-exponential factor A. The linearisation k = A exp(−Ea/RT) → ln(k) = ln(A) − Ea/R · (1/T) converts the two unknowns into slope and intercept of a line, readable by eye and fittable by least squares. If the points do not fall on a line, the mechanism is temperature-dependent or more than one pathway contributes.",

  howToRead:
    "The x-axis is 1/T in K⁻¹, so it runs backwards in temperature: the left edge is high temperature (fast reaction) and the right edge is low temperature (slow reaction). Each data point is one (T, k) measurement converted to (1/T, ln k). The best-fit line has slope −Ea/R; multiply by −8.314 J mol⁻¹ K⁻¹ and reverse the sign to recover Ea in joules. The y-intercept equals ln(A), giving the pre-exponential collision frequency A. Svante Arrhenius published the equation in 1889 in Zeitschrift für physikalische Chemie 4:226-248, fitting inversion of sucrose by acid; Henry Eyring's 1935 transition-state theory rederived it from quantum mechanics.",

  example: {
    title: "N₂O₅ decomposition, 298–398 K",
    description:
      "Six rate constants for the thermal decomposition of dinitrogen pentoxide (N₂O₅ → 2 NO₂ + ½ O₂) fall on a straight line in the Arrhenius plot with slope −12,391 K. Multiplying by −R gives Ea ≈ 103 kJ/mol and the y-intercept gives A ≈ 4.3×10¹³ s⁻¹. These are the published values from gas-phase kinetic studies; the linearity confirms a single elementary pathway across the 100 K temperature window.",
  },

  elements: [
    {
      selector: "x-axis",
      label: "X-axis — 1/T (inverted temperature)",
      explanation:
        "The x-axis encodes 1/T in units of K⁻¹, displayed here multiplied by 10³ for readability. High 1/T (right side) means low temperature and slow rate; low 1/T (left side) means high temperature and fast rate. The axis runs backwards relative to ordinary temperature scales, which is why rate increases going left.",
    },
    {
      selector: "y-axis",
      label: "Y-axis — ln(k)",
      explanation:
        "The y-axis is the natural logarithm of the rate constant k in consistent units (here s⁻¹ for a first-order decomposition). Taking the log linearises the exponential dependence: each unit increase in 1/T by 10⁻³ K⁻¹ shifts ln(k) by the slope value −Ea/R. The units of k cancel in the log transformation; what matters is the ratio across temperatures.",
    },
    {
      selector: "fit-line",
      label: "Linear fit",
      explanation:
        "The dashed best-fit line is the analytical prediction from the Arrhenius equation ln(k) = ln(A) − (Ea/R)·(1/T) with Ea = 103 kJ/mol and A = 4.3×10¹³ s⁻¹. In practice, the line is fitted to experimental data by linear regression; the slope and intercept are then read to extract Ea and A. Curvature in the Arrhenius plot signals non-Arrhenius behaviour: multiple pathways, tunnelling, or a temperature-dependent pre-exponential.",
    },
    {
      selector: "slope",
      label: "Slope — −Ea/R",
      explanation:
        "The slope of the line equals −Ea/R where Ea is the activation energy and R = 8.314 J mol⁻¹ K⁻¹ is the gas constant. For N₂O₅, slope ≈ −12,391 K, giving Ea ≈ 103 kJ/mol. Physical intuition: the slope is the 'height of the hill' the reaction must climb. A steeper line means stronger temperature sensitivity — the reaction is hard to start but accelerates sharply once warmed.",
    },
    {
      selector: "intercept",
      label: "Intercept — ln(A)",
      explanation:
        "The y-intercept is ln(A), where A is the pre-exponential (frequency) factor. For N₂O₅, A ≈ 4.3×10¹³ s⁻¹, encoding the collision frequency and orientation probability at infinite temperature. Eyring's 1935 transition-state theory reinterprets A in terms of an activated complex partition function, connecting the Arrhenius empiricism to quantum-statistical mechanics.",
    },
    {
      selector: "data-point",
      label: "Data point",
      explanation:
        "Each filled circle is one (T, k) measurement converted to (1/T, ln k). The six temperatures span 298–398 K; the corresponding rate constants vary by roughly four orders of magnitude. Residuals from the line quantify measurement error and test whether the reaction follows simple Arrhenius kinetics across the window.",
    },
  ],
};
