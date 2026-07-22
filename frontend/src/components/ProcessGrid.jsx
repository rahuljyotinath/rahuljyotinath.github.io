import SectionHead from './SectionHead';

export default function ProcessGrid({ process, heading, limit, bare = false }) {
  if (!process?.length) return null;
  const items = limit ? process.slice(0, limit) : process;

  const grid = (
    <div className="process-grid">
      {items.map((s) => (
        <article key={s.step} className="pstep">
          <div className="n">{s.step}</div>
          <h3>{s.title}</h3>
          <p>{s.description}</p>
        </article>
      ))}
    </div>
  );

  if (bare) return grid;

  return (
    <section id="process">
      <div className="wrap">
        {heading && <SectionHead eyebrow={heading.eyebrow} headline={heading.headline} />}
        {grid}
      </div>
    </section>
  );
}
