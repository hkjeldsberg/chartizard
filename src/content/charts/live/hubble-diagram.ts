import type { LiveChart } from "@/content/chart-schema";

export const hubbleDiagram: LiveChart = {
  id: "hubble-diagram",
  name: "Hubble Diagram",
  family: "relationship",
  sectors: ["physics"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Scatter of galaxy recession velocity against distance, whose linear slope is the Hubble constant — the expansion rate of the universe.",

  whenToUse:
    "Use a Hubble diagram whenever you need to read a physical law from observational scatter — specifically when a linear relationship between two continuous quantities carries cosmological significance. The slope is the scientific result; the scatter is the systematic uncertainty.",

  howToRead:
    "Each point is one galaxy or galaxy cluster: its x-position is the distance in megaparsecs (Mpc), its y-position is the recession velocity in km/s derived from redshift. A steeper best-fit line means faster expansion per unit distance — a larger Hubble constant H₀. The two panels here use a broken axis: the left shows Hubble's original 1929 range (0–2 Mpc) with slope ≈ 500 km/s/Mpc; the right shows the modern distance-ladder range (5–100 Mpc) with slope ≈ 70 km/s/Mpc. The mismatch is the Hubble tension.",

  example: {
    title:
      "Hubble 1929 vs SH0ES / Planck: the 4σ Hubble tension",
    description:
      "Edwin Hubble's 1929 PNAS paper plotted 24 nearby galaxies and found H₀ ≈ 500 km/s/Mpc — a number inflated ~7× because Cepheid period-luminosity calibration confused classical Cepheids with W Virginis variables (corrected by Baade in 1952). The modern diagram, extended to thousands of Mpc via Type Ia supernovae by Riess, Perlmutter, and Schmidt (1998 ApJ) — Nobel Physics 2011 — converges near 70, but a ~4σ gap now persists: the SH0ES team (Cepheid + SNe Ia ladder) measures H₀ ≈ 73 km/s/Mpc, while Planck's CMB-derived value is ≈ 67. The 2023 JWST re-analysis of SH0ES Cepheids (Riess et al.) found no significant systematic error, keeping the tension alive.",
  },

  elements: [
    {
      selector: "hubble-1929-point",
      label: "Hubble 1929 galaxy",
      explanation:
        "One of Hubble's original 24 nearby galaxies from the 1929 PNAS paper. Distances were estimated via Cepheid variables and brightest-star methods; velocities came from Slipher's radial-velocity catalogue. The scatter is large — noise was comparable to the signal at these distances — yet the linear trend was visible.",
    },
    {
      selector: "modern-point",
      label: "Modern distance-ladder galaxy",
      explanation:
        "A galaxy with distance measured via the distance ladder: geometric parallax → Cepheids → Type Ia supernovae. At 50 Mpc, peculiar velocities are a small fraction of the Hubble flow, making these points far cleaner tracers of H₀ than Hubble's original nearby sample.",
    },
    {
      selector: "hubble-1929-slope",
      label: "Hubble 1929 slope (H₀ ≈ 500)",
      explanation:
        "The best-fit slope through Hubble's 24 galaxies implies H₀ ≈ 500 km/s/Mpc — roughly 7× too high. The error traced to the Cepheid distance scale: Hubble used a period-luminosity calibration that mixed Population I (classical) and Population II (W Virginis) Cepheids, which differ in luminosity by ~1.5 magnitudes. Walter Baade corrected the scale at the 1952 Rome IAU, roughly halving the Hubble constant.",
    },
    {
      selector: "modern-slope",
      label: "Modern slope (H₀ ≈ 67–73)",
      explanation:
        "The modern best-fit slope is ≈ 70 km/s/Mpc, but the precise value is contested. The SH0ES collaboration (Riess et al.) anchors the ladder to Milky Way Cepheids and LMC eclipsing binaries and finds H₀ ≈ 73. The Planck satellite fits the CMB power spectrum and infers H₀ ≈ 67 under ΛCDM. This ~4σ Hubble tension is unresolved as of 2024.",
    },
    {
      selector: "x-axis",
      label: "Distance axis (Mpc)",
      explanation:
        "One megaparsec (Mpc) is ~3.26 million light-years, or ~3.09 × 10²² metres. The left panel spans the range Hubble could probe in 1929 with Cepheids in the Virgo Cluster; the right panel spans the modern SNe Ia reach, where the Hubble flow dominates over local peculiar velocities.",
    },
    {
      selector: "y-axis",
      label: "Recession velocity axis (km/s)",
      explanation:
        "Recession velocity is derived from spectroscopic redshift z via v ≈ cz (for z ≪ 1). The linearity of v versus distance — Hubble's Law — implies that the universe has no privileged centre: every observer sees all galaxies receding, consistent with a homogeneous, isotropic Big Bang expansion.",
    },
    {
      selector: "origin",
      label: "Origin (zero distance, zero velocity)",
      explanation:
        "The linear relation passes through the origin: a galaxy at zero distance has zero recession velocity. This intercept is fixed by definition — it is the observational statement that Hubble's Law holds, and that local peculiar motions average out on large scales.",
    },
  ],
};
