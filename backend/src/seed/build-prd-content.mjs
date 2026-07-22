#!/usr/bin/env node
/**
 * Merges PRD extension content into backend/src/seed/content.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentPath = path.join(__dirname, 'content.json');
const extDir = path.join(__dirname, 'extensions');

const REMOVED_SERVICE_SLUGS = new Set(['industrial-flooring', 'facade-restoration']);

function withoutRemovedServices(items) {
  return (items || []).filter((item) => !REMOVED_SERVICE_SLUGS.has(item.slug));
}

function loadJson(name) {
  const file = path.join(extDir, name);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const base = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

const problems = loadJson('problems.json') || [];
const knowledgeArticles = loadJson('knowledge-articles.json') || [];
const additionalServices = loadJson('additional-services.json') || { services: [], servicePages: [] };
const prdOverrides = loadJson('prd-overrides.json') || {};
const servicePatches = loadJson('service-patches.json') || {};
const conversionPhase = loadJson('conversion-phase.json') || {};
const conversionKnowledge = loadJson('conversion-knowledge.json') || [];

const merged = {
  ...base,
  ...prdOverrides,
  hero: { ...base.hero, ...(prdOverrides.hero || {}), ...(conversionPhase.hero || {}) },
  homeSections: {
    ...base.homeSections,
    ...(prdOverrides.homeSections || {}),
    ...(conversionPhase.homeSections || {}),
  },
  meta: { ...base.meta, ...(prdOverrides.meta || {}) },
  contact: { ...base.contact, ...(conversionPhase.contact || {}) },
  problems,
  industries: [],
  knowledgeArticles,
  problemCategories: prdOverrides.problemCategories || [],
  homeProblemGrid: prdOverrides.homeProblemGrid || null,
  doctorPositioning: prdOverrides.doctorPositioning || null,
};

if (conversionPhase.googleReviewsData) merged.googleReviewsData = conversionPhase.googleReviewsData;
delete merged.testimonials;
if (merged.homeSections) delete merged.homeSections.testimonials;
if (conversionPhase.homeownerFaq) merged.homeownerFaq = conversionPhase.homeownerFaq;
if (conversionPhase.contactTeaser) merged.contactTeaser = conversionPhase.contactTeaser;

if (conversionPhase.navMore) {
  merged.navMore = conversionPhase.navMore;
}

delete merged.servicesHome;

if (additionalServices.services?.length) {
  const slugs = new Set(merged.services.map((s) => s.slug));
  for (const svc of additionalServices.services) {
    if (REMOVED_SERVICE_SLUGS.has(svc.slug) || slugs.has(svc.slug)) continue;
    merged.services.push(svc);
  }
  merged.services.sort((a, b) => String(a.code).localeCompare(String(b.code)));
}

merged.services = withoutRemovedServices(merged.services);

for (const svc of merged.services) {
  delete svc.audience;
}

if (conversionKnowledge.length) {
  const slugs = new Set(merged.knowledgeArticles.map((a) => a.slug));
  for (const article of conversionKnowledge) {
    if (!slugs.has(article.slug)) merged.knowledgeArticles.push(article);
  }
}

if (additionalServices.servicePages?.length) {
  const slugs = new Set((merged.servicePages || []).map((p) => p.slug));
  merged.servicePages = merged.servicePages || [];
  for (const page of additionalServices.servicePages) {
    if (REMOVED_SERVICE_SLUGS.has(page.slug) || slugs.has(page.slug)) continue;
    merged.servicePages.push(page);
  }
}

merged.servicePages = withoutRemovedServices(merged.servicePages);

for (const page of merged.servicePages || []) {
  const patch = servicePatches[page.slug];
  if (!patch) continue;
  if (patch.sections) page.sections = patch.sections;
  if (patch.awareness) page.awareness = { ...page.awareness, ...patch.awareness };
  if (patch.intro) page.intro = patch.intro;
  if (patch.headline) page.headline = patch.headline;
}

if (additionalServices.projects?.length) {
  merged.projects = additionalServices.projects;
}

fs.writeFileSync(contentPath, `${JSON.stringify(merged, null, 2)}\n`);
console.log('[prd-content] merged', {
  problems: problems.length,
  knowledgeArticles: merged.knowledgeArticles.length,
  services: merged.services.length,
  servicePages: merged.servicePages.length,
  projects: merged.projects.length,
  googleReviews: merged.googleReviewsData?.rating ? 1 : 0,
});
