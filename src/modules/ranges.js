// Ranges lab: preflop GTO range workspace — Oracle (theory) vs Mirror (performance),
// per-cell action distribution fills, master-detail insight pane, and solver-delta validation.
import gsap from 'gsap';

const RFI_POSITIONS = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
const MATRIX_RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const rangesPct = { UTG: 15.0, HJ: 20.0, CO: 26.0, BTN: 48.0, SB: 40.0, BB: 12.0 };

// Default RFI ranges matching solver percentages
const defaultRanges = {
  UTG: {
    Always: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', 'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'AKo', 'AQo'],
    Mix: ['66', '55', 'A9s', 'A5s', 'A4s', 'KTs', 'QJs', 'JTs', 'AJo', 'KQo']
  },
  HJ: {
    Always: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'KQs', 'KJs', 'KTs', 'QJs', 'JTs', 'AKo', 'AQo', 'AJo'],
    Mix: ['55', 'A8s', 'A7s', 'A5s', 'K9s', 'QTs', 'Q9s', 'J9s', 'T9s', '98s', 'ATo', 'KQo', 'KJo']
  },
  CO: {
    Always: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'KQs', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'Q9s', 'JTs', 'J9s', 'T9s', '98s', '87s', 'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo'],
    Mix: ['44', '33', '22', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'K8s', 'K7s', 'Q8s', 'J8s', 'T8s', '76s', '65s', 'A9o', 'KTo', 'QJo', 'JTo']
  },
  BTN: {
    Always: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'QJs', 'QTs', 'Q9s', 'JTs', 'J9s', 'T9s', 'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo', 'KTo'],
    Mix: ['66', '55', 'K7s', 'K6s', 'Q8s', 'J8s', 'T8s', '98s', '87s', '76s', 'A9o', 'A8o', 'KQo', 'QJo', 'JTo']
  },
  SB: {
    Always: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'AKo', 'AQo', 'AJo'],
    Mix: ['55', '44', 'A7s', 'A5s', 'A4s', 'K9s', 'Q9s', 'J9s', 'T9s', '98s', '87s', 'ATo', 'KQo', 'KJo']
  },
  BB: {
    Always: ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AQs', 'AKo', 'AQo'],
    Mix: ['99', '88', 'AJs', 'ATs', 'KQs', 'AJo', 'KQo']
  }
};

// Push/Fold ranges (10bb short stack)
const pushFoldRanges = {
  UTG: {
    Always: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', 'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'AKo', 'AQo'],
    Mix: ['77', '66', 'A9s', 'A8s', 'A5s', 'A4s', 'KJs', 'QJs', 'AJo', 'KQo']
  },
  HJ: {
    Always: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'KQs', 'KJs', 'AKo', 'AQo', 'AJo'],
    Mix: ['66', '55', 'A8s', 'A7s', 'A5s', 'KTs', 'QJs', 'JTs', 'ATo', 'KQo']
  },
  CO: {
    Always: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'AKo', 'AQo', 'AJo', 'ATo', 'KQo'],
    Mix: ['55', '44', 'A6s', 'A5s', 'A4s', 'A3s', 'K9s', 'Q9s', 'J9s', 'T9s', 'A9o', 'KJo', 'QJo']
  },
  BTN: {
    Always: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'KQs', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'JTs', 'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'KQo', 'KJo'],
    Mix: ['44', '33', '22', 'A4s', 'A3s', 'A2s', 'K8s', 'K7s', 'Q8s', 'J8s', 'T8s', '98s', '87s', 'A8o', 'KTo', 'QJo', 'JTo']
  },
  SB: {
    Always: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'QJs', 'QTs', 'Q9s', 'JTs', 'J9s', 'T9s', 'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'KQo', 'KJo', 'KTo'],
    Mix: ['33', '22', 'K7s', 'K6s', 'K5s', 'Q8s', 'J8s', 'T8s', '98s', '87s', '76s', '65s', 'A7o', 'A6o', 'A5o', 'K9o', 'Q9o', 'JTo']
  },
  BB: {
    Always: ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AQs', 'AJs', 'AKo', 'AQo'],
    Mix: ['99', '88', '77', 'ATs', 'A5s', 'KQs', 'KJs', 'AJo', 'ATo', 'KQo']
  }
};

const pushFoldPct = { UTG: 14.5, HJ: 18.0, CO: 25.0, BTN: 35.0, SB: 50.0, BB: 16.0 };

// Deviation hands flagged in the Mirror (overplays — opened/called out of range)
const deviationCombos = {
  BTN: ['K8s', 'K7s', 'Q6s', 'Q5s', 'J7s', 'T7s'],
  CO: ['K8s', 'K7s', 'Q8s', 'J8s'],
  UTG: [],
  HJ: [],
  SB: ['A8s', 'A5s', 'K9s'],
  BB: []
};

const pushFoldDeviations = {
  BTN: ['K6s', 'K5s', 'Q7s', 'Q6s', 'J7s', 'T7s', 'K9o', 'Q9o'],
  CO: ['K8s', 'K7s', 'Q8s'],
  UTG: [],
  HJ: [],
  SB: ['K4s', 'K3s', 'Q7s', 'K8o'],
  BB: []
};

// State
let activeScenario = 'rfi';      // 'rfi' | 'pushfold'
let activeMode = 'oracle';       // 'oracle' | 'mirror' | 'edit'
let activePos = 'BTN';
let highlightDeviations = true;
let selectedHand = null;
let rfiRanges = JSON.parse(JSON.stringify(defaultRanges));
let pushFoldRangesState = JSON.parse(JSON.stringify(pushFoldRanges));

function getActiveRanges() { return activeScenario === 'rfi' ? rfiRanges : pushFoldRangesState; }
function getActiveSolverPct(pos) { return activeScenario === 'rfi' ? rangesPct[pos] : pushFoldPct[pos]; }
function getActiveDeviations() { return activeScenario === 'rfi' ? deviationCombos : pushFoldDeviations; }
function posVerb(pos) {
  if (activeScenario === 'rfi') return pos === 'BB' ? 'BB defends' : `${pos} opens`;
  return pos === 'BB' ? 'BB calls' : `${pos} shove`;
}
function spotStack() { return activeScenario === 'rfi' ? '100bb' : '10bb'; }

// Deterministic PRNG so synthetic empirical numbers are stable across renders.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seedFrom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function getComboCount(hand) {
  if (hand.length === 2) return 6;
  if (hand.endsWith('s')) return 4;
  return 12;
}
function calculateRangeStats(rangeObj) {
  let combos = 0;
  rangeObj.Always.forEach(h => { combos += getComboCount(h); });
  rangeObj.Mix.forEach(h => { combos += getComboCount(h) * 0.5; });
  return { combos: Math.round(combos), pct: ((combos / 1326) * 100).toFixed(1) };
}

function handKeyAt(r, c) {
  if (r === c) return MATRIX_RANKS[r] + MATRIX_RANKS[c];
  if (r < c) return MATRIX_RANKS[r] + MATRIX_RANKS[c] + 's';
  return MATRIX_RANKS[c] + MATRIX_RANKS[r] + 'o';
}

// Build the per-cell model: theoretical class + oracle freq + synthesized empirical (mirror) play.
function cellModel(pos, hand) {
  const range = getActiveRanges()[pos];
  const devList = getActiveDeviations()[pos] || [];
  const isAlways = range.Always.includes(hand);
  const isMix = range.Mix.includes(hand);
  const cls = isAlways ? 'always' : isMix ? 'mix' : 'fold';
  const flaggedDev = devList.includes(hand);

  // Oracle (theory) frequencies — RFI/push are raise-or-fold; Mix splits the threshold.
  let oracle;
  if (cls === 'always') oracle = { raise: 100, call: 0, fold: 0 };
  else if (cls === 'mix') oracle = { raise: 55, call: 0, fold: 45 };
  else oracle = { raise: 0, call: 0, fold: 100 };

  // Mirror (synthetic but deterministic empirical play)
  const rng = mulberry32(seedFrom(pos + hand + activeScenario));
  let instances, raise, call, fold, compFrac, isDeviation = false, devType = null;
  if (cls === 'always') {
    instances = 8 + Math.floor(rng() * 33);
    compFrac = 0.88 + rng() * 0.11;
    raise = Math.round(compFrac * 100);
    call = 0;
    fold = 100 - raise;
  } else if (cls === 'mix') {
    instances = 4 + Math.floor(rng() * 15);
    compFrac = 0.80 + rng() * 0.15;
    raise = 45 + Math.round(rng() * 15);
    call = Math.round(rng() * 12);
    fold = Math.max(0, 100 - raise - call);
  } else if (flaggedDev) {
    // The leak: hero plays a fold-range hand far too often.
    instances = 2 + Math.floor(rng() * 10);
    compFrac = 0.10 + rng() * 0.25;
    call = Math.round(20 + rng() * 25);
    raise = Math.round(40 + rng() * 20);
    fold = Math.max(0, 100 - raise - call);
    isDeviation = true;
    devType = rng() > 0.5 ? 'OPEN OUT OF RANGE' : 'COLD-CALL';
  } else {
    // Plain fold hand — rarely spewed.
    const dealt = rng() > 0.55;
    instances = dealt ? 1 + Math.floor(rng() * 4) : 0;
    if (instances > 0 && rng() > 0.88) {
      // rare spew
      raise = Math.round(40 + rng() * 40); call = Math.round(rng() * 20);
      fold = Math.max(0, 100 - raise - call); compFrac = 0; isDeviation = true;
      devType = 'OPEN OUT OF RANGE';
    } else {
      raise = 0; call = 0; fold = 100; compFrac = instances > 0 ? 1 : 0;
    }
  }
  const correct = Math.round(instances * compFrac);
  return {
    hand, cls, oracle,
    mirror: { raise, call, fold, instances, correct, isDeviation, devType },
    flaggedDev,
  };
}

/* ---------------- Matrix rendering ---------------- */
function updateModeChrome() {
  const modeLabel = document.getElementById('ranges-mode-label');
  const spotLabel = document.getElementById('ranges-spot-label');
  if (modeLabel) {
    modeLabel.textContent =
      activeMode === 'oracle' ? 'The Oracle · theoretical GTO range'
      : activeMode === 'mirror' ? 'The Mirror · your real execution'
      : 'Range editor · click to toggle';
  }
  if (spotLabel) spotLabel.textContent = `${posVerb(activePos).toUpperCase()} · ${spotStack()}`;
  renderLegend();
}

function renderLegend() {
  const legend = document.getElementById('ranges-legend');
  if (!legend) return;
  if (activeMode === 'mirror') {
    legend.innerHTML =
      '<span><i class="sw-raise"></i>Raise</span>' +
      '<span><i class="sw-call"></i>Call</span>' +
      '<span><i class="sw-fold"></i>Fold</span>' +
      '<span><i class="sw-dev"></i>Deviation</span>';
  } else {
    legend.innerHTML =
      '<span><i class="sw-open"></i>Always opens</span>' +
      '<span><i class="sw-mix"></i>Mixed action</span>' +
      '<span><i class="sw-foldcell"></i>Fold</span>';
  }
}

function updateRangesGrid() {
  const grid = document.getElementById('ranges-matrix-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const range = getActiveRanges()[activePos];

  for (let r = 0; r < 13; r++) {
    for (let c = 0; c < 13; c++) {
      const hand = handKeyAt(r, c);
      const m = cellModel(activePos, hand);
      const cell = document.createElement('div');
      cell.className = 'matrix-cell-node';
      cell.dataset.hand = hand;

      if (activeMode === 'mirror') {
        const { raise, call, fold, instances, isDeviation } = m.mirror;
        if (instances === 0) {
          cell.classList.add('rg-nodata');
        } else if (isDeviation) {
          cell.classList.add('rg-dev-cell');
        } else {
          cell.classList.add('rg-ok-cell');
        }
        if (instances > 0) {
          const stack = raise + call; // raise sits on top of call from the bottom
          cell.innerHTML =
            `<span class="rg-fill rg-raise" style="height:${stack}%;"></span>` +
            `<span class="rg-fill rg-call" style="height:${call}%;"></span>` +
            `<span class="rg-fill rg-fold" style="height:${fold}%;"></span>` +
            `<span class="rg-label">${hand}</span>`;
          if (call > 0) {
            cell.classList.add('rg-cell-has-call');
          }
        } else {
          cell.innerHTML = `<span class="rg-label">${hand}</span>`;
        }
      } else {
        // oracle + edit views: theoretical classification as solid tinted cells
        if (m.cls === 'always') cell.classList.add('open-range');
        else if (m.cls === 'mix') cell.classList.add('mix-range');
        cell.innerHTML = `<span class="rg-label">${hand}</span>`;
        if (activeMode === 'oracle' && highlightDeviations && m.flaggedDev) {
          cell.classList.add('blinking-deviation');
        }
      }

      if (selectedHand === hand) cell.classList.add('rg-selected');

      // Interactions
      cell.addEventListener('mouseenter', () => showInsight(hand));
      cell.addEventListener('click', () => {
        if (activeMode === 'edit') {
          if (range.Always.includes(hand)) {
            range.Always = range.Always.filter(h => h !== hand);
            range.Mix.push(hand);
          } else if (range.Mix.includes(hand)) {
            range.Mix = range.Mix.filter(h => h !== hand);
          } else {
            range.Always.push(hand);
          }
          const stats = calculateRangeStats(range);
          document.getElementById('ranges-combos-lbl').textContent = `${stats.combos} combos (${stats.pct}%)`;
          updateValidationCard(activePos);
          updateRangesGrid();
        } else {
          selectedHand = (selectedHand === hand) ? null : hand;
          updateRangesGrid();
          if (selectedHand) showInsight(selectedHand, true); else clearInsight();
        }
      });

      grid.appendChild(cell);
    }
  }

  const stats = calculateRangeStats(range);
  document.getElementById('ranges-combos-lbl').textContent = `${stats.combos} combos (${stats.pct}%)`;
  updateModeChrome();
}

/* ---------------- Floating tooltip ---------------- */
function bindTooltip() {
  const grid = document.getElementById('ranges-matrix-grid');
  const tip = document.getElementById('ranges-tip');
  if (!grid || !tip) return;

  grid.addEventListener('mouseover', (e) => {
    const cell = e.target.closest('.matrix-cell-node');
    if (!cell) { tip.classList.remove('show'); return; }
    const m = cellModel(activePos, cell.dataset.hand);
    if (activeMode === 'mirror') {
      const mi = m.mirror;
      if (mi.instances === 0) {
        tip.innerHTML = `<div class="rg-tip-hand">${m.hand}</div><div class="rg-tip-row"><span class="k">no data</span></div>`;
      } else {
        const comp = Math.round((mi.correct / mi.instances) * 100);
        tip.innerHTML =
          `<div class="rg-tip-hand">${m.hand}</div>` +
          `<div class="rg-tip-row"><span class="k raise">raise</span><span>${mi.raise}%</span></div>` +
          `<div class="rg-tip-row"><span class="k call">call</span><span>${mi.call}%</span></div>` +
          `<div class="rg-tip-row"><span class="k fold">fold</span><span>${mi.fold}%</span></div>` +
          `<div class="rg-tip-row"><span class="k">sample</span><span>${mi.instances} · ${comp}% ok</span></div>`;
      }
    } else {
      const label = m.cls === 'always' ? 'always opens' : m.cls === 'mix' ? 'mixed action' : 'fold';
      tip.innerHTML =
        `<div class="rg-tip-hand">${m.hand}</div>` +
        `<div class="rg-tip-row"><span class="k raise">raise</span><span>${m.oracle.raise}%</span></div>` +
        `<div class="rg-tip-row"><span class="k fold">fold</span><span>${m.oracle.fold}%</span></div>` +
        `<div class="rg-tip-row"><span class="k">${label}</span></div>`;
    }
    tip.classList.add('show');
  });
  grid.addEventListener('mousemove', (e) => {
    tip.style.left = Math.min(window.innerWidth - tip.offsetWidth - 12, e.clientX + 14) + 'px';
    tip.style.top = Math.max(8, e.clientY - tip.offsetHeight - 12) + 'px';
  });
  grid.addEventListener('mouseleave', () => tip.classList.remove('show'));
}

/* ---------------- Master-detail insight pane ---------------- */
function clearInsight() {
  const empty = document.getElementById('ranges-insight-empty');
  const body = document.getElementById('ranges-insight-body');
  if (empty) empty.style.display = '';
  if (body) body.style.display = 'none';
}

function showInsight(hand, persist) {
  const empty = document.getElementById('ranges-insight-empty');
  const body = document.getElementById('ranges-insight-body');
  if (!body) return;
  // While a hand is pinned (selected), hover doesn't override it.
  if (selectedHand && !persist && selectedHand !== hand) return;

  const m = cellModel(activePos, hand);
  const mi = m.mirror;
  const clsLabel = m.cls === 'always' ? 'GTO standard' : m.cls === 'mix' ? 'Mixed action' : 'Exclude';
  const clsPill = m.cls === 'always' ? 'ok' : m.cls === 'mix' ? 'mix' : 'fold';
  const comp = mi.instances > 0 ? Math.round((mi.correct / mi.instances) * 100) : null;
  const compClass = comp == null ? 'dim' : comp >= 90 ? 'ok' : 'bad';

  let middle;
  if (mi.isDeviation && mi.instances > 0) {
    middle =
      `<h4 class="rg-i-sec bad"><span class="dot"></span>Critical deviations</h4>` +
      `<div class="rg-i-dev">` +
        `<div class="rg-i-dev-top"><span class="rg-i-dev-type">${mi.devType}</span><span class="rg-i-dev-stack">${spotStack()}</span></div>` +
        `<div class="rg-i-dev-body">Played <b>${mi.hand}</b> in ${mi.instances} hands — only ${comp}% per the theoretical range. ` +
        `${m.cls === 'fold' ? 'It is a standard fold in this position.' : 'Frequency off target.'}</div>` +
      `</div>`;
  } else if (mi.instances > 0) {
    middle =
      `<div class="rg-i-elite">` +
        `<div class="rg-i-elite-icon">⚡</div>` +
        `<p class="rg-i-elite-title">Elite execution</p>` +
        `<p class="rg-i-elite-sub">No deviations recorded for this hand in this position.</p>` +
      `</div>`;
  } else {
    middle =
      `<div class="rg-i-nodata">` +
        `<p>No history for <b>${mi.hand}</b> in ${activePos}.</p>` +
      `</div>`;
  }

  body.innerHTML =
    `<div class="rg-i-head">` +
      `<div><h3 class="rg-i-hand">${m.hand}</h3><p class="rg-i-spot">${activePos} · preflop</p></div>` +
      `<span class="rg-i-pill ${clsPill}">${clsLabel}</span>` +
    `</div>` +
    `<div class="rg-i-stats">` +
      `<div class="rg-i-stat"><span class="l">Frequency</span><span class="v">${mi.instances}</span></div>` +
      `<div class="rg-i-stat"><span class="l">Compliance</span><span class="v ${compClass}">${comp == null ? '—' : comp + '%'}</span></div>` +
    `</div>` +
    middle +
    `<div class="rg-i-insight">` +
      `<span class="kick accent">Strategic read</span>` +
      `<p>${m.cls === 'fold'
        ? `${m.hand} is a standard fold in ${activePos}. Opening or calling creates -EV scenarios in the long run.`
        : `Open ${m.hand} from ${activePos}. Exploit adjustment: beware aggressive 3-bets behind.`}</p>` +
    `</div>`;

  if (empty) empty.style.display = 'none';
  body.style.display = '';
}

/* ---------------- Solver delta validation ---------------- */
function updateValidationCard(pos) {
  const row = document.getElementById(`validation-${pos}`);
  if (!row) return;
  const stats = calculateRangeStats(getActiveRanges()[pos]);
  const playerPct = parseFloat(stats.pct);
  const solverPct = getActiveSolverPct(pos);
  const delta = playerPct - solverPct;

  const deltaLabel = row.querySelector('.val-delta');
  const playerSpan = row.querySelector('.val-player');
  const solverSpan = row.querySelector('.val-solver');
  const progressBar = row.querySelector('.val-progress');
  const posLbl = row.querySelector('.pos-lbl');

  if (playerSpan) playerSpan.textContent = `You: ${playerPct.toFixed(1)}%`;
  if (solverSpan) solverSpan.textContent = `Solver: ${solverPct.toFixed(1)}%`;
  if (posLbl) posLbl.textContent = posVerb(pos);

  let statusText, cls;
  if (Math.abs(delta) < 1.0) { statusText = `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}% OK`; cls = 'ok'; }
  else if (delta > 0) { statusText = `+${delta.toFixed(1)}% wide`; cls = delta > 5.0 ? 'bad' : 'warn'; }
  else { statusText = `${delta.toFixed(1)}% tight`; cls = 'warn'; }

  if (deltaLabel) { deltaLabel.textContent = statusText; deltaLabel.className = `delta-lbl val-delta ${cls}`; }
  if (progressBar) { progressBar.style.width = `${Math.min(playerPct, 100)}%`; progressBar.className = `val-progress ${cls}`; }
}

export function animateRangeGridFades() {
  const cells = document.querySelectorAll('#ranges-matrix-grid .matrix-cell-node');
  gsap.fromTo(cells, { scale: 0.6, opacity: 0 }, {
    scale: 1, opacity: 1, stagger: 0.002, duration: 0.4, ease: 'power2.out'
  });
}

export function initRanges() {
  const posSelector = document.getElementById('ranges-pos-selector');
  const scenarioBtns = document.querySelectorAll('#ranges-scenario-selector button');
  const modeBtns = document.querySelectorAll('#ranges-mode-selector button');
  const toggleDevs = document.getElementById('toggle-deviations');

  if (posSelector) {
    posSelector.innerHTML = '';
    RFI_POSITIONS.forEach(pos => {
      const btn = document.createElement('button');
      btn.className = `pos-select-btn ${pos === activePos ? 'active' : ''}`;
      btn.textContent = pos;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pos-select-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activePos = pos;
        selectedHand = null;
        clearInsight();
        updateRangesGrid();
        animateRangeGridFades();
      });
      posSelector.appendChild(btn);
    });
  }

  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scenarioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeScenario = btn.getAttribute('data-scenario');
      selectedHand = null;
      clearInsight();
      RFI_POSITIONS.forEach(updateValidationCard);
      updateRangesGrid();
      animateRangeGridFades();
    });
  });

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMode = btn.getAttribute('data-mode');
      updateRangesGrid();
      animateRangeGridFades();
    });
  });

  if (toggleDevs) {
    toggleDevs.addEventListener('change', (e) => {
      highlightDeviations = e.target.checked;
      updateRangesGrid();
    });
  }

  RFI_POSITIONS.forEach(updateValidationCard);
  bindTooltip();
  updateRangesGrid();
}
