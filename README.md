# Poker Design Lab

A standalone Vite design/prototyping lab for the Poker Analyzer redesign. It is **not** wired
into the main React app — it exists so every distinctive UI element, animation, and page layout
lives as its own editable "brick" and nothing gets lost between design iterations.

## Run

```bash
npm install
npm run dev      # live dev server with HMR (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # serve the production build
```

Two pages are served:

- **`index.html`** — the unified sandbox (8 tabs: Desk, Career, Sessions, Hands, Leaks, Ranges,
  Villains, Arena), with the loader, masthead nav, ticker, theme dock, and animated background.
- **`elements.html`** — the element catalog. A sidebar lists each standalone element demo; the
  viewport iframes the selected one, with an "Open Standalone" link.

GSAP is an npm dependency (`import gsap from 'gsap'`) — there is no local `gsap.min.js` and no CDN.

## Structure

```
.
├── index.html            # unified sandbox shell (chrome + <main id="pages"> mount)
├── elements.html         # element catalog (iframes src/elements/*.html)
├── vite.config.js        # multi-page: input = { main: index.html, elements: elements.html }
├── src/
│   ├── main.js           # orchestrator: imports CSS, injects page partials, runs module inits
│   ├── state.js          # shared mutable state (e.g. background mesh color target)
│   ├── styles/           # one CSS file per component/page (imported by main.js, in cascade order)
│   ├── modules/          # one ES module per behavior; each exports an init() (+ named helpers)
│   ├── pages/            # section-only .html partials, raw-imported by main.js
│   ├── data/             # *.json (native Vite JSON imports)
│   └── elements/         # standalone element demos (each imports gsap from npm)
├── docs/                 # design docs, audits, element inventory
└── archive/              # frozen originals (old sandboxes, sketches, legacy dashboards) — NOT built
```

Page visibility is CSS-driven: `.page { display:none }` / `.page.active { display:block }`.
`main.js` injects all 8 partials into `#pages` and marks only `page-overview` active on load.
`src/modules/transitions.js` swaps the active page on nav clicks.

The `archive/` tree holds every original file verbatim (preserved in the baseline git commit and
relocated, never deleted). Anything from an older sandbox can be pulled forward from there — see
`docs/ELEMENT_INVENTORY.md` for the carried-forward vs archive-only map.

## How to add a brick

**A new page (tab):**
1. Add `src/pages/<name>.html` as a section-only fragment: `<section class="page" id="page-<name>">…</section>`.
2. Add a nav link in `index.html`: `<a data-tab="<name>">Label</a>`.
3. In `src/main.js`: `import <name> from './pages/<name>.html?raw'`, add it to the `PAGES` map, and
   (if it has behavior) call its `init()` in `boot()`.
4. Add `src/styles/<name>.css` and import it in `main.js` (keep the cascade order sensible).

**A new behavior/animation:**
1. Add `src/modules/<name>.js` exporting `export function init<Name>() { … }`. Import gsap with
   `import gsap from 'gsap'` if needed; share cross-module state via `src/state.js`.
2. Import and call it in `src/main.js` → `boot()`.

**A new standalone element demo:**
1. Add `src/elements/<name>.html` as a self-contained page. If it animates, use
   `<script type="module">import gsap from 'gsap'; …</script>`.
2. Add a catalog entry (`<button class="element-item" data-src="src/elements/<name>.html" …>`) and,
   if it should be the default, point the initial iframe `src` at it in `elements.html`.

## Notes

- Animations are driven by `requestAnimationFrame` / the GSAP ticker, which browsers pause while a
  tab is hidden/backgrounded — they resume on focus. (This is why headless screenshot tools that hold
  the page hidden show the loader stuck at `00`; in a real visible tab it animates normally.)
- No backend, no network calls — all data is local JSON under `src/data/`.
```
