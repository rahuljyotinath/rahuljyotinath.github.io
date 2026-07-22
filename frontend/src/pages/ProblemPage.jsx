import { Link, useOutletContext, useParams } from 'react-router-dom';
import SectionHead from '../components/SectionHead';
import RelatedLinks from '../components/RelatedLinks';
import InspectionCTA from '../components/InspectionCTA';
import usePageTitle from '../hooks/usePageTitle';

export default function ProblemPage() {
  const { slug } = useParams();
  const { content } = useOutletContext();
  const problem = content.problems?.find((p) => p.slug === slug);
  const inspection = content.homeSections?.inspectionCta;

  usePageTitle(problem?.title || 'Problem');

  if (!problem) {
    return (
      <section className="hub-page">
        <div className="wrap">
          <p>Problem not found.</p>
          <Link to="/problems">← All problems</Link>
        </div>
      </section>
    );
  }

  const project = content.projects?.find((p) => p.slug === problem.linkedProject);

  return (
    <>
      <section className="hub-page problem-page">
        <div className="wrap">
          <nav className="service-breadcrumb">
            <Link to="/problems">Problems</Link>
            <span aria-hidden="true"> / </span>
            <span>{problem.title}</span>
          </nav>
          <SectionHead eyebrow="Building problem" headline={problem.headline} />
          <p className="service-intro">{problem.intro}</p>

          {problem.symptoms?.length > 0 && (
            <article className="service-block">
              <h3>Symptoms you may notice</h3>
              <ul>
                {problem.symptoms.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </article>
          )}

          {problem.causes?.length > 0 && (
            <article className="service-block">
              <h3>Common causes</h3>
              <ul>
                {problem.causes.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </article>
          )}

          {problem.mistakes?.length > 0 && (
            <aside className="service-awareness">
              <h3>Mistakes to avoid</h3>
              <ul>
                {problem.mistakes.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </aside>
          )}

          {problem.diagnosis && (
            <article className="service-block">
              <h3>How we diagnose this</h3>
              <p>{problem.diagnosis}</p>
            </article>
          )}

          {problem.faqs?.length > 0 && (
            <article className="service-block">
              <h3>FAQ</h3>
              {problem.faqs.map((faq) => (
                <div key={faq.q} className="faq-item">
                  <h4>{faq.q}</h4>
                  <p>{faq.a}</p>
                </div>
              ))}
            </article>
          )}

          <RelatedLinks
            content={content}
            services={problem.linkedServices}
            projects={problem.linkedProject}
            title="Recommended next steps"
          />

          {project && (
            <article className="service-block case-teaser">
              <h3>Related project</h3>
              <p>
                <strong>{project.title}</strong> — {project.scope}
                {project.outcome && <> · {project.outcome}</>}
              </p>
              <Link to="/portfolio">View projects →</Link>
            </article>
          )}
        </div>
      </section>
      <InspectionCTA data={inspection} />
    </>
  );
}
