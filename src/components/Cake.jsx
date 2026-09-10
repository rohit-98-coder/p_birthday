import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "./Section";

const CONFETTI_EMOJIS = ["🎊", "✨", "🎉", "💖", "🌟", "🎈"];
const RIBBON_COLORS = ["#e2578a", "#f0c869", "#9a7bd1", "#5fb894", "#b8265a"];

// One flame, flickering on its own rhythm so all three never look identical
function Flame({ seed }) {
  const wobble = 2 + (seed % 3);
  return (
    <motion.div
      className="relative w-3 h-[22px] mx-auto -mb-1 rounded-[50%_50%_50%_50%/60%_60%_40%_40%]"
      style={{
        background:
          "radial-gradient(circle at 50% 72%, #fff6d0 0%, #ffcf6b 35%, #ff9b3d 65%, #ff5a2b 92%)",
        boxShadow: "0 0 18px 6px rgba(255,150,60,0.55), 0 0 5px rgba(255,220,150,0.9)",
        transformOrigin: "50% 100%",
      }}
      animate={{
        rotate: [-wobble, wobble, -wobble * 0.6, wobble * 0.8, -wobble],
        scaleY: [1, 1.1, 0.95, 1.06, 1],
        scaleX: [1, 0.93, 1.06, 0.96, 1],
      }}
      transition={{ duration: 1.6 + seed * 0.15, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* inner blue-white hot core */}
      <div
        className="absolute left-1/2 bottom-[3px] -translate-x-1/2 w-[3px] h-2 rounded-full"
        style={{ background: "radial-gradient(circle, #fffef2 0%, #ffe9a8 70%, transparent 100%)" }}
      />
    </motion.div>
  );
}

// A little puff of smoke that rises and dissolves once a candle is blown
function Smoke() {
  return (
    <motion.span
      className="block text-xs -mt-1 mx-auto w-fit"
      initial={{ opacity: 0.7, y: 0, scale: 0.7 }}
      animate={{ opacity: 0, y: -20, scale: 1.4 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      💨
    </motion.span>
  );
}

// The celebration payoff: emojis + ribbon streamers drifting up and out
function ConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
        left: 6 + Math.random() * 88,
        size: 0.9 + Math.random() * 0.9,
        dur: 1.9 + Math.random() * 1.5,
        delay: Math.random() * 0.55,
        drift: (Math.random() - 0.5) * 100,
        spin: (Math.random() - 0.5) * 220,
      })),
    []
  );

  const ribbons = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        color: RIBBON_COLORS[i % RIBBON_COLORS.length],
        left: 4 + Math.random() * 92,
        w: 3 + Math.random() * 2,
        h: 12 + Math.random() * 10,
        dur: 2 + Math.random() * 1.3,
        delay: Math.random() * 0.5,
        drift: (Math.random() - 0.5) * 80,
        spin: (Math.random() - 0.5) * 380,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {ribbons.map((r) => (
        <motion.span
          key={`r-${r.id}`}
          className="absolute bottom-0 rounded-full"
          style={{ left: `${r.left}%`, width: r.w, height: r.h, background: r.color }}
          initial={{ y: 0, opacity: 0, rotate: 0 }}
          animate={{ y: "-170%", opacity: [0, 1, 1, 0], rotate: r.spin, x: r.drift }}
          transition={{ duration: r.dur, delay: r.delay, ease: "easeOut" }}
        />
      ))}
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute bottom-0 select-none"
          style={{ left: `${p.left}%`, fontSize: `${p.size}rem` }}
          initial={{ y: 0, opacity: 0, rotate: 0 }}
          animate={{ y: "-160%", opacity: [0, 1, 1, 0], rotate: p.spin, x: p.drift }}
          transition={{ duration: p.dur, delay: p.delay, ease: "easeOut" }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}

export default function Cake({ chime, chimeBig, tone }) {
  const [blown, setBlown] = useState([false, false, false]);
  const allBlown = blown.every(Boolean);
  const litCount = blown.filter((b) => !b).length;
  const firstUnblown = blown.findIndex((b) => !b);

  const blow = (i) => {
    if (blown[i]) return;
    tone?.(600, 0.3, 0, 0.08);
    chime?.();
    const next = [...blown];
    next[i] = true;
    setBlown(next);
    if (next.every(Boolean)) {
      setTimeout(() => chimeBig?.(), 300);
    }
  };

  const sprinkles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: 6 + Math.random() * 88,
        top: 30 + Math.random() * 60,
        rot: Math.random() * 360,
        hue: [340, 28, 260, 165, 45][i % 5],
      })),
    []
  );

  const tierSprinkles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: 8 + Math.random() * 84,
        top: 20 + Math.random() * 55,
        rot: Math.random() * 360,
        hue: [340, 45, 200][i % 3],
      })),
    []
  );

  return (
    <Section
      id="cake"
      eyebrow="step one"
      title="Blow out your candles"
      sub="Tap each flame, make a wish on every one, Billu."
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-64">
          {/* warm ambient glow, breathing while candles are still lit */}
          {litCount > 0 && (
            <motion.div
              className="pointer-events-none absolute -inset-8 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(255,150,70,0.4), transparent 70%)" }}
              animate={{ opacity: [0.5, 0.85, 0.5], scale: [0.95, 1.06, 0.95] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* piped "22" topper, sitting just behind the candles */}
          <div
            className="font-script text-2xl text-center mb-1 relative z-10"
            style={{
              color: "var(--color-rose-deep)",
              textShadow: "0 1px 0 rgba(255,255,255,0.6)",
            }}
          >
            twenty-two ✨
          </div>

          {/* candles */}
          <div className="flex justify-center gap-8 mb-[-6px] relative z-10">
            {blown.map((out, i) => (
              <button
                key={i}
                onClick={() => blow(i)}
                className="relative cursor-pointer text-center bg-transparent border-0 p-0"
                aria-label={`Candle ${i + 1}`}
              >
                {/* hint ring on the next candle to blow */}
                {!out && i === firstUnblown && litCount === blown.length && (
                  <motion.span
                    className="absolute -inset-3 rounded-full border border-[var(--color-rose)]/40"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <AnimatePresence mode="wait">
                  {out ? (
                    <motion.div
                      key="out"
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{ opacity: 0, scale: 0.3 }}
                      transition={{ duration: 0.3 }}
                      className="w-3 h-[22px] mx-auto -mb-1"
                    />
                  ) : (
                    <Flame key="lit" seed={i} />
                  )}
                </AnimatePresence>
                <div className="w-2.5 h-9 mx-auto rounded-sm bg-gradient-to-b from-[#fdf0d6] to-[#d9a441] relative overflow-hidden shadow-sm">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_3px,rgba(255,255,255,0.4)_3px_4px)]" />
                  <div className="absolute inset-y-0 left-0 w-[1px] bg-white/50" />
                </div>
                <AnimatePresence>{out && <Smoke key="smoke" />}</AnimatePresence>
              </button>
            ))}
          </div>

          {/* cake — two tiers */}
          <div className="relative">
            {/* top tier */}
            <div className="w-40 h-16 mx-auto rounded-t-xl bg-gradient-to-b from-[#fff6ec] via-[#ffe1d1] to-[#f9c3d3] shadow-lg relative overflow-hidden z-10">
              <svg className="absolute top-0 left-0 w-full" height="14" viewBox="0 0 160 14" preserveAspectRatio="none">
                <path
                  d="M0,0 H160 V4 C148,11 136,1 124,7 C112,13 100,1 88,6 C76,12 64,1 52,6 C40,12 28,1 16,6 C8,9 3,5 0,4 Z"
                  fill="var(--color-gold-soft)"
                />
              </svg>
              <div className="absolute inset-0">
                {tierSprinkles.map((s) => (
                  <span
                    key={s.id}
                    className="absolute w-[2.5px] h-[6px] rounded-full opacity-75"
                    style={{
                      left: `${s.left}%`,
                      top: `${s.top}%`,
                      transform: `rotate(${s.rot}deg)`,
                      background: `hsl(${s.hue} 75% 62%)`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* bottom tier */}
            <div className="w-64 h-28 rounded-b-[36px] bg-gradient-to-b from-[#fff1e6] via-[#ffd9c7] to-[#f7b8c9] shadow-xl relative overflow-hidden -mt-1">
              {/* drippy frosting edge, richer wave */}
              <svg
                className="absolute top-0 left-0 w-full"
                height="20"
                viewBox="0 0 256 20"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0 H256 V6 C240,16 224,2 208,11 C192,19 176,3 160,10 C144,17 128,2 112,10 C96,17 80,2 64,10 C48,17 32,2 16,10 C8,14 3,8 0,6 Z"
                  fill="var(--color-rose-soft)"
                />
              </svg>
              {/* gold trim between drip and body */}
              <div className="absolute top-[16px] left-0 right-0 h-[2px] bg-[var(--color-gold)]/40" />
              {/* sprinkles */}
              <div className="absolute inset-0">
                {sprinkles.map((s) => (
                  <span
                    key={s.id}
                    className="absolute w-[3px] h-[7px] rounded-full opacity-70"
                    style={{
                      left: `${s.left}%`,
                      top: `${s.top}%`,
                      transform: `rotate(${s.rot}deg)`,
                      background: `hsl(${s.hue} 75% 62%)`,
                    }}
                  />
                ))}
              </div>
              {/* soft inner shading at the base for depth */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          </div>

          {/* glass plate with reflection */}
          <div className="relative w-56 mx-auto -mt-1">
            <div className="w-full h-2.5 rounded-full bg-gradient-to-b from-white/70 to-white/10 border border-white/60" />
            <div className="w-[92%] mx-auto h-2 rounded-full bg-black/10 blur-[4px] -mt-0.5" />
          </div>

          {allBlown && <ConfettiBurst />}
        </div>

        <motion.p
          key={litCount}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-[var(--color-text-soft)]"
        >
          {allBlown ? "🕯️ all wishes made" : `🕯️ ${litCount} candle${litCount === 1 ? "" : "s"} left`}
        </motion.p>

        <AnimatePresence>
          {allBlown && (
            <motion.p
              className="font-script text-2xl text-[var(--color-rose)] text-center max-w-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Whatever you wished for — I hope it comes true. And if not, I&apos;ll spend the year trying to get you there myself. 💗
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}