import LocalizedLink from './LocalizedLink';
import SectionHead from './SectionHead';

function projectImageSrc(image) {
  if (!image) return null;
  const base = image.startsWith('/') ? image : `/${image}`;
  if (/\.webp$/i.test(base)) return base;
  return base.replace(/\.(jpe?g|png)$/i, '.webp');
}

function ProjectCard({ project }) {
  const src = projectImageSrc(project.image);

  return (
    <LocalizedLink to={`/portfolio/${project.slug}`} className={`project-card ${project.featured ? 'featured' : ''}`}>
      {src ? (
        <picture className="ph">
          <img src={src} alt={project.title} loading="lazy" decoding="async" width={640} height={440} />
        </picture>
      ) : (
        <div className="ph" data-fallback="1" aria-hidden="true" />
      )}
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
    </LocalizedLink>
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
