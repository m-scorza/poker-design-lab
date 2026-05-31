import { resolve } from 'path';
import { defineConfig } from 'vite';

// Multi-page design lab: the unified sandbox (index) and the element catalog (elements).
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        elements: resolve(__dirname, 'elements.html'),
      },
    },
  },
});
