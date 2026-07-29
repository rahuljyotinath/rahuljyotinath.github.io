import { useEffect, useRef } from 'react';

export default function useBackgroundImage(url) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!url) {
      el.dataset.fallback = '1';
      el.style.backgroundImage = '';
      return;
    }

    const src = !url || url.startsWith('/') || /^https?:\/\//.test(url) ? url : `/${url}`;
    const img = new Image();
    img.onload = () => {
      el.style.backgroundImage = `url("${src}")`;
      el.removeAttribute('data-fallback');
    };
    img.onerror = () => {
      el.dataset.fallback = '1';
      el.style.backgroundImage = '';
    };
    img.src = src;
  }, [url]);

  return ref;
}
