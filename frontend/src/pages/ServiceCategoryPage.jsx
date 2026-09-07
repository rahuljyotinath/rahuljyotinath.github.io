import { useOutletContext, useParams } from 'react-router-dom';
import LocalizedLink from '../components/LocalizedLink';
import SectionHead from '../components/SectionHead';
import usePageTitle from '../hooks/usePageTitle';
import { buildCategoryPageTitle } from '../lib/pageTitle';
import { categoryServices } from '../lib/serviceCategories';

export default function ServiceCategoryPage() {
  const { categorySlug } = useParams();
  const { content } = useOutletContext();
  const category = content.serviceCategories?.find((c) => c.slug === categorySlug);
  const services = categoryServices(content.services, categorySlug);

  usePageTitle(buildCategoryPageTitle(category), '');

  if (!category) {
    return (
      <section className="services-index">
        <div className="wrap">
          <p>Service category not found.</p>
          <LocalizedLink to="/services">← All services</LocalizedLink>
        </div>
      </section>
    );
  }

  return (
    <section className="services-index">
      <div className="wrap">
        <nav className="service-breadcrumb">
          <LocalizedLink to="/services">Services</LocalizedLink>
          <span aria-hidden="true"> / </span>
          <span>{category.label}</span>
        </nav>
        <SectionHead eyebrow={category.label} headline={category.headline} />
        {category.intro && <p className="services-index-lead">{category.intro}</p>}
        <div className="services-bordered">
          {services.map((s) => (
            <LocalizedLink key={s.slug} to={`/services/${s.slug}`} className="service-cell service-cell--link">
              <span className="code">{s.displayCode}</span>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <span className="service-link-label">Learn more →</span>
            </LocalizedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
