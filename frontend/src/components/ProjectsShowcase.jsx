import { Link } from 'react-router-dom';
import useBackgroundImage from '../hooks/useBackgroundImage';
import SectionHead from './SectionHead';

function ProjectCard({ project }) {
  const phRef = useBackgroundImage(project.image);

  return (
    <Link to={`/portfolio/${project.slug}`} className={`project-card ${project.featured ? 'featured' : ''}`}>
      <div className="ph" ref={phRef} />
      <div className="veil" />
      <div className="info">
        <div className="meta">
          {[project.category, project.location, project.year].filter(Boolean).map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        <h3>{project.title}</h3>
        {project.scope && <div className="scope">{project.scope}</div>}
      </div>
    </Link>
  );
}

export default function ProjectsShowcase({ projects, heading, limit, id = 'work', className = 'section-work', bare = false }) {
  if (!projects?.length) return null;
  const items = limit ? projects.slice(0, limit) : projects;

  const grid = (
    <div className="projects-showcase">
      {items.map((p) => (
        <ProjectCard key={p.slug || p.title} project={p} />
      ))}
    </div>
  );

  if (bare) return grid;

  return (
    <section id={id} className={className}>
      <div className="wrap">
        {heading && <SectionHead eyebrow={heading.eyebrow} headline={heading.headline} />}
        {grid}
      </div>
    </section>
  );
}
