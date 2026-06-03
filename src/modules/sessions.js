// Sessions page: data-driven timeline rows (from state.sessions), expandable
// report drawers, session-over-session delta pills, and a calendar heatmap.
import gsap from 'gsap';
import { state } from '../state.js';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['nov', 'dez', 'jan', 'fev', 'mar', 'abr', 'mai', 'jun'];
const WEEKS = 35;

// Deterministic PRNG so generated visuals are stable across reloads.
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function initSessions() {
  renderRows();
  buildCalendar();
  initExportModal();
}

/* ---------- Timeline rows (data-driven from state.sessions) ---------- */
function renderRows() {
  const tbody = document.getElementById('sessions-tbody');
  if (!tbody) return;

  // state.sessions is newest-first; the "previous" session for a delta is the next one.
  const sessions = state.sessions;
  tbody.innerHTML = sessions.map((s, i) => {
    const prev = sessions[i + 1] || null;
    return rowMarkup(s) + drawerMarkup(s, prev);
  }).join('');

  // Wire drawer toggles.
  tbody.querySelectorAll('.timeline-row-editorial').forEach(row => {
    row.addEventListener('click', () => toggleDrawer(row));
  });

  // Render the mini cumulative-bb charts for each session.
  sessions.forEach(s => {
    const svg = document.getElementById(`mini-trend-${s.num}`);
    if (svg) drawMiniChart(svg, genWalk(s.bb100, s.num));
  });
}

function rowMarkup(s) {
  const bbCls = s.bb100 > 0 ? 'pos' : s.bb100 < 0 ? 'neg' : '';
  const bbStr = `${s.bb100 > 0 ? '+' : ''}${s.bb100.toFixed(1)}`;
  const compStyle = s.compliance >= 85 ? ' style="color:var(--accent);"' : ' style="color:var(--warn);"';
  return `
    <div class="timeline-row-editorial" data-drawer="drawer-${s.num}">
      <div class="timeline-date-block">${s.date}<div class="timeline-date-sub">${s.time}</div></div>
      <div class="timeline-title-block">
        <div class="editorial-title">Session #${s.num}</div>
        <div class="editorial-desc">${s.hands.toLocaleString('en-US')} hands · ${s.tournaments} tournaments</div>
      </div>
      <div class="timeline-val-block">$${s.buyIns.toFixed(2)}</div>
      <div class="timeline-val-block ${bbCls}">${bbStr}</div>
      <div class="timeline-val-block"${compStyle}>${s.compliance.toFixed(1)}%</div>
    </div>`;
}

function deltaPill(s, prev) {
  if (!prev) {
    return `<span class="delta-pill flat">first recorded session</span>`;
  }
  const d = s.bb100 - prev.bb100;
  const cls = d > 0 ? 'up' : d < 0 ? 'down' : 'flat';
  const arrow = d > 0 ? '▲' : d < 0 ? '▼' : '–';
  const sign = d > 0 ? '+' : '';
  return `<span class="delta-pill ${cls}">${arrow} ${sign}${d.toFixed(1)} bb/100 vs. #${prev.num}</span>`;
}

function drawerMarkup(s, prev) {
  // Nemesis framing: positive nemesisLoss = hero profited from them; negative = they took chips.
  const lost = s.nemesisLoss < 0;
  const amtColor = lost ? 'var(--loss)' : 'var(--accent-2)';
  const amtStr = `${s.nemesisLoss > 0 ? '+' : ''}${s.nemesisLoss.toFixed(0)}bb`;
  const nemesisLine = lost
    ? `Took <span style="color:${amtColor}; font-weight:700;">${amtStr}</span> off you this session.`
    : `You profited <span style="color:${amtColor}; font-weight:700;">${amtStr}</span> against this player.`;

  const insightColor = s.compliance >= 85 ? 'var(--accent)' : 'var(--loss)';
  const insightHead = s.compliance >= 85 ? 'Good discipline.' : 'Low compliance.';

  return `
    <div class="editorial-expand-panel" id="drawer-${s.num}">
      <div style="padding: 0 24px;">${deltaPill(s, prev)}</div>
      <div class="expanded-card-grid">
        <div class="session-card">
          <h4>Session nemesis</h4>
          <p class="mon-number" style="font-size:22px; margin:0;">${s.nemesis}</p>
          <p style="font-size:11.5px; color:var(--fg-muted); margin:8px 0 0;">${nemesisLine}</p>
        </div>
        <div class="session-card">
          <h4>Consistency indices</h4>
          ${bar('C-bet total', s.cbet, '')}
          ${bar('C-bet HU', s.cbetHu, 'blue')}
          ${bar('WTSD', s.wtsd, 'amber')}
        </div>
        <div class="session-card">
          <h4>Session intelligence</h4>
          <p style="font-size:12px; line-height:1.5; color:var(--fg-muted); margin:0;">
            <span style="color:${insightColor}; font-weight:700;">${insightHead}</span> ${s.insight}
          </p>
        </div>
        <div class="session-card chart-card">
          <h4>Cumulative bb progression</h4>
          <div class="mini-chart-container" style="height: 100px; position: relative; margin-top: 10px;">
            <svg class="mini-trend-svg" id="mini-trend-${s.num}" width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mini-gradient-win-${s.num}" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="mini-gradient-loss-${s.num}" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--loss)" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="var(--loss)" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.05)" stroke-dasharray="2,2"/>
              <path class="mini-trend-path" d="" fill="none" stroke="var(--accent)" stroke-width="2"/>
              <path class="mini-trend-area" d="" fill="url(#mini-gradient-win-${s.num})" opacity="1"/>
            </svg>
          </div>
        </div>
      </div>
    </div>`;
}

function bar(label, val, cls) {
  return `
    <div class="session-bar-row">
      <div class="session-bar-lbl"><span>${label}</span><span>${val.toFixed(1)}%</span></div>
      <div class="session-bar-track"><span class="session-bar-fill ${cls}" style="width: ${Math.min(100, val)}%;"></span></div>
    </div>`;
}

function toggleDrawer(row) {
  const drawerId = row.getAttribute('data-drawer');
  if (!drawerId) return;
  const drawer = document.getElementById(drawerId);
  if (!drawer) return;

  const isActive = drawer.classList.contains('active');

  document.querySelectorAll('.editorial-expand-panel').forEach(d => {
    if (d !== drawer && d.classList.contains('active')) {
      gsap.to(d, {
        height: 0, opacity: 0, duration: 0.3, onComplete: () => {
          d.classList.remove('active');
          d.style.display = 'none';
        }
      });
    }
  });

  if (!isActive) {
    drawer.style.display = 'block';
    gsap.fromTo(drawer, { height: 0, opacity: 0 }, {
      height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out',
      onStart: () => drawer.classList.add('active')
    });
  } else {
    gsap.to(drawer, {
      height: 0, opacity: 0, duration: 0.3, onComplete: () => {
        drawer.classList.remove('active');
        drawer.style.display = 'none';
      }
    });
  }
}

// Synthesize a deterministic intra-session cumulative-bb walk that starts at 0
// and lands exactly on the session's final bb/100 (noise vanishes at both ends).
function genWalk(finalBb, seed) {
  const rand = mulberry32(seed * 2654435761);
  const n = 10;
  const amp = Math.max(4, Math.abs(finalBb) * 0.55);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const base = finalBb * t;
    const envelope = Math.sin(Math.PI * t); // 0 at both ends
    const noise = (rand() - 0.5) * 2 * amp * envelope;
    pts.push(+(base + noise).toFixed(2));
  }
  pts[0] = 0;
  pts[n - 1] = finalBb;
  return pts;
}

function drawMiniChart(svgElement, data) {
  if (!svgElement) return;
  const width = 200, height = 100, padding = 10;
  const min = Math.min(...data, 0);
  const max = Math.max(...data, 0);
  const range = max - min || 1;

  const points = data.map((val, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - min) / range) * (height - 2 * padding);
    return { x, y };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) pathD += ` L ${points[i].x} ${points[i].y}`;

  const zeroY = height - padding - ((0 - min) / range) * (height - 2 * padding);
  const areaD = `${pathD} L ${points[points.length - 1].x} ${zeroY} L ${points[0].x} ${zeroY} Z`;

  const pathEl = svgElement.querySelector('.mini-trend-path');
  const areaEl = svgElement.querySelector('.mini-trend-area');
  const baselineEl = svgElement.querySelector('line');

  const isWinning = data[data.length - 1] >= 0;
  const strokeColor = isWinning ? 'var(--accent)' : 'var(--loss)';
  const num = svgElement.id.split('-').pop();
  const gradientId = isWinning ? `mini-gradient-win-${num}` : `mini-gradient-loss-${num}`;

  if (pathEl) { pathEl.setAttribute('d', pathD); pathEl.setAttribute('stroke', strokeColor); }
  if (areaEl) { areaEl.setAttribute('d', areaD); areaEl.setAttribute('fill', `url(#${gradientId})`); }
  if (baselineEl) { baselineEl.setAttribute('y1', zeroY); baselineEl.setAttribute('y2', zeroY); }
}

/* ---------- Calendar heatmap (ported from calendar-heatmap brick) ---------- */
function buildCalendar() {
  const grid = document.getElementById('cal-grid');
  const monthsRow = document.getElementById('cal-months');
  const tip = document.getElementById('cal-tip');
  if (!grid || !monthsRow || !tip) return;

  grid.innerHTML = '';
  monthsRow.innerHTML = '';
  const rand = mulberry32(0x5C0721);

  function classFor(net) {
    if (net === null) return 'empty';
    if (net === 0) return 'flat';
    if (net > 0) return net >= 5 ? 'win4' : net >= 2 ? 'win3' : net >= 0.5 ? 'win2' : 'win1';
    return net <= -5 ? 'loss3' : net <= -1.5 ? 'loss2' : 'loss1';
  }

  function buildDay(net, weekIdx, dayRow) {
    const cell = document.createElement('div');
    const cls = classFor(net);
    cell.className = 'cal-cell ' + cls;
    if (cls === 'empty') return cell;
    const month = MONTHS[Math.min(MONTHS.length - 1, Math.floor((weekIdx / WEEKS) * MONTHS.length))];
    const dom = 1 + (weekIdx % 4) * 7 + dayRow;
    const tourneys = 1 + Math.floor(Math.abs(net) * 1.4 + rand() * 5);
    const itm = 25 + Math.floor(rand() * 40);
    cell.dataset.date = `${dom} ${month}`;
    cell.dataset.dayFull = DAYS_FULL[dayRow];
    cell.dataset.net = net.toFixed(2);
    cell.dataset.tourneys = tourneys;
    cell.dataset.itm = itm;
    return cell;
  }

  DAYS.forEach((dayName, dayRow) => {
    const label = document.createElement('div');
    label.className = 'cal-day-label';
    label.textContent = dayName;
    grid.appendChild(label);
    for (let w = 0; w < WEEKS; w++) {
      const r = rand();
      let net;
      if (r < 0.34) net = null;
      else if (r < 0.40) net = 0;
      else if (r < 0.52) net = -(rand() * 7).toFixed(2) * 1;
      else net = (rand() * 8).toFixed(2) * 1;
      grid.appendChild(buildDay(net, w, dayRow));
    }
  });

  const lead = document.createElement('span');
  lead.style.gridColumn = '1';
  monthsRow.appendChild(lead);
  MONTHS.slice(0, 7).forEach(m => {
    const s = document.createElement('span');
    s.textContent = m;
    monthsRow.appendChild(s);
  });

  grid.addEventListener('mouseover', (e) => {
    const cell = e.target.closest('.cal-cell');
    if (!cell || cell.classList.contains('empty') || !cell.dataset.date) { tip.classList.remove('show'); return; }
    const net = parseFloat(cell.dataset.net);
    const sign = net > 0 ? 'pos' : net < 0 ? 'neg' : '';
    const netStr = net === 0 ? 'zero' : (net > 0 ? '+' : '−') + '$' + Math.abs(net).toFixed(2);
    tip.innerHTML = `<div><span class="net ${sign}">${netStr}</span> · ${cell.dataset.dayFull}, ${cell.dataset.date}</div>`
      + `<div class="meta">${cell.dataset.tourneys} tournaments · ${cell.dataset.itm}% ITM</div>`;
    tip.classList.add('show');
  });
  grid.addEventListener('mousemove', (e) => {
    tip.style.left = Math.min(window.innerWidth - tip.offsetWidth - 12, e.clientX + 14) + 'px';
    tip.style.top = (e.clientY - tip.offsetHeight - 12) + 'px';
  });
  grid.addEventListener('mouseleave', () => tip.classList.remove('show'));
}

/* ---------- Export modal (simulated) ---------- */
function initExportModal() {
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnExportPdf = document.getElementById('btn-export-pdf');
  const exportBackdrop = document.getElementById('export-backdrop');
  const btnCloseExport = document.getElementById('btn-close-export');
  const btnDownloadFile = document.getElementById('btn-download-file');

  const progressBar = document.getElementById('export-progress-bar');
  const pctText = document.getElementById('export-pct');
  const statusText = document.getElementById('export-status-text');
  const logsWindow = document.getElementById('export-terminal-logs');
  const successArea = document.getElementById('export-success-msg');
  const progressArea = document.getElementById('export-progress-area');

  let currentExportType = 'CSV';

  function triggerExport(type) {
    currentExportType = type;
    document.getElementById('export-modal-title').innerText = `Exporting the ledger (${type})`;

    successArea.style.display = 'none';
    progressArea.style.display = 'block';
    progressBar.style.width = '0%';
    pctText.innerText = '0%';
    statusText.innerText = 'Starting compilation sequence...';
    logsWindow.innerHTML = '';

    exportBackdrop.style.display = 'flex';

    let progress = 0;
    const totalHands = state.sessions.reduce((acc, s) => acc + s.hands, 0);
    const logMessages = [
      { pct: 5, msg: 'Starting compilation sequence...' },
      { pct: 15, msg: `Loading session history (${state.sessions.length} active sessions)...` },
      { pct: 28, msg: `Collecting hand-history telemetry (${totalHands.toLocaleString('en-US')} hands)...` },
      { pct: 45, msg: `Converting records to the ${type} buffer...` },
      { pct: 60, msg: 'Validating GTO open-compliance metrics...' },
      { pct: 78, msg: 'Computing bb deltas and win rates by position...' },
      { pct: 90, msg: 'Compressing and validating file integrity...' },
      { pct: 100, msg: `Compilation complete. Ledger ready: ledger.${type.toLowerCase()}` }
    ];

    let currentLogIndex = 0;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          progressArea.style.display = 'none';
          successArea.style.display = 'block';
        }, 300);
      }

      progressBar.style.width = `${progress}%`;
      pctText.innerText = `${progress}%`;

      while (currentLogIndex < logMessages.length && logMessages[currentLogIndex].pct <= progress) {
        const entry = logMessages[currentLogIndex];
        const logLine = document.createElement('div');
        logLine.style.marginBottom = '4px';
        logLine.innerHTML = `<span style="color:var(--accent-2); font-weight:700;">[INFO]</span> ${entry.msg}`;
        logsWindow.appendChild(logLine);
        logsWindow.scrollTop = logsWindow.scrollHeight;
        statusText.innerText = entry.msg;
        currentLogIndex++;
      }
    }, 120);
  }

  if (btnExportCsv) btnExportCsv.addEventListener('click', () => triggerExport('CSV'));
  if (btnExportPdf) btnExportPdf.addEventListener('click', () => triggerExport('PDF'));
  if (btnCloseExport) btnCloseExport.addEventListener('click', () => { exportBackdrop.style.display = 'none'; });
  if (btnDownloadFile) {
    btnDownloadFile.addEventListener('click', () => {
      const filename = `poker_ledger_export_${new Date().toISOString().slice(0, 10)}.${currentExportType.toLowerCase()}`;
      const dummyContent = `Poker Analyzer Export File\nType: ${currentExportType}\nDate: ${new Date().toLocaleString()}\n`;
      const blob = new Blob([dummyContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
      exportBackdrop.style.display = 'none';
    });
  }
}
