import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        name: 'Tinygrail Magic',
        version: '0.0.1',
        author: 'koorinyaa',
        description: '全新的小圣杯界面',
        icon: 'https://tinygrail.com/favicon.ico',
        namespace: 'tinygrail-magic',
        match: [
          'https://bgm.tv/*',
          'https://bangumi.tv/*',
          'https://chii.in/*',
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
