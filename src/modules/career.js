// Stateful Player Career Profile controller. Manages sub-tab selectors,
// 7x24 hour/day grids, arc milestones tooltips, and opponent ledgers.
import gsap from 'gsap';
import { state } from '../state.js';
import handsData from '../data/hands.json';

// Hour Heatmap mock database (7 days x 24 hours)
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HEATMAP_DATA = [];

// Count-up animation for the Lifetime Scorecard tiles (mirrors radar.js countUp)
function countUp(el, to, { prefix = '', suffix = '', decimals = 0, sign = false } = {}) {
  if (!el) return;
  const dur = 900;
  const start = performance.now();
  const from = 0;
  const render = (val) => {
    const signStr = sign && val > 0 ? '+' : '';
    const body = Math.abs(val).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    el.innerText = `${signStr}${val < 0 ? '-' : ''}${prefix}${body}${suffix}`;
  };
  function frame(now) {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3);
    render(from + (to - from) * eased);
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  // Fallback: guarantee the final value lands even if rAF is paused (hidden tab)
  setTimeout(() => render(to), dur + 80);
}

// Populate the Lifetime Scorecard from the reactive store
function fillScorecard() {
  const L = state.lifetime;
  countUp(document.getElementById('sc-hands'), L.hands, {});
  countUp(document.getElementById('sc-compliance'), L.compliance, { decimals: 1, suffix: '%' });
  countUp(document.getElementById('sc-best'), L.bestResult, { prefix: '$', decimals: 2, sign: true });
  countUp(document.getElementById('sc-worst'), L.worstResult, { prefix: '$', decimals: 2, sign: true });
  countUp(document.getElementById('sc-vpip'), L.vpip, { decimals: 1, suffix: '%' });
  countUp(document.getElementById('sc-pfr'), L.pfr, { decimals: 1, suffix: '%' });
  countUp(document.getElementById('sc-abi'), L.abi, { prefix: '$', decimals: 2 });
  countUp(document.getElementById('sc-roi'), L.roi, { decimals: 1, suffix: '%', sign: true });

  // Compliance color: emerald if >=85, amber otherwise (faithful to React LifetimeScorecard)
  const compEl = document.getElementById('sc-compliance');
  if (compEl) compEl.className = 'sc-v ' + (L.compliance >= 85 ? 'pos' : 'warn');
}

// Seed the 7x24 heatmap data with realistic volume and profitability spikes
function seedHeatmapData() {
  for (let d = 0; d < 7; d++) {
    const dayData = [];
    for (let h = 0; h < 24; h++) {
      // Default empty cell
      let cell = { profit: 0, volume: 0, shade: 0.02 };

      // Monday night grind
      if (d === 0 && h >= 19 && h <= 22) {
        cell = { profit: 12.4, volume: 3, shade: 0.35 };
      }
      // Wednesday session
      else if (d === 2 && h >= 18 && h <= 21) {
        cell = { profit: 25.5, volume: 5, shade: 0.7 };
      }
      // Thursday leak spot (loss)
      else if (d === 3 && h >= 14 && h <= 16) {
        cell = { profit: -18.2, volume: 4, shade: 0.5 };
      }
      // Friday peak volume
      else if (d === 4 && h >= 20 && h <= 23) {
        cell = { profit: 48.0, volume: 8, shade: 0.85 };
      }
      // Saturday late night swing
      else if (d === 5 && (h >= 22 || h <= 1)) {
        cell = { profit: -32.4, volume: 10, shade: 0.9 };
      }
      // Sunday storm grind
      else if (d === 6 && h >= 15 && h <= 19) {
        cell = { profit: 112.5, volume: 12, shade: 0.95 };
      }
      // Quiet background hours
      else if (Math.random() < 0.15) {
        const isPos = Math.random() > 0.4;
        cell = { 
          profit: isPos ? Math.floor(Math.random() * 8) : -Math.floor(Math.random() * 8), 
          volume: 1, 
          shade: 0.15 
        };
      }
      dayData.push(cell);
    }
    HEATMAP_DATA.push(dayData);
  }
}

export function initCareer() {
  seedHeatmapData();

  const tabButtons = document.querySelectorAll('#career-tab-selector button');
  const tabContents = document.querySelectorAll('.career-tab-content');

  // 1. Tab switches
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      tabContents.forEach(content => {
        if (content.id === `career-tab-${targetTab}-content`) {
          content.style.display = 'block';
          gsap.fromTo(content, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
        } else {
          content.style.display = 'none';
        }
      });

      // Special drawings depending on active tab
      if (targetTab === 'overview') {
        drawHeatmap();
      } else if (targetTab === 'nemesis') {
        drawOpponentLedgers();
      } else if (targetTab === 'hands') {
        drawHighImpactHands();
      }
    });
  });

  // 2. Career Arc — fill scorecard, wire node tooltips, metric switch + path redraw
  fillScorecard();
  initCareerArc();

  // 2.2 ABI Chart Node Tooltips
  const abiContainer = document.getElementById('career-abi-container');
  const abiNodes = document.querySelectorAll('.abi-chart-node');
  const abiTooltip = document.getElementById('career-abi-tooltip');

  if (abiTooltip && abiContainer) {
    abiNodes.forEach(node => {
      node.addEventListener('mouseenter', (e) => {
        const info = node.getAttribute('data-info');
        const cx = parseFloat(node.getAttribute('cx'));
        const cy = parseFloat(node.getAttribute('cy'));
        
        abiTooltip.innerHTML = info;
        abiTooltip.style.display = 'block';
        
        const rect = abiContainer.getBoundingClientRect();
        const tooltipWidth = abiTooltip.offsetWidth;
        const xPos = (cx / 1000) * rect.width - (tooltipWidth / 2);
        const yPos = (cy / 180) * rect.height - 65;

        abiTooltip.style.left = `${xPos}px`;
        abiTooltip.style.top = `${yPos}px`;
        gsap.fromTo(abiTooltip, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.15 });
      });

      node.addEventListener('mouseleave', () => {
        abiTooltip.style.display = 'none';
      });
    });
  }

  // Initialize interactive tier inspection sub-rows
  initInteractiveTiers();

  // Draw initial heatmap
  drawHeatmap();
}

// Career Arc hero: node tooltips, metric-switch scramble + path redraw, milestone fill
function initCareerArc() {
  const wrap = document.getElementById('career-arc-wrap');
  const tip = document.getElementById('career-arc-tip');
  const path = document.getElementById('career-arc-path');
  const nodes = [...document.querySelectorAll('#career-arc-wrap .chart-node')];

  // Draw the line via stroke-dashoffset on load + on metric switch
  let len = 1000;
  if (path) { try { len = path.getTotalLength(); } catch (e) { len = 1000; } }
  function drawPath() {
    if (!path) return;
    path.style.transition = 'none';
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    void path.getBoundingClientRect();
    path.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)';
    path.style.strokeDashoffset = '0';
    // fallback: guarantee fully drawn even if transitions are paused (hidden tab)
    setTimeout(() => { if (path) path.style.strokeDashoffset = '0'; }, 1600);
  }

  // Node tooltips (bounding-rect positioning — survives any viewBox)
  if (wrap && tip) {
    nodes.forEach(node => {
      node.addEventListener('mouseenter', () => {
        tip.style.display = 'block';
        tip.textContent = node.getAttribute('data-info');
        const cr = wrap.getBoundingClientRect();
        const nr = node.getBoundingClientRect();
        tip.style.left = `${nr.left - cr.left + 15}px`;
        tip.style.top = `${nr.top - cr.top - 34}px`;
        node.setAttribute('r', '8');
        gsap.fromTo(tip, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.15 });
      });
      node.addEventListener('mouseleave', () => {
        tip.style.display = 'none';
        node.setAttribute('r', '5');
      });
    });
  }

  // Scramble the headline metric on segment switch
  function scramble(el, finalString, dur = 0.7) {
    if (!el) return;
    const chars = '0123456789$#@+-./%';
    const length = finalString.length;
    let frame = 0; const total = dur * 60;
    const iv = setInterval(() => {
      let s = '';
      for (let i = 0; i < length; i++) {
        s += Math.random() < frame / total ? finalString[i] : chars[(Math.random() * chars.length) | 0];
      }
      el.textContent = s; frame++;
      if (frame >= total) { clearInterval(iv); el.textContent = finalString; }
    }, 1000 / 60);
  }

  const money = document.getElementById('career-arc-money');
  const L = state.lifetime;
  const VALS = {
    'Profit': `+$${L.netProfit.toFixed(2)}`,
    'ROI': `+${L.roi.toFixed(1)}%`,
    'bb/100': `+${L.bb100.toFixed(1)} bb`,
  };
  const seg = document.getElementById('career-arc-seg');
  if (seg) {
    seg.addEventListener('click', (e) => {
      const btn = e.target.closest('button'); if (!btn) return;
      seg.querySelectorAll('button').forEach(b => b.removeAttribute('aria-pressed'));
      btn.setAttribute('aria-pressed', 'true');
      scramble(money, VALS[btn.textContent.trim()] || VALS['Profit']);
      drawPath();
    });
  }

  // Kick off the line draw + milestone progress fill
  drawPath();
  const mLine = document.getElementById('career-milestone-line');
  if (mLine) {
    requestAnimationFrame(() => requestAnimationFrame(() => { mLine.style.width = '82%'; }));
    setTimeout(() => { mLine.style.width = '82%'; }, 150);
  }
}

// 3. Draw 7x24 hour/day density heatmap
function drawHeatmap() {
  const container = document.getElementById('hour-heatmap-rows');
  const tooltip = document.getElementById('career-heatmap-tooltip');
  if (!container || !tooltip) return;

  container.innerHTML = '';

  HEATMAP_DATA.forEach((dayRow, dayIdx) => {
    const rowDiv = document.createElement('div');
    rowDiv.style.display = 'grid';
    rowDiv.style.gridTemplateColumns = '24px repeat(24, 1fr)';
    rowDiv.style.gap = '2px';
    rowDiv.style.alignItems = 'center';

    // Day Label (Mon to Sun)
    const dayLabel = document.createElement('span');
    dayLabel.innerText = DAYS[dayIdx];
    dayLabel.style.fontFamily = 'var(--mono)';
    dayLabel.style.fontSize = '8px';
    dayLabel.style.fontWeight = '700';
    dayLabel.style.color = 'var(--fg-muted)';
    rowDiv.appendChild(dayLabel);

    // 24 Hour blocks
    dayRow.forEach((cell, hrIdx) => {
      const block = document.createElement('div');
      block.style.aspectRatio = '1';
      block.style.borderRadius = '2px';
      block.style.cursor = 'pointer';
      block.style.transition = 'transform 0.1s, box-shadow 0.1s';
      
      // Determine coloring based on profit/loss/neutral (token-driven via color-mix)
      const hasVolume = cell.volume > 0;
      if (!hasVolume) {
        block.style.background = 'var(--bg-input)';
        block.style.border = '1px solid var(--border)';
      } else {
        const isPos = cell.profit >= 0;
        const baseVar = isPos ? 'var(--accent)' : 'var(--loss)';
        const pct = Math.round(cell.shade * 100);
        block.style.background = `color-mix(in srgb, ${baseVar} ${pct}%, transparent)`;
        block.style.border = `1px solid ${isPos ? 'var(--accent-line)' : 'var(--loss-line)'}`;
      }

      // Hover enlargement
      block.addEventListener('mouseenter', (e) => {
        block.style.transform = 'scale(1.3)';
        block.style.zIndex = '10';
        block.style.position = 'relative';

        const dayName = DAYS_FULL[dayIdx];
        const hourStr = `${hrIdx.toString().padStart(2, '0')}:00`;
        const profitStr = cell.profit >= 0 ? `+${cell.profit.toFixed(1)} bb` : `${cell.profit.toFixed(1)} bb`;

        tooltip.innerHTML = `
          <b>${dayName} ${hourStr}</b>
          Volume: ${cell.volume} sessions<br>
          <span style="color: ${cell.profit >= 0 ? 'var(--accent)' : 'var(--loss)'}">${profitStr} PnL</span>
        `;
        tooltip.style.display = 'block';

        const rect = block.getBoundingClientRect();
        const parentRect = container.getBoundingClientRect();
        tooltip.style.left = `${rect.left - parentRect.left - (tooltip.offsetWidth / 2) + 6}px`;
        tooltip.style.top = `${rect.top - parentRect.top - 68}px`;
        gsap.fromTo(tooltip, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.15 });
      });

      block.addEventListener('mouseleave', () => {
        block.style.transform = 'none';
        block.style.zIndex = 'auto';
        tooltip.style.display = 'none';
      });

      rowDiv.appendChild(block);
    });

    container.appendChild(rowDiv);
  });
}

// 4. Draw Tab 3: Nemesis & Opponents lists
function drawOpponentLedgers() {
  const predatorsContainer = document.getElementById('career-predators-list');
  const preyContainer = document.getElementById('career-prey-list');
  const overlapGrid = document.getElementById('career-overlap-grid');

  if (predatorsContainer) {
    predatorsContainer.innerHTML = '';
    const predators = [
      { name: 'villain_crusher', hands: 1150, arch: 'lag', label: 'LAG Reg', bb: 78.2 },
      { name: 'shark_reg', hands: 980, arch: 'reg', label: 'LAG Reg', bb: 52.0 },
      { name: 'muck_master', hands: 410, arch: 'passive', label: 'Weak Tight', bb: 44.1 },
      { name: 'nit_reg_37', hands: 842, arch: 'passive', label: 'Nit', bb: 32.5 }
    ];

    predators.forEach((v, idx) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.alignItems = 'center';
      row.style.padding = '10px 14px';
      row.style.background = 'rgba(255,255,255,0.01)';
      row.style.border = '1px solid var(--border)';
      row.style.borderRadius = '8px';

      row.innerHTML = `
        <div style="display:flex; align-items:center; gap: 10px;">
          <span style="font-family:var(--mono); font-size:13px; color:var(--loss); opacity:0.35;">#${idx+1}</span>
          <div>
            <div style="font-family:var(--mono); font-weight:700; color:var(--fg); text-transform:uppercase;">${v.name}</div>
            <div style="font-size:10px; color:var(--fg-muted); margin-top:2px;">${v.hands} hands observed ·<span class="opp-arch-badge ${v.arch}" style="font-size:8px; padding:0 3px;">${v.label}</span></div>
          </div>
        </div>
        <span style="font-family:var(--mono); color:var(--loss); font-size:14px; font-weight:700;">-${v.bb.toFixed(1)} bb</span>
      `;
      predatorsContainer.appendChild(row);
    });
  }

  if (preyContainer) {
    preyContainer.innerHTML = '';
    const prey = [
      { name: 'fish_king_22', hands: 520, arch: 'passive', label: 'Fish', bb: 124.5 },
      { name: 'whale_caller', hands: 250, arch: 'passive', label: 'Whale', bb: 98.2 },
      { name: 'loose_cannon', hands: 320, arch: 'lag', label: 'Maniac', bb: 74.1 },
      { name: 'fish_player_99', hands: 142, arch: 'passive', label: 'Fish', bb: 42.3 }
    ];

    prey.forEach((v, idx) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.alignItems = 'center';
      row.style.padding = '10px 14px';
      row.style.background = 'rgba(255,255,255,0.01)';
      row.style.border = '1px solid var(--border)';
      row.style.borderRadius = '8px';

      row.innerHTML = `
        <div style="display:flex; align-items:center; gap: 10px;">
          <span style="font-family:var(--mono); font-size:13px; color:var(--accent); opacity:0.35;">#${idx+1}</span>
          <div>
            <div style="font-family:var(--mono); font-weight:700; color:var(--fg); text-transform:uppercase;">${v.name}</div>
            <div style="font-size:10px; color:var(--fg-muted); margin-top:2px;">${v.hands} hands observed ·<span class="opp-arch-badge ${v.arch}" style="font-size:8px; padding:0 3px;">${v.label}</span></div>
          </div>
        </div>
        <span style="font-family:var(--mono); color:var(--accent-2); font-size:14px; font-weight:700;">+${v.bb.toFixed(1)} bb</span>
      `;
      preyContainer.appendChild(row);
    });
  }

  if (overlapGrid) {
    overlapGrid.innerHTML = '';
    const overlap = [
      { name: 'solid_pro_scorza', hands: 2200, arch: 'reg', label: 'Solid Reg', vpip: 24, pfr: 20, notes: 2 },
      { name: 'sunday_grinder', hands: 1520, arch: 'reg', label: 'Solid Reg', vpip: 22, pfr: 18, notes: 1 },
      { name: 'villain_crusher', hands: 1150, arch: 'lag', label: 'LAG Reg', vpip: 28, pfr: 23, notes: 3 },
      { name: 'shark_reg', hands: 980, arch: 'reg', label: 'LAG Reg', vpip: 26, pfr: 22, notes: 2 }
    ];

    overlap.forEach(v => {
      const card = document.createElement('div');
      card.style.background = 'rgba(255,255,255,0.005)';
      card.style.border = '1px solid var(--border)';
      card.style.borderRadius = '12px';
      card.style.padding = '14px 18px';

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-family:var(--mono); font-weight:700; color:var(--fg); text-transform:uppercase;">${v.name}</span>
          <span class="opp-arch-badge ${v.arch}" style="font-size:8px; padding:0 4px;">${v.label}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-family:var(--mono); font-size:11px; color:var(--fg-muted);">
          <span>VPIP/PFR: ${v.vpip}/${v.pfr}</span>
          <span>${v.hands} hands</span>
          <span style="color:var(--accent);">✏️ ${v.notes} notas</span>
        </div>
      `;
      overlapGrid.appendChild(card);
    });
  }
}

// 5. Draw Tab 4: High Impact Hands
function drawHighImpactHands() {
  const container = document.getElementById('career-hands-body');
  if (!container) return;

  container.innerHTML = '';

  // Sort hands by absolute PnL value descending
  const sortedHands = [...handsData].sort((a, b) => {
    const netA = Math.abs(parseFloat(a.net.replace('bb', '')));
    const netB = Math.abs(parseFloat(b.net.replace('bb', '')));
    return netB - netA;
  }).slice(0, 10);

  sortedHands.forEach((h, idx) => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.03)';
    tr.style.fontSize = '12.5px';

    const cardsSplit = h.cards.split(' ');
    const suitsMarkup = cardsSplit.map((c, i) => {
      const suit = h.suits[i];
      let sClass = 'suit-s';
      if (suit === '♥') sClass = 'suit-h';
      if (suit === '♦') sClass = 'suit-d';
      if (suit === '♣') sClass = 'suit-c';
      return `<span class="${sClass}">${c[0]}${suit}</span>`;
    }).join(' ');

    const isPos = h.net.includes('+');

    tr.innerHTML = `
      <td style="padding:14px 24px; color:var(--fg-muted);">#${idx+1}</td>
      <td style="padding:14px 24px;">${suitsMarkup}</td>
      <td style="padding:14px 24px; text-align:center; color:var(--accent-2);">${h.pos}</td>
      <td style="padding:14px 24px; text-align:center; color:var(--fg-muted);">${h.scenario.replace('_', ' ')}</td>
      <td style="padding:14px 24px; text-align:center;">${h.stack}</td>
      <td style="padding:14px 24px; text-align:center;"><span class="compliance-badge ${h.compliant ? 'ok' : 'dev'}">${h.compliant ? 'ok' : 'desvio'}</span></td>
      <td style="padding:14px 24px; text-align:right; color: ${isPos ? 'var(--accent-2)' : 'var(--loss)'};">${h.net}</td>
      <td style="padding:14px 24px; text-align:center;"><button class="btn-replay-career" data-id="${h.id}" style="padding:4px 10px; font-size:10.5px; border-radius:4px; background:var(--accent-soft); border:1px solid var(--accent-line); color:var(--accent); cursor:pointer;">Replay</button></td>
    `;
    container.appendChild(tr);
  });

  // Bind click action
  container.querySelectorAll('.btn-replay-career').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      // Trigger the Felt Replayer directly
      if (window.openReplayModal) {
        window.openReplayModal(id);
      }
    });
  });
}

function initInteractiveTiers() {
  const tiers = ['micro', 'target', 'shot'];
  tiers.forEach(t => {
    const row = document.getElementById(`tier-row-${t}`);
    const details = document.getElementById(`tier-details-${t}`);
    if (row && details) {
      row.addEventListener('click', () => {
        const isVisible = details.style.display !== 'none';
        
        // Hide all details rows first for clean accordion behavior
        tiers.forEach(otherT => {
          const otherDetails = document.getElementById(`tier-details-${otherT}`);
          if (otherDetails) {
            otherDetails.style.display = 'none';
          }
        });
        
        if (!isVisible) {
          details.style.display = 'table-row';
          const innerDiv = details.querySelector('td > div');
          if (innerDiv) {
            gsap.fromTo(innerDiv, 
              { opacity: 0, y: -10 }, 
              { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
            );
          }
        }
      });
    }
  });

  const formats = ['bounty', 'deepstack', 'turbo', 'hyper'];
  formats.forEach(f => {
    const row = document.getElementById(`format-row-${f}`);
    const details = document.getElementById(`format-details-${f}`);
    if (row && details) {
      row.addEventListener('click', () => {
        const isVisible = details.style.display !== 'none';
        
        // Hide all format details
        formats.forEach(otherF => {
          const otherDetails = document.getElementById(`format-details-${otherF}`);
          if (otherDetails) {
            otherDetails.style.display = 'none';
          }
        });
        
        if (!isVisible) {
          details.style.display = 'table-row';
          const innerDiv = details.querySelector('td > div');
          if (innerDiv) {
            gsap.fromTo(innerDiv, 
              { opacity: 0, y: -10 }, 
              { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
            );
          }
        }
      });
    }
  });
}
