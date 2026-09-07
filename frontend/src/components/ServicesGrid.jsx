import LocalizedLink from './LocalizedLink';
import SectionHead from './SectionHead';

function ServiceCell({ service: s }) {
  const inner = (
    <>
      <span className="code">{s.code}</span>
      <h3>{s.title}</h3>
      <p>{s.description}</p>
      {s.slug && <span className="service-link-label">Learn more →</span>}
    </>
  );

  if (s.slug) {
    return (
      <LocalizedLink to={`/services/${s.slug}`} className="service-cell service-cell--link">
        {inner}
      </LocalizedLink>
    );
  }

  return <article className="service-cell">{inner}</article>;
}

export default function ServicesGrid({ services, heading, limit, bare = false }) {
  if (!services?.length) return null;
  const items = limit ? services.slice(0, limit) : services;

  const grid = (
    <div className="services-bordered">
      {items.map((s) => (
        <ServiceCell key={s.code} service={s} />
      ))}
    </div>
  );

  if (bare) return grid;

  return (
    <section id="services">
      <div className="wrap">
        {heading && <SectionHead eyebrow={heading.eyebrow} headline={heading.headline} />}
        {grid}
      </div>
    </section>
  );
}
