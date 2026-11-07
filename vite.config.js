import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig({
  // imagetools converts imported images to WebP (see src/utils/images.js)
  plugins: [react(), imagetools()],
})
