// Villains profile grid generator + exploit detail panel
// Folds in the villain-badge brick (tinted archetype avatars + telemetry)
// and a predator/prey "Nemesis" framing modelled on the real Nemesis block.
import { state } from '../state.js';

// --- Archetype → avatar tint class (mirrors villain-badge brick) ---
function avatarClass(v) {
  if (v.arch === 'reg') return 'av-reg';
  if (v.arch === 'lag') return 'av-lag';
  // passive: split loose-passive (fish/whale) vs tight-passive (nit)
  return v.vpip >= 30 ? 'av-fish' : 'av-nit';
}

function initials(name) {
  const parts = name.split(/[_\s]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// Short descriptor under the name
function archDescriptor(v) {
  if (v.arch === 'reg') return 'solid regular';
  if (v.arch === 'lag') return 'loose aggressive · LAG';
  return v.vpip >= 30 ? 'loose passive · calls too much' : 'tight passive · nit';
}

// --- Predator / prey / neutral classification (the "Nemesis" framing) ---
// Predator = a real threat to hero's bottom line (Nemesis-tagged, or an
// aggressive winning reg/LAG). Prey = exploitable leak machine (loose-passive
// with a big VPIP/PFR gap). Neutral = neither.
function classifyThreat(v) {
  const tags = v.tags || [];
  if (tags.includes('Nemesis')) return 'pred';
  if ((v.arch === 'lag' || v.arch === 'reg') && v.af >= 3.0 && v.gap <= 8) return 'pred';
  if (v.arch === 'passive' && v.gap >= 15) return 'prey';
  if (v.vpip >= 40) return 'prey';
  return 'neutral';
}

const THREAT_LABEL = { pred: 'Predator', prey: 'Prey', neutral: 'Neutral' };
const THREAT_ICON = { pred: '🎯', prey: '🐟', neutral: '•' };
const THREAT_DESC = {
  pred: 'A real threat to your bottom line. Tighten up against him and avoid marginal wars.',
  prey: 'A leak machine. Maximize value — this is where the profit comes from.',
  neutral: 'No dominant angle. Play solid and collect data.',
};

export function initVillains() {
  const villainsGrid = document.getElementById('villains-grid');
  const villainsSearch = document.getElementById('villains-search-input');
  const villainsFilters = document.querySelectorAll('#villains-filter-dock button');
  const detailPanel = document.getElementById('villain-detail-panel');
  const countLbl = document.getElementById('villains-count-lbl');

  let selectedVillainName = 'fish_player_99'; // Default to first villain on load

  function renderVillains() {
    if (!villainsGrid) return;
    villainsGrid.innerHTML = '';

    const searchQ = villainsSearch.value.toLowerCase();
    const activeFilter = document.querySelector('#villains-filter-dock button.active');
    const filterVal = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';

    const filtered = state.villains.filter(v => {
      if (searchQ && !v.name.toLowerCase().includes(searchQ)) return false;
      if (filterVal !== 'all' && v.arch !== filterVal) return false;
      return true;
    });

    if (countLbl) {
      countLbl.textContent = `${filtered.length} opponent${filtered.length === 1 ? '' : 's'} tracked`;
    }

    filtered.forEach(v => {
      const card = document.createElement('div');
      const isActive = v.name === selectedVillainName;
      card.className = `opponent-profile-card ${isActive ? 'active' : ''}`;

      const threat = classifyThreat(v);
      const gapBad = v.gap >= 15;

      const tagsMarkup = v.tags ? v.tags.slice(0, 2).map(t =>
        `<span class="opp-tag-badge">${t}</span>`
      ).join('') : '';

      card.innerHTML = `
        <div class="opp-profile-header">
          <div class="opp-avatar ${avatarClass(v)}">${initials(v.name)}</div>
          <div class="opp-head-meta">
            <span class="opp-profile-name">${v.name}</span>
            <span class="opp-profile-sub">${archDescriptor(v)} · ${v.hands} hands</span>
          </div>
          <span class="opp-threat ${threat}">${THREAT_LABEL[threat]}</span>
        </div>
        <div class="opp-card-row">
          <span class="opp-arch-badge ${v.arch}">${v.label}</span>
          <div style="display: flex; align-items: center;">${tagsMarkup}</div>
        </div>
        <div class="opp-stats-inline">
          <div class="opp-stat-cell"><div class="l">VPIP</div><div class="v">${v.vpip}%</div></div>
          <div class="opp-stat-cell"><div class="l">PFR</div><div class="v">${v.pfr}%</div></div>
          <div class="opp-stat-cell"><div class="l">AF</div><div class="v">${v.af}</div></div>
          <div class="opp-stat-cell"><div class="l">Gap</div><div class="v ${gapBad ? 'bad' : ''}">${v.gap}</div></div>
        </div>

        <div class="exploit-overlay-card">
          <div class="exploit-card-title">Exploit plan</div>
          <div class="exploit-card-body">${v.advice}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        selectedVillainName = v.name;
        renderVillains();
        renderDetailPanel(v);
      });

      villainsGrid.appendChild(card);
    });

    // Sync detail panel representation
    const activeVillain = state.villains.find(v => v.name === selectedVillainName);
    if (activeVillain && filtered.includes(activeVillain)) {
      renderDetailPanel(activeVillain);
    } else if (filtered.length > 0) {
      selectedVillainName = filtered[0].name;
      renderDetailPanel(filtered[0]);
    } else {
      if (detailPanel) {
        detailPanel.innerHTML = `
          <div class="villains-empty-state">
            <div class="ico">🗂</div>
            <span class="lbl">No opponent matches the filter</span>
          </div>
        `;
      }
    }
  }

  function renderDetailPanel(v) {
    if (!detailPanel) return;

    const allPredefinedTags = ['Nemesis', 'Station', 'Maniac', 'Tight', 'Aggressive', 'Passive', 'Bluffer', 'Folder'];
    const currentTags = v.tags || [];
    const customTags = currentTags.filter(t => !allPredefinedTags.includes(t));

    const tagsHtml = allPredefinedTags.map(tag => {
      const active = currentTags.includes(tag) ? 'active' : '';
      return `<button class="tag-bubble-node ${active}" data-tag="${tag}">${tag}</button>`;
    }).join('');

    const customTagsHtml = customTags.map(tag => {
      return `<button class="tag-bubble-node active" data-tag="${tag}">${tag} <span class="remove-tag" style="opacity:0.6; margin-left:4px;">&times;</span></button>`;
    }).join('');

    const threat = classifyThreat(v);

    detailPanel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 14px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 13px; min-width: 0;">
          <div class="opp-avatar ${avatarClass(v)}">${initials(v.name)}</div>
          <div style="min-width: 0;">
            <h3 style="font-family: var(--display); font-size: 20px; margin: 0; font-weight: 700; color: var(--fg);">${v.name}</h3>
            <div style="font-family: var(--mono); font-size: 10px; color: var(--fg-muted); margin-top: 4px;">
              ${v.hands} hands tracked · <span style="color: var(--accent);">${v.label}</span>
            </div>
          </div>
        </div>
        <span class="opp-arch-badge ${v.arch}">${v.label}</span>
      </div>

      <!-- Predator/prey verdict -->
      <div class="villain-threat-strip ${threat}">
        <span class="vt-icon">${THREAT_ICON[threat]}</span>
        <div>
          <div class="vt-label">${THREAT_LABEL[threat]}</div>
          <div class="vt-desc">${THREAT_DESC[threat]}</div>
        </div>
      </div>

      <!-- Quick Stats Grid -->
      <span class="kick" style="margin-bottom: 8px; display: block; font-size: 9px;">Telemetry metrics</span>
      <div class="opp-stats-inline" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 18px;">
        <div class="opp-stat-cell"><div class="l">VPIP</div><div class="v">${v.vpip}%</div></div>
        <div class="opp-stat-cell"><div class="l">PFR</div><div class="v">${v.pfr}%</div></div>
        <div class="opp-stat-cell"><div class="l">AF</div><div class="v">${v.af}</div></div>
        <div class="opp-stat-cell"><div class="l">Gap</div><div class="v ${v.gap >= 15 ? 'bad' : ''}">${v.gap}</div></div>
      </div>

      <!-- Exploit advice card -->
      <div class="villain-exploit-card">
        <h4>Exploit plan</h4>
        <p>${v.advice}</p>
      </div>

      <!-- Notes field -->
      <div style="margin-bottom: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span class="kick" style="font-size: 9px;">Strategic profile notes</span>
          <span id="note-save-status" style="font-family: var(--mono); font-size: 9px; color: var(--accent); opacity: 0; transition: opacity 0.2s;">Saved</span>
        </div>
        <textarea id="villain-note-input" class="villain-note-input" placeholder="Note patterns, tells, sizing rules, bluff angles..."></textarea>
      </div>

      <!-- Tag picker -->
      <div>
        <span class="kick" style="margin-bottom: 6px; display: block; font-size: 9px;">Profile tags</span>
        <div class="tag-bubble-list" id="villain-tag-list">
          ${tagsHtml}
          ${customTagsHtml}
        </div>

        <!-- Custom Tag Add -->
        <div style="display: flex; gap: 6px; margin-top: 10px;">
          <input type="text" id="input-add-tag" placeholder="Add tag..." style="flex: 1; background: var(--bg-input); border: 1px solid var(--border); border-radius: 5px; color: var(--fg); font-family: var(--mono); font-size: 10px; padding: 5px 8px; outline: none;"/>
          <button class="btn-replay" id="btn-add-tag" style="padding: 4px 10px; font-size: 10px; cursor: pointer;">+ Add</button>
        </div>
      </div>
    `;

    // Notes auto-save implementation
    const noteInput = document.getElementById('villain-note-input');
    if (noteInput) {
      noteInput.value = v.note || '';

      let saveTimeout;
      noteInput.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        const statusLabel = document.getElementById('note-save-status');
        if (statusLabel) {
          statusLabel.innerText = 'Saving...';
          statusLabel.style.opacity = '0.6';
        }

        saveTimeout = setTimeout(() => {
          v.note = noteInput.value;
          // Notify listeners of changes
          state.notify();
          if (statusLabel) {
            statusLabel.innerText = 'Saved';
            statusLabel.style.opacity = '1';
            setTimeout(() => {
              statusLabel.style.opacity = '0';
            }, 800);
          }
        }, 600);
      });
    }

    // Tag bubble clicks toggling
    const tagButtons = detailPanel.querySelectorAll('.tag-bubble-node');
    tagButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-tag');
        if (!v.tags) v.tags = [];
        const hasTag = v.tags.includes(tag);
        if (hasTag) {
          v.tags = v.tags.filter(t => t !== tag);
        } else {
          v.tags.push(tag);
        }
        state.notify();
        renderVillains();
      });
    });

    // Custom Tag input bindings
    const inputAddTag = document.getElementById('input-add-tag');
    const btnAddTag = document.getElementById('btn-add-tag');

    function triggerAddTag() {
      const text = inputAddTag.value.trim();
      if (!v.tags) v.tags = [];
      if (text && !v.tags.includes(text)) {
        v.tags.push(text);
        state.notify();
        renderVillains();
      }
    }

    if (btnAddTag && inputAddTag) {
      btnAddTag.addEventListener('click', triggerAddTag);
      inputAddTag.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          triggerAddTag();
        }
      });
    }
  }

  // Bind filtering/search controls
  if (villainsSearch) {
    villainsSearch.addEventListener('input', renderVillains);
    villainsFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        villainsFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderVillains();
      });
    });
  }

  // Initial draw
  renderVillains();
}
