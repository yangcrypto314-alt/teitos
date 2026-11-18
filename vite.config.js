import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// En local la web vive en "/". En GitHub Pages vive en "/nombre-del-repo/":
// el workflow de despliegue pasa esa ruta en la variable BASE_PATH.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
