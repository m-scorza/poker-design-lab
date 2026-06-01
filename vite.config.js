import { resolve } from 'path';
import { defineConfig } from 'vite';

// Multi-page design lab: the unified sandbox (index) and the element catalog (elements).
export default defineConfig({
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
        'src/elements/scramble': resolve(__dirname, 'src/elements/scramble.html'),
        'src/elements/radar-hud': resolve(__dirname, 'src/elements/radar-hud.html'),
        'src/elements/trendline-morph': resolve(__dirname, 'src/elements/trendline-morph.html'),
        'src/elements/blocker-simulator': resolve(__dirname, 'src/elements/blocker-simulator.html'),
        'src/elements/abi-evolution': resolve(__dirname, 'src/elements/abi-evolution.html'),
        'src/elements/calendar-heatmap': resolve(__dirname, 'src/elements/calendar-heatmap.html'),
        'src/elements/replayer': resolve(__dirname, 'src/elements/replayer.html'),
      },
    },
  },
});
