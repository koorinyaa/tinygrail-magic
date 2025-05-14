import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import { APP_NAME, APP_VERSION, APP_DESCRIPTION, APP_AUTHOR } from './src/config';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        name: APP_NAME,
        version: APP_VERSION,
        author: APP_AUTHOR,
        description: APP_DESCRIPTION,
        icon: 'https://tinygrail.com/favicon.ico',
        namespace: 'tinygrail-magic',
        match: [
          '*://*.bgm.tv/*',
          '*://*.bangumi.tv/*',
          '*://*.chii.in/*',
        ],
      },
      build: {
        metaFileName: true,
      },
    }),
  ],
  build: {
    minify: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});
