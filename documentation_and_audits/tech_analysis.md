# Technical Analysis: Web Libraries, APIs, & Mechanics
**Redesign Audit for Awwwards Reference Implementations**

This document details the exact engineering mechanics behind the references you provided, answering:
1. **What libraries and tools power these sites?**
2. **How do they work under the hood?**
3. **Can they be achieved in flat, static HTML/CSS/JS files?**

---

## 1. Interaction & Library Mapping

| Reference Site | Key UI Element | Primary Library / Technology | How it Works Under the Hood |
| :--- | :--- | :--- | :--- |
| **Predictive World** | Data Circle / Concentric HUD Rings | **SVG + GSAP** (WebGL / Canvas overlay) | Concentric circular SVG paths are animated by altering the CSS `stroke-dashoffset` property over time. Particle systems inside use a 2D/3D Canvas context with coordinate mapping. |
| **Clock Strikes Twelve** | Glitch Load & Text Streams | **Vanilla JS + CSS Custom Properties** | Animation frames scramble character strings (`A-Z, 0-9`) at high speeds before settling on target words. Glitch overlays use CSS `clip-path` animation loops. |
| **Noomo Agency** | Magnetic Hover & Tactile Buttons | **GSAP (quickTo) or Math.JS** | A custom mouse-move event listener calculates the distance between the cursor and button center. The button is translated towards the cursor using elastic bezier easing. |
| **Midwam** | Cinematic Loading Animation | **Three.js + GLSL Shaders** | Renders 3D models (compiled GLTF format) inside a WebGL context. Custom GLSL vertex and fragment shaders compile directly on the GPU to draw real-time glows and blooms. |
| **Locomotive R** | Inertia Smooth Scroll | **Lenis or Locomotive Scroll** | Custom scroll listener intercepts mousewheel events, calculates target scroll coordinates using linear interpolation (`lerp`), and slides the main wrapper smoothly. |
| **Nowy Teatr** | Vertical Typography Calendar | **CSS Grid + GSAP ScrollTrigger** | Employs CSS Flexbox/Grid structures. Entrance animations are triggered by monitoring scroll viewport coordinates using GSAP's scroll intersection API. |

---

## 2. Deep Dive: Can Static HTML Do This?

**Yes.** "Static HTML" simply means the files are served directly to the browser without a dynamic backend (like Node, Rails, or PHP) rebuilding them on the fly. 

To run these high-end animations in a static HTML file, we link the relevant libraries via **CDN script tags** in the `<head>` of our files. We do not need a complex framework (like React or Next.js) or a build tool (like Vite or Webpack) to run them.

Here is the exact technical blueprint for our prototype options:

### A. The Core Animation Engine: GSAP (GreenSock)
* **What it does:** Standard library for Awwwards animations. Handles sub-pixel rendering, timeline nesting, and hardware-accelerated transforms.
* **CDN Link:** `<script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/gsap.min.js"></script>`
* **Usage:** Orchestrates text scrambles, loading timelines, and sliding page transitions.

### B. Smooth Inertia Scrolling: Lenis
* **What it does:** Lightweight library that overrides standard browser scroll-stuttering to create the fluid Locomotive-r feel.
* **CDN Link:** `<script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0/styled/lenis.min.js"></script>`
* **Usage:** Smooths out vertical layouts (like the calendar) and scroll entry animations.

### C. 3D Elements & Visualizers: Three.js
* **What it does:** WebGL wrapper. Allows us to load 3D objects, configure cameras, adjust real-time lighting, and write custom shaders.
* **CDN Link:** `<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>`
* **Usage:** Essential if we want the 3D chip stacks or interactive spatial graphs.

---

## 3. Concrete Code Recipes (Sandbox Drafts)

Below are the exact JS/CSS mechanics we will build into the sandbox to prove these effects.

### Recipe 1: Noomo-Style Magnetic Hover (Elastic Physics)
To make a button track the cursor elastically, we intercept the mouse position relative to the button center and apply interpolation:

```javascript
const button = document.querySelector('.magnetic-btn');

button.addEventListener('mousemove', (e) => {
  const rect = button.getBoundingClientRect();
  // Find the button's center point
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  // Move the button slightly toward the cursor (strength factor: 0.3)
  gsap.to(button, {
    x: x * 0.3,
    y: y * 0.3,
    duration: 0.3,
    ease: "power2.out" // Elastic exit curve
  });
});

button.addEventListener('mouseleave', () => {
  // Snap back to origin
  gsap.to(button, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
});
```

### Recipe 2: Predictive-World HUD Data Circle (SVG Offsets)
We manipulate the dash array of an SVG circle. By calculating the ratio of VPIP/PFR, we draw the circle segments smoothly:

```html
<svg viewBox="0 0 100 100" class="hud-circle">
  <!-- Gray background circle -->
  <circle cx="50" cy="50" r="40" stroke="#16181f" stroke-width="2" fill="none" />
  <!-- Neon cyan interactive circle -->
  <circle cx="50" cy="50" r="40" class="hud-value" stroke="#F76CFE" stroke-width="2" fill="none" 
          stroke-dasharray="251.2" stroke-dashoffset="251.2" stroke-linecap="round" />
</svg>

<script>
  // Math: Circumference of r=40 is 2 * PI * 40 = 251.2
  function updateHUDRing(percentage) {
    const ring = document.querySelector('.hud-value');
    const offset = 251.2 - (percentage / 100) * 251.2;
    
    gsap.to(ring, {
      strokeDashoffset: offset,
      duration: 1.5,
      ease: "power3.out"
    });
  }
</script>
```
