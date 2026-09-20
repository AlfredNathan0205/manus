import { useEffect, useState, type ElementType } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Box,
  BrainCircuit,
  Check,
  CircleDot,
  Database,
  Factory,
  Gauge,
  Layers3,
  Pause,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Workflow,
  Zap,
} from "lucide-react";

type ScenarioKey = "baseline" | "surge" | "delay";

type ApsAgent = {
  name: string;
  role: string;
  output: string;
  detail: string;
  icon: ElementType;
  duration: number;
};

const APS_AGENTS: ApsAgent[] = [
  {
    name: "Demand Forecast Agent",
    role: "Forecast horizon",
    output: "Demand signal validated",
    detail: "Reads sales history, confirmed orders and market signals to create a demand view planners can challenge.",
    icon: Activity,
    duration: 760,
  },
  {
    name: "Capacity Agent",
    role: "Constraint check",
    output: "Feasible resource envelope",
    detail: "Tests machines, tools, labour shifts and planned maintenance before a production promise is made.",
    icon: Gauge,
    duration: 980,
  },
  {
    name: "Sequencing Agent",
    role: "Changeover optimisation",
    output: "Low-changeover production order",
    detail: "Groups compatible work, respects dependencies and sequences jobs to reduce avoidable setup time.",
    icon: Layers3,
    duration: 860,
  },
  {
    name: "What-if Agent",
    role: "Protected simulation",
    output: "Scenario compared — no shop-floor change",
    detail: "Models demand surges, downtime and material risk in a sandbox before any live schedule is touched.",
    icon: Sparkles,
    duration: 1080,
  },
  {
    name: "Schedule Adjustment Agent",
    role: "Event response",
    output: "Constraint-aware plan ready",
    detail: "Replans when material ETA, equipment availability or live production progress changes, preserving the audit trail.",
    icon: RefreshCw,
    duration: 920,
  },
];

const SCENARIOS: Record<ScenarioKey, { label: string; signal: string; impact: string; plan: string; risk: string }> = {
  baseline: {
    label: "Stable load",
    signal: "Confirmed demand holds against the current horizon.",
    impact: "No critical machine or labour constraint found.",
    plan: "Sequence preserves planned delivery windows.",
    risk: "Low",
  },
  surge: {
    label: "Demand surge",
    signal: "Forecast demand rises 18% for the selected family.",
    impact: "Mixer 02 reaches a capacity threshold in the current plan.",
    plan: "Alternative route and second-shift option are compared.",
    risk: "Medium",
  },
  delay: {
    label: "Material delay",
    signal: "A constrained material ETA moves beyond its expected arrival.",
    impact: "Two dependent works orders become infeasible at their current slot.",
    plan: "Compatible work is resequenced; the protected simulation is retained.",
    risk: "Controlled",
  },
};

export default function APSOrchestrationExperience({ langchainLogo }: { langchainLogo: string }) {
  const reduced = useReducedMotion();
  const [scenario, setScenario] = useState<ScenarioKey>("baseline");
  const [activeAgent, setActiveAgent] = useState(0);
  const [running, setRunning] = useState(false);
  const [released, setReleased] = useState(false);

  const selectedScenario = SCENARIOS[scenario];
  const currentAgent = APS_AGENTS[activeAgent];
  const complete = activeAgent === APS_AGENTS.length - 1 && !running;

  useEffect(() => {
    if (!running) return;
    const timeout = window.setTimeout(() => {
      if (activeAgent < APS_AGENTS.length - 1) {
        setActiveAgent((current) => current + 1);
      } else {
        setRunning(false);
      }
    }, reduced ? 80 : currentAgent.duration);
    return () => window.clearTimeout(timeout);
  }, [activeAgent, currentAgent.duration, reduced, running]);

  const chooseScenario = (key: ScenarioKey) => {
    setScenario(key);
    setActiveAgent(0);
    setRunning(false);
    setReleased(false);
  };

  const runFlow = () => {
    setReleased(false);
    setActiveAgent(0);
    setRunning(true);
  };

  const inspectAgent = (index: number) => {
    setRunning(false);
    setActiveAgent(index);
  };

  return (
    <section id="aps-orchestration" className="aps-experience" aria-labelledby="aps-orchestration-title">
      <div className="aps-header">
        <div>
          <span className="aps-kicker"><Workflow size={14} />Illustrative LangChain orchestration</span>
          <h2 id="aps-orchestration-title">APS, run as an agentic control loop.</h2>
        </div>
        <p>ERP provides the planning evidence. A LangChain supervisor directs five bounded planning agents. MES receives an approved schedule and returns execution events for the next decision.</p>
      </div>

      <div className="aps-shell" data-aps-scenario={scenario}>
        <div className="aps-toolbar">
          <div className="aps-scenario-select" aria-label="APS illustrative scenario">
            {Object.entries(SCENARIOS).map(([key, item]) => (
              <button key={key} type="button" className={scenario === key ? "active" : ""} onClick={() => chooseScenario(key as ScenarioKey)} aria-pressed={scenario === key}>
                <CircleDot size={11} />{item.label}
              </button>
            ))}
          </div>
          <div className="aps-toolbar-status"><span><i />All planning decisions: LangChain agents</span><b>{running ? "Evaluating" : released ? "MES released" : complete ? "Planner review" : "Ready"}</b></div>
          <button type="button" className="aps-run" onClick={running ? () => setRunning(false) : runFlow}>
            {running ? <Pause size={14} /> : complete ? <RefreshCw size={14} /> : <Play size={14} fill="currentColor" />}{running ? "Pause flow" : complete ? "Replay flow" : "Run plan"}
          </button>
        </div>

        <div className="aps-layout">
          <article className="aps-system-card aps-erp" aria-label="ERP data source">
            <div className="aps-system-icon"><Database size={19} /></div>
            <span>System of record</span>
            <h3>SAP ERP</h3>
            <p>Orders, BOMs, inventory, routings, supplier dates and master data.</p>
            <div className="aps-system-foot"><Box size={12} />Constraint context in</div>
          </article>

          <div className="aps-agent-stage">
            <div className="aps-stage-topline"><span>LangChain supervisor</span><b>Plan → simulate → decide → release</b></div>
            <div className="aps-supervisor">
              <div className="aps-langchain-mark"><img src={langchainLogo} alt="LangChain logo" /></div>
              <div><span>Supervisor agent</span><strong>Constraint-aware orchestration</strong><p>State is preserved between agent calls; each agent returns evidence rather than acting beyond its role.</p></div>
              <div className="aps-flow-pulse" aria-hidden="true"><i /><i /><i /></div>
            </div>

            <div className="aps-agent-list" aria-label="LangChain APS agents">
              {APS_AGENTS.map((agent, index) => {
                const Icon = agent.icon;
                const isComplete = index < activeAgent || (complete && index === activeAgent);
                const isActive = index === activeAgent;
                return (
                  <motion.button
                    key={agent.name}
                    type="button"
                    className={`aps-agent ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`}
                    onClick={() => inspectAgent(index)}
                    aria-pressed={isActive}
                    initial={false}
                    animate={{ opacity: index > activeAgent + 1 ? 0.56 : 1 }}
                    transition={{ duration: reduced ? 0 : 0.18 }}
                  >
                    <span className="aps-agent-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="aps-agent-icon"><Icon size={15} /></span>
                    <span className="aps-agent-copy"><strong>{agent.name}</strong><small>LangChain · {agent.role}</small></span>
                    <span className="aps-agent-status">{isActive && running ? "Working" : isActive ? "Inspect" : isComplete ? "Done" : "Queued"}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className="aps-agent-detail" aria-live="polite">
              <div><span>Active evidence</span><strong>{currentAgent.output}</strong><p>{currentAgent.detail}</p></div>
              <div className="aps-agent-progress" aria-label={`Stage ${activeAgent + 1} of ${APS_AGENTS.length}`}><i style={{ transform: `scaleX(${(activeAgent + 1) / APS_AGENTS.length})` }} /></div>
            </div>
          </div>

          <article className="aps-system-card aps-mes" aria-label="Manufacturing execution system">
            <div className="aps-system-icon"><Factory size={19} /></div>
            <span>Execution feedback</span>
            <h3>MES / Fricke</h3>
            <p>Approved dispatches, machine events, work progress and quality signals.</p>
            <div className="aps-system-foot"><Activity size={12} />Live execution back</div>
          </article>
        </div>

        <div className="aps-decision-grid">
          <div className="aps-signal-card">
            <span><Zap size={13} />Scenario signal</span>
            <strong>{selectedScenario.label}</strong>
            <p>{selectedScenario.signal}</p>
          </div>
          <div className="aps-signal-card">
            <span><Gauge size={13} />Constraint insight</span>
            <strong>{selectedScenario.risk} risk</strong>
            <p>{selectedScenario.impact}</p>
          </div>
          <div className="aps-signal-card aps-plan-card">
            <span><Layers3 size={13} />Proposed schedule</span>
            <strong>{released ? "Dispatched to MES" : "Awaiting planner release"}</strong>
            <p>{selectedScenario.plan}</p>
          </div>
          <div className="aps-approval-card">
            <div><UserCheck size={16} /><span>Human control</span><strong>Planner approval remains explicit.</strong></div>
            <button type="button" onClick={() => setReleased(true)} disabled={!complete || released}><Check size={13} />{released ? "Released to MES" : complete ? "Approve & release" : "Complete review first"}</button>
          </div>
        </div>

        <div className="aps-explanation-strip">
          <div><span>01</span><strong>ERP</strong><p>Provides the source data and constraints.</p></div>
          <i />
          <div><span>02</span><strong>APS / LangChain agents</strong><p>Forecast, test, sequence and propose a governed plan.</p></div>
          <i />
          <div><span>03</span><strong>MES</strong><p>Executes the approved work and reports events back.</p></div>
          <i />
          <div><span>04</span><strong>APS replans</strong><p>Responds to real-world change with evidence.</p></div>
        </div>
      </div>

      <p className="aps-disclosure"><ShieldCheck size={13} />Illustrative concept: the flow shows the proposed LangChain agent architecture. It does not represent a deployed APS instance or operational production schedule.</p>
    </section>
  );
}
