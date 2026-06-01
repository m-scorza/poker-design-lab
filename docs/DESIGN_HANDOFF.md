# DESIGN_HANDOFF.md — Poker Analyzer Prototyping Showcase Handoff

This file logs the design-specific status and transitions of the visual prototyping files inside `c:\Users\MICRO\Downloads\poker 2 try (4)\`.

---

## 1. Directory Context & Gating Rules
*   **Active Prototyping Project:** Multi-module Vite ESM application inside `c:\Users\MICRO\Downloads\poker 2 try (4)\`.
*   **HTML Entry Points:** [index.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/index.html) (main unified sandbox) and [elements.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/elements.html) (element catalog).
*   **Git Repository Protection:** **DO NOT** touch or commit inside `c:\Users\MICRO\OneDrive\Documentos\GitHub\poker`. All progress logs and notes remain strictly in this downloads directory to honor constraints.

---

## 2. Stateful Refactoring & Content Upgrades

Every tab layout now features fully stateful, high-fidelity components, wired to a centralized, reactive state manager ([src/state.js](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/src/state.js)):

### 1. Desk (Overview) — `overview.html` & `radar.js`
*   **Reactive Filters:** Added a session selector dropdown that dynamically transitions concentric HUD stats, bankroll trendline charts, positional heatmaps, and leak alert cards.

### 2. Player Career — `career.html` & `career.js`
*   **Tab System:** Structured 4 sub-tabs (Overview, Tiers & Formats, Nemesis & Opponents, High Impact Hands).
*   **Interactive Heatmap:** A 7x24 Day/Hour session density grid showing hover tooltips with volume and profitability.
*   **Replay Integration:** Wired top hands to launch the felt replayer modal.

### 3. Session History — `sessions.html` & `sessions.js`
*   **Dynamic Trendlines:** Added a mini cumulative BB progression SVG line chart inside each expanded drawer. Auto-scales data ranges, positions the zero-line baseline dynamically, and changes color depending on winning vs. losing outcomes.
*   **CSV/PDF Export Simulator:** Wired export buttons to a modal containing a compilation CLI log simulator, an animated progress bar, and a success state with a downloadable file blob trigger.

### 4. Hands Archive — `hands.html` & `hands.js`
*   **Parser Upload Simulator:** Drop/click zone simulates line-by-line parsing of PokerStars text files, outputting detailed tokenizing, encoding, and range-checking logs before appending new hands to the state and table.
*   **Step-by-Step Felt Replayer:** Walk-through simulator stepping through streets (Preflop ➔ Flop ➔ Turn ➔ River) with dynamic, non-clashing community cards, pot size accumulation, active seat glows, and street-specific GTO coach tips.
*   **Database Sync & Resets:** Wired the reset button to restore the initial database state cleanly.

### 5. Leaks Inspector — `leaks.html` & `leaks.js`
*   **Target Range Bars:** Visual sliding scale indicating target GTO zones vs. user actual values, repositioning dynamically on leak row selection.
*   **Incident Drawers:** Collapsible index rows containing detailed SVG distribution histograms and lists of associated hands with launchable replayer shortcuts.

### 6. Ranges Lab — `ranges.html` & `ranges.js`
*   **Grid Editor:** Toggling "Edit Range" enables clicking cells in the 13x13 preflop matrix to cycle states (Always Open, Mix, Fold), dynamically updating combo calculations and VPIP stats in real-time.
*   **Solver Delta Validation Sync:** Editing ranges updates the progress bars and delta labels (OK, Wide, Tight) in the right-pane validation ledger in real-time.
*   **Solver Overlay:** A toggle checkbox highlights solver deviation cells with a blinking red outline animation.

### 7. Villain Dossier — `villains.html` & `villains.js`
*   **Two-Pane View:** Left side is a searchable/filterable opponent grid; clicking a card opens details on the right.
*   **Auto-save dossier notes:** Note inputs automatically save to the state database on input/blur, showing a flashing green "Saved" status alert.
*   **Tag Multi-selector:** pre-defined tags toggle active classes on click, and custom tags can be typed in and added dynamically.

### 8. Arena Trainer — `arena.html` & `arena.js`
*   **Infinite Scenario Generator:** Dealt card values/suits are generated dynamically alongside position matchups UTG through BB.
*   **Felt Visuals:** Displays Hero's hole cards on the table, highlights active seats (Hero and Opener), and adjusts pot displays dynamically.
*   **Scoreboards & Logs:** Tracks streak stats and displays correct/incorrect details in a scrollable log.

---

## 3. Technical Verification
*   **Vite Build Check:** Bundles compile successfully with zero errors or asset gaps:
    ```bash
    npm run build
    ✓ built in 2.46s
    ```
*   **Local Readiness:** Development server runs at `http://localhost:5173/` and catalog page is available at `http://localhost:5173/elements.html`.
