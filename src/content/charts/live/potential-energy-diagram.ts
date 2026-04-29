import type { LiveChart } from "@/content/chart-schema";

export const potentialEnergyDiagram: LiveChart = {
  id: "potential-energy-diagram",
  name: "Potential Energy Diagram",
  family: "specialty",
  sectors: ["chemistry"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A reaction-coordinate curve that carries both kinetic and thermodynamic information in one frame: the peak height is the activation energy Eₐ; the plateau-to-plateau drop is the reaction enthalpy ΔH.",
  whenToUse:
    "Use a potential energy diagram when you need to show the energy landscape of a chemical transformation and communicate two distinct quantities simultaneously: the kinetic barrier (how fast the reaction goes) and the thermodynamic driving force (how far it goes). It is the standard representation for elementary reaction steps in physical chemistry and biochemistry. A second dashed curve for the catalysed pathway makes the catalyst's role unmistakable: it lowers the peak without moving the plateaus. Do not conflate this with an Arrhenius plot (Batch 9) — that chart shows how rate depends on temperature across many experiments; this chart shows one reaction's energy landscape.",
  howToRead:
    "Read left to right along the reaction coordinate. The flat region on the left is the reactants at their ground-state energy (set to 0 by convention). The curve rises to a peak — the transition state (TS‡), the saddle-point structure the system must pass through. The height of this peak above the reactants plateau is the activation energy Eₐ. The curve then falls to the products plateau; the signed difference between products and reactants is ΔH (negative here, meaning the reaction releases heat: exothermic). The dashed curve is the catalysed pathway — same start and end, but a lower peak (lower Eₐ, therefore faster rate). Both curves share the same ΔH.",
  example: {
    title: "A + B → C + D with homogeneous acid catalyst",
    description:
      "Henry Eyring, Michael Polanyi, and M.G. Evans formalised the transition-state theory in 1935 (Eyring, J. Chem. Phys. 3, 107; Evans and Polanyi, Trans. Faraday Soc. 31, 875). Their key result — that rate = (kT/h)·exp(−Eₐ/RT) — is encoded in this chart: the Boltzmann factor exp(−Eₐ/RT) is exactly the fraction of molecular collisions with enough energy to clear the hill. An acid catalyst lowers the peak by providing an alternative reaction mechanism; the product stability (ΔH) is unchanged because the catalyst is regenerated at the end. The same diagram style distinguishes exothermic from endothermic reactions at a glance: if products sit above reactants, the reaction absorbs heat and ΔH is positive.",
  },
  elements: [
    {
      selector: "x-axis",
      label: "Reaction coordinate",
      explanation:
        "The reaction coordinate is not a single measurable observable but a parametric path through configuration space along which the reaction progresses. Left is reactants; right is products; the intermediate saddle point is the transition state. The axis has no absolute units — it represents progress, not time or distance.",
    },
    {
      selector: "y-axis",
      label: "Potential energy axis",
      explanation:
        "Potential energy in kJ/mol, referenced to the reactants ground state at zero. The y-axis combines electronic energy and zero-point vibrational energy in the Born-Oppenheimer approximation. Negative values indicate species more stable than the reactants; positive values indicate less stable intermediates.",
    },
    {
      selector: "reactants-plateau",
      label: "Reactants plateau",
      explanation:
        "The left flat region is the ground-state energy of the reactants A + B, set to 0 kJ/mol by convention. In transition-state theory (Eyring, 1935), the rate depends on the energy gap between this plateau and the transition-state peak — not on the shape of the connecting curve.",
    },
    {
      selector: "transition-state",
      label: "Transition state (TS‡)",
      explanation:
        "The transition state is the highest-energy point along the reaction path — a saddle point on the potential energy surface. It is not an isolable species; its lifetime is on the order of a single molecular vibration (~10 fs). The ‡ symbol by convention marks quantities referring to the transition state. Eₐ = 100 kJ/mol here; at 298 K this corresponds to roughly one in 10¹⁷ collisions having sufficient energy to react.",
    },
    {
      selector: "products-plateau",
      label: "Products plateau",
      explanation:
        "The right flat region at −80 kJ/mol is the ground-state energy of the products C + D. The 80 kJ/mol difference from the reactants plateau is the reaction enthalpy ΔH: negative (exothermic) because products are more stable. ΔH determines the equilibrium constant Keq via ΔG = ΔH − TΔS; Eₐ determines the rate constant k. Both are encoded in this single diagram.",
    },
    {
      selector: "activation-energy",
      label: "Activation energy Eₐ",
      explanation:
        "The double-headed arrow from the reactants plateau to the TS peak is Eₐ, the minimum energy a collision must supply for the reaction to proceed. Svante Arrhenius introduced the concept in 1889 (Z. Phys. Chem. 4, 226) to explain why reaction rates increase exponentially with temperature. The Eyring equation (1935) gave Eₐ a molecular interpretation as the difference in Gibbs free energy between the transition state and the reactant ground state.",
    },
    {
      selector: "catalysed-pathway",
      label: "Catalysed pathway",
      explanation:
        "The dashed curve is the catalysed route — same reactants plateau at 0 kJ/mol and same products plateau at −80 kJ/mol, but the peak falls to 60 kJ/mol (Eₐ reduced by 40 kJ/mol). A catalyst provides an alternative reaction mechanism with a lower-energy TS; it is regenerated at the end so it does not appear in the stoichiometry and does not change ΔH. By the Arrhenius equation, reducing Eₐ by 40 kJ/mol at 298 K increases the rate by a factor of roughly 10⁷.",
    },
  ],
};
