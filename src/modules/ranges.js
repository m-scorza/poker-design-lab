// Ranges lab: preflop GTO range builder with compliance vs edit modes
import gsap from 'gsap';

const RFI_POSITIONS = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
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

// Deviations defined for Compliance overlay (based on overplays/underplays)
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

// Local copy of range states for editing
let activeScenario = 'rfi'; // 'rfi' or 'pushfold'
let rfiRanges = JSON.parse(JSON.stringify(defaultRanges));
let pushFoldRangesState = JSON.parse(JSON.stringify(pushFoldRanges));

let activePos = 'BTN';
let activeMode = 'compliance'; // 'compliance' or 'edit'
let highlightDeviations = true;

function getActiveRanges() {
  return activeScenario === 'rfi' ? rfiRanges : pushFoldRangesState;
}

function getActiveSolverPct(pos) {
  return activeScenario === 'rfi' ? rangesPct[pos] : pushFoldPct[pos];
}

function getActiveDeviations() {
  return activeScenario === 'rfi' ? deviationCombos : pushFoldDeviations;
}
// Helper to count hand combos
function getComboCount(hand) {
  if (hand.length === 2) return 6; // Pair, e.g. AA
  if (hand.endsWith('s')) return 4; // Suited, e.g. AKs
  return 12; // Offsuit, e.g. AKo
}

// Calculate stats for a range
function calculateRangeStats(rangeObj) {
  let combos = 0;
  rangeObj.Always.forEach(h => { combos += getComboCount(h); });
  rangeObj.Mix.forEach(h => { combos += getComboCount(h) * 0.5; });
  return {
    combos: Math.round(combos),
    pct: ((combos / 1326) * 100).toFixed(1)
  };
}

// Update the Validation panel on the right
function updateValidationCard(pos) {
  const row = document.getElementById(`validation-${pos}`);
  if (!row) return;

  const currentRanges = getActiveRanges();
  const stats = calculateRangeStats(currentRanges[pos]);
  const playerPct = parseFloat(stats.pct);
  const solverPct = getActiveSolverPct(pos);
  const delta = playerPct - solverPct;

  const deltaLabel = row.querySelector('.val-delta');
  const playerSpan = row.querySelector('.val-player');
  const solverSpan = row.querySelector('.val-solver');
  const progressBar = row.querySelector('.val-progress');
  const posLbl = row.querySelector('.pos-lbl');

  if (playerSpan) playerSpan.innerText = `Player: ${playerPct.toFixed(1)}%`;
  if (solverSpan) solverSpan.innerText = `Solver: ${solverPct.toFixed(1)}%`;

  if (posLbl) {
    if (activeScenario === 'rfi') {
      posLbl.innerText = pos === 'BB' ? 'BB Defend' : `${pos} Open`;
    } else {
      posLbl.innerText = pos === 'BB' ? 'BB Call' : `${pos} Shove`;
    }
  }

  let statusText = '';
  let color = 'var(--accent-2)';

  if (Math.abs(delta) < 1.0) {
    statusText = `+${delta >= 0 ? '' : ''}${delta.toFixed(1)}% OK`;
    color = 'var(--accent-2)';
  } else if (delta > 0) {
    statusText = `+${delta.toFixed(1)}% Wide`;
    color = delta > 5.0 ? 'var(--loss)' : '#ffaa00';
  } else {
    statusText = `${delta.toFixed(1)}% Tight`;
    color = '#ffaa00';
  }

  if (deltaLabel) {
    deltaLabel.innerText = statusText;
    deltaLabel.style.color = color;
  }

  if (progressBar) {
    progressBar.style.width = `${Math.min(playerPct, 100)}%`;
    progressBar.style.backgroundColor = color;
  }
}

function updateRangesGrid() {
  const rangesGridContainer = document.getElementById('ranges-matrix-grid');
  if (!rangesGridContainer) return;
  rangesGridContainer.innerHTML = '';
  const matrixRanks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

  const currentRanges = getActiveRanges();
  const range = currentRanges[activePos];
  const devList = getActiveDeviations()[activePos] || [];

  for (let r = 0; r < 13; r++) {
    for (let c = 0; c < 13; c++) {
      const cell = document.createElement('div');
      cell.className = 'matrix-cell-node';

      let hand = '';
      if (r === c) hand = matrixRanks[r] + matrixRanks[c];
      else if (r < c) hand = matrixRanks[r] + matrixRanks[c] + 's';
      else hand = matrixRanks[c] + matrixRanks[r] + 'o';

      cell.innerText = hand;

      const isAlways = range.Always.includes(hand);
      const isMix = range.Mix.includes(hand);
      const isDev = devList.includes(hand);

      // Color coding states
      if (isAlways) {
        cell.classList.add('open-range');
      } else if (isMix) {
        cell.classList.add('mix-range');
      }

      // Blinking deviations logic (only in compliance mode)
      if (activeMode === 'compliance' && highlightDeviations && isDev) {
        cell.classList.add('blinking-deviation');
      }

      // Click behavior for Range Editor
      cell.addEventListener('click', () => {
        if (activeMode !== 'edit') return;

        if (range.Always.includes(hand)) {
          // Move from Always to Mix
          range.Always = range.Always.filter(h => h !== hand);
          range.Mix.push(hand);
          cell.classList.remove('open-range');
          cell.classList.add('mix-range');
        } else if (range.Mix.includes(hand)) {
          // Move from Mix to Fold/Closed
          range.Mix = range.Mix.filter(h => h !== hand);
          cell.classList.remove('mix-range');
        } else {
          // Move from Fold to Always
          range.Always.push(hand);
          cell.classList.add('open-range');
        }

        // Recalculate stats for the label and delta panels
        const stats = calculateRangeStats(range);
        document.getElementById('ranges-combos-lbl').innerText = `${stats.combos} combos (${stats.pct}%)`;
        updateValidationCard(activePos);
      });

      rangesGridContainer.appendChild(cell);
    }
  }

  // Update footer info text
  const stats = calculateRangeStats(range);
  document.getElementById('ranges-combos-lbl').innerText = `${stats.combos} combos (${stats.pct}%)`;
}

export function animateRangeGridFades() {
  const cells = document.querySelectorAll('#ranges-matrix-grid .matrix-cell-node');
  gsap.fromTo(cells, { scale: 0.6, opacity: 0 }, {
    scale: 1, opacity: 1, stagger: 0.002, duration: 0.4, ease: 'power2.out'
  });
}

export function initRanges() {
  const rangesPosSelector = document.getElementById('ranges-pos-selector');
  const scenarioBtns = document.querySelectorAll('#ranges-scenario-selector button');
  const modeBtns = document.querySelectorAll('[data-mode]');
  const toggleDevsCheckbox = document.getElementById('toggle-deviations');

  // Build position buttons UTG through BB
  if (rangesPosSelector) {
    rangesPosSelector.innerHTML = '';
    RFI_POSITIONS.forEach(pos => {
      const btn = document.createElement('button');
      btn.className = `pos-select-btn ${pos === activePos ? 'active' : ''}`;
      btn.innerText = pos;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pos-select-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activePos = pos;
        updateRangesGrid();
        animateRangeGridFades();
      });
      rangesPosSelector.appendChild(btn);
    });
  }

  // Setup scenario toggles (RFI Open vs Push/Fold 10bb)
  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scenarioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeScenario = btn.getAttribute('data-scenario');
      
      // Update validation cards for all positions
      RFI_POSITIONS.forEach(pos => {
        updateValidationCard(pos);
      });
      
      updateRangesGrid();
      animateRangeGridFades();
    });
  });

  // Setup mode toggles (Compliance vs Edit Range)
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMode = btn.getAttribute('data-mode');
      
      updateRangesGrid();
      animateRangeGridFades();
    });
  });

  // Setup Solver Overlay Checkbox toggle
  if (toggleDevsCheckbox) {
    toggleDevsCheckbox.addEventListener('change', (e) => {
      highlightDeviations = e.target.checked;
      updateRangesGrid();
    });
  }

  // Initialize validation panels for all positions
  RFI_POSITIONS.forEach(pos => {
    updateValidationCard(pos);
  });

  // Initial draw
  updateRangesGrid();
}
