import type { LiveChart } from "@/content/chart-schema";

export const electionApportionmentDiagram: LiveChart = {
  id: "election-apportionment-diagram",
  name: "Election Apportionment Diagram",
  family: "composition",
  sectors: ["politics"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Parliament as a hemicycle of seat-dots, coloured by party and ordered left-to-right across the political spectrum.",
  whenToUse:
    "Use a hemicycle when the unit of meaning is a single seat, not a percentage. An apportionment diagram shows the discrete, integer outcome of an election — 411 red dots look categorically different from 412, while a pie chart at 63.2% versus 63.4% reads as the same slice.",
  howToRead:
    "The half-disc mirrors the seating plan of a real chamber. Each dot is one MP. Parties sit in political order: far-left on the left, far-right on the right, with the governing party's colour taking whichever side holds the majority. Count dots across a block to read its size; compare block widths to see relative strength. A block that spans past the central axis is a working majority — one that does not has to negotiate.",
  example: {
    title: "UK House of Commons, 2024 general election — 650 seats",
    description:
      "Labour 411, Conservatives 121, Lib Dem 72, SNP 9, Reform UK 5, Greens 4, Others 28. The Labour block is so wide it crosses the centre line and reaches deep into the right-hand benches — a 174-seat working majority on 33.7% of the popular vote, the steepest first-past-the-post distortion in modern UK history. A bar chart of vote-share would have put Labour and Reform UK almost neck-and-neck (33.7% versus 14.3%); the hemicycle tells the governance story the vote share hides.",
  },
  elements: [
    {
      selector: "majority-block",
      label: "Majority block",
      explanation:
        "The largest contiguous run of seats belongs to the winning party. Its visual width — and whether it crosses the chamber's centre line — tells you whether the government has an outright majority or needs a coalition. Here Labour's 411 dots overshoot the midpoint, signalling a comfortable working majority.",
    },
    {
      selector: "seat",
      label: "Single seat",
      explanation:
        "Each dot is one MP, one indivisible unit. The chart resists the continuous-shape thinking that pie charts encourage — you cannot have 121.5 Conservatives; apportionment algorithms (D'Hondt, Sainte-Laguë, Droop) handle the rounding so the seat totals always sum to the chamber size exactly.",
    },
    {
      selector: "rows",
      label: "Concentric rows",
      explanation:
        "Seats are arranged in concentric arcs from inner to outer. Inner rows hold fewer seats than outer rows — arc length grows with radius — so the chart packs many dots into a compact half-disc without overlapping. Eight rows is the common choice for a 600-seat chamber.",
    },
    {
      selector: "left-right-ordering",
      label: "Left–right ordering",
      explanation:
        "Seats are placed strictly from angle π (far-left) to angle 0 (far-right) across the spectrum. The Greens sit at the very left; DUP and Reform UK on the right. The ordering is editorial, not numerical — it encodes the political geography journalists and broadcasters have agreed to since the French Revolution.",
    },
    {
      selector: "small-party",
      label: "Small-party block",
      explanation:
        "A narrow band of coloured dots — the Lib Dems' 72 — is visible but never dominant. The hemicycle handles the long tail of small parties gracefully: a bar chart would crowd Reform UK's 5 seats next to Labour's 411 on the same axis; the hemicycle spreads them out radially so every party stays legible.",
    },
    {
      selector: "baseline",
      label: "Baseline (diameter)",
      explanation:
        "The horizontal chord along the bottom is the chamber's diameter and the traditional dividing line between government and opposition benches. In Westminster the Speaker sits on the baseline at the chamber's midpoint; in the French Assemblée and most continental parliaments the tribune stands on it.",
    },
  ],
};
