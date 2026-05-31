      // =========================================================
      // 11. VILLAINS DOSSIERS GRID GENERATOR & EXPLOITAdvice
      // =========================================================
      // villainsMock is compiled globally from villains.json

      const villainsGrid = document.getElementById('villains-grid');
      const villainsSearch = document.getElementById('villains-search-input');
      const villainsFilters = document.querySelectorAll('#villains-filter-dock button');

      function renderVillains() {
        if (!villainsGrid) return;
        villainsGrid.innerHTML = '';

        const searchQ = villainsSearch.value.toLowerCase();
        const activeFilter = document.querySelector('#villains-filter-dock button.active');
        const filterVal = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';

        const filtered = villainsMock.filter(v => {
          if (searchQ && !v.name.toLowerCase().includes(searchQ)) return false;
          if (filterVal !== 'all' && v.arch !== filterVal) return false;
          return true;
        });

        filtered.forEach(v => {
          const card = document.createElement('div');
          card.className = 'opponent-dossier-card';
          card.innerHTML = `
            <div class="opp-dossier-header">
              <span class="opp-dossier-name">${v.name}</span>
              <span class="opp-dossier-hands">${v.hands} hands</span>
            </div>
            <span class="opp-arch-badge ${v.arch}">${v.label}</span>
            <div class="opp-stats-inline">
              <div class="opp-stat-cell"><div class="l">VPIP</div><div class="v">${v.vpip}%</div></div>
              <div class="opp-stat-cell"><div class="l">PFR</div><div class="v">${v.pfr}%</div></div>
              <div class="opp-stat-cell"><div class="l">AF</div><div class="v">${v.af}</div></div>
              <div class="opp-stat-cell"><div class="l">Gap</div><div class="v">${v.gap}</div></div>
            </div>
            
            <!-- Floating Exploit Overlay -->
            <div class="exploit-overlay-card">
              <div class="exploit-card-title">Exploit advice</div>
              <div class="exploit-card-body">${v.advice}</div>
            </div>
          `;
          villainsGrid.appendChild(card);
        });
      }

      if (villainsSearch) {
        villainsSearch.addEventListener('input', renderVillains);
        villainsFilters.forEach(btn => {
          btn.addEventListener('click', () => {
            villainsFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderVillains();
          });
        });
      }
      renderVillains();

