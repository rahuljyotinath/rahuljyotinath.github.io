#!/usr/bin/env node
/**
 * After npm run release: hash release/, diff vs last manifest,
 * write deploy/files-to-upload.txt (one path per line).
 */

import { createHash } from 'crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const RELEASE = join(ROOT, 'release');
const MANIFEST_FILE = join(__dirname, '.release-manifest.json');
const LEGACY_MANIFEST = join(__dirname, '.ftp-manifest.json');
const UPLOAD_LIST = join(__dirname, 'files-to-upload.txt');

function walkFiles(dir, base = dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(full, base));
    } else if (entry.isFile()) {
      files.push(relative(base, full).split('\\').join('/'));
    }
  }
  return files.sort();
}

function fileHash(absPath) {
  return createHash('sha256').update(readFileSync(absPath)).digest('hex');
}

/** Vite emits hashed filenames — when index.html changes, sync the whole assets/ tree. */
function assetFilesUnderRelease() {
  const assetsDir = join(RELEASE, 'assets');
  if (!existsSync(assetsDir)) return [];
  return walkFiles(assetsDir, RELEASE);
}

function loadManifest() {
  const path = existsSync(MANIFEST_FILE)
    ? MANIFEST_FILE
    : existsSync(LEGACY_MANIFEST)
      ? LEGACY_MANIFEST
      : null;
  if (!path) return {};
  try {
    const data = JSON.parse(readFileSync(path, 'utf8'));
    return data.files || {};
  } catch {
    return {};
  }
}

function main() {
  if (!existsSync(RELEASE)) {
    console.error('[release] release/ missing — pack release/ before computing upload list');
    process.exit(1);
  }

  const prior = loadManifest();
  const current = {};
  const toUpload = [];

  for (const rel of walkFiles(RELEASE)) {
    const hash = fileHash(join(RELEASE, rel));
    current[rel] = hash;
    if (prior[rel] !== hash) {
      toUpload.push(rel);
    }
  }

  if (toUpload.includes('index.html')) {
    const uploadSet = new Set(toUpload);
    for (const rel of assetFilesUnderRelease()) {
      uploadSet.add(rel);
    }
    toUpload.length = 0;
    toUpload.push(...[...uploadSet].sort());
    console.log('[release] index.html changed — including all assets/ bundles');
  }

  writeFileSync(UPLOAD_LIST, toUpload.length ? `${toUpload.join('\n')}\n` : '');
  writeFileSync(MANIFEST_FILE, `${JSON.stringify({ files: current }, null, 2)}\n`);

  console.log(
    `[release] ${toUpload.length} file${toUpload.length === 1 ? '' : 's'} to upload → deploy/files-to-upload.txt`,
  );
  if (toUpload.length === 0) {
    console.log('[release] nothing changed since last release — upload will be a no-op');
  }
}

main();
