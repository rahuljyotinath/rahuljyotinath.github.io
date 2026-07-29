import { Link } from 'react-router-dom';
import SectionHead from './SectionHead';
import ProblemCategoryIcon from './ProblemCategoryIcon';

export default function ProblemGrid({ grid, categories, problems, limit = 6 }) {
  if (!grid || !problems?.length) return null;

  const items = problems.slice(0, limit);

  return (
    <section className="problem-grid-section">
      <div className="wrap">
        <SectionHead headline={grid.headline} sub={grid.subhead} />
        {categories?.length > 0 && (
          <div className="problem-categories">
            {categories.map((cat) => (
              <Link key={cat.slug} to={`/problems#${cat.slug}`} className="problem-category-chip">
                <ProblemCategoryIcon slug={cat.slug} />
                {cat.title}
              </Link>
            ))}
          </div>
        )}
        <div className="problem-grid">
          {items.map((problem) => (
            <Link key={problem.slug} className="problem-card" to={`/problems/${problem.slug}`}>
              <h3>{problem.title}</h3>
              <p>{problem.intro?.slice(0, 120)}…</p>
              <span className="problem-card-link">Learn more →</span>
            </Link>
          ))}
        </div>
        {grid.ctaLabel && (
          <p className="problem-grid-more">
            <Link to="/problems">{grid.ctaLabel} →</Link>
          </p>
        )}
      </div>
    </section>
  );
}
