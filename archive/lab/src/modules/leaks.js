// Leaks ledger swaps + 13x13 leak matrix render + collapsible drawers.
import gsap from 'gsap';
import { state } from '../state.js';

const leaksData = {
  btn: {
    sev: 'Critical', sevClass: 'dev',
    meta: 'Main leak · 1 of 3 · BTN · 100bb',
    head: 'The button is <span class="leak-highlight">bleeding.</span>',
    desc: "You are opening <b>58%</b> on the button, where the solver wants <b>48–52%</b>. The bottom 6% of that range — <i>K8s K7s Q6s Q5s J7s T7s</i> — are the most punished by late-position 3-bets.",
    dev: '+8.0%', cost: '-28bb/100', tourney: '-$0.62', recover: '+$60',
    pos: 'BTN OPEN', activeCombos: ['K8s', 'K7s', 'Q6s', 'Q5s', 'J7s', 'T7s', 'K9s', 'QTs', 'J9s', 'T8s'],
    coachTitle: 'Fixing the too-wide BTN open',
    coachPlan: 'Cut the weakest opens/calls first. Review every out-of-range VPIP hand before the next session. Focus on removing the bottom 6% of the range (K8s, K7s, Q6s, J7s, T7s) to protect yourself from CO/BB squeezes.',
    coachChecklist: [
      'Review the BTN RFI ranges at 100bb (cap at 48%).',
      'Mark K8s-K7s as a default FOLD against aggressively 3-betting blinds.',
      'Run a 10-spot drill in the Arena to calibrate button folds.'
    ],
    // Range bar metrics
    metricName: 'BTN RFI frequency',
    minTarget: 48,
    maxTarget: 52,
    actualVal: 58,
    color: 'var(--loss)',
    histogram: [10, 15, 20, 28, 48, 62, 54, 40, 24, 10, 5],
    handsFilter: (h) => h.pos === 'BTN' && !h.compliant
  },
  bb: {
    sev: 'High', sevClass: 'dev',
    meta: 'High priority · 2 of 3 · BB · 25bb',
    head: 'Folding too much on the <span class="leak-highlight">big blind.</span>',
    desc: "You fold <b>68%</b> against late-position button opens, where optimal ranges defend <b>52-56%</b>. You are giving up profitable defenses like <i>T8o 97o Q6s J7s</i>.",
    dev: '-12.0%', cost: '-18bb/100', tourney: '-$0.38', recover: '+$35',
    pos: 'BB DEFENSE', activeCombos: ['T8o', '97o', 'Q6s', 'J7s', '86s', 'T7s', 'J6s'],
    coachTitle: 'Fixing the Big Blind overfold',
    coachPlan: 'Defend the BB more aggressively against late-position button steals. You are folding 12% beyond optimal, letting opponents print chips by stealing your blind.',
    coachChecklist: [
      'Identify the button open size: fold against 3x, defend against 2x-2.2x.',
      'Practice flatting hands like T8o, 97o, Q6s, J7s instead of folding.',
      'Flag overfold cases with effective stack below 20bb.'
    ],
    // Range bar metrics
    metricName: 'BB defense frequency',
    minTarget: 52,
    maxTarget: 56,
    actualVal: 40,
    color: 'var(--warn)',
    histogram: [5, 10, 18, 32, 45, 38, 22, 10, 6, 2],
    handsFilter: (h) => h.pos === 'BB' && h.scenario === 'VS_OPEN'
  },
  sb: {
    sev: 'Medium', sevClass: 'ok',
    meta: 'Medium priority · 3 of 3 · SB · 40bb',
    head: 'Flatting <span class="leak-highlight">weak offsuit aces.</span>',
    desc: "Calls lose money in the Small Blind against early-position opens. Hands like <i>A8o A7o KJo</i> are massively negative flats.",
    dev: '+6.4%', cost: '-11bb/100', tourney: '-$0.15', recover: '+$18',
    pos: 'SB FLAT VS UTG', activeCombos: ['A8o', 'A7o', 'KJo', 'QTo', 'JTo'],
    coachTitle: 'SB flat correction plan',
    coachPlan: 'Stop calling in the Small Blind against UTG and MP raises. UTG open ranges are tight; flatting weak offsuit aces out of position is a huge long-term leak.',
    coachChecklist: [
      'Enforce a strict 3-bet or fold policy in the Small Blind.',
      'Never call with offsuit broadways or weak offsuit aces.',
      'Review Sunday sessions for Small Blind compliance leaks.'
    ],
    // Range bar metrics
    metricName: 'SB flat frequency',
    minTarget: 0,
    maxTarget: 4,
    actualVal: 10,
    color: 'var(--fg-muted)',
    histogram: [2, 5, 8, 12, 22, 35, 28, 15, 8, 3],
    handsFilter: (h) => h.pos === 'SB' && h.action === 'call'
  }
};

export function initLeaks() {
  const leakMatrixContainer = document.getElementById('leak-matrix-grid');
  const leakIndexRows = document.querySelectorAll('.leak-index-row');

  // SVG Histogram Renderer Helper
  function drawHistogram(containerId, data, color) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 240;
    const height = 100;
    const gap = 3;
    const numBars = data.length;
    const barWidth = (width - (numBars - 1) * gap) / numBars;
    const max = Math.max(...data) || 1;

    let svgContent = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="background: rgba(0,0,0,0.3); border-radius: 6px; border: 1px solid var(--border); padding: 6px;">`;

    // Horizontal grid lines
    svgContent += `
      <line x1="0" y1="25" x2="${width}" y2="25" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      <line x1="0" y1="50" x2="${width}" y2="50" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      <line x1="0" y1="75" x2="${width}" y2="75" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    `;

    data.forEach((val, i) => {
      const x = i * (barWidth + gap);
      const barHeight = (val / max) * (height - 15);
      const y = height - barHeight - 5;
      svgContent += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="2" opacity="0.8"/>`;
    });

    svgContent += '</svg>';
    container.innerHTML = svgContent;
  }

  // Draw 13x13 Grid
  function generateLeakMatrix(combos = []) {
    if (!leakMatrixContainer) return;
    leakMatrixContainer.innerHTML = '';
    const matrixRanks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

    for (let r = 0; r < 13; r++) {
      for (let c = 0; c < 13; c++) {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell-node';

        let hand = '';
        if (r === c) hand = matrixRanks[r] + matrixRanks[c];
        else if (r < c) hand = matrixRanks[r] + matrixRanks[c] + 's';
        else hand = matrixRanks[c] + matrixRanks[r] + 'o';

        cell.innerText = hand;

        const isOffending = combos.includes(hand);
        const isBaseRange = (r + c) < 9;

        if (isOffending) {
          cell.classList.add('fold-range');
        } else if (isBaseRange) {
          cell.classList.add('open-range');
        }

        leakMatrixContainer.appendChild(cell);
      }
    }
  }

  // Render hand records for each drawer
  function renderDrawerHands(leakId, filterFn) {
    const tbody = document.getElementById(`leak-hands-${leakId}`);
    if (!tbody) return;
    tbody.innerHTML = '';

    const matchingHands = state.hands.filter(filterFn).slice(0, 3); // grab top 3 for the preview drawer
    if (matchingHands.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="leaks-empty-table-cell">No deviation hands found in the database.</td></tr>`;
      return;
    }

    matchingHands.forEach(h => {
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

      tr.innerHTML = `
        <td class="card-pair">${suitsMarkup}</td>
        <td class="hands-td-mono-uppercase-bold">${h.action}</td>
        <td class="hands-td-mono ${h.net.includes('+') ? 'suit-c' : 'suit-h'}">${h.net}</td>
        <td class="hands-td-right"><button class="btn-replay btn-leak-replay" data-id="${h.id}">Replay</button></td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-leak-replay').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent closing row
        if (window.openReplayModal) {
          window.openReplayModal(btn.getAttribute('data-id'));
        }
      });
    });
  }

  // Update target range bar display
  function updateRangeBar(data) {
    const label = document.getElementById('leak-range-label');
    const gtoText = document.getElementById('leak-range-gto');
    const userText = document.getElementById('leak-range-user');
    const band = document.getElementById('leak-range-band');
    const marker = document.getElementById('leak-range-marker');

    if (!label || !gtoText || !userText || !band || !marker) return;

    label.innerText = data.metricName;
    gtoText.innerText = `${data.minTarget}% - ${data.maxTarget}%`;
    userText.innerText = `You: ${data.actualVal}%`;
    userText.style.color = data.color;

    // Reposition elements
    band.style.left = `${data.minTarget}%`;
    band.style.width = `${data.maxTarget - data.minTarget}%`;

    marker.style.left = `${data.actualVal}%`;
    marker.style.backgroundColor = data.color;
    marker.style.boxShadow = `0 0 8px ${data.color}`;
  }

  // Initial draw
  generateLeakMatrix(leaksData.btn.activeCombos);
  updateRangeBar(leaksData.btn);
  buildLeakHeatmap();
  buildLeakGauges();
  buildPositionalStatsHeatmap();
  
  // Render initially expanded first row's lists
  Object.keys(leaksData).forEach(key => {
    drawHistogram(`histogram-container-${key}`, leaksData[key].histogram, leaksData[key].color);
    renderDrawerHands(key, leaksData[key].handsFilter);
  });

  // Make first drawer active on startup
  const firstDrawer = document.getElementById('leak-drawer-btn');
  const firstRow = document.querySelector('[data-leak="btn"]');
  if (firstDrawer && firstRow) {
    firstRow.classList.add('active');
    firstDrawer.style.display = 'block';
    gsap.set(firstDrawer, { height: 'auto', opacity: 1 });
  }

  // Set up row selectors & collapsible drawers
  leakIndexRows.forEach(row => {
    row.addEventListener('click', () => {
      const type = row.getAttribute('data-leak');
      const data = leaksData[type];
      if (!data) return;

      const drawerId = row.getAttribute('data-drawer');
      const currentDrawer = document.getElementById(drawerId);
      if (!currentDrawer) return;

      const isDrawerActive = currentDrawer.classList.contains('active-drawer');

      // 1. Swap Top Details Grid Panel
      const gridBox = document.getElementById('incident-grid-box');
      gsap.to(gridBox, {
        opacity: 0, y: -10, duration: 0.25, onComplete: () => {
          document.getElementById('leak-severity-badge').innerText = data.sev;
          document.getElementById('leak-severity-badge').className = `compliance-badge ${data.sevClass}`;
          document.getElementById('leak-meta').innerText = data.meta;
          document.getElementById('leak-headline').innerHTML = data.head;
          document.getElementById('leak-description').innerHTML = data.desc;

          document.getElementById('leak-stat-dev').innerText = data.dev;
          document.getElementById('leak-stat-cost').innerText = data.cost;
          document.getElementById('leak-stat-tourney').innerText = data.tourney;
          document.getElementById('leak-stat-recover').innerText = data.recover;
          document.getElementById('leak-matrix-pos').innerText = data.pos;

          updateRangeBar(data);
          generateLeakMatrix(data.activeCombos);

          // Update study plan elements
          document.getElementById('coach-title').innerText = data.coachTitle;
          document.getElementById('coach-plan').innerText = data.coachPlan;
          const checklistContainer = document.getElementById('coach-checklist');
          if (checklistContainer) {
            checklistContainer.innerHTML = data.coachChecklist.map(item => `<li>${item}</li>`).join('');
          }

          gsap.fromTo(gridBox, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 });
        }
      });

      // 2. Animate index row highlights
      leakIndexRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      // 3. Animate index drawers accordion style
      document.querySelectorAll('.leak-drawer-panel').forEach(d => {
        if (d !== currentDrawer && d.classList.contains('active-drawer')) {
          gsap.to(d, {
            height: 0, opacity: 0, duration: 0.3, onComplete: () => {
              d.classList.remove('active-drawer');
              d.style.display = 'none';
            }
          });
        }
      });

      if (!isDrawerActive) {
        currentDrawer.style.display = 'block';
        gsap.fromTo(currentDrawer, { height: 0, opacity: 0 }, {
          height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out',
          onStart: () => currentDrawer.classList.add('active-drawer')
        });
      }
    });
  });

  // Keep state matching table re-renders (if hands are uploaded, refresh lists)
  state.subscribe(() => {
    Object.keys(leaksData).forEach(key => {
      renderDrawerHands(key, leaksData[key].handsFilter);
    });
  });
}

/* ---------- Leak × Position severity heatmap (ported from leak-heatmap brick) ---------- */
const HM_COLS = ['UTG / MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
const HM_ROWS = [
  { name: 'BB defense vs ~2.5x', cells: [null, null, ['crit', 8.4], ['high', 3.2], ['med', 1.4], null] },
  { name: '3-bet light', cells: [['low', 0.8], null, ['med', 2.1], ['low', 1.2], ['high', 3.1], null] },
  { name: 'River overbet', cells: [null, ['med', 2.4], ['crit', 5.2], ['high', 1.8], null, null] },
  { name: 'Low-freq steal', cells: [null, ['low', 0.4], ['med', 1.2], ['high', 3.2], ['low', 0.3], null] },
  { name: 'Turn float bluff', cells: [null, null, ['low', 0.6], ['med', 1.4], ['low', 0.6], null] },
  { name: 'Push / fold band', cells: [['low', 0.2], ['low', 0.4], ['low', 0.5], ['med', 0.6], ['low', 0.2], ['low', 0.2]] },
  { name: 'ITM stall', cells: [null, ['low', 0.3], ['low', 0.4], ['med', 0.5], null, ['low', 0.2]] },
  { name: 'Limp re-iso postflop', cells: [['low', 0.8], ['med', 1.4], ['med', 1.2], ['med', 1.4], null, null] }
];
const HM_SEV_LABEL = { crit: 'critical', high: 'high', med: 'medium', low: 'low' };

function buildLeakHeatmap() {
  const grid = document.getElementById('leak-hm-grid');
  const caption = document.getElementById('leak-hm-caption');
  if (!grid || !caption) return;
  grid.innerHTML = '';

  const div = (cls, text) => {
    const d = document.createElement('div');
    d.className = cls;
    if (text != null) d.textContent = text;
    return d;
  };

  grid.appendChild(div('hm-corner'));
  HM_COLS.forEach(c => grid.appendChild(div('hm-col-h', c)));

  HM_ROWS.forEach(row => {
    grid.appendChild(div('hm-row-h', row.name));
    row.cells.forEach((cell, ci) => {
      if (!cell) { grid.appendChild(div('hm-cell empty')); return; }
      const [sev, amt] = cell;
      const el = document.createElement('div');
      el.className = `hm-cell ${sev}`;
      el.innerHTML = `−${amt.toFixed(1)}bb${sev !== 'low' ? `<span class="v">${HM_SEV_LABEL[sev]}</span>` : ''}`;
      el.addEventListener('click', () => {
        grid.querySelectorAll('.hm-cell.sel').forEach(c => c.classList.remove('sel'));
        el.classList.add('sel');
        caption.innerHTML = `<span class="pin">◆</span><span><b>${row.name}</b> · position <b>${HM_COLS[ci]}</b> — severity <b>${HM_SEV_LABEL[sev]}</b></span><span class="amt">−${amt.toFixed(1)} bb/100</span>`;
      });
      grid.appendChild(el);
    });
  });
}

/* ---------- Monitored leak gauges (ported from leak-card-gauge brick) ---------- */
const GAUGE_LEAKS = [
  { name: 'Limping', scen: 'preflop · outside the BB', sev: 'high', dir: 'low',
    cur: 4.2, target: 0, max: 8, unit: '%', cost: 3.1, trend: 'down', delta: '+1.4pts',
    spark: '4,22 18,18 30,19 42,14 54,16 66,10 86,6' },
  { name: 'Low HU C-bet', scen: 'flop · heads-up PFR', sev: 'high', dir: 'high',
    cur: 71, target: 100, max: 100, unit: '%', cost: 2.6, trend: 'up', delta: '+6pts',
    spark: '4,20 18,17 30,18 42,12 54,11 66,8 86,5' },
  { name: 'High WTSD', scen: 'showdown · global', sev: 'med', dir: 'low',
    cur: 38.5, target: 35, max: 50, unit: '%', cost: 1.4, trend: 'down', delta: '+0.9pts',
    spark: '4,8 18,9 30,7 42,11 54,10 66,13 86,15' },
  { name: 'CO overfold', scen: 'preflop · compliance', sev: 'med', dir: 'high',
    cur: 86.2, target: 90, max: 100, unit: '%', cost: 1.1, trend: 'up', delta: '+3.0pts',
    spark: '4,18 18,16 30,15 42,12 54,13 66,9 86,7' },
  { name: 'Cold-call', scen: 'preflop · MP/HJ/CO', sev: 'low', dir: 'low',
    cur: 1.8, target: 0, max: 8, unit: '%', cost: 0.5, trend: 'up', delta: '-2.1pts',
    spark: '4,6 18,8 30,7 42,9 54,8 66,11 86,13' },
  { name: 'Missed C-bet', scen: 'flop · PFR checked', sev: 'low', dir: 'low',
    cur: 9, target: 0, max: 30, unit: '%', cost: 0.7, trend: 'up', delta: '-4pts',
    spark: '4,5 18,7 30,6 42,8 54,9 66,11 86,12' }
];

function buildLeakGauges() {
  const wrap = document.getElementById('leak-gauges');
  if (!wrap) return;
  wrap.innerHTML = '';

  function buildSpark(svg) {
    const pts = svg.dataset.spark;
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    poly.setAttribute('points', pts);
    poly.setAttribute('fill', 'none');
    poly.setAttribute('stroke', 'currentColor');
    poly.setAttribute('stroke-width', '1.5');
    poly.setAttribute('stroke-linecap', 'round');
    poly.setAttribute('stroke-linejoin', 'round');
    poly.setAttribute('opacity', '0.6');
    const last = pts.trim().split(/\s+/).pop().split(',');
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', last[0]); dot.setAttribute('cy', last[1]); dot.setAttribute('r', '2');
    dot.setAttribute('fill', 'currentColor');
    svg.appendChild(poly); svg.appendChild(dot);
  }

  GAUGE_LEAKS.forEach((k) => {
    const fillPct = Math.max(0, Math.min(100, (k.cur / k.max) * 100));
    const markPct = Math.max(0, Math.min(100, (k.target / k.max) * 100));
    const sevLabel = k.sev === 'high' ? 'high severity' : k.sev === 'med' ? 'medium' : 'low';
    const card = document.createElement('div');
    card.className = 'lg-card ' + k.sev;
    card.innerHTML =
      '<div class="lg-top">' +
        '<div><div class="lg-name">' + k.name + '</div><div class="lg-scen">' + k.scen + '</div></div>' +
        '<span class="lg-sev-pill">' + sevLabel + '</span>' +
      '</div>' +
      '<div class="lg-gauge">' +
        '<div class="lg-vals"><span class="lg-cur">' + k.cur + k.unit + '</span>' +
          '<span class="lg-tgt">target ' + k.target + k.unit + (k.dir === 'low' ? ' or less' : '+') + '</span></div>' +
        '<div class="lg-track"><span class="lg-fill"></span><span class="lg-mark" style="left:' + markPct + '%;"></span></div>' +
      '</div>' +
      '<div class="lg-foot">' +
        '<span class="lg-cost">cost <b>' + k.cost.toFixed(1) + ' bb/100</b></span>' +
        '<span class="lg-trend ' + k.trend + '">' + (k.trend === 'up' ? '▲ ' : '▼ ') + k.delta + '</span>' +
        '<svg class="lg-spark" viewBox="0 0 90 28" data-spark="' + k.spark + '"></svg>' +
      '</div>';
    const svg = card.querySelector('.lg-spark');
    buildSpark(svg);
    svg.style.color = getComputedStyle(card).getPropertyValue('--sev');
    wrap.appendChild(card);
    const fill = card.querySelector('.lg-fill');
    requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = fillPct + '%'; }));
    // Fallback: guarantee the final width even if rAF is paused (hidden tab).
    setTimeout(() => { fill.style.width = fillPct + '%'; }, 120);
  });
}

/* ---------- Positional Stats Heatmap (ported from position-stats-heatmap brick) ---------- */
const POS = ['UTG', 'UTG+1', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
// per-metric: values by position + a [lo,hi] on-target band (in %)
const METRICS = {
  vpip:     { name: 'VPIP · by position', band: [16, 30], vals: [14, 15, 18, 24, 31, 44, 38, 62] },
  pfr:      { name: 'PFR · by position', band: [12, 26], vals: [13, 14, 16, 21, 28, 40, 33, 14] },
  threebet: { name: '3-bet % · by position', band: [5, 11], vals: [4, 5, 6, 7, 9, 12, 14, 8] },
  fold:     { name: 'Fold to steal · by position', band: [40, 60], vals: [null, null, null, null, null, null, 52, 66] },
};

function buildPositionalStatsHeatmap() {
  const grid = document.getElementById('leaks-heatmap-grid');
  const caption = document.getElementById('leaks-heatmap-caption');
  const metricName = document.getElementById('leaks-heatmap-metric-name');
  const metricTarget = document.getElementById('leaks-heatmap-metric-target');
  const tabsContainer = document.getElementById('leaks-heatmap-metric-tabs');
  if (!grid || !caption || !metricName || !metricTarget) return;

  let current = 'vpip';

  function mixColors(x, y, t) {
    return {
      r: Math.round(x.r + (y.r - x.r) * t),
      g: Math.round(x.g + (y.g - x.g) * t),
      b: Math.round(x.b + (y.b - x.b) * t)
    };
  }

  function gradeColor(v, band) {
    if (v == null) return { bg: 'rgba(255,255,255,0.04)', score: null };
    const [lo, hi] = band;
    let off = 0;
    if (v < lo) off = (lo - v) / lo;
    else if (v > hi) off = (v - hi) / hi;
    off = Math.min(1, off);
    
    // green → amber → red as off grows
    const g = { r: 94, g: 201, b: 143 };
    const a = { r: 232, g: 196, b: 104 };
    const r = { r: 239, g: 124, b: 116 };
    let c;
    if (off < 0.5) {
      const t = off / 0.5;
      c = mixColors(g, a, t);
    } else {
      const t = (off - 0.5) / 0.5;
      c = mixColors(a, r, t);
    }
    return { bg: `rgb(${c.r},${c.g},${c.b})`, score: off };
  }

  function verdict(score) {
    if (score === 0) return ['on target', 'var(--pos)', 'rgba(94,201,143,0.14)'];
    if (score < 0.4) return ['slight drift', 'var(--warn)', 'rgba(232,196,104,0.14)'];
    return ['leak', 'var(--neg)', 'rgba(239,124,116,0.14)'];
  }

  function describe(pos, v, band, score) {
    const [lbl, col, bgc] = verdict(score);
    const dir = v < band[0] ? 'below' : v > band[1] ? 'above' : 'inside';
    caption.innerHTML = `<span class="pin">◆</span><span><b>${pos}</b> · ${current.toUpperCase()} <b>${v}%</b> — ${dir} the ${band[0]}–${band[1]}% target band</span><span class="tag" style="color:${col};background:${bgc};margin-left:auto;font-size:10px;padding:2px 8px;border-radius:5px;">${lbl}</span>`;
  }

  function selectCell(el, pos, v, band, score) {
    grid.querySelectorAll('.pos-hm-cell.sel').forEach(c => c.classList.remove('sel'));
    el.classList.add('sel');
    describe(pos, v, band, score);
  }

  function div(cls, text) {
    const d = document.createElement('div');
    d.className = cls;
    if (text != null) d.textContent = text;
    return d;
  }

  function renderGrid() {
    const m = METRICS[current];
    metricName.textContent = m.name;
    metricTarget.textContent = `target band ${m.band[0]}–${m.band[1]}%`;
    grid.innerHTML = '';
    
    grid.appendChild(div('pos-hm-corner'));
    POS.forEach(p => grid.appendChild(div('pos-hm-col-h', p)));
    grid.appendChild(div('pos-hm-row-h', m.name.split(' · ')[0]));
    
    m.vals.forEach((v, i) => {
      const { bg, score } = gradeColor(v, m.band);
      const el = document.createElement('div');
      el.className = 'pos-hm-cell';
      el.textContent = v == null ? '·' : v + '%';
      if (v == null) {
        el.classList.add('empty');
      } else {
        el.style.background = bg;
        el.addEventListener('click', () => selectCell(el, POS[i], v, m.band, score));
        el.addEventListener('mouseenter', () => describe(POS[i], v, m.band, score));
      }
      grid.appendChild(el);
    });
  }

  if (tabsContainer) {
    const tabs = tabsContainer.querySelectorAll('.mtab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('on'));
        tab.classList.add('on');
        current = tab.dataset.m;
        renderGrid();
      });
    });
  }

  renderGrid();
}
