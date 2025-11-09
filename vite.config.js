import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.crt')),
    },
    port: 5173,

    proxy: {
      // AUTH BACKEND - Mer specifik regel först
      '/api/auth': {
        target: 'http://localhost:4100',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          console.log('🔐 Auth request:', path);
          return path;
        }
      },

      // DOMAIN BACKEND - Generell regel sist
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          console.log('📦 Domain request:', path);
          return path;
        }
      }
    }
  }
})