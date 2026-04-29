"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { hierarchy, cluster as d3Cluster } from "d3-hierarchy";
import { scaleLinear } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Ultrametric bird phylogram. ~8 living taxa from Palaeognathae (ratites +
// tinamous) and Neognathae (galloanserae). Branch lengths encode time to
// divergence in millions of years ago (Mya). All leaves align at the present
// (x = 0 Mya on the right edge) — this is the ultrametric sub-variant, the
// time-calibrated form used in BEAST (Drummond & Rambaut 2007) and TimeTree
// (Hedges et al. 2015). Numeric ages are illustrative, in the range reported
// by Jarvis et al. 2014 (Science) and Prum et al. 2015 (Nature).
//
// Topology (parenthetic Newick-ish):
//   ((Tinamou, (Ostrich, (Emu, Kiwi))),
//    ((Chicken, Turkey), (Duck, Goose)))
//
// Divergence depths (Mya from present):
//   root (Palaeognathae/Neognathae split): 85 Mya
//   Palaeognathae crown (Tinamou vs ratites): 70 Mya
//   Ratite crown (Ostrich vs Emu+Kiwi): 60 Mya
//   Emu+Kiwi: 50 Mya
//   Neognathae crown (Galliformes vs Anseriformes): 35 Mya
//   Chicken+Turkey: 35 Mya  (shown here; true crown ~30 Mya)
//   Duck+Goose: 20 Mya

interface RawNode {
  name: string;
  age: number; // Mya from the present
  children?: RawNode[];
}

const DATA: RawNode = {
  name: "root",
  age: 85,
  children: [
    {
      name: "palaeognathae",
      age: 70,
      children: [
        { name: "Tinamou", age: 0 },
        {
          name: "ratites",
          age: 60,
          children: [
            { name: "Ostrich", age: 0 },
            {
              name: "emu-kiwi",
              age: 50,
              children: [
                { name: "Emu", age: 0 },
                { name: "Kiwi", age: 0 },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "neognathae",
      age: 35,
      children: [
        {
          name: "galliformes",
          age: 35,
          children: [
            { name: "Chicken", age: 0 },
            { name: "Turkey", age: 0 },
          ],
        },
        {
          name: "anseriformes",
          age: 20,
          children: [
            { name: "Duck", age: 0 },
            { name: "Goose", age: 0 },
          ],
        },
      ],
    },
  ],
};

interface Props {
  width: number;
  height: number;
}

export function Phylogram({ width, height }: Props) {
  const margin = { top: 20, right: 90, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Time axis: 85 Mya on the LEFT (root), 0 Mya on the RIGHT (present).
  // Invert the usual scale so that time flows left→right toward today.
  const xScale = useMemo(
    () => scaleLinear({ domain: [85, 0], range: [0, iw] }),
    [iw],
  );

  // d3-cluster for vertical leaf placement only; we override x using xScale(age).
  const root = useMemo(() => {
    const h = hierarchy<RawNode>(DATA);
    d3Cluster<RawNode>().size([ih, 1])(h);
    return h;
  }, [ih]);

  const allNodes = useMemo(() => root.descendants(), [root]);
  const leaves = useMemo(() => allNodes.filter((n) => !n.children), [allNodes]);
  const internals = useMemo(
    () => allNodes.filter((n) => !!n.children),
    [allNodes],
  );

  // y-position map from d3.cluster (stored in n.x).
  const yOf = useMemo(() => {
    const m = new Map<string, number>();
    allNodes.forEach((n) => {
      m.set(n.data.name, (n as unknown as { x: number }).x);
    });
    return m;
  }, [allNodes]);

  // x pixel position from age.
  const xOf = (name: string): number => {
    const node = allNodes.find((n) => n.data.name === name);
    return node ? xScale(node.data.age) : 0;
  };
  const y = (name: string): number => yOf.get(name) ?? 0;

  // Orthogonal branch path: horizontal from child to parent's x, vertical to parent's y.
  const branchPath = (parentName: string, childName: string) => {
    const x1 = xOf(parentName);
    const y1 = y(parentName);
    const x2 = xOf(childName);
    const y2 = y(childName);
    return `M ${x2} ${y2} H ${x1} V ${y1}`;
  };

  // Clamp rect to plot area.
  const clamp = (r: { x: number; y: number; width: number; height: number }) => {
    const x_ = Math.max(0, Math.min(iw, r.x));
    const y_ = Math.max(0, Math.min(ih, r.y));
    return {
      x: x_,
      y: y_,
      width: Math.max(0, Math.min(iw - x_, r.width)),
      height: Math.max(0, Math.min(ih - y_, r.height)),
    };
  };

  // Pre-compute anchor coordinates.
  const rootX = xOf("root");
  const rootY = y("root");
  const palaeoX = xOf("palaeognathae");
  const palaeoY = y("palaeognathae");
  const neognathaeX = xOf("neognathae");
  const neognathaeY = y("neognathae");
  const emuKiwiX = xOf("emu-kiwi");
  const emuKiwiY = y("emu-kiwi");
  const kiwiX = xOf("Kiwi");
  const kiwiY = y("Kiwi");
  const emuX = xOf("Emu");
  const emuY = y("Emu");
  const duckX = xOf("Duck");
  const duckY = y("Duck");
  const gooseX = xOf("Goose");
  const gooseY = y("Goose");
  const anserX = xOf("anseriformes");
  const anserY = y("anseriformes");

  // Branch-length label for the Emu→Kiwi split (most instructive: short branch).
  const emuKiwiBranchMidX = (emuKiwiX + kiwiX) / 2;

  // Scale-bar geometry: 20-Mya span in the bottom-right corner, inside plot.
  const scaleBarLengthPx = Math.abs(xScale(0) - xScale(20)); // 20 Mya in pixels
  const scaleBarY = ih - 10;
  const scaleBarX2 = iw - 4;
  const scaleBarX1 = scaleBarX2 - scaleBarLengthPx;

  // Tick positions for the time axis.
  const tickValues = [0, 20, 50, 85];

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Ultrametric phylogram: time-calibrated bird tree with branch lengths in millions of years"
    >
      <Group left={margin.left} top={margin.top}>
        {/* -- Branch connectors -- */}
        <g data-data-layer="true">
          {internals.flatMap((n) =>
            (n.children ?? []).map((child, i) => (
              <path
                key={`branch-${n.data.name}-${i}`}
                d={branchPath(n.data.name, child.data.name)}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={1.4}
                strokeLinecap="square"
              />
            )),
          )}
        </g>

        {/* -- Branch-length annotation on the Emu-Kiwi split -- */}
        <g data-data-layer="true">
          <text
            x={emuKiwiBranchMidX}
            y={kiwiY - 5}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            50 Mya
          </text>
        </g>

        {/* -- Leaf labels -- */}
        <g data-data-layer="true">
          {leaves.map((l) => (
            <g key={`leaf-${l.data.name}`}>
              <circle
                cx={xOf(l.data.name)}
                cy={y(l.data.name)}
                r={2.5}
                fill="var(--color-ink)"
              />
              <text
                x={xOf(l.data.name) + 6}
                y={y(l.data.name)}
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fontStyle="italic"
                fill="var(--color-ink-soft)"
              >
                {l.data.name}
              </text>
            </g>
          ))}
        </g>

        {/* -- Internal node dots -- */}
        <g data-data-layer="true">
          {internals.map((n) => (
            <circle
              key={`inode-${n.data.name}`}
              cx={xOf(n.data.name)}
              cy={y(n.data.name)}
              r={2}
              fill="var(--color-surface)"
              stroke="var(--color-ink)"
              strokeWidth={1}
            />
          ))}
        </g>

        {/* -- Time axis -- */}
        <g data-data-layer="true">
          <AxisBottom
            top={ih}
            scale={xScale}
            tickValues={tickValues}
            tickFormat={(v) => String(v)}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fill: "var(--color-ink-soft)",
              textAnchor: "middle",
              dy: "0.33em",
            })}
          />
          <text
            x={iw / 2}
            y={ih + 34}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            TIME (Mya)
          </text>
        </g>

        {/* -- Scale bar (20 Mya in the lower-right) -- */}
        <g data-data-layer="true">
          <line
            x1={scaleBarX1}
            y1={scaleBarY}
            x2={scaleBarX2}
            y2={scaleBarY}
            stroke="var(--color-ink)"
            strokeWidth={1.5}
          />
          {/* Endcaps */}
          <line
            x1={scaleBarX1}
            y1={scaleBarY - 3}
            x2={scaleBarX1}
            y2={scaleBarY + 3}
            stroke="var(--color-ink)"
            strokeWidth={1.5}
          />
          <line
            x1={scaleBarX2}
            y1={scaleBarY - 3}
            x2={scaleBarX2}
            y2={scaleBarY + 3}
            stroke="var(--color-ink)"
            strokeWidth={1.5}
          />
          <text
            x={(scaleBarX1 + scaleBarX2) / 2}
            y={scaleBarY - 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            20 Mya
          </text>
        </g>

        {/* ---- Anchors ---- */}

        {/* 1. Root — deepest divergence (85 Mya) */}
        <ExplainAnchor
          selector="root"
          index={1}
          pin={{ x: rootX + 14, y: rootY - 14 }}
          rect={clamp({ x: rootX - 6, y: rootY - 8, width: 16, height: 16 })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Internal node (speciation event) — Neognathae crown */}
        <ExplainAnchor
          selector="internal-node"
          index={2}
          pin={{ x: neognathaeX + 12, y: neognathaeY - 14 }}
          rect={clamp({ x: neognathaeX - 6, y: neognathaeY - 8, width: 16, height: 16 })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Leaf (extant taxon) — Ostrich */}
        <ExplainAnchor
          selector="leaf"
          index={3}
          pin={{ x: xOf("Ostrich") + 14, y: y("Ostrich") - 16 }}
          rect={clamp({
            x: xOf("Ostrich") - 4,
            y: y("Ostrich") - 8,
            width: 60,
            height: 16,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Branch-length encoding — Emu+Kiwi split (labelled 50 Mya) */}
        <ExplainAnchor
          selector="branch-length"
          index={4}
          pin={{ x: emuKiwiBranchMidX, y: kiwiY + 18 }}
          rect={clamp({
            x: Math.min(emuKiwiX, kiwiX) - 2,
            y: Math.min(emuY, kiwiY) - 4,
            width: Math.abs(kiwiX - emuKiwiX) + 4,
            height: Math.abs(kiwiY - emuY) + 8,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Time axis — the x-scale that makes this a phylogram, not a cladogram */}
        <ExplainAnchor
          selector="time-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 24 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Ultrametric alignment — all leaves at x = 0 Mya (right edge) */}
        <ExplainAnchor
          selector="ultrametric-alignment"
          index={6}
          pin={{ x: iw - 6, y: -8 }}
          rect={clamp({
            x: iw - 8,
            y: 0,
            width: 12,
            height: ih - 14,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Scale bar — 20-Mya reference span */}
        <ExplainAnchor
          selector="scale-bar"
          index={7}
          pin={{ x: (scaleBarX1 + scaleBarX2) / 2, y: scaleBarY + 16 }}
          rect={clamp({
            x: scaleBarX1 - 4,
            y: scaleBarY - 12,
            width: scaleBarX2 - scaleBarX1 + 8,
            height: 20,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
