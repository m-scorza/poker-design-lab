import { resolve } from 'path';
import { defineConfig } from 'vite';

// Multi-page design lab: the unified sandbox (index) and the element catalog (elements).
// `base` resolves per environment:
//   - local dev (`npm run dev`) → '/' (serves at http://localhost:5173/)
//   - Vercel build → '/' (Vercel sets the VERCEL env var; site is served at the domain root)
//   - GitHub Pages build (default) → '/poker-design-lab/' (repo-name subpath)
export default defineConfig(({ command }) => ({
  base: command === 'build' && !process.env.VERCEL ? '/poker-design-lab/' : '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        elements: resolve(__dirname, 'elements.html'),
        'src/elements/background': resolve(__dirname, 'src/elements/background.html'),
        'src/elements/shader-bg': resolve(__dirname, 'src/elements/shader-bg.html'),
        'src/elements/follower': resolve(__dirname, 'src/elements/follower.html'),
        'src/elements/tilt': resolve(__dirname, 'src/elements/tilt.html'),
        'src/elements/border-glow': resolve(__dirname, 'src/elements/border-glow.html'),
        'src/elements/button-glow': resolve(__dirname, 'src/elements/button-glow.html'),
        'src/elements/magnetic-button': resolve(__dirname, 'src/elements/magnetic-button.html'),
        'src/elements/cyber-btn': resolve(__dirname, 'src/elements/cyber-btn.html'),
        'src/elements/cli-panel': resolve(__dirname, 'src/elements/cli-panel.html'),
        'src/elements/blueprint-theme': resolve(__dirname, 'src/elements/blueprint-theme.html'),
        'src/elements/villain-badge': resolve(__dirname, 'src/elements/villain-badge.html'),
        'src/elements/verdict-card': resolve(__dirname, 'src/elements/verdict-card.html'),
        'src/elements/range-grid-action': resolve(__dirname, 'src/elements/range-grid-action.html'),
        'src/elements/odometer-statcard': resolve(__dirname, 'src/elements/odometer-statcard.html'),
        'src/elements/leak-card-gauge': resolve(__dirname, 'src/elements/leak-card-gauge.html'),
        'src/elements/hand-replay-felt': resolve(__dirname, 'src/elements/hand-replay-felt.html'),
        'src/elements/aurora-bg': resolve(__dirname, 'src/elements/aurora-bg.html'),
        'src/elements/spotlight-card': resolve(__dirname, 'src/elements/spotlight-card.html'),
        'src/elements/button-fx': resolve(__dirname, 'src/elements/button-fx.html'),
        'src/elements/card-render': resolve(__dirname, 'src/elements/card-render.html'),
        'src/elements/career-arc': resolve(__dirname, 'src/elements/career-arc.html'),
        'src/elements/leak-heatmap': resolve(__dirname, 'src/elements/leak-heatmap.html'),
        'src/elements/scroll-reveal': resolve(__dirname, 'src/elements/scroll-reveal.html'),
        'src/elements/type-switcher': resolve(__dirname, 'src/elements/type-switcher.html'),
        'src/elements/tournament-lab-shell': resolve(__dirname, 'src/elements/tournament-lab-shell.html'),
        'src/elements/scramble': resolve(__dirname, 'src/elements/scramble.html'),
        'src/elements/radar-hud': resolve(__dirname, 'src/elements/radar-hud.html'),
        'src/elements/trendline-morph': resolve(__dirname, 'src/elements/trendline-morph.html'),
        'src/elements/blocker-simulator': resolve(__dirname, 'src/elements/blocker-simulator.html'),
        'src/elements/abi-evolution': resolve(__dirname, 'src/elements/abi-evolution.html'),
        'src/elements/calendar-heatmap': resolve(__dirname, 'src/elements/calendar-heatmap.html'),
        'src/elements/replayer': resolve(__dirname, 'src/elements/replayer.html'),
        'src/elements/modal-glass': resolve(__dirname, 'src/elements/modal-glass.html'),
        'src/elements/toast-stack': resolve(__dirname, 'src/elements/toast-stack.html'),
        'src/elements/drawer-slide': resolve(__dirname, 'src/elements/drawer-slide.html'),
        'src/elements/command-palette': resolve(__dirname, 'src/elements/command-palette.html'),
        'src/elements/tooltip-popover': resolve(__dirname, 'src/elements/tooltip-popover.html'),
        'src/elements/progress-cinematic': resolve(__dirname, 'src/elements/progress-cinematic.html'),
        'src/elements/spinners': resolve(__dirname, 'src/elements/spinners.html'),
        'src/elements/skeleton-shimmer': resolve(__dirname, 'src/elements/skeleton-shimmer.html'),
        'src/elements/cursor-trail': resolve(__dirname, 'src/elements/cursor-trail.html'),
        'src/elements/split-flap': resolve(__dirname, 'src/elements/split-flap.html'),
        'src/elements/char-reveal': resolve(__dirname, 'src/elements/char-reveal.html'),
        'src/elements/parallax-depth': resolve(__dirname, 'src/elements/parallax-depth.html'),
        'src/elements/sticky-stack': resolve(__dirname, 'src/elements/sticky-stack.html'),
      },
    },
  },
}));
