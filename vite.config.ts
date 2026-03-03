import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Relative base works for any GitHub Pages URL (root or /repo-name/)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
