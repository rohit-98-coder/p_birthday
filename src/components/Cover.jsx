import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const FLOATING = ["✨", "♡", "🌸", "💫", "❀", "💕", "✦", "☁︎"];
const SPARKLES = ["✦", "✧", "⋆"];
const PASSWORD = "paru_billu";

export default function Cover({ onOpen }) {
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(true);
  const [guess, setGuess] = useState("");
  const [shake, setShake] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const full = "a little something, just for you";
  const cardRef = useRef(null);
  const inputRef = useRef(null);

  // subtle mouse-follow tilt for a sense of depth on the card
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tiltX = useSpring(useTransform(rawY, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 });
  const tiltY = useSpring(useTransform(rawX, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 18 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const resetTilt = () => {
    rawX.set(0);
    rawY.set(0);
  };

  // randomize once so the floating field never looks like a repeating grid
  const floatingSpots = useMemo(
    () =>
      FLOATING.map((s) => ({
        sym: s,
        left: 6 + Math.random() * 88,
        top: 8 + Math.random() * 80,
        dur: 4 + Math.random() * 3,
        delay: Math.random() * 2.5,
      })),
    []
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        sym: SPARKLES[i % SPARKLES.length],
        left: Math.random() * 100,
        top: Math.random() * 100,
        dur: 1.6 + Math.random() * 1.8,
        delay: Math.random() * 4,
        size: 0.5 + Math.random() * 0.6,
      })),
    []
  );

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i <= full.length) {
        setText(full.slice(0, i));
        i++;
      } else {
        clearInterval(id);
        setReady(true);
      }
    }, 42);
    return () => clearInterval(id);
  }, []);

  const revealPasswordField = () => {
    setLocked(false);
    setTimeout(() => inputRef.current?.focus(), 350);
  };

  const submitPassword = (e) => {
    e.preventDefault();
    const normalized = guess.trim().toLowerCase().replace(/\s+/g, "_");
    if (normalized === PASSWORD) {
      setUnlocking(true);
      setTimeout(() => onOpen(), 650);
    } else {
      setShake(true);
      setAttempts((a) => a + 1);
      setTimeout(() => setShake(false), 500);
      setGuess("");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 28% 18%, color-mix(in srgb, var(--color-rose-soft) 65%, transparent) 0%, var(--color-bg2) 42%, var(--color-bg) 78%, var(--color-card) 100%)",
      }}
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.7, ease: "easeInOut" } }}
    >
      {/* soft ambient blobs */}
      <motion.div
        className="absolute top-[6%] left-[4%] w-72 h-72 rounded-full blur-3xl"
        style={{ background: "color-mix(in srgb, var(--color-gold-soft) 60%, transparent)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[4%] right-[2%] w-96 h-96 rounded-full blur-3xl"
        style={{ background: "color-mix(in srgb, var(--color-rose-soft) 65%, transparent)" }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />
      <motion.div
        className="absolute top-[40%] right-[18%] w-40 h-40 rounded-full blur-2xl"
        style={{ background: "color-mix(in srgb, var(--color-lav) 45%, transparent)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, 12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* quiet twinkling stars scattered behind everything */}
      {sparkles.map((s) => (
        <motion.span
          key={`spark-${s.id}`}
          className="absolute select-none pointer-events-none"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: `${s.size}rem`,
            color: "color-mix(in srgb, var(--color-rose-mid) 70%, transparent)",
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.6, 1.1, 0.6] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        >
          {s.sym}
        </motion.span>
      ))}

      {/* floating mini symbols */}
      {floatingSpots.map((f, i) => (
        <motion.span
          key={i}
          className="absolute text-lg opacity-40 select-none pointer-events-none"
          style={{ left: `${f.left}%`, top: `${f.top}%` }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.25, 0.55, 0.25],
            rotate: [0, 12, -8, 0],
          }}
          transition={{ duration: f.dur, repeat: Infinity, ease: "easeInOut", delay: f.delay }}
        >
          {f.sym}
        </motion.span>
      ))}

      {/* gift card */}
      <motion.div
        ref={cardRef}
        className="relative w-[340px] max-w-[88vw] aspect-[3/4] rounded-[30px] flex items-center justify-center text-center p-9 shadow-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(155deg, color-mix(in srgb, var(--color-rose-soft) 85%, white) 0%, var(--color-rose-soft) 38%, var(--color-rose-mid) 72%, var(--color-rose) 100%)",
          boxShadow:
            "0 30px 60px -12px color-mix(in srgb, var(--color-rose-deep) 45%, transparent), 0 0 0 1px rgba(255,255,255,0.25) inset",
          rotateX: tiltX,
          rotateY: tiltY,
          transformPerspective: 900,
          cursor: locked ? "pointer" : "default",
        }}
        animate={unlocking ? { scale: 1.06, opacity: 0 } : shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { scale: 1, opacity: 1 }}
        whileHover={locked ? { scale: 1.03, y: -6 } : {}}
        whileTap={locked ? { scale: 0.97 } : {}}
        onClick={locked ? revealPasswordField : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        initial={{ scale: 0.86, opacity: 0, y: 30 }}
        transition={
          unlocking
            ? { duration: 0.6, ease: "easeIn" }
            : shake
            ? { duration: 0.5, ease: "easeInOut" }
            : { type: "spring", stiffness: 180, damping: 18, delay: 0.15 }
        }
      >
        {/* fine paper-grain texture for a less flat, more tactile card surface */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.05] mix-blend-overlay pointer-events-none">
          <filter id="cover-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#cover-grain)" />
        </svg>

        {/* halo that breathes behind the card, ties it to the background */}
        <motion.div
          className="absolute -inset-6 rounded-[38px] -z-10 blur-2xl"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--color-rose-mid) 55%, transparent), transparent 70%)" }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* decorative borders */}
        <div className="absolute inset-[10px] border border-white/55 rounded-[22px] pointer-events-none" />
        <div className="absolute inset-[16px] border border-white/25 rounded-[18px] pointer-events-none" />

        {/* gold foil corner, matching the coupon-card motif elsewhere on the site */}
        <span
          className="absolute top-0 right-0 w-9 h-9 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, var(--color-gold-bright) 0%, var(--color-gold) 55%, transparent 60%)",
            clipPath: "polygon(100% 0, 100% 100%, 0 0)",
            opacity: 0.8,
          }}
        />

        {/* shine sweep */}
        <motion.div className="absolute inset-0 rounded-[30px] overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg]"
            animate={{ left: ["-50%", "150%"] }}
            transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
          />
        </motion.div>

        <div className="relative z-10 w-full" style={{ transform: "translateZ(30px)" }}>
          {/* seal — wax-seal styling when locked, embossed lock when unlocking password */}
          <motion.div
            className="relative w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center text-3xl shadow-lg"
            style={{
              background: locked
                ? "radial-gradient(circle at 35% 28%, rgba(255,255,255,0.75), rgba(255,255,255,0.18) 55%, rgba(255,255,255,0.08) 100%)"
                : "radial-gradient(circle at 35% 28%, color-mix(in srgb, var(--color-gold-bright) 70%, white), var(--color-gold) 60%, var(--color-gold) 100%)",
              border: "1px solid rgba(255,255,255,0.7)",
              backdropFilter: "blur(4px)",
              boxShadow: locked
                ? undefined
                : "0 4px 14px color-mix(in srgb, var(--color-gold) 50%, transparent), inset 0 1px 1px rgba(255,255,255,0.6)",
            }}
            animate={{ y: [0, -4, 0], rotate: [0, -4, 4, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {locked ? "🎀" : "🔐"}
          </motion.div>

          <motion.h1
            className="font-script text-[3.6rem] text-white drop-shadow-[0_4px_20px_rgba(125,23,64,0.4)] mb-1 leading-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            Paru
          </motion.h1>

          <motion.p
            className="text-[0.68rem] tracking-[0.16em] uppercase text-white/90 font-bold mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            billu · O+ · local don · cutu
          </motion.p>

          {/* typewriter + cursor, only while locked */}
          <AnimatePresence mode="wait">
            {locked ? (
              <motion.div
                key="locked"
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <p className="font-script text-[1.35rem] text-white mb-7 min-h-[1.7em] drop-shadow-sm">
                  {text}
                  <motion.span
                    className="inline-block w-[2px] h-[1.1em] bg-white/80 ml-0.5 align-middle"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </p>

                <div className="relative inline-flex items-center justify-center">
                  {ready && (
                    <motion.span
                      className="absolute inset-0 rounded-full border border-white/50"
                      animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  <motion.div
                    className="relative inline-flex items-center gap-2 bg-white/18 px-5 py-2.5 rounded-full border border-white/40 text-white text-xs font-bold tracking-wide shadow-md backdrop-blur-sm"
                    animate={ready ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <motion.span
                      className="text-base inline-block"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                    >
                      🎂
                    </motion.span>
                    tap to open your gift
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="unlock"
                onSubmit={submitPassword}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="flex flex-col items-center gap-3"
              >
                <p className="font-script text-[1.2rem] text-white mb-1 drop-shadow-sm">
                  only for someone who knows me
                </p>
                <input
                  ref={inputRef}
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder="our little secret"
                  className="w-full text-center px-4 py-2.5 rounded-full bg-white/20 border border-white/50 text-white placeholder-white/60 text-sm outline-none focus:bg-white/28 focus:border-white/80 transition-colors backdrop-blur-sm"
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-white/22 px-5 py-2.5 rounded-full border border-white/45 text-white text-xs font-bold tracking-wide shadow-md backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  <span className="text-base">🔓</span>
                  unlock it
                </motion.button>
                <AnimatePresence>
                  {shake && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-white/85 text-[0.7rem] tracking-wide"
                    >
                      {attempts >= 3 ? "still not it — think DBMS lab 🪑" : "not quite — try again 💭"}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.p
        className="absolute bottom-8 left-0 right-0 text-center text-xs tracking-[0.2em] uppercase font-semibold"
        style={{ color: "color-mix(in srgb, var(--color-rose) 55%, transparent)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        made with love · 11.09
      </motion.p>
    </motion.div>
  );
}