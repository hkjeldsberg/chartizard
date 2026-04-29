import type { LiveChart } from "@/content/chart-schema";

export const oppositesDiagram: LiveChart = {
  id: "opposites-diagram",
  name: "Opposites Diagram",
  family: "comparison",
  sectors: ["business"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Two labelled boxes on a shared axis, one for each pole of a binary contrast, with a VS divider at the midpoint.",

  whenToUse:
    "Use an opposites diagram when the goal is to define a position by contrast rather than by description alone. It is best suited to binary choices where each pole has a small set of distinguishing attributes — product positioning, technology comparisons, argument framing. Avoid it when more than two alternatives exist, or when the attributes of each pole overlap significantly; a 2×N table or a Venn diagram carries more information in those cases.",

  howToRead:
    "Read each box as the canonical description of one pole. The header names the pole; the bulleted rows list its defining traits. The VS divider marks the logical opposition — every trait on the left is either absent or reversed on the right. Scan row-by-row to trace which attributes are in direct contrast and which are independent. The horizontal axis is a convenience, not a scale; no spatial position within a box encodes any quantitative value.",

  example: {
    title: "Ries & Trout's 1981 positioning memo for 7-Up",
    description:
      "Al Ries and Jack Trout introduced the 'positioning by contrast' device in their 1981 book Positioning: The Battle for Your Mind, illustrating it with 7-Up's 'Un-Cola' campaign — a two-column layout that listed everything Cola was (dark, caffeinated, syrupy, established) against everything 7-Up was (clear, caffeine-free, crisp, the alternative). The insight was that the contrast itself did the persuasion work; no claims about 7-Up's intrinsic quality were needed.",
  },

  elements: [
    {
      selector: "left-pole",
      label: "Left pole box",
      explanation:
        "The left box defines one of the two positions being compared. Its header names the entity and its bulleted rows list the attributes that distinguish it from the other pole. The background tint is a visual cue, not a value encoding — both poles are presented on equal ground.",
    },
    {
      selector: "right-pole",
      label: "Right pole box",
      explanation:
        "The right box defines the opposing entity. In strategy consulting practice, the right pole is conventionally the 'competitive alternative' or the status quo — the thing the left pole argues against. Reading the right-box attributes as the logical negation of the left-box attributes is the intended interpretation.",
    },
    {
      selector: "vs-divider",
      label: "VS divider",
      explanation:
        "The VS badge marks the opposition point. It is not a quantitative axis midpoint; it is a rhetorical device that signals the two boxes are in direct logical contrast. Geoffrey Moore's Crossing the Chasm (1991) placed this divider between 'the product you are positioning' and 'the competitive alternative' in his positioning statement template.",
    },
    {
      selector: "attribute-list",
      label: "Attribute list",
      explanation:
        "The bulleted attributes are the analytical content of the chart. Each bullet should name a concrete, observable trait — not an abstract value like 'quality' or 'trust'. The list is intentionally short: three to six attributes per pole is the readable range. Longer lists dissolve the sharpness that makes the binary contrast legible.",
    },
    {
      selector: "axis-rule",
      label: "Horizontal axis",
      explanation:
        "The horizontal rule is a structural spine, not a scale. It reinforces that the two poles are laterally opposed — the same concept rendered in opposing ways. Unlike a magic quadrant (which uses two continuous axes to place many competitors), the opposites diagram has no spatial gradient: you are either in one box or the other.",
    },
  ],
};
