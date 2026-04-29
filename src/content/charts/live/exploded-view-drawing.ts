import type { LiveChart } from "@/content/chart-schema";

export const explodedViewDrawing: LiveChart = {
  id: "exploded-view-drawing",
  name: "Exploded-View Drawing",
  family: "specialty",
  sectors: ["mechanical"],
  dataShapes: ["geospatial"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A mechanical assembly pulled apart along its axis of insertion, with every component hanging off a dashed centre-line — the drawing is the assembly sequence.",
  whenToUse:
    "Use an exploded view when you need to show how a multi-part assembly goes together and cannot rely on an accompanying text procedure. It is the native format for service manuals, IKEA sheets, spare-parts catalogues, and any drawing whose reader has a wrench in one hand and a question in the other.",
  howToRead:
    "Read top-to-bottom along the dashed centre-line: the vertical order IS the insertion order. Each part hangs at the point on the axis where it would sit when assembled. Leader lines connect each part to a numbered callout; the callouts cross-reference a bill-of-materials that gives the part name and quantity. Dashed centre-lines indicate the shared axis of symmetry; they are not hidden features. A good exploded view can be disassembled and reassembled by a reader who has never seen the object before.",
  example: {
    title: "Simplified bicycle hub — end caps, bearings, shell, axle, locknut",
    description:
      "The drawing shows every part in a Shimano-style rear hub separated along the axle's centre-line, with the BOM on the right. A mechanic with the exploded view can strip and repack bearings without the text of a service manual — the sequence is the drawing. Leonardo da Vinci's Codex Atlanticus (~1480) contains the earliest documented explo-view sketches of gears, pulleys, and screws; the technique was formalised in 20th-century technical illustration and is referenced by ISO 128 (technical drawings — general principles) and ANSI Y14.5. IKEA's pictorial instruction sheets, popularised from Gunnar Asplund's mid-century work onward, are the mass-market descendant.",
  },
  elements: [
    {
      selector: "component",
      label: "Component",
      explanation:
        "Each part is drawn in its installed orientation but offset along the axis from its neighbours. The hub shell here is the central component — the part that gives the assembly its name. Components on an exploded view are not sectioned unless they hide a critical internal feature; the goal is identification, not full dimensional information.",
    },
    {
      selector: "centre-line",
      label: "Centre-line (axis of insertion)",
      explanation:
        "The long dash-dot line running through the whole assembly is the axis of insertion. Dashed centre-lines follow the ISO 128 convention: long-dash short-dash. Parts must be drawn with their rotational axis on this line — if a part floats off-axis, the drawing is lying about how it goes in.",
    },
    {
      selector: "leader-callout",
      label: "Leader line with numbered callout",
      explanation:
        "A diagonal leader line runs from a small dot on the part to a numbered circle (the callout). The number indexes into the bill of materials. Leader lines are drawn as straight diagonals — never stepped — and should never cross each other or the centre-line unnecessarily.",
    },
    {
      selector: "bom-table",
      label: "Bill of materials (BOM)",
      explanation:
        "The BOM resolves each callout number to a part name and quantity. Quantity matters: callout #1 lists quantity 2 because both end caps are the same part. Without the BOM, an exploded view is a picture; with it, the drawing becomes a procurable assembly spec.",
    },
    {
      selector: "stacking-order",
      label: "Stacking order = insertion order",
      explanation:
        "The ordering of the callouts (1, 2, 3... from top to bottom) is not decorative — it is the assembly sequence. A reader disassembling the hub works from 1 down; a reader assembling it works from 7 up. A misnumbered exploded view teaches the wrong procedure.",
    },
    {
      selector: "hex-locknut",
      label: "Hexagon (locknut)",
      explanation:
        "Standardised fastener shapes are deliberately distinct on the page — a hex nut, a knurled cap, a castellated nut — so the reader can identify them at a glance without consulting the BOM. This is ISO 128's shape-as-identity principle applied to small parts.",
    },
    {
      selector: "symmetry-axis",
      label: "Symmetry axis",
      explanation:
        "The centre-line extends beyond the first and last components because it is the assembly's symmetry axis, not just the connector between drawn parts. Extending the line signals that the axis is a property of the assembly itself — everything in the drawing is rotationally symmetric about it.",
    },
  ],
};
