import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Bot,
  Check,
  Database,
  Hand,
  Network,
  Play,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  Workflow,
  Zap,
} from "lucide-react";

type SimulationStage = 0 | 1 | 2 | 3 | 4 | 5;
type AgentTone = "nominal" | "watching" | "correcting" | "approval" | "resolved";

type AgentFamily = {
  id: string;
  name: string;
  scope: string;
  systems: string;
  icon: typeof Bot;
  baseline: string;
};

const agentFamilies: AgentFamily[] = [
  {
    id: "order",
    name: "Order intake & reconciliation",
    scope: "PO OCR, quote match and order creation",
    systems: "Dynamics 365 · SAP",
    icon: Workflow,
    baseline: "Watching incoming orders",
  },
  {
    id: "brief",
    name: "Brief & feasibility",
    scope: "CRM acknowledgement, feasibility and library match",
    systems: "Dynamics 365 · Copilot Studio",
    icon: Bot,
    baseline: "Matching briefs to capability",
  },
  {
    id: "planning",
    name: "APS planning",
    scope: "Forecast, constraint check and production sequence",
    systems: "SAP · Fricke · LangChain",
    icon: Network,
    baseline: "Checking capacity signals",
  },
  {
    id: "regulatory",
    name: "Regulatory modules",
    scope: "22 autonomous modules with a monitored control layer",
    systems: "Regulatory workspace",
    icon: ShieldCheck,
    baseline: "Checking policy conditions",
  },
  {
    id: "stability",
    name: "Stability intelligence",
    scope: "Prediction confidence and evidence trace",
    systems: "Predictive stability workspace",
    icon: Activity,
    baseline: "Reviewing confidence boundaries",
  },
  {
    id: "customer",
    name: "Customer-status updates",
    scope: "Production, quality, shipping and portal status",
    systems: "Fricke · Customer portal",
    icon: Database,
    baseline: "Publishing verified status",
  },
];

const activityFeed = [
  { stage: 1, label: "Signal detected", copy: "PO 48321 arrives with a quote-line variance. The order agent contains the event before creation.", icon: Activity },
  { stage: 2, label: "Self-correction prepared", copy: "The agent re-checks the quote against the current Dynamics 365 record and SAP commercial terms.", icon: RefreshCw },
  { stage: 3, label: "Control decision", copy: "A named approver can release the corrected route, or the agent can proceed within its configured guardrail.", icon: Hand },
  { stage: 4, label: "Corrected route released", copy: "The matched record is handed back to the operating flow with the decision trail retained.", icon: Zap },
  { stage: 5, label: "Verification complete", copy: "The event is closed and the monitored estate returns to nominal operation.", icon: Check },
];

function statusForAgent(agent: AgentFamily, stage: SimulationStage, humanGate: boolean): { label: string; tone: AgentTone } {
  if (agent.id !== "order") {
    if (stage === 2 && agent.id === "planning") return { label: "Context check", tone: "watching" };
    if (stage === 3 && humanGate && agent.id === "regulatory") return { label: "Control active", tone: "approval" };
    return { label: "Nominal", tone: "nominal" };
  }

  if (stage === 1) return { label: "Variance observed", tone: "watching" };
  if (stage === 2) return { label: "Self-correcting", tone: "correcting" };
  if (stage === 3 && humanGate) return { label: "Awaiting gate", tone: "approval" };
  if (stage === 3 || stage === 4) return { label: "Corrected route", tone: "resolved" };
  if (stage === 5) return { label: "Verified stable", tone: "resolved" };
  return { label: "Nominal", tone: "nominal" };
}

function stageLabel(stage: SimulationStage, humanGate: boolean) {
  if (stage === 0) return "Monitoring ready";
  if (stage === 1) return "Signal observed";
  if (stage === 2) return "Self-correction running";
  if (stage === 3 && humanGate) return "Awaiting named approval";
  if (stage === 3) return "Guardrail checked";
  if (stage === 4) return "Corrected route released";
  return "Verification complete";
}

export default function AgentOperationsDashboard() {
  const reducedMotion = useReducedMotion();
  const [humanGate, setHumanGate] = useState(true);
  const [stage, setStage] = useState<SimulationStage>(0);
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (stage === 0 || stage >= 5 || (stage === 3 && humanGate)) return;
    const timer = window.setTimeout(() => {
      setStage((current) => Math.min(5, current + 1) as SimulationStage);
    }, reducedMotion ? 110 : 1550);
    return () => window.clearTimeout(timer);
  }, [humanGate, reducedMotion, stage]);

  const activeFeed = useMemo(
    () => activityFeed.filter((entry) => entry.stage <= stage),
    [stage],
  );
  const activeEntry = activityFeed.find((entry) => entry.stage === Math.max(1, Math.min(stage, 5)));
  const monitoredTime = clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const needsApproval = stage === 3 && humanGate;

  const runSimulation = () => setStage(1);
  const approveCorrection = () => setStage(4);

  return (
    <motion.section
      className="section-frame agent-ops-section"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.44, ease: [0.23, 1, 0.32, 1] }}
      data-agent-ops
    >
      <div className="section-heading agent-ops-heading">
        <div className="eyebrow"><span />Agent operations · monitored simulation</div>
        <h1>Every agent observed.<br /><em>Every correction governed.</em></h1>
        <p>A presentation simulation of the control plane behind the live estate: detect a variance, correct it within guardrails, and bring a named person in when judgement is required.</p>
      </div>

      <div className="ops-control-deck">
        <div className="ops-status-line">
          <div className="ops-pulse" aria-hidden="true"><i /><span /></div>
          <div><span>Control plane</span><strong>{stageLabel(stage, humanGate)}</strong></div>
          <small>SIMULATION · {monitoredTime}</small>
        </div>
        <div className="ops-deck-actions">
          <button type="button" className="ops-run-button" onClick={runSimulation} data-ops-run>
            {stage > 0 && stage < 5 ? <RefreshCw size={15} /> : <Play size={15} fill="currentColor" />}
            <span>{stage > 0 && stage < 5 ? "Restart simulation" : "Run monitored event"}</span>
          </button>
          <button
            type="button"
            className={`ops-human-toggle ${humanGate ? "active" : ""}`}
            role="switch"
            aria-checked={humanGate}
            onClick={() => setHumanGate((enabled) => !enabled)}
            data-ops-human-gate
          >
            <span className="ops-switch" aria-hidden="true"><i /></span>
            <span><b>Human-in-the-loop</b><small>{humanGate ? "Named approval at control gates" : "Autonomous inside guardrails"}</small></span>
          </button>
        </div>
      </div>

      <div className="ops-health-ribbon" aria-label="Agent estate monitoring summary">
        <div><span>Observed families</span><strong>06</strong><small>Across customer, planning and product work</small></div>
        <div><span>Regulatory modules</span><strong>22</strong><small>Autonomous modules under monitored control</small></div>
        <div><span>Active control</span><strong>{humanGate ? "ON" : "AUTO"}</strong><small>{humanGate ? "Named approval enabled" : "Guardrail route enabled"}</small></div>
        <div className="ops-health-live"><span>Estate health</span><strong>Stable</strong><small><i /> Simulation monitoring active</small></div>
      </div>

      <div className="ops-dashboard-grid">
        <section className="ops-estate-panel" aria-labelledby="ops-estate-title">
          <div className="ops-panel-heading">
            <div><span className="panel-label">Observed agent estate</span><h2 id="ops-estate-title">Six agent families. One control fabric.</h2></div>
            <span className="ops-panel-count">LIVE VIEW · {agentFamilies.length} FAMILIES</span>
          </div>
          <div className="ops-agent-grid">
            {agentFamilies.map((agent, index) => {
              const status = statusForAgent(agent, stage, humanGate);
              const Icon = agent.icon;
              return (
                <motion.article
                  key={agent.id}
                  className={`ops-agent-card ops-agent-card--${status.tone}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reducedMotion ? 0 : index * 0.045, duration: 0.3 }}
                  data-agent-family={agent.id}
                >
                  <div className="ops-agent-top"><Icon size={17} /><span className={`ops-agent-status ops-agent-status--${status.tone}`}><i />{status.label}</span></div>
                  <h3>{agent.name}</h3>
                  <p>{agent.scope}</p>
                  <div className="ops-agent-foot"><span>{agent.systems}</span><small>{agent.id === "order" && stage > 0 ? status.label : agent.baseline}</small></div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <aside className="ops-simulation-panel" aria-labelledby="ops-simulation-title" data-ops-stage={stage}>
          <div className="ops-panel-heading ops-simulation-heading">
            <div><span className="panel-label">Control simulation</span><h2 id="ops-simulation-title">One exception. A visible recovery.</h2></div>
            <span className="ops-run-state"><i />{stage === 0 ? "READY" : "IN FLIGHT"}</span>
          </div>

          <div className={`ops-event-hero ${stage > 0 ? "active" : ""}`} aria-live="polite">
            <div className="ops-event-mark"><RefreshCw size={21} /></div>
            <div><span>{stage === 0 ? "Ready to simulate" : activeEntry?.label}</span><strong>{stageLabel(stage, humanGate)}</strong></div>
            <small>{stage === 0 ? "Start a controlled order discrepancy." : "Order event · PO 48321"}</small>
          </div>

          <div className="ops-activity-feed">
            {activityFeed.map((entry) => {
              const Icon = entry.icon;
              const isDone = entry.stage < stage || stage === 5;
              const isCurrent = entry.stage === stage;
              const isQueued = entry.stage > stage;
              return (
                <div key={entry.stage} className={`ops-feed-row ${isDone ? "done" : ""} ${isCurrent ? "current" : ""} ${isQueued ? "queued" : ""}`}>
                  <div className="ops-feed-marker">{isDone ? <Check size={12} /> : <Icon size={13} />}</div>
                  <div><span>0{entry.stage}</span><strong>{entry.label}</strong><p>{entry.copy}</p></div>
                </div>
              );
            })}
          </div>

          <AnimatePresence initial={false}>
            {needsApproval && (
              <motion.div
                className="ops-approval-card"
                initial={{ opacity: 0, y: 9 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.2 }}
              >
                <div><UserCheck size={17} /><span><b>Named approver requested</b><small>Commercial variance exceeds the autonomous release threshold.</small></span></div>
                <button type="button" onClick={approveCorrection} data-ops-approval>Approve corrected route</button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="ops-governance-note"><Hand size={14} /><span><b>Human authority is preserved.</b> The simulation shows agents acting inside defined control boundaries; a person can retain release authority at any point.</span></div>
        </aside>
      </div>

      <div className="ops-assurance-rail">
        <div><ShieldCheck size={19} /><span>Observe</span><strong>Every agent family carries a visible health state and evidence trail.</strong></div>
        <div><RefreshCw size={19} /><span>Correct</span><strong>Repeatable variance is assessed and rerouted inside its configured boundary.</strong></div>
        <div><UserCheck size={19} /><span>Escalate</span><strong>Human judgement is requested when the event crosses a named control gate.</strong></div>
      </div>
      <p className="ops-disclosure"><SparkleNote /> Interactive presentation simulation. Statuses, timestamps and the exception event are illustrative; the workflow families correspond to the B2C, O2C, APS and CPL systems presented in this deck.</p>
    </motion.section>
  );
}

function SparkleNote() {
  return <span aria-hidden="true">✦</span>;
}
