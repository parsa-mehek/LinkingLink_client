import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'build' },
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
// Note: API base URL is set inside src/lib/api.js via VITE_API_BASE_URL or REACT_APP_API_URL
