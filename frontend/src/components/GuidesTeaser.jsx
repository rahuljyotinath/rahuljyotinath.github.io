import { Link } from 'react-router-dom';
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
              <Link to={`/knowledge/${a.slug}`}>{a.title}</Link>
              <p>{a.excerpt}</p>
            </li>
          ))}
        </ul>
        <Link to="/knowledge" className="btn btn--ghost">
          All guides <span className="arrow">→</span>
        </Link>
      </div>
    </section>
  );
}
