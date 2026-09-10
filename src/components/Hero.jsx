import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROFILE } from "../data/content";
import { useCountdown } from "../hooks/useCountdown";

// A single digit that flips to its new value rather than just swapping text,
// so the countdown feels like it's actually ticking rather than re-rendering.
function FlipDigit({ value }) {
  return (
    <span className="relative inline-block overflow-hidden h-[1.1em] align-top">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          className="block"
          initial={{ y: "60%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-60%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const { time, isToday, turningAge } = useCountdown();

  const boxes = [
    { v: String(time.days), l: "days" },
    { v: String(time.hours).padStart(2, "0"), l: "hours" },
    { v: String(time.mins).padStart(2, "0"), l: "mins" },
    { v: String(time.secs).padStart(2, "0"), l: "secs" },
  ];

  const sparkles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: 10 + Math.random() * 80,
        top: 5 + Math.random() * 55,
        dur: 2.5 + Math.random() * 2,
        delay: Math.random() * 4,
        size: 0.4 + Math.random() * 0.4,
      })),
    []
  );

  // gold confetti glints for the "today" state — quiet, not a full burst
  const glints = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: 15 + Math.random() * 70,
        top: 10 + Math.random() * 60,
        dur: 2 + Math.random() * 2,
        delay: Math.random() * 3,
      })),
    []
  );

  return (
    <section className="relative max-w-3xl mx-auto px-5 pt-22 pb-12 text-center overflow-hidden">
      {/* soft glow behind title */}
      <motion.div
        className="absolute left-1/2 top-16 -translate-x-1/2 w-72 h-40 rounded-full bg-[var(--color-rose-soft)]/25 blur-3xl pointer-events-none"
        animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* quiet twinkles around the hero */}
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

      {/* date pill */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        <span className="
          inline-flex items-center gap-2
          text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-rose)] font-bold
          mb-3 px-4 py-1.5
          border border-[var(--color-rose)]/20 rounded-full
          bg-[var(--color-card)]/70 backdrop-blur-md shadow-sm
        ">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-rose)] animate-pulse" />
          11th September · 2004
        </span>
      </motion.div>

      {/* small ornament under the date pill, ties into the divider motif elsewhere */}
      <motion.div
        className="flex items-center justify-center gap-2 mb-5 opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.22 }}
      >
        <span className="w-5 h-px bg-[var(--color-rose-soft)]" />
        <span className="text-[var(--color-gold)] text-[0.65rem]">✦</span>
        <span className="w-5 h-px bg-[var(--color-rose-soft)]" />
      </motion.div>

      {/* main title */}
      <motion.h1
        className="grad-text font-display text-4xl sm:text-5xl md:text-[3.6rem] leading-[1.12] mb-6 tracking-tight"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.65, ease: "easeOut" }}
      >
        Happy {PROFILE.age}nd Birthday,
        <br />
        my Paru 🎂
      </motion.h1>

      {/* nickname pills */}
      <motion.div
        className="flex justify-center gap-2 flex-wrap mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42 }}
      >
        {PROFILE.nicknames.map((n, i) => (
          <motion.span
            key={n}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.48 + i * 0.06 }}
            whileHover={{ y: -3, scale: 1.05 }}
            className="
              text-[0.72rem] font-bold tracking-wide px-3.5 py-1.5 rounded-full
              bg-[var(--color-card)] border border-[var(--color-rose)]/15
              text-[var(--color-rose)] shadow-sm cursor-default
              hover:bg-gradient-to-r hover:from-[var(--color-rose)] hover:to-[var(--color-rose-mid)]
              hover:text-white hover:border-transparent hover:shadow-md
              transition-colors duration-300
            "
          >
            {n}
          </motion.span>
        ))}
      </motion.div>

      {/* tagline */}
      <motion.p
        className="text-[var(--color-text-soft)] text-[1.05rem] max-w-md mx-auto mb-11 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.58 }}
      >
        One more year of you — the best part of my every day.
        <br className="hidden sm:block" />
        I made you a little something. Scroll down, love.
      </motion.p>

      {/* countdown / birthday banner */}
      {!isToday ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68 }}
        >
          <div className="flex justify-center items-center gap-1.5 sm:gap-2 flex-wrap mb-4">
            {boxes.map((b, i) => (
              <div key={b.l} className="flex items-center gap-1.5 sm:gap-2">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.72 + i * 0.07 }}
                  whileHover={{ y: -2 }}
                  className="
                    relative overflow-hidden
                    bg-[var(--color-card)] border border-[var(--color-rose)]/12
                    rounded-2xl px-4 sm:px-5 py-4 min-w-[72px] sm:min-w-[82px]
                    shadow-lg transition-shadow duration-300
                  "
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/45 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[var(--color-rose-soft)] to-transparent" />

                  {/* pulses quietly on the seconds box to feel like it's alive */}
                  {b.l === "secs" && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      animate={{
                        boxShadow: [
                          "inset 0 0 0 0 color-mix(in srgb, var(--color-rose) 0%, transparent)",
                          "inset 0 0 0 2px color-mix(in srgb, var(--color-rose) 25%, transparent)",
                          "inset 0 0 0 0 color-mix(in srgb, var(--color-rose) 0%, transparent)",
                        ],
                      }}
                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}

                  <div className="relative font-display text-[1.85rem] sm:text-3xl text-[var(--color-rose)] font-bold leading-none tabular-nums flex justify-center">
                    {b.v.split("").map((ch, idx) => (
                      <FlipDigit key={idx} value={ch} />
                    ))}
                  </div>
                  <div className="relative text-[0.62rem] tracking-[0.14em] uppercase text-[var(--color-text-soft)] mt-1.5 font-semibold">
                    {b.l}
                  </div>
                </motion.div>

                {/* colon separator between boxes — makes it read as one clock, not four cards */}
                {i < boxes.length - 1 && (
                  <span className="text-[var(--color-rose-soft)] font-display text-xl sm:text-2xl font-bold pb-5 select-none">
                    :
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="text-[var(--color-text-soft)] text-sm mb-9">
            until Local Don officially turns{" "}
            <b className="text-[var(--color-rose)]">{turningAge}</b>
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65, type: "spring", stiffness: 160 }}
          className="relative mb-9"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[var(--color-gold-bright)]/20 blur-3xl" />

          {/* quiet gold glints, only on the actual birthday */}
          {glints.map((g) => (
            <motion.span
              key={g.id}
              className="absolute select-none pointer-events-none text-[var(--color-gold)] text-xs"
              style={{ left: `${g.left}%`, top: `${g.top}%` }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], rotate: [0, 90] }}
              transition={{ duration: g.dur, repeat: Infinity, delay: g.delay, ease: "easeInOut" }}
            >
              ✦
            </motion.span>
          ))}

          <p className="relative font-script text-3xl sm:text-4xl text-[var(--color-rose)]">
            it&apos;s your day, Cutu 🎉
          </p>
          <p className="relative text-sm text-[var(--color-text-soft)] mt-1 tracking-wide">
            happy {PROFILE.age}nd birthday
          </p>
        </motion.div>
      )}

      {/* scroll cue */}
      <motion.p
        className="text-sm text-[var(--color-text-soft)] tracking-[0.08em] inline-flex items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.95 }}
      >
        keep scrolling
        <motion.span
          className="inline-block"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓
        </motion.span>
      </motion.p>
    </section>
  );
}