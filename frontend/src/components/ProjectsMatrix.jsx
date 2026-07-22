import SectionReveal from './SectionReveal';
import './ProjectsMatrix.css';

export default function ProjectsMatrix({ projects }) {
  if (!projects?.length) return null;

  return (
    <section id="portfolio">
      <div className="wrap">
        <SectionReveal className="section-head">
          <span className="eyebrow">Institutional Deployments</span>
          <h2>Regional engineering case matrices.</h2>
        </SectionReveal>
        <div className="projects-grid">
          {projects.map((p) => (
            <article
              key={p.title}
              className={`project-card panel ${p.featured ? 'featured' : ''}`}
            >
              <div className="project-meta mono">
                {[p.category, p.location, p.year].filter(Boolean).join(' · ')}
              </div>
              <h3>{p.title}</h3>
              <p>{p.scope}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
