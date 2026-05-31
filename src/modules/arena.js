// 3D felt arena GTO trainer: drills, hologram deal, magnetic + marquee drift.
import gsap from 'gsap';
import trainerDrills from '../data/arena-drills.json';

export function resizeFeltCanvas() {
  const feltCanvas = document.getElementById('arena-felt-canvas');
  if (!feltCanvas || !feltCanvas.parentElement) return;
  feltCanvas.width = feltCanvas.parentElement.clientWidth;
  feltCanvas.height = feltCanvas.parentElement.clientHeight;
}

export function initArena() {
  const arenaStage = document.getElementById('arena-stage');
  const arenaFelt = document.getElementById('arena-felt');
  const trainerFeedback = document.getElementById('trainer-feedback');
  const arenaScore = document.getElementById('arena-score');
  const trainerHandNode = document.getElementById('trainer-current-hand');

  const feltCanvas = document.getElementById('arena-felt-canvas');
  if (!feltCanvas) return;

  resizeFeltCanvas();
  window.addEventListener('resize', resizeFeltCanvas);

  if (arenaStage && arenaFelt) {
    arenaStage.addEventListener('mousemove', (e) => {
      const rect = arenaStage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const angleX = 32 - (y / rect.height) * 3.5;
      const angleY = (x / rect.width) * 4.5;

      gsap.to(arenaFelt, { rotateX: angleX, rotateY: angleY, duration: 0.4 });
    });

    arenaStage.addEventListener('mouseleave', () => {
      gsap.to(arenaFelt, { rotateX: 32, rotateY: 0, duration: 0.8 });
    });
  }

  let scoreCorrect = 0;
  let scoreTotal = 0;
  let currentDrillIndex = 0;

  const actButtons = document.querySelectorAll('.btn-trainer-act');
  actButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const chosenAct = btn.getAttribute('data-act');
      const drill = trainerDrills[currentDrillIndex];
      const isCorrect = chosenAct === drill.correct;

      if (isCorrect) scoreCorrect++;
      scoreTotal++;
      arenaScore.innerText = `${scoreCorrect} / ${scoreTotal}`;

      if (isCorrect && chosenAct === 'raise') {
        dealHologramCard(feltCanvas.width / 2, feltCanvas.height / 2);
      }

      trainerFeedback.className = `trainer-feedback-overlay ${isCorrect ? 'correct' : 'incorrect'}`;
      document.getElementById('feedback-title').innerText = isCorrect ? 'CORRECT' : 'DEVIATION';
      document.getElementById('feedback-desc').innerText = drill.note;
      trainerFeedback.classList.add('active');

      setTimeout(() => {
        trainerFeedback.classList.remove('active');
        advanceDrill();
      }, 1800);
    });
  });

  function advanceDrill() {
    currentDrillIndex = (currentDrillIndex + 1) % trainerDrills.length;
    const nextDrill = trainerDrills[currentDrillIndex];
    trainerHandNode.innerText = nextDrill.hand;
  }

  function dealHologramCard(tx, ty) {
    const card = document.createElement('div');
    card.className = 'hologram-deal-card';
    card.innerHTML = `<span>A</span><span class="suit">♠</span>`;
    card.style.left = '50%'; card.style.top = '50%';
    card.style.transform = 'translate(-50%, -50%) scale(0) rotate(180deg)';
    arenaStage.appendChild(card);

    gsap.to(card, {
      left: tx - 10, top: ty - 40, scale: 1, rotation: 0, duration: 0.6,
      onComplete: () => {
        setTimeout(() => {
          gsap.to(card, { opacity: 0, scale: 0.4, duration: 0.4, onComplete: () => card.remove() });
        }, 1200);
      }
    });
  }

  // Magnetic button hover
  setupMagnetic('btn-reset-db');
  function setupMagnetic(elemId) {
    const elem = document.getElementById(elemId);
    if (!elem) return;
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(elem, { x: x * 0.25, y: y * 0.25, duration: 0.3 });
    });
    elem.addEventListener('mouseleave', () => {
      gsap.to(elem, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
  }

  // Marquee drift velocity (overview page)
  const statsMarquee = document.getElementById('stats-marquee');
  const track1 = document.getElementById('marquee-track-1');

  if (statsMarquee && track1) {
    let isHovered = false;
    let isExpanded = false;
    let mousePct = 0.5;
    let xOffset = 0;

    statsMarquee.addEventListener('mouseenter', () => isHovered = true);
    statsMarquee.addEventListener('mouseleave', () => {
      isHovered = false;
      mousePct = 0.5;
    });
    statsMarquee.addEventListener('mousemove', (e) => {
      const rect = statsMarquee.getBoundingClientRect();
      mousePct = (e.clientX - rect.left) / rect.width;
    });

    statsMarquee.addEventListener('click', () => {
      isExpanded = !isExpanded;
      if (isExpanded) {
        statsMarquee.classList.add('expanded');
        track1.style.transform = 'none';
      } else {
        statsMarquee.classList.remove('expanded');
      }
    });

    function marqueeTick() {
      if (isExpanded) {
        requestAnimationFrame(marqueeTick);
        return;
      }

      let speed = -0.4;

      if (isHovered) {
        if (mousePct < 0.3) {
          speed = -((0.3 - mousePct) / 0.3) * 1.6;
        } else if (mousePct > 0.7) {
          speed = ((mousePct - 0.7) / 0.3) * 1.6;
        } else {
          speed = 0;
        }
      }

      xOffset += speed;
      const halfWidth = track1.scrollWidth / 2;
      if (halfWidth > 0) {
        if (xOffset <= -halfWidth) xOffset += halfWidth;
        if (xOffset >= 0) xOffset -= halfWidth;
        track1.style.transform = `translateX(${xOffset}px)`;
      }

      requestAnimationFrame(marqueeTick);
    }
    marqueeTick();
  }
}
