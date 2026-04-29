import type { LiveChart } from "@/content/chart-schema";

export const umlDeploymentDiagram: LiveChart = {
  id: "uml-deployment-diagram",
  name: "UML Deployment Diagram",
  family: "specialty",
  sectors: ["software"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Three-dimensional boxes for execution environments, nested artifacts for what runs inside, labelled communication paths for the wires between.",
  whenToUse:
    "Reach for a deployment diagram when the question is physical — which host runs which binary, and which network link connects them. Class and component diagrams describe code; the deployment diagram is the only UML view that answers 'where does this actually run?'. Use it for architecture reviews, capacity planning, and the wall of a war room during an incident; skip it for pure-logic work where the runtime topology is irrelevant.",
  howToRead:
    "Each three-dimensional box is a node — a physical device, a virtual machine, or an execution environment such as a JVM or a container runtime. The stereotype in guillemets tells you which: «device» for raw hardware or a user's browser, «executionEnvironment» for a managed host that itself runs artifacts. Rectangles nested inside a node are artifacts — the deployable files: WARs, JARs, scripts, HTML. Solid straight lines between nodes are communication paths; they carry no arrowheads because the link is symmetric, and their label (in guillemets, optionally with a port) names the protocol. A «deployment specification» can hang off any artifact to attach configuration.",
  example: {
    title: "Three-tier cloud web application: browser / app server / database",
    description:
      "The OMG consolidated deployment diagrams into UML 2.0 (2005), and the notation predates cloud-native by a decade — it was drawn on whiteboards to plan 1990s client-server rollouts. The canonical three-tier example maps cleanly onto AWS: a client browser «device» holds index.html and app.js, an «executionEnvironment» Application Server (EC2 t3.large) hosts app.war and auth.jar, and a Database Server «executionEnvironment» (RDS PostgreSQL) hosts schema.sql. The links are labelled «HTTPS» on port 443 between browser and app, «JDBC» on port 5432 between app and database. A microservice redraw of the same architecture replaces the EC2 instance with a Kubernetes node running pods, but the notation survives — the question the deployment diagram frames, which execution environment hosts which artifact, is unchanged.",
  },
  elements: [
    {
      selector: "node-3d-box",
      label: "3D-box node",
      explanation:
        "A three-dimensional rectangle is a node — a runtime container for artifacts. UML 1.x drew nodes as full isometric cubes; UML 2.0 relaxed the notation to any rendering that reads as a box with depth, and most modelling tools settle on a front face plus a small up-and-right offset for the back face, with three lines marking the visible edges. The 3D shape is not decoration — it is the single glyph that distinguishes runtime infrastructure from the code-level rectangles in a class or component diagram.",
    },
    {
      selector: "stereotype",
      label: "Node stereotype",
      explanation:
        "Guillemet labels such as «device» and «executionEnvironment» classify the node. A «device» is a physical or virtual host — a user's laptop, a phone, an EC2 instance treated as hardware. An «executionEnvironment» is a managed runtime that itself hosts artifacts: a JVM, a .NET runtime, a container engine, a cloud-managed service. UML allows «executionEnvironment» to nest inside a «device» — a JVM running on a server — and teams who skip the stereotype distinction end up hand-waving the difference between 'the VM' and 'the process running on the VM'.",
    },
    {
      selector: "artifact",
      label: "Artifact",
      explanation:
        "A rectangle nested inside a node, labelled with a filename and optionally a folded-corner page icon, is an artifact — a concrete deployable. UML defines an artifact as 'a physical piece of information used or produced by a software development process' — source files, binaries, scripts, configuration. The artifact is distinct from the component it realises: a component is a logical unit of functionality, an artifact is the file that actually gets copied onto the node.",
    },
    {
      selector: "containment",
      label: "Containment",
      explanation:
        "An artifact drawn inside a node's front face means the node hosts that artifact at runtime — the same spatial convention as Euler and Venn diagrams. A WAR file nested inside an «executionEnvironment» says the application server is the runtime that loads it. A «deployment specification», drawn as another artifact with the stereotype «deployment spec», is the UML-compliant way to attach environment-specific configuration to the hosted artifact.",
    },
    {
      selector: "communication-path",
      label: "Communication path",
      explanation:
        "A solid straight line between two nodes is a communication path — the wire the protocol runs over. No arrowheads: the link is symmetric by definition, because real-world protocols have both ends talking. A line with an arrowhead in a deployment diagram is almost always a notation error; if you need to show direction, use a sequence diagram instead.",
    },
    {
      selector: "protocol-label",
      label: "Protocol label",
      explanation:
        "The label on a communication path names the protocol, conventionally in guillemets — «HTTPS», «JDBC», «gRPC», «AMQP» — and optionally a port number. The label is the only thing that tells a reviewer whether two boxes are talking over a TLS channel or an unencrypted TCP socket, and it is the first detail dropped when a team treats the deployment diagram as decorative.",
    },
    {
      selector: "artifact-name",
      label: "Artifact name",
      explanation:
        "The filename on an artifact rectangle is the deployable's identity. Naming conventions carry surprisingly load-bearing information: app.war is a Java Enterprise application archive, schema.sql is a database migration, index.html is the browser's entry point. A deployment diagram that labels its artifacts 'binary' or 'service' has erased the one detail that would let an operator actually locate the file on disk.",
    },
  ],
};
