import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, BrainCircuit, CheckCircle2, ExternalLink, Radar, Sparkles } from "lucide-react";

type SignalId = "gourmand" | "wardrobe" | "quiet" | "ritual";

type Signal = {
  id: SignalId;
  number: string;
  label: string;
  title: string;
  summary: string;
  implication: string;
  tags: string[];
  colour: string;
  sources: { publisher: string; date: string; title: string; href: string }[];
};

const signals: Signal[] = [
  {
    id: "gourmand",
    number: "01",
    label: "Accord direction",
    title: "Elevated gourmands",
    summary: "Milk, rice and other lactonic facets are moving gourmand beyond simple sweetness into textured, emotionally resonant territory.",
    implication: "Explore comfort with contrast: lactonic warmth, woods, mineral facets or vegetal tension—not a literal dessert profile.",
    tags: ["lactonic", "memory", "textured sweetness"],
    colour: "amber",
    sources: [
      { publisher: "Forbes", date: "01 Jul 2026", title: "Beyond Vanilla—Why Milk Is Fragrance’s Most Unexpected Note", href: "https://www.forbes.com/sites/laiafarrangraves/2026/07/01/beyond-vanilla-why-milk-is-fragrances-most-unexpected-note/" },
      { publisher: "Vogue", date: "16 Mar 2026", title: "The 5 Fragrance Trends That Will Define 2026", href: "https://www.vogue.com/article/fragrance-trends-2026" },
    ],
  },
  {
    id: "wardrobe",
    number: "02",
    label: "Consumer behaviour",
    title: "Fragrance wardrobing",
    summary: "Consumers are selecting, layering and customising scent around mood, moment and ritual rather than committing to one signature.",
    implication: "Brief by use case: layerable fragrance, personalisation and an accessible route into body-mist and adjacent formats.",
    tags: ["layering", "body mist", "mood-led"],
    colour: "mint",
    sources: [
      { publisher: "Vogue", date: "16 Mar 2026", title: "The 5 Fragrance Trends That Will Define 2026", href: "https://www.vogue.com/article/fragrance-trends-2026" },
      { publisher: "Sensient Beauty", date: "02 Feb 2026", title: "Beauty Trends 2026: Feel-Good Formulations & Sensorial Innovations", href: "https://sensient-beauty.com/insights/beauty-trends-2026-good-formulations-sensorial-innovations/" },
    ],
  },
  {
    id: "quiet",
    number: "03",
    label: "Product proposition",
    title: "Quiet, sensitive-by-design scent",
    summary: "Close-to-skin structures and ingredient-aware formulation are emerging together: less projection, more intentionality and clearer safety strategy.",
    implication: "Design premium through restraint: a skin-friendly story, managed allergens and performance without the loudness.",
    tags: ["close-to-skin", "allergen-aware", "premium restraint"],
    colour: "lilac",
    sources: [
      { publisher: "BeautyMatter", date: "01 Feb 2026", title: "The Fragrance Trends Set to Define 2026", href: "https://beautymatter.com/articles/the-fragrance-trends-set-to-define-2026" },
    ],
  },
  {
    id: "ritual",
    number: "04",
    label: "Category extension",
    title: "Scent beyond the bottle",
    summary: "Scent is extending through body, home and fabric care as part of self-care, hygiene and everyday emotional ritual.",
    implication: "Build a coherent fragrance language across formats, and test the performance expectations each route creates.",
    tags: ["body", "home", "fabric care"],
    colour: "coral",
    sources: [
      { publisher: "Sensient Beauty", date: "02 Feb 2026", title: "Beauty Trends 2026: Feel-Good Formulations & Sensorial Innovations", href: "https://sensient-beauty.com/insights/beauty-trends-2026-good-formulations-sensorial-innovations/" },
      { publisher: "Vogue", date: "16 Mar 2026", title: "The 5 Fragrance Trends That Will Define 2026", href: "https://www.vogue.com/article/fragrance-trends-2026" },
    ],
  },
];

export default function TrendAnalysisExperience() {
  const [activeId, setActiveId] = useState<SignalId>("gourmand");
  const reduced = useReducedMotion();
  const id = useId();
  const activeIndex = signals.findIndex((signal) => signal.id === activeId);
  const active = signals[activeIndex];
  const chooseSignal = (index: number) => {
    const bounded = (index + signals.length) % signals.length;
    setActiveId(signals[bounded].id);
  };

  return (
    <section className="trend-mcp-experience" aria-label="Trend Analysis MCP evidence console">
      <header className="trend-mcp-header">
        <div><Radar size={15} /><span>Trend Analysis MCP</span></div>
        <small><i />Evidence snapshot · 17 Sep 2026</small>
      </header>
      <div className="trend-mcp-status"><span><BrainCircuit size={13} />MCP synthesis workspace</span><small>4 surfaced signals · cited editorial evidence</small></div>
      <div className="trend-signal-grid" role="tablist" aria-label="Surfaced beauty and fragrance trend signals">
        {signals.map((signal, index) => {
          const activeSignal = signal.id === activeId;
          return <button
            key={signal.id}
            id={`${id}-${signal.id}`}
            type="button"
            role="tab"
            aria-selected={activeSignal}
            aria-controls={`${id}-signal-detail`}
            className={`trend-signal-card ${signal.colour} ${activeSignal ? "active" : ""}`}
            onClick={() => setActiveId(signal.id)}
            onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === "ArrowRight" || event.key === "ArrowDown" ? index + 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? index - 1 : event.key === "Home" ? 0 : signals.length - 1;
              chooseSignal(next);
              const target = (next + signals.length) % signals.length;
              document.getElementById(`${id}-${signals[target].id}`)?.focus();
            }}
          >
            <span>{signal.number}</span><i /><strong>{signal.title}</strong><small>{signal.label}</small>
          </button>;
        })}
      </div>
      <div className="trend-signal-detail" id={`${id}-signal-detail`} role="tabpanel" aria-labelledby={`${id}-${active.id}`}>
        <motion.div key={active.id} initial={reduced ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .18 }}>
          <div className={`signal-detail-overline ${active.colour}`}><span>Surfaced signal · {active.number}</span><i />Active evidence trace</div>
          <h4>{active.title}</h4>
          <p>{active.summary}</p>
          <div className="signal-tags">{active.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="signal-implication"><Sparkles size={15} /><div><span>Creative implication</span><strong>{active.implication}</strong></div></div>
          <div className="signal-sources"><div><BadgeCheck size={14} /><span>Evidence consulted</span></div>{active.sources.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer"><b>{source.publisher}</b><small>{source.date}</small><strong>{source.title}</strong><ExternalLink size={12} /></a>)}</div>
        </motion.div>
      </div>
      <footer className="trend-mcp-footer"><CheckCircle2 size={13} /><span>Curated editorial evidence sample—not a sales forecast, social-volume score or live market-data feed.</span><a href="https://www.vogue.com/article/fragrance-trends-2026" target="_blank" rel="noopener noreferrer">Trace source <ArrowUpRight size={12} /></a></footer>
    </section>
  );
}
