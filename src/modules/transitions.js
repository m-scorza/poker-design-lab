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
              
              // Find and hide cards initially for stagger reveal
              const cards = targetPage.querySelectorAll('.card');
              gsap.set(cards, { opacity: 0, y: 15 });

              // Prepend skeleton shimmer overlay
              const skeletonOverlay = document.createElement('div');
              skeletonOverlay.className = 'skeleton-shimmer-overlay';
              
              if (targetTab === 'overview' || targetTab === 'career') {
                skeletonOverlay.innerHTML = `
                  <div class="sk line w30" style="height: 20px; margin-bottom: 20px;"></div>
                  <div class="skeleton-stat-grid">
                    <div class="skeleton-stat-tile"><div class="sk line w50"></div><div class="sk line w70" style="height:24px"></div></div>
                    <div class="skeleton-stat-tile"><div class="sk line w40"></div><div class="sk line w60" style="height:24px"></div></div>
                    <div class="skeleton-stat-tile"><div class="sk line w60"></div><div class="sk line w50"></div></div>
                    <div class="skeleton-stat-tile"><div class="sk line w30"></div><div class="sk line w80"></div></div>
                  </div>
                  <div class="sk" style="height: 180px; width: 100%; flex: 1; border-radius: var(--r-lg);"></div>
                `;
              } else if (['hands', 'sessions', 'leaks', 'villains'].includes(targetTab)) {
                skeletonOverlay.innerHTML = `
                  <div class="sk line w40" style="height: 20px; margin-bottom: 20px;"></div>
                  <div class="skeleton-trow"><div class="sk line w50" style="margin:0"></div><div class="sk line w70" style="margin:0"></div><div class="sk line w30" style="margin:0"></div><div class="sk line w40" style="margin:0"></div></div>
                  <div class="skeleton-trow"><div class="sk line w60" style="margin:0"></div><div class="sk line w90" style="margin:0"></div><div class="sk line w50" style="margin:0"></div><div class="sk line w30" style="margin:0"></div></div>
                  <div class="skeleton-trow"><div class="sk line w40" style="margin:0"></div><div class="sk line w50" style="margin:0"></div><div class="sk line w40" style="margin:0"></div><div class="sk line w60" style="margin:0"></div></div>
                  <div class="skeleton-trow"><div class="sk line w50" style="margin:0"></div><div class="sk line w60" style="margin:0"></div><div class="sk line w30" style="margin:0"></div><div class="sk line w50" style="margin:0"></div></div>
                `;
              } else {
                skeletonOverlay.innerHTML = `
                  <div class="sk line w50" style="height: 24px; margin-bottom: 24px;"></div>
                  <div class="sk line w90"></div>
                  <div class="sk line w80"></div>
                  <div class="sk line w70"></div>
                `;
              }
              
              targetPage.style.position = 'relative';
              targetPage.appendChild(skeletonOverlay);

              gsap.fromTo(targetPage,
                { x: 120, skewX: -8, opacity: 0 },
                { x: 0, skewX: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
              );

              // Fade out and remove skeleton after 300ms
              gsap.to(skeletonOverlay, {
                opacity: 0,
                duration: 0.25,
                delay: 0.35,
                ease: "power2.inOut",
                onComplete: () => {
                  skeletonOverlay.remove();
                  
                  // Stagger reveal page cards
                  if (cards.length > 0) {
                    gsap.to(cards, {
                      opacity: 1,
                      y: 0,
                      duration: 0.5,
                      stagger: 0.05,
                      ease: "power2.out",
                      clearProps: "transform,opacity"
                    });
                  }

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
        }
      });
    });
  });
}
