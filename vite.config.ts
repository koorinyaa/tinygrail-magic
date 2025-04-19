import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        name: 'Tinygrail Magic',
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
        externalGlobals: {
          // react: cdn.jsdelivr('React', 'umd/react.production.min.js'),
          // 'react-dom': cdn.jsdelivr('ReactDOM', 'umd/react-dom.production.min.js'),
        },
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
