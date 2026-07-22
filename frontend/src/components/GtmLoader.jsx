import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';

const GTM_ID = import.meta.env.VITE_GTM_ID;

function injectGtm(id) {
  if (document.getElementById('gtm-script') || document.querySelector('script[src*="googletagmanager.com/gtm.js"]')) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.id = 'gtm-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  document.head.prepend(script);

  if (!document.getElementById('gtm-noscript')) {
    const noscript = document.createElement('noscript');
    noscript.id = 'gtm-noscript';
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.prepend(noscript);
  }
}

export default function GtmLoader() {
  const location = useLocation();

  useEffect(() => {
    if (GTM_ID) injectGtm(GTM_ID);
  }, []);

  useEffect(() => {
    if (!GTM_ID) return;
    trackEvent('page_view', {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  return null;
}
