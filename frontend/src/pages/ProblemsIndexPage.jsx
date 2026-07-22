import { Link, useOutletContext } from 'react-router-dom';
import SectionHead from '../components/SectionHead';
import usePageTitle from '../hooks/usePageTitle';

export default function ProblemsIndexPage() {
  const { content } = useOutletContext();
  const problems = content.problems || [];
  const categories = content.problemCategories || [];

  usePageTitle('Building Problems');

  const grouped = categories.length
    ? categories.map((cat) => ({
        ...cat,
        items: problems.filter((p) => p.category === cat.slug),
      }))
    : [{ slug: 'all', title: 'All problems', items: problems }];

  return (
    <section className="hub-page problems-index">
      <div className="wrap">
        <SectionHead
          eyebrow="Problems"
          headline="What's wrong with your building?"
          sub="Start with your symptom — we explain causes, mistakes, and what diagnosis involves."
        />
        {grouped.map((group) =>
          group.items.length ? (
            <div key={group.slug} className="hub-group">
              <h2>{group.title}</h2>
              <div className="hub-grid">
                {group.items.map((problem) => (
                  <Link key={problem.slug} className="hub-card" to={`/problems/${problem.slug}`}>
                    <h3>{problem.title}</h3>
                    <p>{problem.headline}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null,
        )}
      </div>
    </section>
  );
}
