// HUD concentric stat rings + radar sweep + stat triggers.
import gsap from 'gsap';

let circles = null;

function getCircles() {
  if (!circles) {
    circles = {
      vpip: { el: document.getElementById('ring-vpip'), max: 263.8, val: 21.8 },
      pfr: { el: document.getElementById('ring-pfr'), max: 213.6, val: 17.2 },
      '3bet': { el: document.getElementById('ring-3bet'), max: 163.3, val: 8.4 }
    };
  }
  return circles;
}

export function initHUDRings() {
  const c = getCircles();
  Object.keys(c).forEach(stat => {
    const data = c[stat];
    if (!data.el) return;
    const offset = data.max - (data.val / 100 * data.max);
    gsap.to(data.el, {
      strokeDashoffset: offset,
      duration: 1.2,
      ease: "power2.out"
    });
  });
}

export function initRadar() {
  const c = getCircles();
  const statTriggers = document.querySelectorAll('.stat-trigger');

  const radarSweep = document.getElementById('radar-sweep');
  if (radarSweep) {
    gsap.to(radarSweep, {
      rotation: 360,
      transformOrigin: '50% 50%',
      repeat: -1,
      duration: 3.5,
      ease: "none"
    });
  }

  statTriggers.forEach(trig => {
    trig.addEventListener('click', () => {
      statTriggers.forEach(t => t.classList.remove('active'));
      trig.classList.add('active');

      const stat = trig.getAttribute('data-stat');
      const valueText = trig.querySelector('.st-value').innerText;

      document.getElementById('center-lbl').innerText = stat.toUpperCase();
      document.getElementById('center-val').innerText = valueText;

      if (c[stat] && c[stat].el) {
        gsap.fromTo(c[stat].el, { strokeWidth: 4 }, { strokeWidth: 2.8, duration: 0.4 });
      }
    });
  });
}
