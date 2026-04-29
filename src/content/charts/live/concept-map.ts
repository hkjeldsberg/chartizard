import type { LiveChart } from "@/content/chart-schema";

export const conceptMap: LiveChart = {
  id: "concept-map",
  name: "Concept Map",
  family: "relationship",
  sectors: ["decision-analysis"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",

  synopsis:
    "A knowledge-representation diagram where concepts are nodes and every arrow carries a written relationship — so each edge is a readable proposition, not a bare link.",

  whenToUse:
    "Use a concept map when the goal is to externalise what somebody already understands about a domain — the relationships that structure the topic, not a dataset. It is the standard diagnostic tool in education research for eliciting prior knowledge and misconceptions, because forcing a label onto every arrow exposes gaps that a plain tree would hide. For brainstorming without structural rigour the mind map is looser; for communicating a finished classification the dendrogram is cleaner. The concept map sits between them: more disciplined than a mind map because every edge must be readable as a sentence, more expressive than a tree because cross-links are allowed.",

  howToRead:
    "Read top to bottom. The most general concept sits at the root; children are progressively more specific. Every arrow has a short phrase on it, and the triple 'source concept — relationship phrase → target concept' should read as a complete statement about the world (a proposition): 'Water exists as Liquid', 'Clouds produce Rain'. When you encounter an arrow that jumps across branches of the hierarchy — Sun drives evaporation, Gravity pulls down Rain — that is a cross-link, drawn dashed or with extra weight: it connects two otherwise-unrelated sub-trees and expresses a proposition that the tree structure alone cannot. The map's quality is judged by how many sensible propositions it encodes, not by how pretty the layout is.",

  example: {
    title: "Joseph D. Novak, Cornell University (1972)",
    description:
      "Concept maps were developed by Joseph D. Novak and his research group at Cornell University beginning in 1972, to track how children's understanding of science concepts changed over a twelve-year longitudinal study in Ithaca-area schools. The method and rationale were published in Novak and D. Bob Gowin's Learning How to Learn (Cambridge University Press, 1984), which paired the concept map with the Vee heuristic. Novak grounded the technique in David Ausubel's theory of meaningful learning: knowledge is organised hierarchically, and new information is only retained when it is subsumed under existing concepts. The water-cycle map shown here is the canonical classroom example — Water at the root, three phase concepts below, forms (rivers, oceans, glaciers, clouds) at the third level, Rain as a leaf, with Sun and Gravity entering as cross-links because they drive the cycle but do not belong to any phase. The pedagogical innovation is the requirement that every edge carry a label: it converts the diagram from a tree of categories into a catalogue of testable claims.",
  },

  elements: [
    {
      selector: "root-concept",
      label: "Root concept",
      explanation:
        "The top-level, most general concept in the map — here, Water. Novak's theory (after Ausubel) holds that knowledge is organised hierarchically and that new concepts are anchored under broader ones; placing the most inclusive concept at the top makes that hierarchy explicit. The choice of root is the single most consequential editorial decision in drawing a concept map: the same domain produces different maps depending on whether the author starts from Water, the Water Cycle, or Precipitation.",
    },
    {
      selector: "concept-node",
      label: "Concept node",
      explanation:
        "Each labelled ellipse or rounded rectangle names a concept — a class of objects or events, expressed as a noun or short noun phrase: Liquid, Clouds, Oceans. Concepts are what the author claims exist in the domain; the choice of which concepts to include (and which to leave out) is the map's ontology. Unlike a mind map, there is no privileged central node — the map is rooted at the top but concepts at every level are first-class.",
    },
    {
      selector: "labelled-edge",
      label: "Labelled relationship",
      explanation:
        "Every arrow carries a short phrase — 'exists as', 'evaporates into', 'produces'. The phrase is the map's grammatical core: it converts the arrow from a mere link into a readable sentence. The triple (source, phrase, target) should parse as a standalone proposition; 'Water exists as Liquid' is a claim somebody could agree or disagree with. This is the single technical difference between a concept map and a mind map, and it is what makes concept maps useful for assessment: a wrong or missing label reveals a gap in understanding that a structurally-correct tree would hide.",
    },
    {
      selector: "cross-link",
      label: "Cross-link",
      explanation:
        "A cross-link is an arrow that jumps across branches of the hierarchy — Sun drives Gas, Gravity pulls down Rain — connecting concepts whose parent subtrees are otherwise unrelated. Novak called cross-links the strongest sign of integrative understanding: a learner who draws them has seen a pattern across categories, not merely sorted items within them. They are typically drawn dashed or with extra weight so the eye can distinguish them from the parent-child skeleton.",
    },
    {
      selector: "leaf-concept",
      label: "Leaf concept",
      explanation:
        "A terminal node in the hierarchy, typically the most specific or concrete concept in its branch — here, Rain. Leaves are where the map meets observable reality; a map with no leaves has not yet made contact with specifics. The depth at which leaves appear varies by branch: there is no requirement that the tree be balanced.",
    },
    {
      selector: "proposition",
      label: "Proposition (edge as claim)",
      explanation:
        "A proposition is the triple 'source concept — relationship phrase → target concept' read as a full sentence: 'Sun drives Gas', 'Clouds produce Rain'. Novak and Gowin treated propositions as the map's unit of analysis: a concept map with N edges encodes N testable claims about the domain. Assessment rubrics in the Novak tradition count valid propositions and cross-links as the primary quality metric, rather than node count or visual tidiness.",
    },
    {
      selector: "hierarchy",
      label: "Top-to-bottom layout",
      explanation:
        "Concept maps are drawn with the most general concept at the top and specificity increasing downward. The layout is structural, not decorative: it encodes Ausubel's claim that learners subsume new concepts under existing, broader ones, so depth in the diagram corresponds to depth in the knowledge structure. The contrast with the mind map (radial, no layout convention) is deliberate — Novak rejected the claim that concepts are organised radially around a single central topic.",
    },
  ],
};
