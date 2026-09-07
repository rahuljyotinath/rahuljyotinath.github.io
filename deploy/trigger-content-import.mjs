#!/usr/bin/env node
/**
 * One-shot remote content import via FTP token patch + HTTP import-content.php.
 * Usage: node deploy/trigger-content-import.mjs
 */
import crypto from 'crypto';
import fs from 'fs';
import { spawnSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_FILE = join(__dirname, '.deploy.env');
const TMP = join(__dirname, '.server-config.php.tmp');

function loadEnv() {
  const env = {};
  for (const line of fs.readFileSync(ENV_FILE, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  for (const key of ['FTP_HOST', 'FTP_USER', 'FTP_PASS', 'FTP_REMOTE']) {
    if (!env[key]) throw new Error(`${key} missing in .deploy.env`);
  }
  return env;
}

function curl(args) {
  const r = spawnSync('curl', args, { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(r.stderr || r.stdout || 'curl failed');
  return r.stdout;
}

function main() {
  const env = loadEnv();
  const auth = `${env.FTP_USER}:${env.FTP_PASS}`;
  const remote = env.FTP_REMOTE.replace(/^\/+|\/+$/g, '');
  const configUrl = `ftp://${env.FTP_HOST}/${remote}/api/config.php`;

  const cfg = curl(['-sS', '-u', auth, configUrl]);
  fs.writeFileSync(TMP, cfg);
  const orig = cfg;

  const token = crypto.randomBytes(24).toString('hex');
  let patched = cfg.replace(
    /content_import_token'\s*=>\s*'[^']*'/,
    `content_import_token' => '${token}'`,
  );
  if (patched === cfg) {
    patched = cfg.replace(/\];\s*$/, `    'content_import_token' => '${token}',\n];\n`);
  }
  fs.writeFileSync(TMP, patched);
  curl(['-sS', '-u', auth, '-T', TMP, configUrl]);

  const result = curl(['-sS', `https://91skylineworks.com/api/import-content.php?token=${token}`]);
  console.log('[import]', result.trim());

  const cleared = patched.replace(/content_import_token'\s*=>\s*'[^']*'/, "content_import_token' => ''");
  fs.writeFileSync(TMP, cleared);
  curl(['-sS', '-u', auth, '-T', TMP, configUrl]);
  fs.unlinkSync(TMP);
  console.log('[import] token cleared on server');
}

try {
  main();
} catch (err) {
  if (fs.existsSync(TMP)) fs.unlinkSync(TMP);
  console.error('[import]', err.message);
  process.exit(1);
}
