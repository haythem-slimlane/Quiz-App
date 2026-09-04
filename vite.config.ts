import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const serveBinaryAssets = (): Plugin => ({
  name: 'serve-binary-assets',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url?.split('?')[0] || '';
      if (url.endsWith('.apk') || url.endsWith('.zip')) {
        const fileName = path.basename(url);
        const filePath = path.join(process.cwd(), 'public', fileName);
        if (fs.existsSync(filePath)) {
          const contentType = url.endsWith('.apk') 
            ? 'application/vnd.android.package-archive' 
            : 'application/zip';
          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
          const stat = fs.statSync(filePath);
          res.setHeader('Content-Length', stat.size);
          fs.createReadStream(filePath).pipe(res);
          return;
        }
      }
      next();
    });
  },
});

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), serveBinaryAssets()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
