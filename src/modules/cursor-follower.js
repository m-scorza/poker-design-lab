// Lerping cursor follower halo that swells over interactive elements.
import gsap from 'gsap';

let follower = null;

function onEnter() {
  gsap.to(follower, { width: 44, height: 44, duration: 0.3 });
}
function onLeave() {
  gsap.to(follower, { width: 20, height: 20, duration: 0.3 });
}

export function updateFollowerTriggers() {
  if (!follower) return;
  const hoverElements = document.querySelectorAll(
    '.mast-nav a, .stat-trigger, .timeline-row-editorial, .matrix-cell-node, .ix-name, .pos-select-btn, .btn-replay, .btn-trainer-act, button, a'
  );
  hoverElements.forEach(el => {
    el.removeEventListener('mouseenter', onEnter);
    el.removeEventListener('mouseleave', onLeave);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
  });
}

export function initCursorFollower() {
  follower = document.getElementById('cursor-follower');
  if (!follower) return;

  let mX = -100, mY = -100;
  let fX = -100, fY = -100;

  document.addEventListener('mousemove', (e) => {
    mX = e.clientX;
    mY = e.clientY;
  });

  gsap.ticker.add(() => {
    fX += (mX - fX) * 0.15;
    fY += (mY - fY) * 0.15;
    gsap.set(follower, { x: fX, y: fY });
  });

  updateFollowerTriggers();
}
