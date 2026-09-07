import LocalizedLink from './LocalizedLink';
import SectionHead from './SectionHead';

export default function PagePreview({ heading, to, linkLabel = 'Explore full section', children, id, className = '' }) {
  return (
    <section id={id} className={className}>
      <div className="wrap">
        {heading && <SectionHead eyebrow={heading.eyebrow} headline={heading.headline} />}
        {children}
        {to && (
          <div className="page-preview-link">
            <LocalizedLink to={to} className="btn btn--ghost">
              {linkLabel} <span className="arrow">→</span>
            </LocalizedLink>
          </div>
        )}
      </div>
    </section>
  );
}
