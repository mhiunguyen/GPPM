import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
<<<<<<< HEAD
        target: 'http://localhost:8000',
=======
        target: 'http://backend-api:8000',
>>>>>>> 9491d7e6213a5e25ee6fdc2936818618a3dc64a4
        changeOrigin: true,
      },
    },
  },
})
