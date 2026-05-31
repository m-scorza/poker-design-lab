// Horizontal nav page switching with skew/slide loader sweep.
import gsap from 'gsap';
import { scrambleText } from './scramble.js';
import { animateRangeGridFades } from './ranges.js';
import { resizeFeltCanvas } from './arena.js';

export function initTransitions() {
  const navLinks = document.querySelectorAll('.mast-nav a');
  const slideLoader = document.getElementById('slide-loader');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (link.classList.contains('on')) return;

      const targetTab = link.getAttribute('data-tab');
      const activePage = document.querySelector('.page.active');
      const targetPage = document.getElementById(`page-${targetTab}`);

      if (!targetPage || !activePage) return;

      navLinks.forEach(l => l.classList.remove('on'));
      link.classList.add('on');

      gsap.fromTo(slideLoader, { left: '-100%' }, {
        left: '100%',
        duration: 0.7,
        ease: "power2.inOut",
        onStart: () => {
          gsap.to(activePage, {
            x: -120,
            skewX: 8,
            opacity: 0,
            duration: 0.35,
            ease: "power2.in",
            onComplete: () => {
              activePage.classList.remove('active');
              activePage.style.display = 'none';

              targetPage.style.display = 'block';
              targetPage.classList.add('active');

              gsap.fromTo(targetPage,
                { x: 120, skewX: -8, opacity: 0 },
                { x: 0, skewX: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
              );

              const headerTitle = targetPage.querySelector('h1, h2.kick, span.kick');
              if (headerTitle) {
                scrambleText(headerTitle.id || '', headerTitle.innerText, 0.5);
              }

              if (targetTab === 'ranges') {
                animateRangeGridFades();
              } else if (targetTab === 'arena') {
                resizeFeltCanvas();
              }
            }
          });
        }
      });
    });
  });
}
