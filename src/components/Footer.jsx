import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROFILE } from "../data/content";

const BURST_SYMS = ["💗", "💕", "✨", "💖", "🌸", "✦", "🤍"];
const RIBBON_COLORS = ["var(--color-rose)", "var(--color-gold)", "var(--color-lav)", "var(--color-mint)"];

// The more you tap, the warmer the response gets — rewards lingering
// on the last moment of the site instead of it being a one-shot button.
const PULSE_MESSAGES = [
  "made with a lot of love, just for you 💌",
  "okay, one more for good luck 💗",
  "you can keep going, I don't mind",
  "still here, still yours 🤍",
  "alright, you really mean it huh 🥹",
  "okay this is officially a lot of love now ✨",
];

export default function Footer({ chime }) {
  const [hearts, setHearts] = useState([]);
  const [pulse, setPulse] = useState(0);

  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        dur: 2 + Math.random() * 2.5,
        delay: Math.random() * 5,
        size: 0.4 + Math.random() * 0.5,
      })),
    []
  );

  const burst = (e) => {
    chime?.();
    setPulse((p) => p + 1);

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // past a handful of taps, mix in a few ribbon streamers alongside the hearts
    const milestone = pulse >= PULSE_MESSAGES.length - 1;
    const count = milestone ? 26 : 18;

    const batch = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.35;
      const dist = 50 + Math.random() * (milestone ? 140 : 110);
      const isRibbon = milestone && i % 4 === 0;
      return {
        id: `${Date.now()}-${i}`,
        x: cx,
        y: cy,
        bx: Math.cos(angle) * dist,
        by: Math.sin(angle) * dist - 60,
        s: isRibbon ? null : BURST_SYMS[i % BURST_SYMS.length],
        ribbonColor: isRibbon ? RIBBON_COLORS[i % RIBBON_COLORS.length] : null,
        size: 0.9 + Math.random() * 0.7,
        rot: Math.random() * 50 - 25,
      };
    });

    setHearts((p) => [...p, ...batch]);
    setTimeout(
      () => setHearts((p) => p.filter((h) => !batch.find((b) => b.id === h.id))),
      1200
    );
  };

  const messageIndex = Math.min(pulse, PULSE_MESSAGES.length - 1);

  return (
    <section id="final" className="relative text-center px-5 pt-20 pb-14 overflow-hidden">
      {/* soft top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-[var(--color-rose-soft)] to-transparent opacity-70" />

      {/* ambient glow, warms slightly with each tap */}
      <motion.div
        className="absolute left-1/2 top-24 -translate-x-1/2 w-48 h-48 rounded-full bg-[var(--color-rose-soft)]/30 blur-3xl pointer-events-none"
        animate={{ opacity: [0.6, 0.9, 0.6], scale: pulse > 0 ? [1, 1.15, 1] : 1 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute right-[10%] top-40 w-32 h-32 rounded-full bg-[var(--color-gold-bright)]/15 blur-3xl pointer-events-none" />

      {/* quiet twinkles across the section */}
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          className="absolute text-[var(--color-rose)]/40 select-none pointer-events-none"
          style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: `${s.size}rem` }}
          animate={{ opacity: [0, 1, 0], scale: [0.6, 1.1, 0.6] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        >
          ✦
        </motion.span>
      ))}

      {/* heart button */}
      <motion.button
        onClick={burst}
        className="
          relative z-10 w-[72px] h-[72px] rounded-full border-0
          bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-rose-mid)]
          text-white text-3xl cursor-pointer shadow-xl mb-7
          flex items-center justify-center
        "
        whileHover={{ scale: 1.1, rotate: -6 }}
        whileTap={{ scale: 0.92 }}
        animate={{
          boxShadow: [
            "0 18px 36px color-mix(in srgb, var(--color-rose) 28%, transparent)",
            "0 18px 36px color-mix(in srgb, var(--color-rose) 28%, transparent), 0 0 0 12px color-mix(in srgb, var(--color-rose) 8%, transparent)",
            "0 18px 36px color-mix(in srgb, var(--color-rose) 28%, transparent)",
          ],
        }}
        transition={{
          boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
        }}
        aria-label="Send love"
      >
        {/* thin gold ring that appears once she's tapped a handful of times */}
        {pulse >= 3 && (
          <motion.span
            className="absolute -inset-1.5 rounded-full border pointer-events-none"
            style={{ borderColor: "var(--color-gold-bright)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.06, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <motion.span
          key={pulse}
          initial={{ scale: 0.7 }}
          animate={{ scale: [0.7, 1.25, 1] }}
          transition={{ duration: 0.45 }}
        >
          💗
        </motion.span>
      </motion.button>

      <motion.h2
        className="font-display text-3xl sm:text-4xl mb-4 tracking-tight bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--color-text) 0%, var(--color-rose) 50%, var(--color-text) 100%)",
          backgroundSize: "200% auto",
        }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        animate={{ backgroundPosition: ["0% center", "200% center"] }}
        transition={{
          opacity: { duration: 0.6 },
          y: { duration: 0.6 },
          backgroundPosition: { duration: 6, repeat: Infinity, ease: "linear" },
        }}
      >
        Happy Birthday, {PROFILE.name}
      </motion.h2>

      <motion.p
        className="text-[var(--color-text-soft)] max-w-md mx-auto leading-relaxed mb-6 text-[0.98rem]"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        However this year goes, I&apos;ll be right here, choosing you,
        on your best days and your worst ones. Thank you for being mine.
      </motion.p>

      <div className="h-8 mb-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            className="font-script text-2xl sm:text-[1.7rem] text-[var(--color-rose)]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            {PULSE_MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* divider */}
      <motion.div
        className="flex items-center justify-center gap-2 mb-6 opacity-50"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.5, scale: 1 }}
        viewport={{ once: true }}
      >
        <span className="w-8 h-px bg-[var(--color-rose-soft)]" />
        <motion.span
          className="text-[var(--color-rose)] text-xs"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          ✦
        </motion.span>
        <span className="w-8 h-px bg-[var(--color-rose-soft)]" />
      </motion.div>

      {/* gold-foil signature line, closing the whole site with a "sealed" feel */}
      <motion.p
        className="font-script text-lg mb-5"
        style={{ color: "var(--color-gold)" }}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        — with all my love, Mit 🌷
      </motion.p>

      <motion.p
        className="text-[0.7rem] text-[var(--color-text-soft)] opacity-70 tracking-[0.06em]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.7 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        for {PROFILE.name} — {PROFILE.nicknames.join(" · ").toLowerCase()} — on her{" "}
        {PROFILE.age}nd birthday, 11.09
      </motion.p>

      {/* burst particles, with a light gravity arc instead of a straight line out */}
      <AnimatePresence>
        {hearts.map((h) =>
          h.ribbonColor ? (
            <motion.span
              key={h.id}
              className="fixed z-50 pointer-events-none rounded-full"
              style={{ left: h.x, top: h.y, width: 3, height: 12, background: h.ribbonColor }}
              initial={{ opacity: 1, scale: 0.6, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: 0,
                scale: 0.5,
                x: h.bx,
                y: [0, h.by, h.by + 35],
                rotate: h.rot * 3,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
          ) : (
            <motion.span
              key={h.id}
              className="fixed z-50 pointer-events-none select-none"
              style={{ left: h.x, top: h.y, fontSize: `${h.size}rem` }}
              initial={{ opacity: 1, scale: 0.6, x: 0, y: 0, rotate: 0, filter: "blur(0px)" }}
              animate={{
                opacity: 0,
                scale: 0.3,
                x: h.bx,
                y: [0, h.by, h.by + 35],
                rotate: h.rot,
                filter: "blur(1px)",
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            >
              {h.s}
            </motion.span>
          )
        )}
      </AnimatePresence>
    </section>
  );
}