import type { LiveChart } from "@/content/chart-schema";

export const affinityDiagram: LiveChart = {
  id: "affinity-diagram",
  name: "Affinity Diagram",
  family: "hierarchy",
  sectors: ["quality"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Groups large volumes of qualitative observations into emergent theme clusters through intuitive similarity, bottom-up — no predefined categories.",

  whenToUse:
    "Use an affinity diagram after gathering unstructured qualitative data — user interviews, brainstorming sessions, retrospectives — where the structure is unknown in advance. It is the right tool when you have 30–100 discrete observations and need to surface recurring themes without imposing categories. Resist using it to confirm a hypothesis you already hold; the method only works when grouping is genuinely exploratory.",

  howToRead:
    "Each sticky note is a single discrete observation. Notes that share an intuitive similarity migrate into a cluster; the cluster receives a header card that names the theme in the language of the data, not the analyst's framing. Two or more clusters that share a deeper kinship may be enclosed in a meta-group. Read bottom-up: the leaves are the evidence; the headers are the conclusions. A cluster containing many notes has higher evidentiary weight than one with two.",

  example: {
    title: "IDEO's 2004 Kaiser Permanente hospital redesign",
    description:
      "IDEO researchers conducted 200+ nurse and patient interviews, generating roughly 500 observation notes. Affinity clustering surfaced 'shift handover' as the dominant pain cluster — a theme none of the initial research questions had anticipated. The redesign that followed (a structured communication board at each patient bedside) reduced medication errors by 37% in the pilot ward. The cluster's size — 80+ notes versus the next cluster's 30 — was the first signal that handovers deserved the deepest redesign investment.",
  },

  elements: [
    {
      selector: "sticky-note",
      label: "Sticky note (observation)",
      explanation:
        "Each card represents one discrete observation, verbatim quote, or idea captured during research. The rule is one thought per card — compound statements split into two. The text stays close to the original voice of the participant; analyst interpretation belongs on the header, not the sticky.",
    },
    {
      selector: "cluster-header",
      label: "Cluster header",
      explanation:
        "The header card names the theme shared by the notes below it. Good headers are short noun phrases drawn from the data ('Authentication pain', 'Onboarding friction'), not analyst jargon ('UX issues'). The header is written after grouping, never before — writing it first is the KJ Method's cardinal sin.",
    },
    {
      selector: "meta-group",
      label: "Meta-group enclosure",
      explanation:
        "A dashed outline that unites two or more related clusters under a higher-level theme. Meta-grouping is optional and applied only when the clusters share a genuinely deeper kinship, not just topical adjacency. In this diagram, 'Authentication pain' and 'Onboarding friction' share the meta-theme 'Getting into the product' — both are obstacles that prevent a user from ever reaching the product's core value.",
    },
    {
      selector: "second-cluster",
      label: "Onboarding friction cluster",
      explanation:
        "This cluster groups notes about the first-run experience: setup steps, progress feedback, and invite flows. It belongs in the same meta-group as authentication because both represent barriers at the product's entry point — before a user has completed even a single meaningful action.",
    },
    {
      selector: "lower-clusters",
      label: "Mid-tier clusters",
      explanation:
        "Data-entry burden and Navigation confusion each represent a separate problem domain encountered once users are inside the product. Their placement below the meta-group is not accidental — affinity diagrams conventionally read from top (highest-level) to bottom (lowest-level) within a column, echoing the bottom-up aggregation process that produced them.",
    },
    {
      selector: "performance-cluster",
      label: "Performance cluster",
      explanation:
        "A singleton cluster with no meta-group partner. Its isolation is the diagram's signal: performance is a distinct problem class, unrelated to authentication or navigation. In a real workshop, isolated clusters prompt the question 'is this actually one theme, or are we lumping?'",
    },
  ],
};
