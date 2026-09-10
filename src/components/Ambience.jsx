import { useEffect, useState } from "react";

const SYMBOLS = [
  "🎈", "✨", "♡", "🎉", "❀", "💫", "🌸", "🌟", "💖", "☁️", "🌿", "🍃", "🦋", "✦", "✩",
];

export default function Ambience() {
  const [petals, setPetals] = useState([]);
  const [orbs, setOrbs] = useState([]);

  useEffect(() => {
    // Floating symbols
    const count = 26;
    const next = Array.from({ length: count }, (_, i) => {
      const layerRoll = Math.random();
      const layer = layerRoll > 0.62 ? "front" : layerRoll > 0.32 ? "mid" : "back";
      return {
        id: i,
        left: Math.random() * 94 + 3,
        dx: Math.floor(Math.random() * 180 - 90),
        dur: 10 + Math.random() * 14,
        delay: Math.random() * 12,
        size: +(0.75 + Math.random() * 1.55).toFixed(2),
        sym: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        hue: Math.round(330 + Math.random() * 50), // rose / pink / soft gold range
        opacity: +(0.35 + Math.random() * 0.5).toFixed(2),
        sway: +(4 + Math.random() * 7).toFixed(2),
        spin: +(12 + Math.random() * 28).toFixed(2),
        layer,
      };
    });
    setPetals(next);

    // Soft glowing orbs (background depth)
    const orbCount = 7;
    const nextOrbs = Array.from({ length: orbCount }, (_, i) => ({
      id: i,
      left: Math.random() * 80 + 10,
      top: Math.random() * 70 + 10,
      size: 80 + Math.random() * 160,
      dur: 14 + Math.random() * 12,
      delay: Math.random() * 6,
      hue: Math.random() > 0.5 ? 340 : 40, // rose or soft gold
      opacity: 0.12 + Math.random() * 0.14,
    }));
    setOrbs(nextOrbs);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden>
      {/* Soft ambient orbs */}
      {orbs.map((o) => (
        <span
          key={`orb-${o.id}`}
          className="absolute rounded-full ambience-orb"
          style={{
            left: `${o.left}%`,
            top: `${o.top}%`,
            width: o.size,
            height: o.size,
            background: `radial-gradient(circle, hsl(${o.hue} 80% 75% / ${o.opacity}) 0%, transparent 70%)`,
            animation: `orbPulse ${o.dur}s ease-in-out ${o.delay}s infinite`,
          }}
        />
      ))}

      {/* Floating petals / symbols */}
      {petals.map((p) => (
        <span
          key={p.id}
          className={`absolute bottom-[-14%] select-none ambience-petal ${p.layer}`}
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}rem`,
            animation: `floatUp ${p.dur}s linear ${p.delay}s infinite`,
            ["--dx"]: `${p.dx}px`,
            ["--h"]: p.hue,
            ["--opacity"]: p.opacity,
            ["--sway"]: `${p.sway}s`,
            ["--spin"]: `${p.spin}s`,
            ["--delay"]: `${p.delay}s`,
          }}
        >
          <span className="petal-inner">{p.sym}</span>
        </span>
      ))}

      <style>{`
        /* ── Orbs ── */
        .ambience-orb {
          will-change: transform, opacity;
          filter: blur(2px);
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.7; }
          40% { transform: scale(1.18) translate(8px, -12px); opacity: 1; }
          70% { transform: scale(0.94) translate(-6px, 6px); opacity: 0.85; }
        }

        /* ── Petals ── */
        .ambience-petal {
          will-change: transform, opacity;
          display: block;
          opacity: 0;
          transform-origin: 50% 100%;
        }
        .ambience-petal.front {
          filter: drop-shadow(0 8px 20px rgba(184, 38, 90, 0.18));
          z-index: 3;
        }
        .ambience-petal.mid {
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
          z-index: 2;
        }
        .ambience-petal.back {
          filter: blur(0.7px) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.06));
          z-index: 1;
          opacity: 0.7;
        }

        .petal-inner {
          display: inline-block;
          color: hsl(var(--h) 75% 68%);
          text-shadow:
            0 0 12px hsl(var(--h) 90% 80% / 0.45),
            0 6px 16px rgba(0, 0, 0, 0.1);
          animation:
            sway var(--sway) ease-in-out var(--delay) infinite alternate,
            spin var(--spin) linear var(--delay) infinite;
        }

        /* Dark mode softer glow */
        .dark .petal-inner {
          text-shadow:
            0 0 16px hsl(var(--h) 90% 70% / 0.55),
            0 4px 12px rgba(0, 0, 0, 0.35);
        }
        .dark .ambience-orb {
          filter: blur(4px);
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(0.9);
            opacity: 0;
          }
          5% { opacity: var(--opacity); }
          25% {
            transform: translateY(-22vh) translateX(calc(var(--dx) * 0.25)) rotate(50deg) scale(1);
          }
          55% {
            transform: translateY(-58vh) translateX(calc(var(--dx) * 0.65)) rotate(180deg) scale(1.05);
          }
          80% { opacity: calc(var(--opacity) * 0.55); }
          100% {
            transform: translateY(-128vh) translateX(var(--dx)) rotate(360deg) scale(0.95);
            opacity: 0;
          }
        }

        @keyframes sway {
          0% { transform: translateX(0) rotate(-4deg); }
          100% { transform: translateX(calc(var(--dx) * 0.35)) rotate(6deg); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Layer scale */
        .ambience-petal.front { --scale: 1.08; }
        .ambience-petal.mid { --scale: 1; }
        .ambience-petal.back { --scale: 0.88; }
      `}</style>
    </div>
  );
}