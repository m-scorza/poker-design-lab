# Lessons Learned: Design Prototyping & Sandbox Consolidation

During the process of consolidating and remodeling the design sandboxes, several critical UI engineering and product prototyping lessons were learned:

---

## 1. Design Novelty vs. Unified Architecture
*   **The Issue:** Consolidating four distinct sandbox prototypes into a single "6-screen sidebar" layout stripped them of their original, unique personality. Even with color changes, they ended up looking and feeling like the same template (the same cards, buttons, and layout).
*   **The Lesson:** For UI/UX brainstorming, visual layout diversity is more valuable than architectural consistency. Different design concepts should use radically different layouts (e.g. split consoles, floating desktop panes, drafting grids, or newspaper articles) rather than forcing everything into a standard sidebar dashboard.

## 2. JavaScript Script Execution & DOM Loading Order
*   **The Issue:** Running scripts or assigning event listeners on elements globally in a `<script>` block before the elements themselves are parsed in the DOM results in `Cannot read properties of null (reading 'addEventListener')` errors.
*   **The Lesson:** Always wrap DOM selection and listener bindings inside a `DOMContentLoaded` event listener or place script blocks at the absolute bottom of the document to ensure the DOM is fully loaded.

## 3. Hoisting and Temporal Dead Zone (TDZ)
*   **The Issue:** Declaring constants or block-scoped variables using `const` or `let` and referencing them in wrapper definitions (e.g., `const oldSwitchTab = switchTab;`) before the original initialization throws uncaught `ReferenceError: Cannot access before initialization` crashes in the browser.
*   **The Lesson:** Ensure variables are fully declared and assigned before they are referenced. Avoid wrapping or overriding global functions dynamically if their definitions can be structured cleanly.

## 4. Keeping Prototypes Independent
*   **The Issue:** Premature optimization and bundling of code components can obscure the distinct interactive behaviors that make each prototype valuable (e.g., the CLI console parser in the retro theme, the CAD guideline tracker in the blueprint theme).
*   **The Lesson:** Allow prototypes to remain standalone and rough around the edges to serve their purpose for design brainstorming, rather than forcing them to align with a production-like structure.
