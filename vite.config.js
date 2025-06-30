import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {allowedHosts: ["a92b-2405-201-a404-b056-70c3-27ee-74ec-d08b.ngrok-free.app"]}})
