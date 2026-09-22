import { useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import CortiSleeveWalkthrough from "@/components/CortiSleeveWalkthrough";
import OlfyneExperience from "@/components/OlfyneExperience";
import TrendAnalysisExperience from "@/components/TrendAnalysisExperience";
import APSOrchestrationExperience from "@/components/APSOrchestrationExperience";
import CPLInnovationPortfolio from "@/components/CPLInnovationPortfolio";
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
  MousePointer2,
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
  langchain: "/manus-storage/langchain-lockup-official-black_0e88f37a.svg",
  azure: "/manus-storage/microsoft-azure_7e3847cf.svg",
  whatsapp: "/manus-storage/whatsapp_9008dd98.svg",
  sap: "/manus-storage/sap_713309ae.svg",
  dynamics365: "/manus-storage/dynamics365_b2a9ff92.svg",
  fricke: "/manus-storage/fricke-full-logo_753621e3.svg",
  olfyneAward: "/manus-storage/olfyne-beautyworld-finalist-alfred_abe3e404.png",
  olfyneIcon: "/manus-storage/olfyne-favicon_73c2067a.svg",
  cortisleeveProduct: "/manus-storage/cortisleeve-product_dde1aac8.jpg",
  cortisleeveDetail: "/manus-storage/cortisleeve-detail_93a2945a.jpg",
  cortisleeveWordmark: "/manus-storage/cortisleeve-supplied-wordmark_30e0cbd1.png",
};

type SectionId = "intro" | "tech" | "aps" | "b2c" | "o2c" | "impact" | "next";
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
  { id: "o2c", label: "O2C", kicker: "03" },
  { id: "aps", label: "APS", kicker: "04" },
  { id: "b2c", label: "B2C", kicker: "05" },
  { id: "impact", label: "Impact", kicker: "06" },
  { id: "next", label: "Next", kicker: "07" },
];

const ventures = [
  {
    name: "Olfyne",
    meta: "Fragrance platform",
    brandIcon: ASSETS.olfyneIcon,
    copy: "From idea to shelf: one platform for brand owners, perfumers and production partners.",
    award: "Finalist · Tech Innovation of the Year · Beautyworld Middle East",
    awardImage: ASSETS.olfyneAward,
    url: "https://www.olfyne.io/",
    demoTitle: "A one-word brief can become a compliant, shelf-ready fragrance.",
    demo: "Olfyne connects independent perfumers, brand owners and production partners. Sillage supports commissioning through bids and royalties; Studio gives perfumers live compliance, stability and safety-data tools while they formulate.",
    steps: ["Post a brief in plain language", "Approve the protected scent pyramid", "Sample, produce and take to shelf"],
    result: "The creative formula stays protected; each route is screened for IFRA, CLP and allergen requirements before production.",
    icon: Sparkles,
  },
  {
    name: "CortiSleeve",
    displayName: "CortiSleeve™",
    meta: "Neural hearing technology",
    brandLogo: ASSETS.cortisleeveWordmark,
    copy: "A neural sleeve for the earbuds you already own, designed to bring the voice you’re listening for into focus.",
    productImage: ASSETS.cortisleeveProduct,
    detailImage: ASSETS.cortisleeveDetail,
    credentials: ["UK trademark registered", "Patent pending · UK & US"],
    stage: "Cambridge, UK · 2026 pilot",
    url: "https://www.cortisleeve.com/",
    demoTitle: "Hear the one voice you’re listening for.",
    demo: "CortiSleeve™ fits over AirPods and other standard earbuds. Dry electrodes sense ear-EEG attention signals; a clip-on micro-pebble module decodes attention on-device and connects to a phone over Bluetooth Low Energy. The system is designed to foreground the intended speaker in a noisy room.",
    steps: ["Sense attention with dry electrodes", "Identify the intended speaker", "Bring that voice forward"],
    result: "Designed for clearer conversations, without gel, a clinic visit or an implant. A consumer accessory, not a clinical device.",
    future: "A future SDK could use the same attention signal to guide software assistants and robots. This is a development horizon, separate from the hearing-focused pilot.",
    icon: Fingerprint,
  },
  {
    name: "Trend Analysis MCP",
    meta: "Signal intelligence",
    copy: "An MCP-powered evidence console that turns current beauty and fragrance signals into decision-ready creative directions.",
    demoTitle: "Don’t show a trend. Show the evidence that makes it actionable.",
    demo: "Trend Analysis MCP collects relevant editorial and category evidence, surfaces the underlying theme, and translates it into a concise direction a creative or commercial team can challenge, adapt or use.",
    steps: ["Retrieve current category evidence", "Cluster signals into a defensible theme", "Publish source-linked creative implications"],
    result: "A traceable trend brief—signal, source and creative implication in one view.",
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
  { name: "Quote Match", domain: "O2C", job: "Reconciles every PO line against the governed commercial quote.", platform: "langchain", event: "PO IL-2026-0417 · variance branch opened", ring: "inner" },
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
  { title: "Purchase order received", system: "Email channel", detail: "Illustrative PO IL-2026-0417 arrives as a PDF and becomes a governed transaction packet.", platform: "copilot", endpoint: "email", packet: "PO · IL-2026-0417", path: "M83 176 C165 176 235 112 332 91" },
  { title: "Document read", system: "UiPath AI OCR", detail: "Customer, product, quantity, requested date and commercial lines are extracted with source evidence.", agent: 3, platform: "uipath", packet: "OCR · 98.7%", path: "M332 91 C390 150 455 245 500 325" },
  { title: "Customer and quote context", system: "Dynamics 365 + Microsoft Fabric", detail: "The packet retrieves the governed Dynamics 365 customer account and illustrative quote QT-IL-417 before any order is created.", platform: "fabric", endpoint: "crm", packet: "QUOTE · QT-IL-417", path: "M500 325 C365 330 225 290 83 268" },
  { title: "Quote matched", system: "Quote Match Agent", detail: "Every PO line is reconciled against the approved quote, including price, currency, quantity and delivery terms.", agent: 3, platform: "langchain", packet: "MATCH · 4/4", path: "M83 268 C270 270 470 160 669 91" },
  { title: "Commercial control", system: "Named human approval", detail: "The illustrative price variance is contained. Customer Service approves the correction before automation may continue.", platform: "foundry", human: true, packet: "HOLD · +£52.50", path: "M669 91 C610 130 550 175 500 201" },
  { title: "Order and credit created", system: "SAP ERP", detail: "UiPath creates the illustrative order and SAP performs the automatic credit check against controlled master data.", agent: 4, platform: "uipath", endpoint: "erp", packet: "SO · 58004192", path: "M500 201 C650 220 800 270 916 319" },
  { title: "Mini-MRP and promise", system: "Mini-MRP Agent", detail: "Raw material, safety stock, open POs, vendor lead time and factory capacity resolve the promise date.", agent: 5, platform: "fabric", packet: "PROMISE · 24 SEP", path: "M916 319 C760 390 640 510 500 591" },
  { title: "Production route released", system: "Illustrative factory workflow", detail: "The BOM and solution/base route are created and released to the illustrative factory work centre.", agent: 6, platform: "langchain", endpoint: "factory", packet: "PROD · 880714", path: "M500 591 C650 560 790 440 916 365" },
  { title: "Production and QC tracked", system: "Illustrative production + Status Agent", detail: "Illustrative dosing and production movements, followed by packing and quality-release events, update the order state and customer portal continuously.", agent: 7, platform: "copilot", endpoint: "factory", packet: "QUALITY · RELEASED", path: "M916 365 C730 300 520 210 332 91" },
  { title: "Live status published", system: "Status Agent + Customer Portal", detail: "The Status Agent converts controlled order, factory, packing and quality-release events into a real-time customer timeline with source and timestamp intact.", agent: 7, platform: "copilot", endpoint: "portal", packet: "PORTAL · 5 EVENTS", path: "M916 365 C700 470 350 455 83 347" },
  { title: "Goods issue and invoice", system: "SAP ERP + Invoice Agent", detail: "Goods issue closes fulfilment, generates the invoice and writes the financial event back to SAP.", agent: 9, platform: "azure", endpoint: "erp", packet: "INV · 920184", path: "M332 91 C210 390 275 590 500 591 C700 590 780 380 916 319" },
  { title: "Customer confirmation sent", system: "Email channel", detail: "Illustrative order confirmation, shipping documents and invoice leave through the customer channel with a complete audit trail.", agent: 8, platform: "uipath", endpoint: "email", packet: "COMPLETE · 12 EVENTS", path: "M916 319 C700 200 350 120 83 176" },
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
    copy: "A customer purchase order arrives through the supported email or messaging channels. Both routes enter the same governed workflow.",
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
    systems: ["Microsoft Copilot Studio · Production Status Agent", "Illustrative dosing event stream", "Microsoft Fabric · manufacturing event stream", "Microsoft Copilot Studio · Customer Portal Update Agent"],
  },
  {
    title: "QC notified & updated",
    copy: "Production-complete status notifies Quality. QC performs its control and the QC system records the updated status before shipping continues.",
    kind: "human",
    tags: ["Production complete", "QC control", "System update"],
    systems: ["Microsoft Fabric · production-complete event", "LangChain · quality release checkpoint", "Named quality approver"],
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
  { title: "PO received", system: "PO Intake Agent · WhatsApp", copy: "Illustrative six-line customer PO captured for the demonstration.", customer: "Order received", minutes: 0 },
  { title: "Document understood", system: "AI-based OCR · UiPath RPA", copy: "Products, quantities, requested dates and prices extracted.", customer: "Acknowledgement sent", minutes: 1 },
  { title: "Quote reconciled", system: "Quote Match Agent · Microsoft Fabric", copy: "Illustrative PO compared with CRM quote QT-IL-417.", customer: "Validation in progress", minutes: 2 },
  { title: "Order and credit", system: "Order Creation Agent · LangChain", copy: "Sales order created and credit control executed.", customer: "Order accepted", minutes: 4 },
  { title: "Materials and capacity", system: "Mini-MRP Agent · Microsoft Fabric", copy: "Safety stock, open POs, lead times and plant capacity evaluated.", customer: "Promise date calculated", minutes: 6 },
  { title: "Production route", system: "Production Planning Agent · UiPath RPA", copy: "Solution/base requirement resolved and production order released.", customer: "Production planned", minutes: 9 },
  { title: "Factory movement", system: "Production Status Agent · illustrative factory event stream", copy: "Illustrative dosing, finishing and packing events post as they occur.", customer: "In production", minutes: 14 },
  { title: "Quality release", system: "Illustrative quality-release checkpoint", copy: "Completion event routes to the illustrative quality workflow for controlled release.", customer: "Quality check", minutes: 17 },
  { title: "Shipping prepared", system: "Shipping & Documentation Agent", copy: "Shipping, customs and tracking documents generated.", customer: "Ready to ship", minutes: 19 },
  { title: "Invoice dispatched", system: "Invoice Dispatch Agent · goods issue", copy: "Goods issue triggers invoice generation and customer delivery.", customer: "Shipped and invoiced", minutes: 20 },
];

const discrepancyResolutions = [
  {
    id: "correct",
    title: "Correct PO to contracted quote",
    owner: "Customer Service · illustrative regional queue",
    detail: "Apply £26.40/kg from illustrative CRM quote QT-IL-417 and preserve the agreed commercial position.",
    impact: "£52.50 variance removed",
    recommended: true,
  },
  {
    id: "accept",
    title: "Accept the PO price",
    owner: "Account manager approval",
    detail: "Accept £27.15/kg, document the commercial exception and retain the higher order value.",
    impact: "+£52.50 order value",
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
        copy: "Illustrative PO line 3 is 2.8% above quote QT-IL-417. The agent stops order creation and opens a Customer Service audit.",
        customer: "Validation paused",
        minutes: 2,
        exception: true,
      },
      {
        title: "Human resolution recorded",
        system: "Customer Service · human control",
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
          <p>Watch an illustrative WhatsApp PO move across agents, data, human control and factory events. Inject a discrepancy to see the automation stop safely.</p>
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
          <div className="po-top"><span>PO / IL-2026-0417</span><b>WHATSAPP · ILLUSTRATIVE</b></div>
          <div className="po-customer"><small>CUSTOMER</small><strong>Illustrative Aromatics Ltd.</strong><span>Requested delivery · 28 OCT</span></div>
          <div className="po-lines">
            <div><span>Sample Accord 01</span><b>135 KG</b><em>£47.10</em></div>
            <div><span>Demo Base 08</span><b>75 KG</b><em>£30.80</em></div>
            <div className={scenario === "exception" && active >= 3 ? "flagged" : ""}><span>Illustrative Solution 12</span><b>70 KG</b><em>£27.15</em></div>
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
                  <span><AlertTriangle size={14} />EXCEPTION / EX-IL-2417</span>
                  <h3>{exceptionResolved ? "Decision recorded. Control released." : "Commercial price variance requires a person."}</h3>
                </div>
                <div className="exception-owner">
                  <span>Assigned owner</span><strong>Customer Service · illustrative regional queue</strong><b>{exceptionResolved ? "RESOLVED · T+05 MIN" : "SLA · 15 MIN"}</b>
                </div>
              </div>

              <div className="evidence-grid">
                <div className="evidence-card">
                  <span>01 · Source evidence</span>
                  <div><small>ILLUSTRATIVE CRM QUOTE · QT-IL-417</small><strong>Illustrative Solution 12</strong><p><b>70 KG</b><em>£26.40 / KG</em></p></div>
                  <div className="evidence-po"><small>ILLUSTRATIVE CUSTOMER PO · IL-2026-0417</small><strong>Illustrative Solution 12</strong><p><b>70 KG</b><em>£27.15 / KG</em></p></div>
                </div>
                <div className="exposure-card">
                  <span>02 · Financial exposure</span>
                  <strong>+2.8%</strong>
                  <p>Unit variance <b>+£0.75/kg</b></p>
                  <p>Order-line exposure <b>£52.50</b></p>
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
                    <p><strong>{selectedResolution.title}</strong> recorded by Customer Service · illustrative regional queue at T+05. CRM quote evidence, PO exception, decision reason and owner written to illustrative audit ID <b>EX-IL-2417</b>. Order Creation Agent released.</p>
                    <div className="writeback-systems"><span>CRM exception log · updated</span><span>Customer portal · resolved</span><span>LangChain branch · released</span><span>UiPath order entry · resumed</span></div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="demo-fiction-note"><CircleDot size={12} />Illustrative order. Customer, document and pricing details are fictional.</p>
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

function VentureTitle({
  venture,
  level,
}: {
  venture: { name: string; displayName?: string; brandLogo?: string };
  level: "h2" | "h3";
}) {
  const [showWordmark, setShowWordmark] = useState(true);
  const name = venture.displayName ?? venture.name;
  const title = venture.brandLogo && showWordmark
    ? <img className="cortisleeve-wordmark" src={venture.brandLogo} alt={name} width={238} height={69} onError={() => setShowWordmark(false)} />
    : name;

  return level === "h2"
    ? <h2 id="venture-modal-title" className="venture-name">{title}</h2>
    : <h3 className="venture-name">{title}</h3>;
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
  const [cplInnovationOpen, setCplInnovationOpen] = useState(() => new URLSearchParams(window.location.search).get("cpl") === "innovation");
  const [activeVenture, setActiveVenture] = useState<number | null>(() => {
    const requested = new URLSearchParams(window.location.search).get("venture");
    const index = ventures.findIndex((venture) => venture.name.toLowerCase().replace(/\s+/g, "-") === requested);
    return index >= 0 ? index : null;
  });
  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const selectedVenture = activeVenture === null ? null : ventures[activeVenture];
  const SelectedVentureIcon = selectedVenture?.icon ?? Sparkles;
  const isProfileDialogOpen = activeVenture !== null || cplInnovationOpen;

  useEffect(() => {
    if (!isProfileDialogOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => modalCloseRef.current?.focus(), 50);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveVenture(null);
        setCplInnovationOpen(false);
      }
      if (event.key === "Tab") {
        const modal = modalCloseRef.current?.closest('[role="dialog"]');
        const controls = modal ? Array.from(modal.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]')) : [];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [isProfileDialogOpen]);

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

      <div className="content-block career-block">
        <div className="block-heading">
          <div>
            <span className="overline">Operating record</span>
            <h2>My work to date.</h2>
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
              {career[activeCareer].name === "CPL Aromas" && <button type="button" className="cpl-innovation-launch" onClick={() => setCplInnovationOpen(true)} aria-haspopup="dialog"><Sparkles size={15} />Open industry-transformative apps & agents <ArrowUpRight size={15} /></button>}
            </div>
            <p>{career[activeCareer].copy}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="content-block ventures-block">
        <div className="block-heading">
          <div>
            <span className="overline">Independent ventures</span>
            <h2>Built beyond the boardroom.</h2>
          </div>
          <p>Three ventures across fragrance creation, neural hearing and market intelligence, each built around a specific human need.</p>
        </div>
        <div className="venture-grid">
          {ventures.map((venture, index) => (
              <motion.button
                type="button"
                key={venture.name}
                className={`venture-card ${venture.name === "Trend Analysis MCP" ? "trend-card" : ""} ${venture.productImage ? "cortisleeve-card" : ""} ${venture.name === "Olfyne" ? "olfyne-card" : ""}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 + index * 0.08 }}
                whileHover={{ y: -3 }}
                onClick={() => setActiveVenture(index)}
                aria-haspopup="dialog"
                aria-label={`Open ${venture.name} product summary`}
              >
                <div className="venture-compact-top"><span>0{index + 1}</span><small>Product brief</small></div>
                <VentureTitle venture={venture} level="h3" />
                <p className="venture-category">{venture.meta}</p>
                <div className="venture-open"><span>Open product brief</span><ArrowUpRight size={14} /></div>
              </motion.button>
            ))}
        </div>
      </div>

      <AnimatePresence>
        {cplInnovationOpen && (
          <motion.div className="venture-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setCplInnovationOpen(false)}>
            <motion.div
              className="venture-modal cpl-innovation-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cpl-innovation-title"
              initial={{ opacity: 0, y: 18, scale: .97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: .98 }}
              transition={{ duration: .24 }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button ref={modalCloseRef} type="button" className="venture-modal-close" onClick={() => setCplInnovationOpen(false)} aria-label="Close CPL innovation portfolio"><X size={18} /></button>
              <header className="cpl-modal-heading">
                <img src={ASSETS.cpl} alt="CPL Aromas logo" />
                <div><span className="overline">CPL Aromas · operating innovation</span><h2 id="cpl-innovation-title">Industry-transformative<br />apps & agents.</h2><p>Five capability families built inside the fragrance industry—connecting invention, prediction, regulatory control, creative intelligence and emotional response.</p></div>
              </header>
              <CPLInnovationPortfolio />
            </motion.div>
          </motion.div>
        )}
        {selectedVenture && (
          <motion.div className="venture-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setActiveVenture(null)}>
            <motion.div
              className={`venture-modal ${selectedVenture.name === "Trend Analysis MCP" ? "trend-modal" : ""} ${selectedVenture.name === "Olfyne" ? "olfyne-modal" : ""}`}
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
                <VentureTitle venture={selectedVenture} level="h2" />
                {selectedVenture.credentials && <div className="venture-credentials modal-credentials">{selectedVenture.credentials.map(credential => <span key={credential}><ShieldCheck size={14} />{credential}</span>)}</div>}
                <h3>{selectedVenture.demoTitle}</h3>
                <p>{selectedVenture.demo}</p>
                <div className="venture-demo-flow">
                  {selectedVenture.steps.map((step, index) => <div key={step}><span>0{index + 1}</span><i /><strong>{step}</strong></div>)}
                </div>
                <div className="venture-result"><BadgeCheck size={16} /><div><span>Result</span><strong>{selectedVenture.result}</strong></div></div>
                {selectedVenture.future && <div className="venture-future"><span>Next horizon · research & development</span><p>{selectedVenture.future}</p></div>}
                {selectedVenture.url && selectedVenture.name !== "Olfyne" && <a className="venture-site-link" href={selectedVenture.url} target="_blank" rel="noopener noreferrer">Explore CortiSleeve & the 2026 pilot <ArrowUpRight size={16} /></a>}
              </div>
              <div className={`venture-modal-visual ${selectedVenture.productImage ? "cortisleeve-visual" : ""} ${selectedVenture.name === "Olfyne" ? "olfyne-visual" : ""}`}>
                {selectedVenture.name === "Olfyne" ? (
                  <OlfyneExperience icon={selectedVenture.brandIcon!} url={selectedVenture.url!} />
                ) : selectedVenture.name === "Trend Analysis MCP" ? (
                  <TrendAnalysisExperience />
                ) : selectedVenture.awardImage ? (
                  <div className="award-feature"><img src={selectedVenture.awardImage} alt="Olfyne finalist for Technology Innovation of the Year at Beautyworld Dubai Awards 2026" /><span>Official finalist announcement</span></div>
                ) : selectedVenture.productImage ? (
                  <div className="cortisleeve-product-story">
                    <span className="cortisleeve-pilot"><CircleDot size={12} />{selectedVenture.stage}</span>
                    <CortiSleeveWalkthrough image={selectedVenture.productImage} />
                    <figure className="cortisleeve-detail"><img src={selectedVenture.detailImage} alt="Official CortiSleeve detail render: flexible sleeve, dry-electrode pads and micro-pebble module beside an earbud" /><figcaption>Flexible sleeve · dry electrodes · micro-pebble module</figcaption></figure>
                    <p className="cortisleeve-source">Product visualisations and IP status from <a href={selectedVenture.url} target="_blank" rel="noopener noreferrer">cortisleeve.com <ArrowUpRight size={11} /></a></p>
                  </div>
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
  const meetingRequested = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mode") === "meeting";
  const [activePlatform, setActivePlatform] = useState<PlatformKey>("copilot");
  const [activeAgent, setActiveAgent] = useState(0);
  const [meetingMode, setMeetingMode] = useState(meetingRequested);
  const [swarmRunning, setSwarmRunning] = useState(!portalDemo && !meetingRequested);
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

  const toggleMeetingMode = () => {
    const next = !meetingMode;
    setMeetingMode(next);
    setTransactionStage(-1);
    setTransactionRunning(false);
    setTransactionApproved(false);
    if (next) {
      setActiveAgent(0);
      setActivePlatform(swarmAgents[0].platform);
      setSwarmRunning(false);
      return;
    }
    setSwarmRunning(true);
  };

  const advanceMeetingNarrative = () => {
    const nextAgent = (activeAgent + 1) % swarmAgents.length;
    setActiveAgent(nextAgent);
    setActivePlatform(swarmAgents[nextAgent].platform);
    setSwarmRunning(false);
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
      <div className={`platform-shell ${meetingMode ? "meeting-mode" : ""}`}>
        <div className="platform-topbar">
          <div><i /><span>EUROMA AGENT PLATFORM</span><b>PRODUCTION PATTERN</b></div>
          <div className="platform-stats">{meetingMode ? <><span><strong>FOCUS</strong> meeting view</span><span><strong>{String(activeAgent + 1).padStart(2, "0")}</strong> active story</span></> : <><span><strong>10</strong> agents online</span><span><strong>6</strong> shared services</span><span><strong>2</strong> flows live</span></>}</div>
          <button type="button" className={`meeting-toggle ${meetingMode ? "active" : ""}`} onClick={toggleMeetingMode} aria-pressed={meetingMode} aria-label={meetingMode ? "Return to full platform map" : "Enter simplified meeting view"}>
            <Layers3 size={14} />{meetingMode ? "Full map" : "Meeting view"}
          </button>
          {!meetingMode && <button type="button" onClick={toggleSwarm} disabled={transactionActive}>
            {transactionActive ? <CircleDot size={14} /> : swarmRunning ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}{transactionActive ? "Journey active" : swarmRunning ? "Pause swarm" : "Run swarm"}
          </button>}
        </div>

        {!meetingMode && <div className={`transaction-console ${transactionActive ? "active" : ""} ${currentTransaction?.human ? "control" : ""}`}>
          <div className="transaction-intro">
            <span><Zap size={14} />Follow one order</span>
            <strong>{transactionActive ? currentTransaction.title : "Watch a customer PO cross the entire platform."}</strong>
          </div>
          <div className="transaction-channel" aria-label="Transaction intake channel">
            <button type="button" className={transactionChannel === "email" ? "active" : ""} onClick={() => setTransactionChannel("email")} disabled={transactionActive && transactionStage > 0}><Mail size={13} />Email</button>
            <button type="button" className={transactionChannel === "whatsapp" ? "active" : ""} onClick={() => setTransactionChannel("whatsapp")} disabled={transactionActive && transactionStage > 0}><img src={ASSETS.whatsapp} alt="" />WhatsApp</button>
          </div>
          <div className="transaction-progress">
            <div><span>{transactionActive ? `Stage ${String(transactionStage + 1).padStart(2, "0")} / ${transactionJourney.length}` : "Ready to trace"}</span><b>{transactionActive ? currentTransaction.system : "Illustrative PO · ready"}</b></div>
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
        </div>}

        {meetingMode && <div className="meeting-narrative" aria-live="polite">
          <div><span>Presenter focus</span><strong>{selectedAgent.name}</strong><p>{selectedAgent.job}</p></div>
          <div className="meeting-narrative-flow"><span>Customer signal</span><i /><span>{selectedPlatform.name}</span><i /><span>Named approval</span><i /><span>Visible outcome</span></div>
          <button type="button" onClick={advanceMeetingNarrative}><Play size={13} fill="currentColor" />Next agent</button>
        </div>}

        <div className="platform-workspace">
          <div className={`platform-map ${swarmRunning && !transactionActive ? "running" : "paused"} ${transactionActive ? "transaction-mode" : ""} ${meetingMode ? "meeting-focus" : ""}`}>
            <div className="platform-gridlines" />
            <div className="azure-perimeter"><Cloud size={14} /><span>AZURE SECURITY · IDENTITY · OBSERVABILITY · RESIDENCY</span></div>
            <div className="platform-orbit orbit-outer" />
            <div className="platform-orbit orbit-inner" />
            {meetingMode && <div className="meeting-focus-path" aria-hidden="true"><span>Customer</span><i /><span>Agent</span><i /><span>Human</span><i /><span>Outcome</span></div>}
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

function APSSection() {
  return (
    <SectionFrame
      eyebrow="Advanced planning and scheduling"
      title="A schedule that can explain itself."
      intro="A LangChain-only APS concept that turns ERP constraints into a governed production plan, tests disruption before it reaches the floor, and feeds execution events back into the next decision."
    >
      <APSOrchestrationExperience langchainLogo={ASSETS.langchain} />
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
                    <span className="connector-arrow" aria-hidden="true" />
                    {!reduced && running && active === index && <span className="connector-ticks" aria-hidden="true"><i /><i /><i /></span>}
                    {!reduced && running && active === index && (
                      <motion.span className="signal-packet" aria-hidden="true" initial={{ x: 0, opacity: 0, scale: .75, rotate: 45 }} animate={{ x: 50, opacity: [0, 1, 1, 0], scale: [.75, 1, 1, .75], rotate: 45 }} transition={{ duration: .82, repeat: Infinity, ease: "linear" }} />
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

function MonthlyOperatingDashboard({ lens }: { lens: ExecutiveLens }) {
  const [view, setView] = useState<"team" | "cycle" | "exceptions">("team");
  const tabs = [
    { id: "team" as const, label: "Team capacity" },
    { id: "cycle" as const, label: "Cycle time" },
    { id: "exceptions" as const, label: "Human-review cases" },
  ];

  return (
    <section className="monthly-dashboard" aria-labelledby="monthly-dashboard-title">
      <header className="monthly-dashboard-heading">
        <div><span className="panel-label"><Activity size={17} />{lens === "ceo" ? "MONTHLY CUSTOMER OPERATING REVIEW" : "MONTHLY COST & CONTROL REVIEW"}</span><h2 id="monthly-dashboard-title">{lens === "ceo" ? "Protect the customer promise across 45,000 annual orders." : "Track the cost basis, flow speed and human-review load."}</h2></div>
        <p>{lens === "ceo" ? "This view turns capacity and cycle-time change into a customer-scale conversation. It shows the reported before-and-now facts while preserving the blank human-review series until verified monthly data is connected." : "This view applies the supplied £1,750 monthly average CS employee cost to the reported team change, then keeps the human-review workload separate until verified monthly case data is connected."}</p>
      </header>
      <div className="monthly-dashboard-tabs" role="group" aria-label="Monthly operating dashboard measure">
        {tabs.map((tab) => <button key={tab.id} type="button" aria-pressed={view === tab.id} className={view === tab.id ? "active" : ""} onClick={() => setView(tab.id)}>{tab.label}</button>)}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={view} className={`monthly-dashboard-panel monthly-dashboard-panel--${view}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }} transition={{ duration: .22, ease: [0.23, 1, 0.32, 1] }}>
          {view === "team" && <>
            <div className="monthly-panel-copy"><span>{lens === "ceo" ? "CUSTOMER-SCALE CAPACITY" : "SUPPLIED CS COST BASIS"}</span><h3>{lens === "ceo" ? "More orders per operating person" : "£630K annualised gross CS cost delta"}</h3><p>{lens === "ceo" ? "At 45,000 annual customer orders, the 60-to-30 shift doubles the order capacity supported by each person: 750 to 1,500 orders per operating person." : "Using the supplied £1,750 average monthly CS employee cost, the 30-person reduction equates to a £52.5K monthly and £630K annualised gross cost delta. Redeployment, planner-cost differences and run cost must be validated before this is booked."}</p><b>Monthly measure: rostered people and supplied gross CS cost basis</b></div>
            <div className="capacity-compare" aria-label={lens === "ceo" ? "Team capacity changed from 60 people to 30 people" : "Gross CS cost basis changed from 105 thousand pounds per month to 52.5 thousand pounds per month"}><div><span>Before</span><i className="capacity-bar before"><b>{lens === "ceo" ? "60" : "£105k"}</b></i><small>{lens === "ceo" ? "750 orders / person / year" : "60 × £1,750 / month"}</small></div><div><span>Today</span><i className="capacity-bar today"><b>{lens === "ceo" ? "30" : "£52.5k"}</b></i><small>{lens === "ceo" ? "1,500 orders / person / year" : "30 × £1,750 / month"}</small></div><strong>{lens === "ceo" ? "−50% team footprint" : "−£52.5K / month"}</strong><em>{lens === "ceo" ? "45,000 annual customer orders" : "£630K annualised gross CS cost delta"}</em></div>
          </>}
          {view === "cycle" && <>
            <div className="monthly-panel-copy"><span>{lens === "ceo" ? "CUSTOMER PROMISE SPEED" : "REPORTED FLOW COMPARISON"}</span><h3>{lens === "ceo" ? "Faster answers at customer scale" : "Cycle time"}</h3><p>{lens === "ceo" ? "When 45,000 orders flow through the operation every year, reducing administrative work from days to minutes protects response speed and leaves people available for the exceptions that need judgement." : "Track administrative processing time from first intake to completed system action. Physical production, factory queues and transit remain outside the O2C measure."}</p><b>Monthly measure: median administrative processing time by flow</b></div>
            <div className="cycle-compare" aria-label="Cycle-time comparisons for Brief to Contract and Order to Cash"><div><span>Brief → contract</span><p><strong>2 days</strong><i /><b>2 min</b></p><small>1,440× compression</small></div><div><span>Order → cash</span><p><strong>3 days</strong><i /><b>3 min</b></p><small>1,440× compression</small></div></div>
          </>}
          {view === "exceptions" && <>
            <div className="monthly-panel-copy"><span>REPORTED INTERVENTION BASELINE</span><h3>{lens === "ceo" ? "Orders needing human review" : "Human-review cases"}</h3><p>{lens === "ceo" ? "Seven percent of customer orders require a person to decide or correct something—for example a price mismatch, credit failure, material shortage, capacity conflict, QC hold or document issue. That makes the human-review queue the customer-promise protection layer." : "A human-review case is an order that cannot progress automatically and needs a named person to decide or correct it—for example a price mismatch, credit failure, material shortage, capacity conflict, QC hold or document issue. The reported intervention baseline is 7% of annual customer orders."}</p><b>Monthly measure: cases raised, resolved and aged by owner</b></div>
            <div className="human-review-baseline" aria-label="Seven percent of annual customer orders require human review"><div className="review-rate"><span>Human intervention rate</span><strong>7%</strong><small>Reported baseline</small></div><div className="review-volume"><span>Annual human-review cases</span><strong>3,150</strong><small>45,000 orders × 7%</small></div><div className="review-volume today"><span>Average monthly review cases</span><strong>263</strong><small>Annual baseline ÷ 12</small></div><p><b>93%</b> of orders progress without human intervention. The monthly average is an annualised baseline, not a fabricated month-by-month trend. Connect Dynamics 365, SAP and Fricke to visualise actual case volume, age, reason and resolution owner each month.</p></div>
          </>}
        </motion.div>
      </AnimatePresence>
      <p className="monthly-dashboard-note"><CircleDot size={13} /> {lens === "ceo" ? "The team and cycle panels combine the reported 60-to-30 team shift, 45,000 annual customer orders and the live process-time comparisons. The reported 7% intervention rate equates to 3,150 annual or 263 average monthly human-review cases; actual monthly history requires a validated extract." : "The team panel applies the supplied £1,750 monthly CS employee cost to the 30-person reduction: £52.5K monthly and £630K annualised gross cost delta. The reported 7% intervention rate equates to 3,150 annual or 263 average monthly human-review cases; redeployment, planner-cost differences and run cost still require validated monthly extracts before finance benefits can be booked."}</p>
    </section>
  );
}

function ImpactSection({ lens }: { lens: ExecutiveLens }) {
  const [focus, setFocus] = useState<"team" | "time" | "build" | "scale" | "payroll">("team");
  useEffect(() => setFocus(lens === "ceo" ? "scale" : "build"), [lens]);
  const evidence = lens === "ceo" ? [
    { id: "scale" as const, icon: Activity, value: "45k", label: "Annual customer orders", note: "Reported annual order volume", eyebrow: "Customer promise at scale", title: "Agents manage 45,000 customer orders at scale.", copy: "At this volume, every hand-off matters. The agents remove repeatable administration so people can spend their attention on customer decisions, exceptions and service recovery." },
    { id: "team" as const, icon: UserCheck, value: "2×", label: "Orders per operating person", note: "750 → 1,500 each year", eyebrow: "Capacity released", title: "The same customer scale now runs with double the order capacity per person.", copy: "With 45,000 annual customer orders and the operating team moving from 60 to 30, each person supports 1,500 orders rather than 750. This is a capacity measure, not a payroll-saving claim." },
    { id: "time" as const, icon: Activity, value: "1,440×", label: "Processing compression", note: "Across both live flows", eyebrow: "Customer speed protected", title: "Days became minutes before the customer has to wait.", copy: "The live processes move through administrative checks, routing and status updates in minutes rather than days, protecting response speed at customer scale." },
  ] : [
    { id: "build" as const, icon: Banknote, value: "£100k", label: "One-time solution build", note: "Reported build cost", eyebrow: "Capital deployed", title: "£100K changed the operating control model.", copy: "The reported solution-build cost is £100K. Finance can now validate the continuing cost base against the changed team footprint and the processing time released every day." },
    { id: "team" as const, icon: UserCheck, value: "60 → 30", label: "Global team footprint", note: "Customer service & planning", eyebrow: "Operating footprint changed", title: "The service and planning model now needs 30 people rather than 60.", copy: "This is a reported operating change. At the supplied £1,750 average monthly CS employee cost, it creates a £52.5K monthly gross CS cost delta before redeployment, planner-cost differences and run cost are validated." },
    { id: "payroll" as const, icon: Banknote, value: "£630k", label: "Annualised gross CS cost delta", note: "30 × £1,750 × 12", eyebrow: "Supplied cost basis applied", title: "The 30-person reduction equates to a £630K annualised gross CS cost delta.", copy: "This calculation uses the supplied £1,750 average monthly CS employee cost. It is a gross CS-equivalent cost delta, not a booked saving, because redeployment, planner-cost differences, severance and operating run cost have not been validated." },
  ];
  const selected = evidence.find((item) => item.id === focus) ?? evidence[0];
  const SelectedIcon = selected.icon;

  return (
    <SectionFrame
      eyebrow={lens === "cfo" ? "CFO lens · cost, control and evidence" : "CEO lens · customer scale and operating leverage"}
      title={lens === "cfo" ? "£100K changed a £630K annualised gross CS cost basis." : "45,000 customer orders managed by agents."}
      intro={lens === "cfo" ? "The reported inputs are £100K to build, a 60-to-30 global customer-service and planning team, 45,000 annual customer orders and a supplied £1,750 average monthly CS employee cost. That produces a £52.5K monthly and £630K annualised gross CS cost delta before benefit-realisation adjustments." : "45,000 annual customer orders now move through a connected operating model. The live agents remove repeatable hand-offs, protecting response speed while people focus on exceptions and customer judgement."}
    >
      <div className={`impact-proof-rail impact-proof-rail--${lens}`} role="tablist" aria-label={`${lens.toUpperCase()} operating impact evidence`}>
        {evidence.map((item, index) => {
          const Icon = item.icon;
          return (
            <button key={item.id} type="button" role="tab" aria-selected={focus === item.id} aria-controls="impact-evidence-detail" className={focus === item.id ? "active" : ""} onClick={() => setFocus(item.id)}>
              <span>0{index + 1}</span><Icon size={18} /><strong>{item.value}</strong><b>{item.label}</b><small>{item.note}</small>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section key={focus} id="impact-evidence-detail" role="tabpanel" className={`impact-focus impact-focus--${focus}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}>
          <div className="impact-focus-copy">
            <span className="panel-label"><SelectedIcon size={17} />{selected.eyebrow}</span>
            <h2>{selected.title}</h2>
            <p>{selected.copy}</p>
          </div>
          {focus === "scale" && <div className="order-scale" aria-label="45,000 annual customer orders supported by the operating model"><div><span>Annual customer orders</span><strong>45,000</strong><small>Reported order volume</small></div><i><ArrowUpRight size={20} /></i><div className="today"><span>Order capacity per person</span><strong>1,500</strong><small>45,000 orders ÷ 30 people</small></div><b>2× more annual order capacity per operating person</b></div>}
          {focus === "team" && <div className="team-shift" aria-label="Global team changed from 60 to 30 people"><div><span>Before</span><strong>60</strong><small>People across customer service & planning</small></div><i><ArrowUpRight size={20} /></i><div className="today"><span>Today</span><strong>30</strong><small>People operating the connected model</small></div><b>{lens === "ceo" ? "45,000 annual orders · 1,500 orders per person" : "30-person lower operating footprint"}</b></div>}
          {focus === "time" && <div className="time-compression" aria-label="Processing time comparisons"><div><span>Brief → contract</span><strong>2 days</strong><i><ArrowUpRight size={17} /></i><b>2 minutes</b></div><div><span>Order → cash</span><strong>3 days</strong><i><ArrowUpRight size={17} /></i><b>3 minutes</b></div><small>Both are 1,440× administrative processing compression. Order-to-cash excludes physical manufacturing, production queues and delivery transit.</small></div>}
          {focus === "payroll" && <div className="build-cost"><div><span>Annualised gross CS cost delta</span><strong>£630k</strong><small>30 × £1,750 × 12</small></div><p>The reported team reduction is 30 people. At the supplied £1,750 average monthly CS employee cost, that is £52.5K each month and £630K annualised before redeployment, planner-cost differences, severance or run cost.</p><b>This is a gross CS-equivalent cost delta, not a booked saving, ROI or payback claim.</b></div>}
          {focus === "build" && <div className="build-cost"><div><span>One-time build</span><strong>£100k</strong><small>Reported solution-build cost</small></div><p>This is the cost side of the equation. The demonstrated operating result is a 30-person lower team footprint alongside time released from days-to-minutes process execution.</p><b>No synthetic payback or NPV is shown without validated payroll, utilisation and run-cost baselines.</b></div>}
        </motion.section>
      </AnimatePresence>

      <MonthlyOperatingDashboard lens={lens} />

      <div className="impact-evidence-grid">
        {lens === "ceo" ? <><article><span>01</span><b>Customer scale</b><strong>45,000 orders</strong><p>Annual customer order volume supported by the connected operating model.</p></article><article><span>02</span><b>Capacity</b><strong>2× per person</strong><p>Order capacity rises from 750 to 1,500 annual orders for each operating person.</p></article><article><span>03</span><b>Service speed</b><strong>Days → minutes</strong><p>Live flows remove repeatable administration before the exception needs human judgement.</p></article></> : <><article><span>01</span><b>Capital deployed</b><strong>£100k</strong><p>Reported one-time solution build cost.</p></article><article><span>02</span><b>Gross monthly delta</b><strong>£52.5k</strong><p>30 people × £1,750 average monthly CS employee cost.</p></article><article><span>03</span><b>Annualised gross delta</b><strong>£630k</strong><p>Gross CS-equivalent cost delta before redeployment and run-cost adjustments.</p></article></>}
      </div>
      <p className="model-note"><CircleDot size={13} /> {lens === "ceo" ? "Reported operating context: 45,000 annual customer orders, a global customer-service and planning team moving from 60 to 30, and live agent-processing comparisons from days to minutes." : "CFO cost basis: 30 people × supplied £1,750 average monthly CS employee cost = £52.5K monthly and £630K annualised gross CS cost delta. Redeployment, planner-cost differences, severance, annual run cost, payback and NPV are not included."}</p>
    </SectionFrame>
  );
}

function NextSection({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  const engagementPhases = [
    { number: "01", timing: "Days 0–30 · indicative", title: "Map and agree", copy: "Select one process, map the current path end to end, name every human approval gate, and confirm the systems of record and data access required.", output: "Signed scope with named gates and a measured baseline." },
    { number: "02", timing: "Days 31–60 · indicative", title: "Build in the real systems", copy: "Assemble the scoped agents, connect the live systems, implement approvals and audit trail, and run against real historical volume.", output: "Working flow in a controlled environment with exceptions routing correctly." },
    { number: "03", timing: "Days 61–90 · indicative", title: "Run live and measure", copy: "Operate the flow on live work with human approvals in place, measure against the day-zero baseline, and decide whether to widen.", output: "Live process and an evidenced decision on the second one." },
  ];
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
      <section className="engagement-shape" aria-labelledby="engagement-shape-title">
        <div className="engagement-heading"><div><span className="overline">Indicative 90-day engagement</span><h2 id="engagement-shape-title">One process. Measured progress.</h2></div><p>Build evidence before scale: one live process, named controls and a decision based on observed operation. This is indicative scope, not a promised delivery timeline.</p></div>
        <div className="engagement-phase-grid">
          {engagementPhases.map((phase) => <article key={phase.number}><span>{phase.number}</span><small>{phase.timing}</small><h3>{phase.title}</h3><p>{phase.copy}</p><div><b>Output</b><strong>{phase.output}</strong></div></article>)}
        </div>
        <p className="euroma-provides"><span>What Euroma provides</span>A named process owner, a named business approver, access to the systems of record, and one technical contact for integration.</p>
      </section>
      <div className="closing-line">
        <span>ALFRED × EUROMA</span>
        <strong>Production AI. Human control.</strong>
        <span>2026</span>
      </div>
    </SectionFrame>
  );
}

function SectionAdvance({ section, onNavigate }: { section: SectionId; onNavigate: (id: SectionId) => void }) {
  const currentIndex = navItems.findIndex((item) => item.id === section);
  const isLast = currentIndex === navItems.length - 1;
  const target = navItems[isLast ? 0 : currentIndex + 1];
  return (
    <div className="section-advance">
      <span>{isLast ? "Deck complete" : "Next section"}</span>
      <button type="button" onClick={() => onNavigate(target.id)} aria-label={isLast ? "Back to start" : `Open section ${target.kicker}: ${target.label}`}>
        <b>{target.kicker}</b><strong>{isLast ? `Back to start · ${target.label}` : target.label}</strong><ArrowUpRight size={16} />
      </button>
    </div>
  );
}

function AppShell() {
  const [section, setSection] = useState<SectionId>(() => {
    const requested = new URLSearchParams(window.location.search).get("section");
    return navItems.some((item) => item.id === requested) ? requested as SectionId : "intro";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [laserPointer, setLaserPointer] = useState(false);
  const [lens, setLens] = useState<ExecutiveLens>("ceo");
  const laserPointerRef = useRef<HTMLDivElement>(null);
  const currentIndex = navItems.findIndex((item) => item.id === section);

  useEffect(() => {
    const syncFullscreenState = () => {
      if (!document.fullscreenElement) {
        setIsPresenting(false);
        setLaserPointer(false);
      }
    };
    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () => document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, []);

  useEffect(() => {
    if (!isPresenting || !laserPointer) return;
    const placePointer = (x: number, y: number) => {
      laserPointerRef.current?.style.setProperty("transform", `translate3d(${x - 17}px, ${y - 17}px, 0)`);
    };
    placePointer(window.innerWidth / 2, window.innerHeight / 2);
    let frame = 0;
    const followPointer = (event: PointerEvent) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => placePointer(event.clientX, event.clientY));
    };
    window.addEventListener("pointermove", followPointer, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", followPointer);
    };
  }, [isPresenting, laserPointer]);

  useEffect(() => {
    if (!isPresenting) {
      setLaserPointer(false);
      return;
    }
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target instanceof HTMLElement && target.matches("input, textarea, select, [contenteditable='true']")) return;
      if (event.key.toLowerCase() === "l") {
        event.preventDefault();
        setLaserPointer((enabled) => !enabled);
      }
      if (event.key === "Escape" && !document.fullscreenElement) setIsPresenting(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isPresenting]);

  const togglePresentation = async () => {
    if (isPresenting) {
      if (document.fullscreenElement) await document.exitFullscreen();
      setIsPresenting(false);
      setLaserPointer(false);
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
    if (section === "aps") return <APSSection />;
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
    <div className={`app-shell ${isPresenting ? "presenting" : ""} ${laserPointer ? "pointer-active" : ""}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      {isPresenting && laserPointer && <div ref={laserPointerRef} className="presentation-pointer" aria-hidden="true"><i /></div>}
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
          {isPresenting && <button type="button" className={`pointer-button ${laserPointer ? "active" : ""}`} onClick={() => setLaserPointer((enabled) => !enabled)} aria-pressed={laserPointer} title="Toggle laser pointer (L)"><MousePointer2 size={14} /><span>{laserPointer ? "Pointer on" : "Pointer"}</span></button>}
          <button type="button" className="presentation-button" onClick={togglePresentation} aria-pressed={isPresenting} title={isPresenting ? "Exit presentation mode" : "Enter full-screen presentation mode"}>
            {isPresenting ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            <span>{isPresenting ? "Exit full screen" : "Present"}</span>
          </button>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">{renderSection()}</AnimatePresence>
        <SectionAdvance section={section} onNavigate={navigate} />
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
