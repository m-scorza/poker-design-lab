// Theme dock: data-driven palette + typography playground.
// Renders swatch chips + font chips, applies data-color / data-font on <body>,
// persists the choice to localStorage, and feeds the mesh background's grid color
// via state.gridColor. Adding a palette/font = add an entry here + a matching
// body[data-color="<id>"] / body[data-font="<id>"] block in styles/theme-system.css.
import { state } from '../state.js';

// Each palette overrides the token contract in theme-system.css. `grid` is the
// "r, g, b" triple the canvas mesh background reads from state.gridColor.
// `swatch` is [bg, accent, accent-2 | loss] purely for the dock chip preview.
export const PALETTES = [
  { id: 'obsidian',    name: 'Obsidian',    grid: '0, 240, 255',   swatch: ['#050608', '#00F0FF', '#00FF87'] },
  { id: 'ultraviolet', name: 'Ultravioleta', grid: '155, 81, 224', swatch: ['#07050d', '#9B51E0', '#FF4B72'] },
  { id: 'lime',        name: 'Lime OLED',   grid: '193, 255, 18',  swatch: ['#010103', '#C1FF12', '#F76CFE'] },
  { id: 'broadsheet',  name: 'Broadsheet',  grid: '210, 120, 80',  swatch: ['#14110d', '#E8DCC8', '#C0463B'] },
  { id: 'ember',       name: 'Ember',       grid: '255, 140, 60',  swatch: ['#0c0805', '#FF8C3C', '#FF3B6B'] },
  { id: 'sakura',      name: 'Sakura',      grid: '255, 150, 190', swatch: ['#100a0d', '#FF8FB1', '#F2C14E'] },
  { id: 'forest',      name: 'Forest',      grid: '60, 220, 150',  swatch: ['#04100b', '#3CDC96', '#A6E22E'] },
  { id: 'synthwave',   name: 'Synthwave',   grid: '255, 60, 200',  swatch: ['#0d0726', '#FF3CC8', '#00E5FF'] },
  { id: 'slate',       name: 'Mono Slate',  grid: '124, 163, 201', swatch: ['#0b0e12', '#7CA3C9', '#9FB8CE'] },
  { id: 'gold',        name: 'Gold Noir',   grid: '212, 175, 95',  swatch: ['#0a0805', '#D4AF5F', '#D24B4B'] },
];

// Each font pairing sets --display / --sans / --mono via a body[data-font] block.
export const FONTS = [
  { id: 'geometric',  name: 'Geometric' },
  { id: 'editorial',  name: 'Editorial' },
  { id: 'grotesque',  name: 'Grotesque' },
  { id: 'serif',      name: 'Serif' },
  { id: 'techno',     name: 'Techno' },
  { id: 'classic',    name: 'Classic' },
  { id: 'neogrotesk', name: 'Neo-Grotesk' },
];

const CKEY = 'ledger-color';
const FKEY = 'ledger-font';

function readKey(key, fallback, list) {
  try {
    const v = localStorage.getItem(key);
    return v && list.some((x) => x.id === v) ? v : fallback;
  } catch {
    return fallback;
  }
}

export function initThemeDock() {
  const dock = document.getElementById('theme-dock');
  const toggle = document.getElementById('dock-toggle');
  const colorWrap = document.getElementById('dock-colors');
  const fontWrap = document.getElementById('dock-fonts');
  if (!colorWrap || !fontWrap) return;

  // Collapsible panel
  if (toggle && dock) {
    toggle.addEventListener('click', () => dock.classList.toggle('open'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') dock.classList.remove('open');
    });
  }
  const toggleChips = toggle ? toggle.querySelectorAll('.dock-toggle-chips i') : [];

  const applyColor = (id) => {
    const p = PALETTES.find((x) => x.id === id) || PALETTES[0];
    document.body.setAttribute('data-color', p.id);
    state.gridColor = p.grid;
    try { localStorage.setItem(CKEY, p.id); } catch {}
    colorWrap.querySelectorAll('.dock-swatch').forEach((b) =>
      b.classList.toggle('active', b.dataset.id === p.id));
    // mirror the active palette on the collapsed toggle button
    toggleChips.forEach((el, i) => { el.style.background = p.swatch[i] || p.swatch[0]; });
  };

  const applyFont = (id) => {
    const f = FONTS.find((x) => x.id === id) || FONTS[0];
    document.body.setAttribute('data-font', f.id);
    try { localStorage.setItem(FKEY, f.id); } catch {}
    fontWrap.querySelectorAll('.dock-chip').forEach((b) =>
      b.classList.toggle('active', b.dataset.id === f.id));
  };

  // --- render color swatches ---
  PALETTES.forEach((p) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dock-swatch';
    btn.dataset.id = p.id;
    btn.title = p.name;
    btn.setAttribute('aria-label', `Palette ${p.name}`);
    btn.innerHTML =
      `<span class="sw-chips">${p.swatch.map((c) => `<i style="background:${c}"></i>`).join('')}</span>` +
      `<span class="sw-name">${p.name}</span>`;
    btn.addEventListener('click', () => applyColor(p.id));
    colorWrap.appendChild(btn);
  });

  // --- render font chips ---
  FONTS.forEach((f) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dock-chip';
    btn.dataset.id = f.id;
    btn.textContent = f.name;
    btn.addEventListener('click', () => applyFont(f.id));
    fontWrap.appendChild(btn);
  });

  applyColor(readKey(CKEY, 'obsidian', PALETTES));
  applyFont(readKey(FKEY, 'geometric', FONTS));
}
