import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Add this line to fix the asset paths on Vercel
//  base: './', 
  plugins: [
    tailwindcss(),
    react()
  ]
});