import { useState } from "react";

export default function StrengthBar({ strength, entropy, crackTime, txt, theme, patterns = [] }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={{ marginTop: 12 }}>
      {/* Bar */}
      <div
        style={{
          height: 4,
          borderRadius: 2,
          background: theme.muted,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${strength.pct}%`,
            background: strength.color,
            borderRadius: 2,
            transition: "all 0.5s ease",
          }}
        />
      </div>

      {/* Info line */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 6,
          fontSize: 10,
          color: theme.mutedFg,
        }}
      >
        {/* Left: Strength label with entropy tooltip */}
        <span
          style={{ position: "relative", cursor: "default" }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <span style={{ color: strength.color, fontWeight: 600 }}>
            {strength.label}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.mutedFg}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginLeft: 4, verticalAlign: "middle", display: "inline" }}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>

          {/* Tooltip */}
          {showTooltip && (
            <span
              style={{
                position: "absolute",
                bottom: "calc(100% + 6px)",
                left: 0,
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                borderRadius: 4,
                padding: "4px 8px",
                fontSize: 10,
                color: theme.text,
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                zIndex: 10,
              }}
            >
              {txt.entropy}: {Math.round(entropy)} bit
            </span>
          )}
        </span>

        {/* Right: Crack time */}
        <span style={{ whiteSpace: "nowrap" }}>
          {txt.crackTime}: {crackTime}
        </span>
      </div>

      {/* Pattern Warnings */}
      {patterns.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {patterns.map((p, i) => (
            <div
              key={i}
              style={{
                fontSize: 10,
                color: p.severity === "high" ? "#ef4444" : p.severity === "medium" ? "#f59e0b" : theme.mutedFg,
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 3,
              }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                {p.severity === "high" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
                    <path d="M12 9v4"/><path d="M12 17h.01"/>
                  </svg>
                ) : p.severity === "medium" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
                    <path d="M12 9v4"/><path d="M12 17h.01"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 9v7"/><path d="M14 6v10"/>
                    <circle cx="17.5" cy="12.5" r="3.5"/><circle cx="6.5" cy="12.5" r="3.5"/>
                  </svg>
                )}
              </span>
              <span>{txt.patternWarnings?.[p.key] || p.key}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}