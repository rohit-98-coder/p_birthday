import { AnimatePresence, motion } from "framer-motion";
import { FiMoon, FiSun, FiVolume2, FiVolumeX } from "react-icons/fi";
import { HiOutlineMusicalNote } from "react-icons/hi2";

export default function TopControls({ dark, setDark, soundOn, setSoundOn, musicOn, toggleMusic }) {
  const buttons = [
    {
      key: "music",
      active: musicOn,
      onClick: toggleMusic,
      title: "ambient music",
      icon: (
        <motion.span
          className="flex items-center justify-center"
          animate={musicOn ? { rotate: [0, -8, 8, 0] } : { rotate: 0 }}
          transition={{ duration: 1.4, repeat: musicOn ? Infinity : 0, ease: "easeInOut" }}
        >
          <HiOutlineMusicalNote size={18} />
        </motion.span>
      ),
    },
    {
      key: "sound",
      active: soundOn,
      onClick: () => setSoundOn((s) => !s),
      title: "sound effects",
      icon: (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={soundOn ? "on" : "off"}
            initial={{ opacity: 0, scale: 0.6, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 25 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-center"
          >
            {soundOn ? <FiVolume2 size={18} /> : <FiVolumeX size={18} />}
          </motion.span>
        </AnimatePresence>
      ),
    },
    {
      key: "theme",
      active: false,
      onClick: () => setDark((d) => !d),
      title: "toggle theme",
      icon: (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={dark ? "sun" : "moon"}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </motion.span>
        </AnimatePresence>
      ),
    },
  ];

  return (
    <motion.div
      className="
        fixed top-4 right-4 z-[60]
        flex items-center gap-0.5 p-1 rounded-full
        border border-[var(--color-rose)]/15
        bg-[var(--color-card)]/75 backdrop-blur-md
        shadow-lg
      "
      initial={{ opacity: 0, y: -14, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 240, damping: 20 }}
    >
      {buttons.map((b, i) => (
        <div key={b.key} className="relative flex items-center">
          <motion.button
            className={`
              group relative w-10 h-10 rounded-full flex items-center justify-center
              cursor-pointer overflow-visible transition-colors duration-300
              ${b.active
                ? "bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-rose-mid)] text-white"
                : "text-[var(--color-rose)] hover:bg-[var(--color-rose-soft)]/25"
              }
            `}
            onClick={b.onClick}
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.06 }}
          >
            {/* soft pulsing ring behind the button while its feature is active */}
            {b.active && (
              <motion.span
                className="absolute inset-0 rounded-full bg-[var(--color-rose)]/40 -z-10"
                animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            {b.icon}

            {/* tooltip label, appears on hover instead of relying on the native title attr */}
            <span
              className="
                pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2
                px-2.5 py-1 rounded-lg whitespace-nowrap
                text-[0.65rem] font-semibold tracking-wide
                bg-[var(--color-text)] text-[var(--color-card)]
                opacity-0 group-hover:opacity-90
                translate-y-[-2px] group-hover:translate-y-0
                transition-all duration-200 z-10
              "
            >
              {b.title}
            </span>
          </motion.button>

          {/* thin divider between buttons, not after the last one */}
          {i < buttons.length - 1 && (
            <span className="w-px h-5 bg-[var(--color-rose-soft)]/50 mx-0.5" />
          )}
        </div>
      ))}
    </motion.div>
  );
}