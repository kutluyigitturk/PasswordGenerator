const COMMON_PASSWORDS = new Set([
  "123456","password","12345678","qwerty","abc123","111111","1234567",
  "iloveyou","123123","admin","letmein","welcome","monkey","dragon",
  "master","1234567890","password1","123456789","trustno1","sunshine",
  "princess","football","charlie","shadow","michael","654321","baseball",
  "superman","batman","access","hello","login","passw0rd","starwars",
  "google","whatever","freedom","qwerty123","password123","1q2w3e4r"
]);

export function isCommonPassword(pw) {
  const lower = pw.toLowerCase();
  // Direct match
  if (COMMON_PASSWORDS.has(lower)) return true;
  // Repeated characters like "aaaaaa"
  if (/^(.)\1+$/.test(pw)) return true;
  // Sequential numbers like "123456"
  if (/^(012|123|234|345|456|567|678|789|0123|1234|2345|3456|4567|5678|6789)+\d*$/.test(pw)) return true;
  return false;
}

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

export function generatePronounceable(len, opts = {}) {
  // Common English syllables — feel natural when combined
  const syllables = [
    "ba","be","bi","bo","bu","da","de","di","do","du",
    "fa","fe","fi","fo","fu","ga","ge","gi","go","gu",
    "ka","ke","ki","ko","ku","la","le","li","lo","lu",
    "ma","me","mi","mo","mu","na","ne","ni","no","nu",
    "pa","pe","pi","po","pu","ra","re","ri","ro","ru",
    "sa","se","si","so","su","ta","te","ti","to","tu",
    "va","ve","vi","vo","vu","za","ze","zi","zo","zu",
    "ber","cal","der","fen","ger","hal","jen","kel","ler","mer",
    "ner","per","ser","ter","ver","wal","zel",
    "bra","cre","dri","fro","gra","pre","pri","pro","tra","tri",
    "ble","cle","dle","fle","gle","ple","tle",
    "tion","sion","ment","ness","ful","ing","ble","ous",
    "con","dis","com","per","pre","pro","mis","ven",
    "tal","kin","den","man","son","ton","ber","lin",
    "van","ran","ban","can","dan","fan","lan","pan",
    "mor","cor","dor","for","nor","tor","vor",
    "ark","ork","irk","erk","urk",
    "alt","olt","ilt","elt","ult",
    "and","end","ind","ond","und",
    "ant","ent","int","ont","unt",
    "ard","ord","ird","erd","urd"
  ];

  const vowelToNum = { a: "4", e: "3", i: "1", o: "0", u: "9" };

  // Build word from syllables until we reach desired length
  let result = "";
  while (result.length < len) {
    const syl = syllables[Math.floor(Math.random() * syllables.length)];
    if (result.length + syl.length <= len + 2) {
      result += syl;
    }
  }
  result = result.slice(0, len);

  // Split into array for modifications
  let chars = result.split("");

  // Random capitalize
  if (opts.capitalize) {
    // Always capitalize first letter
    chars[0] = chars[0].toUpperCase();
    // Randomly capitalize some syllable starts
    for (let i = 2; i < chars.length; i++) {
      if (/[bcdfghjklmnprstvwz]/.test(chars[i]) && Math.random() > 0.65) {
        chars[i] = chars[i].toUpperCase();
      }
    }
  }

  // Insert numbers: replace some vowels with look-alike numbers
  if (opts.addNumbers) {
    let replaced = 0;
    for (let i = 0; i < chars.length; i++) {
      const lower = chars[i].toLowerCase();
      if (vowelToNum[lower] && Math.random() > 0.6 && replaced < 3) {
        chars[i] = vowelToNum[lower];
        replaced++;
      }
    }
  }

  return chars.join("");
}

const EN_WORDS = [
  "alpine","anchor","apex","arcade","artifact","aspen","aurora","avalanche","beacon","birch",
  "blizzard","boulder","breeze","bronze","brook","canyon","cascade","cedar","cinder","citadel",
  "cliff","clover","comet","compass","copper","coral","cosmos","crimson","crown","dagger",
  "delta","drift","dusk","dynamo","echo","eclipse","ember","enigma","everest","falcon",
  "feather","fjord","flare","flint","forest","fortress","galaxy","gale","garden","geyser",
  "glacier","glimmer","granite","grove","harbor","hazel","horizon","hollow","iceberg","impulse",
  "indigo","inferno","iris","ivory","jasper","javelin","juniper","jungle","kelp","kindle",
  "kraken","lagoon","lantern","legend","lilac","lotus","lunar","magnet","maple","marble",
  "meadow","meteor","midnight","mirage","mist","monsoon","mosaic","mystic","nebula","nimbus",
  "nomad","oasis","onyx","opal","oracle","orbit","outpost","paradox","pearl","pegasus",
  "phantom","pioneer","prairie","prism","python","quasar","quest","quill","radiant","raptor",
  "raven","reef","ridge","rocket","ruby","saber","saffron","sage","scarlet","shadow",
  "signal","silver","solstice","sparrow","sphinx","spire","spruce","starling","storm","summit",
  "sunrise","sunset","talon","tempest","thunder","timber","topaz","torch","traveler","trident",
  "tundra","umbra","valley","venture","velvet","violet","vortex","voyager","whisper","wildfire",
  "willow","winter","wisp","zenith","zephyr"
];

const TR_WORDS = [
  "ada","agac","akarsu","alev","altin","amber","anka","ardic","armut","atlas",
  "ayaz","ayva","badem","bahar","baris","basak","benek","bereket","boncuk","bora",
  "bulbul","bulut","cagla","cam","cesur","cicek","cimen","cinar","ceviz","dag",
  "daglar","damla","deniz","dere","derin","doga","dogan","dolunay","doruk","duman",
  "dunya","duru","dut","ekin","elmas","elma","erik","esinti","filiz","firtina",
  "funda","golge","gonul","gok","gokce","gumus","gunes","gur","hayal","hilal",
  "hizli","huzur","inci","ipek","irmak","isik","kaya","kaynak","kaplan","kartal",
  "kedi","kelebek","kelp","kestane","kiyi","kiraz","kivilcim","koy","kugu","kumru",
  "kumsal","kus","kurt","ladin","lale","lavanta","leylak","liman","marti","mavi",
  "mehtap","menekse","mercan","mermer","mutlu","nar","nehir","orman","ova","ozgur",
  "parilti","penguen","petek","pinar","poyraz","ruzgar","safir","safak","sakin","sema",
  "serin","servi","sevgi","selale","sedef","simsek","sona","sogut","su","tan",
  "tane","tarla","tatli","tepe","tilki","toprak","turna","tufan","ufuk","umut",
  "uyum","vadi","volkan","yagmur","yakamoz","yaprak","yayla","yel","yesil","yildirim",
  "yildiz","yonca","yuce","yunus","zambak","zeytin","zirve","zumrut"
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