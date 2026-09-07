#!/usr/bin/env node
/**
 * Verify live GTM prerequisites (sitemap, key URLs, NAP, competitive content).
 * Usage: node deploy/verify-gtm.mjs
 */
import { spawnSync } from 'child_process';

const BASE = 'https://91skylineworks.com';

function curl(args) {
  const r = spawnSync('curl', ['-sS', ...args], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(r.stderr || r.stdout || 'curl failed');
  return r.stdout;
}

function head(url) {
  const r = spawnSync('curl', ['-sS', '-o', '/dev/null', '-w', '%{http_code}|%{content_type}', url], {
    encoding: 'utf8',
  });
  const [code, type] = (r.stdout || '').trim().split('|');
  return { code: Number(code), type: type || '' };
}

const checks = [];
function ok(name, pass, detail = '') {
  checks.push({ name, pass, detail });
  console.log(`${pass ? 'OK' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
}

try {
  const sitemap = curl([`${BASE}/sitemap.xml`]);
  const urlCount = (sitemap.match(/<loc>/g) || []).length;
  const hasAs = sitemap.includes('/as/');
  ok('sitemap reachable', urlCount >= 80, `${urlCount} URLs`);
  ok('sitemap no /as/', !hasAs);

  for (const path of [
    '/guwahati/waterproofing/',
    '/guwahati/building-crack-repair/',
    '/contact/',
    '/portfolio/',
    '/services/waterproofing/',
    '/about/',
  ]) {
    const { code, type } = head(`${BASE}${path}`);
    ok(`page ${path}`, code === 200, `${code} ${type.split(';')[0]}`);
  }

  const css = head(`${BASE}/assets/index-CjY0as1D.css`);
  ok('css assets', css.code === 200 && css.type.includes('text/css'), `${css.code}`);

  const js = head(`${BASE}/assets/index-Bgr_gttR.js`);
  ok('js assets', js.code === 200 && js.type.includes('javascript'), `${js.code}`);

  const content = JSON.parse(curl([`${BASE}/api/content`]));
  ok('diagnosisPack live', Boolean(content.diagnosisPack));
  ok('case studies', (content.projects || []).filter((p) => p.caseStudy).length >= 6);
  ok('waterproofing warranty', Boolean((content.servicePages || []).find((s) => s.slug === 'waterproofing')?.warranty));
  ok('inspection SLA', Boolean(content.inspectionSla?.headline || content.homepage?.inspectionCta?.slaNote));

  const home = curl([`${BASE}/`]);
  ok('NAP phone', home.includes('+91 60038 79490'));
  ok('NAP address', home.includes('Silpukhuri'));
  ok('canonical domain', home.includes('https://91skylineworks.com'));

  const failed = checks.filter((c) => !c.pass);
  console.log(`\n[verify] ${checks.length - failed.length}/${checks.length} passed`);
  if (failed.length) process.exit(1);
} catch (err) {
  console.error('[verify]', err.message);
  process.exit(1);
}
