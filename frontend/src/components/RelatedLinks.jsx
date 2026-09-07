import LocalizedLink from './LocalizedLink';

export default function RelatedLinks({ services, problems, projects, content, title = 'Related' }) {
  const serviceList = (services || [])
    .map((slug) => content.services?.find((s) => s.slug === slug))
    .filter(Boolean);
  const problemList = (problems || [])
    .map((slug) => content.problems?.find((p) => p.slug === slug))
    .filter(Boolean);
  const project = projects
    ? content.projects?.find((p) => p.slug === projects || p.title?.toLowerCase().includes(String(projects).replace(/-/g, ' ')))
    : null;

  if (!serviceList.length && !problemList.length && !project) return null;

  return (
    <aside className="related-links">
      <h2>{title}</h2>
      {serviceList.length > 0 && (
        <div className="related-group">
          <h3>Services</h3>
          <ul>
            {serviceList.map((s) => (
              <li key={s.slug}>
                <LocalizedLink to={`/services/${s.slug}`}>{s.title}</LocalizedLink>
              </li>
            ))}
          </ul>
        </div>
      )}
      {problemList.length > 0 && (
        <div className="related-group">
          <h3>Problems</h3>
          <ul>
            {problemList.map((p) => (
              <li key={p.slug}>
                <LocalizedLink to={`/problems/${p.slug}`}>{p.title}</LocalizedLink>
              </li>
            ))}
          </ul>
        </div>
      )}
      {project && (
        <div className="related-group">
          <h3>Case study</h3>
          <p>
            <LocalizedLink to={`/portfolio/${project.slug}`}>{project.title}</LocalizedLink> — {project.scope}
          </p>
        </div>
      )}
    </aside>
  );
}
