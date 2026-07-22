import { Link } from 'react-router-dom';

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
              <Link className="btn-conversion btn-conversion--inspection" to={data.primaryHref || '/contact#inspection-form'}>
                {data.primaryLabel || 'Book inspection'}
              </Link>
            )}
            {data.secondaryHref && (
              <Link className="btn btn--ghost" to={data.secondaryHref}>
                {data.secondaryLabel}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
