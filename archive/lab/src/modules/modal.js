// Glass Modal Dialog module
let lastTrigger = null;

export function showModal({
  eyebrow = 'Confirmation',
  title = 'Confirm Action',
  body = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  onConfirm = null
}) {
  const scrim = document.getElementById('glass-modal-scrim');
  const dialog = document.getElementById('glass-modal-dialog');
  const elEyebrow = document.getElementById('glass-modal-eyebrow');
  const elTitle = document.getElementById('glass-modal-title');
  const elBody = document.getElementById('glass-modal-body');
  const btnCancel = document.getElementById('glass-modal-cancel');
  const btnConfirm = document.getElementById('glass-modal-confirm');
  const btnClose = document.getElementById('glass-modal-close');

  if (!scrim || !dialog) return;

  lastTrigger = document.activeElement;

  // Set contents
  elEyebrow.textContent = eyebrow;
  elTitle.textContent = title;
  elBody.textContent = body;
  btnCancel.textContent = cancelText;
  btnConfirm.textContent = confirmText;

  // Set danger class
  if (isDanger) {
    dialog.classList.add('danger');
  } else {
    dialog.classList.remove('danger');
  }

  // Bind confirmation event
  const handleConfirm = () => {
    close();
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
  };

  const close = () => {
    scrim.classList.remove('open');
    btnConfirm.removeEventListener('click', handleConfirm);
    btnCancel.removeEventListener('click', close);
    btnClose.removeEventListener('click', close);
    scrim.removeEventListener('mousedown', handleScrimClick);
    document.removeEventListener('keydown', handleKeydown);
    if (lastTrigger) {
      lastTrigger.focus();
    }
  };

  const handleScrimClick = (e) => {
    if (e.target === scrim) close();
  };

  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      close();
    }
    if (e.key === 'Tab') {
      // Focus trap
      const focusable = [...scrim.querySelectorAll('button, [tabindex="0"]')].filter(
        (el) => el.offsetParent !== null
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  btnConfirm.addEventListener('click', handleConfirm);
  btnCancel.addEventListener('click', close);
  btnClose.addEventListener('click', close);
  scrim.addEventListener('mousedown', handleScrimClick);
  document.addEventListener('keydown', handleKeydown);

  // Show
  scrim.classList.add('open');

  // Focus confirm button by default
  btnConfirm.focus();
}

window.showModal = showModal;
