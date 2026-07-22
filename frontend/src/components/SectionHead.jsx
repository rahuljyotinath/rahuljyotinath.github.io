import SectionReveal from './SectionReveal';

export default function SectionHead({ eyebrow, headline, sub, className = '' }) {
  return (
    <SectionReveal className={`section-head ${className}`.trim()}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {headline && <h2>{headline}</h2>}
      {sub && <p className="section-sub">{sub}</p>}
    </SectionReveal>
  );
}
