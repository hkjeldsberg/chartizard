import type { LiveChart } from "@/content/chart-schema";

export const mindMap: LiveChart = {
  id: "mind-map",
  name: "Mind Map",
  family: "hierarchy",
  sectors: ["decision-analysis"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",
  synopsis:
    "A tree dressed up for thinking: one central topic, branches radiating out, sub-branches fanning from each — drawn in curves to keep the eye moving.",
  whenToUse:
    "Reach for a mind map when the job is to externalise an idea, not to communicate a finished structure. It suits brainstorming, note-taking, and the early scoping of a problem — moments when the hierarchy is being discovered, not reported. For a published tree-structured result, a dendrogram or org chart reads more precisely; the mind map's value is in the act of drawing it.",
  howToRead:
    "Start at the centre and read outward. The central node is the topic; the main branches name its first-level sub-topics; further branches elaborate each. Thicker strokes mark the primary branches, thinner strokes their children. The radial layout is editorial, not mathematical — proximity and angle carry no meaning, only the parent-child chain does. Treat the map as a tree rendered in curves; the shape is a thinking aid, not a measurement.",
  example: {
    title: "Tony Buzan, Use Your Head (1974)",
    description:
      "The mind map was popularised by Tony Buzan in Use Your Head and his later BBC series — marketed as a way to mirror the brain's associative, non-linear structure by radiating from a central image. The claim of associative thinking is the form's selling point; the underlying data structure is still a plain tree. That tension is honest to acknowledge: the mind map is as much a thinking tool and a decoration of a tree chart as it is a visualisation.",
  },
  elements: [
    {
      selector: "central-node",
      label: "Central topic",
      explanation:
        "The root of the tree and the anchor of the map's attention. Buzan recommended a small image at the centre to recruit visual memory; here we use a labelled disc. Everything else is positioned relative to this point.",
    },
    {
      selector: "main-branch",
      label: "Main branch",
      explanation:
        "A first-level child of the central topic, drawn with a thicker curve to signal its primacy. Five to seven main branches is the practical ceiling — beyond that the radial fan becomes unreadable and the map wants to be a proper tree chart instead.",
    },
    {
      selector: "sub-branch",
      label: "Sub-branch",
      explanation:
        "A second-level child, attached to its parent main branch. Stroke weight drops so the hierarchy is visible at a glance; if every branch had the same weight the map would read as a flat starburst.",
    },
    {
      selector: "curved-branch",
      label: "Curved stroke",
      explanation:
        "The visual signature of the form — Bezier curves, not straight edges. Buzan argued the curves recruit the same motor patterns as handwriting and make the map easier to recall. Whether or not you buy the neuroscience, the curves are what distinguish a mind map from a plain tree diagram.",
    },
    {
      selector: "third-level-leaf",
      label: "Third-level leaf",
      explanation:
        "A terminal node two hops out from the centre. Leaves at this depth are usually specifics — a named destination, a concrete item — and their presence is how a sprawling map avoids collapsing into vague categories.",
    },
    {
      selector: "radial-layout",
      label: "Radial layout",
      explanation:
        "Branches fan out 360 degrees around the centre rather than stacking top-to-bottom. The layout is a convention, not a measurement — angle and distance carry no data, only the parent-child chain does. It is also the reason the map can sprawl on a single page where a top-down tree would run off the bottom.",
    },
  ],
};
