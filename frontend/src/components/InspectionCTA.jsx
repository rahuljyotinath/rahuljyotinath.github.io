import LocalizedLink from './LocalizedLink';

export default function InspectionCTA({ data, showPrimary = true }) {
  if (!data) return null;

  return (
    <section className="inspection-cta">
      <div className="wrap inspection-cta-inner">
        <div className="inspection-cta-copy">
          <h2>{data.headline}</h2>
          <p>{data.body}</p>
        </div>
        {(showPrimary || data.secondaryHref) && (
          <div className="inspection-cta-actions">
            {showPrimary && (
              <LocalizedLink className="btn-conversion btn-conversion--inspection" to={data.primaryHref || '/contact#inspection-form'}>
                {data.primaryLabel || 'Book inspection'}
              </LocalizedLink>
            )}
            {data.secondaryHref && (
              <LocalizedLink className="btn btn--ghost" to={data.secondaryHref}>
                {data.secondaryLabel}
              </LocalizedLink>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
