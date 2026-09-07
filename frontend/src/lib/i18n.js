export const DEFAULT_LOCALE = 'en';
export const SUPPORTED_LOCALES = ['en', 'as'];

export const LOCALE_LABELS = {
  en: 'English',
  as: 'অসমীয়া',
};

export function getLocaleFromPathname(pathname) {
  if (pathname === '/as' || pathname.startsWith('/as/')) return 'as';
  return 'en';
}

export function stripLocalePrefix(pathname) {
  if (pathname === '/as') return '/';
  if (pathname.startsWith('/as/')) return pathname.slice(3) || '/';
  return pathname;
}

export function localizedPath(path, locale = DEFAULT_LOCALE) {
  const hashIndex = path.indexOf('#');
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : '';
  const pathOnly = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const base = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
  if (locale === 'en') return `${base}${hash}`;
  if (base === '/') return `/as${hash}`;
  return `/as${base}${hash}`;
}

export function alternateLocalePath(pathname, targetLocale) {
  const bare = stripLocalePrefix(pathname);
  return localizedPath(bare, targetLocale);
}

export function contentBootstrapKey(locale) {
  return locale === 'as' ? '__CONTENT_AS__' : '__CONTENT__';
}

export function contentApiUrl(locale) {
  return locale === 'as' ? '/api/content?lang=as' : '/api/content';
}

export function htmlLang(locale) {
  return locale === 'as' ? 'as' : 'en';
}
