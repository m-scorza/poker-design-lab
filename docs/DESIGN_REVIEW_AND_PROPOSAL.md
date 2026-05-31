# DESIGN_REVIEW_AND_PROPOSAL.md — Steering the Unified Poker Analyzer Design

This document reviews **Dashboard v8** (the sidebar obsidian architecture), **Dashboard - Broadsheet.html** (the new "Ultraviolet" editorial theme), and the actual **React TypeScript pages** to outline a blueprint for a unified, high-fidelity web application design.

---

## 1. Visual Theme Audit & Convergence

We have two distinct design language directions in the design sandbox folder:

### A. Dashboard v8 (Obsidian Glow Theme)
*   **Structure:** Desktop application layout with a fixed collapsible sidebar (`aside.sb`), topbar path breadcrumbs, filter segment control, and scrollable main content frame.
*   **Colors:** Deep charcoal `#07080b` / void black `#010103` background, white text, lime-green neon accent (`--c-lime: #C1FF12`), and subtle magenta/cyan highlights.
*   **Aesthetics:** Flat obsidian-glass cards with subtle glowing borders, 4x-calmed mouse-tracking tilt effects, and rounded grid elements.

### B. Dashboard - Broadsheet / The Ledger (Ultraviolet Editorial Theme)
*   **Structure:** Newspaper broadsheet editorial layout, top horizontal navigation masthead, horizontal lines (hairlines) partitioning space instead of boxy containers.
*   **Colors:** Deep monochrome violet-black (`--bg: #08060f`), monochrome white/lavender text, rich ultraviolet (`#8b6cff`), and rose-red (`#ff5c8a`) for losses.
*   **Aesthetics:** Heavy focus on premium typography (`Bricolage Grotesque` for large display numbers/headings, `Space Mono` for tables/labels, `Hanken Grotesk` for reading text), horizontal ticker-tape scroll ("The Wire"), and narrative-driven headings ("The button is bleeding.").

### The Convergence Proposal: "Editorial Obsidian"
We will combine the best of both worlds:
1.  **Layout Chrome:** Retain the sidebar chrome and topbar selector structure of **Dashboard v8** for seamless multi-page switching.
2.  **Typography & Spacing:** Adopt the broadsheet's high-contrast editorial typography (`Bricolage Grotesque` for headers, `Space Mono` for stats/tables) and hairlines to give a premium print-journal feel inside the app container.
3.  **Narrative Leak Callouts:** Replace standard alerts with broadsheet-style bold headlines (e.g., *"The button is bleeding."*) that immediately explain the technical issue in plain English.

---

## 2. Component Mapping: What Belongs on Which Page

By cross-referencing the React TypeScript codebase (`src/pages/`) with the design prototypes, we can organize all widgets into their correct contexts:

| Page in App | Source TS File | Broadsheet / v8 Equivalent Component | Key Metrics & Widgets |
| :--- | :--- | :--- | :--- |
| **Dashboard** | `DashboardPage.tsx` | `THE MONUMENT` & `HEADLINE INCIDENT` | **Overview Snapshot:** Lifetime Net PnL, ITM Rate, ROI, and Concentric Ring HUD (VPIP, PFR, 3-Bet). A highlight card of the **Top Leak** (the story) with its mini Range Matrix and "Review Hands" CTA. |
| **Career** | `CareerPage.tsx` | `THE ARC` & Finish Charts | **Historical Narrative:** Cumulative progression trend line, ABI stake evolution, tournament finish distribution chart, day/hour heatmap, and cash achievement timeline. |
| **Sessions** | `SessionsPage.tsx` | `THE WIRE` & Session Cards | **Temporal Flow:** Live session event ticker tape at the top, followed by a historical session feed showing date, buy-ins, duration, bb/100, GTO compliance scores, and expandable predator/nemesis profiles. |
| **Leaks** | `LeaksPage.tsx` | `THE LEAK INDEX` & Priorities | **The To-Do List:** Complete prioritized ranked table of all leaks. Expanding a row reveals sample hands, deviation percentages, BB/100 dollar cost, and a concrete "Fix this now" instruction. |
| **Ranges** | `RangesPage.tsx` | Range Matrix Workspace | **Theoretical Drill:** Full-width range matrix. Position selector chips (`UTG` to `BB`) and scenarios (`RFI` vs. `Facing Raise`). Validation tables comparing player ranges against solver ranges. |
| **Villains** | `VillainsPage.tsx` | Opponents Obsidian Grid | **Player Intelligence:** Opponent table and dossier cards (LAGs, TAGs, Nits) showing exploit strategies, observed hands, VPIP/PFR gaps, and custom tags/notes. |
| **Arena** | `ArenaPage.tsx` | Calmed 3D Felt | **Interactive Trainer:** Interactive 3D poker table displaying hole cards, position, and stack. Training drills (Fault Fixer, RFI Master) with instant GTO compliance feedback. |

---

## 3. Detailed Page-by-Page Evolving Directions

### 1. Dashboard (`DashboardPage.tsx`)
*   **The Problem:** The current v8 overview has too much duplicate visual noise (the KPI strip carousels and stack bands compete with the HUD).
*   **The Evolution:** Clean this page up. Put `THE MONUMENT` (lifetime profit) and the Concentric Ring HUD front-and-center. Below it, show a single prominent "Headline Incident" (explaining your #1 leak in editorial text, with the 13x13 grid showing the offending hands). This makes the dashboard tell a clear story instead of showing a wall of numbers.

### 2. Career (`CareerPage.tsx`)
*   **The Problem:** Currently, career progression charts are squished into dashboard cards.
*   **The Evolution:** Elevate `THE ARC` chart. Place it in a wide layout representing career growth. Include finish position distribution charts (Bust Out chart) and the chronological achievement feed (e.g. *First cash*, *Biggest win*) which makes the player feel like they are progressing through a career ladder.

### 3. Sessions (`SessionsPage.tsx`)
*   **The Problem:** Sessions page lacks life and continuity.
*   **The Evolution:** Place a slow-rolling horizontal scan ticker tape, `The Wire`, at the top of the sessions view showing real-time hand-by-hand alerts or recent session outcomes. In the list below, when a session row is expanded, display detailed cards for:
    1.  **Session Nemesis:** Who took the most BBs from you.
    2.  **GTO Consistency:** Progress bars for C-bet and WTSD.
    3.  **Session Intelligence:** AI feedback on your discipline.

### 4. Leaks (`LeaksPage.tsx`)
*   **The Problem:** Standard leak widgets are passive and don't provide immediate action.
*   **The Evolution:** Structure this as a clean, ranked broadsheet ledger (`THE LEAK INDEX`). Ranking rows by total BB/100 cost, with a highlighted "Start Here" banner targeting the #1 leak. Each card must have a bold "Fix this now" block mapped to strategic advice.

### 5. Ranges (`RangesPage.tsx`)
*   **The Problem:** Changing positions in the matrix causes sudden jumps, and custom range saving is hidden.
*   **The Evolution:** Provide a workspace layout with position selector chips (`UTG` to `BB`) and scenario buttons (`RFI` vs `Facing Raise`). Embed the Range Validator tables (Solver % vs. Ours % delta) directly below the matrix to show range accuracy.

### 6. Villains (`VillainsPage.tsx`)
*   **The Problem:** The retro console windows look out of place.
*   **The Evolution:** Move to a clean glass grid card style. Toggling a villain open displays a detail overlay card showing VPIP/PFR/AF stats, tags (e.g., "overfolds turn"), custom notes, and a dedicated "Exploit Strategy" box telling you exactly how to play against them.

---

## 4. Open Design Questions for Discussion

To align our steering direction, here are the key visual decisions we should make:

1.  **Color Scheme Priority:** Do we prefer the **Ultraviolet/Rose** broadsheet color scheme (monochrome violet-black background with neon violet accents and rose-red markers) or the **Obsidian/Lime** color scheme (near-black with neon lime and cyan accents)?
2.  **Typography Selection:** Should we integrate the broadsheet's high-character typography (like `Bricolage Grotesque` and `Space Mono`) into the actual app, or keep the geometric sans-serif styling (`Outfit` and `Inter`) used in `design_sandbox_v3.html`?
3.  **Layout Structure:** Do you want to keep the fixed app sidebar layout (`aside.sb`) or shift to a clean broadsheet header navigation layout (`mast-nav`) for the entire application?
