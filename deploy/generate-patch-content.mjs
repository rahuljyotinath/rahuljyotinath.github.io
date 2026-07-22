#!/usr/bin/env node
/**
 * Writes deploy/patch-content-main.sql — UPDATE only for phpMyAdmin import.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentPath = path.join(__dirname, '../backend/src/seed/content.json');
const outPath = path.join(__dirname, 'patch-content-main.sql');

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const jsonRaw = JSON.stringify(content);
const jsonEscaped = jsonRaw.replace(/\\/g, '\\\\').replace(/'/g, "''");

const sql = `-- Run in phpMyAdmin on database yjxgxlqh_91skylineworks (one-time nav sync)
UPDATE site_content SET payload = '${jsonEscaped}' WHERE slug = 'main';
`;

fs.writeFileSync(outPath, sql);
console.log('[patch] wrote', outPath, `(${jsonRaw.length} bytes JSON)`);
