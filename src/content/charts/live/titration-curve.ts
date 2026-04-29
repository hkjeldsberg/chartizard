import type { LiveChart } from "@/content/chart-schema";

export const titrationCurve: LiveChart = {
  id: "titration-curve",
  name: "Titration Curve",
  family: "relationship",
  sectors: ["chemistry"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Plots pH against volume of titrant added, encoding the stoichiometric endpoint and acid strength as geometric features of the curve.",

  whenToUse:
    "Use a titration curve when you need to determine an analyte's concentration, identify its pKa, or distinguish strong from weak acids by the shape of the approach to equivalence. The inflection point locates the equivalence volume; the half-equivalence plateau locates the pKa for weak acids. Neither piece of information is legible from a bare concentration calculation.",

  howToRead:
    "Read left-to-right as titrant accumulates. For a strong acid titrated by strong base, the pH rises slowly through the buffer region, then climbs nearly vertically through the equivalence point (pH 7 for 0.1 M HCl + NaOH), then levels off in excess base. For a weak acid, the pre-equivalence rise is gentler and a plateau forms at pH = pKa — here acetic acid at pH 4.76, identified by Søren Sørensen at the Carlsberg Laboratory in 1909 using his logarithmic scale. The solid curve is strong-strong; the dashed curve is weak-strong.",

  example: {
    title: "0.1 M HCl vs. 0.1 M acetic acid titrated by 0.1 M NaOH",
    description:
      "The two curves diverge immediately: HCl starts near pH 1 and rises steeply; acetic acid starts at pH 2.9 and holds near pH 4.76 through the buffer region. Both reach their equivalence volume at 25 mL, but the strong-strong equivalence is at pH 7 while the weak-strong equivalence is at pH 8.7, because the acetate conjugate base hydrolyses water. Svante Arrhenius's 1887 ionic dissociation theory, published in Zeitschrift für physikalische Chemie, gives the framework that makes these two shapes different.",
  },

  elements: [
    {
      selector: "x-axis",
      label: "X-axis — titrant volume",
      explanation:
        "The x-axis records the volume of titrant (NaOH, mL) added. Volume is a proxy for moles of base: at 0.1 M, 25 mL equals 2.5 mmol, matching the 2.5 mmol of acid in the analyte flask. The stoichiometric equivalence always falls at this volume regardless of acid strength.",
    },
    {
      selector: "strong-acid-curve",
      label: "Strong-acid curve",
      explanation:
        "The solid S-shaped curve traces a strong acid (HCl) titrated by strong base. Hydrochloric acid dissociates completely, so the pre-equivalence pH is set entirely by the remaining [H⁺] concentration. The nearly vertical segment spanning pH 3–11 over roughly 0.2 mL of titrant is diagnostic of a strong-strong system. Arrhenius's 1887 ionic theory explains why HCl contributes a full equivalent of H⁺ per mole.",
    },
    {
      selector: "weak-acid-curve",
      label: "Weak-acid curve",
      explanation:
        "The dashed curve traces a weak acid (acetic acid, pKa 4.76) titrated by strong base. Partial dissociation produces the characteristic buffer plateau before equivalence: adding base converts CH₃COOH to CH₃COO⁻ in a Henderson-Hasselbalch equilibrium that resists pH change. The curve is shallower near equivalence than the strong-strong case, and the equivalence pH shifts to 8.7 because the acetate ion is itself a base.",
    },
    {
      selector: "half-equivalence",
      label: "Half-equivalence — pKa reading",
      explanation:
        "At exactly half the equivalence volume (12.5 mL), half the acetic acid has been converted to acetate: [CH₃COOH] = [CH₃COO⁻], so the Henderson-Hasselbalch equation reduces to pH = pKa. The open circle marks this point at pH 4.76 on the dashed curve. No calculation beyond reading the ordinate is required to determine the acid's pKa from the titration curve.",
    },
    {
      selector: "equivalence-point",
      label: "Equivalence point",
      explanation:
        "The filled circle marks the equivalence point of the strong-strong titration at pH 7 and 25 mL. This is the steepest part of the S-curve — the inflection. In practice, analysts detect it by finding the maximum of d(pH)/dV, not by visual inspection. For strong acids and bases the equivalence pH is precisely 7 at 25 °C because neither Na⁺ nor Cl⁻ hydrolyses water.",
    },
    {
      selector: "excess-base-plateau",
      label: "Excess-base plateau",
      explanation:
        "Beyond 27 mL, additional NaOH adds excess [OH⁻] and the pH asymptotes toward 12–13. Both curves converge here: once acid is exhausted, the pH depends only on the concentration of excess base, regardless of the original acid's strength. The curve flattens because the logarithmic pH scale compresses the remaining range.",
    },
    {
      selector: "y-axis",
      label: "Y-axis — pH",
      explanation:
        "The y-axis runs 0–14 on Søren Sørensen's 1909 logarithmic scale, defined as pH = –log[H⁺]. Sørensen introduced the scale at the Carlsberg Laboratory to standardise enzyme studies. Each unit represents a tenfold change in hydrogen-ion activity. The full 0–14 range maps strong acid (pH 0–1) to strong base (pH 13–14) with neutrality at pH 7.",
    },
  ],
};
