import { motion } from "framer-motion";
import { LETTER } from "../data/content";
import Section from "./Section";

export default function Letter() {
  const signature = LETTER.sign;

  return (
    <Section id="letter" eyebrow="step five" title="A letter, just for you">
      <motion.div
        className="
          relative max-w-xl mx-auto
          bg-[var(--color-card)] rounded-t-[28px]
          px-7 py-9 sm:px-10 sm:py-11
          shadow-xl border border-[var(--color-rose)]/12
          overflow-hidden
        "
        style={{
          // deckled bottom edge — a jagged paper-torn silhouette instead of a clean radius
          clipPath:
            "polygon(0% 0%, 100% 0%, 100% 97%, 98% 98.5%, 95% 97%, 92% 99%, 89% 97.3%, 86% 98.8%, 83% 97%, 80% 99.2%, 77% 97.4%, 74% 98.6%, 71% 97%, 68% 99%, 65% 97.3%, 62% 98.7%, 59% 97%, 56% 99.1%, 53% 97.4%, 50% 98.8%, 47% 97%, 44% 99%, 41% 97.3%, 38% 98.6%, 35% 97%, 32% 99.2%, 29% 97.4%, 26% 98.8%, 23% 97%, 20% 99%, 17% 97.3%, 14% 98.7%, 11% 97%, 8% 99.1%, 5% 97.4%, 2% 98.8%, 0% 97%)",
        }}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* fine paper-grain texture across the whole letter */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.045] mix-blend-multiply pointer-events-none">
          <filter id="letter-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#letter-grain)" />
        </svg>

        {/* top gradient ribbon */}
        <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-[var(--color-rose)] via-[var(--color-gold-bright)] to-[var(--color-rose-mid)]" />

        {/* soft corner glows, breathing gently */}
        <motion.div
          className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[var(--color-rose-soft)]/30 blur-2xl pointer-events-none"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-[var(--color-gold-soft)]/40 blur-2xl pointer-events-none"
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* a faint fold crease down the middle, like paper once folded in thirds */}
        <div
          className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-px pointer-events-none opacity-[0.06]"
          style={{ background: "linear-gradient(to bottom, transparent, var(--color-text) 15%, var(--color-text) 85%, transparent)" }}
        />

        {/* postmark stamp, top-right — small printed detail like a real mailed letter */}
        <motion.div
          className="absolute top-5 right-5 sm:top-6 sm:right-7 flex flex-col items-center pointer-events-none select-none"
          style={{ transform: "rotate(9deg)" }}
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 0.28, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="w-14 h-14 rounded-full border-[1.5px] border-[var(--color-text)] flex flex-col items-center justify-center">
            <span className="text-[0.5rem] font-bold tracking-[0.1em] leading-none text-[var(--color-text)]">
              11 · 09
            </span>
            <span className="text-[0.42rem] font-bold tracking-[0.08em] leading-none text-[var(--color-text)] mt-0.5">
              PARU
            </span>
          </div>
          <div className="w-16 h-px bg-[var(--color-text)] mt-1" />
        </motion.div>

        {/* watermark, drifting almost imperceptibly */}
        <motion.span
          className="absolute top-3 right-4 text-6xl sm:text-7xl opacity-[0.05] select-none pointer-events-none"
          animate={{ rotate: [-2, 2, -2], y: [0, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          💌
        </motion.span>

        {/* wax seal — layered for a pressed, dimensional look instead of a flat circle */}
        <div className="flex items-center gap-2.5 mb-6">
          <motion.span
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-sm shadow-md"
            style={{
              background:
                "radial-gradient(circle at 32% 26%, color-mix(in srgb, var(--color-rose-mid) 80%, white) 0%, var(--color-rose) 55%, var(--color-rose-deep) 100%)",
            }}
            initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
          >
            {/* pressed rim highlight */}
            <span
              className="absolute inset-[2px] rounded-full pointer-events-none"
              style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.2)" }}
            />
            <span className="relative">🤍</span>
          </motion.span>
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--color-rose)]/70">
            just for you
          </span>
        </div>

        {/* paragraphs, first one opening with a raised script initial like a hand-set letter */}
        <div className="relative space-y-4">
          {LETTER.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              className={`leading-[1.8] text-[var(--color-text)] text-[1.02rem] ${
                i === 0
                  ? "first-letter:font-script first-letter:text-[2.6rem] first-letter:text-[var(--color-rose)] first-letter:leading-[0.7] first-letter:mr-1 first-letter:float-left"
                  : ""
              }`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
              dangerouslySetInnerHTML={{ __html: p }}
            />
          ))}
        </div>

        {/* divider */}
        <div className="flex items-center gap-3 my-7 opacity-50">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--color-rose-soft)]" />
          <motion.span
            className="text-[var(--color-rose)] text-xs"
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          >
            ✦
          </motion.span>
          <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--color-rose-soft)]" />
        </div>

        {/* signature, written in one stroke as it enters view */}
        <motion.p
          className="text-right font-script text-[1.75rem] text-[var(--color-rose)] pb-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {signature.split("").map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 6 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ delay: 0.5 + i * 0.045, duration: 0.35 }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
        </motion.p>
      </motion.div>
    </Section>
  );
}