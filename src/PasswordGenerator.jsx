import { useState, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════
// TEMA — Mono (21st.dev) dark mode, teal accent
// ═══════════════════════════════════════════════════════════

const t = {
  bg: "#0a0a0a",              // --background
  cardBg: "#191919",           // --card
  cardFg: "#fafafa",           // --card-foreground
  border: "#262626",           // ince, neredeyse görünmez border
  input: "#262626",            // --input alanları
  muted: "#262626",            // --muted arka plan
  mutedFg: "#a1a1a1",          // --muted-foreground
  text: "#fafafa",             // --foreground
  accent: "#404040",           // Teal accent
  accentFg: "#fafafa",
  primary: "#737373",          // --primary (gri)
  primaryFg: "#fafafa",        // --primary-foreground
  secondary: "#262626",        // --secondary
  secondaryFg: "#fafafa",      // --secondary-foreground
};

// Üretim modları
const modes = [
  { key: "random", label: "Random" },
  { key: "pronounceable", label: "Pronounceable" },
  { key: "passphrase", label: "Passphrase" },
];

export default function PasswordGenerator() {
  const [mode, setMode] = useState("random");
  const [password, setPassword] = useState("");
  const [displayPw, setDisplayPw] = useState("");
  const [copied, setCopied] = useState(false);
  const [animating, setAnimating] = useState(false);
  const animRef = useRef(null);

  // Şifre üretme fonksiyonu (şimdilik sadece random)
  const generate = useCallback(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const len = 16;
    const newPw = Array.from({ length: len }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");

    // Rolling animasyon
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
      // Her frame'de biraz daha fazla gerçek karakter göster
      const revealed = Math.floor((frame / maxFrames) * newPw.length);
      const scrambled =
        newPw.slice(0, revealed) +
        Array.from({ length: newPw.length - revealed }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ).join("");
      setDisplayPw(scrambled);
    }, 40);
  }, []);

  // Kopyalama fonksiyonu
  const copy = useCallback(() => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [password]);

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
      }}
    >
      {/* ── Ana Kart ── */}
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          padding: "32px 24px",
        }}
      >
        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              color: t.cardFg,
              fontFamily: "inherit",
            }}
          >
            Password Generator
          </h1>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 12,
              color: t.mutedFg,
              fontFamily: "inherit",
            }}
          >
            Generate secure, random passwords
          </p>
        </div>

        {/* ── Mod Sekmeleri ── */}
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

        {/* ── Şifre Gösterim Kutusu ── */}
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
            {displayPw || "Click Generate to create a password"}
          </span>
        </div>

        {/* ── Butonlar ── */}
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
              transition: "opacity 0.15s ease",
            }}
          >
            Generate
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
              transition: "all 0.15s ease",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* ── Geist Mono Font ── */}
      <link
        href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}