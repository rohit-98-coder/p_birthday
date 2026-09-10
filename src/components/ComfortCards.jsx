import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COMFORTS } from "../data/content";
import Section from "./Section";

// Each card gets a hue anchor drawn from the theme tokens, then color-mix
// builds the gradient + glow from it — so dark mode repaints these correctly
// instead of the gradients staying frozen at their light-mode hex values.
const HUES = [
  "var(--color-rose-mid)",
  "var(--color-gold)",
  "var(--color-lav)",
  "var(--color-mint)",
  "var(--color-rose-deep)",
  "var(--color-gold-bright)",
];

export default function ComfortCards({ tone }) {
  const [flipped, setFlipped] = useState([]);
  const [hint, setHint] = useState(true);
  const allOpened = flipped.length === COMFORTS.length;

  // gentle stagger so idle cards feel alive without being distracting
  const idleDelays = useMemo(
    () => COMFORTS.map(() => Math.random() * 2),
    []
  );

  const flip = (i) => {
    tone?.(740, 0.15, 0, 0.06);
    setHint(false);
    setFlipped((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  };

  return (
    <Section
      id="comfort"
      eyebrow="for any day, not just today"
      title="Little reminders"
      sub="Flip a card whenever you need one."
    >
      <AnimatePresence>
        {hint && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-xs text-[var(--color-text-soft)] mb-5 tracking-wide"
          >
            tap any card to flip ✨
          </motion.p>
        )}
      </AnimatePresence>

      {/* progress dots — fills in as cards are opened, sits in place of a plain counter */}
      <div className="flex justify-center gap-1.5 mb-6">
        {COMFORTS.map((_, i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: flipped.includes(i)
                ? "var(--color-rose)"
                : "color-mix(in srgb, var(--color-rose-soft) 70%, transparent)",
            }}
            animate={{ scale: flipped.includes(i) ? [1, 1.4, 1] : 1 }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
        {COMFORTS.map((c, i) => {
          const isFlipped = flipped.includes(i);
          const hue = HUES[i % HUES.length];
          const glow = `color-mix(in srgb, ${hue} 45%, transparent)`;
          const gradFrom = `color-mix(in srgb, ${hue} 30%, var(--color-card))`;
          const gradMid = `color-mix(in srgb, ${hue} 65%, var(--color-card))`;
          const gradTo = `color-mix(in srgb, ${hue} 88%, black 4%)`;

          return (
            <motion.div
              key={i}
              className="relative aspect-square cursor-pointer"
              style={{ perspective: 1200 }}
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 140, damping: 16 }}
              whileHover={{ scale: 1.045, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => flip(i)}
            >
              {/* soft glow beneath the card, warms up on hover */}
              <motion.div
                className="absolute -inset-2 rounded-2xl blur-lg -z-10"
                style={{ background: glow }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.6 }}
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                  rotateY: isFlipped ? 180 : [0, 1.5, 0, -1.5, 0],
                }}
                transition={
                  isFlipped
                    ? { duration: 0.65, ease: [0.4, 0.1, 0.2, 1] }
                    : {
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idleDelays[i],
                      }
                }
              >
                {/* ── FRONT ── */}
                <div
                  className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center shadow-lg overflow-hidden"
                  style={{
                    background: `linear-gradient(155deg, ${gradFrom} 0%, ${gradMid} 45%, ${gradTo} 100%)`,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  {/* fine paper-grain texture for a less flat, more tactile surface */}
                  <svg className="absolute inset-0 w-full h-full opacity-[0.06] mix-blend-overlay pointer-events-none">
                    <filter id={`grain-${i}`}>
                      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter={`url(#grain-${i})`} />
                  </svg>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/25 pointer-events-none" />
                  <div className="absolute inset-[6px] rounded-xl border border-white/35 pointer-events-none" />

                  {/* diagonal sheen sweeping across on hover */}
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 -translate-x-full hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700" />
                  </div>

                  {/* folded-corner detail, standing in for a "flip me" label */}
                  <div
                    className="absolute top-0 right-0 w-5 h-5"
                    style={{
                      background: "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.5) 50%)",
                      borderBottomLeftRadius: "6px",
                    }}
                  />

                  <motion.span
                    className="relative text-4xl drop-shadow-md select-none"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: idleDelays[i] }}
                  >
                    {c.emoji}
                  </motion.span>
                </div>

                {/* ── BACK ── */}
                <div
                  className="
                    absolute inset-0 rounded-2xl
                    bg-[var(--color-card)]
                    border border-[var(--color-rose)]/20
                    flex flex-col items-center justify-center
                    text-center p-4 shadow-xl overflow-hidden
                  "
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: `linear-gradient(90deg, ${hue}, var(--color-gold-bright), ${hue})` }}
                  />
                  <span className="absolute text-6xl opacity-[0.07] select-none pointer-events-none">
                    {c.emoji}
                  </span>

                  <motion.span
                    className="relative text-2xl mb-2.5 select-none"
                    initial={{ scale: 0.5, rotate: -15 }}
                    animate={isFlipped ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 14 }}
                  >
                    {c.emoji}
                  </motion.span>
                  <p className="relative text-[0.78rem] leading-relaxed text-[var(--color-text)] font-medium">
                    {c.text}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {allOpened ? (
          <motion.p
            key="all"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className="text-center text-sm text-[var(--color-rose)] font-medium mt-6 tracking-wide"
          >
            every reminder, opened — come back whenever you need one again 🤍
          </motion.p>
        ) : (
          flipped.length > 0 && (
            <motion.p
              key="count"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-[var(--color-text-soft)] mt-6 tracking-wide"
            >
              {flipped.length} of {COMFORTS.length} opened · tap again to flip back
            </motion.p>
          )
        )}
      </AnimatePresence>
    </Section>
  );
}