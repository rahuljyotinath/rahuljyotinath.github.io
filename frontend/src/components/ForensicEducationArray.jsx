import SectionReveal from './SectionReveal';
import './ForensicEducation.css';

export default function ForensicEducationArray({ education }) {
  if (!education?.sections?.length) return null;

  return (
    <section id="education">
      <div className="wrap">
        <SectionReveal className="section-head">
          <span className="eyebrow">Forensic Engineering</span>
          <h2>Educational diagnostic array.</h2>
        </SectionReveal>
        <div className="education-grid">
          {education.sections.map((sec) => (
            <article key={sec.title} className="education-card panel">
              <h3>{sec.title}</h3>
              {sec.body && <p>{sec.body}</p>}
              {sec.stages && (
                <ul className="stage-list">
                  {sec.stages.map((s) => (
                    <li key={s.label}>
                      <span className="stage-label mono">{s.label}</span>
                      <span>{s.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
