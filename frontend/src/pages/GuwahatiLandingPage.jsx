import { useOutletContext, useParams } from 'react-router-dom';
import LocalizedLink from '../components/LocalizedLink';
import SectionHead from '../components/SectionHead';
import RelatedLinks from '../components/RelatedLinks';
import InspectionCTA from '../components/InspectionCTA';
import usePageTitle from '../hooks/usePageTitle';
import { buildLocalLandingPageTitle } from '../lib/pageTitle';

export default function GuwahatiLandingPage() {
  const { slug } = useParams();
  const { content } = useOutletContext();
  const landing = content.localLandings?.find((l) => l.slug === slug);
  const inspection = content.homeSections?.inspectionCta;

  usePageTitle(buildLocalLandingPageTitle(landing), '');

  if (!landing) {
    return (
      <section className="hub-page">
        <div className="wrap">
          <p>Page not found.</p>
          <LocalizedLink to="/">← Home</LocalizedLink>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hub-page local-landing">
        <div className="wrap">
          <nav className="service-breadcrumb">
            <LocalizedLink to="/">Home</LocalizedLink>
            <span aria-hidden="true"> / </span>
            <span>Guwahati</span>
            <span aria-hidden="true"> / </span>
            <span>{landing.headline}</span>
          </nav>
          <SectionHead eyebrow="Guwahati · Assam" headline={landing.headline} sub={landing.intro} />

          {landing.sections?.map((sec) => (
            <article key={sec.title} className="service-block">
              <h2>{sec.title}</h2>
              <p>{sec.body}</p>
            </article>
          ))}

          {landing.faqs?.length > 0 && (
            <article className="service-block">
              <h2>Frequently asked questions</h2>
              {landing.faqs.map((faq) => (
                <div key={faq.q} className="faq-item">
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
                </div>
              ))}
            </article>
          )}

          <RelatedLinks
            content={content}
            services={landing.linkedServices}
            problems={landing.linkedProblems}
            title="Related services & problems"
          />

          {landing.ctaMessage && (
            <p className="service-cta-message">
              <LocalizedLink to="/contact#inspection-form">{landing.ctaMessage} →</LocalizedLink>
            </p>
          )}
        </div>
      </section>
      <InspectionCTA data={inspection} />
    </>
  );
}
