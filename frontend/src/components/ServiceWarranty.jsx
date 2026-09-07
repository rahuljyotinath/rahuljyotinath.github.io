export default function ServiceWarranty({ warranty }) {
  if (!warranty) return null;

  return (
    <aside className="service-warranty">
      <h2>Warranty — {warranty.term}</h2>
      {warranty.covers?.length > 0 && (
        <>
          <h3>Covers</h3>
          <ul>
            {warranty.covers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}
      {warranty.voids?.length > 0 && (
        <>
          <h3>Does not cover</h3>
          <ul>
            {warranty.voids.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}
