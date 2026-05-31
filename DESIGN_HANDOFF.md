# DESIGN_HANDOFF.md — Poker Analyzer Prototyping Showcase Handoff

This file logs the design-specific status and transitions of the visual prototyping files inside `c:\Users\MICRO\Downloads\poker 2 try (4)\`.

---

## 1. Directory Context & Gating Rules
*   **Active Unified Sandbox:** [design_sandbox_v4.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/design_sandbox_v4.html) (Unified Horizontal Masthead layout + Ticker + Switches).
*   **Backup Sandbox:** [design_sandbox_v3.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/design_sandbox_v3.html) (Collapsible sidebar layout).
*   **Git Repository Protection:** **DO NOT** touch or commit inside `c:\Users\MICRO\OneDrive\Documentos\GitHub\poker`. All progress logs and notes remain strictly in this downloads directory.

---

## 2. Status of `design_sandbox_v4.html` Prototypes

We have successfully built and verified the unified design, incorporating the layout, navigation, typography, and interactive features from the Broadsheet ("THE LEDGER") and Obsidian sandboxes:

### Horizontal Layout Shell & Core Navigation
*   **Masthead Topbar:** High-contrast horizonal header nav bar containing tabs (Desk, Career, Sessions, Hands, Leaks, Ranges, Villains, Arena) matching the actual React TS page structure.
*   **Live news-ticker ("The Wire"):** Continuous horizontal ticker tape below the dateline displaying cashouts, leak alerts, and prey metrics, pausing immediately on cursor hover.
*   **3D Skew Swapping Page Transitions:** Navigating skews pages by `8deg` / `-8deg`, swept by a colored loading progress line (`#slide-loader`), and scrambles header titles.
*   **Persistent Wave Background:** Waving organic mesh grid canvas lines in the background.

### Independent Showcase Theme Switches
A glass-morphism panel floats in the bottom-right corner, letting you toggle variables independently:
1.  **Color Switch:** Swaps document attribute `data-color` between `obsidian` (coal-black, neon lime, cyan) and `ultraviolet` (violet-black, deep ultraviolet, rose-red). Concentric rings, poker chips, and canvas grid lines adapt colors automatically.
2.  **Font Switch:** Swaps document attribute `data-font` between `geometric` (Outfit/Inter/JetBrains Mono) and `editorial` (Bricolage Grotesque/Hanken Grotesk/Space Mono).

### Fully Interactive Tab Pages
*   **Desk (Overview):** Monument lifetime net profit card, interactive concentric HUD rings with radar sweep, chip stacks, stack depth bands, and top blockers.
*   **Career:** Progressive `THE ARC` chart with hover node tooltips, stakes evolution list, and cash achievement timelines.
*   **Sessions:** Table grid of session buy-ins/compliance. Clicking a row expands the timeline card with a GSAP height transition showing Nemesis profiles and consistency graphs.
*   **Hands (Mock Database & Replayer Modal):**
    *   Dropdown filters (Position, Compliance, Scenario) dynamically slice a mock hands database.
    *   Clicking "Replay" on any hand triggers a modal popup window showing cards being dealt on a mini felt.
*   **Leaks (Interactive Ledger):** ranked Leak Index table at the bottom. Clicking a leak dynamically transitions the main "Headline Incident" block and adjacent 13x13 preflop matrix to display that leak's specific statistics and ranges.
*   **Ranges:** 13x13 preflop matrix workspace, position selector buttons, and solver delta validator lists.
*   **Villains:** Opponents card grid showing observed hands, type classification badges, and exploit advice note-cards.
*   **Arena:** Interactive calmed 3D felt GTO trainer game with scoreboards, deals cards, floating chips, and compliance answers.

---

## 3. Technical Verification
*   **Mismatched Tag Check:** Validation parser script `verify_v4.py` executed successfully, reporting 0 syntax errors or unbalanced tags.
*   **Local Readiness:** You can open [design_sandbox_v4.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/design_sandbox_v4.html) in any browser to review the visual aesthetics and calibrated switches.

---

## 4. Maintenance Notes & Hotfixes
*   **JavaScript Syntax Blocker Resolved:** Fixed an unquoted numeric-prefixed key syntax issue (`3bet:`) in the circles HUD configuration on line 2847. By quoting the key as `'3bet':`, the JavaScript engine parse error was resolved, allowing the telemetry loading screen to animate past `00` to `100` and unlock the interface.
*   **JS Block Validation:** Added a Node.js verification script (`check_js_syntax.js`) to parse all inline HTML `<script>` tags. The check successfully confirms syntax validity across all script blocks.
