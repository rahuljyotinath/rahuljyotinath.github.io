import { Link, useOutletContext } from 'react-router-dom';
import SectionHead from '../components/SectionHead';
import usePageTitle from '../hooks/usePageTitle';

export default function ServicesIndexPage() {
  const { content } = useOutletContext();
  const services = content.services || [];

  usePageTitle('Services');

  return (
    <section className="services-index">
      <div className="wrap">
        <SectionHead
          eyebrow="Our services"
          headline="From diagnosis to fortification."
        />
        <p className="services-index-lead">
          Building rehabilitation services for homes and properties across Guwahati and Northeast India.
        </p>
        <div className="services-bordered">
          {services.map((s) => (
            <Link key={s.code} to={`/services/${s.slug}`} className="service-cell service-cell--link">
              <span className="code">{s.code}</span>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <span className="service-link-label">Learn more →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
