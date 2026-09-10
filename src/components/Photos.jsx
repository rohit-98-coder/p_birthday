import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { PHOTOS } from "../data/content";
import Section from "./Section";

const AUTO_ADVANCE_MS = 5000;

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

export default function Photos() {
  const [[index, dir], setSlide] = useState([0, 0]);
  const [lightbox, setLightbox] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const hasPhotos = PHOTOS.length > 0 && PHOTOS[0].src && !PHOTOS[0].src.includes("placeholder");

  const go = (d) => {
    setSlide(([i]) => [(i + d + PHOTOS.length) % PHOTOS.length, d]);
    setProgressKey((k) => k + 1);
  };

  // auto-advance
  useEffect(() => {
    if (lightbox || PHOTOS.length <= 1) return;
    const id = setInterval(() => go(1), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, progressKey]);

  // keyboard nav while lightbox is open
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox]);

  const current = PHOTOS[index];

  return (
    <Section
      id="photos"
      eyebrow="step four"
      title="A few of my favorite moments"
      sub="Tap the photo to see it up close. Add more in /public/photos/"
    >
      <div className="relative max-w-sm mx-auto select-none">
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square cursor-zoom-in ring-8 ring-[var(--color-card)] ring-offset-2 ring-offset-[var(--color-rose-soft)]"
          onClick={() => setLightbox(true)}
        >
          {hasPhotos ? (
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={index}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
                className="absolute inset-0"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onClick={(e) => e.stopPropagation()}
                onTap={() => setLightbox(true)}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                }}
              >
                <motion.img
                  layoutId={`photo-${index}`}
                  src={current.src}
                  alt={current.alt}
                  className="w-full h-full object-cover pointer-events-none"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="hidden absolute inset-0 bg-gradient-to-br from-[var(--color-rose-soft)] to-[var(--color-gold-soft)] items-center justify-center flex-col gap-2">
                  <span className="text-5xl">📷</span>
                  <span className="text-sm text-[var(--color-text-soft)]">Add photo here</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 pt-8 pb-3.5 px-4 bg-gradient-to-t from-black/55 to-transparent">
                  <p className="font-script text-xl text-white text-center">{current.caption}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            /* Placeholder when no real photos yet */
            <div className="w-full h-full bg-gradient-to-br from-[var(--color-rose-soft)] via-[#f8cfdd] to-[var(--color-gold-soft)] flex flex-col items-center justify-center gap-3">
              <span className="text-6xl">📷</span>
              <p className="font-script text-2xl text-[var(--color-rose-deep)]">Your photos here</p>
              <p className="text-xs text-[var(--color-text-soft)] max-w-[200px] text-center leading-relaxed">
                Drop images into <code className="bg-white/50 px-1 rounded">public/photos/</code> and update <code className="bg-white/50 px-1 rounded">src/data/content.js</code>
              </p>
            </div>
          )}
        </div>

        {PHOTOS.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm text-[var(--color-rose)] shadow-md flex items-center justify-center cursor-pointer border-0 hover:scale-110 active:scale-95 transition"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); go(1); }}
              className="absolute top-1/2 -translate-y-1/2 -right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm text-[var(--color-rose)] shadow-md flex items-center justify-center cursor-pointer border-0 hover:scale-110 active:scale-95 transition"
            >
              <FiChevronRight size={20} />
            </button>
          </>
        )}

        {/* dots double as a fill-progress indicator for the active slide */}
        <div className="flex justify-center gap-2 mt-4">
          {PHOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide([i, i > index ? 1 : -1])}
              className="relative w-6 h-1.5 rounded-full bg-[var(--color-rose-soft)] overflow-hidden border-0 cursor-pointer"
              aria-label={`Go to photo ${i + 1}`}
            >
              {i === index && !lightbox && (
                <motion.span
                  key={progressKey}
                  className="absolute inset-0 bg-[var(--color-rose)] rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                />
              )}
              {i === index && lightbox && (
                <span className="absolute inset-0 bg-[var(--color-rose)] rounded-full" />
              )}
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-[var(--color-text-soft)] mt-3">
          swipe or tap the photo to zoom ↑
        </p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[97] bg-black/90 flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute top-5 right-6 text-white text-2xl bg-transparent border-0 cursor-pointer"
              onClick={() => setLightbox(false)}
              aria-label="Close"
            >
              <FiX />
            </button>

            {hasPhotos ? (
              <>
                {PHOTOS.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); go(-1); }}
                    className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center border-0 cursor-pointer hover:bg-white/20 transition"
                    aria-label="Previous"
                  >
                    <FiChevronLeft size={22} />
                  </button>
                )}

                <motion.img
                  layoutId={`photo-${index}`}
                  src={current.src}
                  alt={current.alt}
                  className="max-w-[92vw] max-h-[78vh] rounded-2xl shadow-2xl object-contain"
                  onClick={(e) => e.stopPropagation()}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -60) go(1);
                    else if (info.offset.x > 60) go(-1);
                  }}
                />

                {PHOTOS.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); go(1); }}
                    className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center border-0 cursor-pointer hover:bg-white/20 transition"
                    aria-label="Next"
                  >
                    <FiChevronRight size={22} />
                  </button>
                )}

                <motion.p
                  key={`cap-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-script text-2xl text-white mt-4 text-center"
                >
                  {current.caption}
                </motion.p>
              </>
            ) : (
              <p className="text-white/70 font-script text-2xl">Add your photos to see them here 📷</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}