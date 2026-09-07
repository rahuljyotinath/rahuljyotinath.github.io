import LocalizedLink from './LocalizedLink';

export default function DiagnosisPackSection({ pack, sla, compact = false }) {
  if (!pack) return null;

  return (
    <aside className={`diagnosis-pack ${compact ? 'diagnosis-pack--compact' : ''}`}>
      <h2>{pack.name}</h2>
      {pack.tagline && <p className="diagnosis-pack-tagline">{pack.tagline}</p>}
      {sla && !compact && (
        <ul className="diagnosis-pack-sla">
          <li>{sla.callback}</li>
          <li>{sla.visit}</li>
        </ul>
      )}
      <ul className="diagnosis-pack-includes">
        {pack.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <LocalizedLink className="btn btn--primary" to={pack.ctaHref || '/contact#inspection-form'}>
        {pack.ctaLabel || 'Book free inspection'} →
      </LocalizedLink>
    </aside>
  );
}
