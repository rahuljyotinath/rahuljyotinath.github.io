import { Link } from 'react-router-dom';
import SectionHead from './SectionHead';

export default function DoctorPositioning({ data, showCta = true }) {
  if (!data) return null;

  return (
    <section className="doctor-positioning">
      <div className="wrap">
        <SectionHead headline={data.headline} sub={data.subhead} />
        <div className="doctor-points">
          {data.points?.map((point) => (
            <article key={point.title} className="doctor-point">
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </article>
          ))}
        </div>
        {showCta && data.ctaHref && (
          <Link className="btn btn--primary" to={data.ctaHref}>
            {data.ctaLabel || 'Book inspection'}
          </Link>
        )}
      </div>
    </section>
  );
}
