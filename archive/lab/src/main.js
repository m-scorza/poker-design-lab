// Orchestrator for the unified sandbox: styles, page partials, module inits.

// --- Styles (cascade order preserved from the original sandbox) ---
import './styles/theme-system.css';
import './styles/layout.css';
import './styles/masthead.css';
import './styles/ticker.css';
import './styles/transitions.css';
import './styles/desk.css';
import './styles/career.css';
import './styles/sessions.css';
import './styles/hands.css';
import './styles/leaks.css';
import './styles/ranges.css';
import './styles/villains.css';
import './styles/arena.css';
import './styles/theme-dock.css';
import './styles/loader.css';
import './styles/skeleton-shimmer.css';
import './styles/glow-borders.css';
import './styles/button-glows.css';
import './styles/cursor-follower.css';

// --- Page partials (section-only fragments) ---
import overview from './pages/overview.html?raw';
import career from './pages/career.html?raw';
import sessions from './pages/sessions.html?raw';
import hands from './pages/hands.html?raw';
import leaks from './pages/leaks.html?raw';
import ranges from './pages/ranges.html?raw';
import villains from './pages/villains.html?raw';
import arena from './pages/arena.html?raw';

// --- Modules ---
import { initThemeDock } from './modules/theme-dock.js';
import { initTransitions } from './modules/transitions.js';
import { initBackground } from './modules/background.js';
import { initLoader } from './modules/loader.js';
import { initRadar } from './modules/radar.js';
import { initSessions } from './modules/sessions.js';
import { initHands } from './modules/hands.js';
import { initLeaks } from './modules/leaks.js';
import { initRanges } from './modules/ranges.js';
import { initVillains } from './modules/villains.js';
import { initArena } from './modules/arena.js';
import { initCardTilt } from './modules/3d-tilt.js';
import { initCursorFollower } from './modules/cursor-follower.js';
import { initMagneticButtons } from './modules/magnetic-buttons.js';
import { initCareer } from './modules/career.js';
import { initTooltips } from './modules/tooltip.js';
import { initCommandPalette } from './modules/command-palette.js';
import './modules/toast.js';
import './modules/modal.js';

const PAGES = { overview, career, sessions, hands, leaks, ranges, villains, arena };

function injectPages() {
  const mount = document.getElementById('pages');
  if (!mount) return;
  mount.innerHTML = Object.values(PAGES).join('\n');
  // Only the overview page starts visible.
  const first = document.getElementById('page-overview');
  if (first) first.classList.add('active');
}

function boot() {
  injectPages();

  initThemeDock();
  initTransitions();
  initBackground();
  initLoader();
  initRadar();
  initSessions();
  initHands();
  initLeaks();
  initRanges();
  initVillains();
  initArena();
  initCardTilt();
  initCursorFollower();
  initMagneticButtons();
  initCareer();
  initTooltips();
  initCommandPalette();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
