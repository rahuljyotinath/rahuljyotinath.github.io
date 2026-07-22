import SectionReveal from './SectionReveal';

export default function HomeBuyerAdvisory({ advisory }) {
  if (!advisory) return null;

  return (
    <section id="advisory">
      <div className="wrap">
        <SectionReveal className="section-head">
          <span className="eyebrow">Technical Advisory</span>
          <h2>{advisory.title}</h2>
        </SectionReveal>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {(advisory.points || []).map((pt) => (
            <SectionReveal key={pt.title}>
              <div className="panel" style={{ padding: '1.75rem' }}>
                <h3 className="mono" style={{ fontSize: '.85rem', color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.75rem' }}>
                  {pt.title}
                </h3>
                <p style={{ color: 'var(--concrete)' }}>{pt.body}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
