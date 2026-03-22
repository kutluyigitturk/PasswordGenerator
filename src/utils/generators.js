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

const EN_WORDS = [
  "alpine","beacon","canyon","dagger","eclipse","falcon","glacier","harbor",
  "inferno","jungle","kindle","lagoon","meadow","nebula","oracle","phantom",
  "quasar","raptor","summit","tempest","umbra","vortex","wildfire","zenith",
  "anchor","blizzard","cascade","dynamo","enigma","fortress","granite","horizon",
  "impulse","javelin","kraken","lantern","monsoon","nimbus","outpost","pioneer",
  "radiant","saffron","thunder","venture","whisper","crimson","azure","bronze",
  "cedar","dusk","ember","fossil","glimmer","hollow","iris","jasper","kelp",
  "lotus","marble","nomad","opal","python","raven","sphinx","tundra","violet"
];

const TR_WORDS = [
  "deniz","bulut","yildiz","orman","nehir","daglar","gunes","ruzgar","cicek",
  "kus","ates","toprak","yaprak","kelebek","aslan","kartal","bahar","yagmur",
  "safak","mehtap","umut","dunya","baris","cesur","ozgur","mutlu","guzel",
  "parlak","hizli","sakin","tatli","serin","yesil","mavi","altin","gumus",
  "elmas","kaplan","yunus","penguen","kurt","tilki","cinar","lale","mercan",
  "amber","ipek","firtina","sema","derin","akarsu","volkan","kaynak","petek",
  "zeytin","bulbul","mermer","safir","sedef","hilal","pinar","doruk","irmak"
];

export function generatePassphrase(opts) {
  const bank = opts.lang === "tr" ? TR_WORDS : EN_WORDS;
  let words = Array.from({ length: opts.wordCount }, () =>
    bank[Math.floor(Math.random() * bank.length)]
  );
  if (opts.capitalize) {
    words = words.map((w) => w[0].toUpperCase() + w.slice(1));
  }
  let result = words.join(opts.separator);
  if (opts.addNumber) {
    result += opts.separator + Math.floor(Math.random() * 100);
  }
  return result;
}