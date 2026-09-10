import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REASONS } from "../data/content";
import Section from "./Section";

// Hue anchors from the theme, mixed into gradients so dark mode repaints
// these correctly instead of the boxes staying frozen at light-mode hex.
const HUES = [
  "var(--color-gold)",
  "var(--color-rose-mid)",
  "var(--color-mint)",
  "var(--color-lav)",
];
const CONFETTI_EMOJIS = ["🎉", "✨", "💖", "🤍", "🌟"];
const RIBBON_COLORS = ["var(--color-rose)", "var(--color-gold)", "var(--color-lav)", "var(--color-mint)"];

// A quick ring of sparkles that pops out the moment a gift is opened
function OpenBurst() {
  const bits = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        angle: (360 / 6) * i,
        dist: 20 + Math.random() * 10,
      })),
    []
  );
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center z-20">
      {bits.map((b) => {
        const rad = (b.angle * Math.PI) / 180;
        return (
          <motion.span
            key={b.id}
            className="absolute text-xs"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
            animate={{
              x: Math.cos(rad) * b.dist,
              y: Math.sin(rad) * b.dist,
              opacity: 0,
              scale: 1,
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            ✨
          </motion.span>
        );
      })}
    </span>
  );
}

function ConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
        left: 6 + Math.random() * 88,
        size: 0.9 + Math.random() * 0.8,
        dur: 1.8 + Math.random() * 1.3,
        delay: Math.random() * 0.5,
        drift: (Math.random() - 0.5) * 80,
      })),
    []
  );
  const ribbons = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        color: RIBBON_COLORS[i % RIBBON_COLORS.length],
        left: 6 + Math.random() * 88,
        w: 3 + Math.random() * 2,
        h: 11 + Math.random() * 9,
        dur: 1.9 + Math.random() * 1.2,
        delay: Math.random() * 0.4,
        drift: (Math.random() - 0.5) * 70,
        spin: (Math.random() - 0.5) * 320,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {ribbons.map((r) => (
        <motion.span
          key={`r-${r.id}`}
          className="absolute bottom-4 rounded-full"
          style={{ left: `${r.left}%`, width: r.w, height: r.h, background: r.color }}
          initial={{ y: 0, opacity: 0, rotate: 0 }}
          animate={{ y: "-150%", opacity: [0, 1, 1, 0], x: r.drift, rotate: r.spin }}
          transition={{ duration: r.dur, delay: r.delay, ease: "easeOut" }}
        />
      ))}
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute bottom-4 select-none"
          style={{ left: `${p.left}%`, fontSize: `${p.size}rem` }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: "-150%", opacity: [0, 1, 1, 0], x: p.drift }}
          transition={{ duration: p.dur, delay: p.delay, ease: "easeOut" }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}

export default function Reasons({ chime, chimeBig }) {
  const [opened, setOpened] = useState([]);
  const [active, setActive] = useState(null);
  const [justOpened, setJustOpened] = useState(null);
  const [showFinale, setShowFinale] = useState(false);

  const total = REASONS.length;
  const count = opened.length;

  const open = (i) => {
    if (opened.includes(i)) return;
    chime?.();
    setOpened((p) => [...p, i]);
    setJustOpened(i);
    setTimeout(() => setJustOpened(null), 600);
    setActive(i);
  };

  const handleClose = () => {
    const wasLast = opened.length === total;
    setActive(null);
    if (wasLast) {
      setTimeout(() => {
        setShowFinale(true);
        chimeBig?.();
      }, 350);
    }
  };

  return (
    <Section
      id="reasons"
      eyebrow="step two"
      title="Reasons I love you"
      sub="Tap a gift box to open it. Open all of them for a surprise."
    >
      {/* progress hearts */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex justify-center gap-1 flex-wrap max-w-xs mb-2">
          {REASONS.map((_, i) => (
            <motion.span
              key={i}
              className={`text-sm transition-colors ${
                opened.includes(i) ? "text-[var(--color-rose)]" : "text-[var(--color-rose-soft)]"
              }`}
              animate={opened.includes(i) ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
            >
              {opened.includes(i) ? "♥" : "♡"}
            </motion.span>
          ))}
        </div>
        <p className="text-sm text-[var(--color-text-soft)] tracking-wide">
          {count === 0
            ? "tap a gift to begin"
            : count === total
            ? "all opened 💕"
            : `${count} of ${total} opened`}
        </p>
      </div>

      {/* gift grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-3.5 max-w-md mx-auto">
        {REASONS.map((r, i) => {
          const isOpen = opened.includes(i);
          const hue = HUES[i % HUES.length];

          return (
            <motion.button
              key={i}
              onClick={() => open(i)}
              disabled={isOpen}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, type: "spring", stiffness: 160, damping: 16 }}
              whileHover={!isOpen ? { y: -4, scale: 1.06, rotate: -2 } : {}}
              whileTap={!isOpen ? { scale: 0.92 } : {}}
              className={`
                relative aspect-square rounded-2xl
                flex items-center justify-center text-3xl
                border-0 shadow-md overflow-hidden
                transition-[opacity,filter] duration-500
                ${isOpen
                  ? "opacity-40 scale-95 cursor-default grayscale-[30%]"
                  : "cursor-pointer"
                }
              `}
              style={{
                background: `linear-gradient(145deg, color-mix(in srgb, ${hue} 35%, var(--color-card)) 0%, color-mix(in srgb, ${hue} 70%, var(--color-card)) 50%, color-mix(in srgb, ${hue} 90%, black 6%) 100%)`,
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

              {/* ribbon cross, wrapped like an actual gift box instead of a flat swatch */}
              {!isOpen && (
                <>
                  <span
                    className="absolute left-1/2 top-0 bottom-0 w-[14%] -translate-x-1/2 pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.15))",
                    }}
                  />
                  <span
                    className="absolute top-1/2 left-0 right-0 h-[14%] -translate-y-1/2 pointer-events-none"
                    style={{
                      background: "linear-gradient(0deg, rgba(255,255,255,0.15), rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.15))",
                    }}
                  />
                </>
              )}

              <span className="absolute top-1.5 left-2 text-[0.58rem] font-bold text-black/25 z-10">
                {i + 1}
              </span>

              {/* the box "pops" open with a little overshoot the moment it's tapped */}
              <motion.span
                className="relative drop-shadow-sm select-none z-10"
                animate={
                  justOpened === i
                    ? { scale: [1, 1.5, 1], rotate: [0, -12, 8, 0] }
                    : !isOpen
                    ? { y: [0, -2, 0] }
                    : { scale: 1 }
                }
                transition={
                  justOpened === i
                    ? { duration: 0.5 }
                    : { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }
                }
              >
                {isOpen ? r.emoji : "🎁"}
              </motion.span>

              {justOpened === i && <OpenBurst />}

              {isOpen && (
                <span className="absolute bottom-1.5 right-1.5 text-[0.55rem] bg-white/50 rounded-full w-4 h-4 flex items-center justify-center text-[var(--color-rose-deep)] z-10">
                  ✓
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* reason overlay */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-5 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="
                relative bg-[var(--color-card)] rounded-[28px]
                p-8 max-w-sm w-full text-center shadow-2xl
                border border-[var(--color-rose)]/10 overflow-hidden
              "
              initial={{ scale: 0.88, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-rose)] via-[var(--color-gold-bright)] to-[var(--color-rose-mid)]" />
              {/* foil corner, same motif as coupons/cover */}
              <span
                className="absolute top-0 right-0 w-8 h-8 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, var(--color-gold-bright) 0%, var(--color-gold) 55%, transparent 60%)",
                  clipPath: "polygon(100% 0, 100% 100%, 0 0)",
                  opacity: 0.75,
                }}
              />
              <motion.div
                className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[var(--color-rose-soft)]/30 blur-2xl pointer-events-none"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                className="text-5xl mb-4"
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 14 }}
              >
                {REASONS[active].emoji}
              </motion.div>

              <p className="text-[1.05rem] leading-relaxed text-[var(--color-text)] mb-7">
                {REASONS[active].text}
              </p>

              <motion.button
                onClick={handleClose}
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="
                  px-8 py-3 rounded-full border-0 cursor-pointer
                  bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-rose-mid)]
                  text-white font-bold shadow-lg text-sm
                "
              >
                close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* finale */}
      <AnimatePresence>
        {showFinale && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-5 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFinale(false)}
          >
            <motion.div
              className="
                relative bg-[var(--color-card)] rounded-[30px] p-10 max-w-sm w-full
                text-center shadow-2xl overflow-hidden
              "
              style={{
                border: "1px solid transparent",
                backgroundImage:
                  "linear-gradient(var(--color-card), var(--color-card)), linear-gradient(120deg, var(--color-gold), var(--color-rose-mid), var(--color-gold-bright))",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
              initial={{ scale: 0.86, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ConfettiBurst />

              {/* laurel flourish, matching the quiz's perfect-score treatment */}
              <div className="flex items-center justify-center gap-2 mb-1 text-[var(--color-gold)]">
                <motion.span initial={{ opacity: 0, x: 6 }} animate={{ opacity: 0.85, x: 0 }} transition={{ delay: 0.15 }}>
                  🌿
                </motion.span>
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">every reason</span>
                <motion.span
                  initial={{ opacity: 0, x: -6, scaleX: -1 }}
                  animate={{ opacity: 0.85, x: 0, scaleX: -1 }}
                  transition={{ delay: 0.15 }}
                >
                  🌿
                </motion.span>
              </div>

              <motion.div
                className="text-5xl mb-3"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1, rotate: [0, -6, 6, 0] }}
                transition={{ type: "spring", stiffness: 260, damping: 14 }}
              >
                🤍
              </motion.div>
              <h3 className="font-display text-2xl text-[var(--color-rose)] mb-3">
                that&apos;s all {total}
              </h3>
              <p className="text-[var(--color-text-soft)] leading-relaxed mb-6">
                Every reason was true, and there are so many more I never wrote down.
                Happy 22nd, my love.
              </p>
              <button
                onClick={() => setShowFinale(false)}
                className="
                  relative px-7 py-3 rounded-full border-0 cursor-pointer
                  bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-rose-mid)]
                  text-white font-bold text-sm
                "
              >
                close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}