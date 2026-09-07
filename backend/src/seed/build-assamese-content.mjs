#!/usr/bin/env node
/**
 * Builds backend/src/seed/content.as.json from content.json.
 * Uses cached string translations in assamese/string-cache.json.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedDir = __dirname;
const enPath = path.join(seedDir, 'content.json');
const outPath = path.join(seedDir, 'content.as.json');
const cachePath = path.join(seedDir, 'assamese/string-cache.json');
const uiPath = path.join(seedDir, 'assamese/ui.json');

const REQUEST_DELAY_MS = 1500;
const MAX_RETRIES = 5;
const SAVE_EVERY = 10;

const SKIP_KEYS = new Set([
  'slug',
  'href',
  'image',
  'logo',
  'url',
  'code',
  'year',
  'rating',
  'phone',
  'email',
  'suffix',
  'value',
  'step',
  'featured',
  'reviewCount',
  'lat',
  'lng',
  'mag',
  'depth',
  'time',
  'cluster',
  'category',
  'linkedProject',
  'linkedServices',
  'linkedProblems',
  'services',
  'problemGrid',
  'doctorPositioning',
  'serviceSchemaName',
  'seoTitle',
]);

const SKIP_STRING = /^(https?:|\/|images\/|\+?\d|[^\s]+@[^\s]+\.[^\s]+)/;

const KEEP_ENGLISH = new Set([
  'HPCL',
  'NEDFi',
  'NEEDP (2023)',
  'GHY-01 (SILPUKHURI)',
  '91SkylineWorks',
  '91SkylineWorks Private Limited',
  'NDT',
  'PU',
  'CFRP',
  'USGS',
  'IS',
  'RWA',
  'AC',
  'BHK',
  'GST',
  'MSME',
]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadJson(file, fallback = {}) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function shouldKeepEnglish(text) {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (KEEP_ENGLISH.has(trimmed)) return true;
  if (trimmed.length <= 3) return true;
  if (/^[A-Z0-9][A-Z0-9()./\s-]{0,48}$/.test(trimmed) && /[A-Z]{2,}/.test(trimmed) && trimmed.split(/\s+/).length <= 6) {
    return true;
  }
  return false;
}

function isTranslated(original, translated) {
  return translated && translated !== original;
}

async function translateChunk(text, cache) {
  if (cache[text] && isTranslated(text, cache[text])) return cache[text];
  if (shouldKeepEnglish(text)) {
    cache[text] = text;
    return text;
  }

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|as`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    const res = await fetch(url);

    if (res.status === 429) {
      const waitMs = Math.min(120000, 15000 * attempt);
      console.warn(`[as-content] rate limited — waiting ${Math.round(waitMs / 1000)}s (retry ${attempt}/${MAX_RETRIES})`);
      await sleep(waitMs);
      continue;
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const detail = data.responseDetails || '';

    if (detail.includes('QUERY LENGTH LIMIT') || data.responseStatus === 403) {
      throw new Error(detail || 'query rejected');
    }

    if (data.responseStatus !== 200 || !data.responseData?.translatedText) {
      throw new Error(detail || 'translate failed');
    }

    cache[text] = data.responseData.translatedText;
    return cache[text];
  }

  throw new Error('HTTP 429');
}

async function translateOne(text, cache) {
  if (cache[text] && (shouldKeepEnglish(text) || isTranslated(text, cache[text]))) {
    return cache[text];
  }

  if (text.length <= 450) {
    return translateChunk(text, cache);
  }

  const parts = text.match(/[^.!?]+[.!?]?/g) || [text];
  const translated = [];
  for (const part of parts) {
    const chunk = part.trim();
    if (!chunk) continue;
    if (chunk.length <= 450) {
      translated.push(await translateChunk(chunk, cache));
      await sleep(REQUEST_DELAY_MS);
    } else {
      translated.push(chunk);
    }
  }
  cache[text] = translated.join(' ').trim();
  return cache[text];
}

async function translateBatch(strings, cache) {
  const pending = strings.filter((s) => !cache[s] || cache[s] === s);
  console.log('[as-content] translating', pending.length, 'strings...');

  let failed = 0;

  for (let i = 0; i < pending.length; i += 1) {
    const text = pending[i];
    try {
      await translateOne(text, cache);
      if ((i + 1) % SAVE_EVERY === 0) {
        saveJson(cachePath, cache);
        console.log('[as-content] progress', i + 1, '/', pending.length);
      }
      await sleep(REQUEST_DELAY_MS);
    } catch (err) {
      failed += 1;
      console.warn('[as-content] skipped for retry later:', text.slice(0, 60), err.message);
      delete cache[text];
      await sleep(5000);
    }
  }

  if (failed) {
    console.warn('[as-content]', failed, 'strings not translated — re-run script to continue');
  }

  return cache;
}

function collectStrings(node, out = new Set(), key = '') {
  if (typeof node === 'string') {
    if (!node.trim() || SKIP_STRING.test(node) || SKIP_KEYS.has(key)) return out;
    if (node.length > 4000) return out;
    out.add(node);
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((item) => collectStrings(item, out, key));
    return out;
  }
  if (node && typeof node === 'object') {
    Object.entries(node).forEach(([k, v]) => collectStrings(v, out, k));
  }
  return out;
}

function applyTranslations(node, cache, key = '') {
  if (typeof node === 'string') {
    if (!node.trim() || SKIP_STRING.test(node) || SKIP_KEYS.has(key)) return node;
    if (node.length > 4000) return node;
    return cache[node] || node;
  }
  if (Array.isArray(node)) return node.map((item) => applyTranslations(item, cache, key));
  if (node && typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node).map(([k, v]) => [k, applyTranslations(v, cache, k)]),
    );
  }
  return node;
}

function deepMerge(base, overlay) {
  if (Array.isArray(base) && Array.isArray(overlay)) {
    return base.map((item, i) => {
      const over = overlay[i];
      if (over && typeof item === 'object' && typeof over === 'object') return deepMerge(item, over);
      return over ?? item;
    });
  }
  if (base && typeof base === 'object' && overlay && typeof overlay === 'object' && !Array.isArray(base)) {
    const out = { ...base };
    for (const [k, v] of Object.entries(overlay)) {
      out[k] = k in base ? deepMerge(base[k], v) : v;
    }
    return out;
  }
  return overlay ?? base;
}

async function main() {
  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const ui = loadJson(uiPath, null);
  let cache = loadJson(cachePath, {});

  const strings = [...collectStrings(en)];
  const done = strings.filter((s) => cache[s] && (shouldKeepEnglish(s) || isTranslated(s, cache[s]))).length;
  console.log('[as-content] strings total:', strings.length, 'done:', done, 'remaining:', strings.length - done);

  cache = await translateBatch(strings, cache);
  saveJson(cachePath, cache);

  let as = applyTranslations(structuredClone(en), cache);
  if (ui) as = deepMerge(as, ui);
  as.locale = 'as';

  saveJson(outPath, as);

  const translated = strings.filter((s) => cache[s] && isTranslated(s, cache[s])).length;
  console.log('[as-content] wrote', outPath, `(${translated}/${strings.length} translated)`);
}

main().catch((err) => {
  console.error('[as-content] fatal:', err);
  process.exit(1);
});
