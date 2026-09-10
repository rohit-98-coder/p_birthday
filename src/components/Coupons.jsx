import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COUPONS } from "../data/content";
import Section from "./Section";

// A row of little scalloped notches along the ticket's perforation line,
// so it reads as torn-off rather than just a straight dashed rule.
function Perforation() {
  return (
    <span className="absolute left-14 top-0 bottom-0 w-px flex flex-col justify-between py-2 pointer-events-none">
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] h-[3px] rounded-full bg-[var(--color-rose-soft)]/80 -translate-x-1/2"
        />
      ))}
    </span>
  );
}

// Deterministic short serial per card index — reads like a real printed
// voucher number and stays stable across re-renders (no Math.random here).
function serialFor(i) {
  const n = (i * 7 + 118).toString(36).toUpperCase().padStart(3, "0");
  return `PB-${n}-22`;
}

export default function Coupons({ tone, showToast }) {
  const [redeemed, setRedeemed] = useState([]);

  const toggle = (i) => {
    setRedeemed((prev) => {
      if (prev.includes(i)) return prev.filter((x) => x !== i);
      tone?.(500, 0.2, 0, 0.07);
      showToast?.("saved — cash it in whenever, love");
      return [...prev, i];
    });
  };

  const count = redeemed.length;

  return (
    <Section
      id="coupons"
      eyebrow="step seven"
      title="Redeem anytime, no expiry"
      sub="Tap one to cash it in whenever you want it."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl mx-auto">
        {COUPONS.map((c, i) => {
          const isRedeemed = redeemed.includes(i);

          return (
            <motion.button
              key={i}
              onClick={() => toggle(i)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 130, damping: 18 }}
              whileHover={{ y: -6, rotate: -0.4 }}
              whileTap={{ scale: 0.97, rotate: 0 }}
              className={`
                group relative text-left cursor-pointer overflow-visible
                rounded-2xl bg-[var(--color-card)]
                transition-[box-shadow,filter] duration-300
                ${isRedeemed
                  ? "opacity-85 shadow-md"
                  : "shadow-md hover:shadow-2xl"
                }
              `}
              style={{
                filter: isRedeemed
                  ? "saturate(0.85)"
                  : "saturate(1)",
              }}
            >
              {/* ticket outline, dashed, drawn as a border so corners stay crisp */}
              <span className="absolute inset-0 rounded-2xl border-2 border-dashed border-[var(--color-rose-soft)] group-hover:border-[var(--color-rose)]/50 transition-colors duration-300 pointer-events-none" />

              {/* notches cut from the ticket edge */}
              <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--color-bg)] border-2 border-dashed border-[var(--color-rose-soft)] z-10" />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-[var(--color-bg)] border-2 border-dashed border-[var(--color-rose-soft)] z-10" />

              {/* foil corner seal — a small triangular fold, like an embossed voucher corner */}
              <span
                className="absolute top-0 right-0 w-7 h-7 rounded-tr-2xl pointer-events-none z-10"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-gold-bright) 0%, var(--color-gold) 55%, transparent 60%)",
                  clipPath: "polygon(100% 0, 100% 100%, 0 0)",
                  opacity: 0.85,
                }}
              />

              <Perforation />

              <div className="flex items-stretch min-h-[100px] rounded-2xl overflow-hidden">
                <div className="w-14 flex-none flex items-center justify-center text-3xl select-none">
                  <motion.span
                    animate={isRedeemed ? { scale: [1, 1.2, 1], rotate: [0, -10, 0] } : { y: [0, -2, 0] }}
                    transition={
                      isRedeemed
                        ? { duration: 0.45 }
                        : { duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
                    }
                  >
                    {c.emoji}
                  </motion.span>
                </div>

                <div className="flex-1 py-4 pr-5 pl-3 flex flex-col justify-center">
                  <div className="font-bold text-sm text-[var(--color-text)] mb-0.5 leading-snug">
                    {c.title}
                  </div>
                  <div className="text-xs text-[var(--color-text-soft)] leading-snug">
                    {c.sub}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[var(--color-rose)]/70">
                      no expiry · just for you
                    </span>
                    <span className="text-[0.55rem] font-mono tracking-wider text-[var(--color-text-soft)]/60 select-none">
                      {serialFor(i)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute top-0 left-16 right-4 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-rose-soft)] to-transparent opacity-70" />

              {/* rubber-stamp style redeemed mark, now with a slightly inked/uneven feel */}
              <AnimatePresence>
                {isRedeemed && (
                  <motion.span
                    initial={{ opacity: 0, scale: 2, rotate: -6 }}
                    animate={{ opacity: 1, scale: 1, rotate: -12 }}
                    exit={{ opacity: 0, scale: 1.4 }}
                    transition={{ type: "spring", stiffness: 260, damping: 14 }}
                    className="
                      absolute top-2.5 right-3
                      border-[2.5px] border-[var(--color-rose)]
                      text-[var(--color-rose)] text-[0.6rem] font-extrabold tracking-wider
                      px-2 py-0.5 rounded uppercase
                      bg-[var(--color-card)]/70
                    "
                    style={{
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.02)",
                      textShadow: "0.5px 0.5px 0 currentColor",
                      filter: "saturate(1.1)",
                    }}
                  >
                    redeemed
                  </motion.span>
                )}
              </AnimatePresence>

              {/* diagonal shine sweep on hover, only while unredeemed */}
              {!isRedeemed && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full overflow-hidden"
                  style={{ transitionProperty: "transform, opacity", transitionDuration: "0.65s" }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.p
        className="text-center text-sm text-[var(--color-text-soft)] mt-7 tracking-wide"
        key={count}
        initial={{ opacity: 0.5, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {count === 0
          ? "pick a coupon whenever you like"
          : count === COUPONS.length
          ? "all coupons saved — use them anytime 💕"
          : `${count} of ${COUPONS.length} saved`}
      </motion.p>
    </Section>
  );
}