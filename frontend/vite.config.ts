import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // Use localhost when running outside Docker, backend-api inside Docker
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
