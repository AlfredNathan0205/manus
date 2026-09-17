import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

const features = [
  {
    title: "Flexible silicone sleeve",
    label: "Fits your earbud",
    copy: "The translucent silicone sleeve slips over an existing earbud and carries the sensing hardware. It is designed for AirPods and other standard earbuds, without modifying them.",
    marker: { x: 14, y: 82 },
    target: { x: 31, y: 65 },
  },
  {
    title: "Dry-electrode sensor pads",
    label: "Senses attention",
    copy: "Three embedded dry-electrode pads contact the outer ear canal to pick up micro-volt EEG signals associated with attention. No conductive gel or preparation is needed.",
    marker: { x: 14, y: 30 },
    target: { x: 41.12, y: 50.86 },
  },
  {
    title: "Micro-pebble module",
    label: "Decodes & connects",
    copy: "The small housing clips onto the earbud stem. It digitises the signal, runs on-device attention decoding and connects to the phone over Bluetooth Low Energy.",
    marker: { x: 86, y: 75 },
    target: { x: 51.94, y: 41.32 },
  },
  {
    title: "Blue status indicator",
    label: "Shows it is listening",
    copy: "The micro-LED on the module gives a visible indication that the sleeve is listening. The blue light is a hardware status cue, not a reading of the wearer’s thoughts.",
    marker: { x: 86, y: 23 },
    target: { x: 54.97, y: 36.99 },
  },
];

export default function CortiSleeveWalkthrough({ image }: { image: string }) {
  const [selected, setSelected] = useState(0);
  const [instant, setInstant] = useState(false);
  const reduced = useReducedMotion();
  const id = useId();
  const detailId = `${id}-sensor-detail`;
  const current = features[selected];
  const finalFeature = selected === features.length - 1;

  return (
    <section className="sensor-walkthrough" data-instant={instant || reduced ? "true" : "false"} aria-label="CortiSleeve interactive hardware walkthrough">
      <header className="sensor-walkthrough-heading">
        <span>Explore the hardware</span>
        <small>Hover, tap or select a marker</small>
      </header>
      <div className="sensor-image-stage">
        <img src={image} alt="Official CortiSleeve render: translucent sleeve and electrode pads along the stem, with a clip-on micro-pebble module and blue indicator" width={1600} height={1200} />
        <svg className="sensor-leaders" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {features.map((feature, index) => (
            <line key={feature.title} x1={feature.marker.x} y1={feature.marker.y} x2={feature.target.x} y2={feature.target.y} className={selected === index ? "active" : ""} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        {features.map((feature, index) => (
          <button
            key={feature.title}
            type="button"
            className={`sensor-hotspot ${selected === index ? "selected" : ""}`}
            style={{ left: `${feature.marker.x}%`, top: `${feature.marker.y}%` }}
            onClick={event => { setInstant(event.detail === 0); setSelected(index); }}
            onPointerEnter={event => { if (event.pointerType === "mouse") { setInstant(false); setSelected(index); } }}
            onFocus={() => { setInstant(true); setSelected(index); }}
            aria-label={`Feature ${index + 1}: ${feature.title}`}
            aria-pressed={selected === index}
            aria-controls={detailId}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
          </button>
        ))}
        <motion.span
          className="sensor-target"
          key={selected}
          style={{ left: `${current.target.x}%`, top: `${current.target.y}%` }}
          initial={reduced || instant ? false : { opacity: 0, scale: .95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: .2 }}
          aria-hidden="true"
        />
      </div>
      <div className="sensor-detail" id={detailId} aria-live="polite" aria-atomic="true">
        <div className="sensor-detail-top"><span>{current.label}</span><span>{String(selected + 1).padStart(2, "0")} / 04</span></div>
        <motion.div key={selected} initial={reduced || instant ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .18 }}>
          <h4>{current.title}</h4>
          <p>{current.copy}</p>
        </motion.div>
      </div>
      <div className="sensor-navigation">
        <button type="button" onClick={event => { setInstant(event.detail === 0); setSelected(index => index - 1); }} disabled={selected === 0} aria-label="Previous hardware feature"><ArrowLeft size={15} /><span>Previous</span></button>
        <span className="sensor-progress" aria-hidden="true">{features.map((feature, index) => <i key={feature.title} className={index === selected ? "active" : ""} />)}</span>
        <button type="button" onClick={event => { setInstant(event.detail === 0); setSelected(index => (index + 1) % features.length); }}>{finalFeature ? "Start again" : "Next feature"}{finalFeature ? <RotateCcw size={15} /> : <ArrowRight size={15} />}</button>
      </div>
      <p className="sensor-illustration-note">Illustrative markers on the official product render · not a live sensor readout</p>
    </section>
  );
}
