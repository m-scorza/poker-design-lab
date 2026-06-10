/* =========================================================
   REINTERPRETATION — runtime toggles
   T = type voice (ledger / neutral) · V = violet signature on/off
   Palette is LOCKED (Ink Mono); no palette keys on purpose.
   ========================================================= */
(function () {
  'use strict';
  const state = {
    font: localStorage.getItem('rt_font') || 'hybrid',  /* decided: D9 */
    sig: localStorage.getItem('rt_sig') || 'violet',
  };

  const hud = document.createElement('div');
  hud.className = 'r-hud';
  document.body.appendChild(hud);

  function apply() {
    const b = document.body;
    b.dataset.color = '';            /* palette decided — neutralize old themes */
    b.dataset.font = state.font;
    b.dataset.sig = state.sig;
    localStorage.setItem('rt_font', state.font);
    localStorage.setItem('rt_sig', state.sig);
    hud.innerHTML =
      '<b>INK MONO · locked</b> · type ' + state.font +
      ' · signature <span class="sig">' + (state.sig === 'violet' ? 'VIOLET' : 'off') + '</span>' +
      '<span class="keys">[T] type voice &nbsp;[V] violet signature</span>';
  }

  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    const k = e.key.toLowerCase();
    if (k === 't') {
      const F = ['ledger', 'neutral', 'hybrid'];
      state.font = F[(F.indexOf(state.font) + 1) % F.length];
      apply();
    }
    else if (k === 'v') { state.sig = state.sig === 'violet' ? 'off' : 'violet'; apply(); }
  });

  apply();
})();
