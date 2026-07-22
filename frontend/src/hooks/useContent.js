import { useEffect, useState } from 'react';

function readBootstrap() {
  if (typeof window !== 'undefined' && window.__CONTENT__) {
    return window.__CONTENT__;
  }
  return null;
}

export default function useContent() {
  const bootstrap = readBootstrap();
  const [content, setContent] = useState(bootstrap);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!bootstrap);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setContent(data);
        const desc = document.querySelector('meta[name="description"]');
        if (desc && data.meta?.description) desc.setAttribute('content', data.meta.description);
      })
      .catch((err) => {
        if (!bootstrap) setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [bootstrap]);

  return { content, error, loading };
}
