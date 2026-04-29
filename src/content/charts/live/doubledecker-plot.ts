import type { LiveChart } from "@/content/chart-schema";

export const doubledeckerPlot: LiveChart = {
  id: "doubledecker-plot",
  name: "Doubledecker Plot",
  family: "composition",
  sectors: ["statistics"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Equal-height bars whose widths are joint counts and whose shaded decks are a binary response rate, read side-by-side across predictor categories.",
  whenToUse:
    "Reach for a doubledecker when the question is whether a binary response varies across combinations of two or more predictor categories. Fixing bar height to 100% lets the eye compare conditional rates directly, which a general mosaic plot cannot do because its cell heights encode two things at once. Use it when you have one response and many predictor crossings to interrogate.",
  howToRead:
    "Start with the shaded lower deck of each bar — that fraction is the response rate for that predictor cell. Scan horizontally: bars sitting next to each other share a predictor group (shown by the top labels), so jumps in shaded height across the group isolate the effect of the inner predictor. Bar widths encode the joint count, so a thin bar with a dramatic shading is rarer than it looks. The y-axis reads 0 to 100% response rate and is identical for every bar.",
  example: {
    title: "Titanic survival by class and sex, Hofmann 2001",
    description:
      "Heike Hofmann introduced the doubledecker plot in Computational Statistics 16 (2001) using the Titanic passenger list: four classes crossed with sex, eight equal-height bars. First-class-female bars are nearly entirely shaded (survival ~97%), third-class-male bars are almost empty (~16%), and the widest bar — crew male — shows that the most-numerous cohort was among the least likely to survive. A general mosaic plot obscures that comparison; equalising bar height is the point.",
  },
  elements: [
    {
      selector: "shaded-fraction",
      label: "Shaded deck",
      explanation:
        "The lower deck is the success fraction of the binary response for that cell — here, the proportion of passengers who survived. Because bar height is fixed, shaded-height IS the rate, and rates can be compared by eye without mental arithmetic.",
    },
    {
      selector: "equal-height-bar",
      label: "Equal-height bar",
      explanation:
        "Every bar is drawn to the same height regardless of count. This is the defining move of the doubledecker: it trades the mosaic's count-as-area for count-as-width-only, freeing the vertical axis to show the response rate cleanly.",
    },
    {
      selector: "bar-width",
      label: "Bar width",
      explanation:
        "Width encodes the joint count of the predictor cell. A dramatic survival rate on a thin bar is rarer than on a wide one; ignore width and you overweight tiny cells. The crew-male bar is the widest here because 885 crew were aboard.",
    },
    {
      selector: "response-axis",
      label: "Response axis",
      explanation:
        "The y-axis is fixed at 0 to 100% for every bar. This is what makes cross-bar comparison direct — the axis is the shared reference that a general mosaic plot does not provide.",
    },
    {
      selector: "predictor-labels",
      label: "Predictor labels",
      explanation:
        "Labels at the top group bars into their outer predictor (class); labels inside each bar show the inner predictor (sex). Reading the hierarchy in this order keeps the conditional structure legible — which is what the doubledecker exists to show.",
    },
  ],
};
