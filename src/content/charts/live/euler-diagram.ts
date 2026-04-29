import type { LiveChart } from "@/content/chart-schema";

export const eulerDiagram: LiveChart = {
  id: "euler-diagram",
  name: "Euler Diagram",
  family: "relationship",
  sectors: ["mathematics"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Shows set relationships using circles whose positions encode which intersections exist and which do not.",
  whenToUse:
    "Use an Euler diagram when the set relationships themselves are the story — when some intersections are empty, some sets contain others, and the structure would be misread if every possible overlap were drawn anyway. Pair it with a Venn diagram when you need exhaustive coverage; reach for Euler when you need truth.",
  howToRead:
    "Each circle is a set. Where two circles overlap, the elements belong to both sets; where they do not overlap, the intersection is empty. A circle fully inside another circle is a proper subset. Blank space between circles is information, not a gap — it says that intersection does not exist in the data.",
  example: {
    title: "Leonhard Euler, Letters to a German Princess (1768)",
    description:
      "Euler introduced the construction in his Letters to a German Princess to teach categorical syllogisms: All A are B, No A is B, Some A is B. Each case gets a distinct picture because the empty regions carry as much meaning as the filled ones. A Venn of the same three sets would force every intersection to be drawn and then labelled as empty — a diagram that reads against itself.",
  },
  elements: [
    {
      selector: "disjoint",
      label: "Disjoint region",
      explanation:
        "Mammals and Reptiles share no members, so the two circles never touch. The gap between them is the diagram's load-bearing claim — a Venn of the same three sets would force an artificial Mammals ∩ Reptiles region and then annotate it as empty, reversing the chart's job.",
    },
    {
      selector: "overlap",
      label: "Overlap",
      explanation:
        "Pets and Mammals overlap substantially — most pets are mammals — so the two circles cross. Every point inside both circles represents an entity that belongs to both sets (a dog, a cat, a hamster). The amount of overlap is schematic, not proportional.",
    },
    {
      selector: "containment",
      label: "Containment",
      explanation:
        "Dogs sit entirely inside Mammals because every dog is a mammal. A circle fully enclosed by another is the pictorial form of the logical statement \"all A are B\" — the kind of claim Euler designed the diagram to teach.",
    },
    {
      selector: "set-labels",
      label: "Set labels",
      explanation:
        "Each circle must carry a name. An unlabelled Euler diagram is not an argument, it is decoration. Labels sit outside each circle wherever space allows so the enclosed area stays free for region-level annotations.",
    },
    {
      selector: "missing-intersection",
      label: "Missing intersection",
      explanation:
        "The empty gap between Mammals and Reptiles is the diagram's distinguishing feature. A Venn diagram always draws every possible region for N sets — 2ⁿ of them — and annotates the empty ones with zero. An Euler diagram refuses to draw them at all, making existence visible as shape.",
    },
    {
      selector: "euler-vs-venn",
      label: "Euler vs Venn",
      explanation:
        "A Venn shows what intersections could exist; an Euler shows what intersections do exist. Use a Venn when enumerating a power-set structure (truth tables, feature flags across tiers); use an Euler when the empty intersections themselves carry information.",
    },
  ],
};
