import type { LiveChart } from "@/content/chart-schema";

export const jablonskiDiagram: LiveChart = {
  id: "jablonski-diagram",
  name: "Jablonski Diagram",
  family: "specialty",
  sectors: ["chemistry", "physics"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Stacks a molecule's electronic and vibrational states vertically by energy, then draws every absorption and emission pathway between them as a labelled arrow.",
  whenToUse:
    "Reach for a Jabłoński diagram when you need to reason about photophysics — which absorption feeds which emission, why fluorescence is red-shifted from the excitation, why phosphorescence is slow. It is the photochemist's working diagram, not a communication chart: every arrow is a rate constant, and the diagram is how you decide whether a molecule will fluoresce, cross to triplet, or relax non-radiatively. Use a simple absorption/emission spectrum instead when the story is only about wavelengths.",
  howToRead:
    "Energy runs up the y-axis. Thick horizontal lines are electronic states; thin lines above each are vibrational sub-levels. Singlet states (S₀, S₁, S₂) sit on the left; the first triplet T₁ is drawn on the right to separate it by spin. Straight arrows are radiative transitions (absorption up, fluorescence or phosphorescence down) and carry a photon. Squiggly arrows are non-radiative: internal conversion between same-spin states, intersystem crossing between singlet and triplet. Follow a photon from S₀ upward, then trace where the energy can go — that cascade is what the diagram is for.",
  example: {
    title: "Why fluorescein glows green after absorbing blue light",
    description:
      "Aleksander Jabłoński drew the first version of this diagram in Toruń in 1933 to explain why emission lags absorption in wavelength. Fluorescein absorbs blue (~490 nm) into a vibrationally-excited S₁, then loses the vibrational quanta as heat before emitting at green (~515 nm) — the Stokes shift is exactly the vertical gap the arrows make visible. The same diagram, extended down to T₁, is how Michael Kasha in 1950 formulated the rule that emission comes from the lowest excited state of a given multiplicity, regardless of which band you excited.",
  },
  elements: [
    {
      selector: "electronic-state",
      label: "Electronic state",
      explanation:
        "Each thick horizontal line is an electronic state: S₀ is the ground state, S₁ and S₂ are the first two excited singlets. The vertical distance between lines is the energy gap, and therefore the photon energy required to hop between them. The line's length has no physical meaning — it's a horizontal canvas for the vibrational stack above it.",
    },
    {
      selector: "vibrational-sublevels",
      label: "Vibrational sub-levels",
      explanation:
        "The thin lines stacked above each electronic state are vibrational sub-levels — nuclear motion on top of the electronic configuration. Absorption typically lands on one of the upper sub-levels; the molecule then cascades down to the lowest sub-level of that electronic state in picoseconds. This vibrational relaxation is why emission is almost always red-shifted from absorption — the Stokes shift.",
    },
    {
      selector: "absorption",
      label: "Absorption",
      explanation:
        "The violet upward arrows are absorption events: a photon promotes the molecule from S₀ to S₁ or S₂. The transition is drawn vertical because it happens on a femtosecond timescale — far faster than nuclear motion — so the nuclear geometry does not change during the jump. This is the Franck-Condon principle made visible.",
    },
    {
      selector: "fluorescence",
      label: "Fluorescence",
      explanation:
        "The cyan downward arrow from S₁ to S₀ is fluorescence — a spin-allowed radiative transition that emits a photon in nanoseconds. It always starts from S₁, never S₂, because internal conversion between singlets is faster than emission. That single rule, known as Kasha's rule (Michael Kasha, 1950), is why the emission spectrum has a shape that does not depend on which band you excited.",
    },
    {
      selector: "intersystem-crossing",
      label: "Intersystem crossing",
      explanation:
        "The squiggly arrow from S₁ to T₁ is intersystem crossing — a non-radiative, spin-forbidden transition that flips the electron's spin. It is slow compared to fluorescence in light molecules, but spin-orbit coupling can make it competitive or dominant, which is why heavy atoms (iodine, bromine, transition metals) make a molecule phosphoresce instead of fluoresce.",
    },
    {
      selector: "phosphorescence",
      label: "Phosphorescence",
      explanation:
        "The red, dashed arrow from T₁ back to S₀ is phosphorescence — radiative decay from the triplet to the singlet ground state. Because the transition is spin-forbidden, it is slow: microseconds for organometallics, up to seconds for rigid organics. The long lifetime is the whole reason glow-in-the-dark paint glows after the lights go out.",
    },
    {
      selector: "triplet-state",
      label: "Triplet state",
      explanation:
        "T₁ is the lowest excited state with two unpaired electrons of parallel spin. It sits below S₁ because exchange repulsion lowers its energy (Hund's rule applied to excited states). Drawing it offset from the singlet ladder is a visual convention that reinforces the spin split — the same convention Jabłoński used in 1933, because crossing that gap requires a physical process the diagram names explicitly: intersystem crossing.",
    },
  ],
};
