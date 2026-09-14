import { useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
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
  Network,
  Pause,
  Play,
  ScanLine,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Workflow,
  Zap,
} from "lucide-react";

const ASSETS = {
  euroma: "/manus-storage/euroma-logo_e0add910.jpg",
  cpl: "/manus-storage/cpl-aromas-logo_9af8b233.jpg",
  symrise: "/manus-storage/symrise-logo_e03531b2.jpg",
  levis: "/manus-storage/levi-strauss-logo_32a09afd.jpg",
  cognizant: "/manus-storage/cognizant-logo_b2f03f0b.png",
  ntt: "/manus-storage/ntt-data-logo_51231f78.png",
};

type SectionId = "intro" | "tech" | "b2c" | "o2c" | "impact" | "next";
type StepKind = "agent" | "human" | "decision";

type ProcessStep = {
  title: string;
  copy: string;
  kind: StepKind;
  tags?: string[];
  branches?: { label: string; copy: string }[];
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
    years: "2000 — 2012",
    logo: ASSETS.levis,
    copy: "A 12-year foundation in SAP, ERP and global transformation delivery across Singapore, San Francisco, France and India, progressing from hands-on consulting into programme and practice leadership.",
  },
  {
    name: "Cognizant",
    role: "Enterprise systems & consulting leadership",
    years: "2000 — 2012",
    logo: ASSETS.cognizant,
    copy: "Multi-country enterprise delivery and architecture discipline across global clients, with a focus on systems that had to work in the real operating environment.",
  },
  {
    name: "Caritor / NTT DATA",
    role: "Enterprise technology delivery",
    years: "2000 — 2012",
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
    title: "Brief arrives",
    copy: "The agent captures the enquiry at source and logs it without manual re-keying.",
    kind: "agent",
    tags: ["Email", "Portal", "CRM"],
  },
  {
    title: "CRM structured",
    copy: "The brief is classified, structured and attached to the right account and contact.",
    kind: "agent",
    tags: ["Agent"],
  },
  {
    title: "Receipt confirmed",
    copy: "The customer gets an immediate acknowledgement while the work continues behind it.",
    kind: "agent",
    tags: ["Customer response"],
  },
  {
    title: "Feasibility tested",
    copy: "The brief is checked against what can actually be made and delivered.",
    kind: "decision",
    tags: ["Rules", "Capacity", "Compliance"],
  },
  {
    title: "Human sign-off",
    copy: "A named person confirms the feasibility decision before the flow can progress or decline the work.",
    kind: "human",
    tags: ["Required checkpoint"],
  },
  {
    title: "Library matched",
    copy: "The agent searches the existing formulation library before starting original work.",
    kind: "decision",
    tags: ["Similarity search", "Cost data"],
    branches: [
      {
        label: "Match found",
        copy: "A person approves the match. The agent then sends a system-priced quote.",
      },
      {
        label: "No match",
        copy: "A new project is created and routed to the perfumer team.",
      },
    ],
  },
];

const orderToCash: ProcessStep[] = [
  {
    title: "PO received",
    copy: "Email or WhatsApp enters the same controlled flow.",
    kind: "agent",
    tags: ["Email", "WhatsApp"],
  },
  {
    title: "Receipt confirmed",
    copy: "The customer knows the purchase order landed before processing begins.",
    kind: "agent",
  },
  {
    title: "PO reconciled",
    copy: "OCR extracts the order and checks it against the approved CRM quote.",
    kind: "decision",
    tags: ["OCR", "Quote match"],
    branches: [
      { label: "Mismatch", copy: "Customer Service audits and resolves it before order creation." },
      { label: "Match", copy: "Order creation continues automatically." },
    ],
  },
  {
    title: "Credit checked",
    copy: "The order is created and the credit check runs in the same motion.",
    kind: "decision",
    tags: ["Finance control"],
    branches: [
      { label: "Fail", copy: "Finance and the account manager decide how to proceed." },
      { label: "Pass", copy: "The flow moves straight into material planning." },
    ],
  },
  {
    title: "Mini-MRP run",
    copy: "Raw materials, safety stock and factory capacity are checked to establish a delivery date.",
    kind: "decision",
    tags: ["Materials", "Capacity"],
    branches: [
      { label: "Short", copy: "A buying request is raised and the customer is updated against supplier lead time." },
      { label: "Clear", copy: "The delivery date is confirmed automatically." },
    ],
  },
  {
    title: "Production raised",
    copy: "The agent checks solution or base stock, explodes the bill of materials where needed, and selects available factory capacity.",
    kind: "agent",
    tags: ["BOM", "Factory allocation"],
  },
  {
    title: "Factory released",
    copy: "Production starts and the customer portal begins updating in real time.",
    kind: "agent",
  },
  {
    title: "Production tracked",
    copy: "Dosing, finishing and packing movements are posted as they happen.",
    kind: "agent",
    tags: ["Live status"],
  },
  {
    title: "QC released",
    copy: "Quality receives the completion signal and records the result. Shipping cannot proceed without sign-off.",
    kind: "human",
    tags: ["Required checkpoint"],
  },
  {
    title: "Shipping prepared",
    copy: "Tracking and shipping paperwork, including customs documents, are generated automatically.",
    kind: "agent",
    tags: ["Customs", "Tracking"],
  },
  {
    title: "Invoice sent",
    copy: "Goods issue triggers the invoice immediately. There is no separate manual invoicing step.",
    kind: "agent",
    tags: ["Goods issue", "Invoice"],
  },
];

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
  eyebrow,
  title,
  intro,
  checkpoints,
}: {
  steps: ProcessStep[];
  eyebrow: string;
  title: string;
  intro: string;
  checkpoints: string[];
}) {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!running) return;
    if (active >= steps.length - 1) {
      setRunning(false);
      return;
    }
    const timer = window.setTimeout(() => setActive((current) => current + 1), 720);
    return () => window.clearTimeout(timer);
  }, [active, running, steps.length]);

  useEffect(() => {
    const node = railRef.current?.querySelector(`[data-node="${active}"]`);
    node?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", inline: "center", block: "nearest" });
  }, [active, reduced]);

  const run = () => {
    if (running) {
      setRunning(false);
      return;
    }
    setActive(0);
    window.setTimeout(() => setRunning(true), 120);
  };

  const current = steps[active];
  return (
    <SectionFrame eyebrow={eyebrow} title={title} intro={intro}>
      <div className="flow-toolbar">
        <div className="legend">
          <span><i className="agent" />Agent action</span>
          <span><i className="decision" />Decision</span>
          <span><i className="human" />Human control</span>
        </div>
        <button className="run-button" type="button" onClick={run}>
          {running ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
          {running ? "Pause flow" : "Run the flow"}
        </button>
      </div>

      <div className="flow-shell">
        <div className="flow-rail" ref={railRef}>
          {steps.map((step, index) => (
            <div className="flow-unit" key={step.title}>
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
                <small>{step.kind === "human" ? "Human checkpoint" : step.kind === "decision" ? "Decision gate" : "Autonomous action"}</small>
                {active === index && <motion.i layoutId={`node-glow-${title}`} className="node-glow" />}
              </motion.button>
              {index < steps.length - 1 && (
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
                      animate={{ x: 48, opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 0.68, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            className={`flow-detail ${current.kind}`}
            key={`${title}-${active}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            <div className="detail-number">{String(active + 1).padStart(2, "0")}</div>
            <div className="detail-main">
              <div className="detail-kind"><KindIcon kind={current.kind} /> {current.kind === "human" ? "Human control" : current.kind === "decision" ? "Decision gate" : "Agent action"}</div>
              <h3>{current.title}</h3>
              <p>{current.copy}</p>
              {current.tags && <div className="tag-row">{current.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
            </div>
            {current.branches && (
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
  if (Math.abs(value) >= 1_000_000) return `£${(value / 1_000_000).toFixed(2)}m`;
  if (Math.abs(value) >= 1_000) return `£${Math.round(value / 1_000)}k`;
  return `£${Math.round(value)}`;
}

function ImpactSection() {
  const [mode, setMode] = useState<"brief" | "order">("brief");
  const [brief, setBrief] = useState({ volume: 1200, days: 12, cost: 350, pct: 50 });
  const [order, setOrder] = useState({ volume: 4000, days: 18, revenue: 25000000, pct: 50, fte: 220 });

  const outputs = useMemo(() => {
    if (mode === "brief") {
      const newDays = brief.days * (1 - brief.pct / 100);
      const totalFreed = brief.volume * (brief.days - newDays);
      return [
        { value: formatNumber(newDays, 1), label: "New average cycle", formula: "days", accent: true },
        { value: formatNumber(totalFreed), label: "Person-days freed / year", formula: "volume × days saved" },
        { value: formatMoney(totalFreed * brief.cost), label: "Capacity value / year", formula: "days freed × loaded cost" },
      ];
    }
    const newDays = order.days * (1 - order.pct / 100);
    const totalFreed = order.volume * (order.days - newDays);
    return [
      { value: formatNumber(newDays, 1), label: "New average cycle", formula: "days", accent: true },
      { value: formatNumber(totalFreed), label: "Order-days freed / year", formula: "volume × days saved" },
      { value: formatNumber(totalFreed / order.fte, 1), label: "FTE-equivalent freed", formula: "days freed ÷ working days" },
      { value: formatMoney(((order.days - newDays) / 365) * order.revenue), label: "Working capital released", formula: "days saved ÷ 365 × revenue" },
    ];
  }, [brief, order, mode]);

  return (
    <SectionFrame
      eyebrow="Build your own case"
      title="Put your numbers through it."
      intro="This is a live model, not a claim about Euroma. Change any input and the case recalculates in front of the room."
    >
      <div className="impact-tabs">
        <button className={mode === "brief" ? "active" : ""} onClick={() => setMode("brief")} type="button">Brief → contract</button>
        <button className={mode === "order" ? "active" : ""} onClick={() => setMode("order")} type="button">Order → cash</button>
      </div>
      <div className="calculator-grid">
        <div className="input-panel">
          <div className="panel-label"><Gauge size={17} /><span>OPERATING INPUTS</span></div>
          {mode === "brief" ? (
            <>
              <NumberField label="Enquiries per year" value={brief.volume} onChange={(volume) => setBrief({ ...brief, volume })} />
              <NumberField label="Current brief-to-contract cycle" value={brief.days} onChange={(days) => setBrief({ ...brief, days })} hint="days" />
              <NumberField label="Loaded cost per person-day" value={brief.cost} onChange={(cost) => setBrief({ ...brief, cost })} prefix="£" />
              <SliderField label="Manual effort removed" value={brief.pct} onChange={(pct) => setBrief({ ...brief, pct })} />
            </>
          ) : (
            <>
              <NumberField label="Orders per year" value={order.volume} onChange={(volume) => setOrder({ ...order, volume })} />
              <NumberField label="Current order-to-cash cycle" value={order.days} onChange={(days) => setOrder({ ...order, days })} hint="days" />
              <NumberField label="Annual revenue touched" value={order.revenue} onChange={(revenue) => setOrder({ ...order, revenue })} prefix="£" />
              <NumberField label="Working days per FTE" value={order.fte} onChange={(fte) => setOrder({ ...order, fte })} />
              <SliderField label="Manual effort removed" value={order.pct} onChange={(pct) => setOrder({ ...order, pct })} />
            </>
          )}
        </div>
        <div className="output-grid">
          {outputs.map((output) => <OutputCard key={output.label} {...output} />)}
        </div>
      </div>
      <p className="model-note"><CircleDot size={13} /> The model exposes every assumption. Replace the sample values with Euroma’s actual operating data.</p>
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
  const currentIndex = navItems.findIndex((item) => item.id === section);

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
        eyebrow="Live at CPL Aromas"
        title="Brief to contract, without the dead time."
        intro="Six controlled steps from incoming brief to matched formulation or new creative project. Click any node, or run the whole flow."
        checkpoints={["Feasibility requires named approval", "Library match requires human confirmation before quote"]}
      />
    );
    if (section === "o2c") return (
      <ProcessFlow
        steps={orderToCash}
        eyebrow="Live at CPL Aromas"
        title="Order to cash, connected end to end."
        intro="Eleven steps from purchase order to invoice. The agent carries context across commercial, planning, factory, quality and logistics systems."
        checkpoints={["PO mismatches go to Customer Service", "Credit failures go to Finance", "Shipping waits for human QC release"]}
      />
    );
    if (section === "impact") return <ImpactSection />;
    return <NextSection onNavigate={navigate} />;
  };

  return (
    <div className="app-shell">
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
        <div className="header-status"><i />LIVE SYSTEMS</div>
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
