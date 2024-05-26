import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from "vite-plugin-fs";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [fs(), react()],
  server: {
    open: true,
  },
  resolve: {
    preserveSymlinks: true
  }
})
