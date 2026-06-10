# Implementation Plan — Unified Poker Prototyping Sandbox v4

We will build a unified design showcase sandbox in [design_sandbox_v4.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20%284%29/design_sandbox_v4.html) inside `c:\Users\MICRO\Downloads\poker 2 try (4)\`. This prototype merges the layout structure, horizontal masthead, typography, and narrative elements of **Dashboard - Broadsheet.html** with the interactive tabs, HUD stats, calmed 3D felt, and 3D skew transitions of **Dashboard v8** and **design_sandbox_v3.html**.

---

## Proposed Changes

### [New] [design_sandbox_v4.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20%284%29/design_sandbox_v4.html)

This file will contain the comprehensive design system, CSS styling, structural markup for the 8 pages, and all interactive JavaScript telemetry, canvas wave rendering, and event handlers.

#### 1. Page Header (Masthead & Persistent elements)
*   **Masthead:** High-end horizontal header with typography logo ("THE LEDGER / Poker Analyzer"), dateline bar (hands volume, tournaments cash ratios), and horizontal navigation links (Desk, Career, Sessions, Hands, Leaks, Ranges, Villains, Arena).
*   **The Wire:** Horizontal ticker tape scrolling dynamically right below the dateline bar, persistent across all screens.
*   **Slide-Loader Line:** The colored transition line (`#slide-loader`) that sweeps across the screen when changing tabs.

#### 2. Floating Theme Controls Dock
*   A glass panel floating in the bottom-right corner hosting two switches:
    *   **Color Toggle:** Switches body `data-color="obsidian"` (charcoal/lime/cyan) vs `data-color="ultraviolet"` (violet/rose).
    *   **Font Toggle:** Switches body `data-font="geometric"` (Outfit/Inter/JetBrains Mono) vs `data-font="editorial"` (Bricolage Grotesque/Hanken Grotesk/Space Mono).

#### 3. Page Layouts & Simulated Content
*   **Desk (Overview):**
    *   Left side: Monument lifetime net profit counter (`+$388.85`) with trends.
    *   Center: Concentric ring HUD rings (VPIP, PFR, 3-Bet) with active radar sweep and click indicators.
    *   Right side: SVG stacked poker chips visualizers, stack depth bands, and top blocker leak cards.
*   **Career:**
    *   Wide SVG path progression chart (`THE ARC`) with cashes/milestones tooltip indicators.
    *   Finish distribution graphs (Bust Out), ABI stakes evolution, and chronological achievement feed.
*   **Sessions:**
    *   Volume journal table representing calendar sessions. Clicking a row expands the card with a GSAP height-animation revealing session predators, GTO consistency bars, and session alerts.
*   **Hands:**
    *   Interactive table list showing hand cards, scenarios, and stakes. Dropdown filter selections for Position, Scenario, Compliance, and Stack.
    *   **Replay Modal:** Clicking a hand's "Replay" action triggers a modal popup window dealing out cards on a mini felt table.
*   **Leaks:**
    *   Bottom: Ranked Leak Index ledger table.
    *   Top: Headline Incident block (e.g. *"The button is bleeding"*) showing the specific deviation, cost, target numbers, and adjacent Range Matrix that updates dynamically when a leak is selected.
*   **Ranges:**
    *   Interactive 13x13 RFI range matrix. Position selector chips (`UTG` to `BB`) and scenarios (`RFI` vs `Facing Raise`). Validator tables listing delta comparisons against solver ranges.
*   **Villains:**
    *   Obsidian-glass card grid representing player profiles (Loose Aggressive, Tight Passive, Solid Regs) with exploit dossiers, stats, notes, and notes tagging overlays.
*   **Arena:**
    *   The complete GTO Trainer game: 3D perspective felt table, dealer card dealings, bet connections, Fold/Call/Raise actions, scoreboards, and compliance feedback.

#### 4. JavaScript Logic & Animation Systems
*   **GSAP Page Swaps:** Skews pages by `-8deg` / `8deg` and slides them out of view while sliding the target page in with reverse skew. Triggers scramble effects on headers.
*   **Grid CSS Variables System:** Define semantic variables (`--bg`, `--accent`, `--sans`) inside CSS to change the visual theme instantaneously by swapping body attributes.
*   **Wave Mesh Background:** Render fluid waving network canvas lines in the background. Colors adjust dynamically when the theme changes.
*   **Hands Filtering & Modal Dealing:** Programmatic data filtering based on dropdown selections. Modal deals cards by scaling and translating cards from center deck positions.
*   **Leaks Matrix Switching:** Update cell class states of the 13x13 range grid on the Leaks tab dynamically.

---

## Verification Plan

### Manual Verification
1.  Open [design_sandbox_v4.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20%284%29/design_sandbox_v4.html) in Chrome/Firefox.
2.  Test the floating bottom-right controls panel to verify that Color Scheme and Typography switches can be toggled independently.
3.  Click navigation tabs and verify the skew slide loader colored bar transitions.
4.  Test leak index clicks on the Leaks tab to verify the range matrix updates.
5.  Test hands table filters and the "Replay" popup cards dealer animation.
6.  Play a drill in the Arena tab to verify trainer score updates and calmed 3D felt tilt.
7.  Check tag carousels at the bottom of the overview dashboard to verify hover velocity drift and tag morphing.
