/* =========================================================
   COMMAND DESK — desk-engine.js
   data · loader · count-ups · monument curve · gauge · ring HUD
   chip build · 13×13 grid · chart · positional · alerts · wire
   theme/motion dock · command palette · cursor
   ========================================================= */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const motionOff = () => document.body.dataset.motion === 'off';
  const ease = t => 1 - Math.pow(1 - t, 3);

  /* ----------------------------- DATA (current production) ----------------------------- */
  const EQUITY = [0,12,8,22,18,30,26,40,52,46,60,74,66,88,102,94,118,140,128,150,142,170,196,182,214,236,228,262,250,286,318,306,344,366,356,389];
  const CHART = {
    lifetime: { line: 'M 0,168 Q 228,128 456,144 T 912,72 Q 1026,92 1140,28', ev: 'M 0,170 Q 228,140 456,150 T 912,96 Q 1026,104 1140,60', foot: ['First session','Running +4.2bb/100 above GTO EV · variance normal','Now'] },
    '30d': { line: 'M 0,150 Q 200,160 400,120 T 800,90 Q 1000,70 1140,40', ev: 'M 0,150 Q 200,150 400,130 T 800,100 Q 1000,86 1140,64', foot: ['30 days ago','+$24.30 this month · trend stable','Now'] },
    '7d': { line: 'M 0,120 Q 200,140 400,150 T 760,70 Q 980,110 1140,50', ev: 'M 0,125 Q 200,130 400,135 T 760,96 Q 980,108 1140,78', foot: ['7 days ago','+$11.80 this week · 3 sessions','Now'] },
  };
  const STATS = {
    vpip: { val: 21.8, pct: 0.62, color: 'var(--accent)', lbl: 'VPIP', full: 'VPIP · voluntary in pot', target: 'Target 20–30%' },
    pfr:  { val: 17.2, pct: 0.50, color: 'var(--accent-2)', lbl: 'PFR', full: 'PFR · preflop raise', target: 'Target 15–22%' },
    '3bet': { val: 8.4, pct: 0.40, color: 'var(--loss)', lbl: '3-BET', full: '3-bet frequency', target: 'Target 6–10%' },
  };
  const POSITIONS = {
    BTN: { profit: -28.0, neg: true, vpip: 28.4, pfr: 22.1, vol: 1842, insight: 'Opening bottom-of-range holdings preflop. The blinds are tightening aggressively. Cut K7s/Q5s/T7s opens.' },
    SB:  { profit: -8.4, neg: true, vpip: 31.2, pfr: 19.5, vol: 1180, insight: 'Completing too often out of position. Tighten limps; 3-bet or fold against late opens.' },
    BB:  { profit: 1.2, neg: false, vpip: 24.6, pfr: 9.1, vol: 1560, insight: 'Defending at a healthy clip. Watch over-folding vs 2.5x button steals on dry boards.' },
    UTG: { profit: 4.2, neg: false, vpip: 14.1, pfr: 12.8, vol: 980, insight: 'Disciplined early. A touch more 3-bet bluff value available vs late position opens.' },
    HJ:  { profit: 8.1, neg: false, vpip: 18.9, pfr: 16.2, vol: 1124, insight: 'Solid, balanced opening. Strongest of your middle positions — keep applying pressure.' },
    CO:  { profit: 14.8, neg: false, vpip: 23.5, pfr: 20.4, vol: 1310, insight: 'Your most profitable seat. Isolation raises and steals are firing on all cylinders.' },
  };
  const ALERTS = [
    { sev: 'loss', t: 'BTN open range too wide', b: 'The bottom 8% of your button opens (K7s, Q5s, T7s) loses −28bb/100 against reactive blinds. Trimming these is the single highest-EV fix on the board.' },
    { sev: 'warn', t: 'SB completes off-tune', b: 'You complete the small blind 11pts above solver. Replace limps with a 3-bet-or-fold strategy versus cutoff and button opens.' },
    { sev: 'warn', t: 'River over-fold vs barrels', b: 'On turn-checked, river-bet lines you fold 6pts too often. Add bluff-catchers with showdown value on blank rivers.' },
  ];
  const WIRE = [
    { t: 'BANKROLL', v: '+$388.85', cls: 'win' },
    { t: 'VERDICT', v: 'Move up in stakes · 78/100', cls: 'win' },
    { t: '#1 LEAK', v: 'BTN open −28bb/100', cls: 'loss' },
    { t: 'ROI', v: '+141.4% over 250 MTTs' },
    { t: 'ITM', v: '35.6% vs 16% field', cls: 'win' },
    { t: 'BEST SEAT', v: 'CO +14.8bb', cls: 'win' },
    { t: 'WORST SEAT', v: 'BTN −28.0bb', cls: 'loss' },
    { t: 'ABI', v: '$1.10 · stable' },
    { t: 'VOLUME', v: '+324,580 chips · +8.24 bb/100' },
    { t: 'COMPLIANCE', v: 'GTO 87.5% · target ≥85%', cls: 'win' },
  ];

  /* ----------------------------- COUNT-UP ----------------------------- */
  function countUp(node, to, opts) {
    opts = opts || {};
    const dur = opts.dur || 1400, dec = opts.dec || 0, pre = opts.pre || '', suf = opts.suf || '', sign = opts.sign || '';
    if (motionOff()) { node.textContent = sign + pre + to.toFixed(dec) + suf; return; }
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / dur, 1);
      const v = to * ease(t);
      node.textContent = sign + pre + v.toFixed(dec) + suf;
      if (t < 1) requestAnimationFrame(frame);
      else node.textContent = sign + pre + to.toFixed(dec) + suf;
    }
    requestAnimationFrame(frame);
  }
  function countUpInt(node, to, opts) {
    opts = opts || {}; const dur = opts.dur || 1400, pre = opts.pre || '', suf = opts.suf || '', sign = opts.sign || '';
    if (motionOff()) { node.textContent = sign + pre + to.toLocaleString('en-US') + suf; return; }
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / dur, 1);
      const v = Math.round(to * ease(t));
      node.textContent = sign + pre + v.toLocaleString('en-US') + suf;
      if (t < 1) requestAnimationFrame(frame); else node.textContent = sign + pre + to.toLocaleString('en-US') + suf;
    }
    requestAnimationFrame(frame);
  }

  /* ----------------------------- MONUMENT equity curve ----------------------------- */
  function buildMonCurve() {
    const wrap = $('#monCurve'); if (!wrap) return;
    const W = 560, H = 320, pad = 10;
    const max = Math.max(...EQUITY), min = Math.min(...EQUITY);
    const xs = i => pad + (i / (EQUITY.length - 1)) * (W - pad * 2);
    const ys = v => H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2);
    const pts = EQUITY.map((v, i) => [xs(i), ys(v)]);
    const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const area = line + ` L${xs(EQUITY.length - 1).toFixed(1)} ${H} L${pad} ${H} Z`;
    const last = pts[pts.length - 1];
    wrap.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs><linearGradient id="mong" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.22"/><stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
      </linearGradient></defs>
      <path d="${area}" fill="url(#mong)" class="mon-area"/>
      <path d="${line}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mon-line" style="filter:drop-shadow(0 0 8px var(--accent-glow))"/>
      <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="4" fill="var(--accent-2)" class="mon-dot" style="filter:drop-shadow(0 0 6px var(--accent-glow))"/>
    </svg>`;
    const path = $('.mon-line', wrap), dot = $('.mon-dot', wrap), areaEl = $('.mon-area', wrap);
    if (motionOff()) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
    dot.style.opacity = 0; areaEl.style.opacity = 0;
    requestAnimationFrame(() => {
      path.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(.3,.7,.2,1)';
      path.style.strokeDashoffset = '0';
      areaEl.style.transition = 'opacity 1.5s ease .6s'; areaEl.style.opacity = 1;
      dot.style.transition = 'opacity .5s ease 2s'; dot.style.opacity = 1;
    });
  }

  /* ----------------------------- VERDICT gauge ----------------------------- */
  function buildGauge() {
    const g = $('#gaugeFg'); if (!g) return;
    const r = 42, circ = 2 * Math.PI * r;
    g.style.strokeDasharray = circ; g.style.strokeDashoffset = circ;
    const num = $('#gaugeNum');
    setTimeout(() => {
      g.style.strokeDashoffset = circ * (1 - 0.78);
      countUpInt(num, 78, { dur: 1300 });
    }, 500);
  }

  /* ----------------------------- RING HUD ----------------------------- */
  let activeStat = 'vpip';
  function buildHud() {
    const svg = $('#hudSvg'); if (!svg) return;
    const radii = { vpip: 76, pfr: 60, '3bet': 44 };
    let rings = '';
    Object.entries(STATS).forEach(([k, s]) => {
      const r = radii[k], circ = 2 * Math.PI * r;
      rings += `<circle class="ring-bg" cx="84" cy="84" r="${r}"/>
        <circle class="ring-fg ring-${k}" cx="84" cy="84" r="${r}" stroke="${s.color}" stroke-dasharray="${circ}" stroke-dashoffset="${circ}"/>`;
    });
    rings += `<g class="hud-sweep"><line x1="84" y1="84" x2="84" y2="6" stroke="var(--border-strong)" stroke-width="1"/></g>`;
    svg.innerHTML = rings;
    setTimeout(() => {
      Object.entries(STATS).forEach(([k, s]) => {
        const r = radii[k], circ = 2 * Math.PI * r;
        const ring = $('.ring-' + k, svg);
        if (ring) ring.style.strokeDashoffset = circ * (1 - s.pct);
      });
    }, 450);
    // stat triggers
    const list = $('#hudStats');
    Object.entries(STATS).forEach(([k, s]) => {
      const b = el('button', 'stat-trigger' + (k === 'vpip' ? ' active' : ''),
        `<span class="sl"><span class="dotc" style="background:${s.color}"></span>${s.full.split(' · ')[0]} <small>${s.full.split(' · ')[1] || ''}</small></span><span class="sv">${s.val}%</span>`);
      b.dataset.stat = k;
      b.addEventListener('click', () => setStat(k));
      list.appendChild(b);
    });
    setStat('vpip', true);
  }
  function setStat(k, silent) {
    activeStat = k; const s = STATS[k];
    $$('#hudStats .stat-trigger').forEach(b => b.classList.toggle('active', b.dataset.stat === k));
    $('#hudLbl').textContent = s.lbl;
    const valNode = $('#hudVal');
    if (silent && !motionOff()) countUp(valNode, s.val, { dur: 1100, dec: 1, suf: '%' });
    else if (motionOff()) valNode.textContent = s.val + '%';
    else countUp(valNode, s.val, { dur: 700, dec: 1, suf: '%' });
  }

  /* ----------------------------- CHIP STACK ----------------------------- */
  function buildChips() {
    const wrap = $('#chips'); if (!wrap) return;
    // three columns, heights represent chip volume bands
    const cols = [{ n: 5, c: 'c1' }, { n: 8, c: 'c2' }, { n: 4, c: 'c3' }];
    let delay = 0;
    cols.forEach(col => {
      const c = el('div', 'chip-col');
      for (let i = 0; i < col.n; i++) {
        const chip = el('div', 'chip ' + col.c + (i === col.n - 1 ? ' cap' : ''));
        chip.style.animationDelay = (delay += 60) + 'ms';
        c.appendChild(chip);
      }
      wrap.appendChild(c);
    });
  }
  function animateChips() {
    if (motionOff()) { $$('#chips .chip').forEach(c => c.classList.add('in')); return; }
    $$('#chips .chip').forEach(c => c.classList.add('in'));
  }

  /* ----------------------------- 13×13 RFI GRID ----------------------------- */
  const RANK = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'];
  const DEV_HANDS = new Set(['K7s', 'Q5s', 'T7s']);
  function buildMatrix() {
    const grid = $('#matrix'); if (!grid) return;
    let cells = [];
    for (let r = 0; r < 13; r++) {
      for (let c = 0; c < 13; c++) {
        const pair = r === c, suited = c > r;
        const hi = Math.min(r, c), lo = Math.max(r, c);
        const lbl = pair ? RANK[r] + RANK[c] : RANK[hi] + RANK[lo] + (suited ? 's' : 'o');
        // BTN RFI ~ wide. strength heuristic (lower = stronger)
        let strength = (hi + lo) / 2 + (pair ? -3.5 : 0) + (suited ? -1.3 : 0) + Math.abs(c - r) * 0.42;
        let cls = 'fold';
        if (DEV_HANDS.has(lbl)) cls = 'dev';
        else if (strength < 4.0) cls = 'open';
        else if (strength < 6.0) cls = 'mix';
        else if (strength < 7.4) cls = 'open';
        cells.push({ lbl, cls });
      }
    }
    grid.innerHTML = '';
    cells.forEach((c, i) => {
      const e = el('div', 'mc ' + c.cls + (c.cls === 'dev' ? ' pulse' : ''), c.lbl);
      e.dataset.idx = i;
      grid.appendChild(e);
    });
  }
  function animateMatrix() {
    const cells = $$('#matrix .mc');
    if (motionOff()) { cells.forEach(c => c.classList.add('in')); return; }
    cells.forEach((c, i) => {
      const r = Math.floor(i / 13), col = i % 13;
      setTimeout(() => c.classList.add('in'), (r + col) * 22);
    });
  }

  /* ----------------------------- BANKROLL CHART ----------------------------- */
  let chartMode = 'lifetime';
  function buildChart(mode, animate) {
    chartMode = mode; const d = CHART[mode];
    const line = $('#chLine'), ev = $('#chEv'), area = $('#chArea'), dot = $('#chDot');
    line.setAttribute('d', d.line);
    ev.setAttribute('d', d.ev);
    area.setAttribute('d', d.line + ' L 1140,180 L 0,180 Z');
    // place dot at path end (approx from last coords in string)
    const m = d.line.match(/([\d.]+),([\d.]+)$/);
    if (m) { dot.setAttribute('cx', m[1]); dot.setAttribute('cy', m[2]); }
    const foot = $$('#chartFoot span');
    foot[0].textContent = d.foot[0]; foot[1].textContent = d.foot[1]; foot[2].textContent = d.foot[2];
    $$('#chartTabs button').forEach(b => b.classList.toggle('on', b.dataset.chart === mode));
    if (animate && !motionOff()) {
      const len = line.getTotalLength();
      line.style.strokeDasharray = len; line.style.strokeDashoffset = len;
      area.style.opacity = 0; dot.style.opacity = 0; ev.style.opacity = 0;
      requestAnimationFrame(() => {
        line.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.3,.7,.2,1)'; line.style.strokeDashoffset = '0';
        area.style.transition = 'opacity 1.2s ease .5s'; area.style.opacity = 0.9;
        ev.style.transition = 'opacity .8s ease .8s'; ev.style.opacity = 0.7;
        dot.style.transition = 'opacity .5s ease 1.6s'; dot.style.opacity = 1;
      });
    }
  }
  function chartHover() {
    const wrap = $('#chartWrap'), tip = $('#chTip'); if (!wrap) return;
    const total = 388.85;
    wrap.addEventListener('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      const rel = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      tip.style.left = (rel * 100) + '%';
      tip.style.top = '20%';
      const v = Math.round(total * rel * 100) / 100;
      tip.innerHTML = `${Math.round(rel * 100)}% · <b>+$${v.toFixed(2)}</b>`;
      tip.style.opacity = 1;
    });
    wrap.addEventListener('mouseleave', () => tip.style.opacity = 0);
  }

  /* ----------------------------- POSITIONAL HEATMAP ----------------------------- */
  function buildPositions() {
    const seats = $$('#feltRing .seat-btn');
    seats.forEach(s => {
      const p = POSITIONS[s.dataset.pos];
      s.classList.add(p.neg ? 'neg' : 'pos');
      s.innerHTML = `${s.dataset.pos}<b>${p.profit > 0 ? '+' : ''}${p.profit.toFixed(1)}bb</b>`;
      s.addEventListener('click', () => setPosition(s.dataset.pos));
    });
    setPosition('BTN');
  }
  function setPosition(pos) {
    const p = POSITIONS[pos];
    $$('#feltRing .seat-btn').forEach(s => s.classList.toggle('active', s.dataset.pos === pos));
    $('#inspectTitle').textContent = pos + ' · seat telemetry';
    $('#inVpip').textContent = p.vpip + '%';
    $('#inPfr').textContent = p.pfr + '%';
    const prof = $('#inProfit');
    prof.textContent = (p.profit > 0 ? '+' : '') + p.profit.toFixed(1) + ' bb';
    prof.className = 'iv ' + (p.neg ? 'loss' : 'up');
    $('#inVol').textContent = p.vol.toLocaleString('en-US') + ' hands';
    $('#inInsight').textContent = p.insight;
  }

  /* ----------------------------- ALERTS ----------------------------- */
  function buildAlerts() {
    const wrap = $('#alerts'); if (!wrap) return;
    ALERTS.forEach((a, i) => {
      const row = el('div', 'alert ' + a.sev);
      row.innerHTML = `<button class="alert-tog"><span class="h"><span class="alert-dot"></span><span class="alert-t">${a.t}</span></span><span class="alert-x">${i === 0 ? 'CRITICAL' : 'REVIEW'} +</span></button><div class="alert-body"><p>${a.b}</p></div>`;
      row.querySelector('.alert-tog').addEventListener('click', () => {
        const open = row.classList.toggle('open');
        row.querySelector('.alert-x').textContent = (i === 0 ? 'CRITICAL ' : 'REVIEW ') + (open ? '−' : '+');
      });
      wrap.appendChild(row);
    });
    $('#alerts .alert').classList.add('open');
    $('#alerts .alert .alert-x').textContent = 'CRITICAL −';
  }

  /* ----------------------------- WIRE ----------------------------- */
  function buildWire() {
    const track = $('#wireTrack'); if (!track) return;
    const make = () => WIRE.map(w => `<span class="${w.cls || ''}">${w.t} <b>${w.v}</b></span>`).join('');
    track.innerHTML = make() + make();
  }

  /* ----------------------------- THEME / MOTION DOCK ----------------------------- */
  const THEMES = [
    { id: 'ultraviolet', c: '#9B51E0' }, { id: '', c: '#00F0FF' }, { id: 'lime', c: '#C1FF12' },
    { id: 'ember', c: '#FF8C3C' }, { id: 'sakura', c: '#FF8FB1' }, { id: 'forest', c: '#3CDC96' },
    { id: 'synthwave', c: '#FF3CC8' }, { id: 'broadsheet', c: '#E8DCC8' }, { id: 'gold', c: '#D4AF5F' }, { id: 'slate', c: '#7CA3C9' },
  ];
  function buildDock() {
    const sw = $('#dockThemes');
    THEMES.forEach(t => { const b = el('button', 'sw'); b.style.background = t.c; b.dataset.theme = t.id; b.title = t.id || 'obsidian'; b.addEventListener('click', () => setColor(t.id)); sw.appendChild(b); });
    $('#motionToggle').addEventListener('click', () => {
      const off = document.body.dataset.motion === 'off';
      document.body.dataset.motion = off ? 'on' : 'off';
      $('#motionToggle').classList.toggle('on', !off ? false : true);
      $('#motionToggle').textContent = off ? 'Motion' : 'Motion off';
      try { localStorage.setItem('cd_motion', document.body.dataset.motion); } catch (e) {}
    });
  }
  function setColor(id) {
    document.body.dataset.color = id;
    try { localStorage.setItem('cd_color', id); } catch (e) {}
    $$('#dockThemes .sw').forEach(s => s.classList.toggle('on', (s.dataset.theme || '') === id));
  }

  /* ----------------------------- COMMAND PALETTE ----------------------------- */
  const CMDS = [
    { label: 'Fix the #1 leak — trim BTN opens', key: '↵', fn: () => flash('#hlCta') },
    { label: 'Stat · VPIP', key: 'V', fn: () => setStat('vpip') },
    { label: 'Stat · PFR', key: 'P', fn: () => setStat('pfr') },
    { label: 'Stat · 3-bet', key: '3', fn: () => setStat('3bet') },
    { label: 'Chart · Lifetime', key: 'L', fn: () => buildChart('lifetime', true) },
    { label: 'Chart · 30 days', key: 'D', fn: () => buildChart('30d', true) },
    { label: 'Theme · Ultraviolet', key: '1', fn: () => setColor('ultraviolet') },
    { label: 'Theme · Obsidian', key: '2', fn: () => setColor('') },
    { label: 'Theme · Lime OLED', key: '3', fn: () => setColor('lime') },
    { label: 'Seat · Button', key: 'B', fn: () => setPosition('BTN') },
    { label: 'Seat · Cutoff', key: 'C', fn: () => setPosition('CO') },
  ];
  function buildCmdk() {
    const list = $('#cmdkList'); const input = $('#cmdkInput');
    function paint(f) {
      list.innerHTML = '';
      CMDS.filter(c => c.label.toLowerCase().includes(f.toLowerCase())).forEach((c, i) => {
        const e = el('div', 'cmdk-item' + (i === 0 ? ' sel' : ''), `<span>${c.label}</span><span class="k">${c.key}</span>`);
        e.addEventListener('click', () => { c.fn(); closeCmdk(); });
        list.appendChild(e);
      });
    }
    paint(''); input.addEventListener('input', e => paint(e.target.value));
  }
  function openCmdk() { $('#cmdkScrim').classList.add('open'); const i = $('#cmdkInput'); i.value = ''; setTimeout(() => i.focus(), 50); }
  function closeCmdk() { $('#cmdkScrim').classList.remove('open'); }
  function flash(sel) { const e = $(sel); if (!e) return; e.style.transition = 'box-shadow .2s'; e.style.boxShadow = '0 0 0 2px var(--accent), 0 0 22px var(--accent-glow)'; setTimeout(() => e.style.boxShadow = '', 700); }

  /* ----------------------------- CURSOR ----------------------------- */
  function cursorHalo() {
    const c = $('#cursor'); if (!c) return;
    let x = 0, y = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; c.style.opacity = 1; });
    document.addEventListener('mouseleave', () => c.style.opacity = 0);
    (function loop() { x += (tx - x) * 0.2; y += (ty - y) * 0.2; c.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', e => {
      if (e.target.closest('button, a, .stat-trigger, .seat-btn, .mc, .card.lift, .tab-menu button, .sw')) { c.style.width = '46px'; c.style.height = '46px'; }
      else { c.style.width = '26px'; c.style.height = '26px'; }
    });
  }

  /* ----------------------------- REVEAL + ORCHESTRATION ----------------------------- */
  function runReveal() {
    const items = $$('.reveal');
    if (motionOff()) { items.forEach(it => it.classList.add('in')); startContent(); return; }
    items.forEach((it, i) => setTimeout(() => it.classList.add('in'), 80 + i * 90));
  }
  let contentStarted = false;
  function startContent() {
    if (contentStarted) return; contentStarted = true;
    // hero numbers
    const mon = $('#monNum');
    if (mon) { // animate the $388 part
      const intNode = $('#monInt');
      countUpInt(intNode, 388, { dur: 1800 });
    }
    countUp($('#subRoi'), 141.4, { dur: 1600, dec: 1, suf: '%', sign: '+' });
    countUp($('#subItm'), 35.6, { dur: 1600, dec: 1, suf: '%' });
    countUpInt($('#volNum'), 324580, { dur: 1800, sign: '+' });
    buildMonCurve(); buildGauge();
    setTimeout(() => { animateChips(); animateMatrix(); }, 400);
    buildChart('lifetime', true);
  }

  /* ----------------------------- LOADER ----------------------------- */
  function runLoader() {
    const loader = $('#loader'); if (!loader) return;
    if (motionOff()) { loader.classList.add('done'); runReveal(); startContent(); return; }
    const num = $('#loaderNum'), bar = $('#loader .lbar i');
    let n = 0;
    const iv = setInterval(() => {
      n += Math.random() * 11 + 5;
      if (n >= 100) { n = 100; clearInterval(iv); setTimeout(() => { loader.classList.add('done'); runReveal(); setTimeout(startContent, 700); }, 350); }
      num.textContent = String(Math.floor(n)).padStart(2, '0');
      bar.style.width = n + '%';
    }, 85);
  }

  /* ----------------------------- INIT ----------------------------- */
  function init() {
    let color = 'ultraviolet', motion = 'on';
    try { color = localStorage.getItem('cd_color') ?? 'ultraviolet'; motion = localStorage.getItem('cd_motion') || 'on'; } catch (e) {}
    document.body.dataset.color = color;
    document.body.dataset.motion = motion;

    buildHud(); buildChips(); buildMatrix(); buildPositions(); buildAlerts(); buildWire(); buildDock(); buildCmdk(); chartHover();
    buildChart('lifetime', false);

    $$('#dockThemes .sw').forEach(s => s.classList.toggle('on', (s.dataset.theme || '') === color));
    $('#motionToggle').classList.toggle('on', motion === 'on');
    $('#motionToggle').textContent = motion === 'on' ? 'Motion' : 'Motion off';

    $$('#chartTabs button').forEach(b => b.addEventListener('click', () => buildChart(b.dataset.chart, true)));
    $$('[data-open-cmdk]').forEach(b => b.addEventListener('click', openCmdk));
    $('#sideSearch').addEventListener('click', openCmdk);
    window.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCmdk(); }
      if (e.key === 'Escape') closeCmdk();
    });
    $('#cmdkScrim').addEventListener('click', e => { if (e.target.id === 'cmdkScrim') closeCmdk(); });
    // scope select swaps subtitle flavor only
    const scope = $('#scopeSelect');
    if (scope) scope.addEventListener('change', () => flash('.desk-title'));

    cursorHalo();
    runLoader();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
