// Leaks ledger swaps + 13x13 leak matrix render.
import gsap from 'gsap';

const leaksData = {
  btn: {
    sev: 'Critical',
    meta: 'Top leak · 1 of 3 · BTN · 100bb',
    head: 'The button is <span class="leak-highlight">bleeding.</span>',
    desc: "You're opening <b>58%</b> on the button where the solver wants <b>48–52%</b>. The bottom 6% of that range — <i>K8s K7s Q6s Q5s J7s T7s</i> — gets punished hardest by late-position three-bets.",
    dev: '+8.0%', cost: '-28bb/100', tourney: '-$0.62', recover: '+$60',
    pos: 'BTN OPEN', activeCombos: ['K8s', 'K7s', 'Q6s', 'Q5s', 'J7s', 'T7s', 'K9s', 'QTs', 'J9s', 'T8s']
  },
  bb: {
    sev: 'High',
    meta: 'High priority · 2 of 3 · BB · 25bb',
    head: 'Overfolding the <span class="leak-highlight">big blind.</span>',
    desc: "You fold <b>68%</b> versus late-position button opens where optimal ranges defend <b>52-56%</b>. You are folding profitable defenses like <i>T8o 97o Q6s J7s</i>.",
    dev: '-12.0%', cost: '-18bb/100', tourney: '-$0.38', recover: '+$35',
    pos: 'BB DEFENSE', activeCombos: ['T8o', '97o', 'Q6s', 'J7s', '86s', 'T7s', 'J6s']
  },
  sb: {
    sev: 'Medium',
    meta: 'Medium priority · 3 of 3 · SB · 40bb',
    head: 'Flatting weak <span class="leak-highlight">offsuit aces.</span>',
    desc: "Calling folds out of the Small Blind versus early-position opens. Hands like <i>A8o A7o KJo</i> are massive net negative flats.",
    dev: '+6.4%', cost: '-11bb/100', tourney: '-$0.15', recover: '+$18',
    pos: 'SB FLAT VS UTG', activeCombos: ['A8o', 'A7o', 'KJo', 'QTo', 'JTo']
  }
};

export function initLeaks() {
  const leakMatrixContainer = document.getElementById('leak-matrix-grid');
  const leakIndexRows = document.querySelectorAll('.leak-index-row');

  function generateLeakMatrix(combos = []) {
    if (!leakMatrixContainer) return;
    leakMatrixContainer.innerHTML = '';
    const matrixRanks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

    for (let r = 0; r < 13; r++) {
      for (let c = 0; c < 13; c++) {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell-node';

        let hand = '';
        if (r === c) hand = matrixRanks[r] + matrixRanks[c];
        else if (r < c) hand = matrixRanks[r] + matrixRanks[c] + 's';
        else hand = matrixRanks[c] + matrixRanks[r] + 'o';

        cell.innerText = hand;

        const isOffending = combos.includes(hand);
        const isBaseRange = (r + c) < 9;

        if (isOffending) {
          cell.classList.add('fold-range');
        } else if (isBaseRange) {
          cell.classList.add('open-range');
        }

        leakMatrixContainer.appendChild(cell);
      }
    }
  }

  generateLeakMatrix(leaksData.btn.activeCombos);

  leakIndexRows.forEach(row => {
    row.addEventListener('click', () => {
      leakIndexRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      const type = row.getAttribute('data-leak');
      const data = leaksData[type];
      if (!data) return;

      const gridBox = document.getElementById('incident-grid-box');
      gsap.to(gridBox, {
        opacity: 0, y: -10, duration: 0.25, onComplete: () => {
          document.getElementById('leak-severity-badge').innerText = data.sev;
          document.getElementById('leak-severity-badge').className = `compliance-badge ${data.sev === 'Critical' ? 'dev' : 'ok'}`;
          document.getElementById('leak-meta').innerText = data.meta;
          document.getElementById('leak-headline').innerHTML = data.head;
          document.getElementById('leak-description').innerHTML = data.desc;

          document.getElementById('leak-stat-dev').innerText = data.dev;
          document.getElementById('leak-stat-cost').innerText = data.cost;
          document.getElementById('leak-stat-tourney').innerText = data.tourney;
          document.getElementById('leak-stat-recover').innerText = data.recover;
          document.getElementById('leak-matrix-pos').innerText = data.pos;

          generateLeakMatrix(data.activeCombos);

          gsap.fromTo(gridBox, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 });
        }
      });
    });
  });
}
