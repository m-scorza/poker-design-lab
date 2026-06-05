// Command Palette (Ctrl+K menu) Module
import { state } from '../state.js';

const COMMANDS = [
  { group: 'Navigation', ico: '◧', name: 'Go to Desk', action: () => navigateToTab('overview'), hint: 'overview' },
  { group: 'Navigation', ico: '◔', name: 'Go to Career', action: () => navigateToTab('career'), hint: 'lifetime stats' },
  { group: 'Navigation', ico: '☷', name: 'Go to Sessions', action: () => navigateToTab('sessions'), hint: 'history' },
  { group: 'Navigation', ico: '☰', name: 'Go to Hands', action: () => navigateToTab('hands'), hint: 'replayer list' },
  { group: 'Navigation', ico: '⚠', name: 'Go to Leaks', action: () => navigateToTab('leaks'), hint: 'flaws' },
  { group: 'Navigation', ico: '▦', name: 'Go to Ranges', action: () => navigateToTab('ranges'), hint: 'preflop grid' },
  { group: 'Navigation', ico: '☲', name: 'Go to Players', action: () => navigateToTab('villains'), hint: 'opponents' },
  { group: 'Navigation', ico: '♠', name: 'Go to Drills', action: () => navigateToTab('arena'), hint: 'felt practice' },
  { group: 'Actions', ico: '↻', name: 'Reset Hands Database', action: () => resetDatabase(), hint: 'restore seed hands' },
  { group: 'Actions', ico: '✦', name: 'Fix BTN Open Range Leak', action: () => applyGtoFix(), hint: 'prune wide button opens' },
];

let activeIndex = 0;
let filteredCommands = [];

function navigateToTab(tab) {
  const link = document.querySelector(`.mast-nav a[data-tab="${tab}"]`);
  if (link) link.click();
}

function resetDatabase() {
  const btnReset = document.getElementById('btn-reset-db');
  if (btnReset) btnReset.click();
}

function applyGtoFix() {
  const btnFix = document.getElementById('verdict-action');
  if (btnFix) btnFix.click();
}

// Subsequence fuzzy match
function fuzzyMatch(text, term) {
  if (!term) return text;
  let ti = 0;
  let out = '';
  const t = term.toLowerCase();
  for (const ch of text) {
    if (ti < t.length && ch.toLowerCase() === t[ti]) {
      out += `<mark>${ch}</mark>`;
      ti++;
    } else {
      out += ch;
    }
  }
  return ti === t.length ? out : null;
}

export function initCommandPalette() {
  const scrim = document.getElementById('command-palette-scrim');
  const input = document.getElementById('command-palette-input');
  const list = document.getElementById('command-palette-list');

  if (!scrim || !input || !list) return;

  function openPalette() {
    scrim.classList.add('open');
    input.value = '';
    activeIndex = 0;
    renderList('');
    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    scrim.classList.remove('open');
  }

  function renderList(query) {
    list.innerHTML = '';
    filteredCommands = [];
    
    // Group commands by group
    const groups = {};
    
    COMMANDS.forEach((cmd) => {
      const matchName = fuzzyMatch(cmd.name, query);
      const matchHint = fuzzyMatch(cmd.hint, query);
      
      if (matchName || matchHint || !query) {
        filteredCommands.push(cmd);
        if (!groups[cmd.group]) groups[cmd.group] = [];
        groups[cmd.group].push({
          cmd,
          display: matchName || cmd.name,
          displayHint: matchHint || cmd.hint,
          globalIndex: filteredCommands.length - 1
        });
      }
    });

    if (filteredCommands.length === 0) {
      list.innerHTML = `<div class="pal-empty">No commands match "${query}"</div>`;
      return;
    }

    Object.entries(groups).forEach(([grpName, items]) => {
      const groupEl = document.createElement('div');
      groupEl.className = 'pal-group';
      groupEl.textContent = grpName;
      list.appendChild(groupEl);

      items.forEach(({ cmd, display, displayHint, globalIndex }) => {
        const itemEl = document.createElement('div');
        itemEl.className = `pal-item ${globalIndex === activeIndex ? 'active' : ''}`;
        itemEl.innerHTML = `
          <span class="pi-ico">${cmd.ico}</span>
          <span class="pi-name">${display}</span>
          <span class="pi-hint">${displayHint}</span>
        `;
        
        itemEl.addEventListener('click', () => {
          cmd.action();
          closePalette();
        });
        
        list.appendChild(itemEl);
      });
    });

    // Scroll active item into view if needed
    const activeItem = list.querySelector('.pal-item.active');
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest' });
    }
  }

  // Input listener
  input.addEventListener('input', (e) => {
    activeIndex = 0;
    renderList(e.target.value);
  });

  // Keyboard controls
  window.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (scrim.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    }
  });

  scrim.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePalette();
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      activeIndex = (activeIndex + 1) % filteredCommands.length;
      renderList(input.value);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      activeIndex = (activeIndex - 1 + filteredCommands.length) % filteredCommands.length;
      renderList(input.value);
      e.preventDefault();
    } else if (e.key === 'Enter') {
      if (filteredCommands[activeIndex]) {
        filteredCommands[activeIndex].action();
        closePalette();
        e.preventDefault();
      }
    }
  });

  // Click outside to close
  scrim.addEventListener('mousedown', (e) => {
    if (e.target === scrim) {
      closePalette();
    }
  });
}

// Auto-run on document ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initCommandPalette());
} else {
  initCommandPalette();
}
