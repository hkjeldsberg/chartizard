import type { LiveChart } from "@/content/chart-schema";

export const bubbleMap: LiveChart = {
  id: "bubble-map",
  name: "Bubble Map",
  family: "hierarchy",
  sectors: ["decision-analysis"],
  dataShapes: ["hierarchical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A noun at the centre, its adjectives on a ring — one of David Hyerle's eight Thinking Maps, strictly one level deep.",
  whenToUse:
    "Reach for a bubble map when the task is description: listing the qualities of a single subject. It is the Thinking Maps entry for the cognitive verb describe, and its rule is flatness — attributes of the noun, nothing else. For multi-level brainstorming use a mind map; for comparison against another subject use its sibling, the double bubble map.",
  howToRead:
    "The central circle is the noun under description; every surrounding circle is an adjective or attribute that applies to it. Each satellite is linked to the centre by a single straight line, and no satellite has children of its own — the map is one hop deep by construction. Treat the ring as editorial, not ordered: position carries no weight, only membership in the attribute set does.",
  example: {
    title: "David Hyerle, Thinking Maps: Tools for Learning (1995)",
    description:
      "Introduced by David N. Hyerle through the Innovative Learning Group, the bubble map is one of eight Thinking Maps each tied to a specific cognitive verb — define, describe, compare, classify, sequence, cause-and-effect, part-whole, analogise. Widely adopted in US elementary curricula under the trademarked Thinking Maps brand, the bubble map is the describe map: teachers ask children to fill the ring with adjectives for the noun at the centre. The flatness is pedagogy, not a limitation — the restriction to one level forces the thinker to stay on the qualities-of question rather than drifting into sub-topics.",
  },
  elements: [
    {
      selector: "central-noun",
      label: "Central noun",
      explanation:
        "The subject being described, drawn as the largest circle. Hyerle requires a noun here — a concrete thing, person, or idea — because the map's cognitive verb is describe, which only operates on nouns. Swap it for a process or a question and the form stops doing its job.",
    },
    {
      selector: "adjective-bubble",
      label: "Adjective bubble",
      explanation:
        "A satellite circle holding one attribute of the central noun. The template Hyerle supplies in the classroom prints adjectives only; nouns as satellites break the map's discipline and turn it into a loose word web. Count and exact labels are editorial — the rule is the part of speech.",
    },
    {
      selector: "connector",
      label: "Connector line",
      explanation:
        "A single straight line between the centre and each adjective. Straight, not curved, to distinguish the bubble map from a mind map — Buzan's curves signal associative thinking, Hyerle's straight lines signal a taxonomic rule.",
    },
    {
      selector: "single-level",
      label: "Single-level rule",
      explanation:
        "Every adjective attaches directly to the centre and nothing else. No grandchildren, no cross-links, no sub-bubbles on the satellites. This is the structural difference from a mind map (Batch 6): a mind map is a free multi-level tree of any node types; a bubble map is depth-1 and attribute-only.",
    },
    {
      selector: "radial-ring",
      label: "Radial arrangement",
      explanation:
        "Satellites sit on a rough circle around the centre. The ring is a layout convention, not a measurement — clockwise position and radial distance carry no meaning, only membership does. Paired with the double bubble map for the compare-and-contrast cognitive verb.",
    },
  ],
};
