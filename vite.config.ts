import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const basePath = process.env.BASE_PATH || (process.env.NODE_ENV === 'production' ? '/See_Out/' : '/');

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    {
      name: 'base-asset-prefix',
      transform(code, id) {
        if (id.includes('/src/') || id.endsWith('index.html')) {
          return {
            code: code.replace(/(["'])\/images\//g, `$1${basePath}images/`),
            map: null
          };
        }
      }
    }
  ],
  server: {
    port: 3000
  }
});

