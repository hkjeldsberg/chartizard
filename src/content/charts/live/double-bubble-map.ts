import type { LiveChart } from "@/content/chart-schema";

export const doubleBubbleMap: LiveChart = {
  id: "double-bubble-map",
  name: "Double Bubble Map",
  family: "relationship",
  sectors: ["decision-analysis"],
  dataShapes: ["hierarchical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Two nouns, side by side. Shared attributes in the middle column link to both; unique attributes fan outward from one.",
  whenToUse:
    "Reach for a double bubble map when the task is comparing and contrasting two subjects — Hyerle's compare-and-contrast verb. It is the right pick when the audience is young or the claim is about which attributes are shared and which are unique. For set arithmetic with counts, a Venn diagram is more economical; for free-form association around a single topic, use a mind map.",
  howToRead:
    "Read the two centrals as the subjects being compared. Every satellite linked to both centrals is a shared attribute; every satellite linked to only one is a unique attribute of that subject. The spatial convention — shared in the middle column, uniques on the outside — is a reading aid, not the encoding: the edges are what carry the claim. A satellite with one line is a difference; a satellite with two lines is a similarity.",
  example: {
    title: "Hyerle's compare-and-contrast map in elementary instruction",
    description:
      "Introduced by David N. Hyerle in Thinking Maps: Tools for Learning (Innovative Learning Group, 1995), the double bubble map is the form teachers reach for when asking a class to compare two subjects — cat and dog, Tubman and Douglass, photosynthesis and respiration. The form was designed to sidestep the cognitive load of a Venn: young readers struggle with the inside-versus-outside abstraction of overlapping regions, so Hyerle replaces regions with named nodes and explicit edges. A shared attribute is simply a bubble with two lines; a unique attribute is a bubble with one. The rule is legible at a glance, which is why the map has become a staple of US K-5 curricula under the trademarked Thinking Maps brand.",
  },
  elements: [
    {
      selector: "central-noun",
      label: "Central noun",
      explanation:
        "One of the two subjects under comparison, drawn as a larger circle on its side of the map. Both centrals are the same size — neither is a parent of the other. Hyerle's rule is two and only two; a three-subject comparison breaks the spatial convention and wants a different form (a tree map or a matrix).",
    },
    {
      selector: "shared-attribute",
      label: "Shared attribute",
      explanation:
        "A bubble linked by two lines, one to each central — an attribute both subjects have. The convention is to stack these vertically between the centrals so the doubled edges read as a column. The visual signature of the double bubble is exactly this middle stack.",
    },
    {
      selector: "unique-attribute",
      label: "Unique attribute",
      explanation:
        "A bubble linked to only one central — an attribute that distinguishes that subject from the other. Conventionally drawn on the outer flank of its central so that the reader can scan left-for-Cat-only, right-for-Dog-only. The count of unique bubbles per side is not balanced on purpose; asymmetry is a valid finding.",
    },
    {
      selector: "double-link",
      label: "Double-link rule",
      explanation:
        "An attribute counts as shared only if it links to BOTH centrals. A single missing edge demotes it to a unique. This rule is what distinguishes the double bubble from a Venn diagram (Batch 2): Venn encodes membership via overlapping regions, double bubble encodes it via named nodes and their edges — better for young readers because there is no inside-versus-outside abstraction to decode.",
    },
    {
      selector: "compare-contrast-layout",
      label: "Compare-and-contrast layout",
      explanation:
        "The left-shared-right spatial arrangement is the form's grammar. Position on the page is a reading aid, not an encoding — the same claim would be legible if the map were rotated — but the convention holds because it matches how English speakers scan a comparison on paper. Paired with the bubble map for the describe verb.",
    },
  ],
};
