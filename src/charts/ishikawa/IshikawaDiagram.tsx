"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Ishikawa / fishbone diagram — root-cause analysis for "Low customer NPS".
// Hand-positioned in layout space [0..100 × 0..100]; the renderer maps to
// pixels. The 6M (method, machine, material, measurement, environment,
// people) taxonomy is canonical; its job is to exhaust categories so the
// team can't fixate on the first cause that comes to mind.

interface Category {
  id: string;
  label: string;
  // Position along the spine (x in layout space) — where the bone meets the spine.
  spineX: number;
  // Above (-1) or below (+1) the spine.
  side: -1 | 1;
  // Sub-cause leaf labels (short).
  subCauses: [string, string];
}

const SPINE_X1 = 10;
const SPINE_X2 = 82; // spine terminates a touch before the problem box
const SPINE_Y = 50;
const PROBLEM_BOX = { x1: 82, y1: 43, x2: 99, y2: 57 };

// 3 above, 3 below. Spine-x positions chosen so bones don't overlap.
const CATEGORIES: ReadonlyArray<Category> = [
  {
    id: "method",
    label: "Method",
    spineX: 26,
    side: -1,
    subCauses: ["Slow onboarding", "Unclear docs"],
  },
  {
    id: "machine",
    label: "Machine",
    spineX: 48,
    side: -1,
    subCauses: ["Frequent downtime", "Slow dashboard"],
  },
  {
    id: "material",
    label: "Material",
    spineX: 70,
    side: -1,
    subCauses: ["Stale metrics", "Dirty data"],
  },
  {
    id: "measurement",
    label: "Measurement",
    spineX: 26,
    side: 1,
    subCauses: ["Vanity metrics", "Unclear SLA"],
  },
  {
    id: "environment",
    label: "Environment",
    spineX: 48,
    side: 1,
    subCauses: ["Competitor pressure", "Bad pricing"],
  },
  {
    id: "people",
    label: "People",
    spineX: 70,
    side: 1,
    subCauses: ["Understaffed support", "Training gaps"],
  },
];

// Bone geometry in layout space: each bone starts at (spineX, SPINE_Y) and
// ends at (spineX - boneRun, SPINE_Y + side*boneRise). A consistent slope
// (bones point up-and-back, toward the head end). boneRun is the horizontal
// distance from spine to bone tip.
const BONE_RUN = 12;
const BONE_RISE = 34;

interface Props {
  width: number;
  height: number;
}

export function IshikawaDiagram({ width, height }: Props) {
  const margin = { top: 16, right: 16, bottom: 16, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Layout-space to pixel mappers.
  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const spineY = py(SPINE_Y);
  const spineX1 = px(SPINE_X1);
  const spineX2 = px(SPINE_X2);

  // Problem box in pixels.
  const pbx1 = px(PROBLEM_BOX.x1);
  const pby1 = py(PROBLEM_BOX.y1);
  const pbx2 = px(PROBLEM_BOX.x2);
  const pby2 = py(PROBLEM_BOX.y2);
  const pbCx = (pbx1 + pbx2) / 2;
  const pbCy = (pby1 + pby2) / 2;

  // Bone geometry in pixels for each category.
  function boneGeom(c: Category) {
    const startX = px(c.spineX);
    const startY = spineY;
    const endX = px(c.spineX - BONE_RUN);
    const endY = py(SPINE_Y + c.side * BONE_RISE);
    return { startX, startY, endX, endY };
  }

  // Sub-cause ticks branch from the bone; we position them at two fractions
  // along the bone (0.40 and 0.72) and draw short horizontal ticks of the
  // appropriate length with a label.
  const TICK_LEN = 14; // pixels — horizontal tick off the bone
  const TICK_FRACTIONS = [0.42, 0.74] as const;

  // Compute one sub-cause's tick endpoints and label anchor.
  function tickGeom(c: Category, fraction: number) {
    const { startX, startY, endX, endY } = boneGeom(c);
    const tx = startX + (endX - startX) * fraction;
    const ty = startY + (endY - startY) * fraction;
    // Horizontal tick extending away from the spine (to the left, since
    // bones lean left-up / left-down from the spine).
    const tx2 = tx - TICK_LEN;
    return { x1: tx, y1: ty, x2: tx2, y2: ty };
  }

  // Pick a representative bone for the `category-bone` anchor and a sub-cause
  // for the `sub-cause` anchor.
  const repBone = CATEGORIES[0]; // Method — top-left bone
  const repGeom = boneGeom(repBone);
  const subGeom = tickGeom(repBone, TICK_FRACTIONS[0]);

  return (
    <svg width={width} height={height} role="img" aria-label="Ishikawa / fishbone diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Spine + bones + sub-causes (data layer) */}
        <g data-data-layer="true">
          {/* Central spine */}
          <line
            x1={spineX1}
            y1={spineY}
            x2={spineX2}
            y2={spineY}
            stroke="var(--color-ink)"
            strokeWidth={1.8}
          />
          {/* Arrowhead at the head end, pointing into the problem box */}
          <polygon
            points={`${spineX2},${spineY - 4} ${spineX2 + 8},${spineY} ${spineX2},${spineY + 4}`}
            fill="var(--color-ink)"
          />

          {/* Tail mark on the spine (left end) */}
          <line
            x1={spineX1}
            y1={spineY - 6}
            x2={spineX1}
            y2={spineY + 6}
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />

          {/* Problem box */}
          <rect
            x={pbx1}
            y={pby1}
            width={pbx2 - pbx1}
            height={pby2 - pby1}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.6}
          />
          <text
            x={pbCx}
            y={pbCy - 2}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            Low
          </text>
          <text
            x={pbCx}
            y={pbCy + 10}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            NPS
          </text>

          {/* Bones + labels + sub-causes */}
          {CATEGORIES.map((c) => {
            const { startX, startY, endX, endY } = boneGeom(c);
            // Category label sits just past the bone tip.
            const labelX = endX - 4;
            const labelY = endY + (c.side === -1 ? -2 : 10);
            return (
              <g key={`bone-${c.id}`}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="var(--color-ink)"
                  strokeWidth={1.4}
                />
                {/* Category-label box at tip */}
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="end"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fontWeight={600}
                  fill="var(--color-ink)"
                >
                  {c.label}
                </text>
                {/* Sub-cause ticks */}
                {TICK_FRACTIONS.map((fr, i) => {
                  const t = tickGeom(c, fr);
                  const sub = c.subCauses[i];
                  return (
                    <g key={`sub-${c.id}-${i}`}>
                      <line
                        x1={t.x1}
                        y1={t.y1}
                        x2={t.x2}
                        y2={t.y2}
                        stroke="var(--color-ink-mute)"
                        strokeWidth={1}
                      />
                      <text
                        x={t.x2 - 3}
                        y={t.y2 + 3}
                        textAnchor="end"
                        fontFamily="var(--font-mono)"
                        fontSize={9}
                        fill="var(--color-ink-soft)"
                      >
                        {sub}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>

        {/* Anchors */}

        {/* 1. spine (horizontal central line) */}
        <ExplainAnchor
          selector="spine"
          index={1}
          pin={{ x: (spineX1 + spineX2) / 2, y: spineY - 16 }}
          rect={{
            x: Math.max(0, spineX1 - 4),
            y: Math.max(0, spineY - 6),
            width: Math.min(iw - (spineX1 - 4), spineX2 - spineX1 + 16),
            height: 12,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. problem (right-tip box) */}
        <ExplainAnchor
          selector="problem"
          index={2}
          pin={{ x: pbCx, y: Math.max(12, pby1 - 10) }}
          rect={{
            x: Math.max(0, pbx1),
            y: Math.max(0, pby1),
            width: Math.min(iw - pbx1, pbx2 - pbx1),
            height: Math.min(ih - pby1, pby2 - pby1),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. category-bone (one of the six diagonal bones — Method, top-left) */}
        <ExplainAnchor
          selector="category-bone"
          index={3}
          pin={{ x: (repGeom.startX + repGeom.endX) / 2 + 8, y: (repGeom.startY + repGeom.endY) / 2 - 8 }}
          rect={{
            x: Math.max(0, Math.min(repGeom.startX, repGeom.endX) - 4),
            y: Math.max(0, Math.min(repGeom.startY, repGeom.endY) - 4),
            width: Math.min(iw, Math.abs(repGeom.endX - repGeom.startX) + 8),
            height: Math.min(ih, Math.abs(repGeom.endY - repGeom.startY) + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. sub-cause (leaf branch off the Method bone) */}
        <ExplainAnchor
          selector="sub-cause"
          index={4}
          pin={{ x: subGeom.x2 - 12, y: subGeom.y2 - 12 }}
          rect={{
            x: Math.max(0, subGeom.x2 - 4),
            y: Math.max(0, subGeom.y2 - 6),
            width: Math.min(iw - (subGeom.x2 - 4), TICK_LEN + 8),
            height: 12,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. symmetry (3 above + 3 below) — hit zone spans the full diagram vertically */}
        <ExplainAnchor
          selector="symmetry"
          index={5}
          pin={{ x: px(48), y: Math.max(10, py(8)) }}
          rect={{
            x: Math.max(0, px(38)),
            y: 0,
            width: Math.min(iw - px(38), px(24)),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. 6M-categories (taxonomy anchor — hover any bone tip region) */}
        <ExplainAnchor
          selector="6m-categories"
          index={6}
          pin={{ x: Math.min(iw - 12, px(78)), y: Math.min(ih - 12, py(90)) }}
          rect={{
            x: 0,
            y: Math.max(0, py(78)),
            width: Math.min(iw, px(88)),
            height: Math.min(ih - py(78), py(22)),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
