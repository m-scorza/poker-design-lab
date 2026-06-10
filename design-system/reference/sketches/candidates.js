/* =========================================================
   PALETTE CANDIDATES — switcher
   1-4 candidate · L light/dark · B background · O orbs · F halo
   State persists to localStorage. Overrides theme.css palettes
   via two-attribute selectors in candidates.css.
   ========================================================= */
(function () {
  'use strict';
  const CANDS = [
    { id: 'violet',  name: 'ULTRAVIOLET, OWNED' },
    { id: 'ink',     name: 'INK MONO' },
    { id: 'glacier', name: 'GLACIER, REFINED' },
    { id: 'abyss',   name: 'ABYSS' },
  ];
  const ORBS = ['low', 'med', 'high'];
  const BGS = ['orbs', 'dots', 'none'];

  const state = {
    cand: Math.min(+(localStorage.getItem('cand_idx') || 0), CANDS.length - 1),
    mode: localStorage.getItem('cand_mode') || 'dark',
    orbs: localStorage.getItem('cand_orbs') || 'med',
    follower: localStorage.getItem('cand_follower') || 'on',
    bg: localStorage.getItem('cand_bg') || 'orbs',
  };

  const hud = document.createElement('div');
  hud.className = 'cand-hud';
  document.body.appendChild(hud);

  function apply() {
    const c = CANDS[state.cand];
    const b = document.body;
    b.dataset.cand = c.id;
    b.dataset.mode = state.mode;
    b.dataset.orbs = state.orbs;
    b.dataset.follower = state.follower;
    b.dataset.bg = state.bg;
    localStorage.setItem('cand_idx', state.cand);
    localStorage.setItem('cand_mode', state.mode);
    localStorage.setItem('cand_orbs', state.orbs);
    localStorage.setItem('cand_follower', state.follower);
    localStorage.setItem('cand_bg', state.bg);
    hud.innerHTML =
      '<b>' + (state.cand + 1) + ' · <span class="accent">' + c.name + '</span></b> · ' +
      state.mode.toUpperCase() + ' · bg ' + state.bg + (state.bg === 'orbs' ? ' (' + state.orbs + ')' : '') +
      ' · halo ' + state.follower +
      '<span class="keys">[1-4] palette &nbsp;[L] light/dark &nbsp;[B] background &nbsp;[O] orbs &nbsp;[F] halo</span>';
  }

  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    const k = e.key.toLowerCase();
    if (k === '1' || k === '2' || k === '3' || k === '4') { state.cand = +k - 1; apply();