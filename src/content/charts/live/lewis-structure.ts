import type { LiveChart } from "@/content/chart-schema";

export const lewisStructure: LiveChart = {
  id: "lewis-structure",
  name: "Lewis Structure",
  family: "specialty",
  sectors: ["chemistry"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Valence-electron diagrams that show how atoms share or retain electron pairs — the canonical representation in general chemistry for counting bonds and lone pairs.",

  whenToUse:
    "Use a Lewis structure when you need to show the connectivity and electron distribution of a small molecule unambiguously. It is the first step before applying VSEPR theory to predict three-dimensional geometry, and before writing resonance structures for delocalised systems. Lewis structures are inappropriate for large organic molecules, where skeletal line-angle drawings (which omit lone pairs and imply carbon at each vertex) are standard.",

  howToRead:
    "Each element symbol represents the nucleus and its core (non-valence) electrons. A line between two symbols is a shared electron pair — one bond. Two parallel lines are a double bond (two shared pairs); three lines are a triple bond. Dots drawn beside a symbol are lone (non-bonding) pairs. Count the bonds and lone pairs on any non-hydrogen atom: if the sum of electrons equals 8, the octet rule is satisfied. Hydrogen is complete with 2 electrons (one bond, no lone pairs).",

  example: {
    title: "Water and carbon dioxide — Gilbert N. Lewis, JACS 1916",
    description:
      "Gilbert N. Lewis introduced the electron-pair bond in 'The Atom and the Molecule' (JACS 38(4):762–785, 1916). His diagram for water — two O-H bonds and two lone pairs on oxygen — explained the molecule's bent shape without quantum mechanics. CO₂'s two double bonds and four lone pairs explain its linear geometry and non-polarity. These two molecules remain the canonical teaching examples because they contrast sp³ hybridisation (H₂O, bent, polar) with sp hybridisation (CO₂, linear, non-polar) using the simplest possible structures.",
  },

  elements: [
    {
      selector: "central-atom",
      label: "Central atom (O in H₂O)",
      explanation:
        "The oxygen atom in water carries 6 valence electrons: 2 are used in bonds to hydrogen, and 4 remain as two lone pairs. The element symbol stands for the atom's identity; its valence electron count determines how many bonds it can form. Oxygen's electronegativity draws the shared electron pairs closer to itself than to hydrogen, giving each O-H bond a partial negative charge on the oxygen end.",
    },
    {
      selector: "single-bond",
      label: "Single bond (O-H)",
      explanation:
        "A single line between O and H represents one shared electron pair — one bond. In water, the O-H bond length is 96 pm and bond energy is 459 kJ/mol. The line encodes only the sharing, not directionality or length; VSEPR theory uses the Lewis structure to infer that two bonds plus two lone pairs around oxygen produce a tetrahedral electron geometry and a bent molecular geometry at 104.5°.",
    },
    {
      selector: "lone-pair",
      label: "Lone pair (dots on O)",
      explanation:
        "Two dots beside an atom symbol represent one lone (non-bonding) electron pair. Oxygen in water has two lone pairs — four electrons not involved in bonding. Lone pairs occupy more angular space than bonding pairs (VSEPR), compressing the H-O-H bond angle from the ideal tetrahedral 109.5° to 104.5°. Lone pairs are the electron donors in hydrogen bonding, which accounts for water's anomalously high boiling point.",
    },
    {
      selector: "bond-angle",
      label: "Bond angle (H-O-H, 104.5°)",
      explanation:
        "Water's bond angle is 104.5°, not the tetrahedral ideal of 109.5°. The compression arises because lone pairs repel bonding pairs more strongly than bonding pairs repel each other. Lewis structures encode connectivity but not geometry; the 104.5° angle is the prediction of VSEPR theory applied to the Lewis structure, and it matches the experimentally measured value by rotational spectroscopy.",
    },
    {
      selector: "double-bond",
      label: "Double bond (C=O in CO₂)",
      explanation:
        "Two parallel lines between C and O represent two shared electron pairs. Each C=O bond in carbon dioxide has a bond length of 116 pm and bond energy of 799 kJ/mol — shorter and stronger than the C-O single bond (143 pm, 358 kJ/mol) because two shared pairs pull the nuclei closer. Lewis (1916) used the doubled line to distinguish orders of bonding; triple bonds (three lines) appear in N₂ and CO.",
    },
    {
      selector: "octet-rule",
      label: "Octet rule",
      explanation:
        "Each non-hydrogen atom in a valid Lewis structure has exactly 8 valence electrons counting bonds and lone pairs: carbon in CO₂ has four bonds (8 electrons shared, contributes 4 to the count); each oxygen has two bonds plus two lone pairs (4 + 4 = 8). Lewis formulated the octet rule in 1916 as the empirical generalisation that second-row atoms tend toward noble-gas electron configurations. Exceptions include hypervalent molecules (PCl₅, SF₆) with expanded octets, and radicals with odd electron counts.",
    },
  ],
};
