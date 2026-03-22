import { motion } from "framer-motion";

export default function Toggle({ on, onToggle, label, hint, theme }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 0",
      }}
    >
      <div>
        <span style={{ fontSize: 12, fontWeight: 500, color: theme.text }}>{label}</span>
        {hint && (
          <span
            style={{
              fontSize: 10,
              color: theme.mutedFg,
              marginLeft: 6,
              fontFamily: "inherit",
            }}
          >
            {hint}
          </span>
        )}
      </div>
      <button
        onClick={onToggle}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          background: on ? theme.toggleAccent : theme.muted,
          border: `1px solid ${on ? theme.toggleAccent : theme.border}`,
          cursor: "pointer",
          position: "relative",
          transition: "background 0.3s ease, border 0.3s ease",
          padding: 2,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: on ? "flex-end" : "flex-start",
        }}
      >
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
          }}
        />
      </button>
    </div>
  );
}