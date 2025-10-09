import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [ tailwindcss(),],
      server:{
      proxy:{
        "/api/":"http://localhost:5000",
        "/uploads":"http://localhost:5000",
      }
    }
})