import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the site at /<repo-name>/, so the build must use
  // that as its base path. Local `npm run dev` stays at `/`.
  base: process.env.VITE_BASE || '/',
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        product: fileURLToPath(new URL('./product/index.html', import.meta.url)),
        stories: fileURLToPath(new URL('./stories/index.html', import.meta.url)),
        installation: fileURLToPath(new URL('./installation/index.html', import.meta.url)),
      },
    },
  },
})
