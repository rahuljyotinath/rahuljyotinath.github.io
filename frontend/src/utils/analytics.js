export function trackEvent(name, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
}

export function trackLead(formName, extra = {}) {
  trackEvent('generate_lead', { form_name: formName, ...extra });
}

export function telHref(phone) {
  return `tel:${String(phone || '').replace(/[^0-9+]/g, '')}`;
}

export function whatsappHref(number, message) {
  const digits = String(number || '').replace(/\D/g, '');
  const text = encodeURIComponent(message || "Hi, I have a building issue I'd like inspected");
  return `https://wa.me/${digits}?text=${text}`;
}
