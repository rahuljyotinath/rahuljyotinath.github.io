import { Link, useOutletContext, useParams } from 'react-router-dom';
import SectionHead from '../components/SectionHead';
import usePageTitle from '../hooks/usePageTitle';
import { buildServicePageTitle } from '../lib/pageTitle';

export default function ServicePage() {
  const { slug } = useParams();
  const { content } = useOutletContext();
  const page = content.servicePages?.find((p) => p.slug === slug);

  usePageTitle(buildServicePageTitle(page), '');

  if (!page) {
    return (
      <section className="service-page">
        <div className="wrap">
          <p>Service not found.</p>
          <Link to="/services">← All services</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="service-page">
      <div className="wrap">
        <nav className="service-breadcrumb">
          <Link to="/services">Services</Link>
          <span aria-hidden="true"> / </span>
          <span>{page.title}</span>
        </nav>
        <SectionHead eyebrow={page.title} headline={page.seoHeadline || page.headline} />
        <p className="service-intro">{page.intro}</p>

        {page.awareness && (
          <aside className="service-awareness">
            <h3>{page.awareness.headline}</h3>
            <p>{page.awareness.body}</p>
          </aside>
        )}

        {page.offerings?.length > 0 && (
          <div className="service-offerings">
            <h2 className="service-offerings-title">What we do — and when you need it</h2>
            {page.offerings.map((item) => (
              <article key={item.name} className="service-offering">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                {item.whenUsed && (
                  <p className="service-offering-when">
                    <strong>When we use this:</strong> {item.whenUsed}
                  </p>
                )}
                {item.whyItMatters && (
                  <p className="service-offering-risk">
                    <strong>If you ignore it:</strong> {item.whyItMatters}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="service-sections">
          {page.sections?.map((sec) => (
            <article key={sec.title} className="service-block">
              <h3>{sec.title}</h3>
              {sec.body && <p>{sec.body}</p>}
              {sec.bullets?.length > 0 && (
                <ul>
                  {sec.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        <div className="service-cta">
          {page.ctaMessage && <p className="service-cta-message">{page.ctaMessage}</p>}
          <div className="service-cta-actions">
            <Link className="btn btn--primary" to="/contact">
              Call us today <span className="arrow">→</span>
            </Link>
            <Link className="btn btn--ghost" to="/assessment">
              Free self-assessment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
