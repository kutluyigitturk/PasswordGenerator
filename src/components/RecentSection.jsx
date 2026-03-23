import { useState } from "react";
import { calcEntropy, getStrength, similarityScore } from "../utils/strength";

export default function RecentSection({ history, setHistory, txt, theme }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Header — clickable to toggle */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          padding: "4px 0",
        }}
      >
        <span
          onClick={() => setIsOpen(!isOpen)}
          style={{ fontSize: 12, fontWeight: 600, color: theme.text, flex: 1 }}
        >
          {txt.recent} ({history.length})
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Clear Button */}
          {history.length > 0 && (
            <button
              onClick={() => setHistory([])}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: 6,
                border: `1px solid ${theme.border}`,
                background: "transparent",
                cursor: "pointer",
                color: theme.mutedFg,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ef4444";
                e.currentTarget.style.borderColor = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.mutedFg;
                e.currentTarget.style.borderColor = theme.border;
              }}
              title={txt.clear}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
              </svg>
            </button>
          )}

          {/* Collapse Arrow */}
          <span
            onClick={() => setIsOpen(!isOpen)}
            style={{
              fontSize: 16,
              color: theme.mutedFg,
              transition: "transform 0.2s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              cursor: "pointer",
            }}
          >
            ▾
          </span>
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div style={{ marginTop: 12 }}>
          {history.length === 0 ? (
            <p
              style={{
                fontSize: 11,
                color: theme.mutedFg,
                textAlign: "center",
                padding: "16px 0",
              }}
            >
              {txt.noHistory}
            </p>
          ) : (
            history.slice(0, 20).map((h, i) => {
              const ent = calcEntropy(h.pw);
              const str = getStrength(ent, txt);
              const sim =
                i > 0 ? similarityScore(h.pw, history[0].pw) : null;

              return (
                <div
                  key={h.time + i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: `1px solid ${theme.border}`,
                    gap: 8,
                  }}
                >
                  {/* Left: password + meta */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "inherit",
                        fontSize: 11,
                        color: theme.text,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {h.pw}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: theme.mutedFg,
                        marginTop: 3,
                      }}
                    >
                      {h.mode === "random"
                        ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "middle" }}>
                            <rect width="12" height="12" x="2" y="10" rx="2" ry="2"/>
                            <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6"/>
                            <path d="M6 18h.01"/><path d="M10 14h.01"/>
                            <path d="M15 6h.01"/><path d="M18 9h.01"/>
                          </svg>
                        )
                        : h.mode === "pronounceable"
                        ? "🗣️"
                        : "📝"}{" "}
                      {new Date(h.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* Right: strength + similarity */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#fff",
                        background: str.color,
                      }}
                    >
                      {str.label}
                    </span>
                    {sim !== null && i > 0 && (
                      <div
                        style={{
                          fontSize: 10,
                          marginTop: 3,
                          fontWeight: 600,
                          color:
                            sim > 60
                              ? "#ef4444"
                              : sim > 30
                              ? "#f59e0b"
                              : "#22c55e",
                        }}
                      >
                        {sim > 60 ? "⚠️" : sim > 30 ? "⚡" : "✓"} %{sim}{" "}
                        {txt.similarity}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}