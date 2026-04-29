import type { LiveChart } from "@/content/chart-schema";

export const karyotype: LiveChart = {
  id: "karyotype",
  name: "Karyotype",
  family: "specialty",
  sectors: ["genetics"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Arranges all 46 human chromosomes as paired, G-banded vertical bars ordered by size, providing a whole-genome snapshot for cytogenetic diagnosis.",
  whenToUse:
    "Use a karyotype when the question concerns chromosome-level structure: gains, losses, translocations, inversions, or sex-chromosome aneuploidies. It is the primary output of conventional cytogenetics and prenatal diagnosis (amniocentesis, CVS). It cannot resolve sub-megabase variants — for those, use comparative genomic hybridisation or sequencing.",
  howToRead:
    "Chromosomes are arranged in decreasing size order, left to right within two rows. Pairs 1–12 occupy the first row; pairs 13–22 plus the sex chromosomes (X and Y in males, two X in females) occupy the second. Each pair is represented by two vertical bars — the homologues. Horizontal dark bands are G-bands (Giemsa-positive, heterochromatic); light bands are G-negative (euchromatic, gene-dense). The centromere appears as a narrow constriction (waist) dividing the shorter p-arm above from the longer q-arm below. Count the bars: 46 total in a normal karyotype, 47 in trisomies such as Down syndrome (trisomy 21). The nomenclature in the corner follows ISCN — 46,XY is normal male; 47,XX,+21 is female with Down syndrome.",
  example: {
    title: "Cytogenetic confirmation of trisomy 21 in a prenatal amniocentesis",
    description:
      "When an amniocentesis returns 47 chromosomes with three copies at position 21, the karyotype image is the legal and clinical record that triggers genetic counselling. Tjio and Levan's 1956 Hereditas paper — which corrected the chromosome count from 48 to 46 using improved cell-squash technique — established the reference baseline this chart depends on. The current G-banding system, introduced by Seabright (1971, Lancet), maps approximately 400–850 resolvable bands in a high-resolution preparation; this chart renders a simplified schematic of 3–6 bands per chromosome.",
  },
  elements: [
    {
      selector: "chromosome-pair",
      label: "Chromosome pair",
      explanation:
        "Each pair of vertical bars represents the two homologous chromosomes inherited one from each parent. In diploid human cells there are 22 autosomal pairs and one pair of sex chromosomes, for 46 chromosomes total. Loss of one homologue (monosomy) or gain of an extra (trisomy) is visible as a pair containing 1 or 3 bars respectively.",
    },
    {
      selector: "centromere",
      label: "Centromere waist",
      explanation:
        "The centromere is the primary constriction — the narrow waist visible on each bar. It is the attachment point for spindle microtubules during cell division. Its position defines chromosome morphology: metacentric (centromere near the middle), submetacentric (off-centre), and acrocentric (centromere very close to one end, as in chromosomes 13–15, 21, 22). The short arm above the centromere is the p-arm; the long arm below is the q-arm.",
    },
    {
      selector: "g-banding",
      label: "G-banding pattern",
      explanation:
        "G-bands are produced by treating chromosomes with trypsin then staining with Giemsa. AT-rich, late-replicating heterochromatin stains dark; GC-rich, early-replicating euchromatin stains light. Each chromosome has a unique banding pattern — the cytogenetic fingerprint — that enables precise identification and mapping of structural abnormalities. Introduced by Mary Seabright in a one-column letter to the Lancet in 1971. ISCN 2020 designates approximately 850 bands at the highest preparation resolution.",
    },
    {
      selector: "p-arm-q-arm",
      label: "p-arm vs q-arm",
      explanation:
        "The centromere divides each chromosome into two arms. The p-arm (from French petit, small) is the shorter arm above the centromere; the q-arm is the longer arm below. Cytogenetic addresses follow the format chromosome:arm:band — 17p13.1 is where TP53 resides, 17q21.31 is where BRCA1 resides. Band addresses increase outward from the centromere toward the telomere on each arm.",
    },
    {
      selector: "sex-chromosomes",
      label: "Sex chromosomes (XY)",
      explanation:
        "The X and Y chromosomes are placed at the right end of the second row, distinguished by label from the autosomes. In normal males (46,XY), X is intermediate in size (pair 23 by convention) and Y is the smallest chromosome. Females have two X chromosomes (46,XX). Turner syndrome (45,X) presents a single bar; Klinefelter syndrome (47,XXY) presents three sex-chromosome bars. The XY distinction encodes biological sex and is diagnostic for sex-chromosome aneuploidies.",
    },
    {
      selector: "size-ordering",
      label: "Chromosome size ordering",
      explanation:
        "Chromosomes are ordered from largest (chromosome 1, ~249 Mb) to smallest (chromosomes 21 and 22, ~47–51 Mb) across the two rows. This ordering follows ISCN convention and makes counting and comparison straightforward: structural variants such as deletions or duplications shift a chromosome's apparent length, making it stand out against its size-matched neighbours.",
    },
    {
      selector: "karyotype-nomenclature",
      label: "46,XY nomenclature",
      explanation:
        "The ISCN string in the corner summarises the karyotype: total chromosome count, comma, sex chromosome constitution. 46,XY = normal male. Structural variants extend the string: 46,XX,del(5p) is cri-du-chat (5p deletion) in a female; 47,XY,+21 is Down syndrome in a male. ISCN (International System for Human Cytogenomic Nomenclature) has been maintained since 1978, most recently updated in 2020.",
    },
  ],
};
