import type { LiveChart } from "@/content/chart-schema";

export const carpetPlot: LiveChart = {
  id: "carpet-plot",
  name: "Carpet Plot",
  family: "relationship",
  sectors: ["electrical"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Two families of intersecting curves on a 2D plane — each curve parameterised by a third variable, so the plane reads as the outcome of a two-variable design space.",
  whenToUse:
    "Reach for a carpet plot when two independent design parameters jointly drive a pair of outcome metrics, and you want the reader to trace from a desired outcome back to the parameter combination that produced it. It is the preferred encoding in aerospace conceptual design because it shows trade-offs without flattening either input — contour plots collapse one input to a contour level; carpet plots preserve both.",
  howToRead:
    "The plane axes are the OUTCOMES (here range against payload). The two carpet string families are the INPUTS — one family holds one parameter constant while sweeping the other. Pick a target operating point on the plane; follow the two curves that intersect there back to their labels, and you have read off the design variables that produce that performance. Tightly packed strings mean the outcome is insensitive to the parameter; widely spaced strings mean small input changes move the outcome a long way.",
  example: {
    title: "Aircraft conceptual design at Boeing, Airbus, Lockheed",
    description:
      "A transport aircraft carpet plots range against payload with solid iso-MTOW strings (120k, 140k, ... 200k lb gross weight) and dashed iso-wing-loading strings (100, 115, ... 160 lb/ft²). A mission calling for 2,800 nm at 25,000 lb of payload lands on the 180k-MTOW solid string crossing the 130 W/S dashed string — sizing the wing and the fuel fraction in one read. Developed by NACA engineers in the 1920s and 30s for trade studies; still the preferred encoding in aerospace performance guides a century later because no other chart lets two design variables ride the curves while the plane shows the design-space outcome.",
  },
  elements: [
    {
      selector: "weight-strings",
      label: "Iso-weight strings",
      explanation:
        "Each solid curve holds gross weight constant while wing loading sweeps along the curve. Moving from one solid curve to the next means the aircraft grew heavier — more fuel, more structure, a longer reach at the same payload. The spacing between solid strings encodes how aggressively weight buys range.",
    },
    {
      selector: "loading-strings",
      label: "Iso-loading strings",
      explanation:
        "Each dashed curve holds wing loading constant while gross weight sweeps along the curve. Higher W/S means a smaller wing under the same weight — less structure and drag, but more induced drag at cruise and a worse low-speed margin. The dashed family is the second design axis woven against the first.",
    },
    {
      selector: "design-point",
      label: "Design point",
      explanation:
        "The intersection an engineer is choosing — one solid-string value times one dashed-string value. Reading the point back up both strings recovers the two design variables; reading its position on the plane gives the mission performance. A carpet plot's whole job is to make this translation one glance instead of a spreadsheet.",
    },
    {
      selector: "x-axis",
      label: "Cruise range",
      explanation:
        "The outcome along one axis of the design plane — how far the aircraft flies at a given payload. Together with payload it defines the mission. The carpet strings encode how gross weight and wing loading trade against this distance.",
    },
    {
      selector: "y-axis",
      label: "Payload",
      explanation:
        "The outcome along the other axis of the design plane — how much revenue cargo or passenger mass the aircraft carries at a given range. Unlike a contour plot where one of these would be a level value, the carpet reads the plane as the joint outcome of the two carpet-string inputs.",
    },
  ],
};
