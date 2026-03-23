import Toggle from "./Toggle";

export default function PronounceableMode({ settings, setSettings, txt, theme }) {
  return (
    <div>
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
          <span style={{ fontSize: 12, fontWeight: 500, color: theme.text }}>
            {txt.length}
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: theme.text,
              fontFamily: "inherit",
            }}
          >
            {settings.length}
          </span>
        </div>
        <input
          type="range"
          min={6}
          max={24}
          value={settings.length}
          onChange={(e) => setSettings({ ...settings, length: +e.target.value })}
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

      {/* Toggles */}
      <Toggle
        on={settings.capitalize}
        onToggle={() => setSettings({ ...settings, capitalize: !settings.capitalize })}
        label={txt.pronounceableCaps}
        theme={theme}
      />
      <Toggle
        on={settings.addNumbers}
        onToggle={() => setSettings({ ...settings, addNumbers: !settings.addNumbers })}
        label={txt.pronounceableNums}
        hint={txt.pronounceableNumsHint}
        theme={theme}
      />

      {/* Hint */}
      <p
        style={{
          fontSize: 11,
          color: theme.mutedFg,
          marginTop: 12,
          lineHeight: 1.5,
        }}
      >
        {txt.pronounceableHint}
      </p>
    </div>
  );
}