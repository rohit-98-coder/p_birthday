import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Cover from "./components/Cover";
import TopControls from "./components/TopControls";
import Hero from "./components/Hero";
import Cake from "./components/Cake";
import Reasons from "./components/Reasons";
import Timeline from "./components/Timeline";
import Photos from "./components/Photos";
import Letter from "./components/Letter";
import BucketList from "./components/BucketList";
import Coupons from "./components/Coupons";
import ComfortCards from "./components/ComfortCards";
import Quiz from "./components/Quiz";
import WishJar from "./components/WishJar";
import SecretLock from "./components/SecretLock";
import Footer from "./components/Footer";
import SurpriseFab from "./components/SurpriseFab";
import Toast from "./components/Toast";
import Ambience from "./components/Ambience";
import Divider from "./components/Divider";
import { useSound } from "./hooks/useSound";

const SONG_SRC = "/audio/ucha-lamba-kad.mp3";

export default function App() {
  const [opened, setOpened] = useState(false);
  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState("");
  const [progress, setProgress] = useState(0);
  const sound = useSound();
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  }, []);

  const openGift = () => {
    sound.chime();
    setOpened(true);
    // let the reveal settle before the birthday tune plays
    setTimeout(() => sound.playHappyBirthday?.(), 500);
  };

  // Side effects belong in effects, not render.
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Gentle scroll progress once the gift is opened — gives the page
  // a sense of "how far through the celebration" without a generic loading bar feel.
  useEffect(() => {
    if (!opened) return;
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(1, scrolled / max) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [opened]);

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: dark
          ? "radial-gradient(circle at 12% 6%, #241019 0%, transparent 42%), radial-gradient(circle at 92% 14%, #3d3020 0%, transparent 38%), #150810"
          : "radial-gradient(circle at 12% 6%, #ffe3ec 0%, transparent 42%), radial-gradient(circle at 92% 14%, #f4e2b0 0%, transparent 38%), radial-gradient(circle at 15% 92%, #e6dcf7 0%, transparent 42%), #fdf5f3",
        backgroundAttachment: "fixed",
      }}
    >
      <Ambience />

      {opened && (
        <div
          className="fixed top-0 left-0 h-[3px] z-50 origin-left"
          style={{
            width: "100%",
            background: "linear-gradient(90deg, var(--color-rose), var(--color-rose-mid))",
            transform: `scaleX(${progress})`,
            transformOrigin: "left",
            transition: "transform 0.15s linear",
          }}
        />
      )}

      <TopControls
        dark={dark}
        setDark={setDark}
        soundOn={sound.soundOn}
        setSoundOn={sound.setSoundOn}
        musicOn={sound.songPlaying}
        toggleMusic={() => sound.toggleSong(SONG_SRC)}
      />

      <AnimatePresence>
        {!opened && <Cover key="cover" onOpen={openGift} />}
      </AnimatePresence>

      <AnimatePresence>
        {opened && (
          <motion.main
            key="main"
            className="relative z-10 pb-16"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Hero />
            <Divider />
            <Cake chime={sound.chime} chimeBig={sound.chimeBig} tone={sound.tone} />
            <Divider />
            <Reasons chime={sound.chime} chimeBig={sound.chimeBig} />
            <Divider />
            <Timeline />
            <Divider />
            <Photos />
            <Divider />
            <Letter />
            <Divider />
            <BucketList tone={sound.tone} />
            <Divider />
            <Coupons tone={sound.tone} showToast={showToast} />
            <Divider />
            <ComfortCards tone={sound.tone} />
            <Divider />
            <Quiz tone={sound.tone} chimeBig={sound.chimeBig} />
            <Divider />
            <WishJar tone={sound.tone} />
            <Divider />
            <SecretLock chimeBig={sound.chimeBig} tone={sound.tone} />
            <Footer chime={sound.chime} />
          </motion.main>
        )}
      </AnimatePresence>

      {opened && <SurpriseFab chime={sound.chime} />}
      <Toast message={toast} />
    </div>
  );
}