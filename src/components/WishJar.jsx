import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "./Section";

const ROTATIONS = [-6, -3, 2, 5, -4, 4, -2, 3];

export default function WishJar({ tone }) {
  const [wishes, setWishes] = useState([]);
  const [input, setInput] = useState("");
  const [burstKey, setBurstKey] = useState(0);
  const idRef = useRef(0);

  const submit = (e) => {
    e.preventDefault();
    const val = input.trim();
    if (!val) return;
    tone?.(988, 0.18, 0, 0.07);
    idRef.current += 1;
    setWishes((p) => [...p.slice(-23), { id: idRef.current, text: val }]);
    setBurstKey((k) => k + 1);
    setInput("");
  };

  return (
    <Section
      id="wish"
      eyebrow="step nine"
      title="Make a birthday wish"
      sub="Type it below and drop it in the jar. I won't peek, promise 🤞"
    >
      <form onSubmit={submit} className="flex gap-2 max-w-md mx-auto mb-10 flex-wrap justify-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={90}
          placeholder="I wish for..."
          className="flex-1 min-w-[180px] px-4 py-3 rounded-full border border-[var(--color-rose)]/20 bg-[var(--color-card)] text-[var(--color-text)] outline-none focus:border-[var(--color-rose)] focus:ring-4 focus:ring-[var(--color-rose)]/10 text-sm transition-shadow"
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.94 }}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-rose-mid)] text-white font-bold text-sm cursor-pointer border-0 shadow-md shadow-[var(--color-rose)]/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--color-rose)]/30 transition-all"
        >
          Drop it in ✨
        </motion.button>
      </form>

      <div className="relative max-w-xs mx-auto">
        {/* candle */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          <motion.div
            className="w-2.5 h-4 rounded-full bg-gradient-to-t from-[var(--color-rose)] via-[var(--color-gold-soft)] to-white/90"
            style={{ filter: "blur(0.3px)" }}
            animate={{
              scaleY: [1, 1.15, 0.95, 1.1, 1],
              scaleX: [1, 0.92, 1.05, 0.97, 1],
              opacity: [0.9, 1, 0.85, 1, 0.9],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="w-1 h-6 -mt-0.5 bg-[var(--color-text-soft)]/40 rounded-full" />
        </div>

        {/* sparkle burst on drop */}
        <AnimatePresence>
          {burstKey > 0 && (
            <SparkleBurst key={burstKey} />
          )}
        </AnimatePresence>

        {/* jar */}
        <div
          className="relative min-h-[220px] rounded-t-2xl rounded-b-[48px] p-5 pt-8 flex flex-wrap content-end gap-2 overflow-hidden"
          style={{
            border: "2px solid color-mix(in srgb, var(--color-rose-soft) 70%, transparent)",
            background:
              "linear-gradient(155deg, color-mix(in srgb, var(--color-card) 88%, transparent), color-mix(in srgb, var(--color-gold-soft) 22%, transparent))",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.5), inset -8px 0 20px -10px rgba(0,0,0,0.06), 0 20px 40px -20px rgba(0,0,0,0.15)",
          }}
        >
          {/* glass rim highlight */}
          <div className="absolute top-0 left-3 right-3 h-3 rounded-full bg-white/40 blur-[2px] pointer-events-none" />
          <div className="absolute left-3 top-3 bottom-6 w-2 rounded-full bg-white/25 pointer-events-none" />

          {wishes.length === 0 && (
            <p className="w-full text-center text-xs text-[var(--color-text-soft)] italic py-8">
              the jar is waiting for its first wish
            </p>
          )}

          {wishes.map((w, i) => (
            <motion.div
              key={w.id}
              className="relative bg-[var(--color-gold-soft)] text-[var(--color-text)] px-3 py-1.5 rounded-lg text-xs shadow-sm max-w-full"
              style={{ rotate: ROTATIONS[i % ROTATIONS.length] }}
              initial={{ y: -60, opacity: 0, scale: 0.7, rotate: 0 }}
              animate={{
                y: [0, -3, 0],
                opacity: 1,
                scale: 1,
                rotate: ROTATIONS[i % ROTATIONS.length],
              }}
              transition={{
                y: { duration: 2.4 + (i % 4) * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 },
                default: { type: "spring", stiffness: 260, damping: 16 },
              }}
              whileHover={{ scale: 1.06, rotate: 0, zIndex: 5 }}
            >
              🕯️ {w.text}
            </motion.div>
          ))}
        </div>

        <p className="text-center text-[11px] text-[var(--color-text-soft)] mt-3">
          {wishes.length === 0
            ? "make a wish 🕯️"
            : `${wishes.length} wish${wishes.length === 1 ? "" : "es"} glowing in the jar`}
        </p>
      </div>
    </Section>
  );
}

function SparkleBurst() {
  const sparkles = Array.from({ length: 8 });
  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0 h-0 z-20 pointer-events-none">
      {sparkles.map((_, i) => {
        const angle = (i / sparkles.length) * Math.PI * 2;
        const dist = 26 + (i % 3) * 6;
        return (
          <motion.span
            key={i}
            className="absolute text-[10px]"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist - 10,
              opacity: 0,
              scale: 1,
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            ✨
          </motion.span>
        );
      })}
    </div>
  );
}