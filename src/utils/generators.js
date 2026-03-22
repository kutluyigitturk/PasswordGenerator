const CHARSETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  ambiguous: "0O1lI",
};

export function generateRandom(len, opts) {
  let pool = "";
  const required = [];
  if (opts.upper) { pool += CHARSETS.upper; required.push(CHARSETS.upper); }
  if (opts.lower) { pool += CHARSETS.lower; required.push(CHARSETS.lower); }
  if (opts.numbers) { pool += CHARSETS.numbers; required.push(CHARSETS.numbers); }
  if (opts.symbols) { pool += CHARSETS.symbols; required.push(CHARSETS.symbols); }
  if (opts.excludeSimilar) {
    pool = [...pool].filter((c) => !CHARSETS.ambiguous.includes(c)).join("");
  }
  if (!pool) return "enable-at-least-one";

  let result;
  let attempts = 0;
  do {
    result = Array.from({ length: len }, () =>
      pool[Math.floor(Math.random() * pool.length)]
    ).join("");
    attempts++;
  } while (
    opts.mustContain &&
    required.length > 0 &&
    !required.every((s) => [...result].some((c) => s.includes(c))) &&
    attempts < 100
  );
  return result;
}

export function generatePronounceable(len) {
  const consonants = "bcdfghjklmnprstvwz";
  const vowels = "aeiou";
  let result = "";
  let useConsonant = true;

  while (result.length < len) {
    const pool = useConsonant ? consonants : vowels;
    result += pool[Math.floor(Math.random() * pool.length)];
    useConsonant = !useConsonant;
  }

  return result.slice(0, len);
}