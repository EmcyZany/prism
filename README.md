# PRISM — See every market clearly

A design concept for Seer's six interfaces, built in the Electric Foundation (EF) brand system.
One beam in. The full spectrum out.

**Live:** https://prism-xi-umber.vercel.app

## Pages
- `/` — Homepage
- `/app` — Seer App (market explorer)
- `/deep` — Deep (Deep Funding markets)
- `/futarchy` — Futarchy (conditional markets)
- `/opportunity` — Opportunity Markets
- `/risk` — Risk Pricing

## Tech
Plain static HTML/CSS/JS — no framework, no build step. Light theme by default with a dark/light toggle (persisted). All colours are EF tokens (#7D33FF, #141223, #EFE9FC, #6C2BD9 + EF greys); the spectrum artwork is rendered in the EF violet family. Motion is canvas-based and respects `prefers-reduced-motion`.

## Run / rebuild
Serve the folder with any static host, e.g. `python3 -m http.server` in this directory, or drop the folder onto Vercel/Netlify/GitHub Pages. The root `index.html` is the homepage; each interface is a folder with its own `index.html`.

Design and direction by Favour (@Samuelcheq1), built with AI assistance. Not affiliated with Seer.
