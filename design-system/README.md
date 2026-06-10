# design-system/ — the final design system (single source of truth)

**Status: RATIFIED · 2026-06-09 · this folder supersedes everything else in this repo.**
Everything under `archive/` is exploration history — the 49-brick lab, old sandboxes, the
direction comparisons. Quarry it, don't extend it.

## Contents

| File | What it is |
|---|---|
| `DECISIONS.md` | 13 ratified decisions, each with what was rejected and why. Read first. |
| `DESIGN.md` | The design system contract: tokens, type, surfaces, signature rules, motion, anti-patterns. |
| `tokens.css` | Tailwind 4 `@theme` — drop into the poker repo at `src/styles/tokens.css`. |
| `index.html` | Living specimen page (open in a browser). |
| `reference/Command Desk R.html` | **The pixel reference.** When prose and pixels disagree, pixels win. |
| `reference/sketches/` | Late-stage sketches kept for quarrying (proof modules, candidate switcher). |

## Next step

Open the **poker repo** (github.com/m-scorza/poker) in **Claude Code**:

1. Copy `DECISIONS.md` + `DESIGN.md` → `docs/design/`, `tokens.css` → `src/styles/`.
2. Import tokens in the root stylesheet: `@import "tailwindcss"; @import "./tokens.css";`
3. Follow the porting map in DESIGN.md, step 1 (chassis + kickers) with
   `reference/Command Desk R.html` open in a browser beside you.

The identity in one line: **a precision instrument — quiet ink chassis, hairlines not boxes,
color is meaning (green = money, red-family = bleeding by intensity, violet = you), one jewel
per screen, five functional motion moments.**
