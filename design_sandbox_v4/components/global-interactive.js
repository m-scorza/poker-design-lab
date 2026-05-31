      // Cursor follower magnet updates
      document.querySelectorAll('.mast-nav a, .stat-trigger, .timeline-row-editorial, .matrix-cell-node, button, a').forEach(el => {
        el.addEventListener('mouseenter', () => {
          gsap.to(follower, { width: 44, height: 44, duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(follower, { width: 20, height: 20, duration: 0.3 });
        });
      });