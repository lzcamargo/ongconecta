import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' (caminhos relativos) permite publicar o MESMO build em
// /<repositorio>/staging/ e depois em /<repositorio>/ sem recompilar (PGC 6).
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/setupTests.js'],
      thresholds: { lines: 60 },
    },
  },
});
