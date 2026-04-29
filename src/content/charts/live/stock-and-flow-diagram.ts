import type { LiveChart } from "@/content/chart-schema";

export const stockAndFlowDiagram: LiveChart = {
  id: "stock-and-flow-diagram",
  name: "Stock-and-Flow Diagram",
  family: "flow",
  sectors: ["decision-analysis"],
  dataShapes: ["network"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Jay Forrester's quantitative systems-dynamics notation — rectangles are stocks that integrate over time, pipe-and-valve glyphs are flows that change them, small circles are auxiliaries that carry information.",

  whenToUse:
    "Use a stock-and-flow diagram when a causal loop diagram has done its work and you are ready to simulate. Every symbol maps one-to-one to a variable in a system of ordinary differential equations: stocks become state variables, flows become their derivatives, auxiliaries become algebraic expressions. If the goal is merely to describe feedback structure, the companion causal-loop-diagram is lighter; if the goal is to compute a trajectory, this is the notation the simulator expects.",

  howToRead:
    "Read the chain left to right as conservation of mass: stuff arrives through inflows, accumulates in the stock, and departs through outflows. The stock rectangle is the integrator — its value at time t is the initial value plus the time-integral of (inflows − outflows). The pipe-and-valve glyph is the flow rate: the two parallel lines are the pipe, the butterfly at the centre is the valve that opens or closes to set the rate. Clouds are the model boundary — where the substance comes from and goes to without further accounting. Small circles are auxiliaries: they carry information (no delay, no accumulation) into the valves, and the thin curved arrow from an auxiliary to a valve is called an information link, to distinguish it from the thick physical flow in the pipe. A curved arrow from a stock back to a valve is feedback — how the stock's current level influences its own rates of change.",

  example: {
    title: "Jay Forrester, Industrial Dynamics (MIT Press, 1961)",
    description:
      "Stock-and-flow diagrams were introduced by Jay Forrester at MIT in Industrial Dynamics (1961), the founding text of system dynamics. The notation was picked up by Dennis Meadows and colleagues for the World3 model behind The Limits to Growth (1972), and then encoded in software: STELLA by Barry Richmond and isee systems (1985, the first consumer systems-dynamics package), Vensim by Ventana Systems, and AnyLogic. The canonical teaching example is the population model shown here — a single Population stock filled by a Birth rate flow (itself governed by a Birth fraction auxiliary and the current Population, a feedback link) and drained by a Death rate flow (governed by a Life expectancy auxiliary). The diagram IS the equation system: dPopulation/dt = Birth rate − Death rate, Birth rate = Birth fraction × Population, Death rate = Population / Life expectancy. A simulator reads this off the topology directly, with no additional specification.",
  },

  elements: [
    {
      selector: "stock",
      label: "Stock (rectangle)",
      explanation:
        "The rectangle is a stock — a quantity that accumulates: population, inventory, reservoir volume, cash balance. Formally it is the integral over time of its net inflow: Stock(t) = Stock(0) + ∫(inflow − outflow) dt. A stock has memory; it persists when all flows are zero. The test for whether something is a stock is whether it would still exist if time stopped: a bathtub's water level is a stock, the faucet's flow rate is not.",
    },
    {
      selector: "flow",
      label: "Flow (pipe and valve)",
      explanation:
        "The two parallel lines are the pipe; the butterfly-shaped symbol in the middle is the valve — together they denote a flow, the rate at which stuff moves into or out of a stock. The valve carries a variable name (here, 'Birth rate'), and its value is set by the auxiliaries and stocks connected to it by information links. The glyph is deliberately a physical metaphor — the pipe carries conserved quantity, the valve is the regulator — to distinguish flow from information in the same diagram.",
    },
    {
      selector: "source-cloud",
      label: "Source cloud",
      explanation:
        "The cloud on the left marks the model boundary on the inflow side — a source from which the substance is drawn without further accounting. Using a cloud is an explicit modelling choice: the analyst is declaring that the supply is effectively infinite at the timescale of interest, or at least that modelling it would add no insight. For the population model, the source is the unborn; pushing the boundary further would mean modelling reproductive biology.",
    },
    {
      selector: "auxiliary",
      label: "Auxiliary (circle)",
      explanation:
        "A small circle denotes an auxiliary variable — typically a parameter or an algebraic function of other variables, carrying information with no delay or accumulation. Birth fraction, Life expectancy, interest rates, conversion ratios all live here. Auxiliaries are the dials of the model: the values a practitioner sweeps to ask 'what if'. They never hold stuff; only stocks do.",
    },
    {
      selector: "info-link",
      label: "Information link",
      explanation:
        "The thin curved arrow — often drawn dashed — is an information link, not a flow. It tells the valve what rate to take by referencing an auxiliary or a stock. The distinction between information links (thin, curved, from circles and rectangles to valves) and physical flows (the thick pipe-and-valve glyph) is the notation's main grammatical rule: information moves instantly and is not conserved, matter moves through pipes and is conserved.",
    },
    {
      selector: "feedback",
      label: "Feedback link (Stock → Flow)",
      explanation:
        "An information link from a stock back to one of its own flow rates is feedback — the mechanism that makes the system dynamic. Here Population feeds back into Birth rate: more people produce more births per unit time. This is the same reinforcing loop visible in the qualitative causal-loop-diagram, but now with a concrete functional form (Birth rate = Birth fraction × Population) that the simulator can evaluate. Feedback from a stock is what takes a stock-and-flow model beyond simple input-output.",
    },
    {
      selector: "sink-cloud",
      label: "Sink cloud",
      explanation:
        "The cloud on the right marks the model boundary on the outflow side — where matter exits the accounting. For the population model, the sink is the dead, and whatever happens after death is out of scope. The pair of clouds (source and sink) makes the boundary explicit: everything between them is modelled, everything outside is assumed.",
    },
  ],
};
