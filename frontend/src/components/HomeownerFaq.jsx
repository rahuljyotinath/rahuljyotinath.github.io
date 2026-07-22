import { Link } from 'react-router-dom';
import SectionHead from './SectionHead';

export default function HomeownerFaq({ data }) {
  if (!data?.items?.length) return null;

  return (
    <section className="homeowner-faq">
      <div className="wrap">
        <SectionHead eyebrow={data.eyebrow} headline={data.headline} />
        <dl className="faq-list">
          {data.items.map((item) => (
            <details key={item.q} className="faq-item panel">
              <summary>{item.q}</summary>
              <dd>
                <p>{item.a}</p>
                {item.link && (
                  <p className="faq-link">
                    <Link to={item.link.href}>{item.link.label}</Link>
                  </p>
                )}
              </dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
