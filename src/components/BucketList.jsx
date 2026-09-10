import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { BUCKET_LIST } from "../data/content";
import Section from "./Section";

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Tiny burst of hearts/sparks fired from a single point when an item is promised
function Burst({ originKey }) {
  const bits = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        angle: (360 / 7) * i + Math.random() * 20,
        dist: 22 + Math.random() * 14,
        size: 5 + Math.random() * 4,
        delay: Math.random() * 0.05,
      })),
    [originKey]
  );

  return (
    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-20">
      {bits.map((b) => {
        const rad = (b.angle * Math.PI) / 180;
        const x = Math.cos(rad) * b.dist;
        const y = Math.sin(rad) * b.dist;
        return (
          <motion.span
            key={b.id}
            className="absolute rounded-full"
            style={{
              width: b.size,
              height: b.size,
              background:
                "radial-gradient(circle, var(--color-gold-bright), var(--color-rose))",
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
            animate={{ x, y, opacity: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: b.delay, ease: "easeOut" }}
          />
        );
      })}
    </span>
  );
}

export default function BucketList({ tone, chimeBig }) {
  const [done, setDone] = useState([]);
  const [justDone, setJustDone] = useState(null);
  const burstSeed = useRef(0);

  const total = BUCKET_LIST.length;
  const count = done.length;
  const progress = total ? count / total : 0;
  const allDone = count === total && total > 0;

  const toggle = (i) => {
    setDone((prev) => {
      if (prev.includes(i)) {
        return prev.filter((x) => x !== i);
      }
      tone?.(950, 0.15, 0, 0.06);
      burstSeed.current += 1;
      setJustDone(i);
      setTimeout(() => setJustDone(null), 650);

      const next = [...prev, i];
      if (next.length === total) {
        setTimeout(() => chimeBig?.(), 250);
      }
      return next;
    });
  };

  const progressLabel = useMemo(() => {
    if (allDone) return "all promised";
    if (count === 0) return "tap to promise";
    return `${count} of ${total} promised`;
  }, [allDone, count, total]);

  return (
    <Section
      id="bucket"
      eyebrow="step six"
      title="This year, let's..."
      sub="Tap each one to promise it. I'm holding myself to these."
    >
      {/* Progress ring */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative w-28 h-28">
          {/* ambient glow that grows with progress */}
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            style={{
              background:
                "radial-gradient(circle, var(--color-rose) 0%, transparent 70%)",
            }}
            animate={{ opacity: 0.12 + progress * 0.28, scale: 0.85 + progress * 0.3 }}
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
          />
          <svg className="relative w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r={RADIUS}
              fill="none"
              stroke="var(--color-rose-soft)"
              strokeWidth="5"
              opacity="0.4"
            />
            <motion.circle
              cx="40"
              cy="40"
              r={RADIUS}
              fill="none"
              stroke="url(#bucketGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - progress) }}
              transition={{ type: "spring", stiffness: 70, damping: 18 }}
            />
            {/* a small traveling dot at the ring's leading edge */}
            {progress > 0 && progress < 1 && (
              <motion.circle
                r="3.2"
                fill="var(--color-gold-bright)"
                animate={{
                  cx: 40 + RADIUS * Math.cos(2 * Math.PI * progress - Math.PI / 2),
                  cy: 40 + RADIUS * Math.sin(2 * Math.PI * progress - Math.PI / 2),
                }}
                transition={{ type: "spring", stiffness: 70, damping: 18 }}
              />
            )}
            <defs>
              <linearGradient id="bucketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-rose)" />
                <stop offset="100%" stopColor="var(--color-gold-bright)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={allDone ? "heart" : count}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="font-display text-2xl text-[var(--color-rose)] font-bold"
              >
                {allDone ? "💗" : `${count}/${total}`}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <motion.p
          key={progressLabel}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm text-[var(--color-text-soft)] tracking-wide"
        >
          {progressLabel}
        </motion.p>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3 max-w-md mx-auto">
        {BUCKET_LIST.map((text, i) => {
          const isDone = done.includes(i);
          const isJust = justDone === i;

          return (
            <motion.button
              key={i}
              onClick={() => toggle(i)}
              layout
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 120, damping: 18 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              className={`
                group relative flex items-center gap-4 w-full
                border rounded-2xl px-4 py-4
                text-left cursor-pointer overflow-hidden
                transition-[border-color,box-shadow,background-color] duration-300
                ${isDone
                  ? "border-[var(--color-rose)]/35 bg-gradient-to-r from-[var(--color-rose-soft)]/45 via-[var(--color-rose-soft)]/15 to-transparent shadow-sm"
                  : "bg-[var(--color-card)] border-[var(--color-rose)]/12 shadow-md hover:border-[var(--color-rose)]/30 hover:shadow-lg"
                }
              `}
            >
              {/* soft diagonal shine sweep on hover */}
              <span
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
                style={{ transitionProperty: "transform, opacity", transitionDuration: "0.7s" }}
              />

              {/* particle burst on the moment of promising */}
              <AnimatePresence>
                {isJust && <Burst key={burstSeed.current} originKey={burstSeed.current} />}
              </AnimatePresence>

              {/* checkbox */}
              <motion.span
                className={`
                  relative z-10 w-7 h-7 rounded-full border-2 flex-none
                  flex items-center justify-center text-sm
                  transition-colors duration-300
                  ${isDone
                    ? "bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-rose-mid)] border-transparent text-white shadow-md"
                    : "border-[var(--color-rose)]/50 text-transparent group-hover:border-[var(--color-rose)]"
                  }
                `}
                animate={isJust ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.45 }}
              >
                <AnimatePresence>
                  {isDone && (
                    <motion.span
                      initial={{ scale: 0, rotate: -40 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <FiCheck size={14} strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.span>

              {/* text */}
              <span
                className={`
                  relative z-10 text-[0.95rem] leading-snug flex-1
                  transition-all duration-300
                  ${isDone
                    ? "text-[var(--color-text-soft)] line-through decoration-[var(--color-rose)]/40"
                    : "text-[var(--color-text)]"
                  }
                `}
              >
                {text}
              </span>

              {/* done badge */}
              <AnimatePresence>
                {isDone && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.7, x: 8 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    className="relative z-10 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--color-rose)] bg-[var(--color-rose-soft)]/60 px-2 py-0.5 rounded-full"
                  >
                    promised
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* All done celebration */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 140, damping: 16 }}
            className="relative mt-10 text-center"
          >
            {/* quiet radiant glow behind the message */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full blur-2xl opacity-30"
              style={{
                background:
                  "radial-gradient(circle, var(--color-gold-bright), transparent 70%)",
              }}
            />
            <p className="relative font-script text-2xl text-[var(--color-rose)]">
              every promise locked in 🤍
            </p>
            <p className="relative text-sm text-[var(--color-text-soft)] mt-1">
              now we just have to keep them
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}