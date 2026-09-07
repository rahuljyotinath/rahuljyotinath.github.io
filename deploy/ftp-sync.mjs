#!/usr/bin/env node
/**
 * Upload files listed in deploy/files-to-upload.txt (from npm run release).
 * Use --full to upload entire release/ without a list file.
 */

import { spawnSync } from 'child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const RELEASE = join(ROOT, 'release');
const ENV_FILE = join(__dirname, '.deploy.env');
const UPLOAD_LIST = join(__dirname, 'files-to-upload.txt');
const LOG_FILE = join(__dirname, 'ftp-upload.log');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const fullUpload = args.includes('--full');

function loadEnv(path) {
  if (!existsSync(path)) {
    console.error(`[ftp] Missing ${path}`);
    console.error('[ftp] Copy deploy/.deploy.env.example → deploy/.deploy.env and fill in FTP credentials.');
    process.exit(1);
  }

  const env = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }

  for (const key of ['FTP_HOST', 'FTP_USER', 'FTP_PASS', 'FTP_REMOTE']) {
    if (!env[key]) {
      console.error(`[ftp] ${key} not set in ${path}`);
      process.exit(1);
    }
  }

  return env;
}

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

function readUploadList() {
  if (!existsSync(UPLOAD_LIST)) {
    console.error('[ftp] Missing deploy/files-to-upload.txt — run: npm run release');
    process.exit(1);
  }

  const lines = readFileSync(UPLOAD_LIST, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    console.log('[ftp] files-to-upload.txt is empty — nothing to upload');
    process.exit(0);
  }

  return lines;
}

function encodeFtpPath(relPath) {
  return relPath.split('/').map((segment) => encodeURIComponent(segment)).join('/');
}

function buildFtpUrl(host, remoteBase, relPath) {
  const encoded = encodeFtpPath(relPath);
  const remote = remoteBase.replace(/^\/+|\/+$/g, '');
  return `ftp://${host}/${remote}/${encoded}`;
}

function uploadFile(localPath, ftpUrl, auth) {
  const result = spawnSync(
    'curl',
    [
      '-sS',
      '--connect-timeout',
      '30',
      '--max-time',
      '600',
      '--ftp-pasv',
      '--ftp-create-dirs',
      '-u',
      auth,
      '-T',
      localPath,
      ftpUrl,
    ],
    { encoding: 'utf8' },
  );

  return result.status === 0 ? null : (result.stderr || result.stdout || 'curl failed').trim();
}

function main() {
  if (!existsSync(RELEASE)) {
    console.error('[ftp] release/ missing — run: npm run release');
    process.exit(1);
  }

  const env = loadEnv(ENV_FILE);
  const { FTP_HOST, FTP_USER, FTP_PASS, FTP_REMOTE } = env;
  const auth = `${FTP_USER}:${FTP_PASS}`;

  const relFiles = fullUpload ? walkFiles(RELEASE) : readUploadList();
  const source = fullUpload ? 'release/ (full)' : 'files-to-upload.txt';

  console.log(
    `[ftp] ${dryRun ? 'dry-run' : 'upload'} — ${relFiles.length} files from ${source} → ${FTP_HOST}/${FTP_REMOTE}`,
  );

  let uploaded = 0;
  let failed = 0;
  const logLines = [];

  for (const rel of relFiles) {
    const abs = join(RELEASE, rel);
    if (!existsSync(abs)) {
      failed += 1;
      console.error(`  FAIL ${rel}: not found in release/`);
      logLines.push(`FAIL ${rel}: not found in release/`);
      continue;
    }

    if (dryRun) {
      console.log(`  upload ${rel}`);
      uploaded += 1;
      continue;
    }

    const ftpUrl = buildFtpUrl(FTP_HOST, FTP_REMOTE, rel);
    const err = uploadFile(abs, ftpUrl, auth);

    if (err) {
      failed += 1;
      console.error(`  FAIL ${rel}: ${err}`);
      logLines.push(`FAIL ${rel}: ${err}`);
    } else {
      uploaded += 1;
      logLines.push(`OK ${rel}`);
    }
  }

  if (!dryRun) {
    writeFileSync(LOG_FILE, `${logLines.join('\n')}\n`);
  }

  console.log(`[ftp] done — uploaded=${uploaded} failed=${failed}`);
  if (!dryRun) {
    console.log('[ftp] log: deploy/ftp-upload.log');
  }

  if (failed > 0) process.exit(1);
}

main();
