import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/WeatherProject', // Match your GitHub Pages URL path
  plugins: [react()],
});
