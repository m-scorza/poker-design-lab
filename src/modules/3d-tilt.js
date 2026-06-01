// Calmed 3D perspective tilt on cards.
import gsap from 'gsap';

function onMouseMove(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const xc = rect.width / 2;
  const yc = rect.height / 2;

  const divisor = card.classList.contains('opponent-dossier-card') ? 250 : 180;

  const angleX = (yc - y) / divisor;
  const angleY = (x - xc) / divisor;

  gsap.to(card, {
    rotationX: angleX,
    rotationY: angleY,
    transformPerspective: 1200,
    ease: "power2.out",
    duration: 0.3
  });
}

function onMouseLeave(e) {
  gsap.to(e.currentTarget, {
    rotationX: 0,
    rotationY: 0,
    ease: "power2.out",
    duration: 0.5
  });
}

export function initCardTilt() {
  const cards = document.querySelectorAll('.card, .opponent-dossier-card');
  cards.forEach(card => {
    card.removeEventListener('mousemove', onMouseMove);
    card.removeEventListener('mouseleave', onMouseLeave);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });
}
