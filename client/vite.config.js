import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/super-app-core/', // <-- Wajib diisi sesuai nama repository GitHub Pages Anda
});
