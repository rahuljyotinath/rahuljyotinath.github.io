import { Link, useOutletContext } from 'react-router-dom';
import SectionHead from '../components/SectionHead';
import usePageTitle from '../hooks/usePageTitle';

export default function KnowledgeIndexPage() {
  const { content } = useOutletContext();
  const articles = content.knowledgeArticles || [];

  usePageTitle('Knowledge Centre');

  const clusters = [...new Set(articles.map((a) => a.cluster))];

  return (
    <section className="hub-page knowledge-index">
      <div className="wrap">
        <SectionHead
          eyebrow="Knowledge Centre"
          headline="Building engineering guides for Guwahati"
          sub="Learn about leaks, cracks, injection, retrofitting, and maintenance — written for homeowners and facility managers."
        />
        {clusters.map((cluster) => (
          <div key={cluster} className="hub-group">
            <h2>{cluster.charAt(0).toUpperCase() + cluster.slice(1).replace(/-/g, ' ')}</h2>
            <div className="hub-grid hub-grid--articles">
              {articles
                .filter((a) => a.cluster === cluster)
                .map((article) => (
                  <Link key={article.slug} className="hub-card" to={`/knowledge/${article.slug}`}>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
