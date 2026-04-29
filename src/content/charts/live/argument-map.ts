import type { LiveChart } from "@/content/chart-schema";

export const argumentMap: LiveChart = {
  id: "argument-map",
  name: "Argument Map",
  family: "hierarchy",
  sectors: ["decision-analysis"],
  dataShapes: ["hierarchical"],
  tileSize: "M",
  status: "live",

  synopsis:
    "A directed graph of claims and reasons: the main claim sits at the top, supporting and opposing reasons beneath it, rebuttals beneath the objections — and every arrow is labelled with what it does.",

  whenToUse:
    "Reach for an argument map when the subject is contested and the reasoning, not the data, is what needs scrutiny. It is the standard tool in philosophy pedagogy, legal briefing, and structured-debate platforms because the visual form forces every claim to be either backed or objected to — a dangling node is a gap in the argument. It is distinct from a mind map (radial, associative, no edge semantics) and from a concept map (labelled edges, but describing a knowledge structure rather than a case for or against a proposition).",

  howToRead:
    "The root claim sits at the top. Reasons sit beneath it and point upward with arrows labelled 'supports' or 'objects to'. Objections are themselves claims and can be attacked by rebuttals in the next row down, with arrows labelled 'rebuts'. Fill and outline encode role: filled nodes are supporting reasons, outlined nodes are objections, dashed outlines are rebuttals. Read from any leaf upward along the chain of arrows — each step is a single illocutionary move (a support, an objection, a rebuttal), and the diagram's verdict is whatever survives at the top.",

  example: {
    title: "Stephen Toulmin, The Uses of Argument (Cambridge, 1958)",
    description:
      "Toulmin introduced the claim / data / warrant / backing / qualifier / rebuttal schema as an alternative to the syllogism — a way of diagramming the practical arguments of law and everyday reasoning that formal logic had treated as defective. Robert Horn's Visual Language (MacroVU, 1998) standardised the box-and-arrow conventions, and tools such as Rationale, Argdown and Kialo are direct descendants. The Pluto example is the canonical schoolroom demonstration: the claim 'Pluto is a planet' is backed by three supporting reasons (it orbits the Sun, it is gravity-rounded, it was classified as a planet from 1930 to 2006) and attacked by two objections (the IAU 2006 clearing-neighbourhood criterion, and comparative size); each objection is itself attacked by a rebuttal that questions the criterion rather than the fact. The diagram's point is that the verdict depends on which rebuttals survive, not on counting pros and cons.",
  },

  elements: [
    {
      selector: "root-claim",
      label: "Root claim",
      explanation:
        "The proposition under dispute, placed at the top of the diagram. Toulmin called this the claim; in Rationale and Argdown it is the thesis. Every arrow in the map ultimately points at the root — an argument map with two unrelated roots is two arguments, not one.",
    },
    {
      selector: "supporting-reason",
      label: "Supporting reason",
      explanation:
        "A reason that backs the claim it points to, drawn filled and linked by a 'supports' arrow. In Toulmin's vocabulary this is where data and warrant enter the diagram; in classroom practice the test is whether the reason, if accepted, would make the parent claim more believable. Supporting reasons do not have to be independent — multiple supports can reinforce each other — but each one must stand as its own claim somebody could contest.",
    },
    {
      selector: "opposing-reason",
      label: "Opposing reason",
      explanation:
        "A reason that attacks the claim it points to, drawn with a heavier outline and linked by an 'objects to' arrow. Toulmin distinguished these from rebuttals proper, but most modern mapping conventions (Horn 1998, Kialo) collapse the distinction and treat any node that attacks its parent as a con. An argument map with zero opposing reasons is either uncontested or under-researched — the diagram is designed to surface objections, not hide them.",
    },
    {
      selector: "rebuttal",
      label: "Rebuttal",
      explanation:
        "A reason that attacks an objection rather than the root, drawn with a dashed outline and a 'rebuts' arrow. Rebuttals are what make an argument map a DAG rather than a shallow pro/con list: they concede that an objection exists as a claim in the diagram and then attack it on its own terms. Toulmin's original 1958 schema reserved the word 'rebuttal' for exception-conditions on the warrant; the pedagogical tradition has generalised it to any second-order attack.",
    },
    {
      selector: "labelled-edge",
      label: "Labelled edge",
      explanation:
        "Every arrow carries one of three short verbs — supports, objects to, rebuts — so the edge is a speech act, not a line. This is the technical difference between an argument map and an org chart: the edge labels are part of the argument's grammar. A diagram whose arrows are unlabelled is a layout, not a map.",
    },
    {
      selector: "pro-con-split",
      label: "Pro/con structure",
      explanation:
        "An argument map is not symmetric. Pros on one side, cons on the other, and rebuttals stacked beneath the cons — the layout encodes the dialectical structure so the eye can trace whether every objection has been answered. Kialo's interface enforces exactly this split, and the pedagogical claim behind it (going back to Toulmin) is that a case is only as strong as its unanswered objections.",
    },
  ],
};
