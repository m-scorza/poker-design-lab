// Cinematic loader 00->100, then reveals the app and seeds the HUD rings.
import gsap from 'gsap';
import { initHUDRings } from './radar.js';

export function initLoader() {
  const loader = document.getElementById('loader');
  const loaderPct = document.getElementById('loader-pct');
  const loaderFill = document.getElementById('loader-fill');
  const loaderStatus = document.getElementById('loader-status');
  if (!loader) return;

  let pctObj = { val: 0 };
  gsap.to(pctObj, {
    val: 100,
    duration: 1.8,
    ease: "power2.out",
    onUpdate: () => {
      const formatted = Math.floor(pctObj.val).toString().padStart(2, '0');
      loaderPct.innerText = formatted;
      loaderFill.style.width = `${pctObj.val}%`;

      if (pctObj.val > 30) loaderStatus.innerText = "PARSING HAND HISTORY";
      if (pctObj.val > 70) loaderStatus.innerText = "CALCULATING SOLVER DELTAS";
    },
    onComplete: () => {
      loaderStatus.innerText = "READY";
      gsap.to(loader, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.5,
        delay: 0.2,
        onComplete: () => {
          loader.classList.add('done');
          initHUDRings();
        }
      });
    }
  });
}
