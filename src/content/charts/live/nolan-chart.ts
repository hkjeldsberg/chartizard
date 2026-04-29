import type { LiveChart } from "@/content/chart-schema";

export const nolanChart: LiveChart = {
  id: "nolan-chart",
  name: "Nolan Chart",
  family: "comparison",
  sectors: ["politics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Two-axis ideology map that separates economic freedom from personal freedom, rotated 45° so the four quadrants sit at the diamond's corners.",
  whenToUse:
    "Use the Nolan chart when a one-dimensional left-right scale is flattening a disagreement that is actually two disagreements. It is designed to argue a point — that libertarian and authoritarian positions exist on both the left and the right — so it suits political education, voter guides, and ideology self-tests more than it suits neutral reporting.",
  howToRead:
    "The x-axis runs from state-controlled to market-driven economics; the y-axis from authoritarian to libertarian personal freedoms. The square is rotated 45° so the four pure ideologies land at the diamond's corners instead of being labelled as quadrants. A point near the centre is centrist on both axes; a point on the faint diagonal between Progressive and Conservative is where a one-dimensional left-right scale would place it, and the chart's argument is that the other diagonal matters just as much.",
  example: {
    title: "David Nolan's 1969 diagram",
    description:
      "Nolan, a libertarian activist, drew the first version of this chart to argue that the US two-party dichotomy was collapsing the libertarian–authoritarian axis into silence. The Libertarian Party's 'World's Smallest Political Quiz' has since used a simplified Nolan chart to route tens of millions of respondents into one of the four named quadrants — which is also why you will see alternative 2D ideology maps with the axes quietly re-labelled. The chart's popularity is itself political.",
  },
  elements: [
    {
      selector: "quadrant",
      label: "Quadrant (Libertarian)",
      explanation:
        "Each corner of the rotated diamond is a named ideological quadrant. The top corner — high economic freedom plus high personal freedom — is the Libertarian position, which is the one Nolan drew the chart to make visible in the first place. Conservative, Progressive, and Statist occupy the other three corners.",
    },
    {
      selector: "axis-x",
      label: "Economic axis",
      explanation:
        "The east-facing edge of the diamond is the economic-freedom axis. At the left end, the state sets prices and owns the means of production; at the right end, markets do. This is the axis a traditional left-right scale already measures, which is why plotting only this axis would recover the chart's faint left-right diagonal.",
    },
    {
      selector: "axis-y",
      label: "Personal axis",
      explanation:
        "The north-facing edge is the personal-freedom axis — speech, assembly, lifestyle, dissent. Low values are authoritarian; high values are libertarian. The chart's whole argument is that this axis is independent of the economic one, so a chart that collapses it into 'left' and 'right' has lost a dimension.",
    },
    {
      selector: "origin",
      label: "Centre (Centrist)",
      explanation:
        "The centre of the diamond is where the two axes both land at 0.5 — moderate on economics, moderate on personal freedom. 'Centrist' on a Nolan chart is not the same as centrist on a left-right scale: you can be dead-centre here while still being strongly for or against specific policies, because the chart only measures two orthogonal tendencies.",
    },
    {
      selector: "position",
      label: "Plotted position",
      explanation:
        "Each circle is one ideology or respondent placed by its two scores. The Libertarian corner point is plotted near (0.9, 0.9) to show the extreme of that quadrant — a real respondent's dot will sit further from the corner and closer to the centre, which is usually the point the chart is trying to make.",
    },
    {
      selector: "diagonal",
      label: "Left–right diagonal",
      explanation:
        "The faint dashed line from Progressive to Conservative is the one-dimensional left-right axis the Nolan chart was designed to critique. Every position on that diagonal could be placed by a traditional scale; every position above or below it is what the second axis was added to reveal.",
    },
  ],
};
