import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // This is now required again with the new vercel.json
  base: './', 

  plugins: [
    tailwindcss(),
    react()
  ]
});