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

// Typography is a 3-axis model (display / body / mono). Each FACE is a real font
// stack tagged with the role(s) it can fill; PAIRINGS are curated, opinionated
// combos with a one-line rationale (see docs/TYPOGRAPHY.md). The dock applies a
// pairing — or a custom per-axis mix — by setting --display / --sans / --mono
// inline on <body>. No more frozen 7-preset roulette.
// Serif is intentionally out for now (no Fraunces / Source Serif). A non-serif
// display + body face can be added here later to restore a third pairing and
// widen the mix-and-match pool.
export const FACES = {
  bricolage:   { name: 'Bricolage Grotesque', stack: "'Bricolage Grotesque', system-ui, sans-serif", roles: ['display'],         tag: 'display · grotesque' },
  spacegrotesk:{ name: 'Space Grotesk',       stack: "'Space Grotesk', system-ui, sans-serif",        roles: ['display', 'body'], tag: 'display · geometric' },
  hanken:      { name: 'Hanken Grotesk',      stack: "'Hanken Grotesk', system-ui, sans-serif",       roles: ['body'],            tag: 'body · humanist' },
  inter:       { name: 'Inter',               stack: "'Inter', -apple-system, sans-serif",            roles: ['body'],            tag: 'body · neutral' },
  spacemono:   { name: 'Space Mono',          stack: "'Space Mono', ui-monospace, monospace",         roles: ['mono'],            tag: 'mono · characterful' },
  jetbrains:   { name: 'JetBrains Mono',      stack: "'JetBrains Mono', ui-monospace, monospace",     roles: ['mono'],            tag: 'mono · data' },
};

// Curated pairings — the front door. `why` is shown on the card.
// (A third, serif-free pairing slot is open — see note above.)
export const PAIRINGS = [
  { id: 'broadsheet', name: 'Broadsheet', display: 'bricolage',    body: 'hanken', mono: 'spacemono', why: 'Newspaper authority — the Ledger voice.' },
  { id: 'terminal',   name: 'Terminal',   display: 'spacegrotesk', body: 'inter',  mono: 'jetbrains', why: 'Clean, neutral — a precise instrument.' },
];

const AXES = ['display', 'body', 'mono'];
const VAR = { display: '--display', body: '--sans', mono: '--mono' };

const CKEY = 'ledger-color';
const FKEY_AXES = 'ledger-font-axes';   // JSON { display, body, mono } — source of truth
const FKEY_PAIR = 'ledger-font-pairing'; // active pairing id, or 'custom'

function readColorKey(fallback) {
  try {
    const v = localStorage.getItem(CKEY);
    return v && PALETTES.some((x) => x.id === v) ? v : fallback;
  } catch {
    return fallback;
  }
}

// Read saved axes, falling back to the default pairing. Guards against unknown
// face ids (e.g. after a face is renamed/removed).
function readAxes() {
  const def = PAIRINGS[0];
  const base = { display: def.display, body: def.body, mono: def.mono };
  try {
    const saved = JSON.parse(localStorage.getItem(FKEY_AXES) || 'null');
    if (saved) AXES.forEach((ax) => { if (FACES[saved[ax]] && FACES[saved[ax]].roles.includes(ax)) base[ax] = saved[ax]; });
  } catch {}
  return base;
}

export function initThemeDock() {
  const dock = document.getElementById('theme-dock');
  const toggle = document.getElementById('dock-toggle');
  const colorWrap = document.getElementById('dock-colors');
  const pairWrap = document.getElementById('dock-pairings');
  const axesWrap = document.getElementById('dock-axes');
  const advToggle = document.getElementById('dock-advanced-toggle');
  if (!colorWrap || !pairWrap || !axesWrap) return;

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

  // --- typography: 3-axis state ---
  let axes = readAxes();

  // which pairing (if any) exactly matches the current axes?
  const matchingPairing = () =>
    PAIRINGS.find((p) => p.display === axes.display && p.body === axes.body && p.mono === axes.mono);

  const apply = () => {
    AXES.forEach((ax) => document.body.style.setProperty(VAR[ax], FACES[axes[ax]].stack));
    const pair = matchingPairing();
    document.body.setAttribute('data-font', pair ? pair.id : 'custom');
    try {
      localStorage.setItem(FKEY_AXES, JSON.stringify(axes));
      localStorage.setItem(FKEY_PAIR, pair ? pair.id : 'custom');
    } catch {}
    // reflect state in the UI
    pairWrap.querySelectorAll('.dock-pairing').forEach((c) =>
      c.classList.toggle('active', !!pair && c.dataset.id === pair.id));
    axesWrap.querySelectorAll('.dock-face').forEach((c) =>
      c.classList.toggle('active', axes[c.dataset.axis] === c.dataset.face));
  };

  const setPairing = (id) => {
    const p = PAIRINGS.find((x) => x.id === id);
    if (!p) return;
    axes = { display: p.display, body: p.body, mono: p.mono };
    apply();
  };
  const setAxis = (axis, faceId) => { axes[axis] = faceId; apply(); };

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

  // --- render curated pairing cards (name + live specimen + rationale) ---
  PAIRINGS.forEach((p) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dock-pairing';
    btn.dataset.id = p.id;
    btn.innerHTML =
      `<span class="dp-spec" style="font-family:${FACES[p.display].stack}">Aa</span>` +
      `<span class="dp-meta"><span class="dp-name">${p.name}</span>` +
      `<span class="dp-why">${p.why}</span></span>`;
    btn.addEventListener('click', () => setPairing(p.id));
    pairWrap.appendChild(btn);
  });

  // --- render advanced per-axis pickers ---
  const AXIS_LABEL = { display: 'Display', body: 'Body', mono: 'Mono' };
  AXES.forEach((axis) => {
    const row = document.createElement('div');
    row.className = 'dock-axis-row';
    row.innerHTML = `<span class="dock-axis-label">${AXIS_LABEL[axis]}</span>`;
    const chips = document.createElement('div');
    chips.className = 'dock-axis-chips';
    Object.entries(FACES).filter(([, f]) => f.roles.includes(axis)).forEach(([id, f]) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'dock-face';
      chip.dataset.axis = axis;
      chip.dataset.face = id;
      chip.title = f.tag;
      chip.textContent = f.name;
      chip.style.fontFamily = f.stack;
      chip.addEventListener('click', () => setAxis(axis, id));
      chips.appendChild(chip);
    });
    row.appendChild(chips);
    axesWrap.appendChild(row);
  });

  // advanced disclosure
  if (advToggle) {
    advToggle.addEventListener('click', () => {
      const open = axesWrap.hasAttribute('hidden');
      if (open) axesWrap.removeAttribute('hidden'); else axesWrap.setAttribute('hidden', '');
      advToggle.setAttribute('aria-expanded', String(open));
      advToggle.classList.toggle('open', open);
    });
  }

  applyColor(readColorKey('obsidian'));
  apply();
}
