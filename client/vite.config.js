import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/super-app-core/', // Wajib sesuai dengan nama repository GitHub Anda
});
