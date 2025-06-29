import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

import {
  APP_AUTHOR,
  APP_DESCRIPTION,
  APP_ICON,
  APP_NAME,
  APP_PROJECT_URL,
  APP_VERSION,
  DOWNLOAD_URL,
  UPDATE_URL,
} from './src/config';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        name: APP_NAME,
        description: APP_DESCRIPTION,
        downloadURL: DOWNLOAD_URL,
        updateURL: UPDATE_URL,
        version: APP_VERSION,
        author: APP_AUTHOR,
        icon: APP_ICON,
        namespace: APP_PROJECT_URL,
        match: ['*://*.bgm.tv/*', '*://*.bangumi.tv/*', '*://*.chii.in/*'],
      },
      build: {
        metaFileName: true,
        systemjs: 'inline',
      },
    }),
  ],
  build: {
    minify: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
