#!/usr/bin/env node
/**
 * Recursively delete a path under FTP remote (e.g. as).
 * Usage: node deploy/ftp-delete-remote.mjs as
 */
import { spawnSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_FILE = join(__dirname, '.deploy.env');
const remoteSubpath = process.argv[2]?.replace(/^\/+|\/+$/g, '');

if (!remoteSubpath) {
  console.error('Usage: node deploy/ftp-delete-remote.mjs <remote-subpath>');
  process.exit(1);
}

function loadEnv() {
  if (!existsSync(ENV_FILE)) {
    console.error('[ftp-delete] Missing deploy/.deploy.env');
    process.exit(1);
  }
  const env = {};
  for (const line of readFileSync(ENV_FILE, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

function curlQuote(auth, baseUrl, quote) {
  const r = spawnSync('curl', ['-sS', '-u', auth, '-Q', quote, baseUrl], { encoding: 'utf8' });
  if (r.status !== 0) {
    const msg = (r.stderr || r.stdout || '').trim();
    throw new Error(msg || 'curl failed');
  }
}

function listDir(auth, baseUrl, subpath) {
  const url = `${baseUrl}/${subpath.split('/').filter(Boolean).map(encodeURIComponent).join('/')}/`;
  const r = spawnSync('curl', ['-sS', '-u', auth, '--list-only', url], { encoding: 'utf8' });
  if (r.status !== 0) return [];
  return r.stdout
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && l !== '.' && l !== '..');
}

function isLikelyFile(name) {
  return name.includes('.');
}

function deleteRemote(auth, baseUrl, subpath) {
  const entries = listDir(auth, baseUrl, subpath);
  for (const name of entries) {
    const child = `${subpath}/${name}`.replace(/\/+/g, '/');
    if (isLikelyFile(name)) {
      curlQuote(auth, baseUrl, `DELE ${child}`);
      console.log('[ftp-delete] DELE', child);
    } else {
      deleteRemote(auth, baseUrl, child);
      try {
        curlQuote(auth, baseUrl, `RMD ${child}`);
        console.log('[ftp-delete] RMD', child);
      } catch (err) {
        console.warn('[ftp-delete] skip RMD', child, err.message);
      }
    }
  }
}

const env = loadEnv();
const auth = `${env.FTP_USER}:${env.FTP_PASS}`;
const remote = env.FTP_REMOTE.replace(/^\/+|\/+$/g, '');
const baseUrl = `ftp://${env.FTP_HOST}/${remote}`;

console.log(`[ftp-delete] removing ${remote}/${remoteSubpath}`);
try {
  deleteRemote(auth, baseUrl, remoteSubpath);
  curlQuote(auth, baseUrl, `RMD ${remoteSubpath}`);
  console.log('[ftp-delete] RMD', remoteSubpath);
} catch (err) {
  console.warn('[ftp-delete] final RMD:', err.message);
}
console.log('[ftp-delete] done');
