import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";

// ═══════════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════════

const translations = {
  en: {
    title: "Password Generator",
    subtitle: "Generate secure, random passwords",
    placeholder: "Click Generate to create a password",
    generate: "Generate",
    copy: "Copy",
    copied: "Copied!",
    length: "Length",
    uppercase: "Uppercase",
    lowercase: "Lowercase",
    numbers: "Numbers",
    symbols: "Symbols",
    excludeSimilar: "Exclude similar",
    excludeSimilarHint: "0O1lI",
    mustContain: "Must contain",
    mustContainHint: "At least 1 of each",
    strength: {
      veryWeak: "Very Weak",
      weak: "Weak",
      fair: "Fair",
      strong: "Strong",
      veryStrong: "Very Strong",
    },
    crackTime: "Crack time",
    entropy: "Entropy",
    instant: "Instantly",
    seconds: "sec",
    minutes: "min",
    hours: "hours",
    days: "days",
    months: "months",
    years: "years",
    centuries: "centuries",
    kCenturies: "K centuries",
    beyondLifetime: "Beyond universe lifetime",
  },
  tr: {
    title: "Şifre Oluşturucu",
    subtitle: "Güvenli, rastgele şifreler oluştur",
    placeholder: "Şifre oluşturmak için Oluştur'a tıkla",
    generate: "Oluştur",
    copy: "Kopyala",
    copied: "Kopyalandı!",
    length: "Uzunluk",
    uppercase: "Büyük harf",
    lowercase: "Küçük harf",
    numbers: "Rakam",
    symbols: "Sembol",
    excludeSimilar: "Benzerleri çıkar",
    excludeSimilarHint: "0O1lI",
    mustContain: "Zorunlu içerik",
    mustContainHint: "Her birinden en az 1",
    strength: {
      veryWeak: "Çok Zayıf",
      weak: "Zayıf",
      fair: "Orta",
      strong: "Güçlü",
      veryStrong: "Çok Güçlü",
    },
    crackTime: "Kırılma süresi",
    entropy: "Entropi",
    instant: "Anında",
    seconds: "sn",
    minutes: "dk",
    hours: "saat",
    days: "gün",
    months: "ay",
    years: "yıl",
    centuries: "yüzyıl",
    kCenturies: "K yüzyıl",
    beyondLifetime: "Evrenin ömründen uzun",
  },
};

// ═══════════════════════════════════════════════════════════
// PASSWORD MODES
// ═══════════════════════════════════════════════════════════

const modes = [
  { key: "random", label: "Random" },
  { key: "pronounceable", label: "Pronounceable" },
  { key: "passphrase", label: "Passphrase" },
];

// ═══════════════════════════════════════════════════════════
// CHARSETS
// ═══════════════════════════════════════════════════════════

const CHARSETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  ambiguous: "0O1lI",
};

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

function calcEntropy(pw) {
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 33;
  return pool ? pw.length * Math.log2(pool) : 0;
}

function getCrackTime(ent, txt) {
  const s = Math.pow(2, ent) / 1e10;
  if (s < 0.001) return txt.instant;
  if (s < 1) return `< 1 ${txt.seconds}`;
  if (s < 60) return `${Math.round(s)} ${txt.seconds}`;
  if (s < 3600) return `${Math.round(s / 60)} ${txt.minutes}`;
  if (s < 86400) return `${Math.round(s / 3600)} ${txt.hours}`;
  if (s < 2592000) return `${Math.round(s / 86400)} ${txt.days}`;
  if (s < 31536000) return `${Math.round(s / 2592000)} ${txt.months}`;
  if (s < 3153600000) return `${Math.round(s / 31536000)} ${txt.years}`;
  if (s < 3.1536e13) return `${Math.round(s / 3153600000)} ${txt.centuries}`;
  if (s < 3.1536e16) return `${(s / 3.1536e13).toFixed(0)} ${txt.kCenturies}`;
  return txt.beyondLifetime;
}

function getStrength(ent, txt) {
  if (ent < 28) return { label: txt.strength.veryWeak, color: "#ef4444", pct: 10 };
  if (ent < 36) return { label: txt.strength.weak, color: "#f97316", pct: 25 };
  if (ent < 50) return { label: txt.strength.fair, color: "#eab308", pct: 50 };
  if (ent < 70) return { label: txt.strength.strong, color: "#22c55e", pct: 75 };
  return { label: txt.strength.veryStrong, color: "#059669", pct: 100 };
}

function generateRandom(len, opts) {
  let pool = "";
  const required = [];
  if (opts.upper) { pool += CHARSETS.upper; required.push(CHARSETS.upper); }
  if (opts.lower) { pool += CHARSETS.lower; required.push(CHARSETS.lower); }
  if (opts.numbers) { pool += CHARSETS.numbers; required.push(CHARSETS.numbers); }
  if (opts.symbols) { pool += CHARSETS.symbols; required.push(CHARSETS.symbols); }
  if (opts.excludeSimilar) {
    pool = [...pool].filter((c) => !CHARSETS.ambiguous.includes(c)).join("");
  }
  if (!pool) return "enable-at-least-one";

  let result;
  let attempts = 0;
  do {
    result = Array.from({ length: len }, () =>
      pool[Math.floor(Math.random() * pool.length)]
    ).join("");
    attempts++;
  } while (
    opts.mustContain &&
    required.length > 0 &&
    !required.every((s) => [...result].some((c) => s.includes(c))) &&
    attempts < 100
  );
  return result;
}

// ═══════════════════════════════════════════════════════════
// TOGGLE COMPONENT (defined outside to preserve animation)
// ═══════════════════════════════════════════════════════════

function Toggle({ on, onToggle, label, hint, theme }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 0",
      }}
    >
      <div>
        <span style={{ fontSize: 12, fontWeight: 500, color: theme.text }}>{label}</span>
        {hint && (
          <span
            style={{
              fontSize: 10,
              color: theme.mutedFg,
              marginLeft: 6,
              fontFamily: "inherit",
            }}
          >
            {hint}
          </span>
        )}
      </div>
      <button
        onClick={onToggle}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          background: on ? theme.toggleAccent : theme.muted,
          border: `1px solid ${on ? theme.toggleAccent : theme.border}`,
          cursor: "pointer",
          position: "relative",
          transition: "background 0.3s ease, border 0.3s ease",
          padding: 2,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: on ? "flex-end" : "flex-start",
        }}
      >
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
          }}
        />
      </button>
    </div>
  );
}

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

  // Password settings
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [mustContain, setMustContain] = useState(true);

  // Active language strings
  const txt = translations[lang];

  // Add/remove .dark class on <html>
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
        toggleAccent: "#FCA5A5",
      }
    : {
        bg: "#ffffff",
        cardBg: "#ffffff",
        cardFg: "#0a0a0a",
        border: "#e5e5e5",
        input: "#e5e5e5",
        muted: "#f5f5f5",
        mutedFg: "#737373",
        text: "#0a0a0a",
        accent: "#404040",
        accentFg: "#fafafa",
        toggleAccent: "#B91C1C",
      };

  // ═══════════════════════════════════════════════════════════
  // PASSWORD GENERATION
  // ═══════════════════════════════════════════════════════════

  const generate = useCallback(() => {
    const newPw = generateRandom(length, {
      upper,
      lower,
      numbers,
      symbols,
      excludeSimilar,
      mustContain,
    });

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
  }, [length, upper, lower, numbers, symbols, excludeSimilar, mustContain]);

  // Copy to clipboard
  const copy = useCallback(() => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [password]);

  // Strength calculations
  const ent = calcEntropy(password);
  const str = getStrength(ent, txt);
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
      }}
    >
      {/* Main Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          padding: "32px 24px",
          transition: "all 0.4s ease",
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

            {/* Language Toggle — Slide Animation */}
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

        {/* Password Display */}
        <div
          style={{
            marginTop: 20,
            padding: "16px",
            background: t.bg,
            border: `1px solid ${t.border}`,
            borderRadius: 6,
            minHeight: 52,
            display: "flex",
            alignItems: "center",
            transition: "all 0.4s ease",
          }}
        >
          <span
            style={{
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 500,
              color: animating ? t.mutedFg : t.text,
              wordBreak: "break-all",
              letterSpacing: "0.02em",
              lineHeight: 1.6,
              transition: "color 0.2s ease",
            }}
          >
            {displayPw || txt.placeholder}
          </span>
        </div>

        {/* Strength Bar */}
        {password && (
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: t.muted,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${str.pct}%`,
                  background: str.color,
                  borderRadius: 2,
                  transition: "all 0.5s ease",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
                fontSize: 10,
                color: t.mutedFg,
              }}
            >
              <span>
                <span style={{ color: str.color, fontWeight: 600 }}>{str.label}</span>
                {" · "}
                {txt.entropy}: {Math.round(ent)} bit
              </span>
              <span>
                {txt.crackTime}: {crack}
              </span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 16,
          }}
        >
          <button
            onClick={generate}
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
              transition: "all 0.4s ease",
            }}
          >
            {txt.generate}
          </button>
          <button
            onClick={copy}
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
              color: t.mutedFg,
              transition: "all 0.4s ease",
            }}
          >
            {copied ? txt.copied : txt.copy}
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: t.border, margin: "20px 0" }} />

        {/* Length Slider */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 500, color: t.text }}>
              {txt.length}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: t.text,
                fontFamily: "inherit",
              }}
            >
              {length}
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => setLength(+e.target.value)}
            style={{
              width: "100%",
              accentColor: t.toggleAccent,
              height: 4,
              cursor: "pointer",
            }}
          />
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: t.border, margin: "16px 0" }} />

        {/* Toggle Settings */}
        <div>
          <Toggle
            on={upper}
            onToggle={() => setUpper(!upper)}
            label={txt.uppercase}
            hint="A-Z"
            theme={t}
          />
          <Toggle
            on={lower}
            onToggle={() => setLower(!lower)}
            label={txt.lowercase}
            hint="a-z"
            theme={t}
          />
          <Toggle
            on={numbers}
            onToggle={() => setNumbers(!numbers)}
            label={txt.numbers}
            hint="0-9"
            theme={t}
          />
          <Toggle
            on={symbols}
            onToggle={() => setSymbols(!symbols)}
            label={txt.symbols}
            hint="!@#$"
            theme={t}
          />

          {/* Divider */}
          <div style={{ height: 1, background: t.border, margin: "8px 0" }} />

          <Toggle
            on={excludeSimilar}
            onToggle={() => setExcludeSimilar(!excludeSimilar)}
            label={txt.excludeSimilar}
            hint={txt.excludeSimilarHint}
            theme={t}
          />
          <Toggle
            on={mustContain}
            onToggle={() => setMustContain(!mustContain)}
            label={txt.mustContain}
            hint={txt.mustContainHint}
            theme={t}
          />
        </div>
      </div>

      {/* Google Fonts: Geist Mono */}
      <link
        href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}