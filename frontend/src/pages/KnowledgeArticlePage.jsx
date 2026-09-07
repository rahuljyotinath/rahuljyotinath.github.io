import { useOutletContext, useParams } from 'react-router-dom';
import LocalizedLink from '../components/LocalizedLink';
import SectionHead from '../components/SectionHead';
import RelatedLinks from '../components/RelatedLinks';
import InspectionCTA from '../components/InspectionCTA';
import usePageTitle from '../hooks/usePageTitle';
import { buildKnowledgePageTitle } from '../lib/pageTitle';

const SERVICE_LINK_LABELS = {
  waterproofing: 'Waterproofing in Guwahati',
  retrofitting: 'Building retrofitting in Guwahati',
  ndt: 'NDT building strength test',
  'epoxy-injection': 'Epoxy injection for structural cracks',
  'carbon-fibre': 'Carbon fibre strengthening',
  'seismic-jacketing': 'Seismic jacketing in Guwahati',
  'pu-injection': 'PU injection grouting',
  'expansion-joints': 'Expansion joint treatment',
};

export default function KnowledgeArticlePage() {
  const { slug } = useParams();
  const { content } = useOutletContext();
  const article = content.knowledgeArticles?.find((a) => a.slug === slug);
  const inspection = content.homeSections?.inspectionCta;
  const related = (content.knowledgeArticles || [])
    .filter((a) => a.slug !== slug && a.cluster === article?.cluster)
    .slice(0, 3);

  usePageTitle(buildKnowledgePageTitle(article), '');

  if (!article) {
    return (
      <section className="hub-page">
        <div className="wrap">
          <p>Article not found.</p>
          <LocalizedLink to="/knowledge">← Knowledge Centre</LocalizedLink>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hub-page knowledge-article">
        <div className="wrap">
          <nav className="service-breadcrumb">
            <LocalizedLink to="/knowledge">Knowledge</LocalizedLink>
            <span aria-hidden="true"> / </span>
            <span>{article.title}</span>
          </nav>
          <SectionHead eyebrow={article.cluster} headline={article.title} sub={article.excerpt} />
          <article className="article-body">
            {article.body.split('\n\n').map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </article>
          {article.linkedServices?.length > 0 && (
            <aside className="related-links">
              <h2>Related services</h2>
              <ul>
                {article.linkedServices.map((serviceSlug) => {
                  const service = content.services?.find((s) => s.slug === serviceSlug);
                  if (!service) return null;
                  const label = SERVICE_LINK_LABELS[serviceSlug] || service.title;
                  return (
                    <li key={serviceSlug}>
                      <LocalizedLink to={`/services/${serviceSlug}`}>{label}</LocalizedLink>
                    </li>
                  );
                })}
              </ul>
            </aside>
          )}
          {article.linkedProblems?.length > 0 && (
            <RelatedLinks
              content={content}
              problems={article.linkedProblems}
              title="Related building problems"
            />
          )}
          {related.length > 0 && (
            <aside className="related-links">
              <h2>Related articles</h2>
              <ul>
                {related.map((r) => (
                  <li key={r.slug}>
                    <LocalizedLink to={`/knowledge/${r.slug}`}>{r.title}</LocalizedLink>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </section>
      <InspectionCTA data={inspection} />
    </>
  );
}
