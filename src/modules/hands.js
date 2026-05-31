// Simulated hands database table + replayer modal.
import gsap from 'gsap';
import handsData from '../data/hands.json';

export function initHands() {
  const handsTableBody = document.getElementById('hands-table-body');
  const filterPos = document.getElementById('filter-position');
  const filterComp = document.getElementById('filter-compliance');
  const filterScen = document.getElementById('filter-scenario');
  const filterSearch = document.getElementById('filter-search');

  const replayBackdrop = document.getElementById('replay-backdrop');
  const btnCloseReplay = document.getElementById('btn-close-replay');
  const card1 = document.getElementById('card-1');
  const card2 = document.getElementById('card-2');

  function renderHandsTable() {
    if (!handsTableBody) return;
    handsTableBody.innerHTML = '';

    const fPosition = filterPos.value;
    const fCompliance = filterComp.value;
    const fScenario = filterScen.value;
    const fSearch = filterSearch.value.toLowerCase();

    const filtered = handsData.filter(h => {
      if (fPosition && h.pos !== fPosition) return false;
      if (fCompliance === 'ok' && !h.compliant) return false;
      if (fCompliance === 'dev' && h.compliant) return false;
      if (fScenario && h.scenario !== fScenario) return false;
      if (fSearch && !h.cards.toLowerCase().includes(fSearch)) return false;
      return true;
    });

    filtered.forEach(h => {
      const tr = document.createElement('tr');

      const cardsSplit = h.cards.split(' ');
      const suitsMarkup = cardsSplit.map((c, i) => {
        const suit = h.suits[i];
        let sClass = 'suit-s';
        if (suit === '♥') sClass = 'suit-h';
        if (suit === '♦') sClass = 'suit-d';
        if (suit === '♣') sClass = 'suit-c';
        return `<span class="${sClass}">${c[0]}${suit}</span>`;
      }).join(' ');

      tr.innerHTML = `
        <td class="card-pair">${suitsMarkup}</td>
        <td style="font-family:var(--mono);">${h.pos}</td>
        <td style="font-family:var(--mono); color:var(--fg-muted);">${h.scenario.replace('_', ' ')}</td>
        <td style="font-family:var(--mono);">${h.stack}</td>
        <td style="font-family:var(--mono); text-transform:uppercase; font-weight:700;">${h.action}</td>
        <td style="font-family:var(--mono);" class="${h.net.includes('+') ? 'suit-c' : 'suit-h'}">${h.net}</td>
        <td><span class="compliance-badge ${h.compliant ? 'ok' : 'dev'}">${h.compliant ? 'ok' : 'deviation'}</span></td>
        <td style="text-align:right;"><button class="btn-replay" data-id="${h.id}">Replay</button></td>
      `;
      handsTableBody.appendChild(tr);
    });

    document.querySelectorAll('.btn-replay').forEach(btn => {
      btn.addEventListener('click', () => {
        openReplayModal(btn.getAttribute('data-id'));
      });
    });
  }

  function openReplayModal(id) {
    const hand = handsData.find(h => h.id === id);
    if (!hand || !replayBackdrop) return;

    document.getElementById('replay-title').innerText = `Replaying Hand #${id}`;
    document.getElementById('replay-pos').innerText = hand.pos;
    document.getElementById('replay-gto').innerText = hand.compliant ? hand.action.toUpperCase() : "FOLD";
    document.getElementById('replay-profit').innerText = hand.net;
    document.getElementById('replay-profit').className = hand.net.includes('+') ? 'suit-c' : 'suit-h';

    const parts = hand.cards.split(' ');
    card1.innerHTML = `<span>${parts[0][0]}</span><span class="suit-symbol">${hand.suits[0]}</span>`;
    card2.innerHTML = `<span>${parts[1][0]}</span><span class="suit-symbol">${hand.suits[1]}</span>`;

    card1.className = `poker-card-micro ${['♥', '♦'].includes(hand.suits[0]) ? 'red' : ''}`;
    card2.className = `poker-card-micro ${['♥', '♦'].includes(hand.suits[1]) ? 'red' : ''}`;

    replayBackdrop.style.display = 'flex';

    gsap.set([card1, card2], { scale: 0, rotation: 90, opacity: 0 });
    gsap.to(card1, { scale: 1, rotation: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: "power2.out" });
    gsap.to(card2, { scale: 1, rotation: 0, opacity: 1, duration: 0.5, delay: 0.35, ease: "power2.out" });
  }

  if (filterPos) {
    filterPos.addEventListener('change', renderHandsTable);
    filterComp.addEventListener('change', renderHandsTable);
    filterScen.addEventListener('change', renderHandsTable);
    filterSearch.addEventListener('input', renderHandsTable);
  }
  renderHandsTable();

  if (btnCloseReplay) {
    btnCloseReplay.addEventListener('click', () => {
      replayBackdrop.style.display = 'none';
    });
  }
}
