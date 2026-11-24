import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Must match the GitHub repository name exactly (case-sensitive).
  // e.g. for https://username.github.io/NetMedic/ the base is '/NetMedic/'
  base: '/NetMedic/',

  plugins: [react()],

  server: {
    port: 3000,
    open: true,
  },

  build: {
    outDir: 'dist',
  },
})
