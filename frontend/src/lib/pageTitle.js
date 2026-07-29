const TITLE_MAX = 60;
const BRAND_SUFFIX = ' | 91SkylineWorks';

export function buildPageTitle(headline, seoTitle) {
  const base = seoTitle || headline;
  if (!base) return '91SkylineWorks';
  const full = base + BRAND_SUFFIX;
  if (full.length <= TITLE_MAX) return full;
  const trimAt = TITLE_MAX - BRAND_SUFFIX.length - 1;
  return `${base.slice(0, trimAt).trim()}…${BRAND_SUFFIX}`;
}

export function buildKnowledgePageTitle(article) {
  if (!article) return 'Article';
  return buildPageTitle(article.title, article.seoTitle);
}

export function buildServicePageTitle(page) {
  if (!page) return 'Service';
  return buildPageTitle(page.title, page.seoTitle);
}

export function buildProblemPageTitle(problem) {
  if (!problem) return 'Problem';
  return buildPageTitle(problem.title, problem.seoTitle);
}

export function buildCategoryPageTitle(category) {
  if (!category) return 'Services';
  return buildPageTitle(`${category.label} services in Guwahati`, category.seoTitle);
}

export function buildLocalLandingPageTitle(landing) {
  if (!landing) return 'Guwahati';
  return buildPageTitle(landing.headline, landing.seoTitle);
}
