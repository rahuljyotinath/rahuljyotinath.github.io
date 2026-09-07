export default function PartnerBadges({ credentials }) {
  if (!credentials?.badges?.length) return null;

  return (
    <section className="partner-badges" aria-label={credentials.headline}>
      <div className="wrap">
        <h2>{credentials.headline}</h2>
        {credentials.intro && <p className="partner-badges-intro">{credentials.intro}</p>}
        <ul className="partner-badges-list">
          {credentials.badges.map((badge) => (
            <li key={badge.name} className={`partner-badge partner-badge--${badge.status}`}>
              <strong>{badge.name}</strong>
              <span>{badge.label}</span>
            </li>
          ))}
        </ul>
        {credentials.applicationNote && (
          <p className="partner-badges-note">{credentials.applicationNote}</p>
        )}
      </div>
    </section>
  );
}
