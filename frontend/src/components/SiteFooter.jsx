import LocalizedLink from './LocalizedLink';

export default function SiteFooter({ content }) {
  if (!content) return null;

  const { company, contact, social, services, footer } = content;
  const phone = contact.phone;

  return (
    <footer className="site-footer">
      <div className="wrap site-footer-grid">
        <div className="site-footer-brand">
          {company?.logo ? (
            <picture>
              <source srcSet={company.logo.replace(/\.png$/i, '.webp')} type="image/webp" />
              <img src={company.logo} alt={company.name} className="site-footer-logo" width={140} height={48} />
            </picture>
          ) : (
            <strong>{company?.name}</strong>
          )}
          <p>{footer?.tagline || company?.tagline}</p>
        </div>
        <div>
          <p className="site-footer-label">Guwahati services</p>
          <ul>
            <li>
              <LocalizedLink to="/guwahati/waterproofing">Waterproofing in Guwahati</LocalizedLink>
            </li>
            <li>
              <LocalizedLink to="/guwahati/building-crack-repair">Building crack repair</LocalizedLink>
            </li>
            <li>
              <LocalizedLink to="/services/retrofitting">Retrofitting in Guwahati</LocalizedLink>
            </li>
          </ul>
        </div>
        <div>
          <p className="site-footer-label">Services</p>
          <ul>
            {(services || []).slice(0, 6).map((s) => (
              <li key={s.slug}>
                <LocalizedLink to={`/services/${s.slug}`}>{s.title}</LocalizedLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="site-footer-label">Contact</p>
          <ul className="site-footer-contact">
            {phone && (
              <li>
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} data-track="click_phone">{phone}</a>
              </li>
            )}
            {contact?.email && (
              <li>
                <a href={`mailto:${contact.email}`} data-track="click_email">{contact.email}</a>
              </li>
            )}
            {contact?.address && <li>{contact.address}</li>}
          </ul>
        </div>
        <div>
          <p className="site-footer-label">Follow us</p>
          <div className="site-footer-social">
            {social?.facebook && (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            )}
            {social?.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            )}
            {social?.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            )}
          </div>
        </div>
      </div>
      <div className="wrap site-footer-legal">
        <span>{footer?.legal}</span>
      </div>
    </footer>
  );
}
