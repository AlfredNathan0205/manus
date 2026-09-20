import { useEffect, useState, type ElementType } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Box,
  BrainCircuit,
  Check,
  ChevronDown,
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
  inputs: string[];
  checks: string[];
  decision: string;
  humanControl: string;
  handoff: string;
  icon: ElementType;
  duration: number;
};

const APS_AGENTS: ApsAgent[] = [
  {
    name: "Demand Forecast Agent",
    role: "Forecast horizon",
    output: "Demand signal validated",
    detail: "Reads sales history, confirmed orders and market signals to create a demand view planners can challenge.",
    inputs: ["Historic sales by product family", "Confirmed customer orders", "Market and promotional signals"],
    checks: ["Separates orders from forecast demand", "Flags new-product and sparse-history confidence", "Preserves planner override evidence"],
    decision: "Produces a time-phased demand signal with a confidence band rather than silently overwriting the plan.",
    humanControl: "Planner can accept, amend or suppress material demand exceptions before capacity is committed.",
    handoff: "Passes demand volume, date profile and confidence to the Capacity Agent.",
    icon: Activity,
    duration: 760,
  },
  {
    name: "Capacity Agent",
    role: "Constraint check",
    output: "Feasible resource envelope",
    detail: "Tests machines, tools, labour shifts and planned maintenance before a production promise is made.",
    inputs: ["Demand profile from Forecast Agent", "Machine and tool availability", "Labour roster, shifts and maintenance windows"],
    checks: ["Tests finite machine capacity", "Includes labour and specialist tool constraints", "Surfaces overloads before promise dates change"],
    decision: "Returns the feasible production envelope and the constrained resources that need a scheduling choice.",
    humanControl: "Planner reviews overload trade-offs, overtime and any capacity assumption before release.",
    handoff: "Passes feasible slots, bottlenecks and alternatives to the Sequencing Agent.",
    icon: Gauge,
    duration: 980,
  },
  {
    name: "Sequencing Agent",
    role: "Changeover optimisation",
    output: "Low-changeover production order",
    detail: "Groups compatible work, respects dependencies and sequences jobs to reduce avoidable setup time.",
    inputs: ["Feasible resource envelope", "Routing, BOM and allergen or cleaning rules", "Due dates and current work in progress"],
    checks: ["Respects route and dependency order", "Groups compatible jobs to reduce changeovers", "Protects due-date and service commitments"],
    decision: "Creates a constraint-aware work sequence, clearly showing any late-risk or deliberate trade-off.",
    humanControl: "Planner can pin an order, alter priority or approve a deliberate service-versus-efficiency trade-off.",
    handoff: "Passes the candidate schedule to the What-if Agent for protected scenario comparison.",
    icon: Layers3,
    duration: 860,
  },
  {
    name: "What-if Agent",
    role: "Protected simulation",
    output: "Scenario compared — no shop-floor change",
    detail: "Models demand surges, downtime and material risk in a sandbox before any live schedule is touched.",
    inputs: ["Candidate sequence", "Selected disruption or demand scenario", "Current materials, capacity and delivery commitments"],
    checks: ["Runs in a protected planning sandbox", "Measures lateness, utilisation and knock-on effects", "Keeps the active shop-floor schedule unchanged"],
    decision: "Compares viable alternatives, highlighting the operational and customer consequences of each option.",
    humanControl: "Planner chooses which scenario, if any, becomes the recommended schedule change.",
    handoff: "Passes the selected scenario and audit evidence to the Schedule Adjustment Agent.",
    icon: Sparkles,
    duration: 1080,
  },
  {
    name: "Schedule Adjustment Agent",
    role: "Event response",
    output: "Constraint-aware plan ready",
    detail: "Replans when material ETA, equipment availability or live production progress changes, preserving the audit trail.",
    inputs: ["Approved scenario outcome", "Live MES events and progress", "Material ETA, machine status and new order signals"],
    checks: ["Revalidates every affected task", "Protects released work from uncontrolled resequencing", "Records why and when a plan changed"],
    decision: "Produces a governed schedule proposal for planner approval and controlled MES dispatch.",
    humanControl: "Named planner approval is required before a revised plan is released to MES / Fricke.",
    handoff: "Releases the approved plan to MES and listens for execution events that trigger the next planning loop.",
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

function AgentSampleOutput({ agentIndex, scenario }: { agentIndex: number; scenario: ScenarioKey }) {
  const scenarioLabel = SCENARIOS[scenario].label;
  const scenarioSignal = scenario === "surge" ? "+18%" : scenario === "delay" ? "ETA +4d" : "+3%";

  if (agentIndex === 0) {
    const path = scenario === "surge"
      ? "M4 64 C19 59 26 55 40 58 S61 51 75 45 S100 39 112 24 S135 16 156 12"
      : scenario === "delay"
        ? "M4 55 C19 50 27 53 40 48 S61 44 76 46 S99 38 112 40 S135 34 156 30"
        : "M4 62 C19 57 26 61 40 54 S61 52 76 45 S99 49 112 38 S135 39 156 29";
    return (
      <div className="aps-output-card aps-output-forecast" role="img" aria-label={`Illustrative forecast confidence chart for ${scenarioLabel}`}>
        <div className="aps-output-head"><span>Illustrative sample output</span><strong>Forecast confidence</strong><small>{scenarioSignal} demand signal</small></div>
        <svg viewBox="0 0 160 76" aria-hidden="true"><path className="aps-chart-grid" d="M4 15H156M4 38H156M4 61H156" /><path className="aps-chart-band" d={`${path} L156 32 C136 42 124 51 112 56 S91 62 76 60 S53 69 40 67 S18 72 4 71Z`} /><path className="aps-chart-line" d={path} /><circle cx="156" cy={scenario === "surge" ? "12" : scenario === "delay" ? "30" : "29"} r="3" /></svg>
        <div className="aps-output-axis"><span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span></div>
        <div className="aps-output-metrics"><span><b>{scenario === "surge" ? "87%" : "92%"}</b>confidence</span><span><b>{scenario === "surge" ? "+18%" : "+3%"}</b>forecast delta</span><span><b>3</b>planner checks</span></div>
      </div>
    );
  }

  if (agentIndex === 1) {
    const loads = scenario === "surge" ? [[62, 74, 86, 96, 93], [54, 67, 81, 88, 92], [49, 62, 72, 80, 86]] : scenario === "delay" ? [[58, 65, 46, 73, 69], [50, 61, 39, 70, 64], [44, 58, 42, 63, 60]] : [[51, 62, 68, 71, 64], [46, 55, 63, 66, 58], [41, 49, 57, 60, 54]];
    const rows = ["Mixer 02", "Filling 01", "Packing"];
    return (
      <div className="aps-output-card aps-output-capacity" role="img" aria-label={`Illustrative capacity heatmap for ${scenarioLabel}`}>
        <div className="aps-output-head"><span>Illustrative sample output</span><strong>Capacity heatmap</strong><small>{scenario === "surge" ? "Threshold detected" : "Finite-capacity view"}</small></div>
        <div className="aps-heatmap"><div className="aps-heatmap-days"><i /><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span></div>{loads.map((row, rowIndex) => <div className="aps-heatmap-row" key={rows[rowIndex]}><b>{rows[rowIndex]}</b>{row.map((load, cellIndex) => <i key={`${rows[rowIndex]}-${cellIndex}`} data-load={load >= 90 ? "critical" : load >= 75 ? "high" : load >= 60 ? "medium" : "normal"}><span>{load}%</span></i>)}</div>)}</div>
        <div className="aps-output-metrics"><span><b>{scenario === "surge" ? "2" : "0"}</b>resource alerts</span><span><b>{scenario === "delay" ? "1" : "3"}</b>route options</span><span><b>5d</b>planning horizon</span></div>
      </div>
    );
  }

  if (agentIndex === 2) {
    const lanes = scenario === "delay" ? [["Order 188", "Order 204", "Order 197"], ["Order 204", "Order 188", "Order 197"], ["Order 197", "Order 188", "Order 204"]] : [["Order 188", "Order 204", "Order 197"], ["Order 204", "Order 197", "Order 188"], ["Order 197", "Order 188", "Order 204"]];
    return (
      <div className="aps-output-card aps-output-sequence" role="img" aria-label={`Illustrative production sequence for ${scenarioLabel}`}>
        <div className="aps-output-head"><span>Illustrative sample output</span><strong>Recommended production sequence</strong><small>{scenario === "delay" ? "Material-aware resequence" : "Changeover-minimised"}</small></div>
        <div className="aps-sequence-grid"><div className="aps-sequence-days"><i /><span>08:00</span><span>12:00</span><span>16:00</span></div>{lanes.map((lane, index) => <div className="aps-sequence-lane" key={`lane-${index}`}><b>{["Mixer 02", "Filling 01", "Packing"][index]}</b><div>{lane.map((order, orderIndex) => <i key={order} data-tone={orderIndex === 1 ? "gold" : orderIndex === 2 ? "soft" : "green"}>{order}</i>)}</div></div>)}</div>
        <div className="aps-output-metrics"><span><b>−22%</b>changeover time</span><span><b>0</b>late-risk orders</span><span><b>3</b>routes compared</span></div>
      </div>
    );
  }

  if (agentIndex === 3) {
    const bars = scenario === "surge" ? [43, 84, 63] : scenario === "delay" ? [45, 77, 54] : [36, 40, 32];
    return (
      <div className="aps-output-card aps-output-scenario" role="img" aria-label={`Illustrative scenario comparison for ${scenarioLabel}`}>
        <div className="aps-output-head"><span>Illustrative sample output</span><strong>Protected scenario comparison</strong><small>Shop floor unchanged</small></div>
        <div className="aps-scenario-bars">{["Current", "Stress test", "Recommended"].map((label, index) => <div key={label}><i style={{ height: `${bars[index]}%` }} data-tone={index === 1 ? "risk" : index === 2 ? "green" : "muted"} /><span>{label}</span><b>{index === 1 && scenario !== "baseline" ? "+1.5d" : index === 2 ? "0d" : "+0.2d"}</b></div>)}</div>
        <div className="aps-output-metrics"><span><b>3</b>alternatives tested</span><span><b>0</b>live changes</span><span><b>{scenario === "baseline" ? "Low" : "Medium"}</b>risk selected</span></div>
      </div>
    );
  }

  return (
    <div className="aps-output-card aps-output-adjustment" role="img" aria-label={`Illustrative schedule recovery view for ${scenarioLabel}`}>
      <div className="aps-output-head"><span>Illustrative sample output</span><strong>Schedule recovery proposal</strong><small>Audit-ready change set</small></div>
      <div className="aps-recovery-view"><div><span>Before</span><p><i data-tone="gold" />Order 188 <b>Tue 14:00</b></p><p><i data-tone="muted" />Order 204 <b>Wed 08:00</b></p></div><strong>→</strong><div><span>Proposed</span><p><i data-tone="green" />Order 204 <b>Tue 14:00</b></p><p><i data-tone="gold" />Order 188 <b>Wed 08:00</b></p></div></div>
      <div className="aps-output-metrics"><span><b>2</b>orders resequenced</span><span><b>1</b>approval required</span><span><b>100%</b>change trace</span></div>
    </div>
  );
}

export default function APSOrchestrationExperience({ langchainLogo }: { langchainLogo: string }) {
  const reduced = useReducedMotion();
  const [scenario, setScenario] = useState<ScenarioKey>("baseline");
  const [activeAgent, setActiveAgent] = useState(0);
  const [expandedAgent, setExpandedAgent] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [released, setReleased] = useState(false);

  const selectedScenario = SCENARIOS[scenario];
  const currentAgent = APS_AGENTS[activeAgent];
  const dossierAgent = expandedAgent === null ? null : APS_AGENTS[expandedAgent];
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
    setExpandedAgent(null);
    setRunning(false);
    setReleased(false);
  };

  const runFlow = () => {
    setReleased(false);
    setActiveAgent(0);
    setExpandedAgent(0);
    setRunning(true);
  };

  const inspectAgent = (index: number) => {
    setRunning(false);
    setActiveAgent(index);
    setExpandedAgent((current) => current === index ? null : index);
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
                    className={`aps-agent ${isActive ? "active" : ""} ${isComplete ? "complete" : ""} ${expandedAgent === index ? "expanded" : ""}`}
                    onClick={() => inspectAgent(index)}
                    aria-pressed={isActive}
                    aria-expanded={expandedAgent === index}
                    aria-controls="aps-agent-dossier"
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
              <div><span>Active evidence · click a tile for the complete decision dossier</span><strong>{currentAgent.output}</strong><p>{currentAgent.detail}</p></div>
              <div className="aps-agent-progress" aria-label={`Stage ${activeAgent + 1} of ${APS_AGENTS.length}`}><i style={{ transform: `scaleX(${(activeAgent + 1) / APS_AGENTS.length})` }} /></div>
            </div>

            <AnimatePresence initial={false}>
              {dossierAgent ? (() => {
                const DossierIcon = dossierAgent.icon;
                return (
                  <motion.section
                    id="aps-agent-dossier"
                    className="aps-agent-dossier"
                    aria-label={`${dossierAgent.name} decision dossier`}
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: reduced ? 0 : 0.22, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="aps-dossier-head">
                      <div className="aps-dossier-icon"><DossierIcon size={17} /></div>
                      <div><span>LangChain agent dossier · {String((expandedAgent ?? 0) + 1).padStart(2, "0")}</span><h3>{dossierAgent.name}</h3><p>{dossierAgent.role} · {dossierAgent.output}</p></div>
                      <button type="button" onClick={() => setExpandedAgent(null)} aria-label={`Close ${dossierAgent.name} details`}><ChevronDown size={16} />Close</button>
                    </div>
                    <p className="aps-dossier-summary">{dossierAgent.detail}</p>
                    <AgentSampleOutput agentIndex={expandedAgent ?? 0} scenario={scenario} />
                    <div className="aps-dossier-grid">
                      <div><span>Reads</span><ul>{dossierAgent.inputs.map((item) => <li key={item}>{item}</li>)}</ul></div>
                      <div><span>Tests</span><ul>{dossierAgent.checks.map((item) => <li key={item}>{item}</li>)}</ul></div>
                    </div>
                    <div className="aps-dossier-decision"><BrainCircuit size={17} /><div><span>Bounded decision</span><strong>{dossierAgent.decision}</strong></div></div>
                    <div className="aps-dossier-foot">
                      <div><UserCheck size={14} /><span>Human control</span><p>{dossierAgent.humanControl}</p></div>
                      <div><Workflow size={14} /><span>Next handoff</span><p>{dossierAgent.handoff}</p></div>
                    </div>
                  </motion.section>
                );
              })() : (
                <motion.div className="aps-dossier-prompt" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduced ? undefined : { opacity: 0 }}>
                  <CircleDot size={14} /><span>Choose any LangChain agent tile to open its inputs, constraints, decision boundary and controlled handoff.</span>
                </motion.div>
              )}
            </AnimatePresence>
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
