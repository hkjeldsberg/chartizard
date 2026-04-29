import type { LiveChart } from "@/content/chart-schema";

export const bagplot: LiveChart = {
  id: "bagplot",
  name: "Bagplot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",

  synopsis:
    "A 2D generalisation of the box-plot that uses halfspace depth to identify the central 50% region and flag bivariate outliers.",

  whenToUse:
    "Use a bagplot when you have two continuous variables measured on the same observations and want to summarise their joint distribution, not just their marginals. The chart is especially useful when correlation structure, bivariate asymmetry, or multivariate outliers are the substantive question — cases where two side-by-side box-plots mislead by discarding the joint behaviour.",

  howToRead:
    "Three layers carry the information. The inner polygon — the 'bag' — contains approximately 50% of the points, the ones with the highest Tukey halfspace depth; it is the 2D analogue of the IQR box. The outer polygon — the 'fence' — is the bag scaled outward by a factor of three from the depth median; points outside the fence are outliers. The small cross at the centre marks the depth median, the point that maximises depth and corresponds to the bivariate median. Read the bag's shape for correlation and asymmetry; read the fence for the outlier rule.",

  example: {
    title: "Flint, Michigan blood-lead levels by age and time since exposure (2016)",
    description:
      "Rousseeuw and colleagues applied bagplots to environmental exposure data where a univariate summary on either axis erases the bivariate structure. Lead concentration versus age in the Flint cohort shows a bag elongated along the age axis — young children cluster at high exposure — while several adults appeared as fence outliers with anomalously high readings, a pattern that would be invisible in two separate box-plots.",
  },

  elements: [
    {
      selector: "depth-median",
      label: "Depth median",
      explanation:
        "The cross marks the depth median — the point with the maximum Tukey halfspace depth, meaning no halfplane through it contains fewer than 50% of the data. Rousseeuw et al. (1999) use it as the 2D counterpart of the univariate median. Here it is approximated by the centroid of the full point cloud.",
    },
    {
      selector: "bag-polygon",
      label: "50% bag",
      explanation:
        "The darker inner polygon contains the 30 points closest (in Euclidean distance to the depth median) and forms the convex hull of that central half. This is the 2D analogue of the IQR box: it captures the most typical 50% of the bivariate distribution. The bag's shape reveals correlation — an elongated bag indicates the two variables move together.",
    },
    {
      selector: "fence-polygon",
      label: "Outer fence",
      explanation:
        "The fence is the bag inflated by a factor of three from the depth median, following Rousseeuw, Ruts, and Tukey's 1999 specification. It plays the same role as the 1.5×IQR whisker rule in a box-plot: observations outside the fence are flagged as outliers. The factor of three was chosen empirically to match the box-plot's outlier detection rate under bivariate normality.",
    },
    {
      selector: "outlier-point",
      label: "Outlier",
      explanation:
        "Open circles mark points that fall outside the fence. They are bivariate outliers — unusual not necessarily in either marginal distribution alone but in the combination of the two variables. A high-x, high-y point may be unremarkable on either marginal box-plot yet be an outlier on the bagplot if the bulk of the data follows a lower correlation.",
    },
    {
      selector: "interior-point",
      label: "Bag-interior point",
      explanation:
        "A filled circle inside the bag is a normal observation — one of the 50% most central data points. Its position inside the bag tells you it is close to the bivariate median in both dimensions simultaneously, not just in one marginal at a time.",
    },
    {
      selector: "depth-concept",
      label: "Concentric depth structure",
      explanation:
        "The two polygons make Tukey's depth concept visible. Depth increases inward: every point's depth counts how few data points lie in the thinnest halfplane cutting through it. The deepest point is the depth median at the centre; points on the fence boundary have very low depth. The concentric structure — bag inside fence — is the bagplot's defining visual idea, introduced by Rousseeuw, Ruts, and Tukey in The American Statistician, 53(4), 1999.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "The second continuous variable. Both axes must be on comparable scales for the bag's shape to correctly encode the correlation angle. Standardising both variables before plotting a bagplot avoids distortion from differing units.",
    },
  ],
};
