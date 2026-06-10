# Brick Curation — product role + performance verdict

**Purpose:** the catalog has 48 bricks. Volume ≠ progress. This pass asks two questions per brick
that the `Status` column (keep/new/refine/cut lifecycle) doesn't answer:

1. **Role** — does it have a real home in the app, or is it decoration?
2. **Perf** — does it actually perform well?

These are recommendations with reasoning. The taste calls are yours to override — the point is to
stop treating "we built a thing" as "we shipped product value."

## Role vocabulary

| Tag | Meaning |
|---|---|
| **CORE** | Already lives in (or obviously belongs in) a real results page. Encodes poker meaning. |
| **WIRE** | Genuinely useful, has an obvious product home, **not yet wired in** — worth pulling forward. |
| **CATALOG** | Legit style/showcase option. Fine to keep in the catalog, but it is **not** product progress. |
| **CUT** | Gimmick or redundant. Demote to catalog-only at best, or drop. |

Perf: ✅ cheap · ⚠️ watch (continuous rAF / scroll / GSAP / 1 backdrop-filter) · 🔴 heavy (WebGL / always-on canvas / stacked backdrop-filter).

---

## The keepers (CORE) — these are the product

| Brick | Role | Perf | Note |
|---|---|---|---|
| range-grid-action | CORE | ✅ | Folded into Ranges. The single most important poker surface. |
| leak-card-gauge | CORE | ⚠️ 1 bd | Folded into Leaks. Value-vs-target is the leak language. |
| leak-heatmap | CORE | ✅ | Folded into Leaks. |
| career-arc | CORE | ✅ | Folded into Career. |
| abi-evolution | CORE | ✅ | Folded into Career. |
| calendar-heatmap | CORE | ✅ | Folded into Sessions. |
| odometer-statcard | CORE | ✅ | Folded into Desk. Count-up is tasteful, not gimmick. |
| radar-hud | CORE | ✅ | Desk HUD rings. |
| verdict-card | CORE | ✅ | The "30-second answer." Real product idea. |
| villain-badge | CORE | ⚠️ 1 bd | Folded into Villains. |
| card-render | CORE | ✅ | Deck primitive used by every poker brick. Foundational. |
| hand-replay-felt | CORE | ✅ | The HandReplay modal target — a real planned feature. |

## Useful but not wired (WIRE) — pull these into pages next

| Brick | Role | Perf | Where it belongs |
|---|---|---|---|
| modal-glass | WIRE | ⚠️ bd | Import-confirm / discard dialogs. Blob-safe pattern already proven. |
| toast-stack | WIRE | ✅ | "Analysis complete", "import failed" — real app events. |
| command-palette | WIRE | ✅ | ⌘K nav/jump. Genuinely high-utility, low-cost. |
| tooltip-popover | WIRE | ✅ | Stat-tile tooltips + "why flagged" popovers. Real teaching surface. |
| skeleton-shimmer | WIRE | ✅ | Loading states for the data tables. |
| progress-cinematic | WIRE | ✅ | The hand-history import bar (app already has a loader to replace). |
| drawer-slide | WIRE | ⚠️ bd | Hand-explorer filter panel. |
| blocker-simulator | WIRE | ⚠️ | Real analysis tool, not decoration. |
| equity-bar | WIRE | ✅ | All-in spot analysis — concrete poker value. |
| position-stats-heatmap | WIRE | ✅ | Belongs on Leaks / a Stats page. |
| trendline-morph | WIRE | ⚠️ gsap | Bankroll trend; overlaps career-arc — pick one per page. |
| variance-graph | WIRE | ✅ | Career/Desk variance story (actual vs EV). |
| scroll-reveal | WIRE | ✅ | Page-entry choreography utility. |
| type-switcher | WIRE | ✅ | This *is* the font-dock concept — see TYPOGRAPHY.md. |

## Style options (CATALOG) — keep, but they are not progress

| Brick | Role | Perf | Note |
|---|---|---|---|
| aurora-bg | CATALOG | ⚠️ | Optional background mood. |
| spinners | CATALOG | ✅ | Pick **one** for the app; the other 7 are a showroom. |
| spotlight-card | CATALOG | ✅ | Could be wired as the card hover style if we want flair. |
| tilt | CATALOG | ✅ | Tasteful, but no strong product home. |
| button-glow / magnetic-button | CATALOG | ✅ | Choose **one** CTA treatment; don't ship three. |
| scramble | CATALOG | ⚠️ | Headline accent at most. |
| tournament-lab-shell | CATALOG | ✅ | Alternate full-app layout direction; the live shell already exists. |

## Candy / redundant (CUT or accept catalog-only) — be honest

| Brick | Verdict | Why |
|---|---|---|
| cyber-btn | CUT → catalog-only | Most gimmicky button set; clashes with the editorial tone. |
| replayer | CUT / merge | Overlaps **hand-replay-felt**. Two card-deal replayers is one too many — keep the felt one. |
| cli-panel | CATALOG-only | Fun retro terminal, but no product home. Stop counting it as progress. |
| blueprint-theme | CATALOG-only | A theme *direction*, not a component. |
| split-flap | CATALOG-only | Charming, but a stat that flaps is novelty unless one specific hero number wants it. |
| cursor-trail | CATALOG-only | The plain `follower` already covers the live cursor; the trail is flair. |
| parallax-depth | CATALOG-only | Hero candy. Only earns a home if we build a long-form editorial opener. |
| sticky-stack | CATALOG-only | Nice for a Career milestone walk-through; otherwise decoration. |
| shader-bg | CATALOG-only · 🔴 | Beautiful WebGL, but the heaviest thing in the lab. Never the default bg. |

---

## Performance — the three real costs (you asked "do they perform well")

1. **Always-on canvas mesh** (`background.html` / the live `#fluid-canvas`) runs a continuous rAF on
   every page. It's the persistent baseline cost. Fine on a laptop, first thing to kill on a weak GPU.
2. **`shader-bg` (WebGL)** 🔴 — gorgeous, but it's a fragment shader. Keep it a deliberate opt-in
   background, never the default.
3. **`backdrop-filter` × 41 across 29 files.** One blurred panel composites cheaply; the risk is the
   dense dashboard pages stacking several blurred panels *over* the canvas mesh. Audit per page —
   many panels could be a solid translucent fill instead of a live blur with no visible loss.

Everything else (count-ups, SVG charts, IntersectionObserver reveals, the overlay/loader bricks) is
cheap. The candy bricks with scroll/rAF (`parallax-depth`, `sticky-stack`, `cursor-trail`) are ⚠️ but
minor — they just shouldn't run on every page.

## So what

- **Wire the WIRE set** (overlays + loaders + the new poker/data-viz bricks) into real pages — that's
  where the next genuine product value is, not in brick #49.
- **Cut/merge** `replayer` into `hand-replay-felt`; demote `cyber-btn`; accept `cli-panel`,
  `blueprint-theme`, and the candy as **catalog-only** (stop scoring them as progress).
- **Pick one** spinner, one CTA, one bankroll-trend per page — duplicates are showroom, not system.
- **Perf:** keep WebGL + multi-blur off the default render path; the mesh is the one always-on cost.
