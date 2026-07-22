import { Link } from 'react-router-dom';
import SectionReveal from './SectionReveal';
import SectionHead from './SectionHead';

export default function ContactTeaser({ contact, heading, teaser }) {
  if (!contact) return null;

  const body = heading?.body || contact.body;
  const ctaHref = teaser?.ctaHref || '/contact#inspection-form';
  const ctaLabel = teaser?.ctaLabel || 'Book inspection';

  return (
    <section id="contact">
      <div className="wrap">
        <SectionReveal>
          {heading ? (
            <SectionHead eyebrow={heading.eyebrow} headline={heading.headline} />
          ) : (
            <>
              <span className="eyebrow">{contact.eyebrow}</span>
              <h2 className="section-head" style={{ marginTop: '1rem' }}>{contact.headline}</h2>
            </>
          )}
          <div className="contact-teaser">
            <p>{body}</p>
            <Link to={ctaHref} className="btn-conversion btn-conversion--inspection">
              {ctaLabel} <span className="arrow">→</span>
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
