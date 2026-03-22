import Toggle from "./Toggle";

const SEPARATORS = ["-", "_", ".", "~", "+"];

export default function PassphraseMode({ settings, setSettings, txt, theme }) {
  return (
    <div>
      {/* Word Count Slider */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 500, color: theme.text }}>
            {txt.wordCount}
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: theme.text,
              fontFamily: "inherit",
            }}
          >
            {settings.wordCount}
          </span>
        </div>
        <input
          type="range"
          min={3}
          max={8}
          value={settings.wordCount}
          onChange={(e) => setSettings({ ...settings, wordCount: +e.target.value })}
          style={{
            width: "100%",
            accentColor: theme.toggleAccent,
            height: 4,
            cursor: "pointer",
          }}
        />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: theme.border, margin: "16px 0" }} />

      {/* Separator */}
      <div>
        <span style={{ fontSize: 12, fontWeight: 500, color: theme.text }}>
          {txt.separator}
        </span>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {SEPARATORS.map((sep) => (
            <button
              key={sep}
              onClick={() => setSettings({ ...settings, separator: sep })}
              style={{
                width: 36,
                height: 32,
                borderRadius: 6,
                border: `1px solid ${settings.separator === sep ? theme.toggleAccent : theme.border}`,
                background: settings.separator === sep ? theme.toggleAccent : "transparent",
                color: settings.separator === sep ? "#fff" : theme.mutedFg,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'Geist Mono', monospace",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {sep}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: theme.border, margin: "16px 0" }} />

      {/* Language */}
      <div>
        <span style={{ fontSize: 12, fontWeight: 500, color: theme.text }}>
          {txt.wordLang}
        </span>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {[
            { key: "en", label: "English" },
            { key: "tr", label: "Türkçe" },
          ].map((l) => (
            <button
              key={l.key}
              onClick={() => setSettings({ ...settings, lang: l.key })}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 6,
                border: `1px solid ${settings.lang === l.key ? theme.toggleAccent : theme.border}`,
                background: settings.lang === l.key ? theme.toggleAccent : "transparent",
                color: settings.lang === l.key ? "#fff" : theme.mutedFg,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: theme.border, margin: "16px 0" }} />

      {/* Toggles */}
      <Toggle
        on={settings.capitalize}
        onToggle={() => setSettings({ ...settings, capitalize: !settings.capitalize })}
        label={txt.capitalize}
        theme={theme}
      />
      <Toggle
        on={settings.addNumber}
        onToggle={() => setSettings({ ...settings, addNumber: !settings.addNumber })}
        label={txt.addNumber}
        theme={theme}
      />
    </div>
  );
}