import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, FlaskConical, Handshake, ShieldCheck, Sparkles } from "lucide-react";

type Mode = "sillage" | "studio";

const experiences = {
  sillage: {
    label: "Sillage",
    eyebrow: "The marketplace",
    title: "Commission from independent perfumers who earn royalties on every unit sold.",
    copy: "Post a fragrance in your own words, compare creative approaches and royalty terms, then approve the scent through its redacted structure—not the formula itself.",
    steps: [
      ["01", "Post a brief", "A feeling, occasion or market—no technical language needed."],
      ["02", "Receive bids", "Independent perfumers propose their creative approach and royalty terms."],
      ["03", "Approve the pyramid", "Review top, heart and base notes while the formula remains protected."],
    ],
    fact: "No platform fee until your fragrance sells.",
  },
  studio: {
    label: "Studio",
    eyebrow: "The perfumer’s workspace",
    title: "Formulate with live compliance, stability prediction and SDS generation.",
    copy: "Studio brings the technical checks into the creative workspace, so a composition can be screened while it is being built rather than only at the end.",
    steps: [
      ["1,793", "Fragrance materials", "Mapped with scent-family relationships."],
      ["35,000+", "Scent relationships", "Structured context for exploration and composition."],
      ["78", "Signature accords", "Starting points for original creative directions."],
    ],
    fact: "IFRA compliant · CLP classified · allergens listed · SDS ready.",
  },
} as const;

function SillageWorkspace({ reduced }: { reduced: boolean | null }) {
  const [activeLayer, setActiveLayer] = useState(0);
  const layers = [
    { title: "Top notes", timing: "5–15 min", notes: ["citrus", "green"], tint: "top" },
    { title: "Heart notes", timing: "20–60 min", notes: ["floral", "spicy", "fruity"], tint: "heart" },
    { title: "Base notes", timing: "4–8 hrs", notes: ["woody", "amber", "musky"], tint: "base" },
  ];
  const current = layers[activeLayer];
  return (
    <div className="olfyne-workspace sillage-workspace">
      <div className="workspace-chrome"><span><i />Sillage / brief view</span><small>Protected structure</small></div>
      <div className="sillage-screen">
        <div className="sillage-brief"><span>BRAND BRIEF</span><strong>“Quiet confidence, after rain.”</strong><small>Fragrance direction · not a formula</small></div>
        <div className="scent-pyramid" aria-label="Interactive redacted scent pyramid">
          {layers.map((layer, index) => <button type="button" key={layer.title} className={`pyramid-layer ${layer.tint} ${activeLayer === index ? "active" : ""}`} onClick={() => setActiveLayer(index)} aria-pressed={activeLayer === index}><span>{layer.title}</span><i>{layer.notes.length} notes</i></button>)}
        </div>
        <motion.div className="sillage-layer-detail" key={current.title} initial={reduced ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .18 }} aria-live="polite"><div><span>{current.title}</span><small>{current.timing}</small></div><p>{current.notes.map((note) => <b key={note}>{note}</b>)}</p></motion.div>
        <p className="formula-lock"><ShieldCheck size={13} />The pyramid, never the recipe.</p>
      </div>
    </div>
  );
}

function StudioWorkspace({ reduced }: { reduced: boolean | null }) {
  const ingredients = [
    ["Bergamot Oil", "8007-75-8", "4.2%"],
    ["Linalool", "78-70-6", "3.8%"],
    ["Hedione", "24851-98-7", "6.0%"],
    ["Cedarwood Virginia", "8000-27-95-5", "5.5%"],
  ];
  const [selected, setSelected] = useState(0);
  return (
    <div className="olfyne-workspace studio-workspace">
      <div className="workspace-chrome"><span><i />Olfyne Studio</span><small>Live formulation checks</small></div>
      <div className="studio-screen">
        <div className="studio-materials"><div className="studio-table-head"><span>INGREDIENTS</span><span>CAS</span><span>LOAD</span></div>{ingredients.map((ingredient, index) => <button type="button" key={ingredient[0]} className={selected === index ? "active" : ""} onClick={() => setSelected(index)} aria-pressed={selected === index}><strong>{ingredient[0]}</strong><small>{ingredient[1]}</small><b>{ingredient[2]}</b></button>)}</div>
        <motion.div className="studio-inspector" key={ingredients[selected][0]} initial={reduced ? false : { opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .18 }}><span>Selected material</span><strong>{ingredients[selected][0]}</strong><small>{ingredients[selected][1]} · {ingredients[selected][2]} of formula</small><div className="studio-screening"><p><BadgeCheck size={12} />IFRA compliant</p><p><BadgeCheck size={12} />CLP classified</p><p><BadgeCheck size={12} />Allergens listed</p><p><BadgeCheck size={12} />SDS ready</p></div></motion.div>
      </div>
    </div>
  );
}

export default function OlfyneExperience({ icon, url }: { icon: string; url: string }) {
  const [mode, setMode] = useState<Mode>("sillage");
  const reduced = useReducedMotion();
  const id = useId();
  const current = experiences[mode];
  const controlsId = `${id}-${mode}`;
  const selectMode = (nextMode: Mode) => setMode(nextMode);

  return (
    <section className="olfyne-experience" aria-label="Olfyne product experience">
      <div className="olfyne-product-header"><img src={icon} alt="Olfyne logo mark" width={32} height={32} /><div><span>Olfyne platform</span><strong>From idea to shelf</strong></div><i>LIVE PRODUCT VIEW</i></div>
      <div className="olfyne-mode-tabs" role="tablist" aria-label="Olfyne product areas">
        {(["sillage", "studio"] as const).map((key) => {
          const active = key === mode;
          const Icon = key === "sillage" ? Handshake : FlaskConical;
          return <button key={key} type="button" role="tab" aria-selected={active} aria-controls={controlsId} id={`${id}-${key}`} onClick={() => selectMode(key)} onKeyDown={event => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home" && event.key !== "End") return;
            event.preventDefault();
            const nextMode: Mode = event.key === "ArrowLeft" || event.key === "Home" ? "sillage" : "studio";
            selectMode(nextMode);
            document.getElementById(`${id}-${nextMode}`)?.focus();
          }}><Icon size={15} />{experiences[key].label}</button>;
        })}
      </div>
      <div className="olfyne-mode-panel" role="tabpanel" id={controlsId} aria-labelledby={`${id}-${mode}`}>
        <motion.div key={mode} initial={reduced ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .18 }}>
          <div className="olfyne-panel-heading"><span>{current.eyebrow}</span><Sparkles size={14} /></div>
          <h4>{current.title}</h4>
          <p>{current.copy}</p>
          {mode === "sillage" ? <SillageWorkspace reduced={reduced} /> : <StudioWorkspace reduced={reduced} />}
          <div className="olfyne-proof-grid">
            {current.steps.map(([value, title, copy]) => <article key={title}><span>{value}</span><strong>{title}</strong><small>{copy}</small></article>)}
          </div>
          <div className="olfyne-fact"><BadgeCheck size={15} /><span>{current.fact}</span></div>
        </motion.div>
      </div>
      <div className="olfyne-route-note"><ShieldCheck size={14} /><span>Every production route retains compliance screening, physical sample approval and vetted partners.</span></div>
      <a className="olfyne-link" href={url} target="_blank" rel="noopener noreferrer">Explore Olfyne <ArrowUpRight size={15} /></a>
    </section>
  );
}
