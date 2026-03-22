import { useState } from "react";

// ═══════════════════════════════════════════════════════════
// ADIM 1: Arka Plan & Tema Sistemi
// ═══════════════════════════════════════════════════════════

// Tema renkleri — tüm renkler burada tanımlı, değiştirmesi kolay
const themes = {
  dark: {
    bg: "#0a0e17",           // Sayfa arka planı
    cardBg: "#111827",       // Kart arka planı
    cardBorder: "#1e293b",   // Kart çerçeve rengi
    text: "#f1f5f9",         // Ana metin rengi
    textMuted: "#64748b",    // Soluk metin rengi
    accent: "#14b8a6",       // Vurgu rengi (teal)
    accentGlow: "rgba(20, 184, 166, 0.15)", // Vurgu glow efekti
  },
  light: {
    bg: "#f1f5f9",
    cardBg: "#ffffff",
    cardBorder: "#e2e8f0",
    text: "#0f172a",
    textMuted: "#64748b",
    accent: "#0d9488",
    accentGlow: "rgba(13, 148, 136, 0.1)",
  },
};

export default function PasswordGenerator() {
  // Dark tema varsayılan olarak açık
  const [isDark, setIsDark] = useState(true);

  // Aktif temayı seç
  const t = isDark ? themes.dark : themes.light;

  return (
    // ── Sayfa Arka Planı ──
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "60px 16px",
        transition: "background 0.4s ease",
      }}
    >
      {/* ── Ana Kart ── */}
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          borderRadius: 16,
          padding: "32px 28px",
          boxShadow: `0 4px 24px rgba(0, 0, 0, ${isDark ? 0.4 : 0.08})`,
          transition: "all 0.4s ease",
        }}
      >
        {/* ── Header: Başlık + Tema Toggle ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* Sol: Başlık */}
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: t.text,
                letterSpacing: "-0.02em",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Password Generator
            </h1>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 13,
                color: t.textMuted,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Generate secure, random passwords
            </p>
          </div>

          {/* Sağ: Dark/Light Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              border: `1px solid ${t.cardBorder}`,
              background: isDark ? "#1e293b" : "#f8fafc",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              transition: "all 0.3s ease",
            }}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* ── Buraya adım adım yeni bölümler ekleyeceğiz ── */}
        <div
          style={{
            marginTop: 28,
            padding: "40px 0",
            textAlign: "center",
            color: t.textMuted,
            fontSize: 13,
            fontFamily: "'Outfit', sans-serif",
            borderTop: `1px solid ${t.cardBorder}`,
          }}
        >
          Sonraki adım: Mod sekmeleri gelecek buraya
        </div>
      </div>

      {/* ── Google Fonts ── */}
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}