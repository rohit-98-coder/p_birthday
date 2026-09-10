import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiX } from "react-icons/fi";
import { QUIZ } from "../data/content";
import Section from "./Section";

const CONFETTI_EMOJIS = ["🎉", "✨", "💖", "🏆", "🌟"];
const RIBBON_COLORS = ["var(--color-rose)", "var(--color-gold)", "var(--color-lav)", "var(--color-mint)"];

// Counts up to the final score instead of just appearing, a small
// "drumroll" beat before the number lands.
function CountUp({ to, duration = 0.8 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (to === 0) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      setN(Math.round(t * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{n}</>;
}

function ConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
        left: 10 + Math.random() * 80,
        size: 0.9 + Math.random() * 0.7,
        dur: 1.6 + Math.random() * 1.2,
        delay: Math.random() * 0.4,
        drift: (Math.random() - 0.5) * 70,
      })),
    []
  );
  const ribbons = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        color: RIBBON_COLORS[i % RIBBON_COLORS.length],
        left: 8 + Math.random() * 84,
        w: 3 + Math.random() * 2,
        h: 11 + Math.random() * 8,
        dur: 1.7 + Math.random() * 1.2,
        delay: Math.random() * 0.4,
        drift: (Math.random() - 0.5) * 60,
        spin: (Math.random() - 0.5) * 300,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {ribbons.map((r) => (
        <motion.span
          key={`r-${r.id}`}
          className="absolute bottom-6 rounded-full"
          style={{ left: `${r.left}%`, width: r.w, height: r.h, background: r.color }}
          initial={{ y: 0, opacity: 0, rotate: 0 }}
          animate={{ y: "-140%", opacity: [0, 1, 1, 0], x: r.drift, rotate: r.spin }}
          transition={{ duration: r.dur, delay: r.delay, ease: "easeOut" }}
        />
      ))}
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute bottom-6 select-none"
          style={{ left: `${p.left}%`, fontSize: `${p.size}rem` }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: "-140%", opacity: [0, 1, 1, 0], x: p.drift }}
          transition={{ duration: p.dur, delay: p.delay, ease: "easeOut" }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}

export default function Quiz({ tone, chimeBig }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);

  const total = QUIZ.length;

  const answer = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === QUIZ[idx].correct;
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      tone?.(1046, 0.2, 0, 0.08);
    } else {
      setStreak(0);
      tone?.(300, 0.25, 0, 0.08);
    }
    setTimeout(() => {
      if (idx + 1 >= total) {
        setDone(true);
        if (score + (correct ? 1 : 0) === total) chimeBig?.();
      } else {
        setIdx((x) => x + 1);
        setSelected(null);
      }
    }, 900);
  };

  const retry = () => {
    setIdx(0);
    setScore(0);
    setStreak(0);
    setSelected(null);
    setDone(false);
  };

  const perfect = score === total;
  const isWrong = selected !== null && selected !== QUIZ[idx]?.correct;

  return (
    <Section
      id="quiz"
      eyebrow="step eight"
      title="How well do you know us?"
      sub="Five questions. You should get all of these right, O+."
    >
      <motion.div
        className="
          relative max-w-md mx-auto
          bg-[var(--color-card)] rounded-[28px] p-7 sm:p-8
          shadow-xl overflow-hidden
        "
        style={{
          border: `1px solid ${
            done && perfect ? "transparent" : "color-mix(in srgb, var(--color-rose) 12%, transparent)"
          }`,
          backgroundImage:
            done && perfect
              ? "linear-gradient(var(--color-card), var(--color-card)), linear-gradient(120deg, var(--color-gold), var(--color-rose-mid), var(--color-gold-bright))"
              : undefined,
          backgroundOrigin: done && perfect ? "border-box" : undefined,
          backgroundClip: done && perfect ? "padding-box, border-box" : undefined,
        }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
      >
        {/* segmented progress bar, one tick per question */}
        <div className="absolute top-0 left-0 right-0 h-1 flex gap-0.5 bg-[var(--color-rose-soft)]/40">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="flex-1 relative overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-gold-bright)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: done || i < idx ? 1 : i === idx ? 1 : 0 }}
                style={{ transformOrigin: "left" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
          ))}
        </div>

        {/* live streak, only while it's worth bragging about */}
        <AnimatePresence>
          {!done && streak >= 2 && (
            <motion.span
              initial={{ opacity: 0, y: -6, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-4 right-5 text-[0.65rem] font-bold uppercase tracking-wide text-[var(--color-gold-bright)] bg-[var(--color-gold-soft)]/40 px-2 py-0.5 rounded-full"
            >
              {streak} streak 🔥
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative text-center pt-2"
            >
              {perfect && <ConfettiBurst />}

              {/* laurel flourish, only for a perfect run */}
              {perfect && (
                <div className="flex items-center justify-center gap-2 mb-1 text-[var(--color-gold)] text-sm">
                  <motion.span
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 0.85, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    🌿
                  </motion.span>
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">perfect score</span>
                  <motion.span
                    initial={{ opacity: 0, x: -6, scaleX: -1 }}
                    animate={{ opacity: 0.85, x: 0, scaleX: -1 }}
                    transition={{ delay: 0.2 }}
                  >
                    🌿
                  </motion.span>
                </div>
              )}

              <motion.div
                initial={{ scale: 0.6 }}
                animate={{ scale: 1, rotate: perfect ? [0, -8, 8, 0] : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                className="text-5xl mb-3"
              >
                {perfect ? "🏆" : "💕"}
              </motion.div>

              <p className="font-script text-4xl text-[var(--color-rose)] mb-1">
                <CountUp to={score} /> / {total}
              </p>

              <p className="text-[var(--color-text-soft)] mb-6 leading-relaxed">
                {perfect
                  ? "Perfect score, Local Don. Obviously."
                  : "Close enough — I still love you the same."}
              </p>

              <div className="flex justify-center gap-1.5 mb-6">
                {Array.from({ length: total }).map((_, i) => (
                  <motion.span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${
                      i < score ? "bg-[var(--color-rose)]" : "bg-[var(--color-rose-soft)]"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.08, type: "spring", stiffness: 400 }}
                  />
                ))}
              </div>

              <motion.button
                onClick={retry}
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="
                  relative px-7 py-2.5 rounded-full border-0 cursor-pointer
                  bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-rose-mid)]
                  text-white font-bold text-sm shadow-md
                "
              >
                try again
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-[0.7rem] text-[var(--color-text-soft)] text-center mb-2 tracking-wide uppercase font-semibold">
                question {idx + 1} of {total}
              </p>

              <h3 className="font-display text-xl sm:text-[1.35rem] text-center mb-6 text-[var(--color-text)] leading-snug">
                {QUIZ[idx].q}
              </h3>

              <div className="flex flex-col gap-2.5">
                {QUIZ[idx].opts.map((o, i) => {
                  let style =
                    "border-[var(--color-rose)]/18 hover:border-[var(--color-rose)]/50 bg-transparent hover:bg-[var(--color-rose-soft)]/20";
                  let bgStyle = {};

                  if (selected !== null) {
                    if (i === QUIZ[idx].correct) {
                      style = "border-[var(--color-mint)] text-[var(--color-text)]";
                      bgStyle = { background: "color-mix(in srgb, var(--color-mint) 22%, var(--color-card))" };
                    } else if (selected === i) {
                      style = "bg-[var(--color-rose-soft)] border-[var(--color-rose)] text-[var(--color-text)]";
                    } else {
                      style = "border-[var(--color-rose)]/10 opacity-45";
                    }
                  }

                  const showCheck = selected !== null && i === QUIZ[idx].correct;
                  const showX = selected === i && i !== QUIZ[idx].correct;

                  return (
                    <motion.button
                      key={i}
                      onClick={() => answer(i)}
                      disabled={selected !== null}
                      whileHover={selected === null ? { x: 4 } : {}}
                      whileTap={selected === null ? { scale: 0.98 } : {}}
                      style={bgStyle}
                      className={`
                        relative px-4 py-3.5 rounded-xl border text-left text-sm
                        cursor-pointer transition-colors duration-200 font-medium
                        ${style}
                      `}
                    >
                      <span className="inline-flex items-center gap-3">
                        <span
                          className={`
                            relative w-6 h-6 rounded-full flex-none flex items-center justify-center
                            text-[0.65rem] font-bold border overflow-hidden
                            ${
                              showCheck
                                ? "bg-[var(--color-mint)] border-[var(--color-mint)] text-white"
                                : showX
                                ? "bg-[var(--color-rose)] border-[var(--color-rose)] text-white"
                                : "border-[var(--color-rose)]/30 text-[var(--color-rose)]/70"
                            }
                          `}
                        >
                          <AnimatePresence mode="wait">
                            {showCheck ? (
                              <motion.span
                                key="check"
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                              >
                                <FiCheck size={12} strokeWidth={3} />
                              </motion.span>
                            ) : showX ? (
                              <motion.span
                                key="x"
                                initial={{ scale: 0, rotate: 30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                              >
                                <FiX size={12} strokeWidth={3} />
                              </motion.span>
                            ) : (
                              <motion.span key="letter">{String.fromCharCode(65 + i)}</motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                        {o}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}