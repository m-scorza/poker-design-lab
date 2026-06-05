// Interactive Tooltips module

export function initTooltips() {
  const tip = document.getElementById('stat-tooltip');
  if (!tip) return;

  const tipTitle = document.getElementById('stat-tooltip-title');
  const tipBody = document.getElementById('stat-tooltip-body');
  const tipArrow = document.getElementById('stat-tooltip-arrow');

  function place(el, trigger, arrow, preferred = 'top') {
    const r = trigger.getBoundingClientRect();
    el.classList.add('show');
    const tw = el.offsetWidth, th = el.offsetHeight, gap = 8;
    let place = preferred;
    
    // Auto flip if top overflows screen
    if (place === 'top' && r.top - th - gap < 8) place = 'bottom';
    
    let top;
    let left = r.left + r.width / 2 - tw / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
    
    if (place === 'top') {
      top = r.top - th - gap;
    } else {
      top = r.bottom + gap;
    }
    
    el.style.top = (top + window.scrollY) + 'px';
    el.style.left = (left + window.scrollX) + 'px';
    
    // Center the arrow
    const ax = r.left + r.width / 2 - left - 4.5;
    arrow.style.left = Math.max(10, Math.min(ax, tw - 18)) + 'px';
    if (place === 'top') {
      arrow.style.bottom = '-5px';
      arrow.style.top = 'auto';
      arrow.style.borderTop = 'none';
      arrow.style.borderLeft = 'none';
    } else {
      arrow.style.top = '-5px';
      arrow.style.bottom = 'auto';
      arrow.style.borderBottom = 'none';
      arrow.style.borderRight = 'none';
    }
  }

  // Bind hover events to data-tip elements
  function bindEvents() {
    document.querySelectorAll('[data-tip]').forEach((t) => {
      // Remove any existing listeners to prevent double binds
      t.removeEventListener('mouseenter', onMouseEnter);
      t.removeEventListener('mouseleave', onMouseLeave);
      
      t.addEventListener('mouseenter', onMouseEnter);
      t.addEventListener('mouseleave', onMouseLeave);
    });
  }

  function onMouseEnter(e) {
    const t = e.currentTarget;
    if (!tipTitle || !tipBody || !tipArrow) return;
    tipTitle.textContent = t.dataset.tip;
    tipBody.textContent = t.dataset.tipBody || '';
    place(tip, t, tipArrow, t.dataset.place || 'top');
  }

  function onMouseLeave() {
    tip.classList.remove('show');
  }

  // Initial binding
  bindEvents();

  // Re-expose to global or run on dynamic DOM updates
  window.refreshTooltips = bindEvents;
}

// Auto-run on document ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initTooltips());
} else {
  initTooltips();
}
