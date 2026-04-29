"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { hierarchy, cluster as d3Cluster } from "d3-hierarchy";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Three-domain tree-of-life, Woese & Fox (1977) topology with Open Tree of
// Life (Hinchliff et al., 2015) representative taxa. ~32 leaves sampled
// across Bacteria, Archaea, Eukarya. Branch lengths are illustrative:
// Bacteria and Archaea splits are deep (distances ~ 0.45–0.7), Eukarya
// crown-group speciations are shallower (~ 0.2–0.5).

type Domain = "Bacteria" | "Archaea" | "Eukarya";

interface RawNode {
  name: string;
  branchLength: number; // distance from this node to its parent
  domain?: Domain;      // only set on leaves (colour-coded)
  children?: RawNode[];
}

const DATA: RawNode = {
  name: "LUCA",
  branchLength: 0,
  children: [
    {
      name: "Bacteria",
      branchLength: 0.35,
      children: [
        {
          name: "Proteobacteria",
          branchLength: 0.22,
          children: [
            { name: "E. coli", branchLength: 0.28, domain: "Bacteria" },
            { name: "Helicobacter pylori", branchLength: 0.3, domain: "Bacteria" },
          ],
        },
        {
          name: "Firmicutes",
          branchLength: 0.26,
          children: [
            { name: "Bacillus subtilis", branchLength: 0.3, domain: "Bacteria" },
            { name: "Clostridium", branchLength: 0.34, domain: "Bacteria" },
          ],
        },
        {
          name: "Actinobacteria",
          branchLength: 0.24,
          children: [
            { name: "Mycobacterium tuberculosis", branchLength: 0.36, domain: "Bacteria" },
            { name: "Streptomyces", branchLength: 0.32, domain: "Bacteria" },
          ],
        },
        { name: "Cyanobacteria", branchLength: 0.54, domain: "Bacteria" },
        { name: "Chlamydia", branchLength: 0.6, domain: "Bacteria" },
        { name: "Spirochaetes", branchLength: 0.58, domain: "Bacteria" },
      ],
    },
    {
      name: "Archaea-Eukarya",
      branchLength: 0.18,
      children: [
        {
          name: "Archaea",
          branchLength: 0.34,
          children: [
            {
              name: "Euryarchaeota",
              branchLength: 0.22,
              children: [
                { name: "Methanococcus", branchLength: 0.3, domain: "Archaea" },
                { name: "Halobacterium", branchLength: 0.34, domain: "Archaea" },
                { name: "Thermococcus", branchLength: 0.32, domain: "Archaea" },
              ],
            },
            {
              name: "Crenarchaeota",
              branchLength: 0.26,
              children: [
                { name: "Sulfolobus", branchLength: 0.3, domain: "Archaea" },
                { name: "Pyrolobus", branchLength: 0.32, domain: "Archaea" },
              ],
            },
            { name: "Nanoarchaeum", branchLength: 0.58, domain: "Archaea" },
          ],
        },
        {
          name: "Eukarya",
          branchLength: 0.3,
          children: [
            {
              name: "Excavata",
              branchLength: 0.22,
              children: [
                { name: "Giardia", branchLength: 0.4, domain: "Eukarya" },
                { name: "Trypanosoma", branchLength: 0.38, domain: "Eukarya" },
              ],
            },
            {
              name: "SAR",
              branchLength: 0.22,
              children: [
                { name: "Plasmodium", branchLength: 0.32, domain: "Eukarya" },
                { name: "Diatom", branchLength: 0.3, domain: "Eukarya" },
              ],
            },
            {
              name: "Amoebozoa",
              branchLength: 0.24,
              children: [
                { name: "Dictyostelium", branchLength: 0.32, domain: "Eukarya" },
              ],
            },
            {
              name: "Fungi",
              branchLength: 0.26,
              children: [
                { name: "Saccharomyces", branchLength: 0.3, domain: "Eukarya" },
                { name: "Neurospora", branchLength: 0.3, domain: "Eukarya" },
              ],
            },
            {
              name: "Plantae",
              branchLength: 0.28,
              children: [
                { name: "Arabidopsis", branchLength: 0.3, domain: "Eukarya" },
                { name: "Chlamydomonas", branchLength: 0.32, domain: "Eukarya" },
              ],
            },
            {
              name: "Metazoa",
              branchLength: 0.18,
              children: [
                { name: "Drosophila", branchLength: 0.24, domain: "Eukarya" },
                {
                  name: "Vertebrata",
                  branchLength: 0.12,
                  children: [
                    { name: "Danio rerio", branchLength: 0.2, domain: "Eukarya" },
                    {
                      name: "Tetrapoda",
                      branchLength: 0.08,
                      children: [
                        { name: "Mus musculus", branchLength: 0.14, domain: "Eukarya" },
                        { name: "Homo sapiens", branchLength: 0.12, domain: "Eukarya" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Colour per domain. Ink family for Eukarya, olive-green for Bacteria,
// plum-purple for Archaea — enough tonal variation to read without a legend,
// and we also differentiate leaf glyphs by shape so the chart does not rely
// on colour alone.
const DOMAIN_COLOURS: Record<Domain, string> = {
  Bacteria: "#5a7a4a",
  Archaea: "#7a5a7a",
  Eukarya: "#a0653a",
};

function countLeaves(n: RawNode): number {
  if (!n.children || n.children.length === 0) return 1;
  return n.children.reduce((a, c) => a + countLeaves(c), 0);
}

// Assign cumulative distance from root to every node by name.
function assignDistances(
  n: RawNode,
  parentDist: number,
  map: Map<string, number>,
): number {
  const d = parentDist + n.branchLength;
  map.set(n.name, d);
  if (n.children) n.children.forEach((c) => assignDistances(c, d, map));
  return d;
}

interface Props {
  width: number;
  height: number;
}

export function TreeOfLifeRadialPhylogeny({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const cx = iw / 2;
  const cy = ih / 2;

  // Outer radius leaves room for leaf labels (longest is
  // "Mycobacterium tuberculosis" at 24 chars × ~5 px).
  const outerRadius = Math.max(0, Math.min(iw, ih) / 2 - 86);

  // Cumulative distance per node.
  const distMap = useMemo(() => {
    const m = new Map<string, number>();
    assignDistances(DATA, 0, m);
    return m;
  }, []);

  const maxDist = useMemo(
    () => Math.max(...Array.from(distMap.values())),
    [distMap],
  );

  // d3-cluster in polar [angle, radius]. We use size([2π, outerRadius]) so
  // n.x is the angle and n.y is the cluster's radial position (unused for
  // phylogram — we use cumulative distance for radius instead).
  const root = useMemo(() => {
    const h = hierarchy<RawNode>(DATA);
    d3Cluster<RawNode>().size([2 * Math.PI, outerRadius])(h);
    return h;
  }, [outerRadius]);

  const allNodes = useMemo(() => root.descendants(), [root]);
  const leaves = useMemo(() => allNodes.filter((n) => !n.children), [allNodes]);
  const internals = useMemo(
    () => allNodes.filter((n) => !!n.children),
    [allNodes],
  );

  // Angle per node (cluster layout); radius = cumulative distance scaled.
  const angleFor = (name: string): number => {
    const n = allNodes.find((d) => d.data.name === name);
    return n ? (n as unknown as { x: number }).x : 0;
  };

  const radiusFor = (name: string): number => {
    const d = distMap.get(name) ?? 0;
    return maxDist > 0 ? (d / maxDist) * outerRadius : 0;
  };

  // Polar → cartesian. Angle 0 = +x axis here (d3 cluster convention).
  const cartesian = (a: number, r: number): { x: number; y: number } => ({
    x: Math.cos(a - Math.PI / 2) * r,
    y: Math.sin(a - Math.PI / 2) * r,
  });

  // Radial branch path: from a child to its parent. In a dendrogram, the
  // convention is an arc at the parent's radius spanning the child angles,
  // then a radial line from the child angle (at parent radius) outward to
  // the child (at child radius). We render the arc-then-radial per child.
  const arcRadial = (parentName: string, childName: string): string => {
    const aC = angleFor(childName);
    const aP = angleFor(parentName);
    const rP = radiusFor(parentName);
    const rC = radiusFor(childName);
    const start = cartesian(aP, rP);
    const atChildAngleAtParentR = cartesian(aC, rP);
    const end = cartesian(aC, rC);
    // Arc sweep: from aP to aC at rP.
    const sweep = aC > aP ? 1 : 0;
    const largeArc = Math.abs(aC - aP) > Math.PI ? 1 : 0;
    return [
      `M ${start.x} ${start.y}`,
      `A ${rP} ${rP} 0 ${largeArc} ${sweep} ${atChildAngleAtParentR.x} ${atChildAngleAtParentR.y}`,
      `L ${end.x} ${end.y}`,
    ].join(" ");
  };

  // Representative leaves for anchors.
  const humanNode = leaves.find((n) => n.data.name === "Homo sapiens");
  const ecoliNode = leaves.find((n) => n.data.name === "E. coli");
  const bacteriaRoot = allNodes.find((n) => n.data.name === "Bacteria");
  const archaeaRoot = allNodes.find((n) => n.data.name === "Archaea");
  const eukaryaRoot = allNodes.find((n) => n.data.name === "Eukarya");
  const arcEuSplit = allNodes.find((n) => n.data.name === "Archaea-Eukarya");

  // Clamp pin into plot bounds (remember: anchor pin coords are in the
  // outer Group's coordinate system AFTER our centre offset, so we pass
  // coordinates in centre-relative space and translate back through cx/cy).
  const clampPin = (p: { x: number; y: number }) => ({
    x: Math.max(12, Math.min(iw - 12, cx + p.x)),
    y: Math.max(12, Math.min(ih - 12, cy + p.y)),
  });

  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    return {
      x,
      y,
      width: Math.max(0, Math.min(iw - x, r.width)),
      height: Math.max(0, Math.min(ih - y, r.height)),
    };
  };

  // Helper: place a rect around a centre-relative (x, y).
  const rectAround = (pCentre: { x: number; y: number }, size: number) =>
    clampRect({
      x: cx + pCentre.x - size / 2,
      y: cy + pCentre.y - size / 2,
      width: size,
      height: size,
    });

  // Helper: a thicker annular wedge rect for domain clusters.
  const domainRect = (domainRoot: RawNode): { x: number; y: number; width: number; height: number } => {
    // Find angular span of all leaves in this subtree.
    const leafNames: string[] = [];
    const collect = (n: RawNode) => {
      if (!n.children || n.children.length === 0) leafNames.push(n.name);
      else n.children.forEach(collect);
    };
    collect(domainRoot);
    const angles = leafNames.map(angleFor);
    const minA = Math.min(...angles);
    const maxA = Math.max(...angles);
    // Sample points along the arc at mid radius to build a bounding rect.
    const midR = outerRadius * 0.72;
    const samples: Array<{ x: number; y: number }> = [];
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const a = minA + ((maxA - minA) * i) / steps;
      samples.push(cartesian(a, midR));
    }
    const xs = samples.map((s) => s.x);
    const ys = samples.map((s) => s.y);
    return clampRect({
      x: cx + Math.min(...xs) - 12,
      y: cy + Math.min(...ys) - 12,
      width: Math.max(...xs) - Math.min(...xs) + 24,
      height: Math.max(...ys) - Math.min(...ys) + 24,
    });
  };

  // Shape glyph per domain (so colour is not the only cue).
  const renderLeafGlyph = (domain: Domain, x: number, y: number) => {
    const c = DOMAIN_COLOURS[domain];
    if (domain === "Bacteria") {
      // Filled circle.
      return <circle cx={x} cy={y} r={2.6} fill={c} />;
    }
    if (domain === "Archaea") {
      // Diamond (rotated square).
      return (
        <rect
          x={x - 2.4}
          y={y - 2.4}
          width={4.8}
          height={4.8}
          transform={`rotate(45 ${x} ${y})`}
          fill={c}
        />
      );
    }
    // Eukarya — triangle.
    const s = 3;
    return (
      <path
        d={`M ${x} ${y - s} L ${x + s} ${y + s} L ${x - s} ${y + s} Z`}
        fill={c}
      />
    );
  };

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Radial phylogeny of the three domains of life"
    >
      <Group left={margin.left} top={margin.top}>
        <Group left={cx} top={cy}>
          {/* Branches (arc-then-radial) */}
          <g data-data-layer="true" fill="none">
            {internals.flatMap((n) =>
              (n.children ?? []).map((child, i) => (
                <path
                  key={`br-${n.data.name}-${i}`}
                  d={arcRadial(n.data.name, child.data.name)}
                  stroke="var(--color-ink)"
                  strokeWidth={1.1}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.9}
                />
              )),
            )}
          </g>

          {/* Internal node dots */}
          <g data-data-layer="true">
            {internals.map((n) => {
              const a = (n as unknown as { x: number }).x;
              const r = radiusFor(n.data.name);
              const p = cartesian(a, r);
              return (
                <circle
                  key={`in-${n.data.name}`}
                  cx={p.x}
                  cy={p.y}
                  r={1.6}
                  fill="var(--color-surface)"
                  stroke="var(--color-ink)"
                  strokeWidth={0.8}
                />
              );
            })}
          </g>

          {/* Leaves — glyph + label */}
          <g data-data-layer="true">
            {leaves.map((l) => {
              const a = (l as unknown as { x: number }).x;
              const r = radiusFor(l.data.name);
              const p = cartesian(a, r);
              const lblP = cartesian(a, r + 8);
              // Rotate label so it reads outward; flip on the left half.
              const deg = (a * 180) / Math.PI - 90;
              const flip = a > Math.PI;
              const rotation = flip ? deg + 180 : deg;
              const textAnchor = flip ? "end" : "start";
              const domain = (l.data.domain ?? "Eukarya") as Domain;
              return (
                <g key={`leaf-${l.data.name}`}>
                  {renderLeafGlyph(domain, p.x, p.y)}
                  <text
                    x={lblP.x}
                    y={lblP.y}
                    transform={`rotate(${rotation} ${lblP.x} ${lblP.y})`}
                    textAnchor={textAnchor}
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize={8}
                    fontStyle="italic"
                    fill="var(--color-ink-soft)"
                  >
                    {l.data.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* LUCA label at the root */}
          <g data-data-layer="true">
            <circle
              cx={0}
              cy={0}
              r={3.4}
              fill="var(--color-ink)"
            />
            <text
              x={0}
              y={-10}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fontWeight={500}
              fill="var(--color-ink)"
            >
              LUCA
            </text>
          </g>
        </Group>

        {/* ---- Anchors (coordinates in outer-Group space) ---- */}

        {/* 1. LUCA root */}
        <ExplainAnchor
          selector="luca"
          index={1}
          pin={clampPin({ x: -18, y: -22 })}
          rect={clampRect({ x: cx - 18, y: cy - 18, width: 36, height: 36 })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Bacteria domain cluster */}
        {bacteriaRoot && (() => {
          const a = (bacteriaRoot as unknown as { x: number }).x;
          const p = cartesian(a, outerRadius * 0.78);
          return (
            <ExplainAnchor
              selector="bacteria-domain"
              index={2}
              pin={clampPin({ x: p.x, y: p.y - 14 })}
              rect={domainRect(bacteriaRoot.data)}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* 3. Archaea domain cluster */}
        {archaeaRoot && (() => {
          const a = (archaeaRoot as unknown as { x: number }).x;
          const p = cartesian(a, outerRadius * 0.78);
          return (
            <ExplainAnchor
              selector="archaea-domain"
              index={3}
              pin={clampPin({ x: p.x, y: p.y - 14 })}
              rect={domainRect(archaeaRoot.data)}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* 4. Eukarya domain cluster */}
        {eukaryaRoot && (() => {
          const a = (eukaryaRoot as unknown as { x: number }).x;
          const p = cartesian(a, outerRadius * 0.78);
          return (
            <ExplainAnchor
              selector="eukarya-domain"
              index={4}
              pin={clampPin({ x: p.x, y: p.y - 14 })}
              rect={domainRect(eukaryaRoot.data)}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* 5. Deepest split (Archaea-Eukarya vs Bacteria) */}
        {arcEuSplit && (() => {
          const a = (arcEuSplit as unknown as { x: number }).x;
          const r = radiusFor("Archaea-Eukarya");
          const p = cartesian(a, r);
          return (
            <ExplainAnchor
              selector="domain-split"
              index={5}
              pin={clampPin({ x: p.x + 16, y: p.y + 16 })}
              rect={rectAround({ x: p.x, y: p.y }, 26)}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* 6. Representative leaf — Homo sapiens */}
        {humanNode && (() => {
          const a = (humanNode as unknown as { x: number }).x;
          const r = radiusFor("Homo sapiens");
          const p = cartesian(a, r);
          return (
            <ExplainAnchor
              selector="leaf-taxon"
              index={6}
              pin={clampPin({ x: p.x, y: p.y - 18 })}
              rect={rectAround({ x: p.x, y: p.y }, 20)}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* 7. Radial branch-length encoding — E. coli's radial line */}
        {ecoliNode && (() => {
          const a = (ecoliNode as unknown as { x: number }).x;
          const rLeaf = radiusFor("E. coli");
          const pMid = cartesian(a, rLeaf * 0.55);
          return (
            <ExplainAnchor
              selector="branch-length"
              index={7}
              pin={clampPin({ x: pMid.x - 16, y: pMid.y - 16 })}
              rect={rectAround({ x: pMid.x, y: pMid.y }, 28)}
            >
              <g />
            </ExplainAnchor>
          );
        })()}
      </Group>
    </svg>
  );
}
