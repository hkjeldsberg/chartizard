import type { LiveChart } from "@/content/chart-schema";

export const feynmanDiagram: LiveChart = {
  id: "feynman-diagram",
  name: "Feynman Diagram",
  family: "specialty",
  sectors: ["physics"],
  dataShapes: ["network"],
  tileSize: "S",
  status: "live",

  synopsis:
    "A pictorial calculus for quantum field theory: each diagram is a term in the perturbation expansion, with every vertex contributing a factor of the coupling constant and every line encoding a particle propagator.",

  whenToUse:
    "Feynman diagrams are the working notation of quantum field theory — use them whenever you need to enumerate and compute contributions to scattering amplitudes, decay rates, or quantum corrections to physical quantities. Each topologically distinct diagram corresponds to a specific integral; drawing all diagrams to a given order in the coupling constant is equivalent to expanding the path integral to that order in perturbation theory.",

  howToRead:
    "Time runs left to right by convention. Solid lines with arrows represent fermions; arrow direction follows the particle-flow convention (arrows point forward in time for particles, backward for antiparticles, so a positron line runs rightward in space but its arrow points leftward). Wavy lines are photon propagators. Each junction where lines meet is a vertex; each vertex contributes one factor of the electromagnetic coupling e (or equivalently the fine-structure constant α ≈ 1/137). The diagram shown is tree-level Bhabha scattering: e⁻ + e⁺ → γ* → e⁻ + e⁺.",

  example: {
    title: "QED radiative corrections to the electron g-factor, 1948",
    description:
      "Julian Schwinger computed the leading quantum correction to the electron magnetic moment — (α/2π) ≈ 0.00116 — using the one-loop self-energy diagram in QED. The result matched Polykarp Kusch's precision measurement to within experimental error and was the first demonstration that Feynman diagrams, once Dyson proved their equivalence to Schwinger and Tomonaga's formalisms in 1949, were a complete and systematic computational tool rather than a heuristic sketch.",
  },

  elements: [
    {
      selector: "incoming-fermion",
      label: "Incoming fermion (electron)",
      explanation:
        "The solid line running left to V1 represents the incoming electron. The arrowhead points in the direction of increasing time — forward for electrons. Feynman introduced this solid-line notation in *Phys. Rev.* 76 (1949) to make the bookkeeping of spin-1/2 particles in perturbation theory tractable; each solid line corresponds to a factor of the electron propagator S_F(p) in the Feynman rules.",
    },
    {
      selector: "incoming-antifermion",
      label: "Incoming antifermion (positron)",
      explanation:
        "The solid line for the incoming positron also runs from the left, but its arrow points to the left — backward in time by Feynman's convention. Stückelberg and Feynman independently noticed that a positron moving forward in time is mathematically equivalent to an electron moving backward; the reversed arrow encodes this. The antiparticle interpretation follows directly from the arrow direction rather than from the charge label.",
    },
    {
      selector: "vertex",
      label: "Vertex (coupling factor ∝ e)",
      explanation:
        "A vertex is a point where a fermion line and a photon line meet. Each vertex contributes one factor of the elementary charge e (or, in dimensionless terms, one factor of √α ≈ 1/11.7). Counting vertices tells you the order of the diagram in perturbation theory: this tree-level diagram has two vertices, so it contributes at order e² ∝ α. Loop diagrams have additional vertices and require renormalisation.",
    },
    {
      selector: "photon-propagator",
      label: "Photon propagator (wavy line)",
      explanation:
        "The wavy line between the two vertices is the virtual photon propagator D_F(q), a factor of −g_μν / q² in Feynman gauge. The photon is 'virtual' because q² ≠ 0 (it is off-shell) — its four-momentum is determined by the momenta of the external particles, not by the photon dispersion relation. Dyson's 1949 paper proved that the wavy-line shorthand translates to this Green's function exactly.",
    },
    {
      selector: "outgoing-fermions",
      label: "Outgoing fermions",
      explanation:
        "The two solid lines exiting V2 represent the final-state electron (arrow rightward) and positron (arrow leftward). In the Feynman rules, each external outgoing fermion contributes a factor of the spinor ū(p, s) and each outgoing antifermion a factor of v̄(p, s). The amplitude squared, summed over final spins and averaged over initial spins, gives the differential cross-section via the LSZ reduction formula.",
    },
    {
      selector: "time-direction",
      label: "Time-direction convention",
      explanation:
        "Feynman standardised the left-to-right time axis at the Pocono conference in April 1948, making his diagrams immediately readable as space-time histories. Earlier perturbation-theory bookkeeping used ordered operator products that obscured the physical picture; Feynman's space-time approach, as he titled his 1949 paper, converted operator equations into geometric paths that could be drawn on a page and enumerated systematically to any loop order.",
    },
  ],
};
