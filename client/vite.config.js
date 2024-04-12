import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: 'https://mern-estate-9g9x.onrender.com',
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 5000 // Adjust the limit as needed
  },
  plugins: [react()],
})
