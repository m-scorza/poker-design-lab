# Element Inventory & Reconciliation

Purpose: a visible map of every distinctive design element across the old sandboxes vs. the current
modular set, so **nothing is silently lost**. Anything marked *archive-only* still exists verbatim under
`archive/` and can be pulled forward at any time — this table just tells you where it is.

Generated during the Vite restructure (baseline commit preserves all originals).

## Carried forward (live in the current modular system)

| Element | Current source | Originated in |
|---|---|---|
| Canvas mesh-wave background + glow orbs | `src/modules/background.js`, `src/elements/background.html` | design_sandbox v1–v3 |
| Cursor follower halo | `src/modules/cursor-follower.js`, `src/elements/follower.html` | v8, design_sandbox |
| Calmed 3D card tilt | `src/modules/3d-tilt.js`, `src/elements/tilt.html` | v8, sketches |
| Neon draw border-glow | `src/styles/glow-borders.css`, `src/elements/border-glow.html` | v8 |
| Button hover glow | `src/styles/button-glows.css`, `src/elements/button-glow.html` | v8 |
| Text scramble decoder | `src/modules/scramble.js`, `src/elements/scramble.html` | v8, design_sandbox |
| Radar HUD concentric rings + sweep | `src/modules/radar.js`, `src/elements/radar-hud.html` | Broadsheet, design_sandbox |
| Cinematic loader (00→100) | `src/modules/loader.js` | design_sandbox v3 |
| "The Wire" ticker tape | `src/styles/ticker.css` (markup in `index.html`) | Broadsheet, v8 |
| Theme dock (color + font switch) | `src/modules/theme-dock.js`, `src/styles/theme-system.css` | Broadsheet + v8 merge |
| Skew/slide page transitions | `src/modules/transitions.js` | design_sandbox v3 |
| Cards-deal replayer modal | `src/elements/replayer.html`, `src/modules/hands.js` | Hands sketch, v6 |
| Career "THE ARC" SVG chart | `src/pages/career.html` | Career sketch, Directions |
| 13×13 range matrix | `src/pages/ranges.html`, `src/pages/leaks.html` | Ranges sketch (Ranges page rebuilt B5 → Oracle/Mirror + action-distribution + master-detail insight, mirroring real `DualRangeMatrix`) |
| Sessions expandable rows | `src/pages/sessions.html`, `src/modules/sessions.js` | Sessions sketch |
| Villains dossier grid | `src/pages/villains.html`, `src/modules/villains.js` | Villains sketch (Villains page rebuilt B6 → villain-badge archetype avatars + predator/prey "Nemesis" framing modelled on real DashboardPage Nemesis block, fully tokenized + PT-BR) |
| Arena 3D felt trainer | `src/pages/arena.html`, `src/modules/arena.js` | Arena sketch |

## Catalog bricks library (showcase — `elements.html` + `src/elements/`)

Self-contained showcase bricks, each registered in the `elements.html` catalog and as a Vite build
input. **Status** is the curation handle for the later sober pass: `new` (just built, awaiting review),
`keep` (promote into a live page), `refine` (good idea, needs work), `cut` (drop). The user owns the
status calls; Claude defaults new bricks to `new`.

| Brick | File | Category | Status | Source |
|---|---|---|---|---|
| Waving Background (mesh + orbs) | `background.html` | Backgrounds | keep | carried-forward |
| OBSIDIAN Shader BG (WebGL) | `shader-bg.html` | Backgrounds | new | `archive/legacy_dashboards/shader-bg.js` |
| Aurora Field (drifting blooms) | `aurora-bg.html` | Backgrounds | new | net-new (palette-remix toggles) |
| Cursor Follower halo | `follower.html` | Cursors | keep | carried-forward |
| Button Hover Glow | `button-glow.html` | Buttons & CTAs | keep | carried-forward |
| Magnetic CTA (liquid-fill) | `magnetic-button.html` | Buttons & CTAs | new | net-new (Noomo ref) |
| Cyber Neon Buttons (4 variants) | `cyber-btn.html` | Buttons & CTAs | new | `archive/sandboxes/design_sandbox_v2.html` |
| Button FX Lab (6 treatments) | `button-fx.html` | Buttons & CTAs | new | net-new (hover/press FX) |
| 3D Perspective Tilt | `tilt.html` | Cards & Surfaces | keep | carried-forward |
| Neon Draw Border | `border-glow.html` | Cards & Surfaces | keep | carried-forward |
| Spotlight Gradient Cards | `spotlight-card.html` | Cards & Surfaces | new | net-new (cursor-tracked radial) |
| Radar HUD Rings | `radar-hud.html` | Data Viz | keep | carried-forward |
| Trendline Path Morph | `trendline-morph.html` | Data Viz | new | net-new (Antigravity) |
| Stakes ABI Evolution | `abi-evolution.html` | Data Viz | new | net-new (Antigravity) |
| Session Calendar Heatmap | `calendar-heatmap.html` | Data Viz | keep | folded into Sessions — 7×35 day/week density grid, tokenized via color-mix + hover tooltip (B3) |
| Odometer StatCards | `odometer-statcard.html` | Data Viz | keep | folded into Desk financials/chips count-up (B1) |
| Leak Cards · Gauge | `leak-card-gauge.html` | Data Viz | keep | folded into Leaks — 6 monitored-leak gauges (value-vs-target track + target tick + trend sparkline + severity rail), tokenized via `--sev` + color-mix (B4) |
| Career Arc + Milestones | `career-arc.html` | Data Viz | keep | folded into Career overview — arc curve + milestone rail + node tooltips (B2) |
| Leak × Position Heatmap | `leak-heatmap.html` | Data Viz | keep | folded into Leaks — 8×6 leak×position severity grid, tokenized (crit→loss, high→warn, med→accent-2 via color-mix) + click-to-isolate caption (B4) |
| Scroll Reveal · Fade-Up | `scroll-reveal.html` | Scroll & Choreography | new | `archive/legacy_dashboards/shader-bg.js` |
| Aa Type Switcher | `type-switcher.html` | Nav & Chrome | new | `archive/legacy_dashboards/shader-bg.js` |
| Tournament Lab Shell | `tournament-lab-shell.html` | Layout & Showcase | new | `archive/legacy_dashboards/Tournament Lab - System.html` + `v8-shell.css` |
| Text Scramble Decoder | `scramble.html` | Text FX | keep | carried-forward |
| 4-Color Card Render | `card-render.html` | Poker-Specific | new | net-new (deck primitive) |
| Range Grid · Action Distribution | `range-grid-action.html` | Poker-Specific | keep | folded into Ranges — per-cell raise/call/fold stacked fills + hover tooltip; basis for the Mirror matrix (B5) |
| Hand Replay · Felt | `hand-replay-felt.html` | Poker-Specific | new | net-new (HandReplay modal target) |
| Blocker HUD Simulator | `blocker-simulator.html` | Poker-Specific | new | net-new (Antigravity) |
| Cards Deal Replayer | `replayer.html` | Poker-Specific | keep | carried-forward |
| Villain Profile Badges | `villain-badge.html` | Poker-Specific | keep | folded into Villains — tinted archetype avatars (reg/lag/fish/nit) + telemetry + threat framing (B6) |
| Verdict Diagnosis Card | `verdict-card.html` | Poker-Specific | new | `archive/legacy_dashboards/Dashboard v7.html` |
| Retro CLI Terminal | `cli-panel.html` | Nav & Chrome | new | `archive/sandboxes/design_sandbox_v2.html` |
| Blueprint / CAD Theme | `blueprint-theme.html` | Nav & Chrome | new | `archive/sandboxes/design_sandbox_v3.html` |
| Glassmorphic Modal | `modal-glass.html` | Overlays | new | net-new (blob-safe display:none scrim + focus trap) |
| Toast Stack | `toast-stack.html` | Overlays | new | net-new (slide-in + timer-bar auto-dismiss + hover-pause) |
| Slide-in Drawer | `drawer-slide.html` | Overlays | new | net-new (filter panel; blob-safe scrim) |
| Command Palette | `command-palette.html` | Overlays | new | net-new (⌘K fuzzy filter + keyboard nav) |
| Tooltip & Popover | `tooltip-popover.html` | Overlays | new | net-new (auto-flip placement + JS rect positioning) |
| Cinematic Progress | `progress-cinematic.html` | Loaders | new | net-new (mirrors app `#loader` import bar) |
| Spinner Set | `spinners.html` | Loaders | new | net-new (8 pure-CSS indeterminate loaders) |
| Skeleton Shimmer | `skeleton-shimmer.html` | Loaders | new | net-new (shimmer placeholders + loaded-state toggle) |
| Cursor Trail + Crosshair | `cursor-trail.html` | Cursors | new | net-new (spring trail + magnetic snap + Shift crosshair lock) |
| Split-Flap Counter | `split-flap.html` | Text FX | new | net-new (airport flap digits → stat landing) |
| Char Reveal | `char-reveal.html` | Text FX | new | net-new (mask clip + pop-in + scramble settle) |
| Parallax Depth | `parallax-depth.html` | Scroll & Choreography | new | net-new (per-depth layer translate + masked reveal) |
| Sticky Stack Cards | `sticky-stack.html` | Scroll & Choreography | new | net-new (sticky pin-and-stack milestone cards) |

## Archive-only (NOT in the current system — preserved, pull forward on demand)

These were earlier design *directions* that the unified v4 intentionally did not carry (per
`docs/lessons_learned.md`: consolidating into one layout stripped their personality). They remain fully
intact and openable.

| Element | Where it lives now | Notes / how to revive |
|---|---|---|
| **WebGL cinematic shader background** (cursor-tracking indigo light + brass glow, DPR-capped) | `archive/legacy_dashboards/shader-bg.js` | ✅ **Harvested** → `src/elements/shader-bg.html` (catalog brick, status `new`). |
| **Scroll-reveal** (fade/rise blocks into view) | `archive/legacy_dashboards/shader-bg.js` | Bundled in shader-bg.js; not in v4 (sandbox has no scroll). Still to harvest. |
| **CLI / terminal "retro" theme** (command-line parser panel) | `archive/sandboxes/design_sandbox.html`, `_v2.html`, `_v3.html`; `archive/legacy_dashboards/Dashboard v8.html`, `Dashboard Directions v2.html` | ✅ **Harvested** → `src/elements/cli-panel.html` (interactive prompt, status `new`). |
| **Blueprint / CAD theme** (crosshair guideline tracker) | `archive/sandboxes/design_sandbox_v2.html`, `_v3.html` | ✅ **Harvested** → `src/elements/blueprint-theme.html` (status `new`). |
| **Day/Hour heatmap** | `archive/sketches/Leaks.html`, `Sessions.html`; `archive/legacy_dashboards/Tournament Lab - System.html` | ✅ **Harvested** (calendar variant) → `src/elements/calendar-heatmap.html` (folded into Sessions, B3). Leak×position severity grid → `src/elements/leak-heatmap.html` (folded into Leaks, B4). |
| **Tournament Lab system layout** | `archive/legacy_dashboards/Tournament Lab - System.html` | A distinct full-system layout direction. |
| **Three.js usage** | `archive/broadsheet/Dashboard - Broadsheet.html` | Broadsheet referenced three.js; v4 dropped it (unused). |

## Reconciliation status

- Every original file is captured in the **baseline git commit** and relocated (not deleted) into `archive/`.
- The *carried-forward* set is what the Vite build assembles today.
- The *archive-only* set is a backlog of design directions available to re-modularize when desired — none
  are lost.
