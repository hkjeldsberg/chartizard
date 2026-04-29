import type { LiveChart } from "@/content/chart-schema";

export const lineweaverBurkPlot: LiveChart = {
  id: "lineweaver-burk-plot",
  name: "Lineweaver-Burk Plot",
  family: "relationship",
  sectors: ["chemistry"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Double-reciprocal linearisation of the Michaelis-Menten equation — plots 1/v against 1/[S] to extract Km and Vmax geometrically from a straight line.",

  whenToUse:
    "Use a Lineweaver-Burk plot when you need to present enzyme kinetics data in a classroom or diagnostic context, particularly to illustrate the difference between competitive, non-competitive, and uncompetitive inhibition — each inhibitor type shifts the line in a visually distinct way. Modern enzyme studies prefer direct nonlinear regression of the v-vs-[S] hyperbola, because the double-reciprocal transformation compresses data at high [S] and magnifies experimental error; Lineweaver-Burk is now primarily pedagogical.",

  howToRead:
    "The x-axis is 1/[S] (reciprocal substrate concentration, mM⁻¹) and the y-axis is 1/v (reciprocal reaction rate). Every measurement becomes a point on a line whose slope equals Km/Vmax. The y-intercept, where the line crosses the y-axis at 1/[S] = 0, equals 1/Vmax — the reciprocal of the maximum rate. The x-intercept, where the line crosses the x-axis at 1/v = 0, equals −1/Km. Both enzyme constants are read directly from the line without curve fitting.",

  example: {
    title: "Hexokinase inhibition, 1934 — the inaugural Lineweaver-Burk publication",
    description:
      "Hans Lineweaver and Dean Burk applied the double-reciprocal method to yeast hexokinase data in their 1934 JACS paper (56(3):658–666). The transformation let them plot four inhibitor concentrations as four non-intersecting lines — competitive inhibitor lines pivot on the y-intercept; non-competitive lines pivot on the x-intercept — making the inhibition mechanism legible at a glance from the convergence point. The same graphical logic still appears in every undergraduate biochemistry textbook.",
  },

  elements: [
    {
      selector: "y-axis",
      label: "Y-axis (1/v)",
      explanation:
        "The reciprocal reaction rate. Because v is bounded above by Vmax, 1/v has a finite lower bound of 1/Vmax — the y-intercept of the fitted line. Michaelis-Menten's hyperbola becomes a straight line in this coordinate because the double-reciprocal transformation is linear in both 1/[S] and 1/v.",
    },
    {
      selector: "x-axis",
      label: "X-axis (1/[S])",
      explanation:
        "The reciprocal substrate concentration in mM⁻¹. Zero on this axis corresponds to an infinitely saturating substrate — physically, the limit as [S] → ∞. Data points at high 1/[S] (low [S]) carry disproportionate influence on the slope because they are widely spaced along x; this is the primary statistical weakness Lineweaver and Burk identified themselves.",
    },
    {
      selector: "fit-line",
      label: "Fitted line",
      explanation:
        "The least-squares line through the reciprocal data. Its slope is Km/Vmax and its y-intercept is 1/Vmax. Any change in inhibitor type shifts this line predictably: competitive inhibitors change only the slope; non-competitive inhibitors change both slope and intercept proportionally; uncompetitive inhibitors raise the y-intercept while leaving the x-intercept fixed.",
    },
    {
      selector: "slope-annotation",
      label: "Slope = Km/Vmax",
      explanation:
        "The slope of the Lineweaver-Burk line equals Km divided by Vmax. For the example here — Km = 0.1 mM, Vmax = 5.0 µmol/min — slope = 0.02. Inhibitors that raise apparent Km without changing Vmax (competitive inhibition) steepen the slope; inhibitors that reduce Vmax without changing Km (non-competitive) also change the slope by the same factor they reduce Vmax.",
    },
    {
      selector: "x-intercept",
      label: "X-intercept = −1/Km",
      explanation:
        "The point where the fitted line crosses 1/v = 0 lies at 1/[S] = −1/Km. Here Km = 0.1 mM, so the x-intercept is −10 mM⁻¹. The negative sign is a consequence of the algebraic extrapolation — no experiment is run at negative substrate concentration; the intercept is a geometric feature of the linear fit extended leftward through the y-axis.",
    },
    {
      selector: "y-intercept",
      label: "Y-intercept = 1/Vmax",
      explanation:
        "Where the line crosses 1/[S] = 0, y = 1/Vmax. For Vmax = 5.0 µmol/min, the y-intercept is 0.20 min/µmol. Lineweaver and Burk (1934) noted that this intercept is robust to scatter in the low-[S] data, unlike graphical estimates of Vmax from the hyperbola itself, which required extrapolation to saturation that was often inaccessible experimentally.",
    },
  ],
};
