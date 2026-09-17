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

export default function OlfyneExperience({ art, icon, url }: { art: string; icon: string; url: string }) {
  const [mode, setMode] = useState<Mode>("sillage");
  const reduced = useReducedMotion();
  const id = useId();
  const current = experiences[mode];
  const controlsId = `${id}-${mode}`;
  const selectMode = (nextMode: Mode) => setMode(nextMode);

  return (
    <section className="olfyne-experience" aria-label="Olfyne product experience">
      <figure className="olfyne-official-art">
        <img src={art} alt="Official Olfyne artwork: From idea to shelf" width={1200} height={630} />
        <figcaption><img src={icon} alt="" aria-hidden="true" />Official Olfyne product artwork</figcaption>
      </figure>
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
