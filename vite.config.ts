import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import {
  APP_AUTHOR,
  APP_DESCRIPTION,
  APP_NAME,
  APP_VERSION,
  DOWNLOAD_URL,
  UPDATE_URL,
} from './src/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        name: APP_NAME,
        description: APP_DESCRIPTION,
        downloadURL: DOWNLOAD_URL,
        updateURL: UPDATE_URL,
        version: APP_VERSION,
        author: APP_AUTHOR,
        icon: 'https://tinygrail.com/favicon.ico',
        namespace: 'https://github.com/koorinyaa/tinygrail-magic',
        match: ['*://*.bgm.tv/*', '*://*.bangumi.tv/*', '*://*.chii.in/*'],
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
    },
  },
});
