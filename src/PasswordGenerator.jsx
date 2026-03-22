import { useState, useCallback, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════
// TRANSLATIONS — All strings managed from one place
// ═══════════════════════════════════════════════════════════

const translations = {
  en: {
    title: "Password Generator",
    subtitle: "Generate secure, random passwords",
    placeholder: "Click Generate to create a password",
    generate: "Generate",
    copy: "Copy",
    copied: "Copied!",
  },
  tr: {
    title: "Şifre Oluşturucu",
    subtitle: "Güvenli, rastgele şifreler oluştur",
    placeholder: "Şifre oluşturmak için Oluştur'a tıkla",
    generate: "Oluştur",
    copy: "Kopyala",
    copied: "Kopyalandı!",
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

  // Active language strings shortcut
  const txt = translations[lang];

  // Add/remove .dark class on <html> for CSS animations
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // ═══════════════════════════════════════════════════════════
  // THEME — Mono (21st.dev) dark & light
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
      };

  // ═══════════════════════════════════════════════════════════
  // PASSWORD GENERATION (random only for now)
  // ═══════════════════════════════════════════════════════════

  const generate = useCallback(() => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const len = 16;
    const newPw = Array.from({ length: len }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");

    // Rolling animation
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
  }, []);

  // Copy to clipboard
  const copy = useCallback(() => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [password]);

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
                {/* TR */}
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
                {/* EN */}
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

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 12,
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
      </div>

      {/* Google Fonts: Geist Mono */}
      <link
        href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}