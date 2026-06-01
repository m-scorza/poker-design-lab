// Stateful Player Career Profile controller. Manages sub-tab selectors,
// 7x24 hour/day grids, arc milestones tooltips, and opponent ledgers.
import gsap from 'gsap';
import { state } from '../state.js';
import handsData from '../data/hands.json';

// Hour Heatmap mock database (7 days x 24 hours)
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HEATMAP_DATA = [];

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

  // 2. Arc Milestone Nodes tooltips
  const arcContainer = document.getElementById('career-arc-container');
  const arcNodes = document.querySelectorAll('.chart-node');
  const arcTooltip = document.getElementById('career-arc-tooltip');

  if (arcTooltip && arcContainer) {
    arcNodes.forEach(node => {
      node.addEventListener('mouseenter', (e) => {
        const info = node.getAttribute('data-info');
        const cx = parseFloat(node.getAttribute('cx'));
        const cy = parseFloat(node.getAttribute('cy'));
        
        arcTooltip.innerHTML = info;
        arcTooltip.style.display = 'block';
        
        // Calculate coordinate offsets relative to container
        const rect = arcContainer.getBoundingClientRect();
        const tooltipWidth = arcTooltip.offsetWidth;
        const xPos = (cx / 1000) * rect.width - (tooltipWidth / 2);
        const yPos = (cy / 250) * rect.height - 65;

        arcTooltip.style.left = `${xPos}px`;
        arcTooltip.style.top = `${yPos}px`;
        gsap.fromTo(arcTooltip, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.15 });
      });

      node.addEventListener('mouseleave', () => {
        arcTooltip.style.display = 'none';
      });
    });
  }

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
      
      // Determine coloring based on profit/loss/neutral
      const hasVolume = cell.volume > 0;
      if (!hasVolume) {
        block.style.background = 'rgba(255,255,255,0.015)';
        block.style.border = '1px solid rgba(255,255,255,0.03)';
      } else {
        const isPos = cell.profit >= 0;
        block.style.background = isPos 
          ? `rgba(0, 240, 255, ${cell.shade})` 
          : `rgba(255, 59, 107, ${cell.shade})`;
        block.style.border = isPos 
          ? '1px solid rgba(0, 240, 255, 0.2)' 
          : '1px solid rgba(255, 59, 107, 0.2)';
      }

      // Hover enlargement
      block.addEventListener('mouseenter', (e) => {
        block.style.transform = 'scale(1.3)';
        block.style.zIndex = '10';
        block.style.position = 'relative';

        const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayIdx];
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
            <div style="font-family:var(--mono); font-weight:700; color:#fff; text-transform:uppercase;">${v.name}</div>
            <div style="font-size:10px; color:var(--fg-muted); margin-top:2px;">${v.hands} hands observed · <span class="opp-arch-badge ${v.arch}" style="font-size:8px; padding:0 3px;">${v.label}</span></div>
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
            <div style="font-family:var(--mono); font-weight:700; color:#fff; text-transform:uppercase;">${v.name}</div>
            <div style="font-size:10px; color:var(--fg-muted); margin-top:2px;">${v.hands} hands observed · <span class="opp-arch-badge ${v.arch}" style="font-size:8px; padding:0 3px;">${v.label}</span></div>
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
          <span style="font-family:var(--mono); font-weight:700; color:#fff; text-transform:uppercase;">${v.name}</span>
          <span class="opp-arch-badge ${v.arch}" style="font-size:8px; padding:0 4px;">${v.label}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-family:var(--mono); font-size:11px; color:var(--fg-muted);">
          <span>VPIP/PFR: ${v.vpip}/${v.pfr}</span>
          <span>${v.hands} hands</span>
          <span style="color:var(--accent);">✏️ ${v.notes} notes</span>
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
      <td style="padding:14px 24px; text-align:center;"><span class="compliance-badge ${h.compliant ? 'ok' : 'dev'}">${h.compliant ? 'ok' : 'deviation'}</span></td>
      <td style="padding:14px 24px; text-align:right; color: ${isPos ? 'var(--accent-2)' : 'var(--loss)'};">${h.net}</td>
      <td style="padding:14px 24px; text-align:center;"><button class="btn-replay-career" data-id="${h.id}" style="padding:4px 10px; font-size:10.5px; border-radius:4px; background:rgba(0, 240, 255, 0.1); border:1px solid rgba(0, 240, 255, 0.2); color:var(--accent); cursor:pointer;">Replay</button></td>
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
