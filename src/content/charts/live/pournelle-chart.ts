import type { LiveChart } from "@/content/chart-schema";

export const pournelleChart: LiveChart = {
  id: "pournelle-chart",
  name: "Pournelle Chart",
  family: "comparison",
  sectors: ["politics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Two-dimensional political-ideology map with state-planning on the horizontal axis and attitude towards reason on the vertical axis.",

  whenToUse:
    "Use a Pournelle chart when the one-dimensional left-right scale is concealing a second axis of disagreement — specifically whether a movement appeals to rational deliberation or to myth, blood, and instinct. It is an argument chart, not a neutral taxonomy: Pournelle designed it to show that rationalism-plus-planning and rationalism-without-planning are coherent positions, while their irrational counterparts sit below both. Apply it to political history, ideological comparison, or media analysis; avoid it in polling and electoral work, where empirical self-placement data belongs on the simpler left-right axis.",

  howToRead:
    "Read the x-axis as a spectrum from anarchism (state planning is bad; let spontaneous order prevail) at the left to totalitarianism (state planning is necessary; the collective precedes the individual) at the right. Read the y-axis as a spectrum from irrationalism (myth, tradition, emotion, mysticism) at the bottom to reason (empiricism, deliberation, science) at the top. Each ideology dot is placed by its characteristic position on both axes simultaneously. The chart's controversial structural claim is visible in the upper-right quadrant: movements that assert they are on opposite ends of the left-right axis — communism and American conservatism — share the same rationalist-authoritarian corner.",

  example: {
    title: "Jerry Pournelle's 1963 PhD dissertation, University of Washington",
    description:
      "Pournelle introduced this chart in The American Political Continuum (1963), arguing that the Nazi-Communist symmetry argument used in Cold War rhetoric was wrong: both sat in the rationalist-authoritarian quadrant, differing mainly on the planning axis. He published a revised version in A Step Farther Out (1979), where it circulated widely among libertarian and conservative readers as an alternative to the emerging Nolan chart. The reason axis is what makes Pournelle's framework distinctive — it is the only mainstream 2D ideology map to encode epistemological stance rather than a second freedom variable.",
  },

  elements: [
    {
      selector: "axis-planning",
      label: "Planning axis (x)",
      explanation:
        "The horizontal axis measures attitude towards deliberate collective organisation of society. The left extreme (anarchism) holds that planning is inherently coercive or inefficient and that emergent order outperforms designed order. The right extreme (totalitarianism) holds that comprehensive state planning is necessary and legitimate. Most real movements sit between the extremes; the x-position marks where a movement's rhetoric and programme fall on this spectrum.",
    },
    {
      selector: "axis-reason",
      label: "Reason axis (y)",
      explanation:
        "The vertical axis measures whether a movement grounds its claims in empiricism and rational argument (top) or in myth, tradition, blood, or divine revelation (bottom). Pournelle drew this axis to separate movements that can in principle be persuaded by evidence from those that cannot. A movement near the top may be wrong but argues from evidence; a movement near the bottom may be sincere but appeals to something prior to argument.",
    },
    {
      selector: "quadrants",
      label: "Four quadrants",
      explanation:
        "Each quadrant names a combination of the two axes. Upper-left (libertarian-rationalist): rejects central planning on reasoned grounds — classical liberalism, Ayn Rand libertarianism. Upper-right (rationalist-authoritarian): accepts planning as a rational project — communism, technocratic progressivism. Lower-left (irrational-anarchic): rejects order on instinctual or spiritual grounds — certain anarcho-primitivist movements. Lower-right (irrational-authoritarian): enforces order through myth and will — fascism, Nazism. The lower-right is the quadrant Pournelle considered the most dangerous.",
    },
    {
      selector: "ideology-dot",
      label: "Ideology dot",
      explanation:
        "Each filled circle is one movement or tradition placed by its characteristic dual position. Placement is interpretive, not statistical — there is no survey underlying these coordinates. The dots encode Pournelle's analytical claim, which can be contested. What the chart makes visible is that two movements placed far apart on the left-right axis (communism and American conservatism) can sit close together on the planning-reason plane, sharing a rationalist-authoritarian neighbourhood.",
    },
    {
      selector: "rationalist-authoritarian-quadrant",
      label: "Rationalist-authoritarian quadrant",
      explanation:
        "The upper-right quadrant is the chart's polemical centrepiece. Pournelle placed communism here — arguing that Marxism-Leninism makes rationalist appeals (scientific socialism, historical materialism) while also demanding extensive state planning. American liberalism sits in the same quadrant, further from the extremes. The chart's implicit argument is that rationalism does not immunise a movement against authoritarianism — a claim that was politically charged in the Cold War context and remains contested.",
    },
    {
      selector: "crosshair",
      label: "Centre crosshair",
      explanation:
        "The intersection of the two dashed crosshair lines marks the neutral point — zero-planning and zero-tilt on both axes. No labelled ideology sits at the exact centre; in Pournelle's framing, centrism is not a stable political philosophy but a temporary position. The crosshair is a reading aid: it shows which quadrant each dot occupies without requiring the viewer to mentally project to each axis independently.",
    },
  ],
};
