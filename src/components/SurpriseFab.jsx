import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SURPRISE_NOTES } from "../data/content";

// A quick sparkle pop the instant a note opens
function OpenSparkle() {
  const bits = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        angle: (360 / 8) * i,
        dist: 26 + Math.random() * 14,
      })),
    []
  );
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
      {bits.map((b) => {
        const rad = (b.angle * Math.PI) / 180;
        return (
          <motion.span
            key={b.id}
            className="absolute text-sm"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
            animate={{
              x: Math.cos(rad) * b.dist,
              y: Math.sin(rad) * b.dist,
              opacity: 0,
              scale: 1,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            ✨
          </motion.span>
        );
      })}
    </span>
  );
}

export default function SurpriseFab({ chime }) {
  const [note, setNote] = useState(null);
  const [noteIdx, setNoteIdx] = useState(null);
  const [showSparkle, setShowSparkle] = useState(false);
  const [seenCount, setSeenCount] = useState(0);
  const [justCompleted, setJustCompleted] = useState(false);
  const seenRef = useRef([]);
  const hasLoopedRef = useRef(false);

  const unseenCount = SURPRISE_NOTES.length - seenRef.current.length;

  const open = () => {
    chime?.();

    // cycle through every note before repeating, so "surprise me" doesn't
    // just show the same one or two notes on a bad roll
    let pool = SURPRISE_NOTES.map((_, i) => i).filter((i) => !seenRef.current.includes(i));
    const willComplete = pool.length === 1 && !hasLoopedRef.current;

    if (pool.length === 0) {
      seenRef.current = [];
      hasLoopedRef.current = true;
      pool = SURPRISE_NOTES.map((_, i) => i);
    }
    const idx = pool[Math.floor(Math.random() * pool.length)];
    seenRef.current = [...seenRef.current, idx];
    setSeenCount(seenRef.current.length);

    setNoteIdx(idx);
    setNote(SURPRISE_NOTES[idx]);
    setShowSparkle(true);
    setJustCompleted(willComplete);
    setTimeout(() => setShowSparkle(false), 650);
  };

  return (
    <>
      <motion.button
        onClick={open}
        className="
          fixed left-4 bottom-5 z-50
          flex items-center gap-2
          px-4 py-3 rounded-full
          bg-gradient-to-r from-[var(--color-gold-bright)] to-[var(--color-gold)]
          text-[var(--color-rose-deep)] font-extrabold text-sm
          shadow-xl cursor-pointer border-0
          overflow-hidden
        "
        whileHover={{ y: -5, scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ y: { repeat: Infinity, duration: 3.6, ease: "easeInOut" } }}
        aria-label="Open a surprise note"
      >
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shine_5s_ease-in-out_infinite]" />

        {/* quiet ring once she's found a few, rewards continued tapping without nagging */}
        {seenCount >= 3 && (
          <motion.span
            className="absolute -inset-1 rounded-full border pointer-events-none"
            style={{ borderColor: "var(--color-rose)" }}
            animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.04, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* unseen-notes badge, quietly invites a first tap without nagging after that */}
        {unseenCount === SURPRISE_NOTES.length && (
          <motion.span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--color-rose)]"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <span className="text-base relative">🎁</span>
        <span className="relative tracking-wide">surprise me</span>
      </motion.button>

      <AnimatePresence>
        {note && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-5 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNote(null)}
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
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-gold-bright)] via-[var(--color-rose)] to-[var(--color-gold)]" />

              {/* foil corner, consistent with the rest of the site's card language */}
              <span
                className="absolute top-0 right-0 w-8 h-8 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, var(--color-gold-bright) 0%, var(--color-gold) 55%, transparent 60%)",
                  clipPath: "polygon(100% 0, 100% 100%, 0 0)",
                  opacity: 0.75,
                }}
              />

              <motion.div
                className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[var(--color-gold-soft)]/40 blur-2xl pointer-events-none"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {showSparkle && <OpenSparkle />}

              {justCompleted && (
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--color-gold)] mb-2">
                  ✨ every note found ✨
                </p>
              )}

              <motion.div
                className="text-5xl mb-4"
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 14 }}
              >
                {note.emoji}
              </motion.div>

              <p className="text-[1.05rem] leading-relaxed text-[var(--color-text)] mb-4">
                {note.text}
              </p>

              {/* progress dots, replacing the plain "note X of Y" line */}
              {SURPRISE_NOTES.length > 1 && (
                <div className="flex justify-center gap-1.5 mb-5">
                  {SURPRISE_NOTES.map((_, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                      style={{
                        background: seenRef.current.includes(i)
                          ? "var(--color-rose)"
                          : "color-mix(in srgb, var(--color-rose-soft) 70%, transparent)",
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center justify-center gap-2.5">
                <motion.button
                  onClick={() => setNote(null)}
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="
                    px-8 py-3 rounded-full border-0 cursor-pointer
                    bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-rose-mid)]
                    text-white font-bold text-sm shadow-lg
                  "
                >
                  close
                </motion.button>
                {unseenCount > 0 && (
                  <motion.button
                    onClick={open}
                    whileHover={{ y: -2, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="
                      px-5 py-3 rounded-full cursor-pointer
                      border border-[var(--color-rose)]/25 text-[var(--color-rose)]
                      font-bold text-sm bg-transparent
                    "
                  >
                    one more
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          30%, 100% { transform: translateX(200%); }
        }
      `}</style>
    </>
  );
}