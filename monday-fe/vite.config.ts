import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3001,
    strictPort: true,
    allowedHosts: [
      '.apps-tunnel.monday.app',
      '1bb1-203-9-210-240.ngrok-free.app',
      'd2e5-203-9-210-240.ngrok-free.app',
      '1b13-103-163-182-232.ngrok-free.app',
      'localhost',
      '127.0.0.1',
    ]
  }
})
