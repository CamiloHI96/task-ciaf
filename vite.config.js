// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/task-ciaf/' : './', // 👈 Pages usa /task-ciaf/, Android usa ./
  build: {
    outDir: 'dist'
  }
}))

