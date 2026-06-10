# Poker Analyzer — Design System

**Direction ratified 2026-06-09.** This repo's purpose is now to hold the final design system
and the exploration history that produced it.

```
.
├── design-system/        ★ THE MAIN THING — start here
│   ├── README.md         how to use this + next steps
│   ├── DECISIONS.md      13 ratified decisions (and what was rejected, and why)
│   ├── DESIGN.md         the design system contract
│   ├── tokens.css        Tailwind 4 @theme — ready for the poker repo
│   ├── index.html        living specimen page (open in a browser)
│   └── reference/        Command Desk R.html — the pixel reference (opens standalone)
│       └── sketches/     late-stage proof modules kept for quarrying
└── archive/              everything that led here — quarry, don't extend
    ├── lab/              the Vite design lab (49 bricks · 8-tab sandbox · run: npm i && npm run dev)
    ├── lab-docs/         lab-era docs (CURATION, TYPOGRAPHY, ELEMENT_INVENTORY, session history)
    ├── direction-lab/    the 4-voice dashboard comparison (slop / instrument / ledger / synthesis)
    └── …                 older sandboxes, sketches, legacy dashboards, screenshots
```

## The identity in one line

A precision instrument: quiet ink chassis, hairlines not boxes, color is meaning
(green = money, red-family = bleeding by intensity, violet = *you*), one jewel per screen,
five functional motion moments.

## Next step

Open the main poker repo (github.com/m-scorza/poker) in Claude Code and follow
`design-system/README.md` — copy the contracts into `docs/design/`, drop `tokens.css` into
`src/styles/`, and start at porting-map step 1 with the pixel reference open beside you.
