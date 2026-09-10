# 🎂 Happy 22nd Birthday, Paru

A beautiful interactive birthday experience built with **React + Vite + Tailwind CSS + Framer Motion + React Icons**.

## Quick start

```bash
cd paru-birthday
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Adding your photos

1. Put your image files inside the `public/photos/` folder, for example:
   ```
   public/photos/
     us-together.jpg
     rings.jpg
     movie-night.jpg
     ...
   ```

2. Open `src/data/content.js` and update the `PHOTOS` array:

```js
export const PHOTOS = [
  {
    src: "/photos/us-together.jpg",
    caption: "this is us, cutu",
    alt: "Us together",
  },
  {
    src: "/photos/rings.jpg",
    caption: "where it all started 💍",
    alt: "Our rings",
  },
  // add as many as you want
];
```

That's it — the carousel and lightbox will automatically use them.

## Project structure

```
src/
  components/     ← UI sections (Cover, Hero, Cake, Reasons, Photos, …)
  data/
    content.js    ← all text, reasons, quiz, photos, etc. (easy to edit)
  hooks/
    useCountdown.js
    useSound.js
  App.jsx
  index.css       ← Tailwind + custom theme
  main.jsx
public/
  photos/         ← drop your images here
```

## Features

- Animated cover card
- Live birthday countdown
- Blow-out candles with sound
- 18 "reasons I love you" gift boxes
- Story timeline
- Photo carousel + lightbox (ready for your photos)
- Love letter
- Bucket list (tap to promise)
- Redeemable coupons
- Flip comfort cards
- Quiz
- Wish jar
- Secret nickname lock
- Ambient generative music + sound effects
- Dark mode
- Floating surprise button
- Framer Motion scroll reveals & micro-interactions

## Customizing content

Almost everything lives in **`src/data/content.js`**:

- Name, nicknames, birth date
- Reasons, timeline, letter
- Bucket list, coupons, comfort messages
- Quiz questions
- Valid nicknames for the lock
- Photo list

Edit that file and the whole site updates.

## Build for production

```bash
npm run build
npm run preview
```

The `dist/` folder can be hosted on any static host (Vercel, Netlify, GitHub Pages, etc.).
