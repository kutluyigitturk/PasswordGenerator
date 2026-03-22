# 🔐 Password Generator

A secure, feature-rich password generator built with React + Vite. Designed with a clean Mono theme and smooth animations.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://kutluyigitturk.github.io/PasswordGenerator/)

---

## Features

- **3 Generation Modes** — Random, Pronounceable, Passphrase
- **Strength Analysis** — Real-time entropy calculation and crack time estimation
- **Dark / Light Theme** — Animated sun-moon toggle (web.dev inspired)
- **TR / EN Language Switch** — Slide animation, all strings managed centrally
- **Customizable Settings** — Length slider, character toggles with spring animations
- **Copy to Clipboard** — One-click copy with feedback
- **Rolling Animation** — Character-by-character password reveal effect

## Tech Stack

- **React** — Component-based UI
- **Vite** — Fast build tool
- **Framer Motion** — Spring-based toggle animations
- **GitHub Pages** — Deployment

## Project Structure

```
src/
├── components/
│   ├── PasswordDisplay.jsx   → Password output box
│   ├── RandomMode.jsx        → Random mode settings (slider + toggles)
│   ├── StrengthBar.jsx       → Strength bar + entropy + crack time
│   └── Toggle.jsx            → Reusable toggle switch with spring animation
├── utils/
│   ├── generators.js         → Password generation algorithms
│   ├── strength.js           → Entropy and crack time calculations
│   └── translations.js       → All UI strings (EN + TR)
├── PasswordGenerator.jsx     → Main component (assembles everything)
├── App.jsx                   → App entry point
└── index.css                 → Global styles + sun-moon animation
```

## Getting Started

```bash
git clone https://github.com/kutluyigitturk/PasswordGenerator.git
cd PasswordGenerator
npm install
npm run dev
```

Open `http://localhost:5173/` in your browser.

## Deployment

```bash
npm run deploy
```

## License

MIT
