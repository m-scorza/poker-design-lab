// master-class stateful Overview controller. Handles session filters, HUD arc triggers,
// dynamic SVG path morphs, interactive seat inspection panels, and alerts drawing.
import gsap from 'gsap';
import { state } from '../state.js';

// Mock detailed seat statistics database
const SEAT_STATS = {
  all: {
    BTN: { vpip: '28.4%', pfr: '22.1%', profit: '-28.0 bb', volume: '1,842 hands', color: 'var(--loss)', insight: 'Over-opening bottom-range holdings preflop. Blinds are squeezing aggressively. Cut K8s/Q6s opens.' },
    SB: { vpip: '19.8%', pfr: '15.4%', profit: '-8.4 bb', volume: '1,720 hands', color: 'var(--loss)', insight: 'Defending too tight against button steals. Defend more suited connector assets.' },
    BB: { vpip: '39.0%', pfr: '0.0%', profit: '+1.2 bb', volume: '1,810 hands', color: 'var(--accent-2)', insight: 'Solid BB defense rate. Continue to exploit min-opens from late positions.' },
    UTG: { vpip: '15.2%', pfr: '15.2%', profit: '+4.2 bb', volume: '1,750 hands', color: 'var(--accent-2)', insight: 'Extremely compliant under-the-gun RFI openings. Clean range discipline.' },
    HJ: { vpip: '18.4%', pfr: '17.1%', profit: '+8.1 bb', volume: '1,794 hands', color: 'var(--accent-2)', insight: 'Solid hijack performance. Sizing values are well-calibrated.' },
    CO: { vpip: '26.0%', pfr: '22.4%', profit: '+14.8 bb', volume: '1,800 hands', color: 'var(--accent-2)', insight: 'Highly profitable cutoff steals. Continue attacking passive blinds.' }
  },
  'session-37': {
    BTN: { vpip: '32.0%', pfr: '24.0%', profit: '-32.0 bb', volume: '42 hands', color: 'var(--loss)', insight: 'Button openings were punished by blind squeezes. Tighten bottom-range steals.' },
    SB: { vpip: '16.0%', pfr: '12.0%', profit: '-8.4 bb', volume: '38 hands', color: 'var(--loss)', insight: 'Over-folded SB vs min-opens. Add flat-calls with small pairs.' },
    BB: { vpip: '42.0%', pfr: '0.0%', profit: '+1.2 bb', volume: '40 hands', color: 'var(--accent-2)', insight: 'Strong blind defenses. Flat-called raises and collected multiple postflop pots.' },
    UTG: { vpip: '14.0%', pfr: '14.0%', profit: '+4.2 bb', volume: '45 hands', color: 'var(--accent-2)', insight: 'Strict opening ranges. No deviation spots recorded UTG.' },
    HJ: { vpip: '19.0%', pfr: '18.0%', profit: '+8.1 bb', volume: '41 hands', color: 'var(--accent-2)', insight: 'High compliance rate. Aggressive postflop lines won medium pots.' },
    CO: { vpip: '28.0%', pfr: '24.0%', profit: '+14.8 bb', volume: '40 hands', color: 'var(--accent-2)', insight: 'Steals were highly effective. Passive blinds folded to standard RFI sizes.' }
  },
  'session-36': {
    BTN: { vpip: '35.0%', pfr: '22.0%', profit: '-78.0 bb', volume: '110 hands', color: 'var(--loss)', insight: 'Severe BTN leaks. Opened weak suited kings/queens into active players.' },
    SB: { vpip: '24.0%', pfr: '18.0%', profit: '-12.4 bb', volume: '95 hands', color: 'var(--loss)', insight: 'Unstable preflop responses. Attempted loose 3-bets that hit folds.' },
    BB: { vpip: '30.0%', pfr: '0.0%', profit: '-14.2 bb', volume: '105 hands', color: 'var(--loss)', insight: 'Overfolded BB, letting late position openers steal without contest.' },
    UTG: { vpip: '18.0%', pfr: '15.0%', profit: '+1.1 bb', volume: '100 hands', color: 'var(--accent-2)', insight: 'Decent UTG play but postflop check-folds reduced overall profitability.' },
    HJ: { vpip: '22.0%', pfr: '16.0%', profit: '+3.4 bb', volume: '98 hands', color: 'var(--accent-2)', insight: 'Average profit. Respect opens, avoid postflop floating lines.' },
    CO: { vpip: '25.0%', pfr: '18.0%', profit: '+2.1 bb', volume: '102 hands', color: 'var(--accent-2)', insight: 'Cutoff steals were contested by active BTN flat-callers. Keep steal sizes small.' }
  },
  'session-35': {
    BTN: { vpip: '22.0%', pfr: '20.0%', profit: '+12.4 bb', volume: '84 hands', color: 'var(--accent-2)', insight: 'Solid BTN performance. Maintained tight boundaries and collected preflop dead money.' },
    SB: { vpip: '18.0%', pfr: '15.0%', profit: '+4.5 bb', volume: '75 hands', color: 'var(--accent-2)', insight: 'Defended small blind correctly. Exploited BTN wide openers.' },
    BB: { vpip: '38.0%', pfr: '0.0%', profit: '+8.8 bb', volume: '80 hands', color: 'var(--accent-2)', insight: 'Excellent BB flatting. Captured large showdown pots with check-raises.' },
    UTG: { vpip: '15.0%', pfr: '15.0%', profit: '+2.2 bb', volume: '78 hands', color: 'var(--accent-2)', insight: 'Strict preflop conformance UTG. Standard value sizes worked.' },
    HJ: { vpip: '16.0%', pfr: '16.0%', profit: '+4.8 bb', volume: '82 hands', color: 'var(--accent-2)', insight: 'Solid hijack cards. Correctly folded bottom of range.' },
    CO: { vpip: '24.0%', pfr: '20.0%', profit: '+15.2 bb', volume: '81 hands', color: 'var(--accent-2)', insight: 'Cutoff stealing ran hot. Blinds folded to 2.2x opens 80% of the time.' }
  }
};

// Trend coordinate datasets
const CHART_DATA = {
  all: [0, 10, 8, 22, 18, 35, 30, 52, 48, 74, 68, 88, 92, 115, 110, 138, 132, 155, 148, 175, 168, 192, 185, 212, 205, 238, 224, 255, 248, 282, 264, 312, 298, 335, 320, 355, 342, 388.85],
  'session-37': [0, -2.5, -5.0, -1.5, 2.0, 0.5, 4.5, 3.0, 6.2, 9.5, 8.0, 10.5, 12.4],
  'session-36': [0, 1.5, 3.0, 0.5, -2.0, -4.5, -3.0, -6.5, -8.0, -5.5, -4.8],
  'session-35': [0, 2.0, 5.5, 4.0, 8.5, 12.0, 10.0, 15.5, 18.0, 22.1],
  // Subsets for timeframe selectors
  '30d': [120, 135, 132, 150, 148, 175, 168, 192, 185, 212, 205, 238, 224, 255, 248, 282, 264, 312, 298, 335, 320, 355, 342, 388.85],
  '7d': [298, 335, 320, 355, 342, 388.85]
};

// Radar Sweep Animation instance
let radarAnimation = null;
// Active Inspect Seat Pos
let activeInspectPos = 'BTN';

// 13x13 matrix rank order (high -> low), shared with the Ranges lab convention
const MATRIX_RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

// Lightweight odometer count-up: tweens a numeric value and writes formatted text each tick.
function countUp(el, to, { prefix = '', suffix = '', suffixHtml = '', decimals = 0, sign = false } = {}) {
  if (!el) return;
  const proxy = { v: 0 };
  gsap.to(proxy, {
    v: to,
    duration: 0.9,
    ease: 'power2.out',
    onUpdate: () => {
      const n = proxy.v;
      const signStr = sign && n >= 0 ? '+' : '';
      const body = Math.abs(n).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      const text = `${signStr}${n < 0 ? '-' : ''}${prefix}${body}${suffix}`;
      if (suffixHtml) {
        el.innerHTML = `${text}${suffixHtml}`;
      } else {
        el.innerText = text;
      }
    },
  });
}

// Map a recommendation class to a Portuguese label fallback.
function navigateToTab(tab) {
  const link = document.querySelector(`.mast-nav a[data-tab="${tab}"]`);
  if (link) link.click();
}

export function initRadar() {
  const sessionSelect = document.getElementById('overview-session-select');
  const chartSelector = document.getElementById('overview-chart-selector');

  // Wire Session Select dropdown
  if (sessionSelect) {
    sessionSelect.addEventListener('change', (e) => {
      state.activeSession = e.target.value;
      state.notify();
    });
  }

  // Wire Chart timeframe filters
  if (chartSelector) {
    const buttons = chartSelector.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-chart');
        morphTrendChart(filter);
      });
    });
  }

  // Subscribe Overview render to state updates
  state.subscribe(() => {
    renderOverview();
  });

  // Spin radar sweep line
  const radarSweep = document.getElementById('radar-sweep');
  if (radarSweep && !radarAnimation) {
    radarAnimation = gsap.to(radarSweep, {
      rotation: 360,
      transformOrigin: '50% 50%',
      repeat: -1,
      duration: 3.5,
      ease: "none"
    });
  }

  // Wire stat triggers in HUD card
  const statTriggers = document.querySelectorAll('.stat-trigger');
  statTriggers.forEach(trig => {
    trig.addEventListener('click', () => {
      statTriggers.forEach(t => t.classList.remove('active'));
      trig.classList.add('active');

      const stat = trig.getAttribute('data-stat');
      const valueText = trig.querySelector('.st-value').innerText;

      const centerLbl = document.getElementById('center-lbl');
      const centerVal = document.getElementById('center-val');
      if (centerLbl) centerLbl.innerText = stat.toUpperCase();
      if (centerVal) centerVal.innerText = valueText;

      const ringEl = document.getElementById(`ring-${stat}`);
      if (ringEl) {
        gsap.fromTo(ringEl, { strokeWidth: 4 }, { strokeWidth: 2.8, duration: 0.4 });
      }
    });
  });

  // Wire Verdict + Headline CTAs (navigate to the relevant results tab)
  const verdictAction = document.getElementById('verdict-action');
  if (verdictAction) {
    verdictAction.addEventListener('click', () => {
      const tab = (state.lifetime.verdict && state.lifetime.verdict.actionTab) || 'leaks';
      navigateToTab(tab);
    });
  }
  const headlineCta = document.getElementById('headline-cta');
  if (headlineCta) {
    headlineCta.addEventListener('click', () => {
      const tab = (state.lifetime.headline && state.lifetime.headline.actionTab) || 'ranges';
      navigateToTab(tab);
    });
  }

  // Wire Blocker Calculator
  const heroHandSelect = document.getElementById('blocker-hero-hand');
  const boardSelect = document.getElementById('blocker-board');
  if (heroHandSelect && boardSelect) {
    const updateBlockers = () => {
      calculateBlockers(heroHandSelect.value, boardSelect.value);
    };
    heroHandSelect.addEventListener('change', updateBlockers);
    boardSelect.addEventListener('change', updateBlockers);
    // initial calculation
    updateBlockers();
  }

  // Initial draw
  renderOverview();
}

function calculateBlockers(handVal, boardVal) {
  const rankMap = "23456789TJQKA";
  const suitNames = { s: '♠', h: '♥', d: '♦', c: '♣' };
  
  // Parse Hand
  let handCards = [];
  if (handVal === 'AsKs') handCards = ['As', 'Ks'];
  else if (handVal === 'AhKh') handCards = ['Ah', 'Kh'];
  else if (handVal === 'AcKc') handCards = ['Ac', 'Kc'];
  else if (handVal === 'QQ') handCards = ['Qh', 'Qd'];
  else if (handVal === 'JTs') handCards = ['Jd', 'Td'];
  else if (handVal === '76s') handCards = ['7s', '6s'];

  // Parse Board
  let boardCards = [];
  if (boardVal === 'JsTs4h') boardCards = ['Js', 'Ts', '4h'];
  else if (boardVal === 'Qs9s2h') boardCards = ['Qs', '9s', '2h'];
  else if (boardVal === 'As8d3c') boardCards = ['As', '8d', '3c'];
  else if (boardVal === 'KdQd2c') boardCards = ['Kd', 'Qd', '2c'];

  // Check overlap
  const overlapCard = handCards.find(c => boardCards.includes(c));
  if (overlapCard) {
    const formattedOverlap = overlapCard[0] + (suitNames[overlapCard[1]] || '');
    const flushValEl = document.getElementById('blocker-flush-val');
    const straightValEl = document.getElementById('blocker-straight-val');
    const descEl = document.getElementById('blocker-rating-desc');
    if (flushValEl) flushValEl.innerText = 'Conflito';
    if (straightValEl) straightValEl.innerText = 'Conflito';
    if (descEl) {
      descEl.innerHTML = `<span style="color: var(--loss); font-weight: 700;">Carta duplicada:</span> a mão do herói e o board compartilham a carta <span style="color: var(--fg); font-weight:700;">${formattedOverlap}</span>. Escolha um board ou mão diferente.`;
    }
    return;
  }

  // Find flush draw suit on board
  const boardSuits = boardCards.map(c => c[1]);
  const suitCounts = {};
  boardSuits.forEach(s => suitCounts[s] = (suitCounts[s] || 0) + 1);
  let flushSuit = null;
  for (const s in suitCounts) {
    if (suitCounts[s] >= 2) {
      flushSuit = s;
      break;
    }
  }

  // Calculate Nut Flush Blocked %
  let flushValText = '0.0%';
  if (flushSuit) {
    const boardRanksOfSuit = boardCards.filter(c => c[1] === flushSuit).map(c => c[0]);
    // Find the highest rank not on the board of that suit
    let nutRank = null;
    for (let i = rankMap.length - 1; i >= 0; i--) {
      const r = rankMap[i];
      if (!boardRanksOfSuit.includes(r)) {
        nutRank = r;
        break;
      }
    }
    const nutCard = nutRank + flushSuit;
    const heroHasNut = handCards.includes(nutCard);
    
    if (heroHasNut) {
      flushValText = '100%';
    } else {
      // How many spades/diamonds in hero hand?
      const heroSuitedCards = handCards.filter(c => c[1] === flushSuit).length;
      if (heroSuitedCards === 1) {
        flushValText = '10.0%';
      } else if (heroSuitedCards === 2) {
        flushValText = '20.0%';
      } else {
        flushValText = '0.0%';
      }
    }
  } else {
    flushValText = 'N/A';
  }

  // Helper functions for straight checking
  function getRankVal(rankChar) {
    return rankMap.indexOf(rankChar);
  }

  function hasStraight(ranksSet) {
    for (let i = -1; i <= 8; i++) {
      let count = 0;
      for (let j = 0; j < 5; j++) {
        let r = i + j;
        if (r === -1) r = 12; // Ace
        if (ranksSet.has(r)) count++;
      }
      if (count === 5) return true;
    }
    return false;
  }

  function isStraightDraw(ranksSet) {
    if (hasStraight(ranksSet)) return false;
    for (let r = 0; r < 13; r++) {
      if (!ranksSet.has(r)) {
        ranksSet.add(r);
        const ok = hasStraight(ranksSet);
        ranksSet.delete(r);
        if (ok) return true;
      }
    }
    return false;
  }

  // Calculate straight combos blocked
  // Build remaining deck of cards (52 cards minus board cards)
  const deck = [];
  const suites = ['s', 'h', 'c', 'd'];
  for (let r = 0; r < 13; r++) {
    for (let s of suites) {
      const cardStr = rankMap[r] + s;
      if (!boardCards.includes(cardStr)) {
        deck.push({ rank: r, suit: s, str: cardStr });
      }
    }
  }

  let totalStraightDrawCombos = 0;
  let blockedStraightDrawCombos = 0;

  // Look at all possible 2-card combinations for Villain from the deck
  for (let i = 0; i < deck.length; i++) {
    for (let j = i + 1; j < deck.length; j++) {
      const c1 = deck[i];
      const c2 = deck[j];
      
      // Combined with board
      const combinedRanks = new Set();
      boardCards.forEach(c => combinedRanks.add(getRankVal(c[0])));
      combinedRanks.add(c1.rank);
      combinedRanks.add(c2.rank);

      if (isStraightDraw(combinedRanks)) {
        totalStraightDrawCombos++;
        // Check if blocked by Hero hand
        if (handCards.includes(c1.str) || handCards.includes(c2.str)) {
          blockedStraightDrawCombos++;
        }
      }
    }
  }

  const straightValText = `${blockedStraightDrawCombos} combos`;

  // Update DOM
  const flushValEl = document.getElementById('blocker-flush-val');
  const straightValEl = document.getElementById('blocker-straight-val');
  const ratingDescEl = document.getElementById('blocker-rating-desc');
  
  if (flushValEl) flushValEl.innerText = flushValText;
  if (straightValEl) straightValEl.innerText = straightValText;

  // Dynamic explanation text
  const handHtml = handCards.map(c => `${c[0]}<span style="font-size:12px; line-height:1;">${suitNames[c[1]]}</span>`).join(' ');
  const boardHtml = boardCards.map(c => `${c[0]}<span style="font-size:12px; line-height:1;">${suitNames[c[1]]}</span>`).join(' ');

  let ratingDesc = '';
  const flushPercent = parseFloat(flushValText);
  if (flushValText === '100%' || blockedStraightDrawCombos >= 15) {
    ratingDesc = `${handHtml} bloqueia <span style="color: var(--accent); font-weight:700;">${flushValText}</span> dos draws de nut flush do vilão e <span style="color: var(--accent-2); font-weight:700;">${blockedStraightDrawCombos}</span> combinações de sequência no board ${boardHtml}. Capacidade de exploração elite.`;
  } else if (flushPercent > 0 || blockedStraightDrawCombos > 5) {
    ratingDesc = `${handHtml} bloqueia <span style="color: var(--accent); font-weight:700;">${flushValText}</span> dos draws de nut flush do vilão e <span style="color: var(--accent-2); font-weight:700;">${blockedStraightDrawCombos}</span> combinações de sequência no board ${boardHtml}. Bloqueadores defensivos fortes.`;
  } else {
    ratingDesc = `${handHtml} tem impacto mínimo de bloqueio no board ${boardHtml} (<span style="color: var(--accent);">${flushValText}</span> nut flush, <span style="color: var(--accent-2);">${blockedStraightDrawCombos}</span> combos de sequência). Perfil de bloqueio padrão.`;
  }

  if (ratingDescEl) ratingDescEl.innerHTML = ratingDesc;
}

// Generate SVG coordinate paths dynamically
function generateSVGPath(points, width = 1140, height = 180) {
  if (points.length < 2) return { path: '', area: '' };

  const minVal = Math.min(...points, 0); // Include zero baseline
  const maxVal = Math.max(...points, 10);
  const range = maxVal - minVal;

  const mappedPoints = points.map((p, idx) => {
    const x = (idx / (points.length - 1)) * width;
    // Invert Y coordinate because SVG Y=0 is at top
    const y = height - 15 - ((p - minVal) / range) * (height - 30);
    return { x, y };
  });

  // Build path with simple lines
  let pathD = `M ${mappedPoints[0].x.toFixed(1)},${mappedPoints[0].y.toFixed(1)}`;
  for (let i = 1; i < mappedPoints.length; i++) {
    pathD += ` L ${mappedPoints[i].x.toFixed(1)},${mappedPoints[i].y.toFixed(1)}`;
  }

  // Closed area path
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;
  return { path: pathD, area: areaD };
}

// Morph trend chart based on filter or session selection
function morphTrendChart(filterKey) {
  const pathEl = document.getElementById('chart-path');
  const areaEl = document.getElementById('chart-area');
  if (!pathEl || !areaEl) return;

  const points = CHART_DATA[filterKey] || CHART_DATA['all'];
  const { path, area } = generateSVGPath(points);

  gsap.to(pathEl, { attr: { d: path }, duration: 0.5, ease: "power2.out" });
  gsap.to(areaEl, { attr: { d: area }, duration: 0.5, ease: "power2.out" });
}

// Render Overview page state changes
function renderOverview() {
  const selectEl = document.getElementById('overview-session-select');
  if (selectEl && selectEl.value !== state.activeSession) {
    selectEl.value = state.activeSession;
  }

  // Get active session data or lifetime fallback
  const isAll = state.activeSession === 'all';
  const data = isAll ? state.lifetime : state.sessions.find(s => s.id === state.activeSession);
  if (!data) return;

  // 1. Update net profit and subtitles
  const pnlBadge = document.getElementById('overview-pnl-badge');
  const subtitleEl = document.getElementById('overview-subtitle');
  const pnlKick = document.getElementById('overview-pnl-kick');
  const pnlNum = document.getElementById('overview-pnl-num');
  const verdictEl = document.getElementById('mon-verdict');

  if (pnlBadge) {
    const formatted = `${data.pnl >= 0 ? '+' : ''}$${data.pnl ? data.pnl.toFixed(2) : data.netProfit.toFixed(2)}`;
    pnlBadge.innerText = formatted;
    pnlBadge.style.color = (data.pnl >= 0 || data.netProfit >= 0) ? 'var(--accent)' : 'var(--loss)';
    pnlBadge.style.borderColor = (data.pnl >= 0 || data.netProfit >= 0) ? 'var(--accent-line)' : 'var(--loss-line)';
    pnlBadge.style.background = (data.pnl >= 0 || data.netProfit >= 0) ? 'var(--accent-soft)' : 'var(--loss-soft)';
  }

  if (subtitleEl) {
    subtitleEl.innerText = isAll
      ? 'Veredito de readiness de stake, leak nº1 e tendência do torneio a partir dos históricos importados.'
      : `Análise granular da sessão: ${data.date} (${data.time})`;
  }

  if (pnlKick) {
    pnlKick.innerText = isAll
      ? `Lucro líquido vitalício · ${data.tournaments} torneios`
      : `Lucro líquido da sessão · ${data.tournaments} torneios`;
  }

  if (pnlNum) {
    const val = data.pnl !== undefined ? data.pnl : data.netProfit;
    const sign = val >= 0 ? '+' : '';
    const absVal = Math.abs(val).toFixed(2);
    const parts = absVal.split('.');
    pnlNum.innerHTML = `<span class="sign">${sign}</span>$${parts[0]}<span class="cents">.${parts[1]}</span>`;
    pnlNum.style.textShadow = val >= 0 ? '0 0 44px var(--accent-glow)' : '0 0 44px var(--loss-line)';
  }

  if (verdictEl) {
    verdictEl.innerHTML = isAll 
      ? `Você está no positivo. <em>Um desvio de botão</em> é a história inteira.`
      : `Veredito da sessão: <em>${data.insight}</em>`;
  }

  // 2. HUD Concentric stat rings animation
  const ringVpip = document.getElementById('ring-vpip');
  const ringPfr = document.getElementById('ring-pfr');
  const ring3bet = document.getElementById('ring-3bet');

  const vVal = data.vpip;
  const pVal = data.pfr;
  const tVal = data.threeBet !== undefined ? data.threeBet : data.threeBet;

  if (ringVpip) gsap.to(ringVpip, { strokeDashoffset: 263.8 - (vVal / 100 * 263.8), duration: 1.0, ease: "power2.out" });
  if (ringPfr) gsap.to(ringPfr, { strokeDashoffset: 213.6 - (pVal / 100 * 213.6), duration: 1.0, ease: "power2.out" });
  if (ring3bet) gsap.to(ring3bet, { strokeDashoffset: 163.3 - (tVal / 100 * 163.3), duration: 1.0, ease: "power2.out" });

  // Update HUD stat triggers values
  const triggers = document.querySelectorAll('.stat-trigger');
  triggers.forEach(trig => {
    const stat = trig.getAttribute('data-stat');
    const valSpan = trig.querySelector('.st-value');
    if (valSpan) {
      if (stat === 'vpip') valSpan.innerText = `${vVal}%`;
      if (stat === 'pfr') valSpan.innerText = `${pVal}%`;
      if (stat === '3bet') valSpan.innerText = `${tVal}%`;
    }
  });

  // Sync center labels
  const activeTrigger = document.querySelector('.stat-trigger.active');
  if (activeTrigger) {
    const activeStat = activeTrigger.getAttribute('data-stat');
    const centerVal = document.getElementById('center-val');
    if (centerVal) {
      if (activeStat === 'vpip') centerVal.innerText = `${vVal}%`;
      if (activeStat === 'pfr') centerVal.innerText = `${pVal}%`;
      if (activeStat === '3bet') centerVal.innerText = `${tVal}%`;
    }
  }

  // 3. Tournament Financials Card
  const abiEl = document.getElementById('overview-financials-abi');
  const itmEl = document.getElementById('overview-financials-itm');
  const investedEl = document.getElementById('overview-financials-invested');
  const prizesEl = document.getElementById('overview-financials-prizes');

  if (abiEl) countUp(abiEl, isAll ? data.abi : data.buyIns / data.tournaments, { prefix: '$', decimals: 2 });
  if (itmEl) countUp(itmEl, isAll ? data.itm : (data.pnl > 0 ? 100 : 0), { suffix: '%', decimals: 1 });
  if (investedEl) countUp(investedEl, isAll ? data.totalInvested : data.buyIns, { prefix: '$', decimals: 2 });
  if (prizesEl) countUp(prizesEl, isAll ? data.totalPrizes : data.prizes, { prefix: '$', decimals: 2, sign: true });

  // 4. Volume & Chips Performance
  const chipsEl = document.getElementById('overview-chips-value');
  const winrateEl = document.getElementById('overview-winrate-value');
  if (chipsEl) {
    countUp(chipsEl, data.chips, { sign: true, suffixHtml: ' <span class="cents">fichas</span>' });
  }
  if (winrateEl) {
    if (isAll) {
      winrateEl.innerText = `+${data.bb100.toFixed(2)} bb/100 de win rate`;
      winrateEl.style.color = 'var(--accent)';
    } else {
      const isPos = data.bb100 >= 0;
      winrateEl.innerText = `${isPos ? '+' : ''}${data.bb100.toFixed(1)} bb na sessão`;
      winrateEl.style.color = isPos ? 'var(--accent)' : 'var(--loss)';
    }
  }

  // 5. Stack Depth Bands & Blocker values
  const leakTitle = document.getElementById('overview-leak-title');
  const leakImpact = document.getElementById('overview-leak-impact');
  const complianceEl = document.getElementById('overview-gto-compliance');
  const leakCell = document.getElementById('overview-leak-cell');

  if (leakTitle && leakImpact) {
    if (isAll) {
      leakTitle.innerText = 'Abertura BTN';
      leakImpact.innerText = '-28bb/100 de impacto';
      if (leakCell) leakCell.style.borderLeftColor = 'var(--loss)';
    } else if (data.alerts && data.alerts.length > 0) {
      const topAlert = data.alerts[0];
      leakTitle.innerText = topAlert.title.split(' ')[0] + ' ' + topAlert.title.split(' ')[1];
      leakImpact.innerText = topAlert.title.substring(topAlert.title.indexOf('('));
      if (leakCell) leakCell.style.borderLeftColor = topAlert.severity === 'loss' ? 'var(--loss)' : 'var(--warn)';
    } else {
      leakTitle.innerText = 'Nenhum';
      leakImpact.innerText = 'Zero leaks';
      if (leakCell) leakCell.style.borderLeftColor = 'var(--accent)';
    }
  }

  if (complianceEl) {
    complianceEl.innerText = `${data.compliance.toFixed(1)}%`;
  }

  // Draw Stack bands list
  const stackBandsContainer = document.getElementById('overview-stack-bands');
  if (stackBandsContainer) {
    stackBandsContainer.innerHTML = '';
    data.stackBands.forEach(sb => {
      const row = document.createElement('div');
      row.className = 'stack-band-row';
      const formattedValue = sb.value >= 0 ? `+${sb.value.toLocaleString()}` : sb.value.toLocaleString();
      row.innerHTML = `
        <span class="stack-band-lbl">${sb.label}</span>
        <div class="stack-band-bar-outer"><span class="stack-band-bar-fill ${sb.class}" style="width: ${sb.width}%;"></span></div>
        <span class="stack-band-val">${formattedValue}</span>
      `;
      stackBandsContainer.appendChild(row);
    });
  }

  // 6. Draw dynamic Alerts list
  const alertsContainer = document.getElementById('overview-alerts-list');
  if (alertsContainer) {
    alertsContainer.innerHTML = '';
    const alertsToDraw = isAll ? state.lifetime.alerts : data.alerts;
    if (!alertsToDraw || alertsToDraw.length === 0) {
      alertsContainer.innerHTML = `<div class="alerts-empty">Nenhum leak pré-flop ativo nesta sessão.</div>`;
    } else {
      alertsToDraw.forEach(alert => {
        const row = document.createElement('div');
        const isLoss = alert.severity === 'loss';
        row.className = `alert-row ${isLoss ? 'sev-loss' : 'sev-warn'}`;

        row.innerHTML = `
          <button class="alert-toggle-btn">
            <div class="alert-toggle-head">
              <span class="alert-dot"></span>
              <span class="alert-title">${alert.title}</span>
            </div>
            <span class="kick alert-expand">Expandir correção</span>
          </button>
          <div class="alert-body">
            <p>${alert.body}</p>
          </div>
        `;
        alertsContainer.appendChild(row);
      });

      // Bind slide toggles
      alertsContainer.querySelectorAll('.alert-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const body = btn.parentElement.querySelector('.alert-body');
          const isHidden = body.style.display === 'none' || !body.style.display;
          if (isHidden) {
            body.style.display = 'block';
            gsap.fromTo(body, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.3 });
            btn.querySelector('.kick').innerText = 'Recolher';
          } else {
            gsap.to(body, {
              height: 0, opacity: 0, duration: 0.2, onComplete: () => {
                body.style.display = 'none';
              }
            });
            btn.querySelector('.kick').innerText = 'Expandir correção';
          }
        });
      });
    }
  }

  // 7. Draw Predators and Prey list
  const predatorsContainer = document.getElementById('overview-predators-list');
  if (predatorsContainer) {
    predatorsContainer.innerHTML = '';
    const nemList = isAll ? state.lifetime.nemeses : data.nemeses;
    nemList.forEach(nem => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.alignItems = 'center';
      row.style.fontFamily = 'var(--mono)';
      row.style.fontSize = '11px';
      row.style.padding = '6px 0';
      row.style.borderBottom = '1px solid var(--border)';

      const isLoss = nem.amountBb < 0;
      row.innerHTML = `
        <span style="color: var(--fg);"><span class="kick ${isLoss ? 'loss' : 'accent'}" style="font-size: 8px; margin-right: 8px; letter-spacing: 0.1em;">${nem.type}</span>${nem.name}</span>
        <span class="${isLoss ? 'loss' : 'accent-2'}">${isLoss ? '' : '+'}${nem.amountBb.toFixed(1)} bb</span>
      `;
      predatorsContainer.appendChild(row);
    });
  }

  // 8. 6-Max seat ring labels
  const sessionKey = state.activeSession;
  const pStats = SEAT_STATS[sessionKey] || SEAT_STATS['all'];
  const seatButtons = document.querySelectorAll('.heatmap-seat-btn');
  seatButtons.forEach(btn => {
    const pos = btn.getAttribute('data-pos');
    const stat = pStats[pos];
    if (stat) {
      btn.innerHTML = `${pos}<br>${stat.profit}`;
      const isLoss = stat.profit.includes('-');
      btn.style.color = isLoss ? 'var(--loss)' : 'var(--accent-2)';
      btn.style.borderColor = isLoss ? 'var(--loss-line)' : 'var(--accent-line)';
      btn.style.background = isLoss ? 'var(--loss-soft)' : 'var(--accent-soft)';
    }

    // Bind click to inspect seat details
    btn.addEventListener('click', () => {
      seatButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeInspectPos = pos;
      updateInspectPanel(pos);
    });
  });

  // Re-draw inspect panel
  updateInspectPanel(activeInspectPos);

  // 9. Render the "30-second answer" verdict + the Headline Incident story
  renderVerdict(isAll, data);
  renderHeadline(isAll, data);

  // 10. Redraw trend chart
  morphTrendChart(state.activeSession);
}

// Small DOM text helper
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}

// Render the ValueSnapshotCard-style "30-second answer" verdict
function renderVerdict(isAll, data) {
  const card = document.getElementById('overview-verdict-card');
  if (!card) return;

  let v;
  if (isAll) {
    v = state.lifetime.verdict;
  } else {
    const topAlert = data.alerts && data.alerts[0];
    const good = data.pnl >= 0 && data.compliance >= 85;
    v = {
      reco: good ? 'Sessão dentro do plano' : 'Sessão para revisar',
      recoClass: good ? 'hold' : 'down',
      readiness: Math.round(data.compliance),
      confidence: good ? 'Compliance forte' : 'Compliance abaixo do alvo',
      roiLabel: `${data.bb100 >= 0 ? '+' : ''}${data.bb100.toFixed(1)} bb/100`,
      profitLabel: `${data.pnl >= 0 ? '+' : ''}$${data.pnl.toFixed(2)} na sessão`,
      blockerTitle: topAlert ? topAlert.title : 'Sem leaks pré-flop',
      blockerDetail: topAlert ? topAlert.body : data.insight,
      action: topAlert ? 'Abrir o laboratório de leaks' : 'Continuar o plano atual',
    };
  }

  const recoEl = document.getElementById('verdict-reco');
  if (recoEl) {
    recoEl.innerText = v.reco;
    recoEl.className = `verdict-reco ${v.recoClass}`;
  }
  const readyEl = document.getElementById('verdict-readiness');
  if (readyEl) readyEl.innerHTML = `${v.readiness}<small>/100</small>`;
  setText('verdict-confidence', `Confiança: ${v.confidence}`);
  setText('verdict-roi', v.roiLabel);
  setText('verdict-profit', v.profitLabel);
  setText('verdict-blocker-title', v.blockerTitle);
  setText('verdict-blocker-detail', v.blockerDetail);
  setText('verdict-action-text', v.action);
}

// Render the Headline Incident — #1 leak as editorial prose + the 13x13 grid of offending hands
function renderHeadline(isAll, data) {
  const card = document.querySelector('.headline-card');
  if (!card) return;

  let h;
  if (isAll) {
    h = state.lifetime.headline;
  } else {
    const topAlert = data.alerts && data.alerts[0];
    if (!topAlert) {
      h = {
        kick: 'Incidente de destaque · Sessão limpa',
        title: 'Nenhum leak pré-flop nesta sessão',
        pos: 'BTN', scenario: 'rfi',
        prose: data.insight,
        costBb: '0bb',
        offending: [],
        metaLeft: `Compliance ${data.compliance.toFixed(1)}%`,
        metaRight: `${data.hands} mãos`,
      };
    } else {
      h = {
        kick: 'Incidente de destaque · Leak da sessão',
        title: topAlert.title,
        pos: 'BTN', scenario: 'rfi',
        prose: topAlert.body,
        costBb: '—',
        offending: state.lifetime.headline.offending,
        metaLeft: `Sessão #${data.num}`,
        metaRight: `${data.hands} mãos`,
      };
    }
  }

  setText('headline-kick', h.kick);
  setText('headline-title', h.title);
  const proseEl = document.getElementById('headline-prose');
  if (proseEl) proseEl.innerHTML = h.prose;
  setText('headline-cost', h.costBb);
  setText('headline-meta-left', h.metaLeft);
  setText('headline-meta-right', h.metaRight);
  setText('headline-grid-pos', h.pos);

  buildHeadlineGrid(h.pos, h.scenario, h.offending || []);
}

// Build the 13x13 matrix into the Headline Incident card, highlighting offending hands.
function buildHeadlineGrid(pos, scenario, offending) {
  const container = document.getElementById('overview-headline-grid');
  if (!container) return;

  const range = (state.customRanges[pos] && state.customRanges[pos][scenario]) || { Always: [], Mix: [] };
  const offSet = new Set(offending);
  container.innerHTML = '';

  for (let r = 0; r < 13; r++) {
    for (let c = 0; c < 13; c++) {
      const cell = document.createElement('div');
      cell.className = 'matrix-cell-node';

      let hand = '';
      if (r === c) hand = MATRIX_RANKS[r] + MATRIX_RANKS[c];
      else if (r < c) hand = MATRIX_RANKS[r] + MATRIX_RANKS[c] + 's';
      else hand = MATRIX_RANKS[c] + MATRIX_RANKS[r] + 'o';

      cell.innerText = hand;

      if (offSet.has(hand)) cell.classList.add('dev-range', 'blinking-deviation');
      else if (range.Always.includes(hand)) cell.classList.add('open-range');
      else if (range.Mix.includes(hand)) cell.classList.add('mix-range');

      container.appendChild(cell);
    }
  }

  gsap.fromTo(
    container.querySelectorAll('.matrix-cell-node'),
    { scale: 0.6, opacity: 0 },
    { scale: 1, opacity: 1, stagger: 0.001, duration: 0.3, ease: 'power2.out' }
  );
}

// Update seat details panel on click
function updateInspectPanel(pos) {
  const sessionKey = state.activeSession;
  const pStats = SEAT_STATS[sessionKey] || SEAT_STATS['all'];
  const stat = pStats[pos];
  if (!stat) return;

  const panelTitle = document.getElementById('inspect-pos-title');
  const vpipVal = document.getElementById('inspect-vpip-val');
  const pfrVal = document.getElementById('inspect-pfr-val');
  const profitVal = document.getElementById('inspect-profit-val');
  const volumeVal = document.getElementById('inspect-volume-val');
  const insightVal = document.getElementById('inspect-insight-val');

  if (panelTitle) {
    panelTitle.innerText = `${pos} Stats`;
    panelTitle.style.color = stat.color;
  }
  if (vpipVal) vpipVal.innerText = stat.vpip;
  if (pfrVal) pfrVal.innerText = stat.pfr;
  if (profitVal) {
    profitVal.innerText = stat.profit;
    profitVal.style.color = stat.color;
  }
  if (volumeVal) volumeVal.innerText = stat.volume;
  if (insightVal) insightVal.innerText = stat.insight;
}

export function initHUDRings() {
  renderOverview();
}
