import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// For GitHub Pages project site (username.github.io/repo-name/), base must be '/repo-name/'
// Change to '' for user/org site (username.github.io)
export default defineConfig({
  base: '/personalWeb/',
  plugins: [react(), tailwindcss()],
})
