import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/frontend/zkTripster',
  plugins: [react()],
  server: {
    open: true,
  },
})
