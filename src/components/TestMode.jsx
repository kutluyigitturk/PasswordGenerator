import { isCommonPassword } from "../utils/generators";

export default function TestMode({ value, onChange, txt, theme, isDark, onSave }) {
  const common = value && isCommonPassword(value);

  return (
    <div>
      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={txt.testPlaceholder}
        style={{
          width: "100%",
          padding: "12px 14px",
          background: theme.bg,
          border: `1px solid ${theme.border}`,
          borderRadius: 6,
          color: theme.text,
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "'Geist Mono', monospace",
          outline: "none",
          transition: "border-color 0.2s ease",
          boxSizing: "border-box",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = theme.mutedFg;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = theme.border;
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) {
            onSave(value.trim());
          }
        }}
      />

      {/* Breach Warning */}
      {common && (
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

      {/* Hint */}
      <p
        style={{
          fontSize: 10,
          color: theme.mutedFg,
          marginTop: 12,
          textAlign: "center",
          fontFamily: "inherit",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }}>
          <circle cx="12" cy="16" r="1"/>
          <rect x="3" y="10" width="18" height="12" rx="2"/>
          <path d="M7 10V7a5 5 0 0 1 10 0v3"/>
        </svg>
        {txt.testHint}
      </p>
    </div>
  );
}