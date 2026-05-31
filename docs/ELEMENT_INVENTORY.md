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
| 13×13 range matrix | `src/pages/ranges.html`, `src/pages/leaks.html` | Ranges sketch |
| Sessions expandable rows | `src/pages/sessions.html`, `src/modules/sessions.js` | Sessions sketch |
| Villains dossier grid | `src/pages/villains.html`, `src/modules/villains.js` | Villains sketch |
| Arena 3D felt trainer | `src/pages/arena.html`, `src/modules/arena.js` | Arena sketch |

## Archive-only (NOT in the current system — preserved, pull forward on demand)

These were earlier design *directions* that the unified v4 intentionally did not carry (per
`docs/lessons_learned.md`: consolidating into one layout stripped their personality). They remain fully
intact and openable.

| Element | Where it lives now | Notes / how to revive |
|---|---|---|
| **WebGL cinematic shader background** (cursor-tracking indigo light + brass glow, DPR-capped) | `archive/legacy_dashboards/shader-bg.js` | Richer than the current 2D canvas mesh. Self-mounting `<script>`. Could become a new `src/elements/shader-bg.html` + module. |
| **Scroll-reveal** (fade/rise blocks into view) | `archive/legacy_dashboards/shader-bg.js` | Bundled in shader-bg.js; not in v4 (sandbox has no scroll). |
| **CLI / terminal "retro" theme** (command-line parser panel) | `archive/sandboxes/design_sandbox.html`, `_v2.html`, `_v3.html`; `archive/legacy_dashboards/Dashboard v8.html`, `Dashboard Directions v2.html` | A whole alternate theme personality. Not represented in the obsidian/ultraviolet dock. |
| **Blueprint / CAD theme** (crosshair guideline tracker) | `archive/sandboxes/design_sandbox_v2.html`, `_v3.html` | Alternate "drafting grid" direction. |
| **Day/Hour heatmap** | `archive/sketches/Leaks.html`, `Sessions.html`; `archive/legacy_dashboards/Tournament Lab - System.html` | Referenced in career.html as a stub; full heatmap widget lives only in sketches. |
| **Tournament Lab system layout** | `archive/legacy_dashboards/Tournament Lab - System.html` | A distinct full-system layout direction. |
| **Three.js usage** | `archive/broadsheet/Dashboard - Broadsheet.html` | Broadsheet referenced three.js; v4 dropped it (unused). |

## Reconciliation status

- Every original file is captured in the **baseline git commit** and relocated (not deleted) into `archive/`.
- The *carried-forward* set is what the Vite build assembles today.
- The *archive-only* set is a backlog of design directions available to re-modularize when desired — none
  are lost.
