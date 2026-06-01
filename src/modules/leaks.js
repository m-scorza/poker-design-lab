// Leaks ledger swaps + 13x13 leak matrix render + collapsible drawers.
import gsap from 'gsap';
import { state } from '../state.js';

const leaksData = {
  btn: {
    sev: 'Critical',
    meta: 'Top leak · 1 of 3 · BTN · 100bb',
    head: 'The button is <span class="leak-highlight">bleeding.</span>',
    desc: "You're opening <b>58%</b> on the button where the solver wants <b>48–52%</b>. The bottom 6% of that range — <i>K8s K7s Q6s Q5s J7s T7s</i> — gets punished hardest by late-position three-bets.",
    dev: '+8.0%', cost: '-28bb/100', tourney: '-$0.62', recover: '+$60',
    pos: 'BTN OPEN', activeCombos: ['K8s', 'K7s', 'Q6s', 'Q5s', 'J7s', 'T7s', 'K9s', 'QTs', 'J9s', 'T8s'],
    coachTitle: 'Fixing BTN Opening wide deviations',
    coachPlan: 'Cut weakest opens/calls first. Review every out-of-range VPIP hand before the next session. Focus on removing the bottom 6% of the range (K8s, K7s, Q6s, J7s, T7s) to protect against CO/BB squeezes.',
    coachChecklist: [
      'Review RFI ranges for BTN 100bb (limit to 48%).',
      'Mark K8s-K7s as default FOLDS against aggressive 3-betting blinds.',
      'Run a 10-spot drill in Arena to calibrate button fold scenarios.'
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
    sev: 'High',
    meta: 'High priority · 2 of 3 · BB · 25bb',
    head: 'Overfolding the <span class="leak-highlight">big blind.</span>',
    desc: "You fold <b>68%</b> versus late-position button opens where optimal ranges defend <b>52-56%</b>. You are folding profitable defenses like <i>T8o 97o Q6s J7s</i>.",
    dev: '-12.0%', cost: '-18bb/100', tourney: '-$0.38', recover: '+$35',
    pos: 'BB DEFENSE', activeCombos: ['T8o', '97o', 'Q6s', 'J7s', '86s', 'T7s', 'J6s'],
    coachTitle: 'Fixing Big Blind Overfolding',
    coachPlan: 'Defend BB more aggressively versus late position button steals. You are currently folding 12% too often, letting players print money by stealing your blind.',
    coachChecklist: [
      'Identify button open sizes: fold to 3x, defend vs 2x-2.2x.',
      'Practice flatting hands like T8o, 97o, Q6s, J7s instead of folding.',
      'Mark instances of overfolding at <20bb effective stack.'
    ],
    // Range bar metrics
    metricName: 'BB defend frequency',
    minTarget: 52,
    maxTarget: 56,
    actualVal: 40,
    color: '#ffaa00',
    histogram: [5, 10, 18, 32, 45, 38, 22, 10, 6, 2],
    handsFilter: (h) => h.pos === 'BB' && h.scenario === 'VS_OPEN'
  },
  sb: {
    sev: 'Medium',
    meta: 'Medium priority · 3 of 3 · SB · 40bb',
    head: 'Flatting weak <span class="leak-highlight">offsuit aces.</span>',
    desc: "Calling folds out of the Small Blind versus early-position opens. Hands like <i>A8o A7o KJo</i> are massive net negative flats.",
    dev: '+6.4%', cost: '-11bb/100', tourney: '-$0.15', recover: '+$18',
    pos: 'SB FLAT VS UTG', activeCombos: ['A8o', 'A7o', 'KJo', 'QTo', 'JTo'],
    coachTitle: 'Remedial SB Flatting Plan',
    coachPlan: 'Stop calling out of the Small Blind against UTG and MP raises. UTG open ranges are tight; flatting weak offsuit aces out of position is a massive long-term bleed.',
    coachChecklist: [
      'Enforce a strict 3-Bet or Fold policy from the Small Blind.',
      'Never call with offsuit broadways or weak offsuit aces.',
      'Review Sunday sessions for Small Blind compliance leaks.'
    ],
    // Range bar metrics
    metricName: 'SB flatting frequency',
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
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--fg-muted);">No deviation hands found in database.</td></tr>`;
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
        <td style="font-family:var(--mono); text-transform:uppercase;">${h.action}</td>
        <td style="font-family:var(--mono);" class="${h.net.includes('+') ? 'suit-c' : 'suit-h'}">${h.net}</td>
        <td style="text-align:right;"><button class="btn-replay btn-leak-replay" data-id="${h.id}">Replay</button></td>
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
          document.getElementById('leak-severity-badge').className = `compliance-badge ${data.sev === 'Critical' ? 'dev' : 'ok'}`;
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
