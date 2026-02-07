import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

/* 🎨 GAME BACKGROUNDS */
const COLORS = [
  "linear-gradient(135deg, #ff9a9e, #fad0c4)",
  "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
  "linear-gradient(135deg, #84fab0, #8fd3f4)",
  "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
  "linear-gradient(135deg, #fccb90, #d57eeb)",
  "linear-gradient(135deg, #89f7fe, #66a6ff)",
  "linear-gradient(135deg, #43e97b, #38f9d7)",
  "linear-gradient(135deg, #fa709a, #fee140)",
];

const BUTTON_TEXTS = [
  "Click me 💗",
  "Not yet 😛",
  "Almost there 👀",
  "Try again 😈",
  "Okay okay 😌",
];

/* 💖 HEARTS – ONLY FOR REVEAL */
function HeartsBackground() {
  return (
    <div className="hearts-bg">
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          className="heart"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
            fontSize: `${14 + Math.random() * 22}px`,
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}

export default function UnlockNote({ noteFromLink }) {
  const outletContext = useOutletContext?.();
  const unlockedNote = noteFromLink || outletContext?.unlockedNote;

  const navigate = useNavigate();

  const [stage, setStage] = useState("game");
  const [tries, setTries] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [bg, setBg] = useState(COLORS[0]);

  if (!unlockedNote) return null;

  const moveButton = () => {
    if (tries === 4) {
      setStage("transition");
      setTimeout(() => setStage("reveal"), 1400);
      return;
    }

    setTries((t) => t + 1);
    setPos({
      x: Math.random() * 70 + 10,
      y: Math.random() * 75 + 5,
    });

    setBg((prev) => {
      let next = prev;
      while (next === prev) {
        next = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      return next;
    });
  };

  /* 💖 TRANSITION (NO HEARTS, DARK PINK) */
  if (stage === "transition") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-600 via-rose-600 to-purple-700">
        <div className="text-center animate-pulse">
          <div className="text-7xl mb-6 drop-shadow-lg">💖</div>
          <p className="text-white text-xl tracking-wide">
            Unlocking something special…
          </p>
        </div>
      </div>
    );
  }

  /* 💌 REVEAL (HEARTS START HERE) */
  if (stage === "reveal") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <HeartsBackground />

        <div className="relative z-10 max-w-md w-full">
          {/* glow */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-pink-400 blur-3xl opacity-40" />

          {/* card */}
          <div className="relative bg-white/85 backdrop-blur-xl rounded-[2.5rem] p-8 text-center shadow-2xl animate-noteReveal">
            <div className="text-4xl mb-4">💌</div>

            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
              From
            </p>
            <p className="text-sm font-medium text-gray-700 mb-4">
              {unlockedNote.from}
            </p>

            <h1 className="text-3xl font-bold mb-6">
              To {unlockedNote.to}
            </h1>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              “{unlockedNote.note}”
            </p>

            <button
              onClick={() => navigate("/home")}
              className="absolute top-6 left-6 text-gray-400 hover:text-black transition-colors duration-300 text-2xl"
              aria-label="Back to home"
            >
              ←
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* 🎮 GAME (NO HEARTS) */
  return (
    <div
      className="fixed inset-0 z-50 transition-all duration-500"
      style={{ background: bg }}
    >
      <button
        onClick={moveButton}
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
        }}
        className="absolute px-6 py-3 rounded-full bg-white text-black font-medium transition-all duration-300 hover:scale-110"
      >
        {BUTTON_TEXTS[tries]}
      </button>
    </div>
  );
}
