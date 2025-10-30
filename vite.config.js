// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // ← ¡MUY IMPORTANTE para que funcione en Android!
  build: {
    outDir: 'dist'
  }
});