# Walkthrough: Unified Prototyping Showcase (v4)

We have created the new unified visual prototyping sandbox:
[design_sandbox_v4.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/design_sandbox_v4.html)

This prototype consolidates previous visual features and layouts into a single horizontal navigation broadsheet structure, adding interactive databases, modals, and theme switching controls.

---

## 1. Structural Layout & Transitions
*   **Horizontal Masthead:** Leverages the broadsheet editorial topbar layout with a structured navigation list (Desk, Career, Sessions, Hands, Leaks, Ranges, Villains, Arena) and statistical dateline metrics.
*   **Persistent Ticker ("The Wire"):** Stays globally visible right below the dateline. It scrolls a live narrative text feed of cashes, leaks, and prey alerts, pausing immediately on cursor hover.
*   **3D Skew Transitions:** Swapping tabs skews the outgoing page by `8deg` and skews the incoming page by `-8deg`, swept by a colored horizontal line (`#slide-loader`), and scrambles the main header text of the incoming page.

---

## 2. Floating Theme Controls Panel
A glass-morphism HUD widget floats in the bottom-right corner, letting you toggle variables independently:
*   **Color Switch:** Toggles between `Obsidian` (charcoal, neon lime, cyan) and `Ultraviolet` (violet-black, deep ultraviolet, rose).
*   **Font Switch:** Toggles between `Geometric` (`Outfit` display / `Inter` body / `JetBrains Mono` code) and `Editorial` (`Bricolage Grotesque` display / `Hanken Grotesk` body / `Space Mono` code).
*   **Adaptive Canvas Grid:** The waving vector net in the background dynamically morphs its line color to fit the active color scheme.

---

## 3. Page Content & Interactive Simulations

### 1. Desk (Overview)
*   Integrates the lifetime profit card, circular VPIP/PFR/3-Bet HUD rings (which adapt colors based on theme), radar sweeps, custom SVG poker chip stacks (which adapt color based on theme), stack depth bands, and top preflop leaks.
*   The bottom stats tag carousel supports slow-drift speeds, cursor proximity drift velocity, hover-pausing, and morphs into a static flex grid (hiding duplicates) when clicked.

### 2. Career
*   Features `THE ARC` (wide SVG line graph of winnings) with mouseover node tooltips, stakes ABI evolution, finish distributions, and achievement timelines.

### 3. Sessions
*   A clean table grid listing Date, Volume, Duration, Buy-ins, bb/100, and GTO compliance. Clicking a row slides down a GSAP height-animated card displaying a Session Nemesis, GTO consistency progress bars, and session alerts.

### 4. Hands (Simulated Database & Replay Felt)
*   **Interactive Filters:** Dropdown selectors let you filter a mock hands database by Position, Scenario, or Compliance (ok vs. deviations) in real time.
*   **Replay Felt Modal:** Clicking "Replay" on any hand opens a popup containing a mini poker felt that animations-deals cards (stagger-scaling and rotating card elements).

### 5. Leaks (Interactive Ledger)
*   **Ledger Index:** Lists leaks in a ranked table ledger.
*   **Headline Swap:** Clicking a leak dynamically transitions the main "Headline Incident" (the story), stats, and adjacent 13x13 range grid to display that leak's specific details.

### 6. Ranges
*   Shows a full-width 13x13 RFI range matrix, position selector buttons, and solver delta comparison tables.

### 7. Villains
*   Searchable opponent dossiers card grid with stats, labels, and floating exploit advice note-cards.

### 8. Arena
*   The interactive GTO trainer game with calmed 3D felt, dealt cards, floating chips flying to the pot, and score tracking.

---

## 4. Technical Validation
*   **HTML Structure:** Ran a syntax validator and verified that all HTML tags are balanced and clean (exit code 0).
*   **Offline CDN Fallbacks:** Defensive fallback blocks map GSAP actions to native CSS styles if the browser is offline.
