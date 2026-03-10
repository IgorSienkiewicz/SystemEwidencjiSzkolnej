import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,        
    watch: {
      usePolling: true,
      interval: 1000
    },
    hmr: {
      host: 'localhost',
      port: 3000        
    },
    proxy: {
      '/api': {
        target: 'http://webapi:8080',   
        changeOrigin: true,
        secure: false
      }
    }
  }
})