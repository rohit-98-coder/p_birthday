import { useRef, useCallback, useState, useEffect } from "react";

// Simple decaying-noise impulse response for a soft room reverb.
function makeImpulse(ctx, duration = 2.2, decay = 2.6) {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * duration);
  const impulse = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

export function useSound() {
  const ctxRef = useRef(null);
  const busRef = useRef(null); // { master, dry, wet, convolver }
  const [soundOn, setSoundOn] = useState(true);
  const [musicOn, setMusicOn] = useState(false);
  const musicTimer = useRef(null);
  const chordIdx = useRef(0);

  // --- Song (mp3) playback state ---
  const songRef = useRef(null); // HTMLAudioElement instance
  const [songPlaying, setSongPlaying] = useState(false);
  const [songVolume, setSongVolumeState] = useState(1);

  const ensure = useCallback(() => {
    if (!ctxRef.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const master = ctx.createGain();
      master.gain.value = 0.9;
      const dry = ctx.createGain();
      dry.gain.value = 1;
      const wet = ctx.createGain();
      wet.gain.value = 0.16;
      const convolver = ctx.createConvolver();
      convolver.buffer = makeImpulse(ctx);
      dry.connect(master);
      convolver.connect(wet).connect(master);
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      busRef.current = { master, dry, wet, convolver };
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  // Core oscillator voice — now routes through the reverb send too.
  const tone = useCallback(
    (freq, dur = 0.2, delay = 0, gain = 0.1, opts = {}) => {
      if (!soundOn) return;
      const ctx = ensure();
      const { dry, convolver } = busRef.current;
      const { type = "sine", detune = 0 } = opts;
      const t0 = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = detune;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(gain, t0 + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g);
      g.connect(dry);
      g.connect(convolver);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    },
    [soundOn, ensure]
  );

  // Bell-like note: fundamental (triangle) + sub for warmth + octave shimmer.
  const note = useCallback(
    (freq, dur = 0.4, delay = 0, gain = 0.12) => {
      tone(freq, dur, delay, gain, { type: "triangle" });
      tone(freq * 2, dur * 0.5, delay, gain * 0.22, { type: "sine" });
      tone(freq * 0.5, dur * 1.15, delay, gain * 0.16, { type: "sine" });
    },
    [tone]
  );

  const chime = useCallback(() => {
    note(880, 0.22, 0, 0.1);
    note(1174, 0.28, 0.09, 0.09);
  }, [note]);

  const chimeBig = useCallback(() => {
    [523.25, 659.25, 784.0, 1046.5].forEach((f, i) =>
      note(f, 0.4, i * 0.13, 0.1)
    );
  }, [note]);

  // Soft pad voice for background music: three detuned triangles through a lowpass.
  const pad = useCallback(
    (freq, dur = 2.6, delay = 0, gain = 0.03) => {
      if (!soundOn) return;
      const ctx = ensure();
      const { dry, convolver } = busRef.current;
      const t0 = ctx.currentTime + delay;
      [0, 7, -7].forEach((detune) => {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = freq;
        osc.detune.value = detune;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1600;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(gain, t0 + dur * 0.35);
        g.gain.linearRampToValueAtTime(0, t0 + dur);
        osc.connect(filter).connect(g);
        g.connect(dry);
        g.connect(convolver);
        osc.start(t0);
        osc.stop(t0 + dur + 0.1);
      });
    },
    [soundOn, ensure]
  );

  const chords = [
    [261.63, 329.63, 392.0],
    [246.94, 311.13, 369.99],
    [220.0, 277.18, 329.63],
    [233.08, 293.66, 349.23],
  ];

  const playChord = useCallback(() => {
    if (!musicOn) return;
    ensure();
    const chord = chords[chordIdx.current % chords.length];
    chordIdx.current++;
    chord.forEach((f, i) => pad(f, 2.8, i * 0.08, 0.03));
    musicTimer.current = setTimeout(playChord, 2400);
  }, [musicOn, pad, ensure]);

  const toggleMusic = useCallback(() => {
    setMusicOn((prev) => {
      if (!prev) {
        ensure();
        setTimeout(playChord, 50);
      } else {
        clearTimeout(musicTimer.current);
      }
      return !prev;
    });
  }, [ensure, playChord]);

  useEffect(() => () => clearTimeout(musicTimer.current), []);

  // "Happy Birthday to You" melody (public domain), played as bell notes.
  const playHappyBirthday = useCallback(
    (onDone) => {
      const G4 = 392.0, A4 = 440.0, B4 = 493.88, C5 = 523.25,
        D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99;

      const beat = 0.5; // seconds per quarter note
      const phrase = [
        [G4, 0.75], [G4, 0.25], [A4, 1], [G4, 1], [C5, 1], [B4, 2],
        [G4, 0.75], [G4, 0.25], [A4, 1], [G4, 1], [D5, 1], [C5, 2],
        [G4, 0.75], [G4, 0.25], [G5, 1], [E5, 1], [C5, 1], [B4, 1], [A4, 2],
        [F5, 0.75], [F5, 0.25], [E5, 1], [C5, 1], [D5, 1], [C5, 2],
      ];

      let t = 0;
      phrase.forEach(([freq, beats]) => {
        const dur = beats * beat;
        note(freq, dur * 0.92, t, 0.13);
        t += dur;
      });

      if (onDone) setTimeout(onDone, t * 1000 + 200);
      return t;
    },
    [note]
  );

  // --- Song controls (plays an mp3 file, e.g. "/audio/ucha-lamba-kad.mp3") ---

  const getSongEl = useCallback((src) => {
    if (!songRef.current) {
      const el = new Audio();
      el.preload = "auto";
      el.volume = songVolume;
      el.addEventListener("ended", () => setSongPlaying(false));
      el.addEventListener("pause", () => setSongPlaying(false));
      el.addEventListener("play", () => setSongPlaying(true));
      songRef.current = el;
    }
    if (src && songRef.current.getAttribute("data-src") !== src) {
      songRef.current.src = src;
      songRef.current.setAttribute("data-src", src);
    }
    return songRef.current;
  }, [songVolume]);

  const playSong = useCallback(
    (src) => {
      if (!soundOn) return;
      const el = getSongEl(src);
      el.play().catch(() => {
        // Autoplay can be blocked until a user gesture; caller can retry
        // playSong() from a click handler if this rejects.
      });
    },
    [soundOn, getSongEl]
  );

  const pauseSong = useCallback(() => {
    if (songRef.current) songRef.current.pause();
  }, []);

  const stopSong = useCallback(() => {
    if (songRef.current) {
      songRef.current.pause();
      songRef.current.currentTime = 0;
      setSongPlaying(false);
    }
  }, []);

  const toggleSong = useCallback(
    (src) => {
      const el = getSongEl(src);
      if (el.paused) {
        playSong(src);
      } else {
        pauseSong();
      }
    },
    [getSongEl, playSong, pauseSong]
  );

  const setSongVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(1, v));
    setSongVolumeState(clamped);
    if (songRef.current) songRef.current.volume = clamped;
  }, []);

  // Pause the song if the user mutes sound globally.
  useEffect(() => {
    if (!soundOn && songRef.current) songRef.current.pause();
  }, [soundOn]);

  // Clean up the audio element on unmount.
  useEffect(() => {
    return () => {
      if (songRef.current) {
        songRef.current.pause();
        songRef.current.src = "";
      }
    };
  }, []);

  return {
    soundOn,
    setSoundOn,
    musicOn,
    toggleMusic,
    tone,
    chime,
    chimeBig,
    playHappyBirthday,
    // song controls
    songPlaying,
    playSong,
    pauseSong,
    stopSong,
    toggleSong,
    songVolume,
    setSongVolume,
  };
}