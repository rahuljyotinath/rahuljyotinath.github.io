#!/usr/bin/env node
/**
 * Compress hero/logo assets in public/images before Vite build.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '../public/images');

async function optimizeHero() {
  const sources = ['hero.jpg', 'hero.png', 'hero.webp'].map((name) => path.join(imagesDir, name));
  const input = sources.find((candidate) => fs.existsSync(candidate));
  if (!input) {
    console.warn('[images] hero source not found — skipping');
    return;
  }

  const pipeline = sharp(input).rotate().resize({ width: 1600, withoutEnlargement: true });
  const webpOut = path.join(imagesDir, 'hero.webp');
  const jpgOut = path.join(imagesDir, 'hero.jpg');
  const jpgTemp = path.join(imagesDir, 'hero.optim.jpg');

  await pipeline.clone().webp({ quality: 82, effort: 4 }).toFile(webpOut);
  await pipeline.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(jpgTemp);
  fs.renameSync(jpgTemp, jpgOut);

  const webpStat = fs.statSync(webpOut);
  const jpgStat = fs.statSync(jpgOut);
  console.log(`[images] hero.webp ${(webpStat.size / 1024).toFixed(1)} KiB, hero.jpg ${(jpgStat.size / 1024).toFixed(1)} KiB`);
}

async function optimizeLogo() {
  const sources = ['logo.png', 'logo.jpg', 'logo.jpeg'].map((name) => path.join(imagesDir, name));
  const input = sources.find((candidate) => fs.existsSync(candidate));
  if (!input) {
    console.warn('[images] logo source not found — skipping');
    return;
  }

  const pipeline = sharp(input).rotate().resize({ width: 240, withoutEnlargement: true });
  const webpOut = path.join(imagesDir, 'logo.webp');
  const pngOut = path.join(imagesDir, 'logo.png');
  const pngTemp = path.join(imagesDir, 'logo.optim.png');

  await pipeline.clone().webp({ quality: 85 }).toFile(webpOut);
  await pipeline.clone().png({ compressionLevel: 9 }).toFile(pngTemp);
  fs.renameSync(pngTemp, pngOut);

  const webpStat = fs.statSync(webpOut);
  const pngStat = fs.statSync(pngOut);
  console.log(`[images] logo.webp ${(webpStat.size / 1024).toFixed(1)} KiB, logo.png ${(pngStat.size / 1024).toFixed(1)} KiB`);
}

async function optimizeFavicon() {
  const input = path.join(__dirname, '../public/favicon.png');
  if (!fs.existsSync(input)) {
    console.warn('[images] favicon.png not found — skipping');
    return;
  }

  const out = path.join(__dirname, '../public/favicon.png');
  const temp = path.join(__dirname, '../public/favicon.optim.png');

  await sharp(input)
    .rotate()
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(temp);

  fs.renameSync(temp, out);
  const stat = fs.statSync(out);
  console.log(`[images] favicon.png ${(stat.size / 1024).toFixed(1)} KiB`);
}

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

await optimizeHero();
await optimizeLogo();
await optimizeFavicon();
console.log('[images] done');
