export default function StrengthBar({ strength, entropy, crackTime, txt, theme }) {
  return (
    <div style={{ marginTop: 12 }}>
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
          fontSize: 10,
          color: theme.mutedFg,
        }}
      >
        <span>
          <span style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</span>
          {" · "}
          {txt.entropy}: {Math.round(entropy)} bit
        </span>
        <span>
          {txt.crackTime}: {crackTime}
        </span>
      </div>
    </div>
  );
}