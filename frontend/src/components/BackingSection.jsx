import SectionHead from './SectionHead';

export default function BackingSection({ backing, heading, limit, bare = false }) {
  if (!backing?.length) return null;
  const items = limit ? backing.slice(0, limit) : backing;

  const grid = (
    <div className="backing-grid">
      {items.map((b) => (
        <article key={b.title} className="backing-card">
          <h3>{b.title}</h3>
          <p>{b.body}</p>
        </article>
      ))}
    </div>
  );

  if (bare) return grid;

  return (
    <section id="backing">
      <div className="wrap">
        {heading && <SectionHead eyebrow={heading.eyebrow} headline={heading.headline} />}
        {grid}
      </div>
    </section>
  );
}
