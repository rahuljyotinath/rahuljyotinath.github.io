import { useOutletContext, useParams } from 'react-router-dom';
import LocalizedLink from '../components/LocalizedLink';
import InspectionCTA from '../components/InspectionCTA';
import useBackgroundImage from '../hooks/useBackgroundImage';
import usePageTitle from '../hooks/usePageTitle';

function ProjectHero({ image, title }) {
  const ref = useBackgroundImage(image);
  return (
    <div className="project-detail-hero">
      <div className="project-detail-hero-bg" ref={ref} />
      <div className="project-detail-hero-veil" />
      <h1>{title}</h1>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { content } = useOutletContext();
  const project = content.projects?.find((p) => p.slug === slug);
  const inspection = content.homeSections?.inspectionCta;

  usePageTitle(project?.title || 'Project');

  if (!project) {
    return (
      <section className="hub-page">
        <div className="wrap">
          <p>Project not found.</p>
          <LocalizedLink to="/portfolio">← All projects</LocalizedLink>
        </div>
      </section>
    );
  }

  const serviceLinks = (project.services || [])
    .map((s) => content.servicePages?.find((p) => p.slug === s))
    .filter(Boolean);

  return (
    <>
      <section className="hub-page project-detail">
        <div className="wrap">
          <nav className="service-breadcrumb">
            <LocalizedLink to="/portfolio">Projects</LocalizedLink>
            <span aria-hidden="true"> / </span>
            <span>{project.title}</span>
          </nav>

          <ProjectHero image={project.image} title={project.title} />

          <div className="project-detail-meta">
            {[project.category, project.location, project.year].filter(Boolean).map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>

          {project.scope && <p className="service-intro">{project.scope}</p>}

          {(project.beforeSummary || project.afterSummary) && (
            <div className="project-before-after">
              {project.beforeSummary && (
                <article className="service-block">
                  <h3>Before</h3>
                  <p>{project.beforeSummary}</p>
                </article>
              )}
              {project.afterSummary && (
                <article className="service-block">
                  <h3>After</h3>
                  <p>{project.afterSummary}</p>
                </article>
              )}
            </div>
          )}

          {(project.challenge || project.solution) && (
            <div className="project-detail-summary">
              {project.challenge && (
                <article className="service-block">
                  <h3>Challenge</h3>
                  <p>{project.challenge}</p>
                </article>
              )}
              {project.solution && (
                <article className="service-block">
                  <h3>Solution</h3>
                  <p>{project.solution}</p>
                </article>
              )}
            </div>
          )}

          {project.body && (
            <article className="article-body">
              {project.body.split('\n\n').map((para) => (
                <p key={para.slice(0, 48)}>{para}</p>
              ))}
            </article>
          )}

          {project.outcome && (
            <aside className="service-awareness">
              <h3>Outcome</h3>
              <p>{project.outcome}</p>
            </aside>
          )}

          {project.gallery?.length > 0 && (
            <div className="project-detail-gallery">
              <h2>Site photos</h2>
              <div className="project-detail-gallery-grid">
                {project.gallery.map((src) => (
                  <figure key={src} className="project-detail-gallery-item">
                    <img src={`/${src.replace(/^\/+/, '')}`} alt="" loading="lazy" />
                  </figure>
                ))}
              </div>
            </div>
          )}

          {serviceLinks.length > 0 && (
            <aside className="related-links">
              <h2>Services used</h2>
              <ul>
                {serviceLinks.map((svc) => (
                  <li key={svc.slug}>
                    <LocalizedLink to={`/services/${svc.slug}`}>{svc.title}</LocalizedLink>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <p className="project-detail-back">
            <LocalizedLink to="/portfolio">← All projects</LocalizedLink>
          </p>
        </div>
      </section>
      <InspectionCTA data={inspection} />
    </>
  );
}
