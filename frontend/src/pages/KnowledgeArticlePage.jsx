import { Link, useOutletContext, useParams } from 'react-router-dom';
import SectionHead from '../components/SectionHead';
import InspectionCTA from '../components/InspectionCTA';
import usePageTitle from '../hooks/usePageTitle';
import { buildKnowledgePageTitle } from '../lib/pageTitle';

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
          <Link to="/knowledge">← Knowledge Centre</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hub-page knowledge-article">
        <div className="wrap">
          <nav className="service-breadcrumb">
            <Link to="/knowledge">Knowledge</Link>
            <span aria-hidden="true"> / </span>
            <span>{article.title}</span>
          </nav>
          <SectionHead eyebrow={article.cluster} headline={article.title} sub={article.excerpt} />
          <article className="article-body">
            {article.body.split('\n\n').map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </article>
          {related.length > 0 && (
            <aside className="related-links">
              <h2>Related articles</h2>
              <ul>
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link to={`/knowledge/${r.slug}`}>{r.title}</Link>
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
