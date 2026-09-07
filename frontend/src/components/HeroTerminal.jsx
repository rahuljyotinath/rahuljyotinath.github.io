import LocalizedLink from './LocalizedLink';
import SectionReveal from './SectionReveal';
import './HeroTerminal.css';

function CtaLink({ cta, className, fallback }) {
  const href = cta?.href || fallback;
  const label = cta?.label;
  const inner = (
    <>
      {label} <span className="arrow">→</span>
    </>
  );

  if (href.startsWith('/')) {
    return (
      <LocalizedLink className={className} to={href}>
        {inner}
      </LocalizedLink>
    );
  }

  return (
    <a className={className} href={href}>
      {inner}
    </a>
  );
}

export default function HeroTerminal({ hero, company }) {
  if (!hero) return null;

  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <SectionReveal>
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>{hero.headline}</h1>
          <p className="hero-sub">{hero.subheadline}</p>
          <div className="hero-actions">
            <CtaLink cta={hero.primaryCta} className="btn btn--primary" fallback="/analyzer" />
            <CtaLink cta={hero.secondaryCta} className="btn btn--ghost" fallback="/contact" />
          </div>
        </SectionReveal>
        <aside className="hero-side">
          <div className="lic mono">
            {company?.fullName}
            {company?.license && <> · {company.license}</>}
          </div>
        </aside>
      </div>
    </section>
  );
}
