# UI/UX Design Research & Deconstruction
**Project: Poker Analyzer Redesign**  
**Date: May 31, 2026**

This document serves as our shared design digest. It analyzes the visual structure, interactions, and design systems of the 14 reference websites you provided, mapping specific components to our Poker Analyzer redesign files under [poker 2 try (4)](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)).

---

## 1. Reference Breakdown & Translation Matrix

### Reference 01: Clock Strikes Twelve
* **URL:** `https://www.clockstrikestwelve.com/overview`
* **User's Note:** *"the site the projects the animations are sick"*
* **UX/UI Analysis:**
  * Uses abstract tech aesthetics: glitchy UI load states, scanning lines, real-time numerical streams, and animated counter text (e.g., `0016324864...100` progress indicators).
  * Highly typographic navigation with overlapping container layouts and non-traditional alignments.
* **Poker Redesign Translation:**
  * **Application:** Loading and data filtering states.
  * **Implementation:** When the user imports hands or switches date ranges (e.g., from "Lifetime" to "30d" on the dashboard), instead of a standard boring spinner, we can trigger a **text-scramble/binary count animation** on statistics like BB/100 and Net Profit.
  * **Target File:** [Dashboard v8.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/Dashboard%20v8.html) (metrics section) and a shared helper script.

---

### Reference 02: Nowy Teatr
* **URL:** `https://nowyteatr.org/en/kalendarz`
* **User's Note:** *"the vertical callendars are sick"*
* **UX/UI Analysis:**
  * Minimalist, highly typographic vertical timeline. Dates act as giant anchors on the left margins, and events stack in clear blocks separated by thin grid dividers.
  * Significant whitespace that allows dense data sets to feel readable and artistic.
* **Poker Redesign Translation:**
  * **Application:** Re-imagining the Sessions screen.
  * **Implementation:** Overhaul [Sessions.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/Sessions.html). Replace the plain table with a typographic timeline calendar. Big vertical dates (e.g., `OCT 23` in Syne Mono) align on the left, with profit/loss indicators represented by colored vertical bars of variable heights. Hovering zooms in on hands played during that session.
  * **Target File:** [Sessions.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/Sessions.html).

---

### Reference 03: Photon Experience
* **URL:** `https://www.awwwards.com/sites/photon-experience`
* **User's Note:** *"couldnt access the site itself but it all looks sick - also the pallette"*
* **UX/UI Analysis:**
  * Immersive WebGL-based lighting. Features dark, void-like backdrops where neon vectors and particle paths act as light sources.
  * Soft, glowing CSS drop-shadow filters and micro-borders that simulate neon tubes in a physical space.
* **Poker Redesign Translation:**
  * **Application:** Shared Design System.
  * **Implementation:** Define a palette with a `#030406` void background and apply hairline glowing borders on hover states for cards and range matrix cells using `box-shadow: 0 0 12px rgba(139,124,255,0.15)`.
  * **Target File:** [v8-shell.css](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/v8-shell.css).

---

### Reference 04: Predictive World
* **URL:** `https://www.awwwards.com/sites/predictive-world`
* **User's Note:** *"data circle animation"*
* **UX/UI Analysis:**
  * High-tech diagnostic/surveillance theme (inspired by Watch Dogs ctOS).
  * Centered on a massive "Data Circle" — concentric HUD rings made of SVG dashes that spin, pulse, and shift segments to represent multi-dimensional data inputs.
* **Poker Redesign Translation:**
  * **Application:** Verdict / Compliance HUD on the Dashboard.
  * **Implementation:** Replace the static chip stack or standard gauges with an interactive SVG "Data Circle HUD". Outer rings represent VPIP/PFR ratios, inner rings show 3-Bet frequencies. The segment sizes dynamically adjust when different metrics are active, accompanied by circular hover scanning highlights.
  * **Target File:** [Dashboard v8.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/Dashboard%20v8.html) (replacing the chip-stack container).

---

### Reference 05: Hatom
* **URL:** `https://www.hatom.com/`
* **User's Note:** *"this entire website is astonishing. dont know how it matches with our product though"*
* **UX/UI Analysis:**
  * Premium WebGL narrative, 3D assets, custom click-and-hold triggers.
  * A signature color palette using bright neon lime green (`#C1FF12`) and cyber magenta (`#F76CFE`) set against deep, desaturated dark tones.
* **Poker Redesign Translation:**
  * **Application:** App Color Theme & High-Impact Interactions.
  * **Implementation:** Clean out generic red/green poker tones. Use `#C1FF12` (Lime) for profits/ROI targets and `#F76CFE` (Cyber Magenta) for critical leaks and deviations. Introduce a "Click and Hold" button animation to trigger hand imports or diagnostic analyses.
  * **Target File:** [v8-shell.css](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/v8-shell.css) and shared UI modules.

---

### Reference 06: Noomo Agency
* **URL:** `https://noomoagency.com/`
* **User's Note:** *"button hover interaction - scroll animation - case study"*
* **UX/UI Analysis:**
  * Physical motion: elements feel tactile and spring-loaded (elastic springs, magnetic drag).
  * Buttons morph when hovered; background fills roll in like physical liquid or slide dynamically behind text.
* **Poker Redesign Translation:**
  * **Application:** Primary Interactive Triggers.
  * **Implementation:** Re-engineer the navigation rail buttons and standard button elements. Upon hover, buttons will shift slightly toward the user's cursor (magnetic cursor trap) and a springy neon background fill will glide in from the side.
  * **Target File:** [v8-shell.css](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/v8-shell.css).

---

### Reference 07: Locomotive R
* **URL:** `https://locomotive.ca/`
* **User's Note:** *"the entire thing"*
* **UX/UI Analysis:**
  * Heavy visual rhythm, fluid scroll parallax transitions, custom cursor markers.
  * Distinct layout blocks with sharp typographic scaling (oversized titles, tiny monospaced details).
* **Poker Redesign Translation:**
  * **Application:** Overall layout grids and screen entries.
  * **Implementation:** Create clean, asymmetrical card grids. Use dramatic font scaling: huge headlines for page names and tiny monospaced annotations for data points.
  * **Target File:** [v8-shell.css](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/v8-shell.css) & [Dashboard v8.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/Dashboard%20v8.html).

---

### Reference 08: Buena Suerte
* **URL:** `https://buenasuerte.cl/`
* **User's Note:** *"kinda overwhealming actually but could help"*
* **UX/UI Analysis:**
  * High-contrast brutalism. Uses flat solid panels, bold black margins (`#06060c` on `#f0f2f0` off-white), and chained scroll-triggered parallax sections.
* **Poker Redesign Translation:**
  * **Application:** "Light Mode" or High-Contrast PDF Reports.
  * **Implementation:** This aesthetic is excellent for printing range booklets or session reviews, relying on thick structural lines, solid layouts, and brutalist table designs.
  * **Target File:** [Source of Truth-print.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/Source%20of%20Truth-print.html).

---

### Reference 09: Rogue Studio
* **URL:** `https://rogue.studio/`
* **User's Note:** *"dont know exactly, but its nice"*
* **UX/UI Analysis:**
  * Monochromatic, grid-aligned desktop styling with pixelated design accents and digital nostalgia (reminiscent of early Macintosh or Amiga workstation utilities).
* **Poker Redesign Translation:**
  * **Application:** Range matrix headers and statistical indicators.
  * **Implementation:** Add delicate pixel borders or crosshair anchors on the corners of layout containers. This bridges modern cyber-style with classic command-line diagnostic tool structures.
  * **Target File:** [v8-shell.css](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/v8-shell.css) & [Ranges.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/Ranges.html).

---

### Reference 10: Alpha Tango
* **URL:** `https://www.awwwards.com/sites/alpha-tango`
* **User's Note:** *(uncommented, appreciated for sharp modern visuals)*
* **UX/UI Analysis:**
  * Sharp grid structures, premium dark backgrounds, slick media containers, and card dossier layouts.
* **Poker Redesign Translation:**
  * **Application:** Villains Profile Cards.
  * **Implementation:** Layout the [Villains.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/Villains.html) directory into dossiers: large, structured grid cards showing villain stats, note histories, and hand ranges.
  * **Target File:** [Villains.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/Villains.html).

---

### Reference 11: Format-3
* **URL:** `https://www.awwwards.com/sites/format-3`
* **User's Note:** *"all around"*
* **UX/UI Analysis:**
  * Editorial layouts with heavy typography, dynamic canvas frames, and floating modules.
* **Poker Redesign Translation:**
  * **Application:** Career Arc Report.
  * **Implementation:** Use deep editorial typography layout grids for [Career.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/Career.html) to frame profit metrics like an annual corporate report.
  * **Target File:** [Career.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/Career.html).

---

### Reference 12: MakeReign
* **URL:** `https://www.makereign.com/`
* **User's Note:** *"feels good"*
* **UX/UI Analysis:**
  * Super clean header and sidebar structures, smooth navigation sliders, clutter-free layouts.
* **Poker Redesign Translation:**
  * **Application:** Navigation Shell.
  * **Implementation:** A collapsible left sidebar rail featuring custom SVG icons that transition into micro-text labels when hovered, maintaining screen real estate for charts.
  * **Target File:** [v8-shell.css](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/v8-shell.css).

---

### Reference 13: KBS Agency Scroll Navigation
* **URL:** `https://www.awwwards.com/inspiration/scroll-navigation-kbs-agency`
* **User's Note:** *"feels amazing"*
* **UX/UI Analysis:**
  * Snapping slide mechanics and fluid transition animations between sections.
* **Poker Redesign Translation:**
  * **Application:** Tab & Page transitions.
  * **Implementation:** Slide-in page loaders when transitioning between different data screens (Dashboard, Leaks, Hands) to make the prototype feel like a cohesive, single-page application.
  * **Target File:** Global page navigation logic.

---

### Reference 14: Midwam
* **URL:** `https://www.awwwards.com/sites/midwam`
* **User's Note:** *"loading animation"*
* **UX/UI Analysis:**
  * Cinematic WebGL-based loading overlay, featuring dynamic lighting rings that bloom outwards, resolving into the branding text.
* **Poker Redesign Translation:**
  * **Application:** App Loading Sequence.
  * **Implementation:** When first loading the app, present a centered glowing circular scanner overlay that "calibrates" (animates concentric rings) before fading out to reveal the data dashboard.
  * **Target File:** [Dashboard v8.html](file:///c:/Users/MICRO/Downloads/poker%202%20try%20(4)/Dashboard%20v8.html) loader overlay.

---

## 2. Synthesis: The Combined Visual Design System

To keep the application from feeling chaotic, we will blend these references into a single cohesive system rather than using them in isolation:

```
[ Void Obsidian Base ]   -->  Deep space (#030406) & glass modules
       +
[ Hatom/Photon Accent ]  -->  Lime (#C1FF12) & Magenta (#F76CFE) glowing markers
       +
[ Predictive Circle ]    -->  Interactive diagnostic SVG HUD in the hero section
       +
[ Nowy Calendar ]        -->  Typographic vertical sessions timeline
       +
[ Noomo Interaction ]    -->  Magnetic, elastic button hover responses
```

---

## 3. Recommended Approach

Rather than code anything immediately, let's digest this step-by-step:

1. **Review and Confirm the Theme**: Read through the mapped references above. Are there any particular translations you would like to adjust?
2. **Build the Sandbox**: Once you approve the concepts, we will construct a single scratch file—e.g., `design_sandbox.html`—under the downloads folder. This will contain the visual styleguide (colors, buttons, typography, and the interactive SVG HUD circle) so we can test the layout, color balance, and animations in your browser before modifying any actual product pages.
