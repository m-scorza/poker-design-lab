// Theme dock: color + font toggles. Writes the mesh morph target to state.
import { state } from '../state.js';

export function initThemeDock() {
  const btnObsidian = document.getElementById('btn-color-obsidian');
  const btnUltraviolet = document.getElementById('btn-color-ultraviolet');
  const btnGeometric = document.getElementById('btn-font-geometric');
  const btnEditorial = document.getElementById('btn-font-editorial');
  if (!btnObsidian) return;

  btnObsidian.addEventListener('click', () => {
    btnObsidian.classList.add('active');
    btnUltraviolet.classList.remove('active');
    document.body.setAttribute('data-color', 'obsidian');
    state.gridColor = '0, 240, 255';
  });

  btnUltraviolet.addEventListener('click', () => {
    btnUltraviolet.classList.add('active');
    btnObsidian.classList.remove('active');
    document.body.setAttribute('data-color', 'ultraviolet');
    state.gridColor = '139, 108, 255';
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
}
