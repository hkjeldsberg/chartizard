import type { LiveChart } from "@/content/chart-schema";

export const controlFlowGraph: LiveChart = {
  id: "control-flow-graph",
  name: "Control Flow Graph (CFG)",
  family: "flow",
  sectors: ["software"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Renders a program as basic blocks joined by directed edges — the internal representation every optimising compiler uses.",
  whenToUse:
    "Use a CFG to reason about branching and looping inside a single procedure: dominator analysis, dead-code elimination, loop identification, SSA construction all operate on this graph. Reach for it when the question is which statements can reach which, not what data they produce — for the data view, draw a DFD on the same page.",
  howToRead:
    "Each rectangle is a basic block — a straight-line run of statements with one entry and one exit, shown here as the first statement, an ellipsis, and the last. Diamonds are conditionals; their outgoing edges carry T (true) and F (false) labels. An arrow that returns to an earlier node is a back-edge — the CFG's signature for a loop. McCabe's cyclomatic complexity M = E − N + 2 (edges minus nodes, plus two) reads straight off the graph: count the arrows, count the boxes, and the loop-and-branch budget of the procedure is yours.",
  example: {
    title: "A loop with an error branch, M = 3",
    description:
      "Nine edges, eight nodes, so McCabe's metric comes out to 3 — one path each for 'loop exit', 'loop body succeeds', and 'loop body fails'. Frances Allen introduced the CFG in her 1970 paper 'Control Flow Analysis' (Proc. ACM Symposium on Compiler Optimization); she won the 2006 Turing Award, the first woman to do so. Every optimising compiler built since lowers source into something shaped like this picture before touching it.",
  },
  elements: [
    {
      selector: "entry-node",
      label: "Entry node",
      explanation:
        "The single point where control arrives into the procedure. A well-formed CFG has exactly one entry; multiple entries usually mean the graph was built from a subset of a larger function.",
    },
    {
      selector: "basic-block",
      label: "Basic block",
      explanation:
        "A maximal run of straight-line code with one entry and one exit — no branches in, no branches out except at the end. We abbreviate by showing the first statement, an ellipsis, and the last. Optimisations operate on whole blocks because nothing inside a block can be re-ordered without changing semantics.",
    },
    {
      selector: "conditional",
      label: "Conditional (diamond)",
      explanation:
        "A two-way branch whose outgoing edges split control flow on a predicate. Conditionals are the only way a CFG grows paths — a procedure with N conditionals has up to 2^N distinct paths, which is why static analysers cache dominance and post-dominance information instead of enumerating paths.",
    },
    {
      selector: "tf-label",
      label: "T / F edge label",
      explanation:
        "Every conditional's two outgoing edges carry T (taken when the predicate is true) and F (taken when false). Labelling matters: reversing T and F inverts the loop, and a silent swap is a common source of miscompiles during hand-refactoring.",
    },
    {
      selector: "back-edge",
      label: "Back-edge (loop)",
      explanation:
        "A directed edge that returns to a node dominating its source — the CFG's definition of a loop. The back-edge is routed around the forward flow so it doesn't cross any progress arrow. Identifying back-edges is the first step of every loop-detection algorithm from Allen-Cocke (1972) onward.",
    },
    {
      selector: "exit-node",
      label: "Exit node",
      explanation:
        "Where control leaves the procedure. Real CFGs can have several physical exits (early returns, exceptions), but analysis usually adds a synthetic unique exit so the reverse CFG is also single-entry.",
    },
    {
      selector: "cyclomatic-complexity",
      label: "Cyclomatic complexity",
      explanation:
        "McCabe's 1976 metric M = E − N + 2 for a connected CFG. It counts the number of linearly independent paths through the procedure — in practice, the minimum number of test cases needed for branch coverage. A CFG with nine edges and eight nodes has M = 3: three paths, three tests.",
    },
  ],
};
