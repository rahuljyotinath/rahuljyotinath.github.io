import SectionHead from './SectionHead';

export default function ClientsGrid({ clients, heading, limit, bare = false }) {
  if (!clients?.length) return null;
  const items = limit ? clients.slice(0, limit) : clients;

  const stars = (n) => (n ? '★'.repeat(n) + '☆'.repeat(5 - n) : null);

  const grid = (
    <div className="clients-grid">
      {items.map((c) => (
        <div key={c.name} className="client-cell">
          {c.name}
          {c.rating && <div className="client-rating" aria-label={`${c.rating} out of 5 stars`}>{stars(c.rating)}</div>}
          {c.location && <div className="client-location">{c.location}</div>}
        </div>
      ))}
    </div>
  );

  if (bare) return grid;

  return (
    <section id="clients">
      <div className="wrap">
        {heading && <SectionHead eyebrow={heading.eyebrow} headline={heading.headline} />}
        {grid}
      </div>
    </section>
  );
}
