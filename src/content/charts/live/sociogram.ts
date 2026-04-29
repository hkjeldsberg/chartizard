import type { LiveChart } from "@/content/chart-schema";

export const sociogram: LiveChart = {
  id: "sociogram",
  name: "Sociogram",
  family: "relationship",
  sectors: ["social-sciences", "networks"],
  dataShapes: ["network"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Maps interpersonal choice as a directed graph: nodes are people, arrows are nominations, and the topology separates stars from isolates.",
  whenToUse:
    "Reach for a sociogram when the data is a set of sociometric nominations — who chooses whom for friendship, work, influence, or trust. It is the right chart for classroom dynamics, team cohesion reviews, and contact-tracing interviews. Avoid it when the ties are undirected or mechanical (co-authorship, shared infrastructure); those are better read as a generic network diagram where direction carries no meaning.",
  howToRead:
    "Follow the arrowheads: each one points from a chooser to a chosen. A node that collects many inbound arrows is a star; a node with none is an isolate. Node size here encodes in-degree, so the visual order matches the sociometric order at a glance. Reciprocated pairs — two arrows between the same two nodes — read as mutual ties and tend to anchor the small cliques around each star. The layout is hand-placed: stars pulled toward the centre, isolates pushed to the margin, because the chart's job is to make that hierarchy obvious.",
  example: {
    title: "Jacob Moreno's classroom sociograms, New York State Training School for Girls, 1932",
    description:
      "Moreno asked every resident of the school to name the three peers she wanted at her dinner table. The resulting charts — first published in Who Shall Survive? (1934) — revealed a structure the staff could not see by observation: a small cluster of universally chosen girls, a wider middle ring of mutual pairs, and a handful of isolates whose dormitory placements Moreno then successfully reorganised to reduce runaway incidents. The sociogram was the first chart in which the drawing was also the intervention.",
  },
  elements: [
    {
      selector: "star",
      label: "Star",
      explanation:
        "A node that attracts many inbound nominations. Stars are the chart's centre of gravity and the reason most other nodes get placed where they are. In Moreno's original 1932 work the stars were the girls who stabilised the dormitories; in a modern classroom they are the children every teacher already knows by name. In-degree, not out-degree, is the measure — popularity is about who others choose, not who you choose.",
    },
    {
      selector: "node",
      label: "Node",
      explanation:
        "One person in the group. Radius is proportional to the square root of in-degree, so area scales linearly with sociometric status and a star reads as visibly larger than a peripheral classmate. Keep the encoding monotone — do not reuse node size for anything else on the same chart.",
    },
    {
      selector: "tie",
      label: "Directed tie",
      explanation:
        "An arrow from chooser to chosen. Because the tie is directed, a sociogram can show asymmetric relationships a plain network diagram would flatten: a child who nominates a star who does not nominate her back. Reciprocated arrows between the same two nodes are the seed of the small cliques visible around each star.",
    },
    {
      selector: "isolate",
      label: "Isolate",
      explanation:
        "A node that receives no nominations. Isolates are the chart's diagnostic payload: they are the children Moreno reassigned, the employees an onboarding review will flag, the patients a contact-tracing team will worry about. Drawn here with a hollow dashed ring so that a zero-in-degree node is unmistakable at a glance.",
    },
    {
      selector: "prompt",
      label: "Sociometric prompt",
      explanation:
        "The question the respondents answered. A sociogram without its prompt is uninterpretable — nominations for seatmate, study partner, and confidant produce structurally different graphs from the same group. The prompt is the chart's caption and belongs next to it, not in the method section.",
    },
  ],
};
