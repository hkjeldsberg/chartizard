import type { LiveChart } from "@/content/chart-schema";

export const smithChart: LiveChart = {
  id: "smith-chart",
  name: "Smith Chart",
  family: "specialty",
  sectors: ["electrical"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A polar graph of complex reflection coefficient with impedance read off a web of circles — the chart that turned RF matching into ruler-and-compass geometry.",
  whenToUse:
    "Reach for a Smith chart whenever a radio-frequency design question involves impedance matching, transmission-line behaviour, or reflection loss — antennas, filters, amplifier input networks, cable terminations. It collapses the transcendental equation Γ = (Z−Z₀)/(Z+Z₀) into a pair of orthogonal circle families you can read with a protractor. Modern software does the maths, but RF engineers still sketch Smith charts on paper to reason about the topology of a match.",
  howToRead:
    "Every point inside the unit circle is a valid reflection coefficient Γ (a complex number with |Γ| ≤ 1). Constant-resistance circles all pass through the right-edge point and label the real part of the normalised impedance; constant-reactance arcs all emanate from that same point and label the imaginary part. To locate an impedance, find the intersection of its R circle and its X arc. Moving along a transmission line rotates the point around the chart's centre — clockwise toward the generator, counter-clockwise toward the load — at a rate of one full turn per half-wavelength.",
  example: {
    title: "Phillip Smith, Bell Labs, 1939",
    description:
      "Phillip Hagar Smith published the chart in Electronics magazine in January 1939 while working at Bell Telephone Laboratories, as a nomogram for the Western Electric engineers designing microwave relay systems. Before Smith's chart, impedance matching at radio frequencies meant pages of complex algebra; after it, the same problem became a geometric construction you could solve with a compass and a piece of tracing paper. The chart is still printed in RF textbooks eighty-five years later — not as a historical artifact, but because sketching the trajectory of a matching network on a Smith chart remains the fastest way to build an intuition for why a stub placed here or a capacitor added there lands you at the centre.",
  },
  elements: [
    {
      selector: "unit-circle",
      label: "Unit-circle boundary",
      explanation:
        "The outer rim is |Γ| = 1 — total reflection. Anything inside corresponds to a passive load absorbing some power; anything outside would imply a load reflecting more power than went in, which is unphysical for passive components. Active circuits (amplifiers, negative-resistance devices) can briefly map outside the rim, which is exactly how oscillation conditions are diagnosed.",
    },
    {
      selector: "resistance-circle",
      label: "Constant-resistance circle",
      explanation:
        "A circle of centre (R/(1+R), 0) and radius 1/(1+R), always tangent to the right-edge point Γ = +1. Every point on it has the same real part of normalised impedance (R = 1 is the big central circle; R = 0 is the unit circle itself; R → ∞ collapses to the right-edge point).",
    },
    {
      selector: "reactance-arc",
      label: "Constant-reactance arc",
      explanation:
        "Arcs of circles centred at (1, 1/X) with radius |1/X|, clipped to the unit disc. Upper-half arcs are inductive (+jX); lower-half arcs are capacitive (−jX); the horizontal axis itself is pure resistance (X = 0). A reactance arc and a resistance circle meet orthogonally — that's not an accident, it's a conformal-mapping invariant of the bilinear transform Γ = (Z−1)/(Z+1).",
    },
    {
      selector: "matched-centre",
      label: "Chart centre (Γ = 0)",
      explanation:
        "The centre of the chart is a perfect match: Z = Z₀ (normalised to 1), no reflection, all power delivered to the load. Every matching-network design task reduces to 'how do I drag the operating point from wherever it started into this centre dot?'",
    },
    {
      selector: "open-circuit",
      label: "Right-edge point (Γ = +1, open circuit)",
      explanation:
        "Γ = +1 corresponds to an open circuit — infinite impedance, a wave that hits the end of an unterminated line and bounces back in phase. It's the common tangent point for every constant-resistance circle and the origin point for every constant-reactance arc. Its opposite, Γ = −1 on the left edge, is a short circuit.",
    },
    {
      selector: "example-impedance",
      label: "Plotted impedance Z = 0.5 + 0.5j",
      explanation:
        "A worked example: normalised impedance Z = 0.5 + 0.5j maps to Γ = (Z−1)/(Z+1) = (−0.5 + 0.5j)/(1.5 + 0.5j) = −0.2 + 0.4j. Plot it and you land at the intersection of the R = 0.5 circle and the X = +0.5 arc — exactly where the two contour families predict, which is the whole point of the chart.",
    },
  ],
};
