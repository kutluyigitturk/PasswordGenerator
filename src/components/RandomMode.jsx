import Toggle from "./Toggle";

export default function RandomMode({ settings, setSettings, txt, theme }) {
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
          min={4}
          max={64}
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
        on={settings.upper}
        onToggle={() => setSettings({ ...settings, upper: !settings.upper })}
        label={txt.uppercase}
        hint="A-Z"
        theme={theme}
      />
      <Toggle
        on={settings.lower}
        onToggle={() => setSettings({ ...settings, lower: !settings.lower })}
        label={txt.lowercase}
        hint="a-z"
        theme={theme}
      />
      <Toggle
        on={settings.numbers}
        onToggle={() => setSettings({ ...settings, numbers: !settings.numbers })}
        label={txt.numbers}
        hint="0-9"
        theme={theme}
      />
      <Toggle
        on={settings.symbols}
        onToggle={() => setSettings({ ...settings, symbols: !settings.symbols })}
        label={txt.symbols}
        hint="!@#$"
        theme={theme}
      />

      {/* Divider */}
      <div style={{ height: 1, background: theme.border, margin: "8px 0" }} />

      <Toggle
        on={settings.excludeSimilar}
        onToggle={() => setSettings({ ...settings, excludeSimilar: !settings.excludeSimilar })}
        label={txt.excludeSimilar}
        hint={txt.excludeSimilarHint}
        theme={theme}
      />
      <Toggle
        on={settings.mustContain}
        onToggle={() => setSettings({ ...settings, mustContain: !settings.mustContain })}
        label={txt.mustContain}
        hint={txt.mustContainHint}
        theme={theme}
      />
    </div>
  );
}