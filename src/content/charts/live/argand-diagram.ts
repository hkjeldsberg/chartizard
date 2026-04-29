import type { LiveChart } from "@/content/chart-schema";

export const argandDiagram: LiveChart = {
  id: "argand-diagram",
  name: "Argand Diagram",
  family: "specialty",
  sectors: ["electrical", "mathematics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Maps complex numbers onto a plane — real part horizontal, imaginary part vertical — so that multiplication becomes rotation and scaling rather than abstract algebra.",

  whenToUse:
    "Use the Argand diagram whenever a problem's structure is inherently geometric: impedance in AC circuits (where resistance and reactance are orthogonal), roots of polynomials (which appear as conjugate pairs reflected across the real axis), or any application of De Moivre's theorem. It is the natural home of any quantity whose magnitude and phase both carry independent meaning.",

  howToRead:
    "Each complex number is a vector from the origin. The horizontal coordinate is the real part (ℜ); the vertical coordinate is the imaginary part (ℑ). The length of the vector is the modulus |z| — computed as √(Re² + Im²) — and the angle it makes with the positive real axis is the argument arg(z). The complex conjugate z* is the reflection across the real axis; geometrically, conjugation negates the imaginary component without altering the modulus.",

  example: {
    title: "Impedance plane in AC circuit analysis",
    description:
      "Electrical engineers plot impedance Z = R + jX on the Argand diagram to read phase angle and magnitude at a glance. A purely resistive load sits on the real axis; an inductor moves the point upward (positive imaginary); a capacitor moves it downward. The distance from the origin is the impedance magnitude and directly determines peak current for a given voltage.",
  },

  elements: [
    {
      selector: "real-axis",
      label: "Real axis (ℜ)",
      explanation:
        "The horizontal axis carries the real component of every complex number. Jean-Robert Argand's 1806 paper formalised this axis as the 'real' line, embedding the ordinary number line into the plane. Caspar Wessel had drawn the same construction in 1799 (in Danish, and thus unread by most of Europe), and Gauss used it independently from around 1811, publishing in 1831.",
    },
    {
      selector: "imaginary-axis",
      label: "Imaginary axis (ℑ)",
      explanation:
        "The vertical axis carries the imaginary component. Points on this axis alone (Re = 0) are purely imaginary. The key insight Argand contributed was that the imaginary unit i is not a fiction but a rotation operator: multiplying by i rotates a vector 90° anticlockwise, which is exactly what the vertical axis represents geometrically.",
    },
    {
      selector: "vector-z",
      label: "Vector z = 3 + 4i",
      explanation:
        "The arrow from the origin to the point (3, 4) represents the complex number z = 3 + 4i. Any complex number can be read off the diagram in two equivalent ways: Cartesian (Re + i·Im) or polar (|z|·e^{iθ}). On the Argand diagram, multiplication of two complex numbers corresponds to multiplying their moduli and adding their arguments — a geometric rule that De Moivre's formula encodes analytically.",
    },
    {
      selector: "magnitude",
      label: "Modulus |z| = 5",
      explanation:
        "The modulus is the Euclidean length of the vector: |z| = √(3² + 4²) = 5. This is the 3-4-5 Pythagorean triple. In the impedance plane, the modulus is the scalar magnitude of impedance; in signal processing it is the amplitude of a complex sinusoid. The dashed perpendiculars show the Cartesian decomposition whose hypotenuse equals the modulus.",
    },
    {
      selector: "argument-arc",
      label: "Argument arc (arg z ≈ 53.13°)",
      explanation:
        "The arc sweeps from the positive real axis to the vector, measuring the argument: arg(z) = arctan(4/3) ≈ 53.13°, or π/3 radians approximately. In polar form z = 5·e^{i·53.13°}. Argument addition is why multiplying two complex numbers adds their angles — the Argand diagram makes this law visible without any algebra.",
    },
    {
      selector: "conjugate",
      label: "Conjugate z* = 3 − 4i",
      explanation:
        "The complex conjugate z* = 3 − 4i is the mirror image of z across the real axis. Conjugate pairs always appear together as roots of polynomials with real coefficients, which is why the Argand diagram immediately shows that non-real roots come in symmetric pairs. In AC circuit analysis, z and z* have equal impedance magnitude but opposite phase angles.",
    },
  ],
};
