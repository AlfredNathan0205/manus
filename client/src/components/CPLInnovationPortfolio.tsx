import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BrainCircuit,
  FlaskConical,
  Network,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type Capability = {
  id: string;
  number: string;
  title: string;
  label: string;
  statement: string;
  detail: string;
  inputs: string;
  engine: string;
  output: string;
  icon: LucideIcon;
  accent: "gold" | "green" | "coral";
};

const capabilities: Capability[] = [
  {
    id: "captives",
    number: "01",
    title: "Captive molecule studio",
    label: "IP creation",
    statement: "Generate single-molecule captives designed for patent review.",
    detail: "A dedicated R&D application explores single-molecule fragrance captives, placing patentability alongside olfactive intent from the first creative brief.",
    inputs: "Olfactive target · molecular white space",
    engine: "Single-molecule generation · patentability screen",
    output: "Candidate captives prepared for IP review",
    icon: FlaskConical,
    accent: "gold",
  },
  {
    id: "stability",
    number: "02",
    title: "Stability intelligence",
    label: "Predictive testing",
    statement: "Predict stability before the lab cycle completes.",
    detail: "The stability prediction application turns formula and test-condition data into an early R&D signal, helping teams focus physical testing where it matters most.",
    inputs: "Formula data · storage and test conditions",
    engine: "Predictive stability model",
    output: "91% reported prediction accuracy",
    icon: Activity,
    accent: "green",
  },
  {
    id: "regulatory",
    number: "03",
    title: "Regulatory autonomy",
    label: "22 module agents",
    statement: "Twenty-two autonomous agents govern regulatory work.",
    detail: "A modular regulatory-agent estate reads requirements, surfaces constraints and assembles evidence so experts can concentrate on the approvals and judgements that remain human-owned.",
    inputs: "Formula · market requirements · regulations",
    engine: "22 autonomous regulatory module agents",
    output: "Evidence, constraints and approval-ready routing",
    icon: ShieldCheck,
    accent: "coral",
  },
  {
    id: "trends",
    number: "04",
    title: "Trend analysis",
    label: "Creative intelligence",
    statement: "Industry signals feed directly into perfumers’ creative process.",
    detail: "The fragrance-industry trend analysis application turns external category signals into evidence-backed directions that perfumers can interrogate, adapt and use in creative development.",
    inputs: "Industry signals · editorial and category evidence",
    engine: "Trend analysis application",
    output: "Source-linked creative directions for perfumers",
    icon: Network,
    accent: "green",
  },
  {
    id: "sensity",
    number: "05",
    title: "Sensity",
    label: "Emotion response",
    statement: "Measure emotional response to wellness-based fragrance.",
    detail: "Sensity is an evaluation application for understanding emotional response to wellness-based fragrance, creating a new evidence layer for creative and consumer-insight conversations.",
    inputs: "Wellness-based fragrance · response signals",
    engine: "Sensity emotional-response measurement",
    output: "Decision support for fragrance evaluation",
    icon: BrainCircuit,
    accent: "gold",
  },
];

export default function CPLInnovationPortfolio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const idPrefix = useId();
  const active = capabilities[activeIndex];
  const Icon = active.icon;

  return (
    <section className="cpl-portfolio" aria-labelledby="cpl-portfolio-title">
      <div className="cpl-portfolio-intro">
        <span><Sparkles size={15} /> INDUSTRY-TRANSFORMATIVE APPLICATIONS & AGENTS</span>
        <p>Five connected capability families turn fragrance expertise into faster invention, evidence and expert decision-making.</p>
      </div>

      <div className="cpl-capability-tabs" role="tablist" aria-label="CPL innovation capabilities">
        {capabilities.map((capability, index) => {
          const CapabilityIcon = capability.icon;
          const isActive = activeIndex === index;
          return (
            <button
              key={capability.id}
              type="button"
              role="tab"
              id={`${idPrefix}-${capability.id}-tab`}
              aria-controls={`${idPrefix}-${capability.id}-panel`}
              aria-selected={isActive}
              data-cpl-capability={capability.id}
              className={`cpl-capability cpl-capability--${capability.accent} ${isActive ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <span className="cpl-capability-number">{capability.number}</span>
              <CapabilityIcon className="cpl-capability-icon" size={20} strokeWidth={1.55} />
              <strong>{capability.title}</strong>
              <small>{capability.label}</small>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          key={active.id}
          id={`${idPrefix}-${active.id}-panel`}
          className={`cpl-capability-detail cpl-capability-detail--${active.accent}`}
          role="tabpanel"
          aria-labelledby={`${idPrefix}-${active.id}-tab`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="cpl-detail-copy">
            <div className="cpl-detail-icon"><Icon size={27} strokeWidth={1.4} /></div>
            <span>{active.label}</span>
            <h3 id="cpl-portfolio-title">{active.statement}</h3>
            <p>{active.detail}</p>
          </div>
          <dl className="cpl-evidence-grid">
            <div><dt>Reads</dt><dd>{active.inputs}</dd></div>
            <div><dt>Runs</dt><dd>{active.engine}</dd></div>
            <div><dt>Creates</dt><dd>{active.output}</dd></div>
          </dl>
        </motion.article>
      </AnimatePresence>

      <div className="cpl-portfolio-journey" aria-label="Innovation capability journey">
        {[
          ["Invent", "Captive molecules"],
          ["Validate", "Stability prediction"],
          ["Govern", "Regulatory agents"],
          ["Inspire", "Trend intelligence"],
          ["Measure", "Sensity response"],
        ].map(([stage, description], index) => <div key={stage}><span>0{index + 1}</span><strong>{stage}</strong><small>{description}</small></div>)}
      </div>

      <p className="cpl-portfolio-note">The applications and agent capabilities shown here are CPL Aromas operating innovations. Reported performance: 91% stability-prediction accuracy; 22 autonomous regulatory module agents.</p>
    </section>
  );
}
