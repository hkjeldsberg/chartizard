import type { LiveChart } from "@/content/chart-schema";

export const richPictureDiagram: LiveChart = {
  id: "rich-picture-diagram",
  name: "Rich Picture Diagram",
  family: "specialty",
  sectors: ["decision-analysis"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",

  synopsis:
    "A pencil-sketch cartoon of a problem situation — stick figures, thought and speech bubbles, clouds for ambiguity, crossed swords for conflict — drawn before any formal analysis begins.",

  whenToUse:
    "Use a rich picture at the very start of a consulting or policy engagement, when the job is to surface the messy human texture of a situation before anyone tries to model it. Checkland's discipline is to capture stakeholders, their stated positions, their private doubts, and the conflicts between them on a single page — so the later formal models can be audited against what was actually in the room. It is the antithesis of the argument map and the concept map: rich pictures are deliberately pictorial and imprecise, because premature formalism is the failure mode they exist to prevent.",

  howToRead:
    "There is no reading direction. Scan for people first: stick figures are the stakeholders, and their number and grouping is the first piece of information. Read their thought bubbles for private concerns and their speech bubbles for public positions — the gap between the two is often where the real problem sits. Clouds mark fuzzy or ambiguous elements (a funder, a policy, a future event); crossed swords mark a conflict between parties. Arrows carry information, material, or influence, and every arrow should be labelled. An unlabelled arrow in a rich picture is a placeholder for a question the consultant has not yet asked.",

  example: {
    title: "Peter Checkland, Systems Thinking, Systems Practice (Wiley, 1981)",
    description:
      "Rich Pictures are Stage 2 of Checkland's seven-stage Soft Systems Methodology, developed at the University of Lancaster in the 1970s and published in Systems Thinking, Systems Practice. Checkland's argument is that real-world problems — NHS ward management, local-government reorganisation, participatory design — are not well-defined enough for operations research, and that the analyst's first job is to externalise every stakeholder perspective on a single sheet, pictorially, before choosing a model. The school-reform scene here is a textbook example: three teachers clustered together with a shared thought bubble about administrative load, a principal caught between a ministry policy cloud and two parents shouting contradictory demands about homework, crossed swords between teachers and principal for the underlying conflict. The method is still taught in UK public-sector consultancy and in participatory-design communities; the deliberate crudeness of the drawing is itself pedagogy, because a neat diagram would suggest the analyst already understood the problem.",
  },

  elements: [
    {
      selector: "stick-figure",
      label: "Stick figure",
      explanation:
        "Every human or institutional stakeholder who matters to the situation is drawn as a stick figure and labelled. Checkland's rule is that anybody whose perspective would change the outcome of the later analysis must appear on the picture — including stakeholders who are not in the room. A rich picture with only two stick figures is almost always under-populated.",
    },
    {
      selector: "thought-bubble",
      label: "Thought bubble",
      explanation:
        "A stakeholder's private concern, rendered in the cloud-with-connector-dots convention borrowed directly from comics. Thought bubbles are what distinguishes a rich picture from an organisation chart: they record what somebody believes or worries about, not what they officially say. Checkland treats the gap between a stakeholder's thought bubble and their speech bubble as diagnostic — that gap is where the substantive problem often sits.",
    },
    {
      selector: "speech-bubble",
      label: "Speech bubble",
      explanation:
        "A stakeholder's public position — what they say in the meeting, in the press release, in the policy document. The speech bubble's tail points to the speaker so the picture survives re-arrangement. Where two stakeholders' speech bubbles directly contradict each other, the drawing convention is to add crossed swords between them rather than trying to reconcile the positions prematurely.",
    },
    {
      selector: "crossed-swords",
      label: "Crossed swords",
      explanation:
        "A visual shorthand for a conflict between two or more parties: two rotated rectangles with triangular hilts, drawn on top of the contested territory. Checkland adopted the symbol from wargaming maps. Its only job is to force the consultant to acknowledge conflict on the sheet — pictures with no crossed swords and multiple stakeholders are usually concealing them.",
    },
    {
      selector: "cloud",
      label: "Cloud",
      explanation:
        "A scalloped outline marking a fuzzy, ambiguous, or externally-controlled element — a funder, a future policy, an unmeasured environmental factor. Clouds are Checkland's device for acknowledging that not every relevant element can be boxed and named. In Stage 3 (root definitions) and Stage 4 (conceptual models) the analyst will try to sharpen the clouds into variables; the cloud on the rich picture is a reminder of what had to be assumed away.",
    },
    {
      selector: "flow-arrow",
      label: "Flow arrow",
      explanation:
        "A labelled arrow showing information, material, money, or influence moving between elements of the picture. The label is mandatory in Checkland's practice — 'reports', 'complaints', 'policies' — because an unlabelled arrow is just a connection, not a claim about what flows. Arrow density is often the first thing that reveals where a situation is overloaded.",
    },
    {
      selector: "org-box",
      label: "Organisational boundary",
      explanation:
        "A rectangle (often dashed) drawn around a cluster of stakeholders to mark them as a single institution: a school, a hospital ward, a ministry. Checkland uses boundaries lightly in a rich picture because hard boundary-drawing is deferred to Stage 4; the rectangle here is a reminder that some stick figures share an employer or a legal identity, not a claim that the boundary is the system.",
    },
  ],
};
