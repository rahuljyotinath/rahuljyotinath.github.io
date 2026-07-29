#!/usr/bin/env node
/**
 * Convert Screenshot uploads → review-*.webp (format only; no resize/crop/edit).
 * Original screenshots are kept untouched.
 * Usage: node scripts/process-review-uploads.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '../public/images/reviews');

// Sorted screenshot → slug (verify author in screenshot before changing order)
const MAP = [
  ['Screenshot 2026-07-23 at 09.06.50.png', 'review-karanjal-das'],
  ['Screenshot 2026-07-23 at 09.06.59.png', 'review-rupjyoti-barkataki'],
  ['Screenshot 2026-07-23 at 09.07.10.png', 'review-sthapana-sharma'],
  ['Screenshot 2026-07-23 at 09.07.18.png', 'review-tanushree-basnet'],
  ['Screenshot 2026-07-23 at 09.07.26.png', 'review-swayam-prava'],
  ['Screenshot 2026-07-23 at 09.07.35.png', 'review-amit-nath'],
  ['Screenshot 2026-07-23 at 09.07.45.png', 'review-manasi-bora'],
  ['Screenshot 2026-07-23 at 09.07.55.png', 'review-ravi-ranjan'],
];

for (const [srcName, slug] of MAP) {
  const src = path.join(dir, srcName);
  if (!fs.existsSync(src)) {
    console.warn(`[reviews] missing: ${srcName}`);
    continue;
  }
  const webpOut = path.join(dir, `${slug}.webp`);
  const inMeta = await sharp(src).metadata();
  await sharp(src).webp({ quality: 85, effort: 4 }).toFile(webpOut);
  const outMeta = await sharp(webpOut).metadata();
  console.log(
    `[reviews] ${srcName} → ${slug}.webp ${inMeta.width}x${inMeta.height} → ${outMeta.width}x${outMeta.height}`,
  );
}

console.log('[reviews] done — screenshots kept');
