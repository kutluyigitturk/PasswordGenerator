import { useState, useCallback, useRef, useEffect } from "react";
import { translations } from "./utils/translations";
import { calcEntropy, getCrackTime, getStrength, detectPatterns } from "./utils/strength";
import PasswordDisplay from "./components/PasswordDisplay";
import StrengthBar from "./components/StrengthBar";
import RandomMode from "./components/RandomMode";
import { generateRandom, generatePronounceable, generatePassphrase, isCommonPassword } from "./utils/generators";
import PronounceableMode from "./components/PronounceableMode";
import PassphraseMode from "./components/PassphraseMode";
import RecentSection from "./components/RecentSection";
import BGPattern from "./components/BGPattern";
import TestMode from "./components/TestMode";

// ═══════════════════════════════════════════════════════════
// PASSWORD MODES
// ═══════════════════════════════════════════════════════════

const modes = [
  { key: "random", label: "Random" },
  { key: "pronounceable", label: "Pronounceable" },
  { key: "passphrase", label: "Passphrase" },
  { key: "test", label: "Test" },
];

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export default function PasswordGenerator() {
  const [mode, setMode] = useState("random");
  const [password, setPassword] = useState("");
  const [displayPw, setDisplayPw] = useState("");
  const [copied, setCopied] = useState(false);
  const [animating, setAnimating] = useState(false);
  const animRef = useRef(null);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState("en");

  // Random mode settings
  const [randomSettings, setRandomSettings] = useState({
    length: 16,
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    mustContain: true,
  });

  const [pronounceableSettings, setPronounceableSettings] = useState({
    length: 12,
    capitalize: true,
    addNumbers: true,
  });

  const [passphraseSettings, setPassphraseSettings] = useState({
    wordCount: 4,
    separator: "-",
    capitalize: true,
    addNumber: true,
    lang: "en",
  });

  const [history, setHistory] = useState([]);
  const [testPassword, setTestPassword] = useState("");

  const txt = translations[lang];

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // ═══════════════════════════════════════════════════════════
  // THEME
  // ═══════════════════════════════════════════════════════════

  const t = isDark
    ? {
        bg: "#0a0a0a",
        cardBg: "#191919",
        cardFg: "#fafafa",
        border: "#262626",
        input: "#262626",
        muted: "#262626",
        mutedFg: "#a1a1a1",
        text: "#fafafa",
        accent: "#404040",
        accentFg: "#fafafa",
        toggleAccent: "#B91C1C",
      }
    : {
        bg: "#f5f5f4",
        cardBg: "#ffffff",
        cardFg: "#1a1a1a",
        border: "#e5e5e5",
        input: "#f0f0ef",
        muted: "#ececeb",
        mutedFg: "#737373",
        text: "#1a1a1a",
        accent: "#333333",
        accentFg: "#fafafa",
        toggleAccent: "#9b1313",
      };

  // ═══════════════════════════════════════════════════════════
  // PASSWORD GENERATION
  // ═══════════════════════════════════════════════════════════

  const generate = useCallback(() => {
    let newPw = "";

    if (mode === "random") {
      newPw = generateRandom(randomSettings.length, randomSettings);
    }
    if (mode === "pronounceable") {
      newPw = generatePronounceable(pronounceableSettings.length, pronounceableSettings);
    }
    if (mode === "passphrase") {
      newPw = generatePassphrase(passphraseSettings);
    }

    // Rolling animation
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    setAnimating(true);
    let frame = 0;
    const maxFrames = 10;
    if (animRef.current) clearInterval(animRef.current);

    animRef.current = setInterval(() => {
      frame++;
      if (frame >= maxFrames) {
        clearInterval(animRef.current);
        setDisplayPw(newPw);
        setPassword(newPw);
        setAnimating(false);

        // Add to history
        setHistory((h) => {
          const next = [{ pw: newPw, mode, time: Date.now() }, ...h];
          return next.slice(0, 50);
        });

        return;
      }
      const revealed = Math.floor((frame / maxFrames) * newPw.length);
      const scrambled =
        newPw.slice(0, revealed) +
        Array.from({ length: newPw.length - revealed }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ).join("");
      setDisplayPw(scrambled);
    }, 40);
  }, [mode, randomSettings, pronounceableSettings, passphraseSettings]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [password]);

  // Strength calculations — test mode uses user's typed password
  const activePassword = mode === "test" ? testPassword : password;
  const ent = calcEntropy(activePassword);
  const patterns = detectPatterns(activePassword);
  const str = getStrength(ent, txt, patterns);
  const crack = getCrackTime(ent, txt);

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "60px 16px",
        fontFamily: "'Geist Mono', monospace",
        color: t.text,
        transition: "background 0.4s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Dots Pattern */}
      <BGPattern
        size={24}
        fill={isDark ? "#333333" : "#c0c0c0"}
        isDark={isDark}
      />
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          padding: "32px 24px",
          transition: "all 0.4s ease",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                color: t.cardFg,
                fontFamily: "inherit",
              }}
            >
              {txt.title}
            </h1>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 12,
                color: t.mutedFg,
                fontFamily: "inherit",
              }}
            >
              {txt.subtitle}
            </p>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 6,
                border: `1px solid ${t.border}`,
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              title="Toggle theme"
            >
              <svg
                className="sun-and-moon"
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <mask className="moon" id="moon-mask">
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                  <circle cx="24" cy="10" r="6" fill="black" />
                </mask>
                <circle
                  className="sun"
                  cx="12"
                  cy="12"
                  r="6"
                  mask="url(#moon-mask)"
                  fill="currentColor"
                />
                <g
                  className="sun-beams"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </g>
              </svg>
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "tr" : "en")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 6,
                border: `1px solid ${t.border}`,
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
                color: t.mutedFg,
                transition: "all 0.3s ease",
              }}
              title="Toggle language"
            >
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    transition: "transform 0.3s ease-out",
                    transform: lang === "tr" ? "translateY(0)" : "translateY(-100%)",
                  }}
                >
                  TR
                </span>
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    transition: "transform 0.3s ease-out",
                    transform: lang === "tr" ? "translateY(100%)" : "translateY(0)",
                  }}
                >
                  EN
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mode Tabs */}
        <div
          style={{
            display: "flex",
            background: t.muted,
            borderRadius: 6,
            padding: 2,
            border: `1px solid ${t.border}`,
          }}
        >
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              style={{
                flex: 1,
                padding: "8px 0",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 500,
                fontFamily: "inherit",
                transition: "all 0.15s ease",
                background: mode === m.key ? t.accent : "transparent",
                color: mode === m.key ? t.accentFg : t.mutedFg,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Password Display — hidden in test mode */}
        {mode !== "test" && (
          <PasswordDisplay
            displayPw={displayPw}
            animating={animating}
            placeholder={txt.placeholder}
            theme={t}
          />
        )}

        {/* Strength Bar */}
        {activePassword && (
          <StrengthBar
            strength={str}
            entropy={ent}
            crackTime={crack}
            txt={txt}
            theme={t}
            patterns={patterns}
          />
        )}

        {/* Breach Warning — hidden in test mode (TestMode has its own) */}
        {mode !== "test" && password && isCommonPassword(password) && (
          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              background: isDark ? "#1c1008" : "#fef2f2",
              border: `1px solid ${isDark ? "#78350f" : "#fecaca"}`,
              borderRadius: 6,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>⚠️</span>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 12,
                  color: "#ef4444",
                  fontFamily: "inherit",
                }}
              >
                {txt.breachTitle}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: isDark ? "#fbbf24" : "#991b1b",
                  marginTop: 4,
                  lineHeight: 1.4,
                  fontFamily: "inherit",
                }}
              >
                {txt.breachMessage}
              </div>
            </div>
          </div>
        )}

        {/* Buttons — hidden in test mode */}
        {mode !== "test" && (
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button
              onClick={generate}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8";
                e.currentTarget.style.transform = "scale(0.97)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "scale(1)";
              }}
              style={{
                flex: 1,
                padding: "10px 0",
                border: `1px solid ${t.border}`,
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "inherit",
                background: t.cardFg,
                color: t.bg,
                transition: "all 0.2s ease",
              }}
            >
              {txt.generate}
            </button>
            <button
              onClick={copy}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = t.mutedFg;
                e.currentTarget.style.transform = "scale(0.97)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = t.border;
                e.currentTarget.style.transform = "scale(1)";
              }}
              style={{
                flex: 1,
                padding: "10px 0",
                border: `1px solid ${t.border}`,
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "inherit",
                background: "transparent",
                color: copied ? t.text : t.mutedFg,
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {/* Cross-fade icon animation */}
              <div
                style={{
                  position: "relative",
                  width: 14,
                  height: 14,
                  display: "inline-block",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    opacity: copied ? 0 : 1,
                    transform: copied ? "scale(0.6)" : "scale(1)",
                    transition: "opacity 150ms, transform 150ms",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    opacity: copied ? 1 : 0,
                    transform: copied ? "scale(1)" : "scale(0.6)",
                    transition: "opacity 400ms 150ms, transform 400ms 150ms",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
              {copied ? txt.copied : txt.copy}
            </button>
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: t.border, margin: "20px 0" }} />

        {/* Mode Settings */}
        {mode === "random" && (
          <RandomMode
            settings={randomSettings}
            setSettings={setRandomSettings}
            txt={txt}
            theme={t}
          />
        )}

        {mode === "pronounceable" && (
          <PronounceableMode
            settings={pronounceableSettings}
            setSettings={setPronounceableSettings}
            txt={txt}
            theme={t}
          />
        )}

        {mode === "passphrase" && (
          <PassphraseMode
            settings={passphraseSettings}
            setSettings={setPassphraseSettings}
            txt={txt}
            theme={t}
          />
        )}

        {mode === "test" && (
          <TestMode
            value={testPassword}
            onChange={setTestPassword}
            txt={txt}
            theme={t}
            isDark={isDark}
            onSave={(pw) => {
              setHistory((h) => {
                const next = [{ pw, mode: "test", time: Date.now() }, ...h];
                return next.slice(0, 50);
              });
            }}
          />
        )}

        {/* Divider */}
        <div style={{ height: 1, background: t.border, margin: "20px 0" }} />

        {/* Recent Section */}
        <RecentSection
          history={history}
          setHistory={setHistory}
          txt={txt}
          theme={t}
        />
      </div>

      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}