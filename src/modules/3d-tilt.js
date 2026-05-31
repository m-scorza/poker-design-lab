// =========================================================
// 3D PERSPECTIVE TILT MODULE (GSAP card tilt effect)
// =========================================================

(function() {
  function initCardTilt() {
    const cards = document.querySelectorAll('.card, .opponent-dossier-card');
    
    cards.forEach(card => {
      // Remove previous listener tags if re-initializing
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', onMouseLeave);

      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
    });
  }

  function onMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Midpoints
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Choose sensitivity based on card density (higher divisor = subtler tilt)
    const divisor = card.classList.contains('opponent-dossier-card') ? 120 : 60;
    
    const angleX = (yc - y) / divisor; 
    const angleY = (x - xc) / divisor;
    
    gsap.to(card, {
      rotationX: angleX,
      rotationY: angleY,
      transformPerspective: 1200,
      ease: "power2.out",
      duration: 0.3
    });
  }

  function onMouseLeave(e) {
    const card = e.currentTarget;
    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      ease: "power2.out",
      duration: 0.5
    });
  }

  // Initial call
  initCardTilt();

  // Expose function globally for page swaps
  window.initCardTilt = initCardTilt;
})();
