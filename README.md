<div align="center">

<img src="assets/icon.svg" alt="icon" width="48" height="48" />

# Password Generator

**A secure, feature-rich password generator with real-time strength analysis, multi-mode generation, and a clean Mono UI.**

[![Try It Live](https://img.shields.io/badge/▶_Try_It_Live-4CAF50?style=for-the-badge)](https://kutluyigitturk.github.io/PasswordGenerator/)

</div>

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎲 **Random Mode** | Generates passwords from a customizable character pool (uppercase, lowercase, numbers, symbols). Uses `Math.random()` with retry logic to guarantee character requirements. |
| 🗣️ **Pronounceable Mode** | Creates readable passwords using alternating consonant-vowel patterns (e.g. `bafomiku`). Easy to remember, hard to guess. |
| 📝 **Passphrase Mode** | Combines random words from a 60+ word bank (English and Turkish) with a configurable separator, capitalization, and optional number suffix (e.g. `Alpine-Beacon-Canyon-42`). |
| 🔒 **Strength Analysis** | Real-time entropy calculation in bits. Estimates brute-force crack time assuming 10 billion attempts/sec (modern GPU cluster). Color-coded bar from Very Weak to Very Strong. |
| ⚠️ **Breach Detection** | Checks generated passwords against a set of 40+ commonly leaked passwords. Also detects repeated characters (`aaaaaa`) and sequential numbers (`123456`). |
| 🌗 **Dark / Light Theme** | Animated sun-moon SVG toggle inspired by [web.dev](https://web.dev). CSS transitions with elastic easing for smooth icon morphing. |
| 🌍 **TR / EN Language** | Slide animation toggle. All UI strings stored in a centralized `translations.js` object for easy localization. |
| 🎚️ **Toggle Switches** | Spring-based animations powered by Framer Motion (`stiffness: 700, damping: 30`). Satisfying elastic snap on every toggle. |
| 🎬 **Rolling Animation** | Password reveal effect — characters scramble and resolve left-to-right over 10 frames at 40ms intervals. |
| 📋 **Copy to Clipboard** | One-click copy using the Clipboard API with visual "Copied!" feedback (1.5s timeout). |
| 📜 **Password History** | Stores last 50 generated passwords with mode, timestamp, and strength badge. |
| 📊 **Similarity Score** | Compares each new password to the previous one using Levenshtein distance. Shows percentage with color-coded warnings (>60% = ⚠️, >30% = ⚡, <30% = ✓). |
| 📦 **Export** | Download your password history as JSON or CSV with one click. |

---

## 🔧 How It Works

### Entropy Calculation

```
Pool Size = (26 if lowercase) + (26 if uppercase) + (10 if digits) + (33 if symbols)
Entropy = Password Length × log₂(Pool Size)
```

### Crack Time Estimation

```
Seconds = 2^entropy / 10,000,000,000 (10 billion attempts/sec)
```

Then converted to human-readable format (seconds → minutes → hours → days → years → centuries).

### Similarity Score

Uses **Levenshtein distance** — counts the minimum single-character edits (insertions, deletions, substitutions) needed to change one password into another:

```
Similarity% = (1 - levenshtein(a, b) / max(a.length, b.length)) × 100
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── PasswordDisplay.jsx     → Password output box with rolling animation
│   ├── RandomMode.jsx          → Length slider + character toggles
│   ├── PronounceableMode.jsx   → Length slider + hint text
│   ├── PassphraseMode.jsx      → Word count, separator, language, toggles
│   ├── StrengthBar.jsx         → Color-coded bar + entropy + crack time
│   ├── RecentSection.jsx       → History list + similarity + export
│   └── Toggle.jsx              → Reusable spring-animated toggle switch
├── utils/
│   ├── generators.js           → All password generation algorithms + breach check
│   ├── strength.js             → Entropy, crack time, Levenshtein distance
│   └── translations.js         → All UI strings (EN + TR)
├── PasswordGenerator.jsx       → Main component — assembles everything
├── App.jsx                     → App entry point
└── index.css                   → Global styles + sun-moon CSS animation
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/kutluyigitturk/PasswordGenerator.git
cd PasswordGenerator
npm install
npm run dev
```

Open `http://localhost:5173/` in your browser.

## 📤 Deployment

```bash
npm run deploy
```

Deploys to GitHub Pages via `gh-pages` branch.

---

## 📝 License

MIT

---

<div align="center">

**Built with ☕ and curiosity.**

</div>
