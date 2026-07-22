import { Link } from 'react-router-dom';

function CtaLink({ cta, className, fallback }) {
  const href = cta?.href || fallback;
  const inner = (
    <>
      {cta?.label} <span className="arrow">→</span>
    </>
  );
  if (href.startsWith('/')) {
    return <Link className={className} to={href}>{inner}</Link>;
  }
  return <a className={className} href={href}>{inner}</a>;
}

function heroSrc(image) {
  if (!image) return null;
  return image.startsWith('/') ? image : `/${image}`;
}

function heroWebpSrc(image) {
  const src = heroSrc(image);
  if (!src) return null;
  return src.replace(/\.(jpe?g|png)$/i, '.webp');
}

export default function HeroLanding({ hero, company }) {
  if (!hero) return null;

  const fallbackSrc = heroSrc(hero.image);
  const webpSrc = heroWebpSrc(hero.image);

  return (
    <section className="hero-landing" id="top">
      <div className="hero-media">
        {fallbackSrc ? (
          <picture>
            {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
            <img
              src={fallbackSrc}
              alt=""
              fetchPriority="high"
              loading="eager"
              decoding="async"
              width={1600}
              height={900}
            />
          </picture>
        ) : null}
      </div>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>{hero.headline}</h1>
          <p className="hero-sub">{hero.subheadline}</p>
          <div className="hero-actions">
            <CtaLink
              cta={hero.primaryCta}
              className="btn-conversion btn-conversion--inspection"
              fallback="/contact#inspection-form"
            />
            <CtaLink cta={hero.secondaryCta} className="btn btn--ghost" fallback="/problems" />
          </div>
        </div>
        <aside className="hero-side">
          <div className="lic">
            {company?.fullName}
            {company?.license && <> · {company.license}</>}
          </div>
        </aside>
      </div>
      <div className="scroll-cue">Scroll</div>
    </section>
  );
}
