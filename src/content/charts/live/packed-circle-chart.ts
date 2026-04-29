import type { LiveChart } from "@/content/chart-schema";

export const packedCircleChart: LiveChart = {
  id: "packed-circle-chart",
  name: "Packed Circle Chart",
  family: "composition",
  sectors: ["hierarchical"],
  dataShapes: ["hierarchical"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Encodes a two-level hierarchy as nested circles: an outer ring for the root, group circles for level-1 categories, and leaf circles whose areas are proportional to their values.",

  whenToUse:
    "Reach for hierarchical circle packing when you have two to three levels of categorical data and the aesthetic of containment matters more than spatial efficiency. The algorithm sacrifices packing density — roughly 64% of the bounding rectangle is covered, versus 100% for a treemap — for visual appeal: circles are a culturally neutral shape that reads as 'size' without implying directionality. Avoid it when you need to compare values precisely; the area-to-radius mapping (r ∝ √value) is harder to decode than bar length.",

  howToRead:
    "The outermost dashed ring encloses everything — it is the root and carries no value itself. Inside it, each solid ring is a language family; the ring's area reflects the combined speaker count of its children, not a directly encoded value. The filled circles inside each ring are individual languages; their area is proportional to native-speaker count. A circle twice the area has roughly 1.4× the radius (√2 ≈ 1.41). Read labels in the centre of each circle; smaller circles may show truncated names.",

  example: {
    title: "Native speakers of the world's major languages, grouped by family",
    description:
      "The Ethnologue 2023 data places Mandarin (920 M speakers) as the single largest leaf circle, visibly dominating the Sino-Tibetan group ring. Spanish (480 M) and English (380 M) are the largest leaves in the Indo-European ring, which is the widest family group. Tagalog (30 M) and Hausa (50 M) appear as small circles near the edges of their group rings — the contrast between those and Mandarin demonstrates the area-proportional sizing in a single glance.",
  },

  elements: [
    {
      selector: "root-circle",
      label: "Root circle",
      explanation:
        "The outermost dashed ring is the root node — 'Languages' — and bounds the entire chart. It carries no area encoding of its own; its radius is determined by the canvas size. In d3.pack(), the root circle is produced by hierarchy(data).sum(d => d.value) followed by pack().size([width, height]), which scales the whole layout to fit the available rectangle.",
    },
    {
      selector: "group-circle",
      label: "Group circle",
      explanation:
        "Each solid ring is a level-1 node — a language family. Its area reflects the sum of its children's values, computed by d3-hierarchy's .sum() traversal. The ring has a thicker stroke than leaf circles to visually signal that it is a container, not a terminal value. Weixin Wang et al.'s 2006 ACM SIGCHI paper introduced the packing algorithm that d3-hierarchy implements: circles are placed by iteratively inserting the next-largest child and repacking to minimise wasted space.",
    },
    {
      selector: "leaf-circle",
      label: "Leaf circle (language)",
      explanation:
        "Each filled inner circle is a single language. Its radius follows r ∝ √(speaker count) so that area, not radius, is proportional to value — the standard convention for circle size encoding, established in Cleveland and McGill's 1984 Science paper on graphical perception. Mandarin at 920 M is the largest leaf; its circle visually anchors the Sino-Tibetan group.",
    },
    {
      selector: "area-sizing",
      label: "Area-proportional sizing",
      explanation:
        "Tagalog (30 M) is one of the smallest leaf circles; Mandarin (920 M) is the largest. The ratio of their areas is 920/30 ≈ 30.7, so Mandarin's circle has about 5.5× the radius of Tagalog's. This non-linear radius-to-value relationship means circle charts reward careful reading: a visually 'small' circle can still represent tens of millions of speakers.",
    },
    {
      selector: "nesting",
      label: "Nesting hierarchy",
      explanation:
        "Containment is the primary spatial encoding: a language sits inside its family's ring, which sits inside the root ring. This nested containment directly represents the data's parent–child relationship. Contrast with a treemap (Batch 1, live), which uses adjacency and shared borders rather than containment to show hierarchy — both encode the same structure, but the visual grammar is different.",
    },
    {
      selector: "group-boundary",
      label: "Language-group boundary",
      explanation:
        "The gap between adjacent group circles — maintained by pack().padding(3) — is a visual boundary that separates language families. Without padding, group circles would touch or overlap, making it ambiguous whether a leaf circle belongs to one family or an adjacent one. The padding is a layout parameter, not a data value, but it carries editorial meaning: it says 'these are distinct groups'.",
    },
  ],
};
