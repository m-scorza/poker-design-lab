// Sessions timeline row expansion drawers.
import gsap from 'gsap';

export function initSessions() {
  const sessionRows = document.querySelectorAll('.timeline-row-editorial');
  sessionRows.forEach(row => {
    row.addEventListener('click', () => {
      const drawerId = row.getAttribute('data-drawer');
      if (!drawerId) return;
      const drawer = document.getElementById(drawerId);
      if (!drawer) return;

      const isActive = drawer.classList.contains('active');

      document.querySelectorAll('.editorial-expand-panel').forEach(d => {
        if (d !== drawer && d.classList.contains('active')) {
          gsap.to(d, {
            height: 0, opacity: 0, duration: 0.3, onComplete: () => {
              d.classList.remove('active');
              d.style.display = 'none';
            }
          });
        }
      });

      if (!isActive) {
        drawer.style.display = 'block';
        gsap.fromTo(drawer, { height: 0, opacity: 0 }, {
          height: 'auto', opacity: 1, duration: 0.4, ease: "power2.out",
          onStart: () => drawer.classList.add('active')
        });
      } else {
        gsap.to(drawer, {
          height: 0, opacity: 0, duration: 0.3, onComplete: () => {
            drawer.classList.remove('active');
            drawer.style.display = 'none';
          }
        });
      }
    });
  });
}
