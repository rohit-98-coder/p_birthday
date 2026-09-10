import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="
            fixed bottom-7 left-1/2 -translate-x-1/2 z-[200]
            flex items-center gap-2.5
            bg-[var(--color-card)] text-[var(--color-text)]
            px-5 py-3 rounded-full
            shadow-xl text-sm
            border border-[var(--color-rose)]/15
            pointer-events-none
            backdrop-blur-md
          "
          initial={{ opacity: 0, y: 24, scale: 0.94, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 12, scale: 0.96, filter: "blur(2px)" }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
        >
          {/* a quiet warm glow beneath, tying the toast to the site's ambient light rather than a flat shadow */}
          <span className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-[var(--color-rose-soft)]/25 blur-lg" />

          <motion.span
            className="text-base leading-none"
            animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          >
            ✨
          </motion.span>
          <span className="font-medium tracking-wide">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}