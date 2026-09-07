import { useEffect, useState } from 'react';
import { contentApiUrl, contentBootstrapKey } from '../lib/i18n';

function readBootstrap(locale) {
  if (typeof window !== 'undefined') {
    const key = contentBootstrapKey(locale);
    if (window[key]) return window[key];
  }
  return null;
}

export default function useContent(locale = 'en') {
  const bootstrap = readBootstrap(locale);
  const [content, setContent] = useState(bootstrap);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!bootstrap);

  useEffect(() => {
    const initial = readBootstrap(locale);
    setContent(initial);
    setLoading(!initial);
    setError(null);

    fetch(contentApiUrl(locale))
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setContent(data);
        const desc = document.querySelector('meta[name="description"]');
        if (desc && data.meta?.description) desc.setAttribute('content', data.meta.description);
        document.documentElement.lang = locale === 'as' ? 'as' : 'en';
      })
      .catch((err) => {
        if (!readBootstrap(locale)) setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [locale]);

  return { content, error, loading };
}
