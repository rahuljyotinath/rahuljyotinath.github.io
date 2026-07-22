import SectionReveal from './SectionReveal';
import useBackgroundImage from '../hooks/useBackgroundImage';
import SectionHead from './SectionHead';

export default function AboutSection({ about, company, heading, excerpt, bare = false }) {
  if (!about) return null;
  const phRef = useBackgroundImage(about.image);
  const paragraphs = excerpt ? (about.body || []).slice(0, 1) : (about.body || []);
  const points = excerpt ? (about.points || []).slice(0, 2) : (about.points || []);

  const inner = (
    <div className="about-grid">
      <SectionReveal className="about-copy">
        {heading ? (
          <SectionHead eyebrow={heading.eyebrow} headline={heading.headline} />
        ) : (
          <>
            <span className="eyebrow">{about.eyebrow}</span>
            <h2>{about.headline}</h2>
          </>
        )}
        {paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
        <ul className="about-points">
          {points.map((pt) => (
            <li key={pt}>{pt}</li>
          ))}
        </ul>
      </SectionReveal>
      <SectionReveal>
        <div className="about-media">
          <div className="ph" ref={phRef} />
          {company?.fullName && <span className="tag">{company.fullName}</span>}
        </div>
      </SectionReveal>
    </div>
  );

  if (bare) return inner;

  return (
    <section id="about">
      <div className="wrap">{inner}</div>
    </section>
  );
}
