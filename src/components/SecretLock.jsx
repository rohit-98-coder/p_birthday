import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VALID_NICKNAMES } from "../data/content";
import Section from "./Section";

// Soft golden rays that fan out once the note unlocks — a quiet
// "something important just happened" cue rather than confetti overload.
function UnlockRays() {
  const rays = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ id: i, angle: i * 36 })),
    []
  );
  return (
    <span className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 -translate-y-1/2 z-0">
      {rays.map((r) => (
        <motion.span
          key={r.id}
          className="absolute left-0 top-0 w-[2px] h-14 origin-top"
          style={{
            background: "linear-gradient(to bottom, var(--color-gold-bright), transparent)",
            transform: `rotate(${r.angle}deg)`,
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: [0, 0.6, 0], scaleY: [0.3, 1, 0.6] }}
          transition={{ duration: 1.2, delay: 0.15, ease: "easeOut" }}
        />
      ))}
    </span>
  );
}

// A small metal padlock built from shapes, rather than relying on the flat
// emoji glyph — reads as a physical object with weight and a shackle.
function LockIcon({ locked, shaking }) {
  return (
    <motion.div
      className="relative w-14 h-14 mx-auto mb-3"
      animate={
        shaking
          ? { rotate: [0, -12, 12, -8, 8, 0], y: 0 }
          : { y: [0, -4, 0] }
      }
      transition={
        shaking
          ? { duration: 0.45 }
          : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
      }
    >
      {/* shackle */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-6 h-7 rounded-t-full border-[4px] border-b-0"
        style={{ borderColor: "var(--color-gold)" }}
        animate={{ rotate: locked ? 0 : -18, x: locked ? 0 : 3, y: locked ? 0 : -2 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
      />
      {/* body */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-11 h-8 rounded-lg shadow-md"
        style={{
          background:
            "linear-gradient(155deg, color-mix(in srgb, var(--color-gold-bright) 75%, white) 0%, var(--color-gold) 55%, color-mix(in srgb, var(--color-gold) 85%, black 10%) 100%)",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-lg bg-white/25" />
        <div className="absolute left-1/2 -translate-x-1/2 top-2 w-1.5 h-1.5 rounded-full bg-black/25" />
      </div>
    </motion.div>
  );
}

export default function SecretLock({ chimeBig, tone }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const submit = (e) => {
    e.preventDefault();
    const val = input.trim().toLowerCase();
    if (VALID_NICKNAMES.includes(val)) {
      chimeBig?.();
      setUnlocked(true);
      setError("");
    } else {
      setError("hmm, that's not one of your nicknames. try again, Cutu.");
      tone?.(280, 0.25, 0, 0.08);
      setShake(true);
      setAttempts((a) => a + 1);
      setTimeout(() => setShake(false), 450);
    }
  };

  const strugglingALot = attempts >= 3;

  return (
    <Section id="lock" eyebrow="one last thing" title="A locked note">
      <motion.div
        className="
          relative max-w-sm mx-auto
          bg-[var(--color-card)] rounded-[28px] p-8 sm:p-9
          text-center shadow-xl overflow-hidden
        "
        style={{
          border: unlocked ? "1px solid transparent" : "1px solid color-mix(in srgb, var(--color-rose) 12%, transparent)",
          backgroundImage: unlocked
            ? "linear-gradient(var(--color-card), var(--color-card)), linear-gradient(120deg, var(--color-gold), var(--color-rose-mid), var(--color-gold-bright))"
            : undefined,
          backgroundOrigin: unlocked ? "border-box" : undefined,
          backgroundClip: unlocked ? "padding-box, border-box" : undefined,
        }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
      >
        {/* foil corner, once unlocked — same motif as the rest of the site */}
        {unlocked && (
          <span
            className="absolute top-0 right-0 w-9 h-9 pointer-events-none z-10"
            style={{
              background: "linear-gradient(135deg, var(--color-gold-bright) 0%, var(--color-gold) 55%, transparent 60%)",
              clipPath: "polygon(100% 0, 100% 100%, 0 0)",
              opacity: 0.8,
            }}
          />
        )}

        <motion.div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-[var(--color-rose-soft)]/25 blur-3xl pointer-events-none"
          animate={{ opacity: unlocked ? [0.7, 1, 0.7] : [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {unlocked && <UnlockRays />}

        <AnimatePresence mode="wait">
          {!unlocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative"
            >
              <LockIcon locked={true} shaking={shake} />

              <p className="text-sm text-[var(--color-text-soft)] mb-6 leading-relaxed">
                type one of your nicknames to unlock it
              </p>

              <form onSubmit={submit} className="flex gap-2 justify-center flex-wrap">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="nickname..."
                  className={`
                    px-4 py-2.5 rounded-full
                    border bg-[var(--color-bg)] text-[var(--color-text)]
                    text-center outline-none text-sm min-w-[160px]
                    focus:ring-2 transition-all duration-300
                    ${error
                      ? "border-[var(--color-rose)]/60 focus:ring-[var(--color-rose)]/25"
                      : "border-[var(--color-rose)]/20 focus:border-[var(--color-rose)] focus:ring-[var(--color-rose)]/15"
                    }
                  `}
                />
                <motion.button
                  type="submit"
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="
                    px-5 py-2.5 rounded-full border-0 cursor-pointer
                    bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-rose-mid)]
                    text-white font-bold text-sm shadow-md
                  "
                >
                  Unlock
                </motion.button>
              </form>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[var(--color-rose)] text-xs mt-4"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.p
                className="mt-5 text-[0.65rem] text-[var(--color-text-soft)]/70 tracking-wide"
                animate={strugglingALot ? { opacity: [0.7, 1, 0.7], scale: [1, 1.04, 1] } : {}}
                transition={{ duration: 1.6, repeat: strugglingALot ? Infinity : 0, ease: "easeInOut" }}
              >
                hint: billu · o+ · local don · paru · cutu
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <LockIcon locked={false} shaking={false} />

              <motion.p
                className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--color-rose)]/70 mb-4"
                initial={{ opacity: 0, letterSpacing: "0.4em" }}
                animate={{ opacity: 1, letterSpacing: "0.16em" }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                unlocked
              </motion.p>

              <p className="leading-relaxed text-[0.95rem] text-[var(--color-text)] text-left mb-5">
                If you&apos;re reading this, you found it, Billu. Here&apos;s the
                truth I don&apos;t say enough: you are the calmest, safest place I
                know. Every version of you — Paru, Cutu, O+, the Local Don who
                runs this relationship — is the one I&apos;d pick, every single
                time. Happy 22nd, my love.
              </p>

              <div className="flex items-center gap-3 my-4 opacity-40">
                <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--color-rose-soft)]" />
                <motion.span
                  className="text-[var(--color-rose)] text-xs"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  ✦
                </motion.span>
                <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--color-rose-soft)]" />
              </div>

              {/* small wax seal beside the final line, sealing the note shut */}
              <div className="flex items-center justify-center gap-2">
                <motion.span
                  className="relative w-6 h-6 rounded-full flex-none"
                  style={{
                    background:
                      "radial-gradient(circle at 32% 26%, color-mix(in srgb, var(--color-rose-mid) 80%, white) 0%, var(--color-rose) 55%, var(--color-rose-deep) 100%)",
                  }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.55, type: "spring", stiffness: 260, damping: 16 }}
                >
                  <span
                    className="absolute inset-[1.5px] rounded-full pointer-events-none"
                    style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -1px 1px rgba(0,0,0,0.2)" }}
                  />
                </motion.span>
                <motion.p
                  className="font-script text-2xl text-[var(--color-rose)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  forever yours 🤍
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}