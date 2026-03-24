export function detectPatterns(pw) {
  const warnings = [];

  if (!pw || pw.length < 2) return warnings;

  // 1. Too few unique characters
  const unique = new Set(pw).size;
  const ratio = unique / pw.length;
  if (ratio < 0.3) {
    warnings.push({ key: "lowUnique", severity: "high" });
  }

  // 2. Repeating groups (asd asd asd)
  for (let len = 2; len <= Math.floor(pw.length / 2); len++) {
    const chunk = pw.slice(0, len);
    const repeated = chunk.repeat(Math.ceil(pw.length / len)).slice(0, pw.length);
    if (repeated === pw) {
      warnings.push({ key: "repeatingGroup", severity: "high" });
      break;
    }
  }

  // 3. Keyboard walk patterns
  const walks = ["qwerty","asdfgh","zxcvbn","qwertz","asdf","zxcv","1234567890"];
  const lower = pw.toLowerCase();
  for (const walk of walks) {
    if (lower.includes(walk) || lower.includes(walk.split("").reverse().join(""))) {
      warnings.push({ key: "keyboardWalk", severity: "medium" });
      break;
    }
  }

  // 4. All same character
  if (/^(.)\1+$/.test(pw)) {
    warnings.push({ key: "allSame", severity: "high" });
  }

  // 5. Only one character type used with long password
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasNum = /[0-9]/.test(pw);
  const hasSym = /[^a-zA-Z0-9]/.test(pw);
  const typeCount = [hasLower, hasUpper, hasNum, hasSym].filter(Boolean).length;
  if (pw.length > 8 && typeCount === 1) {
    warnings.push({ key: "singleType", severity: "low" });
  }

  return warnings;
}

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

  const years = s / 31536000;
  if (years < 1e3) return `${Math.round(years)} ${txt.years}`;
  if (years < 1e6) return `~${Math.round(years / 1e3)} ${txt.thousand} ${txt.years}`;
  if (years < 1e9) return `~${Math.round(years / 1e6)} ${txt.million} ${txt.years}`;
  if (years < 1e12) return `~${Math.round(years / 1e9)} ${txt.billion} ${txt.years}`;
  if (years < 1e15) return `~${Math.round(years / 1e12)} ${txt.trillion} ${txt.years}`;
  return txt.beyondLifetime;
}

export function getStrength(ent, txt, patterns = []) {
  // High severity patterns cap strength
  const hasHigh = patterns.some((p) => p.severity === "high");
  const hasMedium = patterns.some((p) => p.severity === "medium");

  if (hasHigh) {
    return { label: txt.strength.veryWeak, color: "#ef4444", pct: 10 };
  }

  let result;
  if (ent < 28) result = { label: txt.strength.veryWeak, color: "#ef4444", pct: 10 };
  else if (ent < 36) result = { label: txt.strength.weak, color: "#f97316", pct: 25 };
  else if (ent < 50) result = { label: txt.strength.fair, color: "#eab308", pct: 50 };
  else if (ent < 70) result = { label: txt.strength.strong, color: "#22c55e", pct: 75 };
  else result = { label: txt.strength.veryStrong, color: "#059669", pct: 100 };

  // Medium severity drops one level
  if (hasMedium && result.pct > 25) {
    if (result.pct === 100) return { label: txt.strength.strong, color: "#22c55e", pct: 75 };
    if (result.pct === 75) return { label: txt.strength.fair, color: "#eab308", pct: 50 };
    if (result.pct === 50) return { label: txt.strength.weak, color: "#f97316", pct: 25 };
  }

  return result;
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