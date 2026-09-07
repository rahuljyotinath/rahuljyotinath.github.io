import LocalizedLink from './LocalizedLink';
import SectionHead from './SectionHead';

export default function GuidesTeaser({ articles, heading }) {
  const slugs = ['monsoon-roof-leak-guwahati', 'flat-crack-repair-cost-guwahati', 'terrace-waterproofing-cost-guwahati'];
  const items = slugs
    .map((slug) => (articles || []).find((a) => a.slug === slug))
    .filter(Boolean);

  if (!items.length) return null;

  return (
    <section className="guides-teaser">
      <div className="wrap">
        {heading && <SectionHead eyebrow={heading.eyebrow} headline={heading.headline} />}
        <ul className="guides-teaser-list">
          {items.map((a) => (
            <li key={a.slug}>
              <LocalizedLink to={`/knowledge/${a.slug}`}>{a.title}</LocalizedLink>
              <p>{a.excerpt}</p>
            </li>
          ))}
        </ul>
        <LocalizedLink to="/knowledge" className="btn btn--ghost">
          All guides <span className="arrow">→</span>
        </LocalizedLink>
      </div>
    </section>
  );
}
