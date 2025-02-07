import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://d4sf-pdftranslate.302.ai',
        changeOrigin: true,
        secure: false
      },
      '/cache': {
        target: 'https://d4sf-pdftranslate.302.ai',
        changeOrigin: true,
        secure: false
      }
    }
  },
})
