// Leaks ledger swaps + 13x13 leak matrix render + collapsible drawers.
import gsap from 'gsap';
import { state } from '../state.js';

const leaksData = {
  btn: {
    sev: 'Crítico', sevClass: 'dev',
    meta: 'Leak principal · 1 de 3 · BTN · 100bb',
    head: 'O botão está <span class="leak-highlight">sangrando.</span>',
    desc: "Você está abrindo <b>58%</b> no botão, onde o solver quer <b>48–52%</b>. Os 6% inferiores desse range — <i>K8s K7s Q6s Q5s J7s T7s</i> — são os mais punidos por 3-bets de posição tardia.",
    dev: '+8.0%', cost: '-28bb/100', tourney: '-$0.62', recover: '+$60',
    pos: 'ABERTURA BTN', activeCombos: ['K8s', 'K7s', 'Q6s', 'Q5s', 'J7s', 'T7s', 'K9s', 'QTs', 'J9s', 'T8s'],
    coachTitle: 'Corrigindo a abertura ampla demais no BTN',
    coachPlan: 'Corte primeiro as aberturas/calls mais fracos. Revise toda mão de VPIP fora do range antes da próxima sessão. Foque em remover os 6% inferiores do range (K8s, K7s, Q6s, J7s, T7s) para se proteger de squeezes de CO/BB.',
    coachChecklist: [
      'Revise os ranges de RFI do BTN a 100bb (limite a 48%).',
      'Marque K8s-K7s como FOLD padrão contra blinds que dão 3-bet agressivo.',
      'Rode um drill de 10 spots na Arena para calibrar folds de botão.'
    ],
    // Range bar metrics
    metricName: 'Frequência de RFI no BTN',
    minTarget: 48,
    maxTarget: 52,
    actualVal: 58,
    color: 'var(--loss)',
    histogram: [10, 15, 20, 28, 48, 62, 54, 40, 24, 10, 5],
    handsFilter: (h) => h.pos === 'BTN' && !h.compliant
  },
  bb: {
    sev: 'Alto', sevClass: 'dev',
    meta: 'Alta prioridade · 2 de 3 · BB · 25bb',
    head: 'Fold demais no <span class="leak-highlight">big blind.</span>',
    desc: "Você dá fold <b>68%</b> contra aberturas de botão de posição tardia, onde os ranges ótimos defendem <b>52-56%</b>. Você está abrindo mão de defesas lucrativas como <i>T8o 97o Q6s J7s</i>.",
    dev: '-12.0%', cost: '-18bb/100', tourney: '-$0.38', recover: '+$35',
    pos: 'DEFESA BB', activeCombos: ['T8o', '97o', 'Q6s', 'J7s', '86s', 'T7s', 'J6s'],
    coachTitle: 'Corrigindo o overfold no Big Blind',
    coachPlan: 'Defenda o BB de forma mais agressiva contra roubos de botão em posição tardia. Você está dando fold 12% além do ideal, deixando os adversários imprimirem fichas roubando seu blind.',
    coachChecklist: [
      'Identifique o tamanho do open do botão: fold contra 3x, defenda contra 2x-2.2x.',
      'Pratique o flat de mãos como T8o, 97o, Q6s, J7s em vez de dar fold.',
      'Marque os casos de overfold com stack efetivo abaixo de 20bb.'
    ],
    // Range bar metrics
    metricName: 'Frequência de defesa do BB',
    minTarget: 52,
    maxTarget: 56,
    actualVal: 40,
    color: 'var(--warn)',
    histogram: [5, 10, 18, 32, 45, 38, 22, 10, 6, 2],
    handsFilter: (h) => h.pos === 'BB' && h.scenario === 'VS_OPEN'
  },
  sb: {
    sev: 'Médio', sevClass: 'ok',
    meta: 'Prioridade média · 3 de 3 · SB · 40bb',
    head: 'Flat de <span class="leak-highlight">ases offsuit fracos.</span>',
    desc: "Os calls dão prejuízo no Small Blind contra aberturas de posição inicial. Mãos como <i>A8o A7o KJo</i> são flats massivamente negativos.",
    dev: '+6.4%', cost: '-11bb/100', tourney: '-$0.15', recover: '+$18',
    pos: 'FLAT SB VS UTG', activeCombos: ['A8o', 'A7o', 'KJo', 'QTo', 'JTo'],
    coachTitle: 'Plano de correção do flat no SB',
    coachPlan: 'Pare de dar call no Small Blind contra raises de UTG e MP. Os ranges de open de UTG são apertados; flatar ases offsuit fracos fora de posição é um vazamento enorme no longo prazo.',
    coachChecklist: [
      'Imponha uma política estrita de 3-bet ou fold no Small Blind.',
      'Nunca dê call com broadways offsuit ou ases offsuit fracos.',
      'Revise as sessões de domingo em busca de leaks de compliance no Small Blind.'
    ],
    // Range bar metrics
    metricName: 'Frequência de flat no SB',
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
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--fg-muted);">Nenhuma mão de desvio encontrada na base de dados.</td></tr>`;
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
    userText.innerText = `Você: ${data.actualVal}%`;
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
  { name: 'Defesa BB vs ~2.5x', cells: [null, null, ['crit', 8.4], ['high', 3.2], ['med', 1.4], null] },
  { name: '3-bet light', cells: [['low', 0.8], null, ['med', 2.1], ['low', 1.2], ['high', 3.1], null] },
  { name: 'Overbet no river', cells: [null, ['med', 2.4], ['crit', 5.2], ['high', 1.8], null, null] },
  { name: 'Steal baixa freq.', cells: [null, ['low', 0.4], ['med', 1.2], ['high', 3.2], ['low', 0.3], null] },
  { name: 'Float bluff no turn', cells: [null, null, ['low', 0.6], ['med', 1.4], ['low', 0.6], null] },
  { name: 'Banda push / fold', cells: [['low', 0.2], ['low', 0.4], ['low', 0.5], ['med', 0.6], ['low', 0.2], ['low', 0.2]] },
  { name: 'Stall ITM', cells: [null, ['low', 0.3], ['low', 0.4], ['med', 0.5], null, ['low', 0.2]] },
  { name: 'Limp re-iso pós-flop', cells: [['low', 0.8], ['med', 1.4], ['med', 1.2], ['med', 1.4], null, null] }
];
const HM_SEV_LABEL = { crit: 'crítico', high: 'alto', med: 'médio', low: 'baixo' };

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
        caption.innerHTML = `<span class="pin">◆</span><span><b>${row.name}</b> · posição <b>${HM_COLS[ci]}</b> — severidade <b>${HM_SEV_LABEL[sev]}</b></span><span class="amt">−${amt.toFixed(1)} bb/100</span>`;
      });
      grid.appendChild(el);
    });
  });
}

/* ---------- Monitored leak gauges (ported from leak-card-gauge brick) ---------- */
const GAUGE_LEAKS = [
  { name: 'Limping', scen: 'pré-flop · fora da BB', sev: 'high', dir: 'low',
    cur: 4.2, target: 0, max: 8, unit: '%', cost: 3.1, trend: 'down', delta: '+1.4pts',
    spark: '4,22 18,18 30,19 42,14 54,16 66,10 86,6' },
  { name: 'C-bet HU baixo', scen: 'flop · PFR heads-up', sev: 'high', dir: 'high',
    cur: 71, target: 100, max: 100, unit: '%', cost: 2.6, trend: 'up', delta: '+6pts',
    spark: '4,20 18,17 30,18 42,12 54,11 66,8 86,5' },
  { name: 'WTSD alto', scen: 'showdown · global', sev: 'med', dir: 'low',
    cur: 38.5, target: 35, max: 50, unit: '%', cost: 1.4, trend: 'down', delta: '+0.9pts',
    spark: '4,8 18,9 30,7 42,11 54,10 66,13 86,15' },
  { name: 'Overfold CO', scen: 'pré-flop · compliance', sev: 'med', dir: 'high',
    cur: 86.2, target: 90, max: 100, unit: '%', cost: 1.1, trend: 'up', delta: '+3.0pts',
    spark: '4,18 18,16 30,15 42,12 54,13 66,9 86,7' },
  { name: 'Cold-call', scen: 'pré-flop · MP/HJ/CO', sev: 'low', dir: 'low',
    cur: 1.8, target: 0, max: 8, unit: '%', cost: 0.5, trend: 'up', delta: '-2.1pts',
    spark: '4,6 18,8 30,7 42,9 54,8 66,11 86,13' },
  { name: 'C-bet perdido', scen: 'flop · PFR deu check', sev: 'low', dir: 'low',
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
    const sevLabel = k.sev === 'high' ? 'severidade alta' : k.sev === 'med' ? 'média' : 'baixa';
    const card = document.createElement('div');
    card.className = 'lg-card ' + k.sev;
    card.innerHTML =
      '<div class="lg-top">' +
        '<div><div class="lg-name">' + k.name + '</div><div class="lg-scen">' + k.scen + '</div></div>' +
        '<span class="lg-sev-pill">' + sevLabel + '</span>' +
      '</div>' +
      '<div class="lg-gauge">' +
        '<div class="lg-vals"><span class="lg-cur">' + k.cur + k.unit + '</span>' +
          '<span class="lg-tgt">alvo ' + k.target + k.unit + (k.dir === 'low' ? ' ou menos' : '+') + '</span></div>' +
        '<div class="lg-track"><span class="lg-fill"></span><span class="lg-mark" style="left:' + markPct + '%;"></span></div>' +
      '</div>' +
      '<div class="lg-foot">' +
        '<span class="lg-cost">custo <b>' + k.cost.toFixed(1) + ' bb/100</b></span>' +
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
