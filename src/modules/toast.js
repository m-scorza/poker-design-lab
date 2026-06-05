// Toast stack notification module
const DURATION = 4000;
const ICOS = {
  success: '✓',
  error: '!',
  info: 'i',
  warn: '▲'
};

export function spawnToast(kind, title, msg) {
  const host = document.getElementById('toast-host');
  if (!host) return;

  const t = document.createElement('div');
  t.className = `toast ${kind}`;
  t.innerHTML =
    `<span class="ico">${ICOS[kind] || 'i'}</span>` +
    `<div class="body"><div class="title">${title}</div><div class="msg">${msg}</div></div>` +
    `<span class="close">✕</span>` +
    `<span class="timer"></span>`;
  host.appendChild(t);

  const timer = t.querySelector('.timer');
  timer.style.animation = `timer-run ${DURATION}ms linear forwards`;
  let killAt = setTimeout(() => dismiss(t), DURATION);

  // Pause on hover
  t.addEventListener('mouseenter', () => {
    clearTimeout(killAt);
    timer.style.animationPlayState = 'paused';
  });

  t.addEventListener('mouseleave', () => {
    timer.style.animationPlayState = 'running';
    const computed = window.getComputedStyle(timer);
    const transform = computed.transform || computed.webkitTransform;
    let remaining = 1;
    if (transform && transform !== 'none') {
      const values = transform.split('(')[1].split(')')[0].split(',');
      const a = parseFloat(values[0]);
      if (!isNaN(a)) remaining = a;
    }
    killAt = setTimeout(() => dismiss(t), DURATION * remaining);
  });

  t.querySelector('.close').addEventListener('click', () => {
    clearTimeout(killAt);
    dismiss(t);
  });
}

function dismiss(toast) {
  if (toast.dataset.leaving) return;
  toast.dataset.leaving = '1';
  toast.classList.add('leaving');
  toast.addEventListener('animationend', () => toast.remove(), { once: true });
}

// Attach it to window so we can trigger from anywhere if needed
window.spawnToast = spawnToast;
