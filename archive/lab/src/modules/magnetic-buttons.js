// Noomo-style magnetic button hover: buttons elastically pull toward the cursor.
// Pairs with the CSS glow bloom in styles/button-glows.css — same selector set, so
// hovering a primary button shows both effects at once.
import gsap from 'gsap';

const SELECTOR = '.dock-btn, .btn-replay, .ranges-tab-btn, .btn-reset-db, .btn-trainer-act';
const STRENGTH = 0.25;

export function initMagneticButtons() {
  const bound = new WeakSet();
  // Lazily bind the first time a matching button is hovered (covers buttons
  // rendered after boot, e.g. replay buttons in the hands list).
  document.addEventListener('pointerover', (e) => {
    const btn = e.target.closest && e.target.closest(SELECTOR);
    if (!btn || bound.has(btn)) return;
    bound.add(btn);
    attachMagnetic(btn);
  });
}

function attachMagnetic(btn) {
  btn.addEventListener('pointermove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * STRENGTH, y: y * STRENGTH, duration: 0.3 });
  });
  btn.addEventListener('pointerleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  });
}
