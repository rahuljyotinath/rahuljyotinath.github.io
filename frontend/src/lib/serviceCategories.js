export function categoryServices(services, categorySlug) {
  return (services || [])
    .filter((s) => s.category === categorySlug)
    .sort((a, b) => {
      if (a.slug === categorySlug) return -1;
      if (b.slug === categorySlug) return 1;
      return Number(a.code) - Number(b.code);
    })
    .map((s, i) => ({
      ...s,
      displayCode: String(i + 1).padStart(2, '0'),
    }));
}
