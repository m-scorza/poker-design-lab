// Simulated hands database table + replayer modal.
import gsap from 'gsap';
import { state } from '../state.js';

export function initHands() {
  const handsTableBody = document.getElementById('hands-table-body');
  const filterPos = document.getElementById('filter-position');
  const filterComp = document.getElementById('filter-compliance');
  const filterScen = document.getElementById('filter-scenario');
  const filterStack = document.getElementById('filter-stack');
  const filterSearch = document.getElementById('filter-search');

  const replayBackdrop = document.getElementById('replay-backdrop');
  const btnCloseReplay = document.getElementById('btn-close-replay');
  const card1 = document.getElementById('card-1');
  const card2 = document.getElementById('card-2');

  const uploadZone = document.getElementById('upload-zone');
  const uploadIdle = document.getElementById('upload-idle');
  const uploadActive = document.getElementById('upload-active');
  const btnResetDb = document.getElementById('btn-reset-db');

  const btnReplayPrev = document.getElementById('btn-replay-prev');
  const btnReplayNext = document.getElementById('btn-replay-next');

  // Backup original hands for resets
  const originalHandsList = [...state.hands];

  // Keep track of replayer state
  let currentStep = 0;
  let replayerHand = null;
  let boardCards = [];

  function renderHandsTable() {
    if (!handsTableBody) return;
    handsTableBody.innerHTML = '';

    const fPosition = filterPos ? filterPos.value : '';
    const fCompliance = filterComp ? filterComp.value : '';
    const fScenario = filterScen ? filterScen.value : '';
    const fStack = filterStack ? filterStack.value : '';
    const fSearch = filterSearch ? filterSearch.value.toLowerCase() : '';

    const filtered = state.hands.filter(h => {
      if (fPosition && h.pos !== fPosition) return false;
      if (fCompliance === 'ok' && !h.compliant) return false;
      if (fCompliance === 'dev' && h.compliant) return false;
      if (fScenario && h.scenario !== fScenario) return false;
      
      if (fStack) {
        const amt = parseInt(h.stack);
        if (fStack === 'short' && amt >= 17) return false;
        if (fStack === 'medium' && (amt < 17 || amt > 40)) return false;
        if (fStack === 'deep' && amt <= 40) return false;
      }

      if (fSearch && !h.cards.toLowerCase().includes(fSearch)) return false;
      return true;
    });

    filtered.forEach(h => {
      const tr = document.createElement('tr');

      const cardsSplit = h.cards.split(' ');
      const suitsMarkup = cardsSplit.map((c, i) => {
        const suit = h.suits[i];
        let sClass = 'suit-s';
        if (suit === '♥') sClass = 'suit-h';
        if (suit === '♦') sClass = 'suit-d';
        if (suit === '♣') sClass = 'suit-c';
        return `<span class="${sClass}">${c[0]}${suit}</span>`;
      }).join(' ');

      const accVal = parseInt(h.gtoAccuracy);
      let accClass = 'suit-s';
      if (accVal >= 90) accClass = 'suit-c';
      else if (accVal >= 70) accClass = 'suit-d';
      else accClass = 'suit-h';

      tr.innerHTML = `
        <td class="card-pair">${suitsMarkup}</td>
        <td style="font-family:var(--mono);">${h.pos}</td>
        <td style="font-family:var(--mono); color:var(--fg-muted);">${h.scenario.replace('_', ' ')}</td>
        <td style="font-family:var(--mono);">${h.stack}</td>
        <td style="font-family:var(--mono); text-transform:uppercase; font-weight:700;">${h.action}</td>
        <td style="font-family:var(--mono); color:var(--fg-muted);">${h.buyIn}</td>
        <td style="font-family:var(--mono);" class="${h.net.includes('+') ? 'suit-c' : 'suit-h'}">${h.net}</td>
        <td style="font-family:var(--mono);" class="${accClass}">${h.gtoAccuracy}</td>
        <td><span class="compliance-badge ${h.compliant ? 'ok' : 'dev'}">${h.compliant ? 'ok' : 'deviation'}</span></td>
        <td style="text-align:right;"><button class="btn-replay" data-id="${h.id}">Replay</button></td>
      `;
      handsTableBody.appendChild(tr);
    });

    document.querySelectorAll('.btn-replay').forEach(btn => {
      btn.addEventListener('click', () => {
        openReplayModal(btn.getAttribute('data-id'));
      });
    });
  }

  // Subscribe to state changes to update table
  state.subscribe(() => {
    renderHandsTable();
  });

  // Replayer Logic
  function openReplayModal(id) {
    replayerHand = state.hands.find(h => h.id === id);
    if (!replayerHand || !replayBackdrop) return;

    document.getElementById('replay-title').innerText = `Replaying Hand #${id}`;
    document.getElementById('replay-pos').innerText = replayerHand.pos;
    document.getElementById('replay-gto').innerText = replayerHand.compliant ? replayerHand.action.toUpperCase() : "FOLD";
    document.getElementById('replay-profit').innerText = replayerHand.net;
    document.getElementById('replay-profit').className = replayerHand.net.includes('+') ? 'suit-c' : 'suit-h';

    // Generate non-clashing board cards
    boardCards = generateBoardCards(replayerHand.cards);

    const parts = replayerHand.cards.split(' ');
    card1.innerHTML = `<span>${parts[0][0]}</span><span class="suit-symbol">${replayerHand.suits[0]}</span>`;
    card2.innerHTML = `<span>${parts[1][0]}</span><span class="suit-symbol">${replayerHand.suits[1]}</span>`;

    card1.className = `poker-card-micro ${['♥', '♦'].includes(replayerHand.suits[0]) ? 'red' : ''}`;
    card2.className = `poker-card-micro ${['♥', '♦'].includes(replayerHand.suits[1]) ? 'red' : ''}`;

    replayBackdrop.style.display = 'flex';
    
    // Reset community board card elements opacity
    document.querySelectorAll('.board-card').forEach(bc => {
      bc.style.opacity = '0';
      bc.style.display = 'none';
    });

    // Reset step
    currentStep = 0;
    updateReplayerStep();

    // Hole card dealing animations
    gsap.set([card1, card2], { scale: 0, rotation: 90, opacity: 0 });
    gsap.to(card1, { scale: 1, rotation: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: "power2.out" });
    gsap.to(card2, { scale: 1, rotation: 0, opacity: 1, duration: 0.5, delay: 0.35, ease: "power2.out" });
  }

  function updateReplayerStep() {
    if (!replayerHand) return;
    
    const steps = [
      {
        street: 'PREFLOP',
        pot: '1.5bb',
        showBoard: 0,
        coach: `Preflop Action: Hero is in ${replayerHand.pos}. Facing standard open setup. Action: ${replayerHand.action.toUpperCase()} (${replayerHand.compliant ? 'GTO Compliant' : 'Deviation Detected'}).`
      },
      {
        street: 'FLOP',
        pot: (Math.abs(parseFloat(replayerHand.net)) * 0.35 + 1.5).toFixed(1) + 'bb',
        showBoard: 3,
        coach: `Flop comes [${boardCards[0].val}${boardCards[0].suit} ${boardCards[1].val}${boardCards[1].suit} ${boardCards[2].val}${boardCards[2].suit}]. Hero checks, villain bets, hero calls. GTO sizing compliance is 94%.`
      },
      {
        street: 'TURN',
        pot: (Math.abs(parseFloat(replayerHand.net)) * 0.7 + 1.5).toFixed(1) + 'bb',
        showBoard: 4,
        coach: `Turn is [${boardCards[3].val}${boardCards[3].suit}]. Board textures favor hero's range. Hero leads out with standard sizing.`
      },
      {
        street: 'RIVER',
        pot: Math.abs(parseFloat(replayerHand.net)).toFixed(1) + 'bb (Final)',
        showBoard: 5,
        coach: `River is [${boardCards[4].val}${boardCards[4].suit}]. Final showdown net won/lost: ${replayerHand.net}. Accuracy rating: ${replayerHand.gtoAccuracy}.`
      }
    ];

    const current = steps[currentStep];

    // Update UI elements
    document.getElementById('replay-street-label').innerText = current.street;
    document.getElementById('replay-pot-size').innerText = current.pot;
    document.getElementById('replay-step-num').innerText = `${currentStep + 1}/4`;
    document.getElementById('replay-coach-tip').innerText = current.coach;

    // Toggle Board Cards visibility
    for (let i = 1; i <= 5; i++) {
      const cardEl = document.getElementById(`board-${i}`);
      if (i <= current.showBoard) {
        const card = boardCards[i - 1];
        cardEl.innerHTML = `<span>${card.val}</span><span class="suit-symbol">${card.suit}</span>`;
        cardEl.className = `poker-card-micro board-card ${['♥', '♦'].includes(card.suit) ? 'red' : ''}`;
        
        if (cardEl.style.opacity !== '1') {
          cardEl.style.display = 'flex';
          gsap.fromTo(cardEl, { scale: 0, rotation: -45, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" });
        }
      } else {
        cardEl.style.opacity = '0';
        cardEl.style.display = 'none';
      }
    }

    // Toggle button disabled states
    if (btnReplayPrev) btnReplayPrev.disabled = (currentStep === 0);
    if (btnReplayNext) btnReplayNext.innerText = (currentStep === 3) ? 'Finish' : 'Next Action ▶';
  }

  // Step replayer navigation listeners
  if (btnReplayPrev) {
    btnReplayPrev.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        updateReplayerStep();
      }
    });
  }

  if (btnReplayNext) {
    btnReplayNext.addEventListener('click', () => {
      if (currentStep < 3) {
        currentStep++;
        updateReplayerStep();
      } else {
        // Finish, hide modal
        if (replayBackdrop) replayBackdrop.style.display = 'none';
      }
    });
  }

  // File Upload Parser Simulator
  if (uploadZone) {
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.style.background = 'rgba(0, 240, 255, 0.05)';
      uploadZone.style.borderColor = 'var(--accent)';
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.style.background = 'rgba(0,0,0,0.1)';
      uploadZone.style.borderColor = 'var(--border)';
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.style.background = 'rgba(0,0,0,0.1)';
      uploadZone.style.borderColor = 'var(--border)';
      simulateParsing('pokerstars_hand_history.txt');
    });

    uploadZone.addEventListener('click', () => {
      simulateParsing('pokerstars_history_input.txt');
    });
  }

  function simulateParsing(filename) {
    uploadIdle.style.display = 'none';
    uploadActive.style.display = 'block';
    uploadActive.innerHTML = '';

    const lines = [
      `Reading hand history file: ${filename}...`,
      'Detecting site format... Matches [PokerStars] hand template.',
      'Checking file encoding: UTF-8 BOM detected and cleared.',
      'Parsing Hand #12901 - SB vs BTN open steal check...',
      'Parsing Hand #12902 - BTN RFI standard raise...',
      'Parsing Hand #12903 - UTG facing big 3bet fold check...',
      'Mapping ordered seats: 6 active players detected.',
      'Comparing parsed decisions against GTO Solver range dictionaries...',
      'Compliance rates calculated. Inserting 3 new hands to local ledger...',
      'Database updated successfully! Table re-rendering.'
    ];

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine >= lines.length) {
        clearInterval(interval);
        
        // Push 3 mock hands
        const mockNewHands = [
          {
            id: '12901',
            cards: 'As Qs',
            pos: 'BTN',
            scenario: 'RFI',
            stack: '100bb',
            action: 'raise',
            net: '+28.5bb',
            compliant: true,
            suits: ['♠', '♠'],
            buyIn: '$1.10',
            gtoAccuracy: '95%'
          },
          {
            id: '12902',
            cards: 'Jh Th',
            pos: 'CO',
            scenario: 'RFI',
            stack: '32bb',
            action: 'raise',
            net: '-4.2bb',
            compliant: true,
            suits: ['♥', '♥'],
            buyIn: '$1.10',
            gtoAccuracy: '88%'
          },
          {
            id: '12903',
            cards: 'Kd Qd',
            pos: 'SB',
            scenario: 'VS_OPEN',
            stack: '45bb',
            action: 'call',
            net: '-6.0bb',
            compliant: false,
            suits: ['♦', '♦'],
            buyIn: '$1.10',
            gtoAccuracy: '45%'
          }
        ];

        // Insert new hands at the beginning of the list
        state.hands = [...mockNewHands, ...state.hands];
        state.notify(); // Re-render table

        setTimeout(() => {
          uploadActive.style.display = 'none';
          uploadIdle.style.display = 'block';
        }, 1500);

        return;
      }

      const logLine = document.createElement('div');
      logLine.style.marginBottom = '2px';
      logLine.innerHTML = `<span style="color:var(--accent); font-weight:700;">&gt;</span> ${lines[currentLine]}`;
      uploadActive.appendChild(logLine);
      uploadActive.scrollTop = uploadActive.scrollHeight;
      currentLine++;
    }, 200);
  }

  // Database Reset Logic
  if (btnResetDb) {
    btnResetDb.addEventListener('click', () => {
      state.hands = [...originalHandsList];
      state.notify();
    });
  }

  // Initial table render
  renderHandsTable();

  // Filters Event Listeners
  if (filterPos) {
    filterPos.addEventListener('change', renderHandsTable);
    filterComp.addEventListener('change', renderHandsTable);
    filterScen.addEventListener('change', renderHandsTable);
    if (filterStack) filterStack.addEventListener('change', renderHandsTable);
    filterSearch.addEventListener('input', renderHandsTable);
  }

  if (btnCloseReplay) {
    btnCloseReplay.addEventListener('click', () => {
      replayBackdrop.style.display = 'none';
    });
  }
}

// Generate random board cards from deck, excluding hero cards to avoid clashes
function generateBoardCards(heroCardsString) {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  const deck = [];
  suits.forEach(s => {
    values.forEach(v => {
      deck.push({ val: v, suit: s });
    });
  });

  const heroSplit = heroCardsString.split(' ');
  const heroCards = heroSplit.map(hc => {
    let val = hc[0];
    let suitChar = hc[1];
    let suit = '♠';
    if (suitChar === 'h' || suitChar === '♥') suit = '♥';
    if (suitChar === 'd' || suitChar === '♦') suit = '♦';
    if (suitChar === 'c' || suitChar === '♣') suit = '♣';
    return { val, suit };
  });

  const cleanDeck = deck.filter(c => {
    return !heroCards.some(hc => hc.val === c.val && hc.suit === c.suit);
  });

  // Shuffle
  for (let i = cleanDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cleanDeck[i], cleanDeck[j]] = [cleanDeck[j], cleanDeck[i]];
  }

  return cleanDeck.slice(0, 5);
}
