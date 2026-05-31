      // 3. HORIZONTAL NAV PAGE SWITCHING ANIMATION
      // =========================================================
      const navLinks = document.querySelectorAll('.mast-nav a');
      const pages = document.querySelectorAll('.page');
      const slideLoader = document.getElementById('slide-loader');

      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (link.classList.contains('on')) return;
          
          const targetTab = link.getAttribute('data-tab');
          const activePage = document.querySelector('.page.active');
          const targetPage = document.getElementById(`page-${targetTab}`);
          
          if (!targetPage || !activePage) return;

          // Update active links
          navLinks.forEach(l => l.classList.remove('on'));
          link.classList.add('on');
          
          // Color sweep loader line
          gsap.fromTo(slideLoader, { left: '-100%' }, {
            left: '100%',
            duration: 0.7,
            ease: "power2.inOut",
            onStart: () => {
              // Animate active page out with skew slide
              gsap.to(activePage, {
                x: -120,
                skewX: 8,
                opacity: 0,
                duration: 0.35,
                ease: "power2.in",
                onComplete: () => {
                  activePage.classList.remove('active');
                  activePage.style.display = 'none';
                  
                  targetPage.style.display = 'block';
                  targetPage.classList.add('active');
                  
                  // Animate target page in with reverse skew slide
                  gsap.fromTo(targetPage, 
                    { x: 120, skewX: -8, opacity: 0 },
                    { x: 0, skewX: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
                  );
                  
                  // Scramble headers
                  const headerTitle = targetPage.querySelector('h1, h2.kick, span.kick');
                  if (headerTitle) {
                    scrambleText(headerTitle.id || '', headerTitle.innerText, 0.5);
                  }

                  // Page-specific calibrations
                  if (targetTab === 'ranges') {
                    animateRangeGridFades();
                  } else if (targetTab === 'arena') {
                    resizeFeltCanvas();
                  }
                }
              });
            }
          });
        });
      });


      // =========================================================