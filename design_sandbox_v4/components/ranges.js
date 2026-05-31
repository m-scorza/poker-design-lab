      // =========================================================
      // 10. RANGES LAB MATRIX & POSITION CHIPS
      // =========================================================
      const rangesPosSelector = document.getElementById('ranges-pos-selector');
      const rangesGridContainer = document.getElementById('ranges-matrix-grid');
      const RFI_POSITIONS = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
      
      const rangesPct = { UTG: 15, HJ: 20, CO: 26, BTN: 48, SB: 38, BB: 12 };

      if (rangesPosSelector) {
        RFI_POSITIONS.forEach(pos => {
          const btn = document.createElement('button');
          btn.className = `pos-select-btn ${pos === 'UTG' ? 'active' : ''}`;
          btn.innerText = pos;
          btn.addEventListener('click', () => {
            document.querySelectorAll('.pos-select-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateRangesGrid(rangesPct[pos]);
          });
          rangesPosSelector.appendChild(btn);
        });
      }

      function updateRangesGrid(pctVal) {
        if (!rangesGridContainer) return;
        rangesGridContainer.innerHTML = '';
        const matrixRanks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
        let combos = 0;

        for (let r = 0; r < 13; r++) {
          for (let c = 0; c < 13; c++) {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell-node';
            
            let hand = '';
            if (r === c) hand = matrixRanks[r] + matrixRanks[c];
            else if (r < c) hand = matrixRanks[r] + matrixRanks[c] + 's';
            else hand = matrixRanks[c] + matrixRanks[r] + 'o';
            
            cell.innerText = hand;
            
            // Programmatically draw range based on pct
            const val = 169 - (r * 13 + c);
            const rankPct = (val / 169) * 100;
            
            if (rankPct >= (100 - pctVal)) {
              cell.classList.add('open-range');
              combos++;
            } else if (rankPct >= (100 - pctVal - 6)) {
              cell.classList.add('fold-range');
            }

            rangesGridContainer.appendChild(cell);
          }
        }
        document.getElementById('ranges-combos-lbl').innerText = `${combos} / 169 combos`;
      }

      function animateRangeGridFades() {
        const cells = document.querySelectorAll('#ranges-matrix-grid .matrix-cell-node');
        gsap.fromTo(cells, { scale: 0.6, opacity: 0 }, {
          scale: 1, opacity: 1, stagger: 0.002, duration: 0.5, ease: "power2.out"
        });
      }
      updateRangesGrid(15);

