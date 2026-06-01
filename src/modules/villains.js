// Villains dossier grid generator + exploit detail panel
import { state } from '../state.js';

export function initVillains() {
  const villainsGrid = document.getElementById('villains-grid');
  const villainsSearch = document.getElementById('villains-search-input');
  const villainsFilters = document.querySelectorAll('#villains-filter-dock button');
  const detailPanel = document.getElementById('villain-detail-panel');

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

    filtered.forEach(v => {
      const card = document.createElement('div');
      const isActive = v.name === selectedVillainName;
      card.className = `opponent-dossier-card ${isActive ? 'active' : ''}`;
      
      if (isActive) {
        card.style.borderColor = 'var(--accent)';
        card.style.boxShadow = '0 0 10px rgba(0, 240, 255, 0.15)';
      }

      const tagsMarkup = v.tags ? v.tags.slice(0, 2).map(t => `
        <span class="opp-tag-badge" style="font-family: var(--mono); font-size: 8px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); padding: 1px 5px; border-radius: 3px; color: var(--fg-muted); margin-left: 4px; display: inline-block;">${t}</span>
      `).join('') : '';

      card.innerHTML = `
        <div class="opp-dossier-header" style="margin-bottom: 6px;">
          <span class="opp-dossier-name">${v.name}</span>
          <span class="opp-dossier-hands">${v.hands} hands</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 4px;">
          <span class="opp-arch-badge ${v.arch}">${v.label}</span>
          <div style="display: flex; align-items: center;">${tagsMarkup}</div>
        </div>
        <div class="opp-stats-inline">
          <div class="opp-stat-cell"><div class="l">VPIP</div><div class="v">${v.vpip}%</div></div>
          <div class="opp-stat-cell"><div class="l">PFR</div><div class="v">${v.pfr}%</div></div>
          <div class="opp-stat-cell"><div class="l">AF</div><div class="v">${v.af}</div></div>
          <div class="opp-stat-cell"><div class="l">Gap</div><div class="v">${v.gap}</div></div>
        </div>

        <div class="exploit-overlay-card">
          <div class="exploit-card-title">Exploit advice</div>
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
    if (activeVillain) {
      renderDetailPanel(activeVillain);
    } else if (filtered.length > 0) {
      selectedVillainName = filtered[0].name;
      renderDetailPanel(filtered[0]);
    } else {
      if (detailPanel) {
        detailPanel.innerHTML = `
          <div style="text-align: center; padding: 60px 0; color: var(--fg-muted);">
            <div style="font-size: 32px; margin-bottom: 12px; opacity: 0.6;">🗂</div>
            <span style="font-family: var(--mono); font-size: 11px; text-transform: uppercase;">No matching opponents found</span>
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

    detailPanel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border); padding-bottom: 14px; margin-bottom: 16px;">
        <div>
          <h3 style="font-family: var(--display); font-size: 20px; margin: 0; font-weight: 700; color: var(--fg);">${v.name}</h3>
          <div style="font-family: var(--mono); font-size: 10px; color: var(--fg-muted); margin-top: 4px;">
            ${v.hands} hands tracked · <span style="color: var(--accent);">${v.label}</span>
          </div>
        </div>
        <span class="opp-arch-badge ${v.arch}">${v.label}</span>
      </div>

      <!-- Quick Stats Grid -->
      <span class="kick" style="margin-bottom: 8px; display: block; font-size: 9px;">Telemetry metrics</span>
      <div class="opp-stats-inline" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 18px;">
        <div class="opp-stat-cell"><div class="l">VPIP</div><div class="v">${v.vpip}%</div></div>
        <div class="opp-stat-cell"><div class="l">PFR</div><div class="v">${v.pfr}%</div></div>
        <div class="opp-stat-cell"><div class="l">AF</div><div class="v">${v.af}</div></div>
        <div class="opp-stat-cell"><div class="l">Gap</div><div class="v">${v.gap}</div></div>
      </div>

      <!-- Exploit advice card -->
      <div class="session-card" style="margin-bottom: 18px; background: rgba(0,240,255,0.02); border-color: rgba(0,240,255,0.15); padding: 12px 16px;">
        <h4 style="margin: 0 0 6px; color: var(--accent); font-size: 9px; font-family: var(--mono); text-transform: uppercase;">Exploit advice</h4>
        <p style="font-size: 12px; line-height: 1.45; color: var(--fg-muted); margin: 0;">${v.advice}</p>
      </div>

      <!-- Notes field -->
      <div style="margin-bottom: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span class="kick" style="font-size: 9px;">Strategic notes dossier</span>
          <span id="note-save-status" style="font-family: var(--mono); font-size: 9px; color: var(--accent); opacity: 0; transition: opacity 0.2s;">Saved</span>
        </div>
        <textarea id="villain-note-input" placeholder="Enter custom notes on play style, patterns, tells, sizing rules..." style="width: 100%; height: 75px; background: var(--bg-input); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-family: var(--sans); font-size: 12px; padding: 10px; resize: none; outline: none; box-sizing: border-box;"></textarea>
      </div>

      <!-- Tag picker -->
      <div>
        <span class="kick" style="margin-bottom: 6px; display: block; font-size: 9px;">Dossier tagging</span>
        <div class="tag-bubble-list" id="villain-tag-list">
          ${tagsHtml}
          ${customTagsHtml}
        </div>
        
        <!-- Custom Tag Add -->
        <div style="display: flex; gap: 6px; margin-top: 10px;">
          <input type="text" id="input-add-tag" placeholder="Add custom tag..." style="flex: 1; background: var(--bg-input); border: 1px solid var(--border); border-radius: 5px; color: var(--fg); font-family: var(--mono); font-size: 10px; padding: 5px 8px; outline: none;"/>
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
        const hasTag = v.tags.includes(tag);
        if (hasTag) {
          v.tags = v.tags.filter(t => t !== tag);
        } else {
          v.tags.push(tag);
        }
        state.notify();
        renderDetailPanel(v);
      });
    });

    // Custom Tag input bindings
    const inputAddTag = document.getElementById('input-add-tag');
    const btnAddTag = document.getElementById('btn-add-tag');
    
    function triggerAddTag() {
      const text = inputAddTag.value.trim();
      if (text && !v.tags.includes(text)) {
        v.tags.push(text);
        state.notify();
        renderDetailPanel(v);
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
