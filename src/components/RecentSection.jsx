import { useState } from "react";
import { calcEntropy, getStrength, similarityScore } from "../utils/strength";

export default function RecentSection({ history, setHistory, txt, theme }) {
  const [isOpen, setIsOpen] = useState(false);

  const exportData = (fmt) => {
    const data = history.map((h) => ({
      password: h.pw,
      mode: h.mode,
      entropy: Math.round(calcEntropy(h.pw)),
      strength: getStrength(calcEntropy(h.pw), txt).label,
      date: new Date(h.time).toLocaleString(),
    }));

    let content, mime, ext;
    if (fmt === "json") {
      content = JSON.stringify(data, null, 2);
      mime = "application/json";
      ext = "json";
    } else {
      const header = "password,mode,entropy,strength,date";
      const rows = data.map(
        (d) => `"${d.password}",${d.mode},${d.entropy},${d.strength},"${d.date}"`
      );
      content = [header, ...rows].join("\n");
      mime = "text/csv";
      ext = "csv";
    }

    const blob = new Blob([content], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `passwords.${ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      {/* Header — clickable to toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          padding: "4px 0",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>
          {txt.recent} ({history.length})
        </span>
        <span
          style={{
            fontSize: 16,
            color: theme.mutedFg,
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▾
        </span>
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
            <>
              {history.slice(0, 20).map((h, i) => {
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
                          ? "🎲"
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
              })}

              {/* Export + Clear buttons */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginTop: 12,
                }}
              >
                <button
                  onClick={() => exportData("json")}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    border: `1px solid ${theme.border}`,
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    background: "transparent",
                    color: theme.mutedFg,
                    transition: "all 0.2s ease",
                  }}
                >
                  📦 {txt.exportJSON}
                </button>
                <button
                  onClick={() => exportData("csv")}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    border: `1px solid ${theme.border}`,
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    background: "transparent",
                    color: theme.mutedFg,
                    transition: "all 0.2s ease",
                  }}
                >
                  📊 {txt.exportCSV}
                </button>
                <button
                  onClick={() => setHistory([])}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    border: `1px solid ${theme.border}`,
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    background: "transparent",
                    color: "#ef4444",
                    transition: "all 0.2s ease",
                  }}
                >
                  🗑️ {txt.clear}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}