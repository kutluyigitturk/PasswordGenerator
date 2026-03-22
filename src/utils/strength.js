export function calcEntropy(pw) {
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 33;
  return pool ? pw.length * Math.log2(pool) : 0;
}

export function getCrackTime(ent, txt) {
  const s = Math.pow(2, ent) / 1e10;
  if (s < 0.001) return txt.instant;
  if (s < 1) return `< 1 ${txt.seconds}`;
  if (s < 60) return `${Math.round(s)} ${txt.seconds}`;
  if (s < 3600) return `${Math.round(s / 60)} ${txt.minutes}`;
  if (s < 86400) return `${Math.round(s / 3600)} ${txt.hours}`;
  if (s < 2592000) return `${Math.round(s / 86400)} ${txt.days}`;
  if (s < 31536000) return `${Math.round(s / 2592000)} ${txt.months}`;
  if (s < 3153600000) return `${Math.round(s / 31536000)} ${txt.years}`;
  if (s < 3.1536e13) return `${Math.round(s / 3153600000)} ${txt.centuries}`;
  if (s < 3.1536e16) return `${(s / 3.1536e13).toFixed(0)} ${txt.kCenturies}`;
  return txt.beyondLifetime;
}

export function getStrength(ent, txt) {
  if (ent < 28) return { label: txt.strength.veryWeak, color: "#ef4444", pct: 10 };
  if (ent < 36) return { label: txt.strength.weak, color: "#f97316", pct: 25 };
  if (ent < 50) return { label: txt.strength.fair, color: "#eab308", pct: 50 };
  if (ent < 70) return { label: txt.strength.strong, color: "#22c55e", pct: 75 };
  return { label: txt.strength.veryStrong, color: "#059669", pct: 100 };
}

export function levenshtein(a, b) {
  const m = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0
    )
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      m[i][j] =
        a[i - 1] === b[j - 1]
          ? m[i - 1][j - 1]
          : 1 + Math.min(m[i - 1][j], m[i][j - 1], m[i - 1][j - 1]);
    }
  }
  return m[a.length][b.length];
}

export function similarityScore(a, b) {
  if (!a || !b) return 0;
  return Math.round(
    (1 - levenshtein(a, b) / Math.max(a.length, b.length)) * 100
  );
}