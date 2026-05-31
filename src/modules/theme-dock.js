      // 1. DYNAMIC THEME TOGGLES LOGIC (Color & Fonts switching)
      // =========================================================
      const btnObsidian = document.getElementById('btn-color-obsidian');
      const btnUltraviolet = document.getElementById('btn-color-ultraviolet');
      const btnGeometric = document.getElementById('btn-font-geometric');
      const btnEditorial = document.getElementById('btn-font-editorial');
      
      const logoTitle = document.getElementById('logo-title');

      btnObsidian.addEventListener('click', () => {
        btnObsidian.classList.add('active');
        btnUltraviolet.classList.remove('active');
        document.body.setAttribute('data-color', 'obsidian');
        targetGridColor = '0, 240, 255'; // Cyan morph
      });

      btnUltraviolet.addEventListener('click', () => {
        btnUltraviolet.classList.add('active');
        btnObsidian.classList.remove('active');
        document.body.setAttribute('data-color', 'ultraviolet');
        targetGridColor = '139, 108, 255'; // Violet morph
      });

      btnGeometric.addEventListener('click', () => {
        btnGeometric.classList.add('active');
        btnEditorial.classList.remove('active');
        document.body.setAttribute('data-font', 'geometric');
      });

      btnEditorial.addEventListener('click', () => {
        btnEditorial.classList.add('active');
        btnGeometric.classList.remove('active');
        document.body.setAttribute('data-font', 'editorial');
      });


      // =========================================================