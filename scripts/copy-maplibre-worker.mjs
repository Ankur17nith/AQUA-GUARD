import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

function copyWorkerFiles() {
  try {
    // 1. Dynamically resolve maplibre-gl package
    let maplibrePackageJsonPath;
    try {
      maplibrePackageJsonPath = require.resolve('maplibre-gl/package.json', {
        paths: [
          path.resolve(__dirname, '../apps/web'),
          path.resolve(__dirname, '..'),
          process.cwd()
        ]
      });
    } catch {
      // Fallback search
      const potentialPaths = [
        path.resolve(__dirname, '../apps/web/node_modules/maplibre-gl/package.json'),
        path.resolve(__dirname, '../node_modules/maplibre-gl/package.json')
      ];
      maplibrePackageJsonPath = potentialPaths.find(p => fs.existsSync(p));
    }

    if (!maplibrePackageJsonPath) {
      console.warn('⚠️ [copy-maplibre-worker] maplibre-gl package not found in node_modules.');
      return;
    }

    const distDir = path.join(path.dirname(maplibrePackageJsonPath), 'dist');
    const targetDir = path.resolve(__dirname, '../apps/web/public/maplibre');

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filesToCopy = [
      'maplibre-gl-worker.mjs',
      'maplibre-gl-shared.mjs',
      'maplibre-gl-worker.mjs.map',
      'maplibre-gl-shared.mjs.map'
    ];

    let copiedCount = 0;
    for (const file of filesToCopy) {
      const srcFile = path.join(distDir, file);
      const destFile = path.join(targetDir, file);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, destFile);
        copiedCount++;
      }
    }

    console.log(`✅ [copy-maplibre-worker] Copied ${copiedCount} MapLibre worker files to apps/web/public/maplibre/`);
  } catch (err) {
    console.error('❌ [copy-maplibre-worker] Error copying worker files:', err);
    process.exit(1);
  }
}

copyWorkerFiles();
