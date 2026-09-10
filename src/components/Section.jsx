import { motion } from "framer-motion";

export default function Section({ id, eyebrow, title, sub, children, className = "" }) {
  // Split the title into words so it reveals as a small cascade rather
  // than one flat block — a single reusable signature move that ties
  // every section together without adding per-section decoration.
  const titleWords = typeof title === "string" ? title.split(" ") : null;

  return (
    <motion.section
      id={id}
      className={`relative max-w-3xl mx-auto px-5 py-16 sm:py-20 ${className}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow && (
        <motion.p
          className="
            text-center text-[0.7rem] tracking-[0.22em] uppercase
            text-[var(--color-rose)] font-bold mb-3.5
            flex items-center justify-center gap-2.5
          "
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.45 }}
        >
          <span className="w-6 h-px bg-gradient-to-r from-transparent to-[var(--color-rose-soft)]" />
          <span className="w-1 h-1 rounded-full bg-[var(--color-rose)]" />
          {eyebrow}
          <span className="w-1 h-1 rounded-full bg-[var(--color-rose)]" />
          <span className="w-6 h-px bg-gradient-to-l from-transparent to-[var(--color-rose-soft)]" />
        </motion.p>
      )}

      {title && (
        <h2
          className="
            font-display text-center
            text-[1.85rem] sm:text-3xl md:text-[2.15rem]
            text-[var(--color-text)] mb-3.5 tracking-tight leading-snug
          "
        >
          {titleWords ? (
            titleWords.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.045, duration: 0.45, ease: "easeOut" }}
              >
                {word}
                {i < titleWords.length - 1 ? "\u00A0" : ""}
              </motion.span>
            ))
          ) : (
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {title}
            </motion.span>
          )}
        </h2>
      )}

      {sub && (
        <motion.p
          className="
            text-center text-[var(--color-text-soft)]
            max-w-[28rem] mx-auto mb-11
            text-[0.98rem] leading-relaxed
          "
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16, duration: 0.5 }}
        >
          {sub}
        </motion.p>
      )}

      {children}
    </motion.section>
  );
}