import type { LiveChart } from "@/content/chart-schema";

export const ishikawaDiagram: LiveChart = {
  id: "ishikawa-diagram",
  name: "Ishikawa / Fishbone Diagram",
  family: "relationship",
  sectors: ["quality"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Branches candidate causes off a central spine that points at a single problem, grouped by a fixed taxonomy.",
  whenToUse:
    "Use a fishbone when the team is trying to enumerate possible causes of one specific problem and tends to fixate on the first plausible answer. The diagram's job is to EXHAUST categories, not to pick a winner — that comes later, after the grid is populated.",
  howToRead:
    "Start at the problem statement on the right and read the spine backwards. Each diagonal bone is a category of cause; the short ticks branching off each bone are specific sub-causes the team has identified. Empty categories are meaningful: an empty 'Measurement' bone usually means the team didn't look, not that there's nothing to find. The diagram is complete when every category has at least one concrete sub-cause the team can act on.",
  example: {
    title: "Low customer NPS — quarterly retrospective",
    description:
      "A B2B SaaS team running a quarterly retro maps a dropping NPS score against the canonical 6M taxonomy (Method, Machine, Material, Measurement, Environment, People). The Measurement bone reveals the real culprit — the team was tracking vanity metrics and had no clear SLA, so customer complaints never reached the dashboard that drove sprint priority. Kaoru Ishikawa developed the technique at Kawasaki in the 1960s for exactly this failure mode: engineers under time pressure debating a single favoured cause while the rest of the problem space went uninspected.",
  },
  elements: [
    {
      selector: "spine",
      label: "Spine",
      explanation:
        "The horizontal backbone runs from the problem statement (right) back to a tail mark (left) and carries all the category bones. It is conventionally drawn as an arrow, and the arrow direction matters: cause flows into effect, not the reverse.",
    },
    {
      selector: "problem",
      label: "Problem statement",
      explanation:
        "The box at the right tip of the spine is the one effect the diagram is explaining. Phrase it as a concrete observation ('Low NPS'), not as a solution ('Need to improve NPS') — fishbones work only when the team is not allowed to pre-commit to an answer.",
    },
    {
      selector: "category-bone",
      label: "Category bone",
      explanation:
        "Each diagonal line off the spine is one category of cause. The bones carry no data themselves; they are buckets whose only job is to make sure the team considers every kind of cause, not just the familiar ones.",
    },
    {
      selector: "sub-cause",
      label: "Sub-cause branch",
      explanation:
        "Short ticks off a bone are specific, actionable sub-causes — 'Unclear docs', 'Slow dashboard', 'Training gaps'. Keep them concrete: if a sub-cause is abstract enough to appear under three different bones, it is a category, not a cause.",
    },
    {
      selector: "symmetry",
      label: "Above/below split",
      explanation:
        "Three bones go above the spine, three below. The split has no semantic meaning — it exists purely for legibility. Teams sometimes put 'people' categories above and 'system' categories below as a convention, but the diagram doesn't require it.",
    },
    {
      selector: "6m-categories",
      label: "The 6M taxonomy",
      explanation:
        "The canonical six categories are Method, Machine, Material, Measurement, Environment, and People (sometimes called 5M+1E, or 4M in service contexts). The taxonomy's power is that it is fixed — it forces the team to ask 'what's in Measurement?' even when Measurement is the one they haven't thought about.",
    },
  ],
};
