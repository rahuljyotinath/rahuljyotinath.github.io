const ICONS = {
  'water-leakage': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0z" />
    </svg>
  ),
  cracks: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M12 3v18M3 12h18" />
    </svg>
  ),
  dampness: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M8 16c0-2 2-4 4-6 2 2 4 4 4 6a4 4 0 01-8 0z" />
      <path d="M6 20h12" />
    </svg>
  ),
  foundation: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 20h18" />
      <path d="M5 20V10l7-4 7 4v10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  ),
  roof: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
    </svg>
  ),
};

export default function ProblemCategoryIcon({ slug }) {
  return (
    <span className="problem-category-icon">
      {ICONS[slug] || null}
    </span>
  );
}
