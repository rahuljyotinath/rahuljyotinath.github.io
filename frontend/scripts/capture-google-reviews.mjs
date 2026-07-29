#!/usr/bin/env node
/**
 * Capture Google Maps review cards as single-review WebPs.
 * Requires Chrome with remote debugging on port 9222.
 *
 * Usage: node frontend/scripts/capture-google-reviews.mjs
 */
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const OUT = join(ROOT, 'frontend/public/images/reviews');
const MAPS_URL = 'https://maps.app.goo.gl/ogPYnKhJLep1R5hD9';

const REVIEWS = [
  { index: 0, slug: 'review-karanjal-das', author: 'Karanjal Das' },
  { index: 1, slug: 'review-rupjyoti-barkataki', author: 'Rupjyoti Barkataki' },
  { index: 2, slug: 'review-sthapana-sharma', author: 'Sthapana Sharma' },
  { index: 3, slug: 'review-tanushree-basnet', author: 'tanushree basnet' },
  { index: 5, slug: 'review-swayam-prava', author: 'swayam prava' },
];

async function cdp(method, params = {}) {
  const res = await fetch(`http://127.0.0.1:9222/json/version`).catch(() => null);
  if (!res?.ok) throw new Error('Chrome not on :9222. Start with: /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222');
  const tabs = await fetch('http://127.0.0.1:9222/json/list').then((r) => r.json());
  let tab = tabs.find((t) => t.type === 'page' && t.url.includes('google.com/maps'));
  if (!tab) {
    tab = await fetch('http://127.0.0.1:9222/json/new?' + encodeURIComponent(MAPS_URL)).then((r) => r.json());
    await sleep(4000);
  }
  const ws = tab.webSocketDebuggerUrl;
  return cdpSession(ws, method, params);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function cdpSession(wsUrl, method, params) {
  return new Promise((resolve, reject) => {
    import('ws').then(({ default: WebSocket }) => {
      const ws = new WebSocket(wsUrl);
      const id = 1;
      ws.on('open', () => {
        ws.send(JSON.stringify({ id, method, params }));
      });
      ws.on('message', (raw) => {
        const msg = JSON.parse(String(raw));
        if (msg.id === id) {
          ws.close();
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      });
      ws.on('error', reject);
    }).catch(reject);
  });
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  console.error('This script needs ws package and Chrome CDP. Use browser MCP capture instead.');
  process.exit(1);
}

main();
