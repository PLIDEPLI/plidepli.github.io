import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the site at /<repo-name>/, so the build must use
  // that as its base path. Local `npm run dev` stays at `/`.
  base: process.env.VITE_BASE || '/',
})
