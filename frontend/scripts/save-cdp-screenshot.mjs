#!/usr/bin/env node
/** Decode CDP Page.captureScreenshot JSON -> PNG + WebP */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';

const [jsonPath, outBase] = process.argv.slice(2);
if (!jsonPath || !outBase) {
  console.error('Usage: save-cdp-screenshot.mjs <cdp.json> <out-base-without-ext>');
  process.exit(1);
}

const raw = JSON.parse(readFileSync(jsonPath, 'utf8'));
const b64 = raw.data ?? raw.result?.data;
if (!b64) {
  console.error('No screenshot data in', jsonPath);
  process.exit(1);
}

const pngPath = `${outBase}.png`;
writeFileSync(pngPath, Buffer.from(b64, 'base64'));
execSync(`cwebp -q 85 "${pngPath}" -o "${outBase}.webp"`, { stdio: 'inherit' });
console.log('Wrote', pngPath, `${outBase}.webp`);
