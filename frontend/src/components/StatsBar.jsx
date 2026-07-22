export default function StatsBar({ stats }) {
  if (!stats?.length) return null;

  return (
    <section className="stats-band">
      <div className="wrap" style={{ padding: 0 }}>
        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <div className="num">
                {s.value}
                {s.suffix && <span className="suffix">{s.suffix}</span>}
              </div>
              <div className="lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
