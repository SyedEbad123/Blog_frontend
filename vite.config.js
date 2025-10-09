import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // REMOVE the base: './' line. This makes paths absolute (e.g., /assets/index.js)
  plugins: [
     tailwindcss(),
     react()
  ]
});