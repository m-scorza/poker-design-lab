// Organic grid background wave mesh (canvas). Morphs toward state.gridColor.
import { state } from '../state.js';

export function initBackground() {
  const canvas = document.getElementById('fluid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let mouse = { x: -1000, y: -1000 };
  let ripples = [];
  let currentGridColor = state.gridColor;

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.mast-nav') || e.target.closest('#theme-dock')) return;
    ripples.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.4,
      force: 25,
      speed: 12,
      alpha: 1
    });
  });

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let time = 0;
  const gridSpacing = 64;

  function animateMesh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentGridColor !== state.gridColor) {
      const curr = currentGridColor.split(',').map(Number);
      const targ = state.gridColor.split(',').map(Number);
      const next = curr.map((v, i) => Math.round(v + (targ[i] - v) * 0.08));
      currentGridColor = next.join(',');
    }

    ripples.forEach(rip => {
      rip.radius += rip.speed;
      rip.alpha = 1 - (rip.radius / rip.maxRadius);
    });
    ripples = ripples.filter(rip => rip.radius < rip.maxRadius);

    const cols = Math.ceil(canvas.width / gridSpacing) + 1;
    const rows = Math.ceil(canvas.height / gridSpacing) + 1;

    let points = [];
    for (let c = 0; c < cols; c++) {
      points[c] = [];
      for (let r = 0; r < rows; r++) {
        const baseX = c * gridSpacing;
        const baseY = r * gridSpacing;

        const wave1 = Math.sin(c * 0.15 + time * 0.02) * 8;
        const wave2 = Math.cos(r * 0.15 + time * 0.025) * 8;
        let x = baseX + wave2;
        let y = baseY + wave1;

        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 260) {
          const force = (260 - dist) / 260;
          x += (dx / dist) * force * 18;
          y += (dy / dist) * force * 18;
        }

        ripples.forEach(rip => {
          const rdx = x - rip.x;
          const rdy = y - rip.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          const delta = Math.abs(rdist - rip.radius);
          if (delta < 80) {
            const ringForce = (80 - delta) / 80;
            const push = ringForce * rip.force * rip.alpha;
            x += (rdx / rdist) * push;
            y += (rdy / rdist) * push;
          }
        });

        points[c][r] = { x, y, alpha: Math.max(0.015, 0.12 - dist / 1600) };
      }
    }

    ctx.lineWidth = 0.8;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if (c < cols - 1) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${currentGridColor}, ${Math.min(points[c][r].alpha, points[c + 1][r].alpha)})`;
          ctx.moveTo(points[c][r].x, points[c][r].y);
          ctx.lineTo(points[c + 1][r].x, points[c + 1][r].y);
          ctx.stroke();
        }
        if (r < rows - 1) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${currentGridColor}, ${Math.min(points[c][r].alpha, points[c][r + 1].alpha)})`;
          ctx.moveTo(points[c][r].x, points[c][r].y);
          ctx.lineTo(points[c][r + 1].x, points[c][r + 1].y);
          ctx.stroke();
        }
      }
    }
    time++;
    requestAnimationFrame(animateMesh);
  }
  animateMesh();
}
