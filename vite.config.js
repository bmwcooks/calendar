import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves this repo at https://<user>.github.io/calendar/
const repoBase = '/calendar/'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.GITHUB_ACTIONS ? repoBase : '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsInlineLimit: 4096,
  },
  preview: {
    port: 4173,
  },
  server: {
    port: 5173,
    host: true,
  },
})
