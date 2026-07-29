#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../public/images/reviews');

const MAP = [
  ['review-karanjal-das', process.argv[2]],
  ['review-rupjyoti-barkataki', process.argv[3]],
  ['review-sthapana-sharma', process.argv[4]],
  ['review-tanushree-basnet', process.argv[5]],
  ['review-swayam-prava', process.argv[6]],
];

for (const [slug, jsonPath] of MAP) {
  if (!jsonPath) {
    console.error('Missing path for', slug);
    process.exit(1);
  }
  const raw = readFileSync(jsonPath, 'utf8');
  const payload = JSON.parse(raw);
  const b64 = payload.data ?? payload.result?.data;
  if (!b64) {
    console.error('No data in', jsonPath);
    process.exit(1);
  }
  const png = join(OUT, `${slug}.png`);
  const webp = join(OUT, `${slug}.webp`);
  writeFileSync(png, Buffer.from(b64, 'base64'));
  execSync(`cwebp -q 85 "${png}" -o "${webp}"`, { stdio: 'inherit' });
  console.log(slug, webp);
}
