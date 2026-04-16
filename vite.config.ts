import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import pkg from './package.json' with { type: 'json' };

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(/%ICON_URL%/g, pkg.config.icon_url);
        },
      },
    ],
    define: {
      '__API_ENDPOINT__': JSON.stringify(pkg.config.api_endpoint),
      '__ICON_URL__': JSON.stringify(pkg.config.icon_url),
      '__ADFS_PROVIDER_ENDPOINT__': JSON.stringify(pkg.config.adfs_provider_endpoint),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
