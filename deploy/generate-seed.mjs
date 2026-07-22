#!/usr/bin/env node
/**
 * Generates deploy/seed.sql from backend/src/seed/content.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const contentPath = path.join(root, 'backend/src/seed/content.json');
const schemaPath = path.join(__dirname, 'schema.sql');
const outPath = path.join(__dirname, 'seed.sql');

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const schema = fs.readFileSync(schemaPath, 'utf8');
const jsonRaw = JSON.stringify(content);
const jsonEscaped = jsonRaw.replace(/\\/g, '\\\\').replace(/'/g, "''");

function unescapeSqlJson(escaped) {
  return escaped.replace(/''/g, "'").replace(/\\\\/g, '\\');
}

function validateSeedSql(seed) {
  const match = seed.match(/VALUES \('main', '([\s\S]*)'\)\s*\nON DUPLICATE/s);
  if (!match) {
    console.error('[seed] ERROR: could not parse INSERT payload from seed.sql');
    process.exit(1);
  }
  try {
    JSON.parse(unescapeSqlJson(match[1]));
  } catch (err) {
    console.error('[seed] ERROR: INSERT payload is not valid JSON after SQL unescape:', err.message);
    process.exit(1);
  }
}

const seed = `${schema}
INSERT INTO site_content (slug, payload) VALUES ('main', '${jsonEscaped}')
ON DUPLICATE KEY UPDATE payload = VALUES(payload);
`;

validateSeedSql(seed);
fs.writeFileSync(outPath, seed);
console.log('[seed] wrote', outPath, `(${jsonRaw.length} bytes JSON, validated)`);
