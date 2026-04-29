import type { LiveChart } from "@/content/chart-schema";

export const confusionMatrix: LiveChart = {
  id: "confusion-matrix",
  name: "Confusion Matrix",
  family: "relationship",
  sectors: ["data-science"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A grid of true-against-predicted counts — the diagnostic that tells you which classes a model confuses, and in which direction.",
  whenToUse:
    "Use a confusion matrix any time you have a classifier and its predictions on a labelled test set. Accuracy collapses all errors into one number; the matrix keeps them separated so you can see whether your model fails at 'cat vs dog' or 'cat vs bird' or nowhere in particular. It is the first chart to reach for before precision, recall, F1, or any aggregate score.",
  howToRead:
    "Each row is a true class, each column is a predicted class, each cell is a count. The diagonal is where the model was right. Everything off the diagonal is an error — and the chart's real job is to make the asymmetry of those errors visible. Compare cell (True=Dog, Pred=Cat) against its mirror (True=Cat, Pred=Dog): if one is consistently larger, the model has a directional bias. Row sums give you the ground-truth class balance; column sums give you the model's prediction distribution. A confusion matrix that looks symmetric across the diagonal is a model with uniform confusion; an asymmetric matrix is a model with a specific blind spot.",
  example: {
    title: "3-class image classifier — Cat / Dog / Bird",
    description:
      "A small CNN trained on a Cat/Dog/Bird dataset achieves 82% accuracy, but the matrix tells the real story: 22 of 100 dog images get predicted as cats, while only 14 of 100 cat images get predicted as dogs. The asymmetry points to the model overweighting fur-texture features shared between small dogs and cats, while birds — visually distinct — are classified cleanly. That diagnostic never surfaces from a single accuracy number.",
  },
  elements: [
    {
      selector: "diagonal",
      label: "Diagonal",
      explanation:
        "Cells on the top-left to bottom-right diagonal are correct classifications — true class equals predicted class. A model with a dark, high-count diagonal is accurate overall, but the diagonal alone is never the whole story. Two models with the same diagonal total can have radically different error patterns off it.",
    },
    {
      selector: "off-diagonal",
      label: "Off-diagonal error",
      explanation:
        "Every cell off the diagonal is a misclassification. The specific cell tells you the exact error: here, True=Dog, Predicted=Cat shows the model's most common mistake. Compare against its mirror (True=Cat, Predicted=Dog) — if the two are different, the error is directional, which points at a specific feature the model is over- or under-weighting.",
    },
    {
      selector: "row-true",
      label: "Row — true class",
      explanation:
        "A row collects every item whose true label is that class. Summing a row gives the ground-truth count for that class in the test set. Dividing the diagonal cell by the row sum gives recall for that class — the share of real dogs the model actually found.",
    },
    {
      selector: "column-predicted",
      label: "Column — predicted class",
      explanation:
        "A column collects every item the model predicted as that class, regardless of what it actually was. Summing a column gives how often the model reached for that label. Dividing the diagonal cell by the column sum gives precision for that class — the share of predicted cats that were actually cats.",
    },
    {
      selector: "colour-scale",
      label: "Colour scale",
      explanation:
        "Opacity is redundantly encoded with the count — darker cells are higher. Counts remain printed inside each cell so the encoding is never colour-only. Use the scale to spot the overall pattern at a glance, then read individual numbers to commit to a finding.",
    },
  ],
};
