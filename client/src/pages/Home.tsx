import { useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  Banknote,
  BadgeCheck,
  Box,
  BrainCircuit,
  Check,
  ChevronDown,
  CircleDot,
  Database,
  Factory,
  FileCheck2,
  Fingerprint,
  Gauge,
  GitBranch,
  Hand,
  Layers3,
  LockKeyhole,
  Mail,
  Maximize2,
  Minimize2,
  Network,
  Pause,
  Play,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Workflow,
  Zap,
} from "lucide-react";

const ASSETS = {
  euroma: "/manus-storage/euroma-logo_e0add910.jpg",
  cpl: "/manus-storage/cpl-aromas-purple-square_89f03cc9.jpg",
  symrise: "/manus-storage/symrise-logo_e03531b2.jpg",
  levis: "/manus-storage/levi-strauss-logo_32a09afd.jpg",
  cognizant: "/manus-storage/cognizant-logo_b2f03f0b.png",
  ntt: "/manus-storage/ntt-data-logo_51231f78.png",
};

type SectionId = "intro" | "tech" | "b2c" | "o2c" | "impact" | "next";
type StepKind = "agent" | "human" | "decision";
type ExecutiveLens = "ceo" | "cfo";

type ProcessStep = {
  title: string;
  copy: string;
  kind: StepKind;
  tags?: string[];
  systems?: string[];
  branches?: { label: string; copy: string }[];
};

type Outcome = {
  value: string;
  label: string;
  copy: string;
};

type LensMessage = {
  eyebrow: string;
  headline: string;
  copy: string;
  signals: string[];
};

type TwinEvent = {
  title: string;
  system: string;
  copy: string;
  customer: string;
  minutes: number;
  exception?: boolean;
  human?: boolean;
};

const navItems: { id: SectionId; label: string; kicker: string }[] = [
  { id: "intro", label: "Alfred", kicker: "01" },
  { id: "tech", label: "Technology", kicker: "02" },
  { id: "b2c", label: "Brief → contract", kicker: "03" },
  { id: "o2c", label: "Order → cash", kicker: "04" },
  { id: "impact", label: "Impact", kicker: "05" },
  { id: "next", label: "Next", kicker: "06" },
];

const ventures = [
  {
    name: "Olfyne",
    meta: "Creative intelligence",
    copy: "Generative and agentic AI inside the perfumer’s creative process.",
    icon: Sparkles,
  },
  {
    name: "CortiSleeve",
    meta: "Human intent layer",
    copy: "Patent-pending middleware that keeps human intent inside autonomous agent loops.",
    icon: Fingerprint,
  },
  {
    name: "Genesis",
    meta: "Product engineering",
    copy: "Full-stack PLM engineering for industry-specific AI products.",
    icon: Layers3,
  },
];

const career = [
  {
    name: "CPL Aromas",
    role: "CIO & Global Operating Board Member",
    years: "2017 — present",
    logo: ASSETS.cpl,
    copy: "Own enterprise AI and technology strategy across 18+ countries. Built production systems for perfumery, formulation, regulatory work and predictive stability; deployed Copilot and Azure AI Foundry; created custom agents in Copilot Studio; established a Microsoft Fabric data lake; and moved the estate away from fully on-premise infrastructure.",
  },
  {
    name: "Symrise",
    role: "Global Head of Digitalization & IT Director",
    years: "2012 — 2017",
    logo: ASSETS.symrise,
    copy: "Led global innovation, IoT and big-data programmes across regions, reporting to the Global CIO and Flavor Division President. Built an early AI bot for perfume creation before applied AI became standard industry language.",
  },
  {
    name: "Levi Strauss & Co.",
    role: "Enterprise systems & consulting leadership",
    years: "2010 — 2012",
    logo: ASSETS.levis,
    copy: "A 12-year foundation in SAP, ERP and global transformation delivery across Singapore, San Francisco, France and India, progressing from hands-on consulting into programme and practice leadership.",
  },
  {
    name: "Cognizant",
    role: "Enterprise systems & consulting leadership",
    years: "2008 — 2010",
    logo: ASSETS.cognizant,
    copy: "Multi-country enterprise delivery and architecture discipline across global clients, with a focus on systems that had to work in the real operating environment.",
  },
  {
    name: "Caritor / NTT DATA",
    role: "Enterprise technology delivery",
    years: "2002 — 2007",
    logo: ASSETS.ntt,
    copy: "The early consulting chapter: enterprise systems, regional delivery and the operational discipline that still underpins every agent programme today.",
  },
];

const technology = [
  {
    number: "01",
    title: "Human & governance",
    tools: "Responsible AI · human-in-the-loop",
    icon: UserCheck,
    copy: "Named checkpoints define what an agent may decide and exactly where it must stop. Governance is designed into the flow before a model is connected.",
  },
  {
    number: "02",
    title: "Agent orchestration",
    tools: "LangChain · scoped multi-agent work",
    icon: Workflow,
    copy: "Feasibility, library matching, OCR reconciliation, mini-MRP and production sequencing are separate, bounded jobs. Each one can branch, escalate or wait for a person.",
  },
  {
    number: "03",
    title: "Enterprise AI platform",
    tools: "Azure AI Foundry · Copilot Studio",
    icon: BrainCircuit,
    copy: "A reusable AI platform replaces one-off experiments. New agents inherit the same controls, integration patterns and operating model.",
  },
  {
    number: "04",
    title: "Automation & documents",
    tools: "UiPath RPA · AI OCR",
    icon: ScanLine,
    copy: "OCR reads purchase orders from email or WhatsApp. RPA handles the mechanical system work while agents make bounded decisions.",
  },
  {
    number: "05",
    title: "Governed data foundation",
    tools: "Microsoft Fabric",
    icon: Database,
    copy: "Every agent reads and writes through a governed source of truth. Operational intelligence and reporting sit on the same data foundation.",
  },
  {
    number: "06",
    title: "Security & sovereignty",
    tools: "NIST-aligned SOC · residency controls",
    icon: LockKeyhole,
    copy: "Security architecture, residency and sovereignty are explicit deployment workstreams, not issues deferred until launch.",
  },
];

const briefToContract: ProcessStep[] = [
  {
    title: "Brief / enquiry arrives",
    copy: "The customer brief or enquiry arrives and enters the automated workflow.",
    kind: "agent",
    tags: ["Brief", "Enquiry"],
    systems: ["Microsoft Copilot Studio · Brief Intake Agent", "LangChain · B2C orchestration", "Microsoft Fabric · governed brief context"],
  },
  {
    title: "CRM updated by agent",
    copy: "The agent structures the brief and updates the CRM against the correct customer, contact and opportunity.",
    kind: "agent",
    tags: ["CRM", "No re-keying"],
    systems: ["Microsoft Copilot Studio · CRM Update Agent", "UiPath RPA · CRM write-back", "Microsoft Fabric · account and contact context"],
  },
  {
    title: "Sender acknowledged",
    copy: "An acknowledgement email is sent immediately so the sender knows the request has entered the process.",
    kind: "agent",
    tags: ["Automated email"],
    systems: ["Microsoft Copilot Studio · Acknowledgement Agent", "UiPath RPA · outbound email"],
  },
  {
    title: "Feasibility calculated",
    copy: "The feasibility calculator agent checks whether the request can be delivered and emails the internal team with a feasible or decline recommendation.",
    kind: "decision",
    tags: ["Feasibility agent", "Internal email", "Feasible / decline"],
    systems: ["Microsoft Copilot Studio · Feasibility Calculator Agent", "Azure AI Foundry · enterprise AI runtime", "Microsoft Fabric · rules and operational data", "LangChain · feasible / decline branch"],
  },
  {
    title: "Human approval",
    copy: "A named person reviews and approves the feasibility recommendation before the request progresses or is declined.",
    kind: "human",
    tags: ["Required checkpoint"],
    systems: ["LangChain · human-in-the-loop checkpoint", "Microsoft Copilot Studio · Approval Agent", "CPL · named business approver"],
  },
  {
    title: "Library match",
    copy: "Once feasibility is approved, the agent searches the formulation library for an existing match.",
    kind: "decision",
    tags: ["Similarity search", "Cost data"],
    systems: ["Microsoft Copilot Studio · Library Match Agent", "Azure AI Foundry · similarity reasoning", "Microsoft Fabric · formulation and cost data", "Microsoft Copilot Studio · Perfumer Project Agent"],
    branches: [
      {
        label: "Match found",
        copy: "A person approves the match. The formulation details and a quote based on system cost are shared with the sender.",
      },
      {
        label: "No match",
        copy: "A new project is created and routed to the perfumer team to pick up and begin original work.",
      },
    ],
  },
];

const briefToContractManual: ProcessStep[] = [
  { title: "Brief received", copy: "A person monitors the incoming channel, identifies the request and decides where it belongs.", kind: "human", tags: ["Inbox monitoring"] },
  { title: "CRM entered manually", copy: "The brief is re-keyed into CRM and linked to the customer, contact and opportunity.", kind: "human", tags: ["Manual entry", "CRM"] },
  { title: "Acknowledgement written", copy: "A person prepares and sends the receipt email to the customer.", kind: "human", tags: ["Manual email"] },
  { title: "Feasibility checked", copy: "Internal teams gather the relevant information and assess whether the brief can be delivered.", kind: "human", tags: ["Multiple hand-offs"] },
  { title: "Decision communicated", copy: "The feasible or decline decision is reviewed internally and communicated through email.", kind: "human", tags: ["Internal coordination"] },
  { title: "Library searched", copy: "A person searches for a prior formulation, prepares the quote or creates a new perfumer project.", kind: "human", tags: ["Manual search", "Manual costing"] },
];

const briefOutcomes: Outcome[] = [
  { value: "Shorter", label: "brief-to-decision cycle", copy: "CRM entry, acknowledgement, feasibility and matching start without waiting for separate manual hand-offs." },
  { value: "Less", label: "administrative effort", copy: "Agents handle capture, updates, emails, repeatable checks and project creation." },
  { value: "100%", label: "approval gates retained", copy: "People still approve feasibility and every matched formulation before a quote is shared." },
];

const orderToCash: ProcessStep[] = [
  {
    title: "PO received",
    copy: "The customer purchase order arrives by email or, in Colombia, Brazil and parts of the Middle East, through WhatsApp. Both channels enter the same workflow.",
    kind: "agent",
    tags: ["Email", "WhatsApp", "Regional channels"],
    systems: ["Microsoft Copilot Studio · PO Intake Agent", "UiPath RPA · email and WhatsApp capture", "LangChain · O2C orchestration"],
  },
  {
    title: "Order acknowledged",
    copy: "An order acknowledgement is sent immediately before the remaining processing continues.",
    kind: "agent",
    tags: ["Customer response"],
    systems: ["Microsoft Copilot Studio · Order Acknowledgement Agent", "UiPath RPA · outbound response"],
  },
  {
    title: "OCR matches PO to quote",
    copy: "The OCR agent reads the purchase order, extracts the order detail and matches it against the approved quote in CRM.",
    kind: "decision",
    tags: ["OCR", "Quote match"],
    systems: ["AI-based OCR · PO extraction", "Microsoft Copilot Studio · Quote Match Agent", "Microsoft Fabric · CRM quote context", "LangChain · Customer Service audit branch"],
    branches: [
      { label: "Discrepancy", copy: "An audit is triggered to the Customer Service team. The issue must be resolved before order creation." },
      { label: "No discrepancy", copy: "The order creation agent starts automatically." },
    ],
  },
  {
    title: "Order created & credit checked",
    copy: "The order creation agent creates the sales order and runs the credit check automatically.",
    kind: "decision",
    tags: ["Order agent", "Credit control"],
    systems: ["Microsoft Copilot Studio · Order Creation Agent", "UiPath RPA · order-system entry", "Microsoft Fabric · customer and credit context", "LangChain · Finance escalation"],
    branches: [
      { label: "Credit fails", copy: "A workflow is triggered to Finance and the account manager for a human decision." },
      { label: "Credit passes", copy: "The flow moves directly into the automated mini-MRP run." },
    ],
  },
  {
    title: "Mini-MRP run",
    copy: "The agent checks raw-material stock, including safety stock, then uses factory capacity to determine the delivery date.",
    kind: "decision",
    tags: ["Raw materials", "Safety stock", "Factory capacity"],
    systems: ["Microsoft Copilot Studio · Mini-MRP Agent", "Microsoft Fabric · RM and safety-stock data", "Microsoft Fabric · open POs and vendor lead times", "LangChain · buying / delivery branch"],
    branches: [
      { label: "RM shortage", copy: "A buying request is triggered. The customer is updated using open purchase orders or the vendor’s known lead time." },
      { label: "Materials clear", copy: "Capacity provides the delivery date and the order confirmation is sent to the customer." },
    ],
  },
  {
    title: "Production order routed",
    copy: "The agent creates the production order, then decides whether a solution or base is required. It checks existing stock or explodes the bill of materials to produce it, and routes the work against available factory capacity.",
    kind: "decision",
    tags: ["Production order", "Solution / base", "BOM explosion", "Factory allocation"],
    systems: ["Microsoft Copilot Studio · Production Planning Agent", "Microsoft Fabric · BOM and solution/base inventory", "LangChain · factory-capacity decision", "UiPath RPA · production-order creation"],
  },
  {
    title: "Released to shop floor",
    copy: "Once the production route is clear, the agent releases the order to the selected factory shop floor.",
    kind: "agent",
    tags: ["Factory release"],
    systems: ["UiPath RPA · shop-floor release", "Microsoft Copilot Studio · Factory Release Agent"],
  },
  {
    title: "Production tracked live",
    copy: "The production agent updates each movement from the dosing bot through finished production and packing. The customer portal is updated throughout.",
    kind: "agent",
    tags: ["Dosing bot", "Finished", "Packing", "Customer portal"],
    systems: ["Microsoft Copilot Studio · Production Status Agent", "CPL · dosing bot", "Microsoft Fabric · manufacturing event stream", "Microsoft Copilot Studio · Customer Portal Update Agent"],
  },
  {
    title: "QC notified & updated",
    copy: "Production-complete status notifies Quality. QC performs its control and the QC system records the updated status before shipping continues.",
    kind: "human",
    tags: ["Production complete", "QC control", "System update"],
    systems: ["Microsoft Fabric · production-complete event", "LangChain · QC release checkpoint", "CPL · Quality team"],
  },
  {
    title: "Shipping & delivery tracked",
    copy: "Shipping status and delivery movement are tracked, while the agent generates shipping, customs and supporting documents automatically.",
    kind: "agent",
    tags: ["Delivery movement", "Shipping documents", "Customs"],
    systems: ["Microsoft Copilot Studio · Shipping & Documentation Agent", "UiPath RPA · shipping and customs documents", "Microsoft Fabric · tracking and customs data"],
  },
  {
    title: "Goods issue → invoice",
    copy: "As soon as goods issue is posted, the invoice is generated and sent automatically.",
    kind: "agent",
    tags: ["Goods issue", "Invoice"],
    systems: ["UiPath RPA · goods-issue event", "Microsoft Copilot Studio · Invoice Dispatch Agent", "LangChain · invoice trigger orchestration"],
  },
];

const orderToCashManual: ProcessStep[] = [
  { title: "PO monitored", copy: "People monitor email and regional WhatsApp channels, then identify and route each order.", kind: "human", tags: ["Email", "WhatsApp"] },
  { title: "Order re-keyed", copy: "PO lines are read and entered into the order system by hand.", kind: "human", tags: ["Manual entry"] },
  { title: "Quote checked", copy: "The PO is compared with the CRM quote and discrepancies are passed to Customer Service.", kind: "human", tags: ["CRM comparison"] },
  { title: "Credit coordinated", copy: "Credit results, Finance involvement and account-manager decisions are coordinated manually.", kind: "human", tags: ["Finance hand-off"] },
  { title: "Materials planned", copy: "Teams check raw materials, safety stock, purchase orders, supplier lead times and factory capacity.", kind: "human", tags: ["Planning hand-offs"] },
  { title: "Production planned", copy: "Planners decide the solution or base route, expand the BOM and select the factory.", kind: "human", tags: ["BOM", "Capacity"] },
  { title: "Factory updated", copy: "Production orders are released and status is chased across dosing, finishing and packing.", kind: "human", tags: ["Shop-floor follow-up"] },
  { title: "Customer updated", copy: "Order progress is gathered and communicated to the customer through separate status updates.", kind: "human", tags: ["Status chasing"] },
  { title: "QC coordinated", copy: "Production completion is passed to Quality and the result is checked before shipping.", kind: "human", tags: ["Quality hand-off"] },
  { title: "Shipping prepared", copy: "Tracking, shipping paperwork and customs documentation are assembled manually.", kind: "human", tags: ["Documents", "Customs"] },
  { title: "Invoice triggered", copy: "Goods issue is checked and the invoice is prepared and sent as a separate activity.", kind: "human", tags: ["Manual invoice step"] },
];

const orderOutcomes: Outcome[] = [
  { value: "Faster", label: "order-to-confirm cycle", copy: "OCR, quote matching, order creation, credit and mini-MRP run as one connected sequence." },
  { value: "Live", label: "customer order visibility", copy: "Production movements update the customer portal instead of depending on manual status chasing." },
  { value: "Touchless", label: "goods-issue to invoice", copy: "The posted goods issue triggers invoice generation and delivery automatically." },
  { value: "Stronger", label: "exception control", copy: "PO discrepancies, failed credit checks and QC remain visible, routed exceptions rather than hidden automation." },
];

const processLensMessages: Record<"brief" | "order", Record<ExecutiveLens, LensMessage>> = {
  brief: {
    ceo: {
      eyebrow: "CEO lens · growth and customer response",
      headline: "Make responsiveness a scalable commercial capability.",
      copy: "Every enquiry begins immediately, while perfumers and commercial teams concentrate on judgement, customer relationships and original creation.",
      signals: ["Faster customer response", "More briefs handled", "Creative capacity protected"],
    },
    cfo: {
      eyebrow: "CFO lens · capacity and control",
      headline: "Release specialist capacity without weakening approval.",
      copy: "Repeatable administration and checks move to agents. Feasibility, formulation selection and the customer quote remain governed human decisions.",
      signals: ["Lower cost to serve", "Fewer manual hand-offs", "Approval trail retained"],
    },
  },
  order: {
    ceo: {
      eyebrow: "CEO lens · customer promise",
      headline: "Turn fulfilment visibility into customer trust.",
      copy: "One connected flow carries the promise from PO receipt to delivery, while the customer portal reflects what is actually happening in production.",
      signals: ["Immediate acknowledgement", "Reliable promise date", "Live order visibility"],
    },
    cfo: {
      eyebrow: "CFO lens · cash and exceptions",
      headline: "Compress transaction cost and surface value at risk.",
      copy: "Straight-through work is automated; discrepancies, credit failures, shortages and QC decisions are routed as explicit, auditable exceptions.",
      signals: ["Lower handling cost", "Working capital opportunity", "Exception-first controls"],
    },
  },
};

const orderTwinEvents: TwinEvent[] = [
  { title: "PO received", system: "PO Intake Agent · WhatsApp", copy: "Six-line customer PO captured from Colombia.", customer: "Order received", minutes: 0 },
  { title: "Document understood", system: "AI-based OCR · UiPath RPA", copy: "Products, quantities, requested dates and prices extracted.", customer: "Acknowledgement sent", minutes: 1 },
  { title: "Quote reconciled", system: "Quote Match Agent · Microsoft Fabric", copy: "PO compared with CRM quote Q-78142.", customer: "Validation in progress", minutes: 2 },
  { title: "Order and credit", system: "Order Creation Agent · LangChain", copy: "Sales order created and credit control executed.", customer: "Order accepted", minutes: 4 },
  { title: "Materials and capacity", system: "Mini-MRP Agent · Microsoft Fabric", copy: "Safety stock, open POs, lead times and plant capacity evaluated.", customer: "Promise date calculated", minutes: 6 },
  { title: "Production route", system: "Production Planning Agent · UiPath RPA", copy: "Solution/base requirement resolved and production order released.", customer: "Production planned", minutes: 9 },
  { title: "Factory movement", system: "Production Status Agent · CPL dosing bot", copy: "Dosing, finishing and packing events posted as they occur.", customer: "In production", minutes: 14 },
  { title: "Quality release", system: "QC checkpoint · Quality team", copy: "Completion event routed to Quality for controlled release.", customer: "Quality check", minutes: 17 },
  { title: "Shipping prepared", system: "Shipping & Documentation Agent", copy: "Shipping, customs and tracking documents generated.", customer: "Ready to ship", minutes: 19 },
  { title: "Invoice dispatched", system: "Invoice Dispatch Agent · goods issue", copy: "Goods issue triggers invoice generation and customer delivery.", customer: "Shipped and invoiced", minutes: 20 },
];

function OrderDigitalTwin({ lens }: { lens: ExecutiveLens }) {
  const [scenario, setScenario] = useState<"straight" | "exception">("exception");
  const [active, setActive] = useState(-1);
  const [running, setRunning] = useState(false);
  const reduced = useReducedMotion();

  const events = useMemo<TwinEvent[]>(() => {
    if (scenario === "straight") return orderTwinEvents;
    return [
      ...orderTwinEvents.slice(0, 3),
      {
        title: "Price discrepancy stopped",
        system: "Quote Match Agent · LangChain exception branch",
        copy: "PO line 4 is 2.8% above quote Q-78142. The agent stops order creation and opens a Customer Service audit.",
        customer: "Validation paused",
        minutes: 2,
        exception: true,
      },
      {
        title: "Human resolution recorded",
        system: "CPL Customer Service · human control",
        copy: "Customer Service confirms the agreed price and releases the corrected order with a named decision in the audit trail.",
        customer: "Exception resolved",
        minutes: 5,
        human: true,
      },
      ...orderTwinEvents.slice(3).map((event) => ({ ...event, minutes: event.minutes + 3 })),
    ];
  }, [scenario]);

  useEffect(() => {
    if (!running || active < 0) return;
    if (events[active]?.exception) {
      setRunning(false);
      return;
    }
    if (active >= events.length - 1) {
      setRunning(false);
      return;
    }
    const timer = window.setTimeout(() => setActive((current) => current + 1), reduced ? 80 : 1800);
    return () => window.clearTimeout(timer);
  }, [active, events.length, reduced, running]);

  const changeScenario = (next: "straight" | "exception") => {
    setRunning(false);
    setActive(-1);
    setScenario(next);
  };

  const run = () => {
    if (running) {
      setRunning(false);
      return;
    }
    if (active >= events.length - 1 || active < 0) setActive(0);
    setRunning(true);
  };

  const approveException = () => {
    setActive((currentIndex) => currentIndex + 1);
    window.setTimeout(() => setRunning(true), reduced ? 80 : 1100);
  };

  const current = active >= 0 ? events[active] : null;
  const completed = active >= events.length - 1;
  const progress = active < 0 ? 0 : ((active + 1) / events.length) * 100;

  return (
    <div className={`digital-twin ${current?.exception ? "exception-active" : ""}`}>
      <div className="twin-heading">
        <div>
          <span className="overline">Live executive demonstration</span>
          <h2>Follow one order.</h2>
          <p>Watch a WhatsApp PO move across agents, data, human control and factory events. Inject a real exception to see the automation stop safely.</p>
        </div>
        <div className="twin-controls">
          <div className="scenario-toggle" role="group" aria-label="Order simulation scenario">
            <button type="button" className={scenario === "straight" ? "active" : ""} onClick={() => changeScenario("straight")}>Straight through</button>
            <button type="button" className={scenario === "exception" ? "active" : ""} onClick={() => changeScenario("exception")}><AlertTriangle size={13} />Inject discrepancy</button>
          </div>
          <button type="button" className="run-button twin-run" onClick={run}>
            {running ? <Pause size={15} /> : completed ? <RefreshCw size={15} /> : <Play size={15} fill="currentColor" />}
            {running ? "Pause order" : completed ? "Replay order" : "Run live order"}
          </button>
        </div>
      </div>

      <div className="twin-stage">
        <div className="po-card">
          <div className="po-top"><span>PO / CO-78431</span><b>WHATSAPP · COLOMBIA</b></div>
          <div className="po-customer"><small>CUSTOMER</small><strong>Casa Botánica S.A.S.</strong><span>Requested delivery · 28 OCT</span></div>
          <div className="po-lines">
            <div><span>Jasmine Accord 41</span><b>120 KG</b><em>£46.20</em></div>
            <div><span>Cedar Base 08</span><b>80 KG</b><em>£31.10</em></div>
            <div className={scenario === "exception" && active >= 3 ? "flagged" : ""}><span>Amber Solution 12</span><b>60 KG</b><em>£27.76</em></div>
          </div>
          <div className="po-foot"><ScanLine size={15} /><span>Document confidence</span><b>99.2%</b></div>
        </div>

        <div className="twin-orchestrator">
          <div className="twin-progress"><motion.i animate={{ scaleX: progress / 100 }} transition={{ duration: .5, ease: [0.23, 1, 0.32, 1] }} /></div>
          <div className="event-stack">
            {events.map((event, index) => (
              <button
                type="button"
                key={`${event.title}-${index}`}
                className={`${index === active ? "active" : ""} ${index < active ? "passed" : ""} ${event.exception ? "exception" : ""} ${event.human ? "human" : ""}`}
                onClick={() => { setRunning(false); setActive(index); }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <i />
                <div><strong>{event.title}</strong><small>{event.system}</small></div>
                <b>{index < active ? "DONE" : index === active ? event.exception ? "STOPPED" : event.human ? "HUMAN" : "LIVE" : "WAIT"}</b>
              </button>
            ))}
          </div>
        </div>

        <div className="twin-cockpit">
          <div className="cockpit-top"><span>{lens === "ceo" ? "CUSTOMER PROMISE" : "CONTROL & VALUE LEDGER"}</span><b className={current?.exception ? "alert" : ""}>{current?.exception ? "EXCEPTION" : running ? "ORCHESTRATING" : completed ? "COMPLETE" : "READY"}</b></div>
          <AnimatePresence mode="wait">
            <motion.div className="cockpit-event" key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <div className={`event-icon ${current?.exception ? "alert" : current?.human ? "human" : ""}`}>
                {current?.exception ? <AlertTriangle size={25} /> : current?.human ? <UserCheck size={25} /> : completed ? <BadgeCheck size={25} /> : <Workflow size={25} />}
              </div>
              <span>{current ? `T+${String(current.minutes).padStart(2, "0")} MIN · ${current.system}` : "ORDER READY"}</span>
              <h3>{current?.title ?? "Run the order from intake to invoice."}</h3>
              <p>{current?.copy ?? "Choose the straight-through route or inject a discrepancy to demonstrate human-in-the-loop control."}</p>
              {current?.exception && (
                <button type="button" className="twin-approval" onClick={approveException}>
                  <UserCheck size={15} />Approve correction & continue
                </button>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="portal-status">
            <div><span>Customer portal</span><b>{current?.customer ?? "Awaiting order"}</b></div>
            <div><span>Human interventions</span><b>{scenario === "exception" && active >= 4 ? "01 · recorded" : "00"}</b></div>
            <div><span>Audit trace</span><b>{active >= 0 ? `${active + 1}/${events.length} events` : "Ready"}</b></div>
          </div>
          <p className="twin-disclaimer"><CircleDot size={12} />Illustrative transaction trace for the meeting—not a measured Euroma cycle-time claim.</p>
        </div>
      </div>
    </div>
  );
}

function KindIcon({ kind }: { kind: StepKind }) {
  const Icon = kind === "human" ? Hand : kind === "decision" ? GitBranch : Zap;
  return <Icon size={15} strokeWidth={1.8} />;
}

function SectionFrame({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      className="section-frame"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.44, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="section-heading">
        <div className="eyebrow"><span />{eyebrow}</div>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
      {children}
    </motion.section>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function OrbitalSystem() {
  const reduced = useReducedMotion();
  return (
    <div className="orbital-card" aria-label="Live agent orchestration visualisation">
      <div className="system-topline">
        <span><i /> Production system</span>
        <span>LIVE</span>
      </div>
      <div className="orbital-stage">
        <motion.div
          className="orbit orbit-one"
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          <i className="satellite satellite-a" />
          <i className="satellite satellite-b" />
        </motion.div>
        <motion.div
          className="orbit orbit-two"
          animate={reduced ? undefined : { rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          <i className="satellite satellite-c" />
        </motion.div>
        <motion.div
          className="system-core"
          animate={reduced ? undefined : { scale: [1, 1.035, 1] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Fingerprint size={26} strokeWidth={1.35} />
          <strong>Human<br />control</strong>
        </motion.div>
        <div className="orbit-label label-one">Agent</div>
        <div className="orbit-label label-two">Data</div>
        <div className="orbit-label label-three">Factory</div>
        <div className="orbit-label label-four">Customer</div>
      </div>
      <div className="system-log">
        <span>09:42:18</span>
        <p>Feasibility decision waiting for named approver</p>
        <BadgeCheck size={15} />
      </div>
    </div>
  );
}

function ProfileSection() {
  const [activeCareer, setActiveCareer] = useState(0);
  return (
    <motion.section
      className="profile-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><span />Production AI, not a roadmap</div>
          <h1>The agents are<br />already <em>running.</em></h1>
          <p className="hero-lede">
            Built inside CPL Aromas, where formulation, compliance, manufacturing and customer promises meet the real world.
          </p>
          <div className="hero-proof">
            <Metric value="25+" label="years in industry" />
            <Metric value="18+" label="countries in scope" />
            <Metric value="2" label="live agent flows" />
          </div>
        </div>
        <OrbitalSystem />
      </div>

      <div className="profile-statement">
        <span className="statement-index">ALFRED / 01</span>
        <p>
          CIO and Global Operating Board Member at CPL Aromas. Former Global Head of Digitalization at Symrise. I know the full flavour and fragrance value chain, and I still build.
        </p>
      </div>

      <div className="content-block">
        <div className="block-heading">
          <div>
            <span className="overline">Independent ventures</span>
            <h2>Built beyond the boardroom.</h2>
          </div>
          <p>Three products, one operating principle: give AI a narrow job, real context and a visible human boundary.</p>
        </div>
        <div className="venture-grid">
          {ventures.map((venture, index) => {
            const Icon = venture.icon;
            return (
              <motion.article
                key={venture.name}
                className="venture-card"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 + index * 0.08 }}
                whileHover={{ y: -5 }}
              >
                <div className="venture-top"><Icon size={20} /><span>0{index + 1}</span></div>
                <span className="overline">{venture.meta}</span>
                <h3>{venture.name}</h3>
                <p>{venture.copy}</p>
              </motion.article>
            );
          })}
        </div>
      </div>

      <div className="content-block career-block">
        <div className="block-heading">
          <div>
            <span className="overline">Operating record</span>
            <h2>Brands where the work shipped.</h2>
          </div>
          <p>Select a company to see the work behind the logo.</p>
        </div>
        <div className="brand-rail" aria-label="Career brand logos">
          {career.map((item, index) => (
            <button
              type="button"
              className={`brand-tile ${activeCareer === index ? "active" : ""}`}
              key={item.name}
              onClick={() => setActiveCareer(index)}
              aria-pressed={activeCareer === index}
            >
              <img src={item.logo} alt={`${item.name} logo`} />
              <span>{item.years}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            className="career-detail"
            key={career[activeCareer].name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            <div>
              <span className="career-years">{career[activeCareer].years}</span>
              <h3>{career[activeCareer].name}</h3>
              <p className="career-role">{career[activeCareer].role}</p>
            </div>
            <p>{career[activeCareer].copy}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

function TechSection() {
  const [active, setActive] = useState(1);
  const ActiveIcon = technology[active].icon;
  return (
    <SectionFrame
      eyebrow="The production stack"
      title="Six layers. One operating system."
      intro="Every layer has a specific job. Click through the stack to see how governance, agents, automation and data work as one system."
    >
      <div className="tech-grid">
        <div className="tech-list">
          {technology.map((layer, index) => {
            const Icon = layer.icon;
            return (
              <button
                type="button"
                key={layer.number}
                className={`tech-row ${active === index ? "active" : ""}`}
                onClick={() => setActive(index)}
                aria-pressed={active === index}
              >
                <span className="tech-number">{layer.number}</span>
                <span className="tech-icon"><Icon size={18} /></span>
                <span className="tech-label"><strong>{layer.title}</strong><small>{layer.tools}</small></span>
                <ArrowUpRight size={17} />
              </button>
            );
          })}
        </div>
        <div className="tech-visual">
          <div className="tech-gridlines" />
          <div className="tech-status"><i /> SYSTEM LAYER {technology[active].number}</div>
          <AnimatePresence mode="wait">
            <motion.div
              className="tech-core"
              key={technology[active].title}
              initial={{ opacity: 0, scale: 0.96, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.98, rotate: 2 }}
              transition={{ duration: 0.32 }}
            >
              <div className="tech-core-icon"><ActiveIcon size={32} strokeWidth={1.35} /></div>
              <span className="overline">{technology[active].tools}</span>
              <h3>{technology[active].title}</h3>
              <p>{technology[active].copy}</p>
            </motion.div>
          </AnimatePresence>
          <div className="data-stream stream-one" />
          <div className="data-stream stream-two" />
          <div className="tech-caption"><ShieldCheck size={16} /> Governed by design</div>
        </div>
      </div>
    </SectionFrame>
  );
}

function ProcessFlow({
  steps,
  manualSteps,
  process,
  lens,
  eyebrow,
  title,
  intro,
  before,
  today,
  checkpoints,
  outcomes,
}: {
  steps: ProcessStep[];
  manualSteps: ProcessStep[];
  process: "brief" | "order";
  lens: ExecutiveLens;
  eyebrow: string;
  title: string;
  intro: string;
  before: string;
  today: string;
  checkpoints: string[];
  outcomes: Outcome[];
}) {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const [view, setView] = useState<"manual" | "automated">("automated");
  const railRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const displayedSteps = view === "automated" ? steps : manualSteps;

  useEffect(() => {
    if (!running) return;
    if (active >= displayedSteps.length - 1) {
      setRunning(false);
      return;
    }
    const timer = window.setTimeout(() => setActive((current) => current + 1), 1750);
    return () => window.clearTimeout(timer);
  }, [active, running, displayedSteps.length]);

  useEffect(() => {
    const node = railRef.current?.querySelector(`[data-node="${active}"]`);
    node?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", inline: "center", block: "nearest" });
  }, [active, reduced]);

  const changeView = (nextView: "manual" | "automated") => {
    if (nextView === view) return;
    setRunning(false);
    setActive(0);
    setView(nextView);
    if (railRef.current) railRef.current.scrollLeft = 0;
  };

  const run = () => {
    if (running) {
      setRunning(false);
      return;
    }
    setActive(0);
    window.setTimeout(() => setRunning(true), 120);
  };

  const current = displayedSteps[active];
  const lensMessage = processLensMessages[process][lens];
  return (
    <SectionFrame eyebrow={eyebrow} title={title} intro={intro}>
      <AnimatePresence mode="wait">
        <motion.div
          className={`executive-lens-card ${lens}`}
          key={`${process}-${lens}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: .26 }}
        >
          <div><span>{lensMessage.eyebrow}</span><h2>{lensMessage.headline}</h2></div>
          <div><p>{lensMessage.copy}</p><div>{lensMessage.signals.map((signal) => <b key={signal}><Check size={12} />{signal}</b>)}</div></div>
        </motion.div>
      </AnimatePresence>
      <div className="process-view-control">
        <div className="view-toggle" role="group" aria-label="Process view">
          <button type="button" className={view === "manual" ? "active" : ""} onClick={() => changeView("manual")} aria-pressed={view === "manual"}>
            <span>Before transformation</span><small>Manual</small>
            {view === "manual" && <motion.i layoutId={`view-toggle-${title}`} transition={{ duration: .38, ease: [0.23, 1, 0.32, 1] }} />}
          </button>
          <button type="button" className={view === "automated" ? "active" : ""} onClick={() => changeView("automated")} aria-pressed={view === "automated"}>
            <span>Today at CPL</span><small>Automated</small>
            {view === "automated" && <motion.i layoutId={`view-toggle-${title}`} transition={{ duration: .38, ease: [0.23, 1, 0.32, 1] }} />}
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            className={`view-summary ${view}`}
            key={view}
            initial={{ opacity: 0, x: view === "automated" ? 12 : -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: view === "automated" ? -12 : 12 }}
            transition={{ duration: .28 }}
          >
            <span>{view === "automated" ? "LIVE AT CPL" : "PRE-TRANSFORMATION"}</span>
            <p>{view === "automated" ? today : before}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flow-toolbar">
        <div className="legend">
          {view === "automated" ? (
            <>
              <span><i className="agent" />Agent action</span>
              <span><i className="decision" />Decision</span>
              <span><i className="human" />Human control</span>
              <span className="hover-cue"><Network size={12} />Hover a step for systems</span>
            </>
          ) : (
            <>
              <span><i className="human" />Manual task</span>
              <span><i className="handoff" />Human hand-off</span>
            </>
          )}
        </div>
        <button className="run-button" type="button" onClick={run}>
          {running ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
          {running ? "Pause flow" : view === "automated" ? "Run automated flow" : "Walk manual flow"}
        </button>
      </div>

      <div className={`flow-shell ${view}`}>
        <AnimatePresence mode="wait">
          <motion.div
            className="flow-rail"
            ref={railRef}
            key={view}
            initial={{ opacity: 0, x: view === "automated" ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: view === "automated" ? -30 : 30 }}
            transition={{ duration: .38, ease: [0.23, 1, 0.32, 1] }}
          >
            {displayedSteps.map((step, index) => (
              <div className="flow-unit" key={`${view}-${step.title}`}>
                <motion.button
                  type="button"
                  data-node={index}
                  className={`flow-node ${step.kind} ${active === index ? "active" : ""} ${active > index ? "passed" : ""}`}
                  onClick={() => { setRunning(false); setActive(index); }}
                  whileTap={{ scale: 0.98 }}
                  aria-pressed={active === index}
                >
                  <span className="node-top"><b>{String(index + 1).padStart(2, "0")}</b><KindIcon kind={step.kind} /></span>
                  <strong>{step.title}</strong>
                  <small>{view === "manual" ? "Manual task" : step.kind === "human" ? "Human checkpoint" : step.kind === "decision" ? "Decision gate" : "Autonomous action"}</small>
                  {view === "automated" && step.systems && (
                    <span className="system-hover">
                      <span><Network size={13} />Systems & agents</span>
                      {step.systems.map((system) => <b key={system}>{system}</b>)}
                    </span>
                  )}
                  {active === index && <motion.i layoutId={`node-glow-${title}-${view}`} className="node-glow" />}
                </motion.button>
                {index < displayedSteps.length - 1 && (
                  <div className={`flow-connector ${active > index ? "passed" : ""}`}>
                    <div className="connector-track" />
                    <motion.div
                      className="connector-energy"
                      initial={false}
                      animate={{ scaleX: active > index ? 1 : 0 }}
                      transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
                    />
                    <span className="connector-arrow">›</span>
                    {running && active === index && (
                      <motion.span
                        className="signal-dot"
                        initial={{ x: 0, opacity: 0 }}
                        animate={{ x: 56, opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.45, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            className={`flow-detail ${current.kind}`}
            key={`${title}-${view}-${active}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            <div className="detail-number">{String(active + 1).padStart(2, "0")}</div>
            <div className="detail-main">
              <div className="detail-kind"><KindIcon kind={current.kind} /> {view === "manual" ? "Manual task" : current.kind === "human" ? "Human control" : current.kind === "decision" ? "Decision gate" : "Agent action"}</div>
              <h3>{current.title}</h3>
              <p>{current.copy}</p>
              {current.tags && <div className="tag-row">{current.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
              {view === "automated" && current.systems && (
                <div className="system-detail">
                  <span><Network size={14} />Systems & agents in this step</span>
                  <div>{current.systems.map((system) => <b key={system}>{system}</b>)}</div>
                </div>
              )}
            </div>
            {view === "automated" && current.branches && (
              <div className="branch-grid">
                {current.branches.map((branch, index) => (
                  <motion.div
                    className="branch-card"
                    key={branch.label}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + index * 0.08 }}
                  >
                    <span>{index === 0 ? "A" : "B"}</span>
                    <strong>{branch.label}</strong>
                    <p>{branch.copy}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="checkpoint-strip">
        <div className="checkpoint-title"><ShieldCheck size={19} /><span>Controls that do not move</span></div>
        <div className="checkpoint-items">
          {checkpoints.map((item) => <div key={item}><Check size={14} />{item}</div>)}
        </div>
      </div>

      {process === "order" && <OrderDigitalTwin lens={lens} />}

      <div className="outcomes-panel">
        <div className="outcomes-heading">
          <div><span className="overline">Outcome of the transformation</span><h2>What changes in operation.</h2></div>
          <p>Directional outcomes from the implemented design. Use the Impact tab to model quantified cycle-time and capacity gains with CPL or Euroma operating data.</p>
        </div>
        <div className="outcome-grid">
          {outcomes.map((outcome, index) => (
            <motion.article key={outcome.label} className="outcome-card" whileHover={{ y: -4 }}>
              <span>0{index + 1}</span>
              <strong>{outcome.value}</strong>
              <h3>{outcome.label}</h3>
              <p>{outcome.copy}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

function NumberField({ label, value, onChange, prefix, hint }: { label: string; value: number; onChange: (value: number) => void; prefix?: string; hint?: string }) {
  return (
    <label className="number-field">
      <span>{label}</span>
      <div className="input-wrap">{prefix && <b>{prefix}</b>}<input type="number" value={value} onChange={(event) => onChange(Number(event.target.value) || 0)} /></div>
      {hint && <small>{hint}</small>}
    </label>
  );
}

function SliderField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="slider-field">
      <div><span>{label}</span><b>{value}%</b></div>
      <input type="range" min="0" max="90" value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <div className="scale"><span>0</span><span>Manual effort removed</span><span>90</span></div>
    </label>
  );
}

function OutputCard({ value, label, formula, accent }: { value: string; label: string; formula: string; accent?: boolean }) {
  return (
    <motion.div className={`output-card ${accent ? "accent" : ""}`} layout>
      <div className="output-signal"><i /><span>CALCULATED</span></div>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.strong key={value} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }} transition={{ duration: 0.22 }}>
          {value}
        </motion.strong>
      </AnimatePresence>
      <p>{label}</p>
      <small>{formula}</small>
    </motion.div>
  );
}

function formatNumber(value: number, decimals = 0) {
  return value.toLocaleString("en-GB", { maximumFractionDigits: decimals });
}

function formatMoney(value: number) {
  const sign = value < 0 ? "−" : "";
  const absolute = Math.abs(value);
  if (absolute >= 1_000_000) return `${sign}£${(absolute / 1_000_000).toFixed(2)}m`;
  if (absolute >= 1_000) return `${sign}£${Math.round(absolute / 1_000)}k`;
  return `${sign}£${Math.round(absolute)}`;
}

function ImpactSection({ lens }: { lens: ExecutiveLens }) {
  const [mode, setMode] = useState<"brief" | "order">("order");
  const [scenario, setScenario] = useState<"conservative" | "base" | "upside" | "custom">("base");
  const [brief, setBrief] = useState({ volume: 1800, days: 12, hours: 5, cost: 45, pct: 55, implementation: 180000, run: 75000 });
  const [order, setOrder] = useState({ volume: 6000, days: 18, hours: 2.5, cost: 45, pct: 55, exceptionRate: 4, exceptionCost: 250, revenue: 25000000, cashDays: 2, implementation: 350000, run: 110000 });
  const [discountRate, setDiscountRate] = useState(10);
  const [fundingRate, setFundingRate] = useState(8);

  const setScenarioValues = (next: "conservative" | "base" | "upside") => {
    const assumptions = {
      conservative: { pct: 35, cashDays: 1 },
      base: { pct: 55, cashDays: 2 },
      upside: { pct: 70, cashDays: 4 },
    }[next];
    setScenario(next);
    setBrief((current) => ({ ...current, pct: assumptions.pct }));
    setOrder((current) => ({ ...current, pct: assumptions.pct, cashDays: assumptions.cashDays }));
  };

  const model = useMemo(() => {
    const realization = { conservative: .6, base: .75, upside: .9, custom: .75 }[scenario];
    const source = mode === "brief" ? brief : order;
    const capacity = source.volume * source.hours * source.cost * (source.pct / 100);
    const rework = mode === "order" ? order.volume * (order.exceptionRate / 100) * order.exceptionCost * (order.pct / 100) : 0;
    const workingCapital = mode === "order" ? order.revenue * (order.cashDays / 365) : 0;
    const financingBenefit = workingCapital * (fundingRate / 100);
    const gross = capacity + rework + financingBenefit;
    const recurring = gross - source.run;
    const yearOne = gross * realization - source.run;
    const discount = discountRate / 100;
    const npv = -source.implementation + yearOne / (1 + discount) + recurring / Math.pow(1 + discount, 2) + recurring / Math.pow(1 + discount, 3);
    let paybackMonths: number | null = null;
    if (yearOne > 0 && recurring > 0) {
      paybackMonths = yearOne >= source.implementation
        ? (source.implementation / yearOne) * 12
        : 12 + ((source.implementation - yearOne) / recurring) * 12;
    }
    const newCycle = source.days * (1 - source.pct / 100);
    const fteEquivalent = (source.volume * source.hours * (source.pct / 100)) / 1760;
    const contributions = [
      { label: "Capacity released", value: capacity },
      ...(mode === "order" ? [{ label: "Avoided rework", value: rework }, { label: "Cash benefit", value: financingBenefit }] : []),
      { label: "Annual run cost", value: -source.run },
    ];
    const maxBridge = Math.max(gross, recurring, 1);
    let cumulative = 0;
    const bridge = contributions.map((item) => {
      const before = cumulative;
      cumulative += item.value;
      return {
        ...item,
        bottom: (Math.min(before, cumulative) / maxBridge) * 100,
        height: (Math.abs(item.value) / maxBridge) * 100,
      };
    });
    return { capacity, rework, workingCapital, financingBenefit, gross, recurring, yearOne, npv, paybackMonths, newCycle, fteEquivalent, bridge, maxBridge, realization };
  }, [brief, discountRate, fundingRate, mode, order, scenario]);

  const source = mode === "brief" ? brief : order;
  const kpis = lens === "cfo"
    ? [
        { value: formatMoney(model.recurring), label: "Annual recurring net value", note: "benefits less annual run cost" },
        { value: model.paybackMonths ? `${formatNumber(model.paybackMonths, 1)} mo` : "—", label: "Simple payback", note: "includes year-one realization ramp" },
        { value: formatMoney(model.npv), label: "Three-year NPV", note: `${discountRate}% discount rate` },
        { value: mode === "order" ? formatMoney(model.workingCapital) : "—", label: "Working capital released", note: mode === "order" ? `${order.cashDays} cash-cycle days` : "not modelled for B2C" },
      ]
    : [
        { value: `${formatNumber(source.days, 1)} → ${formatNumber(model.newCycle, 1)}d`, label: "Modelled cycle time", note: `${source.pct}% reduction assumption` },
        { value: formatNumber(model.fteEquivalent, 1), label: "FTE-equivalent capacity", note: "redeployed—not assumed removed" },
        { value: formatMoney(model.recurring), label: "Annual recurring net value", note: "funds growth and service capacity" },
        { value: mode === "order" ? formatMoney(model.workingCapital) : "Faster", label: mode === "order" ? "Working capital released" : "Customer response", note: mode === "order" ? "cash-cycle opportunity" : "immediate agent intake" },
      ];

  return (
    <SectionFrame
      eyebrow={lens === "cfo" ? "CFO lens · investment case" : "CEO lens · scalable operating leverage"}
      title={lens === "cfo" ? "Bridge automation to cash." : "Scale service without scaling friction."}
      intro={lens === "cfo" ? "A live, editable investment case with operating benefits, delivery costs, payback and three-year discounted value." : "See how faster cycles and released specialist capacity become a commercial growth platform—with the financial case still visible."}
    >
      <div className="investment-toolbar">
        <div className="impact-tabs">
          <button className={mode === "brief" ? "active" : ""} onClick={() => setMode("brief")} type="button">Brief → contract</button>
          <button className={mode === "order" ? "active" : ""} onClick={() => setMode("order")} type="button">Order → cash</button>
        </div>
        <div className="scenario-tabs" role="group" aria-label="Investment scenario">
          {(["conservative", "base", "upside"] as const).map((item) => <button type="button" key={item} className={scenario === item ? "active" : ""} onClick={() => setScenarioValues(item)}>{item}</button>)}
        </div>
      </div>

      <div className={`executive-kpis ${lens}`}>
        {kpis.map((item, index) => (
          <motion.article key={item.label} layout>
            <span>0{index + 1}</span><strong>{item.value}</strong><h3>{item.label}</h3><p>{item.note}</p>
          </motion.article>
        ))}
      </div>

      <div className="investment-grid">
        <div className="investment-inputs">
          <div className="panel-label"><Gauge size={17} /><span>EDITABLE OPERATING ASSUMPTIONS</span></div>
          <div className="input-columns">
            {mode === "brief" ? (
              <>
                <NumberField label="Enquiries per year" value={brief.volume} onChange={(volume) => { setScenario("custom"); setBrief({ ...brief, volume }); }} />
                <NumberField label="Current cycle" value={brief.days} onChange={(days) => { setScenario("custom"); setBrief({ ...brief, days }); }} hint="days" />
                <NumberField label="Person-hours per brief" value={brief.hours} onChange={(hours) => { setScenario("custom"); setBrief({ ...brief, hours }); }} />
                <NumberField label="Loaded cost per hour" value={brief.cost} onChange={(cost) => { setScenario("custom"); setBrief({ ...brief, cost }); }} prefix="£" />
                <NumberField label="One-time implementation" value={brief.implementation} onChange={(implementation) => { setScenario("custom"); setBrief({ ...brief, implementation }); }} prefix="£" />
                <NumberField label="Annual run cost" value={brief.run} onChange={(run) => { setScenario("custom"); setBrief({ ...brief, run }); }} prefix="£" />
                <NumberField label="NPV discount rate" value={discountRate} onChange={(value) => { setScenario("custom"); setDiscountRate(value); }} hint="percent" />
              </>
            ) : (
              <>
                <NumberField label="Orders per year" value={order.volume} onChange={(volume) => { setScenario("custom"); setOrder({ ...order, volume }); }} />
                <NumberField label="Current O2C cycle" value={order.days} onChange={(days) => { setScenario("custom"); setOrder({ ...order, days }); }} hint="days" />
                <NumberField label="Person-hours per order" value={order.hours} onChange={(hours) => { setScenario("custom"); setOrder({ ...order, hours }); }} />
                <NumberField label="Loaded cost per hour" value={order.cost} onChange={(cost) => { setScenario("custom"); setOrder({ ...order, cost }); }} prefix="£" />
                <NumberField label="Exception rate" value={order.exceptionRate} onChange={(exceptionRate) => { setScenario("custom"); setOrder({ ...order, exceptionRate }); }} hint="percent" />
                <NumberField label="Cost per exception" value={order.exceptionCost} onChange={(exceptionCost) => { setScenario("custom"); setOrder({ ...order, exceptionCost }); }} prefix="£" />
                <NumberField label="Annual revenue touched" value={order.revenue} onChange={(revenue) => { setScenario("custom"); setOrder({ ...order, revenue }); }} prefix="£" />
                <NumberField label="Cash-cycle days released" value={order.cashDays} onChange={(cashDays) => { setScenario("custom"); setOrder({ ...order, cashDays }); }} />
                <NumberField label="One-time implementation" value={order.implementation} onChange={(implementation) => { setScenario("custom"); setOrder({ ...order, implementation }); }} prefix="£" />
                <NumberField label="Annual run cost" value={order.run} onChange={(run) => { setScenario("custom"); setOrder({ ...order, run }); }} prefix="£" />
                <NumberField label="NPV discount rate" value={discountRate} onChange={(value) => { setScenario("custom"); setDiscountRate(value); }} hint="percent" />
                <NumberField label="Cost of capital on cash released" value={fundingRate} onChange={(value) => { setScenario("custom"); setFundingRate(value); }} hint="percent" />
              </>
            )}
          </div>
          <SliderField label="Repeatable effort automated" value={source.pct} onChange={(pct) => { setScenario("custom"); mode === "brief" ? setBrief({ ...brief, pct }) : setOrder({ ...order, pct }); }} />
        </div>

        <div className="waterfall-panel">
          <div className="waterfall-head">
            <div><span className="panel-label"><Banknote size={17} />ANNUAL VALUE BRIDGE</span><h2>{formatMoney(model.recurring)} recurring net value</h2></div>
            <span className="scenario-stamp">{scenario} case</span>
          </div>
          <div className="waterfall-chart" aria-label="Annual value waterfall">
            <div className="waterfall-baseline" />
            {model.bridge.map((item) => (
              <div className="waterfall-step" key={item.label}>
                <div className="waterfall-value">{item.value >= 0 ? "+" : "−"}{formatMoney(Math.abs(item.value))}</div>
                <div className={`waterfall-bar ${item.value >= 0 ? "positive" : "negative"}`} style={{ "--bar-bottom": `${item.bottom}%`, "--bar-height": `${Math.max(item.height, 2)}%` } as React.CSSProperties} />
                <span>{item.label}</span>
              </div>
            ))}
            <div className="waterfall-step total">
              <div className="waterfall-value">{formatMoney(model.recurring)}</div>
              <div className="waterfall-bar total" style={{ "--bar-bottom": "0%", "--bar-height": `${Math.max((model.recurring / model.maxBridge) * 100, 2)}%` } as React.CSSProperties} />
              <span>Recurring net value</span>
            </div>
          </div>
          <div className="investment-summary">
            <div><span>Year-one realization</span><b>{formatNumber(model.realization * 100)}%</b></div>
            <div><span>Implementation</span><b>{formatMoney(source.implementation)}</b></div>
            <div><span>Annual run cost</span><b>{formatMoney(source.run)}</b></div>
            <div><span>Three-year undiscounted net</span><b>{formatMoney(model.yearOne + model.recurring * 2 - source.implementation)}</b></div>
          </div>
        </div>
      </div>
      <p className="model-note"><CircleDot size={13} /> Illustrative management case, not a Euroma forecast. Replace every sample input with validated Euroma baselines; capacity value is redeployment potential, and only the modelled financing benefit—not the working-capital balance—is counted in recurring value.</p>
    </SectionFrame>
  );
}

function NextSection({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  return (
    <SectionFrame
      eyebrow="A practical next move"
      title="Start with one live process."
      intro="Choose the route with the shortest distance between today’s friction and a result people can see."
    >
      <div className="next-stage">
        <div className="next-primary">
          <div className="route-number">01</div>
          <span className="overline">Forward-deployed agent flow</span>
          <h2>Take one Euroma process from manual to controlled autonomy.</h2>
          <p>Map the work, name the human gates, connect the real systems and ship inside the operation. Brief-to-Contract and Order-to-Cash show the pattern.</p>
          <button type="button" className="text-link" onClick={() => onNavigate("b2c")}>Replay the live flow <ArrowUpRight size={17} /></button>
        </div>
        <div className="next-primary euromaiq-card">
          <div className="route-number">02</div>
          <div className="euroma-lockup"><img src={ASSETS.euroma} alt="Euroma logo" /><span>IQ</span></div>
          <span className="overline">Already live</span>
          <h2>Open the Euroma-branded ingredient and compliance engine.</h2>
          <p>EuromaIQ already exists at euroma.aromis.io. It is the fastest way to move from this pitch into a working product.</p>
          <a className="launch-button" href="https://euroma.aromis.io" target="_blank" rel="noreferrer">Open EuromaIQ <ArrowUpRight size={18} /></a>
        </div>
      </div>
      <div className="closing-line">
        <span>NEVODIA × EUROMA</span>
        <strong>Production AI. Human control.</strong>
        <span>2026</span>
      </div>
    </SectionFrame>
  );
}

function AppShell() {
  const [section, setSection] = useState<SectionId>("intro");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [lens, setLens] = useState<ExecutiveLens>("ceo");
  const currentIndex = navItems.findIndex((item) => item.id === section);

  useEffect(() => {
    const syncFullscreenState = () => {
      if (!document.fullscreenElement) setIsPresenting(false);
    };
    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () => document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, []);

  const togglePresentation = async () => {
    if (isPresenting) {
      if (document.fullscreenElement) await document.exitFullscreen();
      setIsPresenting(false);
      return;
    }

    setMobileOpen(false);
    setIsPresenting(true);
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // Keep the distraction-free in-page presentation layout when native fullscreen is unavailable.
      }
    }
  };

  const navigate = (id: SectionId) => {
    setSection(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderSection = () => {
    if (section === "intro") return <ProfileSection />;
    if (section === "tech") return <TechSection />;
    if (section === "b2c") return (
      <ProcessFlow
        steps={briefToContract}
        manualSteps={briefToContractManual}
        process="brief"
        lens={lens}
        eyebrow="Implemented at CPL Aromas"
        title="Brief to contract: before and today."
        intro="The manual process is the pre-transformation baseline. The interactive flow below is what runs at CPL today. Click any node or play the complete automated journey."
        before="Teams received the brief, entered it into CRM, acknowledged the sender, checked feasibility, searched the library and prepared the next action through separate manual hand-offs."
        today="Agents carry the brief from intake through CRM, acknowledgement, feasibility and library matching, while people retain approval over feasibility, matched formulations and customer quotes."
        checkpoints={["Human approval before feasible or decline", "Human approval of a library match before formulation details and quote are shared"]}
        outcomes={briefOutcomes}
      />
    );
    if (section === "o2c") return (
      <ProcessFlow
        steps={orderToCash}
        manualSteps={orderToCashManual}
        process="order"
        lens={lens}
        eyebrow="Implemented at CPL Aromas"
        title="Order to cash: before and today."
        intro="The manual process is the pre-transformation baseline. The interactive flow below shows the connected automation running at CPL today, from incoming PO to invoice."
        before="People moved the order between inboxes, CRM, order entry, credit, planning, procurement, factories, quality, shipping and invoicing, repeatedly checking status and re-entering information."
        today="Agents read and reconcile the PO, create and check the order, plan materials and capacity, create production, update the customer portal, coordinate quality and shipping, and trigger the invoice at goods issue."
        checkpoints={["PO discrepancies go to Customer Service for audit", "Credit failures go to Finance and the account manager", "Quality control is completed before shipping progresses"]}
        outcomes={orderOutcomes}
      />
    );
    if (section === "impact") return <ImpactSection lens={lens} />;
    return <NextSection onNavigate={navigate} />;
  };

  return (
    <div className={`app-shell ${isPresenting ? "presenting" : ""}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="site-header">
        <button className="brand-lockup" type="button" onClick={() => navigate("intro")} aria-label="Go to Alfred profile">
          <span className="nevodia-mark"><i>N</i><b>Nevodia</b></span>
          <span className="brand-cross">×</span>
          <img src={ASSETS.euroma} alt="Euroma" />
        </button>
        <button type="button" className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen}>
          <span>Navigate</span><ChevronDown size={17} />
        </button>
        <nav className={mobileOpen ? "open" : ""} aria-label="Pitch sections">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              className={section === item.id ? "active" : ""}
              onClick={() => navigate(item.id)}
            >
              <small>{item.kicker}</small>
              <span>{item.label}</span>
              {section === item.id && <motion.i layoutId="nav-indicator" />}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <div className="header-status"><i />LIVE SYSTEMS</div>
          <div className="lens-switch" role="group" aria-label="Executive perspective">
            <button type="button" className={lens === "ceo" ? "active" : ""} onClick={() => setLens("ceo")} aria-pressed={lens === "ceo"}>CEO</button>
            <button type="button" className={lens === "cfo" ? "active" : ""} onClick={() => setLens("cfo")} aria-pressed={lens === "cfo"}>CFO</button>
            <motion.i animate={{ x: lens === "ceo" ? 0 : "100%" }} transition={{ duration: .28, ease: [0.23, 1, 0.32, 1] }} />
          </div>
          <button type="button" className="presentation-button" onClick={togglePresentation} aria-pressed={isPresenting} title={isPresenting ? "Exit presentation mode" : "Enter full-screen presentation mode"}>
            {isPresenting ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            <span>{isPresenting ? "Exit full screen" : "Present"}</span>
          </button>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">{renderSection()}</AnimatePresence>
      </main>

      <footer className="site-footer">
        <span>{String(currentIndex + 1).padStart(2, "0")} / {String(navItems.length).padStart(2, "0")}</span>
        <div className="footer-progress"><motion.i animate={{ scaleX: (currentIndex + 1) / navItems.length }} /></div>
        <span>{navItems[currentIndex].label}</span>
      </footer>
    </div>
  );
}

export default function Home() {
  return <AppShell />;
}
