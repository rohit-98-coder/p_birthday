import { motion } from "framer-motion";
import { TIMELINE } from "../data/content";
import Section from "./Section";

export default function Timeline() {
  return (
    <Section
      id="story"
      eyebrow="step three"
      title="Our story, so far"
      sub="A few of my favorite chapters."
    >
      <div className="relative max-w-lg mx-auto pl-8 sm:pl-10">
        {/* vertical line, drawing downward as the timeline enters view rather than sitting there fully formed */}
        <motion.div
          className="absolute left-[15px] sm:left-[17px] top-2 bottom-2 w-[2px] rounded-full origin-top bg-gradient-to-b from-[var(--color-rose)] via-[var(--color-gold-bright)] to-[var(--color-rose-soft)] opacity-70"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />

        {TIMELINE.map((item, i) => (
          <motion.div
            key={i}
            className="relative pb-10 last:pb-0"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.1, duration: 0.55, ease: "easeOut" }}
          >
            {/* node */}
            <motion.div
              className="
                absolute -left-8 sm:-left-10 top-0
                w-8 h-8 rounded-full
                bg-[var(--color-card)]
                border-[2.5px] border-[var(--color-rose)]
                flex items-center justify-center text-sm
                shadow-md z-10
              "
              whileInView={{ scale: [0.7, 1.15, 1] }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.15, duration: 0.45, type: "spring", stiffness: 260, damping: 14 }}
            >
              {/* a soft ring that pulses once as the node lands */}
              <motion.span
                className="absolute inset-0 rounded-full border border-[var(--color-rose)]/50"
                initial={{ scale: 1, opacity: 0.6 }}
                whileInView={{ scale: 1.8, opacity: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.7, ease: "easeOut" }}
              />
              {item.icon}
            </motion.div>

            {/* card — slight alternating offset so the column breathes instead of reading as one rigid stack */}
            <motion.div
              className={`
                relative ml-2
                bg-[var(--color-card)] rounded-2xl
                px-5 py-4
                border border-[var(--color-rose)]/10
                shadow-md overflow-hidden
                transition-shadow duration-300
                ${i % 2 === 1 ? "sm:ml-5" : ""}
              `}
              whileHover={{
                y: -3,
                boxShadow: "0 12px 28px -8px color-mix(in srgb, var(--color-rose) 22%, transparent)",
              }}
            >
              {/* fine paper-grain texture, consistent with Letter / ComfortCards / Cover */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-multiply pointer-events-none">
                <filter id={`timeline-grain-${i}`}>
                  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter={`url(#timeline-grain-${i})`} />
              </svg>

              {/* left accent */}
              <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-gradient-to-b from-[var(--color-rose)] to-[var(--color-gold-bright)] opacity-60" />

              {/* small chapter numeral, watermarked in the corner */}
              <span className="absolute top-2 right-3 font-script text-2xl text-[var(--color-rose-soft)] opacity-70 select-none pointer-events-none">
                {i + 1}
              </span>

              <p className="text-[0.65rem] tracking-[0.14em] uppercase text-[var(--color-rose)] font-bold mb-1.5 pl-2">
                {item.year}
              </p>
              <h3 className="font-display text-[1.1rem] text-[var(--color-text)] mb-1.5 pl-2 leading-snug pr-6">
                {item.title}
              </h3>
              <p className="text-[var(--color-text-soft)] text-sm leading-relaxed pl-2">
                {item.text}
              </p>
            </motion.div>
          </motion.div>
        ))}

        {/* the story keeps going past the last chapter written */}
        <motion.div
          className="relative flex items-center gap-2 -mt-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: TIMELINE.length * 0.1 + 0.3, duration: 0.5 }}
        >
          <span className="absolute -left-8 sm:-left-10 flex gap-[3px]">
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                className="w-1.5 h-1.5 rounded-full bg-[var(--color-rose-soft)]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: d * 0.2, ease: "easeInOut" }}
              />
            ))}
          </span>
          <p className="text-xs text-[var(--color-text-soft)]/70 italic pl-2">
            and many more chapters still to write
          </p>
        </motion.div>
      </div>
    </Section>
  );
}