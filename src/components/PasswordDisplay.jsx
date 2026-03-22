export default function PasswordDisplay({ displayPw, animating, placeholder, theme }) {
  return (
    <div
      style={{
        marginTop: 20,
        padding: "16px",
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: 6,
        minHeight: 52,
        display: "flex",
        alignItems: "center",
        transition: "all 0.4s ease",
      }}
    >
      <span
        style={{
          fontFamily: "inherit",
          fontSize: 14,
          fontWeight: 500,
          color: animating ? theme.mutedFg : theme.text,
          wordBreak: "break-all",
          letterSpacing: "0.02em",
          lineHeight: 1.6,
          transition: "color 0.2s ease",
        }}
      >
        {displayPw || placeholder}
      </span>
    </div>
  );
}