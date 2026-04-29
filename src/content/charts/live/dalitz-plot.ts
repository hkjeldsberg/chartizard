import type { LiveChart } from "@/content/chart-schema";

export const dalitzPlot: LiveChart = {
  id: "dalitz-plot",
  name: "Dalitz Plot",
  family: "distribution",
  sectors: ["physics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",

  synopsis:
    "2D scatter of squared invariant masses for a three-body particle decay, whose density reveals intermediate resonances and CP violation.",

  whenToUse:
    "Use a Dalitz plot when you have a parent particle decaying to exactly three daughters and you need to see whether the decay proceeds through an intermediate resonance (two daughters forming a short-lived meson). The two-degree-of-freedom phase space is completely captured by two independent invariant-mass-squared combinations, making the Dalitz plane the natural canvas.",

  howToRead:
    "The axes are m₁₂² and m₂₃² — squares of the invariant masses of two daughter-particle pairs, in GeV². Every kinematically-allowed event falls inside the closed curve called the Dalitz boundary; events outside are forbidden by energy-momentum conservation. A uniform density inside would indicate pure phase space. Concentrations along a horizontal or vertical stripe at fixed m² signal a resonance: the stripe at m(K⁻π⁺)² ≈ 0.796 GeV² is the K*(892); the stripe at m(π⁺π⁰)² ≈ 0.593 GeV² is the ρ(770).",

  example: {
    title:
      "LHCb 2019 CP violation in D⁰ → K⁺K⁻ vs π⁺π⁻ (charm CPV discovery)",
    description:
      "Richard Dalitz introduced the plot in 1953 (Phil. Mag. 44:357) to analyse τ-meson (now K⁺) decays. Its modern power is in B- and D-meson three-body decays at LHCb: by comparing the Dalitz plane density for D⁰ versus D̄⁰ decays, LHCb measured the first observation of CP violation in the charm sector (2019, Aaij et al., PRL 122:211803) — a Δ(ACP) of −0.154% between K⁺K⁻ and π⁺π⁻ modes, a 5.3σ signal. The comparison sibling manhattan-plot (Batch 7) also uses scatter with density bands but measures genomic rather than quantum-mechanical significance.",
  },

  elements: [
    {
      selector: "dalitz-boundary",
      label: "Dalitz boundary",
      explanation:
        "The closed curve enclosing the kinematically-allowed region. Its shape comes from energy-momentum conservation for D⁰ → K⁻π⁺π⁰ with mD = 1.865 GeV: for each value of m(K⁻π⁺)², only a bounded range of m(π⁺π⁰)² is reachable. Events near the boundary edge correspond to configurations where one daughter is emitted at rest in the rest frame of the other two.",
    },
    {
      selector: "phase-space",
      label: "Phase-space background",
      explanation:
        "Events in the interior with no nearby resonance represent non-resonant three-body decays distributed by pure phase space. In the absence of dynamics, the Dalitz plot would be uniformly filled; the observed non-uniformity is entirely due to resonant intermediate states.",
    },
    {
      selector: "kstar-band",
      label: "K*(892) resonance band",
      explanation:
        "The vertical density enhancement at m(K⁻π⁺)² ≈ 0.796 GeV² (= 0.892² GeV²) is the K*(892) vector meson: it decays to K⁻π⁺ with a width of ~50 MeV, which translates to a stripe in the x-direction. Its presence demonstrates that D⁰ → K*(892) π⁰ is a dominant sub-decay.",
    },
    {
      selector: "rho-band",
      label: "ρ(770) resonance band",
      explanation:
        "The horizontal density enhancement at m(π⁺π⁰)² ≈ 0.593 GeV² (= 0.770² GeV²) is the ρ(770) vector meson: it decays to π⁺π⁰ with a width of ~150 MeV. Interference between the K*(892) band and the ρ(770) band at their crossing point encodes the strong-phase difference between the two amplitudes — the information extracted in time-dependent Dalitz amplitude analyses.",
    },
    {
      selector: "x-axis",
      label: "m(K⁻π⁺)² axis (GeV²)",
      explanation:
        "The squared invariant mass of the kaon-pion pair is a Lorentz invariant: m₁₂² = (pK + pπ)². It ranges from (mK + mπ)² ≈ 0.40 GeV² to (mD − mπ)² ≈ 2.96 GeV². Resonances in this pair appear as vertical bands.",
    },
    {
      selector: "y-axis",
      label: "m(π⁺π⁰)² axis (GeV²)",
      explanation:
        "The squared invariant mass of the two-pion pair. It ranges from (2mπ)² ≈ 0.08 GeV² to (mD − mK)² ≈ 1.88 GeV². Resonances in this pair appear as horizontal bands. The third combination m(K⁻π⁰)² is not independent: energy-momentum conservation fixes it once the two plotted axes are known.",
    },
  ],
};
