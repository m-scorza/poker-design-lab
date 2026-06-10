// 3D felt arena GTO trainer: infinite preflop scenario generator
import gsap from 'gsap';

const RFI_POSITIONS = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const suits = ['♠', '♥', '♦', '♣'];

// GTO open ranges for RFI evaluation
const RFI_ranges = {
  UTG: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', 'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'AKo', 'AQo', '66', '55', 'A9s', 'A5s', 'A4s', 'KTs', 'QJs', 'JTs', 'AJo', 'KQo'],
  HJ: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'KQs', 'KJs', 'KTs', 'QJs', 'JTs', 'AKo', 'AQo', 'AJo', '55', 'A8s', 'A7s', 'A5s', 'K9s', 'QTs', 'Q9s', 'J9s', 'T9s', '98s', 'ATo', 'KQo', 'KJo'],
  CO: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'KQs', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'Q9s', 'JTs', 'J9s', 'T9s', '98s', '87s', 'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo', '44', '33', '22', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'K8s', 'K7s', 'Q8s', 'J8s', 'T8s', '76s', '65s', 'A9o', 'KTo', 'QJo', 'JTo'],
  BTN: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'QJs', 'QTs', 'Q9s', 'JTs', 'J9s', 'T9s', 'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo', 'KTo', '66', '55', 'K7s', 'K6s', 'Q8s', 'J8s', 'T8s', '98s', '87s', '76s', 'A9o', 'A8o', 'KQo', 'QJo', 'JTo'],
  SB: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'AKo', 'AQo', 'AJo', '55', '44', 'A7s', 'A5s', 'A4s', 'K9s', 'Q9s', 'J9s', 'T9s', '98s', '87s', 'ATo', 'KQo', 'KJo'],
  BB: ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AQs', 'AKo', 'AQo', '99', '88', 'AJs', 'ATs', 'KQs', 'AJo', 'KQo']
};

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
  const holeCardsContainer = document.getElementById('arena-hole-cards');

  const feltCanvas = document.getElementById('arena-felt-canvas');
  if (!feltCanvas) return;

  resizeFeltCanvas();
  window.addEventListener('resize', resizeFeltCanvas);

  // Parallax marquee drift on tilt
  if (arenaStage && arenaFelt) {
    arenaStage.addEventListener('mousemove', (e) => {
      const rect = arenaStage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const angleX = 32 - (y / rect.height) * 1.5;
      const angleY = (x / rect.width) * 1.8;

      gsap.to(arenaFelt, { rotateX: angleX, rotateY: angleY, duration: 0.4 });
    });

    arenaStage.addEventListener('mouseleave', () => {
      gsap.to(arenaFelt, { rotateX: 32, rotateY: 0, duration: 0.8 });
    });
  }

  let scoreCorrect = 0;
  let scoreTotal = 0;
  let currentStreak = 0;
  let bestStreak = 0;
  let timeLimit = 'off';
  let timerInterval = null;
  let secondsRemaining = 0;
  let historyLog = [];

  let currentScenario = null;

  function updateStreakHUD() {
    const streakVal = document.getElementById('arena-streak-val');
    const bestStreakVal = document.getElementById('arena-best-streak-val');
    if (streakVal) streakVal.innerText = currentStreak;
    if (bestStreakVal) bestStreakVal.innerText = bestStreak;
  }

  function logAction(isCorrect, hand, action, correctAction) {
    const logContainer = document.getElementById('arena-history-log');
    if (!logContainer) return;
    
    const statusText = isCorrect ? '<span style="color:var(--accent-2); font-weight:700;">[OK]</span>' : '<span style="color:var(--loss); font-weight:700;">[DEV]</span>';
    const detail = `${hand} — ${action.toUpperCase()} ${isCorrect ? '' : `(GTO: ${correctAction.toUpperCase()})`}`;
    
    historyLog.unshift(`${statusText} ${detail}`);
    if (historyLog.length > 3) historyLog.pop();

    logContainer.innerHTML = historyLog.map(item => `
      <div style="font-family: var(--mono); font-size: 9.5px; line-height: 1.4; border-bottom: 1px solid rgba(255,255,255,0.03); padding: 4px 0;">
        ${item}
      </div>
    `).join('');
  }

  function startTimer() {
    clearInterval(timerInterval);
    const timerLabel = document.getElementById('arena-timer-countdown');
    if (!timerLabel) return;
    
    if (timeLimit === 'off') {
      timerLabel.innerText = '';
      return;
    }

    secondsRemaining = parseInt(timeLimit);
    timerLabel.innerText = `${secondsRemaining}s`;

    timerInterval = setInterval(() => {
      secondsRemaining--;
      timerLabel.innerText = `${secondsRemaining}s`;

      if (secondsRemaining <= 0) {
        clearInterval(timerInterval);
        handleTimeout();
      }
    }, 1000);
  }

  function handleTimeout() {
    currentStreak = 0;
    updateStreakHUD();
    
    scoreTotal++;
    arenaScore.innerText = `${scoreCorrect} / ${scoreTotal}`;

    logAction(false, currentScenario.hand.notation, 'expired', currentScenario.correct);

    trainerFeedback.className = 'trainer-feedback-overlay incorrect';
    document.getElementById('feedback-title').innerText = 'TIME EXPIRED';
    document.getElementById('feedback-desc').innerText = 'Decide within the shot clock limit!';
    trainerFeedback.classList.add('active');

    setTimeout(() => {
      trainerFeedback.classList.remove('active');
      dealNextScenario();
    }, 1800);
  }

  function dealRandomHand() {
    const type = ['pair', 'suited', 'offsuit'][Math.floor(Math.random() * 3)];
    let r1, r2, s1, s2;
    
    if (type === 'pair') {
      r1 = r2 = ranks[Math.floor(Math.random() * ranks.length)];
      s1 = suits[Math.floor(Math.random() * suits.length)];
      do {
        s2 = suits[Math.floor(Math.random() * suits.length)];
      } while (s1 === s2);
    } else {
      const idx1 = Math.floor(Math.random() * ranks.length);
      let idx2;
      do {
        idx2 = Math.floor(Math.random() * ranks.length);
      } while (idx1 === idx2);
      
      const sortedIdx = [idx1, idx2].sort((a, b) => a - b);
      r1 = ranks[sortedIdx[0]];
      r2 = ranks[sortedIdx[1]];
      
      if (type === 'suited') {
        s1 = s2 = suits[Math.floor(Math.random() * suits.length)];
      } else {
        s1 = suits[Math.floor(Math.random() * suits.length)];
        do {
          s2 = suits[Math.floor(Math.random() * suits.length)];
        } while (s1 === s2);
      }
    }

    let rangeNotation = '';
    if (r1 === r2) {
      rangeNotation = r1 + r2;
    } else {
      rangeNotation = r1 + r2 + (type === 'suited' ? 's' : 'o');
    }

    return {
      c1: { val: r1, suit: s1 },
      c2: { val: r2, suit: s2 },
      notation: rangeNotation
    };
  }

  function generateScenario() {
    const handObj = dealRandomHand();
    const heroPos = RFI_POSITIONS[Math.floor(Math.random() * RFI_POSITIONS.length)];
    const isRfi = (heroPos !== 'BB') && (Math.random() > 0.4); // 60% RFI if not BB
    
    let setupText = '';
    let correctAct = 'fold';
    let opponentPos = '';
    
    if (isRfi) {
      setupText = `Folds to you. Hero is in ${heroPos}.`;
      const rfiList = RFI_ranges[heroPos];
      if (rfiList.includes(handObj.notation)) {
        correctAct = 'raise';
      } else {
        correctAct = 'fold';
      }
    } else {
      // Facing Open scenario
      const heroIdx = RFI_POSITIONS.indexOf(heroPos);
      let openerIdx = 0;
      if (heroIdx > 0) {
        openerIdx = Math.floor(Math.random() * heroIdx);
      }
      opponentPos = RFI_POSITIONS[openerIdx];
      setupText = `${opponentPos} opens 2.2x. Hero is in ${heroPos}.`;
      
      const premium = ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AKo'];
      const callDefend = ['99', '88', '77', '66', '55', '44', '33', '22', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s', '98s', '87s', 'AQo', 'AJo', 'KQo'];
      
      if (premium.includes(handObj.notation)) {
        correctAct = 'raise'; // 3bet
      } else if (callDefend.includes(handObj.notation)) {
        if (heroPos === 'BB') {
          correctAct = 'call'; // defend BB
        } else if (heroPos === 'SB') {
          correctAct = Math.random() > 0.5 ? 'raise' : 'fold';
        } else {
          correctAct = 'call';
        }
      } else {
        correctAct = 'fold';
      }
    }
    
    return {
      hand: handObj,
      pos: heroPos,
      isRfi,
      opener: opponentPos,
      setup: setupText,
      correct: correctAct
    };
  }

  function updateFeltSeats() {
    if (!currentScenario) return;
    
    const heroPos = currentScenario.pos;
    
    // Map seat elements
    const seats = document.querySelectorAll('.hologram-seat');
    seats.forEach((seat, index) => {
      const seatNum = index + 1;
      const seatRole = RFI_POSITIONS[index];
      
      // Update name text
      const nameSpan = seat.querySelector('.name');
      const isHero = seatRole === heroPos;
      
      nameSpan.innerText = `${seatRole}${isHero ? ' (Hero)' : ''}`;
      
      // Reset highlights and tags
      seat.classList.remove('hero', 'active-seat', 'opener-seat');
      seat.style.borderColor = '';
      seat.style.boxShadow = '';
      
      if (isHero) {
        seat.classList.add('hero', 'active-seat');
        seat.style.borderColor = 'var(--accent)';
        seat.style.boxShadow = '0 0 12px var(--accent-glow)';
      } else if (seatRole === currentScenario.opener) {
        seat.classList.add('opener-seat');
        seat.style.borderColor = 'var(--loss)';
        seat.style.boxShadow = '0 0 10px rgba(255, 92, 138, 0.4)';
      }
    });

    // Update Pot
    const potVal = document.querySelector('.center-pot-box .v');
    if (potVal) {
      potVal.innerText = currentScenario.isRfi ? '1.5bb' : '3.7bb';
    }
  }

  function dealNextScenario() {
    currentScenario = generateScenario();
    
    // Update labels
    trainerHandNode.innerText = currentScenario.hand.notation;
    document.querySelector('.card div p').innerText = currentScenario.setup;
    
    // Update GTO position label
    const spotLabel = document.querySelector('.card div b');
    if (spotLabel) {
      spotLabel.innerText = currentScenario.isRfi ? `${currentScenario.pos} RFI` : `${currentScenario.pos} vs ${currentScenario.opener} Open`;
    }

    // Render Hero Cards on felt
    if (holeCardsContainer) {
      const h = currentScenario.hand;
      const isRed1 = ['♥', '♦'].includes(h.c1.suit);
      const isRed2 = ['♥', '♦'].includes(h.c2.suit);
      
      holeCardsContainer.innerHTML = `
        <div class="poker-card-micro ${isRed1 ? 'red' : ''}" style="width: 44px; height: 62px; font-size: 12px; padding: 4px 6px;">
          <span>${h.c1.val}</span><span class="suit-symbol">${h.c1.suit}</span>
        </div>
        <div class="poker-card-micro ${isRed2 ? 'red' : ''}" style="width: 44px; height: 62px; font-size: 12px; padding: 4px 6px;">
          <span>${h.c2.val}</span><span class="suit-symbol">${h.c2.suit}</span>
        </div>
      `;

      // Animate dealing
      const dealtCards = holeCardsContainer.querySelectorAll('.poker-card-micro');
      gsap.set(dealtCards, { scale: 0, rotation: 90, opacity: 0 });
      gsap.to(dealtCards[0], { scale: 1, rotation: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" });
      gsap.to(dealtCards[1], { scale: 1, rotation: 0, opacity: 1, duration: 0.4, delay: 0.12, ease: "back.out(1.5)" });
    }

    updateFeltSeats();
    startTimer();
  }

  // Bind Actions Buttons
  const actButtons = document.querySelectorAll('.btn-trainer-act');
  actButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!currentScenario) return;
      clearInterval(timerInterval);

      const chosenAct = btn.getAttribute('data-act');
      const isCorrect = chosenAct === currentScenario.correct;

      if (isCorrect) {
        scoreCorrect++;
        currentStreak++;
        if (currentStreak > bestStreak) bestStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
      scoreTotal++;
      
      arenaScore.innerText = `${scoreCorrect} / ${scoreTotal}`;
      updateStreakHUD();
      logAction(isCorrect, currentScenario.hand.notation, chosenAct, currentScenario.correct);

      // Deal card effect on raise/3bet
      if (isCorrect && chosenAct === 'raise') {
        dealHologramCard(feltCanvas.width / 2, feltCanvas.height / 2);
      }

      // Display feedback
      let notes = '';
      if (currentScenario.isRfi) {
        notes = isCorrect ? `Correct! Standard raise from ${currentScenario.pos} with ${currentScenario.hand.notation}.` : `Deviation. Solver folds ${currentScenario.hand.notation} preflop in RFI from ${currentScenario.pos}.`;
      } else {
        notes = isCorrect ? `Correct. Standard defend vs ${currentScenario.opener} open.` : `Deviation. GTO strategy suggests ${currentScenario.correct.toUpperCase()} here.`;
      }

      trainerFeedback.className = `trainer-feedback-overlay ${isCorrect ? 'correct' : 'incorrect'}`;
      document.getElementById('feedback-title').innerText = isCorrect ? 'CORRECT' : 'DEVIATION';
      document.getElementById('feedback-desc').innerText = notes;
      trainerFeedback.classList.add('active');

      setTimeout(() => {
        trainerFeedback.classList.remove('active');
        dealNextScenario();
      }, 1800);
    });
  });

  // Timer Speeds setup
  const speedBtns = document.querySelectorAll('#arena-speed-selector button');
  speedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      speedBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      timeLimit = btn.getAttribute('data-time');
      startTimer();
    });
  });

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

  // Initialize
  dealNextScenario();
}
