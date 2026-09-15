import { useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Banknote,
  BadgeCheck,
  Bot,
  Box,
  BrainCircuit,
  Check,
  ChevronDown,
  CircleDot,
  Cloud,
  Database,
  Factory,
  FileCheck2,
  Fingerprint,
  Gauge,
  GitBranch,
  Globe2,
  Hand,
  Layers3,
  LockKeyhole,
  Mail,
  MapPin,
  Maximize2,
  Minimize2,
  Network,
  Pause,
  Play,
  Radio,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Workflow,
  X,
  Zap,
} from "lucide-react";

const ASSETS = {
  euroma: "/manus-storage/euroma-logo_e0add910.jpg",
  cpl: "/manus-storage/cpl-aromas-purple-square_89f03cc9.jpg",
  symrise: "/manus-storage/symrise-logo-trimmed_ae94798c.png",
  levis: "/manus-storage/levi-strauss-logo_32a09afd.jpg",
  cognizant: "/manus-storage/cognizant-logo-trimmed_3611bfea.png",
  ntt: "/manus-storage/ntt-data-logo-trimmed_dc6d6fda.png",
  foundry: "/manus-storage/microsoft-foundry_b8befd3a.svg",
  copilotStudio: "/manus-storage/copilot-studio_cd239b87.png",
  fabric: "/manus-storage/microsoft-fabric_bb084905.svg",
  uipath: "/manus-storage/uipath_b6902e84.svg",
  langchain: "/manus-storage/langchain-lockup-black_23052684.svg",
  azure: "/manus-storage/microsoft-azure_7e3847cf.svg",
  whatsapp: "/manus-storage/whatsapp_9008dd98.svg",
  sap: "/manus-storage/sap_713309ae.svg",
  dynamics365: "/manus-storage/dynamics365_b2a9ff92.svg",
  fricke: "/manus-storage/fricke-full-logo_753621e3.svg",
  olfyneAward: "/manus-storage/olfyne-beautyworld-finalist-alfred_abe3e404.png",
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
    award: "Finalist · Tech Innovation of the Year · Beautyworld Middle East",
    awardImage: ASSETS.olfyneAward,
    demoTitle: "A creative brief becomes an intentional fragrance direction.",
    demo: "Olfyne brings generative and agentic intelligence into the perfumer’s workflow without removing authorship, judgement or the final creative decision.",
    steps: ["Structure the creative brief", "Explore governed directions", "Perfumer evaluates and decides"],
    result: "Faster creative exploration with the perfumer visibly in control.",
    icon: Sparkles,
  },
  {
    name: "CortiSleeve",
    meta: "Human intent layer",
    copy: "Patent-pending middleware that keeps human intent inside autonomous agent loops.",
    demoTitle: "Human intent becomes an enforceable runtime boundary.",
    demo: "CortiSleeve carries purpose, constraints and escalation rules through an agent workflow so autonomy cannot quietly drift away from the original human instruction.",
    steps: ["Capture intent and boundaries", "Monitor agent decisions", "Stop, explain or escalate"],
    result: "Autonomy that remains accountable to the person who initiated the work.",
    icon: Fingerprint,
  },
  {
    name: "Trend Analysis MCP",
    meta: "Signal intelligence",
    copy: "An MCP-powered trend engine that turns live market signals into structured beauty and fragrance intelligence.",
    demoTitle: "Fragmented market signals become a decision-ready trend brief.",
    demo: "Trend Analysis MCP gives agents a structured route into current beauty, fragrance and consumer signals, then shapes the evidence into a consistent intelligence output.",
    steps: ["Collect live market signals", "Cluster themes and momentum", "Publish a sourced trend brief"],
    result: "A repeatable intelligence layer for creative and commercial decisions.",
    icon: Network,
  },
];

const career = [
  {
    name: "CPL Aromas",
    role: "CIO & Global Operating Board Member",
    years: "2017 — present",
    locations: ["London"],
    logo: ASSETS.cpl,
    copy: "Own enterprise AI and technology strategy across 18+ countries. Built production systems for perfumery, formulation, regulatory work and predictive stability; deployed Copilot and Azure AI Foundry; created custom agents in Copilot Studio; established a Microsoft Fabric data lake; and moved the estate away from fully on-premise infrastructure.",
  },
  {
    name: "Symrise",
    role: "Global Head of Digitalization & IT Director",
    years: "2012 — 2017",
    locations: ["Singapore"],
    logo: ASSETS.symrise,
    copy: "Led the SAP rollout across the APAC region, global innovation and big-data programmes, reporting to the Global CIO and Flavor Division President. Worked on an early AI bot for perfume creation and implemented EEG-based consumer panel testing for the Fragrance Division.",
  },
  {
    name: "Levi Strauss & Co.",
    role: "Enterprise systems & consulting leadership",
    years: "2010 — 2012",
    locations: ["Singapore", "San Francisco"],
    logo: ASSETS.levis,
    copy: "A two-year chapter in SAP, ERP and global transformation delivery across Singapore and San Francisco, progressing from hands-on consulting into programme and practice leadership.",
  },
  {
    name: "Cognizant",
    role: "Enterprise systems & consulting leadership",
    years: "2008 — 2010",
    locations: ["Philadelphia"],
    logo: ASSETS.cognizant,
    copy: "Multi-country enterprise delivery and architecture discipline across global clients, with a focus on systems that had to work in the real operating environment.",
  },
  {
    name: "Caritor / NTT DATA",
    role: "Global delivery",
    years: "2002 — 2007",
    locations: ["India", "France", "Spain"],
    logo: ASSETS.ntt,
    copy: "The early consulting chapter: enterprise systems, global delivery and the operational discipline that still underpins every agent programme today.",
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

type PlatformKey = "foundry" | "copilot" | "fabric" | "uipath" | "langchain" | "azure";

const platformStack: { key: PlatformKey; name: string; role: string; logo: string; layer: string; copy: string }[] = [
  { key: "foundry", name: "Microsoft Foundry", role: "Model and agent runtime", logo: ASSETS.foundry, layer: "Intelligence plane", copy: "Enterprise models, evaluations and agent runtimes are managed as a reusable production capability." },
  { key: "copilot", name: "Copilot Studio", role: "Agent build and channels", logo: ASSETS.copilotStudio, layer: "Agent experience", copy: "Scoped agents are assembled, governed and connected to the human channels where work already arrives." },
  { key: "langchain", name: "LangChain", role: "Multi-agent orchestration", logo: ASSETS.langchain, layer: "Decision fabric", copy: "Agent jobs branch, call tools, preserve state, escalate and resume without turning one prompt into an uncontrolled workflow." },
  { key: "fabric", name: "Microsoft Fabric", role: "Governed operational context", logo: ASSETS.fabric, layer: "Data foundation", copy: "Customer, quote, inventory, capacity and production events become one governed context plane for every agent." },
  { key: "uipath", name: "UiPath", role: "System action and documents", logo: ASSETS.uipath, layer: "Execution layer", copy: "RPA and document automation handle deterministic system work, while agents retain bounded decision responsibilities." },
  { key: "azure", name: "Microsoft Azure", role: "Secure cloud foundation", logo: ASSETS.azure, layer: "Trust boundary", copy: "Identity, security, observability, residency and scale sit beneath every model, agent and automation." },
];

const swarmAgents: { name: string; domain: string; job: string; platform: PlatformKey; event: string; ring: "inner" | "outer" }[] = [
  { name: "Brief Intake", domain: "B2C", job: "Structures incoming briefs and creates the first governed record.", platform: "copilot", event: "New brief classified · CRM write queued", ring: "outer" },
  { name: "Feasibility", domain: "B2C", job: "Tests whether the request can be delivered and prepares the approval case.", platform: "foundry", event: "12 constraints evaluated · approval required", ring: "inner" },
  { name: "Library Match", domain: "B2C", job: "Searches existing formulae before new perfumer work is created.", platform: "fabric", event: "1,842 formulations searched · 3 candidates", ring: "outer" },
  { name: "Quote Match", domain: "O2C", job: "Reconciles every PO line against the governed commercial quote.", platform: "langchain", event: "PO CO-78431 · variance branch opened", ring: "inner" },
  { name: "Order Creation", domain: "O2C", job: "Creates the order only after quote and credit controls clear.", platform: "uipath", event: "ERP transaction staged · control passed", ring: "outer" },
  { name: "Mini-MRP", domain: "O2C", job: "Evaluates stock, safety stock, open POs, lead time and factory capacity.", platform: "fabric", event: "RM available · promise date calculated", ring: "inner" },
  { name: "Production Planner", domain: "Factory", job: "Resolves solution/base requirements and releases the complete production route.", platform: "langchain", event: "BOM exploded · route sent to factory", ring: "outer" },
  { name: "Status", domain: "Customer", job: "Turns dosing, finishing, packing and QC movements into live customer visibility.", platform: "copilot", event: "Portal updated · production in progress", ring: "inner" },
  { name: "Shipping", domain: "Logistics", job: "Creates shipping and customs documents from controlled order data.", platform: "uipath", event: "Export document pack generated", ring: "outer" },
  { name: "Invoice", domain: "Finance", job: "Listens for goods issue and dispatches the completed invoice automatically.", platform: "azure", event: "Goods issue received · invoice delivered", ring: "inner" },
];

type EndpointKey = "email" | "whatsapp" | "crm" | "erp" | "factory" | "portal";
type TransactionStage = {
  title: string;
  system: string;
  detail: string;
  agent?: number;
  platform: PlatformKey;
  endpoint?: EndpointKey;
  human?: boolean;
  packet: string;
  path: string;
};

const enterpriseEndpoints: { key: EndpointKey; name: string; role: string; icon: ElementType; logo?: string }[] = [
  { key: "email", name: "Email", role: "PO intake · confirmation", icon: Mail },
  { key: "whatsapp", name: "WhatsApp", role: "Regional PO channel", icon: Radio, logo: ASSETS.whatsapp },
  { key: "crm", name: "Dynamics 365", role: "CRM · quote · customer", icon: BadgeCheck, logo: ASSETS.dynamics365 },
  { key: "erp", name: "SAP", role: "ERP · order · credit · invoice", icon: Database, logo: ASSETS.sap },
  { key: "factory", name: "Fricke", role: "Dosing · production · status", icon: Factory, logo: ASSETS.fricke },
  { key: "portal", name: "Customer Portal", role: "Live order status", icon: Globe2 },
];

const transactionJourney: TransactionStage[] = [
  { title: "Purchase order received", system: "Email channel", detail: "PO CO-78431 arrives as a PDF and becomes a governed transaction packet.", platform: "copilot", endpoint: "email", packet: "PO · CO-78431", path: "M83 176 C165 176 235 112 332 91" },
  { title: "Document read", system: "UiPath AI OCR", detail: "Customer, product, quantity, requested date and commercial lines are extracted with source evidence.", agent: 3, platform: "uipath", packet: "OCR · 98.7%", path: "M332 91 C390 150 455 245 500 325" },
  { title: "Customer and quote context", system: "Dynamics 365 + Microsoft Fabric", detail: "The packet retrieves the governed Dynamics 365 customer account and quote Q-78142 before any order is created.", platform: "fabric", endpoint: "crm", packet: "QUOTE · Q-78142", path: "M500 325 C365 330 225 290 83 268" },
  { title: "Quote matched", system: "Quote Match Agent", detail: "Every PO line is reconciled against the approved quote, including price, currency, quantity and delivery terms.", agent: 3, platform: "langchain", packet: "MATCH · 4/4", path: "M83 268 C270 270 470 160 669 91" },
  { title: "Commercial control", system: "Named human approval", detail: "The price variance is contained. Customer Service approves the correction before automation may continue.", platform: "foundry", human: true, packet: "HOLD · +£45.60", path: "M669 91 C610 130 550 175 500 201" },
  { title: "Order and credit created", system: "SAP ERP", detail: "UiPath creates the order and SAP performs the automatic credit check against controlled master data.", agent: 4, platform: "uipath", endpoint: "erp", packet: "SO · 54001982", path: "M500 201 C650 220 800 270 916 319" },
  { title: "Mini-MRP and promise", system: "Mini-MRP Agent", detail: "Raw material, safety stock, open POs, vendor lead time and factory capacity resolve the promise date.", agent: 5, platform: "fabric", packet: "PROMISE · 24 SEP", path: "M916 319 C760 390 640 510 500 591" },
  { title: "Production route released", system: "Fricke production system", detail: "The BOM and solution/base route are created and released to the correct Fricke work centre.", agent: 6, platform: "langchain", endpoint: "factory", packet: "PROD · 870144", path: "M500 591 C650 560 790 440 916 365" },
  { title: "Production and QC tracked", system: "Fricke + Status Agent", detail: "Fricke dosing and production movements, followed by packing and QC events, update the order state and customer portal continuously.", agent: 7, platform: "copilot", endpoint: "factory", packet: "QC · RELEASED", path: "M916 365 C730 300 520 210 332 91" },
  { title: "Live status published", system: "Status Agent + Customer Portal", detail: "The Status Agent converts controlled SAP, Fricke, packing and QC events into a real-time customer timeline with source and timestamp intact.", agent: 7, platform: "copilot", endpoint: "portal", packet: "PORTAL · 5 EVENTS", path: "M916 365 C700 470 350 455 83 347" },
  { title: "Goods issue and invoice", system: "SAP ERP + Invoice Agent", detail: "Goods issue closes fulfilment, generates the invoice and writes the financial event back to SAP.", agent: 9, platform: "azure", endpoint: "erp", packet: "INV · 920184", path: "M332 91 C210 390 275 590 500 591 C700 590 780 380 916 319" },
  { title: "Customer confirmation sent", system: "Email channel", detail: "Order confirmation, shipping documents and invoice leave through the customer channel with a complete audit trail.", agent: 8, platform: "uipath", endpoint: "email", packet: "COMPLETE · 12 EVENTS", path: "M916 319 C700 200 350 120 83 176" },
];

const portalStatusEvents = [
  { time: "09:42:16", label: "Order accepted", source: "SAP" },
  { time: "09:42:18", label: "Materials secured", source: "Mini-MRP" },
  { time: "11:08:04", label: "Production started", source: "Fricke" },
  { time: "14:26:51", label: "Packing complete", source: "Fricke" },
  { time: "15:03:27", label: "QC released", source: "QC system" },
];

const portalTransactionStage = transactionJourney.findIndex((stage) => stage.endpoint === "portal");

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

// Illustrative active-processing allocations. They are intentionally non-uniform and sum to the stated end-to-end comparison.
const briefAutomatedStepSeconds = [8, 14, 6, 27, 39, 26];
const briefManualStepSeconds = [3, 5, 2, 17, 8, 13].map((hours) => hours * 3600);

const briefOutcomes: Outcome[] = [
  { value: "Cycle time", label: "brief-to-decision cycle", copy: "CRM entry, acknowledgement, feasibility and matching start without waiting for separate manual hand-offs." },
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

// Processing effort only: physical manufacturing, production queues and delivery transit are outside this illustrated clock.
const orderAutomatedStepSeconds = [7, 5, 24, 18, 29, 28, 9, 12, 17, 19, 12];
const orderManualStepSeconds = [4, 8, 9, 6, 10, 11, 4, 5, 4, 7, 4].map((hours) => hours * 3600);

const orderOutcomes: Outcome[] = [
  { value: "Cycle time", label: "illustrative processing cycle", copy: "The comparison covers administrative and agent processing; physical manufacturing, production queues and delivery transit are excluded." },
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

const discrepancyResolutions = [
  {
    id: "correct",
    title: "Correct PO to contracted quote",
    owner: "Customer Service · Colombia",
    detail: "Apply £27.00/kg from CRM quote Q-78142 and preserve the agreed commercial position.",
    impact: "£45.60 variance removed",
    recommended: true,
  },
  {
    id: "accept",
    title: "Accept the PO price",
    owner: "Account manager approval",
    detail: "Accept £27.76/kg, document the commercial exception and retain the higher order value.",
    impact: "+£45.60 order value",
    recommended: false,
  },
  {
    id: "return",
    title: "Request a revised PO",
    owner: "Customer action required",
    detail: "Keep order creation blocked and send the evidence packet. The demonstration resumes after simulating receipt of the revised PO.",
    impact: "Promise date held",
    recommended: false,
  },
] as const;

function OrderDigitalTwin({ lens }: { lens: ExecutiveLens }) {
  const [scenario, setScenario] = useState<"straight" | "exception">("exception");
  const [active, setActive] = useState(-1);
  const [running, setRunning] = useState(false);
  const [resolution, setResolution] = useState<(typeof discrepancyResolutions)[number]["id"]>("correct");
  const reduced = useReducedMotion();
  const selectedResolution = discrepancyResolutions.find((item) => item.id === resolution)!;

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
        copy: `Customer Service records “${selectedResolution.title}” and releases the transaction with a named decision in the audit trail.`,
        customer: "Exception resolved",
        minutes: 5,
        human: true,
      },
      ...orderTwinEvents.slice(3).map((event) => ({ ...event, minutes: event.minutes + 3 })),
    ];
  }, [scenario, selectedResolution.title]);

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
    setResolution("correct");
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
  const exceptionVisible = scenario === "exception" && active >= 3;
  const exceptionResolved = scenario === "exception" && active >= 4;

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
          <button type="button" className="run-button twin-run" onClick={run} disabled={!!current?.exception}>
            {current?.exception ? <LockKeyhole size={15} /> : running ? <Pause size={15} /> : completed ? <RefreshCw size={15} /> : <Play size={15} fill="currentColor" />}
            {current?.exception ? "Awaiting human" : running ? "Pause order" : completed ? "Replay order" : "Run live order"}
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
                <button type="button" className="twin-approval" onClick={() => document.querySelector(".exception-protocol")?.scrollIntoView({ behavior: "smooth", block: "center" })}>
                  <AlertTriangle size={15} />Review exception protocol
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

        <AnimatePresence>
          {exceptionVisible && (
            <motion.div
              className={`exception-protocol ${exceptionResolved ? "resolved" : ""}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: .38, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="exception-header">
                <div>
                  <span><AlertTriangle size={14} />EXCEPTION / EX-24091</span>
                  <h3>{exceptionResolved ? "Decision recorded. Control released." : "Commercial price variance requires a person."}</h3>
                </div>
                <div className="exception-owner">
                  <span>Assigned owner</span><strong>Customer Service · Colombia</strong><b>{exceptionResolved ? "RESOLVED · T+05 MIN" : "SLA · 15 MIN"}</b>
                </div>
              </div>

              <div className="evidence-grid">
                <div className="evidence-card">
                  <span>01 · Source evidence</span>
                  <div><small>CRM QUOTE · Q-78142</small><strong>Amber Solution 12</strong><p><b>60 KG</b><em>£27.00 / KG</em></p></div>
                  <div className="evidence-po"><small>CUSTOMER PO · CO-78431</small><strong>Amber Solution 12</strong><p><b>60 KG</b><em>£27.76 / KG</em></p></div>
                </div>
                <div className="exposure-card">
                  <span>02 · Financial exposure</span>
                  <strong>+2.8%</strong>
                  <p>Unit variance <b>+£0.76/kg</b></p>
                  <p>Order-line exposure <b>£45.60</b></p>
                  <p>Downstream posting <b>blocked</b></p>
                </div>
                <div className="containment-card">
                  <span>03 · Automatic containment</span>
                  <div><LockKeyhole size={16} /><p><strong>Order creation frozen</strong><small>No ERP posting or credit consumption.</small></p></div>
                  <div><ShieldCheck size={16} /><p><strong>Promise protected</strong><small>Customer sees “validation paused.”</small></p></div>
                  <div><UserCheck size={16} /><p><strong>Owner routed</strong><small>Evidence sent to the correct CS queue.</small></p></div>
                </div>
              </div>

              <div className="protocol-track" aria-label="Discrepancy handling stages">
                {["Detect variance", "Contain transaction", "Assemble evidence", "Human decision", "Write back", "Resume flow"].map((stage, index) => {
                  const state = active >= 5 ? "done" : exceptionResolved ? (index < 4 ? "done" : index === 4 ? "live" : "wait") : index < 3 ? "done" : index === 3 ? "live" : "wait";
                  return <div className={state} key={stage}><span>{String(index + 1).padStart(2, "0")}</span><i /><strong>{stage}</strong><small>{state === "done" ? "Complete" : state === "live" ? "In control" : "Waiting"}</small></div>;
                })}
              </div>

              <div className="resolution-section">
                <div className="resolution-heading">
                  <div><span>04 · Human decision</span><h4>{exceptionResolved ? selectedResolution.title : "Choose the authorised resolution."}</h4></div>
                  <p>Agents provide evidence and enforce the hold. A named person owns the commercial decision.</p>
                </div>
                <div className="resolution-grid">
                  {discrepancyResolutions.map((option) => (
                    <button type="button" key={option.id} className={`${resolution === option.id ? "active" : ""} ${option.recommended ? "recommended" : ""}`} onClick={() => !exceptionResolved && setResolution(option.id)} disabled={exceptionResolved}>
                      <span>{option.recommended ? "Recommended" : option.owner}</span>
                      <strong>{option.title}</strong>
                      <p>{option.detail}</p>
                      <b>{option.impact}</b>
                    </button>
                  ))}
                </div>
                {!exceptionResolved ? (
                  <button type="button" className="record-decision" onClick={approveException}><FileCheck2 size={16} />Record “{selectedResolution.title}” & continue</button>
                ) : (
                  <div className="writeback-receipt">
                    <div><BadgeCheck size={19} /><span>CONTROL RECEIPT</span><b>DECISION IMMUTABLE</b></div>
                    <p><strong>{selectedResolution.title}</strong> recorded by Customer Service · Colombia at T+05. CRM quote evidence, PO exception, decision reason and owner written to audit ID <b>EX-24091</b>. Order Creation Agent released.</p>
                    <div className="writeback-systems"><span>CRM exception log · updated</span><span>Customer portal · resolved</span><span>LangChain branch · released</span><span>UiPath order entry · resumed</span></div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
  const [activeVenture, setActiveVenture] = useState<number | null>(() => {
    const requested = new URLSearchParams(window.location.search).get("venture");
    const index = ventures.findIndex((venture) => venture.name.toLowerCase().replace(/\s+/g, "-") === requested);
    return index >= 0 ? index : null;
  });
  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const selectedVenture = activeVenture === null ? null : ventures[activeVenture];
  const SelectedVentureIcon = selectedVenture?.icon ?? Sparkles;

  useEffect(() => {
    if (activeVenture === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => modalCloseRef.current?.focus(), 50);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveVenture(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeVenture]);

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
          <div className="eyebrow"><span />Real-world impact, delivered today</div>
          <h1>The agents are<br /><em>live.</em></h1>
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

      <motion.div className="profile-statement alfred-highlight" whileHover={{ y: -3 }} transition={{ duration: .22 }}>
        <span className="statement-index">ALFRED / 01</span>
        <p>
          CIO and Global Operating Board Member at CPL Aromas. Former Global Head of Digitalization at Symrise. I understand the full flavour and fragrance value chain, and I still build.
        </p>
      </motion.div>

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
              <motion.button
                type="button"
                key={venture.name}
                className={`venture-card ${venture.name === "Trend Analysis MCP" ? "trend-card" : ""}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 + index * 0.08 }}
                whileHover={{ y: -5 }}
                onClick={() => setActiveVenture(index)}
                aria-haspopup="dialog"
                aria-label={`Open ${venture.name} product summary`}
              >
                <div className="venture-top"><Icon size={20} /><span>0{index + 1}</span></div>
                <span className="overline">{venture.meta}</span>
                <h3>{venture.name}</h3>
                <p>{venture.copy}</p>
                {venture.award && <div className="venture-award"><img src={venture.awardImage} alt="Beautyworld Dubai Awards 2026 finalist announcement" /><span>{venture.award}</span></div>}
                <div className="venture-open"><span>Open product brief</span><ArrowUpRight size={14} /></div>
              </motion.button>
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
              <div className="brand-tile-footer">
                <span>{item.years}</span>
                <small><MapPin size={9} />{item.locations.length === 1 ? item.locations[0] : `${item.locations.length} locations`}</small>
              </div>
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
              <div className="career-locations" aria-label={`${career[activeCareer].name} locations`}>
                {career[activeCareer].locations.map((location) => <span key={location}><MapPin size={12} />{location}</span>)}
              </div>
            </div>
            <p>{career[activeCareer].copy}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedVenture && (
          <motion.div className="venture-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setActiveVenture(null)}>
            <motion.div
              className={`venture-modal ${selectedVenture.name === "Trend Analysis MCP" ? "trend-modal" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="venture-modal-title"
              initial={{ opacity: 0, y: 18, scale: .97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: .98 }}
              transition={{ duration: .24 }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button ref={modalCloseRef} type="button" className="venture-modal-close" onClick={() => setActiveVenture(null)} aria-label="Close product summary"><X size={18} /></button>
              <div className="venture-modal-copy">
                <span className="overline">{selectedVenture.meta}</span>
                <h2 id="venture-modal-title">{selectedVenture.name}</h2>
                <h3>{selectedVenture.demoTitle}</h3>
                <p>{selectedVenture.demo}</p>
                <div className="venture-demo-flow">
                  {selectedVenture.steps.map((step, index) => <div key={step}><span>0{index + 1}</span><i /><strong>{step}</strong></div>)}
                </div>
                <div className="venture-result"><BadgeCheck size={16} /><div><span>Result</span><strong>{selectedVenture.result}</strong></div></div>
              </div>
              <div className="venture-modal-visual">
                {selectedVenture.awardImage ? (
                  <div className="award-feature"><img src={selectedVenture.awardImage} alt="Olfyne finalist for Technology Innovation of the Year at Beautyworld Dubai Awards 2026" /><span>Official finalist announcement</span></div>
                ) : (
                  <div className="venture-demo-orbit">
                    <div className="demo-orbit-ring ring-one" /><div className="demo-orbit-ring ring-two" />
                    <span className="demo-signal signal-one" /><span className="demo-signal signal-two" /><span className="demo-signal signal-three" />
                    <div className="demo-core"><SelectedVentureIcon size={24} /><strong>{selectedVenture.name}</strong><small>LIVE PRODUCT PATTERN</small></div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function TechSection() {
  const portalDemo = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demo") === "portal";
  const [activePlatform, setActivePlatform] = useState<PlatformKey>("copilot");
  const [activeAgent, setActiveAgent] = useState(0);
  const [swarmRunning, setSwarmRunning] = useState(!portalDemo);
  const [transactionStage, setTransactionStage] = useState(portalDemo ? portalTransactionStage : -1);
  const [transactionRunning, setTransactionRunning] = useState(false);
  const [transactionApproved, setTransactionApproved] = useState(false);
  const [transactionChannel, setTransactionChannel] = useState<"email" | "whatsapp">("email");
  const reduced = useReducedMotion();
  const currentTransaction = transactionStage >= 0 ? transactionJourney[transactionStage] : null;
  const displayedAgentIndex = currentTransaction?.agent ?? activeAgent;
  const selectedAgent = swarmAgents[displayedAgentIndex];
  const transactionActive = currentTransaction !== null;
  const transactionComplete = transactionStage === transactionJourney.length - 1 && !transactionRunning;
  const displayedEndpoint = currentTransaction?.endpoint === "email" && (transactionStage === 0 || transactionStage === transactionJourney.length - 1) ? transactionChannel : currentTransaction?.endpoint;
  const transactionPath = currentTransaction && transactionChannel === "whatsapp" && transactionStage === 0
    ? "M83 222 C170 220 245 125 332 91"
    : currentTransaction && transactionChannel === "whatsapp" && transactionStage === transactionJourney.length - 1
      ? "M916 319 C700 225 350 185 83 222"
      : currentTransaction?.path;
  const displayedPlatformKey = currentTransaction?.platform ?? (swarmRunning ? selectedAgent.platform : activePlatform);
  const selectedPlatform = platformStack.find((platform) => platform.key === displayedPlatformKey)!;
  const layerPlatform: PlatformKey[] = ["copilot", "langchain", "foundry", "uipath", "fabric", "azure"];

  useEffect(() => {
    if (!swarmRunning || transactionActive) return;
    const timer = window.setInterval(() => {
      setActiveAgent((current) => (current + 1) % swarmAgents.length);
    }, reduced ? 400 : 2200);
    return () => window.clearInterval(timer);
  }, [reduced, swarmRunning, transactionActive]);

  useEffect(() => {
    if (!transactionRunning || !currentTransaction) return;
    if (currentTransaction.human && !transactionApproved) return;
    const timer = window.setTimeout(() => {
      if (transactionStage >= transactionJourney.length - 1) {
        setTransactionRunning(false);
        return;
      }
      setTransactionStage((stage) => stage + 1);
    }, reduced ? 320 : 1850);
    return () => window.clearTimeout(timer);
  }, [currentTransaction, reduced, transactionApproved, transactionRunning, transactionStage]);

  const inspectPlatform = (key: PlatformKey) => {
    setTransactionStage(-1);
    setTransactionRunning(false);
    setSwarmRunning(false);
    setActivePlatform(key);
    const matchingAgent = swarmAgents.findIndex((agent) => agent.platform === key);
    if (matchingAgent >= 0) setActiveAgent(matchingAgent);
  };

  const inspectAgent = (index: number) => {
    setTransactionStage(-1);
    setTransactionRunning(false);
    setSwarmRunning(false);
    setActiveAgent(index);
    setActivePlatform(swarmAgents[index].platform);
  };

  const toggleSwarm = () => {
    if (transactionActive) return;
    if (swarmRunning) {
      setActivePlatform(selectedAgent.platform);
      setSwarmRunning(false);
      return;
    }
    setSwarmRunning(true);
  };

  const runTransaction = () => {
    setSwarmRunning(false);
    setTransactionApproved(false);
    setTransactionStage(0);
    setTransactionRunning(true);
  };

  const toggleTransaction = () => {
    if (!transactionActive || transactionComplete) {
      runTransaction();
      return;
    }
    setTransactionRunning((running) => !running);
  };

  const approveTransaction = () => {
    if (!currentTransaction?.human) return;
    setTransactionApproved(true);
    setTransactionStage((stage) => Math.min(stage + 1, transactionJourney.length - 1));
    setTransactionRunning(true);
  };

  const exitTransaction = () => {
    setTransactionStage(-1);
    setTransactionRunning(false);
    setTransactionApproved(false);
    setSwarmRunning(true);
  };

  return (
    <SectionFrame
      eyebrow="The production platform"
      title="A single agentic platform."
      intro="They swarm around one governed enterprise platform—sharing models, context, controls and system access while each agent keeps a narrow operating job."
    >
      <div className="platform-shell">
        <div className="platform-topbar">
          <div><i /><span>EUROMA AGENT PLATFORM</span><b>PRODUCTION PATTERN</b></div>
          <div className="platform-stats"><span><strong>10</strong> agents online</span><span><strong>6</strong> shared services</span><span><strong>2</strong> flows live</span></div>
          <button type="button" onClick={toggleSwarm} disabled={transactionActive}>
            {transactionActive ? <CircleDot size={14} /> : swarmRunning ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}{transactionActive ? "Journey active" : swarmRunning ? "Pause swarm" : "Run swarm"}
          </button>
        </div>

        <div className={`transaction-console ${transactionActive ? "active" : ""} ${currentTransaction?.human ? "control" : ""}`}>
          <div className="transaction-intro">
            <span><Zap size={14} />Follow one order</span>
            <strong>{transactionActive ? currentTransaction.title : "Watch a customer PO cross the entire platform."}</strong>
          </div>
          <div className="transaction-channel" aria-label="Transaction intake channel">
            <button type="button" className={transactionChannel === "email" ? "active" : ""} onClick={() => setTransactionChannel("email")} disabled={transactionActive && transactionStage > 0}><Mail size={13} />Email</button>
            <button type="button" className={transactionChannel === "whatsapp" ? "active" : ""} onClick={() => setTransactionChannel("whatsapp")} disabled={transactionActive && transactionStage > 0}><img src={ASSETS.whatsapp} alt="" />WhatsApp</button>
          </div>
          <div className="transaction-progress">
            <div><span>{transactionActive ? `Stage ${String(transactionStage + 1).padStart(2, "0")} / ${transactionJourney.length}` : "Ready to trace"}</span><b>{transactionActive ? currentTransaction.system : "PO CO-78431 · Colombia"}</b></div>
            <div className="transaction-progress-rail"><i style={{ transform: `scaleX(${transactionActive ? (transactionStage + 1) / transactionJourney.length : 0})` }} /></div>
          </div>
          <div className="transaction-actions">
            {currentTransaction?.human && !transactionApproved ? (
              <button type="button" className="transaction-approve" onClick={approveTransaction}><UserCheck size={14} />Approve correction</button>
            ) : (
              <button type="button" className="transaction-run" onClick={toggleTransaction}>
                {transactionRunning ? <Pause size={14} /> : transactionComplete ? <RefreshCw size={14} /> : <Play size={14} fill="currentColor" />}
                {transactionRunning ? "Pause journey" : transactionComplete ? "Replay journey" : transactionActive ? "Resume journey" : "Run journey"}
              </button>
            )}
            {transactionActive && <button type="button" className="transaction-exit" onClick={exitTransaction}>Exit</button>}
          </div>
        </div>

        <div className="platform-workspace">
          <div className={`platform-map ${swarmRunning && !transactionActive ? "running" : "paused"} ${transactionActive ? "transaction-mode" : ""}`}>
            <div className="platform-gridlines" />
            <div className="azure-perimeter"><Cloud size={14} /><span>AZURE SECURITY · IDENTITY · OBSERVABILITY · RESIDENCY</span></div>
            <div className="platform-orbit orbit-outer" />
            <div className="platform-orbit orbit-inner" />
            <svg className="platform-connections" viewBox="0 0 1000 650" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="platformLine" x1="0" x2="1"><stop offset="0" stopColor="#e7b96a" stopOpacity=".08" /><stop offset=".5" stopColor="#e7b96a" stopOpacity=".68" /><stop offset="1" stopColor="#9fc46b" stopOpacity=".12" /></linearGradient>
                <filter id="platformGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              {[
                "M500 325 C420 250 330 205 215 145",
                "M500 325 C580 245 680 205 800 150",
                "M500 325 C500 420 500 500 500 570",
                "M500 325 C620 345 715 405 825 475",
                "M500 325 C385 350 285 410 175 480",
              ].map((path, index) => <motion.path key={path} d={path} fill="none" stroke="url(#platformLine)" strokeWidth="1.4" strokeDasharray="7 11" animate={{ strokeDashoffset: [0, -72] }} transition={{ duration: 3.8 + index * .35, repeat: Infinity, ease: "linear" }} />)}
              {[
                { path: "M500 325 C420 250 330 205 215 145", delay: 0 },
                { path: "M500 325 C580 245 680 205 800 150", delay: .8 },
                { path: "M500 325 C500 420 500 500 500 570", delay: 1.5 },
                { path: "M500 325 C620 345 715 405 825 475", delay: .3 },
                { path: "M500 325 C385 350 285 410 175 480", delay: 1.1 },
              ].map((signal) => (
                <circle key={signal.path} r="4" fill="#e7b96a" filter="url(#platformGlow)">
                  <animateMotion dur="4.2s" begin={`${signal.delay}s`} repeatCount={reduced ? "0" : "indefinite"} path={signal.path} />
                </circle>
              ))}
              {currentTransaction && transactionPath && (
                <g className="transaction-route" key={`${transactionStage}-${transactionChannel}`}>
                  <motion.path d={transactionPath} fill="none" stroke="#f1c36f" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0, opacity: .25 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: reduced ? .12 : 1.15, ease: "easeInOut" }} />
                  <circle r="8" fill="#0b0d0a" stroke="#f1c36f" strokeWidth="2" filter="url(#platformGlow)">
                    <animateMotion dur={reduced ? ".12s" : "1.15s"} repeatCount="1" fill="freeze" path={transactionPath} />
                  </circle>
                  <circle r="3" fill="#f1c36f">
                    <animateMotion dur={reduced ? ".12s" : "1.15s"} repeatCount="1" fill="freeze" path={transactionPath} />
                  </circle>
                </g>
              )}
            </svg>

            <div className="endpoint-rail endpoint-rail-left" aria-label="Customer and commercial systems">
              {enterpriseEndpoints.filter((endpoint) => ["email", "whatsapp", "crm", "portal"].includes(endpoint.key)).map((endpoint) => {
                const EndpointIcon = endpoint.icon;
                return (
                  <div key={endpoint.key} className={`enterprise-endpoint endpoint-${endpoint.key} ${displayedEndpoint === endpoint.key ? "active" : ""}`}>
                    <span>{endpoint.logo ? <img src={endpoint.logo} alt={`${endpoint.name} logo`} /> : <EndpointIcon size={15} />}</span>
                    <div><strong>{endpoint.name}</strong><small>{endpoint.role}</small></div><i />
                  </div>
                );
              })}
            </div>
            <div className="endpoint-rail endpoint-rail-right" aria-label="ERP and factory systems">
              {enterpriseEndpoints.filter((endpoint) => ["erp", "factory"].includes(endpoint.key)).map((endpoint) => {
                const EndpointIcon = endpoint.icon;
                return (
                  <div key={endpoint.key} className={`enterprise-endpoint endpoint-${endpoint.key} ${displayedEndpoint === endpoint.key ? "active" : ""}`}>
                    <span>{endpoint.logo ? <img src={endpoint.logo} alt={`${endpoint.name} logo`} /> : <EndpointIcon size={15} />}</span>
                    <div><strong>{endpoint.name}</strong><small>{endpoint.role}</small></div><i />
                  </div>
                );
              })}
            </div>

            <button type="button" className={`human-control-node ${currentTransaction?.human ? "active" : ""}`} onClick={approveTransaction} disabled={!currentTransaction?.human}><UserCheck size={17} /><span>{currentTransaction?.human ? "APPROVAL REQUIRED" : "HUMAN CONTROL"}</span><b>{currentTransaction?.human ? "RELEASE ORDER" : "NAMED APPROVALS"}</b></button>

            {platformStack.map((platform) => (
              <motion.button
                type="button"
                key={platform.key}
                className={`platform-node node-${platform.key} ${displayedPlatformKey === platform.key ? "active" : ""}`}
                onClick={() => inspectPlatform(platform.key)}
                aria-pressed={activePlatform === platform.key}
              >
                <span className={`platform-logo platform-logo-${platform.key}`}><img src={platform.logo} alt={`${platform.name} logo`} /></span>
                <span className="platform-node-copy"><strong>{platform.name}</strong><small>{platform.role}</small></span>
                <i />
              </motion.button>
            ))}

            {swarmAgents.map((agent, index) => {
              const ringIndex = swarmAgents.slice(0, index).filter((item) => item.ring === agent.ring).length;
              return (
                <div
                  className={`swarm-path ${agent.ring} ${swarmRunning ? "moving" : ""}`}
                  key={agent.name}
                  style={{ "--agent-delay": `${ringIndex * (agent.ring === "outer" ? -7.2 : -4.8)}s` } as React.CSSProperties}
                >
                  <div className="swarm-upright">
                    <motion.button
                      type="button"
                      className={`swarm-agent ${(transactionActive ? currentTransaction?.agent === index : activeAgent === index) ? "active" : ""}`}
                      onClick={() => inspectAgent(index)}
                      animate={activeAgent === index ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                      transition={{ duration: .6 }}
                      aria-label={`Inspect ${agent.name} agent`}
                    >
                      <span><Bot size={12} /></span><strong>{agent.name}</strong><small>{agent.domain}</small>
                    </motion.button>
                  </div>
                </div>
              );
            })}

            {currentTransaction && <div className={`transaction-packet ${currentTransaction.human ? "held" : ""}`}><span>{currentTransaction.packet}</span><b>{currentTransaction.human ? "CONTROLLED STOP" : transactionComplete ? "COMPLETE" : "IN TRANSIT"}</b></div>}
            <div className="platform-live-ticker"><Radio size={13} /><span>{currentTransaction ? currentTransaction.detail : selectedAgent.event}</span><b>{currentTransaction ? currentTransaction.human ? "HOLD" : transactionComplete ? "DONE" : "FLOWING" : swarmRunning ? "LIVE" : "INSPECT"}</b></div>
          </div>

          <aside className="platform-inspector">
            <div className="inspector-status"><span><Activity size={13} />{transactionActive ? "Transaction service" : "Selected service"}</span><b>{transactionActive ? currentTransaction.human ? "CONTROL" : transactionComplete ? "COMPLETE" : "EXECUTING" : swarmRunning ? "SWARMING" : "PINNED"}</b></div>
            <motion.div key={selectedPlatform.key} className="inspector-platform" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .18 }}>
              <div className={`inspector-logo inspector-logo-${selectedPlatform.key}`}><img src={selectedPlatform.logo} alt={`${selectedPlatform.name} logo`} /></div>
              <span>{selectedPlatform.layer}</span>
              <h3>{selectedPlatform.name}</h3>
              <strong>{selectedPlatform.role}</strong>
              <p>{selectedPlatform.copy}</p>
            </motion.div>
            <div className={`agent-signal-card ${transactionActive ? "transaction" : ""} ${currentTransaction?.human ? "control" : ""}`}>
              <div><Radio size={13} /><span>{transactionActive ? `TRANSACTION STAGE / ${String(transactionStage + 1).padStart(2, "0")}` : `ACTIVE AGENT / ${String(activeAgent + 1).padStart(2, "0")}`}</span></div>
              <h4>{transactionActive ? currentTransaction.title : selectedAgent.name}</h4>
              <b>{transactionActive ? `${currentTransaction.system} · ${selectedPlatform.name}` : `${selectedAgent.domain} · ${selectedPlatform.name}`}</b>
              <p>{transactionActive ? currentTransaction.detail : selectedAgent.job}</p>
              <div className="agent-event"><i /><span>{transactionActive ? currentTransaction.packet : selectedAgent.event}</span></div>
            </div>
            <AnimatePresence>
              {transactionActive && transactionStage >= portalTransactionStage && (
                <motion.div className="portal-receipt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <div className="portal-receipt-head"><span><Globe2 size={13} />Customer Portal</span><b><Radio size={11} />LIVE RECEIPT</b></div>
                  <div className="portal-order"><span>ORDER SO-54001982</span><strong>{transactionComplete ? "Delivered to customer" : "Production visible"}</strong></div>
                  <div className="portal-event-list">
                    {portalStatusEvents.map((event, index) => (
                      <motion.div key={event.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduced ? 0 : index * .13 }}>
                        <i><Check size={9} /></i><time>{event.time}</time><strong>{event.label}</strong><small>{event.source}</small>
                      </motion.div>
                    ))}
                  </div>
                  <div className="portal-receipt-foot"><ShieldCheck size={12} /><span>Source-linked · timestamped · customer-visible</span></div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="platform-principle"><ShieldCheck size={18} /><div><strong>Shared platform. Bounded autonomy.</strong><p>Agents reuse the platform; authority remains explicit per job.</p></div></div>
          </aside>
        </div>

        {transactionActive && (
          <div className="transaction-ledger" aria-label="Complete transaction journey">
            {transactionJourney.map((stage, index) => <div key={stage.title} className={index < transactionStage ? "done" : index === transactionStage ? "active" : "waiting"}><span>{String(index + 1).padStart(2, "0")}</span><i /> <strong>{stage.title}</strong><small>{index < transactionStage ? "Complete" : index === transactionStage ? stage.human ? "Human control" : "Executing" : "Waiting"}</small></div>)}
          </div>
        )}

        <div className="platform-layer-strip">
          {technology.map((layer, index) => {
            const Icon = layer.icon;
            const key = layerPlatform[index];
            return (
              <button type="button" key={layer.number} className={displayedPlatformKey === key ? "active" : ""} onClick={() => inspectPlatform(key)}>
                <span>{layer.number}</span><Icon size={16} /><div><strong>{layer.title}</strong><small>{layer.tools}</small></div>
              </button>
            );
          })}
        </div>
      </div>
    </SectionFrame>
  );
}

function formatProcessSeconds(seconds: number, finalLabel?: string) {
  if (finalLabel) return finalLabel;
  const safeSeconds = Math.max(0, Math.round(seconds));
  if (safeSeconds < 60) return `${safeSeconds}s`;
  if (safeSeconds < 3600) {
    const minutes = Math.floor(safeSeconds / 60);
    const remainder = safeSeconds % 60;
    return remainder ? `${minutes}m ${String(remainder).padStart(2, "0")}s` : `${minutes}m`;
  }
  const totalMinutes = Math.round(safeSeconds / 60);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return [`${days}d`, hours ? `${hours}h` : "", minutes ? `${String(minutes).padStart(2, "0")}m` : ""].filter(Boolean).join(" ");
  return `${hours}h${minutes ? ` ${String(minutes).padStart(2, "0")}m` : ""}`;
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
  manualDuration,
  automatedDuration,
  manualStepSeconds,
  automatedStepSeconds,
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
  manualDuration: string;
  automatedDuration: string;
  manualStepSeconds: number[];
  automatedStepSeconds: number[];
  checkpoints: string[];
  outcomes: Outcome[];
}) {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const [view, setView] = useState<"manual" | "automated">("automated");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const playbackIdRef = useRef(0);
  const reduced = useReducedMotion();
  const displayedSteps = view === "automated" ? steps : manualSteps;
  const displayedStepSeconds = view === "automated" ? automatedStepSeconds : manualStepSeconds;
  const totalDurationSeconds = displayedStepSeconds.reduce((sum, duration) => sum + duration, 0);
  const activeStepStart = displayedStepSeconds.slice(0, active).reduce((sum, duration) => sum + duration, 0);
  const activeStepEnd = activeStepStart + displayedStepSeconds[active];
  const elapsedComplete = elapsedSeconds >= totalDurationSeconds;

  useEffect(() => {
    if (!running) return;
    const playbackId = ++playbackIdRef.current;
    const startValue = Math.max(activeStepStart, Math.min(elapsedSeconds, activeStepEnd));
    const remaining = activeStepEnd - startValue;
    if (remaining <= 0) {
      if (active >= displayedSteps.length - 1) setRunning(false);
      else setActive((current) => current + 1);
      return;
    }
    const averageTaskSeconds = totalDurationSeconds / displayedStepSeconds.length;
    const taskWeight = displayedStepSeconds[active] / averageTaskSeconds;
    const fullSegmentDuration = Math.max(1300, Math.min(2600, 1200 + taskWeight * 550));
    const segmentDuration = Math.max(260, fullSegmentDuration * (remaining / displayedStepSeconds[active]));
    const startedAt = performance.now();
    let frame = 0;
    let reducedTimer = 0;
    const completeStep = () => {
      if (playbackId !== playbackIdRef.current) return;
      setElapsedSeconds(activeStepEnd);
      if (active >= displayedSteps.length - 1) setRunning(false);
      else setActive((current) => current + 1);
    };
    if (reduced) {
      reducedTimer = window.setTimeout(completeStep, segmentDuration);
      return () => { playbackIdRef.current += 1; window.clearTimeout(reducedTimer); };
    }
    const tick = (now: number) => {
      if (playbackId !== playbackIdRef.current) return;
      const progress = Math.min((now - startedAt) / segmentDuration, 1);
      setElapsedSeconds(Math.round(startValue + remaining * progress));
      if (progress >= 1) completeStep();
      else frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => { playbackIdRef.current += 1; window.cancelAnimationFrame(frame); };
  // elapsedSeconds is intentionally captured only when a step starts or playback resumes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, running, view, activeStepStart, activeStepEnd, displayedStepSeconds, displayedSteps.length, reduced, totalDurationSeconds]);

  useEffect(() => {
    if (displayedSteps.length !== displayedStepSeconds.length) {
      setRunning(false);
      console.error("Process timing profile does not match the number of process steps.");
    }
  }, [displayedSteps.length, displayedStepSeconds.length]);

  useEffect(() => {
    const node = railRef.current?.querySelector(`[data-node="${active}"]`);
    node?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", inline: "center", block: "nearest" });
  }, [active, reduced]);

  const changeView = (nextView: "manual" | "automated") => {
    if (nextView === view) return;
    playbackIdRef.current += 1;
    setRunning(false);
    setActive(0);
    setElapsedSeconds(0);
    setView(nextView);
    if (railRef.current) railRef.current.scrollLeft = 0;
  };

  const run = () => {
    if (running) {
      playbackIdRef.current += 1;
      setRunning(false);
      return;
    }
    if (elapsedComplete) {
      setActive(0);
      setElapsedSeconds(0);
      window.setTimeout(() => setRunning(true), 120);
      return;
    }
    setRunning(true);
  };

  const current = displayedSteps[active];
  const lensMessage = processLensMessages[process][lens];
  const currentDuration = view === "manual" ? manualDuration : automatedDuration;
  const elapsedProgress = totalDurationSeconds ? elapsedSeconds / totalDurationSeconds : 0;
  const elapsedLabel = formatProcessSeconds(elapsedSeconds, elapsedComplete ? currentDuration : undefined);
  const elapsedStatus = elapsedComplete ? "Complete" : running ? "Ticking" : elapsedSeconds === 0 ? "Ready" : "Paused";
  const scopeNote = process === "order" ? "Illustrative processing time · excludes physical manufacturing, production queues and delivery transit" : "Illustrative active-processing time · task durations vary by work performed";
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
      <AnimatePresence mode="wait">
        <motion.div
          className={`elapsed-time-console ${view} ${running ? "ticking" : ""}`}
          key={`${process}-${view}`}
          initial={{ opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -7 }}
          transition={{ duration: .24 }}
          aria-live={running ? "off" : "polite"}
          aria-label={`${view === "manual" ? "Manual" : "Agent"} elapsed time ${elapsedLabel}; target ${currentDuration}`}
        >
          <div className="elapsed-time-meta"><span><Gauge size={15} />{view === "manual" ? "Manual processing time" : "Agent processing time"}</span><b>{elapsedStatus}</b></div>
          <div className="elapsed-time-value">
            <motion.strong key={`${view}-${active}`} initial={{ opacity: .45, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}>{elapsedLabel}</motion.strong>
            <span>Target · {currentDuration}</span>
          </div>
          <div className="elapsed-time-progress"><motion.i initial={false} animate={{ scaleX: elapsedProgress }} transition={{ duration: .42, ease: [0.23, 1, 0.32, 1] }} /></div>
          <div className="elapsed-time-foot"><span>Step {String(active + 1).padStart(2, "0")} / {String(displayedSteps.length).padStart(2, "0")}</span><span>{Math.round(elapsedProgress * 100)}% of processing cycle</span></div>
          <div className="elapsed-time-scope"><CircleDot size={12} /><span>{scopeNote}</span></div>
        </motion.div>
      </AnimatePresence>
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
            {displayedSteps.map((step, index) => {
              const taskSeconds = displayedStepSeconds[index];
              const cumulativeSeconds = displayedStepSeconds.slice(0, index + 1).reduce((sum, duration) => sum + duration, 0);
              const stepComplete = elapsedSeconds >= cumulativeSeconds;
              const cumulativeLabel = formatProcessSeconds(cumulativeSeconds, index === displayedSteps.length - 1 ? currentDuration : undefined);
              return (
              <div className="flow-unit" key={`${view}-${step.title}`}>
                <motion.button
                  type="button"
                  data-node={index}
                  className={`flow-node ${step.kind} ${active === index ? "active" : ""} ${stepComplete ? "passed completed" : ""}`}
                  onClick={() => { playbackIdRef.current += 1; setRunning(false); setActive(index); setElapsedSeconds(cumulativeSeconds); }}
                  whileTap={{ scale: 0.98 }}
                  aria-pressed={active === index}
                >
                  <span className="node-top"><b>{String(index + 1).padStart(2, "0")}</b><KindIcon kind={step.kind} /></span>
                  <strong>{step.title}</strong>
                  <small>{view === "manual" ? "Manual task" : step.kind === "human" ? "Human checkpoint" : step.kind === "decision" ? "Decision gate" : "Autonomous action"}</small>
                  <AnimatePresence>
                    {stepComplete && (
                      <motion.span className="node-timing" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <b>Task +{formatProcessSeconds(taskSeconds)}</b><em>Cumulative {cumulativeLabel}</em>
                      </motion.span>
                    )}
                  </AnimatePresence>
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
                    {running && active === index && <span className="connector-ticks" aria-hidden="true"><i /><i /><i /></span>}
                    {running && active === index && (
                      <motion.span className="signal-dot" initial={{ x: 0, opacity: 0 }} animate={{ x: 56, opacity: [0, 1, 1, 0] }} transition={{ duration: .72, repeat: Infinity, ease: "linear" }} />
                    )}
                  </div>
                )}
              </div>
            );})}
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
          <p>{process === "order" ? "The timer uses non-uniform illustrative processing allocations. It excludes physical manufacturing, production queues and delivery transit; other outcomes remain directional." : "The timer uses non-uniform illustrative processing allocations across the CPL before-and-today comparison. Other outcomes remain directional."} Use the Impact tab to model capacity and value with CPL or Euroma operating data.</p>
        </div>
        <div className="outcome-grid">
          {outcomes.map((outcome, index) => (
            <motion.article key={outcome.label} className="outcome-card" whileHover={{ y: -4 }}>
              <span>0{index + 1}</span>
              <strong>{index === 0 ? currentDuration : outcome.value}</strong>
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
        <span>ALFRED × EUROMA</span>
        <strong>Production AI. Human control.</strong>
        <span>2026</span>
      </div>
    </SectionFrame>
  );
}

function AppShell() {
  const [section, setSection] = useState<SectionId>(() => {
    const requested = new URLSearchParams(window.location.search).get("section");
    return navItems.some((item) => item.id === requested) ? requested as SectionId : "intro";
  });
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
    const url = new URL(window.location.href);
    if (id === "intro") url.searchParams.delete("section");
    else url.searchParams.set("section", id);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
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
        manualDuration="2 days"
        automatedDuration="2 minutes"
        manualStepSeconds={briefManualStepSeconds}
        automatedStepSeconds={briefAutomatedStepSeconds}
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
        manualDuration="3 days"
        automatedDuration="3 minutes"
        manualStepSeconds={orderManualStepSeconds}
        automatedStepSeconds={orderAutomatedStepSeconds}
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
          <span className="nevodia-mark"><i>A</i><b>Alfred</b></span>
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
